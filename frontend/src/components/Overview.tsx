import React, { useState, useEffect } from "react";
import {
  Box,
  Text,
  Flex,
  Grid,
  GridItem,
  Stat,
  StatLabel,
  StatNumber,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Spinner,
  ButtonGroup,
  Card,
  CardBody,
  IconButton,
  Tooltip,
} from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
} from "recharts";

// TypeScript interfaces
interface Query {
  query: string;
  count: number;
  category?: string;
}

interface EndpointData {
  endpoint: string;
  requestsToday: number;
  totalQueries: number;
  successRate: number;
  queries: Query[];
  gigsUsedToday: number;
  costToday: number;
}

// Initial endpoint data
const initialEndpointData: EndpointData[] = [
  {
    endpoint: "SOUTHAMERICA-WEST1",
    requestsToday: 1200,
    totalQueries: 1200,
    successRate: 98.7,
    queries: [
      { query: "search term 1", count: 450 },
      { query: "search term 2", count: 400 },
      { query: "search term 3", count: 350 },
    ],
    gigsUsedToday: 2.0,
    costToday: 0.10,
  },
  {
    endpoint: "US-CENTRAL1",
    requestsToday: 1800,
    totalQueries: 675,
    successRate: 99.2,
    queries: [
      { query: "search term 1", count: 253 },
      { query: "search term 2", count: 225 },
      { query: "search term 3", count: 197 },
    ],
    gigsUsedToday: 2.8,
    costToday: 0.112,
  },
  {
    endpoint: "US-EAST1",
    requestsToday: 1500,
    totalQueries: 562,
    successRate: 99.0,
    queries: [
      { query: "search term 1", count: 211 },
      { query: "search term 2", count: 187 },
      { query: "search term 4", count: 164 },
    ],
    gigsUsedToday: 2.5,
    costToday: 0.1125,
  },
  {
    endpoint: "US-EAST4",
    requestsToday: 13080,
    totalQueries: 4905,
    successRate: 98.8,
    queries: [
      { query: "search term 1", count: 1839 },
      { query: "search term 2", count: 1633 },
      { query: "search term 4", count: 1433 },
    ],
    gigsUsedToday: 20.3,
    costToday: 0.8729,
  },
  {
    endpoint: "US-WEST1",
    requestsToday: 1000,
    totalQueries: 375,
    successRate: 98.9,
    queries: [
      { query: "search term 1", count: 141 },
      { query: "search term 2", count: 125 },
      { query: "search term 5", count: 109 },
    ],
    gigsUsedToday: 1.9,
    costToday: 0.114,
  },
  {
    endpoint: "EUROPE-WEST4",
    requestsToday: 1100,
    totalQueries: 412,
    successRate: 99.1,
    queries: [
      { query: "search term 1", count: 154 },
      { query: "search term 6", count: 137 },
      { query: "search term 5", count: 121 },
    ],
    gigsUsedToday: 2.1,
    costToday: 0.1008,
  },
  {
    endpoint: "EUROPE-WEST1",
    requestsToday: 900,
    totalQueries: 337,
    successRate: 97.5,
    queries: [
      { query: "search term 1", count: 126 },
      { query: "search term 6", count: 112 },
      { query: "search term 7", count: 99 },
    ],
    gigsUsedToday: 1.5,
    costToday: 0.09,
  },
  {
    endpoint: "US-CENTRAL1-2",
    requestsToday: 1100,
    totalQueries: 412,
    successRate: 98.0,
    queries: [
      { query: "search term 1", count: 154 },
      { query: "search term 6", count: 137 },
      { query: "search term 7", count: 121 },
    ],
    gigsUsedToday: 1.8,
    costToday: 0.108,
  },
];

// Chart options with colors to reuse
const chartOptions = [
  { key: "requests", label: "Requests", color: "#805AD5", yLabel: "Requests" },
  { key: "successRate", label: "Success vs Error Rate", color: "#38A169", yLabel: "Percentage (%)" },
  { key: "itemsScraped", label: "Items Scraped", color: "#DD6B20", yLabel: "Items Scraped" },
  { key: "queryDistribution", label: "Query Distribution", color: "#C53030", yLabel: "Count" },
  { key: "cost", label: "Cost Trend", color: "#2B6CB0", yLabel: "Cost ($)" },
];

// Colors for PieChart and reuse
const PIE_COLORS = ["#805AD5", "#38A169", "#DD6B20", "#C53030", "#2B6CB0", "#D69E2E", "#9F7AEA", "#4A5568"];

// Comparison options for each chart
const compareOptions: { [key: string]: { value: string; label: string; color: string }[] } = {
  requests: [
    { value: "processedRequests", label: "Processed Requests", color: PIE_COLORS[0] },
    { value: "failedRequests", label: "Failed Requests", color: PIE_COLORS[1] },
    { value: "uniqueQueries", label: "Unique Queries", color: PIE_COLORS[2] },
    { value: "pendingRequests", label: "Pending Requests", color: PIE_COLORS[3] },
    { value: "retryRequests", label: "Retry Requests", color: PIE_COLORS[4] },
    { value: "avgPerQuery", label: "Avg Requests/Query", color: PIE_COLORS[5] },
    { value: "costImpact", label: "Total Cost Impact", color: PIE_COLORS[6] },
  ],
  successRate: [
    { value: "avgSuccess", label: "Avg Success Rate", color: PIE_COLORS[0] },
    { value: "minSuccess", label: "Min Success Rate", color: PIE_COLORS[1] },
    { value: "maxSuccess", label: "Max Success Rate", color: PIE_COLORS[2] },
    { value: "errorTrend", label: "Error Trend", color: PIE_COLORS[3] },
    { value: "successVariance", label: "Success Variance", color: PIE_COLORS[4] },
    { value: "retrySuccess", label: "Retry Success Rate", color: PIE_COLORS[5] },
  ],
  itemsScraped: [
    { value: "avgScrape", label: "Avg Scrape Count", color: PIE_COLORS[0] },
    { value: "maxScrape", label: "Max Scrape Count", color: PIE_COLORS[1] },
    { value: "minScrape", label: "Min Scrape Count", color: PIE_COLORS[2] },
    { value: "uniqueItems", label: "Unique Items", color: PIE_COLORS[3] },
    { value: "scrapeEfficiency", label: "Scrape Efficiency", color: PIE_COLORS[4] },
    { value: "failedScrapes", label: "Failed Scrapes", color: PIE_COLORS[5] },
  ],
  queryDistribution: [
    { value: "avgQuery", label: "Avg Query Count", color: PIE_COLORS[0] },
    { value: "maxQuery", label: "Max Query Count", color: PIE_COLORS[1] },
    { value: "minQuery", label: "Min Query Count", color: PIE_COLORS[2] },
    { value: "queryDiversity", label: "Query Diversity", color: PIE_COLORS[3] },
    { value: "queryOverlap", label: "Query Overlap", color: PIE_COLORS[4] },
    { value: "newQueries", label: "New Queries", color: PIE_COLORS[5] },
  ],
  cost: [
    { value: "avgCost", label: "Avg Cost", color: PIE_COLORS[0] },
    { value: "maxCost", label: "Max Cost", color: PIE_COLORS[1] },
    { value: "minCost", label: "Min Cost", color: PIE_COLORS[2] },
    { value: "costPerRequest", label: "Cost/Request", color: PIE_COLORS[3] },
    { value: "costPerQuery", label: "Cost/Query", color: PIE_COLORS[4] },
    { value: "costVariance", label: "Cost Variance", color: PIE_COLORS[5] },
  ],
};

interface OverviewProps {
  endpointId: string;
}

const Overview: React.FC<OverviewProps> = ({ endpointId }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedChart, setSelectedChart] = useState("requests");
  const [selectedQuery, setSelectedQuery] = useState<Query | null>(null);
  const [showLabels, setShowLabels] = useState(true);
  const [dynamicData, setDynamicData] = useState<EndpointData[]>(initialEndpointData);
  const [compares, setCompares] = useState<{ [key: string]: string[] }>({
    requests: compareOptions.requests.map(opt => opt.value),
    successRate: compareOptions.successRate.map(opt => opt.value),
    itemsScraped: compareOptions.itemsScraped.map(opt => opt.value),
    queryDistribution: compareOptions.queryDistribution.map(opt => opt.value),
    cost: compareOptions.cost.map(opt => opt.value),
  });
  const [availableCompareOptions, setAvailableCompareOptions] = useState<{ [key: string]: { value: string; label: string; color: string }[] }>({
    requests: compareOptions.requests,
    successRate: compareOptions.successRate,
    itemsScraped: compareOptions.itemsScraped,
    queryDistribution: compareOptions.queryDistribution,
    cost: compareOptions.cost,
  });

  // Function to simulate data updates
  const updateEndpointData = (data: EndpointData[]): EndpointData[] => {
    const newAvailableOptions = Object.fromEntries(
      Object.keys(compareOptions).map((chartKey) => {
        const options = compareOptions[chartKey];
        const newOptionCount = Math.min(8, Math.max(4, Math.floor(Math.random() * (options.length - 3)) + 4));
        const shuffledOptions = [...options].sort(() => Math.random() - 0.5);
        return [chartKey, shuffledOptions.slice(0, newOptionCount)];
      })
    );
    setAvailableCompareOptions(newAvailableOptions);
    setCompares((prev) =>
      Object.fromEntries(
        Object.entries(prev).map(([chartKey, selected]) => {
          const filtered = selected.filter((val) => newAvailableOptions[chartKey].some((opt) => opt.value === val));
          return [chartKey, filtered.length > 0 ? filtered : newAvailableOptions[chartKey].map(opt => opt.value)];
        })
      )
    );

    return data.map((endpoint) => {
      const requestChange = 0.9 + Math.random() * 0.2;
      const newRequestsToday = Math.round(endpoint.requestsToday * requestChange);
      const queryRatio = endpoint.totalQueries / endpoint.requestsToday;
      const newTotalQueries = Math.round(newRequestsToday * queryRatio * (0.95 + Math.random() * 0.1));
      const successChange = Math.random() * 2 - 1;
      const newSuccessRate = Math.min(100, Math.max(90, endpoint.successRate + successChange));
      const newQueries = [...endpoint.queries].map((q) => ({
        ...q,
        count: Math.round(q.count * (0.9 + Math.random() * 0.2)),
      }));

      const addCount = Math.floor(Math.random() * 3);
      for (let i = 0; i < addCount && newQueries.length < 7; i++) {
        newQueries.push({
          query: `new term ${Math.floor(Math.random() * 100)}`,
          count: Math.round(newTotalQueries * (0.1 + Math.random() * 0.2)),
        });
      }
      const removeCount = Math.floor(Math.random() * 3);
      for (let i = 0; i < removeCount && newQueries.length > 1; i++) {
        newQueries.splice(Math.floor(Math.random() * newQueries.length), 1);
      }

      const newGigsUsedToday = (newRequestsToday / 1000) * (1.5 + Math.random());
      const costPerGig = 0.04 + Math.random() * 0.02;
      const newCostToday = Number((newGigsUsedToday * costPerGig).toFixed(3));

      return {
        ...endpoint,
        requestsToday: newRequestsToday,
        totalQueries: newTotalQueries,
        successRate: newSuccessRate,
        queries: newQueries,
        gigsUsedToday: newGigsUsedToday,
        costToday: newCostToday,
      };
    });
  };

  const fetchData = () => {
    setIsLoading(true);
    setTimeout(() => {
      setDynamicData((prevData) => updateEndpointData(prevData));
      setIsLoading(false);
      setError(null);
    }, 500);
  };

  useEffect(() => {
    fetchData();
  }, [endpointId]);

  useEffect(() => {
    setSelectedQuery(null);
  }, [selectedChart]);

  const data = dynamicData.find((item) => item.endpoint === endpointId);

  if (!endpointId || !data) {
    return (
      <Box p={4}>
        <Text fontSize="lg" fontWeight="bold" mb={4}>Overview</Text>
        <Text color="gray.400">No endpoint specified or data available.</Text>
      </Box>
    );
  }

  // Simulated comparison metrics
  const processedRequests = Math.round(data.requestsToday * (0.8 + Math.random() * 0.2));
  const failedRequests = Math.round(data.requestsToday * ((1 - data.successRate / 100) * (0.8 + Math.random() * 0.4)));
  const pendingRequests = Math.round(data.requestsToday * (0.05 + Math.random() * 0.1));
  const retryRequests = Math.round(data.requestsToday * (0.02 + Math.random() * 0.08));
  const avgRequestsPerQuery = data.queries.length > 0 ? Math.round(data.requestsToday / data.queries.length) : 0;
  const totalCostImpact = data.costToday * data.requestsToday / 1000;

  const avgSuccessRate = data.successRate * (0.95 + Math.random() * 0.1);
  const minSuccessRate = Math.max(90, data.successRate - (Math.random() * 5));
  const maxSuccessRate = Math.min(100, data.successRate + (Math.random() * 2));
  const errorTrend = 100 - data.successRate * (0.9 + Math.random() * 0.2);
  const successVariance = Math.random() * 5;
  const retrySuccessRate = Math.min(100, data.successRate * (0.8 + Math.random() * 0.4));

  const totalScraped = data.queries.reduce((sum, q) => sum + q.count, 0);
  const avgScrapeCount = data.queries.length > 0 ? totalScraped / data.queries.length : 0;
  const maxScrapeCount = data.queries.length > 0 ? Math.max(...data.queries.map(q => q.count)) : 0;
  const minScrapeCount = data.queries.length > 0 ? Math.min(...data.queries.map(q => q.count)) : 0;
  const uniqueItems = data.queries.length;
  const scrapeEfficiency = data.queries.length > 0 ? totalScraped / data.requestsToday : 0;
  const failedScrapes = Math.round(totalScraped * (0.05 + Math.random() * 0.1));

  const avgQueryCount = data.queries.length > 0 ? totalScraped / data.queries.length : 0;
  const maxQueryCount = data.queries.length > 0 ? Math.max(...data.queries.map(q => q.count)) : 0;
  const minQueryCount = data.queries.length > 0 ? Math.min(...data.queries.map(q => q.count)) : 0;
  const queryDiversity = data.queries.length / (data.requestsToday / 1000);
  const queryOverlap = Math.round(data.queries.length * (0.1 + Math.random() * 0.2));
  const newQueries = Math.floor(Math.random() * 3);

  const avgCost = data.costToday * (0.9 + Math.random() * 0.2);
  const maxCost = data.costToday * (1 + Math.random() * 0.3);
  const minCost = data.costToday * (0.7 + Math.random() * 0.2);
  const costPerRequest = data.costToday / data.requestsToday;
  const costPerQuery = data.queries.length > 0 ? data.costToday / data.queries.length : 0;
  const costVariance = data.costToday * (0.05 + Math.random() * 0.1);

  // Chart data derived from endpoint
  const chartData = {
    requests: [
      { name: "Total Requests", value: data.requestsToday },
      ...compares.requests.map((compare) => ({
        name: compareOptions.requests.find((opt) => opt.value === compare)!.label,
        value:
          compare === "processedRequests" ? processedRequests :
          compare === "failedRequests" ? failedRequests :
          compare === "uniqueQueries" ? data.queries.length :
          compare === "pendingRequests" ? pendingRequests :
          compare === "retryRequests" ? retryRequests :
          compare === "avgPerQuery" ? avgRequestsPerQuery :
          totalCostImpact,
      })),
    ],
    successRate: [
      { name: "Success Rate", value: data.successRate },
      { name: "Error Rate", value: 100 - data.successRate },
      ...compares.successRate.map((compare) => ({
        name: compareOptions.successRate.find((opt) => opt.value === compare)!.label,
        value:
          compare === "avgSuccess" ? avgSuccessRate :
          compare === "minSuccess" ? minSuccessRate :
          compare === "maxSuccess" ? maxSuccessRate :
          compare === "errorTrend" ? errorTrend :
          compare === "successVariance" ? successVariance :
          retrySuccessRate,
      })),
    ],
    itemsScraped: [
      ...data.queries.map((q) => ({ name: q.query, value: q.count })),
      ...compares.itemsScraped.map((compare) => ({
        name: compareOptions.itemsScraped.find((opt) => opt.value === compare)!.label,
        value:
          compare === "avgScrape" ? avgScrapeCount :
          compare === "maxScrape" ? maxScrapeCount :
          compare === "minScrape" ? minScrapeCount :
          compare === "uniqueItems" ? uniqueItems :
          compare === "scrapeEfficiency" ? scrapeEfficiency :
          failedScrapes,
      })),
    ],
    queryDistribution: data.queries.map((q) => ({ name: q.query, value: q.count })), // Only queries for PieChart
    cost: [
      ...Array.from({ length: 5 }, (_, i) => ({
        name: `Day ${i + 1}`,
        value: data.costToday * (0.8 + Math.random() * 0.4),
      })),
      ...compares.cost.map((compare) => ({
        name: compareOptions.cost.find((opt) => opt.value === compare)!.label,
        value:
          compare === "avgCost" ? avgCost :
          compare === "maxCost" ? maxCost :
          compare === "minCost" ? minCost :
          compare === "costPerRequest" ? costPerRequest :
          compare === "costPerQuery" ? costPerQuery :
          costVariance,
      })),
    ],
  };

  // Top queries for the selected endpoint
  const topQueries = [...data.queries].sort((a, b) => b.count - a.count).slice(0, 10);

  const getSummaryStats = (selectedChart: string, chartData: typeof chartData) => {
    const data = chartData[selectedChart];
    if (!data || data.length === 0) return [];

    const total = data.reduce((sum, point) => sum + point.value, 0);

    switch (selectedChart) {
      case "requests":
      case "successRate":
        return data.map((item) => ({
          label: item.name,
          value: selectedChart === "successRate" && item.name !== "Success Rate" && item.name !== "Error Rate"
            ? `${item.value.toFixed(1)}%`
            : item.value.toLocaleString(),
        }));
      case "itemsScraped":
        return [
          { label: "Total Scraped", value: totalScraped.toLocaleString() },
          ...compares.itemsScraped.map((compare) => ({
            label: compareOptions.itemsScraped.find((opt) => opt.value === compare)!.label,
            value:
              compare === "avgScrape" ? avgScrapeCount.toLocaleString() :
              compare === "maxScrape" ? maxScrapeCount.toLocaleString() :
              compare === "minScrape" ? minScrapeCount.toLocaleString() :
              compare === "uniqueItems" ? uniqueItems.toLocaleString() :
              compare === "scrapeEfficiency" ? scrapeEfficiency.toFixed(2) :
              failedScrapes.toLocaleString(),
          })),
        ];
      case "queryDistribution":
        return [
          { label: "Total Queries", value: total.toLocaleString() },
          ...compares.queryDistribution.map((compare) => ({
            label: compareOptions.queryDistribution.find((opt) => opt.value === compare)!.label,
            value:
              compare === "avgQuery" ? avgQueryCount.toLocaleString() :
              compare === "maxQuery" ? maxQueryCount.toLocaleString() :
              compare === "minQuery" ? minQueryCount.toLocaleString() :
              compare === "queryDiversity" ? queryDiversity.toFixed(2) :
              compare === "queryOverlap" ? queryOverlap.toLocaleString() :
              newQueries.toLocaleString(),
          })),
        ];
      case "cost":
        const trendData = data.slice(0, 5);
        const trendAvg = trendData.length > 0 ? trendData.reduce((sum, point) => sum + point.value, 0) / trendData.length : 0;
        return [
          { label: "Trend Avg Cost", value: `$${trendAvg.toFixed(3)}` },
          ...compares.cost.map((compare) => ({
            label: compareOptions.cost.find((opt) => opt.value === compare)!.label,
            value:
              compare === "avgCost" ? `$${avgCost.toFixed(3)}` :
              compare === "maxCost" ? `$${maxCost.toFixed(3)}` :
              compare === "minCost" ? `$${minCost.toFixed(3)}` :
              compare === "costPerRequest" ? `$${costPerRequest.toFixed(6)}` :
              compare === "costPerQuery" ? `$${costPerQuery.toFixed(6)}` :
              `$${costVariance.toFixed(3)}`,
          })),
        ];
      default:
        return [];
    }
  };

  const toggleCompare = (chartKey: string, value: string) => {
    setCompares((prev) => ({
      ...prev,
      [chartKey]: prev[chartKey].includes(value)
        ? prev[chartKey].filter((v) => v !== value)
        : [...prev[chartKey], value],
    }));
  };

  const renderSummary = () => {
    const stats = getSummaryStats(selectedChart, chartData);
    const summaryContent = selectedQuery ? (
      <>
        <Text><strong>Query:</strong> {selectedQuery.query}</Text>
        <Text><strong>Category:</strong> {selectedQuery.category || "N/A"}</Text>
        <Text><strong>Count:</strong> {selectedQuery.count}</Text>
      </>
    ) : (
      <Grid templateColumns="repeat(3, 1fr)" gap={4} rowGap={2}>
        {stats.map((stat, index) => (
          <Stat key={index} minW="100px">
            <StatLabel color="gray.400" fontSize="sm">{stat.label}</StatLabel>
            <StatNumber fontSize="lg">{stat.value}</StatNumber>
          </Stat>
        ))}
      </Grid>
    );

    return (
      <>
        <Text fontSize="md" fontWeight="semibold" mb={2}>
          {selectedQuery ? "Query Details" : `${chartOptions.find((opt) => opt.key === selectedChart)!.label} Summary`}
        </Text>
        <Card shadow="md" borderWidth="1px" bg="gray.700" minHeight="150px" position="relative">
          {selectedQuery && (
            <IconButton
              aria-label="Back to summary"
              icon={<CloseIcon />}
              size="sm"
              position="absolute"
              top={2}
              right={2}
              onClick={() => setSelectedQuery(null)}
              variant="ghost"
            />
          )}
          <CardBody>{summaryContent}</CardBody>
        </Card>
      </>
    );
  };

  const selectedOption = chartOptions.find((opt) => opt.key === selectedChart)!;
  const chartColor = compares[selectedChart].length > 0
    ? compareOptions[selectedChart].find((opt) => opt.value === compares[selectedChart][0])!.color
    : selectedOption.color;

  const renderChart = () => {
    switch (selectedChart) {
      case "requests":
      case "successRate":
      case "itemsScraped":
        return (
          <BarChart
            data={chartData[selectedChart]}
            margin={{ top: 20, right: 20, bottom: showLabels ? 60 : 20, left: showLabels ? 40 : 20 }}
          >
            <CartesianGrid stroke="gray.600" />
            <XAxis
              dataKey="name"
              stroke="#FFFFFF"
              tick={{ fill: "#FFFFFF", fontSize: 12 }}
              tickMargin={10}
              label={
                showLabels
                  ? {
                      value: selectedChart === "itemsScraped" ? "Queries & Metrics" : "Metrics",
                      position: "insideBottom",
                      offset: -20,
                      fill: "#FFFFFF",
                      fontSize: 14,
                    }
                  : undefined
              }
            />
            <YAxis
              stroke="#FFFFFF"
              tick={{ fill: "#FFFFFF", fontSize: 12 }}
              tickMargin={10}
              label={
                showLabels
                  ? { value: selectedOption.yLabel, angle: -45, position: "insideLeft", offset: -20, fill: "#FFFFFF", fontSize: 14 }
                  : undefined
              }
            />
            <RechartsTooltip contentStyle={{ backgroundColor: "gray.700", color: "white" }} />
            <Bar dataKey="value" fill={chartColor} />
          </BarChart>
        );
      case "queryDistribution":
        return (
          <PieChart>
            <Pie
              data={chartData[selectedChart]}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={120}
              label={showLabels ? ({ name, percent }) => `${name} (${(percent * 100).toFixed(1)}%)` : false}
            >
              {chartData[selectedChart].map((_, index) => (
                <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
              ))}
            </Pie>
            <RechartsTooltip contentStyle={{ backgroundColor: "gray.700", color: "white" }} />
          </PieChart>
        );
      case "cost":
        return (
          <LineChart
            data={chartData[selectedChart]}
            margin={{ top: 20, right: 20, bottom: showLabels ? 60 : 20, left: showLabels ? 40 : 20 }}
          >
            <CartesianGrid stroke="gray.600" />
            <XAxis
              dataKey="name"
              stroke="#FFFFFF"
              tick={{ fill: "#FFFFFF", fontSize: 12 }}
              tickMargin={10}
              label={
                showLabels
                  ? { value: "Days & Metrics", position: "insideBottom", offset: -20, fill: "#FFFFFF", fontSize: 14 }
                  : undefined
              }
            />
            <YAxis
              stroke="#FFFFFF"
              tick={{ fill: "#FFFFFF", fontSize: 12 }}
              tickMargin={10}
              label={
                showLabels
                  ? { value: selectedOption.yLabel, angle: -45, position: "insideLeft", offset: -20, fill: "#FFFFFF", fontSize: 14 }
                  : undefined
              }
            />
            <RechartsTooltip contentStyle={{ backgroundColor: "gray.700", color: "white" }} />
            <Line type="monotone" dataKey="value" stroke={chartColor} />
          </LineChart>
        );
      default:
        return null;
    }
  };

  const chunkArray = (array: any[], size: number) => {
    const result = [];
    for (let i = 0; i < array.length; i += size) {
      result.push(array.slice(i, i + size));
    }
    return result;
  };

  const compareRows = chunkArray(availableCompareOptions[selectedChart], 4);

  return (
    <Box p={4} width="100%">
      <Flex justify="space-between" align="center" mb={4} wrap="wrap" gap={2}>
        <Text fontSize="lg" fontWeight="bold">Overview for {endpointId}</Text>
        <Flex align="center" gap={2} ml="auto">
          <ButtonGroup size="sm" variant="outline">
            {chartOptions.map((option) => (
              <Tooltip key={option.key} label={`View ${option.label}`}>
                <Button
                  bg={selectedChart === option.key ? option.color : "gray.600"}
                  color={selectedChart === option.key ? "white" : "gray.200"}
                  borderColor={option.color}
                  _hover={{ bg: `${option.color}80` }}
                  onClick={() => setSelectedChart(option.key)}
                >
                  {option.label}
                </Button>
              </Tooltip>
            ))}
          </ButtonGroup>
          <Tooltip label="Refresh overview data immediately">
            <Button size="sm" colorScheme="blue" onClick={fetchData} isLoading={isLoading}>
              Refresh Now
            </Button>
          </Tooltip>
          <Tooltip label="Toggle chart labels">
            <Button
              size="sm"
              colorScheme={showLabels ? "green" : "gray"}
              onClick={() => setShowLabels(!showLabels)}
            >
              {showLabels ? "Labels: On" : "Labels: Off"}
            </Button>
          </Tooltip>
        </Flex>
      </Flex>

      {isLoading ? (
        <Flex justify="center" align="center" h="200px">
          <Spinner size="xl" color="blue.500" />
        </Flex>
      ) : error ? (
        <Text color="red.500">{error}</Text>
      ) : (
        <>
          <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={6} mb={6} alignItems="start">
            <GridItem>
              <Text fontSize="md" fontWeight="semibold" mb={2}>
                {selectedOption.label}
              </Text>
              <Box height="400px" borderRadius="md" overflow="hidden" shadow="md" bg="gray.700">
                <ResponsiveContainer width="100%" height="100%">
                  {renderChart()}
                </ResponsiveContainer>
              </Box>
            </GridItem>
            <GridItem>
              {renderSummary()}
              <Box mt={6}>
                <Text fontSize="md" fontWeight="semibold" mb={2}>
                  Compare To
                </Text>
                <Flex direction="column" gap={2}>
                  {compareRows.map((row, rowIndex) => (
                    <ButtonGroup key={rowIndex} size="sm" variant="outline" isAttached={false}>
                      {row.map((option) => (
                        <Button
                          key={option.value}
                          bg={compares[selectedChart].includes(option.value) ? option.color : "gray.600"}
                          color={compares[selectedChart].includes(option.value) ? "white" : "gray.200"}
                          borderColor={option.color}
                          _hover={{ bg: `${option.color}80` }}
                          onClick={() => toggleCompare(selectedChart, option.value)}
                        >
                          {option.label}
                        </Button>
                      ))}
                    </ButtonGroup>
                  ))}
                </Flex>
              </Box>
            </GridItem>
          </Grid>
          <Box mt={6}>
            <Text fontSize="md" fontWeight="semibold" mb={2}>Top Queries (This Endpoint)</Text>
            <Box shadow="md" borderWidth="1px" borderRadius="md" overflowX="auto">
              <Table variant="simple" size="sm">
                <Thead>
                  <Tr>
                    <Th>Query</Th>
                    <Th>Category</Th>
                    <Th>Count</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {topQueries.map((query, index) => (
                    <Tr
                      key={index}
                      onClick={() => setSelectedQuery(query)}
                      cursor="pointer"
                      _hover={{ bg: "gray.600" }}
                      bg={selectedQuery?.query === query.query ? "gray.600" : "transparent"}
                    >
                      <Td>{query.query}</Td>
                      <Td>{query.category || "N/A"}</Td>
                      <Td>{query.count}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Box>
          </Box>
        </>
      )}
    </Box>
  );
};

export default Overview;