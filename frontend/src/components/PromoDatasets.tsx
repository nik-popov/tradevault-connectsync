import React from 'react';
import {
  Box,
  Button,
  Text,
  Heading,
  Grid,
  GridItem,
  Flex,
  Icon,
  Badge,
  List,
  ListItem,
  ListIcon,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { FiCheckCircle, FiDatabase, FiTrendingUp, FiDollarSign } from 'react-icons/fi';

// Define dataset categories
const datasetCategories = [
  { name: "Traffic & Mobility Data", icon: FiTrendingUp, description: "Live and historical traffic insights, ride-sharing trends, and urban mobility analysis." },
  { name: "Weather & Forecasting", icon: FiCloud, description: "Detailed weather reports, climate patterns, and predictive models." },
  { name: "Business Intelligence", icon: FiDatabase, description: "Company financials, market trends, and competitor analysis." },
  { name: "Consumer & Product Data", icon: FiShoppingCart, description: "Consumer spending habits, pricing trends, and product metadata." }
];

// Pricing plans
const pricingPlans = [
  {
    name: "Starter",
    price: "$29",
    features: ["Access to 3 datasets", "5,000 API requests/month", "Standard support"],
    borderColor: "gray.300",
    buttonVariant: "outline",
  },
  {
    name: "Professional",
    price: "$99",
    features: ["Access to all datasets", "50,000 API requests/month", "Priority support"],
    borderColor: "blue.400",
    buttonVariant: "solid",
    badge: "BEST VALUE",
  },
  {
    name: "Enterprise",
    price: "Custom",
    features: ["Unlimited requests", "Dedicated support", "Custom integrations"],
    borderColor: "gray.600",
    buttonVariant: "outline",
  }
];

const PromoDatasets: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box w="full" px={{ base: 4, md: 8 }} py={8}>
      <Box maxW="5xl" mx="auto" textAlign="center">

        {/* Dataset Categories Section */}
        <Heading as="h2" size="xl" fontWeight="bold" mb={6}>
          Explore Our Datasets
        </Heading>
        <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={6} mb={12}>
          {datasetCategories.map((dataset, index) => (
            <GridItem key={index} p={6} border="1px solid" borderColor="gray.200" borderRadius="lg" boxShadow="sm" _hover={{ boxShadow: "md" }}>
              <Flex justify="center" mb={4}>
                <Icon as={dataset.icon} boxSize={10} color="blue.500" />
              </Flex>
              <Text fontSize="lg" fontWeight="semibold">{dataset.name}</Text>
              <Text fontSize="sm" color="gray.600">{dataset.description}</Text>
            </GridItem>
          ))}
        </Grid>

        {/* Security & Performance Notice */}
        <Alert status="success" borderRadius="md" mb={6}>
          <AlertIcon />
          <Text>All datasets are optimized for high-speed querying and secure data access.</Text>
        </Alert>

        {/* Pricing Plans Section */}
        <Heading as="h2" size="lg" fontWeight="bold" mb={4}>Pricing Plans</Heading>
        <Grid templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} gap={6}>
          {pricingPlans.map((plan, index) => (
            <Box
              key={index}
              p={6}
              border="2px solid"
              borderColor={plan.borderColor}
              borderRadius="lg"
              textAlign="center"
              display="flex"
              flexDirection="column"
              justifyContent="space-between"
            >
              {plan.badge && (
                <Badge colorScheme="blue" variant="solid" px={3} py={1} mb={4}>
                  {plan.badge}
                </Badge>
              )}
              <Heading as="h3" size="md" fontWeight="semibold" mb={4}>{plan.name}</Heading>
              <Text fontSize="3xl" fontWeight="bold" mb={4}>
                {plan.price}<Text as="span" fontSize="lg" color="gray.500">/mo</Text>
              </Text>
              <List spacing={3} textAlign="left" mb={6} px={4}>
                {plan.features.map((feature, idx) => (
                  <ListItem key={idx} display="flex" alignItems="center">
                    <ListIcon as={FiCheckCircle} color="blue.500" boxSize={5} />
                    {feature}
                  </ListItem>
                ))}
              </List>
              <Button w="full" colorScheme="blue" variant={plan.buttonVariant} onClick={() => navigate('/datasets/pricing')}>
                {plan.name === "Enterprise" ? "Contact Us" : `Choose ${plan.name}`}
              </Button>
            </Box>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

// ✅ Define the route
export const Route = createFileRoute('/src/components/PromoDatasets')({
  component: PromoDatasets
});

export default PromoDatasets;
