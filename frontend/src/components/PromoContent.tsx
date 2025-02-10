import React from 'react';
import { Box, Button, Text, Heading, VStack, HStack, Grid, GridItem, Flex, Icon, Badge } from "@chakra-ui/react";
import { createFileRoute } from '@tanstack/react-router';
import { FiArrowRight, FiShield, FiGlobe, FiZap } from 'react-icons/fi';

const PromoContent = () => {

  const features = [
    {
      icon: FiGlobe,
      title: "Global Coverage",
      description: "Access to residential IPs from 195+ locations worldwide"
    },
    {
      icon: FiZap,
      title: "Lightning Fast",
      description: "Industry-leading connection speeds with 99.9% uptime"
    },
    {
      icon: FiShield,
      title: "Secure & Private",
      description: "Enterprise-grade security with IP rotation and authentication"
    }
  ];

  return (
    <Box w="full" px={{ base: 4, md: 8 }} py={8}>
      <Box maxW="4xl" mx="auto" textAlign="center">
        <Heading as="h1" size="xl" fontWeight="bold" mb={4}>
          Unlock Premium Residential Proxies
        </Heading>
        <Text fontSize="lg" color="gray.600" mb={12}>
          Get instant access to our global network of residential IPs with unlimited bandwidth
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
            Experience unlimited access to all features for 7 days, no credit card required
          </Text>
          <Button colorScheme="blue" size="lg" rightIcon={<FiArrowRight />}>
            Start Free Trial
          </Button>
        </Box>

        {/* Pricing Plans */}
        <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={6}>
          {/* Basic Plan */}
          <Box p={6} border="1px solid" borderColor="gray.200" borderRadius="lg">
            <Heading as="h3" size="md" fontWeight="semibold" mb={4}>Basic Plan</Heading>
            <Text fontSize="3xl" fontWeight="bold" mb={4}>
              $49<Text as="span" fontSize="lg" color="gray.500">/mo</Text>
            </Text>
            <VStack spacing={3} align="start" mb={6}>
              <HStack><Icon as={FiArrowRight} color="blue.500" boxSize={5} /><Text>5 concurrent connections</Text></HStack>
              <HStack><Icon as={FiArrowRight} color="blue.500" boxSize={5} /><Text>50GB monthly traffic</Text></HStack>
              <HStack><Icon as={FiArrowRight} color="blue.500" boxSize={5} /><Text>Basic support</Text></HStack>
            </VStack>
            <Button w="full" variant="outline" colorScheme="blue">Choose Basic</Button>
          </Box>

          {/* Premium Plan */}
          <Box p={6} border="2px solid" borderColor="blue.600" bg="blue.50" borderRadius="lg">
            <Badge colorScheme="blue" variant="solid" px={3} py={1} mb={4}>
              MOST POPULAR
            </Badge>
            <Heading as="h3" size="md" fontWeight="semibold" mb={4}>Premium Plan</Heading>
            <Text fontSize="3xl" fontWeight="bold" mb={4}>
              $99<Text as="span" fontSize="lg" color="gray.500">/mo</Text>
            </Text>
            <VStack spacing={3} align="start" mb={6}>
              <HStack><Icon as={FiArrowRight} color="blue.500" boxSize={5} /><Text>Unlimited concurrent connections</Text></HStack>
              <HStack><Icon as={FiArrowRight} color="blue.500" boxSize={5} /><Text>Unlimited monthly traffic</Text></HStack>
              <HStack><Icon as={FiArrowRight} color="blue.500" boxSize={5} /><Text>24/7 priority support</Text></HStack>
            </VStack>
            <Button w="full" colorScheme="blue">Choose Premium</Button>
          </Box>
        </Grid>
      </Box>
    </Box>
  );
};

export const Route = createFileRoute('/_layout/proxies/components/PromoContent')({
  component: PromoContent
});

export default PromoContent;
