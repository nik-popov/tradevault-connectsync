import { createFileRoute, Link as RouterLink } from "@tanstack/react-router";
import { Container, Flex, Text, Box, Heading, Alert, AlertIcon, Grid, GridItem, Table, Tbody, Tr, Td, Badge, VStack, Link, Icon, useToast, Button, Divider } from "@chakra-ui/react";
import { useMemo, useState } from "react";
import ProtectedComponent from "../../components/Common/ProtectedComponent";
import { useQuery } from "@tanstack/react-query";
import { FaBook, FaKey, FaCreditCard, FaGlobe, FaSearch, FaTools } from 'react-icons/fa';

// --- Import the CanvasJS chart component ---
import UsageCharts from "../../components/Dashboard/UsageCharts"; // Adjust path if needed

// --- Interfaces, featureDetails, and Fetch Functions (No changes) ---
interface Subscription {
  id: string; status: string; plan_id: string | null; plan_name: string | null; product_id: string | null; product_name: string | null; current_period_start: number | null; current_period_end: number | null; trial_start: number | null; trial_end: number | null; cancel_at_period_end: boolean; enabled_features: string[];
}
interface ApiKey {
  key_preview: string; created_at: string; expires_at: string; is_active: boolean; request_count?: number;
}
const featureDetails = {
  'proxy-api': { name: 'Web Scraping API', description: 'Extract structured data from any website with our powerful and scalable scraping infrastructure.', icon: FaGlobe, path: '/web-scraping-tools/https-api' },
  'serp-api': { name: 'SERP API', description: 'Get structured JSON data from major search engines.', icon: FaSearch, path: '/web-scraping-tools/serp-api' },
};
async function fetchSubscriptions(): Promise<Subscription[]> {
  const token = localStorage.getItem("access_token");
  if (!token) throw new Error("No access token found. Please log in again.");
  const response = await fetch("https://api.thedataproxy.com/v2/customer/subscriptions", { headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` } });
  if (!response.ok) { const errorData = await response.json().catch(() => ({})); throw new Error(errorData.detail || `Failed to fetch subscriptions: ${response.status}`); }
  return response.json();
}
async function fetchBillingPortal(token: string): Promise<string> {
  const response = await fetch("https://api.thedataproxy.com/v2/customer-portal", { headers: { "Content-Type": "application/json", Accept: "application/json", Authorization: `Bearer ${token}` } });
  if (!response.ok) throw new Error(`Failed to fetch portal: ${response.status}`);
  const data = await response.json();
  if (!data.portal_url) throw new Error("No portal URL received from server.");
  return data.portal_url;
}
async function fetchApiKeys(token: string): Promise<ApiKey[]> {
  const response = await fetch("https://api.thedataproxy.com/v2/proxy/api-keys", { headers: { Accept: "application/json", Authorization: `Bearer ${token}` } });
  if (!response.ok) { if (response.status === 403 || response.status === 404) return []; throw new Error(`Failed to fetch API keys: ${response.status}`); }
  return (await response.json()).map((key: ApiKey) => ({ ...key, request_count: key.request_count ?? 0 }));
}

// --- Main Homepage Component with NEW LAYOUT ---
const HomePage = () => {
  const { data: subscriptions, isLoading: isSubscriptionsLoading, error: subscriptionsError } = useQuery({ queryKey: ["subscriptions"], queryFn: fetchSubscriptions, staleTime: 5 * 60 * 1000 });
  const token = localStorage.getItem("access_token");
  const { data: apiKeys, isLoading: isApiKeysLoading, error: apiKeysError } = useQuery({ queryKey: ["apiKeys"], queryFn: () => fetchApiKeys(token || ""), staleTime: 5 * 60 * 1000, enabled: !!token });

  const activeSubscription = subscriptions?.find((sub) => ["active", "trialing", "past_due"].includes(sub.status));
  const totalRequests = apiKeys?.reduce((sum, key) => sum + (key.request_count || 0), 0) || 0;
  const dataTransferredGB = useMemo(() => (totalRequests * 0.0005).toFixed(2), [totalRequests]);
  
  const isLoading = isSubscriptionsLoading || isApiKeysLoading;
  const error = subscriptionsError || apiKeysError;
  const [isPortalLoading, setIsPortalLoading] = useState(false);
  const toast = useToast();
  
  const handleBillingClick = async () => {
    if (!token) { toast({ title: "Authentication Required", description: "Please log in to manage billing.", status: "warning", duration: 5000, isClosable: true }); return; }
    setIsPortalLoading(true);
    try { const portalUrl = await fetchBillingPortal(token); window.location.href = portalUrl; }
    catch (error) { console.error("Error accessing customer portal:", error); toast({ title: "Error", description: "Could not open the billing portal. Please try again.", status: "error", duration: 5000, isClosable: true }); }
    finally { setIsPortalLoading(false); }
  };

  return (
    <ProtectedComponent>
      <Container maxW="full" mb={6}>
        {isLoading ? ( <Text fontSize="sm">Loading your dashboard...</Text>
        ) : error ? ( <Alert status="error"><AlertIcon /><Text fontSize="sm">Error: {error?.message || "Failed to load dashboard details."}</Text></Alert>
        ) : !activeSubscription ? ( <Alert status="error"><AlertIcon /><Text fontSize="sm">No active subscription found. Please subscribe to access your dashboard.</Text></Alert>
        ) : (
          <VStack spacing={8} align="stretch" mt={6 } pb={10}>
            {/* Row 1: Summary & Subscription Details */}
            <Grid templateColumns={{ base: "1fr", md: "1fr 1fr 1.5fr" }} gap={6}>
              <GridItem><Box shadow="md" borderWidth="1px" borderRadius="md" p={4} height="100%"><VStack align="start" spacing={3}><Heading size="sm">Total Requests</Heading><Text fontSize="4xl" fontWeight="bold">{totalRequests.toLocaleString()}</Text></VStack></Box></GridItem>
              <GridItem><Box shadow="md" borderWidth="1px" borderRadius="md" p={4} height="100%"><VStack align="start" spacing={3}><Heading size="sm">Data Transferred</Heading><Text fontSize="4xl" fontWeight="bold">{dataTransferredGB} GB</Text></VStack></Box></GridItem>
              
              {/* NEW: Combined Details Card in Top Right */}
              <GridItem>
                  <Box shadow="md" borderWidth="1px" borderRadius="md" p={4} height="200px" display="flex" flexDirection="column">
                    <Box flex="1" overflowY="auto" pr={2}>
                        <Table variant="simple" size="sm">
                            <Tbody>
                                {/* <Tr><Td fontWeight="bold">Tier Name</Td><Td>{activeSubscription?.product_name || activeSubscription?.plan_name || "N/A"}</Td></Tr> */}
                                {/* <Tr><Td fontWeight="bold">Status</Td><Td><Badge colorScheme={activeSubscription.status === "active" ? "green" : "yellow"} textTransform="capitalize">{activeSubscription?.status || "N/A"}</Badge></Td></Tr> */}
                                <Tr><Td fontWeight="bold">Current Period</Td><Td>{activeSubscription?.current_period_start && activeSubscription?.current_period_end ? `${new Date(activeSubscription.current_period_start * 1000).toLocaleDateString()} - ${new Date(activeSubscription.current_period_end * 1000).toLocaleDateString()}` : "N/A"}</Td></Tr>
                                {activeSubscription.enabled_features?.length > 0 && (
                                    <>
                                        <Tr><Td colSpan={2} fontWeight="bold" pt={4}>Active APIs</Td></Tr>
                                        {activeSubscription.enabled_features.map(feature => (
                                            <Tr key={feature}>
                                                <Td pl={8} textTransform="capitalize">{feature.replace(/-/g, ' ')}</Td>
                                                <Td textAlign="right"><Badge colorScheme="green">Active</Badge></Td>
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

            {/* Row 2: Usage Charts */}
            <UsageCharts 
                periodStart={activeSubscription.current_period_start}
                totalRequests={totalRequests}
                totalDataGB={parseFloat(dataTransferredGB)}
            />
            
            {/* Row 3: Services & Quick Links */}
             {activeSubscription.enabled_features?.length > 0 && (
              <VStack align="stretch" spacing={4} pt={4}>
                <Heading size="md">Your Services & Tools</Heading>
                <Grid templateColumns={{ base: "1fr", md: "1fr 1fr", lg: "1fr 1fr 1fr" }} gap={6}>
                  {/* Mapped Service Cards */}
                  {activeSubscription.enabled_features.map((featureSlug) => {
                    const details = featureDetails[featureSlug];
                    if (!details) return null;
                    return (
                      <GridItem key={featureSlug}><Link as={RouterLink} to={details.path} _hover={{ textDecoration: 'none' }}><Box p={5} shadow="md" borderWidth="1px" borderRadius="lg" height="100%" display="flex" flexDirection="column" transition="all 0.2s ease-in-out" _hover={{ shadow: 'xl', transform: 'translateY(-4px)' }}><Box flex="1"><Flex justifyContent="space-between" alignItems="flex-start" mb={3}><Heading size="sm" pr={4}>{details.name}</Heading><Icon as={details.icon} boxSize={8} color="orange.400" /></Flex><Text fontSize="sm" color="gray.600" minHeight={{ base: "auto", md: "60px" }}>{details.description}</Text></Box><Text mt={4} color="orange.500" fontWeight="bold" fontSize="sm" alignSelf="flex-start">Go to Service →</Text></Box></Link></GridItem>
                    );
                  })}
                  {/* NEW: Quick Links Card */}
                  <GridItem>
                    <Box p={5} shadow="md" borderWidth="1px" borderRadius="lg" height="100%" display="flex" flexDirection="column">
                        <Box flex="1">
                            <Flex justifyContent="space-between" alignItems="flex-start" mb={3}>
                                <Heading size="sm" pr={4}>Quick Links</Heading>
                                <Icon as={FaTools} boxSize={8} color="gray.400" />
                            </Flex>
                            <VStack align="start" spacing={3} mt={5}>
                                <Link as={RouterLink} to="/settings" display="flex" alignItems="center" color="orange.500" fontWeight="medium">
                                    <Icon as={FaKey} mr={2} /> Manage API Keys
                                </Link>
                                <Button 
                                    variant="link" 
                                    onClick={handleBillingClick}
                                    isLoading={isPortalLoading}
                                    leftIcon={<Icon as={FaCreditCard} />}
                                    colorScheme="orange"
                                    fontWeight="medium"
                                    justifyContent="flex-start"
                                >
                                  Billing Portal
                                </Button>
                                <Link href="https://docs.thedataproxy.com" isExternal display="flex" alignItems="center" color="orange.500" fontWeight="medium">
                                    <Icon as={FaBook} mr={2} /> Documentation
                                </Link>
                            </VStack>
                        </Box>
                    </Box>
                  </GridItem>
                </Grid>
              </VStack>
            )}
          </VStack>
        )}
      </Container>
    </ProtectedComponent>
  );
};

export const Route = createFileRoute("/_layout/")({ component: HomePage });
export default HomePage;