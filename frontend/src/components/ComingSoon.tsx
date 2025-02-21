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
import { Link } from '@tanstack/react-router';
import { FiCheckCircle, FiTool, FiClock, FiTrendingUp, FiPackage } from 'react-icons/fi';

const comingSoonFeatures = [
  { name: "Advanced Analytics", icon: FiTrendingUp, description: "Detailed insights and reporting on proxy usage." },
  { name: "AI-Powered IP Rotation", icon: FiTool, description: "Smart rotation logic for enhanced anonymity." },
  { name: "Priority Routing", icon: FiClock, description: "Faster access to premium IP pools with lower latency." },
  { name: "Custom Proxy Packages", icon: FiPackage, description: "Flexible plans tailored to your exact needs." }
];

const ComingSoon: React.FC = () => {
  return (
    <Box maxW="100%" mx="auto" px={{ base: 6, md: 12 }} py={10} bg="gray.800">
      <VStack spacing={6} align="stretch">
        <Alert status="warning" borderRadius="md" bg="gray.700" color="gray.300">
          <AlertIcon color="yellow.500" />
          <Text fontSize="sm">New features are under development! Stay tuned for updates.</Text>
        </Alert>

        <Box w="100%" py={6} bg="gray.700" borderRadius="md" boxShadow="lg" px={6}>
          <Heading as="h1" size="lg" fontWeight="bold" color="gray.100">
            🚀 Coming Soon: Next-Gen Proxy Features
          </Heading>
          <Text fontSize="sm" color="gray.400" mt={1}>
            We're actively developing cutting-edge proxy solutions to enhance your experience.
          </Text>
        </Box>

        <Box bg="gray.700" py={10} px={6} borderRadius="md" boxShadow="lg">
          <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={6} mt={6}>
            {comingSoonFeatures.map((feature, index) => (
              <GridItem key={index} p={5} borderRadius="lg" boxShadow="md" _hover={{ boxShadow: "lg" }} bg="gray.600">
                <Flex align="center" mb={3}>
                  <Icon as={feature.icon} boxSize={6} color="yellow.400" mr={3} />
                  <Text fontSize="md" fontWeight="semibold" color="gray.200">{feature.name}</Text>
                </Flex>
                <Text fontSize="sm" color="gray.400">{feature.description}</Text>
              </GridItem>
            ))}
          </Grid>

          <Box textAlign="center" mt={8}>
            <Text fontSize="sm" color="gray.300">Want early access? Join our beta program.</Text>
            <Link to="/contact">
              <Button mt={3} bg="yellow.600" color="gray.100" _hover={{ bg: "yellow.500" }} variant="solid">
                Get Notified
              </Button>
            </Link>
          </Box>
        </Box>
      </VStack>
    </Box>
  );
};

export default ComingSoon;
