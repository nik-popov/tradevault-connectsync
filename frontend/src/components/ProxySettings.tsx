import React, { useState } from 'react';
import {
  Box,
  VStack,
  Heading,
  Text,
  Button,
  Code,
  HStack,
  Icon,
  Flex,
  Divider,
  Alert,
  AlertIcon,
  Select,
  Input,
  List,
  ListItem,
  ListIcon
} from "@chakra-ui/react";
import { FiGlobe, FiKey, FiSettings, FiCheckCircle, FiLink, FiActivity } from "react-icons/fi";

const ProxySettings = () => {
  const [region, setRegion] = useState("us");
  const [city, setCity] = useState("");
  const [authMethod, setAuthMethod] = useState("username-password");
  const [username, setUsername] = useState("your_username");
  const [password, setPassword] = useState("your_password");
  const [apiKey, setApiKey] = useState("");
  const [proxyPort, setProxyPort] = useState(8080);
  const [protocol, setProtocol] = useState("HTTP");
  const [testResult, setTestResult] = useState(null);
  
  const regions = [
    { code: "us", name: "United States" },
    { code: "eu", name: "Europe" },
    { code: "asia", name: "Asia" },
    { code: "au", name: "Australia" }
  ];

  const handleTestConnection = () => {
    setTestResult("Testing connection... (mock result: Success)");
  };

  return (
    <Box maxW="3xl" mx="auto" px={{ base: 4, md: 8 }} py={8}>
      <VStack spacing={6} align="stretch">
        <Heading size="lg" textAlign="center">Advanced Proxy Configuration</Heading>
        <Divider />
        
        <Box>
          <Text fontWeight="bold" mb={1}>Select Proxy Region:</Text>
          <Select value={region} onChange={(e) => setRegion(e.target.value)}>
            {regions.map((r) => (
              <option key={r.code} value={r.code}>{r.name}</option>
            ))}
          </Select>
        </Box>

        <Box>
          <Text fontWeight="bold" mb={1}>Specify City (Optional):</Text>
          <Input value={city} onChange={(e) => setCity(e.target.value)} placeholder="Enter city name (optional)" />
        </Box>
        
        <Box>
          <Text fontWeight="bold" mb={1}>Authentication Method:</Text>
          <Select value={authMethod} onChange={(e) => setAuthMethod(e.target.value)}>
            <option value="username-password">Username & Password</option>
            <option value="api-key">API Key</option>
          </Select>
        </Box>

        {authMethod === "username-password" ? (
          <Box>
            <Text fontWeight="bold" mb={1}>Authentication:</Text>
            <HStack>
              <Input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" />
              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
            </HStack>
          </Box>
        ) : (
          <Box>
            <Text fontWeight="bold" mb={1}>API Key:</Text>
            <Input type="password" value={apiKey} onChange={(e) => setApiKey(e.target.value)} placeholder="Enter API Key" />
          </Box>
        )}
        
        <Box>
          <Text fontWeight="bold" mb={1}>Select Protocol:</Text>
          <Select value={protocol} onChange={(e) => setProtocol(e.target.value)}>
            <option value="HTTP">HTTP</option>
            <option value="SOCKS5">SOCKS5</option>
          </Select>
        </Box>
        
        <Box>
          <Text fontWeight="bold" mb={1}>Proxy Endpoint:</Text>
          <Code p={3} borderRadius="md" bg="gray.50" fontSize="sm">
            {`${protocol.toLowerCase()}://${region}${city ? `-${city}` : ""}.proxy.yourdomain.com:${proxyPort}`}
          </Code>
        </Box>
        
        <Button leftIcon={<FiCheckCircle />} colorScheme="blue" size="lg" onClick={handleTestConnection}>
          Test Connection
        </Button>
        
        {testResult && (
          <Alert status="info" borderRadius="md">
            <AlertIcon as={FiActivity} boxSize={5} />
            <Text>{testResult}</Text>
          </Alert>
        )}
        
        <Divider />
        <Heading size="md">Proxy Usage</Heading>
        <Text>Below are details on how you are utilizing the proxy services:</Text>
        
        <List spacing={3} mt={4}>
          <ListItem>
            <ListIcon as={FiCheckCircle} color="green.500" />
            Total Requests: 15,234
          </ListItem>
          <ListItem>
            <ListIcon as={FiCheckCircle} color="green.500" />
            Data Transferred: 1.2GB
          </ListItem>
          <ListItem>
            <ListIcon as={FiCheckCircle} color="green.500" />
            Active Connections: 12
          </ListItem>
          <ListItem>
            <ListIcon as={FiCheckCircle} color="green.500" />
            Failed Requests: 45
          </ListItem>
        </List>
        
        <Alert status="success" borderRadius="md" mt={6}>
          <AlertIcon />
          <Text>All proxy usage details are verified and up-to-date.</Text>
        </Alert>
      </VStack>
    </Box>
  );
};

export default ProxySettings;
