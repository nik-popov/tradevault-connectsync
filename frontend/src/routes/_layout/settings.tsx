import React, { useState, useEffect } from "react";
import {
  Container,
  Flex,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  Box,
  Divider,
  Button,
  VStack,
  useToast,
  // Imports required for ApiKeyModule
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Tooltip,
  IconButton,
  Alert,
  AlertIcon,
  Heading,
} from "@chakra-ui/react";
import { CopyIcon, DeleteIcon } from "@chakra-ui/icons";
import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import type { UserPublic } from "../../client";

// --- ApiKeyModule Component Definition ---

interface ApiKey {
  key_preview: string;
  created_at: string;
  expires_at: string;
  is_active: boolean;
  request_count?: number;
}

interface ApiKeyProps {
  token: string | null;
}

const API_PROXY_URL = "https://api.thedataproxy.com/v2/proxy";

const ApiKeyModule: React.FC<ApiKeyProps> = ({ token }) => {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fullKey, setFullKey] = useState<string | null>(null);
  const [hasProxyApiAccess, setHasProxyApiAccess] = useState<boolean | null>(null);
  const toast = useToast();

  useEffect(() => {
    if (token) {
      fetchProxyApiAccess();
      fetchApiKeys();
    }
  }, [token]);

  const fetchProxyApiAccess = async () => {
    if (!token) return;
    try {
      const response = await fetch("https://api.thedataproxy.com/v2/proxy-api/access", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error("Failed to fetch proxy API access");
      const data = await response.json();
      setHasProxyApiAccess(data.has_access);
    } catch (err) {
      console.error("Error fetching proxy API access:", err);
      setHasProxyApiAccess(false);
    }
  };

  const fetchApiKeys = async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_PROXY_URL}/api-keys`, {
        method: "GET",
        headers: { "Accept": "application/json", "Authorization": `Bearer ${token}` },
      });
      if (!response.ok) throw new Error(`Failed to fetch API keys: ${response.status}`);
      const data: ApiKey[] = await response.json();
      const normalizedData = data.map((key) => ({
        ...key,
        request_count: key.request_count ?? 0,
        created_at: key.created_at || new Date().toISOString(),
        expires_at: key.expires_at || new Date().toISOString(),
        is_active: key.is_active ?? false,
        key_preview: key.key_preview || "N/A",
      }));
      const sortedData = normalizedData.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      setApiKeys(sortedData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const generateKey = async () => {
    if (!token) return setError("No authentication token available");
    if (hasProxyApiAccess === null) return setError("Checking subscription status...");
    if (!hasProxyApiAccess) return setError("Your subscription plan does not include proxy API features.");
    
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_PROXY_URL}/generate-api-key`, {
        method: "POST",
        headers: { "Accept": "application/json", "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      if (!response.ok) throw new Error(`Failed to generate API key: ${response.status}`);
      const newKeyData = await response.json();
      setFullKey(newKeyData.api_key);
      await fetchApiKeys();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const deleteApiKey = async (keyPreview: string, requestCount: number) => {
    if (!token) return setError("No authentication token available");
    if (requestCount > 0) return setError("Cannot delete API key with requests. Only keys with 0 requests can be deleted.");

    setLoading(true);
    setError(null);
    try {
      const parts = keyPreview.split("...");
      if (parts.length !== 2 || parts[1].length !== 8) throw new Error("Invalid key preview format.");
      const lastEight = parts[1];
      const response = await fetch(`${API_PROXY_URL}/api-keys/${lastEight}`, {
        method: "DELETE",
        headers: { "Accept": "application/json", "Authorization": `Bearer ${token}` },
      });
      if (!response.ok) {
        let errorDetail = "Unknown error";
        try {
          const errorData = await response.json();
          errorDetail = errorData.detail || errorDetail;
        } catch (jsonErr) { console.warn("Failed to parse error response:", jsonErr); }
        throw new Error(`Failed to delete API key: ${response.status} - ${errorDetail}`);
      }
      await fetchApiKeys();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete API key");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "API key copied to clipboard.",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  if (!token) {
    return (
      <Box p={4} width="100%">
        <Alert status="error"><AlertIcon /><Text fontSize="sm">Please log in to manage API keys.</Text></Alert>
      </Box>
    );
  }

  return (
    <Box p={4} width="100%">
      <Flex direction="column" gap={6}>
        <Box>
          <Flex justify="space-between" align="center" mb={2}>
            <Text fontSize="md" fontWeight="semibold">Create a new API key for proxy access</Text>
            <Tooltip label="Generate a new API key">
              <Button size="sm" colorScheme="blue" onClick={generateKey} isLoading={loading} isDisabled={loading || hasProxyApiAccess === false}>Generate</Button>
            </Tooltip>
          </Flex>
          <Box mt={4} p={4} bg="gray.100" borderRadius="md" borderWidth="1px" minH="100px" display="flex" flexDirection="column" gap={2}>
            {fullKey ? (
              <>
                <Text fontSize="sm">Your new API key (copy it now, it won’t be shown again):</Text>
                <Flex gap={2} alignItems="center">
                  <Text fontFamily="monospace" fontSize="sm" wordBreak="break-all">{fullKey}</Text>
                  <IconButton aria-label="Copy full key" icon={<CopyIcon />} size="sm" onClick={() => copyToClipboard(fullKey)} />
                </Flex>
                <Text fontSize="xs" color="gray.500">Store this securely.</Text>
              </>
            ) : ( <Text fontSize="sm" color="gray.500">Generate a key to see it here.</Text> )}
          </Box>
        </Box>
        {hasProxyApiAccess === null && <Text fontSize="sm">Checking subscription status...</Text>}
        {hasProxyApiAccess === false && (<Alert status="warning"><AlertIcon /><Text fontSize="sm">Your plan does not include proxy API features.</Text></Alert>)}
        {error && (<Alert status="error"><AlertIcon /><Text fontSize="sm">{error}</Text></Alert>)}
        <Box>
          <Heading size="md" mb={4}>Existing API Keys</Heading>
          <Box shadow="md" borderWidth="1px" borderRadius="md" overflowX="auto">
            <Table variant="simple" size="sm">
              <Thead><Tr>
                  <Th><Text fontSize="sm">Key Preview</Text></Th>
                  <Th><Text fontSize="sm">Created</Text></Th>
                  <Th><Text fontSize="sm">Expires</Text></Th>
                  <Th><Text fontSize="sm">Requests</Text></Th>
                  <Th><Text fontSize="sm">Status</Text></Th>
                  <Th><Text fontSize="sm">Actions</Text></Th>
              </Tr></Thead>
              <Tbody>
                {apiKeys.map((key, index) => (
                  <Tr key={index}>
                    <Td><Text fontSize="sm">{key.key_preview}</Text></Td>
                    <Td><Text fontSize="sm">{new Date(key.created_at).toLocaleString()}</Text></Td>
                    <Td><Text fontSize="sm">{new Date(key.expires_at).toLocaleString()}</Text></Td>
                    <Td><Text fontSize="sm">{key.request_count}</Text></Td>
                    <Td><Text fontSize="sm">{key.is_active ? "Active" : "Inactive"}</Text></Td>
                    <Td>
                      <Tooltip label={key.request_count && key.request_count > 0 ? "Cannot delete key with requests" : "Delete API key"}>
                        <IconButton aria-label="Delete key" icon={<DeleteIcon />} size="sm" colorScheme="red" variant="ghost" onClick={() => deleteApiKey(key.key_preview, key.request_count || 0)} isLoading={loading} isDisabled={loading || (key.request_count || 0) > 0} />
                      </Tooltip>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        </Box>
      </Flex>
    </Box>
  );
};

// --- Main Settings Page Logic ---

const fetchBillingPortal = async (token: string) => {
  const response = await fetch("https://api.thedataproxy.com/v2/customer-portal", {
    method: "GET",
    headers: { "Content-Type": "application/json", "Accept": "application/json", "Authorization": `Bearer ${token}` },
  });
  if (!response.ok) throw new Error(`Failed to fetch portal: ${response.status}`);
  const data = await response.json();
  if (!data.portal_url) throw new Error("No portal URL received");
  return data.portal_url;
};

const tabsConfig = [
  {
    title: "API Keys",
    component: () => {
      const [token] = useState<string | null>(localStorage.getItem("access_token"));
      return <ApiKeyModule token={token} />;
    },
  },
   {
    title: "Billing",
    component: () => {
      const [token] = useState<string | null>(localStorage.getItem("access_token"));
      const [isLoading, setIsLoading] = useState(false);
      const toast = useToast();

      const handleBillingClick = async () => {
        if (!token) {
          toast({ title: "Authentication Required", description: "Please log in to manage billing.", status: "warning", duration: 5000, isClosable: true });
          return;
        }
        setIsLoading(true);
        try {
          const portalUrl = await fetchBillingPortal(token);
          window.location.href = portalUrl;
        } catch (error) {
          console.error("Error accessing customer portal:", error);
          toast({ title: "Error", description: "Failed to access billing portal. Please try again.", status: "error", duration: 5000, isClosable: true });
        } finally {
          setIsLoading(false);
        }
      };

      return (
        <VStack spacing={4} align="start" p={4}>
          <Text>Manage your billing information and subscriptions.</Text>
          <Button colorScheme="blue" onClick={handleBillingClick} isLoading={isLoading} isDisabled={!token}>Manage Billing</Button>
        </VStack>
      );
    },
  }
];

export const Route = createFileRoute("/_layout/settings")({
  component: UserSettings,
});

function UserSettings() {
  const queryClient = useQueryClient();
  const currentUser = queryClient.getQueryData<UserPublic>(["currentUser"]);

  if (!currentUser) {
    return (
      <Container maxW="full" bg="gray.50" py={6}>
        <Text color="gray.600">Loading user data...</Text>
      </Container>
    );
  }

  const finalTabs = currentUser?.is_superuser ? tabsConfig : tabsConfig;

  return (
    <Container maxW="full">
      <Flex align="center" justify="space-between" py={6}>
        <Text fontSize="xl">Settings</Text>
        <Text fontSize="sm">Manage your settings</Text>
      </Flex>
      <Divider my={4} borderColor="gray.200" />
      <Tabs colorScheme="blue">
        <TabList borderBottom="2px solid" borderColor="gray.200">
          {finalTabs.map((tab, index) => (
            <Tab key={index} _selected={{ color: "orange.700", borderColor: "orange.500" }} color="gray.600" _hover={{ bg: "gray.100" }}>
              {tab.title}
            </Tab>
          ))}
        </TabList>
        <TabPanels>
          {finalTabs.map((tab, index) => (
            <TabPanel key={index} bg="gray.50" p={0}>
              {React.createElement(tab.component)}
            </TabPanel>
          ))}
        </TabPanels>
      </Tabs>
    </Container>
  );
}

export default UserSettings;