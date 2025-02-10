import { 
  Box, Container, Text, VStack, HStack, Button, Divider, Select, Stack, Flex, Switch 
} from "@chakra-ui/react";
import { createFileRoute } from "@tanstack/react-router";
import { FiSend, FiGithub } from "react-icons/fi";
import { useState } from "react";
import useAuth from "../../hooks/useAuth";

export const Route = createFileRoute("/_layout/")({
  component: Dashboard,
});

function Dashboard() {
  const { user: currentUser } = useAuth();
  const [filter, setFilter] = useState("");
  const [ownedOnly, setOwnedOnly] = useState(true);

  const proxyProducts = [
    { id: "residential", name: "🌐 Residential Proxies", description: "Use for highly protected targets, broad location coverage.", owned: true },
    { id: "mobile", name: "📱 Mobile Proxies", description: "Best for mobile-specific location targeting.", owned: false },
    { id: "isp", name: "💻 ISP Pay/GB Proxies", description: "High-performance residential proxies with rotating IPs.", owned: true },
  ];

  const filteredProducts = proxyProducts.filter((product) => 
    (filter === "" || product.id === filter) && (!ownedOnly || product.owned)
  );

  return (
    <Container maxW="full">
      <Box bg="blue.50" p={3} textAlign="center" borderRadius="md">
        <Text fontWeight="bold">🚀 Test our solutions with a 3-day free trial!</Text>
        <Button colorScheme="blue" size="sm" ml={4}>Try now</Button>
      </Box>
      <Flex mt={6} gap={6} justify="space-between">
        <Box flex="1">
          <Box p={4}>
            <Text fontSize="2xl" fontWeight="bold">
              Hi, {currentUser?.full_name || currentUser?.email} 👋🏼
            </Text>
            <Text>Welcome back, nice to see you again!</Text>
          </Box>
          <Divider my={4} />
          <Stack direction={{ base: "column", md: "row" }} spacing={4} align="center">
            <Text fontWeight="bold">Filter by:</Text>
            <Select placeholder="Filter by product" onChange={(e) => setFilter(e.target.value)}>
              <option value="residential">Residential Proxies</option>
              <option value="mobile">Mobile Proxies</option>
              <option value="isp">ISP Pay/GB Proxies</option>
            </Select>
            <HStack>
              <Text fontWeight="bold">Owned Only</Text>
              <Switch isChecked={ownedOnly} onChange={() => setOwnedOnly(!ownedOnly)} />
            </HStack>
          </Stack>
          <VStack spacing={6} mt={6} align="stretch">
            {filteredProducts.map((product) => (
              <Box key={product.id} p={5} shadow="md" borderWidth="1px" borderRadius="lg">
                <Text fontWeight="bold">{product.name}</Text>
                <Text fontSize="sm">{product.description}</Text>
                <Button mt={2} size="sm" colorScheme="blue">Go to Pricing</Button>
              </Box>
            ))}
          </VStack>
        </Box>
        <Box w="250px" p={4} borderLeft="1px solid #E2E8F0">
          <VStack spacing={4} align="stretch">
            <Box p={4} shadow="sm" borderWidth="1px" borderRadius="lg">
              <Text fontWeight="bold">Pick by Your Target</Text>
              <Text fontSize="sm">Not sure which product to choose?</Text>
              <Button mt={2} leftIcon={<FiSend />} size="sm" variant="outline">Send Test Request</Button>
            </Box>
            <Box p={4} shadow="sm" borderWidth="1px" borderRadius="lg">
              <Text fontWeight="bold">Twitter</Text>
              <Text fontSize="sm">Join our Twitter community.</Text> 
              <Button mt={2} leftIcon={<FiGithub />} size="sm" variant="outline">See Twitter</Button>
            </Box>
            <Box p={4} shadow="sm" borderWidth="1px" borderRadius="lg">
              <Text fontWeight="bold">GitHub</Text>
              <Text fontSize="sm">Explore integration guides and open-source projects.</Text>
              <Button mt={2} leftIcon={<FiGithub />} size="sm" variant="outline">Join GitHub</Button>
            </Box>
          </VStack>
        </Box>
      </Flex>
    </Container>
  );
}