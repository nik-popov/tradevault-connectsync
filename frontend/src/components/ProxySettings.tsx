import React, { useState } from 'react';
import {
  Box,
  VStack,
  Heading,
  Text,
  Button,
  Code,
  HStack,
  Divider,
  Alert,
  AlertIcon,
  Select,
  Input
} from "@chakra-ui/react";
import { FiCheckCircle, FiActivity } from "react-icons/fi";

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
    <Box p={4} borderWidth="1px" borderRadius="md">
      <VStack spacing={8} align="stretch">
        
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
          <Code p={3} borderRadius="md" bg="gray.700" fontSize="sm">
            {`${protocol.toLowerCase()}://${region}${city ? `-${city}` : ""}.proxy.yourdomain.com:${proxyPort}`}
          </Code>
        </Box>
        
        <Box>
          <Text fontWeight="bold" mb={1}>Connection Settings:</Text>
          <Code p={3} borderRadius="md" bg="gray.700" fontSize="sm">
            {`headers = {'User-Agent': 'YourApp/1.0'}`}
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
        
        <Alert status="success" borderRadius="md">
          <AlertIcon as={FiCheckCircle} boxSize={5} />
          <Box>
            <Text fontWeight="bold">Verify Your Setup</Text>
            <Text fontSize="sm">
              Test your connection using the examples above. If your IP is masked, you're all set! 
              Need help? Visit our <Button variant="link" colorScheme="blue" size="sm">troubleshooting guide</Button> or contact support.
            </Text>
          </Box>
        </Alert>
      </VStack>
    </Box>
  );
};

export default ProxySettings;
