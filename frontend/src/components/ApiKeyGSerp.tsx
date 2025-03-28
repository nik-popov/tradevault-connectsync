import React, { useState } from "react";
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
} from "@chakra-ui/react";
import { CopyIcon, DeleteIcon } from "@chakra-ui/icons";

interface ApiKey {
  id: string;
  key: string;
  createdAt: string;
}

const mockApiKeys: ApiKey[] = [
  { id: "1", key: "sk-xxxx-xxxx-xxxx-1234", createdAt: "2023-01-15T10:00:00Z" },
  { id: "2", key: "sk-yyyy-yyyy-yyyy-5678", createdAt: "2023-02-20T14:30:00Z" },
];

const ApiKeyGSerp: React.FC = () => {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>(mockApiKeys);
  const [newKeyName, setNewKeyName] = useState("");

  const generateKey = () => {
    if (newKeyName) {
      const newKey = {
        id: `${apiKeys.length + 1}`,
        key: `sk-${Math.random().toString(36).substring(2, 15)}`,
        createdAt: new Date().toISOString(),
      };
      setApiKeys([...apiKeys, newKey]);
      setNewKeyName("");
    }
  };

  const deleteKey = (id: string) => {
    setApiKeys(apiKeys.filter((key) => key.id !== id));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <Box p={4} width="100%">
      <Flex direction="column" gap={6}>
        <Box>
          <Text fontSize="md" fontWeight="semibold" mb={2}>Generate New API Key</Text>
          <Flex gap={4} alignItems="center">
            <Input
              value={newKeyName}
              onChange={(e) => setNewKeyName(e.target.value)}
              placeholder="Enter key name (optional)"
              size="sm"
              width="300px"
            />
            <Tooltip label="Generate a new API key">
              <Button size="sm" colorScheme="blue" onClick={generateKey}>
                Generate
              </Button>
            </Tooltip>
          </Flex>
        </Box>
        <Box>
          <Text fontSize="md" fontWeight="semibold" mb={2}>Existing API Keys</Text>
          <Box shadow="md" borderWidth="1px" borderRadius="md" overflowX="auto">
            <Table variant="simple" size="sm">
              <Thead>
                <Tr>
                  <Th>ID</Th>
                  <Th>Key</Th>
                  <Th>Created At</Th>
                  <Th>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {apiKeys.map((key) => (
                  <Tr key={key.id}>
                    <Td>{key.id}</Td>
                    <Td>{key.key}</Td>
                    <Td>{new Date(key.createdAt).toLocaleString()}</Td>
                    <Td>
                      <Flex gap={2}>
                        <Tooltip label="Copy API key">
                          <IconButton
                            aria-label="Copy key"
                            icon={<CopyIcon />}
                            size="sm"
                            onClick={() => copyToClipboard(key.key)}
                          />
                        </Tooltip>
                        <Tooltip label="Delete API key">
                          <IconButton
                            aria-label="Delete key"
                            icon={<DeleteIcon />}
                            size="sm"
                            colorScheme="red"
                            onClick={() => deleteKey(key.id)}
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
    </Box>
  );
};

export default ApiKeyGSerp;