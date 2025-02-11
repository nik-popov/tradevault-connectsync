import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Switch,
  Button,
  Divider,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useQueryClient, useQuery } from "@tanstack/react-query";

// Define the shape of subscription settings per product
type SubscriptionSettings = {
  hasSubscription: boolean;
  isTrial: boolean;
  isDeactivated: boolean;
};

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

  // Load subscription settings with React Query
  const { data: subscriptionSettings, refetch } = useQuery({
    queryKey: ["subscriptionSettings"],
    queryFn: () => {
      const storedSettings = localStorage.getItem(STORAGE_KEY);
      return storedSettings ? JSON.parse(storedSettings) : {};
    },
    staleTime: Infinity,
  });

  // Ensure all products have a default state
  const [settings, setSettings] = useState<SubscriptionData>({});

  useEffect(() => {
    const newSettings: SubscriptionData = PRODUCTS.reduce((acc, product) => {
      acc[product] = subscriptionSettings?.[product] || {
        hasSubscription: false,
        isTrial: false,
        isDeactivated: false,
      };
      return acc;
    }, {} as SubscriptionData);

    setSettings(newSettings);
  }, [subscriptionSettings]);

  // Sync state with localStorage and React Query
  const updateSettings = (newSettings: SubscriptionData) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newSettings));
    queryClient.setQueryData(["subscriptionSettings"], newSettings);
    refetch(); // Ensure updates propagate
  };

  // Toggle a setting for a specific product
  const toggleSetting = (product: string, key: keyof SubscriptionSettings) => {
    const newSettings = {
      ...settings,
      [product]: {
        ...settings[product],
        [key]: !settings[product][key],
      },
    };
    setSettings(newSettings);
    updateSettings(newSettings);
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
                isChecked={settings[product]?.hasSubscription}
                onChange={() => toggleSetting(product, "hasSubscription")}
              />
            </HStack>

            <HStack justify="space-between">
              <Text fontWeight="bold">Trial Mode</Text>
              <Switch
                isChecked={settings[product]?.isTrial}
                onChange={() => toggleSetting(product, "isTrial")}
              />
            </HStack>

            <HStack justify="space-between">
              <Text fontWeight="bold">Deactivated</Text>
              <Switch
                isChecked={settings[product]?.isDeactivated}
                onChange={() => toggleSetting(product, "isDeactivated")}
              />
            </HStack>
          </VStack>
        </Box>
      ))}

      <Button mt={6} colorScheme="blue" onClick={() => console.log("Updated Settings:", settings)}>
        Save Changes
      </Button>
    </Box>
  );
};

export default SubscriptionManagement;
