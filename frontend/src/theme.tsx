import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  global: {
    body: {
      fontFamily: '"42dot Sans", sans-serif',
      fontSize: "22px",
      lineHeight: "1.7",
      margin: "40px",
      padding: "20px",
    },
  },
  colors: {
    ui: {
      main: "#2C6295", // Updated cobalt color
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
      variants: {
        primary: {
          backgroundColor: "ui.main",
          color: "ui.light",
          _hover: {
            backgroundColor: "#1F4A73", // Darker shade for hover
          },
          _disabled: {
            backgroundColor: "ui.main",
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
      // Setting the default color scheme to blue
      defaultProps: {
        colorScheme: "blue",
      },
      baseStyle: {
        container: {
          bg: "blue.500", // Blue background
          color: "white",  // White text color for contrast
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
