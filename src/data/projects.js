const Tags = Object.freeze({
  GO: 'go',
  CLI: 'cli',
  LINUX: 'linux',
  DOCKER: 'docker',
  NETWORKING: 'networking',
  WEB: 'web',
  API: 'api',
  WEBSCRAPING: 'webscraping',
  LIBRARY: 'library',
  FLUTTER: 'flutter',
  MOBILE: 'mobile',
  FIREBASE: 'firebase',
  VUE: 'vue',
  SVELTE: 'svelte',
  LATEX: 'latex',
  D3: 'd3'
});

export const projects = [
  {
    id: 'project1',
    name: 'Commandtrein',
    description: 'A personal portfolio website showcasing my projects and skills',
    link: 'https://github.com/yourusername/portfolio',
    tags: [Tags.GO, Tags.CLI, Tags.API]
  },
  {
    id: 'project2',
    name: 'Ouroboros',
    description: 'A task management application with real-time updates',
    link: 'https://github.com/yourusername/task-manager',
    tags: [Tags.GO, Tags.NETWORKING, Tags.DOCKER]
  },
  {
    id: 'project9',
    name: 'Semlink',
    description: 'Semantic folder mounting',
    link: 'https://github.com/yourusername/task-manager',
    tags: [Tags.GO, Tags.CLI, Tags.LINUX, Tags.DOCKER]
  },
  {
    id: 'project98',
    name: 'Gent Nachtleven',
    description: 'Aggregation website for concerts and events in Gent',
    link: 'https://github.com/Kaya-Sem/gentnachtleven',
    tags: [Tags.WEBSCRAPING, Tags.WEB, Tags.GO]
  },
  {
    id: 'project99',
    name: 'Oopsie',
    description: 'Simple Error display library for Go',
    link: 'https://github.com/Kaya-Sem/oopsie',
    tags: [Tags.GO, Tags.CLI, Tags.LIBRARY]
  },
  {
    id: 'project11',
    name: 'Friendsync',
    description: 'Organize meeting with friends efficiently',
    link: 'https://github.com/yourusername/task-manager',
    tags: [Tags.FLUTTER, Tags.MOBILE, Tags.FIREBASE]
  },
  {
    id: 'project10',
    name: 'kaya-sem.com',
    description: 'Portfolio website showcasing my projects and skills',
    link: 'https://github.com/yourusername/data-viz',
    tags: [Tags.SVELTE, Tags.LATEX, Tags.D3, Tags.WEB]
  }
];

export const generateGraphData = () => {
  const nodes = [];
  const links = [];
  
  // Add project nodes
  projects.forEach(project => {
    nodes.push({
      id: project.id,
      name: project.name,
      description: project.description,
      link: project.link,
      type: 'project'
    });
    
    // Add tag nodes and links
    project.tags.forEach(tag => {
      const tagId = `tag-${tag}`;
      
      // Add tag node if it doesn't exist
      if (!nodes.find(n => n.id === tagId)) {
        nodes.push({
          id: tagId,
          name: tag,
          type: 'tag'
        });
      }
      
      // Add link between project and tag
      links.push({
        source: project.id,
        target: tagId
      });
    });
  });

  return { nodes, links };
}; 
