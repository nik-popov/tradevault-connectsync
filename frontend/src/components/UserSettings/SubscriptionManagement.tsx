import { Box, Button, Heading, Text } from "@chakra-ui/react";

const SubscriptionManagement = () => {
  return (
    <Box>
      <Heading size="md">Subscription Management</Heading>
      <Text mt={2}>Upgrade, downgrade, or cancel your subscription.</Text>
      <Button mt={4} colorScheme="blue">Manage Subscription</Button>
    </Box>
  );
};

export default SubscriptionManagement;
