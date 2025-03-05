import {
  Container,
  Text,
  Button,
  HStack,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Divider,
  Flex,
  useToast,
  Badge,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";

const EndpointSettings = () => {
  const toast = useToast();
  const [endpoints, setEndpoints] = useState([]);
  const fetchEndpoints = [
    "https://southamerica-west1-image-scraper-451516.cloudfunctions.net/main",
    "https://us-central1-image-scraper-451516.cloudfunctions.net/main",
    "https://us-east1-image-scraper-451516.cloudfunctions.net/main",
    "https://us-east4-image-scraper-451516.cloudfunctions.net/main",
    "https://us-west1-image-scraper-451516.cloudfunctions.net/main",
  ];

  // Check endpoint health (JavaScript equivalent of Python function)
  const checkEndpointHealth = async (endpoint, timeout = 5000) => {
    const healthUrl = `${endpoint}/health/google`;
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      const response = await fetch(healthUrl, {
        signal: controller.signal,
        mode: 'cors',
      });
      
      clearTimeout(timeoutId);
      return response.ok;
    } catch (error) {
      console.error(`Health check failed for ${endpoint}:`, error);
      return false;
    }
  };

  // Initialize and update endpoint status
  const updateEndpointStatus = async () => {
    const statusPromises = fetchEndpoints.map(async (url, index) => ({
      id: index + 1,
      url,
      status: await checkEndpointHealth(url),
      lastChecked: new Date().toLocaleTimeString(),
    }));
    
    const updatedEndpoints = await Promise.all(statusPromises);
    setEndpoints(updatedEndpoints);
  };

  // Initial fetch and set up periodic updates
  useEffect(() => {
    updateEndpointStatus();
    // Check every 30 seconds
    const interval = setInterval(updateEndpointStatus, 30000);
    
    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  const handleRefresh = () => {
    updateEndpointStatus();
    toast({
      title: "Status Updated",
      description: "Endpoint health status has been refreshed",
      status: "info",
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <Container maxW="full">
      <Flex align="center" justify="space-between" py={6} flexWrap="wrap" gap={4}>
        <Text fontSize="2xl" fontWeight="bold">Endpoint Health Monitor</Text>
        <HStack>
          <Button colorScheme="blue" onClick={handleRefresh}>
            Refresh Status
          </Button>
        </HStack>
      </Flex>
      <Divider my={4} />
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>#</Th>
            <Th>Endpoint</Th>
            <Th>Status</Th>
            <Th>Last Checked</Th>
          </Tr>
        </Thead>
        <Tbody>
          {endpoints.map((endpoint) => (
            <Tr key={endpoint.id}>
              <Td>{endpoint.id}</Td>
              <Td>{endpoint.url}</Td>
              <Td>
                <Badge 
                  colorScheme={endpoint.status ? "green" : "red"}
                  variant="solid"
                >
                  {endpoint.status ? "Healthy" : "Unhealthy"}
                </Badge>
              </Td>
              <Td>{endpoint.lastChecked}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Container>
  );
};

export default EndpointSettings;