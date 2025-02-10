import React, { useState } from 'react';
import {
  Box,
  VStack,
  Heading,
  Text,
  Select,
  Input,
  Button,
  Code,
  HStack,
  Icon,
  Flex,
  Divider,
  Alert,
  AlertIcon
} from "@chakra-ui/react";
import { FiGlobe, FiKey, FiSettings, FiCheckCircle } from "react-icons/fi";

const ProxySettings = () => {
  const [region, setRegion] = useState("us");
  const [username, setUsername] = useState("your_username");
  const [password, setPassword] = useState("your_password");
  const [proxyPort, setProxyPort] = useState(12345);
  
  const regions = [
    { code: "us", name: "United States" },
    { code: "eu", name: "Europe" },
    { code: "asia", name: "Asia" },
    { code: "au", name: "Australia" }
  ];

  return (
    <Box maxW="3xl" mx="auto" px={{ base: 4, md: 8 }} py={8}>
      <VStack spacing={6} align="stretch">
        <Heading size="lg" textAlign="center">Configure Your Endpoint</Heading>
        <Divider />
        
        {/* Region Selection */}
        <Box>
          <Text fontWeight="bold" mb={1}>Select Proxy Region:</Text>
          <Select value={region} onChange={(e) => setRegion(e.target.value)}>
            {regions.map((r) => (
              <option key={r.code} value={r.code}>{r.name}</option>
            ))}
          </Select>
        </Box>
        
        {/* Authentication */}
        <Box>
          <Text fontWeight="bold" mb={1}>Authentication:</Text>
          <HStack>
            <Input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" />
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
          </HStack>
        </Box>
        
        {/* Proxy Endpoint */}
        <Box>
          <Text fontWeight="bold" mb={1}>Proxy Endpoint:</Text>
          <Code p={3} borderRadius="md" bg="gray.50" fontSize="sm">
            {`https://${region}.proxy.yourdomain.com:${proxyPort}`}
          </Code>
        </Box>
        
        {/* Connection Settings */}
        <Box>
          <Text fontWeight="bold" mb={1}>Connection Settings:</Text>
          <Code p={3} borderRadius="md" bg="gray.50" fontSize="sm">
            {`headers = {'User-Agent': 'YourApp/1.0'}`}
          </Code>
        </Box>
        <Button leftIcon={<FiCheckCircle />} colorScheme="blue" size="lg">
          Save Settings
        </Button>
                {/* Verification & Support */}
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