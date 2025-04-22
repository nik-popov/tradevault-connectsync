import { createFileRoute } from "@tanstack/react-router";
import { Container, Flex, Text, Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
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
  current_period_start: number;
  current_period_end: number;
  trial_start: number | null;
  trial_end: number | null;
  cancel_at_period_end: boolean;
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

const GoogleSerpPage = () => {
  const { data: subscriptions, isLoading, error } = useQuery({
    queryKey: ["subscriptions"],
    queryFn: fetchSubscriptions,
    staleTime: 5 * 60 * 1000,
  });

  const token = localStorage.getItem("access_token");

  // Determine subscription status and tier
  const hasActiveSubscription = subscriptions?.some(
    (sub) => ["active", "trialing"].includes(sub.status)
  );
  const activeSubscription = subscriptions?.find(
    (sub) => ["active", "trialing"].includes(sub.status)
  );
  // Check if the plan supports SERP features (customize based on your plans)
  const isSerpEnabled = activeSubscription?.product_name?.toLowerCase().includes("serp") || false;

  const TabsConfig = [
    {
      title: "API Keys",
      component: () => (
        <ApiKeyGSerp
          token={token}
          hasSubscription={hasActiveSubscription}
          subscriptionPlan={activeSubscription?.product_name || activeSubscription?.plan_name}
        />
      ),
    },
    {
      title: "Playground",
      component: () => (
        <PlaygroundGSerp
          hasSubscription={hasActiveSubscription}
          isSerpEnabled={isSerpEnabled}
        />
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
        {isLoading ? (
          <Text>Loading subscription details...</Text>
        ) : error ? (
          <Text color="red.500">
            Error: {error.message || "Failed to load subscription details. Please try again later."}
          </Text>
        ) : !hasActiveSubscription ? (
          <Text color="red.500">
            No active subscription. Please subscribe to use SERP features.
          </Text>
        ) : (
          <>
            <Text mb={4}>
              Your Plan: {activeSubscription?.product_name || activeSubscription?.plan_name || "Unknown"} (
              {activeSubscription?.status.charAt(0).toUpperCase() + activeSubscription?.status.slice(1)})
            </Text>
            {!isSerpEnabled && (
              <Text color="orange.500" mb={4}>
                Your subscription plan does not include SERP features. Please upgrade to a SERP-enabled plan.
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