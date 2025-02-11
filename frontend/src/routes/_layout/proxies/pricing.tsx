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
  Grid,
  GridItem,
  Icon,
  Badge,
  List,
  ListItem,
  ListIcon,
  Alert,
  AlertIcon,
  Heading,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { FiCheckCircle, FiDollarSign, FiPackage, FiTrendingUp, FiSettings } from 'react-icons/fi';

const STORAGE_KEY = "subscriptionSettings";
const PRODUCT = "proxy";

const pricingPlans = [
  { name: "Dev", price: "$100", features: ["100 requests/month", "Basic API access", "Email support"], borderColor: "blue.700", icon: FiPackage },
  { name: "SaaS", price: "$500", features: ["1,000 requests/month", "Faster response times", "Priority support"], borderColor: "blue.600", badge: "MOST POPULAR", icon: FiTrendingUp },
  { name: "Pro", price: "$2,000", features: ["1,000,000 requests/month", "Enterprise-grade performance", "Dedicated support"], borderColor: "blue.500", icon: FiSettings },
  { name: "Enterprise", price: "Custom", features: ["Unlimited requests", "Dedicated account manager", "Custom integrations"], borderColor: "blue.400", icon: FiDollarSign },
];

function Pricing() {
  const { data: subscriptionSettings } = useQuery({
    queryKey: ["subscriptionSettings"],
    queryFn: async () => JSON.parse(localStorage.getItem(STORAGE_KEY)) || {},
    staleTime: Infinity,
  });

  return (
    <Container maxW="100%" mx="auto" px={6} py={10} bg="gray.800">
      <Flex align="center" justify="space-between" py={6}>
        <Box>
          <Text fontSize="2xl" fontWeight="bold" color="white">Flexible Pricing Plans</Text>
          <Text fontSize="md" color="gray.300">Select a plan that scales with your needs.</Text>
        </Box>
      </Flex>
      <Divider my={4} />

      <Tabs variant="enclosed" colorScheme="gray">
        <TabList>
          {pricingPlans.map((plan, index) => (
            <Tab key={index} _selected={{ bg: "gray.700", color: "white" }}>
              <Icon as={plan.icon} mr={2} /> {plan.name}
            </Tab>
          ))}
        </TabList>
        <TabPanels>
          {pricingPlans.map((plan, index) => (
            <TabPanel key={index}>
              <Box p={6} border="2px solid" borderColor={plan.borderColor} borderRadius="lg" bg="gray.700">
                {plan.badge && (
                  <Badge bg="blue.600" color="white" px={3} py={1} position="absolute" top="-12px" left="10px">
                    {plan.badge}
                  </Badge>
                )}
                <Heading as="h3" size="md" fontWeight="bold" mb={2} color="gray.200">
                  {plan.name}
                </Heading>
                <Text fontSize="lg" fontWeight="bold" color="white">{plan.price}</Text>
                <List spacing={2} mb={6} mt={2}>
                  {plan.features.map((feature, idx) => (
                    <ListItem key={idx} display="flex" alignItems="center">
                      <ListIcon as={FiCheckCircle} color="blue.500" boxSize={5} />
                      <Text fontSize="sm" color="gray.300">{feature}</Text>
                    </ListItem>
                  ))}
                </List>
                <Button w="full" bg="blue.600" color="white" _hover={{ bg: "blue.500" }}>
                  {plan.price === "Custom" ? "Contact Us" : `Choose ${plan.name}`}
                </Button>
              </Box>
            </TabPanel>
          ))}
        </TabPanels>
      </Tabs>
    </Container>
  );
}

export const Route = createFileRoute("/_layout/proxies/pricing")({
  component: Pricing,
});

export default Pricing;