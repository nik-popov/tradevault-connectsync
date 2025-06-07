import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useRef } from "react";
import {
  Container,
  Flex,
  Text,
  Tabs,
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

      <Heading size="md" mb={4}>Quick Start Examples</Heading>
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
          <Link color="blue.500" href="/documentation/https-proxy-api" isExternal>
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


// --- API Keys Manager Tab Component ---
const ProxyApiKeyManager = ({ token, keys, isLoading, error, onKeysUpdate }: {
  token: string;
  keys: ApiKey[];
  isLoading: boolean;
  error: Error | null;
  onKeysUpdate: () => void;
}) => {
  const toast = useToast();
  const [newApiKey, setNewApiKey] = useState<string | null>(null);
  const [keyToRevoke, setKeyToRevoke] = useState<string | null>(null);
  const { isOpen: isModalOpen, onOpen: onModalOpen, onClose: onModalClose } = useDisclosure();
  const { isOpen: isAlertOpen, onOpen: onAlertOpen, onClose: onAlertClose } = useDisclosure();
  const cancelRef = useRef<HTMLButtonElement>(null);
  const { onCopy, setValue: setClipboardValue } = useClipboard("");

  const createMutation = useMutation({
    mutationFn: () => createNewApiKey(token),
    onSuccess: (data) => {
      setNewApiKey(data.full_key);
      setClipboardValue(data.full_key);
      onModalOpen();
      onKeysUpdate();
      toast({ title: "API Key created successfully!", status: "success", duration: 3000, isClosable: true });
    },
    onError: (e: Error) => toast({ title: "Error creating key", description: e.message, status: "error" })
  });

  const revokeMutation = useMutation({
    mutationFn: (keyPreview: string) => revokeExistingApiKey(token, keyPreview),
    onSuccess: () => {
      onKeysUpdate();
      toast({ title: "API Key revoked.", status: "info", duration: 3000, isClosable: true });
    },
    onError: (e: Error) => toast({ title: "Error revoking key", description: e.message, status: "error" }),
    onSettled: () => {
      setKeyToRevoke(null);
      onAlertClose();
    }
  });
  
  const handleCopyNewKey = () => {
    onCopy();
    toast({ title: "New API key copied!", status: "success", duration: 2000, isClosable: true });
  }

  const handleRevokeClick = (keyPreview: string) => {
    setKeyToRevoke(keyPreview);
    onAlertOpen();
  }

  if (isLoading) return <Spinner />;
  if (error) return <Alert status="error"><AlertIcon />{error.message}</Alert>;

  return (
    <Box>
      <Flex justify="space-between" align="center" mb={4}>
        <Box>
          <Heading size="sm">Manage API Keys</Heading>
          <Text fontSize="sm" color="gray.500">Use these keys to authenticate your API requests.</Text>
        </Box>
        <Button
          leftIcon={<AddIcon />}
          colorScheme="blue"
          onClick={() => createMutation.mutate()}
          isLoading={createMutation.isPending}
        >
          Create New Key
        </Button>
      </Flex>
      <TableContainer borderWidth="1px" borderRadius="md">
        <Table variant="simple">
          {!keys.length && <TableContainer p={4}>You haven't created any API keys yet.</TableContainer>}
          <Thead>
            <Tr>
              <Th>Key Preview</Th>
              <Th>Status</Th>
              <Th>Created On</Th>
              <Th isNumeric>Requests</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {keys.map((key) => (
              <Tr key={key.key_preview}>
                <Td><Code>{key.key_preview}...</Code></Td>
                <Td><Badge colorScheme={key.is_active ? "green" : "red"}>{key.is_active ? "Active" : "Inactive"}</Badge></Td>
                <Td>{new Date(key.created_at).toLocaleDateString()}</Td>
                <Td isNumeric>{key.request_count.toLocaleString()}</Td>
                <Td>
                  <IconButton
                    aria-label="Revoke Key"
                    icon={<DeleteIcon />}
                    colorScheme="red"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRevokeClick(key.key_preview)}
                    isLoading={revokeMutation.isPending && keyToRevoke === key.key_preview}
                  />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>

      <Modal isOpen={isModalOpen} onClose={onModalClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Your New API Key</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text mb={2}>Please copy your new key. For security, <b>you will not see it again.</b></Text>
            <Flex align="center" bg="gray.100" _dark={{bg: "gray.700"}} p={3} borderRadius="md">
              <Code flex="1" mr={4}>{newApiKey}</Code>
              <IconButton aria-label="Copy new key" icon={<CopyIcon />} onClick={handleCopyNewKey} />
            </Flex>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={onModalClose}>I have copied my key</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <AlertDialog isOpen={isAlertOpen} leastDestructiveRef={cancelRef} onClose={onAlertClose} isCentered>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader>Revoke API Key</AlertDialogHeader>
            <AlertDialogBody>
              Are you sure? This will permanently disable the key <Code>{keyToRevoke}...</Code>.
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onAlertClose}>Cancel</Button>
              <Button colorScheme="red" onClick={() => revokeMutation.mutate(keyToRevoke!)} ml={3}>Revoke Key</Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
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
      <Container maxW="full">
        <Flex align="center" justify="space-between" py={6} gap={4}>
          <Heading size="md">HTTPS Proxy API</Heading>
        </Flex>

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
            <Tabs isLazy>
              <TabList>
                <Tab fontSize="sm">Get Started</Tab>
                <Tab fontSize="sm">API Keys</Tab>
                <Tab fontSize="sm">Playground</Tab>
              </TabList>
              <TabPanels pt={4}>
                <TabPanel><GetStartedTab /></TabPanel>
                <TabPanel>
                  <ProxyApiKeyManager
                    token={token}
                    keys={apiKeys || []}
                    isLoading={isApiKeysLoading}
                    error={apiKeysError as Error | null}
                    onKeysUpdate={refetchApiKeys}
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

export const Route = createFileRoute("/_layout/web-scraping-tools/https-proxy-api")({
  component: HttpsProxyApiPage,
});

export default HttpsProxyApiPage;