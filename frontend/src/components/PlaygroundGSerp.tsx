import React, { useState } from "react";
import {
  Box,
  Text,
  Flex,
  Button,
  Input,
  Select,
  Textarea,
  Spinner,
  Tooltip,
  FormControl,
  FormLabel,
} from "@chakra-ui/react";

// Constants
const ENDPOINTS = ["SOUTHAMERICA-WEST1", "US-CENTRAL1", "US-EAST1"];

// Types
interface ApiResponse {
  endpoint: string;
  query: string;
  status: string;
  results: number;
  timestamp: string;
}

const PlaygroundGSerp: React.FC = () => {
  const [query, setQuery] = useState<string>("");
  const [endpoint, setEndpoint] = useState<string>(ENDPOINTS[1]); // Default to US-CENTRAL1
  const [response, setResponse] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Simulate API request
  const handleTestRequest = () => {
    setIsLoading(true);
    setTimeout(() => {
      const mockResponse: ApiResponse = {
        endpoint,
        query,
        status: "success",
        results: Math.floor(Math.random() * 100),
        timestamp: new Date().toISOString(),
      };
      setResponse(JSON.stringify(mockResponse, null, 2));
      setIsLoading(false);
    }, 1000);
  };

  return (
    <Box p={4} width="100%">
      {/* Header */}
      <Text fontSize="lg" fontWeight="bold" mb={4}>
        API Playground
      </Text>

      {/* Test Parameters Section */}
      <Box mb={6}>
        <Text fontSize="md" fontWeight="semibold" mb={2}>
          Test Parameters
        </Text>
        <Flex direction={{ base: "column", md: "row" }} gap={4}>
          <FormControl flex="1" minW="200px">
            <FormLabel fontSize="sm">Search Query</FormLabel>
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter search query"
              size="sm"
              isRequired
            />
          </FormControl>
          <FormControl flex="1" minW="200px">
            <FormLabel fontSize="sm">Endpoint</FormLabel>
            <Select
              value={endpoint}
              onChange={(e) => setEndpoint(e.target.value)}
              size="sm"
            >
              {ENDPOINTS.map((ep) => (
                <option key={ep} value={ep}>
                  {ep}
                </option>
              ))}
            </Select>
          </FormControl>
          <Box alignSelf="flex-end">
            <Tooltip label="Send test request">
              <Button
                size="sm"
                colorScheme="blue"
                onClick={handleTestRequest}
                isLoading={isLoading}
                isDisabled={!query.trim()}
                mt={{ base: 0, md: 6 }}
              >
                Test
              </Button>
            </Tooltip>
          </Box>
        </Flex>
      </Box>

      {/* Response Section */}
      <Box>
        <Text fontSize="md" fontWeight="semibold" mb={2}>
          Response
        </Text>
        {isLoading ? (
          <Flex justify="center" align="center" h="200px">
            <Spinner size="xl" color="blue.500" />
          </Flex>
        ) : (
          <Textarea
            value={response}
            readOnly
            height="300px"
            bg="gray.700"
            color="white"
            placeholder="Response will appear here after testing"
            size="sm"
            resize="vertical"
          />
        )}
      </Box>
    </Box>
  );
};

export default PlaygroundGSerp;