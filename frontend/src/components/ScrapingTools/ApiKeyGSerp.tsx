import React, { useState, useEffect } from "react";
import {
  Box,
  Text,
  Flex,
  Button,
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

interface ApiKey {
  key_preview: string;
  created_at: string;
  expires_at: string;
  is_active: boolean;
  request_count?: number;
}

interface ApiKeyGSerpProps {
  token: string | null;
}

const API_URL = "https://api.thedataproxy.com/v2/proxy";

const ApiKeyGSerp: React.FC<ApiKeyGSerpProps> = ({ token }) => {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fullKey, setFullKey] = useState<string | null>(null);
  const [hasProxyApiAccess, setHasProxyApiAccess] = useState<boolean | null>(null);

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
      if (!response.ok) {
        throw new Error("Failed to fetch proxy API access");
      }
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
      const response = await fetch(`${API_URL}/api-keys`, {
        method: "GET",
        headers: {
          "Accept": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error(`Failed to fetch API keys: ${response.status}`);
      }
      const data: ApiKey[] = await response.json();
      const normalizedData = data.map((key) => ({
        ...key,
        request_count: key.request_count ?? 0,
        created_at: key.created_at || new Date().toISOString(),
        expires_at: key.expires_at || new Date().toISOString(),
        is_active: key.is_active ?? false,
        key_preview: key.key_preview || "N/A",
      }));
      const sortedData = normalizedData.sort((a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      setApiKeys(sortedData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const generateKey = async () => {
    if (!token) {
      setError("No authentication token available");
      return;
    }
    if (hasProxyApiAccess === null) {
      setError("Checking subscription status...");
      return;
    }
    if (!hasProxyApiAccess) {
      setError("Your subscription plan does not include proxy API features.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/generate-api-key`, {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      });
      if (!response.ok) {
        throw new Error(`Failed to generate API key: ${response.status}`);
      }
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
    if (!token) {
      setError("No authentication token available");
      return;
    }
    if (requestCount > 0) {
      setError("Cannot delete API key with requests. Only keys with 0 requests can be deleted.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const parts = keyPreview.split("...");
      if (parts.length !== 2 || parts[1].length !== 8) {
        throw new Error("Invalid key preview format. Expected format: first8...last8");
      }
      const lastEight = parts[1];
      const response = await fetch(`${API_URL}/api-keys/${lastEight}`, {
        method: "DELETE",
        headers: {
          "Accept": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        let errorDetail = "Unknown error";
        try {
          const errorData = await response.json();
          errorDetail = errorData.detail || errorDetail;
        } catch (jsonErr) {
          console.warn("Failed to parse error response:", jsonErr);
        }
        throw new Error(`Failed to delete API key: ${response.status} - ${errorDetail}`);
      }
      await fetchApiKeys();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete API key due to a network error");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  if (!token) {
    return (
      <Box p={4} width="100%">
        <Alert status="error">
          <AlertIcon />
          <Text fontSize="sm">Please log in on the main page to access API key management</Text>
        </Alert>
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
              <Button
                size="sm"
                colorScheme="blue"
                onClick={generateKey}
                isLoading={loading}
                isDisabled={loading || hasProxyApiAccess === false}
              >
                Generate
              </Button>
            </Tooltip>
          </Flex>
          <Box
            mt={4}
            p={4}
            bg="gray.100"
            borderRadius="md"
            borderWidth="1px"
            minH="100px"
            display="flex"
            flexDirection="column"
            gap={2}
          >
            {fullKey ? (
              <>
                <Text fontSize="sm">
                  Your new API key (copy it now as it won’t be shown again after refresh):
                </Text>
                <Flex gap={2} alignItems="center">
                  <Text fontFamily="monospace" fontSize="sm" wordBreak="break-all">
                    {fullKey}
                  </Text>
                  <IconButton
                    aria-label="Copy full key"
                    icon={<CopyIcon />}
                    size="sm"
                    onClick={() => copyToClipboard(fullKey)}
                  />
                </Flex>
                <Text fontSize="xs" color="gray.500">
                  Store this securely
                </Text>
              </>
            ) : (
              <Text fontSize="sm" color="gray.500">
                Generate a key to see it here
              </Text>
            )}
          </Box>
        </Box>

        {hasProxyApiAccess === null && <Text fontSize="sm">Checking subscription status...</Text>}
        {hasProxyApiAccess === false && (
          <Alert status="warning">
            <AlertIcon />
            <Text fontSize="sm">Your subscription plan does not include proxy API features</Text>
          </Alert>
        )}
        {error && (
          <Alert status="error">
            <AlertIcon />
            <Text fontSize="sm">{error}</Text>
          </Alert>
        )}

        <Box>
          <Heading size="md" mb={4}>Existing API Keys</Heading>
          <Box shadow="md" borderWidth="1px" borderRadius="md" overflowX="auto">
            <Table variant="simple" size="sm">
              <Thead>
                <Tr>
                  <Th><Text fontSize="sm">Key Preview</Text></Th>
                  <Th><Text fontSize="sm">Created At</Text></Th>
                  <Th><Text fontSize="sm">Expires At</Text></Th>
                  <Th><Text fontSize="sm">Request Count</Text></Th>
                  <Th><Text fontSize="sm">Status</Text></Th>
                  <Th><Text fontSize="sm">Actions</Text></Th>
                </Tr>
              </Thead>
              <Tbody>
                {apiKeys.map((key, index) => (
                  <Tr key={index}>
                    <Td><Text fontSize="sm">{key.key_preview}</Text></Td>
                    <Td><Text fontSize="sm">{new Date(key.created_at).toLocaleString()}</Text></Td>
                    <Td><Text fontSize="sm">{new Date(key.expires_at).toLocaleString()}</Text></Td>
                    <Td><Text fontSize="sm">{key.request_count}</Text></Td>
                    <Td><Text fontSize="sm">{key.is_active ? "Active" : "Inactive"}</Text></Td>
                    <Td>
                      <Tooltip
                        label={
                          key.request_count && key.request_count > 0
                            ? "Cannot delete key with requests"
                            : "Delete API key"
                        }
                      >
                        <IconButton
                          aria-label="Delete key"
                          icon={<DeleteIcon />}
                          size="sm"
                          colorScheme="red"
                          variant="ghost"
                          onClick={() =>
                            deleteApiKey(key.key_preview, key.request_count || 0)
                          }
                          isLoading={loading}
                          isDisabled={loading || (key.request_count || 0) > 0}
                        />
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

export default ApiKeyGSerp;