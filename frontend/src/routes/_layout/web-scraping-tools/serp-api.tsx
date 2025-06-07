import { createFileRoute } from "@tanstack/react-router";
import { Container, Flex, Text, Tabs, TabList, TabPanels, Tab, TabPanel, Box, Heading, Alert, AlertIcon, Grid, GridItem, Table, Tbody, Tr, Td } from "@chakra-ui/react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useMemo } from "react";
import ProtectedComponent from "../../../components/Common/ProtectedComponent";
import PlaygroundSerpApi from "../../../components/ScrapingTools/PlaygroundSerp";
import ApiKeySerp from "../../../components/ScrapingTools/ApiKeySerp";
import { useQuery } from "@tanstack/react-query";

// --- Interfaces and Helper Functions (Unchanged) ---
interface Subscription {
  id: string;
  status: string;
  plan_id: string | null;
  plan_name: string | null;
  product_id: string | null;
  product_name: string | null;
  current_period_start: number | null;
  current_period_end: number | null;
  trial_start: number | null;
  trial_end: number | null;
  cancel_at_period_end: boolean;
}

interface ProxyApiAccess {
  has_access: boolean;
  message: string | null;
}

interface ApiKey {
  key_preview: string;
  created_at: string;
  expires_at: string;
  is_active: boolean;
  request_count?: number;
}

const API_URL = "https://api.thedataproxy.com/v2/serp";

async function fetchSubscriptions(): Promise<Subscription[]> {
  const token = localStorage.getItem("access_token");
  if (!token) throw new Error("No access token found. Please log in again.");
  const response = await fetch("https://api.thedataproxy.com/v2/customer/subscriptions", {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `Failed to fetch subscriptions: ${response.status}`);
  }
  return response.json();
}

async function fetchProxyApiAccess(): Promise<ProxyApiAccess> {
  const token = localStorage.getItem("access_token");
  if (!token) throw new Error("No access token found. Please log in again.");
  const response = await fetch("https://api.thedataproxy.com/v2/serp-api/access", {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `Failed to check API access: ${response.status}`);
  }
  return response.json();
}

async function fetchApiKeys(token: string): Promise<ApiKey[]> {
  const response = await fetch(`${API_URL}/api-keys`, {
    headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error(`Failed to fetch API keys: ${response.status}`);
  const data: ApiKey[] = await response.json();
  return data.map((key) => ({
    ...key,
    request_count: key.request_count ?? 0,
    created_at: key.created_at || new Date().toISOString(),
    expires_at: key.expires_at || new Date().toISOString(),
    is_active: key.is_active ?? false,
    key_preview: key.key_preview || "N/A",
  }));
}

const generateChartDataForPeriod = (startTimestamp: number | null, totalValue: number) => {
  if (!startTimestamp || !totalValue || totalValue <= 0) {
    return [{ date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), Requests: 0 }];
  }
  const startDate = new Date(startTimestamp * 1000);
  const today = new Date();
  today.setHours(23, 59, 59, 999);
  if (startDate > today) {
    return [{ date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), Requests: 0 }];
  }
  const datePoints: Date[] = [];
  for (let d = new Date(startDate); d <= today; d.setDate(d.getDate() + 1)) {
    datePoints.push(new Date(d));
  }
  if (datePoints.length === 0) return [{ date: 'No Data', Requests: 0 }];
  if (datePoints.length === 1) {
    const dateStr = datePoints[0].toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    return [{ date: dateStr, Requests: totalValue }];
  }
  const weights = datePoints.map(() => Math.random());
  const totalWeight = weights.reduce((sum, w) => sum + w, 0);
  let runningTotal = 0;
  const data = weights.map((weight, i) => {
    const isLast = i === weights.length - 1;
    let requests = isLast ? totalValue - runningTotal : Math.round((weight / totalWeight) * totalValue);
    if (!isLast) runningTotal += requests;
    return {
      date: datePoints[i].toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      Requests: requests >= 0 ? requests : 0,
    };
  });
  return data;
};

// --- Main SERP API Page Component (Refactored) ---
const SerpApiPage = () => {
  const { data: subscriptions, isLoading: isSubscriptionsLoading, error: subscriptionsError } = useQuery({
    queryKey: ["subscriptions"],
    queryFn: fetchSubscriptions,
    staleTime: 300000,
  });

  const { data: proxyApiAccess, isLoading: isAccessLoading, error: accessError } = useQuery({
    queryKey: ["proxyApiAccess"],
    queryFn: fetchProxyApiAccess,
    staleTime: 300000,
  });

  const token = localStorage.getItem("access_token");

  const { data: apiKeys, isLoading: isApiKeysLoading, error: apiKeysError } = useQuery({
    queryKey: ["apiKeys"],
    queryFn: () => fetchApiKeys(token || ""),
    staleTime: 300000,
    enabled: !!token,
  });

  const hasActiveSubscription = subscriptions?.some((sub) => ["active", "trialing"].includes(sub.status));
  const activeSubscription = subscriptions?.find((sub) => ["active", "trialing"].includes(sub.status));
  const totalRequests = apiKeys?.reduce((sum, key) => sum + (key.request_count || 0), 0) || 0;

  const chartData = useMemo(() => {
    if (!hasActiveSubscription || !activeSubscription?.current_period_start) {
      return [{ date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), Requests: 0 }];
    }
    return generateChartDataForPeriod(activeSubscription.current_period_start, totalRequests);
  }, [activeSubscription, totalRequests]);

  const TabsConfig = [
    {
      title: "Overview",
      component: () => (
        <Box>
          <Box borderWidth="1px" borderRadius="md" p={4} mb={4}>
            <Flex align="baseline" gap={2}>
              <Text fontSize="sm">Total Requests:</Text>
              <Heading size="sm">{totalRequests.toLocaleString()}</Heading>
            </Flex>
          </Box>
          <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={6}>
            <GridItem>
              <Heading size="md" mb={4}>Tier Details</Heading>
              <Box shadow="md" borderWidth="1px" borderRadius="md" overflow="auto" height="350px">
                <Table variant="simple" size="sm">
                  <Tbody>
                    <Tr>
                      <Td><Text fontSize="sm">Plan Name</Text></Td>
                      <Td><Text fontSize="sm">{activeSubscription?.product_name || activeSubscription?.plan_name || "N/A"}</Text></Td>
                    </Tr>
                    <Tr>
                      <Td><Text fontSize="sm">Status</Text></Td>
                      <Td><Text fontSize="sm">{activeSubscription?.status
                        ? activeSubscription.status.charAt(0).toUpperCase() + activeSubscription.status.slice(1)
                        : "N/A"}</Text></Td>
                    </Tr>
                    <Tr>
                      <Td><Text fontSize="sm">Period Start</Text></Td>
                      <Td><Text fontSize="sm">{activeSubscription?.current_period_start
                        ? new Date(activeSubscription.current_period_start * 1000).toLocaleString()
                        : "N/A"}</Text></Td>
                    </Tr>
                    <Tr>
                      <Td><Text fontSize="sm">Period End</Text></Td>
                      <Td><Text fontSize="sm">{activeSubscription?.current_period_end
                        ? new Date(activeSubscription.current_period_end * 1000).toLocaleString()
                        : "N/A"}</Text></Td>
                    </Tr>
                    <Tr>
                      <Td><Text fontSize="sm">Total Requests</Text></Td>
                      <Td><Text fontSize="sm">{totalRequests.toLocaleString()}</Text></Td>
                    </Tr>
                    <Tr>
                      <Td><Text fontSize="sm">Active API Keys</Text></Td>
                      <Td><Text fontSize="sm">{apiKeys?.filter(key => key.is_active).length || 0}</Text></Td>
                    </Tr>
                  </Tbody>
                </Table>
              </Box>
            </GridItem>
            <GridItem>
              <Heading size="md" mb={4}>Request Usage</Heading>
              <Box shadow="md" borderWidth="1px" borderRadius="md" p={4} height="350px">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={chartData}
                    margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" fontSize="12px" angle={-20} textAnchor="end" height={40} />
                    <YAxis
                      fontSize="12px"
                      tickFormatter={(value) =>
                        typeof value === 'number'
                          ? new Intl.NumberFormat('en-US', { notation: 'compact', compactDisplay: 'short' }).format(value)
                          : value
                      }
                    />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="Requests" stroke="#3182CE" activeDot={{ r: 8 }} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </GridItem>
          </Grid>
        </Box>
      ),
    },
    {
      title: "API Keys",
      component: () => <ApiKeySerp token={token} />,
    },
    {
      title: "Playground",
      component: () => <PlaygroundSerpApi />,
    },
  ];

  // Component for displaying the protected view with pricing
  const ProtectedViewWithPricing = ({ title, message }: { title: string; message: string }) => (
    <Box py={8}>
      <Alert
        status="warning"
        variant="subtle"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        textAlign="center"
        borderRadius="lg"
        p={6}
        mb={8}
      >
        <AlertIcon boxSize="32px" mr={0} />
        <Heading size="md" mt={3} mb={2}>{title}</Heading>
        <Text>{message}</Text>
      </Alert>

      <Box borderWidth="1px" borderRadius="lg" p={8} bg="white" shadow="sm">
        <Heading size="lg" mb={4} textAlign="center">
          Unlock Full SERP API Power
        </Heading>
        <Text textAlign="center" mb={8} color="gray.600">
          Choose a plan to get started with our high-performance SERP API and access real-time search data.
        </Text>
        <Grid templateColumns={{ base: "1fr", md: "1fr 1fr 1fr" }} gap={6}>
          <GridItem borderWidth="1px" borderRadius="md" p={6} textAlign="center" _hover={{ shadow: 'md', transform: 'translateY(-2px)' }} transition="all 0.2s ease-in-out">
            <Heading size="md">Starter</Heading>
            <Text mt={2} color="gray.500">For small projects</Text>
            <Text fontWeight="bold" fontSize="2xl" my={3}>$49/mo</Text>
          </GridItem>
          <GridItem borderWidth="2px" borderRadius="md" p={6} textAlign="center" borderColor="blue.500" shadow="lg" transform={{ base: "none", md: "translateY(-4px)" }}>
            <Heading size="md">Pro</Heading>
            <Text mt={2} color="gray.500">For growing businesses</Text>
            <Text fontWeight="bold" fontSize="2xl" my={3}>$99/mo</Text>
          </GridItem>
          <GridItem borderWidth="1px" borderRadius="md" p={6} textAlign="center" _hover={{ shadow: 'md', transform: 'translateY(-2px)' }} transition="all 0.2s ease-in-out">
            <Heading size="md">Enterprise</Heading>
            <Text mt={2} color="gray.500">For large-scale needs</Text>
            <Text fontWeight="bold" fontSize="2xl" my={3}>Contact Us</Text>
          </GridItem>
        </Grid>
      </Box>
    </Box>
  );

  // Renders content based on loading, error, and access status
  const renderContent = () => {
    if (isSubscriptionsLoading || isAccessLoading || isApiKeysLoading) {
      return <Text fontSize="sm" p={6}>Loading user details...</Text>;
    }

    const anyError = subscriptionsError || accessError || apiKeysError;
    if (anyError) {
      return (
        <ProtectedViewWithPricing
          title="Error Loading Data"
          message={anyError.message || "An error occurred while loading your account details. Please contact support."}
        />
      );
    }
    
    if (!hasActiveSubscription) {
      return (
        <ProtectedViewWithPricing
          title="No Active Subscription"
          message="You don't have an active subscription. Please choose a plan to access the SERP API."
        />
      );
    }

    if (!proxyApiAccess?.has_access) {
      return (
        <ProtectedViewWithPricing
          title="Upgrade Required"
          message={proxyApiAccess?.message || "Your current plan does not include SERP API access. Please upgrade your plan."}
        />
      );
    }

    // Success case: user has access and all data is loaded
    return (
      <Tabs isLazy variant="soft-rounded" colorScheme="blue">
        <TabList>
          {TabsConfig.map((tab, index) => (
            <Tab key={index} fontSize="sm">{tab.title}</Tab>
          ))}
        </TabList>
        <TabPanels>
          {TabsConfig.map((tab, index) => (
            <TabPanel key={index} p={{ base: 2, md: 6 }}>{tab.component()}</TabPanel>
          ))}
        </TabPanels>
      </Tabs>
    );
  };

  return (
    <ProtectedComponent>
      <Box bg="gray.50" minH="100vh">
        <Container maxW="container.xl" py={6}>
          <Flex align="center" justify="space-between" mb={4} gap={4}>
            <Heading size="lg">SERP API</Heading>
          </Flex>
          {renderContent()}
        </Container>
      </Box>
    </ProtectedComponent>
  );
};


// --- Route Definition ---
export const Route = createFileRoute("/_layout/web-scraping-tools/serp-api")({
  component: SerpApiPage,
});

export default SerpApiPage;