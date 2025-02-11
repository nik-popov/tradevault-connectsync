  import { useState } from "react";
  import {
    Box,
    Text,
    Button,
    VStack,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Input,
    Alert,
    AlertIcon,
    Spinner
  } from "@chakra-ui/react";
  import { useQuery, useMutation } from "@tanstack/react-query";
  
import { createFileRoute } from '@tanstack/react-router';

// Define your route component (if needed)
const ProxyComponentsRoute = () => {
    // Possibly render something or just act as a container for the subcomponents?
    return null;
  };
  
  export const Route = createFileRoute('/_layout/proxies/ProxyComponents')({
    component: ProxyComponentsRoute,
  });
  
  const fetchTopUps = async () => []; // Replace with API call later
  const fetchConnections = async () => [];
  const fetchLogs = async () => [];
  const fetchKeys = async () => [];
  const fetchReactivationOptions = async () => [];
  
  const TopUps = () => {
    const { data: topUps, isLoading, error } = useQuery(["topUps"], fetchTopUps);
    return (
      <Box p={4} borderWidth={1} borderRadius="md">
        <Text fontSize="xl" mb={4}>Top-Ups</Text>
        {isLoading ? <Spinner /> : error ? <Alert status="error"><AlertIcon />Error loading data</Alert> : (
          <Table variant="simple">
            <Thead><Tr><Th>ID</Th><Th>Amount</Th><Th>Date</Th></Tr></Thead>
            <Tbody>{topUps.map((topUp) => <Tr key={topUp.id}><Td>{topUp.id}</Td><Td>{topUp.amount}</Td><Td>{topUp.date}</Td></Tr>)}</Tbody>
          </Table>
        )}
        <Button mt={4} colorScheme="blue">Add Top-Up</Button>
      </Box>
    );
  };
  
  const Connections = () => {
    const { data: connections, isLoading, error } = useQuery(["connections"], fetchConnections);
    return (
      <Box p={4} borderWidth={1} borderRadius="md">
        <Text fontSize="xl" mb={4}>Connections</Text>
        {isLoading ? <Spinner /> : error ? <Alert status="error"><AlertIcon />Error loading connections</Alert> : (
          <Table variant="simple">
            <Thead><Tr><Th>IP</Th><Th>Status</Th><Th>Last Used</Th></Tr></Thead>
            <Tbody>{connections.map((conn) => <Tr key={conn.id}><Td>{conn.ip}</Td><Td>{conn.status}</Td><Td>{conn.last_used}</Td></Tr>)}</Tbody>
          </Table>
        )}
      </Box>
    );
  };
  
  const Logs = () => {
    const { data: logs, isLoading, error } = useQuery(["logs"], fetchLogs);
    return (
      <Box p={4} borderWidth={1} borderRadius="md">
        <Text fontSize="xl" mb={4}>Logs</Text>
        {isLoading ? <Spinner /> : error ? <Alert status="error"><AlertIcon />Error loading logs</Alert> : (
          <Table variant="simple">
            <Thead><Tr><Th>Timestamp</Th><Th>Message</Th></Tr></Thead>
            <Tbody>{logs.map((log) => <Tr key={log.id}><Td>{log.timestamp}</Td><Td>{log.message}</Td></Tr>)}</Tbody>
          </Table>
        )}
      </Box>
    );
  };
  
  const KeyManagement = () => {
    const [newKey, setNewKey] = useState("");
    const { data: keys, isLoading, error } = useQuery(["keys"], fetchKeys);
    const mutation = useMutation(() => Promise.resolve()); // Replace with API call
  
    const addKey = () => mutation.mutate(newKey);
  
    return (
      <Box p={4} borderWidth={1} borderRadius="md">
        <Text fontSize="xl" mb={4}>Key Management</Text>
        {isLoading ? <Spinner /> : error ? <Alert status="error"><AlertIcon />Error loading keys</Alert> : (
          <VStack align="stretch">
            {keys.map((key) => <Text key={key.id}>{key.value}</Text>)}
            <Input placeholder="New Key" value={newKey} onChange={(e) => setNewKey(e.target.value)} />
            <Button mt={2} colorScheme="blue" onClick={addKey}>Add Key</Button>
          </VStack>
        )}
      </Box>
    );
  };
  
  const ReactivationOptions = () => {
    const { data: options, isLoading, error } = useQuery(["reactivationOptions"], fetchReactivationOptions);
    return (
      <Box p={4} borderWidth={1} borderRadius="md">
        <Text fontSize="xl" mb={4}>Reactivation Options</Text>
        {isLoading ? <Spinner /> : error ? <Alert status="error"><AlertIcon />Error loading options</Alert> : (
          <VStack align="stretch">
            {options.map((opt) => <Button key={opt.id} colorScheme="blue">{opt.name}</Button>)}
          </VStack>
        )}
      </Box>
    );
  };
  
  export { TopUps, Connections, Logs, KeyManagement, ReactivationOptions };
