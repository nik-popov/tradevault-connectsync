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
  Grid,
  GridItem,
  IconButton,
  Heading,
  Alert,
  AlertIcon,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from "@chakra-ui/react";
import { CopyIcon, DownloadIcon } from "@chakra-ui/icons";
import { FiSend } from "react-icons/fi";

// Define regions and search engines
const REGIONS = [
  "us-east",
  "us-west",
  "us-central",
  "northamerica-northeast",
  "southamerica",
  "asia",
  "australia",
  "europe",
  "middle-east",
];

const SEARCH_ENGINES = [
  { value: "google", label: "Google" },
  { value: "bing", label: "Bing" },
  { value: "yahoo", label: "Yahoo" },
];

// Define interface for structured result
interface SerpResult {
  position: number;
  title: string;
  link: string;
  snippet: string;
}

const API_URL = "https://api.thedataproxy.com/v2/serp";

const PlaygroundSerpApi: React.FC = () => {
  const [query, setQuery] = useState<string>("best pizza in new york");
  const [region, setRegion] = useState<string>(REGIONS[0]);
  const [searchEngine, setSearchEngine] = useState<string>(SEARCH_ENGINES[0].value);
  const [apiKey, setApiKey] = useState<string>("");
  const [response, setResponse] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [responseTime, setResponseTime] = useState<number | null>(null);

  const generateCurlCommand = () => {
    const params = new URLSearchParams({
      q: query,
      region,
      engine: searchEngine,
    });
    return `curl -X GET "${API_URL}?${params.toString()}" \\\n  -H "x-api-key: ${apiKey}"`;
  };

  const generatePythonCode = () => {
    return `import requests

url = "${API_URL}"
params = {
    "q": "${query}",
    "region": "${region}",
    "engine": "${searchEngine}"
}
headers = {
    "x-api-key": "${apiKey}"
}

response = requests.get(url, params=params, headers=headers)
print(response.json())
`;
  };

  const generateJsCode = () => {
    return `const fetch = require('node-fetch');

const url = new URL("${API_URL}");
url.searchParams.append('q', '${query}');
url.searchParams.append('region', '${region}');
url.searchParams.append('engine', '${searchEngine}');

fetch(url, {
    headers: {
        'x-api-key': '${apiKey}'
    }
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));
`;
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      alert("Code copied to clipboard!");
    });
  };

  const handleTestRequest = async () => {
    setIsLoading(true);
    setResponse("");
    setError("");
    setResponseTime(null);

    try {
      const startTime = performance.now();
      const params = new URLSearchParams({
        q: query,
        region,
        engine: searchEngine,
      });
      const requestUrl = `${API_URL}?${params.toString()}`;
      const res = await fetch(requestUrl, {
        method: "GET",
        headers: {
          "x-api-key": apiKey,
          Accept: "application/json",
        },
      });

      const endTime = performance.now();
      const timeTaken = Math.round(endTime - startTime);
      setResponseTime(timeTaken);

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ detail: `HTTP error! status: ${res.status}` }));
        throw new Error(errorData.detail || "An unknown error occurred.");
      }

      const jsonResponse = await res.json();
      setResponse(JSON.stringify(jsonResponse, null, 2));
    } catch (error) {
      setError(error instanceof Error ? error.message : "Unknown error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyResponse = () => {
    if (response) {
      navigator.clipboard.writeText(response).then(() => {
        alert("Response copied to clipboard!");
      });
    }
  };

  const handleDownloadResponse = () => {
    if (response) {
      const blob = new Blob([response], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "response.json";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <Box width="100%">
      <Box mb={6}>
        <Flex direction="column" gap={4}>
          <FormControl>
            <FormLabel fontSize="sm">Search Query</FormLabel>
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g., best pizza in new york"
              size="sm"
              isRequired
            />
          </FormControl>
          <Flex direction="row" gap={4}>
            <FormControl flex="1">
              <FormLabel fontSize="sm">API Key</FormLabel>
              <Input
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter your API key"
                size="sm"
                type="password"
                isRequired
              />
            </FormControl>
            <FormControl flex="1">
              <FormLabel fontSize="sm">Region</FormLabel>
              <Select
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                size="sm"
              >
                {REGIONS.map((reg) => (
                  <option key={reg} value={reg}>
                    {reg}
                  </option>
                ))}
              </Select>
            </FormControl>
            <FormControl flex="1">
              <FormLabel fontSize="sm">Search Engine</FormLabel>
              <Select
                value={searchEngine}
                onChange={(e) => setSearchEngine(e.target.value)}
                size="sm"
              >
                {SEARCH_ENGINES.map((engine) => (
                  <option key={engine.value} value={engine.value}>
                    {engine.label}
                  </option>
                ))}
              </Select>
            </FormControl>
          </Flex>
          <Flex direction={{ base: "column", sm: "row" }} gap={2} align="center">
            <Tooltip label="Send test request">
              <Button
                width="full"
                size="sm"
                colorScheme="blue"
                onClick={handleTestRequest}
                isLoading={isLoading}
                isDisabled={!query.trim() || !apiKey.trim() || !region || !searchEngine}
              >
                <FiSend />
              </Button>
            </Tooltip>
            <Tooltip label="Copy cURL command">
              <IconButton
                aria-label="Copy cURL"
                icon={<CopyIcon />}
                size="sm"
                onClick={() => handleCopy(generateCurlCommand())}
                isDisabled={!query.trim() || !apiKey.trim() || !region || !searchEngine}
              />
            </Tooltip>
          </Flex>
          {error && (
            <Alert status="error">
              <AlertIcon />
              <Text fontSize="sm">{error}</Text>
            </Alert>
          )}
          {responseTime !== null && (
            <Text fontSize="sm" color="gray.600">
              Response Time: {responseTime} ms
            </Text>
          )}
        </Flex>
      </Box>
      <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={6}>
        <GridItem>
          <Flex align="center" justify="space-between" mb={4}>
            <Heading size="md">Response</Heading>
            <Flex gap={2}>
              {response && (
                <>
                  <Tooltip label="Copy Response">
                    <IconButton
                      aria-label="Copy Response"
                      icon={<CopyIcon />}
                      size="sm"
                      onClick={handleCopyResponse}
                    />
                  </Tooltip>
                  <Tooltip label="Download Response">
                    <IconButton
                      aria-label="Download Response"
                      icon={<DownloadIcon />}
                      size="sm"
                      onClick={handleDownloadResponse}
                    />
                  </Tooltip>
                </>
              )}
            </Flex>
          </Flex>
          {isLoading ? (
            <Flex justify="center" align="center" h="400px">
              <Spinner size="xl" color="orange.500" />
            </Flex>
          ) : (
            <Textarea
              value={response}
              readOnly
              height="400px"
              bg="orange.50"
              color="black"
              placeholder="Response will appear here after testing"
              size="sm"
              resize="vertical"
            />
          )}
        </GridItem>
        <GridItem>
          <Heading size="md" mb={4}>Code Examples</Heading>
          <Tabs variant="enclosed">
            <TabList>
              <Tab>cURL</Tab>
              <Tab>Python</Tab>
              <Tab>JavaScript</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <Flex justify="space-between" mb={2}>
                  <Text fontSize="sm">cURL Command</Text>
                  <Tooltip label="Copy cURL">
                    <IconButton
                      aria-label="Copy cURL"
                      icon={<CopyIcon />}
                      size="sm"
                      onClick={() => handleCopy(generateCurlCommand())}
                    />
                  </Tooltip>
                </Flex>
                <Textarea
                  value={generateCurlCommand()}
                  readOnly
                  height="350px"
                  bg="gray.50"
                  fontFamily="monospace"
                  size="sm"
                />
              </TabPanel>
              <TabPanel>
                <Flex justify="space-between" mb={2}>
                  <Text fontSize="sm">Python Code</Text>
                  <Tooltip label="Copy Python">
                    <IconButton
                      aria-label="Copy Python"
                      icon={<CopyIcon />}
                      size="sm"
                      onClick={() => handleCopy(generatePythonCode())}
                    />
                  </Tooltip>
                </Flex>
                <Textarea
                  value={generatePythonCode()}
                  readOnly
                  height="350px"
                  bg="gray.50"
                  fontFamily="monospace"
                  size="sm"
                />
              </TabPanel>
              <TabPanel>
                <Flex justify="space-between" mb={2}>
                  <Text fontSize="sm">JavaScript Code</Text>
                  <Tooltip label="Copy JavaScript">
                    <IconButton
                      aria-label="Copy JavaScript"
                      icon={<CopyIcon />}
                      size="sm"
                      onClick={() => handleCopy(generateJsCode())}
                    />
                  </Tooltip>
                </Flex>
                <Textarea
                  value={generateJsCode()}
                  readOnly
                  height="350px"
                  bg="gray.50"
                  fontFamily="monospace"
                  size="sm"
                />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </GridItem>
      </Grid>
    </Box>
  );
};

export default PlaygroundSerpApi;