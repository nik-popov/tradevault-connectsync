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
  useToast,
  Box,
  VStack,
  Select,
  HStack,
} from "@chakra-ui/react";
import debounce from "lodash/debounce"; // Install with: npm install lodash

// Interface for Proxy data
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

// Mock proxy data for multiple providers, including some that will fail
const proxyData: Record<string, { region: string; url: string }[]> = {
  "Google Cloud": [
    { region: "SOUTHAMERICA-WEST1", url: "https://southamerica-west1-image-scraper-451516.cloudfunctions.net/main" },
    { region: "US-CENTRAL1", url: "https://us-central1-image-scraper-451516.cloudfunctions.net/main" },
    { region: "US-EAST1", url: "https://us-east1-image-scraper-451516.cloudfunctions.net/main" },
    { region: "US-EAST4", url: "https://us-east4-image-scraper-451516.cloudfunctions.net/main" },
    { region: "US-WEST1", url: "https://us-west1-image-scraper-451516.cloudfunctions.net/main" },
    { region: "EUROPE-WEST4", url: "https://europe-west4-image-proxy-453319.cloudfunctions.net/main" },
    { region: "US-WEST4", url: "https://us-west4-image-proxy-453319.cloudfunctions.net/main"},
    { region: "EUROPE-WEST1", url: "https://europe-west1-image-proxy-453319.cloudfunctions.net/main"},
    { region: "EUROPE-NORTH1", url: "https://europe-north1-image-proxy-453319.cloudfunctions.net/main"},
    { region: "ASIA-EAST1", url: "https://asia-east1-image-proxy-453319.cloudfunctions.net/main"},
    { region: "US-SOUTH1", url: "https://us-south1-gen-lang-client-0697423475.cloudfunctions.net/main"},
    { region: "US-WEST3", url: "https://us-west3-gen-lang-client-0697423475.cloudfunctions.net/main"},
    { region: "US-EAST5", url: "https://us-east5-gen-lang-client-0697423475.cloudfunctions.net/main"},
    { region: "ASIA-SOUTHEAST1", url: "https://asia-southeast1-gen-lang-client-0697423475.cloudfunctions.net/main"},
    { region: "US-WEST2", url: "https://us-west2-gen-lang-client-0697423475.cloudfunctions.net/main"},
    { region: "NORTHAMERICA-NORTHEAST1", url: "https://northamerica-northeast1-image-proxy2-453320.cloudfunctions.net/main"},
    { region: "NORTHAMERICA-NORTHEAST2", url: "https://northamerica-northeast2-image-proxy2-453320.cloudfunctions.net/main"},
    { region: "SOUTHAMERICA-EAST1", url: "https://southamerica-east1-image-proxy2-453320.cloudfunctions.net/main"}, 
    { region: "EUROPE-WEST8", url: "https://europe-west8-icon-image3.cloudfunctions.net/main"},
    { region: "EUROPE-SOUTHWEST1", url: "https://europe-southwest1-icon-image3.cloudfunctions.net/main"},
    { region: "EUROPE-WEST6", url: "https://europe-west6-icon-image3.cloudfunctions.net/main"},
    { region: "EUROPE-WEST3", url: "https://europe-west3-icon-image3.cloudfunctions.net/main"},
    { region: "EUROPE-WEST2", url: "https://europe-west2-icon-image3.cloudfunctions.net/main"},
    { region: "EUROPE-CENTRAL2", url: "https://europe-central2-image-proxy2-453320.cloudfunctions.net/main"},
    { region: "EUROPE-WEST9", url: "https://europe-west9-image-proxy2-453320.cloudfunctions.net/main"},
    { region: "MIDDLEEAST-WEST1", url: "https://me-west1-image-proxy4.cloudfunctions.net/main"},
    { region: "MIDDLEEAST-CENTRAL1", url: "https://me-central1-image-proxy4.cloudfunctions.net/main"},
    { region: "EUROPE-WEST12", url: "https://europe-west12-image-proxy4.cloudfunctions.net/main"},
    { region: "EUROPE-WEST10", url: "https://europe-west10-image-proxy4.cloudfunctions.net/main"},
    { region: "ASIA-NORTHEAST2", url: "https://asia-northeast2-image-proxy4.cloudfunctions.net/main"},
  ],
  "AWS": [
    { region: "us-east-1", url: "https://us-east-1-aws-scraper.example.com" },
    { region: "eu-west-1", url: "https://eu-west-1-aws-scraper.invalid" },
  ],
  "Azure": [
    { region: "eastus", url: "https://eastus-azure-scraper.example.com" },
    { region: "westeurope", url: "https://westeurope-azure-scraper.broken" },
  ],
  "DigitalOcean": [
    { region: "nyc1", url: "https://nyc1-do-scraper.example.com" },
    { region: "ams3", url: "https://ams3-do-scraper.unreachable" },
  ],
};

// Fetch proxy health status
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
  const toast = useToast();
  const navigate = useNavigate();
  const [proxies, setProxies] = useState<Proxy[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [regionFilter, setRegionFilter] = useState<string>("all");
  const [providerFilter, setProviderFilter] = useState<string>("all");
  const [isHealthy, setIsHealthy] = useState<boolean>(true); // true = Healthy, false = Unhealthy

  // Flatten proxy data into a single array
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
          toast({
            title: "Proxy Status Updated",
            description: "Health status for all search proxies refreshed.",
            status: "info",
            duration: 3000,
            isClosable: true,
          });
        }
      } finally {
        setIsRefreshing(false);
        if (proxies.length === 0) setIsLoading(false);
      }
    },
    [toast, allProxies, proxies.length]
  );

  // Initial load
  useEffect(() => {
    if (proxies.length === 0) {
      updateProxyStatus();
    }
  }, [updateProxyStatus, proxies.length]);

  // Auto-refresh every 30 seconds
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

  // Filter proxies based on search term, region, provider, and health status
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

    const matchesHealth = isHealthy ? proxy.status.includes("reachable") : !proxy.status.includes("reachable");

    return matchesSearch && matchesRegion && matchesProvider && matchesHealth;
  });

  const handleTitleClick = (region: string) => {
    navigate({ to: "/scraping-api/endpoints/$endpointId", params: { endpointId: region } });
  };

  // Unique providers for filter buttons
  const providerCategories = ["all", ...new Set(allProxies.map((proxy) => proxy.provider))];

  return (
    <Container maxW="full" py={6} color="white">
      <Flex direction="column" gap={4}>
        {/* Title Section */}
        <Flex align="center" justify="space-between" py={2} flexWrap="wrap" gap={4}>
          <Box textAlign="left" flex="1">
            <Text fontSize="xl" fontWeight="bold">
              Search Proxies Dashboard
            </Text>
            <Text fontSize="sm" color="gray.500">
              View and manage search proxies for scraping operations.
            </Text>
          </Box>
        </Flex>

        {/* Search and Filters Section */}
        <Flex gap={4} 
        mb={4}
        position="sticky"
        top="0"
        bg="transparent"
        zIndex="10"
        py={5}
        borderBottom="1px solid"
        borderColor="gray.200"  
        justify="space-between" align="center" flexWrap="wrap">
          <Input
            placeholder="Search proxies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            w={{ base: "100%", md: "250px" }}
            aria-label="Search proxies"
            color="white"
            borderColor="gray.600"
            _hover={{ borderColor: "gray.500" }}
            _focus={{ borderColor: "blue.400" }}
          />
          <HStack spacing={4} ml={{ md: "auto" }} align="center" flexWrap="wrap">
            {providerCategories.map((provider) => (
              <Button
                key={provider}
                size="sm"
                fontWeight="bold"
                borderRadius="full"
                colorScheme={providerFilter === provider ? "blue" : "gray"}
                variant={providerFilter === provider ? "solid" : "outline"}
                onClick={() => setProviderFilter(provider)}
              >
                {provider === "all" ? "All" : provider}
              </Button>
            ))}
            <Button
              size="sm"
              fontWeight="bold"
              borderRadius="full"
              colorScheme={isHealthy ? "green" : "red"}
              variant="solid"
              onClick={() => setIsHealthy(!isHealthy)}
            >
              {isHealthy ? "Healthy" : "Unhealthy"}
            </Button>
            <Select
              value={regionFilter}
              onChange={(e) => setRegionFilter(e.target.value)}
              size="sm"
              w={{ base: "100%", md: "220px" }}
              color="white"
              borderColor="gray.600"
              _hover={{ borderColor: "gray.500" }}
              _focus={{ borderColor: "blue.400" }}
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
              colorScheme="blue"
              onClick={handleRefresh}
              isLoading={isRefreshing}
              isDisabled={isRefreshing}
              size="sm"
            >
              Refresh Now
            </Button>
          </HStack>
        </Flex>

        {/* Proxy List Section */}
        {isLoading ? (
          <Flex justify="center" align="center" h="200px">
            <Spinner size="xl" color="blue.500" />
          </Flex>
        ) : (
          <VStack spacing={4} align="stretch">
            {filteredProxies.map((proxy) => (
              <Box key={`${proxy.provider}-${proxy.region}`} p="4" borderWidth="1px" borderRadius="lg">
                <Flex justify="space-between" align="center" wrap="wrap" gap={2}>
                  <Box flex="1">
                    <Text
                      display="inline"
                      fontWeight="bold"
                      color="blue.400"
                      cursor="pointer"
                      onClick={() => handleTitleClick(proxy.region)}
                      _hover={{ textDecoration: "underline" }}
                    >
                      {proxy.region}
                    </Text>
                    <Badge
                      colorScheme={proxy.status.includes("reachable") ? "green" : "red"}
                      variant="solid"
                      ml={2}
                    >
                      {proxy.status.includes("reachable") ? "Healthy" : "Unhealthy"}
                    </Badge>
                    <Text fontSize="sm" color="gray.300" mt={1}>
                      <strong>Public IP:</strong> {proxy.public_ip || "N/A"}, <strong>Status:</strong>{" "}
                      {proxy.status}, <strong>Last Checked:</strong> {proxy.lastChecked}
                    </Text>
                    <Text fontSize="sm" color="gray.300" mt={1} wordBreak="break-word">
                      <strong>URL:</strong> {proxy.url}
                    </Text>
                  </Box>
                  <Box textAlign="right">
                    <Text fontSize="sm" fontWeight="semibold" color="gray.400">
                      {proxy.provider}
                    </Text>
                    <Text fontSize="sm" color="gray.300" mt={1}>
                      <strong>Batch:</strong> { proxy.region.split("-")[1] || proxy.region}
                    </Text>
                  </Box>
                </Flex>
              </Box>
            ))}
          </VStack>
        )}
      </Flex>
    </Container>
  );
});

ProxyPage.displayName = "SearchProxiesPage";

// Define the route
export const Route = createFileRoute("/_layout/scraping-api/search-proxies")({
  component: ProxyPage,
});

export default ProxyPage;