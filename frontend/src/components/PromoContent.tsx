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
import { FiCheckCircle, FiGlobe, FiZap, FiShield } from 'react-icons/fi';

const PromoContent = () => {
  const navigate = useNavigate();

  const features = [
    { icon: FiGlobe, title: "Global Coverage", description: "Access to residential IPs from 195+ locations worldwide." },
    { icon: FiZap, title: "Lightning Fast", description: "Industry-leading connection speeds with 99.9% uptime." },
    { icon: FiShield, title: "Secure & Private", description: "Enterprise-grade security with IP rotation and authentication." }
  ];
  const pricingPlans = [
    {
      name: "Starter",
      price: "$99",
      traffic: "100GB/month",
      features: ["1 concurrent connection", "Basic support", "Shared IP pool"],
      borderColor: "gray.300",
      buttonVariant: "outline",
    },
    {
      name: "Business",
      price: "$499",
      traffic: "1TB/month",
      features: ["10 concurrent connections", "Priority support", "Dedicated IP options"],
      borderColor: "blue.400",
      buttonVariant: "solid",
      badge: "MOST POPULAR",
    },
    {
      name: "Business Plus+",
      price: "$2,999",
      traffic: "Unlimited",
      features: ["Unlimited concurrent connections", "Dedicated support", "Custom IP pools", "24/7 SLA"],
      borderColor: "purple.400",
      buttonVariant: "solid",
    },
    {
      name: "Ultra Enterprise",
      price: "Custom",
      traffic: "Unlimited + Dedicated Resources",
      features: ["Dedicated proxies", "Custom traffic limits", "Private network setup"],
      borderColor: "gray.600",
      buttonVariant: "outline",
    }
  ];

  return (
    <Box maxW="100%" mx="auto" px={{ base: 6, md: 12 }} py={12}>
      <VStack spacing={8} align="stretch">
        <Heading as="h1" size="xl" fontWeight="bold">
          Unlock Premium Proxies
        </Heading>
        <Text fontSize="lg" color="gray.600">
          Get instant access to our global network of residential IPs with unlimited bandwidth.
        </Text>

        {/* FREE TRIAL BANNER */}
        <Box bg="blue.500" color="white" borderRadius="lg" py={4} px={6} boxShadow="md">
          <Heading as="h2" size="lg" fontWeight="bold">
            Start Your Free Trial Today!
          </Heading>
          <Text fontSize="md" my={3}>
            Experience unlimited access to all features for 7 days. No credit card required!
          </Text>
          <Button colorScheme="whiteAlpha" variant="solid" onClick={() => navigate('/signup')}>
            Sign Up for Free
          </Button>
        </Box>

        {/* Features Section */}
        <Grid templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} gap={6}>
          {features.map((feature, index) => (
            <GridItem key={index} p={6} border="1px solid" borderColor="gray.200" borderRadius="lg" boxShadow="sm" _hover={{ boxShadow: "md" }}>
              <Flex align="center" mb={4}>
                <Icon as={feature.icon} boxSize={8} color="blue.500" mr={3} />
                <Text fontSize="lg" fontWeight="semibold">{feature.title}</Text>
              </Flex>
              <Text fontSize="sm" color="gray.600">{feature.description}</Text>
            </GridItem>
          ))}
        </Grid>

        {/* Pricing Plans Section */}
        <Grid templateColumns={{ base: "1fr", md: "repeat(4, 1fr)" }} gap={6}>
          {pricingPlans.map((plan, index) => (
            <Box key={index} position="relative">
              {plan.badge && (
                <Badge colorScheme="blue" variant="solid" px={3} py={1} position="absolute" top="-12px" left="10px">
                  {plan.badge}
                </Badge>
              )}
              <Box p={6} border="2px solid" borderColor={plan.borderColor} borderRadius="lg" textAlign="left">
                <Heading as="h3" size="md" fontWeight="semibold" mb={2}>
                  {plan.name}
                </Heading>
                <List spacing={3} mb={6}>
                  {plan.features.map((feature, idx) => (
                    <ListItem key={idx} display="flex" alignItems="center">
                      <ListIcon as={FiCheckCircle} color="blue.500" boxSize={5} />
                      {feature}
                    </ListItem>
                  ))}
                </List>
                <Text fontSize="2xl" fontWeight="bold" mb={1}>
                  {plan.price === "Custom" ? "Contact Us" : plan.price}
                  {plan.price !== "Custom" && <Text as="span" fontSize="lg" color="gray.500">/mo</Text>}
                </Text>
                <Button w="full" colorScheme="blue" variant={plan.buttonVariant} onClick={() => navigate('/proxies/pricing')}>
                  {plan.price === "Custom" ? "Contact Us" : `Choose ${plan.name}`}
                </Button>
              </Box>
            </Box>
          ))}
        </Grid>
      </VStack>
    </Box>
  );
};

export default PromoContent;
