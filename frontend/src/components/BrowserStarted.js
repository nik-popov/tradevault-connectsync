import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, VStack, Heading, Text, Button, Code, Icon, Flex, Alert, AlertIcon, Divider, } from "@chakra-ui/react";
import { FiCheckCircle, FiCopy, FiGlobe, FiCode, FiSettings, FiServer, FiList, } from "react-icons/fi";
const CenterStarted = () => {
    const steps = [
        {
            title: "List Available Endpoints",
            icon: FiList,
            description: "Retrieve all available Browser proxy endpoints.",
            content: (_jsx(Code, { p: 3, borderRadius: "md", fontSize: "sm", bg: "gray.700", children: `curl -X GET https://api.iconluxury.group/api/v1/endpoints?type=Browser` })),
        },
        {
            title: "Get Available Locations",
            icon: FiGlobe,
            description: "Retrieve a list of supported locations for Browser proxies.",
            content: (_jsx(Code, { p: 3, borderRadius: "md", fontSize: "sm", bg: "gray.700", children: `curl -X GET https://api.iconluxury.group/api/v1/locations?type=Browser` })),
        },
        {
            title: "Configure Your Endpoint",
            icon: FiGlobe,
            description: "Connect to our Browser proxy network using this endpoint.",
            content: (_jsx(Code, { p: 3, borderRadius: "md", fontSize: "sm", bg: "gray.700", children: "https://api.iconluxury.group/api/v1/proxy/browser/" })),
        },
        {
            title: "Set Your Authentication",
            icon: FiCode,
            description: "Use your credentials to authenticate requests.",
            content: (_jsxs(Box, { bg: "gray.700", p: 3, borderRadius: "md", children: [_jsxs(Code, { display: "block", mb: 2, children: ["Username: your_username", _jsx("br", {}), "Password: your_password"] }), _jsx(Button, { leftIcon: _jsx(FiCopy, {}), variant: "link", size: "sm", colorScheme: "blue", children: "Copy credentials" })] })),
        },
        {
            title: "Retrieve Authentication Info",
            icon: FiCode,
            description: "Check your authentication details and status.",
            content: (_jsx(Code, { p: 3, borderRadius: "md", fontSize: "sm", bg: "gray.700", children: `curl -X GET https://api.iconluxury.group/api/v1/auth/browser` })),
        },
        {
            title: "Optimize Your Settings",
            icon: FiSettings,
            description: "Adjust request headers and connection settings for better performance and security.",
            content: (_jsx(Code, { p: 3, borderRadius: "md", fontSize: "sm", bg: "gray.700", children: `headers = {'User-Agent': 'YourApp/1.0', 'X-Proxy-Type': 'Browser'}` })),
        },
        {
            title: "Send Your First Request",
            icon: FiServer,
            description: "Use the correct proxy format in your code to start making requests.",
            content: (_jsx(Code, { p: 3, borderRadius: "md", fontSize: "sm", bg: "gray.700", children: `curl --proxy-user username:password -x api.iconluxury.group/api/v1/proxy/browser/ https://api.mywebsite.com` })),
        },
        {
            title: "Monitor and Scale",
            icon: FiSettings,
            description: "Track usage statistics and scale your requests based on your needs.",
            content: (_jsx(Code, { p: 3, borderRadius: "md", fontSize: "sm", bg: "gray.700", children: `curl -X GET https://api.iconluxury.group/api/v1/usage/browser/` })),
        },
    ];
    return (_jsx(Box, { maxW: "100%", mx: "auto", px: { base: 6, md: 12 }, py: 12, children: _jsxs(VStack, { spacing: 8, align: "stretch", children: [_jsx(VStack, { spacing: 6, align: "stretch", children: steps.map((step, index) => (_jsxs(Flex, { gap: 4, align: "flex-start", children: [_jsx(Flex, { align: "center", justify: "center", w: "50px", h: "50px", borderRadius: "full", bg: "blue.100", children: _jsx(Icon, { as: step.icon, boxSize: 6, color: "blue.500" }) }), _jsxs(Box, { flex: 1, children: [_jsx(Heading, { size: "md", fontWeight: "semibold", mb: 1, children: step.title }), _jsx(Text, { color: "gray.600", mb: 2, children: step.description }), step.content] })] }, index))) }), _jsx(Divider, {}), _jsxs(Alert, { status: "success", borderRadius: "md", children: [_jsx(AlertIcon, { as: FiCheckCircle, boxSize: 5 }), _jsxs(Box, { children: [_jsx(Text, { fontWeight: "bold", children: "Verify Your Setup" }), _jsxs(Text, { fontSize: "sm", children: ["Test your connection using the examples above. If your IP is masked and geolocation matches expectations, you're all set! Need help? Visit our", " ", _jsx(Button, { variant: "link", colorScheme: "blue", size: "sm", children: "troubleshooting guide" }), " ", "or contact support."] })] })] })] }) }));
};
export default CenterStarted;
