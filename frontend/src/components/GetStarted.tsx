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
        <Code p={4} borderRadius="md" fontSize="sm">
          https://proxy.yourdomain.com:12345
        </Code>
      )
    },
    {
      title: "Set Your Authentication",
      icon: FiCode,
      content: (
        <Box bg="gray.50" p={4} borderRadius="md">
          <Code display="block" mb={2}>
            Username: {`{your_username}`}<br/>
            Password: {`{your_password}`}
          </Code>
          <Button leftIcon={<FiCopy />} variant="link" size="sm" colorScheme="blue">
            Copy credentials
          </Button>
        </Box>
      )
    }
  ];

  const examples = [
    {
      language: "cURL",
      code: `curl --proxy-user username:password \\
     -x proxy.yourdomain.com:12345 \\
     https://api.mywebsite.com`
    },
    {
      language: "Python",
      code: `proxies = {
    'http': 'http://username:password@proxy.yourdomain.com:12345',
    'https': 'http://username:password@proxy.yourdomain.com:12345'
}
requests.get('https://api.mywebsite.com', proxies=proxies)`
    }
  ];

  return (
    <Box maxW="4xl">
      <VStack spacing={8} align="stretch">
        {/* Quick Start Guide */}
        <Box>
          <Heading size="lg" mb={6}>Quick Start Guide</Heading>
          <VStack spacing={8} align="stretch">
            {steps.map((step, index) => (
              <Flex key={index} gap={4}>
                <Box bg="blue.100" p={2} borderRadius="full">
                  <Icon as={step.icon} boxSize={6} />
                </Box>
                <Box flex={1}>
                  <Text fontWeight="bold" mb={2}>{step.title}</Text>
                  {step.content}
                </Box>
              </Flex>
            ))}
          </VStack>
        </Box>

        {/* Code Examples */}
        <Box>
          <Heading size="lg" mb={6}>Integration Examples</Heading>
          <VStack spacing={6} align="stretch">
            {examples.map((example, index) => (
              <Box key={index}>
                <Text fontWeight="bold" mb={2}>{example.language}</Text>
                <Box bg="gray.50" p={4} borderRadius="md">
                  <Code display="block" whiteSpace="pre-wrap">
                    {example.code}
                  </Code>
                  <Button 
                    leftIcon={<FiCopy />} 
                    variant="link" 
                    size="sm" 
                    colorScheme="blue"
                    mt={2}
                  >
                    Copy code
                  </Button>
                </Box>
              </Box>
            ))}
          </VStack>
        </Box>

        {/* Verification Steps */}
        <Alert status="success" borderRadius="md">
          <AlertIcon as={FiCheckCircle} />
          <Box>
            <Text fontWeight="bold">Verify Your Setup</Text>
            <Text fontSize="sm">
              Test your connection using the examples above. If you see your real IP being masked,
              you're all set! For any issues, check our troubleshooting guide or contact support.
            </Text>
          </Box>
        </Alert>
      </VStack>
    </Box>
  );
};

export default GetStarted;