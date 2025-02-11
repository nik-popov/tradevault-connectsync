import { Box, Heading, Text, VStack, HStack, Switch, Button } from "@chakra-ui/react";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

// Define the shape of the subscription settings
type SubscriptionSettings = {
  hasSubscription: boolean;
  isTrial: boolean;
  isDeactivated: boolean;
};

const SubscriptionManagement = () => {
  const queryClient = useQueryClient();

  // Load initial state from React Query, providing default values
  const initialSubscriptionState = queryClient.getQueryData<SubscriptionSettings>(["subscriptionSettings"]) || {
    hasSubscription: false,
    isTrial: false,
    isDeactivated: false,
  };

  const [subscriptionSettings, setSubscriptionSettings] = useState<SubscriptionSettings>(initialSubscriptionState);

  // Toggle function with properly typed keys
  const toggleSetting = (key: keyof SubscriptionSettings) => {
    const updatedSettings = {
      ...subscriptionSettings,
      [key]: !subscriptionSettings[key],
    };

    setSubscriptionSettings(updatedSettings);
    queryClient.setQueryData(["subscriptionSettings"], updatedSettings);
  };

  return (
    <Box>
      <Heading size="md">Subscription Management</Heading>
      <Text mt={2}>Enable or disable access to your products.</Text>

      <VStack mt={4} align="stretch" spacing={4}>
        <HStack justify="space-between">
          <Text fontWeight="bold">Subscription Active</Text>
          <Switch isChecked={subscriptionSettings.hasSubscription} onChange={() => toggleSetting("hasSubscription")} />
        </HStack>

        <HStack justify="space-between">
          <Text fontWeight="bold">Trial Mode</Text>
          <Switch isChecked={subscriptionSettings.isTrial} onChange={() => toggleSetting("isTrial")} />
        </HStack>

        <HStack justify="space-between">
          <Text fontWeight="bold">Deactivated</Text>
          <Switch isChecked={subscriptionSettings.isDeactivated} onChange={() => toggleSetting("isDeactivated")} />
        </HStack>
      </VStack>

      <Button mt={6} colorScheme="blue" onClick={() => console.log("Updated Settings:", subscriptionSettings)}>
        Save Changes
      </Button>
    </Box>
  );
};

export default SubscriptionManagement;
