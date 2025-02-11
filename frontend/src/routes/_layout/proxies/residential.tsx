import {
  Container,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Box,
  Text,
  Button,
  VStack,
  HStack,
  Flex,
  Switch,
} from "@chakra-ui/react";
import { useState, useEffect, useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { FiGithub } from "react-icons/fi";

import PromoContent from "../../../components/PromoContent";
import ProxyStarted from "../../../components/ProxyStarted";
import ProxySettings from "../../../components/ProxySettings";
import ProxyUsage from "../../../components/ProxyUsage";
import KeyManagement from "../../../components/KeyManagement";

function ResidentialProxy() {
  const queryClient = useQueryClient();
  const [subscriptionSettings, setSubscriptionSettings] = useState({
    hasSubscription: false,
    isTrial: false,
    isDeactivated: false,
  });

  useEffect(() => {
    const storedSettings = localStorage.getItem("subscriptionSettings");
    if (storedSettings) {
      setSubscriptionSettings(JSON.parse(storedSettings));
    } else {
      const querySettings = queryClient.getQueryData("subscriptionSettings");
      if (querySettings) {
        setSubscriptionSettings(querySettings);
      }
    }
  }, [queryClient]);

  const currentUser = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("currentUser") || "{}");
    } catch (error) {
      return {};
    }
  }, []);

  const { hasSubscription, isTrial, isDeactivated } = subscriptionSettings;
  const isLocked = !hasSubscription && !isTrial;

  return (
    <Container maxW="full" overflowX="hidden">
      <Flex align="center" justify="space-between" py={6} flexWrap="wrap">
        <VStack align="left">
          <Text fontSize="2xl" fontWeight="bold">Hi, {currentUser.full_name || 'User'}!</Text>
          <Text fontSize="md">Explore your proxy settings and manage your connections seamlessly.</Text>
        </VStack>
        <HStack spacing={6}>
          <Switch isChecked={hasSubscription} isDisabled />
          <Text fontWeight="bold">Subscription</Text>
          <Switch isChecked={isTrial} isDisabled />
          <Text fontWeight="bold">Trial Mode</Text>
          <Switch isChecked={isDeactivated} isDisabled />
          <Text fontWeight="bold">Deactivated</Text>
        </HStack>
      </Flex>

      {isLocked ? (
        <PromoContent />
      ) : (
        <Tabs variant="enclosed">
          <TabList>
            <Tab>Get Started</Tab>
            <Tab>Endpoints</Tab>
            <Tab>Usage</Tab>
            <Tab>Key Management</Tab>
          </TabList>
          <TabPanels>
            <TabPanel><ProxyStarted /></TabPanel>
            <TabPanel><ProxySettings /></TabPanel>
            <TabPanel><ProxyUsage /></TabPanel>
            <TabPanel><KeyManagement /></TabPanel>
          </TabPanels>
        </Tabs>
      )}
    </Container>
  );
}

export const Route = createFileRoute("/_layout/proxies/residential")({
  component: ResidentialProxy,
});

export default ResidentialProxy;
