import React, { useEffect, useState } from "react";
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
import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import type { UserPublic } from "../../client";
import Appearance from "../../components/UserSettings/Appearance";
import ChangePassword from "../../components/UserSettings/ChangePassword";
import DeleteAccount from "../../components/UserSettings/DeleteAccount";
import UserInformation from "../../components/UserSettings/UserInformation";

const tabsConfig = [
  { title: "My profile", component: UserInformation },
  { title: "Password", component: ChangePassword },
  {
    title: "Billing",
    component: () => {
      const [token, setToken] = useState<string | null>(null);
      const [isLoading, setIsLoading] = useState(false);
      const toast = useToast();

      useEffect(() => {
        const fetchToken = async () => {
          try {
            // Try to get token from localStorage first
            let authToken = localStorage.getItem("auth_token");

            if (!authToken) {
              // Fetch token from /users/me
              const response = await fetch("https://api.thedataproxy.com/users/me", {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                  "Accept": "application/json",
                },
                credentials: "include", // Send cookies if token is in a cookie
              });

              if (!response.ok) {
                console.error(`Response status: ${response.status}, ${response.statusText}`);
                throw new Error(`Failed to fetch user data: ${response.status}`);
              }

              const userData = await response.json();
              authToken = userData.token || localStorage.getItem("auth_token");
              if (authToken) {
                localStorage.setItem("auth_token", authToken); // Cache token
              }
            }

            setToken(authToken);
          } catch (error) {
            console.error("Error fetching user token:", error);
            toast({
              title: "Error",
              description: "Failed to authenticate. Please log in again.",
              status: "error",
              duration: 5000,
              isClosable: true,
            });
          }
        };

        fetchToken();
      }, [toast]);

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
          if (data.portal_url) {
            window.location.href = data.portal_url;
          } else {
            throw new Error("No portal URL received");
          }
        } catch (error) {
          console.error("Error accessing customer portal:", error);
          toast({
            title: "Error",
            description: "Failed to access billing portal. Please try again.",
            status: "error",
            duration: 5000,
            isClosable: true,
          });
        } finally {
          setIsLoading(false);
        }
      };

      return (
        <VStack spacing={4} align="start">
          <Text>Manage your billing information and subscriptions</Text>
          <Button
            colorScheme="blue"
            onClick={handleBillingClick}
            isLoading={isLoading}
            isDisabled={!token}
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
              {React.createElement(tab.component)}
            </TabPanel>
          ))}
        </TabPanels>
      </Tabs>
    </Container>
  );
}

export default UserSettings;