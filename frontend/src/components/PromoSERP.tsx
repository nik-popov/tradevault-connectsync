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
import { FiCheckCircle } from 'react-icons/fi';

const PromoSERP: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    "Real-time search results",
    "JSON structured data",
    "Custom query parameters",
    "Fast and reliable response times"
  ];

  const pricingPlans = [
    {
      name: "Dev",
      price: "$100",
      requests: "100 requests/month",
      features: ["For developers & small teams", "Basic API access", "Email support"],
      borderColor: "gray.300",
      buttonVariant: "outline",
    },
    {
      name: "SaaS",
      price: "$500",
      requests: "1,000 requests/month",
      features: ["For SaaS & medium usage", "Faster response times", "Priority support"],
      borderColor: "blue.400",
      buttonVariant: "solid",
      badge: "MOST POPULAR",
    },
    {
      name: "Pro",
      price: "$2,000",
      requests: "1,000,000 requests/month",
      features: ["For large-scale applications", "Enterprise-grade performance", "Dedicated support"],
      borderColor: "purple.400",
      buttonVariant: "solid",
    },
    {
      name: "Enterprise",
      price: "Custom",
      requests: "Unlimited requests",
      features: ["Fully customized solution", "Dedicated account manager", "Custom integrations"],
      borderColor: "gray.600",
      buttonVariant: "outline",
    }
  ];

  return (
    <Box w="full" px={{ base: 4, md: 8 }} py={8}>
      <Box maxW="5xl" mx="auto" textAlign="center">
       <Heading as="h1" size="xl" fontWeight="bold" mb={4}>
          Unlock Search API
        </Heading>
        <Text fontSize="lg" color="gray.600" mb={12}>
        Leverage our AI-driven Search API to query vast amounts of structured and unstructured data in real time. Optimize performance with precision-based search capabilities.
        </Text>
        {/* FREE TRIAL BANNER */}
        <Box bg="blue.500" color="white" borderRadius="lg" py={4} px={6} mb={6} boxShadow="md">
          <Heading as="h2" size="lg" fontWeight="bold" mb={2}>
            Start Your Free Trial Today!
          </Heading>
          <Text fontSize="md" mb={3}>
            Get full access to our SERP API with a 7-day free trial. No credit card required!
          </Text>
          <Button colorScheme="whiteAlpha" variant="solid" onClick={() => navigate('/signup')}>
            Sign Up for Free
          </Button>
        </Box>

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

        {/* Pricing Plans Section */}
        <Heading as="h2" size="lg" fontWeight="bold" mb={4}>API Pricing Plans</Heading>
        <Grid templateColumns={{ base: "1fr", md: "repeat(4, 1fr)" }} gap={6}>
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

                {/* Price Display (Ensuring Same Height) */}
                <Box minH="60px" display="flex" alignItems="center" justifyContent="center">
                  <Text fontSize="2xl" fontWeight="bold">
                    {plan.price === "Custom" ? "Contact Us" : plan.price}
                  </Text>
                  {plan.price !== "Custom" && (
                    <Text as="span" fontSize="lg" color="gray.500">/mo</Text>
                  )}
                </Box>

                {/* CTA Button (Same Size for All Plans) */}
                <Button w="full" colorScheme="blue" size="md" variant={plan.buttonVariant} onClick={() => navigate('/search-api/pricing')}>
                  {plan.price === "Custom" ? "Contact Us" : `Choose ${plan.name}`}
                </Button>
              </Box>
            </Box>
          ))}
        </Grid>

        {/* Security Notice */}
        <Alert status="success" borderRadius="md" mt={6}>
          <AlertIcon />
          <Text>All API requests are securely handled and optimized.</Text>
        </Alert>

      </Box>
    </Box>
  );
};

export default PromoSERP;
