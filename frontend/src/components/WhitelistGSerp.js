import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// components/WhitelistGSerp.tsx
import { useState, useEffect } from "react";
import { Box, Text, Table, Thead, Tbody, Tr, Th, Td, Spinner, Flex } from "@chakra-ui/react";
const WhitelistGSerp = () => {
    const [domains, setDomains] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sortConfig, setSortConfig] = useState({
        key: "positiveSortOrderCount",
        direction: "desc",
    });
    useEffect(() => {
        const fetchDomains = async () => {
            try {
                const response = await fetch("https://backend-dev.iconluxury.group/api/whitelist-domains", {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                });
                if (!response.ok) {
                    throw new Error(`Failed to fetch domains: ${response.status}`);
                }
                const data = await response.json();
                console.log("Fetched domains:", data);
                setDomains(data);
                setIsLoading(false);
            }
            catch (error) {
                console.error("Error fetching domains:", error);
                setError("Failed to load data from the server.");
                setIsLoading(false);
            }
        };
        fetchDomains();
    }, []);
    // Sort domains based on sortConfig
    const sortedDomains = [...domains].sort((a, b) => {
        const { key, direction } = sortConfig;
        if (key === "domain") {
            const aValue = a.domain.toLowerCase();
            const bValue = b.domain.toLowerCase();
            return direction === "asc"
                ? aValue.localeCompare(bValue)
                : bValue.localeCompare(aValue);
        }
        else {
            const aValue = a[key];
            const bValue = b[key];
            return direction === "asc" ? aValue - bValue : bValue - aValue;
        }
    });
    // Handle column sorting
    const handleSort = (key) => {
        setSortConfig((prev) => {
            const newDirection = prev.key === key && prev.direction === "asc" ? "desc" : "asc";
            return { key, direction: newDirection };
        });
    };
    if (isLoading) {
        return (_jsx(Flex, { justify: "center", align: "center", height: "200px", children: _jsx(Spinner, { size: "xl" }) }));
    }
    if (error) {
        return (_jsxs(Box, { children: [_jsx(Text, { fontSize: "lg", fontWeight: "bold", mb: 4, children: "Whitelist Domains" }), _jsx(Text, { color: "red.500", children: error })] }));
    }
    return (_jsxs(Box, { children: [_jsx(Text, { fontSize: "lg", fontWeight: "bold", mb: 4, children: "Whitelist Domains" }), sortedDomains.length === 0 ? (_jsx(Text, { children: "No data available." })) : (_jsxs(Table, { variant: "simple", children: [_jsx(Thead, { children: _jsxs(Tr, { children: [_jsxs(Th, { onClick: () => handleSort("domain"), cursor: "pointer", children: ["Domain ", sortConfig.key === "domain" && (sortConfig.direction === "asc" ? "↑" : "↓")] }), _jsxs(Th, { onClick: () => handleSort("totalResults"), cursor: "pointer", children: ["Total Results ", sortConfig.key === "totalResults" && (sortConfig.direction === "asc" ? "↑" : "↓")] }), _jsxs(Th, { onClick: () => handleSort("positiveSortOrderCount"), cursor: "pointer", children: ["Positive Sort Orders Count", " ", sortConfig.key === "positiveSortOrderCount" && (sortConfig.direction === "asc" ? "↑" : "↓")] })] }) }), _jsx(Tbody, { children: sortedDomains.map(({ domain, totalResults, positiveSortOrderCount }) => (_jsxs(Tr, { children: [_jsx(Td, { children: domain }), _jsx(Td, { children: totalResults }), _jsx(Td, { children: positiveSortOrderCount })] }, domain))) })] }))] }));
};
export default WhitelistGSerp;
