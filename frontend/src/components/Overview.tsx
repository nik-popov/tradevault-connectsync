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

interface OverviewProps {
  endpointId: string;
}

const chartOptions = [
  { key: "requests", label: "Requests", color: "#805AD5", yLabel: "Requests" },
  { key: "successRate", label: "Success vs Error Rate", color: "#38A169", yLabel: "Percentage (%)" },
  { key: "itemsScraped", label: "Items Scraped", color: "#DD6B20", yLabel: "Items Scraped" },
  { key: "queryDistribution", label: "Query Distribution", color: "#C53030", yLabel: "Count" },
  { key: "cost", label: "Cost Trend", color: "#2B6CB0", yLabel: "Cost ($)" },
];

const PIE_COLORS = ["#805AD5", "#38A169", "#DD6B20", "#C53030", "#2B6CB0", "#D69E2E", "#9F7AEA", "#4A5568"];

const Overview: React.FC<OverviewProps> = ({ endpointId }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [endpointData, setEndpointData] = useState<EndpointData | null>(null);
  const [selectedChart, setSelectedChart] = useState("requests");
  const [selectedQuery, setSelectedQuery] = useState<Query | null>(null);
  const [showLabels, setShowLabels] = useState(true);

  // Fetch data from your GitHub raw URL
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        "https://raw.githubusercontent.com/iconluxurygroup/static-data/refs/heads/main/endpoint-overview.json"
      );
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const data: EndpointData[] = await response.json();
      // Filter the data to find the matching endpoint
      const matchingEndpoint = data.find((item) => item.endpoint === endpointId);
      if (!matchingEndpoint) {
        throw new Error(`Endpoint ${endpointId} not found in the data`);
      }
      setEndpointData(matchingEndpoint);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setEndpointData(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [endpointId]);

  useEffect(() => {
    setSelectedQuery(null);
  }, [selectedChart]);

  if (isLoading) {
    return (
      <Flex justify="center" align="center" h="200px">
        <Spinner size="xl" color="blue.500" />
      </Flex>
    );
  }

  if (error) {
    return <Text color="red.500">{error}</Text>;
  }

  if (!endpointId || !endpointData) {
    return (
      <Box p={4}>
        <Text fontSize="lg" fontWeight="bold" mb={4}>Overview</Text>
        <Text color="gray.400">No endpoint specified or data available.</Text>
      </Box>
    );
  }

  // Derived metrics (calculated on frontend)
  const processedRequests = Math.round(endpointData.requestsToday * (0.8 + Math.random() * 0.2));
  const failedRequests = Math.round(endpointData.requestsToday * ((1 - endpointData.successRate / 100) * (0.8 + Math.random() * 0.4)));
  const pendingRequests = Math.round(endpointData.requestsToday * (0.05 + Math.random() * 0.1));
  const retryRequests = Math.round(endpointData.requestsToday * (0.02 + Math.random() * 0.08));
  const avgRequestsPerQuery = endpointData.queries.length > 0 ? Math.round(endpointData.requestsToday / endpointData.queries.length) : 0;
  const totalCostImpact = endpointData.costToday * endpointData.requestsToday / 1000;

  const avgSuccessRate = endpointData.successRate * (0.95 + Math.random() * 0.1);
  const minSuccessRate = Math.max(90, endpointData.successRate - (Math.random() * 5));
  const maxSuccessRate = Math.min(100, endpointData.successRate + (Math.random() * 2));
  const errorTrend = 100 - endpointData.successRate * (0.9 + Math.random() * 0.2);
  const successVariance = Math.random() * 5;
  const retrySuccessRate = Math.min(100, endpointData.successRate * (0.8 + Math.random() * 0.4));

  const totalScraped = endpointData.queries.reduce((sum, q) => sum + q.count, 0);
  const avgScrapeCount = endpointData.queries.length > 0 ? totalScraped / endpointData.queries.length : 0;
  const maxScrapeCount = endpointData.queries.length > 0 ? Math.max(...endpointData.queries.map(q => q.count)) : 0;
  const minScrapeCount = endpointData.queries.length > 0 ? Math.min(...endpointData.queries.map(q => q.count)) : 0;
  const uniqueItems = endpointData.queries.length;
  const scrapeEfficiency = endpointData.queries.length > 0 ? totalScraped / endpointData.requestsToday : 0;
  const failedScrapes = Math.round(totalScraped * (0.05 + Math.random() * 0.1));

  const avgQueryCount = endpointData.queries.length > 0 ? totalScraped / endpointData.queries.length : 0;
  const maxQueryCount = endpointData.queries.length > 0 ? Math.max(...endpointData.queries.map(q => q.count)) : 0;
  const minQueryCount = endpointData.queries.length > 0 ? Math.min(...endpointData.queries.map(q => q.count)) : 0;
  const queryDiversity = endpointData.queries.length / (endpointData.requestsToday / 1000);
  const queryOverlap = Math.round(endpointData.queries.length * (0.1 + Math.random() * 0.2));
  const newQueries = Math.floor(Math.random() * 3);

  const avgCost = endpointData.costToday * (0.9 + Math.random() * 0.2);
  const maxCost = endpointData.costToday * (1 + Math.random() * 0.3);
  const minCost = endpointData.costToday * (0.7 + Math.random() * 0.2);
  const costPerRequest = endpointData.costToday / endpointData.requestsToday;
  const costPerQuery = endpointData.queries.length > 0 ? endpointData.costToday / endpointData.queries.length : 0;
  const costVariance = endpointData.costToday * (0.05 + Math.random() * 0.1);

  // Chart data
  const chartData = {
    requests: [
      { name: "Total Requests", value: endpointData.requestsToday },
      { name: "Processed Requests", value: processedRequests },
      { name: "Failed Requests", value: failedRequests },
      { name: "Unique Queries", value: endpointData.queries.length },
      { name: "Pending Requests", value: pendingRequests },
      { name: "Retry Requests", value: retryRequests },
      { name: "Avg Requests/Query", value: avgRequestsPerQuery },
      { name: "Total Cost Impact", value: totalCostImpact },
    ],
    successRate: [
      { name: "Success Rate", value: endpointData.successRate },
      { name: "Error Rate", value: 100 - endpointData.successRate },
      { name: "Avg Success Rate", value: avgSuccessRate },
      { name: "Min Success Rate", value: minSuccessRate },
      { name: "Max Success Rate", value: maxSuccessRate },
      { name: "Error Trend", value: errorTrend },
      { name: "Success Variance", value: successVariance },
      { name: "Retry Success Rate", value: retrySuccessRate },
    ],
    itemsScraped: [
      ...endpointData.queries.map((q) => ({ name: q.query, value: q.count })),
      { name: "Avg Scrape Count", value: avgScrapeCount },
      { name: "Max Scrape Count", value: maxScrapeCount },
      { name: "Min Scrape Count", value: minScrapeCount },
      { name: "Unique Items", value: uniqueItems },
      { name: "Scrape Efficiency", value: scrapeEfficiency },
      { name: "Failed Scrapes", value: failedScrapes },
    ],
    queryDistribution: endpointData.queries.map((q) => ({ name: q.query, value: q.count })),
    cost: [
      ...Array.from({ length: 5 }, (_, i) => ({
        name: `Day ${i + 1}`,
        value: endpointData.costToday * (0.8 + Math.random() * 0.4),
      })),
      { name: "Avg Cost", value: avgCost },
      { name: "Max Cost", value: maxCost },
      { name: "Min Cost", value: minCost },
      { name: "Cost/Request", value: costPerRequest },
      { name: "Cost/Query", value: costPerQuery },
      { name: "Cost Variance", value: costVariance },
    ],
  };

  const topQueries = [...endpointData.queries].sort((a, b) => b.count - a.count).slice(0, 10);

  const getSummaryStats = (selectedChart: string) => {
    const data = chartData[selectedChart];
    if (!data || data.length === 0) return [];

    const total = data.reduce((sum: number, point: any) => sum + point.value, 0);

    switch (selectedChart) {
      case "requests":
      case "successRate":
        return data.map((item: any) => ({
          label: item.name,
          value: selectedChart === "successRate" && item.name !== "Success Rate" && item.name !== "Error Rate"
            ? `${item.value.toFixed(1)}%`
            : item.value.toLocaleString(),
        }));
      case "itemsScraped":
        return [
          { label: "Total Scraped", value: totalScraped.toLocaleString() },
          { label: "Avg Scrape Count", value: avgScrapeCount.toLocaleString() },
          { label: "Max Scrape Count", value: maxScrapeCount.toLocaleString() },
          { label: "Min Scrape Count", value: minScrapeCount.toLocaleString() },
          { label: "Unique Items", value: uniqueItems.toLocaleString() },
          { label: "Scrape Efficiency", value: scrapeEfficiency.toFixed(2) },
          { label: "Failed Scrapes", value: failedScrapes.toLocaleString() },
        ];
      case "queryDistribution":
        return [
          { label: "Total Queries", value: total.toLocaleString() },
          { label: "Avg Query Count", value: avgQueryCount.toLocaleString() },
          { label: "Max Query Count", value: maxQueryCount.toLocaleString() },
          { label: "Min Query Count", value: minQueryCount.toLocaleString() },
          { label: "Query Diversity", value: queryDiversity.toFixed(2) },
          { label: "Query Overlap", value: queryOverlap.toLocaleString() },
          { label: "New Queries", value: newQueries.toLocaleString() },
        ];
      case "cost":
        const trendData = data.slice(0, 5);
        const trendAvg = trendData.length > 0 ? trendData.reduce((sum: number, point: any) => sum + point.value, 0) / trendData.length : 0;
        return [
          { label: "Trend Avg Cost", value: `$${trendAvg.toFixed(3)}` },
          { label: "Avg Cost", value: `$${avgCost.toFixed(3)}` },
          { label: "Max Cost", value: `$${maxCost.toFixed(3)}` },
          { label: "Min Cost", value: `$${minCost.toFixed(3)}` },
          { label: "Cost/Request", value: `$${costPerRequest.toFixed(6)}` },
          { label: "Cost/Query", value: `$${costPerQuery.toFixed(6)}` },
          { label: "Cost Variance", value: `$${costVariance.toFixed(3)}` },
        ];
      default:
        return [];
    }
  };

  const renderSummary = () => {
    const stats = getSummaryStats(selectedChart);
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
            <Bar dataKey="value" fill={selectedOption.color} />
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
              {chartData[selectedChart].map((_: any, index: number) => (
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
            <Line type="monotone" dataKey="value" stroke={selectedOption.color} />
          </LineChart>
        );
      default:
        return null;
    }
  };

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
    </Box>
  );
};

export default Overview;