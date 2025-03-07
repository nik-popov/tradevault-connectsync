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
  Alert,
  AlertIcon,
  VStack
} from "@chakra-ui/react";
import { Link } from '@tanstack/react-router';
import { FiTool, FiClock, FiTrendingUp, FiPackage } from 'react-icons/fi';

const internalUpcomingFeatures = [
  { 
    name: "Feature A", 
    icon: FiTrendingUp, 
    description: "High-level description of Feature A and why it's important for our internal teams." 
  },
  { 
    name: "Feature B", 
    icon: FiTool, 
    description: "Brief overview of Feature B's functionality and benefits for internal workflows." 
  },
  { 
    name: "Feature C", 
    icon: FiClock, 
    description: "A teaser for how Feature C will improve efficiency or automation internally." 
  },
  { 
    name: "Feature D", 
    icon: FiPackage, 
    description: "General summary of Feature D, focusing on practical advantages for teams." 
  }
];

const ComingSoon: React.FC = () => {
  return (
    <Box maxW="100%" mx="auto" px={{ base: 6, md: 12 }} py={10} bg="gray.800">
      <VStack spacing={6} align="stretch">
        
        <Alert status="info" borderRadius="md" bg="gray.700" color="gray.300">
          <AlertIcon color="blue.400" />
          <Text fontSize="sm">
            Upcoming internal features are in development. We welcome your feedback to help shape them.
          </Text>
        </Alert>

        <Box w="100%" py={6} bg="gray.700" borderRadius="md" boxShadow="lg" px={6}>
          <Heading as="h1" size="lg" fontWeight="bold" color="gray.100">
            🚀 Internal Features Coming Soon
          </Heading>
          <Text fontSize="sm" color="gray.400" mt={1}>
            We are rolling out new capabilities to streamline internal workflows and improve efficiency.
          </Text>
        </Box>

        <Box bg="gray.700" py={10} px={6} borderRadius="md" boxShadow="lg">
          <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={6} mt={6}>
            {internalUpcomingFeatures.map((feature, index) => (
              <GridItem 
                key={index} 
                p={5} 
                borderRadius="lg" 
                boxShadow="md" 
                bg="gray.600" 
                _hover={{ boxShadow: "lg" }}
              >
                <Flex align="center" mb={3}>
                  <Icon as={feature.icon} boxSize={6} color="blue.400" mr={3} />
                  <Text fontSize="md" fontWeight="semibold" color="gray.200">
                    {feature.name}
                  </Text>
                </Flex>
                <Text fontSize="sm" color="gray.400">
                  {feature.description}
                </Text>
              </GridItem>
            ))}
          </Grid>

          <Box textAlign="center" mt={8}>
            <Text fontSize="sm" color="gray.300">
              Need early access or have suggestions? Let us know.
            </Text>
              <Link to="/support">
              <Button mt={3} bg="blue.600" color="gray.100" _hover={{ bg: "blue.500" }} variant="solid">
                Provide Feedback
              </Button>
            </Link>
          </Box>
        </Box>

      </VStack>
    </Box>
  );
};

export default ComingSoon;
