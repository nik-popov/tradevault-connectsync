import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Container, Table, Thead, Tbody, Tr, Th, Td, Divider, Flex, useToast, Badge, Spinner, TableContainer, Input, Highlight } from "@chakra-ui/react";
import { useState, useEffect, useCallback, memo } from "react";
import { Link } from "@tanstack/react-router";
import debounce from "lodash/debounce"; // Install with: npm install lodash
const endpointData = {
    "SOUTHAMERICA-WEST1": "https://southamerica-west1-image-scraper-451516.cloudfunctions.net/main",
    "US-CENTRAL1": "https://us-central1-image-scraper-451516.cloudfunctions.net/main",
    "US-EAST1": "https://us-east1-image-scraper-451516.cloudfunctions.net/main",
    "US-EAST4": "https://us-east4-image-scraper-451516.cloudfunctions.net/main",
    "US-WEST1": "https://us-west1-image-scraper-451516.cloudfunctions.net/main",
    "EUROPE-WEST4": "https://europe-west4-image-scraper-451516.cloudfunctions.net/main"
};
const fetchEndpointHealth = async (url, timeout = 10000) => {
    const healthUrl = `${url}/health/google`;
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);
        const response = await fetch(healthUrl, {
            signal: controller.signal,
            cache: 'no-store',
            headers: { 'Accept': 'application/json' }
        });
        clearTimeout(timeoutId);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data || { status: 'unknown', device_id: 'N/A', public_ip: 'N/A' };
    }
    catch (error) {
        console.error(`Health check failed for ${url}:`, error);
        return null;
    }
};
const truncateUrl = (url, maxLength = 25) => url.length <= maxLength ? url : `${url.substring(0, maxLength)}...`;
const EndpointSettings = memo(({ endpointId, endpoints }) => {
    const toast = useToast();
    const [endpointList, setEndpointList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const targetEndpoints = endpointId
        ? [{ endpointId, url: endpointData[endpointId] || "Unknown" }]
        : endpoints || [];
    const updateEndpointStatus = useCallback(async (isManual = false) => {
        setIsRefreshing(true);
        try {
            const updatedEndpoints = await Promise.all(targetEndpoints.map(async (ep, index) => {
                const health = await fetchEndpointHealth(ep.url);
                return {
                    id: index + 1,
                    url: ep.url,
                    lastChecked: new Date().toLocaleTimeString(),
                    health: health || { status: "Fetch Failed", device_id: "N/A", public_ip: "N/A" },
                };
            }));
            setEndpointList(updatedEndpoints);
            if (isManual) {
                toast({
                    title: "Status Updated",
                    description: endpointId
                        ? `Health status for ${endpointId} refreshed`
                        : "Health status for all Google SERP endpoints refreshed",
                    status: "info",
                    duration: 3000,
                    isClosable: true,
                });
            }
        }
        finally {
            setIsRefreshing(false);
            if (endpointList.length === 0)
                setIsLoading(false);
        }
    }, [targetEndpoints, endpointId, toast, endpointList.length]);
    // Initial load
    useEffect(() => {
        if (endpointList.length === 0) {
            updateEndpointStatus();
        }
    }, [updateEndpointStatus, endpointList.length]);
    // Auto-refresh interval
    useEffect(() => {
        const interval = setInterval(() => updateEndpointStatus(false), 30000);
        return () => clearInterval(interval);
    }, [updateEndpointStatus]);
    const debouncedRefresh = useCallback(debounce(() => updateEndpointStatus(true), 2000, { leading: true, trailing: false }), [updateEndpointStatus]);
    const handleRefresh = () => {
        if (!isRefreshing) {
            debouncedRefresh();
        }
    };
    const filteredEndpoints = endpointList.filter((endpoint) => endpoint.url.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (endpoint.health?.device_id || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (endpoint.health?.public_ip || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (endpoint.health?.status || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        endpoint.lastChecked.toLowerCase().includes(searchTerm.toLowerCase()));
    const baseUrl = "https://laughing-telegram-4jjjw7wp9gxrc7v5v-5173.app.github.dev";
    return (_jsx(Container, { maxW: "full", py: 6, color: "white", children: _jsxs(Flex, { direction: "column", gap: 4, children: [_jsx(Flex, { justify: "space-between", align: "center", flexWrap: "wrap", gap: 4, children: _jsx(Flex, { gap: 4, children: _jsx(Input, { placeholder: "Search endpoints...", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), maxW: "300px", "aria-label": "Search endpoints", color: "white", borderColor: "gray.600", _hover: { borderColor: "gray.500" }, _focus: { borderColor: "blue.400" } }) }) }), _jsx(Divider, { my: 4, borderColor: "gray.600" }), isLoading ? (_jsx(Flex, { justify: "center", align: "center", h: "200px", children: _jsx(Spinner, { size: "xl", color: "blue.500" }) })) : (_jsx(TableContainer, { overflowX: "auto", overflowY: "auto", minHeight: "400px", children: _jsxs(Table, { variant: "simple", size: "sm", "aria-label": endpointId ? `Health Status for ${endpointId}` : "Google SERP Endpoint Health", color: "white", children: [_jsx(Thead, { position: "sticky", top: 0, zIndex: 1, children: _jsxs(Tr, { children: [_jsx(Th, { px: 2, py: 3, borderBottom: "1px", borderColor: "gray.600", w: "5%", color: "white", textAlign: "left", children: "#" }), _jsx(Th, { px: 2, py: 3, borderBottom: "1px", borderColor: "gray.600", w: "10%", textAlign: "center", color: "white", children: "Health" }), _jsx(Th, { px: 2, py: 3, borderBottom: "1px", borderColor: "gray.600", w: "12%", textAlign: "center", color: "white", children: "Last Checked" }), _jsx(Th, { px: 2, py: 3, borderBottom: "1px", borderColor: "gray.600", w: "20%", color: "white", children: "Endpoint" }), _jsx(Th, { px: 2, py: 3, borderBottom: "1px", borderColor: "gray.600", w: "15%", color: "white", children: "Device ID" }), _jsx(Th, { px: 2, py: 3, borderBottom: "1px", borderColor: "gray.600", w: "12%", color: "white", children: "Public IP" }), _jsx(Th, { px: 2, py: 3, borderBottom: "1px", borderColor: "gray.600", w: "18%", color: "white", children: "Status" })] }) }), _jsx(Tbody, { children: filteredEndpoints.map((endpoint) => {
                                    const epId = targetEndpoints.find((e) => e.url === endpoint.url)?.endpointId || endpointId || "unknown";
                                    const detailUrl = `${baseUrl}/scraping-api/endpoints/${epId}`;
                                    return (_jsxs(Tr, { children: [_jsx(Td, { px: 2, py: 2, borderBottom: "1px", borderColor: "gray.600", children: endpoint.id }), _jsx(Td, { px: 2, py: 2, borderBottom: "1px", borderColor: "gray.600", textAlign: "center", children: _jsx(Badge, { colorScheme: endpoint.health?.status.includes("reachable") ? "green" : "red", variant: "solid", children: _jsx(Highlight, { query: searchTerm, styles: { bg: "yellow.200", color: "black" }, children: endpoint.health?.status.includes("reachable") ? "Healthy" : "Unhealthy" }) }) }), _jsx(Td, { px: 2, py: 2, borderBottom: "1px", borderColor: "gray.600", textAlign: "center", children: _jsx(Link, { to: `/scraping-api/endpoints/${epId}`, style: { color: "blue.400", textDecoration: "underline" }, children: _jsx(Highlight, { query: searchTerm, styles: { bg: "yellow.200", color: "black" }, children: endpoint.lastChecked }) }) }), _jsx(Td, { px: 2, py: 2, borderBottom: "1px", borderColor: "gray.600", maxW: "200px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", children: _jsx(Highlight, { query: searchTerm, styles: { bg: "yellow.200", color: "black" }, children: truncateUrl(endpoint.url) }) }), _jsx(Td, { px: 2, py: 2, borderBottom: "1px", borderColor: "gray.600", children: _jsx(Highlight, { query: searchTerm, styles: { bg: "yellow.200", color: "black" }, children: endpoint.health?.device_id || "N/A" }) }), _jsx(Td, { px: 2, py: 2, borderBottom: "1px", borderColor: "gray.600", children: _jsx(Highlight, { query: searchTerm, styles: { bg: "yellow.200", color: "black" }, children: endpoint.health?.public_ip || "N/A" }) }), _jsx(Td, { px: 2, py: 2, borderBottom: "1px", borderColor: "gray.600", children: _jsx(Highlight, { query: searchTerm, styles: { bg: "yellow.200", color: "black" }, children: endpoint.health?.status || "Fetch Failed" }) })] }, endpoint.url));
                                }) })] }) }))] }) }));
}, (prevProps, nextProps) => {
    return prevProps.endpointId === nextProps.endpointId &&
        prevProps.endpoints === nextProps.endpoints;
});
EndpointSettings.displayName = 'EndpointSettings';
export default EndpointSettings;
