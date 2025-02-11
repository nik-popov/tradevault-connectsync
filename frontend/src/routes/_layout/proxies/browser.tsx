import {
  Container, Heading, Tab, TabList, TabPanel, TabPanels, Tabs,
  Box, Text, Button, VStack, HStack, Divider, Flex, Switch
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { FiSend, FiGithub } from "react-icons/fi";
import PromoContent from "../../../components/PromoContent";
import GetStarted from "../../../components/GetStarted";
import ProxySettings from "../../../components/ProxySettings";
import ProxyUsage from "../../../components/ProxyUsage";

const TopUps = () => <Box><Text>Top-Ups Component</Text></Box>;
const Connections = () => <Box><Text>Connections Component</Text></Box>;
const Logs = () => <Box><Text>Logs Component</Text></Box>;
const KeyManagement = () => <Box><Text>Key Management Component</Text></Box>;
const ReactivationOptions = () => <Box><Text>Reactivation Options Component</Text></Box>;

// ✅ Correct Route Export
export const Route = createFileRoute("/_layout/proxies/browser")({
  component: BrowserProxy,
});

const tabsConfig = [
  { title: "Get Started", component: <GetStarted /> },
  { title: "Endpoints", component: <ProxySettings /> },
  { title: "Usage", component: <ProxyUsage /> },
  { title: "Top-Ups", component: <TopUps /> },
  { title: "Connections", component: <Connections /> },
  { title: "Logs", component: <Logs /> },
  { title: "Key Management", component: <KeyManagement /> },
];

function BrowserProxy() {
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

  const { hasSubscription, isTrial, isDeactivated } = subscriptionSettings;
  const restrictedTabs = isTrial ? ["Key Management", "Logs", "Top-Ups", "Connections"] : [];
  const isLocked = !hasSubscription && !isTrial;

  return (
    <Container maxW="full">
      <Flex align="center" justify="space-between" py={6} flexWrap="wrap" gap={4}>
        <Heading size="lg">Browser Proxies</Heading>
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

      {isLocked ? <PromoContent /> : (
        <Flex mt={6} gap={6} justify="space-between">
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
        </Flex>
      )}
    </Container>
  );
}

export default BrowserProxy;
