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
} from "@chakra-ui/react";
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { FiArrowRight, FiShield, FiGlobe, FiZap, FiCheck } from 'react-icons/fi';

const PromoContent = () => {
  const navigate = useNavigate(); // ✅ Move useNavigate() inside the function

  const features = [
    { icon: FiGlobe, title: "Global Coverage", description: "Access to residential IPs from 195+ locations worldwide" },
    { icon: FiZap, title: "Lightning Fast", description: "Industry-leading connection speeds with 99.9% uptime" },
    { icon: FiShield, title: "Secure & Private", description: "Enterprise-grade security with IP rotation and authentication" }
  ];

  const plans = [
    {
      name: "Starter",
      price: "$29",
      features: ["1 concurrent connection", "10GB monthly traffic", "Basic support"],
      borderColor: "gray.300",
      buttonVariant: "outline",
    },
    {
      name: "Basic",
      price: "$49",
      features: ["5 concurrent connections", "50GB monthly traffic", "Standard support"],
      borderColor: "gray.400",
      buttonVariant: "outline",
    },
    {
      name: "Premium",
      price: "$99",
      features: ["Unlimited concurrent connections", "Unlimited traffic", "Priority support"],
      borderColor: "blue.500",
      buttonVariant: "solid",
      badge: "MOST POPULAR",
    },
    {
      name: "Enterprise",
      price: "Custom",
      features: ["Dedicated IPs", "Custom traffic limits", "Dedicated account manager"],
      borderColor: "gray.600",
      buttonVariant: "outline",
    }
  ];

  return (
    <Box w="full" px={{ base: 4, md: 8 }} py={8}>
      <Box maxW="5xl" mx="auto" textAlign="center">
        <Heading as="h1" size="xl" fontWeight="bold" mb={4}>
          Unlock Premium Proxies
        </Heading>
        <Text fontSize="lg" color="gray.600" mb={12}>
          Get instant access to our global network of residential IPs with unlimited bandwidth.
        </Text>

        {/* Features Section */}
        <Grid templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} gap={6} mb={12}>
          {features.map((feature, index) => (
            <GridItem key={index} p={6} border="1px solid" borderColor="gray.200" borderRadius="lg" boxShadow="sm" _hover={{ boxShadow: "md" }}>
              <Flex justify="center" mb={4}>
                <Icon as={feature.icon} boxSize={10} color="blue.500" />
              </Flex>
              <Heading as="h3" size="md" fontWeight="semibold" mb={2}>{feature.title}</Heading>
              <Text color="gray.600">{feature.description}</Text>
            </GridItem>
          ))}
        </Grid>

        {/* Free Trial CTA */}
        <Box bg="blue.50" borderRadius="xl" p={8} mb={12}>
          <Heading as="h2" size="lg" fontWeight="bold" mb={4}>Start Your Free Trial Today</Heading>
          <Text color="gray.600" mb={6}>
            Experience unlimited access to all features for 7 days, no credit card required.
          </Text>
          <Button colorScheme="blue" size="lg" rightIcon={<FiArrowRight />} onClick={() => navigate('/proxies/pricing')}>
            Start Free Trial
          </Button>
        </Box>

        {/* Pricing Plans - Aligned Layout */}
        <Grid templateColumns={{ base: "1fr", md: "repeat(4, 1fr)" }} gap={6}>
          {plans.map((plan, index) => (
            <Box
              key={index}
              p={6}
              border="2px solid"
              borderColor={plan.borderColor}
              bg={plan.name === "Premium" ? "blue.50" : "white"}
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
                    <ListIcon as={FiCheck} color="blue.500" boxSize={5} />
                    {feature}
                  </ListItem>
                ))}
              </List>
              <Button w="full" colorScheme="blue" variant={plan.buttonVariant} onClick={() => navigate('/proxies/pricing')}>
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
export const Route = createFileRoute('/src/components/PromoContent')({
  component: PromoContent
});

export default PromoContent;
