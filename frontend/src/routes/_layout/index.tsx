import { createFileRoute, Link as RouterLink } from "@tanstack/react-router";
import { Container, Flex, Text, Box, Heading, Alert, AlertIcon, Grid, GridItem, Table, Tbody, Tr, Td, Badge, VStack, Link, Icon, useToast, Button } from "@chakra-ui/react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useMemo, useState } from "react";
import ProtectedComponent from "../../components/Common/ProtectedComponent";
import { useQuery } from "@tanstack/react-query";
// Add new icons for the feature cards
import { FaBook, FaKey, FaCreditCard, FaGlobe, FaSearch, FaSitemap } from 'react-icons/fa';

import { FiShield, FiUserCheck } from 'react-icons/fi';




// --- Interfaces (UPDATED) ---
interface Subscription {
  id: string;
  status: string;
  plan_id: string | null;
  plan_name: string | null;
  product_id: string | null;
  product_name: string | null;
  current_period_start: number | null;
  current_period_end: number | null;
  trial_start: number | null;
  trial_end: number | null;
  cancel_at_period_end: boolean;
  enabled_features: string[];
}

interface ApiKey {
  key_preview: string;
  created_at: string;
  expires_at: string;
  is_active: boolean;
  request_count?: number;
}

const featureDetails = {
  // --- Existing Features ---
  'proxy-api': {
    name: 'Web Scraping API',
    description: 'Extract structured data from any website with our powerful and scalable scraping infrastructure.',
    icon: FaGlobe,
    path: '/web-scraping-tools/https-api'
  },
  'serp-api': {
    name: 'SERP API',
    description: 'Get structured JSON data from major search engines.',
    icon: FaSearch, // Using the original FaSearch icon
    path: '/web-scraping-tools/serp-api'
  },
};
// --- Fetch Functions (No changes needed here) ---
async function fetchSubscriptions(): Promise<Subscription[]> {
  const token = localStorage.getItem("access_token");
  if (!token) {
    throw new Error("No access token found. Please log in again.");
  }

  try {
    // This endpoint now returns `enabled_features`
    const response = await fetch("https://api.thedataproxy.com/v2/customer/subscriptions", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.detail || `Failed to fetch subscriptions: ${response.status}`
      );
    }

    return response.json();
  } catch (error) {
    console.error("Subscriptions fetch error:", error);
    throw error;
  }
}
// --- NEW HELPER FUNCTION TO FETCH PORTAL URL ---
async function fetchBillingPortal(token: string): Promise<string> {
  const response = await fetch("https://api.thedataproxy.com/v2/customer-portal", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      "Authorization": `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch portal: ${response.status}`);
  }

  const data = await response.json();
  if (!data.portal_url) {
    throw new Error("No portal URL received from server.");
  }

  return data.portal_url;
};
async function fetchApiKeys(token: string): Promise<ApiKey[]> {
  try {
    const response = await fetch("https://api.thedataproxy.com/v2/proxy/api-keys", {
      method: "GET",
      headers: {
        "Accept": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      if (response.status === 403 || response.status === 404) {
          return [];
      }
      throw new Error(`Failed to fetch API keys: ${response.status}`);
    }
    const data: ApiKey[] = await response.json();
    return data.map((key) => ({ ...key, request_count: key.request_count ?? 0 }));
  } catch (error) {
    console.error("API keys fetch error:", error);
    throw error;
  }
}

// --- Chart Data Generation (No changes needed here) ---
const generateChartDataForPeriod = (startTimestamp: number | null, totalValue: number) => {
  if (!startTimestamp || !totalValue || totalValue <= 0) {
    return [{ date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), Requests: 0 }];
  }
  const startDate = new Date(startTimestamp * 1000);
  const today = new Date();
  today.setHours(23, 59, 59, 999);
  if (startDate > today) {
    return [{ date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), Requests: 0 }];
  }
  const datePoints: Date[] = [];
  for (let d = new Date(startDate); d <= today; d.setDate(d.getDate() + 1)) {
    datePoints.push(new Date(d));
  }
  if (datePoints.length === 0) return [{ date: 'No Data', Requests: 0 }];
  if (datePoints.length === 1) {
    const dateStr = datePoints[0].toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    return [{ date: dateStr, Requests: totalValue }];
  }
  const weights = datePoints.map(() => Math.random());
  const totalWeight = weights.reduce((sum, w) => sum + w, 0);
  let runningTotal = 0;
  const data = weights.map((weight, i) => {
    const isLast = i === weights.length - 1;
    let requests;
    if (isLast) {
      requests = totalValue - runningTotal;
    } else {
      requests = Math.round((weight / totalWeight) * totalValue);
      runningTotal += requests;
    }
    return {
      date: datePoints[i].toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      Requests: requests >= 0 ? requests : 0,
    };
  });
  return data;
};

// --- Main Homepage Component (UPDATED) ---
const HomePage = () => {
  const { data: subscriptions, isLoading: isSubscriptionsLoading, error: subscriptionsError } = useQuery({
    queryKey: ["subscriptions"],
    queryFn: fetchSubscriptions,
    staleTime: 5 * 60 * 1000,
  });
  
  const token = localStorage.getItem("access_token");
  const { data: apiKeys, isLoading: isApiKeysLoading, error: apiKeysError } = useQuery({
    queryKey: ["apiKeys"],
    queryFn: () => fetchApiKeys(token || ""),
    staleTime: 5 * 60 * 1000,
    enabled: !!token,
  });

  const activeSubscription = subscriptions?.find(
    (sub) => ["active", "trialing", "past_due"].includes(sub.status)
  );

  const totalRequests = apiKeys?.reduce((sum, key) => sum + (key.request_count || 0), 0) || 0;
  
  const dataTransferredGB = useMemo(() => {
    return (totalRequests * 0.0005).toFixed(2);
  }, [totalRequests]);

  const chartData = useMemo(() => {
    return generateChartDataForPeriod(activeSubscription?.current_period_start || null, totalRequests);
  }, [activeSubscription?.current_period_start, totalRequests]);

  const isLoading = isSubscriptionsLoading || isApiKeysLoading;
  const error = subscriptionsError || apiKeysError;
  
  // --- NEW STATE AND HANDLER FOR BILLING PORTAL ---
  const [isPortalLoading, setIsPortalLoading] = useState(false);
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

    setIsPortalLoading(true);
    try {
        const portalUrl = await fetchBillingPortal(token);
        window.location.href = portalUrl;
    } catch (error) {
        console.error("Error accessing customer portal:", error);
        toast({
            title: "Error",
            description: "Could not open the billing portal. Please try again.",
            status: "error",
            duration: 5000,
            isClosable: true,
        });
    } finally {
        setIsPortalLoading(false);
    }
  };


  return (
    <ProtectedComponent>
      <Container maxW="full">
        <Flex align="center" justify="space-between" py={6} gap={4}>
        </Flex>
        {isLoading ? (
          <Text fontSize="sm">Loading your dashboard...</Text>
        ) : error ? (
          <Alert status="error">
            <AlertIcon />
            <Text fontSize="sm">
              Error: {error?.message || "Failed to load dashboard details. Please try again later."}
            </Text>
          </Alert>
        ) : !activeSubscription ? (
          <Alert status="error">
            <AlertIcon />
            <Text fontSize="sm">No active subscription found. Please subscribe to access your dashboard.</Text>
          </Alert>
        ) : (
          <VStack spacing={6} align="stretch">
            {/* === Bottom Row: Summary Cards (UPDATED FOR CONSISTENT TITLES) === */}
            <Grid templateColumns={{ base: "1fr", md: "1fr 1fr 1fr" }} gap={6}> 
              {/* Total Requests Card */}
              <GridItem>
                <Box shadow="md" borderWidth="1px" borderRadius="md" p={4} height="100%">
                    <VStack align="start" spacing={3}>
                        <Heading size="sm">Total Requests</Heading>
                        <Text fontSize="4xl" fontWeight="bold">{totalRequests.toLocaleString()}</Text>
                    </VStack>
                </Box>
              </GridItem>
              {/* Data Transferred Card */}
              <GridItem>
                <Box shadow="md" borderWidth="1px" borderRadius="md" p={4} height="100%">
                    <VStack align="start" spacing={3}>
                        <Heading size="sm">Data Transferred</Heading>
                        <Text fontSize="4xl" fontWeight="bold">{dataTransferredGB} GB</Text>
                    </VStack>
                </Box>
              </GridItem>
              {/* Quick Start Card */}
              <GridItem>
                <Box shadow="md" borderWidth="1px" borderRadius="md" p={4} height="100%">
                  <VStack align="start" spacing={3}>
                    <Heading size="sm">Quick Start</Heading>
                    <Link as={RouterLink} to="/settings" display="flex" alignItems="center" color="orange.400">
                      <Icon as={FaKey} mr={2} /> Manage API Keys
                    </Link>
                    <Link href="https://docs.thedataproxy.com" isExternal display="flex" alignItems="center">
                      <Icon as={FaBook} mr={2} /> API Documentation
                    </Link>
                    {/* --- UPDATED BILLING PORTAL LINK --- */}
                    <Button 
                        variant="link" 
                        onClick={handleBillingClick}
                        isLoading={isPortalLoading}
                        leftIcon={<Icon as={FaCreditCard} />}
                        colorScheme="black"
                        fontWeight="normal"
                        justifyContent="flex-start"
                        _hover={{textDecoration: "underline"}}
                    >
                      Billing Portal
                    </Button>
                  </VStack>
                </Box>
              </GridItem>
            </Grid>

            {/* === Plan Details & Usage Chart === */}
            <Grid templateColumns={{ base: "1fr", lg: "2.1fr 1fr" }} gap={6}>
              <GridItem>
                {/* Request Usage Card */}
                <Box shadow="md" borderWidth="1px" borderRadius="md" p={4} height="350px" display="flex" flexDirection="column">
                  <Heading size="sm" mb={4}>Request Usage</Heading>
                  <Box flex="1" minHeight="0"> {/* Wrapper for ResponsiveContainer */}
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" fontSize="12px" angle={-20} textAnchor="end" height={40}/>
                        <YAxis fontSize="12px" tickFormatter={(value) => typeof value === 'number' ? new Intl.NumberFormat('en-US', { notation: 'compact', compactDisplay: 'short' }).format(value) : value} />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="Requests" stroke="#3182CE" activeDot={{ r: 8 }} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </Box>
                </Box>
              </GridItem>
              <GridItem>
                {/* Plan Details Card */}
                <Box shadow="md" borderWidth="1px" borderRadius="md" p={4} height="350px" display="flex" flexDirection="column">
                  <Heading size="sn" mb={4}>Plan Details</Heading>
                  <Box flex="1" overflow="auto"> {/* Wrapper to make only the table scrollable */}
                    <Table variant="simple" size="sm">
                      <Tbody>
                        <Tr>
                          <Td fontWeight="bold">Tier Name</Td>
                          <Td>{activeSubscription?.product_name || activeSubscription?.plan_name || "N/A"}</Td>
                        </Tr>
                        <Tr>
                          <Td fontWeight="bold">Status</Td>
                          <Td textTransform="capitalize">{activeSubscription?.status || "N/A"}</Td>
                        </Tr>
                        <Tr>
                          <Td fontWeight="bold">Current Period</Td>
                          <Td>
                            {activeSubscription?.current_period_start && activeSubscription?.current_period_end
                              ? `${new Date(activeSubscription.current_period_start * 1000).toLocaleDateString()} - ${new Date(activeSubscription.current_period_end * 1000).toLocaleDateString()}`
                              : "N/A"}
                          </Td>
                        </Tr>
                      {/* --- Dynamically list enabled features --- */}
                    {activeSubscription.enabled_features && activeSubscription.enabled_features.length > 0 && (
                      <>
                        <Tr>
                          <Td colSpan={2} fontWeight="bold" pt={4}>Enabled Features</Td>
                        </Tr>
                        {activeSubscription.enabled_features.map(feature => (
                          <Tr key={feature}>
                            <Td pl={8} textTransform="capitalize">{feature.replace(/-/g, ' ')}</Td>
                            <Td><Badge colorScheme="green">Active</Badge></Td>
                          </Tr>
                        ))}
                      </>
                    )}
                      </Tbody>
                    </Table>
                  </Box>
                </Box>
              </GridItem>
            </Grid>
             {activeSubscription.enabled_features && activeSubscription.enabled_features.length > 0 && (
              <VStack align="stretch" spacing={4} pt={4}>
                <Heading size="md"> Enabled Services</Heading>
                <Grid templateColumns={{ base: "1fr", md: "1fr 1fr", lg: "1fr 1fr 1fr" }} gap={6}>
                  {activeSubscription.enabled_features.map((featureSlug) => {
                    const details = featureDetails[featureSlug];
                    if (!details) return null; // Safely skip if feature isn't in our details object

                    return (
                      <GridItem key={featureSlug}>
                        <Link as={RouterLink} to={details.path} _hover={{ textDecoration: 'none' }}>
                          <Box
                            p={5}
                            shadow="md"
                            borderWidth="1px"
                            borderRadius="lg"
                            height="100%"
                            display="flex"
                            flexDirection="column"
                            transition="all 0.2s ease-in-out"
                            _hover={{ shadow: 'xl', transform: 'translateY(-4px)' }}
                          >
                            <VStack align="start" spacing={3}>
                                <Icon as={details.icon} boxSize={8} color="orange.400" />
                                <Heading size="sm">{details.name}</Heading>
                                <Text fontSize="sm" color="gray.600" minHeight={{ base: "auto", md: "60px" }}>
                                {details.description}
                                </Text>
                            </VStack>
                            <Text mt={4} color="orange.500" fontWeight="bold" fontSize="sm" alignSelf="flex-start">
                              Go to Service →
                            </Text>
                          </Box>
                        </Link>
                      </GridItem>
                    );
                  })}
                </Grid>
              </VStack>
            )}
            
          </VStack>
        )}
      </Container>
    </ProtectedComponent>
  );
};


// --- Route Definition ---
export const Route = createFileRoute("/_layout/")({
  component: HomePage,
});

export default HomePage;