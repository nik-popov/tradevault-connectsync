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
import { useNavigate } from '@tanstack/react-router';
import { FiCheckCircle, FiDatabase, FiTrendingUp, FiShoppingCart, FiCloud } from 'react-icons/fi';

// Dataset Categories
const datasetCategories = [
  { name: "Traffic & Mobility Data", icon: FiTrendingUp, description: "Live and historical traffic insights, ride-sharing trends, and urban mobility analysis." },
  { name: "Weather & Forecasting", icon: FiCloud, description: "Detailed weather reports, climate patterns, and predictive models." },
  { name: "Business Intelligence", icon: FiDatabase, description: "Company financials, market trends, and competitor analysis." },
  { name: "Consumer & Product Data", icon: FiShoppingCart, description: "Consumer spending habits, pricing trends, and product metadata." }
];

// Pricing Plans
const pricingPlans = [
  {
    name: "Explorer",
    price: "$5",
    features: ["Basic dataset access", "1,000 API requests/month", "Standard support"],
    borderColor: "gray.300",
    buttonVariant: "outline",
  },
  {
    name: "Archiver",
    price: "$100",
    features: ["Extended dataset history", "1,000 API requests/month", "Priority support"],
    borderColor: "blue.400",
    buttonVariant: "solid",
    badge: "MOST POPULAR",
  },
  {
    name: "Researcher",
    price: "$500",
    features: ["High download limits", "10,000 API requests/month", "Advanced analytics"],
    borderColor: "purple.400",
    buttonVariant: "solid",
  },
  {
    name: "Enterprise",
    price: "Custom",
    features: ["Unlimited API requests", "Dedicated account manager", "Custom integrations"],
    borderColor: "gray.600",
    buttonVariant: "outline",
  }
];

const PromoDatasets: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box w="full" px={{ base: 4, md: 8 }} py={8}>
      <Box maxW="5xl" mx="auto" textAlign="center">

        {/* FREE TRIAL BANNER */}
        <Box bg="blue.500" color="white" borderRadius="lg" py={4} px={6} mb={6} boxShadow="md">
          <Heading as="h2" size="lg" fontWeight="bold" mb={2}>
            Start Your Free Trial Today!
          </Heading>
          <Text fontSize="md" mb={3}>
            Get full access to our datasets with a 7-day free trial. No credit card required!
          </Text>
          <Button colorScheme="whiteAlpha" variant="solid" onClick={() => navigate('/signup')}>
            Sign Up for Free
          </Button>
        </Box>

        {/* Dataset Categories Section */}
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

        {/* Pricing Plans Section */}
        <Heading as="h2" size="lg" fontWeight="bold" mb={4}>Dataset Pricing Plans</Heading>
        <Grid templateColumns={{ base: "1fr", md: "repeat(4, 1fr)" }} gap={6} mb={6}>
          {pricingPlans.map((plan, index) => (
            <Box key={index} position="relative">
              {/* Badge (if applicable) */}
              {plan.badge && (
                <Badge
                  colorScheme="blue"
                  variant="solid"
                  px={3} py={1}
                  position="absolute"
                  top="-12px"
                  left="50%"
                  transform="translateX(-50%)"
                  zIndex="1"
                >
                  {plan.badge}
                </Badge>
              )}
              <Box
                p={6}
                border="2px solid"
                borderColor={plan.borderColor}
                borderRadius="lg"
                textAlign="center"
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="space-between"
                minH="400px"
              >
                {/* Plan Title */}
                <Heading as="h3" size="md" fontWeight="semibold" mb={2} minH="48px">
                  {plan.name}
                </Heading>

                {/* Feature List */}
                <List spacing={3} textAlign="left" mb={6} px={4}>
                  {plan.features.map((feature, idx) => (
                    <ListItem key={idx} display="flex" alignItems="center">
                      <ListIcon as={FiCheckCircle} color="blue.500" boxSize={5} />
                      {feature}
                    </ListItem>
                  ))}
                </List>

                {/* Price Display */}
                <Text fontSize="2xl" fontWeight="bold" mb={1}>
                  {plan.price === "Custom" ? "Contact Us" : plan.price}
                  {plan.price !== "Custom" && <Text as="span" fontSize="lg" color="gray.500">/mo</Text>}
                </Text>

                {/* CTA Button */}
                <Button w="full" colorScheme="blue" variant={plan.buttonVariant} onClick={() => navigate('/datasets/pricing')}>
                  {plan.price === "Custom" ? "Contact Us" : `Choose ${plan.name}`}
                </Button>
              </Box>
            </Box>
          ))}
        </Grid>

        {/* Security & Performance Notice */}
        <Alert status="success" borderRadius="md">
          <AlertIcon />
          <Text>All datasets are optimized for high-speed querying and secure data access.</Text>
        </Alert>

      </Box>
    </Box>
  );
};

export default PromoDatasets;
