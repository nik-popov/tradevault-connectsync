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
  Divider
} from "@chakra-ui/react";
import { FiCheckCircle, FiCopy, FiGlobe, FiCode, FiSettings, FiServer } from "react-icons/fi";

const GetStarted = () => {
  const steps = [
    {
      title: "Configure Your Endpoint",
      icon: FiGlobe,
      description: "Use the provided endpoint to connect to our proxy network.",
      content: (
        <Code p={3} borderRadius="md" fontSize="sm" bg="gray.700">
          https://proxy.yourdomain.com:12345
        </Code>
      )
    },
    {
      title: "Set Your Authentication",
      icon: FiCode,
      description: "Use your credentials to authenticate requests.",
      content: (
        <Box bg="gray.700" p={3} borderRadius="md">
          <Code display="block" mb={2}>
            Username: your_username<br/>
            Password: your_password
          </Code>
          <Button leftIcon={<FiCopy />} variant="link" size="sm" colorScheme="blue">
            Copy credentials
          </Button>
        </Box>
      )
    },
    {
      title: "Optimize Your Settings",
      icon: FiSettings,
      description: "Adjust request headers and connection settings for better performance.",
      content: (
        <Code p={3} borderRadius="md" fontSize="sm" bg="gray.700">
          {`headers = {'User-Agent': 'YourApp/1.0'}`}
        </Code>
      )
    },
    {
      title: "Send Your First Request",
      icon: FiServer,
      description: "Use the correct proxy format in your code to start making requests.",
      content: (
        <Code p={3} borderRadius="md" fontSize="sm" bg="gray.700">
          {`curl --proxy-user username:password -x proxy.yourdomain.com:12345 https://api.mywebsite.com`}
        </Code>
      )
    }
  ];

  return (
    <Box maxW="100%" mx="auto" px={{ base: 6, md: 12 }} py={12}>
      <VStack spacing={8} align="stretch">
        {/* Quick Start Guide Header */}
        <Box textAlign="left"> {/* Changed from center to left */}
          <Heading size="xl" fontWeight="bold" mb={2}>
           Quick Start Guide
          </Heading>
          <Text fontSize="lg" color="gray.600">
            Follow these simple steps to integrate our residential proxy into your applications.
          </Text>
        </Box>


        <Divider />

        {/* Step-by-Step Guide */}
        <VStack spacing={6} align="stretch">
          {steps.map((step, index) => (
            <Flex key={index} gap={4} align="flex-start">
              <Flex align="center" justify="center" w="50px" h="50px" borderRadius="full" bg="blue.100">
                <Icon as={step.icon} boxSize={6} color="blue.500" />
              </Flex>
              <Box flex={1}>
                <Heading size="md" fontWeight="semibold" mb={1}>{step.title}</Heading>
                <Text color="gray.600" mb={2}>{step.description}</Text>
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
              Test your connection using the examples above. If your IP is masked, you're all set! 
              Need help? Visit our <Button variant="link" colorScheme="blue" size="sm">troubleshooting guide</Button> or contact support.
            </Text>
          </Box>
        </Alert>
      </VStack>
    </Box>
  );
};

export default GetStarted;
