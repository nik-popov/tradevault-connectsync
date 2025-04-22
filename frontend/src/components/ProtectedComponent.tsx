// src/components/ProtectedComponent.tsx
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { Text, VStack, Button, Flex } from "@chakra-ui/react";
import PromoSERP from "./ComingSoon"; // Adjust the import path as needed

interface SubscriptionStatus {
  hasSubscription: boolean;
  isTrial: boolean;
  isDeactivated: boolean;
}

async function fetchSubscriptionStatus(): Promise<SubscriptionStatus> {
  const token = localStorage.getItem("access_token");
  const response = await fetch(
    "https://api.thedataproxy.com/v2/subscription-status/serp",
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    }
  );
  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      throw new Error("Unauthorized: Please log in again.");
    }
    throw new Error(`Failed to fetch tools: ${response.status}`);
  }
  return response.json();
}

const ProtectedComponent: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();

  const { data: subscriptionStatus, isLoading, error } = useQuery({
    queryKey: ["subscriptionStatus", "serp"],
    queryFn: fetchSubscriptionStatus,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    retry: (failureCount, error) => {
      if (error.message.includes("Unauthorized")) return false;
      return failureCount < 3;
    },
  });

  // Loading state
  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  // Error state (e.g., unauthorized or server error)
  if (error) {
    return (
      <VStack spacing={4}>
        <Text color="red.500">
          {error.message === "Unauthorized: Please log in again."
            ? "Session expired. Please log in again."
            : "Error loading status. Please try again later."}
        </Text>
        {error.message.includes("Unauthorized") && (
          <Button colorScheme="blue" onClick={() => navigate({ to: "/login" })}>
            Log In
          </Button>
        )}
      </VStack>
    );
  }

  // Extract subscription details with fallback values
  const { hasSubscription, isTrial, isDeactivated } = subscriptionStatus || {
    hasSubscription: false,
    isTrial: false,
    isDeactivated: false,
  };

  const isLocked = !hasSubscription && !isTrial; // No subscription or trial
  const isFullyDeactivated = isDeactivated && !hasSubscription; // Deactivated without subscription

  // No access: show promotional content
  if (isLocked) {
    return <PromoSERP />;
  }

  // Deactivated tools: prompt to reactivate
  if (isFullyDeactivated) {
    return (
      <Flex
        justify="space-between"
        align="center"
        w="full"
        p={4}
        bg="red.50"
        borderRadius="md"
      >
        <Text color="gray.800">Your tools have been deactivated.</Text>
        <Button
          colorScheme="red"
          onClick={() => navigate({ to: "/proxies/pricing" })}
        >
          Reactivate Now
        </Button>
      </Flex>
    );
  }

  // User has access: render the protected content
  return <>{children}</>;
};

export default ProtectedComponent;