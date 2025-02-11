import React from 'react';
import {
  Box,
  Button,
  Text,
  Heading,
  VStack,
  HStack,
  Grid,
  GridItem,
  Flex,
  Icon,
  Badge,
  List,
  ListItem,
  ListIcon,
  Divider,
  Alert,
  AlertIcon
} from "@chakra-ui/react";
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { FiArrowRight, FiCheckCircle } from 'react-icons/fi';

const PromoSERP = () => {
  const navigate = useNavigate();

  const features = [
    "Real-time search results",
    "JSON structured data",
    "Custom query parameters",
    "Fast and reliable response times"
  ];

  const pricingPlans = [
    {
      name: "Basic",
      price: "$19",
      features: ["100 searches per month", "Standard support", "JSON output"],
      borderColor: "gray.300",
      buttonVariant: "outline",
    },
    {
      name: "Pro",
      price: "$49",
      features: ["1,000 searches per month", "Priority support", "Advanced filtering"],
      borderColor: "blue.400",
      buttonVariant: "solid",
      badge: "MOST POPULAR",
    },
    {
      name: "Enterprise",
      price: "Custom",
      features: ["Unlimited searches", "Dedicated account manager", "Custom integrations"],
      borderColor: "gray.600",
      buttonVariant: "outline",
    }
  ];

  return (
    <Box w="full" px={{ base: 4, md: 8 }} py={8}>
      <Box maxW="4xl" mx="auto" textAlign="center">
        {/* Features Section */}
        <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={6} mb={12}>
          {features.map((feature, index) => (
            <GridItem key={index} p={6} border="1px solid" borderColor="gray.200" borderRadius="lg" boxShadow="sm" _hover={{ boxShadow: "md" }}>
              <Flex justify="center" mb={4}>
                <Icon as={FiCheckCircle} boxSize={10} color="blue.500" />
              </Flex>
              <Text fontSize="lg" fontWeight="semibold">{feature}</Text>
            </GridItem>
          ))}
        </Grid>

        {/* Security Notice */}
        <Alert status="success" borderRadius="md" mb={6}>
          <AlertIcon />
          <Text>All API requests are securely handled and optimized.</Text>
        </Alert>

        {/* Pricing Plans */}
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
              <Button w="full" colorScheme="blue" variant={plan.buttonVariant} onClick={() => navigate('/search-api/pricing')}>
                {plan.name === "Enterprise" ? "Contact Us" : `Choose ${plan.name}`}
              </Button>
            </Box>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

// ✅ Ensure this is the ONLY Route export in this file
export const Route = createFileRoute('/src/components/PromoSERP')({
  component: PromoSERP
});

export default PromoSERP;
