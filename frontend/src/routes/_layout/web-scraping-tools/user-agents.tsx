import { useState, useRef } from "react";
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
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Textarea,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import { CopyIcon, ChevronDownIcon, EditIcon, DeleteIcon, AddIcon, RepeatIcon } from "@chakra-ui/icons";

// --- API Configuration & Types ---
const API_BASE_URL = "https://api.thedataproxy.com/v2";

interface UserAgentPublic {
  id: string;
  user_agent: string;
  created_at: string;
  device?: string;
  browser?: string;
  os?: string;
}

interface UserAgentsPublic {
  data: UserAgentPublic[];
  count: number;
}

interface UserAgentCreate {
    user_agent: string;
}

interface UserAgentUpdate {
    user_agent?: string;
}

interface UpdateSourceResponse {
    status: string;
    new_agents_added: number;
    [key: string]: any;
}

// --- Mock Auth Hook (replace with your actual auth logic) ---
const useAuth = () => {
  // To test the different views, manually toggle this value:
  // - Set to `true` to see the admin controls (as if you're a logged-in superuser).
  // - Set to `false` to see the public, read-only view.
  const [isSuperuser] = useState(true); 
  return { isSuperuser };
};


// --- Utility Functions ---
function convertToCSV(data: UserAgentPublic[]): string {
    if (data.length === 0) return "";
    const headers = "id,user_agent,created_at";
    const rows = data.map(row => {
        const id = `"${row.id}"`;
        const userAgent = `"${row.user_agent.replace(/"/g, '""')}"`;
        const createdAt = `"${row.created_at}"`;
        return [id, userAgent, createdAt].join(',');
    });
    return [headers, ...rows].join('\n');
}

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
    if (!token) throw new Error("No access token found. Please log in to perform this action.");
    return token;
};

// (READ) Fetch paginated user agents for table view - Public
async function fetchPaginatedUserAgents(skip: number, limit: number): Promise<UserAgentsPublic> {
    const response = await fetch(`${API_BASE_URL}/user-agents/?skip=${skip}&limit=${limit}`);
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: "Failed to fetch user agents" }));
        throw new Error(errorData.detail);
    }
    return response.json();
}

// (READ ALL) Fetch ALL user agents for export - Public
async function fetchAllUserAgents(): Promise<UserAgentPublic[]> {
    const response = await fetch(`${API_BASE_URL}/user-agents/?limit=10000`);
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: "Failed to fetch all user agents" }));
        throw new Error(errorData.detail);
    }
    const result: UserAgentsPublic = await response.json();
    return result.data;
}

// (UPDATE FROM SOURCE) Trigger the scraper - Superuser Only
async function updateUserAgentsFromSource(): Promise<UpdateSourceResponse> {
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/user-agents/update-from-source/`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: "Failed to update from source" }));
        throw new Error(errorData.detail);
    }
    return response.json();
}

// (CREATE) Add a new user agent - Superuser Only
async function createUserAgent(data: UserAgentCreate): Promise<UserAgentPublic> {
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/user-agents/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(data),
    });
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: "Failed to create user agent" }));
        throw new Error(errorData.detail);
    }
    return response.json();
}

// (UPDATE) Update an existing user agent - Superuser Only
async function updateUserAgent({ id, data }: { id: string, data: UserAgentUpdate }): Promise<UserAgentPublic> {
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/user-agents/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(data),
    });
     if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: "Failed to update user agent" }));
        throw new Error(errorData.detail);
    }
    return response.json();
}

// (DELETE) Delete a user agent - Superuser Only
async function deleteUserAgent(id: string): Promise<void> {
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/user-agents/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok && response.status !== 204) {
         const errorData = await response.json().catch(() => ({ detail: "Failed to delete user agent" }));
        throw new Error(errorData.detail);
    }
}


// --- Reusable Components ---
const CopyCell = ({ textToCopy }: { textToCopy: string }) => {
    const { onCopy } = useClipboard(textToCopy);
    const toast = useToast();
    const handleCopy = () => {
        onCopy();
        toast({ title: "Copied to clipboard!", status: "success", duration: 2000, isClosable: true });
    };
    return (<IconButton aria-label="Copy user agent" icon={<CopyIcon />} size="sm" onClick={handleCopy} variant="ghost" />);
};

const AddEditUserAgentModal = ({ isOpen, onClose, onSubmit, initialData, isLoading }: { isOpen: boolean; onClose: () => void; onSubmit: (data: UserAgentCreate | UserAgentUpdate) => void; initialData?: UserAgentPublic | null; isLoading: boolean; }) => {
  const [userAgent, setUserAgent] = useState(initialData?.user_agent || "");
  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); onSubmit({ user_agent: userAgent }); };
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent as="form" onSubmit={handleSubmit}>
        <ModalHeader>{initialData ? 'Edit User Agent' : 'Add New User Agent'}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl isRequired>
            <FormLabel>User Agent String</FormLabel>
            <Textarea value={userAgent} onChange={(e) => setUserAgent(e.target.value)} placeholder="e.g. Mozilla/5.0 (Windows NT 10.0; Win64; x64)..." rows={5} />
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>Cancel</Button>
          <Button colorScheme="teal" type="submit" isLoading={isLoading}>{initialData ? 'Save Changes' : 'Create'}</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

const DeleteConfirmationDialog = ({ isOpen, onClose, onConfirm, isLoading }: { isOpen: boolean, onClose: () => void, onConfirm: () => void, isLoading: boolean, }) => {
    const cancelRef = useRef<HTMLButtonElement>(null);
    return (
        <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose}>
            <AlertDialogOverlay>
                <AlertDialogContent>
                    <AlertDialogHeader fontSize="lg" fontWeight="bold">Delete User Agent</AlertDialogHeader>
                    <AlertDialogBody>Are you sure you want to delete this user agent? This action cannot be undone.</AlertDialogBody>
                    <AlertDialogFooter>
                        <Button ref={cancelRef} onClick={onClose}>Cancel</Button>
                        <Button colorScheme="red" onClick={onConfirm} ml={3} isLoading={isLoading}>Delete</Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialogOverlay>
        </AlertDialog>
    );
};


// --- Main Page Component ---
function UserAgentsPage() {
  const [page, setPage] = useState(0);
  const [limit] = useState(25);
  const [editingAgent, setEditingAgent] = useState<UserAgentPublic | null>(null);
  const [deletingAgentId, setDeletingAgentId] = useState<string | null>(null);

  const { isOpen: isAddEditModalOpen, onOpen: onAddEditModalOpen, onClose: onAddEditModalClose } = useDisclosure();
  const { isOpen: isDeleteAlertOpen, onOpen: onDeleteAlertOpen, onClose: onDeleteAlertClose } = useDisclosure();

  const toast = useToast();
  const queryClient = useQueryClient();
  const { isSuperuser } = useAuth();

  const { data, isLoading, error, isPlaceholderData } = useQuery({
    queryKey: ["userAgents", page, limit],
    queryFn: () => fetchPaginatedUserAgents(page * limit, limit),
    placeholderData: keepPreviousData,
  });

  const totalPages = data ? Math.ceil(data.count / limit) : 0;

  // --- MUTATIONS ---
  const handleMutationError = (e: Error) => {
    toast({ title: "An error occurred", description: e.message, status: "error", duration: 5000, isClosable: true });
  };
  
  const handleCRUDSuccess = (message: string) => {
    toast({ title: message, status: "success", duration: 3000, isClosable: true });
    queryClient.invalidateQueries({ queryKey: ["userAgents"] });
    onAddEditModalClose();
    onDeleteAlertClose();
  };

  const createMutation = useMutation({ mutationFn: createUserAgent, onSuccess: () => handleCRUDSuccess("User agent created."), onError: handleMutationError });
  const updateMutation = useMutation({ mutationFn: updateUserAgent, onSuccess: () => handleCRUDSuccess("User agent updated."), onError: handleMutationError });
  const deleteMutation = useMutation({ mutationFn: deleteUserAgent, onSuccess: () => handleCRUDSuccess("User agent deleted."), onError: handleMutationError });
  
  const updateFromSourceMutation = useMutation({
    mutationFn: updateUserAgentsFromSource,
    onSuccess: (data) => {
        toast({
            title: "Update from source complete",
            description: `${data.new_agents_added} new agents were added. The table has been refreshed.`,
            status: "success",
            duration: 5000,
            isClosable: true,
        });
        queryClient.invalidateQueries({ queryKey: ["userAgents"] });
    },
    onError: handleMutationError,
  });

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
    onSuccess: () => { toast({ title: "Export started.", description: "Your file is downloading.", status: "success", duration: 3000, isClosable: true, }); },
    onError: (e: Error) => { toast({ title: "Export Failed", description: e.message, status: "error", duration: 5000, isClosable: true, }); }
  });

  // --- EVENT HANDLERS ---
  const handleOpenAddModal = () => { setEditingAgent(null); onAddEditModalOpen(); };
  const handleOpenEditModal = (agent: UserAgentPublic) => { setEditingAgent(agent); onAddEditModalOpen(); };
  const handleOpenDeleteAlert = (id: string) => { setDeletingAgentId(id); onDeleteAlertOpen(); }
  const handleFormSubmit = (formData: UserAgentCreate | UserAgentUpdate) => {
    if (editingAgent) { updateMutation.mutate({ id: editingAgent.id, data: formData }); } 
    else { createMutation.mutate(formData as UserAgentCreate); }
  };
  const handleDeleteConfirm = () => { if(deletingAgentId) { deleteMutation.mutate(deletingAgentId); } }

  return (
    <>
      <Container maxW="full" py={6}>
        <Flex justify="space-between" align="center" mb={6}>
          <Heading size="lg">Active User Agents</Heading>
          <HStack spacing={2}>
            {isSuperuser && (
              <>
                <Button
                    leftIcon={<RepeatIcon />}
                    colorScheme="blue"
                    onClick={() => updateFromSourceMutation.mutate()}
                    isLoading={updateFromSourceMutation.isPending}
                    loadingText="Updating..."
                >
                    Refresh
                </Button>
                <Button leftIcon={<AddIcon />} colorScheme="teal" onClick={handleOpenAddModal}>
                   sAdd
                </Button>
              </>
            )}
            <Menu>
              <MenuButton as={Button} rightIcon={<ChevronDownIcon />} isLoading={exportMutation.isPending} loadingText="Exporting">
                Export
              </MenuButton>
              <MenuList>
                <MenuItem onClick={() => exportMutation.mutate('csv')}>Export as CSV</MenuItem>
                <MenuItem onClick={() => exportMutation.mutate('json')}>Export as JSON</MenuItem>
              </MenuList>
            </Menu>
          </HStack>
        </Flex>

        {isLoading && !isPlaceholderData && (
          <Flex justify="center" align="center" height="200px"><Spinner size="xl" /></Flex>
        )}

        {error && (
          <Alert status="error"><AlertIcon />{error.message}</Alert>
        )}

        {data && (
          <Box borderWidth="1px" borderRadius="lg" overflowX="auto">
            <Table variant="simple">
              <Thead bg="gray.50">
                <Tr>
                  <Th>User Agent String</Th>
                  <Th>Created At</Th>
                  <Th>Copy</Th>
                  {isSuperuser && <Th isNumeric>Actions</Th>}
                </Tr>
              </Thead>
              <Tbody>
                {data.data.map((agent) => (
                  <Tr key={agent.id} opacity={isPlaceholderData ? 0.5 : 1}>
                    <Td maxW="600px" whiteSpace="normal" wordBreak="break-all">{agent.user_agent}</Td>
                    <Td>{new Date(agent.created_at).toLocaleString()}</Td>
                    <Td><CopyCell textToCopy={agent.user_agent} /></Td>
                    {isSuperuser && (
                        <Td isNumeric>
                            <HStack spacing={2} justify="flex-end">
                                <IconButton aria-label="Edit" icon={<EditIcon />} size="sm" onClick={() => handleOpenEditModal(agent)} />
                                <IconButton aria-label="Delete" icon={<DeleteIcon />} colorScheme="red" size="sm" onClick={() => handleOpenDeleteAlert(agent.id)} />
                            </HStack>
                        </Td>
                    )}
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
      
      {isSuperuser && (
        <>
            <AddEditUserAgentModal
                isOpen={isAddEditModalOpen}
                onClose={onAddEditModalClose}
                onSubmit={handleFormSubmit}
                initialData={editingAgent}
                isLoading={createMutation.isPending || updateMutation.isPending}
            />
            <DeleteConfirmationDialog 
                isOpen={isDeleteAlertOpen}
                onClose={onDeleteAlertClose}
                onConfirm={handleDeleteConfirm}
                isLoading={deleteMutation.isPending}
            />
        </>
      )}
    </>
  );
}

// --- Route Definition ---
export const Route = createFileRoute("/_layout/web-scraping-tools/user-agents")({
  component: UserAgentsPage,
});

export default UserAgentsPage;