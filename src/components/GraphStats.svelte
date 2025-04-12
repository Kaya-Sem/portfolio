<script>
  import ProjectManager from '../data/ProjectManager.js';
  
  const projectManager = ProjectManager.getInstance();
  const stats = projectManager.getStats();

  let isExpanded = false;

  function toggleStats() {
    isExpanded = !isExpanded;
  }
</script>

<div class="stats-container" class:expanded={isExpanded}>
  <button class="toggle-button" on:click={toggleStats}>
    <span class="icon">{isExpanded ? '−' : '+'}</span>
    <span class="label">Stats</span>
  </button>
  
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
</div>

<style>
  .stats-container {
    position: relative;
  }

  .toggle-button {
    display: none;
    align-items: center;
    gap: 8px;
    background: white;
    border: none;
    border-radius: 8px;
    padding: 8px 12px;
    cursor: pointer;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    font-size: 14px;
    color: #333;
  }

  .icon {
    font-size: 18px;
    font-weight: bold;
    line-height: 1;
  }

  .info-panel {
    background: rgba(255, 255, 255, 0.9);
    padding: 25px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .info-panel h3 {
    margin-bottom: 10px;
    margin-top: -10px;
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

  @media (max-width: 768px) {
    .toggle-button {
      display: flex;
    }

    .info-panel {
      display: none;
      position: absolute;
      top: calc(100% + 8px);
      left: 0;
      min-width: 250px;
    }

    .stats-container.expanded .info-panel {
      display: block;
    }
  }
</style> 