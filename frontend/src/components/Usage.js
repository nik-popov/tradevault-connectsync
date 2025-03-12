import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, Text, Stat, StatLabel, StatNumber, StatHelpText, SimpleGrid } from "@chakra-ui/react";
// Simulated data for different endpoints
const endpointUsageData = {
    "SOUTHAMERICA-WEST1": {
        requestsToday: 1200,
        requestsThisMonth: 36000,
        successRate: 98.7,
        gigsUsedToday: 2.0,
        gigsUsedThisMonth: 60.0,
        costPerGigabyte: 0.05,
    },
    "US-CENTRAL1": {
        requestsToday: 1800,
        requestsThisMonth: 54000,
        successRate: 99.2,
        gigsUsedToday: 2.8,
        gigsUsedThisMonth: 84.0,
        costPerGigabyte: 0.04,
    },
    "US-EAST1": {
        requestsToday: 1500,
        requestsThisMonth: 45000,
        successRate: 99.0,
        gigsUsedToday: 2.5,
        gigsUsedThisMonth: 75.0,
        costPerGigabyte: 0.045,
    },
    "US-EAST4": {
        requestsToday: 13080,
        requestsThisMonth: 349000,
        successRate: 98.8,
        gigsUsedToday: 20.3,
        gigsUsedThisMonth: 690.0,
        costPerGigabyte: 0.043,
    },
    "US-WEST1": {
        requestsToday: 1000,
        requestsThisMonth: 30000,
        successRate: 98.9,
        gigsUsedToday: 1.9,
        gigsUsedThisMonth: 57.0,
        costPerGigabyte: 0.06,
    },
    "EUROPE-WEST4": {
        requestsToday: 1100,
        requestsThisMonth: 33000,
        successRate: 99.1,
        gigsUsedToday: 2.1,
        gigsUsedThisMonth: 63.0,
        costPerGigabyte: 0.048,
    },
    "G-IMAGE-SERP-EUROPE-WEST1": {
        requestsToday: 900,
        requestsThisMonth: 27000,
        successRate: 97.5,
        gigsUsedToday: 1.5,
        gigsUsedThisMonth: 45.0,
        costPerGigabyte: 0.06,
    },
    "G-IMAGE-SERP-US-CENTRAL1": {
        requestsToday: 1100,
        requestsThisMonth: 33000,
        successRate: 98.0,
        gigsUsedToday: 1.8,
        gigsUsedThisMonth: 54.0,
        costPerGigabyte: 0.05,
    },
};
const Usage = ({ toolId }) => {
    // Case 1: No toolId provided
    if (!toolId) {
        return (_jsxs(Box, { p: 4, children: [_jsx(Text, { fontSize: "lg", fontWeight: "bold", mb: 4, children: "Usage" }), _jsx(Text, { color: "gray.500", children: "No endpoint specified." })] }));
    }
    // Fetch usage data for the given toolId
    const usageData = endpointUsageData[toolId];
    // Case 2: toolId provided but no data available
    if (!usageData) {
        return (_jsxs(Box, { p: 4, children: [_jsxs(Text, { fontSize: "lg", fontWeight: "bold", mb: 4, children: ["Usage for ", toolId] }), _jsx(Text, { color: "gray.500", children: "No data available for this endpoint." })] }));
    }
    // Case 3: Data available, display usage statistics
    return (_jsxs(Box, { p: 4, children: [_jsxs(Text, { fontSize: "lg", fontWeight: "bold", mb: 4, children: ["Usage for ", toolId] }), _jsxs(SimpleGrid, { columns: { base: 1, md: 2, lg: 3 }, spacing: 6, children: [_jsxs(Stat, { children: [_jsx(StatLabel, { children: "Requests Today" }), _jsx(StatNumber, { children: usageData.requestsToday.toLocaleString() }), _jsx(StatHelpText, { children: "Daily usage" })] }), _jsxs(Stat, { children: [_jsx(StatLabel, { children: "Requests This Month" }), _jsx(StatNumber, { children: usageData.requestsThisMonth.toLocaleString() }), _jsx(StatHelpText, { children: "Monthly total" })] }), _jsxs(Stat, { children: [_jsx(StatLabel, { children: "Success Rate" }), _jsxs(StatNumber, { children: [usageData.successRate, "%"] }), _jsx(StatHelpText, { children: "Request success" })] }), _jsxs(Stat, { children: [_jsx(StatLabel, { children: "Gigabytes Used Today" }), _jsxs(StatNumber, { children: [usageData.gigsUsedToday.toFixed(1), " GB"] }), _jsx(StatHelpText, { children: "Daily data usage" })] }), _jsxs(Stat, { children: [_jsx(StatLabel, { children: "Gigabytes Used This Month" }), _jsxs(StatNumber, { children: [usageData.gigsUsedThisMonth.toFixed(1), " GB"] }), _jsx(StatHelpText, { children: "Monthly data usage" })] }), _jsxs(Stat, { children: [_jsx(StatLabel, { children: "Cost Per Gigabyte" }), _jsxs(StatNumber, { children: ["$", usageData.costPerGigabyte.toFixed(2)] }), _jsx(StatHelpText, { children: "Rate per GB" })] })] })] }));
};
export default Usage;
