const Tags = Object.freeze({
  GO: "go",
  CLI: "cli",
  LINUX: "linux",
  DOCKER: "docker",
  NETWORKING: "networking",
  WEB: "web",
  API: "api",
  WEBSCRAPING: "webscraping",
  LIBRARY: "library",
  FLUTTER: "flutter",
  MOBILE: "mobile",
  FIREBASE: "firebase",
  VUE: "vue",
  SVELTE: "svelte",
  LATEX: "latex",
  D3: "d3",
  P2P: "p2p",
});

export const projects = [
  {
    id: "2024-0356d86e0f434447a5aa19089ae2dcd",
    name: "Commandtrein",
    description:
      "A personal portfolio website showcasing my projects and skills",
    link: "https://github.com/yourusername/portfolio",
    tags: [Tags.GO, Tags.CLI, Tags.API],
  },
  {
    id: "2025-a9566dacc1e6455ebb7fff144d6e7e50",
    name: "Ouroboros",
    description: "A task management application with real-time updates",
    link: "https://github.com/yourusername/task-manager",
    tags: [Tags.GO, Tags.NETWORKING, Tags.DOCKER, Tags.P2P],
  },
  {
    id: "2025-0d20a3c04bad4366bf78ad9ff2e607d2",
    name: "Semlink",
    description: "Semantic folder mounting",
    link: "https://github.com/yourusername/task-manager",
    tags: [Tags.GO, Tags.CLI, Tags.LINUX, Tags.DOCKER],
  },
  {
    id: "2025-a9deb489bda540d09765aa66054da98b",
    name: "Gent Nachtleven",
    description: "Aggregation website for concerts and events in Gent",
    link: "https://github.com/Kaya-Sem/gentnachtleven",
    tags: [Tags.WEBSCRAPING, Tags.WEB, Tags.GO],
  },
  {
    id: "2024-7a49c319ffbd411999e12bf7f248aeed",
    name: "Oopsie",
    description: "Simple Error display library for Go",
    link: "https://github.com/Kaya-Sem/oopsie",
    tags: [Tags.GO, Tags.CLI, Tags.LIBRARY],
  },
  {
    id: "2025-662550edefdb423ea480deead8279d1b",
    name: "Friendsync",
    description: "Organize meeting with friends efficiently",
    link: "https://github.com/yourusername/task-manager",
    tags: [Tags.FLUTTER, Tags.MOBILE, Tags.FIREBASE],
  },
  {
    id: "2025-b0c866ac55e6441caf619a98d9a8c6f8",
    name: "kaya-sem.com",
    description: "Portfolio website showcasing my projects and skills",
    link: "https://github.com/yourusername/data-viz",
    tags: [Tags.SVELTE, Tags.LATEX, Tags.D3, Tags.WEB],
  },
];

export const generateGraphData = () => {
  const nodes = [];
  const links = [];

  // Add project nodes
  projects.forEach((project) => {
    nodes.push({
      id: project.id,
      name: project.name,
      description: project.description,
      link: project.link,
      type: "project",
    });

    // Add tag nodes and links
    project.tags.forEach((tag) => {
      const tagId = `tag-${tag}`;

      // Add tag node if it doesn't exist
      if (!nodes.find((n) => n.id === tagId)) {
        nodes.push({
          id: tagId,
          name: tag,
          type: "tag",
        });
      }

      // Add link between project and tag
      links.push({
        source: project.id,
        target: tagId,
      });
    });
  });

  return { nodes, links };
};
