<script>
  export let config;
  export let name = '';

  // Calculate background width based on text length
  $: boxWidth = Math.max(name.length * 10 + 20, 100);
  $: boxHeight = 36;
</script>

<g>
  <rect
    x={-boxWidth/2}
    y={-boxHeight/2}
    width={boxWidth}
    height={boxHeight}
    rx="6"
    ry="6"
    fill={config.color}
    stroke="#00050f"
    stroke-width="1.5"
  />
  <text
    x="0"
    y="0"
    text-anchor="middle"
    dominant-baseline="middle"
    fill="#00050f"
    font-size="14px"
    font-weight="500"
    font-family="Arial, sans-serif"
  >{name}</text>
</g>

<style>
  text {
    user-select: none;
  }
  rect {
    transition: fill 0.2s ease;
  }
</style> 
