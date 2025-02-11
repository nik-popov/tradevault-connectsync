import { 
  Box, Heading, Text, VStack, HStack, Switch, Button, Divider 
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";

const { data: subscriptionSettings, isLoading } = useQuery({
  queryKey: ["subscriptionSettings"],
  queryFn: () => {
    const storedSettings = localStorage.getItem("subscriptionSettings");
    return storedSettings ? JSON.parse(storedSettings) : {};
  },
  staleTime: Infinity, // Keep settings fresh
});

// Define the structure for multiple products
type SubscriptionData = {
  [product: string]: SubscriptionSettings;
};

// Available products
const PRODUCTS = [
  "Residential",
  "Residential Mobile",
  "Datacenter",
  "Datacenter Mobile",
  "Browser",
];

const STORAGE_KEY = "subscriptionSettings"; // Key for localStorage

const SubscriptionManagement = () => {
  const queryClient = useQueryClient();

  // Load initial state from localStorage (fallback to React Query)
  const storedSettings = localStorage.getItem(STORAGE_KEY);
  let initialSubscriptionState: SubscriptionData = storedSettings
    ? JSON.parse(storedSettings)
    : queryClient.getQueryData<SubscriptionData>(["subscriptionSettings"]) || {};

  // ✅ Ensure all products have a default state (Fix for undefined issue)
  PRODUCTS.forEach((product) => {
    if (!initialSubscriptionState[product]) {
      initialSubscriptionState[product] = { hasSubscription: false, isTrial: false, isDeactivated: false };
    }
  });

  const [subscriptionSettings, setSubscriptionSettings] = useState<SubscriptionData>(initialSubscriptionState);

  // Effect: Sync state with localStorage on changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(subscriptionSettings));
    queryClient.setQueryData(["subscriptionSettings"], subscriptionSettings);
  }, [subscriptionSettings, queryClient]);

  // Toggle function for a specific product
  const toggleSetting = (product: string, key: keyof SubscriptionSettings) => {
    setSubscriptionSettings((prev) => ({
      ...prev,
      [product]: {
        ...prev[product],
        [key]: !prev[product][key],
      },
    }));
  };

  return (
    <Box>
      <Heading size="md">Subscription Management</Heading>
      <Text mt={2}>Manage subscriptions for each product.</Text>

      {PRODUCTS.map((product) => (
        <Box key={product} mt={4}>
          <Heading size="sm" mt={4}>{product}</Heading>
          <Divider my={2} />

          <VStack align="stretch" spacing={3}>
            <HStack justify="space-between">
              <Text fontWeight="bold">Subscription Active</Text>
              <Switch 
                isChecked={subscriptionSettings[product]?.hasSubscription} 
                onChange={() => toggleSetting(product, "hasSubscription")} 
              />
            </HStack>

            <HStack justify="space-between">
              <Text fontWeight="bold">Trial Mode</Text>
              <Switch 
                isChecked={subscriptionSettings[product]?.isTrial} 
                onChange={() => toggleSetting(product, "isTrial")} 
              />
            </HStack>

            <HStack justify="space-between">
              <Text fontWeight="bold">Deactivated</Text>
              <Switch 
                isChecked={subscriptionSettings[product]?.isDeactivated} 
                onChange={() => toggleSetting(product, "isDeactivated")} 
              />
            </HStack>
          </VStack>
        </Box>
      ))}

      <Button mt={6} colorScheme="blue" onClick={() => console.log("Updated Settings:", subscriptionSettings)}>
        Save Changes
      </Button>
    </Box>
  );
};

export default SubscriptionManagement;
