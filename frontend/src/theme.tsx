import { extendTheme, ThemeConfig } from "@chakra-ui/react";

const config: ThemeConfig = {
  initialColorMode: "dark", // 👈 Default to dark mode
  useSystemColorMode: false, // Ignore system preferences
};

const theme = extendTheme({
  config,
  styles: {
    global: {
      "html, body": {
        fontFamily: '"42dot Sans", sans-serif',
        lineHeight: "1.7",
        bg: "ui.dark", // 👈 Ensure dark mode background
        color: "ui.light",
        padding: "20px",
      },
    },
  },
  colors: {
    ui: {
      main: "#0A2540", // Deep cobalt blue
      secondary: "#EDF2F7", // Light blue-gray
      success: "#48BB78", // Green success
      danger: "#E53E3E", // Red error
      light: "#FAFAFA", // Off-white
      dark: "#1A202C", // Dark background
      darkSlate: "#252D3D", // Darker gray-blue
      dim: "#A0AEC0", // Muted gray
    },
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: "bold",
        borderRadius: "md",
      },
      variants: {
        primary: {
          backgroundColor: "ui.main",
          color: "ui.light",
          _hover: {
            backgroundColor: "#082135", // Darker hover
          },
          _disabled: {
            backgroundColor: "ui.main",
            opacity: 0.6,
          },
        },
        danger: {
          backgroundColor: "ui.danger",
          color: "ui.light",
          _hover: {
            backgroundColor: "#E32727",
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
                color: "ui.dim", // Default text color in dark mode
                _selected: {
                  color: "ui.light", // White when active
                  fontWeight: "bold",
                  borderBottomColor: "ui.main", // Highlight the active tab
                  borderBottomWidth: "2px",
                },
                _hover: {
                  color: "ui.secondary",
                },
              },
            },
          },
        },
    Badge: {
      defaultProps: {
        colorScheme: "blue",
      },
      baseStyle: {
        container: {
          bg: "blue.500",
          color: "white",
        },
      },
    },
    Radio: {
      baseStyle: {
        control: {
          _checked: {
            bg: "ui.main",
            borderColor: "ui.main",
          },
        },
      },
    },
  },
});

export default theme;
