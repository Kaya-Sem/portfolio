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
      distance: 130,
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

  pdfPaths: {
    "2024-0356d86e0f434447a5aa19089ae2dcd":
      "/spec/commandtrein/commandtrein.pdf",
    "2025-a9566dacc1e6455ebb7fff144d6e7e50": "/spec/ouroboros.pdf",
    "2025-0d20a3c04bad4366bf78ad9ff2e607d2": "/spec/semlink.pdf",
    "2025-a9deb489bda540d09765aa66054da98b": "/spec/gent_nachtleven.pdf",
    "2024-7a49c319ffbd411999e12bf7f248aeed": "/spec/oopsie.pdf",
    "2025-662550edefdb423ea480deead8279d1b": "/spec/friendsync.pdf",
    "2025-b0c866ac55e6441caf619a98d9a8c6f8":
      "/spec/kayasemdotcom/kayasemdotcom.pdf",
  },
};
