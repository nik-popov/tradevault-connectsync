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
  Divider,
  Button,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import type { UserPublic } from "../../client";
import Appearance from "../../components/UserSettings/Appearance";
import ChangePassword from "../../components/UserSettings/ChangePassword";
import DeleteAccount from "../../components/UserSettings/DeleteAccount";
import UserInformation from "../../components/UserSettings/UserInformation";

const fetchBillingPortal = async (token: string) => {
  const response = await fetch("https://api.thedataproxy.com/v2/customer-portal", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      "Authorization": `Bearer ${token}`,
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

const tabsConfig = [
  { title: "My profile", component: UserInformation },
  { title: "Password", component: ChangePassword },
  {
    title: "Billing",
    component: ({ portalUrl, isLoading, error }: { portalUrl?: string; isLoading: boolean; error: any }) => {
      const toast = useToast();
      const [isRedirecting, setIsRedirecting] = useState(false);

      const handleBillingClick = () => {
        if (error) {
          toast({
            title: "Error",
            description: "Failed to access billing portal. Please try again.",
            status: "error",
            duration: 5000,
            isClosable: true,
          });
          return;
        }

        if (!portalUrl) {
          toast({
            title: "No Portal URL",
            description: "Billing portal URL is not available.",
            status: "warning",
            duration: 5000,
            isClosable: true,
          });
          return;
        }

        setIsRedirecting(true);
        window.location.href = portalUrl;
      };

      return (
        <VStack spacing={4} align="start">
          <Text>Manage your billing information and subscriptions</Text>
          <Button
            colorScheme="blue"
            onClick={handleBillingClick}
            isLoading={isLoading || isRedirecting}
            isDisabled={!portalUrl || !!error}
          >
            Manage Billing
          </Button>
        </VStack>
      );
    },
  },
  { title: "Close Account", component: DeleteAccount },
];

export const Route = createFileRoute("/_layout/settings")({
  component: UserSettings,
});

function UserSettings() {
  const queryClient = useQueryClient();
  const currentUser = queryClient.getQueryData<UserPublic>(["currentUser"]);
  const token = localStorage.getItem("auth_token");
  const toast = useToast();

  // Fetch billing portal URL when component mounts
  const { data: portalUrl, isLoading: isBillingLoading, error: billingError } = useQuery({
    queryKey: ["billingPortal"],
    queryFn: () => fetchBillingPortal(token!),
    enabled: !!token, // Only fetch if token exists
    onError: (error) => {
      console.error("Error fetching billing portal:", error);
      toast({
        title: "Error",
        description: "Failed to load billing portal data. Please try again later.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    },
  });

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
        <Text fontSize="xl">Settings</Text>
        <Text fontSize="sm">Manage your settings</Text>
      </Flex>

      <Divider my={4} borderColor="gray.200" />

      <Tabs colorScheme="blue">
        <TabList borderBottom="2px solid" borderColor="gray.200">
          {finalTabs.map((tab, index) => (
            <Tab
              key={index}
              _selected={{ color: "blue.700", borderColor: "blue.500" }}
              color="gray.600"
              _hover={{ bg: "gray.100" }}
            >
              {tab.title}
            </Tab>
          ))}
        </TabList>
        <TabPanels>
          {finalTabs.map((tab, index) => (
            <TabPanel key={index} bg="gray.50" p={4}>
              {tab.title === "Billing"
                ? React.createElement(tab.component, {
                    portalUrl,
                    isLoading: isBillingLoading,
                    error: billingError,
                  })
                : React.createElement(tab.component)}
            </TabPanel>
          ))}
        </TabPanels>
      </Tabs>
    </Container>
  );
}

export default UserSettings;