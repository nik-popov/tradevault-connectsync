// src/pages/GoogleSerpPage.tsx
import { createFileRoute } from "@tanstack/react-router";
import { Container, Flex, Text, Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import ProtectedComponent from "../../../components/ProtectedComponent";
import PlaygroundGSerp from "../../../components/PlaygroundGSerp";
import ApiKeyGSerp from "../../../components/ApiKeyGSerp";
import { useQuery } from "@tanstack/react-query";

async function fetchSubscriptionStatus(): Promise<{
  hasSubscription: boolean;
  isTrial: boolean;
  isDeactivated: boolean;
}> {
  const token = localStorage.getItem("access_token");
  if (!token) {
    throw new Error("No access token found. Please log in again.");
  }

  try {
    const response = await fetch("https://api.thedataproxy.com/api/v1/subscription-status/serp", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.detail || `Failed to fetch subscription status: ${response.status}`
      );
    }

    return response.json();
  } catch (error) {
    console.error("Subscription status fetch error:", error);
    throw error; // Let Tanstack Query handle the error
  }
}
const GoogleSerpPage = () => {
  const { data: subscriptionStatus, isLoading } = useQuery({
    queryKey: ["subscriptionStatus", "serp"],
    queryFn: fetchSubscriptionStatus,
    staleTime: 5 * 60 * 1000,
  });

  const token = localStorage.getItem("access_token"); // Get token from localStorage

  const TabsConfig = [
    { title: "API Keys", component: () => <ApiKeyGSerp token={token} /> }, // Pass token here
    { title: "Playground", component: () => <PlaygroundGSerp /> },
  ];

  return (
    <ProtectedComponent>
      <Container maxW="full">
        <Flex align="center" justify="space-between" py={6}>
          <Text fontSize="xl">HTTPs Proxy API</Text> {/* Updated title for clarity */}
          <Text fontSize="sm">Manage your proxy settings and API keys.</Text>
        </Flex>
        {isLoading ? (
          <Text>Loading subscription status...</Text>
        ) : (
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
        )}
      </Container>
    </ProtectedComponent>
  );
};

export const Route = createFileRoute("/_layout/scraping-tools/https-proxy")({
  component: GoogleSerpPage,
});

export default GoogleSerpPage;