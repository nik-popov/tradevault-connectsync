import { createFileRoute } from "@tanstack/react-router";
import { Container, Flex, Text, Tabs, TabList, TabPanels, Tab, TabPanel, Box, Heading, Alert, AlertIcon, Grid, GridItem, Table, Thead, Tbody, Tr, Th, Td } from "@chakra-ui/react";
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

  const TabsConfig = [
    {
      title: "Overview",
      component: () => (
        <Box>
          <Heading size="md" mb={4}>Usage</Heading>
          <Box borderWidth="1px" borderRadius="md" p={4} mb={4}>
            <Flex align="baseline" gap={2}>
              <Text fontSize="sm">Total Requests This Month:</Text>
              <Heading size="sm">{totalRequests}</Heading>
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
                      <Td><Text fontSize="sm">{totalRequests}</Text></Td>
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
              <Box height="300px" bg="gray.100" borderRadius="md" display="flex" alignItems="center" justifyContent="center">
                <Text fontSize="xs" color="gray.500">Graph data unavailable</Text>
              </Box>
            </GridItem>
          </Grid>
          <Heading size="md" mt={6} mb={4}>Recent Logs</Heading>
          <Box borderWidth="1px" borderRadius="md" p={4}>
            <Text fontSize="sm">No recent logs</Text>
          </Box>
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
        <Heading size="lg">HTTPS Request Proxy API</Heading>
        <Text fontSize="sm" color="gray.500">
          Active subscription: {subscriptions?.plan_name || "None"}
        </Text>
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
                  {proxyApiAccess?.message || "Your account does not include https request proxy features. Please upgrade to a proxy api enabled plan."}
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