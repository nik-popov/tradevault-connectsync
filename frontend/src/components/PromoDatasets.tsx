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
  VStack
} from "@chakra-ui/react";
import { useNavigate } from '@tanstack/react-router';
import { FiCheckCircle, FiDatabase, FiTrendingUp, FiShoppingCart, FiCloud } from 'react-icons/fi';

const datasetCategories = [
  { name: "Traffic & Mobility Data", icon: FiTrendingUp, description: "Live and historical traffic insights, ride-sharing trends, and urban mobility analysis." },
  { name: "Weather & Forecasting", icon: FiCloud, description: "Detailed weather reports, climate patterns, and predictive models." },
  { name: "Business Intelligence", icon: FiDatabase, description: "Company financials, market trends, and competitor analysis." },
  { name: "Consumer & Product Data", icon: FiShoppingCart, description: "Consumer spending habits, pricing trends, and product metadata." }
];

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
    borderColor: "blue.600",
    buttonVariant: "solid",
    badge: "MOST POPULAR",
  },
  {
    name: "Researcher",
    price: "$500",
    features: ["High download limits", "10,000 API requests/month", "Advanced analytics"],
    borderColor: "purple.500",
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
    <Box maxW="100%" mx="auto" px={{ base: 6, md: 12 }} py={10}>
      <VStack spacing={6} align="stretch">

        {/* 🚀 Alert Goes to the Top */}
        <Alert status="success" borderRadius="md">
          <AlertIcon />
          <Text fontSize="sm">All datasets are optimized for high-speed querying and secure data access.</Text>
        </Alert>

        {/* Title & Free Trial Section */}
        <Box w="100%" bg="white" py={4}>
          <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={6} alignItems="center">
            {/* Left: Title & Subtitle Together */}
            <Box>
              <Heading as="h1" size="xl" fontWeight="bold">
                Unlock Datasets
              </Heading>
              <Text fontSize="sm" color="gray.600" mt={1}>
                Need specific datasets? Customize and filter data to fit your exact requirements. Our flexible API delivers structured data, empowering you to make informed decisions.
              </Text>
            </Box>

            {/* Right: Free Trial Section */}
            <Box
              bg="blue.600"
              color="gray.300"
              borderRadius="lg"
              p={5}
              boxShadow="lg"
              textAlign="left"
              display="flex"
              flexDirection="column"
              justifyContent="center"
            >
              <Heading as="h2" size="md" fontWeight="light">
                Start Your Free Trial Today!
              </Heading>
              <Text fontSize="xs" my={2} color="gray.200">
                Get full access to our datasets with a 7-day free trial. No credit card required!
              </Text>
              <Button colorScheme="whiteAlpha" variant="solid" onClick={() => navigate('/signup')} size="sm">
                Sign Up for Free
              </Button>
            </Box>
          </Grid>
        </Box>
        
        {/* Full Background Separation for Main Content */}
        <Box bg="gray.100" py={12} px={6} borderRadius="lg">
          <Text fontSize="lg" color="gray.700">
            Need specific datasets? Customize and filter data to fit your exact requirements. Our flexible API delivers structured data, empowering you to make informed decisions.
          </Text>

          {/* Dataset Categories Section */}
          <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={6} mt={6}>
            {datasetCategories.map((dataset, index) => (
              <GridItem key={index} p={6} border="1px solid" borderColor="gray.300" borderRadius="lg" boxShadow="sm" _hover={{ boxShadow: "md" }} bg="white">
                <Flex align="center" mb={4}>
                  <Icon as={dataset.icon} boxSize={8} color="blue.600" mr={3} />
                  <Text fontSize="lg" fontWeight="semibold">{dataset.name}</Text>
                </Flex>
                <Text fontSize="sm" color="gray.600">{dataset.description}</Text>
              </GridItem>
            ))}
          </Grid>

          {/* Pricing Plans Section */}
          <Grid templateColumns={{ base: "1fr", md: "repeat(4, 1fr)" }} gap={6} mt={10}>
            {pricingPlans.map((plan, index) => (
              <Box key={index} position="relative">
                {plan.badge && (
                  <Badge colorScheme="blue" variant="solid" px={3} py={1} position="absolute" top="-12px" left="10px">
                    {plan.badge}
                  </Badge>
                )}
                <Box p={6} border="2px solid" borderColor={plan.borderColor} borderRadius="lg" textAlign="left" bg="white">
                  <Heading as="h3" size="md" fontWeight="semibold" mb={2}>
                    {plan.name}
                  </Heading>
                  <List spacing={3} mb={6}>
                    {plan.features.map((feature, idx) => (
                      <ListItem key={idx} display="flex" alignItems="center">
                        <ListIcon as={FiCheckCircle} color="blue.600" boxSize={5} />
                        {feature}
                      </ListItem>
                    ))}
                  </List>
                  <Text fontSize="2xl" fontWeight="bold" mb={1}>
                    {plan.price === "Custom" ? "Contact Us" : plan.price}
                    {plan.price !== "Custom" && <Text as="span" fontSize="lg" color="gray.500">/mo</Text>}
                  </Text>
                  <Button w="full" colorScheme="blue" variant={plan.buttonVariant} onClick={() => navigate('/datasets/pricing')}>
                    {plan.price === "Custom" ? "Contact Us" : `Choose ${plan.name}`}
                  </Button>
                </Box>
              </Box>
            ))}
          </Grid>
        </Box>

        {/* Security & Performance Notice */}
        <Alert status="success" borderRadius="md">
          <AlertIcon />
          <Text>All datasets are optimized for high-speed querying and secure data access.</Text>
        </Alert>
      </VStack>
    </Box>
  );
};

export default PromoDatasets;
