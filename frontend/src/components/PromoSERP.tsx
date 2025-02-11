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
import { FiCheckCircle, FiSearch, FiCode, FiFilter, FiClock } from 'react-icons/fi';

const features = [
  { name: "Real-time search results", icon: FiSearch, description: "Instant access to structured search results from multiple sources." },
  { name: "JSON structured data", icon: FiCode, description: "Get results in a structured JSON format for easy integration." },
  { name: "Custom query parameters", icon: FiFilter, description: "Refine your search with powerful filtering and query options." },
  { name: "Fast and reliable response times", icon: FiClock, description: "Optimized performance for rapid search processing." }
];

const pricingPlans = [
  {
    name: "Dev",
    price: "$100",
    features: ["100 requests/month", "Basic API access", "Email support"],
    borderColor: "blue.700",
    buttonVariant: "outline",
  },
  {
    name: "SaaS",
    price: "$500",
    features: ["1,000 requests/month", "Faster response times", "Priority support"],
    borderColor: "blue.600",
    buttonVariant: "solid",
    badge: "MOST POPULAR",
  },
  {
    name: "Pro",
    price: "$2,000",
    features: ["1,000,000 requests/month", "Enterprise-grade performance", "Dedicated support"],
    borderColor: "blue.500",
    buttonVariant: "solid",
  },
  {
    name: "Enterprise",
    price: "Custom",
    features: ["Unlimited requests", "Dedicated account manager", "Custom integrations"],
    borderColor: "blue.400",
    buttonVariant: "outline",
  }
];

const PromoSERP: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box maxW="100%" mx="auto" px={{ base: 6, md: 12 }} py={10} bg="gray.800">
      <VStack spacing={6} align="stretch">
        <Alert status="info" borderRadius="md" bg="gray.700" color="gray.300">
          <AlertIcon color="blue.500" />
          <Text fontSize="sm">Our Search API is optimized for high-speed querying and structured data retrieval.</Text>
        </Alert>

        <Box w="100%" py={6} bg="gray.700" borderRadius="md" boxShadow="lg" px={6}>
          <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={6} alignItems="center">
            <Box>
              <Heading as="h1" size="lg" fontWeight="bold" color="gray.100">
                Unlock Search API
              </Heading>
              <Text fontSize="sm" color="gray.400" mt={1}>
                Access structured and real-time search data with flexible API integration.
              </Text>
            </Box>
          </Grid>
        </Box>

        <Box bg="gray.700" py={10} px={6} borderRadius="md" boxShadow="lg">
          <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={6} mt={6}>
            {features.map((feature, index) => (
              <GridItem key={index} p={5} borderRadius="lg" boxShadow="md" _hover={{ boxShadow: "lg" }} bg="gray.600">
                <Flex align="center" mb={3}>
                  <Icon as={feature.icon} boxSize={6} color="blue.400" mr={3} />
                  <Text fontSize="md" fontWeight="semibold" color="gray.200">{feature.name}</Text>
                </Flex>
                <Text fontSize="sm" color="gray.400">{feature.description}</Text>
              </GridItem>
            ))}
          </Grid>
        </Box>
      </VStack>
    </Box>
  );
};

export default PromoSERP;
