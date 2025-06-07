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
  Divider,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Code,
  useTheme,
  useDisclosure, // <-- For managing modal state
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  SimpleGrid,
} from "@chakra-ui/react";
import { ExternalLinkIcon, CopyIcon, DownloadIcon, ViewIcon } from "@chakra-ui/icons";
import { FiSend } from "react-icons/fi";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

// --- Custom CodeBlock with Syntax Highlighting ---
const CodeBlock = ({ code, language }) => {
  const customStyle = {
    margin: 0,
    borderRadius: "0.375rem",
    padding: "1rem",
    maxHeight: '60vh', // Make code blocks scrollable within the modal
    overflow: 'auto'
  };
  
  return (
    <SyntaxHighlighter language={language} style={vscDarkPlus} customStyle={customStyle} wrapLongLines={true}>
      {code}
    </SyntaxHighlighter>
  );
};

// --- Helper Functions ---
const handleCopy = (text, type) => {
  navigator.clipboard.writeText(text).then(() => alert(`${type} copied to clipboard!`));
};

const handleDownload = (content, filename, type) => {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};


// --- NEW: Results Modal Component ---
const ResultsModal = ({ isOpen, onClose, data }) => {
  if (!data) return null;
  const theme = useTheme();

  const { requestInfo, jsonResponse, htmlPreview, headers } = data;
  
  const resultCardStyle = {
    height: "65vh",
    width: "100%",
    border: "1px solid",
    borderColor: "gray.200",
    borderRadius: "md",
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="6xl" isCentered motionPreset="slideInBottom">
      <ModalOverlay bg="blackAlpha.600" />
      <ModalContent mx={4}>
        <ModalHeader>API Call Results</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <Tabs variant="soft-rounded" colorScheme="blue">
            <TabList>
              <Tab>Request Info</Tab>
              <Tab>JSON Response</Tab>
              <Tab>HTML Preview</Tab>
              <Tab>Response Headers</Tab>
            </TabList>
            <TabPanels mt={4}>
              <TabPanel>
                <Heading size="sm" mb={4}>Request Sent to API</Heading>
                <SimpleGrid columns={2} spacing={2} maxW="lg">
                  <Text fontWeight="bold">URL:</Text>
                  <Code>{requestInfo.url}</Code>
                  <Text fontWeight="bold">Region:</Text>
                  <Code>{requestInfo.region}</Code>
                  <Text fontWeight="bold">Method:</Text>
                  <Code>POST</Code>
                </SimpleGrid>
              </TabPanel>
              <TabPanel p={0}>
                 <Flex justify="flex-end" mb={2} gap={2}>
                    <Tooltip label="Copy JSON"><IconButton aria-label="Copy JSON" icon={<CopyIcon />} size="sm" onClick={() => handleCopy(jsonResponse, 'JSON Response')} /></Tooltip>
                    <Tooltip label="Download JSON"><IconButton aria-label="Download JSON" icon={<DownloadIcon />} size="sm" onClick={() => handleDownload(jsonResponse, "response.json", "application/json")} /></Tooltip>
                 </Flex>
                 <CodeBlock code={jsonResponse} language="json" />
              </TabPanel>
              <TabPanel p={0}>
                <Flex justify="flex-end" mb={2} gap={2}>
                    <Tooltip label="Copy HTML"><IconButton aria-label="Copy HTML" icon={<CopyIcon />} size="sm" onClick={() => handleCopy(htmlPreview, 'HTML')} /></Tooltip>
                    <Tooltip label="Download HTML"><IconButton aria-label="Download HTML" icon={<DownloadIcon />} size="sm" onClick={() => handleDownload(htmlPreview, "preview.html", "text/html")} /></Tooltip>
                </Flex>
                <iframe srcDoc={htmlPreview} style={resultCardStyle} title="HTML Preview" sandbox="allow-scripts allow-same-origin" />
              </TabPanel>
              <TabPanel p={0}>
                 <Flex justify="flex-end" mb={2} gap={2}>
                    <Tooltip label="Copy Headers"><IconButton aria-label="Copy Headers" icon={<CopyIcon />} size="sm" onClick={() => handleCopy(headers, 'Headers')} /></Tooltip>
                 </Flex>
                <CodeBlock code={headers} language="json" />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" onClick={onClose}>Close</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};


// --- Constants ---
const REGIONS = [
  "us-east", "us-west", "us-central", "northamerica-northeast",
  "southamerica", "asia", "australia", "europe", "middle-east",
];
const API_URL = "https://api.thedataproxy.com/v2/proxy";

const PlaygroundGSerp: React.FC = () => {
  // --- State ---
  const [url, setUrl] = useState<string>("https://www.google.com/search?q=flowers&udm=2");
  const [region, setRegion] = useState<string>(REGIONS[0]);
  const [apiKey, setApiKey] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [responseTime, setResponseTime] = useState<number | null>(null);

  // --- NEW: State for modal and its data ---
  const { isOpen: isModalOpen, onOpen: onModalOpen, onClose: onModalClose } = useDisclosure();
  const [resultsData, setResultsData] = useState<any | null>(null);

  const displayApiKey = apiKey.trim() || "YOUR_API_KEY";
  
  const codeTabs = [
    {
      id: "curl", label: "cURL", language: "bash",
      code: `curl -X POST "${API_URL}/fetch?region=${region}" \\\n  -H "Content-Type: application/json" \\\n  -H "x-api-key: ${displayApiKey}" \\\n  -d '{"url": "${url}"}'`,
    },
    {
      id: "python", label: "Python", language: "python",
      code: `import requests\nimport json\n\napi_key = '${displayApiKey}'\nregion = '${region}'\nurl_to_fetch = '${url}'\n\napi_url = f'${API_URL}/fetch?region={region}'\n\nheaders = {\n    'Content-Type': 'application/json',\n    'x-api-key': api_key\n}\npayload = {'url': url_to_fetch}\n\nresponse = requests.post(api_url, headers=headers, data=json.dumps(payload))\n\nif response.status_code == 200:\n    print(json.dumps(response.json(), indent=2))\nelse:\n    print(f"Error: {response.status_code}")\n    print(response.text)`,
    },
    {
      id: "nodejs", label: "Node.js", language: "javascript",
      code: `const axios = require('axios');\n\nconst apiKey = '${displayApiKey}';\nconst region = '${region}';\nconst searchUrl = '${url}';\n\nconst apiUrl = \`${API_URL}/fetch?region=\${region}\`;\n\nconst headers = {\n    'Content-Type': 'application/json',\n    'x-api-key': apiKey\n};\nconst payload = { url: searchUrl };\n\naxios.post(apiUrl, payload, { headers })\n    .then(response => {\n        console.log(JSON.stringify(response.data, null, 2));\n    })\n    .catch(error => {\n        console.error('Error:', error.response ? error.response.data : error.message);\n    });`,
    },
  ];

  // --- Handlers ---
  const handleTestRequest = async () => {
    setIsLoading(true);
    setError("");
    setResponseTime(null);
    setResultsData(null); // Clear previous results

    try {
      const startTime = performance.now();
      const res = await fetch(`${API_URL}/fetch?region=${region}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-api-key": apiKey },
        body: JSON.stringify({ url }),
      });
      const endTime = performance.now();
      setResponseTime(Math.round(endTime - startTime));

      // Capture headers
      const responseHeaders = {};
      res.headers.forEach((value, key) => { responseHeaders[key] = value; });

      const responseBody = await res.json();
      if (!res.ok) {
        throw new Error(responseBody.detail || `HTTP error! status: ${res.status}`);
      }

      // Set all data for the modal and open it
      setResultsData({
        requestInfo: { url, region },
        jsonResponse: JSON.stringify(responseBody, null, 2),
        htmlPreview: responseBody.result || "",
        headers: JSON.stringify(responseHeaders, null, 2),
      });
      onModalOpen();

    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box width="100%">
      {/* --- Intro --- */}
      <Box mb={6}>
        <Text fontSize="lg" mb={2} color="gray.700">This tool allows you to programmatically fetch search engine results pages.</Text>
        <Text fontSize="lg" mb={4} color="gray.700">Build your request below. Results will open in a new window for review.</Text>
        <Divider mb={4} />
      </Box>

      {/* --- Live Test (Request Builder) --- */}
      <Box mb={8}>
        <Heading as="h2" size="md" fontWeight="semibold" mb={6} color="gray.700">Live Test</Heading>
        <Flex direction="column" gap={4}>
          <FormControl>
            <FormLabel fontSize="sm">Search URL</FormLabel>
            <Input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="e.g., https://www.google.com/search?q=flowers&udm=2" size="sm" />
          </FormControl>
          <Grid templateColumns={{ base: "1fr", md: "2fr 1fr auto" }} gap={4} alignItems="flex-end">
            <GridItem><FormControl><FormLabel fontSize="sm">API Key</FormLabel><Input value={apiKey} onChange={(e) => setApiKey(e.target.value)} placeholder="Enter your API key" size="sm" type="password" /></FormControl></GridItem>
            <GridItem><FormControl><FormLabel fontSize="sm">Region</FormLabel><Select value={region} onChange={(e) => setRegion(e.target.value)} size="sm">{REGIONS.map((reg) => (<option key={reg} value={reg}>{reg}</option>))}</Select></FormControl></GridItem>
            <GridItem><Button size="sm" colorScheme="blue" onClick={handleTestRequest} isLoading={isLoading} isDisabled={!url.trim() || !apiKey.trim() || !region} leftIcon={<FiSend />}>Test Request</Button></GridItem>
          </Grid>
          {error && (<Alert status="error" mt={4}><AlertIcon /><Text fontSize="sm">{error}</Text></Alert>)}
          {/* --- Success Message & Re-open Button --- */}
          {resultsData && !isModalOpen && (
              <Alert status="success" mt={4}>
                  <AlertIcon />
                  <Flex justify="space-between" align="center" w="100%">
                    <Box>
                      <Text fontWeight="bold">Request Successful!</Text>
                      <Text fontSize="sm">Response Time: {responseTime} ms</Text>
                    </Box>
                    <Button
                      size="sm"
                      variant="solid"
                      colorScheme="blue"
                      leftIcon={<ViewIcon />}
                      onClick={onModalOpen}
                    >
                      View Last Result
                    </Button>
                  </Flex>
              </Alert>
          )}
        </Flex>
      </Box>

      {/* --- Dynamic Code Snippets --- */}
      <Box mb={8}>
        <Heading as="h2" size="md" fontWeight="semibold" mb={4} color="gray.700">Your Request Code</Heading>
        <Text fontSize="md" color="gray.600" mb={6}>The code below updates automatically as you change parameters in the Live Test section.</Text>
        <Tabs variant="enclosed" colorScheme="orange">
          <TabList>
            {codeTabs.map((tab) => (<Tab key={tab.id} fontWeight="semibold" fontSize="lg" color="gray.400" _selected={{ bg: "gray.800", color: "orange.400" }}>{tab.label}</Tab>))}
          </TabList>
          <TabPanels bg="gray.800" borderRadius="0 0 md md">
            {codeTabs.map((tab) => (<TabPanel key={tab.id} p={0}><CodeBlock code={tab.code} language={tab.language} /></TabPanel>))}
          </TabPanels>
        </Tabs>
      </Box>
      
      {/* --- Need Help Section --- */}
      <Box pt={8} mt={8} borderTopWidth="1px" borderColor="gray.200">
        <Box p={4} borderWidth="1px" borderRadius="md" bg="orange.50" borderColor="orange.200">
          <Heading size="md" mb={2} color="gray.800">Need Help?</Heading>
          <Text fontSize="md" color="gray.700">Check our detailed{" "}<Link color="orange.600" fontWeight="bold" href="/documentation/serp-api" isExternal>API Documentation</Link>{" "}for more examples. For further assistance, contact our{" "}<Link color="orange.600" fontWeight="bold" href="/support" isExternal>Support Center</Link>.</Text>
        </Box>
      </Box>
      
      {/* --- Render the Modal --- */}
      <ResultsModal isOpen={isModalOpen} onClose={onModalClose} data={resultsData} />
    </Box>
  );
};

export default PlaygroundGSerp;