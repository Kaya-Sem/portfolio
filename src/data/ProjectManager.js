import { projects } from './projects.js';

class ProjectManager {
  static instance = null;
  nodes = null;
  links = null;
  stats = null;

  constructor() {
    if (ProjectManager.instance) {
      return ProjectManager.instance;
    }
    ProjectManager.instance = this;
    this.loadFromStorage();
  }

  static getInstance() {
    if (!ProjectManager.instance) {
      ProjectManager.instance = new ProjectManager();
    }
    return ProjectManager.instance;
  }

  loadFromStorage() {
    try {
      const storedNodes = localStorage.getItem('projectManager_nodes');
      const storedLinks = localStorage.getItem('projectManager_links');
      const storedStats = localStorage.getItem('projectManager_stats');

      if (storedNodes) this.nodes = JSON.parse(storedNodes);
      if (storedLinks) this.links = JSON.parse(storedLinks);
      if (storedStats) this.stats = JSON.parse(storedStats);
    } catch (error) {
      console.error('Error loading from localStorage:', error);
      this.nodes = null;
      this.links = null;
      this.stats = null;
    }
  }

  saveToStorage() {
    try {
      if (this.nodes) localStorage.setItem('projectManager_nodes', JSON.stringify(this.nodes));
      if (this.links) localStorage.setItem('projectManager_links', JSON.stringify(this.links));
      if (this.stats) localStorage.setItem('projectManager_stats', JSON.stringify(this.stats));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }

  getNodes() {
    if (!this.nodes) {
      this.computeNodes();
      this.saveToStorage();
    }
    return this.nodes;
  }

  getLinks() {
    if (!this.links) {
      this.computeLinks();
      this.saveToStorage();
    }
    return this.links;
  }

  getStats() {
    if (!this.stats) {
      this.computeStats();
      this.saveToStorage();
    }
    return this.stats;
  }

  computeNodes() {
    const allTags = [...new Set(projects.flatMap(p => p.tags))];
    
    const projectNodes = projects.map((project, i) => ({
      id: `project-${i}`,
      name: project.name,
      description: project.description,
      link: project.link,
      tags: project.tags,
      type: 'project',
      x: window.innerWidth / 2 + (Math.random() - 0.5) * 400,
      y: window.innerHeight / 2 + (Math.random() - 0.5) * 300
    }));

    const tagNodes = allTags.map((tag, i) => ({
      id: `tag-${i}`,
      name: tag,
      type: 'tag',
      x: window.innerWidth / 2 + (Math.random() - 0.5) * 400,
      y: window.innerHeight / 2 + (Math.random() - 0.5) * 300
    }));

    this.nodes = [...projectNodes, ...tagNodes];
  }

  computeLinks() {
    if (!this.nodes) {
      this.computeNodes();
    }

    const projectNodes = this.nodes.filter(n => n.type === 'project');
    const tagNodes = this.nodes.filter(n => n.type === 'tag');
    const allTags = tagNodes.map(t => t.name);

    this.links = projects.flatMap((project, i) => 
      project.tags.map(tag => {
        const tagIndex = allTags.indexOf(tag);
        return {
          source: `project-${i}`,
          target: `tag-${tagIndex}`,
          value: 1
        };
      })
    );
  }

  computeStats() {
    if (!this.nodes) {
      this.computeNodes();
    }
    if (!this.links) {
      this.computeLinks();
    }

    const projectNodes = this.nodes.filter(n => n.type === 'project');
    const tagNodes = this.nodes.filter(n => n.type === 'tag');

    this.stats = {
      projects: projectNodes.length,
      tags: tagNodes.length,
      edges: this.links.length,
      density: this.links.length / (projectNodes.length * tagNodes.length)
    };
    
    const degrees = {};
    this.nodes.forEach(node => {
      degrees[node.id] = this.links.filter(link => 
        link.source === node.id || link.target === node.id
      ).length;
    });
    
    const degreeValues = Object.values(degrees);
    this.stats.avgDegree = degreeValues.reduce((a, b) => a + b, 0) / degreeValues.length;
    
    const maxDegree = Math.max(...degreeValues);
    const maxDegreeNode = this.nodes.find(node => degrees[node.id] === maxDegree);
    this.stats.maxDegree = maxDegree;
    this.stats.maxDegreeNodeName = maxDegreeNode.name;

    this.saveToStorage();
  }

  clearCache() {
    this.nodes = null;
    this.links = null;
    this.stats = null;
    localStorage.removeItem('projectManager_nodes');
    localStorage.removeItem('projectManager_links');
    localStorage.removeItem('projectManager_stats');
  }
}

export default ProjectManager; 