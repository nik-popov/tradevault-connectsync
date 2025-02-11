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

// Define product categories
const PRODUCTS = ["proxy", "serp", "data"] as const;
type ProductType = (typeof PRODUCTS)[number];

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

  // Store subscription settings locally for UI updates
  const [settings, setSettings] = useState<Record<ProductType, SubscriptionSettings>>(() =>
    PRODUCTS.reduce((acc, product) => {
      acc[product] = subscriptionSettings?.[product] || {
        hasSubscription: false,
        isTrial: false,
        isDeactivated: false,
      };
      return acc;
    }, {} as Record<ProductType, SubscriptionSettings>)
  );

  // Sync React Query Data into State
  useEffect(() => {
    setSettings((prevSettings) =>
      PRODUCTS.reduce((acc, product) => {
        acc[product] = subscriptionSettings?.[product] || prevSettings[product];
        return acc;
      }, {} as Record<ProductType, SubscriptionSettings>)
    );
  }, [subscriptionSettings]);

  // Update settings locally and sync with localStorage & React Query
  const updateSettings = (product: ProductType, newSettings: SubscriptionSettings) => {
    const updatedSettings = { ...subscriptionSettings, [product]: newSettings };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedSettings));
    queryClient.setQueryData(["subscriptionSettings"], updatedSettings);
    refetch(); // Ensure UI updates reflect instantly
  };

  return (
    <Box borderWidth="1px" borderRadius="lg" p={5} w="100%">
      <Heading size="md" mb={4}>
        Subscription Management
      </Heading>
      <VStack align="stretch" spacing={6}>
        {PRODUCTS.map((product, index) => (
          <Box key={product} p={4} borderWidth="1px" borderRadius="md">
            <Heading size="sm" mb={2}>
              {product} Subscription
            </Heading>
            <Divider my={2} />

            <VStack align="stretch" spacing={3}>
              <HStack justify="space-between">
                <Text fontWeight="bold">Subscription Active</Text>
                <Switch
                  isChecked={settings[product].hasSubscription}
                  onChange={() =>
                    updateSettings(product, {
                      ...settings[product],
                      hasSubscription: !settings[product].hasSubscription,
                    })
                  }
                />
              </HStack>

              <HStack justify="space-between">
                <Text fontWeight="bold">Trial Mode</Text>
                <Switch
                  isChecked={settings[product].isTrial}
                  onChange={() =>
                    updateSettings(product, {
                      ...settings[product],
                      isTrial: !settings[product].isTrial,
                    })
                  }
                />
              </HStack>

              <HStack justify="space-between">
                <Text fontWeight="bold">Deactivated</Text>
                <Switch
                  isChecked={settings[product].isDeactivated}
                  onChange={() =>
                    updateSettings(product, {
                      ...settings[product],
                      isDeactivated: !settings[product].isDeactivated,
                    })
                  }
                />
              </HStack>
            </VStack>

            {index !== PRODUCTS.length - 1 && <Divider my={4} />}
          </Box>
        ))}
      </VStack>

      <Button mt={6} colorScheme="blue" w="full" onClick={() => console.log("Updated Settings:", settings)}>
        Save Changes
      </Button>
    </Box>
  );
};

export default SubscriptionManagement;
