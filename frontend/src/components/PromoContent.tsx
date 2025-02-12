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
import { Link, useNavigate } from '@tanstack/react-router';

import { FiCheckCircle, FiGlobe, FiZap, FiShield, FiServer } from 'react-icons/fi';


const proxyFeatures = [
  { name: "Global Coverage", icon: FiGlobe, description: "Access to residential IPs from 195+ locations worldwide." },
  { name: "Lightning Fast", icon: FiZap, description: "Industry-leading connection speeds with 99.9% uptime." },
  { name: "Secure & Private", icon: FiShield, description: "Enterprise-grade security with IP rotation and authentication." },
  { name: "Scalable Infrastructure", icon: FiServer, description: "Easily scale your proxy usage with flexible plans and resources." }
];

const proxyPlans = [
  {
    name: "Starter",
    price: "$99/mo",
    features: ["100GB/month", "1 concurrent connection", "Basic support", "Shared IP pool"],
    borderColor: "blue.700",
    buttonVariant: "outline",
  },
  {
    name: "Business",
    price: "$499/mo",
    features: ["1TB/month", "10 concurrent connections", "Priority support", "Dedicated IP options"],
    borderColor: "blue.600",
    buttonVariant: "solid",
    badge: "MOST POPULAR",
  },
  {
    name: "Business Plus+",
    price: "$2,999/mo",
    features: ["Unlimited", "Unlimited concurrent connections", "Custom IP pools", "24/7 SLA"],
    borderColor: "blue.500",
    buttonVariant: "solid",
  },
  {
    name: "Ultra Enterprise",
    price: "Custom Pricing",
    features: ["Unlimited + Dedicated Resources", "Dedicated proxies", "Custom traffic limits", "Private network setup"],
    borderColor: "blue.400",
    buttonVariant: "outline",
  }
];

const PromoContent: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box maxW="100%" mx="auto" px={{ base: 6, md: 12 }} py={10} bg="gray.800">
      <VStack spacing={6} align="stretch">
        <Alert status="info" borderRadius="md" bg="gray.700" color="gray.300">
          <AlertIcon color="blue.500" />
          <Text fontSize="sm">All proxies are optimized for high-speed performance and secure access.</Text>
        </Alert>

        <Box w="100%" py={6} bg="gray.700" borderRadius="md" boxShadow="lg" px={6}>
          <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={6} alignItems="center">
            <Box>
              <Heading as="h1" size="lg" fontWeight="bold" color="gray.100">
                Unlock Premium Proxies
              </Heading>
              <Text fontSize="sm" color="gray.400" mt={1}>
                Get instant access to our global network of residential IPs with flexible options tailored for your needs.
              </Text>
            </Box>

            <Box bg="blue.800" color="gray.300" borderRadius="md" p={5} boxShadow="lg" textAlign="left" display="flex" flexDirection="column" justifyContent="center">
              <Heading as="h2" size="md" fontWeight="light" color="gray.100">
                Start Your Free Trial Today!
              </Heading>
              <Text fontSize="xs" my={2} color="gray.300">
                Get full access to our proxies with a 7-day free trial. No credit card required!
              </Text>
              <Link to="/proxies/pricing">
  <Button bg="blue.600" color="gray.100" _hover={{ bg: "blue.500" }} variant="solid" size="sm">
    Sign Up for Free
  </Button>
</Link>

            </Box>
          </Grid>
        </Box>

        <Box bg="gray.700" py={10} px={6} borderRadius="md" boxShadow="lg">
          <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={6} mt={6}>
            {proxyFeatures.map((feature, index) => (
              <GridItem key={index} p={5} borderRadius="lg" boxShadow="md" _hover={{ boxShadow: "lg" }} bg="gray.600">
                <Flex align="center" mb={3}>
                  <Icon as={feature.icon} boxSize={6} color="blue.400" mr={3} />
                  <Text fontSize="md" fontWeight="semibold" color="gray.200">{feature.name}</Text>
                </Flex>
                <Text fontSize="sm" color="gray.400">{feature.description}</Text>
              </GridItem>
            ))}
          </Grid>

          <Grid templateColumns={{ base: "1fr", md: "repeat(4, 1fr)" }} gap={6} mt={10}>
            {proxyPlans.map((plan, index) => (
              <Box key={index} position="relative" display="flex" flexDirection="column" height="100%">
                {plan.badge && (
                  <Badge bg="blue.600" color="white" px={3} py={1} position="absolute" top="-12px" left="10px">
                    {plan.badge}
                  </Badge>
                )}
                <Box p={6} border="2px solid" borderColor={plan.borderColor} borderRadius="lg" textAlign="left" bg="gray.700" flex="1" display="flex" flexDirection="column" justifyContent="space-between">
                  <Heading as="h3" size="sm" fontWeight="semibold" mb={2} color="gray.200">
                    {plan.name}
                  </Heading>
                  <List spacing={2} mb={6} flexGrow={1}>
                    {plan.features.map((feature, idx) => (
                      <ListItem key={idx} display="flex" alignItems="center">
                        <ListIcon as={FiCheckCircle} color="blue.500" boxSize={5} />
                        <Text fontSize="sm" color="gray.300">{feature}</Text>
                      </ListItem>
                    ))}
                  </List>

<Link to="/proxies/pricing" style={{ width: "100%" }}>
  <Button w="full" bg="blue.600" color="white" _hover={{ bg: "blue.500" }} variant={plan.buttonVariant} size="sm">
    {plan.price === "Custom Pricing" ? "Contact Us" : `Choose ${plan.name}`}
  </Button>
</Link>

                </Box>
              </Box>
            ))}
          </Grid>
        </Box>
      </VStack>
    </Box>
  );
};

export default PromoContent;