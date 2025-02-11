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
    borderColor: "blue.600",
    buttonVariant: "outline",
  },
  {
    name: "Archiver",
    price: "$100",
    features: ["Extended dataset history", "1,000 API requests/month", "Priority support"],
    borderColor: "blue.500",
    buttonVariant: "solid",
    badge: "MOST POPULAR",
  },
  {
    name: "Researcher",
    price: "$500",
    features: ["High download limits", "10,000 API requests/month", "Advanced analytics"],
    borderColor: "blue.400",
    buttonVariant: "solid",
  },
  {
    name: "Enterprise",
    price: "Custom",
    features: ["Unlimited API requests", "Dedicated account manager", "Custom integrations"],
    borderColor: "blue.300",
    buttonVariant: "outline",
  }
];

const PromoDatasets: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box maxW="100%" mx="auto" px={{ base: 6, md: 12 }} py={10} bg="blue.900">
      <VStack spacing={6} align="stretch">

        {/* 🚀 Alert Goes to the Top */}
        <Alert status="info" borderRadius="md" bg="blue.800" color="gray.200">
          <AlertIcon color="blue.300" />
          <Text fontSize="sm">All datasets are optimized for high-speed querying and secure data access.</Text>
        </Alert>

        {/* Title & Free Trial Section */}
        <Box w="100%" py={6} bg="blue.800" borderRadius="md" boxShadow="lg" px={6}>
          <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={6} alignItems="center">
            {/* Left: Title & Subtitle Together */}
            <Box>
              <Heading as="h1" size="lg" fontWeight="bold" color="blue.200">
                Unlock Datasets
              </Heading>
              <Text fontSize="sm" color="blue.300" mt={1}>
                Customize and filter data to fit your exact requirements. Our flexible API delivers structured data, empowering you to make informed decisions.
              </Text>
            </Box>

            {/* Right: Free Trial Section */}
            <Box
              bg="blue.700"
              color="blue.300"
              borderRadius="md"
              p={5}
              boxShadow="lg"
              textAlign="left"
              display="flex"
              flexDirection="column"
              justifyContent="center"
            >
              <Heading as="h2" size="md" fontWeight="light" color="blue.100">
                Start Your Free Trial Today!
              </Heading>
              <Text fontSize="xs" my={2} color="blue.200">
                Get full access to our datasets with a 7-day free trial. No credit card required!
              </Text>
              <Button bg="blue.300" color="blue.900" _hover={{ bg: "blue.400" }} variant="solid" onClick={() => navigate('/signup')} size="sm">
                Sign Up for Free
              </Button>
            </Box>
          </Grid>
        </Box>

        {/* 📌 Layered Background for Main Content */}
        <Box bg="blue.800" py={10} px={6} borderRadius="md" boxShadow="lg">
          
          {/* Dataset Categories Section */}
          <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={6} mt={6}>
            {datasetCategories.map((dataset, index) => (
              <GridItem key={index} p={5} borderRadius="lg" boxShadow="md" _hover={{ boxShadow: "lg" }} bg="blue.700">
                <Flex align="center" mb={3}>
                  <Icon as={dataset.icon} boxSize={6} color="blue.300" mr={3} />
                  <Text fontSize="md" fontWeight="semibold" color="blue.200">{dataset.name}</Text>
                </Flex>
                <Text fontSize="sm" color="blue.300">{dataset.description}</Text>
              </GridItem>
            ))}
          </Grid>

          {/* Pricing Plans Section */}
          <Grid templateColumns={{ base: "1fr", md: "repeat(4, 1fr)" }} gap={6} mt={10}>
            {pricingPlans.map((plan, index) => (
              <Box key={index} position="relative">
                {plan.badge && (
                  <Badge bg="blue.500" color="white" px={3} py={1} position="absolute" top="-12px" left="10px">
                    {plan.badge}
                  </Badge>
                )}
                <Box p={6} border="2px solid" borderColor={plan.borderColor} borderRadius="lg" textAlign="left" bg="blue.700">
                  <Heading as="h3" size="sm" fontWeight="semibold" mb={2} color="blue.200">
                    {plan.name}
                  </Heading>
                  <List spacing={2} mb={6}>
                    {plan.features.map((feature, idx) => (
                      <ListItem key={idx} display="flex" alignItems="center">
                        <ListIcon as={FiCheckCircle} color="blue.300" boxSize={5} />
                        <Text fontSize="sm" color="blue.200">{feature}</Text>
                      </ListItem>
                    ))}
                  </List>
                  <Button w="full" bg="blue.500" color="white" _hover={{ bg: "blue.400" }} variant={plan.buttonVariant} onClick={() => navigate('/datasets/pricing')} size="sm">
                    {plan.price === "Custom" ? "Contact Us" : `Choose ${plan.name}`}
                  </Button>
                </Box>
              </Box>
            ))}
          </Grid>
        </Box>
      </VStack>
    </Box>
  );
};

export default PromoDatasets;
