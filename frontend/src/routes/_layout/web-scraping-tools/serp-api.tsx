import { createFileRoute } from "@tanstack/react-router";
import { Container, Flex, Text, Tabs, TabList, TabPanels, Tab, TabPanel, Box, Heading, Alert, AlertIcon, Grid, GridItem, Table, Tbody, Tr, Td, VStack, FormControl, FormLabel, Input, Select, Switch, Button, useToast, Code } from "@chakra-ui/react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useMemo, useState } from "react";
import ProtectedComponent from "../../../components/Common/ProtectedComponent";
import PlaygroundSerpApi from "../../../components/ScrapingTools/PlaygroundSerp";
import ApiKeyHttps from "../../../components/ScrapingTools/ApiKeyHttps";

import { useQuery } from "@tanstack/react-query";
import {
  Textarea,
  Spinner,
  IconButton,
  Link,
} from "@chakra-ui/react";
import { ExternalLinkIcon, CopyIcon, DownloadIcon } from "@chakra-ui/icons";
import { FiSend } from "react-icons/fi";
// --- Data Fetching ---
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
}

interface ProxyApiAccess {
  has_access: boolean;
  message: string | null;
}

interface ApiKey {
  key_preview: string;
  created_at: string;
  expires_at: string;
  is_active: boolean;
  request_count?: number;
}

const API_URL = "https://api.thedataproxy.com/v2/proxy";

async function fetchSubscriptions(): Promise<Subscription[]> {
  const token = localStorage.getItem("access_token");
  if (!token) throw new Error("No access token found. Please log in again.");
  const response = await fetch("https://api.thedataproxy.com/v2/customer/subscriptions", {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `Failed to fetch subscriptions: ${response.status}`);
  }
  return response.json();
}

async function fetchProxyApiAccess(): Promise<ProxyApiAccess> {
  const token = localStorage.getItem("access_token");
  if (!token) throw new Error("No access token found. Please log in again.");
  const response = await fetch("https://api.thedataproxy.com/v2/proxy-api/access", {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `Failed to check API access: ${response.status}`);
  }
  return response.json();
}

async function fetchApiKeys(token: string): Promise<ApiKey[]> {
  const response = await fetch(`${API_URL}/api-keys`, {
    headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error(`Failed to fetch API keys: ${response.status}`);
  const data: ApiKey[] = await response.json();
  return data.map((key) => ({
    ...key,
    request_count: key.request_count ?? 0,
    created_at: key.created_at || new Date().toISOString(),
    expires_at: key.expires_at || new Date().toISOString(),
    is_active: key.is_active ?? false,
    key_preview: key.key_preview || "N/A",
  }));
}

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
        let requests = isLast ? totalValue - runningTotal : Math.round((weight / totalWeight) * totalValue);
        if(!isLast) runningTotal += requests;
        return {
            date: datePoints[i].toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            Requests: requests >= 0 ? requests : 0,
        };
    });
    return data;
};

// Define an interface for our structured result
interface SerpResult {
    position: number;
    title: string;
    link: string;
    snippet: string;
}

// --- SERP API Playground Component ---


// --- Main SERP API Page Component ---
const SerpApiPage = () => {
    const { data: subscriptions, isLoading: isSubscriptionsLoading, error: subscriptionsError } = useQuery({ queryKey: ["subscriptions"], queryFn: fetchSubscriptions, staleTime: 300000 });
    const { data: proxyApiAccess, isLoading: isAccessLoading, error: accessError } = useQuery({ queryKey: ["proxyApiAccess"], queryFn: fetchProxyApiAccess, staleTime: 300000 });
    const token = localStorage.getItem("access_token");
    const { data: apiKeys, isLoading: isApiKeysLoading, error: apiKeysError } = useQuery({ queryKey: ["apiKeys"], queryFn: () => fetchApiKeys(token || ""), staleTime: 300000, enabled: !!token });

    const totalRequests = apiKeys?.reduce((sum, key) => sum + (key.request_count || 0), 0) || 0;
    const hasActiveSubscription = subscriptions?.some((sub) => ["active", "trialing"].includes(sub.status)) || false;
    const activeSubscription = subscriptions?.find((sub) => ["active", "trialing"].includes(sub.status));

    const chartData = useMemo(() => {
        return generateChartDataForPeriod(activeSubscription?.current_period_start || null, totalRequests);
    }, [activeSubscription?.current_period_start, totalRequests]);

    const TabsConfig = [
        {
            title: "Overview",
            component: () => (
                <Box>
                  <Box borderWidth="1px" borderRadius="md" p={4} mb={4}>
                    <Flex align="baseline" gap={2}>
                      <Text fontSize="sm">Total Requests:</Text>
                      <Heading size="sm">{totalRequests.toLocaleString()}</Heading>
                    </Flex>
                  </Box>
                  <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={6}>
                    <GridItem>
                      <Heading size="md" mb={4}>Tier Details</Heading>
                      <Box shadow="md" borderWidth="1px" borderRadius="md" overflow="auto" height="350px">
                        <Table variant="simple" size="sm">
                          <Tbody>
                            <Tr><Td><Text fontSize="sm">Plan Name</Text></Td><Td><Text fontSize="sm">{activeSubscription?.product_name || "N/A"}</Text></Td></Tr>
                            <Tr><Td><Text fontSize="sm">Status</Text></Td><Td><Text fontSize="sm">{activeSubscription?.status ? activeSubscription.status.charAt(0).toUpperCase() + activeSubscription.status.slice(1) : "N/A"}</Text></Td></Tr>
                            <Tr><Td><Text fontSize="sm">Period Start</Text></Td><Td><Text fontSize="sm">{activeSubscription?.current_period_start ? new Date(activeSubscription.current_period_start * 1000).toLocaleString() : "N/A"}</Text></Td></Tr>
                            <Tr><Td><Text fontSize="sm">Period End</Text></Td><Td><Text fontSize="sm">{activeSubscription?.current_period_end ? new Date(activeSubscription.current_period_end * 1000).toLocaleString() : "N/A"}</Text></Td></Tr>
                            <Tr><Td><Text fontSize="sm">Total Requests</Text></Td><Td><Text fontSize="sm">{totalRequests.toLocaleString()}</Text></Td></Tr>
                            <Tr><Td><Text fontSize="sm">Active API Keys</Text></Td><Td><Text fontSize="sm">{apiKeys?.filter(key => key.is_active).length || 0}</Text></Td></Tr>
                          </Tbody>
                        </Table>
                      </Box>
                    </GridItem>
                    <GridItem>
                      <Heading size="md" mb={4}>Request Usage</Heading>
                      <Box shadow="md" borderWidth="1px" borderRadius="md" p={4} height="350px">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" fontSize="12px" angle={-20} textAnchor="end" height={40}/>
                            <YAxis fontSize="12px" tickFormatter={(value) => typeof value === 'number' ? new Intl.NumberFormat('en-US', { notation: 'compact', compactDisplay: 'short' }).format(value) : value}/>
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="Requests" stroke="#3182CE" activeDot={{ r: 8 }} dot={false} />
                          </LineChart>
                        </ResponsiveContainer>
                      </Box>
                    </GridItem>
                  </Grid>
                </Box>
            ),
        },
        {
            title: "API Keys",
            component: () => <ApiKeyHttps token={token} />,
        },
        {
            title: "Playground",
            component: () => <PlaygroundSerpApi />,
        },
    ];

    return (
        <ProtectedComponent>
            <Container maxW="full">
                <Flex align="center" justify="space-between" py={6} gap={4}>
                    <Heading size="md">SERP API</Heading>
                </Flex>
                {isSubscriptionsLoading || isAccessLoading || isApiKeysLoading ? (
                    <Text fontSize="sm">Loading user details...</Text>
                ) : subscriptionsError || accessError || apiKeysError ? (
                    <Alert status="error">
                        <AlertIcon />
                        <Text fontSize="sm">Error: {(subscriptionsError?.message || accessError?.message || apiKeysError?.message) || "Failed to load details."}</Text>
                    </Alert>
                ) : !hasActiveSubscription ? (
                    <Alert status="error">
                        <AlertIcon />
                        <Text fontSize="sm">No active SERP API products associated with your account.</Text>
                    </Alert>
                ) : (
                    <>
                        {!proxyApiAccess?.has_access && (
                            <Alert status="warning" mb={4}>
                                <AlertIcon />
                                <Text fontSize="sm">{proxyApiAccess?.message || "Your account may not include SERP API features. Please check your plan details."}</Text>
                            </Alert>
                        )}
                        <Tabs>
                            <TabList>
                                {TabsConfig.map((tab, index) => <Tab key={index} fontSize="sm">{tab.title}</Tab>)}
                            </TabList>
                            <TabPanels>
                                {TabsConfig.map((tab, index) => <TabPanel key={index} p={6}>{tab.component()}</TabPanel>)}
                            </TabPanels>
                        </Tabs>
                    </>
                )}
            </Container>
        </ProtectedComponent>
    );
};

// --- Route Definition ---
export const Route = createFileRoute("/_layout/web-scraping-tools/serp-api")({
    component: SerpApiPage,
});

export default SerpApiPage;