import { useState, useMemo } from "react";
import {
  Box,
  Container,
  Text,
  VStack,
  Button,
  Divider,
  Flex,
  Switch,
} from "@chakra-ui/react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { FiGithub, FiMail, FiHelpCircle } from "react-icons/fi";
import { useQuery } from "@tanstack/react-query";

// Import useMemo correctly ✅
import { useMemo } from "react";

export const Route = createFileRoute("/_layout/")({
  component: Dashboard,
});

function Dashboard() {
  const navigate = useNavigate();
  
  // Load Subscription State ✅
  const { data: subscriptionSettings } = useQuery({
    queryKey: ["subscriptionSettings"],
    queryFn: () => {
      const storedSettings = localStorage.getItem("subscriptionSettings");
      return storedSettings ? JSON.parse(storedSettings) : {};
    },
    staleTime: Infinity,
  });

  // Ensure subscription settings exist ✅
  const hasSubscription = subscriptionSettings?.Proxies?.hasSubscription || false;
  const isTrial = subscriptionSettings?.Proxies?.isTrial || false;
  const isLocked = !hasSubscription && !isTrial;

  // UI State
  const [ownedOnly, setOwnedOnly] = useState(true); // ✅ Default to owned products
  const [activeFilter, setActiveFilter] = useState("all");

  // ✅ Define `proxyProducts` with `owned` property
  type Product = {
    id: string;
    name: string;
    type: string;
    description: string;
    owned: boolean;
    path: string;
  };

  // ✅ Define Products & Match Ownership Based on Subscription
  const proxyProducts = [
    { id: "residential", name: "🌐 Residential Proxies", type: "proxy", description: "Highly protected targets, broad location coverage.", path: "/proxies/residential" },
    { id: "residential-mobile", name: "📱 Mobile Proxies", type: "proxy", description: "Best for mobile-specific location targeting.", path: "/proxies/residential-mobile" },
    { id: "datacenter", name: "💻 Datacenter Proxies", type: "proxy", description: "High-performance proxies with rotating IPs.", path: "/proxies/datacenter" },
    { id: "datacenter-mobile", name: "📡 Datacenter Mobile Proxies", type: "proxy", description: "Optimized for mobile traffic.", path: "/proxies/datacenter-mobile" },
    { id: "browser-proxy", name: "🖥️ Browser Proxy", type: "serp", description: "Seamless proxy setup for browser-based automation.", path: "/scraping-api/explore" },
    { id: "google-serp", name: "🔍 Google SERP Results", type: "serp", description: "Scrape real-time Google search results.", path: "/scraping-api/google-serp-api" },
    { id: "explore-dataset", name: "📊 Explore Datasets", type: "data", description: "Tailored datasets for your needs.", path: "/datasets/explore" },
    { id: "custom-dataset", name: "📊 Request Custom Dataset", type: "data", description: "Tailored data scraping for your needs.", path: "/datasets/request" },
  ];

  const filteredProducts = useMemo(() => {
    return proxyProducts.filter((product) => {
      const matchesFilter = activeFilter === "all" || product.type === activeFilter;
      const matchesOwnership = !ownedOnly || product.owned; // ✅ Ensure `owned` exists in products
      return matchesFilter && matchesOwnership;
    });
  }, [activeFilter, ownedOnly, proxyProducts]); // ✅ Recalculate only when dependencies change
  
  

  return (
    <Container maxW="full">
      {/* 🚀 Promo Banner */}
      {!isTrial && !hasSubscription && (
        <Box bg="blue.100" p={4} textAlign="center" borderRadius="md">
          <Text fontWeight="bold" fontSize="lg">
            🚀 Get a 3-day free trial of our proxies!
          </Text>
          <Button colorScheme="blue" size="sm" mt={2} onClick={() => navigate({ to: "/proxies/pricing" })}>
            Try now
          </Button>
        </Box>
      )}

      {isLocked && !isTrial && (
        <Box bg="red.100" p={4} textAlign="center" borderRadius="md">
          <Text fontWeight="bold" fontSize="lg">
            ⚠️ Access Limited - Get a Subscription!
          </Text>
          <Button colorScheme="red" size="sm" mt={2} onClick={() => navigate({ to: "/proxies/pricing" })}>
            View Subscription Plans
          </Button>
        </Box>
      )}

      {/* Filters & Toggle */}
      <Flex mt={6} gap={4} justify="space-between" align="center" flexWrap="wrap">
        <Box textAlign="left" flex="1">
          <Text fontSize="xl" fontWeight="bold">
            Hi, {currentUser?.full_name || currentUser?.email} 👋🏼
          </Text>
          <Text fontSize="sm">Welcome back, let’s get started!</Text>
        </Box>

        {/* Owned Only Filter Toggle */}
        <Flex align="center">
          <Text fontWeight="bold" mr={2}>Owned Only</Text>
          <Switch isChecked={ownedOnly} onChange={() => setOwnedOnly((prev) => !prev)} colorScheme="blue" mr={4} />
        </Flex>

        {/* Filter Buttons */}
        <Flex gap={2}>
          {["All", ...PRODUCTS].map((type) => (
    <Button
    key={type}
    onClick={() => setActiveFilter(type === "All" ? "all" : type)} // ✅ Fix
  >
    {type}
  </Button>
  
          ))}
        </Flex>
      </Flex>

      <Divider my={4} />

      <Flex mt={6} gap={6} justify="space-between">
        {/* Main Content */}
        <Box flex="1">
          <VStack spacing={6} mt={6} align="stretch">
            {filteredProducts.length === 0 ? (
              <Text textAlign="center" fontSize="lg" color="gray.500">No products match this filter.</Text>
            ) : (
              filteredProducts.map((product) => (
                <Box key={product.id} p={5} shadow="md" borderWidth="1px" borderRadius="lg" bg="gray.50" _hover={{ shadow: "lg", transform: "scale(1.02)" }} transition="0.2s ease-in-out">
                  <Text fontWeight="bold" fontSize="lg">{product.name}</Text>
                  <Text fontSize="sm" color="gray.600">{product.description}</Text>
                  <Button mt={3} size="sm" colorScheme="blue" borderRadius="full" onClick={() => navigate({ to: product.path })}>
                    Manage
                  </Button>
                </Box>
              ))
            )}
          </VStack>
        </Box>
      </Flex>
    </Container>
  );
}

export default Dashboard;
