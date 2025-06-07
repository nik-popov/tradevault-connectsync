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
  Link,
  // NEW: Import Tab components for the new UI
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
} from "@chakra-ui/react";
import { ExternalLinkIcon, CopyIcon, DownloadIcon } from "@chakra-ui/icons";
import { FiSend } from "react-icons/fi";

// Define regions based on backend REGION_ENDPOINTS
const REGIONS = [
  "us-east", "us-west", "us-central", "northamerica-northeast",
  "southamerica", "asia", "australia", "europe", "middle-east",
];

const API_URL = "https://api.thedataproxy.com/v2/proxy";

const PlaygroundGSerp: React.FC = () => {
  // NEW: State for switching between 'serp' and 'fetch' modes
  const [apiMode, setApiMode] = useState<'serp' | 'fetch'>('serp');

  // UPDATED: State for inputs, now more generic
  const [query, setQuery] = useState<string>("flowers"); // For SERP query or Fetch URL
  const [engine, setEngine] = useState<string>("google"); // For SERP only

  const [region, setRegion] = useState<string>(REGIONS[0]);
  const [apiKey, setApiKey] = useState<string>("");
  const [response, setResponse] = useState<string>("");
  const [htmlPreview, setHtmlPreview] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [responseTime, setResponseTime] = useState<number | null>(null);

  // UPDATED: Dynamically generate cURL command based on the selected API mode
  const generateCurlCommand = () => {
    if (apiMode === 'serp') {
      const requestUrl = `${API_URL}/serp?q=${encodeURIComponent(query)}&engine=${engine}®ion=${region}`;
      return `curl -X GET "${requestUrl}" \\
  -H "x-api-key: ${apiKey}"`;
    } else { // 'fetch' mode
      const requestUrl = `${API_URL}/fetch?region=${region}`;
      return `curl -X POST "${requestUrl}" \\
  -H "Content-Type: application/json" \\
  -H "x-api-key: ${apiKey}" \\
  -d '{"url": "${query}"}'`;
    }
  };

  const handleCopyCurl = () => {
    navigator.clipboard.writeText(generateCurlCommand());
    alert("cURL command copied to clipboard!");
  };

  // UPDATED: Main request logic now handles both API modes
  const handleTestRequest = async () => {
    setIsLoading(true);
    setResponse("");
    setHtmlPreview("");
    setError("");
    setResponseTime(null);

    try {
      const startTime = performance.now();
      let res: Response;

      if (apiMode === 'serp') {
        const requestUrl = `${API_URL}/serp?q=${encodeURIComponent(query)}&engine=${engine}®ion=${region}`;
        res = await fetch(requestUrl, {
          method: "GET",
          headers: { "x-api-key": apiKey },
        });
      } else { // 'fetch' mode
        const requestUrl = `${API_URL}/fetch?region=${region}`;
        res = await fetch(requestUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": apiKey,
          },
          body: JSON.stringify({ url: query }),
        });
      }

      const endTime = performance.now();
      setResponseTime(Math.round(endTime - startTime));

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.detail || `HTTP error! status: ${res.status}`);
      }

      setResponse(JSON.stringify(data, null, 2));
      // Only set HTML preview if we are in fetch mode and the result exists
      if (apiMode === 'fetch' && data.result) {
        setHtmlPreview(data.result);
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyResponse = () => {
    navigator.clipboard.writeText(response);
    alert("Response copied to clipboard!");
  };

  const handleDownloadResponse = () => {
    const blob = new Blob([response], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "response.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopyHtml = () => {
    if (htmlPreview) {
      navigator.clipboard.writeText(htmlPreview);
      alert("HTML copied to clipboard!");
    }
  };
  
  const handleDownloadHtml = () => {
    if (htmlPreview) {
      const blob = new Blob([htmlPreview], { type: "text/html" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "preview.html";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const isButtonDisabled = !query.trim() || !apiKey.trim() || !region;

  return (
    <Box width="100%">
      <Grid templateColumns={{ base: '1fr', lg: '350px 1fr' }} gap={6}>
        {/* --- LEFT COLUMN: CONTROLS --- */}
        <GridItem>
          <Flex direction="column" gap={4} p={4} bg="gray.50" borderRadius="md">
            <Heading size="sm">API Playground</Heading>
            
            {/* NEW: Tabbed interface for switching modes */}
            <Tabs variant='soft-rounded' colorScheme='blue' onChange={(index) => setApiMode(index === 0 ? 'serp' : 'fetch')}>
              <TabList>
                <Tab>SERP API</Tab>
                <Tab>Proxy API</Tab>
              </TabList>
              <TabPanels>
                {/* SERP API Panel */}
                <TabPanel p={0} pt={4}>
                  <FormControl>
                    <FormLabel fontSize="sm">Search Query</FormLabel>
                    <Input
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="e.g., flowers"
                      size="sm"
                    />
                  </FormControl>
                  <FormControl mt={4}>
                    <FormLabel fontSize="sm">Engine</FormLabel>
                    <Select value={engine} onChange={(e) => setEngine(e.target.value)} size="sm">
                      <option value="google">Google</option>
                      <option value="bing">Bing</option>
                      <option value="duckduckgo">DuckDuckGo</option>
                    </Select>
                  </FormControl>
                </TabPanel>
                {/* Proxy API (Fetch) Panel */}
                <TabPanel p={0} pt={4}>
                   <FormControl>
                    <FormLabel fontSize="sm">Target URL</FormLabel>
                    <Input
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="e.g., https://www.google.com/search?q=..."
                      size="sm"
                    />
                  </FormControl>
                </TabPanel>
              </TabPanels>
            </Tabs>

            <FormControl>
              <FormLabel fontSize="sm">API Key</FormLabel>
              <Input
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter your API key"
                size="sm"
                type="password"
              />
            </FormControl>
            <FormControl>
              <FormLabel fontSize="sm">Region</FormLabel>
              <Select value={region} onChange={(e) => setRegion(e.target.value)} size="sm">
                {REGIONS.map((reg) => (
                  <option key={reg} value={reg}>{reg}</option>
                ))}
              </Select>
            </FormControl>
            <Flex gap={2}>
              <Button
                flex="1"
                size="sm"
                colorScheme="blue"
                onClick={handleTestRequest}
                isLoading={isLoading}
                isDisabled={isButtonDisabled}
                leftIcon={<FiSend />}
              >
                Send Request
              </Button>
              <Tooltip label="Copy cURL command">
                <IconButton
                  aria-label="Copy cURL"
                  icon={<CopyIcon />}
                  size="sm"
                  onClick={handleCopyCurl}
                  isDisabled={isButtonDisabled}
                />
              </Tooltip>
            </Flex>
            {error && (
              <Alert status="error" fontSize="sm">
                <AlertIcon /> {error}
              </Alert>
            )}
            {responseTime !== null && (
              <Text fontSize="sm" color="gray.600">
                Response Time: {responseTime} ms
              </Text>
            )}
          </Flex>
        </GridItem>

        {/* --- RIGHT COLUMN: RESULTS --- */}
        <GridItem>
          <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={6}>
            {/* JSON Response Panel */}
            <GridItem>
              <Flex align="center" justify="space-between" mb={2}>
                <Heading size="md">API Response</Heading>
                {response && (
                  <Flex gap={2}>
                    <Tooltip label="Copy Response"><IconButton aria-label="Copy Response" icon={<CopyIcon />} size="sm" onClick={handleCopyResponse} /></Tooltip>
                    <Tooltip label="Download Response"><IconButton aria-label="Download Response" icon={<DownloadIcon />} size="sm" onClick={handleDownloadResponse} /></Tooltip>
                  </Flex>
                )}
              </Flex>
              {isLoading ? (
                <Flex justify="center" align="center" h="400px"><Spinner size="xl" color="blue.500" /></Flex>
              ) : (
                <Textarea
                  value={response}
                  readOnly
                  height="400px"
                  bg="gray.50"
                  color="black"
                  placeholder="API response will appear here..."
                  size="sm"
                  resize="vertical"
                />
              )}
            </GridItem>
            {/* HTML Preview Panel */}
            <GridItem>
              <Flex align="center" justify="space-between" mb={2}>
                <Heading size="md">HTML Preview</Heading>
                {htmlPreview && (
                  <Flex gap={2}>
                    <Tooltip label="Copy HTML"><IconButton aria-label="Copy HTML" icon={<CopyIcon />} size="sm" onClick={handleCopyHtml} /></Tooltip>
                    <Tooltip label="Download HTML"><IconButton aria-label="Download HTML" icon={<DownloadIcon />} size="sm" onClick={handleDownloadHtml} /></Tooltip>
                    <Tooltip label="Open in new tab"><IconButton aria-label="Open preview" icon={<ExternalLinkIcon />} size="sm" onClick={() => {
                        const newWindow = window.open();
                        if (newWindow) {
                            newWindow.document.write(htmlPreview);
                            newWindow.document.close();
                        }
                    }} /></Tooltip>
                  </Flex>
                )}
              </Flex>
              {htmlPreview ? (
                <iframe
                  srcDoc={htmlPreview}
                  style={{ width: "100%", height: "400px", border: "1px solid #E2E8F0", borderRadius: "0.375rem" }}
                  title="HTML Preview"
                  sandbox="allow-scripts allow-same-origin"
                />
              ) : (
                <Box height="400px" bg="gray.100" borderRadius="md" display="flex" alignItems="center" justifyContent="center">
                  <Text fontSize="sm" color="gray.500">
                    {apiMode === 'fetch' ? "No HTML preview available" : "HTML preview only available in Proxy API mode"}
                  </Text>
                </Box>
              )}
            </GridItem>
          </Grid>
        </GridItem>
      </Grid>
    </Box>
  );
};

export default PlaygroundGSerp;