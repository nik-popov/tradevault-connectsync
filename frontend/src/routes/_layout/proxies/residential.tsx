import React, { useState, useEffect, useMemo } from "react";
import {
  Container,
  Heading,
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
  Divider,
  Flex,
  Switch,
} from "@chakra-ui/react";
import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { FiGithub } from "react-icons/fi";

import PromoContent from "../../../components/PromoContent";
import ProxyStarted from "../../../components/ProxyStarted";
import ProxySettings from "../../../components/ProxySettings";
import ProxyUsage from "../../../components/ProxyUsage";

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
      console.error("Error parsing user data:", error);
      return {};
    }
  }, []);

  const { hasSubscription, isTrial, isDeactivated } = subscriptionSettings;
  const isLocked = !hasSubscription && !isTrial;

  const tabsConfig = [
    { name: "Get Started", sub: <ProxyStarted /> },
    { name: "Endpoints", sub: <ProxySettings /> },
    { name: "Usage", sub: <ProxyUsage /> }
  ];

  const welcomeMessage = currentUser?.full_name ? `Welcome, ${currentUser.full_name}` : "Welcome to your Proxy Dashboard";

  return (
    <Container maxW="full" overflowX="hidden">
      <Flex align="center" justify="space-between" py={6} flexWrap="wrap">
        <Heading size="lg">{welcomeMessage}</Heading>
        <HStack spacing={6}>
          <HStack>
            <Text fontWeight="bold">Subscription:</Text>
            <Switch isChecked={hasSubscription} isDisabled />
          </HStack>
          <HStack>
            <Text fontWeight="bold">Trial Mode:</Text>
            <Switch isChecked={isTrial} isDisabled />
          </HStack>
          <HStack>
            <Text fontWeight="bold">Deactivated:</Text>
            <Switch isChecked={isDeactivated} isDisabled />
          </HStack>
        </HStack>
      </Flex>

      {isLocked ? (
        <PromoContent />
      ) : (
        <Flex mt={6} gap={6} justify="space-between" align="stretch" wrap="wrap">
          <Box flex="1" minW={{ base: "100%", md: "65%" }}>
            <Box p={4}>
              <Text fontSize="2xl" fontWeight="bold">
                Hi, {currentUser?.full_name || currentUser?.email} 👋
              </Text>
              <Text>Manage your proxy settings with ease.</Text>
            </Box>
            <Divider my={4} />
            <Tabs variant="enclosed">
              <TabList>
                {tabsConfig.map((tab, index) => (
                  <Tab key={index}>{tab.name}</Tab>
                ))}
              </TabList>
              <TabPanels>
                {tabsConfig.map((tab, index) => (
                  <TabPanel key={index}>{tab.sub}</TabPanel>
                ))}
              </TabPanels>
            </Tabs>
          </Box>

          <Box w={{ base: "100%", md: "250px" }} p="4" borderLeft={{ md: "1px solid #E2E8F0" }}>
            <VStack spacing="4" align="stretch">
              <Box p="4" shadow="sm" borderWidth="1px" borderRadius="lg">
                <Text fontWeight="bold">Quick Actions</Text>
                <Button
                  as="a"
                  href="https://github.com/CobaltDataNet"
                  leftIcon={<FiGithub />}
                  variant="outline"
                  size="sm"
                  mt="2"
                >
                  GitHub Discussions
                </Button>
              </Box>
            </VStack>
          </Box>
        </Flex>
      )}
    </Container>
  );
}

export const Route = createFileRoute("/_layout/proxies/residential")({
  component: ResidentialProxy,
});

export default ResidentialProxy;
