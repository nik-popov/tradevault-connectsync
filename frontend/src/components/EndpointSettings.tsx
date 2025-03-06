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

// Define the interface for an endpoint with detailed health information
interface Endpoint {
  id: number;
  url: string;
  lastChecked: string;
  health?: {
    device_id: string;
    public_ip: string;
    status: string;
  };
}

const EndpointSettings = (): JSX.Element => {
  const toast = useToast();
  const [endpoints, setEndpoints] = useState<Endpoint[]>([]);
  const fetchEndpoints: readonly string[] = [
    "https://southamerica-west1-image-scraper-451516.cloudfunctions.net/main",
    "https://us-central1-image-scraper-451516.cloudfunctions.net/main",
    "https://us-east1-image-scraper-451516.cloudfunctions.net/main",
    "https://us-east4-image-scraper-451516.cloudfunctions.net/main",
    "https://us-west1-image-scraper-451516.cloudfunctions.net/main",
  ] as const;

  // Fetch detailed health data from an endpoint
  const fetchEndpointHealth = async (
    endpoint: string,
    timeout: number = 5000
  ): Promise<{ device_id: string; public_ip: string; status: string } | null> => {
    const healthUrl = `${endpoint}/health/google`;
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      const response = await fetch(healthUrl, {
        signal: controller.signal,
        mode: "cors",
      });

      clearTimeout(timeoutId);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Health check failed for ${endpoint}:`, error);
      return null;
    }
  };

  // Update the endpoints state with health information
  const updateEndpointStatus = async (): Promise<void> => {
    const statusPromises = fetchEndpoints.map(
      async (url, index): Promise<Endpoint> => {
        const health = await fetchEndpointHealth(url);
        return {
          id: index + 1, 
          url,
          lastChecked: new Date().toLocaleTimeString(),
          health,
        };
      }
    );

    const updatedEndpoints = await Promise.all(statusPromises);
    setEndpoints(updatedEndpoints);
  };

  // Fetch endpoint status on mount and every 30 seconds
  useEffect(() => {
    updateEndpointStatus();
    const interval = setInterval(updateEndpointStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  // Handle manual refresh
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
            <Th>Device ID</Th>
            <Th>Public IP</Th>
            <Th>Status</Th>
            <Th>Health</Th>
            <Th>Last Checked</Th>
          </Tr>
        </Thead>
        <Tbody>
          {endpoints.map((endpoint) => (
            <Tr key={endpoint.id}>
              <Td>{endpoint.id}</Td>
              <Td>{endpoint.url}</Td>
              <Td>{endpoint.health?.device_id || "N/A"}</Td>
              <Td>{endpoint.health?.public_ip || "N/A"}</Td>
              <Td>{endpoint.health?.status || "Fetch Failed"}</Td>
              <Td>
                <Badge
                  colorScheme={
                    endpoint.health && endpoint.health.status.includes("reachable")
                      ? "green"
                      : "red"
                  }
                  variant="solid"
                >
                  {endpoint.health && endpoint.health.status.includes("reachable")
                    ? "Healthy"
                    : "Unhealthy"}
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