import { createFileRoute } from "@tanstack/react-router";
import { Container, Flex, Text, Tabs, TabList, TabPanels, Tab, TabPanel, Box, Heading } from "@chakra-ui/react";
import ProtectedComponent from "../../../components/ProtectedComponent";
import PlaygroundGSerp from "../../../components/PlaygroundGSerp";
import ApiKeyGSerp from "../../../components/ApiKeyGSerp";
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
          <Heading size="md" mb={4}>Monthly Request Overview</Heading>
          <Box borderWidth="1px" borderRadius="lg" p={4} mb={4}>
            <Text>No requests this month</Text>
            <Box mt={4} height="200px" bg="gray.100" display="flex" alignItems="center" justifyContent="center">
              <Text color="gray.500">No request data available</Text>
            </Box>
          </Box>
          <Heading size="md" mb={4}>Recent Activity Logs</Heading>
          <Box borderWidth="1px" borderRadius="lg" p={4}>
            <Text>No recent activity logs</Text>
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
        <Flex align="center" justify="space-between" py={6}>
          <Text fontSize="xl">HTTPs Proxy API</Text>
          <Text fontSize="sm">Manage your proxy settings and API keys.</Text>
        </Flex>
        {isSubscriptionsLoading || isAccessLoading ? (
          <Text>Loading subscription details...</Text>
        ) : subscriptionsError || accessError ? (
          <Text color="red.500">
            Error: {(subscriptionsError?.message || accessError?.message) || "Failed to load subscription details. Please try again later."}
          </Text>
        ) : !hasActiveSubscription ? (
          <Text color="red.500">
            No active subscription. Please subscribe to use proxy API features.
          </Text>
        ) : (
          <>
            <Text mb={4}>
              Your Plan: {activeSubscription?.product_name || activeSubscription?.plan_name || "Unknown"} (
              {activeSubscription?.status
                ? activeSubscription.status.charAt(0).toUpperCase() + activeSubscription.status.slice(1)
                : "Unknown"})
            </Text>
            {!proxyApiAccess?.has_access && (
              <Text color="orange.500" mb={4}>
                {proxyApiAccess?.message || "Your subscription plan does not include proxy API features. Please upgrade to a proxy-api-enabled plan."}
              </Text>
            )}
            <Tabs>
              <TabList>
                {TabsConfig.map((tab, index) => (
                  <Tab key={index}>{tab.title}</Tab>
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

export const Route = createFileRoute("/_layout/scraping-tools/https-proxy")({
  component: GoogleSerpPage,
});

export default GoogleSerpPage;