import React from 'react';
import {
  Box,
  VStack,
  Heading,
  Text,
  Button,
  Code,
  HStack,
  Icon,
  Flex,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import { FiCheckCircle, FiCopy, FiGlobe, FiCode } from "react-icons/fi";

const GetStarted = () => {
  const steps = [
    {
      title: "Configure Your Endpoint",
      icon: FiGlobe,
      content: (
        <Code p={3} borderRadius="md" fontSize="sm">
          https://proxy.yourdomain.com:12345
        </Code>
      )
    },
    {
      title: "Set Your Authentication",
      icon: FiCode,
      content: (
        <Box bg="gray.50" p={3} borderRadius="md">
          <Code display="block" mb={2}>
            Username: your_username<br/>
            Password: your_password
          </Code>
          <Button leftIcon={<FiCopy />} variant="link" size="sm" colorScheme="blue">
            Copy credentials
          </Button>
        </Box>
      )
    }
  ];

  return (
    <Box maxW="4xl">
      <VStack spacing={6} align="stretch">
        <Heading size="lg">Quick Start Guide</Heading>
        {steps.map((step, index) => (
          <Flex key={index} gap={4}>
            <Box bg="blue.100" p={2} borderRadius="full">
              <Icon as={step.icon} boxSize={7} />
            </Box>
            <Box flex={1}>
              <Text fontWeight="bold" mb={2}>{step.title}</Text>
              {step.content}
            </Box>
          </Flex>
        ))}
        <Alert status="success" borderRadius="md">
          <AlertIcon as={FiCheckCircle} boxSize={6} />
          <Box>
            <Text fontWeight="bold">Verify Your Setup</Text>
            <Text fontSize="sm">
              Test your connection using the examples above. If your IP is masked, you're set!
            </Text>
          </Box>
        </Alert>
      </VStack>
    </Box>
  );
};

export default GetStarted;
