import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Box, Text, Flex, Button, Input, Select, Textarea, Spinner, Tooltip, FormControl, FormLabel, } from "@chakra-ui/react";
// Constants
const ENDPOINTS = ["SOUTHAMERICA-WEST1", "US-CENTRAL1", "US-EAST1"];
const PlaygroundGSerp = () => {
    const [query, setQuery] = useState("");
    const [endpoint, setEndpoint] = useState(ENDPOINTS[1]); // Default to US-CENTRAL1
    const [response, setResponse] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    // Simulate API request
    const handleTestRequest = () => {
        setIsLoading(true);
        setTimeout(() => {
            const mockResponse = {
                endpoint,
                query,
                status: "success",
                results: Math.floor(Math.random() * 100),
                timestamp: new Date().toISOString(),
            };
            setResponse(JSON.stringify(mockResponse, null, 2));
            setIsLoading(false);
        }, 1000);
    };
    return (_jsxs(Box, { p: 4, width: "100%", children: [_jsx(Text, { fontSize: "lg", fontWeight: "bold", mb: 4, children: "API Playground" }), _jsxs(Box, { mb: 6, children: [_jsx(Text, { fontSize: "md", fontWeight: "semibold", mb: 2, children: "Test Parameters" }), _jsxs(Flex, { direction: { base: "column", md: "row" }, gap: 4, children: [_jsxs(FormControl, { flex: "1", minW: "200px", children: [_jsx(FormLabel, { fontSize: "sm", children: "Search Query" }), _jsx(Input, { value: query, onChange: (e) => setQuery(e.target.value), placeholder: "Enter search query", size: "sm", isRequired: true })] }), _jsxs(FormControl, { flex: "1", minW: "200px", children: [_jsx(FormLabel, { fontSize: "sm", children: "Endpoint" }), _jsx(Select, { value: endpoint, onChange: (e) => setEndpoint(e.target.value), size: "sm", children: ENDPOINTS.map((ep) => (_jsx("option", { value: ep, children: ep }, ep))) })] }), _jsx(Box, { alignSelf: "flex-end", children: _jsx(Tooltip, { label: "Send test request", children: _jsx(Button, { size: "sm", colorScheme: "blue", onClick: handleTestRequest, isLoading: isLoading, isDisabled: !query.trim(), mt: { base: 0, md: 6 }, children: "Test" }) }) })] })] }), _jsxs(Box, { children: [_jsx(Text, { fontSize: "md", fontWeight: "semibold", mb: 2, children: "Response" }), isLoading ? (_jsx(Flex, { justify: "center", align: "center", h: "200px", children: _jsx(Spinner, { size: "xl", color: "blue.500" }) })) : (_jsx(Textarea, { value: response, readOnly: true, height: "300px", bg: "gray.700", color: "white", placeholder: "Response will appear here after testing", size: "sm", resize: "vertical" }))] })] }));
};
export default PlaygroundGSerp;
