import {
  Container,
  Box,
  Text,
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
  { name: "Intelligence", icon: FiZap },
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

const fullPricingCategories = { 

  Compute: [
    { service: "vCPU (per hour)", OnDemand: "$0.05", Reserved: "$0.03", Spot: "$0.015", Enterprise: "Custom Pricing" },
    { service: "Memory (per GB-hour)", OnDemand: "$0.01", Reserved: "$0.007", Spot: "$0.004", Enterprise: "Custom Pricing" },
    { service: "GPU Instance (per hour)", OnDemand: "$2.50", Reserved: "$1.80", Spot: "$1.00", Enterprise: "Custom Pricing" },
    { service: "Bare Metal Server (per hour)", OnDemand: "$5.00", Reserved: "$4.00", Spot: "$2.50", Enterprise: "Custom Pricing" },
    { service: "Dedicated Compute (per core)", OnDemand: "$0.10", Reserved: "$0.08", Spot: "$0.05", Enterprise: "Custom Pricing" },
    { service: "Serverless Function Calls (per million)", OnDemand: "$0.20", Reserved: "$0.15", Spot: "$0.10", Enterprise: "Custom Pricing" },
    { service: "Edge Computing (per GB-hour)", OnDemand: "$0.04", Reserved: "$0.03", Spot: "$0.02", Enterprise: "Custom Pricing" },
    { service: "HPC Cluster Node (per hour)", OnDemand: "$10.00", Reserved: "$8.00", Spot: "$5.00", Enterprise: "Custom Pricing" },
  ],
  Traffic: [
    { service: "Inbound Traffic (per GB)", OnDemand: "Free", Reserved: "Free", Spot: "Free", Enterprise: "Free" },
    { service: "Outbound Traffic (per GB)", OnDemand: "$0.08", Reserved: "$0.06", Spot: "$0.04", Enterprise: "Custom Pricing" },
    { service: "Private Network Traffic (per GB)", OnDemand: "$0.02", Reserved: "$0.015", Spot: "$0.01", Enterprise: "Custom Pricing" },
    { service: "CDN Bandwidth (per GB)", OnDemand: "$0.05", Reserved: "$0.03", Spot: "$0.02", Enterprise: "Custom Pricing" },
    { service: "Global Load Balancing (per request)", OnDemand: "$0.002", Reserved: "$0.0015", Spot: "$0.001", Enterprise: "Custom Pricing" },
    { service: "DNS Queries (per million)", OnDemand: "$0.50", Reserved: "$0.40", Spot: "$0.30", Enterprise: "Custom Pricing" },
    { service: "VPN Gateway (per hour)", OnDemand: "$0.10", Reserved: "$0.08", Spot: "$0.05", Enterprise: "Custom Pricing" },
    { service: "IPv4 Address Lease (per month)", OnDemand: "$3.00", Reserved: "$2.50", Spot: "$2.00", Enterprise: "Custom Pricing" },
  ],
  Storage: [
    { service: "Block Storage (per GB-month)", OnDemand: "$0.10", Reserved: "$0.08", Spot: "$0.05", Enterprise: "Custom Pricing" },
    { service: "Object Storage (per GB-month)", OnDemand: "$0.02", Reserved: "$0.015", Spot: "$0.01", Enterprise: "Custom Pricing" },
    { service: "Snapshot Storage (per GB-month)", OnDemand: "$0.05", Reserved: "$0.04", Spot: "$0.03", Enterprise: "Custom Pricing" },
    { service: "Backup Storage (per GB-month)", OnDemand: "$0.08", Reserved: "$0.06", Spot: "$0.04", Enterprise: "Custom Pricing" },
    { service: "Cold Storage (per GB-month)", OnDemand: "$0.004", Reserved: "$0.003", Spot: "$0.002", Enterprise: "Custom Pricing" },
    { service: "High-Speed NVMe Storage (per GB-month)", OnDemand: "$0.15", Reserved: "$0.12", Spot: "$0.10", Enterprise: "Custom Pricing" },
    { service: "File Storage (per GB-month)", OnDemand: "$0.07", Reserved: "$0.06", Spot: "$0.05", Enterprise: "Custom Pricing" },
    { service: "Storage Replication (per GB-month)", OnDemand: "$0.03", Reserved: "$0.02", Spot: "$0.01", Enterprise: "Custom Pricing" },
  ],
  Databases: [
    { service: "Managed PostgreSQL (per hour)", OnDemand: "$0.12", Reserved: "$0.10", Spot: "$0.08", Enterprise: "Custom Pricing" },
    { service: "MySQL (per hour)", OnDemand: "$0.10", Reserved: "$0.08", Spot: "$0.07", Enterprise: "Custom Pricing" },
    { service: "MongoDB Cluster (per hour)", OnDemand: "$0.25", Reserved: "$0.20", Spot: "$0.15", Enterprise: "Custom Pricing" },
    { service: "Redis (per hour)", OnDemand: "$0.15", Reserved: "$0.12", Spot: "$0.09", Enterprise: "Custom Pricing" },
    { service: "DynamoDB (per million reads)", OnDemand: "$1.25", Reserved: "$1.00", Spot: "$0.80", Enterprise: "Custom Pricing" },
    { service: "GraphQL API Hosting (per request)", OnDemand: "$0.0005", Reserved: "$0.0004", Spot: "$0.0003", Enterprise: "Custom Pricing" },
    { service: "Database Backup (per GB)", OnDemand: "$0.02", Reserved: "$0.015", Spot: "$0.01", Enterprise: "Custom Pricing" },
    { service: "High-Availability Database (per hour)", OnDemand: "$0.30", Reserved: "$0.25", Spot: "$0.20", Enterprise: "Custom Pricing" },
  ],
  Intelligence: [
    { service: "Inference (per 1M calls)", OnDemand: "$1.00", Reserved: "$0.80", Spot: "$0.50", Enterprise: "Custom Pricing" },
    { service: "Training (per GPU-hour)", OnDemand: "$3.50", Reserved: "$2.80", Spot: "$1.50", Enterprise: "Custom Pricing" },
    { service: "AI API Calls (per 1000 reqs)", OnDemand: "$0.50", Reserved: "$0.40", Spot: "$0.25", Enterprise: "Custom Pricing" },
    { service: "Custom Model Deployment (per hour)", OnDemand: "$5.00", Reserved: "$4.00", Spot: "$2.50", Enterprise: "Custom Pricing" },
    { service: "Speech-to-Text (per hour)", OnDemand: "$2.00", Reserved: "$1.50", Spot: "$1.00", Enterprise: "Custom Pricing" },
    { service: "Vision API (per 1000 images)", OnDemand: "$0.75", Reserved: "$0.60", Spot: "$0.40", Enterprise: "Custom Pricing" },
    { service: "Generative AI API (per 1000 tokens)", OnDemand: "$0.02", Reserved: "$0.015", Spot: "$0.01", Enterprise: "Custom Pricing" },
    { service: "AutoML Training (per hour)", OnDemand: "$6.00", Reserved: "$5.00", Spot: "$4.00", Enterprise: "Custom Pricing" },
  ],
    Security: [
      { service: "DDoS Protection (per GB)", OnDemand: "$0.05", Reserved: "$0.03", Spot: "$0.02", Enterprise: "Custom Pricing" },
      { service: "Firewall Rules (per rule)", OnDemand: "$0.01", Reserved: "$0.007", Spot: "$0.005", Enterprise: "Custom Pricing" },
      { service: "SSL Certificates (per year)", OnDemand: "$50", Reserved: "$40", Spot: "$30", Enterprise: "Custom Pricing" },
      { service: "Security Audits (per request)", OnDemand: "$200", Reserved: "$150", Spot: "$100", Enterprise: "Custom Pricing" },
      { service: "IAM Policy Management (per update)", OnDemand: "$15", Reserved: "$12", Spot: "$10", Enterprise: "Custom Pricing" },
      { service: "Encryption Key Management (per key)", OnDemand: "$5", Reserved: "$4", Spot: "$3", Enterprise: "Custom Pricing" },
      { service: "Threat Detection (per alert)", OnDemand: "$0.10", Reserved: "$0.08", Spot: "$0.06", Enterprise: "Custom Pricing" },
      { service: "Compliance Monitoring (per GB log)", OnDemand: "$0.02", Reserved: "$0.015", Spot: "$0.01", Enterprise: "Custom Pricing" },
    ],
    Support: [
      { service: "Basic Support", OnDemand: "Free", Reserved: "Free", Spot: "Free", Enterprise: "Included" },
      { service: "Standard Support", OnDemand: "$99/month", Reserved: "$89/month", Spot: "$79/month", Enterprise: "Custom Pricing" },
      { service: "Enterprise Support", OnDemand: "Custom Pricing", Reserved: "Custom Pricing", Spot: "Custom Pricing", Enterprise: "Included" },
      { service: "24/7 Dedicated Support", OnDemand: "$499/month", Reserved: "$449/month", Spot: "$399/month", Enterprise: "Included" },
      { service: "Incident Response (per case)", OnDemand: "$300", Reserved: "$250", Spot: "$200", Enterprise: "Custom Pricing" },
      { service: "Dedicated Technical Account Manager", OnDemand: "$999/month", Reserved: "$899/month", Spot: "$799/month", Enterprise: "Included" },
      { service: "Priority Ticket Response (per ticket)", OnDemand: "$50", Reserved: "$40", Spot: "$30", Enterprise: "Custom Pricing" },
      { service: "Custom SLAs (per contract)", OnDemand: "Custom Pricing", Reserved: "Custom Pricing", Spot: "Custom Pricing", Enterprise: "Included" },
    ],
    Enterprise: [
      { service: "Dedicated Account Manager", OnDemand: "Custom Pricing", Reserved: "Custom Pricing", Spot: "Custom Pricing", Enterprise: "Included" },
      { service: "Custom Cloud Deployments", OnDemand: "Custom Pricing", Reserved: "Custom Pricing", Spot: "Custom Pricing", Enterprise: "Included" },
      { service: "On-Prem Cloud Integration", OnDemand: "Custom Pricing", Reserved: "Custom Pricing", Spot: "Custom Pricing", Enterprise: "Included" },
      { service: "99.99% SLA Guarantee", OnDemand: "Custom Pricing", Reserved: "Custom Pricing", Spot: "Custom Pricing", Enterprise: "Included" },
      { service: "Private Cloud Access (per instance)", OnDemand: "$5.00", Reserved: "$4.00", Spot: "$3.00", Enterprise: "Custom Pricing" },
      { service: "Advanced Networking (per region)", OnDemand: "$10.00", Reserved: "$8.00", Spot: "$6.00", Enterprise: "Custom Pricing" },
      { service: "Compliance Certification Support", OnDemand: "Custom Pricing", Reserved: "Custom Pricing", Spot: "Custom Pricing", Enterprise: "Included" },
      { service: "Enterprise Governance Tools", OnDemand: "$2.00", Reserved: "$1.50", Spot: "$1.00", Enterprise: "Included" },
    ],
  };
  function PricingPage() {
    return (
      <Container maxW="full">
        {/* Professional Page Header */}
        <Flex align="center" justify="space-between" py={6} flexWrap="wrap" gap={4}>
          <Box textAlign="left" flex="1">
            <Text fontSize="xl" fontWeight="bold">Cloud Pricing Overview</Text>
            <Text fontSize="sm">Compare pricing for Compute, Storage, Traffic, AI, Security, and more.</Text>
          </Box>
        </Flex>
        <Divider my={4} />
  
        <Container maxW="full">
  {/* Title & Toggle in the Same Row */}
  <Flex align="center" justify="space-between" py={6} flexWrap="wrap">
    <Box textAlign="left">
      <Text fontSize="xl" fontWeight="bold">Cloud Pricing Overview</Text>
    </Box>

    {/* Toggle Buttons (Right Side) */}
    <Flex gap={2}>
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
    </Flex>
  </Flex>

  <Divider my={4} />

function PricingPage() {
  return (
    <Container maxW="full">
      {/* Title & Toggle in the Same Row */}
      <Flex align="center" justify="space-between" py={6} flexWrap="wrap">
        <Box textAlign="left">
          <Text fontSize="xl" fontWeight="bold">Cloud Pricing Overview</Text>
        </Box>

        {/* Toggle Buttons in TabList */}
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

          {/* Tabs & Panels */}
          <TabPanels>
            {pricingCategories.map((category, index) => (
              <TabPanel key={index}>
                {/* Full-Length Pricing Table */}
                <Box mt={6} overflowX="auto">
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
                      {fullPricingCategories[category.name]?.map((item, idy) => (
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
      </Flex>

      <Divider my={4} />
    </Container>
  );
}

export const Route = createFileRoute("/_layout/pricing")({
  component: PricingPage,
});

export default PricingPage;
