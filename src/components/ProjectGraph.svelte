<script>
  import { onMount, onDestroy } from 'svelte';
  import * as d3 from 'd3';
  import { projects } from '../data/projects.js';
  import GraphStats from './GraphStats.svelte';
  import { graphConfig as config } from '../config/graphConfig.js';

  let container;
  let svg;
  let selectedProject = null;
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

  // Extract unique tags from all projects
  const allTags = [...new Set(projects.flatMap(p => p.tags))];
  
  // Create nodes for projects and tags
  const projectNodes = projects.map((project, i) => ({
    id: `project-${i}`,
    name: project.name,
    description: project.description,
    link: project.link,
    tags: project.tags,
    type: 'project',
    x: Math.random() * 800,
    y: Math.random() * 600
  }));

  const tagNodes = allTags.map((tag, i) => ({
    id: `tag-${i}`,
    name: tag,
    type: 'tag',
    x: Math.random() * 800,
    y: Math.random() * 600
  }));

  nodes = [...projectNodes, ...tagNodes];

  // Create links between projects and their tags
  links = projects.flatMap((project, i) => 
    project.tags.map(tag => {
      const tagIndex = allTags.indexOf(tag);
      return {
        source: `project-${i}`,
        target: `tag-${tagIndex}`,
        value: 1
      };
    })
  );

  function calculateStats() {
    stats.projects = projectNodes.length;
    stats.tags = tagNodes.length;
    stats.edges = links.length;
    stats.density = links.length / (projectNodes.length * tagNodes.length);
    
    const degrees = {};
    nodes.forEach(node => {
      degrees[node.id] = links.filter(link => 
        link.source === node.id || link.target === node.id
      ).length;
    });
    
    const degreeValues = Object.values(degrees);
    stats.avgDegree = degreeValues.reduce((a, b) => a + b, 0) / degreeValues.length;
    
    const maxDegree = Math.max(...degreeValues);
    const maxDegreeNode = nodes.find(node => degrees[node.id] === maxDegree);
    stats.maxDegree = maxDegree;
    stats.maxDegreeNodeName = maxDegreeNode.name;
  }

  function initializeGraph() {
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Clear existing SVG
    d3.select(svg).selectAll("*").remove();

    // Create SVG
    const svgElement = d3.select(svg)
      .attr("width", width)
      .attr("height", height);

    // Add white background
    svgElement.append("rect")
      .attr("width", width)
      .attr("height", height)
      .attr("fill", "white");

    // Create a group for all elements
    const g = svgElement.append("g");

    // Create zoom behavior
    zoom = d3.zoom()
      .scaleExtent([config.zoom.min, config.zoom.max])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
      });

    svgElement.call(zoom);

    // Create tooltip
    tooltip = d3.select("body")
      .append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);

    // Create links
    linkElements = g.append("g")
      .selectAll("line")
      .data(links)
      .enter()
      .append("line")
      .attr("stroke", config.links.color)
      .attr("stroke-opacity", config.links.opacity)
      .attr("stroke-width", config.links.width);

    // Create nodes
    nodeElements = g.append("g")
      .selectAll("circle")
      .data(nodes)
      .enter()
      .append("circle")
      .attr("r", node => config.nodes[node.type].radius)
      .attr("fill", node => config.nodes[node.type].color)
      .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended))
      .on("click", (event, node) => {
        if (node.type === 'project') {
          selectedProject = {
            name: node.name,
            description: node.description,
            link: node.link,
            tags: node.tags
          };
        }
      })
      .on("mouseover", (event, node) => {
        d3.select(event.currentTarget)
          .attr("fill", config.nodes[node.type].hoverColor);
        tooltip.transition()
          .duration(200)
          .style("opacity", .9);
        
        // Create tooltip content based on node type
        let tooltipContent = node.name;
        if (node.type === 'project') {
          tooltipContent = `
            <div class="tooltip-content">
              <div class="tooltip-description">${node.description}</div>
            </div>
          `;
        }
        
        tooltip.html(tooltipContent)
          .style("left", (event.pageX + 10) + "px")
          .style("top", (event.pageY - 28) + "px");
      })
      .on("mouseout", (event, node) => {
        d3.select(event.currentTarget)
          .attr("fill", config.nodes[node.type].color);
        tooltip.transition()
          .duration(500)
          .style("opacity", 0);
      });

    // Create labels
    labelElements = g.append("g")
      .selectAll("text")
      .data(nodes)
      .enter()
      .append("text")
      .text(node => node.name)
      .attr("font-size", node => config.nodes[node.type].label.fontSize)
      .attr("font-weight", node => config.nodes[node.type].label.fontWeight)
      .attr("fill", node => config.nodes[node.type].label.color)
      .attr("font-family", node => config.nodes[node.type].label.fontFamily)
      .attr("dx", node => config.nodes[node.type].labelOffset)
      .attr("dy", 4);

    // Initialize simulation
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

    // Add initial positions to keep nodes within bounds
    nodes.forEach(node => {
      node.x = Math.max(config.layout.padding, Math.min(width - config.layout.padding, node.x));
      node.y = Math.max(config.layout.padding, Math.min(height - config.layout.padding, node.y));
    });

    calculateStats();
  }

  function ticked() {
    linkElements
      .attr("x1", d => d.source.x)
      .attr("y1", d => d.source.y)
      .attr("x2", d => d.target.x)
      .attr("y2", d => d.target.y);

    nodeElements
      .attr("cx", d => d.x)
      .attr("cy", d => d.y);

    labelElements
      .attr("x", d => d.x)
      .attr("y", d => d.y);
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
  });
</script>

<div class="graph-container" bind:this={container}>
  <svg class="graph-svg" bind:this={svg}></svg>
  <div class="overlay-container">
    <GraphStats {stats} />
  </div>
  {#if selectedProject}
    <div class="sidebar">
      <button class="close-button" on:click={() => selectedProject = null}>×</button>
      <h2>{selectedProject.name}</h2>
      <p class="description">{selectedProject.description}</p>
      <a href={selectedProject.link} target="_blank" class="project-link">View Project →</a>
      <div class="tags">
        <h3>Tags:</h3>
        <div class="tag-list">
          {#each selectedProject.tags as tag}
            <span class="tag">{tag}</span>
          {/each}
        </div>
      </div>
    </div>
  {/if}
</div>

<style>
  :global(html), :global(body) {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
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
  }

  .graph-svg {
    width: 100%;
    height: 100%;
  }

  .overlay-container {
    position: absolute;
    top: 20px;
    left: 20px;
    z-index: 1000;
  }

  .sidebar {
    position: absolute;
    right: 20px;
    top: 20px;
    width: 300px;
    background: rgba(255, 255, 255, 0.9);
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    z-index: 1000;
  }

  .close-button {
    position: absolute;
    right: 10px;
    top: 10px;
    background: none;
    border: none;
    font-size: 20px;
    cursor: pointer;
    color: #666;
  }

  .description {
    margin: 10px 0;
    color: #666;
    line-height: 1.4;
  }

  .project-link {
    display: inline-block;
    margin: 10px 0;
    color: #1f77b4;
    text-decoration: none;
  }

  .project-link:hover {
    text-decoration: underline;
  }

  .tags {
    margin-top: 15px;
  }

  .tag-list {
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
    margin-top: 5px;
  }

  .tag {
    background: #f0f0f0;
    padding: 3px 8px;
    border-radius: 12px;
    font-size: 12px;
    color: #666;
  }
</style> 