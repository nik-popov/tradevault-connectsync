import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  styles: {
    global: {
      body: {
        fontFamily: '"42dot Sans", sans-serif',
        lineHeight: "1.7",
        padding: "20px",
      },
    },
  },
  colors: {
    ui: {
      main: "#0A2540", // Deep cobalt blue
      secondary: "#EDF2F7",
      success: "#48BB78",
      danger: "#E53E3E",
      light: "#FAFAFA",
      dark: "#1A202C",
      darkSlate: "#252D3D",
      dim: "#A0AEC0",
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
            backgroundColor: "#082135", // Even darker for hover
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
            _selected: {
              color: "ui.main",
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
