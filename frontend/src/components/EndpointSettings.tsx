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
  Spinner,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";

// Define the interface for an endpoint with detailed health information and error handling
interface Endpoint {
  id: number;
  url: string;
  lastChecked: string;
  health?: {
    device_id: string;
    public_ip: string;
    status: string;
  };
  error?: string;
}

const EndpointSettings = (): JSX.Element => {
  const toast = useToast();
  const [endpoints, setEndpoints] = useState<Endpoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const fetchEndpoints: readonly string[] = [
    "https://southamerica-west1-image-scraper-451516.cloudfunctions.net/main",
    "https://us-central1-image-scraper-451516.cloudfunctions.net/main",
    "https://us-east1-image-scraper-451516.cloudfunctions.net/main",
    "https://us-east4-image-scraper-451516.cloudfunctions.net/main",
    "https://us-west1-image-scraper-451516.cloudfunctions.net/main",
  ] as const;
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
        // Remove mode: "no-cors" to allow reading the response
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
  // Update the endpoints state with health information and error details
  const updateEndpointStatus = async (): Promise<void> => {
    setIsLoading(true);
    const statusPromises = fetchEndpoints.map(async (url, index) => {
      try {
        const health = await fetchEndpointHealth(url);
        return {
          id: index + 1,
          url,
          lastChecked: new Date().toLocaleTimeString(),
          health,
          error: health ? undefined : "Fetch Failed",
        };
      } catch (error) {
        return {
          id: index + 1,
          url,
          lastChecked: new Date().toLocaleTimeString(),
          error: error instanceof Error ? error.message : "Unknown Error",
        };
      }
    });
    const updatedEndpoints = await Promise.all(statusPromises);
    setEndpoints(updatedEndpoints);
    setIsLoading(false);
  };

  // Fetch endpoint status on mount and every 30 seconds
  useEffect(() => {
    updateEndpointStatus();
    const interval = setInterval(updateEndpointStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  // Handle manual refresh with toast notification
  const handleRefresh = (): void => {
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
      {isLoading ? (
        <Flex justify="center" align="center" height="200px">
          <Spinner size="xl" color="blue.500" />
        </Flex>
      ) : (
        <Table variant="simple" aria-label="Endpoint Health Status">
          <Thead>
            <Tr>
              <Th>#</Th>
              <Th>Endpoint</Th>
              <Th>Device ID</Th>
              <Th>Public IP</Th>
              <Th>Status</Th>
              <Th>Health</Th>
              <Th>Last Checked</Th>
              <Th>Error</Th>
            </Tr>
          </Thead>
          <Tbody>
            {endpoints.map((endpoint) => (
              <Tr key={endpoint.url}>
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
                <Td>{endpoint.error || "None"}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}
    </Container>
  );
};

export default EndpointSettings;