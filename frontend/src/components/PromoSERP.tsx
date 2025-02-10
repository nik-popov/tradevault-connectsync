import React from 'react';
import { Box, Heading, Text, Divider, Alert, AlertIcon, List, ListItem, ListIcon, Grid, Button, Badge } from "@chakra-ui/react";
import { FiCheckCircle } from "react-icons/fi";

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

const PromoSERP = () => (
  <Box maxW="3xl" mx="auto" px={{ base: 4, md: 8 }} py={8}>
    <Heading size="lg" textAlign="center">Google Search API</Heading>
    <Divider my={4} />
    <Text>Fetch Google Search results using our premium API:</Text>
    
    <List spacing={3} mt={4}>
      <ListItem>
        <ListIcon as={FiCheckCircle} color="green.500" />
        Real-time search results
      </ListItem>
      <ListItem>
        <ListIcon as={FiCheckCircle} color="green.500" />
        JSON structured data
      </ListItem>
      <ListItem>
        <ListIcon as={FiCheckCircle} color="green.500" />
        Custom query parameters
      </ListItem>
      <ListItem>
        <ListIcon as={FiCheckCircle} color="green.500" />
        Fast and reliable response times
      </ListItem>
    </List>
    
    <Alert status="success" borderRadius="md" mt={6}>
      <AlertIcon />
      <Text>All API requests are securely handled and optimized.</Text>
    </Alert>
    
    <Heading size="md" textAlign="center" mt={8} mb={4}>Pricing Plans</Heading>
    <Grid templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} gap={6}>
      {pricingPlans.map((plan, index) => (
        <Box
          key={index}
          p={6}
          border="2px solid"
          borderColor={plan.borderColor}
          borderRadius="lg"
          textAlign="center"
        >
          {plan.badge && (
            <Badge colorScheme="blue" variant="solid" px={3} py={1} mb={4}>
              {plan.badge}
            </Badge>
          )}
          <Heading as="h3" size="md" fontWeight="semibold" mb={4}>{plan.name}</Heading>
          <Text fontSize="2xl" fontWeight="bold" mb={4}>{plan.price}/mo</Text>
          <List spacing={3} textAlign="left" mb={6} px={4}>
            {plan.features.map((feature, idx) => (
              <ListItem key={idx} display="flex" alignItems="center">
                <ListIcon as={FiCheckCircle} color="blue.500" boxSize={5} />
                {feature}
              </ListItem>
            ))}
          </List>
          <Button w="full" colorScheme="blue" variant={plan.buttonVariant}>
            {plan.name === "Enterprise" ? "Contact Us" : `Choose ${plan.name}`}
          </Button>
        </Box>
      ))}
    </Grid>
  </Box>
);

export default PromoSERP;
