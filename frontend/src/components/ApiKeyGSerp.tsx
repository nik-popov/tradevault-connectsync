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
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import { CopyIcon } from "@chakra-ui/icons";

interface ApiKey {
  id?: string; // Added for fetching full key (adjust if your backend uses a different identifier)
  key_preview: string;
  created_at: string;
  expires_at: string;
  is_active: boolean;
  full_key?: string; // Optional, only set when generating a new key
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
      setApiKeys(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const fetchFullKey = async (keyId: string) => {
    if (!token) return null;
    try {
      const response = await fetch(`${API_URL}/api-keys/${keyId}`, {
        method: "GET",
        headers: {
          "Accept": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error(`Failed to fetch full key: ${response.status}`);
      }
      const data = await response.json();
      return data.full_key; // Adjust based on actual response structure
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch full key");
      return null;
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

  const handleCopyFullKey = async (keyId?: string) => {
    if (!keyId) {
      setError("API key ID is missing");
      return;
    }
    setLoading(true);
    const fullKey = await fetchFullKey(keyId);
    if (fullKey) {
      copyToClipboard(fullKey);
      setError(null); // Clear error on success
    }
    setLoading(false);
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
        <Box>
          <Text fontSize="md" fontWeight="semibold" mb={2}>
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
        </Box>

        {error && (
          <Alert status="error">
            <AlertIcon />
            {error}
          </Alert>
        )}

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
                  <Th>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {apiKeys.map((key, index) => (
                  <Tr key={index}>
                    <Td>{key.key_preview}</Td>
                    <Td>{new Date(key.created_at).toLocaleString()}</Td>
                    <Td>{new Date(key.expires_at).toLocaleString()}</Td>
                    <Td>{key.is_active ? "Active" : "Inactive"}</Td>
                    <Td>
                      <Flex gap={2}>
                        <Tooltip label="Copy API key preview">
                          <IconButton
                            aria-label="Copy preview"
                            icon={<CopyIcon />}
                            size="sm"
                            onClick={() => copyToClipboard(key.key_preview)}
                            isDisabled={loading}
                          />
                        </Tooltip>
                        <Tooltip label="Copy full API key">
                          <IconButton
                            aria-label="Copy full key"
                            icon={<CopyIcon />}
                            size="sm"
                            onClick={() => handleCopyFullKey(key.id)}
                            isDisabled={loading || !key.id}
                            colorScheme="teal" // Visually distinguish from preview
                          />
                        </Tooltip>
                      </Flex>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        </Box>
      </Flex>

      <Modal isOpen={!!fullKey} onClose={() => setFullKey(null)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>New API Key</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex direction="column" gap={4}>
              <Text>
                Your new API key (copy it now as it won't be shown again):
              </Text>
              <Flex gap={2} alignItems="center">
                <Text fontFamily="monospace">{fullKey}</Text>
                <IconButton
                  aria-label="Copy full key"
                  icon={<CopyIcon />}
                  size="sm"
                  onClick={() => copyToClipboard(fullKey || "")}
                />
              </Flex>
              <Text fontSize="sm" color="gray.500">
                Store this securely. It will not be displayed again after closing.
              </Text>
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default ApiKeyGSerp;