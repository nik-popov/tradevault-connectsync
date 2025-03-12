import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Badge, Container, Heading, Radio, RadioGroup, Stack, useColorMode, } from "@chakra-ui/react";
const Appearance = () => {
    // Get the current color mode and the toggle function from Chakra UI
    const { colorMode, toggleColorMode } = useColorMode();
    return (_jsxs(Container, { maxW: "full", children: [_jsx(Heading, { size: "sm", py: 4, children: "Appearance" }), _jsx(RadioGroup, { onChange: toggleColorMode, value: colorMode, children: _jsxs(Stack, { direction: "column", children: [_jsx(Radio, { value: "light", children: "Light Mode" }), _jsxs(Radio, { value: "dark", children: ["Dark Mode", _jsx(Badge, { ml: "1", children: "Default" })] })] }) })] }));
};
export default Appearance;
