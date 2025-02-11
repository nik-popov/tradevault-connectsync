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

const PricingChart = ({ plan }) => {
  const pricingData = {
    basic: [
      { data: "1GB", price: "$1", features: "Basic Support, 1 Endpoint" },
      { data: "10GB", price: "$9", features: "Standard Support, 2 Endpoints" },
      { data: "50GB", price: "$40", features: "Priority Support, 5 Endpoints" },
    ],
    pro: [
      { data: "1GB", price: "$2", features: "Faster Speed, API Access" },
      { data: "10GB", price: "$18", features: "Dedicated Support, Custom Endpoints" },
      { data: "50GB", price: "$80", features: "Enterprise Features, Unlimited Endpoints" },
    ],
    enterprise: [
      { data: "1GB", price: "$3", features: "24/7 Support, Dedicated API" },
      { data: "10GB", price: "$25", features: "SLA-backed, Custom Infrastructure" },
      { data: "50GB", price: "$120", features: "Fully Managed, On-Demand Scaling" },
    ],
  };

  return (
    <Box p={4} borderWidth="1px" borderRadius="md" bg="gray.100">
      <Text fontSize="xl" mb={4}>{plan.charAt(0).toUpperCase() + plan.slice(1)} Plan Pricing</Text>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Data</Th>
            <Th>Price</Th>
            <Th>Features</Th>
          </Tr>
        </Thead>
        <Tbody>
          {pricingData[plan].map((entry, index) => (
            <Tr key={index}>
              <Td>{entry.data}</Td>
              <Td>{entry.price}</Td>
              <Td>{entry.features}</Td>
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
  const restrictedTabs = isTrial ? ["Pro Plan", "Enterprise Plan"] : [];

  const tabsConfig = [
    { title: "Basic Plan", component: <PricingChart plan="basic" /> },
    { title: "Pro Plan", component: <PricingChart plan="pro" /> },
    { title: "Enterprise Plan", component: <PricingChart plan="enterprise" /> },
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
            <Tabs variant="enclosed" bg="gray.100">
              <TabList>
                {tabsConfig.map((tab, index) => (
                  <Tab key={index} isDisabled={restrictedTabs.includes(tab.title)} bg="gray.200">
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