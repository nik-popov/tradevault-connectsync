import React, { useState } from "react";
import {
  Box,
  Flex,
  Text,
  Button,
  VStack,
  Divider,
  useToast,
} from "@chakra-ui/react";

// The fetchBillingPortal helper function remains the same
const fetchBillingPortal = async (token: string) => {
  const response = await fetch("https://api.thedataproxy.com/v2/customer-portal", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      "Authorization": `Bearer ${token}`,
    },
  });
  if (!response.ok) throw new Error(`Failed to fetch portal: ${response.status}`);
  const data = await response.json();
  if (!data.portal_url) throw new Error("No portal URL received");
  return data.portal_url;
};


const BillingTab = () => {
  const [token] = useState<string | null>(localStorage.getItem("access_token"));
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const handleBillingClick = async () => {
    if (!token) {
      toast({
        title: "Authentication Required",
        description: "Please log in to manage billing.",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    setIsLoading(true);
    try {
      const portalUrl = await fetchBillingPortal(token);
      window.location.href = portalUrl;
    } catch (error) {
      console.error("Error accessing customer portal:", error);
      toast({
        title: "Error",
        description: "Failed to access billing portal. Please try again later.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <VStack spacing={4} align="stretch">
      <Flex justify="space-between" align="center">
        {/* Left Side: Text Content */}
        <Box>
          <Text fontSize="lg" color="gray.700">
            Manage your subscriptions, view invoices, and update your payment method.
          </Text>
        </Box>

        {/* Right Side: Button */}
        <Box>
          <Button
            colorScheme="blue"
            onClick={handleBillingClick}
            isLoading={isLoading}
            isDisabled={!token}
          >
            Manage Billing
          </Button>
        </Box>
      </Flex>

      {/* Divider below the content */}
      <Divider />
    </VStack>
  );
};