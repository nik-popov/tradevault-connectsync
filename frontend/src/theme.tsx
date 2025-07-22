import { extendTheme, ThemeConfig } from "@chakra-ui/react";

const config: ThemeConfig = {
  initialColorMode: "light", // Light mode as the default
  useSystemColorMode: false,
};

const theme = extendTheme({
  config,
  styles: {
    global: () => ({
      "html, body": {
        fontFamily: '"Figtree", sans-serif',
        lineHeight: "1.7",
        bg: "gray.50", // Light gray background for light mode
        color: "gray.900", // Dark text for readability in light mode
      },
    }),
  },
  colors: {
    ui: {
      main: "#3B82F6", // Blue as the primary accent color for cross-listing app
      secondary: "#A855F7", // Purple for secondary elements
      accent: "#EC4899", // Pink as an additional accent for highlights or calls-to-action
      success: "#22C55E", // Updated green for success states to fit vibrant theme
      danger: "#EF4444", // Updated red for errors
      light: "#FFFFFF", // White for backgrounds
      dark: "#1F2937", // Slightly adjusted dark background
      darkSlate: "#374151", // Adjusted darker gray for contrast
      dim: "#9CA3AF", // Muted gray for secondary text
    },
  },
  components: {
    Heading: {
      baseStyle: (props) => ({
        color: props.colorMode === "dark" ? "gray.100" : "gray.900",
      }),
    },
    Text: {
      baseStyle: (props) => ({
        color: props.colorMode === "dark" ? "gray.200" : "gray.700", // Darker text for light mode readability
      }),
    },
    Code: {
      baseStyle: (props) => ({
        bg: props.colorMode === "dark" ? "gray.700" : "gray.100", // Light background for light mode
        color: props.colorMode === "dark" ? "gray.100" : "gray.800", // Dark text in light mode
        fontSize: "sm",
        p: 3,
        borderRadius: "md",
      }),
    },
    Button: {
      baseStyle: {
        fontWeight: "bold",
        borderRadius: "md",
      },
      variants: {
        primary: {
          backgroundColor: "ui.main", // Blue accent
          color: "ui.light", // White text
          _hover: {
            backgroundColor: "#2563EB", // Darker blue on hover
          },
          _disabled: {
            backgroundColor: "ui.main",
            opacity: 0.6,
          },
        },
        secondary: {
          backgroundColor: "ui.secondary", // Purple for secondary buttons
          color: "ui.light",
          _hover: {
            backgroundColor: "#9333EA", // Darker purple on hover
          },
        },
        accent: {
          backgroundColor: "ui.accent", // Pink for accent buttons
          color: "ui.light",
          _hover: {
            backgroundColor: "#DB2777", // Darker pink on hover
          },
        },
        danger: {
          backgroundColor: "ui.danger", // Red
          color: "ui.light", // White text
          _hover: {
            backgroundColor: "#DC2626", // Darker red
          },
        },
      },
      defaultProps: {
        variant: "primary",
      },
    },
    Tabs: {
      variants: {
        subtle: {
          tab: {
            color: "ui.dim",
            _selected: {
              color: "ui.main", // Blue for selected tab
              fontWeight: "bold",
              borderBottomColor: "ui.main", // Blue underline
              borderBottomWidth: "2px",
            },
            _hover: {
              color: "ui.secondary", // Purple on hover
            },
          },
        },
      },
    },
    Toast: {
      baseStyle: {
        container: {
          bg: "white", // Bright white background
          color: "gray.100", // Dark text
          borderRadius: "md",
          boxShadow: "lg",
          padding: "16px",
          position: "absolute",
          top: "20px",
          transform: "translateX(-50%)", // Adjust for centering
          minWidth: "300px",
          maxWidth: "90%",
        },
      },
      variants: {
        error: {
          container: {
            bg: "red.100", // Light red for error
            color: "red.900",
            border: "1px solid",
            borderColor: "red.300",
          },
        },
        success: {
          container: {
            bg: "green.100", // Light green for success
            color: "green.900",
            border: "1px solid",
            borderColor: "green.300",
          },
        },
        info: {
          container: {
            bg: "blue.100", // Light blue for info
            color: "blue.900",
            border: "1px solid",
            borderColor: "blue.300",
          },
        },
        warning: {
          container: {
            bg: "pink.100", // Light pink for warning to incorporate pink
            color: "pink.900",
            border: "1px solid",
            borderColor: "pink.300",
          },
        },
      },
    },
  },
});

export default theme;