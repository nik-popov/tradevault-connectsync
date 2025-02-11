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
  Button,
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

// Define Pricing Categories (Tabs)
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

// Define Pricing Plans (Cards in Columns)
const pricingPlans = [
  { name: "On-Demand", description: "Pay-as-you-go flexible pricing.", price: "Per Usage", color: "blue.500" },
  { name: "Reserved", description: "Commit to 1-3 years for lower pricing.", price: "Up to 40% Off", color: "green.500" },
  { name: "Spot", description: "Discounted unused cloud capacity.", price: "Up to 70% Off", color: "purple.500" },
  { name: "Enterprise", description: "Custom solutions & dedicated support.", price: "Custom Pricing", color: "orange.500" },
];

// Pricing Breakdown for Each Category
const categoryPricing = {
  Compute: [
    { service: "vCPU (per hour)", rate: "$0.05" },
    { service: "Memory (per GB-hour)", rate: "$0.01" },
    { service: "GPU Instance (per hour)", rate: "$2.50" },
    { service: "Bare Metal Server (per hour)", rate: "$5.00" },
  ],
  Traffic: [
    { service: "Inbound Traffic (per GB)", rate: "Free" },
    { service: "Outbound Traffic (per GB)", rate: "$0.08" },
    { service: "Private Network Traffic (per GB)", rate: "$0.02" },
    { service: "CDN Bandwidth (per GB)", rate: "$0.05" },
  ],
  Storage: [
    { service: "Block Storage (per GB-month)", rate: "$0.10" },
    { service: "Object Storage (per GB-month)", rate: "$0.02" },
    { service: "Snapshot (per GB-month)", rate: "$0.05" },
    { service: "Backup Storage (per GB-month)", rate: "$0.08" },
  ],
  Databases: [
    { service: "Managed PostgreSQL (per hour)", rate: "$0.12" },
    { service: "MySQL (per hour)", rate: "$0.10" },
    { service: "MongoDB Cluster (per hour)", rate: "$0.25" },
    { service: "Redis (per hour)", rate: "$0.15" },
  ],
  "AI & ML": [
    { service: "Inference (per 1M calls)", rate: "$1.00" },
    { service: "Training (per GPU-hour)", rate: "$3.50" },
    { service: "AI API Calls (per 1000 reqs)", rate: "$0.50" },
    { service: "Custom Model Deployment (per hour)", rate: "$5.00" },
  ],
  Security: [
    { service: "DDoS Protection (per GB)", rate: "$0.05" },
    { service: "Firewall Rules (per rule)", rate: "$0.01" },
    { service: "SSL Certificates (per year)", rate: "$50" },
    { service: "Security Audits (per request)", rate: "$200" },
  ],
  Support: [
    { service: "Basic Support", rate: "Free" },
    { service: "Standard Support", rate: "$99/month" },
    { service: "Enterprise Support", rate: "Custom Pricing" },
    { service: "24/7 Dedicated Support", rate: "$499/month" },
  ],
  Enterprise: [
    { service: "Dedicated Account Manager", rate: "Custom Pricing" },
    { service: "Custom Cloud Deployments", rate: "Custom Pricing" },
    { service: "On-Prem Cloud Integration", rate: "Custom Pricing" },
    { service: "99.99% SLA Guarantee", rate: "Custom Pricing" },
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

              {/* Pricing Plan Columns */}
              <Grid templateColumns={{ base: "1fr", md: "repeat(4, 1fr)" }} gap={6}>
                {pricingPlans.map((plan, idx) => (
                  <GridItem key={idx} p={6} bg={plan.color} borderRadius="lg">
                    <Text fontSize="xl" fontWeight="bold">{plan.name}</Text>
                    <Text fontSize="sm" color="whiteAlpha.800">{plan.description}</Text>
                    <Badge colorScheme="blackAlpha" mt={2} px={3}>{plan.price}</Badge>
                  </GridItem>
                ))}
              </Grid>

              {/* Pricing Details Table */}
              <Box mt={8}>
                <Table size="md" variant="unstyled">
                  <Thead>
                    <Tr>
                      <Th color="gray.300">Service</Th>
                      <Th color="gray.300">Rate</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {categoryPricing[category.name].map((item, idy) => (
                      <Tr key={idy}>
                        <Td>{item.service}</Td>
                        <Td>
                          <Badge colorScheme="blackAlpha" px={2}>{item.rate}</Badge>
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
