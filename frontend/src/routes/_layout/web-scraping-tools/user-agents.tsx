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
// ✅ Added RepeatIcon for the refresh button
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
// ✅ Added type for the update-from-source response
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
async function fetchPaginatedUserAgents(skip: number, limit: number): Promise<UserAgentsPublic> {
    const response = await fetch(`${API_BASE_URL}/user-agents/?skip=${skip}&limit=${limit}`);
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: "Failed to fetch user agents" }));
        throw new Error(errorData.detail);
    }
    return response.json();
}
async function fetchAllUserAgents(): Promise<UserAgentPublic[]> {
    const response = await fetch(`${API_BASE_URL}/user-agents/?limit=10000`);
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: "Failed to fetch all user agents" }));
        throw new Error(errorData.detail);
    }
    const result: UserAgentsPublic = await response.json();
    return result.data;
}

// ✅ (UPDATE FROM SOURCE) Trigger the scraper - Superuser Only
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
const CopyCell = ({ textToCopy }: { textToCopy: string }) => { /* ... (unchanged) */ };
const AddEditUserAgentModal = ({ isOpen, onClose, onSubmit, initialData, isLoading }: { /* ... */ }) => { /* ... (unchanged) */ };
const DeleteConfirmationDialog = ({ isOpen, onClose, onConfirm, isLoading }: { /* ... */ }) => { /* ... (unchanged) */ };

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

  const createMutation = useMutation({ mutationFn: createUserAgent, onSuccess: () => handleCRUDSuccess("User agent created successfully."), onError: handleMutationError });
  const updateMutation = useMutation({ mutationFn: updateUserAgent, onSuccess: () => handleCRUDSuccess("User agent updated successfully."), onError: handleMutationError });
  const deleteMutation = useMutation({ mutationFn: deleteUserAgent, onSuccess: () => handleCRUDSuccess("User agent deleted successfully."), onError: handleMutationError });
  
  // ✅ New mutation for updating from source
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

  const exportMutation = useMutation({ /* ... (unchanged) */ });

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
          <Heading size="lg">User Agents</Heading>
          <HStack spacing={2}>
            {/* ✅ Admin controls are grouped together and conditional */}
            {isSuperuser && (
              <>
                <Button
                    leftIcon={<RepeatIcon />}
                    colorScheme="blue"
                    onClick={() => updateFromSourceMutation.mutate()}
                    isLoading={updateFromSourceMutation.isPending}
                    loadingText="Updating..."
                >
                    Update from Source
                </Button>
                <Button leftIcon={<AddIcon />} colorScheme="teal" onClick={handleOpenAddModal}>
                    Add New
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

        {isLoading && !isPlaceholderData && ( <Flex justify="center" align="center" height="200px"><Spinner size="xl" /></Flex> )}
        {error && ( <Alert status="error"><AlertIcon />{error.message}</Alert> )}

        {data && (
          <Box borderWidth="1px" borderRadius="lg" overflowX="auto">
            <Table variant="simple">
              <Thead bg="gray.50">
                <Tr>
                  <Th>User Agent String</Th>
                  <Th>Created At</Th>
                  <Th>Copy</Th>
                  {/* ✅ "Actions" column header is now conditional */}
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