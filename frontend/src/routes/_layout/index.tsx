import { 
  Box, Container, Text, VStack, HStack, Button, Divider, Select, Stack, Flex, Switch 
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
  const [filter, setFilter] = useState("");
  const [ownedOnly, setOwnedOnly] = useState(true);
  const [typeFilter, setTypeFilter] = useState(""); // New type filter

  const proxyProducts = [
    { id: "residential", name: "🌐 Residential Proxies", type: "Residential", description: "Use for highly protected targets, broad location coverage.", owned: true },
    { id: "residential-mobile", name: "📱 Mobile Proxies", type: "Residential", description: "Best for mobile-specific location targeting.", owned: false },
    { id: "datacenter", name: "💻 Datacenter Pay/GB Proxies", type: "Datacenter", description: "High-performance residential proxies with rotating IPs.", owned: true },
    { id: "datacenter-mobile", name: "📡 Datacenter Mobile Proxies", type: "Datacenter", description: "Optimized for mobile data traffic.", owned: false },
    { id: "browser-proxy", name: "🖥️ Browser Proxy", type: "Other", description: "Seamless proxy setup for browser-based automation.", owned: false },
    { id: "google-serp", name: "🔍 Google SERP Results", type: "Other", description: "Scrape real-time Google search results.", owned: false },
    { id: "google-serp-images", name: "🖼️ Google SERP Images", type: "Other", description: "Extract images from Google search results.", owned: false },
    { id: "custom-dataset", name: "📊 Request Custom Dataset", type: "Other", description: "Tailored data scraping for your needs.", owned: false },
  ];

  const filteredProducts = proxyProducts.filter((product) => 
    (filter === "" || product.id === filter) &&
    (typeFilter === "" || product.type === typeFilter) &&
    (!ownedOnly || product.owned)
  );

  return (
    <Container maxW="full">
      {/* Header Section */}
      <Box bg="blue.50" p={3} textAlign="center" borderRadius="md">
        <Text fontWeight="bold">🚀 Test our solutions with a 3-day free trial!</Text>
        <Button colorScheme="blue" size="sm" ml={4} onClick={() => navigate({ to: "/proxies/pricing" })}>
          Try now
        </Button>
      </Box>

      {/* Filter Buttons */}
      <Stack direction="row" mt={6} spacing={2} justify="center">
        {["All", "Residential", "Datacenter", "Other"].map((type) => (
          <Button 
            key={type} 
            size="sm"
            colorScheme={typeFilter === type || (type === "All" && typeFilter === "") ? "blue" : "gray"}
            onClick={() => setTypeFilter(type === "All" ? "" : type)}
          >
            {type}
          </Button>
        ))}
      </Stack>

      <Flex mt={6} gap={6} justify="space-between">
        {/* Main Content */}
        <Box flex="1">
          <Box p={4}>
            <Text fontSize="2xl" fontWeight="bold">
              Hi, {currentUser?.full_name || currentUser?.email} 👋🏼
            </Text>
            <Text>Welcome back, nice to see you again!</Text>
          </Box>
          <Divider my={4} />

          {/* Filter Controls */}
          <Stack direction={{ base: "column", md: "row" }} spacing={4} align="center">
            <Text fontWeight="bold">Filter by:</Text>
            <Select placeholder="Filter by product" onChange={(e) => setFilter(e.target.value)}>
              <option value="residential">Residential Proxies</option>
              <option value="residential-mobile">Mobile Proxies</option>
              <option value="datacenter">Datacenter Proxies</option>
              <option value="datacenter-mobile">Datacenter Mobile Proxies</option>
              <option value="browser-proxy">Browser Proxy</option>
              <option value="google-serp">Google SERP Results</option>
              <option value="google-serp-images">Google SERP Images</option>
              <option value="custom-dataset">Request Custom Dataset</option>
            </Select>
            <HStack>
              <Text fontWeight="bold">Owned Only</Text>
              <Switch isChecked={ownedOnly} onChange={() => setOwnedOnly(!ownedOnly)} />
            </HStack>
          </Stack>

          {/* Proxy Products List */}
          <VStack spacing={6} mt={6} align="stretch">
            {filteredProducts.map((product) => (
              <Box key={product.id} p={5} shadow="md" borderWidth="1px" borderRadius="lg">
                <Text fontWeight="bold">{product.name}</Text>
                <Text fontSize="sm">{product.description}</Text>
                <Button mt={2} size="sm" colorScheme="blue" onClick={() => navigate({ to: `/proxies/${product.id}` })}>
                  Manage
                </Button>
              </Box>
            ))}
          </VStack>
        </Box>

        {/* Sidebar */}
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
