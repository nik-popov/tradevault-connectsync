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
        <Alert 
          status="info" 
          borderRadius="md" 
          bg="gray.50"        // Changed from gray.700 to a very light gray
          color="gray.800"    // Changed from gray.300 to a dark gray for contrast
        >
          <AlertIcon color="blue.500" /> 
          <Text fontSize="sm">
            Upcoming internal features are in development. We welcome your feedback to help shape them.
          </Text>
        </Alert>
      </VStack>
    </Box>
  );
};

export default ComingSoon;