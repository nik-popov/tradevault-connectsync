import React from 'react';
import {
  Box,
  VStack,
  Heading,
  Text,
  Button,
  Code,
  Icon,
  Flex,
  Alert,
  AlertIcon,
  Divider,
} from "@chakra-ui/react";
import { 
  FiCheckCircle, 
  FiCopy, 
  FiGlobe, 
  FiCode, 
  FiSettings, 
  FiServer, 
  FiList 
} from "react-icons/fi";

const MobileResidentialApiStartGuide = () => {
  const steps = [
    {
      title: "List Available Endpoints",
      icon: FiList,
      description: "Retrieve all available endpoints for our mobile residential proxy network.",
      content: (
        <Code p={3} borderRadius="md" fontSize="sm" bg="gray.50">
          {`curl -X GET "https://api.thedataproxy.com/api/v1/endpoints?type=mobile-residential"`}
        </Code>
      )
    },
    {
      title: "Get Available Locations",
      icon: FiGlobe,
      description: "Retrieve supported locations for optimal proxy routing.",
      content: (
        <Code p={3} borderRadius="md" fontSize="sm" bg="gray.50">
          {`curl -X GET "https://api.thedataproxy.com/api/v1/locations?type=mobile-residential"`}
        </Code>
      )
    },
    {
      title: "Configure Your Endpoint",
      icon: FiGlobe,
      description: "Connect to our mobile residential proxy network using this endpoint.",
      content: (
        <Code p={3} borderRadius="md" fontSize="sm" bg="gray.50">
          https://api.thedataproxy.com/api/v1/proxy/mobile-residential/
        </Code>
      )
    },
    {
      title: "Set Your Authentication",
      icon: FiCode,
      description: "Authenticate your API requests with your provided credentials.",
      content: (
        <Box bg="gray.50" p={3} borderRadius="md">
          <Code display="block" mb={2}>
            Username: your_username<br />
            Password: your_password
          </Code>
          <Button leftIcon={<FiCopy />} variant="link" size="sm" colorScheme="blue">
            Copy credentials
          </Button>
        </Box>
      )
    },
    {
      title: "Retrieve Authentication Info",
      icon: FiCode,
      description: "Verify your authentication details and status.",
      content: (
        <Code p={3} borderRadius="md" fontSize="sm" bg="gray.50">
          {`curl -X GET "https://api.thedataproxy.com/api/v1/auth/mobile-residential"`}
        </Code>
      )
    },
    {
      title: "Optimize Your Settings",
      icon: FiSettings,
      description: "Adjust headers and connection settings for enhanced performance.",
      content: (
        <Code p={3} borderRadius="md" fontSize="sm" bg="gray.50">
          {`headers = {
  'User-Agent': 'YourApp/1.0', 
  'X-Proxy-Type': 'mobile-residential'
}`}
        </Code>
      )
    },
    {
      title: "Send Your First Request",
      icon: FiServer,
      description: "Test your connection using our mobile residential proxy.",
      content: (
        <Code p={3} borderRadius="md" fontSize="sm" bg="gray.50">
          {`curl --proxy-user username:password -x "api.thedataproxy.com/api/v1/proxy/mobile-residential/" "https://api.mywebsite.com"`}
        </Code>
      )
    },
    {
      title: "Monitor and Scale",
      icon: FiSettings,
      description: "Track usage and scale your API calls as needed.",
      content: (
        <Code p={3} borderRadius="md" fontSize="sm" bg="gray.50">
          {`curl -X GET "https://api.thedataproxy.com/api/v1/usage/mobile-residential/"`}
        </Code>
      )
    }
  ];

  return (
    <Box maxW="100%" mx="auto" px={{ base: 6, md: 12 }} py={12}>
      <VStack spacing={8} align="stretch">
        {/* Header */}
        <Box textAlign="center">
          <Heading size="xl" fontWeight="bold" mb={2}>
            Mobile Residential API Start Guide
          </Heading>
          <Text fontSize="lg" color="gray.600">
            Follow these steps to integrate our mobile residential proxy API into your application.
          </Text>
        </Box>

        <Divider />

        {/* Step-by-Step Instructions */}
        <VStack spacing={6} align="stretch">
          {steps.map((step, index) => (
            <Flex key={index} gap={4} align="flex-start">
              <Flex
                align="center"
                justify="center"
                w="50px"
                h="50px"
                borderRadius="full"
                bg="blue.100"
              >
                <Icon as={step.icon} boxSize={6} color="blue.500" />
              </Flex>
              <Box flex={1}>
                <Heading size="md" fontWeight="semibold" mb={1}>
                  {step.title}
                </Heading>
                <Text color="gray.600" mb={2}>
                  {step.description}
                </Text>
                {step.content}
              </Box>
            </Flex>
          ))}
        </VStack>

        <Divider />

        {/* Verification & Support */}
        <Alert status="success" borderRadius="md">
          <AlertIcon as={FiCheckCircle} boxSize={5} />
          <Box>
            <Text fontWeight="bold">Verify Your Setup</Text>
            <Text fontSize="sm">
              Test your connection using the examples above. If your IP is masked and your geolocation aligns with your settings, you're ready to go!
              Need help? Visit our{" "}
              <Button variant="link" colorScheme="blue" size="sm">
                troubleshooting guide
              </Button>{" "}
              or contact support.
            </Text>
          </Box>
        </Alert>
      </VStack>
    </Box>
  );
};

export default MobileResidentialApiStartGuide;
