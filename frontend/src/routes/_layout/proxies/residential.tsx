import {
  Container,
  Heading,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  HStack,
  Divider,
  Flex,
  Switch,
  Box,
  Text,
  Button,
  VStack,
  Alert,
  AlertIcon,
  Spinner
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { FiSend, FiGithub } from "react-icons/fi";
import PromoContent from "../../../components/PromoContent";
import ProxyStarted from "../../../components/ProxyStarted";
import ProxySettings from "../../../components/ProxySettings";
import ProxyUsage from "../../../components/ProxyUsage";
import { TopUps, Connections, Logs, KeyManagement, ReactivationOptions } from "./ProxyComponents";

// 🚀 API Calls (Replace with real backend API later)
const fetchSubscriptionSettings = async () => {
  // Simulate API call
  return JSON.parse(localStorage.getItem("subscriptionSettings")) || {
    hasSubscription: false,
    isTrial: false,
    isDeactivated: false
  };
};

// ✅ Route Export
export const Route = createFileRoute("/_layout/proxies/residential")({
  component: ResidentialProxy,
});

const tabsConfig = [
  { title: "Get Started", component: <ProxyStarted /> },
  { title: "Endpoints", component: <ProxySettings /> },
  { title: "Usage", component: <ProxyUsage /> },
  { title: "Top-Ups", component: <TopUps /> },
  { title: "Connections", component: <Connections /> },
  { title: "Logs", component: <Logs /> },
  { title: "Key Management", component: <KeyManagement /> },
];

function ResidentialProxy() {
  const queryClient = useQueryClient();
  const { data: subscriptionSettings, isLoading, error } = useQuery({
    queryKey: ["subscriptionSettings"],
    queryFn: fetchSubscriptionSettings
  });

  if (isLoading) return <Spinner size="xl" />;
  if (error) return <Alert status="error"><AlertIcon />Failed to load subscription settings.</Alert>;

  const { hasSubscription, isTrial, isDeactivated } = subscriptionSettings;
  const restrictedTabs = isTrial ? ["Key Management", "Logs", "Top-Ups", "Connections"] : [];
  const isLocked = !hasSubscription && !isTrial;

  return (
    <Container maxW="full">
      {/* Top Bar */}
      <Flex align="center" justify="space-between" py={6} flexWrap="wrap" gap={4}>
        <Heading size="lg">Residential Proxies</Heading>
        <HStack spacing={6}>
          <HStack><Text fontWeight="bold">Subscription:</Text><Switch isChecked={hasSubscription} isDisabled /></HStack>
          <HStack><Text fontWeight="bold">Trial Mode:</Text><Switch isChecked={isTrial} isDisabled /></HStack>
          <HStack><Text fontWeight="bold">Deactivated:</Text><Switch isChecked={isDeactivated} isDisabled /></HStack>
        </HStack>
      </Flex>

      {/* Content Based on Subscription */}
      {isLocked ? (
        <PromoContent />
      ) : isDeactivated ? (
        <Box mt={6}>
          <Text>Your subscription has expired. Please renew to access all features.</Text>
          <ReactivationOptions />
        </Box>
      ) : (
        <Flex mt={6} gap={6} justify="space-between">
          {/* Main Content */}
          <Box flex="1">
            <Tabs variant="enclosed">
              <TabList>
                {tabsConfig.map((tab, index) => (
                  <Tab key={index} isDisabled={restrictedTabs.includes(tab.title)}>
                    {tab.title}
                  </Tab>
                ))}
              </TabList>
              <TabPanels>
                {tabsConfig.map((tab, index) => (
                  <TabPanel key={index}>
                    {restrictedTabs.includes(tab.title) ? <Text>Feature locked during trial.</Text> : tab.component}
                  </TabPanel>
                ))}
              </TabPanels>
            </Tabs>
          </Box>

          {/* Sidebar Section */}
          <Box w="250px" p={4} borderLeft="1px solid #E2E8F0">
            <VStack spacing={4} align="stretch">
              <Box p={4} shadow="sm" borderWidth="1px" borderRadius="lg">
                <Text fontWeight="bold">Pick by Your Target</Text>
                <Button mt={2} leftIcon={<FiSend />} size="sm" variant="outline">
                  Send Test Request
                </Button>
              </Box>
              <Box p={4} shadow="sm" borderWidth="1px" borderRadius="lg">
                <Text fontWeight="bold">GitHub</Text>
                <Button mt={2} leftIcon={<FiGithub />} size="sm" variant="outline">
                  Join GitHub
                </Button>
              </Box>
            </VStack>
          </Box>
        </Flex>
      )}
    </Container>
  );
}

export default ResidentialProxy;
