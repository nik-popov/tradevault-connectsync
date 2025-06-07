import React, { useState, useEffect } from "react";
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
  Divider,
  Button,
  VStack,
  useToast,
  // Imports required for ApiKeyModule
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Tooltip,
  IconButton,
  Alert,
  AlertIcon,
  Heading,
} from "@chakra-ui/react";
import { CopyIcon, DeleteIcon } from "@chakra-ui/icons";
import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import type { UserPublic } from "../../client";
import ApiKeyModule from "../../components/ScrapingTools/ApiKey"
// --- ApiKeyModule Component Definition ---

interface ApiKey {
  key_preview: string;
  created_at: string;
  expires_at: string;
  is_active: boolean;
  request_count?: number;
}

interface ApiKeyProps {
  token: string | null;
}

const API_PROXY_URL = "https://api.thedataproxy.com/v2/proxy";


// --- Main Settings Page Logic ---

const fetchBillingPortal = async (token: string) => {
  const response = await fetch("https://api.thedataproxy.com/v2/customer-portal", {
    method: "GET",
    headers: { "Content-Type": "application/json", "Accept": "application/json", "Authorization": `Bearer ${token}` },
  });
  if (!response.ok) throw new Error(`Failed to fetch portal: ${response.status}`);
  const data = await response.json();
  if (!data.portal_url) throw new Error("No portal URL received");
  return data.portal_url;
};

const tabsConfig = [
  {
    title: "API Keys",
    component: () => {
      const [token] = useState<string | null>(localStorage.getItem("access_token"));
      return <ApiKeyModule token={token} />;
    },
  },
   {
    title: "Billing",
    component: () => {
      const [token] = useState<string | null>(localStorage.getItem("access_token"));
      const [isLoading, setIsLoading] = useState(false);
      const toast = useToast();

      const handleBillingClick = async () => {
        if (!token) {
          toast({ title: "Authentication Required", description: "Please log in to manage billing.", status: "warning", duration: 5000, isClosable: true });
          return;
        }
        setIsLoading(true);
        try {
          const portalUrl = await fetchBillingPortal(token);
          window.location.href = portalUrl;
        } catch (error) {
          console.error("Error accessing customer portal:", error);
          toast({ title: "Error", description: "Failed to access billing portal. Please try again.", status: "error", duration: 5000, isClosable: true });
        } finally {
          setIsLoading(false);
        }
      };

      return (
        <VStack spacing={4} align="start" p={4}>
          <Text>Manage your billing information and subscriptions.</Text>
          <Button colorScheme="blue" onClick={handleBillingClick} isLoading={isLoading} isDisabled={!token}>Manage Billing</Button>
        </VStack>
      );
    },
  }
];

export const Route = createFileRoute("/_layout/settings")({
  component: UserSettings,
});

function UserSettings() {
  const queryClient = useQueryClient();
  const currentUser = queryClient.getQueryData<UserPublic>(["currentUser"]);

  if (!currentUser) {
    return (
      <Container maxW="full" bg="gray.50" py={6}>
        <Text color="gray.600">Loading user data...</Text>
      </Container>
    );
  }

  const finalTabs = currentUser?.is_superuser ? tabsConfig : tabsConfig;

  return (
    <Container maxW="full">
      <Flex align="center" justify="space-between" py={6}>
        <Text fontSize="xl" color="black">Settings</Text>
        <Text fontSize="md" color="gray.600">Manage your settings</Text>
      </Flex>
      <Divider my={4} borderColor="gray.200" />
    <Tabs isLazy variant="enclosed-colored" colorScheme="orange">
        <TabList borderBottom="2px solid" borderColor="gray.200">
          {finalTabs.map((tab, index) => (
            <Tab key={index} >
              {tab.title}
            </Tab>
          ))}
        </TabList>
        <TabPanels>
          {finalTabs.map((tab, index) => (
            <TabPanel key={index} bg="gray.50" p={0}>
              {React.createElement(tab.component)}
            </TabPanel>
          ))}
        </TabPanels>
      </Tabs>
    </Container>
  );
}

export default UserSettings;