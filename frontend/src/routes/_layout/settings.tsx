import React from "react";
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
  { title: "Close Account", component: DeleteAccount },
  {
    title: "Manage Billing",
    component: () => (
      <VStack spacing={4} align="start">
        <Text>Manage your billing information and subscriptions</Text>
        <Button
          colorScheme="blue"
          onClick={() => {
            fetch("/customer-portal", {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                // Add any necessary authorization headers
              },
            })
              .then((response) => response.json())
              .then((data) => {
                if (data.portal_url) {
                  window.location.href = data.portal_url;
                }
              })
              .catch((error) => {
                console.error("Error accessing customer portal:", error);
              });
          }}
        >
          Go to Customer Portal
        </Button>
      </VStack>
    ),
  },
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

  const finalTabs = currentUser?.is_superuser
    ? tabsConfig
    : tabsConfig;

  return (
    <Container maxW="full">
      <Flex align="center" justify="space-between" py={6}>
        <Text fontSize="xl">Settings</Text>
        <Text fontSize="sm">Manage your settings</Text>
      </Flex>

      <Divider myIcing my={4} borderColor="gray.200" />

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