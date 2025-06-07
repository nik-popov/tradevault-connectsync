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

// Define an interface for our structured result
interface SerpResult {
  position: number;
  title: string;
  link: string;
  snippet: string;
}

const API_URL = "https://api.thedataproxy.com/v2/proxy";

const PlaygroundSerpApi: React.FC = () => {
  const [query, setQuery] = useState<string>("best pizza in new york");
  const [region, setRegion] = useState<string>(REGIONS[0]);
  const [apiKey, setApiKey] = useState<string>("");
  const [response, setResponse] = useState<string>("");
  const [htmlPreview, setHtmlPreview] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [responseTime, setResponseTime] = useState<number | null>(null);

  const buildSearchEngineUrl = () => {
    const url = new URL(`https://www.google.com/search`);
    url.searchParams.set('q', query);
    if (region && region !== "us-east") {
      // Map regions to Google country codes (simplified example)
      const regionToCountry: { [key: string]: string } = {
        "us-east": "US",
        "us-west": "US",
        "us-central": "US",
        "northamerica-northeast": "CA",
        southamerica: "BR",
        asia: "JP",
        australia: "AU",
        europe: "DE",
        "middle-east": "AE",
      };
      url.searchParams.set('cr', `country${regionToCountry[region] || "US"}`);
      url.searchParams.set('gl', (regionToCountry[region] || "us").toLowerCase());
    }
    return url.toString();
  };

  const generateCurlCommand = () => {
    const targetUrl = buildSearchEngineUrl();
    const proxyRequestUrl = `${API_URL}?url=${encodeURIComponent(targetUrl)}`;
    return `curl -X GET "${proxyRequestUrl}" \\\n  -H "x-api-key: ${apiKey}"`;
  };

  const parseHtmlResponse = (html: string): SerpResult[] => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const results: SerpResult[] = [];
    const resultNodes = doc.querySelectorAll('div.g');
    resultNodes.forEach((node, index) => {
      const titleEl = node.querySelector<HTMLHeadingElement>('h3');
      const linkEl = node.querySelector<HTMLAnchorElement>('a');
      const snippetEl = node.querySelector<HTMLDivElement>('div[data-sncf="1"]');
      if (titleEl && linkEl && snippetEl) {
        results.push({
          position: index + 1,
          title: titleEl.innerText,
          link: linkEl.href,
          snippet: snippetEl.innerText,
        });
      }
    });
    if (results.length === 0) {
      setError("Could not parse a structured response from the HTML. The search engine's page layout might have changed, or the page was blocked.");
    }
    return results;
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
      const targetUrl = buildSearchEngineUrl();
      const proxyRequestUrl = `${API_URL}?url=${encodeURIComponent(targetUrl)}`;
      const res = await fetch(proxyRequestUrl, {
        method: "GET",
        headers: {
          "x-api-key": apiKey,
          Accept: "text/html",
        },
      });

      const endTime = performance.now();
      const timeTaken = Math.round(endTime - startTime);
      setResponseTime(timeTaken);

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ detail: `HTTP error! status: ${res.status}` }));
        throw new Error(errorData.detail || `An unknown error occurred.`);
      }

      const htmlResponse = await res.text();
      setHtmlPreview(htmlResponse);
      const structuredData = parseHtmlResponse(htmlResponse);
      setResponse(JSON.stringify(structuredData, null, 2));
    } catch (error) {
      setError(error instanceof Error ? error.message : "Unknown error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyHtml = () => {
    if (htmlPreview) {
      navigator.clipboard.writeText(htmlPreview).then(() => {
        alert("HTML copied to clipboard!");
      });
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
          </Flex>
          <Flex direction={{ base: "column", sm: "row" }} gap={2} align="center">
            <Tooltip label="Send test request">
              <Button
                width="full"
                size="sm"
                colorScheme="blue"
                onClick={handleTestRequest}
                isLoading={isLoading}
                isDisabled={!query.trim() || !apiKey.trim() || !region}
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
                isDisabled={!query.trim() || !apiKey.trim() || !region}
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
            <Link href="/web-scraping-tools/gserp" color="orange.500">
              RAW HTML <CopyIcon mx="2px" />
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
            <Link href="/web-scraping-tools/serp-api" isExternal color="orange.500">
              Structured Response <ExternalLinkIcon mx="2px" /> (json)
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

export default PlaygroundSerpApi;