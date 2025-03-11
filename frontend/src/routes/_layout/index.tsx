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

export const Route = createFileRoute("/_layout/")({
  component: Dashboard,
});

function Dashboard() {
  const navigate = useNavigate();
  
  // ✅ Default to owned products
  const [ownedOnly, setOwnedOnly] = useState(true);
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

  const proxyProducts: Product[] = [
    { id: "google-serp", name: "🔍 Google SERP Results", type: "SERP", description: "Scrape real-time Google search results.", owned: true, path: "/scraping-api/google-serp" },
    { id: "cettire", name: "🔍Cettire", type: "SERP", description: "Scrape Cettire search results.", owned: false, path: "/scraping-api/cettire" },
    { id: "icon-gpt", name: "🤖 IconGpt", type: "AI", description: "Use OpenAI and X models.", owned: true, path: "/ai/icongpt" },
    { id: "manage-proxy", name: "👺 Proxy Management", type: "SERP", description: "Manage Proxy Endpoints.", owned: true, path: "/scraping-api/search-proxies" },
   
  ];

  // ✅ Optimize filtering with useMemo
  const filteredProducts = useMemo(() => {
    return proxyProducts.filter((product) => {
      const matchesFilter = activeFilter === "all" || product.type === activeFilter;
      const matchesOwnership = !ownedOnly || product.owned;
      return matchesFilter && matchesOwnership;
    });
  }, [activeFilter, ownedOnly, proxyProducts]);

  return (
    <Container maxW="full">
      {/* 🚀 Promo Banner */}

      {/* Filters & Toggle */}
      <Flex mt={6} gap={4} justify="space-between" align="center" flexWrap="wrap">
        {/* Owned Filter Toggle */}
        <Flex align="center">
          <Text fontWeight="bold" mr={2}>My Products</Text>
          <Switch isChecked={ownedOnly} onChange={() => setOwnedOnly((prev) => !prev)} colorScheme="blue" mr={4} />
        </Flex>

        {/* Filter Buttons */}
        <Flex gap={2}>
          {["All", "SERP"].map((type) => (
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
                <Box key={product.id} p={5} shadow="md" borderWidth="1px" borderRadius="lg" bg="gray.700">
                  <Text fontWeight="bold" fontSize="lg">{product.name}</Text>
                  <Text fontSize="sm" color="gray.200">{product.description}</Text>
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
