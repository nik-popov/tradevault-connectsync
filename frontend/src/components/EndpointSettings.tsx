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

// Define the interface for an endpoint
interface Endpoint {
  id: number;
  url: string;
  status: boolean;
  lastChecked: string;
}

const EndpointSettings = (): JSX.Element => {
  const toast = useToast();
  const [endpoints, setEndpoints] = useState<Endpoint[]>([]);
  const fetchEndpoints: readonly string[] = [
    "https://southamerica-west1-image-scraper-451516.cloudfunctions.net/main/health/",
    "https://us-central1-image-scraper-451516.cloudfunctions.net/main",
    "https://us-east1-image-scraper-451516.cloudfunctions.net/main",
    "https://us-east4-image-scraper-451516.cloudfunctions.net/main",
    "https://us-west1-image-scraper-451516.cloudfunctions.net/main",
  ] as const;

  const checkEndpointHealth = async (endpoint: string, timeout: number = 5000): Promise<boolean> => {
    const healthUrl = `${endpoint}/health/google`;
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      const response = await fetch(healthUrl, {
        signal: controller.signal,
        mode: "cors",
      });
      
      clearTimeout(timeoutId);
      return response.ok;
    } catch (error) {
      console.error(`Health check failed for ${endpoint}:`, error);
      return false;
    }
  };

  const updateEndpointStatus = async (): Promise<void> => {
    const statusPromises = fetchEndpoints.map(async (url, index): Promise<Endpoint> => ({
      id: index + 1,
      url,
      status: await checkEndpointHealth(url),
      lastChecked: new Date().toLocaleTimeString(),
    }));
    
    const updatedEndpoints = await Promise.all(statusPromises);
    setEndpoints(updatedEndpoints);
  };

  useEffect(() => {
    updateEndpointStatus();
    const interval = setInterval(updateEndpointStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = (): void => {
    updateEndpointStatus();
    toast({
      title: "Status Updated",
      description: "Endpoint health status has been refreshed",
      status: "info" as const,
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