import React from 'react';
import { 
  Box, 
  Text, 
  Alert, 
  AlertIcon, 
  VStack, 
  Button 
} from "@chakra-ui/react";

const ComingSoon: React.FC = () => {
  return (
    <Box maxW="100%" mx="auto" px={{ base: 6, md: 12 }} py={10}>
      <VStack spacing={6} align="stretch">
        <Alert 
          status="info" 
          borderRadius="md" 
          bg="gray.50"
          color="gray.800"
          role="alert"
        >
          <AlertIcon color="blue.500" /> 
          <Text fontSize={{ base: "sm", md: "md" }}>
            Account not linked to a valid subscription
          </Text>
        </Alert>
        <Button
          as="a"
          href="https://thedataproxy.com/pricing"
          target="_blank"
          rel="noopener noreferrer"
          colorScheme="blue"
          size="md"
          alignSelf="start"
        >
          Explore Plans
        </Button>
        <Text fontSize={{ base: "sm", md: "md" }} color="gray.600">
          If you have purchased a subscription, please contact support using the same email address used for the purchase.
        </Text>
      </VStack>
    </Box>
  );
};

export default ComingSoon;