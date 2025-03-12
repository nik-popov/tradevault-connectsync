import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect, useMemo, useCallback } from "react";
import { Box, Text, Flex, Grid, GridItem, Stat, StatLabel, StatNumber, Button, Table, Thead, Tbody, Tr, Th, Td, Spinner, ButtonGroup, Card, CardBody, IconButton, Tooltip, Alert, AlertIcon, } from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";
import { ResponsiveContainer, BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip as RechartsTooltip, } from "recharts";
import { debounce } from "lodash";
// Chart options with labels and colors
const chartOptions = [
    { key: "requestsOverTime", label: "Requests Over Time", color: "#805AD5", yAxisLabel: "Requests" },
    { key: "categoryDistribution", label: "Category Distribution", color: "#38A169", yAxisLabel: "Total Queries" },
    { key: "topQueries", label: "Top Queries", color: "#DD6B20", yAxisLabel: "Query Count" },
    { key: "successRate", label: "Success Rate", color: "#C53030", yAxisLabel: "Percentage (%)" },
    { key: "keyMetrics", label: "Key Metrics", color: "#D69E2E", yAxisLabel: "Value" },
];
// Comparison options for each chart type
const compareOptions = {
    requestsOverTime: [
        { value: "totalRequests", label: "Total Requests", color: "#805AD5" },
        { value: "avgHourly", label: "Avg Hourly Requests", color: "#9F7AEA" },
        { value: "maxHourly", label: "Max Hourly Requests", color: "#B794F4" },
        { value: "minHourly", label: "Min Hourly Requests", color: "#D6BCFA" },
    ],
    categoryDistribution: [
        { value: "totalQueries", label: "Total Queries", color: "#38A169" },
        { value: "avgPerCategory", label: "Avg Per Category", color: "#68D391" },
        { value: "maxCategory", label: "Max Category Count", color: "#9AE6B4" },
        { value: "uniqueCategories", label: "Unique Categories", color: "#C6F6D5" },
    ],
    topQueries: [
        { value: "queryCount", label: "Query Count", color: "#DD6B20" },
        { value: "avgQueryCount", label: "Avg Query Count", color: "#F6AD55" },
        { value: "maxQuery", label: "Max Query Count", color: "#FBD38D" },
        { value: "featuredQueries", label: "Featured Queries", color: "#FEEBC8" },
    ],
    successRate: [
        { value: "successRate", label: "Success Rate", color: "#C53030" },
        { value: "errorRate", label: "Error Rate", color: "#F56565" },
        { value: "avgSuccess", label: "Avg Success Rate", color: "#FC8181" },
        { value: "variance", label: "Success Variance", color: "#FEB2B2" },
    ],
    keyMetrics: [
        { value: "totalRequests", label: "Total Requests", color: "#D69E2E" },
        { value: "successRate", label: "Success Rate", color: "#ECC94B" },
        { value: "endpoints", label: "Endpoints", color: "#F6E05E" },
        { value: "avgRequests", label: "Avg Requests", color: "#FAF089" },
    ],
};
// Color palette for bar charts
const BAR_COLORS = ["#805AD5", "#38A169", "#DD6B20", "#C53030", "#D69E2E", "#9F7AEA", "#68D391", "#F6AD55", "#F56565", "#ECC94B"];
const OverviewGSerp = () => {
    // State declarations
    const [isLoading, setIsLoading] = useState(true);
    const [selectedChart, setSelectedChart] = useState("requestsOverTime");
    const [selectedQuery, setSelectedQuery] = useState(null);
    const [showLabels, setShowLabels] = useState(true);
    const [endpointData, setEndpointData] = useState([]);
    const [chartData, setChartData] = useState({});
    const [error, setError] = useState(null);
    const [compares, setCompares] = useState({
        requestsOverTime: [],
        categoryDistribution: [],
        topQueries: [],
        successRate: [],
        keyMetrics: [],
    });
    // Memoized total requests calculation
    const totalRequests = useMemo(() => {
        return endpointData.reduce((sum, ep) => sum + ep.requestsToday, 0);
    }, [endpointData]);
    // Data fetching function
    const fetchData = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch("https://s3.us-east-1.amazonaws.com/iconluxury.group/google-serp-overview.json");
            if (!response.ok)
                throw new Error("Failed to fetch data");
            const data = await response.json();
            // Validate data structure
            if (!Array.isArray(data) || !data.every(ep => 'endpoint' in ep && 'queries' in ep)) {
                throw new Error("Invalid data format");
            }
            // Enhance queries with endpoint-specific details
            const enhancedData = data.map((endpoint) => ({
                ...endpoint,
                queries: endpoint.queries.map((query) => ({
                    ...query,
                    endpointDetails: data
                        .filter((ep) => ep.queries.some((q) => q.query === query.query))
                        .map((ep) => ({
                        endpoint: ep.endpoint,
                        count: ep.queries.find((q) => q.query === query.query).count,
                    })),
                })),
            }));
            setEndpointData(enhancedData);
            // Prepare chart data
            const totalSuccess = enhancedData.reduce((sum, ep) => sum + ep.requestsToday * ep.successRate, 0);
            const overallSuccessRate = totalRequests > 0 ? totalSuccess / totalRequests : 0;
            // Requests Over Time
            const requestsOverTime = Array.from({ length: 24 }, (_, i) => {
                const hour = `${i}:00`;
                const total = enhancedData
                    .flatMap((ep) => ep.queries)
                    .reduce((sum, q) => sum + (q.timeSeries?.find((ts) => ts.hour === hour)?.count || 0), 0);
                return { hour, value: total };
            });
            // Category Distribution
            const categoryMap = new Map();
            enhancedData.flatMap((ep) => ep.queries).forEach((q) => {
                categoryMap.set(q.category, (categoryMap.get(q.category) || 0) + q.count);
            });
            const categoryDistribution = Array.from(categoryMap.entries()).map(([category, count]) => ({
                name: category,
                value: count,
            }));
            // Top Queries
            const queryMap = new Map();
            enhancedData.flatMap((ep) => ep.queries).forEach((q) => {
                queryMap.set(q.query, (queryMap.get(q.query) || 0) + q.count);
            });
            const topQueriesChart = Array.from(queryMap.entries())
                .sort((a, b) => b[1] - a[1])
                .slice(0, 10)
                .map(([query, count]) => ({ name: query, value: count }));
            // Success Rate
            const successRate = enhancedData.map((ep) => ({
                name: ep.endpoint,
                value: ep.successRate * 100, // Convert to percentage
            }));
            // Key Metrics
            const keyMetrics = [
                { name: "Total Requests", value: totalRequests },
                { name: "Success Rate", value: overallSuccessRate * 100 }, // Convert to percentage
                { name: "Endpoints", value: enhancedData.length },
            ];
            setChartData({
                requestsOverTime,
                categoryDistribution,
                topQueries: topQueriesChart,
                successRate,
                keyMetrics,
            });
        }
        catch (error) {
            console.error("Error fetching data:", error);
            setEndpointData([]);
            setChartData({});
            setError("Failed to load data. Please try again later.");
        }
        finally {
            setIsLoading(false);
        }
    }, [totalRequests]);
    // Fetch data on mount
    useEffect(() => {
        fetchData();
    }, [fetchData]);
    // Reset selected query when chart changes
    useEffect(() => {
        setSelectedQuery(null);
    }, [selectedChart]);
    const updateChartData = useMemo(() => {
        const updatedData = { ...chartData };
        Object.keys(compares).forEach((chartKey) => {
            const selectedCompares = compares[chartKey];
            const baseData = chartData[chartKey] || [];
            const additionalData = []; // Explicit type annotation
            if (chartKey === "requestsOverTime") {
                const avgHourly = baseData.reduce((sum, d) => sum + d.value, 0) / 24;
                const maxHourly = Math.max(...baseData.map((d) => d.value));
                const minHourly = Math.min(...baseData.map((d) => d.value));
                selectedCompares.forEach((compare) => {
                    additionalData.push({
                        name: compareOptions[chartKey].find((opt) => opt.value === compare).label,
                        value: compare === "totalRequests" ? totalRequests :
                            compare === "avgHourly" ? avgHourly :
                                compare === "maxHourly" ? maxHourly :
                                    minHourly,
                    });
                });
                updatedData[chartKey] = selectedCompares.length ? additionalData : baseData;
            }
            else if (chartKey === "categoryDistribution") {
                const additionalData = []; // Explicit type annotation
                const totalQueries = baseData.reduce((sum, d) => sum + d.value, 0);
                const avgPerCategory = totalQueries / baseData.length;
                const maxCategory = Math.max(...baseData.map((d) => d.value));
                const uniqueCategories = baseData.length;
                selectedCompares.forEach((compare) => {
                    additionalData.push({
                        name: compareOptions[chartKey].find((opt) => opt.value === compare).label,
                        value: compare === "totalQueries" ? totalQueries :
                            compare === "avgPerCategory" ? avgPerCategory :
                                compare === "maxCategory" ? maxCategory :
                                    uniqueCategories,
                    });
                });
                updatedData[chartKey] = [...baseData, ...additionalData];
            }
            else if (chartKey === "topQueries") {
                const additionalData = []; // Explicit type annotation
                const totalQueryCount = baseData.reduce((sum, d) => sum + d.value, 0);
                const avgQueryCount = totalQueryCount / baseData.length;
                const maxQuery = Math.max(...baseData.map((d) => d.value));
                const featuredQueries = endpointData.flatMap((ep) => ep.queries).filter((q) => q.featured).length;
                selectedCompares.forEach((compare) => {
                    additionalData.push({
                        name: compareOptions[chartKey].find((opt) => opt.value === compare).label,
                        value: compare === "queryCount" ? totalQueryCount :
                            compare === "avgQueryCount" ? avgQueryCount :
                                compare === "maxQuery" ? maxQuery :
                                    featuredQueries,
                    });
                });
                updatedData[chartKey] = [...baseData, ...additionalData];
            }
            else if (chartKey === "successRate") {
                const additionalData = []; // Explicit type annotation
                const overallSuccessRate = totalRequests > 0 ? (endpointData.reduce((sum, ep) => sum + ep.requestsToday * ep.successRate, 0) / totalRequests) * 100 : 0;
                const avgSuccess = baseData.reduce((sum, d) => sum + d.value, 0) / baseData.length;
                const variance = Math.sqrt(baseData.reduce((sum, d) => sum + Math.pow(d.value - avgSuccess, 2), 0) / baseData.length);
                selectedCompares.forEach((compare) => {
                    additionalData.push({
                        name: compareOptions[chartKey].find((opt) => opt.value === compare).label,
                        value: compare === "successRate" ? overallSuccessRate :
                            compare === "errorRate" ? 100 - overallSuccessRate :
                                compare === "avgSuccess" ? avgSuccess :
                                    variance,
                    });
                });
                updatedData[chartKey] = [...baseData, ...additionalData];
            }
            else if (chartKey === "keyMetrics") {
                const additionalData = []; // Explicit type annotation
                const avgRequests = totalRequests / endpointData.length;
                selectedCompares.forEach((compare) => {
                    additionalData.push({
                        name: compareOptions[chartKey].find((opt) => opt.value === compare).label,
                        value: compare === "totalRequests" ? totalRequests :
                            compare === "successRate" ? baseData.find((d) => d.name === "Success Rate")?.value || 0 :
                                compare === "endpoints" ? endpointData.length :
                                    avgRequests,
                    });
                });
                updatedData[chartKey] = [...baseData, ...additionalData];
            }
        });
        return updatedData;
    }, [chartData, compares, endpointData, totalRequests]);
    // Aggregate top queries
    const queryAggregation = new Map();
    endpointData.forEach((ep) => {
        ep.queries.forEach((q) => {
            const existing = queryAggregation.get(q.query) || { count: 0, id: q.id, featured: q.featured, category: q.category, type: q.type, endpointDetails: [] };
            queryAggregation.set(q.query, {
                count: existing.count + q.count,
                id: existing.id,
                featured: existing.featured,
                category: existing.category,
                type: existing.type,
                endpointDetails: [...existing.endpointDetails, { endpoint: ep.endpoint, count: q.count }],
            });
        });
    });
    const topQueries = Array.from(queryAggregation.entries())
        .map(([query, data]) => ({
        id: data.id,
        query,
        count: data.count,
        featured: data.featured,
        category: data.category,
        type: data.type,
        endpointDetails: data.endpointDetails,
    }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);
    // Calculate summary statistics
    const getSummaryStats = (selectedChart) => {
        const data = chartData[selectedChart] || [];
        if (!data.length)
            return [];
        switch (selectedChart) {
            case "requestsOverTime":
                const avgHourly = data.reduce((sum, d) => sum + d.value, 0) / 24;
                const maxHourly = Math.max(...data.map((d) => d.value));
                const minHourly = Math.min(...data.map((d) => d.value));
                return [
                    { label: "Total Requests", value: totalRequests.toLocaleString() },
                    { label: "Avg Hourly Requests", value: avgHourly.toFixed(2) },
                    { label: "Max Hourly Requests", value: maxHourly.toLocaleString() },
                    { label: "Min Hourly Requests", value: minHourly.toLocaleString() },
                ];
            case "categoryDistribution":
                const totalQueries = data.reduce((sum, d) => sum + d.value, 0);
                const avgPerCategory = totalQueries / data.length;
                const maxCategory = Math.max(...data.map((d) => d.value));
                const uniqueCategories = data.length;
                return [
                    { label: "Total Queries", value: totalQueries.toLocaleString() },
                    { label: "Avg Per Category", value: avgPerCategory.toFixed(2) },
                    { label: "Max Category Count", value: maxCategory.toLocaleString() },
                    { label: "Unique Categories", value: uniqueCategories.toLocaleString() },
                ];
            case "topQueries":
                const totalQueryCount = data.reduce((sum, d) => sum + d.value, 0);
                const avgQueryCount = totalQueryCount / data.length;
                const maxQuery = Math.max(...data.map((d) => d.value));
                const featuredQueries = endpointData.flatMap((ep) => ep.queries).filter((q) => q.featured).length;
                return [
                    { label: "Query Count", value: totalQueryCount.toLocaleString() },
                    { label: "Avg Query Count", value: avgQueryCount.toFixed(2) },
                    { label: "Max Query Count", value: maxQuery.toLocaleString() },
                    { label: "Featured Queries", value: featuredQueries.toLocaleString() },
                ];
            case "successRate":
                const overallSuccessRate = totalRequests > 0 ? (endpointData.reduce((sum, ep) => sum + ep.requestsToday * ep.successRate, 0) / totalRequests) * 100 : 0;
                const avgSuccess = data.reduce((sum, d) => sum + d.value, 0) / data.length;
                const variance = Math.sqrt(data.reduce((sum, d) => sum + Math.pow(d.value - avgSuccess, 2), 0) / data.length);
                return [
                    { label: "Overall Success Rate", value: `${overallSuccessRate.toFixed(2)}%` },
                    { label: "Error Rate", value: `${(100 - overallSuccessRate).toFixed(2)}%` },
                    { label: "Avg Success Rate", value: `${avgSuccess.toFixed(2)}%` },
                    { label: "Success Variance", value: variance.toFixed(2) },
                ];
            case "keyMetrics":
                const avgRequests = totalRequests / endpointData.length;
                return [
                    { label: "Total Requests", value: totalRequests.toLocaleString() },
                    { label: "Success Rate", value: `${data.find((d) => d.name === "Success Rate")?.value.toFixed(2) || 0}%` },
                    { label: "Endpoints", value: endpointData.length.toLocaleString() },
                    { label: "Avg Requests", value: avgRequests.toFixed(2) },
                ];
            default:
                return [];
        }
    };
    // Render summary section
    const renderSummary = () => {
        const stats = getSummaryStats(selectedChart);
        const summaryContent = selectedQuery ? (_jsxs(_Fragment, { children: [_jsxs(Text, { children: [_jsx("strong", { children: "Query:" }), " ", selectedQuery.query] }), _jsxs(Text, { children: [_jsx("strong", { children: "Total Count:" }), " ", selectedQuery.count] }), _jsxs(Text, { children: [_jsx("strong", { children: "Category:" }), " ", selectedQuery.category] }), _jsxs(Text, { children: [_jsx("strong", { children: "Type:" }), " ", selectedQuery.type] }), _jsxs(Text, { children: [_jsx("strong", { children: "Featured:" }), " ", selectedQuery.featured ? "Yes" : "No"] }), selectedQuery.endpointDetails && (_jsxs(Box, { mt: 2, children: [_jsx(Text, { fontSize: "sm", fontWeight: "semibold", children: "Endpoint Breakdown:" }), selectedQuery.endpointDetails.map((detail, idx) => (_jsxs(Text, { fontSize: "sm", children: [detail.endpoint, ": ", detail.count] }, idx)))] }))] })) : (_jsx(Grid, { templateColumns: "repeat(4, 1fr)", gap: 4, children: stats.map((stat, index) => (_jsxs(Stat, { children: [_jsx(StatLabel, { color: "gray.400", children: stat.label }), _jsx(StatNumber, { fontSize: "xl", children: stat.value })] }, index))) }));
        return (_jsxs(_Fragment, { children: [_jsx(Text, { fontSize: "md", fontWeight: "semibold", mb: 2, children: selectedQuery ? "Query Details" : `${chartOptions.find((opt) => opt.key === selectedChart).label} Summary` }), _jsxs(Card, { shadow: "md", borderWidth: "1px", bg: "gray.700", minHeight: "150px", position: "relative", children: [selectedQuery && (_jsx(IconButton, { "aria-label": "Back to summary", icon: _jsx(CloseIcon, {}), size: "sm", position: "absolute", top: 2, right: 2, onClick: () => setSelectedQuery(null), variant: "ghost" })), _jsx(CardBody, { children: summaryContent })] })] }));
    };
    // Toggle comparison metrics
    const toggleCompare = useCallback((chartKey, value) => {
        setCompares((prev) => ({
            ...prev,
            [chartKey]: prev[chartKey].includes(value)
                ? prev[chartKey].filter((v) => v !== value)
                : [...prev[chartKey], value],
        }));
    }, []);
    // Get selected chart options
    const selectedOption = chartOptions.find((opt) => opt.key === selectedChart);
    const selectedColor = selectedOption.color;
    const yAxisLabel = selectedOption.yAxisLabel;
    const chunkArray = (array, size) => {
        const result = []; // Explicit type annotation
        for (let i = 0; i < array.length; i += size) {
            result.push(array.slice(i, i + size));
        }
        return result;
    };
    const compareRows = chunkArray(compareOptions[selectedChart], 4);
    return (_jsxs(Box, { p: 4, width: "100%", children: [_jsxs(Flex, { justify: "space-between", align: "center", mb: 4, wrap: "wrap", gap: 2, children: [_jsx(Text, { fontSize: "lg", fontWeight: "bold", children: "OverviewGSerp" }), _jsxs(Flex, { align: "center", gap: 2, ml: "auto", children: [_jsx(ButtonGroup, { size: "sm", variant: "outline", children: chartOptions.map((option) => (_jsx(Tooltip, { label: `View ${option.label}`, children: _jsx(Button, { "aria-label": `View ${option.label}`, bg: selectedChart === option.key ? option.color : "gray.700", color: selectedChart === option.key ? "white" : "gray.200", borderColor: option.color, _hover: { bg: `${option.color}80` }, onClick: () => setSelectedChart(option.key), children: option.label }) }, option.key))) }), _jsx(Tooltip, { label: "Refresh overview data immediately", children: _jsx(Button, { size: "sm", colorScheme: "blue", onClick: debounce(fetchData, 500), isLoading: isLoading, children: "Refresh Now" }) }), _jsx(Tooltip, { label: "Toggle chart labels", children: _jsx(Button, { size: "sm", colorScheme: showLabels ? "green" : "gray", onClick: () => setShowLabels(!showLabels), children: showLabels ? "Labels: On" : "Labels: Off" }) })] })] }), isLoading ? (_jsxs(Flex, { justify: "center", align: "center", h: "200px", flexDirection: "column", gap: 4, children: [_jsx(Spinner, { size: "xl", color: "blue.500" }), _jsx(Text, { children: "Loading SERP data..." })] })) : error ? (_jsxs(Alert, { status: "error", borderRadius: "md", children: [_jsx(AlertIcon, {}), error] })) : (_jsxs(_Fragment, { children: [_jsxs(Grid, { templateColumns: { base: "1fr", md: "1fr 1fr" }, gap: 6, mb: 6, alignItems: "start", children: [_jsxs(GridItem, { children: [_jsx(Text, { fontSize: "md", fontWeight: "semibold", mb: 2, children: selectedOption.label }), _jsx(Box, { height: "400px", borderRadius: "md", overflow: "hidden", shadow: "md", bg: "gray.700", children: _jsx(ResponsiveContainer, { width: "100%", height: "100%", children: _jsxs(BarChart, { data: updateChartData[selectedChart], margin: { top: 20, right: 20, bottom: showLabels ? 60 : 20, left: showLabels ? 40 : 20 }, children: [_jsx(CartesianGrid, { stroke: "gray.600" }), _jsx(XAxis, { dataKey: selectedChart === "requestsOverTime" && !compares[selectedChart].length ? "hour" : "name", stroke: "#FFFFFF", tick: { fill: "#FFFFFF", fontSize: 12, dy: -10 }, tickMargin: 10, interval: "preserveStartEnd", label: showLabels
                                                            ? {
                                                                value: selectedChart === "requestsOverTime" && !compares[selectedChart].length
                                                                    ? "Time (Hour)"
                                                                    : selectedChart === "keyMetrics"
                                                                        ? "Metrics"
                                                                        : selectedChart === "categoryDistribution"
                                                                            ? "Categories"
                                                                            : selectedChart === "successRate"
                                                                                ? "Endpoints"
                                                                                : "Queries",
                                                                position: "insideBottom",
                                                                offset: -20,
                                                                fill: "#FFFFFF",
                                                                fontSize: 14,
                                                            }
                                                            : undefined }), _jsx(YAxis, { stroke: "#FFFFFF", tick: { fill: "#FFFFFF", fontSize: 12 }, tickMargin: 10, domain: selectedChart === "successRate" ? [0, 100] : undefined, label: showLabels
                                                            ? { value: yAxisLabel, angle: -45, position: "insideLeft", offset: -20, fill: "#FFFFFF", fontSize: 14 }
                                                            : undefined }), _jsx(RechartsTooltip, { contentStyle: { backgroundColor: "gray.700", color: "white" } }), _jsx(Bar, { dataKey: "value", fill: selectedColor })] }) }) })] }), _jsxs(GridItem, { children: [renderSummary(), selectedChart !== "requestsOverTime" && (_jsxs(Box, { mt: 6, children: [_jsx(Text, { fontSize: "md", fontWeight: "semibold", mb: 2, children: "Compare To" }), _jsx(Flex, { direction: "column", gap: 2, children: compareRows.map((row, rowIndex) => (_jsx(ButtonGroup, { size: "sm", variant: "outline", isAttached: false, children: row.map((option) => (_jsx(Button, { bg: compares[selectedChart].includes(option.value) ? option.color : "gray.600", color: compares[selectedChart].includes(option.value) ? "white" : "gray.200", borderColor: option.color, _hover: { bg: `${option.color}80` }, onClick: () => toggleCompare(selectedChart, option.value), children: option.label }, option.value))) }, rowIndex))) })] }))] })] }), _jsxs(Box, { mt: 6, children: [_jsx(Text, { fontSize: "md", fontWeight: "semibold", mb: 2, children: "Top Search Queries" }), _jsx(Box, { shadow: "md", borderWidth: "1px", borderRadius: "md", overflowX: "auto", children: _jsxs(Table, { variant: "simple", size: "sm", children: [_jsx(Thead, { children: _jsxs(Tr, { children: [_jsx(Th, { children: "Query" }), _jsx(Th, { children: "Count" }), _jsx(Th, { children: "Category" }), _jsx(Th, { children: "Type" }), _jsx(Th, { children: "Featured" })] }) }), _jsx(Tbody, { children: topQueries.map((query, index) => (_jsxs(Tr, { onClick: () => setSelectedQuery(query), cursor: "pointer", _hover: { bg: "gray.600" }, bg: selectedQuery?.query === query.query ? "gray.600" : "transparent", children: [_jsx(Td, { children: query.query }), _jsx(Td, { children: query.count }), _jsx(Td, { children: query.category }), _jsx(Td, { children: query.type }), _jsx(Td, { children: query.featured ? "Yes" : "No" })] }, index))) })] }) })] })] }))] }));
};
export default OverviewGSerp;
