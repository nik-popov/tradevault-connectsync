import React, { useState, useEffect, useCallback, memo } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  Container,
  Text,
  Flex,
  Badge,
  Spinner,
  Input,
  Button,
  Box,
  Select,
  HStack,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from "@chakra-ui/react";
import debounce from "lodash/debounce";
import useCustomToast from "./../../../hooks/useCustomToast";

interface Proxy {
  id: number;
  provider: string;
  region: string;
  url: string;
  status: string;
  lastChecked: string;
  public_ip?: string;
  batch?: string;
}

const proxyData: Record<string, { region: string; url: string }[]> = {
  DataProxy: [
    // Proxy1 URLs
    { region: "US-EAST4", url: "https://us-east4-proxy1-454912.cloudfunctions.net/main" },
    { region: "SOUTHAMERICA-WEST1", url: "https://southamerica-west1-proxy1-454912.cloudfunctions.net/main" },
    { region: "US-CENTRAL1", url: "https://us-central1-proxy1-454912.cloudfunctions.net/main" },
    { region: "US-EAST1", url: "https://us-east1-proxy1-454912.cloudfunctions.net/main" },
    { region: "US-EAST2", url: "https://us-east2-proxy1-454912.cloudfunctions.net/main" },
    { region: "US-WEST1", url: "https://us-west1-proxy1-454912.cloudfunctions.net/main" },
    { region: "US-WEST3", url: "https://us-west3-proxy1-454912.cloudfunctions.net/main" },
    { region: "US-WEST4", url: "https://us-west4-proxy1-454912.cloudfunctions.net/main" },
    { region: "NORTHAMERICA-NORTHEAST3", url: "https://northamerica-northeast3-proxy1-454912.cloudfunctions.net/main" },
    // Proxy2 URLs
    { region: "NORTHAMERICA-NORTHEAST2", url: "https://northamerica-northeast2-proxy2-455013.cloudfunctions.net/main" },
    { region: "US-CENTRAL1", url: "https://us-central1-proxy2-455013.cloudfunctions.net/main" },
    { region: "US-EAST5", url: "https://us-east5-proxy2-455013.cloudfunctions.net/main" },
    { region: "US-WEST2", url: "https://us-west2-proxy2-455013.cloudfunctions.net/main" },
    { region: "US-WEST6", url: "https://us-west6-proxy2-455013.cloudfunctions.net/main" },
    { region: "ASIA-SOUTHEAST1", url: "https://asia-southeast1-proxy2-455013.cloudfunctions.net/main" },
    // Proxy3 URLs
    { region: "AUSTRALIA-SOUTHEAST1", url: "https://australia-southeast1-proxy3-455013.cloudfunctions.net/main" },
    { region: "AUSTRALIA-SOUTHEAST2", url: "https://australia-southeast2-proxy3-455013.cloudfunctions.net/main" },
    { region: "SOUTHAMERICA-EAST1", url: "https://southamerica-east1-proxy3-455013.cloudfunctions.net/main" },
    { region: "SOUTHAMERICA-EAST2", url: "https://southamerica-east2-proxy3-455013.cloudfunctions.net/main" },
    { region: "SOUTHAMERICA-WEST1", url: "https://southamerica-west1-proxy3-455013.cloudfunctions.net/main" },
    { region: "US-SOUTH1", url: "https://us-south1-proxy3-455013.cloudfunctions.net/main" },
    { region: "ASIA-SOUTH1", url: "https://asia-south1-proxy3-455013.cloudfunctions.net/main" },
    // Proxy4 URLs
    { region: "EUROPE-NORTH1", url: "https://europe-north1-proxy4-455014.cloudfunctions.net/main" },
    { region: "EUROPE-SOUTHWEST1", url: "https://europe-southwest1-proxy4-455014.cloudfunctions.net/main" },
    { region: "EUROPE-WEST1", url: "https://europe-west1-proxy4-455014.cloudfunctions.net/main" },
    { region: "EUROPE-WEST4", url: "https://europe-west4-proxy4-455014.cloudfunctions.net/main" },
    { region: "EUROPE-WEST5", url: "https://europe-west5-proxy4-455014.cloudfunctions.net/main" },
    { region: "EUROPE-WEST6", url: "https://europe-west6-proxy4-455014.cloudfunctions.net/main" },
    { region: "EUROPE-WEST8", url: "https://europe-west8-proxy4-455014.cloudfunctions.net/main" },
    { region: "EUROPE-CENTRAL2", url: "https://europe-central2-proxy4-455014.cloudfunctions.net/main" },
    // Proxy5 URLs
    { region: "EUROPE-WEST12", url: "https://europe-west12-proxy5-455014.cloudfunctions.net/main" },
    { region: "EUROPE-WEST2", url: "https://europe-west2-proxy5-455014.cloudfunctions.net/main" },
    { region: "EUROPE-WEST3", url: "https://europe-west3-proxy5-455014.cloudfunctions.net/main" },
    { region: "EUROPE-WEST6", url: "https://europe-west6-proxy5-455014.cloudfunctions.net/main" },
    { region: "EUROPE-WEST9", url: "https://europe-west9-proxy5-455014.cloudfunctions.net/main" },
    { region: "EUROPE-WEST11", url: "https://europe-west11-proxy5-455014.cloudfunctions.net/main" },
    { region: "ASIA-NORTHEAST1", url: "https://asia-northeast1-proxy5-455014.cloudfunctions.net/main" },
    // Proxy6 URLs
    { region: "ASIA-EAST1", url: "https://asia-east1-proxy6-455014.cloudfunctions.net/main" },
    { region: "ASIA-EAST2", url: "https://asia-east2-proxy6-455014.cloudfunctions.net/main" },
    { region: "ASIA-NORTHEAST2", url: "https://asia-northeast2-proxy6-455014.cloudfunctions.net/main" },
    { region: "EUROPE-WEST10", url: "https://europe-west10-proxy6-455014.cloudfunctions.net/main" },
    { region: "MIDDLEEAST-CENTRAL1", url: "https://me-central1-proxy6-455014.cloudfunctions.net/main" },
    { region: "MIDDLEEAST-CENTRAL2", url: "https://me-central2-proxy6-455014.cloudfunctions.net/main" },
  ],
};

const fetchProxyHealth = async (url: string, timeout: number = 10000): Promise<Proxy | null> => {
  const healthUrl = `${url}/health/google`;
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    const response = await fetch(healthUrl, {
      signal: controller.signal,
      cache: "no-store",
      headers: { Accept: "application/json" },
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return {
      ...data,
      status: data?.status || "unknown",
      public_ip: data?.public_ip || "N/A",
      lastChecked: new Date().toLocaleTimeString(),
      batch: data?.region?.split("-")[1] || "N/A",
    };
  } catch (error) {
    console.error(`Health check failed for ${url}:`, error);
    return null;
  }
};

const ProxyPage = memo(() => {
  const showToast = useCustomToast();
  const navigate = useNavigate();
  const [proxies, setProxies] = useState<Proxy[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [regionFilter, setRegionFilter] = useState<string>("all");
  const [providerFilter, setProviderFilter] = useState<string>("all");
  const [healthFilter, setHealthFilter] = useState<string>("all");
  const [showDetails, setShowDetails] = useState<boolean>(true);

  const allProxies = Object.entries(proxyData).flatMap(([provider, regions], providerIndex) =>
    regions.map((proxy, index) => ({
      id: providerIndex * 100 + index + 1,
      provider,
      region: proxy.region,
      url: proxy.url,
      status: "Pending",
      lastChecked: "N/A",
      batch: proxy.region.split("-")[1] || proxy.region,
    }))
  );

  const updateProxyStatus = useCallback(
    async (isManual: boolean = false) => {
      setIsRefreshing(true);
      try {
        const updatedProxies = await Promise.all(
          allProxies.map(async (proxy) => {
            const health = await fetchProxyHealth(proxy.url);
            return {
              id: proxy.id,
              provider: proxy.provider,
              region: proxy.region,
              url: proxy.url,
              status: health?.status || "Fetch Failed",
              lastChecked: health?.lastChecked || new Date().toLocaleTimeString(),
              public_ip: health?.public_ip || "N/A",
              batch: health?.batch || proxy.region.split("-")[1] || proxy.region,
            };
          })
        );
        setProxies(updatedProxies);
        if (isManual) {
          showToast(
            "Proxy Status Updated",
            "Health status for all search proxies refreshed.",
            "success"
          );
        }
      } finally {
        setIsRefreshing(false);
        if (proxies.length === 0) setIsLoading(false);
      }
    },
    [showToast, allProxies, proxies.length]
  );

  useEffect(() => {
    if (proxies.length === 0) {
      updateProxyStatus();
    }
  }, [updateProxyStatus, proxies.length]);

  useEffect(() => {
    const interval = setInterval(() => updateProxyStatus(false), 30000);
    return () => clearInterval(interval);
  }, [updateProxyStatus]);

  const debouncedRefresh = useCallback(
    debounce(() => updateProxyStatus(true), 2000, { leading: true, trailing: false }),
    [updateProxyStatus]
  );

  const handleRefresh = () => {
    if (!isRefreshing) {
      debouncedRefresh();
    }
  };

  const filteredProxies = proxies.filter((proxy) => {
    const matchesSearch =
      proxy.provider.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proxy.region.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proxy.url.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proxy.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proxy.lastChecked.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (proxy.public_ip || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (proxy.batch || "").toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRegion =
      regionFilter === "all" ||
      (regionFilter === "us" && proxy.region.toLowerCase().includes("us")) ||
      (regionFilter === "northamerica" && proxy.region.toLowerCase().includes("northamerica")) ||
      (regionFilter === "southamerica" && proxy.region.toLowerCase().includes("southamerica")) ||
      (regionFilter === "middleeast" && proxy.region.toLowerCase().includes("middleeast")) ||
      (regionFilter === "asia" && proxy.region.toLowerCase().includes("asia")) ||
      (regionFilter === "europe" && proxy.region.toLowerCase().includes("europe"));

    const matchesProvider =
      providerFilter === "all" || proxy.provider.toLowerCase() === providerFilter.toLowerCase();

    const matchesHealth =
      healthFilter === "all" ||
      (healthFilter === "healthy" && proxy.status.includes("reachable")) ||
      (healthFilter === "unhealthy" && !proxy.status.includes("reachable"));

    return matchesSearch && matchesRegion && matchesProvider && matchesHealth;
  });

  const handleTitleClick = (region: string) => {
    navigate({ to: "/scraping-api/endpoints/$endpointId", params: { endpointId: region } });
  };

  const providerCategories = ["all", ...new Set(allProxies.map((proxy) => proxy.provider))];

  return (
    <Container maxW="full">
      
      <Flex direction="column" gap={4}>
      <Flex align="center" justify="space-between" py={6}>
        <Text fontSize="xl" fontWeight="bold">Proxy Status</Text>
        <Text fontSize="sm">View search proxy status by region </Text>
      </Flex>
        <Flex
          gap={4}
          mb={4}
          position="sticky"
          top="0"
          bg="white"
          zIndex="10"
          py={5}
          borderBottom="1px solid"
          borderColor="gray.200"
          justify="space-between"
          align="center"
          flexWrap="wrap"
        >
          <Input
            placeholder="Search proxies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            w={{ base: "100%", md: "250px" }}
            aria-label="Search proxies"
            borderColor="blue.300"
            _hover={{ borderColor: "blue.400" }}
            _focus={{ borderColor: "blue.500", boxShadow: "0 0 0 1px blue.500" }}
            bg="white"
            color="gray.800"
            _placeholder={{ color: "gray.500" }}
            borderRadius="md"
            px={3}
            py={2}
          />
          <HStack spacing={4} ml={{ md: "auto" }} align="center" flexWrap="wrap">
            {providerCategories.map((provider) => (
              <Button
                key={provider}
                size="sm"
                fontWeight="bold"
                borderRadius="full"
                colorScheme={providerFilter === provider ? "green" : "gray"}
                variant={providerFilter === provider ? "solid" : "outline"}
                onClick={() => setProviderFilter(provider)}
                color={providerFilter === provider ? "white" : "gray.800"}
                borderColor={providerFilter === provider ? "blue.500" : "gray.300"}
                _hover={{
                  bg: providerFilter === provider ? "blue.600" : "gray.100",
                  borderColor: providerFilter === provider ? "blue.600" : "gray.400",
                }}
              >
                {provider === "all" ? "All" : provider}
              </Button>
            ))}
            <Select
              value={healthFilter}
              onChange={(e) => setHealthFilter(e.target.value)}
              size="sm"
              w={{ base: "100%", md: "150px" }}
              borderColor="blue.300"
              _hover={{ borderColor: "blue.400" }}
              _focus={{ borderColor: "blue.500", boxShadow: "0 0 0 1px blue.500" }}
              bg="white"
              color="gray.700"
              borderRadius="md"
              px={3}
              py={2}
              sx={{
                "& option": {
                  color: "gray.700",
                  backgroundColor: "white",
                  _hover: { backgroundColor: "blue.50" },
                },
              }}
            >
              <option value="all">All Health</option>
              <option value="healthy">Healthy</option>
              <option value="unhealthy">Unhealthy</option>
            </Select>
            <Select
              value={regionFilter}
              onChange={(e) => setRegionFilter(e.target.value)}
              size="sm"
              w={{ base: "100%", md: "220px" }}
              borderColor="blue.300"
              _hover={{ borderColor: "blue.400" }}
              _focus={{ borderColor: "blue.500", boxShadow: "0 0 0 1px blue.500" }}
              bg="white"
              color="gray.700"
              borderRadius="md"
              px={3}
              py={2}
              sx={{
                "& option": {
                  color: "gray.700",
                  backgroundColor: "white",
                  _hover: { backgroundColor: "blue.50" },
                },
              }}
            >
              <option value="all">All Regions</option>
              <option value="us">US</option>
              <option value="asia">Asia</option>
              <option value="europe">Europe</option>
              <option value="northamerica">North America</option>
              <option value="southamerica">South America</option>
              <option value="middleeast">Middle East</option>
            </Select>
            <Button
              colorScheme="green"
              onClick={handleRefresh}
              isLoading={isRefreshing}
              isDisabled={isRefreshing}
              size="sm"
            >
              Refresh Now
            </Button>
            <Button
              colorScheme="gray"
              onClick={() => setShowDetails(!showDetails)}
              size="sm"
            >
              {showDetails ? "Hide Details" : "Show Details"}
            </Button>
          </HStack>
        </Flex>

        {isLoading ? (
          <Flex justify="center" align="center" h="200px">
            <Spinner size="xl" color="blue.500" />
          </Flex>
        ) : (
          <Box overflowX="auto">
            <Table variant="striped" colorScheme="gray">
              <Thead>
                <Tr>
                  <Th>Provider</Th>
                  <Th>Region</Th>
                  {showDetails && (
                    <>
                      <Th>URL</Th>
                      <Th>Status</Th>
                      <Th>Last Checked</Th>
                      <Th>Public IP</Th>
                      <Th>Batch</Th>
                    </>
                  )}
                  {!showDetails && <Th>Status</Th>}
                </Tr>
              </Thead>
              <Tbody>
                {filteredProxies.map((proxy) => (
                  <Tr key={proxy.id}>
                    <Td>{proxy.provider}</Td>
                    <Td>
                      <Text
                        color="blue.500"
                        cursor="pointer"
                        onClick={() => handleTitleClick(proxy.region)}
                        _hover={{ textDecoration: "underline" }}
                      >
                        {proxy.region}
                      </Text>
                    </Td>
                    {showDetails && (
                      <>
                        <Td>{proxy.url}</Td>
                        <Td>
                          <Badge
                            colorScheme={proxy.status.includes("reachable") ? "green" : "red"}
                            variant="solid"
                          >
                            {proxy.status.includes("reachable") ? "Healthy" : "Unhealthy"}
                          </Badge>
                          <Text fontSize="sm" color="gray.600">
                            {proxy.status}
                          </Text>
                        </Td>
                        <Td>{proxy.lastChecked}</Td>
                        <Td>{proxy.public_ip || "N/A"}</Td>
                        <Td>{proxy.batch}</Td>
                      </>
                    )}
                    {!showDetails && (
                      <Td>
                        <Badge
                          colorScheme={proxy.status.includes("reachable") ? "green" : "red"}
                          variant="solid"
                        >
                          {proxy.status.includes("reachable") ? "Healthy" : "Unhealthy"}
                        </Badge>
                      </Td>
                    )}
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        )}
      </Flex>
    </Container>
  );
});

ProxyPage.displayName = "SearchProxiesPage";

export const Route = createFileRoute("/_layout/scraping-api/search-proxies")({
  component: ProxyPage,
});

export default ProxyPage;