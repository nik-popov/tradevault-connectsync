import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { Box, Text, Flex, Table, Thead, Tbody, Tr, Th, Td, Spinner, Button, Select, Tooltip, } from "@chakra-ui/react";
const mockLogs = Array.from({ length: 50 }, (_, i) => ({
    timestamp: new Date(Date.now() - i * 3600000).toISOString(),
    endpoint: ["SOUTHAMERICA-WEST1", "US-CENTRAL1", "US-EAST1"][Math.floor(Math.random() * 3)],
    query: ["best smartphones 2023", "weather forecast", "python programming"][Math.floor(Math.random() * 3)],
    status: Math.random() > 0.1 ? "success" : "error",
    responseTime: 100 + Math.floor(Math.random() * 400),
}));
const LogsGSerp = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [logs, setLogs] = useState([]);
    const [filter, setFilter] = useState("all");
    const fetchLogs = () => {
        setIsLoading(true);
        setTimeout(() => {
            setLogs(mockLogs);
            setIsLoading(false);
        }, 500);
    };
    useEffect(() => {
        fetchLogs();
    }, []);
    const filteredLogs = logs.filter((log) => filter === "all" || log.status === filter);
    return (_jsxs(Box, { p: 4, width: "100%", children: [_jsxs(Flex, { justify: "space-between", align: "center", mb: 4, children: [_jsx(Text, { fontSize: "lg", fontWeight: "bold", children: "API Request Logs" }), _jsxs(Flex, { gap: 2, children: [_jsxs(Select, { size: "sm", value: filter, onChange: (e) => setFilter(e.target.value), width: "150px", children: [_jsx("option", { value: "all", children: "All Statuses" }), _jsx("option", { value: "success", children: "Success Only" }), _jsx("option", { value: "error", children: "Errors Only" })] }), _jsx(Tooltip, { label: "Refresh logs", children: _jsx(Button, { size: "sm", colorScheme: "blue", onClick: fetchLogs, isLoading: isLoading, children: "Refresh" }) })] })] }), isLoading ? (_jsx(Flex, { justify: "center", align: "center", h: "200px", children: _jsx(Spinner, { size: "xl", color: "blue.500" }) })) : (_jsx(Box, { shadow: "md", borderWidth: "1px", borderRadius: "md", overflowX: "auto", children: _jsxs(Table, { variant: "simple", size: "sm", children: [_jsx(Thead, { children: _jsxs(Tr, { children: [_jsx(Th, { children: "Timestamp" }), _jsx(Th, { children: "Endpoint" }), _jsx(Th, { children: "Query" }), _jsx(Th, { children: "Status" }), _jsx(Th, { children: "Response Time" })] }) }), _jsx(Tbody, { children: filteredLogs.map((log, index) => (_jsxs(Tr, { bg: log.status === "error" ? "red.900" : "transparent", children: [_jsx(Td, { children: new Date(log.timestamp).toLocaleString() }), _jsx(Td, { children: log.endpoint }), _jsx(Td, { children: log.query }), _jsx(Td, { children: log.status }), _jsxs(Td, { children: [log.responseTime, " ms"] })] }, index))) })] }) }))] }));
};
export default LogsGSerp;
