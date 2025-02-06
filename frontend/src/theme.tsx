import { extendTheme } from "@chakra-ui/react"

const disabledStyles = {
  _disabled: {
    backgroundColor: "ui.main",
  },
}

const theme = extendTheme({
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
        teal: {
          500: "#2C6295", // Override the default teal shade with your custom cobalt color
          // You can adjust other shades as needed
        },
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
            ...disabledStyles,
            _hover: {
              ...disabledStyles,
            },
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
    },  Radio: {
      // You can add custom styles or variants here to use your ui colors.
      // For example, override the checked style:
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
})

export default theme
