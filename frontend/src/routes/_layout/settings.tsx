import React, { useState } from "react";
import {
  Container,
  Flex,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  Box,
  Button,
  VStack,
  useToast,
  Heading,
  Spinner,
  // Imports required for ApiKeyModule are assumed to be within that component
} from "@chakra-ui/react";
import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import type { UserPublic } from "../../client";
import ApiKeyModule from "../../components/ScrapingTools/ApiKey";
// Note: ApiKeyModule definition is external to this file.

// --- Helper function for Billing ---
const fetchBillingPortal = async (token: string) => {
  const response = await fetch("https://api.thedataproxy.com/v2/customer-portal", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch portal: ${response.status}`);
  }
  const data = await response.json();
  if (!data.portal_url) {
    throw new Error("No portal URL received");
  }
  return data.portal_url;
};

// --- Tab Content: BillingTab ---
const BillingTab = () => {
  const [token] = useState<string | null>(localStorage.getItem("access_token"));
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const handleBillingClick = async () => {
    if (!token) {
      toast({
        title: "Authentication Required",
        description: "Please log in to manage billing.",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    setIsLoading(true);
    try {
      const portalUrl = await fetchBillingPortal(token);
      window.location.href = portalUrl;
    } catch (error) {
      console.error("Error accessing customer portal:", error);
      toast({
        title: "Error",
        description: "Failed to access billing portal. Please try again later.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box>
      <Flex
        justify="space-between"
        align="center"
        // Stack on small screens, arrange in a row on medium screens and up
        direction={{ base: "column", md: "row" }}
        gap={4} // Adds space between items when they stack vertically
      >
        {/* Left side content */}
        <VStack align={{ base: "start", md: "start" }} spacing={1}>
          <Heading size="md" color="gray.800">
            Billing & Subscriptions
          </Heading>
          <Text color="gray.700" maxW="lg">
            Manage your subscriptions, view invoices, and update payment methods through our secure customer portal.
          </Text>
        </VStack>

        {/* Right side content */}
        <Button
          colorScheme="blue"
          onClick={handleBillingClick}
          isLoading={isLoading}
          isDisabled={!token}
          // Ensure the button is full-width when stacked, auto-width otherwise
          w={{ base: "full", md: "auto" }}
        >
          Manage Billing
        </Button>
      </Flex>
    </Box>
  );
};

// --- Tab Configuration ---
const tabsConfig = [
  {
    title: "API Keys",
    component: () => {
      const token = localStorage.getItem("access_token");
      // Render ApiKeyModule, passing the token if it exists.
      return <ApiKeyModule token={token} />;
    },
  },
  {
    title: "Billing",
    component: BillingTab,
  },
];

// --- TanStack Router Route Definition ---
export const Route = createFileRoute("/_layout/settings")({
  component: UserSettings,
});

// --- Main Settings Page Component ---
function UserSettings() {
  const queryClient = useQueryClient();
  const currentUser = queryClient.getQueryData<UserPublic>(["currentUser"]);

  if (!currentUser) {
    // Show a spinner while user data is being fetched by the layout
    return (
      <Container maxW="full" py={6}>
        <Flex justify="center" align="center" h="50vh">
          <Spinner size="xl" />
        </Flex>
      </Container>
    );
  }

  // Example for potentially different tabs for superusers vs. regular users
  const finalTabs = currentUser?.is_superuser ? tabsConfig : tabsConfig;

  return (
    <Container maxW="full" py={9}>
      <Flex align="center" justify="space-between" py={6}>
        <Text fontSize="3xl" color="black">
          Settings
        </Text>
        <Text fontSize="lg" color="gray.600">
          Manage your account settings
        </Text>
      </Flex>

      <Tabs isLazy variant="enclosed-colored" colorScheme="orange">
        <TabList>
          {finalTabs.map((tab, index) => (
            <Tab
              key={index}
              bg="white"
              fontWeight="semibold"
              fontSize="lg"
              color="gray.400"
              _selected={{
                bg: "gray.50",
                color: "orange.600",
                borderColor: "inherit",
                borderBottomColor: "gray.50",
                borderTopWidth: "2px",
                borderTopColor: "orange.400",
                marginTop: "-1px",
              }}
            >
              {tab.title}
            </Tab>
          ))}
        </TabList>
        <TabPanels bg="gray.50" pt={6} pb={6} borderRadius="0 0 md md">
          {finalTabs.map((tab, index) => (
            <TabPanel key={index}>
              {React.createElement(tab.component)}
            </TabPanel>
          ))}
        </TabPanels>
      </Tabs>
    </Container>
  );
}

export default UserSettings;