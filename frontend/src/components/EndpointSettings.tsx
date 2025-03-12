import { 
  Container, Text, Button, Table, Thead, Tbody, Tr, Th, Td, 
  Divider, Flex, useToast, Badge, Spinner, TableContainer, Input, Highlight 
} from "@chakra-ui/react";
import { useState, useEffect, useCallback, memo } from "react";
import { Link } from "@tanstack/react-router";
import debounce from "lodash/debounce"; // Install with: npm install lodash

interface HealthStatus {
  device_id: string;
  public_ip: string;
  status: string;
}

interface Endpoint {
  id: number;
  url: string;
  lastChecked: string;
  health?: HealthStatus;
}

interface EndpointSettingsProps { 
  endpointId?: string; 
  endpoints?: { endpointId: string; url: string }[] 
}

const endpointData: Record<string, string> = {
  "SOUTHAMERICA-WEST1": "https://southamerica-west1-image-scraper-451516.cloudfunctions.net/main",
  "US-CENTRAL1": "https://us-central1-image-scraper-451516.cloudfunctions.net/main",
  "US-EAST1": "https://us-east1-image-scraper-451516.cloudfunctions.net/main",
  "US-EAST4": "https://us-east4-image-scraper-451516.cloudfunctions.net/main",
  "US-WEST1": "https://us-west1-image-scraper-451516.cloudfunctions.net/main",
  "EUROPE-WEST4": "https://europe-west4-image-scraper-451516.cloudfunctions.net/main"
};

const fetchEndpointHealth = async (url: string, timeout: number = 10000): Promise<HealthStatus | null> => {
  const healthUrl = `${url}/health/google`;
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    const response = await fetch(healthUrl, { 
      signal: controller.signal,
      cache: 'no-store',
      headers: { 'Accept': 'application/json' }
    });
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data || { status: 'unknown', device_id: 'N/A', public_ip: 'N/A' };
  } catch (error) {
    console.error(`Health check failed for ${url}:`, error);
    return null;
  }
};

const truncateUrl = (url: string, maxLength: number = 25): string => 
  url.length <= maxLength ? url : `${url.substring(0, maxLength)}...`;

const EndpointSettings = memo(({ endpointId, endpoints }: EndpointSettingsProps): JSX.Element => {
  const toast = useToast();
  const [endpointList, setEndpointList] = useState<Endpoint[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const targetEndpoints = endpointId 
    ? [{ endpointId, url: endpointData[endpointId] || "Unknown" }]
    : endpoints || [];

  const updateEndpointStatus = useCallback(async (isManual: boolean = false) => {
    setIsRefreshing(true);
    try {
      const updatedEndpoints = await Promise.all(
        targetEndpoints.map(async (ep, index) => {
          const health = await fetchEndpointHealth(ep.url);
          return {
            id: index + 1,
            url: ep.url,
            lastChecked: new Date().toLocaleTimeString(),
            health: health || { status: "Fetch Failed", device_id: "N/A", public_ip: "N/A" },
          };
        })
      );
      setEndpointList(updatedEndpoints);
      if (isManual) {
        toast({
          title: "Status Updated",
          description: endpointId 
            ? `Health status for ${endpointId} refreshed`
            : "Health status for all Google SERP endpoints refreshed",
          status: "info",
          duration: 3000,
          isClosable: true,
        });
      }
    } finally {
      setIsRefreshing(false);
      if (endpointList.length === 0) setIsLoading(false);
    }
  }, [targetEndpoints, endpointId, toast, endpointList.length]);

  // Initial load
  useEffect(() => {
    if (endpointList.length === 0) {
      updateEndpointStatus();
    }
  }, [updateEndpointStatus, endpointList.length]);

  // Auto-refresh interval
  useEffect(() => {
    const interval = setInterval(() => updateEndpointStatus(false), 30000);
    return () => clearInterval(interval);
  }, [updateEndpointStatus]);

  const debouncedRefresh = useCallback(
    debounce(() => updateEndpointStatus(true), 2000, { leading: true, trailing: false }),
    [updateEndpointStatus]
  );

  const handleRefresh = () => {
    if (!isRefreshing) {
      debouncedRefresh();
    }
  };

  const filteredEndpoints = endpointList.filter((endpoint) =>
    endpoint.url.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (endpoint.health?.device_id || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (endpoint.health?.public_ip || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (endpoint.health?.status || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    endpoint.lastChecked.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const baseUrl = "https://laughing-telegram-4jjjw7wp9gxrc7v5v-5173.app.github.dev";

  return (
    <Container maxW="full" py={6} color="white">
      <Flex direction="column" gap={4}>
        <Flex justify="space-between" align="center" flexWrap="wrap" gap={4}>
          <Flex gap={4}>
            <Input 
              placeholder="Search endpoints..." 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
              maxW="300px"
              aria-label="Search endpoints"
              color="white"
              borderColor="gray.600"
              _hover={{ borderColor: "gray.500" }}
              _focus={{ borderColor: "blue.400" }}
            />
          </Flex>
        </Flex>
        <Divider my={4} borderColor="gray.600" />
        {isLoading ? (
          <Flex justify="center" align="center" h="200px">
            <Spinner size="xl" color="blue.500" />
          </Flex>
        ) : (
          <TableContainer overflowX="auto" overflowY="auto" minHeight="400px">
            <Table 
              variant="simple" 
              size="sm" 
              aria-label={endpointId ? `Health Status for ${endpointId}` : "Google SERP Endpoint Health"}
              color="white"
            >
              <Thead position="sticky" top={0} zIndex={1}>
                <Tr>
                  <Th px={2} py={3} borderBottom="1px" borderColor="gray.600" w="5%" color="white" textAlign="left">#</Th>
                                    <Th px={2} py={3} borderBottom="1px" borderColor="gray.600" w="10%" textAlign="center" color="white">Health</Th>
                  <Th px={2} py={3} borderBottom="1px" borderColor="gray.600" w="12%" textAlign="center" color="white">Last Checked</Th>
                  <Th px={2} py={3} borderBottom="1px" borderColor="gray.600" w="20%" color="white">Endpoint</Th>
                  <Th px={2} py={3} borderBottom="1px" borderColor="gray.600" w="15%" color="white">Device ID</Th>
                  <Th px={2} py={3} borderBottom="1px" borderColor="gray.600" w="12%" color="white">Public IP</Th>
                  <Th px={2} py={3} borderBottom="1px" borderColor="gray.600" w="18%" color="white">Status</Th>
                </Tr>
              </Thead>
              <Tbody>
                {filteredEndpoints.map((endpoint) => {
                  const epId = targetEndpoints.find((e) => e.url === endpoint.url)?.endpointId || endpointId || "unknown";
                  const detailUrl = `${baseUrl}/scraping-api/endpoints/${epId}`;
                  return (
                    <Tr key={endpoint.url}>
                      <Td px={2} py={2} borderBottom="1px" borderColor="gray.600">{endpoint.id}</Td>
                      <Td px={2} py={2} borderBottom="1px" borderColor="gray.600" textAlign="center">
                        <Badge 
                          colorScheme={endpoint.health?.status.includes("reachable") ? "green" : "red"} 
                          variant="solid"
                        >
                          <Highlight query={searchTerm} styles={{ bg: "yellow.200", color: "black" }}>
                            {endpoint.health?.status.includes("reachable") ? "Healthy" : "Unhealthy"}
                          </Highlight>
                        </Badge>
                      </Td>
                      <Td px={2} py={2} borderBottom="1px" borderColor="gray.600" textAlign="center">
                        <Link 
  to={`/scraping-api/endpoints/${epId}`}
  style={{ color: "blue.400", textDecoration: "underline" }}
>
                          <Highlight query={searchTerm} styles={{ bg: "yellow.200", color: "black" }}>
                            {endpoint.lastChecked}
                          </Highlight>
                        </Link>
                      </Td>
                      <Td 
                        px={2} 
                        py={2} 
                        borderBottom="1px" 
                        borderColor="gray.600" 
                        maxW="200px" 
                        whiteSpace="nowrap" 
                        overflow="hidden" 
                        textOverflow="ellipsis"
                      >
                        <Highlight query={searchTerm} styles={{ bg: "yellow.200", color: "black" }}>
                          {truncateUrl(endpoint.url)}
                        </Highlight>
                      </Td>
                      <Td px={2} py={2} borderBottom="1px" borderColor="gray.600">
                        <Highlight query={searchTerm} styles={{ bg: "yellow.200", color: "black" }}>
                          {endpoint.health?.device_id || "N/A"}
                        </Highlight>
                      </Td>
                      <Td px={2} py={2} borderBottom="1px" borderColor="gray.600">
                        <Highlight query={searchTerm} styles={{ bg: "yellow.200", color: "black" }}>
                          {endpoint.health?.public_ip || "N/A"}
                        </Highlight>
                      </Td>
                      <Td px={2} py={2} borderBottom="1px" borderColor="gray.600">
                        <Highlight query={searchTerm} styles={{ bg: "yellow.200", color: "black" }}>
                          {endpoint.health?.status || "Fetch Failed"}
                        </Highlight>
                      </Td>
                    </Tr>
                  );
                })}
              </Tbody>
            </Table>
          </TableContainer>
        )}
      </Flex>
    </Container>
  );
}, (prevProps, nextProps) => {
  return prevProps.endpointId === nextProps.endpointId && 
         prevProps.endpoints === nextProps.endpoints;
});

EndpointSettings.displayName = 'EndpointSettings';

export default EndpointSettings;