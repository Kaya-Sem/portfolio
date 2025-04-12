export const graphConfig = {
  // Node settings
  nodes: {
    project: {
      radius: 11,
      color: "#1f77b4",
      hoverColor: "#2a8be2",
      labelOffset: 25,
      label: {
        fontSize: "16px",
        fontWeight: "bold",
        color: "#333",
        fontFamily: "Arial, sans-serif"
      }
    },
    tag: {
      radius: 6,
      color: "gray",
      hoverColor: "#ff9e3d",
      labelOffset: 16,
      label: {
        fontSize: "10px",
        fontWeight: "normal",
        color: "#666",
        fontFamily: "Arial, sans-serif"
      }
    }
  },
  // Link settings
  links: {
    color: "gray",
    opacity: 0.4,
    width: 1,
    distance: 250,
    strength: 0.3
  },
  // Force settings
  forces: {
    charge: {
      strength: -1500
    },
    center: {
      strength: 0.2
    },
    collision: {
      radius: 120,
      strength: 0.7
    },
    x: {
      strength: 0.05
    },
    y: {
      strength: 0.05
    },
    link: {
      iterations: 10,
      distance: 250,
      strength: 0.3
    }
  },
  // Zoom settings
  zoom: {
    min: 0.1,
    max: 4
  },
  // Layout settings
  layout: {
    padding: 30
  }
}; 