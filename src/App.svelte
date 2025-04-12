<script>
  import ProjectGraph from './components/ProjectGraph.svelte';
</script>

<ProjectGraph />

<style>
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  :global(html), :global(body) {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    font-family: Arial, sans-serif;
  }

  :global(#app) {
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
</style> 