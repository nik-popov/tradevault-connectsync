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
  Tr,
  Tbody,
  Th,
  Td,
  TabList,
  TabPanels,
  Tab,
  Table,
  Thead,
  TabPanel,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import PromoContent from "../../../components/PromoContent";
import ProxySettings from "../../../components/ProxySettings";
import ProxyUsage from "../../../components/ProxyUsage";

const PricingChart = () => {
  const pricingData = [
    { tier: "Basic", price: "$10/month", features: "10GB Bandwidth, 1 Endpoint" },
    { tier: "Pro", price: "$30/month", features: "50GB Bandwidth, 5 Endpoints" },
    { tier: "Enterprise", price: "$100/month", features: "Unlimited Bandwidth, 20 Endpoints" },
  ];

  return (
    <Box p={4} borderWidth="1px" borderRadius="md">
      <Text fontSize="xl" mb={4}>Pricing Plans</Text>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Tier</Th>
            <Th>Price</Th>
            <Th>Features</Th>
          </Tr>
        </Thead>
        <Tbody>
          {pricingData.map((plan, index) => (
            <Tr key={index}>
              <Td>{plan.tier}</Td>
              <Td>{plan.price}</Td>
              <Td>{plan.features}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

const STORAGE_KEY = "subscriptionSettings";
const PRODUCT = "proxy";

function Pricing() {
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
    { title: "Pricing", component: <PricingChart /> },
  ];

  return (
    <Container maxW="full">
      <Flex align="center" justify="space-between" py={6} flexWrap="wrap" gap={4}>
        <Box textAlign="left" flex="1">
          <Text fontSize="xl" fontWeight="bold">Pricing Breakdown</Text>
          <Text fontSize="sm">Understand your proxy billing and subscriptions.</Text>
        </Box>
      </Flex>
      <Divider my={4} />
      {isLocked ? (
        <PromoContent />
      ) : isDeactivated ? (
        <Box mt={6}>
          <Text>Your subscription has expired. Please renew to access all features.</Text>
        </Box>
      ) : (
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

export const Route = createFileRoute("/_layout/proxies/pricing")({
  component: Pricing,
});

export default Pricing;
