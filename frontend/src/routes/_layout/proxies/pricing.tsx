import {
  Container,
  Box,
  Text,
  VStack,
  HStack,
  Divider,
  Flex,
  Icon,
  Grid,
  GridItem,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from "@chakra-ui/react";
import { createFileRoute } from "@tanstack/react-router";
import {
  FiCpu,
  FiDatabase,
  FiCloud,
  FiGlobe,
  FiHardDrive,
  FiHeadphones,
  FiTrendingUp,
  FiZap,
  FiSettings,
} from "react-icons/fi";

// Pricing Categories as Tabs
const pricingCategories = [
  { name: "Compute", icon: FiCpu, bg: "blue.700" },
  { name: "Traffic", icon: FiGlobe, bg: "purple.600" },
  { name: "Storage", icon: FiHardDrive, bg: "orange.600" },
  { name: "Databases", icon: FiDatabase, bg: "teal.600" },
  { name: "AI & ML", icon: FiZap, bg: "red.600" },
  { name: "Security", icon: FiSettings, bg: "green.600" },
  { name: "Support", icon: FiHeadphones, bg: "cyan.600" },
  { name: "Enterprise", icon: FiTrendingUp, bg: "yellow.600" },
];

// Pricing Plans - Full Length for Side-by-Side Comparison
const pricingPlans = [
  { name: "On-Demand", description: "Pay-as-you-go flexible pricing.", price: "Per Usage", color: "blue.500" },
  { name: "Reserved", description: "Commit to 1-3 years for lower pricing.", price: "Up to 40% Off", color: "green.500" },
  { name: "Spot", description: "Discounted unused cloud capacity.", price: "Up to 70% Off", color: "purple.500" },
  { name: "Enterprise", description: "Custom solutions & dedicated support.", price: "Custom Pricing", color: "orange.500" },
];

// Pricing Breakdown for Each Category
const categoryPricing = {
  Compute: [
    { service: "vCPU (per hour)", OnDemand: "$0.05", Reserved: "$0.03", Spot: "$0.015", Enterprise: "Custom Pricing" },
    { service: "Memory (per GB-hour)", OnDemand: "$0.01", Reserved: "$0.007", Spot: "$0.004", Enterprise: "Custom Pricing" },
    { service: "GPU Instance (per hour)", OnDemand: "$2.50", Reserved: "$1.80", Spot: "$1.00", Enterprise: "Custom Pricing" },
    { service: "Bare Metal Server (per hour)", OnDemand: "$5.00", Reserved: "$4.00", Spot: "$2.50", Enterprise: "Custom Pricing" },
  ],
  Traffic: [
    { service: "Inbound Traffic (per GB)", OnDemand: "Free", Reserved: "Free", Spot: "Free", Enterprise: "Free" },
    { service: "Outbound Traffic (per GB)", OnDemand: "$0.08", Reserved: "$0.06", Spot: "$0.04", Enterprise: "Custom Pricing" },
    { service: "Private Network Traffic (per GB)", OnDemand: "$0.02", Reserved: "$0.015", Spot: "$0.01", Enterprise: "Custom Pricing" },
    { service: "CDN Bandwidth (per GB)", OnDemand: "$0.05", Reserved: "$0.03", Spot: "$0.02", Enterprise: "Custom Pricing" },
  ],
};

function Pricing() {
  return (
    <Container maxW="100vw" minH="100vh" bg="gray.900" color="white" py={8}>
      {/* Standard Page Layout */}
      <Box textAlign="center" mb={8}>
        <Text fontSize="3xl" fontWeight="bold">Cloud Pricing</Text>
        <Text fontSize="md" color="gray.400">
          Compare pricing for Compute, Storage, Traffic, AI, and Security.
        </Text>
      </Box>

      <Divider my={4} borderColor="gray.600" />

      {/* Tabs for Pricing Categories */}
      <Tabs variant="enclosed" colorScheme="blue">
        <TabList>
          {pricingCategories.map((category, index) => (
            <Tab key={index}>
              <Icon as={category.icon} boxSize={4} mr={2} /> {category.name}
            </Tab>
          ))}
        </TabList>

        <TabPanels>
          {pricingCategories.map((category, index) => (
            <TabPanel key={index}>
              {/* Title for Selected Category */}
              <Box mb={6}>
                <Text fontSize="2xl" fontWeight="bold">{category.name} Pricing</Text>
                <Text fontSize="md" color="gray.400">
                  Transparent and predictable {category.name.toLowerCase()} costs.
                </Text>
              </Box>

              {/* Side-by-Side Plan Comparisons */}
              <Grid templateColumns={{ base: "1fr", md: "repeat(4, 1fr)" }} gap={6}>
                {pricingPlans.map((plan, idx) => (
                  <GridItem key={idx} p={6} bg={plan.color} borderRadius="lg">
                    <Text fontSize="xl" fontWeight="bold">{plan.name}</Text>
                    <Text fontSize="sm" color="whiteAlpha.800">{plan.description}</Text>
                    <Badge colorScheme="blackAlpha" mt={2} px={3}>{plan.price}</Badge>
                  </GridItem>
                ))}
              </Grid>

              {/* Full-Length Table Comparison */}
              <Box mt={8} overflowX="auto">
                <Table size="md" variant="unstyled">
                  <Thead>
                    <Tr>
                      <Th color="gray.300">Service</Th>
                      <Th color="gray.300">On-Demand</Th>
                      <Th color="gray.300">Reserved</Th>
                      <Th color="gray.300">Spot</Th>
                      <Th color="gray.300">Enterprise</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {categoryPricing[category.name]?.map((item, idy) => (
                      <Tr key={idy}>
                        <Td>{item.service}</Td>
                        <Td>
                          <Badge colorScheme="blue" px={2}>{item.OnDemand}</Badge>
                        </Td>
                        <Td>
                          <Badge colorScheme="green" px={2}>{item.Reserved}</Badge>
                        </Td>
                        <Td>
                          <Badge colorScheme="purple" px={2}>{item.Spot}</Badge>
                        </Td>
                        <Td>
                          <Badge colorScheme="orange" px={2}>{item.Enterprise}</Badge>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </Box>
            </TabPanel>
          ))}
        </TabPanels>
      </Tabs>
    </Container>
  );
}

export const Route = createFileRoute("/_layout/pricing")({
  component: Pricing,
});

export default Pricing;
