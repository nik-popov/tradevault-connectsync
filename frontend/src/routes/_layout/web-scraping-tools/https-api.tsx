import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useRef } from "react";
import {
  Container,
  Flex,
  Text,
  Tabs,
  Divider,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Box,
  Heading,
  Alert,
  AlertIcon,
  Link,
  Code,
  Textarea,
  IconButton,
  Button,
  useClipboard,
  useToast,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Spinner,
  Badge,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from "@chakra-ui/react";
import { CopyIcon, AddIcon, DeleteIcon } from "@chakra-ui/icons";
import ProtectedComponent from "../../../components/Common/ProtectedComponent";
import PlaygroundHttpsProxy from "../../../components/ScrapingTools/PlaygroundHttps";
import ApiKeyModule from "../../../components/ScrapingTools/ApiKey";
// --- Interfaces ---
interface Subscription {
  id: string;
  status: string;
  plan_name: string | null;
  product_name: string | null;
}

interface ProxyApiAccess {
  has_access: boolean;
  message: string | null;
}

interface ApiKey {
  key_preview: string;
  created_at: string;
  is_active: boolean;
  request_count: number;
}

// --- API Fetching Logic ---
const API_BASE_URL = "https://api.thedataproxy.com/v2";

async function fetchFromApi(endpoint: string, token: string, options: RequestInit = {}) {
  if (!token) {
    throw new Error("No access token found. Please log in again.");
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.detail || `API request failed: ${response.status}`
    );
  }
  return response.json();
}

const fetchSubscriptions = (token: string): Promise<Subscription[]> =>
  fetchFromApi("/customer/subscriptions", token);

const fetchProxyApiAccess = (token: string): Promise<ProxyApiAccess> =>
  fetchFromApi("/proxy-api/access", token);

const fetchApiKeys = (token: string): Promise<ApiKey[]> =>
  fetchFromApi("/proxy/api-keys", token).then((data: any[]) =>
    data.map((key) => ({
      ...key,
      request_count: key.request_count ?? 0,
    }))
  );

const createNewApiKey = (token: string): Promise<{ full_key: string }> =>
  fetchFromApi("/proxy/api-keys", token, { method: "POST" });

const revokeExistingApiKey = (token: string, keyPreview: string): Promise<void> =>
  fetchFromApi(`/proxy/api-keys/${keyPreview}`, token, { method: "DELETE" });


// --- Reusable Code Block Component ---
const CodeBlock = ({ code }: { code: string }) => {
  const { onCopy } = useClipboard(code);
  const toast = useToast();

  const handleCopy = () => {
    onCopy();
    toast({
      title: "Copied to clipboard",
      status: "success",
      duration: 2000,
      isClosable: true,
      position: "top-right",
    });
  };

  return (
    <Box position="relative">
      <Textarea
        value={code}
        readOnly
        height="280px"
        bg="gray.50"
        fontFamily="monospace"
        fontSize="sm"
        p={4}
        pt={12}
        resize="none"
        _dark={{ bg: "gray.700" }}
      />
      <IconButton
        aria-label="Copy Code"
        icon={<CopyIcon />}
        size="sm"
        position="absolute"
        top="0.5rem"
        right="0.5rem"
        onClick={handleCopy}
      />
    </Box>
  );
};


// --- Get Started Tab Component ---
const GetStartedTab = () => {
  const TARGET_URL_EXAMPLE = "https://api.ipify.org?format=json";
  const PROXY_ENDPOINT = "https://api.thedataproxy.com/v2/proxy";

  const CODE_EXAMPLES = {
    curl: `curl -X GET "${PROXY_ENDPOINT}?url=${encodeURIComponent(TARGET_URL_EXAMPLE)}" \\
  -H "x-api-key: YOUR_API_KEY"`,
    python: `import requests
import urllib.parse

api_key = "YOUR_API_KEY"
target_url = "${TARGET_URL_EXAMPLE}"
proxy_endpoint = "${PROXY_ENDPOINT}"

params = { "url": target_url }
headers = { "x-api-key": api_key }

response = requests.get(proxy_endpoint, params=params, headers=headers)

if response.status_code == 200:
    print(response.json())
else:
    print(f"Error: {response.status_code}")
    print(response.text)`,
    javascript: `// Using node-fetch, or native fetch in browser/deno/node 18+
import fetch from 'node-fetch';

const apiKey = 'YOUR_API_KEY';
const targetUrl = '${TARGET_URL_EXAMPLE}';
const proxyEndpoint = new URL('${PROXY_ENDPOINT}');
proxyEndpoint.searchParams.append('url', targetUrl);

const options = {
    method: 'GET',
    headers: { 'x-api-key': apiKey }
};

fetch(proxyEndpoint, options)
    .then(res => {
        if (!res.ok) {
            throw new Error(\`HTTP error! status: \${res.status}\`);
        }
        return res.json();
    })
    .then(json => console.log(json))
    .catch(err => console.error('error:' + err));`
  };

  return (
    <Box>
      <Text fontSize="md" mb={6}>
        The HTTPS Proxy API allows you to route your HTTP/S requests through our network of premium proxies.
        This is ideal for web scraping, data gathering, or accessing geo-restricted content.
      </Text>

      <Text mb={4}>
        To make a request, provide the target URL as a query parameter. Remember to replace <Code>YOUR_API_KEY</Code> with a key from the "API Keys" tab.
      </Text>

      <Tabs variant="enclosed">
        <TabList>
          <Tab>cURL</Tab>
          <Tab>Python</Tab>
          <Tab>JavaScript (Node.js)</Tab>
        </TabList>
        <TabPanels>
          <TabPanel p={0} pt={4}><CodeBlock code={CODE_EXAMPLES.curl} /></TabPanel>
          <TabPanel p={0} pt={4}><CodeBlock code={CODE_EXAMPLES.python} /></TabPanel>
          <TabPanel p={0} pt={4}><CodeBlock code={CODE_EXAMPLES.javascript} /></TabPanel>
        </TabPanels>
      </Tabs>

      <Box mt={8} p={4} borderWidth="1px" borderRadius="md" bg="gray.50" _dark={{ bg: "gray.700" }}>
        <Heading size="md" mb={2}>Need Help?</Heading>
        <Text fontSize="md">
          For detailed information, visit our{" "}
          <Link color="blue.500" href="/documentation/https-api" isExternal>
            API Documentation
          </Link>.
          If you have further questions, please contact our{" "}
          <Link color="blue.500" href="/support" isExternal>
            Support Center
          </Link>.
        </Text>
      </Box>
    </Box>
  );
};

// --- Main Page Component ---
const HttpsProxyApiPage = () => {
  const token = localStorage.getItem("access_token") || "";

  const { data: subscriptions, isLoading: isSubscriptionsLoading, error: subscriptionsError } = useQuery({
    queryKey: ["subscriptions"],
    queryFn: () => fetchSubscriptions(token),
    enabled: !!token,
  });

  const { data: proxyApiAccess, isLoading: isAccessLoading, error: accessError } = useQuery({
    queryKey: ["proxyApiAccess"],
    queryFn: () => fetchProxyApiAccess(token),
    enabled: !!token,
  });

  const { data: apiKeys, isLoading: isApiKeysLoading, error: apiKeysError, refetch: refetchApiKeys } = useQuery({
    queryKey: ["apiKeys"],
    queryFn: () => fetchApiKeys(token),
    enabled: !!token,
  });

  const hasActiveSubscription = subscriptions?.some(
    (sub) => sub.status === "active" || sub.status === "trialing"
  ) || false;

  const isLoading = isSubscriptionsLoading || isAccessLoading || isApiKeysLoading;
  const error = subscriptionsError || accessError || apiKeysError;

  return (
    <ProtectedComponent>
       <Container maxW="full" py={6}>
        <Flex align="center" justify="space-between" mb={4}>
          <Text fontSize="xl">HTTPs Request API</Text>
          <Text fontSize="sm" color="gray.500">Reroute https requests </Text>
        </Flex>
        <Divider my={4} borderColor="gray.200" />

        {isLoading ? (
          <Text fontSize="sm">Loading account details...</Text>
        ) : error ? (
          <Alert status="error">
            <AlertIcon />
            <Text fontSize="sm">
              Error: {error.message || "Failed to load details. Please try again."}
            </Text>
          </Alert>
        ) : !hasActiveSubscription ? (
          <Alert status="warning">
            <AlertIcon />
            <Text fontSize="sm">No active subscription found. Please subscribe to a plan to use the HTTPS Proxy API.</Text>
          </Alert>
        ) : (
          <>
            {!proxyApiAccess?.has_access && (
              <Alert status="warning" mb={4}>
                <AlertIcon />
                <Text fontSize="sm">
                  {proxyApiAccess?.message || "Your current plan does not include HTTPS Proxy API features. Please upgrade to an eligible plan."}
                </Text>
              </Alert>
            )}
            <Tabs isLazy variant="enclosed-colored" colorScheme="orange">
              <TabList>
                <Tab fontSize="sm">Get Started</Tab>
                <Tab fontSize="sm">Keys</Tab>
                <Tab fontSize="sm">Playground</Tab>
              </TabList>
              <TabPanels pt={4}>
                <TabPanel><GetStartedTab /></TabPanel>
                <TabPanel>
                  <ApiKeyModule
                    token={token}
                  />
                </TabPanel>
                <TabPanel><PlaygroundHttpsProxy /></TabPanel>
              </TabPanels>
            </Tabs>
          </>
        )}
      </Container>
    </ProtectedComponent>
  );
};

export const Route = createFileRoute("/_layout/web-scraping-tools/https-api")({
  component: HttpsProxyApiPage,
});

export default HttpsProxyApiPage;