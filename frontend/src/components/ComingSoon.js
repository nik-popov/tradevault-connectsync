import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, Text, Alert, AlertIcon, VStack } from "@chakra-ui/react";
import { FiTool, FiClock, FiTrendingUp, FiPackage } from 'react-icons/fi';
const internalUpcomingFeatures = [
    {
        name: "Feature A",
        icon: FiTrendingUp,
        description: "High-level description of Feature A and why it's important for our internal teams."
    },
    {
        name: "Feature B",
        icon: FiTool,
        description: "Brief overview of Feature B's functionality and benefits for internal workflows."
    },
    {
        name: "Feature C",
        icon: FiClock,
        description: "A teaser for how Feature C will improve efficiency or automation internally."
    },
    {
        name: "Feature D",
        icon: FiPackage,
        description: "General summary of Feature D, focusing on practical advantages for teams."
    }
];
const ComingSoon = () => {
    return (_jsx(Box, { maxW: "100%", mx: "auto", px: { base: 6, md: 12 }, py: 10, children: _jsx(VStack, { spacing: 6, align: "stretch", children: _jsxs(Alert, { status: "info", borderRadius: "md", bg: "gray.700", color: "gray.300", children: [_jsx(AlertIcon, { color: "blue.400" }), _jsx(Text, { fontSize: "sm", children: "Upcoming internal features are in development. We welcome your feedback to help shape them." })] }) }) }));
};
export default ComingSoon;
