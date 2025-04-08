import React, { useState, useEffect } from "react";
import {
  Box,
  Text,
  Flex,
  Button,
  Input,
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
  FormControl,
  FormLabel,
} from "@chakra-ui/react";
import { CopyIcon } from "@chakra-ui/icons";

interface ApiKey {
  key_preview: string;
  created_at: string;
  expires_at: string;
  is_active: boolean;
}

interface LoginCredentials {
  username: string;
  password: string;
}

const API_URL = "https://api.thedataproxy.com/api/v1";
const TOKEN_URL = `${API_URL}/login/access-token`;

const ApiKeyGSerp: React.FC = () => {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [newKeyName, setNewKeyName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [credentials, setCredentials] = useState<LoginCredentials>({
    username: "",
    password: "",
  });

  // Fetch API keys when token is available
  useEffect(() => {
    if (token) {
      fetchApiKeys();
    }
  }, [token]);

  const handleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const formData = new URLSearchParams();
      formData.append("username", credentials.username);
      formData.append("password", credentials.password);

      const response = await fetch(TOKEN_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "Accept": "application/json",
        },
        body: formData.toString(),
      });

      if (!response.ok) {
        throw new Error(`Login failed: ${response.status}`);
      }

      const data = await response.json();
      setToken(data.access_token); // Assuming response contains { "access_token": "..." }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
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
      setApiKeys(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const generateKey = async () => {
    if (!token) {
      setError("Please log in first");
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
        body: JSON.stringify({}), // No payload needed per your backend
      });
      if (!response.ok) {
        throw new Error(`Failed to generate API key: ${response.status}`);
      }
      await fetchApiKeys(); // Refresh the list after generation
      setNewKeyName("");
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
        <Text fontSize="lg" fontWeight="bold" mb={4}>
          Login
        </Text>
        <Flex direction="column" gap={4} maxW="300px">
          <FormControl>
            <FormLabel>Username</FormLabel>
            <Input
              value={credentials.username}
              onChange={(e) =>
                setCredentials({ ...credentials, username: e.target.value })
              }
              placeholder="nik@iconluxurygroup.com"
              size="sm"
              disabled={loading}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Password</FormLabel>
            <Input
              type="password"
              value={credentials.password}
              onChange={(e) =>
                setCredentials({ ...credentials, password: e.target.value })
              }
              placeholder="Enter password"
              size="sm"
              disabled={loading}
            />
          </FormControl>
          <Button
            colorScheme="blue"
            onClick={handleLogin}
            isLoading={loading}
            isDisabled={loading || !credentials.username || !credentials.password}
          >
            Login
          </Button>
          {error && (
            <Alert status="error">
              <AlertIcon />
              {error}
            </Alert>
          )}
        </Flex>
      </Box>
    );
  }

  return (
    <Box p={4} width="100%">
      <Flex direction="column" gap={6}>
        {/* Generate New API Key Section */}
        <Box>
          <Text fontSize="md" fontWeight="semibold" mb={2}>
            Generate New API Key
          </Text>
          <Flex gap={4} alignItems="center">
            <Input
              value={newKeyName}
              onChange={(e) => setNewKeyName(e.target.value)}
              placeholder="Enter key name (optional)"
              size="sm"
              width="300px"
              disabled={loading}
            />
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
                      <Tooltip label="Copy API key preview">
                        <IconButton
                          aria-label="Copy key"
                          icon={<CopyIcon />}
                          size="sm"
                          onClick={() => copyToClipboard(key.key_preview)}
                          isDisabled={loading}
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