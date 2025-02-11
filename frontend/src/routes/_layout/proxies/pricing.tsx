import {
  Container,
  Box,
  Text,
  Button,
  VStack,
  HStack,
  Divider,
  Flex,
  Badge,
  Icon,
  Grid,
  GridItem,
} from "@chakra-ui/react";
import { createFileRoute } from "@tanstack/react-router";
import {
  FiCheckCircle,
  FiDollarSign,
  FiPackage,
  FiTrendingUp,
  FiSettings,
} from "react-icons/fi";

const pricingPlans = [
  {
    name: "Dev",
    price: "$100",
    features: ["100 requests/month", "Basic API access", "Email support"],
    borderColor: "blue.700",
    icon: FiPackage,
  },
  {
    name: "SaaS",
    price: "$500",
    features: ["1,000 requests/month", "Faster response times", "Priority support"],
    borderColor: "blue.600",
    badge: "MOST POPULAR",
    icon: FiTrendingUp,
  },
  {
    name: "Pro",
    price: "$2,000",
    features: ["1,000,000 requests/month", "Enterprise-grade performance", "Dedicated support"],
    borderColor: "blue.500",
    icon: FiSettings,
  },
  {
    name: "Enterprise",
    price: "Custom",
    features: ["Unlimited requests", "Dedicated account manager", "Custom integrations"],
    borderColor: "blue.400",
    icon: FiDollarSign,
  },
];

function Pricing() {
  return (
    <Container maxW="full" py={8}>
      <Flex align="center" justify="space-between" flexWrap="wrap" gap={4} mb={6}>
        <Box textAlign="left" flex="1">
          <Text fontSize="xl" fontWeight="bold">Pricing Plans</Text>
          <Text fontSize="sm">Choose the right plan for your needs.</Text>
        </Box>
      </Flex>

      <Divider my={4} />

      <Grid templateColumns={{ base: "1fr", md: "repeat(4, 1fr)" }} gap={6}>
        {pricingPlans.map((plan, index) => (
          <GridItem key={index}>
            <Box p={6} border="2px solid" borderColor={plan.borderColor} borderRadius="lg" bg="gray.700" position="relative">
              {plan.badge && (
                <Badge bg="blue.600" color="white" px={3} py={1} position="absolute" top="-12px" left="10px">
                  {plan.badge}
                </Badge>
              )}
              <Flex align="center" mb={2}>
                <Icon as={plan.icon} boxSize={6} color="white" mr={2} />
                <Text fontSize="lg" fontWeight="bold" color="white">{plan.name}</Text>
              </Flex>
              <Text fontSize="2xl" fontWeight="bold" color="white" mb={4}>{plan.price}</Text>

              <VStack spacing={3} align="start" mt={3}>
                {plan.features.map((feature, idx) => (
                  <HStack key={idx}>
                    <Icon as={FiCheckCircle} color="blue.500" />
                    <Text fontSize="sm" color="gray.300">{feature}</Text>
                  </HStack>
                ))}
              </VStack>

              <Button w="full" mt={4} bg="blue.600" color="white" _hover={{ bg: "blue.500" }}>
                {plan.price === "Custom" ? "Contact Us" : `Choose ${plan.name}`}
              </Button>
            </Box>
          </GridItem>
        ))}
      </Grid>
    </Container>
  );
}

export const Route = createFileRoute("/_layout/proxies/pricing")({
  component: Pricing,
});

export default Pricing;
