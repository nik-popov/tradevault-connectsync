import { extendTheme, ThemeConfig } from "@chakra-ui/react";

const config: ThemeConfig = {
  initialColorMode: "light", // Changed to light mode as the default
  useSystemColorMode: false,
};

const theme = extendTheme({
  config,
  styles: {
    global: (props) => ({
      "html, body": {
        fontFamily: '"42dot Sans", sans-serif',
        lineHeight: "1.7",
        bg: props.colorMode === "dark" ? "gray.900" : "gray.50", // Light gray background for light mode
        color: props.colorMode === "dark" ? "gray.200" : "gray.800", // Dark text for readability in light mode
        padding: "20px",
      },
    }),
  },
  colors: {
    ui: {
      main: "#2C7A7B", // Teal as the primary accent color
      secondary: "#E6FFFA", // Light teal for secondary elements
      success: "#38A169", // Green for success states
      danger: "#E53E3E", // Red for errors (unchanged)
      light: "#FFFFFF", // White for backgrounds
      dark: "#1A202C", // Dark background for dark mode (unchanged)
      darkSlate: "#2D3748", // Darker gray for contrast
      dim: "#A0AEC0", // Muted gray for secondary text (unchanged)
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
          backgroundColor: "ui.main", // Teal accent
          color: "ui.light", // White text
          _hover: {
            backgroundColor: "#234E52", // Darker teal on hover
          },
          _disabled: {
            backgroundColor: "ui.main",
            opacity: 0.6,
          },
        },
        danger: {
          backgroundColor: "ui.danger", // Red (unchanged)
          color: "ui.light", // White text
          _hover: {
            backgroundColor: "#E32727", // Darker red (unchanged)
          },
        },
      },
      defaultProps: {
        variant: "primary",
      },
    },
    Tabs: {
      variants: {
        enclosed: {
          tab: {
            color: "ui.dim",
            _selected: {
              color: "ui.main", // Teal for selected tab
              fontWeight: "bold",
              borderBottomColor: "ui.main", // Teal underline
              borderBottomWidth: "2px",
            },
            _hover: {
              color: "ui.secondary", // Light teal on hover
            },
          },
        },
      },
    },
    Toast: {
      baseStyle: {
        container: {
          bg: "white", // Bright white background (unchanged)
          color: "gray.900", // Dark text (unchanged)
          borderRadius: "md",
          boxShadow: "lg",
          padding: "16px",
          position: "absolute",
          top: "20px",
          left: "50%", // Center horizontally
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
            bg: "yellow.100", // Light yellow for warning
            color: "yellow.900",
            border: "1px solid",
            borderColor: "yellow.300",
          },
        },
      },
    },
  },
});

export default theme;