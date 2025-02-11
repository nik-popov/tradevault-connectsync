import {
  Container,
  Box,
  Text,
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

const STORAGE_KEY = "subscriptionSettings";
const PRODUCT = "proxy";

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
    <Box p={4} borderWidth="1px" borderRadius="md" bg="gray.700">
      <Text fontSize="xl" mb={4} color="white">
        {plan.charAt(0).toUpperCase() + plan.slice(1)} Plan Pricing
      </Text>
      <Table variant="simple">
        <Thead bg="gray.700">
          <Tr>
            <Th color="gray.300" borderColor="gray.600">Data</Th>
            <Th color="gray.300" borderColor="gray.600">Price</Th>
            <Th color="gray.300" borderColor="gray.600">Features</Th>
          </Tr>
        </Thead>
        <Tbody>
          {pricingData[plan].map((entry, index) => (
            <Tr key={index} bg={index % 2 === 0 ? "gray.600" : "gray.700"}>
              <Td color="gray.200" borderColor="gray.600">{entry.data}</Td>
              <Td color="gray.200" borderColor="gray.600">{entry.price}</Td>
              <Td color="gray.200" borderColor="gray.600">{entry.features}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

function Pricing() {
  const { data: subscriptionSettings } = useQuery({
    queryKey: ["subscriptionSettings"],
    queryFn: async () => {
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
          <Text fontSize="xl" fontWeight="bold" color="white">
            Pricing Breakdown
          </Text>
          <Text fontSize="sm" color="gray.300">
            Understand your proxy billing and subscriptions.
          </Text>
        </Box>
      </Flex>
      <Divider my={4} />

      {isLocked ? (
        <PromoContent />
      ) : isDeactivated ? (
        <Box mt={6}>
          <Text color="white">
            Your subscription has expired. Please renew to access all features.
          </Text>
        </Box>
      ) : (
        <Flex mt={6} gap={6} justify="space-between">
          <Box flex="1">
            <Tabs variant="soft-rounded" colorScheme="gray" bg="gray.800" borderRadius="md" p={4}>
              <TabList bg="gray.700" borderRadius="md">
                {tabsConfig.map((tab, index) => (
                  <Tab
                    key={index}
                    bg="gray.600"
                    isDisabled={restrictedTabs.includes(tab.title)}
                    color="gray.300"
                    _selected={{ bg: "gray.600", color: "white", fontWeight: "bold" }}
                    _hover={{ bg: "gray.600", color: "white" }}
                  >
                    {tab.title}
                  </Tab>
                ))}
              </TabList>
              <TabPanels bg="gray.700" borderRadius="md" p={4}>
                {tabsConfig.map((tab, index) => (
                  <TabPanel key={index}>
                    {restrictedTabs.includes(tab.title) ? (
                      <Text color="gray.400">Feature locked during trial.</Text>
                    ) : (
                      tab.component
                    )}
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
