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
  basic: {
    title: "Basic Plan",
    description: "Ideal for individual use with minimal needs.",
    options: [
      { data: "1GB", price: "$1", features: "Basic Support, 1 Endpoint" },
      { data: "10GB", price: "$9", features: "Standard Support, 2 Endpoints" },
      { data: "50GB", price: "$40", features: "Priority Support, 5 Endpoints" },
    ],
  },
  pro: {
    title: "Pro Plan",
    description: "Perfect for businesses needing extra resources.",
    options: [
      { data: "1GB", price: "$2", features: "Faster Speed, API Access" },
      { data: "10GB", price: "$18", features: "Dedicated Support, Custom Endpoints" },
      { data: "50GB", price: "$80", features: "Enterprise Features, Unlimited Endpoints" },
    ],
  },
  enterprise: {
    title: "Enterprise Plan",
    description: "Advanced needs for scaling and performance.",
    options: [
      { data: "1GB", price: "$3", features: "24/7 Support, Dedicated API" },
      { data: "10GB", price: "$25", features: "SLA-backed, Custom Infrastructure" },
      { data: "50GB", price: "$120", features: "Fully Managed, On-Demand Scaling" },
    ],
  },
};

const PricingCard = ({ title, price, features }) => (
  <Card bg="gray.700" borderRadius="md" p={6} _hover={{ bg: "gray.600" }} transition="0.3s">
    <CardBody>
      <Heading size="md" color="white">{title}</Heading>
      <Text fontSize="lg" color="gray.300" mt={2} fontWeight="bold">{price}</Text>
      <Text fontSize="sm" color="gray.400" mt={2}>{features}</Text>
      <Button mt={4} colorScheme="blue" width="full">Select Plan</Button>
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
        <VStack spacing={10} align="stretch">
          {Object.values(pricingData).map((plan, planIndex) => (
            <Box key={planIndex}>
              <Text fontSize="xl" fontWeight="bold" color="white" mb={2}>{plan.title}</Text>
              <Text fontSize="md" color="gray.300" mb={4}>{plan.description}</Text>
              <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
                {plan.options.map((entry, index) => (
                  <PricingCard key={index} title={entry.data} price={entry.price} features={entry.features} />
                ))}
              </SimpleGrid>
            </Box>
          ))}
        </VStack>
      )}
    </Container>
  );
}

export const Route = createFileRoute("/_layout/proxies/pricing")({
  component: Pricing,
});

export default Pricing;