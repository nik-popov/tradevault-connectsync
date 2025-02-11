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

const SubscriptionManagement = ({ product }: { product: string }) => {
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

  // Ensure the selected product has a default state
  const [settings, setSettings] = useState<SubscriptionSettings>({
    hasSubscription: false,
    isTrial: false,
    isDeactivated: false,
  });

  useEffect(() => {
    if (subscriptionSettings?.[product]) {
      setSettings(subscriptionSettings[product]);
    }
  }, [subscriptionSettings, product]);

  // Sync state with localStorage and React Query
  const updateSettings = (newSettings: SubscriptionSettings) => {
    const updatedSettings = { ...subscriptionSettings, [product]: newSettings };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedSettings));
    queryClient.setQueryData(["subscriptionSettings"], updatedSettings);
    refetch(); // Ensure updates propagate
  };

  return (
    <Box>
      <Heading size="md">{product} Subscription</Heading>
      <Divider my={3} />

      <VStack align="stretch" spacing={3}>
        <HStack justify="space-between">
          <Text fontWeight="bold">Subscription Active</Text>
          <Switch
            isChecked={settings.hasSubscription}
            onChange={() =>
              updateSettings({ ...settings, hasSubscription: !settings.hasSubscription })
            }
          />
        </HStack>

        <HStack justify="space-between">
          <Text fontWeight="bold">Trial Mode</Text>
          <Switch
            isChecked={settings.isTrial}
            onChange={() => updateSettings({ ...settings, isTrial: !settings.isTrial })}
          />
        </HStack>

        <HStack justify="space-between">
          <Text fontWeight="bold">Deactivated</Text>
          <Switch
            isChecked={settings.isDeactivated}
            onChange={() =>
              updateSettings({ ...settings, isDeactivated: !settings.isDeactivated })
            }
          />
        </HStack>
      </VStack>

      <Button mt={6} colorScheme="blue" onClick={() => console.log("Updated Settings:", settings)}>
        Save Changes
      </Button>
    </Box>
  );
};

export default SubscriptionManagement;
