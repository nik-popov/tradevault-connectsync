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
  const [ownedOnly, setOwnedOnly] = useState(true);
  const [activeFilter, setActiveFilter] = useState("SearchAPI");

  type Product = {
    id: string;
    name: string;
    type: string;
    description: string;
    owned: boolean;
    path: string;
  };

  const proxyProducts: Product[] = [
    { id: "google-serp", name: "⚙️ Google Search API", type: "SearchAPI", description: "Scrape real-time Google search results.", owned: true, path: "/scraping-api/google-serp" },
  ];

  const filteredProducts = useMemo(() => {
    return proxyProducts.filter((product) => {
      const matchesFilter =
        activeFilter === "all" ||
        product.type.toLowerCase() === activeFilter.toLowerCase();
      const matchesOwnership = !ownedOnly || product.owned;
      return matchesFilter && matchesOwnership;
    });
  }, [activeFilter, ownedOnly]);

  return (
    <Container maxW="full" bg="gray.50" minH="100vh">
      {/* Filters & Toggle */}
      <Flex mt={6} gap={4} justify="space-between" align="center" flexWrap="wrap">
        <Flex gap={2}>
  {["All", "SearchAPI"].map((type) => (
    <Button
      key={type}
      size="md"
      fontWeight="bold"
      borderRadius="full"
      colorScheme={
        activeFilter === type.toLowerCase() || 
        (type === "All" && activeFilter === "all") ? "blue" : "gray"
      }
      variant={
        activeFilter === type.toLowerCase() || 
        (type === "All" && activeFilter === "all") ? "solid" : "outline"
      }
      color={
        activeFilter === type.toLowerCase() || 
        (type === "All" && activeFilter === "all") ? "gray.800" : "gray.600"
      }
      onClick={() => setActiveFilter(type === "All" ? "all" : type.toLowerCase())}
    >
      {type}
    </Button>
  ))}
</Flex>
      </Flex>

      <Divider my={4} borderColor="gray.200" />

      <Flex mt={6} gap={6} justify="space-between">
        <Box flex="1">
          <VStack spacing={6} mt={6} align="stretch">
            {filteredProducts.length === 0 ? (
              <Text textAlign="center" fontSize="lg" color="gray.600">No products match this filter.</Text>
            ) : (
              filteredProducts.map((product) => (
                <Box 
                  key={product.id} 
                  p={5} 
                  shadow="md" 
                  borderWidth="1px" 
                  borderRadius="lg" 
                  bg="white"
                  borderColor="gray.200"
                >
                  <Text fontWeight="bold" fontSize="lg" color="gray.800">{product.name}</Text>
                  <Text fontSize="sm" color="gray.600">{product.description}</Text>
                  <Button 
                    mt={3} 
                    size="sm" 
                    colorScheme="blue" 
                    borderRadius="full" 
                    onClick={() => navigate({ to: product.path })}
                  >
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