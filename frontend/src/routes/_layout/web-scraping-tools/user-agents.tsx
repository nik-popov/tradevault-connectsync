import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  IconButton,
  Spinner,
  Alert,
  AlertIcon,
  useToast,
  HStack,
  Text,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useClipboard,
} from "@chakra-ui/react";
import { CopyIcon, ChevronDownIcon } from "@chakra-ui/icons";
import ProtectedComponent from "../../../components/Common/ProtectedComponent";

// --- API Configuration & Types ---
const API_BASE_URL = "https://api.thedataproxy.com/v2";

interface UserAgentPublic {
  id: string;
  user_agent: string;
  created_at: string;
}

interface UserAgentsPublic {
  data: UserAgentPublic[];
  count: number;
}

// --- Utility Functions ---

// Converts an array of objects to a CSV string
function convertToCSV(data: UserAgentPublic[]): string {
  if (data.length === 0) return "";
  const headers = "id,user_agent,created_at";
  const rows = data.map(row => {
    const id = `"${row.id}"`;
    // Escape double quotes within the user agent string by doubling them up
    const userAgent = `"${row.user_agent.replace(/"/g, '""')}"`;
    const createdAt = `"${row.created_at}"`;
    return [id, userAgent, createdAt].join(',');
  });
  return [headers, ...rows].join('\n');
}

// Triggers a file download in the browser
function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// --- API Helper Functions ---

const getAuthToken = () => {
    const token = localStorage.getItem("access_token");
    if (!token) throw new Error("No access token found. Please log in.");
    return token;
};

// Fetch paginated user agents for table view
async function fetchPaginatedUserAgents(skip: number, limit: number): Promise<UserAgentsPublic> {
  const token = getAuthToken();
  const response = await fetch(`${API_BASE_URL}/user-agents/?skip=${skip}&limit=${limit}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: "Failed to fetch user agents" }));
    throw new Error(errorData.detail);
  }
  return response.json();
}

// Fetch ALL user agents for export
async function fetchAllUserAgents(): Promise<UserAgentPublic[]> {
  const token = getAuthToken();
  // We fetch a very large number to get all items. Adjust if your API has a better way to fetch all.
  const response = await fetch(`${API_BASE_URL}/user-agents/?limit=10000`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: "Failed to fetch all user agents" }));
    throw new Error(errorData.detail);
  }
  const result: UserAgentsPublic = await response.json();
  return result.data;
}


// --- Reusable Copy-to-Clipboard Component ---
const CopyCell = ({ textToCopy }: { textToCopy: string }) => {
    const { onCopy, hasCopied } = useClipboard(textToCopy);
    const toast = useToast();

    const handleCopy = () => {
        onCopy();
        toast({
            title: "Copied to clipboard!",
            status: "success",
            duration: 2000,
            isClosable: true,
        });
    };

    return (
        <IconButton
            aria-label="Copy user agent"
            icon={<CopyIcon />}
            size="sm"
            onClick={handleCopy}
            colorScheme={hasCopied ? "teal" : "gray"}
            variant="ghost"
        />
    );
};


// --- Main Page Component ---
function UserAgentsReadOnlyPage() {
  const [page, setPage] = useState(0);
  const [limit] = useState(25);
  const toast = useToast();

  // Query for the paginated table view
  const { data, isLoading, error, isPlaceholderData } = useQuery({
    queryKey: ["userAgents", page, limit],
    queryFn: () => fetchPaginatedUserAgents(page * limit, limit),
    placeholderData: keepPreviousData,
  });

  const totalPages = data ? Math.ceil(data.count / limit) : 0;

  // Mutation for handling the export process
  const exportMutation = useMutation({
    mutationFn: async (format: 'csv' | 'json') => {
        const allAgents = await fetchAllUserAgents();
        if (format === 'csv') {
            const csvContent = convertToCSV(allAgents);
            downloadFile(csvContent, 'user-agents.csv', 'text/csv');
        } else {
            const jsonContent = JSON.stringify(allAgents, null, 2);
            downloadFile(jsonContent, 'user-agents.json', 'application/json');
        }
    },
    onSuccess: () => {
        toast({
            title: "Export started.",
            description: "Your file is downloading.",
            status: "success",
            duration: 3000,
            isClosable: true,
        });
    },
    onError: (e: Error) => {
        toast({
            title: "Export Failed",
            description: e.message,
            status: "error",
            duration: 5000,
            isClosable: true,
        });
    }
  });

  return (
    <ProtectedComponent>
      <Container maxW="full" py={6}>
        <Flex justify="space-between" align="center" mb={6}>
          <Heading size="lg">Active User Agents</Heading>
          <Menu>
            <MenuButton
              as={Button}
              rightIcon={<ChevronDownIcon />}
              colorScheme="teal"
              isLoading={exportMutation.isPending}
              loadingText="Exporting"
            >
              Export
            </MenuButton>
            <MenuList>
              <MenuItem onClick={() => exportMutation.mutate('csv')}>Export as CSV</MenuItem>
              <MenuItem onClick={() => exportMutation.mutate('json')}>Export as JSON</MenuItem>
            </MenuList>
          </Menu>
        </Flex>

        {isLoading && !isPlaceholderData && (
          <Flex justify="center" align="center" height="200px">
            <Spinner size="xl" />
          </Flex>
        )}

        {error && (
          <Alert status="error">
            <AlertIcon />
            {error.message}
          </Alert>
        )}

        {data && (
          <Box borderWidth="1px" borderRadius="lg" overflow="hidden">
            <Table variant="simple">
              <Thead bg="gray.50">
                <Tr>
                  <Th>User Agent String</Th>
                  <Th>Created At</Th>
                  <Th isNumeric>Copy</Th>
                </Tr>
              </Thead>
              <Tbody>
                {data.data.map((agent) => (
                  <Tr key={agent.id} opacity={isPlaceholderData ? 0.5 : 1}>
                    <Td maxW="600px" whiteSpace="normal" wordBreak="break-all">{agent.user_agent}</Td>
                    <Td>{new Date(agent.created_at).toLocaleString()}</Td>
                    <Td isNumeric>
                      <CopyCell textToCopy={agent.user_agent} />
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
             <Flex justify="space-between" p={4} align="center" borderTopWidth="1px">
                <Text fontSize="sm" color="gray.600">
                    Showing <strong>{data.data.length}</strong> of <strong>{data.count}</strong> results
                </Text>
                <HStack>
                    <Button onClick={() => setPage(p => Math.max(0, p - 1))} isDisabled={page === 0}>
                        Previous
                    </Button>
                    <Text fontSize="sm" mx={4}>Page {page + 1} of {totalPages || 1}</Text>
                    <Button onClick={() => setPage(p => p + 1)} isDisabled={page + 1 >= totalPages || isPlaceholderData}>
                        Next
                    </Button>
                </HStack>
            </Flex>
          </Box>
        )}
      </Container>
    </ProtectedComponent>
  );
}

// --- Route Definition ---
// Update the route to match your file's location
export const Route = createFileRoute("/_layout/web-scraping-tools/user-agents")({
  component: UserAgentsReadOnlyPage,
});

export default UserAgentsReadOnlyPage;