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
} from "@chakra-ui/react";
import { ExternalLinkIcon, CopyIcon, DownloadIcon } from "@chakra-ui/icons";
import { FiSend } from "react-icons/fi";

// Define regions based on backend REGION_ENDPOINTS
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

const API_URL = "https://api.thedataproxy.com/v2/proxy";

const PlaygroundGSerp: React.FC = () => {
  const [url, setUrl] = useState<string>("https://www.google.com/search?q=flowers&udm=2");
  const [region, setRegion] = useState<string>(REGIONS[0]);
  const [apiKey, setApiKey] = useState<string>("");
  const [response, setResponse] = useState<string>("");
  const [htmlPreview, setHtmlPreview] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [responseTime, setResponseTime] = useState<number | null>(null);

  const generateCurlCommand = () => {
    const requestUrl = `${API_URL}/fetch?region=${region}`;
    return `curl -X POST "${requestUrl}" \\
  -H "Content-Type: application/json" \\
  -H "x-api-key: ${apiKey}" \\
  -d '{"url": "${url}"}'`;
  };

  const handleCopyCurl = () => {
    const curlCommand = generateCurlCommand();
    navigator.clipboard.writeText(curlCommand).then(() => {
      alert("cURL command copied to clipboard!");
    });
  };

  const handleTestRequest = async () => {
    setIsLoading(true);
    setResponse("");
    setHtmlPreview("");
    setError("");
    setResponseTime(null);

    try {
      const startTime = performance.now();
      const res = await fetch(`${API_URL}/fetch?region=${region}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
        },
        body: JSON.stringify({ url }),
      });

      const endTime = performance.now();
      const timeTaken = Math.round(endTime - startTime);
      setResponseTime(timeTaken);

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || `HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      setResponse(JSON.stringify(data, null, 2));
      if (data.result) {
        setHtmlPreview(data.result);
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "Unknown error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyHtml = () => {
    if (htmlPreview) {
      navigator.clipboard.writeText(htmlPreview);
      alert("HTML copied to clipboard!");
    }
  };

  const handleCopyResponse = () => {
    if (response) {
      navigator.clipboard.writeText(response);
      alert("Response copied to clipboard!");
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

  return (
    <Box width="100%">
      <Box mb={6}>
        <Flex direction="column" gap={4}>
            <FormControl>
              <FormLabel fontSize="sm">Search URL</FormLabel>
              <Input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="e.g., https://www.google.com/search?q=flowers&udm=2"
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
            </Flex>
            <Flex direction={{ base: "column", sm: "row" }} gap={2} align="center">
              <Tooltip label="Send test request">
                <Button
                  width="full"
                  size="sm"
                  colorScheme="blue"
                  onClick={handleTestRequest}
                  isLoading={isLoading}
                  isDisabled={!url.trim() || !apiKey.trim() || !region}
                >
                  <FiSend />
                </Button>
              </Tooltip>
              <Tooltip label="Copy cURL command">
                <IconButton
                  aria-label="Copy cURL"
                  icon={<CopyIcon />}
                  size="sm"
                  onClick={handleCopyCurl}
                  isDisabled={!url.trim() || !apiKey.trim() || !region}
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
          <Text fontSize="sm" mb={4}>
            <Link
              href="/web-scraping-tools/serp-api"
              isExternal
              color="orange.500"
            >
              Structured Response (json results) <ExternalLinkIcon mx="2px" />
            </Link>
          </Text>
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
          <Flex align="center" justify="space-between" mb={4}>
            <Heading size="md">HTML Preview</Heading>
            <Flex gap={2}>
              {htmlPreview && (
                <>
                  <Tooltip label="Copy HTML">
                    <IconButton
                      aria-label="Copy HTML"
                      icon={<CopyIcon />}
                      size="sm"
                      onClick={handleCopyHtml}
                    />
                  </Tooltip>
                  <Tooltip label="Download HTML">
                    <IconButton
                      aria-label="Download HTML"
                      icon={<DownloadIcon />}
                      size="sm"
                      onClick={handleDownloadHtml}
                    />
                  </Tooltip>
                  <Tooltip label="Open preview in new tab">
                    <IconButton
                      aria-label="Open preview"
                      icon={<ExternalLinkIcon />}
                      size="sm"
                      onClick={() => {
                        const newWindow = window.open("", "_blank");
                        if (newWindow) {
                          newWindow.document.write(htmlPreview);
                          newWindow.document.close();
                        } else {
                          alert("Popup blocked. Please allow popups for this site.");
                        }
                      }}
                    />
                  </Tooltip>
                </>
              )}
            </Flex>
          </Flex>
          <Text fontSize="sm" mb={4}>
            <Link
              color="orange.500"
            >
              Rendered HTML<CopyIcon mx="2px" />
            </Link>
          </Text>
          {htmlPreview ? (
            <iframe
              srcDoc={htmlPreview}
              style={{ width: "100%", height: "400px", border: "1px solid #ccc" }}
              title="HTML Preview"
              sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
            />
          ) : (
            <Box
              height="400px"
              bg="gray.100"
              borderRadius="md"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Text fontSize="sm" color="gray.500">No preview available</Text>
            </Box>
          )}
        </GridItem>
      </Grid>
    </Box>
  );
};

export default PlaygroundGSerp;