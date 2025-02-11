import {
  Container,
  Box,
  Text,
  Divider,
  Flex,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import PromoContent from "../../../components/PromoContent";

const PricingChart = ({ plan }) => {
  const pricingData = {
    Basic: { price: "$10/month", features: ["10GB Bandwidth", "1 Endpoint"] },
    Pro: { price: "$30/month", features: ["50GB Bandwidth", "5 Endpoints"] },
    Enterprise: { price: "$100/month", features: ["Unlimited Bandwidth", "20 Endpoints"] },
  };

  const data = pricingData[plan];

  return (
    <Box p={4} borderWidth="1px" borderRadius="md">
      <Text fontSize="xl" mb={4}>{plan} Plan</Text>
      <Text fontSize="lg" fontWeight="bold">{data.price}</Text>
      <Text mt={2}>Features:</Text>
      <ul>
        {data.features.map((feature, index) => (
          <li key={index}>{feature}</li>
        ))}
      </ul>
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
                {Object.keys({ Basic: {}, Pro: {}, Enterprise: {} }).map((plan, index) => (
                  <Tab key={index}>{plan}</Tab>
                ))}
              </TabList>
              <TabPanels>
                {Object.keys({ Basic: {}, Pro: {}, Enterprise: {} }).map((plan, index) => (
                  <TabPanel key={index}>
                    <PricingChart plan={plan} />
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