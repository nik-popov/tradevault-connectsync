import { 
  Box, Container, Text, VStack, Button, Divider, Stack, Flex, Switch, HStack 
} from "@chakra-ui/react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { FiSend, FiGithub } from "react-icons/fi";
import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import useAuth from "../../hooks/useAuth";

export const Route = createFileRoute("/_layout/")({
  component: Dashboard,
});

function Dashboard() {
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // ✅ Load Subscription State from LocalStorage & React Query
  const [subscriptionSettings, setSubscriptionSettings] = useState({
    hasSubscription: false,
    isTrial: false,
    isDeactivated: false,
  });

  useEffect(() => {
    const storedSettings = localStorage.getItem("subscriptionSettings");
    if (storedSettings) {
      setSubscriptionSettings(JSON.parse(storedSettings));
    } else {
      const querySettings = queryClient.getQueryData("subscriptionSettings");
      if (querySettings) {
        setSubscriptionSettings(querySettings);
      }
    }
  }, [queryClient]);

  const { hasSubscription, isTrial, isDeactivated } = subscriptionSettings;
  const isLocked = !hasSubscription && !isTrial;
  const isFullyDeactivated = isDeactivated && !hasSubscription;

  // ✅ Toggle Filters
  const [ownedOnly, setOwnedOnly] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all"); // Main filter

  const proxyProducts = [
    { id: "residential", name: "🌐 Residential Proxies", type: "Proxy", description: "Highly protected targets, broad location coverage.", owned: true, path: "/proxies/residential" },
    { id: "residential-mobile", name: "📱 Mobile Proxies", type: "Proxy", description: "Best for mobile-specific location targeting.", owned: false, path: "/proxies/residential-mobile" },
    { id: "datacenter", name: "💻 Datacenter Proxies", type: "Proxy", description: "High-performance proxies with rotating IPs.", owned: true, path: "/proxies/datacenter" },
    { id: "datacenter-mobile", name: "📡 Datacenter Mobile Proxies", type: "Proxy", description: "Optimized for mobile traffic.", owned: false, path: "/proxies/datacenter-mobile" },

    // SERP Products - Updated Paths
    { id: "browser-proxy", name: "🖥️ Browser Proxy", type: "SERP", description: "Seamless proxy setup for browser-based automation.", owned: false, path: "/scraping-api/explore" },
    { id: "google-serp", name: "🔍 Google SERP Results", type: "SERP", description: "Scrape real-time Google search results.", owned: false, path: "/scraping-api/google-serp-api" },
    { id: "google-serp-images", name: "🖼️ Google SERP Images", type: "SERP", description: "Extract images from Google search results.", owned: false, path: "/scraping-api/google-image-serp-api" },

    // Datasets
    { id: "explore-dataset", name: "📊 Explore Datasets", type: "Data", description: "Tailored datasets for your needs.", owned: false, path: "/datasets/explore" },
    { id: "custom-dataset", name: "📊 Request Custom Dataset", type: "Data", description: "Tailored data scraping for your needs.", owned: false, path: "/datasets/request" },
  ];

  // ✅ Apply Subscription Locks
  const filteredProducts = proxyProducts.filter(
    (product) =>
      (activeFilter === "all" || product.type === activeFilter) &&
      (!ownedOnly || product.owned)
  );

  return (
    <Container maxW="full">
      {/* 🚀 Promo Header */}
      <Box bg="blue.100" p={4} textAlign="center" borderRadius="md">
        <Text fontWeight="bold" fontSize="lg">🚀 Get a 3-day free trial of our proxies!</Text>
        <Button colorScheme="blue" size="sm" mt={2} onClick={() => navigate("/proxies/pricing")}>
          Try now
        </Button>
      </Box>

      {/* Filters & Welcome Section */}
      <Flex mt={6} gap={4} justify="space-between" align="center" flexWrap="wrap">
        {/* Welcome Message */}
        <Box textAlign="left" flex="1">
          <Text fontSize="xl" fontWeight="bold">
            Hi, {currentUser?.full_name || currentUser?.email} 👋🏼
          </Text>
          <Text fontSize="sm">Welcome back, let’s get started!</Text>
        </Box>

        {/* Owned Toggle */}
        <HStack spacing={3}>
          <Text fontWeight="bold">Owned Only</Text>
          <Switch 
            isChecked={ownedOnly} 
            onChange={() => setOwnedOnly(prev => !prev)} 
            colorScheme="blue"
          />
        </HStack>

        {/* Filter Buttons */}
        <Stack direction="row" spacing={3} flexWrap="wrap">
          {["All", "SERP", "Proxy", "Data"].map((type) => (
            <Button 
              key={type} 
              size="md"
              fontWeight="bold"
              borderRadius="full"
              colorScheme={activeFilter === type || (type === "All" && activeFilter === "all") ? "blue" : "gray"}
              variant={activeFilter === type || (type === "All" && activeFilter === "all") ? "solid" : "outline"}
              onClick={() => setActiveFilter(type === "All" ? "all" : type)}
            >
              {type}
            </Button>
          ))}
        </Stack>
      </Flex>

      <Divider my={4} />

      {/* Subscription Restriction */}
      {isLocked ? (
        <Box textAlign="center" mt={6}>
          <Text fontSize="lg" fontWeight="bold" color="red.500">
            🔒 Access restricted! Subscribe to unlock full dashboard access.
          </Text>
          <Button mt={3} colorScheme="blue" onClick={() => navigate("/billing")}>
            Upgrade Now
          </Button>
        </Box>
      ) : (
        <Flex mt={6} gap={6} justify="space-between">
          {/* Main Content */}
          <Box flex="1">
            <VStack spacing={6} align="stretch">
              {filteredProducts.length === 0 ? (
                <Text textAlign="center" fontSize="lg" color="gray.500">
                  No products match this filter.
                </Text>
              ) : (
                filteredProducts.map((product) => (
                  <Box 
                    key={product.id} 
                    p={5} 
                    shadow="md" 
                    borderWidth="1px" 
                    borderRadius="lg" 
                    bg="gray.50"
                    _hover={{ shadow: "lg", transform: "scale(1.02)" }}
                    transition="0.2s ease-in-out"
                  >
                    <Text fontWeight="bold" fontSize="lg">{product.name}</Text>
                    <Text fontSize="sm" color="gray.600">{product.description}</Text>
                    <Button mt={3} size="sm" colorScheme="blue" borderRadius="full" onClick={() => navigate(product.path)}>
                      Manage
                    </Button>
                  </Box>
                ))
              )}
            </VStack>
          </Box>
        </Flex>
      )}
    </Container>
  );
}

export default Dashboard;
