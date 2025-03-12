import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { Box, Text, Flex, Grid, Stat, StatLabel, StatNumber, Button, Table, Thead, Tbody, Tr, Th, Td, Spinner, ButtonGroup, Card, CardBody, IconButton, Tooltip, Select, } from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";
import { ResponsiveContainer, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, CartesianGrid, XAxis, YAxis, Tooltip as RechartsTooltip, Legend, } from "recharts";
const chartOptions = [
    { key: "requests", label: "Requests", color: "#805AD5", yLabel: "Requests" },
    { key: "successRate", label: "Success vs Error", color: "#38A169", yLabel: "Percentage (%)" },
    { key: "latency", label: "Avg Latency", color: "#DD6B20", yLabel: "Latency (ms)" },
    { key: "queryDistribution", label: "Query Distribution", color: "#C53030", yLabel: "Count" },
    { key: "cost", label: "Cost Trend", color: "#2B6CB0", yLabel: "Cost ($)" },
];
const PIE_COLORS = ["#805AD5", "#38A169", "#DD6B20", "#C53030", "#2B6CB0", "#D69E2E", "#9F7AEA", "#4A5568"];
const COMPARE_COLORS = ["#805AD5", "#E53E3E"];
const Overview = ({ endpointId }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [allEndpoints, setAllEndpoints] = useState([]);
    const [endpointData, setEndpointData] = useState(null);
    const [compareEndpointData, setCompareEndpointData] = useState(null);
    const [selectedChart, setSelectedChart] = useState("requests");
    const [selectedQuery, setSelectedQuery] = useState(null);
    const [showLabels, setShowLabels] = useState(true);
    const [compareEndpointId, setCompareEndpointId] = useState("");
    const fetchData = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch("https://s3.us-east-1.amazonaws.com/iconluxury.group/endpoint-overview.json", { cache: "no-store" });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setAllEndpoints(data);
            const primaryData = data.find((item) => item.endpoint === endpointId);
            if (!primaryData) {
                throw new Error(`Endpoint ${endpointId} not found in the data`);
            }
            setEndpointData(primaryData);
        }
        catch (err) {
            setError(err instanceof Error ? err.message : "Failed to fetch data");
            setEndpointData(null);
            setAllEndpoints([]);
        }
        finally {
            setIsLoading(false);
        }
    };
    useEffect(() => {
        fetchData();
    }, [endpointId]);
    useEffect(() => {
        if (compareEndpointId) {
            const compareData = allEndpoints.find((item) => item.endpoint === compareEndpointId);
            setCompareEndpointData(compareData || null);
        }
        else {
            setCompareEndpointData(null);
        }
    }, [compareEndpointId, allEndpoints]);
    useEffect(() => {
        setSelectedQuery(null);
    }, [selectedChart]);
    if (isLoading) {
        return _jsx(Flex, { justify: "center", align: "center", h: "200px", children: _jsx(Spinner, { size: "xl", color: "blue.500" }) });
    }
    if (error) {
        return (_jsxs(Box, { children: [_jsx(Text, { color: "red.500", children: error }), _jsx(Button, { mt: 2, onClick: fetchData, children: "Retry" })] }));
    }
    if (!endpointId || !endpointData) {
        return (_jsxs(Box, { p: 4, children: [_jsx(Text, { fontSize: "lg", fontWeight: "bold", mb: 4, children: "Overview" }), _jsx(Text, { color: "gray.400", children: "No endpoint specified or data available." })] }));
    }
    const calculateMetrics = (data) => {
        const processedRequests = Math.round((data.requestsToday || 0) * 0.9);
        const failedRequests = (data.requestsToday || 0) - processedRequests;
        const avgLatency = (data.queries || []).reduce((sum, q) => sum + (q.avgLatencyMs || 0), 0) / ((data.queries || []).length || 1);
        return { processedRequests, failedRequests, avgLatency };
    };
    const primaryMetrics = calculateMetrics(endpointData);
    const compareMetrics = compareEndpointData ? calculateMetrics(compareEndpointData) : null;
    const chartData = {
        requests: [
            { name: "Total Requests", value: endpointData.requestsToday || 0, compareValue: compareEndpointData?.requestsToday || 0 },
            { name: "Processed", value: primaryMetrics.processedRequests || 0, compareValue: compareMetrics?.processedRequests || 0 },
            { name: "Failed", value: primaryMetrics.failedRequests || 0, compareValue: compareMetrics?.failedRequests || 0 },
        ],
        successRate: [
            { name: "Success Rate", value: endpointData.successRate || 0, compareValue: compareEndpointData?.successRate || 0 },
            { name: "Error Rate", value: (100 - (endpointData.successRate || 0)), compareValue: compareEndpointData ? (100 - (compareEndpointData.successRate || 0)) : 0 },
        ],
        latency: [
            { name: "Avg Latency", value: primaryMetrics.avgLatency || 0, compareValue: compareMetrics?.avgLatency || 0 },
        ],
        queryDistribution: (endpointData.queries || []).reduce((acc, q) => {
            const existing = acc.find(item => item.name === (q.category || "Uncategorized"));
            if (existing) {
                existing.value += q.count || 0;
            }
            else {
                acc.push({ name: q.category || "Uncategorized", value: q.count || 0 });
            }
            return acc;
        }, [])
            .filter(item => item.value > 0),
        cost: (endpointData.timeSeries || []).map((ts) => ({
            name: ts.date,
            value: ts.cost || 0,
            compareValue: compareEndpointData?.timeSeries?.find(cts => cts.date === ts.date)?.cost || 0
        })),
    };
    const topQueries = [...(endpointData.queries || [])]
        .filter(q => (q.count || 0) > 0)
        .sort((a, b) => (b.count || 0) - (a.count || 0))
        .slice(0, 10);
    const renderSummary = () => {
        const stats = getSummaryStats(selectedChart);
        return (_jsx(CardBody, { children: stats.map((stat, index) => (_jsxs(Stat, { children: [_jsx(StatLabel, { children: stat.label }), _jsx(StatNumber, { children: stat.value })] }, index))) }));
    };
    const getSummaryStats = (selectedChart) => {
        const data = chartData[selectedChart] || [];
        if (selectedChart === "cost") {
            if (data.length === 0)
                return [];
            const latestPrimary = data[data.length - 1]?.value || 0;
            const latestCompare = compareEndpointData ? (data[data.length - 1]?.compareValue || 0) : null;
            const totalPrimary = data.reduce((sum, item) => sum + (item.value || 0), 0);
            const totalCompare = compareEndpointData ? data.reduce((sum, item) => sum + (item.compareValue || 0), 0) : null;
            const avgPrimary = totalPrimary / data.length;
            const avgCompare = compareEndpointData ? (totalCompare || 0) / data.length : null;
            let trendPrimary = "Stable";
            let trendCompare = "Stable";
            if (data.length > 1) {
                const prevPrimary = data.slice(0, -1).reduce((sum, item) => sum + (item.value || 0), 0) / (data.length - 1);
                trendPrimary = latestPrimary > prevPrimary ? "Increasing" : "Decreasing";
                if (compareEndpointData) {
                    const prevCompare = data.slice(0, -1).reduce((sum, item) => sum + (item.compareValue || 0), 0) / (data.length - 1);
                    trendCompare = (latestCompare || 0) > prevCompare ? "Increasing" : "Decreasing";
                }
            }
            const formatValue = (primary, compare) => compare !== null && compare !== undefined ? `${primary} / ${compare}` : primary;
            return [
                { label: "Latest Cost", value: formatValue(latestPrimary.toLocaleString(), latestCompare?.toLocaleString()) },
                { label: "Total Cost", value: formatValue(totalPrimary.toLocaleString(), totalCompare?.toLocaleString()) },
                { label: "Avg Daily Cost", value: formatValue(avgPrimary.toFixed(2), avgCompare?.toFixed(2)) },
                { label: "Trend", value: formatValue(trendPrimary, trendCompare) },
            ];
        }
        if (selectedChart === "queryDistribution") {
            const total = data.reduce((sum, item) => sum + item.value, 0);
            return data.map((item) => ({
                label: item.name,
                value: `${item.value.toLocaleString()} (${((item.value / total) * 100).toFixed(1)}%)`,
            }));
        }
        return data.map((item) => ({
            label: item.name,
            value: compareEndpointData
                ? `${(item.value || 0).toLocaleString()} / ${(item.compareValue || 0).toLocaleString()}`
                : (item.value || 0).toLocaleString(),
        }));
    };
    const selectedOption = chartOptions.find((opt) => opt.key === selectedChart) || chartOptions[0];
    const renderChart = () => {
        const data = chartData[selectedChart] || [];
        if (!data.length)
            return _jsx(Text, { children: "No data available for this chart" });
        const chartProps = {
            margin: { top: 20, right: 20, bottom: showLabels ? 60 : 20, left: showLabels ? 40 : 20 },
            children: [
                _jsx(CartesianGrid, { stroke: "gray.600" }, "grid"),
                _jsx(XAxis, { dataKey: "name", stroke: "#FFFFFF", tick: { fill: "#FFFFFF", fontSize: 12 }, tickMargin: 10, angle: selectedChart === "cost" ? -45 : 0, textAnchor: selectedChart === "cost" ? "end" : "middle", label: showLabels
                        ? { value: selectedChart === "cost" ? "Date" : "Metrics", position: "insideBottom", offset: -20, fill: "#FFFFFF" }
                        : undefined }, "xaxis"),
                _jsx(YAxis, { stroke: "#FFFFFF", tick: { fill: "#FFFFFF", fontSize: 12 }, tickMargin: 10, label: showLabels
                        ? { value: selectedOption.yLabel, angle: -45, position: "insideLeft", offset: -20, fill: "#FFFFFF" }
                        : undefined }, "yaxis"),
                _jsx(RechartsTooltip, { contentStyle: { backgroundColor: "gray.700", color: "white" } }, "tooltip"),
                _jsx(Legend, { verticalAlign: "top", height: 36 }, "legend"),
            ],
        };
        switch (selectedChart) {
            case "requests":
            case "successRate":
            case "latency":
                return (_jsxs(BarChart, { ...chartProps, data: data, children: [chartProps.children, _jsx(Bar, { dataKey: "value", fill: COMPARE_COLORS[0], name: endpointId }), compareEndpointData && (_jsx(Bar, { dataKey: "compareValue", fill: COMPARE_COLORS[1], name: compareEndpointData.endpoint }))] }));
            case "queryDistribution":
                return (_jsxs(PieChart, { children: [_jsx(Pie, { data: data, dataKey: "value", nameKey: "name", cx: "50%", cy: "50%", outerRadius: 120, label: showLabels ? ({ name, value }) => `${name}: ${value}` : false, labelLine: true, children: data.map((_, index) => (_jsx(Cell, { fill: PIE_COLORS[index % PIE_COLORS.length] }, `cell-${index}`))) }), _jsx(RechartsTooltip, { contentStyle: { backgroundColor: "gray.700", color: "white" } }), _jsx(Legend, { verticalAlign: "bottom", height: 36 })] }));
            case "cost":
                return (_jsxs(LineChart, { ...chartProps, data: data, children: [chartProps.children, _jsx(Line, { type: "monotone", dataKey: "value", stroke: COMPARE_COLORS[0], name: endpointId }), compareEndpointData && (_jsx(Line, { type: "monotone", dataKey: "compareValue", stroke: COMPARE_COLORS[1], name: compareEndpointData.endpoint }))] }));
            default:
                return _jsx(Text, { children: "Unknown chart type" }); // Fallback for invalid chart types
        }
    };
    return (_jsxs(Box, { p: 4, width: "100%", children: [_jsxs(Flex, { justify: "space-between", align: "center", mb: 4, wrap: "wrap", gap: 2, children: [_jsxs(Text, { fontSize: "lg", fontWeight: "bold", children: ["Overview for ", endpointId] }), _jsxs(Flex, { align: "center", gap: 2, children: [_jsx(Select, { size: "sm", placeholder: "Compare to...", value: compareEndpointId, onChange: (e) => setCompareEndpointId(e.target.value), width: "200px", children: allEndpoints
                                    .filter((item) => item.endpoint !== endpointId)
                                    .map((item) => (_jsx("option", { value: item.endpoint, children: item.endpoint }, item.endpoint))) }), _jsx(ButtonGroup, { size: "sm", variant: "outline", children: chartOptions.map((option) => (_jsx(Tooltip, { label: `View ${option.label}`, children: _jsx(Button, { bg: selectedChart === option.key ? option.color : "gray.600", color: selectedChart === option.key ? "white" : "gray.200", borderColor: option.color, _hover: { bg: `${option.color}80` }, onClick: () => setSelectedChart(option.key), children: option.label }) }, option.key))) }), _jsx(Tooltip, { label: "Refresh overview data", children: _jsx(Button, { size: "sm", colorScheme: "blue", onClick: fetchData, isLoading: isLoading, children: "Refresh" }) }), _jsx(Tooltip, { label: "Toggle chart labels", children: _jsx(Button, { size: "sm", colorScheme: showLabels ? "green" : "gray", onClick: () => setShowLabels(!showLabels), children: showLabels ? "Labels: On" : "Labels: Off" }) })] })] }), _jsxs(Grid, { templateColumns: { base: "1fr", md: "1fr 1fr" }, gap: 6, mb: 6, children: [_jsxs(Box, { children: [_jsx(Text, { fontSize: "md", fontWeight: "semibold", mb: 2, children: selectedOption.label }), _jsx(Box, { height: "400px", borderRadius: "md", overflow: "hidden", shadow: "md", bg: "gray.700", children: _jsx(ResponsiveContainer, { width: "100%", height: "100%", children: renderChart() }) })] }), _jsxs(Box, { children: [_jsxs(Text, { fontSize: "md", fontWeight: "semibold", mb: 2, children: [selectedQuery ? "Query Details" : `${selectedOption.label} Summary`, compareEndpointData && ` (vs ${compareEndpointData.endpoint})`] }), _jsxs(Card, { shadow: "md", borderWidth: "1px", bg: "gray.700", p: 4, position: "relative", children: [selectedQuery && (_jsx(IconButton, { "aria-label": "Back to summary", icon: _jsx(CloseIcon, {}), size: "sm", position: "absolute", top: 2, right: 2, onClick: () => setSelectedQuery(null), variant: "ghost" })), renderSummary()] })] })] }), topQueries.length > 0 && (_jsxs(Box, { mt: 6, children: [_jsx(Text, { fontSize: "md", fontWeight: "semibold", mb: 2, children: "Top Queries" }), _jsx(Box, { shadow: "md", borderWidth: "1px", borderRadius: "md", overflowX: "auto", children: _jsxs(Table, { variant: "simple", size: "sm", children: [_jsx(Thead, { children: _jsxs(Tr, { children: [_jsx(Th, { children: "Query" }), _jsx(Th, { children: "Category" }), _jsx(Th, { isNumeric: true, children: "Count" })] }) }), _jsx(Tbody, { children: topQueries.map((query, index) => (_jsxs(Tr, { onClick: () => setSelectedQuery(query), cursor: "pointer", _hover: { bg: "gray.600" }, bg: selectedQuery?.query === query.query ? "gray.600" : "transparent", children: [_jsx(Td, { children: query.query || "N/A" }), _jsx(Td, { children: query.category || "N/A" }), _jsx(Td, { isNumeric: true, children: (query.count || 0).toLocaleString() })] }, index))) })] }) })] }))] }));
};
export default Overview;
