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
  FiGlobe,
  FiHardDrive,
  FiHeadphones,
  FiTrendingUp,
  FiZap,
  FiSettings,
} from "react-icons/fi";

// Pricing Categories
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

// Pricing Plans
const pricingPlans = [
  { name: "On-Demand", description: "Pay-as-you-go pricing.", price: "Per Usage", color: "blue.400" },
  { name: "Reserved", description: "Commit to 1-3 years for savings.", price: "Up to 40% Off", color: "green.400" },
  { name: "Spot", description: "Get the best deals on unused capacity.", price: "Up to 70% Off", color: "purple.400" },
  { name: "Enterprise", description: "Custom pricing & dedicated support.", price: "Custom Pricing", color: "orange.400" },
];

// Full Pricing Breakdown
const pricingDetails = {
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
  Storage: [
    { service: "Block Storage (per GB-month)", OnDemand: "$0.10", Reserved: "$0.08", Spot: "$0.05", Enterprise: "Custom Pricing" },
    { service: "Object Storage (per GB-month)", OnDemand: "$0.02", Reserved: "$0.015", Spot: "$0.01", Enterprise: "Custom Pricing" },
    { service: "Snapshot Storage (per GB-month)", OnDemand: "$0.05", Reserved: "$0.04", Spot: "$0.03", Enterprise: "Custom Pricing" },
  ], 
   "AI & ML": [
    { service: "Inference (per 1M calls)", OnDemand: "$1.00", Reserved: "$0.80", Spot: "$0.50", Enterprise: "Custom Pricing" },
    { service: "Training (per GPU-hour)", OnDemand: "$3.50", Reserved: "$2.80", Spot: "$1.50", Enterprise: "Custom Pricing" },
    { service: "AI API Calls (per 1000 reqs)", OnDemand: "$0.50", Reserved: "$0.40", Spot: "$0.25", Enterprise: "Custom Pricing" },
    { service: "Custom Model Deployment (per hour)", OnDemand: "$5.00", Reserved: "$4.00", Spot: "$2.50", Enterprise: "Custom Pricing" },
  ],
  Security: [
    { service: "DDoS Protection (per GB)", OnDemand: "$0.05", Reserved: "$0.03", Spot: "$0.02", Enterprise: "Custom Pricing" },
    { service: "Firewall Rules (per rule)", OnDemand: "$0.01", Reserved: "$0.007", Spot: "$0.005", Enterprise: "Custom Pricing" },
    { service: "SSL Certificates (per year)", OnDemand: "$50", Reserved: "$40", Spot: "$30", Enterprise: "Custom Pricing" },
    { service: "Security Audits (per request)", OnDemand: "$200", Reserved: "$150", Spot: "$100", Enterprise: "Custom Pricing" },
  ],
  Support: [
    { service: "Basic Support", OnDemand: "Free", Reserved: "Free", Spot: "Free", Enterprise: "Included" },
    { service: "Standard Support", OnDemand: "$99/month", Reserved: "$89/month", Spot: "$79/month", Enterprise: "Custom Pricing" },
    { service: "Enterprise Support", OnDemand: "Custom Pricing", Reserved: "Custom Pricing", Spot: "Custom Pricing", Enterprise: "Included" },
    { service: "24/7 Dedicated Support", OnDemand: "$499/month", Reserved: "$449/month", Spot: "$399/month", Enterprise: "Included" },
  ],
};

function PricingPage() {
  return (
    <Container maxW="100vw" minH="100vh" bg="gray.800" color="white" py={10} px={8}>
      {/* Title & Subtitle */}
      <Box textAlign="left" mb={8}>
        <Text fontSize="4xl" fontWeight="bold" color="white">Full Pricing</Text>
        <Text fontSize="lg" color="gray.400">Compare costs across all cloud services.</Text>
      </Box>

      <Divider my={6} borderColor="gray.600" />

      {/* Clean Tab Selector */}
      <Tabs variant="unstyled">
        <TabList bg="gray.700" borderRadius="lg" p={3} display="flex" gap={2} width="fit-content">
          {pricingCategories.map((category, index) => (
            <Tab 
              key={index} 
              _selected={{ bg: "gray.600", color: "white", fontWeight: "bold" }} 
              borderRadius="md"
              px={4} 
              py={2}
            >
              <Icon as={category.icon} boxSize={4} mr={2} /> {category.name}
            </Tab>
          ))}
        </TabList>

        <TabPanels>
          {pricingCategories.map((category, index) => (
            <TabPanel key={index}>
              {/* Section Title */}
              <Box mb={6} textAlign="left">
                <Text fontSize="3xl" fontWeight="bold" color="gray.200">{category.name} Pricing</Text>
                <Text fontSize="md" color="gray.400">Transparent costs for {category.name.toLowerCase()} services.</Text>
              </Box>

              {/* Side-by-Side Plan Comparison - Full Width */}
              <Grid templateColumns={{ base: "1fr", md: "repeat(4, 1fr)" }} gap={6}>
                {pricingPlans.map((plan, idx) => (
                  <GridItem 
                    key={idx} 
                    p={6} 
                    bg="gray.700" 
                    border="2px solid" 
                    borderColor={plan.color} 
                    borderRadius="lg"
                    textAlign="left"
                  >
                    <Text fontSize="xl" fontWeight="bold" color={plan.color}>{plan.name}</Text>
                    <Text fontSize="sm" color="gray.300">{plan.description}</Text>
                    <Badge colorScheme="blackAlpha" mt={3} px={3} py={1} borderRadius="md">{plan.price}</Badge>
                  </GridItem>
                ))}
              </Grid>

              {/* Full-Length Pricing Table */}
              <Box mt={8} overflowX="auto">
                <Table size="md" variant="unstyled">
                  <Thead bg="gray.700">
                    <Tr>
                      <Th color="gray.300" textAlign="left">Service</Th>
                      <Th color="gray.300" textAlign="center">On-Demand</Th>
                      <Th color="gray.300" textAlign="center">Reserved</Th>
                      <Th color="gray.300" textAlign="center">Spot</Th>
                      <Th color="gray.300" textAlign="center">Enterprise</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {pricingDetails[category.name]?.map((item, idy) => (
                      <Tr key={idy} bg="gray.700" borderBottom="2px solid" borderColor="gray.600">
                        <Td color="gray.300">{item.service}</Td>
                        <Td textAlign="center"><Badge colorScheme="blue" px={3} py={1} borderRadius="md">{item.OnDemand}</Badge></Td>
                        <Td textAlign="center"><Badge colorScheme="green" px={3} py={1} borderRadius="md">{item.Reserved}</Badge></Td>
                        <Td textAlign="center"><Badge colorScheme="purple" px={3} py={1} borderRadius="md">{item.Spot}</Badge></Td>
                        <Td textAlign="center"><Badge colorScheme="orange" px={3} py={1} borderRadius="md">{item.Enterprise}</Badge></Td>
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

export const Route = createFileRoute("/_layout/pricing/full")({
  component: PricingPage,
});

export default PricingPage;
