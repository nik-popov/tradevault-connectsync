import { extendTheme } from "@chakra-ui/react";
const config = {
    initialColorMode: "dark", // Default to dark mode
    useSystemColorMode: false,
};
const theme = extendTheme({
    config,
    styles: {
        global: (props) => ({
            "html, body": {
                fontFamily: '"42dot Sans", sans-serif',
                lineHeight: "1.7",
                bg: props.colorMode === "dark" ? "gray.900" : "gray.100", // Dark mode support
                color: props.colorMode === "dark" ? "gray.200" : "gray.800",
                padding: "20px",
            },
        }),
    },
    colors: {
        ui: {
            main: "#0A2540", // Primary blue
            secondary: "#EDF2F7", // Light gray-blue
            success: "#48BB78", // Green success
            danger: "#E53E3E", // Red error
            light: "#FAFAFA", // Off-white
            dark: "#1A202C", // Dark background
            darkSlate: "#252D3D", // Darker gray-blue
            dim: "#A0AEC0", // Muted gray
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
                color: props.colorMode === "dark" ? "gray.200" : "gray.200", // Lighter subtext
            }),
        },
        Code: {
            baseStyle: (props) => ({
                bg: props.colorMode === "dark" ? "gray.700" : "gray.700", // Grey background
                color: props.colorMode === "dark" ? "gray.100" : "gray.900", // Dark text in dark mode
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
                    backgroundColor: "ui.main",
                    color: "ui.light",
                    _hover: {
                        backgroundColor: "#082135",
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
                        color: "ui.dim",
                        _selected: {
                            color: "ui.light",
                            fontWeight: "bold",
                            borderBottomColor: "ui.main",
                            borderBottomWidth: "2px",
                        },
                        _hover: {
                            color: "ui.secondary",
                        },
                    },
                },
            },
        },
        Alert: {
            baseStyle: (props) => ({
                container: {
                    bg: props.colorMode === "dark" ? "gray.800" : "gray.50",
                    color: props.colorMode === "dark" ? "gray.300" : "gray.700",
                },
            }),
        },
    },
});
export default theme;
