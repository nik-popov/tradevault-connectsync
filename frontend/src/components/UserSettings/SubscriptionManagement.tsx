import { Box, Button, Heading, Text, VStack, HStack, Switch } from "@chakra-ui/react";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

const SubscriptionManagement = () => {
  // Subscription states
  const [hasSubscription, setHasSubscription] = useState(false);
  const [isTrial, setIsTrial] = useState(false);
  const [isDeactivated, setIsDeactivated] = useState(false);

  // Query current user data
  const queryClient = useQueryClient();
  const currentUser = queryClient.getQueryData(["currentUser"]);

  // Product subscription states
  const [productSubscriptions, setProductSubscriptions] = useState({
    product1: false,
    product2: false,
    product3: false,
  });

  // Toggle function for subscription products
  const toggleSubscription = (product: string) => {
    setProductSubscriptions((prev) => ({
      ...prev,
      [product]: !prev[product],
    }));
  };

  return (
    <Box>
      <Heading size="md">Subscription Management</Heading>
      <Text mt={2}>Manage your subscription settings.</Text>

      {/* Subscription Toggles */}
      <VStack mt={4} align="stretch" spacing={4}>
        <HStack justify="space-between">
          <Text fontWeight="bold">Subscription Active</Text>
          <Switch isChecked={hasSubscription} onChange={() => setHasSubscription(!hasSubscription)} />
        </HStack>

        <HStack justify="space-between">
          <Text fontWeight="bold">Trial Mode</Text>
          <Switch isChecked={isTrial} onChange={() => setIsTrial(!isTrial)} />
        </HStack>

        <HStack justify="space-between">
          <Text fontWeight="bold">Deactivated</Text>
          <Switch isChecked={isDeactivated} onChange={() => setIsDeactivated(!isDeactivated)} />
        </HStack>
      </VStack>

      <Heading size="md" mt={6}>Product Access</Heading>
      <Text mt={2}>Enable or disable access to your products.</Text>

      {/* Product Subscription Toggles */}
      <VStack mt={4} align="stretch" spacing={4}>
        <HStack justify="space-between">
          <Text fontWeight="bold">Product 1</Text>
          <Switch isChecked={productSubscriptions.product1} onChange={() => toggleSubscription("product1")} />
        </HStack>

        <HStack justify="space-between">
          <Text fontWeight="bold">Product 2</Text>
          <Switch isChecked={productSubscriptions.product2} onChange={() => toggleSubscription("product2")} />
        </HStack>

        <HStack justify="space-between">
          <Text fontWeight="bold">Product 3</Text>
          <Switch isChecked={productSubscriptions.product3} onChange={() => toggleSubscription("product3")} />
        </HStack>
      </VStack>

      {/* Save Button */}
      <Button mt={6} colorScheme="blue" onClick={() => console.log("Updated Subscriptions:", { hasSubscription, isTrial, isDeactivated, productSubscriptions })}>
        Save Changes
      </Button>
    </Box>
  );
};

export default SubscriptionManagement;
