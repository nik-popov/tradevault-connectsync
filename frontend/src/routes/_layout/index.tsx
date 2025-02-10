import { 
  Box, Container, Text, VStack, Button, Divider, Stack, Flex, Switch 
} from "@chakra-ui/react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { FiSend, FiGithub } from "react-icons/fi";
import { useState } from "react";
import useAuth from "../../hooks/useAuth";

export const Route = createFileRoute("/_layout/")({
  component: Dashboard,
});

function Dashboard() {
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();
  const [ownedOnly, setOwnedOnly] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all"); // Main filter

  const proxyProducts = [
    { id: "residential", name: "🌐 Residential Proxies", type: "Proxy", description: "Highly protected targets, broad location coverage.", owned: true },
    { id: "residential-mobile", name: "📱 Mobile Proxies", type: "Proxy", description: "Best for mobile-specific location targeting.", owned: false },
    { id: "datacenter", name: "💻 Datacenter Proxies", type: "Proxy", description: "High-performance proxies with rotating IPs.", owned: true },
    { id: "datacenter-mobile", name: "📡 Datacenter Mobile Proxies", type: "Proxy", description: "Optimized for mobile traffic.", owned: false },
    { id: "browser-proxy", name: "🖥️ Browser Proxy", type: "SERP", description: "Seamless proxy setup for browser-based automation.", owned: false },
    { id: "google-serp", name: "🔍 Google SERP Results", type: "SERP", description: "Scrape real-time Google search results.", owned: false },
    { id: "google-serp-images", name: "🖼️ Google SERP Images", type: "SERP", description: "Extract images from Google search results.", owned: false },
    { id: "custom-dataset", name: "📊 Request Custom Dataset", type: "Data", description: "Tailored data scraping for your needs.", owned: false },
  ];

  const filteredProducts = proxyProducts.filter(
    (product) =>
      (activeFilter === "all" || product.type === activeFilter) &&
      (!ownedOnly || product.owned)
  );

  return (
    <Container maxW="full">
      {/* Header Section */}
      <Box bg="blue.100" p={4} textAlign="center" borderRadius="md">
        <Text fontWeight="bold" fontSize="lg">🚀 Get a 3-day free trial of our proxies!</Text>
        <Button colorScheme="blue" size="sm" mt={2} onClick={() => navigate({ to: "/proxies/pricing" })}>
          Try now
        </Button>
      </Box>
  
      {/* Filters & Toggle in the Same Row */}
      <Flex mt={6} gap={4} justify="space-between" align="center" flexWrap="wrap">
  {/* Welcome Message - Aligned Left */}
  <Box textAlign="left" flex="1">
    <Text fontSize="xl" fontWeight="bold">
      Hi, {currentUser?.full_name || currentUser?.email} 👋🏼
    </Text>
    <Text fontSize="sm">Welcome back, let’s get started!</Text>
  </Box>

  {/* Owned Filter Toggle - Moved to the Right of Filters */}
  <Flex align="center">
    <Text fontWeight="bold" mr={2}>Owned Only</Text>
    <Switch 
      isChecked={ownedOnly} 
      onChange={() => setOwnedOnly(prev => !prev)} 
      colorScheme="blue" 
      mr={4} // Added margin for spacing
    />
  </Flex>

  {/* Filter Buttons - Stay in Same Row */}
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

  
      {/* Divider below for separation */}
      <Divider my={4} />
  
      <Flex mt={6} gap={6} justify="space-between">
        {/* Main Content */}
        <Box flex="1">
          <VStack spacing={6} mt={6} align="stretch">
            {filteredProducts.length === 0 ? (
              <Text textAlign="center" fontSize="lg" color="gray.500">No products match this filter.</Text>
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
                  <Button 
                    mt={3} 
                    size="sm" 
                    colorScheme="blue" 
                    borderRadius="full"
                    onClick={() => navigate({ to: `/proxies/${product.id}` })}
                  >
                    Manage
                  </Button>
                </Box>
              ))
            )}
          </VStack>
        </Box>
  
        {/* Sidebar - This was missing a closing tag */}
        <Box w="250px" p={4} borderLeft="1px solid #E2E8F0">
          <VStack spacing={4} align="stretch">
            {/* Test Request */}
            <Box p={4} shadow="sm" borderWidth="1px" borderRadius="lg">
              <Text fontWeight="bold">Pick by Your Target</Text>
              <Text fontSize="sm">Not sure which product to choose?</Text>
              <Button mt={2} leftIcon={<FiSend />} size="sm" variant="outline" onClick={() => navigate({ to: "/test-request" })}>
                Send Test Request
              </Button>
            </Box>
  
            {/* Twitter */}
            <Box p={4} shadow="sm" borderWidth="1px" borderRadius="lg">
              <Text fontWeight="bold">Twitter</Text>
              <Text fontSize="sm">Join our Twitter community.</Text> 
              <Button mt={2} leftIcon={<FiGithub />} size="sm" variant="outline" onClick={() => window.open("https://twitter.com/CobaltData", "_blank")}>
                See Twitter
              </Button>
            </Box>
  
            {/* GitHub */}
            <Box p={4} shadow="sm" borderWidth="1px" borderRadius="lg">
              <Text fontWeight="bold">GitHub</Text>
              <Text fontSize="sm">Explore integration guides and open-source projects.</Text>
              <Button mt={2} leftIcon={<FiGithub />} size="sm" variant="outline" onClick={() => window.open("https://github.com/CobaltDataNet", "_blank")}>
                Join GitHub
              </Button>
            </Box>
          </VStack>
        </Box>
      </Flex>
    </Container>
  );
  
}

export default Dashboard;
