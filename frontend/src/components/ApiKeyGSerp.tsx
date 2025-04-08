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
} from "@chakra-ui/react";
import { CopyIcon } from "@chakra-ui/icons";

interface ApiKey {
  key_preview: string;
  created_at: string;
  expires_at: string;
  is_active: boolean;
  request_count?: number; // Added optional request count
}

interface ApiKeyGSerpProps {
  token: string | null;
}

const API_URL = "https://api.thedataproxy.com/api/v1/proxy";

const ApiKeyGSerp: React.FC<ApiKeyGSerpProps> = ({ token }) => {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fullKey, setFullKey] = useState<string | null>(null);

  useEffect(() => {
    if (token) {
      fetchApiKeys();
    }
  }, [token]);

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
      // Ensure request_count exists, default to 0 if not provided
      const normalizedData = data.map(key => ({
        ...key,
        request_count: key.request_count ?? 0
      }));
      setApiKeys(normalizedData);
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
      setFullKey(newKeyData.full_key);
      await fetchApiKeys();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
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
          Please log in on the main page to access API key management
        </Alert>
      </Box>
    );
  }

  return (
    <Box p={4} width="100%">
      <Flex direction="column" gap={6}>
        {/* Generate New API Key Section */}
        <Box>
          <Flex justify="space-between" align="center" mb={2}>
            <Text fontSize="md" fontWeight="semibold">
              Generate New API Key
            </Text>
            <Tooltip label="Generate a new API key">
              <Button
                size="sm"
                colorScheme="blue"
                onClick={generateKey}
                isLoading={loading}
                isDisabled={loading}
              >
                Generate
              </Button>
            </Tooltip>
          </Flex>

          {/* Sandbox Area for Full Key */}
          <Box
            mt={4}
            p={4}
            bg="gray.100" // Slightly different shade from gray.50
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
                  Your new API key (copy it now as it won't be shown again after refresh):
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
                  Store this securely.
                </Text>
              </>
            ) : (
              <Text fontSize="sm" color="gray.500">
                Generate a key to see it here.
              </Text>
            )}
          </Box>
        </Box>

        {/* Error Display */}
        {error && (
          <Alert status="error">
            <AlertIcon />
            {error}
          </Alert>
        )}

        {/* Existing API Keys Section */}
        <Box>
          <Text fontSize="md" fontWeight="semibold" mb={2}>
            Existing API Keys
          </Text>
          <Box shadow="md" borderWidth="1px" borderRadius="md" overflowX="auto">
            <Table variant="simple" size="sm">
              <Thead>
                <Tr>
                  <Th>Key Preview</Th>
                  <Th>Created At</Th>
                  <Th>Expires At</Th>
                  <Th>Status</Th>
                  <Th>Request Count</Th>
                </Tr>
              </Thead>
              <Tbody>
                {apiKeys.map((key, index) => (
                  <Tr key={index}>
                    <Td>{key.key_preview}</Td>
                    <Td>{new Date(key.created_at).toLocaleString()}</Td>
                    <Td>{new Date(key.expires_at).toLocaleString()}</Td>
                    <Td>{key.is_active ? "Active" : "Inactive"}</Td>
                    <Td>{key.request_count}</Td>
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