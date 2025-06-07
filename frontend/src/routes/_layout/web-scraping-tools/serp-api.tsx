import { createFileRoute } from "@tanstack/react-router";
import { Container, Flex, Text, Tabs, TabList, TabPanels, Tab, TabPanel, Box, Heading, Alert, AlertIcon, Grid, GridItem, Table, Tbody, Tr, Td, VStack, FormControl, FormLabel, Input, Select, Switch, Button, useToast, Code } from "@chakra-ui/react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useMemo, useState } from "react";
import ProtectedComponent from "../../../components/Common/ProtectedComponent";
import ApiKeyGSerp from "../../../components/ScrapingTools/ApiKeyGSerp"; // Re-using the existing API Key component
import { useQuery } from "@tanstack/react-query";

// --- Data Fetching (Re-used from original component) ---
// These interfaces and functions are assumed to be applicable to the SERP API product as well.

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
    // This helper function is re-used without changes.
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

/// --- NEW: SERP API Playground Component (Updated for Proxy Demo) ---
const PlaygroundSerpApi = () => {
    const [apiKey, setApiKey] = useState('');
    const [query, setQuery] = useState('best pizza in new york');
    const [engine, setEngine] = useState('google');
    const [location, setLocation] = useState('New York,United States');
    const [includeImages, setIncludeImages] = useState(false);
    
    const [isLoading, setIsLoading] = useState(false);
    const [response, setResponse] = useState<string | null>(null); // Response will now be raw HTML string
    const [error, setError] = useState<string | null>(null);
    const toast = useToast();

    // This is your EXISTING proxy endpoint. We will use it to simulate the SERP call.
    const PROXY_API_ENDPOINT = "https://api.thedataproxy.com/v2/proxy";

    // Helper to build the real search engine URL that the proxy will visit
    const buildSearchEngineUrl = () => {
        const encodedQuery = encodeURIComponent(query);
        switch (engine) {
            case 'bing':
                return `https://www.bing.com/search?q=${encodedQuery}`;
            case 'duckduckgo':
                return `https://duckduckgo.com/?q=${encodedQuery}`;
            case 'google':
            default:
                return `https://www.google.com/search?q=${encodedQuery}`;
        }
    };

    const handleSubmit = async () => {
        if (!apiKey) {
            toast({
                title: "API Key Required",
                description: "Please enter your API key to test the proxy. You can create one in the 'API Keys' tab.",
                status: "warning",
                duration: 5000,
                isClosable: true,
            });
            return;
        }

        setIsLoading(true);
        setResponse(null);
        setError(null);
        
        const targetUrl = buildSearchEngineUrl();
        const requestBody = {
            url: targetUrl,
            method: 'GET',
        };

        try {
            // We call the PROXY endpoint, not a SERP endpoint
            const res = await fetch(PROXY_API_ENDPOINT, {
                method: 'POST',
                headers: { 
                    'x-api-key': apiKey,
                    'Content-Type': 'application/json',
                    'Accept': 'text/html', // We expect HTML back from the proxy
                },
                body: JSON.stringify(requestBody),
            });

            // For a proxy, the response might be JSON (if an error) or raw text/html
            if (!res.ok) {
                const errorData = await res.json().catch(() => ({ detail: `HTTP error! Status: ${res.status}` }));
                throw new Error(errorData.detail || `An unknown error occurred.`);
            }

            const htmlResponse = await res.text(); // Get the raw HTML from the response
            setResponse(htmlResponse);

        } catch (e: any) {
            setError(e.message);
        } finally {
            setIsLoading(false);
        }
    };

    // Code snippets are updated to reflect the POST call to the proxy endpoint
    const codeSnippets = useMemo(() => {
        const targetUrl = buildSearchEngineUrl();
        const safeApiKey = 'YOUR_API_KEY';
        
        const curl = `curl -X POST "${PROXY_API_ENDPOINT}" \\\n` +
            `  -H "Content-Type: application/json" \\\n` +
            `  -H "x-api-key: ${safeApiKey}" \\\n` +
            `  -d '{\n` +
            `    "url": "${targetUrl}",\n` +
            `    "method": "GET"\n` +
            `  }'`;

        const python = `import requests\n\n` +
            `proxy_url = "${PROXY_API_ENDPOINT}"\n` +
            `api_key = "${safeApiKey}"\n\n` +
            `payload = {\n` +
            `    "url": "${targetUrl}",\n` +
            `    "method": "GET"\n` +
            `    # For your future SERP API, you'll use params like:\n` +
            `    # "query": "${query}", "engine": "${engine}"\n` +
            `}\n\n` +
            `headers = {\n` +
            `    "Content-Type": "application/json",\n` +
            `    "x-api-key": api_key\n` +
            `}\n\n` +
            `response = requests.post(proxy_url, headers=headers, json=payload)\n\n` +
            `print(response.text) # Prints the raw HTML`;
        
        const javascript = `const proxyUrl = '${PROXY_API_ENDPOINT}';\n` +
            `const apiKey = '${safeApiKey}';\n\n` +
            `const payload = {\n` +
            `    url: '${targetUrl}',\n` +
            `    method: 'GET'\n` +
            `};\n\n` +
            `const headers = {\n` +
            `    'Content-Type': 'application/json',\n` +
            `    'x-api-key': apiKey\n` +
            `};\n\n` +
            `fetch(proxyUrl, { \n` +
            `    method: 'POST',\n` +
            `    headers: headers,\n` +
            `    body: JSON.stringify(payload)\n` +
            ` })\n` +
            `    .then(response => response.text()) // Get raw HTML text\n` +
            `    .then(html => console.log(html))\n` +
            `    .catch(error => console.error('Error:', error));`;

        return { curl, python, javascript };
    }, [query, engine]);

    return (
        <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap={8}>
            <GridItem>
                <VStack spacing={4} align="stretch">
                    <Heading size="md" mb={2}>Parameters</Heading>
                    <FormControl isRequired>
                        <FormLabel fontSize="sm">API Key</FormLabel>
                        <Input type="password" placeholder="Enter your proxy API key" value={apiKey} onChange={(e) => setApiKey(e.target.value)} fontSize="sm" />
                    </FormControl>
                    <FormControl isRequired>
                        <FormLabel fontSize="sm">Query</FormLabel>
                        <Input placeholder="e.g., best restaurants near me" value={query} onChange={(e) => setQuery(e.target.value)} fontSize="sm" />
                    </FormControl>
                    <FormControl isRequired>
                        <FormLabel fontSize="sm">Search Engine</FormLabel>
                        <Select value={engine} onChange={(e) => setEngine(e.target.value)} fontSize="sm">
                            <option value="google">Google</option>
                            <option value="bing">Bing</option>
                            <option value="duckduckgo">DuckDuckGo</option>
                        </Select>
                    </FormControl>
                    <FormControl>
                        <FormLabel fontSize="sm" color="gray.400">Location (for future SERP API)</FormLabel>
                        <Input isDisabled placeholder="e.g., Austin,Texas,United States" value={location} onChange={(e) => setLocation(e.target.value)} fontSize="sm"/>
                    </FormControl>
                    <FormControl display="flex" alignItems="center">
                        <FormLabel htmlFor="include-images" mb="0" fontSize="sm" color="gray.400">
                            Include Image Results? (for future SERP API)
                        </FormLabel>
                        <Switch id="include-images" isChecked={includeImages} onChange={(e) => setIncludeImages(e.target.checked)} isDisabled />
                    </FormControl>
                    <Button colorScheme="blue" onClick={handleSubmit} isLoading={isLoading}>
                        Run Proxy Test
                    </Button>
                </VStack>
            </GridItem>
            <GridItem>
                <VStack spacing={4} align="stretch">
                    <Heading size="md" mb={2}>Code Snippet & Response</Heading>
                    {/* **FIX for JUMPING**: Box with fixed height and overflow */}
                    <Box h="250px" borderWidth="1px" borderRadius="md" bg="gray.800" overflow="hidden">
                        <Tabs variant="enclosed-colored" size="sm" h="100%" display="flex" flexDirection="column">
                            <TabList>
                                <Tab>cURL</Tab>
                                <Tab>Python</Tab>
                                <Tab>JavaScript</Tab>
                            </TabList>
                            <TabPanels overflowY="auto" flex="1">
                                <TabPanel p={0}><Code w="100%" h="100%" p={4} display="block" whiteSpace="pre-wrap" children={codeSnippets.curl} /></TabPanel>
                                <TabPanel p={0}><Code w="100%" h="100%" p={4} display="block" whiteSpace="pre-wrap" children={codeSnippets.python} /></TabPanel>
                                <TabPanel p={0}><Code w="100%" h="100%" p={4} display="block" whiteSpace="pre-wrap" children={codeSnippets.javascript} /></TabPanel>
                            </TabPanels>
                        </Tabs>
                    </Box>
                    <Box>
                        <Heading size="sm" mb={2}>Raw HTML Response</Heading>
                        <Box as="pre" p={4} bg="gray.50" borderRadius="md" h="300px" overflowY="auto" fontSize="xs" whiteSpace="pre-wrap">
                            {isLoading ? "Loading..." : error ? `Error: ${error}` : response ? response : "Run a test to see the raw HTML response from the search engine here."}
                        </Box>
                    </Box>
                </VStack>
            </GridItem>
        </Grid>
    );
};


// --- Main SERP API Page Component ---
const SerpApiPage = () => {
    // Queries re-used from original component
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

    // Tab configuration with the new Playground component
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
            component: () => <ApiKeyGSerp token={token} />,
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
                                {TabsConfig.map((tab, index) => <TabPanel key={index}>{tab.component()}</TabPanel>)}
                            </TabPanels>
                        </Tabs>
                    </>
                )}
            </Container>
        </ProtectedComponent>
    );
};

// --- Route Definition ---
// The route path is updated for the new SERP API page.
export const Route = createFileRoute("/_layout/web-scraping-tools/serp-api")({
    component: SerpApiPage,
});

export default SerpApiPage;