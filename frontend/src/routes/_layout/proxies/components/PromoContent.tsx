import React from 'react';
import { Box, Text, Button, VStack } from '@/components/ui/card';
import { createFileRoute } from '@tanstack/react-router';

const PromoContent = () => {
  return (
    <Box p={6}>
      <VStack spacing={4} align="stretch">
        <Text fontSize="xl" fontWeight="bold">
          Unlock Premium Features
        </Text>
        <Text>
          Get access to our full suite of residential proxy features by subscribing to a plan.
        </Text>
        <Button>View Plans</Button>
      </VStack>
    </Box>
  );
};

// Add the required Route export for TanStack Router
export const Route = createFileRoute('/_layout/proxies/components/PromoContent')({
  component: PromoContent
});

export default PromoContent;
