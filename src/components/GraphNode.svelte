<script>
  import { createEventDispatcher } from 'svelte';
  export let config;
  export let name = '';
  export let wip = false;
  export let description = '';

  const dispatch = createEventDispatcher();
  
  function showTooltip(event) {
    dispatch('showtooltip', {
      description: wip ? `${description} (Work in Progress)` : description,
      x: event.clientX,
      y: event.clientY
    });
  }
  
  function hideTooltip() {
    dispatch('hidetooltip');
  }

  $: boxWidth = Math.max(name.length * 10 + 20, 100);
  $: boxHeight = 36;
  $: displayName = wip ? `[WIP] ${name}` : name;
</script>

<g 
  class:wip 
  on:mouseenter={showTooltip}
  on:mousemove={showTooltip}
  on:mouseleave={hideTooltip}
>
  <rect
    x={-boxWidth/2}
    y={-boxHeight/2}
    width={boxWidth}
    height={boxHeight}
    rx="6"
    ry="6"
    fill={config.color}
    stroke={wip ? "transparent" : "#00050f"}
    stroke-width="1.5"
  />
  <text
    x="0"
    y="0"
    text-anchor="middle"
    dominant-baseline="middle"
    fill={wip ? "#999999" : "#00050f"}
    font-size="14px"
    font-weight="500"
    font-family="Arial, sans-serif"
  >{displayName}</text>
</g>

<style>
  text {
    user-select: none;
  }
  rect {
    transition: fill 0.2s ease;
  }
  g {
    cursor: pointer;
  }
</style> 
