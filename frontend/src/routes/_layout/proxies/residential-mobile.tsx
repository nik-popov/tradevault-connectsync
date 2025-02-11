import {
  Container,
  Box,
  Text,
  Button,
  VStack,
  HStack,
  Divider,
  Flex,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Switch,
} from "@chakra-ui/react";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { FiGithub } from "react-icons/fi";

import PromoContent from "../../../components/PromoContent";
import MobileResidentialApiStartGuide from "../../../components/MobileStarted";
import ProxySettings from "../../../components/ProxySettings";
import ProxyUsage from "../../../components/ProxyUsage";
import SubscriptionManagement from "../../../components/UserSettings/SubscriptionManagement";

// Reusable Proxy Components
import TopUps from "../../../components/TopUps";
import Connections from "../../../components/Connections";
import Logs from "../../../components/Logs";
import KeyManagement from "../../../components/KeyManagement";

const STORAGE_KEY = "subscriptionSettings";
const PRODUCT = "Residential Mobile"; // Define product-specific subscription management

function ResidentialMobileProxy() {
  const queryClient = useQueryClient();

  // Fetch subscription settings
  const { data: subscriptionSettings } = useQuery({
    queryKey: ["subscriptionSettings"],
    queryFn: () => {
      const storedSettings = localStorage.getItem(STORAGE_KEY);
      return storedSettings ? JSON.parse(storedSettings) : {};
    },
    staleTime: Infinity,
  });

  const settings = subscriptionSettings?.[PRODUCT] || {
    hasSubscription: false,
    isTrial: false,
    isDeactivated: false,
  };

  const { hasSubscription, isTrial, isDeactivated } = settings;
  const isLocked = !hasSubscription && !isTrial;
  const restrictedTabs = isTrial ? ["Key Management", "Logs", "Top-Ups", "Connections"] : [];

  const tabsConfig = [
    { title: "Get Started", component: <MobileResidentialApiStartGuide /> },
    { title: "Endpoints", component: <ProxySettings /> },
    { title: "Usage", component: <ProxyUsage /> },
    { title: "Top-Ups", component: <TopUps /> },
    { title: "Connections", component: <Connections /> },
    { title: "Logs", component: <Logs /> },
    { title: "Key Management", component: <KeyManagement /> },
  ];

  return (
    <Container maxW="full">
      {/* Header */}
      <Flex align="center" justify="space-between" py={6} flexWrap="wrap" gap={4}>
        <Box textAlign="left" flex="1">
          <Text fontSize="xl" fontWeight="bold">Residential Mobile Proxy</Text>
          <Text fontSize="sm">Manage your proxy settings and subscriptions.</Text>
        </Box>
        <SubscriptionManagement product={PRODUCT} />
      </Flex>

      {/* Main Content or Alternate Views */}
      {isLocked ? (
        <PromoContent />
      ) : isDeactivated ? (
        <Box mt={6}>
          <Text>Your subscription has expired. Please renew to access all features.</Text>
        </Box>
      ) : (
        <Flex mt={6} gap={6} justify="space-between">
          <Box flex="1">
            <Divider my={4} />
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
        </Flex>
      )}
    </Container>
  );
}

// Export Route
export const Route = createFileRoute("/_layout/proxies/residential-mobile")({
  component: ResidentialMobileProxy,
});

export default ResidentialMobileProxy;
