import { 
  Box, Container, Text, VStack, HStack, Button, Icon, Divider, Select, Stack, Flex 
} from "@chakra-ui/react";
import { createFileRoute } from "@tanstack/react-router";
import { FiSettings, FiDatabase, FiLogOut, FiFilter, FiSend, FiGithub } from "react-icons/fi";
import { FaDiscord } from "react-icons/fa";

import useAuth from "../../hooks/useAuth";

export const Route = createFileRoute("/_layout/")({
  component: Dashboard,
});

function Dashboard() {
  const { user: currentUser, logout } = useAuth();

  return (
    <>
      <Container maxW="full">
        {/* Header Banner */}
        <Box bg="blue.50" p={3} textAlign="center" borderRadius="md">
          <Text fontWeight="bold">🚀 Test our solutions with a 3-day free trial!</Text>
          <Button colorScheme="blue" size="sm" ml={4}>Try now</Button>
        </Box>

        {/* Main Content */}
        <Flex mt={6} gap={6} justify="space-between">
          {/* Sidebar - Settings */}
          <Box w="250px" p={4} borderRight="1px solid #E2E8F0">
            <VStack spacing={4} align="stretch">
              <Button leftIcon={<Icon as={FiDatabase} />} colorScheme="blue" variant="ghost">
                Manage Datasets
              </Button>
              <Button leftIcon={<Icon as={FiSettings} />} colorScheme="teal" variant="ghost">
                Settings
              </Button>
              <Button leftIcon={<Icon as={FiLogOut} />} colorScheme="red" variant="outline" onClick={logout}>
                Logout
              </Button>
            </VStack>
          </Box>

          {/* Main Dashboard Area */}
          <Box flex="1">
            <Box p={4}>
              <Text fontSize="2xl" fontWeight="bold">
                Hi, {currentUser?.full_name || currentUser?.email} 👋🏼
              </Text>
              <Text>Welcome back, nice to see you again!</Text>
            </Box>

            <Divider my={4} />

            {/* Product Filters */}
            <Stack direction={{ base: "column", md: "row" }} spacing={4} align="center">
              <Text fontWeight="bold">Filter by:</Text>
              <HStack>
                <Button size="sm" variant="outline">Feature</Button>
                <Button size="sm" colorScheme="blue">Use Case</Button>
              </HStack>
              <Select placeholder="Filter by the feature or use case">
                <option value="residential">Residential Proxies</option>
                <option value="mobile">Mobile Proxies</option>
                <option value="isp">ISP Pay/GB Proxies</option>
              </Select>
            </Stack>

            {/* Proxy Product Cards */}
            <VStack spacing={6} mt={6} align="stretch">
              <Box p={5} shadow="md" borderWidth="1px" borderRadius="lg">
                <Text fontWeight="bold">🌐 Residential Proxies</Text>
                <Text fontSize="sm">Use for highly protected targets, broad location coverage.</Text>
                <Button mt={2} size="sm" colorScheme="blue">Go to Pricing</Button>
              </Box>
              <Box p={5} shadow="md" borderWidth="1px" borderRadius="lg">
                <Text fontWeight="bold">📱 Mobile Proxies</Text>
                <Text fontSize="sm">Best for mobile-specific location targeting.</Text>
                <Button mt={2} size="sm" colorScheme="blue">Go to Pricing</Button>
              </Box>
              <Box p={5} shadow="md" borderWidth="1px" borderRadius="lg">
                <Text fontWeight="bold">💻 ISP Pay/GB Proxies</Text>
                <Text fontSize="sm">High-performance residential proxies with rotating IPs.</Text>
                <Button mt={2} size="sm" colorScheme="blue">Go to Pricing</Button>
              </Box>
            </VStack>
          </Box>

          {/* Right Sidebar - Community & Support */}
          <Box w="250px" p={4} borderLeft="1px solid #E2E8F0">
            <VStack spacing={4} align="stretch">
              <Box p={4} shadow="sm" borderWidth="1px" borderRadius="lg">
                <Text fontWeight="bold">Pick by Your Target</Text>
                <Text fontSize="sm">Not sure which product to choose?</Text>
                <Button mt={2} leftIcon={<FiSend />} size="sm" variant="outline">Send Test Request</Button>
              </Box>

              <Box p={4} shadow="sm" borderWidth="1px" borderRadius="lg">
                <Text fontWeight="bold">Twitter</Text>
                <Text fontSize="sm">Join our twitter community.</Text> 
                <Button mt={2} leftIcon={<FaDiscord />} size="sm" variant="outline">See Twitter</Button>
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
    </>
  );
}
