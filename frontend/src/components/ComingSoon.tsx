import React from 'react';
import {
  Box,
  Text,
  Alert,
  AlertIcon,
  VStack
} from "@chakra-ui/react";

const ComingSoon: React.FC = () => {
  return (
    <Box maxW="100%" mx="auto" px={{ base: 6, md: 12 }} py={10}>
      <VStack spacing={6} align="stretch">
        
        <Alert status="info" borderRadius="md" bg="gray.700" color="gray.300">
          <AlertIcon color="blue.400" />
          <Text fontSize="sm">
            Upcoming internal features are in development. We welcome your feedback to help shape them.
          </Text>
        </Alert>

      </VStack>
    </Box>
  );
};

export default ComingSoon;
