import {
  Container,
  Box,
  Text,
  VStack,
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
  { name: "Compute", icon: FiCpu },
  { name: "Traffic", icon: FiGlobe },
  { name: "Storage", icon: FiHardDrive },
  { name: "Databases", icon: FiDatabase },
  { name: "AI & ML", icon: FiZap },
  { name: "Security", icon: FiSettings },
  { name: "Support", icon: FiHeadphones },
  { name: "Enterprise", icon: FiTrendingUp },
];

// Pricing Plans for Side-by-Side Comparison
const pricingPlans = [
  { name: "On-Demand", description: "Pay-as-you-go pricing.", price: "Per Usage", color: "blue.400" },
  { name: "Reserved", description: "Commit to 1-3 years for savings.", price: "Up to 40% Off", color: "green.400" },
  { name: "Spot", description: "Get the best deals on unused capacity.", price: "Up to 70% Off", color: "purple.400" },
  { name: "Enterprise", description: "Custom pricing & dedicated support.", price: "Custom Pricing", color: "orange.400" },
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
    <Container maxW="100vw" minH="100vh" bg="gray.800" color="white" py={8}>
      {/* Page Header */}
      <Box textAlign="center" mb={8}>
        <Text fontSize="3xl" fontWeight="bold" color="gray.200">Cloud Pricing</Text>
        <Text fontSize="md" color="gray.400">
          Transparent pricing for Compute, Storage, Traffic, AI, and Security.
        </Text>
      </Box>

      <Divider my={4} borderColor="gray.600" />

      {/* Tabs for Pricing Categories */}
      <Tabs variant="enclosed" colorScheme="blue">
        <TabList bg="gray.700" borderRadius="lg" p={2}>
          {pricingCategories.map((category, index) => (
            <Tab key={index} _selected={{ bg: "gray.600", color: "white", fontWeight: "bold" }}>
              <Icon as={category.icon} boxSize={4} mr={2} /> {category.name}
            </Tab>
          ))}
        </TabList>

        <TabPanels>
          {pricingCategories.map((category, index) => (
            <TabPanel key={index}>
              {/* Section Title */}
              <Box mb={6}>
                <Text fontSize="2xl" fontWeight="bold" color="gray.200">{category.name} Pricing</Text>
                <Text fontSize="md" color="gray.400">
                  Cost breakdown for {category.name.toLowerCase()} services.
                </Text>
              </Box>

              {/* Side-by-Side Plan Comparison - Outlined Cards */}
              <Grid templateColumns={{ base: "1fr", md: "repeat(4, 1fr)" }} gap={6}>
                {pricingPlans.map((plan, idx) => (
                  <GridItem 
                    key={idx} 
                    p={6} 
                    bg="gray.700" 
                    border="2px solid" 
                    borderColor={plan.color} 
                    borderRadius="lg"
                  >
                    <Text fontSize="xl" fontWeight="bold" color={plan.color}>{plan.name}</Text>
                    <Text fontSize="sm" color="gray.300">{plan.description}</Text>
                    <Badge colorScheme="blackAlpha" mt={2} px={3}>{plan.price}</Badge>
                  </GridItem>
                ))}
              </Grid>

              {/* Full-Length Pricing Table - Outlined Rows */}
              <Box mt={8} overflowX="auto">
                <Table size="md" variant="unstyled">
                  <Thead bg="gray.700">
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
                      <Tr key={idy} bg="gray.700" borderBottom="2px solid" borderColor="gray.600">
                        <Td color="gray.300">{item.service}</Td>
                        <Td><Badge colorScheme="blue" px={2}>{item.OnDemand}</Badge></Td>
                        <Td><Badge colorScheme="green" px={2}>{item.Reserved}</Badge></Td>
                        <Td><Badge colorScheme="purple" px={2}>{item.Spot}</Badge></Td>
                        <Td><Badge colorScheme="orange" px={2}>{item.Enterprise}</Badge></Td>
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
