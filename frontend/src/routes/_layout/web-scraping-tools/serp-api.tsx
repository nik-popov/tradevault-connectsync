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
  TableCaption,
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
  HStack,
} from "@chakra-ui/react";
import { CopyIcon, AddIcon, DeleteIcon } from "@chakra-ui/icons";
import ProtectedComponent from "../../../components/Common/ProtectedComponent";
import PlaygroundSerpApi from "../../../components/ScrapingTools/PlaygroundSerp";
// The ApiKeyModule is no longer needed as we've created a custom one.
// import ApiKeyModule from "../../../components/ScrapingTools/ApiKey";

// --- Interfaces and Helper Functions ---
interface Subscription {
  id: string;
  status: string;
  plan_id: string | null;
  plan_name: string | null;
  product_id: string | null;
  product_name: string | null;
  current_period_start: number | null;
  current_period_end: number | null;
  trial_start: number | null;
  trial_end: number | null;
  cancel_at_period_end: boolean;
}

interface ProxyApiAccess {
  has_access: boolean;
  message: string | null;
}

interface ApiKey {
  key_preview: string;
  created_at: string;
  expires_at: string;
  is_active: boolean;
  request_count: number;
}

const API_URL = "https://api.thedataproxy.com/v2";

// --- API Fetching Functions ---

async function fetchFromApi(endpoint: string, token: string, options: RequestInit = {}) {
  if (!token) {
    throw new Error("No access token found. Please log in again.");
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
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
  fetchFromApi("/serp-api/access", token);

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


// --- Code Block Component ---
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
        height="320px"
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
  const API_ENDPOINT = "https://api.thedataproxy.com/v2/serp?q=best%20pizza%20in%20new%20york&engine=google®ion=us-east";
  const CODE_EXAMPLES = {
    curl: `curl -X GET "${API_ENDPOINT}" \\
  -H "x-api-key: YOUR_API_KEY"`,
    python: `import requests

api_key = "YOUR_API_KEY"
url = "https://api.thedataproxy.com/v2/serp"

params = {
    "q": "best pizza in new york",
    "engine": "google",
    "region": "us-east"
}
headers = {
    "x-api-key": api_key
}

response = requests.get(url, params=params, headers=headers)

if response.status_code == 200:
    print(response.json())
else:
    print(f"Error: {response.status_code}")
    print(response.text)`,
    javascript: `// Using node-fetch, or native fetch in browser/deno/node 18+
import fetch from 'node-fetch';

const apiKey = 'YOUR_API_KEY';
const url = new URL('https://api.thedataproxy.com/v2/serp');

const params = {
    q: 'best pizza in new york',
    engine: 'google',
    region: 'us-east'
};
Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));

const options = {
    method: 'GET',
    headers: {
        'x-api-key': apiKey,
        'Accept': 'application/json'
    }
};

fetch(url, options)
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
      Welcome to the SERP API. This tool allows you to programmatically fetch search engine results pages.
      To get started, create an API key in the API Keys tab and use it in your requests.
    </Text>

    <Heading size="md" mb={4}>Quick Start Examples</Heading>
    <Text mb={4}>
      Here are some basic examples to help you make your first request. Remember to replace <Code>YOUR_API_KEY</Code> with your actual key.
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

    <Box mt={8} p={4} borderWidth="1px" borderRadius="md">
      <Heading size="md" mb={4}>Need Help?</Heading>
      <Text fontSize="md">
        If you have questions or run into issues, we're here to help.
        Check out our detailed{" "}
        <Link color="blue.500" href="/documentation/serp-api" isExternal>
          API Documentation
        </Link>{" "}
        for more examples and advanced usage. For further assistance, please contact our{" "}
        <Link color="blue.500" href="/support" isExternal>
          Support Center
        </Link>.
      </Text>
    </Box>
  </Box>
  );
};


// --- API Keys Manager Tab Component ---
const SerpApiKeyManager = ({ token, keys, isLoading, error, onKeysUpdate }: {
  token: string;
  keys: ApiKey[];
  isLoading: boolean;
  error: Error | null;
  onKeysUpdate: () => void;
}) => {
  const toast = useToast();
  const queryClient = useQueryClient();
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
      onKeysUpdate(); // Refetch the list of keys
      toast({ title: "API Key created successfully!", status: "success", duration: 3000, isClosable: true });
    },
    onError: (error: Error) => {
      toast({ title: "Error creating key", description: error.message, status: "error", duration: 5000, isClosable: true });
    }
  });

  const revokeMutation = useMutation({
    mutationFn: (keyPreview: string) => revokeExistingApiKey(token, keyPreview),
    onSuccess: () => {
      onKeysUpdate(); // Refetch the list of keys
      toast({ title: "API Key revoked.", status: "info", duration: 3000, isClosable: true });
    },
    onError: (error: Error) => {
      toast({ title: "Error revoking key", description: error.message, status: "error", duration: 5000, isClosable: true });
    },
    onSettled: () => {
      setKeyToRevoke(null);
      onAlertClose();
    }
  });

  const handleCopyNewKey = () => {
    onCopy();
    toast({ title: "New API key copied to clipboard!", status: "success", duration: 2000, isClosable: true });
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
            <Heading size="sm">Manage Your API Keys</Heading>
            <Text fontSize="sm" color="gray.500">These keys are used to authenticate your requests to the SERP API.</Text>
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
          {!keys.length && <TableCaption>You haven't created any API keys yet.</TableCaption>}
          <Thead>
            <Tr>
              <Th>Key Preview</Th>
              <Th>Status</Th>
              <Th>Created At</Th>
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

      {/* Modal for displaying the new API key */}
      <Modal isOpen={isModalOpen} onClose={onModalClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Your New API Key</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text mb={2}>Please copy your new API key. For security reasons, <b>you will not be able to see it again.</b></Text>
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

      {/* Alert Dialog for confirming key revocation */}
      <AlertDialog
        isOpen={isAlertOpen}
        leastDestructiveRef={cancelRef}
        onClose={onAlertClose}
        isCentered
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Revoke API Key
            </AlertDialogHeader>
            <AlertDialogBody>
              Are you sure? You can't undo this action afterwards. This will immediately disable the key <Code>{keyToRevoke}...</Code>.
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onAlertClose}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={() => revokeMutation.mutate(keyToRevoke!)} ml={3}>
                Revoke Key
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
};


// --- Main SERP API Page Component ---
const SerpApiPage = () => {
  const token = localStorage.getItem("access_token") || "";

  const { data: subscriptions, isLoading: isSubscriptionsLoading, error: subscriptionsError } = useQuery({
    queryKey: ["subscriptions"],
    queryFn: () => fetchSubscriptions(token),
    enabled: !!token,
    staleTime: 5 * 60 * 1000,
  });

  const { data: proxyApiAccess, isLoading: isAccessLoading, error: accessError } = useQuery({
    queryKey: ["proxyApiAccess"],
    queryFn: () => fetchProxyApiAccess(token),
    enabled: !!token,
    staleTime: 5 * 60 * 1000,
  });

  const { data: apiKeys, isLoading: isApiKeysLoading, error: apiKeysError, refetch: refetchApiKeys } = useQuery({
    queryKey: ["apiKeys"],
    queryFn: () => fetchApiKeys(token),
    enabled: !!token,
    staleTime: 5 * 60 * 1000,
  });

  const hasActiveSubscription = subscriptions?.some(
    (sub) => ["active", "trialing"].includes(sub.status)
  ) || false;

  const isLoading = isSubscriptionsLoading || isAccessLoading || isApiKeysLoading;
  const error = subscriptionsError || accessError || apiKeysError;

  return (
    <ProtectedComponent>
      <Container maxW="full">
        <Flex align="center" justify="space-between" py={6} gap={4}>
          <Heading size="md">SERP API</Heading>
        </Flex>

        {isLoading ? (
          <Text fontSize="sm">Loading user details...</Text>
        ) : error ? (
          <Alert status="error">
            <AlertIcon />
            <Text fontSize="sm">
              Error: {error.message || "Failed to load user details. Please try again later."}
            </Text>
          </Alert>
        ) : !hasActiveSubscription ? (
          <Alert status="warning">
            <AlertIcon />
            <Text fontSize="sm">No active subscription found. Please subscribe to a plan to use the SERP API.</Text>
          </Alert>
        ) : (
          <>
            {!proxyApiAccess?.has_access && (
              <Alert status="warning" mb={4}>
                <AlertIcon />
                <Text fontSize="sm">
                  {proxyApiAccess?.message || "Your current plan does not include SERP API access. Please upgrade to an eligible plan."}
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
                  <SerpApiKeyManager 
                    token={token}
                    keys={apiKeys || []} 
                    isLoading={isApiKeysLoading}
                    error={apiKeysError}
                    onKeysUpdate={refetchApiKeys}
                  />
                </TabPanel>
                <TabPanel><PlaygroundSerpApi /></TabPanel>
              </TabPanels>
            </Tabs>
          </>
        )}
      </Container>
    </ProtectedComponent>
  );
};

// --- Route Definition ---
export const Route = createFileRoute("/_layout/web-scraping-tools/serp-api")({
  component: SerpApiPage,
});

export default SerpApiPage;