import React, { useState, useEffect, useMemo } from "react";
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
  LineChart,
  Line,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
} from "recharts";

// Interfaces
interface TimeSeries {
  hour: string;
  count: number;
}

interface Query {
  id: number;
  query: string;
  count: number;
  featured: boolean;
  category: string;
  type: string;
  timeSeries?: TimeSeries[];
  endpointDetails?: { endpoint: string; count: number }[];
}

interface EndpointData {
  endpoint: string;
  requestsToday: number;
  successRate: number;
  queries: Query[];
}

// Chart options with colors and Y-axis labels
const chartOptions = [
  { key: "requestsOverTime", label: "Requests Over Time", color: "#805AD5", yAxisLabel: "Requests" },
  { key: "categoryDistribution", label: "Category Distribution", color: "#38A169", yAxisLabel: "Total Queries" },
  { key: "topQueries", label: "Top Queries", color: "#DD6B20", yAxisLabel: "Query Count" },
  { key: "successRate", label: "Success Rate", color: "#C53030", yAxisLabel: "Percentage (%)" },
  { key: "keyMetrics", label: "Key Metrics", color: "#D69E2E", yAxisLabel: "Value" },
];

// Comparison options with matching colors
const compareOptions: { [key: string]: { value: string; label: string; color: string }[] } = {
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

const OverviewGSerp: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedChart, setSelectedChart] = useState("requestsOverTime");
  const [selectedQuery, setSelectedQuery] = useState<Query | null>(null);
  const [showLabels, setShowLabels] = useState(true);
  const [endpointData, setEndpointData] = useState<EndpointData[]>([]);
  const [chartData, setChartData] = useState<any>({});
  const [compares, setCompares] = useState<{ [key: string]: string[] }>({
    requestsOverTime: compareOptions.requestsOverTime.map(opt => opt.value),
    categoryDistribution: compareOptions.categoryDistribution.map(opt => opt.value),
    topQueries: compareOptions.topQueries.map(opt => opt.value),
    successRate: compareOptions.successRate.map(opt => opt.value),
    keyMetrics: compareOptions.keyMetrics.map(opt => opt.value),
  });

  // Compute totalRequests based on endpointData
  const totalRequests = useMemo(() => {
    return endpointData.reduce((sum, ep) => sum + ep.requestsToday, 0);
  }, [endpointData]);

  // Fetch data from GitHub
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("https://raw.githubusercontent.com/iconluxurygroup/static-data/refs/heads/main/google-serp-overview.json");
      if (!response.ok) throw new Error("Failed to fetch data");
      const data: EndpointData[] = await response.json();

      // Enhance queries with endpoint-specific details
      const enhancedData = data.map((endpoint) => ({
        ...endpoint,
        queries: endpoint.queries.map((query) => ({
          ...query,
          endpointDetails: data
            .filter((ep) => ep.queries.some((q) => q.query === query.query))
            .map((ep) => ({
              endpoint: ep.endpoint,
              count: ep.queries.find((q) => q.query === query.query)!.count,
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
      const avgHourly = requestsOverTime.reduce((sum, d) => sum + d.value, 0) / 24;
      const maxHourly = Math.max(...requestsOverTime.map(d => d.value));
      const minHourly = Math.min(...requestsOverTime.map(d => d.value));

      // Category Distribution
      const categoryMap = new Map<string, number>();
      enhancedData.flatMap((ep) => ep.queries).forEach((q) => {
        categoryMap.set(q.category, (categoryMap.get(q.category) || 0) + q.count);
      });
      const categoryDistribution = Array.from(categoryMap.entries()).map(([category, count]) => ({
        name: category,
        value: count,
      }));
      const totalQueries = categoryDistribution.reduce((sum, d) => sum + d.value, 0);
      const avgPerCategory = totalQueries / categoryDistribution.length;
      const maxCategory = Math.max(...categoryDistribution.map(d => d.value));
      const uniqueCategories = categoryDistribution.length;

      // Top Queries
      const queryMap = new Map<string, number>();
      enhancedData.flatMap((ep) => ep.queries).forEach((q) => {
        queryMap.set(q.query, (queryMap.get(q.query) || 0) + q.count);
      });
      const topQueriesChart = Array.from(queryMap.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([query, count]) => ({ name: query, value: count }));
      const avgQueryCount = topQueriesChart.reduce((sum, d) => sum + d.value, 0) / topQueriesChart.length;
      const maxQuery = Math.max(...topQueriesChart.map(d => d.value));
      const featuredQueries = enhancedData.flatMap(ep => ep.queries).filter(q => q.featured).length;

      // Success Rate
      const successRate = enhancedData.map((ep) => ({
        name: ep.endpoint,
        value: ep.successRate, // Percentage (0-100)
      }));
      const errorRate = successRate.map(d => ({ name: d.name, value: 100 - d.value }));
      const avgSuccess = successRate.reduce((sum, d) => sum + d.value, 0) / successRate.length;
      const variance = Math.sqrt(successRate.reduce((sum, d) => sum + Math.pow(d.value - avgSuccess, 2), 0) / successRate.length);

      // Key Metrics
      const keyMetrics = [
        { name: "Total Requests", value: totalRequests },
        { name: "Success Rate", value: overallSuccessRate * 100 }, // Convert to percentage
        { name: "Endpoints", value: enhancedData.length },
      ];
      const avgRequests = totalRequests / enhancedData.length;

      setChartData({
        requestsOverTime: [
          ...requestsOverTime,
          ...compares.requestsOverTime.map(compare => ({
            name: compareOptions.requestsOverTime.find(opt => opt.value === compare)!.label,
            value: compare === "totalRequests" ? totalRequests :
                   compare === "avgHourly" ? avgHourly :
                   compare === "maxHourly" ? maxHourly :
                   minHourly,
          })),
        ],
        categoryDistribution: [
          ...categoryDistribution,
          ...compares.categoryDistribution.map(compare => ({
            name: compareOptions.categoryDistribution.find(opt => opt.value === compare)!.label,
            value: compare === "totalQueries" ? totalQueries :
                   compare === "avgPerCategory" ? avgPerCategory :
                   compare === "maxCategory" ? maxCategory :
                   uniqueCategories,
          })),
        ],
        topQueries: [
          ...topQueriesChart,
          ...compares.topQueries.map(compare => ({
            name: compareOptions.topQueries.find(opt => opt.value === compare)!.label,
            value: compare === "queryCount" ? totalQueries :
                   compare === "avgQueryCount" ? avgQueryCount :
                   compare === "maxQuery" ? maxQuery :
                   featuredQueries,
          })),
        ],
        successRate: [
          ...successRate,
          ...compares.successRate.map(compare => ({
            name: compareOptions.successRate.find(opt => opt.value === compare)!.label,
            value: compare === "successRate" ? overallSuccessRate * 100 :
                   compare === "errorRate" ? 100 - overallSuccessRate * 100 :
                   compare === "avgSuccess" ? avgSuccess :
                   variance,
          })),
        ],
        keyMetrics: [
          ...keyMetrics,
          ...compares.keyMetrics.map(compare => ({
            name: compareOptions.keyMetrics.find(opt => opt.value === compare)!.label,
            value: compare === "totalRequests" ? totalRequests :
                   compare === "successRate" ? overallSuccessRate * 100 :
                   compare === "endpoints" ? enhancedData.length :
                   avgRequests,
          })),
        ],
      });
    } catch (error) {
      console.error("Error fetching data:", error);
      setEndpointData([]);
      setChartData({});
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setSelectedQuery(null);
  }, [selectedChart]);

  // Aggregate top queries
  const queryAggregation = new Map<
    string,
    { count: number; id: number; featured: boolean; category: string; type: string; endpointDetails: { endpoint: string; count: number }[] }
  >();
  endpointData.forEach((ep) => {
    ep.queries.forEach((q) => {
      const existing = queryAggregation.get(q.query) || { count: 0, id: q.id, featured: q.featured, category: q.category, type: q.type, endpointDetails: [] };
      queryAggregation.set(q.query, {
        count: existing.count + q.count,
        id: existing.id,
        featured: existing.featured,
        category: existing.category,
        type: existing.type,
        endpointDetails: [
          ...existing.endpointDetails,
          { endpoint: ep.endpoint, count: q.count },
        ],
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

  // Summary stats
  const getSummaryStats = (selectedChart: string) => {
    const data = chartData[selectedChart];
    if (!data || data.length === 0) return [];

    const values = data.map((point: any) => point.value);
    const total = values.reduce((sum: number, val: number) => sum + val, 0);

    switch (selectedChart) {
      case "requestsOverTime":
      case "topQueries":
        return [
          { label: "Total", value: total.toLocaleString() },
          ...compares[selectedChart].map(compare => {
            const compareData = chartData[selectedChart].find((d: any) => d.name === compareOptions[selectedChart].find(opt => opt.value === compare)!.label);
            return {
              label: compareOptions[selectedChart].find(opt => opt.value === compare)!.label,
              value: compareData ? compareData.value.toLocaleString() : "N/A",
            };
          }),
        ];
      case "categoryDistribution":
        return [
          { label: "Total Queries", value: total.toLocaleString() },
          ...compares[selectedChart].map(compare => {
            const compareData = chartData[selectedChart].find((d: any) => d.name === compareOptions[selectedChart].find(opt => opt.value === compare)!.label);
            return {
              label: compareOptions[selectedChart].find(opt => opt.value === compare)!.label,
              value: compareData ? compareData.value.toLocaleString() : "N/A",
            };
          }),
        ];
      case "successRate":
        return [
          { label: "Overall Success Rate", value: `${(chartData.successRate.find((d: any) => d.name === "Success Rate")?.value || 0).toFixed(2)}%` },
          ...compares[selectedChart].map(compare => {
            const compareData = chartData[selectedChart].find((d: any) => d.name === compareOptions[selectedChart].find(opt => opt.value === compare)!.label);
            return {
              label: compareOptions[selectedChart].find(opt => opt.value === compare)!.label,
              value: compareData ? `${compareData.value.toFixed(2)}%` : "N/A",
            };
          }),
        ];
      case "keyMetrics":
        return [
          { label: "Total Requests", value: totalRequests.toLocaleString() },
          ...compares[selectedChart].map(compare => {
            const compareData = chartData[selectedChart].find((d: any) => d.name === compareOptions[selectedChart].find(opt => opt.value === compare)!.label);
            return {
              label: compareOptions[selectedChart].find(opt => opt.value === compare)!.label,
              value: compareData ? (compare === "successRate" ? `${compareData.value.toFixed(2)}%` : compareData.value.toLocaleString()) : "N/A",
            };
          }),
        ];
      default:
        return [];
    }
  };

  // Render summary in grid layout
  const renderSummary = () => {
    const stats = getSummaryStats(selectedChart);
    const summaryContent = selectedQuery ? (
      <>
        <Text><strong>Query:</strong> {selectedQuery.query}</Text>
        <Text><strong>Total Count:</strong> {selectedQuery.count}</Text>
        <Text><strong>Category:</strong> {selectedQuery.category}</Text>
        <Text><strong>Type:</strong> {selectedQuery.type}</Text>
        <Text><strong>Featured:</strong> {selectedQuery.featured ? "Yes" : "No"}</Text>
        {selectedQuery.endpointDetails && (
          <Box mt={2}>
            <Text fontSize="sm" fontWeight="semibold">Endpoint Breakdown:</Text>
            {selectedQuery.endpointDetails.map((detail, idx) => (
              <Text key={idx} fontSize="sm">
                {detail.endpoint}: {detail.count}
              </Text>
            ))}
          </Box>
        )}
      </>
    ) : (
      <Grid templateColumns="repeat(4, 1fr)" gap={4}>
        {stats.map((stat, index) => (
          <Stat key={index}>
            <StatLabel color="gray.400">{stat.label}</StatLabel>
            <StatNumber fontSize="xl">{stat.value}</StatNumber>
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

  // Toggle compare function
  const toggleCompare = (chartKey: string, value: string) => {
    setCompares((prev) => ({
      ...prev,
      [chartKey]: prev[chartKey].includes(value)
        ? prev[chartKey].filter((v) => v !== value)
        : [...prev[chartKey], value],
    }));
  };

  // Get selected chart option
  const selectedOption = chartOptions.find((opt) => opt.key === selectedChart)!;
  const selectedColor = selectedOption.color;
  const yAxisLabel = selectedOption.yAxisLabel;

  // Split compare options into rows of 4
  const chunkArray = (array: any[], size: number) => {
    const result = [];
    for (let i = 0; i < array.length; i += size) {
      result.push(array.slice(i, i + size));
    }
    return result;
  };

  const compareRows = chunkArray(compareOptions[selectedChart], 4);

  return (
    <Box p={4} width="100%">
      {/* Header with title and controls */}
      <Flex justify="space-between" align="center" mb={4} wrap="wrap" gap={2}>
        <Text fontSize="lg" fontWeight="bold">OverviewGSerp</Text>
        <Flex align="center" gap={2} ml="auto">
          <ButtonGroup size="sm" variant="outline">
            {chartOptions.map((option) => (
              <Tooltip key={option.key} label={`View ${option.label}`}>
                <Button
                  bg={selectedChart === option.key ? option.color : "gray.700"}
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
      ) : (
        <>
          {/* Chart and Summary Grid */}
          <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={6} mb={6} alignItems="start">
            <GridItem>
              <Text fontSize="md" fontWeight="semibold" mb={2}>
                {selectedOption.label}
              </Text>
              <Box height="400px" borderRadius="md" overflow="hidden" shadow="md" bg="gray.700">
                <ResponsiveContainer width="100%" height="100%">
                  {selectedChart === "requestsOverTime" ? (
                    <LineChart
                      data={chartData.requestsOverTime}
                      margin={{ top: 20, right: 20, bottom: showLabels ? 60 : 20, left: showLabels ? 40 : 20 }}
                    >
                      <CartesianGrid stroke="gray.600" />
                      <XAxis
                        dataKey="hour"
                        stroke="#FFFFFF"
                        tick={{ fill: "#FFFFFF", fontSize: 12, dy: -10 }}
                        tickMargin={10}
                        interval="preserveStartEnd"
                        label={
                          showLabels
                            ? { value: "Time (Hour)", position: "insideBottom", offset: -20, fill: "#FFFFFF", fontSize: 14 }
                            : undefined
                        }
                      />
                      <YAxis
                        stroke="#FFFFFF"
                        tick={{ fill: "#FFFFFF", fontSize: 12 }}
                        tickMargin={10}
                        label={
                          showLabels
                            ? { value: yAxisLabel, angle: -45, position: "insideLeft", offset: -20, fill: "#FFFFFF", fontSize: 14 }
                            : undefined
                        }
                      />
                      <RechartsTooltip contentStyle={{ backgroundColor: "gray.700", color: "white" }} />
                      <Line type="monotone" dataKey="value" stroke={selectedColor} />
                    </LineChart>
                  ) : (
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
                            ? { value: selectedChart === "keyMetrics" ? "Metrics" : selectedChart === "categoryDistribution" ? "Categories" : "Queries", position: "insideBottom", offset: -20, fill: "#FFFFFF", fontSize: 14 }
                            : undefined
                        }
                      />
                      <YAxis
                        stroke="#FFFFFF"
                        tick={{ fill: "#FFFFFF", fontSize: 12 }}
                        tickMargin={10}
                        domain={selectedChart === "successRate" ? [0, 100] : undefined}
                        label={
                          showLabels
                            ? { value: yAxisLabel, angle: -45, position: "insideLeft", offset: -20, fill: "#FFFFFF", fontSize: 14 }
                            : undefined
                        }
                      />
                      <RechartsTooltip contentStyle={{ backgroundColor: "gray.700", color: "white" }} />
                      {chartData[selectedChart].map((entry, index) => (
                        <Bar key={index} dataKey="value" fill={BAR_COLORS[index % BAR_COLORS.length]} />
                      ))}
                    </BarChart>
                  )}
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

          {/* Top Queries Table */}
          <Box mt={6}>
            <Text fontSize="md" fontWeight="semibold" mb={2}>Top Search Queries</Text>
            <Box shadow="md" borderWidth="1px" borderRadius="md" overflowX="auto">
              <Table variant="simple" size="sm">
                <Thead>
                  <Tr>
                    <Th>Query</Th>
                    <Th>Count</Th>
                    <Th>Category</Th>
                    <Th>Type</Th>
                    <Th>Featured</Th>
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
                      <Td>{query.count}</Td>
                      <Td>{query.category}</Td>
                      <Td>{query.type}</Td>
                      <Td>{query.featured ? "Yes" : "No"}</Td>
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

export default OverviewGSerp;