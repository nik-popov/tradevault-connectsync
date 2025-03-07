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
  Tooltip,
  Button,
  Input,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Spinner,
} from "@chakra-ui/react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
} from "recharts";

interface OverviewProps {
  endpointId?: string;
}

interface QueryDetail {
  query: string;
  count: number;
  similarQueries: string[];
  scrapeFrequency: string;
}

interface CategoryData {
  category: string;
  totalCount: number;
  queries: QueryDetail[];
}

interface EndpointMetrics {
  requestsToday: number;
  successRate: number;
  itemsScraped: number;
  topCategories: CategoryData[];
  requestsOverTime: { hour: string; requests: number }[];
  errorRate: number;
}

const endpointData: Record<string, EndpointMetrics> = {
  "G-CLOUD-SOUTHAMERICA-WEST1": {
    requestsToday: 1200,
    successRate: 98.7,
    itemsScraped: 450,
    topCategories: [
      {
        category: "T-Shirts",
        totalCount: 210,
        queries: [
          { 
            query: "Off-White Logo T-Shirt", 
            count: 150, 
            similarQueries: ["Off-White Tee", "Logo Tee Off-White"], 
            scrapeFrequency: "Daily" 
          },
          { 
            query: "Off-White Arrow Hoodie", 
            count: 60, 
            similarQueries: ["Arrow Hoodie Off-White", "Off-White Sweatshirt"], 
            scrapeFrequency: "Weekly" 
          },
        ],
      },
      {
        category: "Sneakers",
        totalCount: 150,
        queries: [
          { 
            query: "Off-White Vulcanized Sneakers", 
            count: 120, 
            similarQueries: ["Vulcanized Off-White", "Off-White Sneakers"], 
            scrapeFrequency: "Hourly" 
          },
          { 
            query: "Off-White ODSY-1000 Sneakers", 
            count: 30, 
            similarQueries: ["ODSY Sneakers", "Off-White ODSY"], 
            scrapeFrequency: "Daily" 
          },
        ],
      },
      {
        category: "Backpacks",
        totalCount: 90,
        queries: [
          { 
            query: "Off-White Industrial Backpack", 
            count: 90, 
            similarQueries: ["Industrial Backpack Off-White", "Off-White Bag"], 
            scrapeFrequency: "Daily" 
          },
        ],
      },
    ],
    requestsOverTime: [
      { hour: "00:00", requests: 50 },
      { hour: "06:00", requests: 100 },
      { hour: "12:00", requests: 300 },
      { hour: "18:00", requests: 250 },
      { hour: "23:00", requests: 150 },
    ],
    errorRate: 1.3,
  },
  "G-CLOUD-US-CENTRAL1": {
    requestsToday: 1800,
    successRate: 99.2,
    itemsScraped: 600,
    topCategories: [
      {
        category: "T-Shirts",
        totalCount: 270,
        queries: [
          { 
            query: "Off-White Caravaggio T-Shirt", 
            count: 200, 
            similarQueries: ["Caravaggio Tee", "Off-White Art Tee"], 
            scrapeFrequency: "Daily" 
          },
          { 
            query: "Off-White Diag Tee", 
            count: 70, 
            similarQueries: ["Diagonal Tee", "Off-White Diag Shirt"], 
            scrapeFrequency: "Weekly" 
          },
        ],
      },
      {
        category: "Sneakers",
        totalCount: 210,
        queries: [
          { 
            query: "Off-White Out of Office Sneakers", 
            count: 180, 
            similarQueries: ["OOO Sneakers", "Off-White Casual Shoes"], 
            scrapeFrequency: "Hourly" 
          },
          { 
            query: "Off-White Low Vulcanized", 
            count: 30, 
            similarQueries: ["Low Vulc Off-White", "Vulcanized Low"], 
            scrapeFrequency: "Daily" 
          },
        ],
      },
      {
        category: "Backpacks",
        totalCount: 120,
        queries: [
          { 
            query: "Off-White Mini Backpack", 
            count: 120, 
            similarQueries: ["Mini Bag Off-White", "Off-White Small Backpack"], 
            scrapeFrequency: "Daily" 
          },
        ],
      },
    ],
    requestsOverTime: [
      { hour: "00:00", requests: 80 },
      { hour: "06:00", requests: 150 },
      { hour: "12:00", requests: 400 },
      { hour: "18:00", requests: 300 },
      { hour: "23:00", requests: 200 },
    ],
    errorRate: 0.8,
  },
  "G-CLOUD-US-EAST4": {
    requestsToday: 13080,
    successRate: 98.8,
    itemsScraped: 3200,
    topCategories: [
      {
        category: "T-Shirts",
        totalCount: 1400,
        queries: [
          { 
            query: "Off-White Meteor T-Shirt", 
            count: 900, 
            similarQueries: [" Meteor Tee", "Off-White Meteor Top"], 
            scrapeFrequency: "Daily" 
          },
          { 
            query: "Off-White Quote Tee", 
            count: 500, 
            similarQueries: ["Quote Shirt Off-White", "Off-White Text Tee"], 
            scrapeFrequency: "Weekly" 
          },
        ],
      },
      {
        category: "Sneakers",
        totalCount: 1200,
        queries: [
          { 
            query: "Off-White Arrow Sneakers", 
            count: 800, 
            similarQueries: ["Arrow Shoes Off-White", "Off-White Sneaker Arrow"], 
            scrapeFrequency: "Hourly" 
          },
          { 
            query: "Off-White High-Top Sneakers", 
            count: 400, 
            similarQueries: ["High-Top Off-White", "Off-White Tall Sneakers"], 
            scrapeFrequency: "Daily" 
          },
        ],
      },
      {
        category: "Backpacks",
        totalCount: 600,
        queries: [
          { 
            query: "Off-White Camo Backpack", 
            count: 600, 
            similarQueries: ["Camo Bag Off-White", "Off-White Camouflage"], 
            scrapeFrequency: "Daily" 
          },
        ],
      },
    ],
    requestsOverTime: [
      { hour: "00:00", requests: 500 },
      { hour: "06:00", requests: 1000 },
      { hour: "12:00", requests: 3500 },
      { hour: "18:00", requests: 3000 },
      { hour: "23:00", requests: 1500 },
    ],
    errorRate: 1.2,
  },
};

const Overview: React.FC<OverviewProps> = ({ endpointId }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [refreshInterval, setRefreshInterval] = useState(60000);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      if (!endpointId || !endpointData[endpointId]) {
        throw new Error("Invalid or missing endpoint ID");
      }
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate API call
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    let interval: NodeJS.Timeout;
    if (autoRefresh) {
      interval = setInterval(fetchData, refreshInterval);
    }
    return () => clearInterval(interval);
  }, [endpointId, autoRefresh, refreshInterval]);

  if (!endpointId) {
    return (
      <Box p={4} bg="gray.800" color="white">
        <Text fontSize="lg" fontWeight="bold" mb={4}>
          Overview
        </Text>
        <Text color="gray.400">No endpoint specified.</Text>
      </Box>
    );
  }

  const data = endpointData[endpointId];

  if (!data) {
    return (
      <Box p={4} bg="gray.800" color="white">
        <Text fontSize="lg" fontWeight="bold" mb={4}>
          Overview for {endpointId}
        </Text>
        <Text color="gray.400">No data available for this endpoint.</Text>
      </Box>
    );
  }

  const { requestsToday, successRate, itemsScraped, topCategories, requestsOverTime, errorRate } = data;

  const tooltipStyle = { backgroundColor: "gray.700", color: "white" };

  return (
    <Box p={4} bg="gray.800" color="white" width="100%">
      {/* Header */}
      <Flex justify="space-between" align="center" mb={4} wrap="wrap" gap={2}>
        <Text fontSize="lg" fontWeight="bold">
          Overview for {endpointId}
        </Text>
        <Flex align="center" gap={2} wrap="wrap">
          <Flex direction="row-reverse" align="center" gap={2}>
            <Button
              size="sm"
              colorScheme={autoRefresh ? "green" : "gray"}
              onClick={() => setAutoRefresh(!autoRefresh)}
            >
              {autoRefresh ? "Auto Refresh: On" : "Auto Refresh: Off"}
            </Button>
            {autoRefresh && (
              <Flex align="center" gap={1}>
                <Input
                  size="sm"
                  type="number"
                  value={refreshInterval / 1000}
                  onChange={(e) => setRefreshInterval(Math.max(30, Number(e.target.value)) * 1000)}
                  width="60px"
                />
                <Button size="sm" colorScheme="gray" isDisabled>
                  Interval (s):
                </Button>
              </Flex>
            )}
          </Flex>
          <Tooltip label="Refresh overview data immediately">
            <Button size="sm" colorScheme="blue" onClick={fetchData} isLoading={isLoading}>
              Refresh Now
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
          {/* Scraping Summary and Requests Over Time */}
          <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={6} mb={6}>
            <GridItem>
              <Text fontSize="md" fontWeight="semibold" mb={2}>
                Scraping Summary
              </Text>
              <Box
                borderWidth="1px"
                borderRadius="md"
                p={4}
                shadow="md"
                bg="gray.700"
                height="250px"
                display="flex"
                flexDirection="column"
                justifyContent="space-between"
              >
                <Stat>
                  <StatLabel color="gray.400">Requests Today</StatLabel>
                  <StatNumber fontSize="xl">{requestsToday.toLocaleString()}</StatNumber>
                </Stat>
                <Stat>
                  <StatLabel color="gray.400">Success Rate</StatLabel>
                  <StatNumber fontSize="xl">{successRate.toFixed(1)}%</StatNumber>
                </Stat>
                <Stat>
                  <StatLabel color="gray.400">Items Scraped</StatLabel>
                  <StatNumber fontSize="xl">{itemsScraped.toLocaleString()}</StatNumber>
                </Stat>
                <Stat>
                  <StatLabel color="gray.400">Error Rate</StatLabel>
                  <StatNumber fontSize="xl">{errorRate.toFixed(1)}%</StatNumber>
                </Stat>
              </Box>
            </GridItem>
            <GridItem>
              <Text fontSize="md" fontWeight="semibold" mb={2}>
                Requests Over Time (Today)
              </Text>
              <Box height="250px" borderRadius="md" overflow="hidden" shadow="md" bg="gray.700">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={requestsOverTime}>
                    <CartesianGrid stroke="gray.600" />
                    <XAxis dataKey="hour" stroke="gray.200" />
                    <YAxis stroke="gray.200" />
                    <RechartsTooltip contentStyle={tooltipStyle} />
                    <Line type="monotone" dataKey="requests" stroke="#9F7AEA" />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </GridItem>
          </Grid>

          {/* Top Categories */}
          <Box>
            <Text fontSize="md" fontWeight="semibold" mb={2}>
              Top Categories
            </Text>
            <Box borderWidth="1px" borderRadius="md" shadow="md" bg="gray.700" p={4}>
              <Table variant="simple" size="md">
                <Thead>
                  <Tr>
                    <Th>Category</Th>
                    <Th>Total Count</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {topCategories.map((category, catIndex) => (
                    <React.Fragment key={catIndex}>
                      <Tr bg="gray.600">
                        <Td fontWeight="bold">{category.category}</Td>
                        <Td fontWeight="bold">{category.totalCount}</Td>
                      </Tr>
                      <Tr>
                        <Td colSpan={2} p={0}>
                          <Table variant="simple" size="sm" mb={4}>
                            <Thead>
                              <Tr>
                                <Th>Query</Th>
                                <Th>Count</Th>
                                <Th>Similar Queries</Th>
                                <Th>Scrape Frequency</Th>
                              </Tr>
                            </Thead>
                            <Tbody>
                              {category.queries.map((query, queryIndex) => (
                                <Tr key={queryIndex}>
                                  <Td>{query.query}</Td>
                                  <Td>{query.count}</Td>
                                  <Td>{query.similarQueries.join(", ") || "N/A"}</Td>
                                  <Td>{query.scrapeFrequency || "N/A"}</Td>
                                </Tr>
                              ))}
                            </Tbody>
                          </Table>
                        </Td>
                      </Tr>
                    </React.Fragment>
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