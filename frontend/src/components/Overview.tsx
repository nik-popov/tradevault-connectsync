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
  Select,
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
const COMPARE_COLORS = ["#805AD5", "#E53E3E"]; // Colors for primary and compare endpoints

const Overview: React.FC<OverviewProps> = ({ endpointId }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [allEndpoints, setAllEndpoints] = useState<EndpointData[]>([]);
  const [endpointData, setEndpointData] = useState<EndpointData | null>(null);
  const [compareEndpointData, setCompareEndpointData] = useState<EndpointData | null>(null);
  const [selectedChart, setSelectedChart] = useState("requests");
  const [selectedQuery, setSelectedQuery] = useState<Query | null>(null);
  const [showLabels, setShowLabels] = useState(true);
  const [compareEndpointId, setCompareEndpointId] = useState<string>("");

  // Fetch data from GitHub raw URL
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        "https://s3.us-east-1.amazonaws.com/iconluxury.group/endpoint-overview.json"
      );
      if (!response.ok) {
        throw new Error("Failed to fetch data from GitHub");
      }
      const data: EndpointData[] = await response.json();
      setAllEndpoints(data);
      const primaryData = data.find((item) => item.endpoint === endpointId);
      if (!primaryData) {
        throw new Error(`Endpoint ${endpointId} not found in the GitHub data`);
      }
      setEndpointData(primaryData);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setEndpointData(null);
      setAllEndpoints([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [endpointId]);

  // Update comparison data when selection changes
  useEffect(() => {
    if (compareEndpointId) {
      const compareData = allEndpoints.find((item) => item.endpoint === compareEndpointId);
      setCompareEndpointData(compareData || null);
    } else {
      setCompareEndpointData(null);
    }
  }, [compareEndpointId, allEndpoints]);

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

  // Derived metrics for primary endpoint
  const processedRequests = Math.round(endpointData.requestsToday * (0.8 + Math.random() * 0.2));
  const failedRequests = Math.round(endpointData.requestsToday * ((1 - endpointData.successRate / 100) * (0.8 + Math.random() * 0.4)));
  const totalScraped = endpointData.queries.reduce((sum, q) => sum + q.count, 0);
  const avgCost = endpointData.costToday * (0.9 + Math.random() * 0.2);

  // Derived metrics for compare endpoint (if present)
  const compareProcessedRequests = compareEndpointData ? Math.round(compareEndpointData.requestsToday * (0.8 + Math.random() * 0.2)) : 0;
  const compareFailedRequests = compareEndpointData ? Math.round(compareEndpointData.requestsToday * ((1 - compareEndpointData.successRate / 100) * (0.8 + Math.random() * 0.4))) : 0;
  const compareTotalScraped = compareEndpointData ? compareEndpointData.queries.reduce((sum, q) => sum + q.count, 0) : 0;
  const compareAvgCost = compareEndpointData ? compareEndpointData.costToday * (0.9 + Math.random() * 0.2) : 0;

  // Chart data with comparison
  const chartData = {
    requests: [
      { name: "Total Requests", value: endpointData.requestsToday, compareValue: compareEndpointData?.requestsToday || 0 },
      { name: "Processed Requests", value: processedRequests, compareValue: compareProcessedRequests },
      { name: "Failed Requests", value: failedRequests, compareValue: compareFailedRequests },
    ],
    successRate: [
      { name: "Success Rate", value: endpointData.successRate, compareValue: compareEndpointData?.successRate || 0 },
      { name: "Error Rate", value: 100 - endpointData.successRate, compareValue: compareEndpointData ? 100 - compareEndpointData.successRate : 0 },
    ],
    itemsScraped: [
      { name: "Total Scraped", value: totalScraped, compareValue: compareTotalScraped },
    ],
    queryDistribution: endpointData.queries.map((q) => ({ name: q.query, value: q.count })),
    cost: [
      { name: "Avg Cost", value: avgCost, compareValue: compareAvgCost },
    ],
  };

  const topQueries = [...endpointData.queries].sort((a, b) => b.count - a.count).slice(0, 10);

  const getSummaryStats = (selectedChart: string) => {
    const data = chartData[selectedChart];
    if (!data || data.length === 0) return [];

    return data.map((item: any) => ({
      label: item.name,
      value: `${item.value.toLocaleString()}${compareEndpointData ? ` / ${item.compareValue.toLocaleString()}` : ""}`,
    }));
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
          {compareEndpointData && ` (vs ${compareEndpointData.endpoint})`}
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
              label={showLabels ? { value: "Metrics", position: "insideBottom", offset: -20, fill: "#FFFFFF", fontSize: 14 } : undefined}
            />
            <YAxis
              stroke="#FFFFFF"
              tick={{ fill: "#FFFFFF", fontSize: 12 }}
              tickMargin={10}
              label={showLabels ? { value: selectedOption.yLabel, angle: -45, position: "insideLeft", offset: -20, fill: "#FFFFFF", fontSize: 14 } : undefined}
            />
            <RechartsTooltip contentStyle={{ backgroundColor: "gray.700", color: "white" }} />
            <Bar dataKey="value" fill={COMPARE_COLORS[0]} name={endpointId} />
            {compareEndpointData && <Bar dataKey="compareValue" fill={COMPARE_COLORS[1]} name={compareEndpointData.endpoint} />}
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
              label={showLabels ? { value: "Metrics", position: "insideBottom", offset: -20, fill: "#FFFFFF", fontSize: 14 } : undefined}
            />
            <YAxis
              stroke="#FFFFFF"
              tick={{ fill: "#FFFFFF", fontSize: 12 }}
              tickMargin={10}
              label={showLabels ? { value: selectedOption.yLabel, angle: -45, position: "insideLeft", offset: -20, fill: "#FFFFFF", fontSize: 14 } : undefined}
            />
            <RechartsTooltip contentStyle={{ backgroundColor: "gray.700", color: "white" }} />
            <Line type="monotone" dataKey="value" stroke={COMPARE_COLORS[0]} name={endpointId} />
            {compareEndpointData && <Line type="monotone" dataKey="compareValue" stroke={COMPARE_COLORS[1]} name={compareEndpointData.endpoint} />}
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
          <Select
            size="sm"
            placeholder="Compare to..."
            value={compareEndpointId}
            onChange={(e) => setCompareEndpointId(e.target.value)}
            width="200px"
          >
            {allEndpoints
              .filter((item) => item.endpoint !== endpointId)
              .map((item) => (
                <option key={item.endpoint} value={item.endpoint}>{item.endpoint}</option>
              ))}
          </Select>
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