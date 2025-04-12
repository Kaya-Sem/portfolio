export const graphConfig = {
  // Node settings
  nodes: {
    project: {
      radius: 50,
      color: "white",
      hoverColor: "#2a8be2",
      labelOffset: 0,
      label: {
        fontSize: "14px",
        fontWeight: "500",
        color: "#333",
        fontFamily: "Arial, sans-serif",
      },
    },
    tag: {
      radius: 10,
      color: "gray",
      hoverColor: "#ff9e3d",
      labelOffset: 16,
      label: {
        fontSize: "10px",
        fontWeight: "normal",
        color: "#666",
        fontFamily: "Arial, sans-serif",
      },
    },
  },
  // Link settings
  links: {
    color: "#999",
    hoverColor: "#ff7f0e",
    opacity: 0.6,
    width: 1.5,
    distance: 170,
    strength: 0.5,
    iterations: 1,
  },
  // Force settings
  forces: {
    charge: {
      strength: -1500,
    },
    center: {
      strength: 0.2,
    },
    collision: {
      radius: 120,
      strength: 0.7,
    },
    x: {
      strength: 0.05,
    },
    y: {
      strength: 0.05,
    },
    link: {
      iterations: 10,
      distance: 200,
      strength: 0.3,
    },
  },
  // Zoom settings
  zoom: {
    min: 0.1,
    max: 4,
  },
  // Layout settings
  layout: {
    padding: 80,
  },
};

