<script>
  import { onMount, onDestroy } from 'svelte';
  import * as d3 from 'd3';
  import ProjectManager from '../data/ProjectManager.js';
  import GraphStats from './GraphStats.svelte';
  import GraphNode from './GraphNode.svelte';
  import PdfPopup from './PdfPopup.svelte';
  import { graphConfig as config } from '../config/graphConfig.js';

  const MIN_WIDTH = 600;
  const MIN_HEIGHT = 300;

  let container;
  let svg;
  let activePdf = null;
  let stats = {
    projects: 0,
    tags: 0,
    edges: 0,
    density: 0,
    avgDegree: 0,
    maxDegree: 0,
    maxDegreeNodeName: ''
  };

  let simulation;
  let nodes = [];
  let links = [];
  let nodeElements;
  let linkElements;
  let labelElements;
  let zoom;
  let tooltip;
  let animationFrameId = null;
  let lastTickTime = 0;
  const TICK_THROTTLE = 16; // Limit to ~60fps

  const projectManager = ProjectManager.getInstance();

  function initializeGraph() {
    const width = Math.max(container.clientWidth, MIN_WIDTH);
    const height = Math.max(container.clientHeight, MIN_HEIGHT);

    nodes = projectManager.getNodes();
    links = projectManager.getLinks();
    stats = projectManager.getStats();

    d3.select(svg).selectAll("*").remove();

    // Create SVG with proper scaling
    const svgElement = d3.select(svg)
      .attr("width", "100%")
      .attr("height", "100%")
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("preserveAspectRatio", "xMidYMid meet");

    svgElement.append("rect")
      .attr("width", width)
      .attr("height", height)
      .attr("fill", "white");

    // Create a group for all elements
    const g = svgElement.append("g");

    // Create zoom behavior with adjusted bounds
    zoom = d3.zoom()
      .scaleExtent([config.zoom.min, config.zoom.max])
      .extent([[0, 0], [width, height]])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
      });

    svgElement.call(zoom);

    tooltip = d3.select("body")
      .append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);

    // Function to handle tooltip display
    const handleShowTooltip = (event) => {
      const { description, x, y } = event.detail;
      tooltip.html(`<div class="tooltip-content">
        <div class="tooltip-description">${description}</div>
      </div>`)
      .style("left", `${x + 15}px`)
      .style("top", `${y + 10}px`)
      .style("opacity", 1);
    };

    // Function to handle tooltip hiding
    const handleHideTooltip = () => {
      tooltip.style("opacity", 0);
    };

    linkElements = g.append("g")
      .selectAll("line")
      .data(links)
      .enter()
      .append("line")
      .attr("stroke", config.links.color)
      .attr("stroke-opacity", config.links.opacity)
      .attr("stroke-width", config.links.width)
      .style("transition", "opacity 0.3s ease, stroke-width 0.3s ease");

    nodeElements = g.append("g")
      .selectAll("g")
      .data(nodes)
      .enter()
      .append("g")
      .attr("transform", d => `translate(${d.x},${d.y})`)
      .each(function(d) {
        if (d.type === 'project') {
          const node = new GraphNode({
            target: this,
            props: {
              config: config.nodes[d.type],
              name: d.name,
              description: d.description,
              wip: d.wip
            }
          });
          
          // Add event listeners for tooltip
          node.$on('showtooltip', handleShowTooltip);
          node.$on('hidetooltip', handleHideTooltip);
          
        } else {
          // Create tag nodes directly
          d3.select(this)
            .append("circle")
            .attr("r", config.nodes[d.type].radius)
            .attr("fill", config.nodes[d.type].color)
        }
      })
      .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended))
      .on("click", (_, node) => {
        if (node.type === 'project') {
          const pdfPath = config.pdfPaths[node.id];
          if (pdfPath) {
            activePdf = pdfPath;
          }
        }
      })
      .on("mouseover", (event, node) => {
        const element = d3.select(event.currentTarget);
        
        // Dim all nodes and links
        nodeElements.style("opacity", 0.2);
        linkElements.style("opacity", 0.1);
        labelElements.style("opacity", 0.2);
        
        // Highlight the hovered node
        element.style("opacity", 1);
        if (node.type === 'tag') {
          // Highlight the label of the hovered tag
          labelElements.filter(d => d.id === node.id)
            .style("opacity", 1);
        }
        
        // Highlight connected nodes and links
        const connectedLinks = links.filter(link => 
          link.source.id === node.id || link.target.id === node.id
        );
        
        connectedLinks.forEach(link => {
          const connectedNodeId = link.source.id === node.id ? link.target.id : link.source.id;
          // Highlight connected node
          nodeElements.filter(d => d.id === connectedNodeId)
            .style("opacity", 1);
          // Highlight connected label if it's a tag
          labelElements.filter(d => d.id === connectedNodeId)
            .style("opacity", 1);

          // Highlight the connecting link
          linkElements.filter(l => l === link)
            .style("opacity", 1)
            .style("stroke-width", config.links.width * 1.5)
            .style("stroke", config.links.hoverColor);
        });
      })
      .on("mouseout", (event, node) => {
        const element = d3.select(event.currentTarget);
        
        // Reset all opacities
        nodeElements.style("opacity", 1);
        linkElements
          .style("opacity", config.links.opacity)
          .style("stroke-width", config.links.width)
          .style("stroke", config.links.color);
        labelElements.style("opacity", 1);
      });

    // Create labels (only for tags)
    labelElements = g.append("g")
      .selectAll("text")
      .data(nodes.filter(n => n.type === 'tag'))
      .enter()
      .append("text")
      .text(node => node.name)
      .attr("font-size", node => config.nodes[node.type].label.fontSize)
      .attr("font-weight", node => config.nodes[node.type].label.fontWeight)
      .attr("fill", node => config.nodes[node.type].label.color)
      .attr("font-family", node => config.nodes[node.type].label.fontFamily)
      .attr("dx", node => config.nodes[node.type].labelOffset)
      .attr("dy", 4);

    // Add transition styles to nodes and labels
    nodeElements.style("transition", "opacity 0.3s ease");
    labelElements.style("transition", "opacity 0.3s ease");

    simulation = d3.forceSimulation(nodes)
      .force("link", d3.forceLink(links)
        .id(d => d.id)
        .distance(config.forces.link.distance)
        .strength(config.forces.link.strength)
        .iterations(config.forces.link.iterations))
      .force("charge", d3.forceManyBody()
        .strength(config.forces.charge.strength))
      .force("center", d3.forceCenter(width / 2, height / 2)
        .strength(config.forces.center.strength))
      .force("collision", d3.forceCollide()
        .radius(config.forces.collision.radius)
        .strength(config.forces.collision.strength)
        .iterations(4))
      .force("x", d3.forceX(width / 2)
        .strength(config.forces.x.strength))
      .force("y", d3.forceY(height / 2)
        .strength(config.forces.y.strength))
      .on("tick", ticked);

    nodes.forEach(node => {
      node.x = Math.max(config.layout.padding, Math.min(width - config.layout.padding, node.x));
      node.y = Math.max(config.layout.padding, Math.min(height - config.layout.padding, node.y));
    });
  }

  function ticked() {
    const currentTime = performance.now();
    if (currentTime - lastTickTime < TICK_THROTTLE) {
      animationFrameId = requestAnimationFrame(ticked);
      return;
    }
    lastTickTime = currentTime;

    const width = Math.max(container.clientWidth, MIN_WIDTH);
    const height = Math.max(container.clientHeight, MIN_HEIGHT);
    const padding = config.layout.padding;

    // Only constrain nodes if screen is larger than minimum dimensions
    if (container.clientWidth >= MIN_WIDTH && container.clientHeight >= MIN_HEIGHT) {
      nodes.forEach(node => {
        node.x = Math.max(padding, Math.min(width - padding, node.x));
        node.y = Math.max(padding, Math.min(height - padding, node.y));
      });
    }

    linkElements
      .attr("x1", d => d.source.x)
      .attr("y1", d => d.source.y)
      .attr("x2", d => d.target.x)
      .attr("y2", d => d.target.y);

    nodeElements
      .attr("transform", d => `translate(${d.x},${d.y})`);

    labelElements
      .attr("x", d => d.x)
      .attr("y", d => d.y);

    animationFrameId = requestAnimationFrame(ticked);
  }

  function dragstarted(event, d) {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  }

  function dragged(event, d) {
    d.fx = event.x;
    d.fy = event.y;
  }

  function dragended(event, d) {
    if (!event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  }

  onMount(() => {
    initializeGraph();
    window.addEventListener('resize', initializeGraph);
  });

  onDestroy(() => {
    window.removeEventListener('resize', initializeGraph);
    if (simulation) simulation.stop();
    if (tooltip) tooltip.remove();
    if (animationFrameId) cancelAnimationFrame(animationFrameId);
  });
</script>

<div class="graph-container" bind:this={container}>
  <div class="svg-container">
    <svg class="graph-svg" bind:this={svg}></svg>
  </div>
  <div class="overlay-container">
    <GraphStats />
  </div>
  {#if activePdf}
    <PdfPopup 
      pdfPath={activePdf} 
      onClose={() => activePdf = null} 
    />
  {/if}
</div>

<style>
  :global(html), :global(body) {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    background: white;
  }

  :global(.tooltip) {
    position: absolute;
    padding: 10px;
    background: rgba(0, 0, 0, 0.8);
    color: white;
    border-radius: 4px;
    font-size: 12px;
    pointer-events: none;
    max-width: 300px;
    z-index: 1000;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  }

  :global(.tooltip-content) {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }

  :global(.tooltip-title) {
    font-weight: bold;
    font-size: 14px;
  }

  :global(.tooltip-description) {
    color: #ccc;
    line-height: 1.4;
  }

  .graph-container {
    width: 100vw;
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
    background: white;
    overflow: hidden;
  }

  .svg-container {
    width: 100%;
    height: 100%;
    background: white;
  }

  .graph-svg {
    width: 100%;
    height: 100%;
    display: block;
    background: white;
  }

  .overlay-container {
    position: absolute;
    top: 20px;
    left: 20px;
    z-index: 1000;
  }
</style> 
