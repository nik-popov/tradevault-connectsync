import React, { useState, useEffect } from "react";
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
} from "@chakra-ui/react";
import { ExternalLinkIcon } from "@chakra-ui/icons";
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
  "middle-east"
];

const API_URL = "https://api.thedataproxy.com/api/v2/proxy";

const PlaygroundGSerp: React.FC = () => {
  const [url, setUrl] = useState<string>("https://www.google.com/search?q=flowers&udm=2");
  const [region, setRegion] = useState<string>(REGIONS[0]);
  const [apiKey, setApiKey] = useState<string>("");
  const [response, setResponse] = useState<string>("");
  const [htmlPreview, setHtmlPreview] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const handleTestRequest = async () => {
    setIsLoading(true);
    setResponse("");
    setHtmlPreview("");
    setError("");

    try {
      const res = await fetch(`${API_URL}/fetch?region=${region}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
        },
        body: JSON.stringify({ url }), // Matches ProxyRequest model
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || `HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      console.log("API Response:", data);
      setResponse(JSON.stringify(data, null, 2));
      if (data.result) {
        console.log("Setting HTML preview:", data.result.substring(0, 100));
        setHtmlPreview(data.result);
      } else {
        console.log("No HTML content found in data.result");
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "Unknown error");
      setResponse(`Error: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box width="100%">
      <Box mb={6}>
        <Flex direction="column" gap={4}>
          <Flex gap={4} alignItems="flex-end">
            <FormControl flex="2">
              <FormLabel fontSize="sm">Search URL</FormLabel>
              <Input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="e.g., https://www.google.com/search?q=flowers&udm=2"
                size="sm"
                isRequired
              />
            </FormControl>
          </Flex>
          <Flex direction="row" gap={4} alignItems="flex-end">
            <FormControl flex="1">
              <FormLabel fontSize="sm">API Key</FormLabel>
              <Input
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter your API key"
                size="sm"
                type="password" // Hide API key by default
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
            <Box>
              <Tooltip label="Send test request">
                <Button
                  size="sm"
                  colorScheme="blue"
                  onClick={handleTestRequest}
                  isLoading={isLoading}
                  isDisabled={!url.trim() || !apiKey.trim() || !region}
                >
                  <FiSend />
                </Button>
              </Tooltip>
            </Box>
          </Flex>
          {error && (
            <Text color="red.500" fontSize="sm">{error}</Text>
          )}
        </Flex>
      </Box>
      <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={6}>
        <GridItem>
          <Text fontSize="md" fontWeight="semibold" mb={2}>Response</Text>
          {isLoading ? (
            <Flex justify="center" align="center" h="400px">
              <Spinner size="xl" color="blue.500" />
            </Flex>
          ) : (
            <Textarea
              value={response}
              readOnly
              height="400px"
              bg="gray.700"
              color="white"
              placeholder="Response will appear here after testing"
              size="sm"
              resize="vertical"
            />
          )}
        </GridItem>
        <GridItem>
          <Flex align="center" justify="space-between" mb={2}>
            <Text fontSize="md" fontWeight="semibold">HTML Preview</Text>
            {htmlPreview && (
              <Flex align="center" gap={2}>
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
              </Flex>
            )}
          </Flex>
          {htmlPreview && (
            <iframe
              srcDoc={htmlPreview}
              style={{ width: "100%", height: "400px", border: "1px solid #ccc" }}
              title="HTML Preview"
              sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
            />
          )}
        </GridItem>
      </Grid>
    </Box>
  );
};

export default PlaygroundGSerp;