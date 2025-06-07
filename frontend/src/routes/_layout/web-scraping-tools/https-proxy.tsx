import { createFileRoute } from "@tanstack/react-router";
import { Container, Flex, Text, Tabs, TabList, TabPanels, Tab, TabPanel, Box, Heading, Alert, AlertIcon, Grid, GridItem, Table, Tbody, Tr, Td } from "@chakra-ui/react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import ProtectedComponent from "../../../components/Common/ProtectedComponent";
import PlaygroundGSerp from "../../../components/ScrapingTools/PlaygroundGSerp";
import ApiKeyGSerp from "../../../components/ScrapingTools/ApiKeyGSerp";
import { useQuery } from "@tanstack/react-query";

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

const API_URL = "https://api.thedataproxy.com/v2/proxy";

async function fetchSubscriptions(): Promise<Subscription[]> {
  const token = localStorage.getItem("access_token");
  if (!token) {
    throw new Error("No access token found. Please log in again.");
  }

  try {
    const response = await fetch("https://api.thedataproxy.com/v2/customer/subscriptions", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.detail || `Failed to fetch subscriptions: ${response.status}`
      );
    }

    return response.json();
  } catch (error) {
    console.error("Subscriptions fetch error:", error);
    throw error;
  }
}

async function fetchProxyApiAccess(): Promise<ProxyApiAccess> {
  const token = localStorage.getItem("access_token");
  if (!token) {
    throw new Error("No access token found. Please log in again.");
  }

  try {
    const response = await fetch("https://api.thedataproxy.com/v2/proxy-api/access", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.detail || `Failed to check proxy API access: ${response.status}`
      );
    }

    return response.json();
  } catch (error) {
    console.error("Proxy API access fetch error:", error);
    throw error;
  }
}

async function fetchApiKeys(token: string): Promise<ApiKey[]> {
  try {
    const response = await fetch(`${API_URL}/api-keys`, {
      method: "GET",
      headers: {
        "Accept": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch API keys: ${response.status}`);
    }
    const data: ApiKey[] = await response.json();
    return data.map((key) => ({
      ...key,
      request_count: key.request_count ?? 0,
      created_at: key.created_at || new Date().toISOString(),
      expires_at: key.expires_at || new Date().toISOString(),
      is_active: key.is_active ?? false,
      key_preview: key.key_preview || "N/A",
    }));
  } catch (error) {
    console.error("API keys fetch error:", error);
    throw error;
  }
}

const GoogleSerpPage = () => {
  const { data: subscriptions, isLoading: isSubscriptionsLoading, error: subscriptionsError } = useQuery({
    queryKey: ["subscriptions"],
    queryFn: fetchSubscriptions,
    staleTime: 5 * 60 * 1000,
  });

  const { data: proxyApiAccess, isLoading: isAccessLoading, error: accessError } = useQuery({
    queryKey: ["proxyApiAccess"],
    queryFn: fetchProxyApiAccess,
    staleTime: 5 * 60 * 1000,
  });

  const token = localStorage.getItem("access_token");

  const { data: apiKeys, isLoading: isApiKeysLoading, error: apiKeysError } = useQuery({
    queryKey: ["apiKeys"],
    queryFn: () => fetchApiKeys(token || ""),
    staleTime: 5 * 60 * 1000,
    enabled: !!token,
  });

  // Calculate total request count dynamically from API keys
  const totalRequests = apiKeys?.reduce((sum, key) => sum + (key.request_count || 0), 0) || 0;

  // Determine subscription status
  const hasActiveSubscription = subscriptions?.some(
    (sub) => ["active", "trialing"].includes(sub.status)
  ) || false;
  const activeSubscription = subscriptions?.find(
    (sub) => ["active", "trialing"].includes(sub.status)
  );

  // Static data for the request usage graph
  const chartData = [
    { date: "Day 1", Requests: 4000 },
    { date: "Day 2", Requests: 3000 },
    { date: "Day 3", Requests: 2000 },
    { date: "Day 4", Requests: 2780 },
    { date: "Day 5", Requests: 1890 },
    { date: "Day 6", Requests: 2390 },
    { date: "Day 7", Requests: 3490 },
    { date: "Day 8", Requests: 4100 },
    { date: "Day 9", Requests: 3200 },
    { date: "Day 10", Requests: 5000 },
    { date: "Day 11", Requests: 4500 },
    { date: "Day 12", Requests: 4800 },
    { date: "Day 13", Requests: 5200 },
    { date: "Day 14", Requests: 5800 },
    { date: "Day 15", Requests: 6100 },
  ];

  const TabsConfig = [
    {
      title: "Overview",
      component: () => (
        <Box>
          <Box borderWidth="1px" borderRadius="md" p={4} mb={4}>
            <Flex align="baseline" gap={2}>
              <Text fontSize="sm">Total Requests This Month:</Text>
              <Heading size="sm">{totalRequests.toLocaleString()}</Heading>
            </Flex>
          </Box>
          <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={6}>
            <GridItem>
              <Heading size="md" mb={4}>Details</Heading>
              <Box shadow="md" borderWidth="1px" borderRadius="md" overflowX="auto">
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
              <Box shadow="md" borderWidth="1px" borderRadius="md" p={4} height="300px">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={chartData}
                    margin={{
                      top: 5, right: 30, left: 0, bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" fontSize="12px" />
                    <YAxis fontSize="12px" />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="Requests" stroke="#3182CE" activeDot={{ r: 8 }} />
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
      component: () => (
        <ApiKeyGSerp token={token} />
      ),
    },
    {
      title: "Playground",
      component: () => (
        <PlaygroundGSerp />
      ),
    },
  ];
  return (
  <ProtectedComponent>
    <Container maxW="full">
      <Flex align="center" justify="space-between" py={6} gap={4}>
        <Heading size="md">HTTPS Request API</Heading>
      </Flex>
      {isSubscriptionsLoading || isAccessLoading || isApiKeysLoading ? (
        <Text fontSize="sm">Loading user details...</Text>
      ) : subscriptionsError || accessError || apiKeysError ? (
        <Alert status="error">
          <AlertIcon />
          <Text fontSize="sm">
            Error: {(subscriptionsError?.message || accessError?.message || apiKeysError?.message) || "Failed to load user details. Please try again later."}
          </Text>
        </Alert>
      ) : !hasActiveSubscription ? (
        <Alert status="error">
          <AlertIcon />
          <Text fontSize="sm">No active products associated with your account.</Text>
        </Alert>
      ) : (
        <>
          {!proxyApiAccess?.has_access && (
            <Alert status="warning" mb={4}>
              <AlertIcon />
              <Text fontSize="sm">
                {proxyApiAccess?.message || "Your account does not include https request features. Please upgrade to a proxy api enabled plan."}
              </Text>
            </Alert>
          )}
          <Tabs>
            <TabList>
              {TabsConfig.map((tab, index) => (
                <Tab key={index} fontSize="sm">{tab.title}</Tab>
              ))}
            </TabList>
            <TabPanels>
              {TabsConfig.map((tab, index) => (
                <TabPanel key={index}>{tab.component()}</TabPanel>
              ))}
            </TabPanels>
          </Tabs>
        </>
      )}
    </Container>
  </ProtectedComponent>
);
};

export const Route = createFileRoute("/_layout/web-scraping-tools/https-proxy")({
  component: GoogleSerpPage,
});

export default GoogleSerpPage;