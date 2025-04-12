<script>
  export let stats = {
    projects: 0,
    tags: 0,
    edges: 0,
    density: 0,
    avgDegree: 0,
    maxDegree: 0,
    maxDegreeNodeName: ''
  };
</script>

<div class="info-panel">
  <h3>Graph Statistics</h3>
  <div class="stat">
    <span class="label has-tooltip" title="Number of project nodes in the graph">Projects:</span>
    <span class="value">{stats.projects}</span>
  </div>
  <div class="stat">
    <span class="label has-tooltip" title="Number of technology/tag nodes in the graph">Tags:</span>
    <span class="value">{stats.tags}</span>
  </div>
  <div class="stat">
    <span class="label has-tooltip" title="Total number of connections between projects and tags">Edges:</span>
    <span class="value">{stats.edges}</span>
  </div>
  <div class="stat">
    <span class="label has-tooltip" title="Ratio of actual connections to possible connections (Edges / (Projects × Tags))">Density:</span>
    <span class="value">{stats.density.toFixed(2)}</span>
  </div>
  <div class="stat">
    <span class="label has-tooltip" title="Average number of tags used per project">Avg. Degree:</span>
    <span class="value">{stats.avgDegree.toFixed(1)}</span>
  </div>
  <div class="stat">
    <span class="label has-tooltip" title="Highest number of connections for any node">Max Degree:</span>
    <span class="value">{stats.maxDegree}</span>
  </div>
</div>

<style>
  .info-panel {
    background: rgba(255, 255, 255, 0.9);
    padding: 15px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .info-panel h3 {
    margin-bottom: 10px;
    color: #333;
  }

  .stat {
    display: flex;
    justify-content: space-between;
    margin-bottom: 5px;
    font-size: 14px;
  }

  .label {
    color: #666;
  }

  .value {
    font-weight: bold;
    color: #333;
  }
</style> 