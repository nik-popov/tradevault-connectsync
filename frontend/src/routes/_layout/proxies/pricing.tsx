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
  Table,
  Thead,
  Tr,
  Tbody,
  Th,
  Td,
  SimpleGrid,
  Card,
  CardBody,
  Heading,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import PromoContent from "../../../components/PromoContent";

const STORAGE_KEY = "subscriptionSettings";
const PRODUCT = "proxy";

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

const PricingCard = ({ title, price, features }) => (
  <Card bg="gray.700" borderRadius="md" p={4}>
    <CardBody>
      <Heading size="md" color="white">{title}</Heading>
      <Text fontSize="lg" color="gray.300" mt={2}>{price}</Text>
      <Text fontSize="sm" color="gray.400" mt={2}>{features}</Text>
      <Button mt={4} colorScheme="blue">Select Plan</Button>
    </CardBody>
  </Card>
);

function Pricing() {
  const { data: subscriptionSettings } = useQuery({
    queryKey: ["subscriptionSettings"],
    queryFn: async () => JSON.parse(localStorage.getItem(STORAGE_KEY)) || {},
    staleTime: Infinity,
  });

  const settings = subscriptionSettings?.[PRODUCT] || {
    hasSubscription: false,
    isTrial: false,
    isDeactivated: false,
  };

  const isLocked = !settings.hasSubscription && !settings.isTrial;

  return (
    <Container maxW="full">
      <Flex align="center" justify="space-between" py={6}>
        <Box>
          <Text fontSize="2xl" fontWeight="bold" color="white">Pricing Plans</Text>
          <Text fontSize="md" color="gray.300">Choose the best plan that fits your needs.</Text>
        </Box>
      </Flex>
      <Divider my={4} />

      {isLocked ? (
        <PromoContent />
      ) : settings.isDeactivated ? (
        <Box mt={6}>
          <Text color="white">Your subscription has expired. Please renew to access all features.</Text>
        </Box>
      ) : (
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} mb={6}>
          {Object.entries(pricingData).flatMap(([plan, entries]) =>
            entries.map((entry, index) => (
              <PricingCard key={`${plan}-${index}`} title={entry.data} price={entry.price} features={entry.features} />
            ))
          )}
        </SimpleGrid>
      )}
    </Container>
  );
}

export const Route = createFileRoute("/_layout/proxies/pricing")({
  component: Pricing,
});

export default Pricing;