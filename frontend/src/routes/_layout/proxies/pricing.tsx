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

// Define different background colors for pricing categories
const categoryColors = [
  "blue.700",
  "purple.600",
  "orange.600",
  "teal.600",
  "red.600",
  "cyan.600",
  "green.600",
  "yellow.600",
];

// Pricing Sections: Compute, Traffic, Storage, Databases, AI, Support, Security, Enterprise
const pricingSections = [
  {
    title: "Compute Pricing",
    icon: FiCpu,
    bg: "blue.700",
    items: [
      { name: "vCPU (per hour)", rate: "$0.05" },
      { name: "Memory (per GB-hour)", rate: "$0.01" },
      { name: "GPU Instance (per hour)", rate: "$2.50" },
      { name: "Bare Metal Server (per hour)", rate: "$5.00" },
    ],
  },
  {
    title: "Traffic Pricing",
    icon: FiGlobe,
    bg: "purple.600",
    items: [
      { name: "Inbound Traffic (per GB)", rate: "Free" },
      { name: "Outbound Traffic (per GB)", rate: "$0.08" },
      { name: "Private Network Traffic (per GB)", rate: "$0.02" },
      { name: "CDN Bandwidth (per GB)", rate: "$0.05" },
    ],
  },
  {
    title: "Storage Pricing",
    icon: FiHardDrive,
    bg: "orange.600",
    items: [
      { name: "Block Storage (per GB-month)", rate: "$0.10" },
      { name: "Object Storage (per GB-month)", rate: "$0.02" },
      { name: "Snapshot (per GB-month)", rate: "$0.05" },
      { name: "Backup Storage (per GB-month)", rate: "$0.08" },
    ],
  },
  {
    title: "Database Pricing",
    icon: FiDatabase,
    bg: "teal.600",
    items: [
      { name: "Managed PostgreSQL (per hour)", rate: "$0.12" },
      { name: "MySQL (per hour)", rate: "$0.10" },
      { name: "MongoDB Cluster (per hour)", rate: "$0.25" },
      { name: "Redis (per hour)", rate: "$0.15" },
    ],
  },
  {
    title: "AI & Machine Learning",
    icon: FiZap,
    bg: "red.600",
    items: [
      { name: "Inference (per 1M calls)", rate: "$1.00" },
      { name: "Training (per GPU-hour)", rate: "$3.50" },
      { name: "AI API Calls (per 1000 reqs)", rate: "$0.50" },
      { name: "Custom Model Deployment (per hour)", rate: "$5.00" },
    ],
  },
  {
    title: "Support Plans",
    icon: FiHeadphones,
    bg: "cyan.600",
    items: [
      { name: "Basic Support", rate: "Free" },
      { name: "Standard Support", rate: "$99/month" },
      { name: "Enterprise Support", rate: "Custom Pricing" },
      { name: "24/7 Dedicated Support", rate: "$499/month" },
    ],
  },
  {
    title: "Security & Compliance",
    icon: FiSettings,
    bg: "green.600",
    items: [
      { name: "DDoS Protection (per GB)", rate: "$0.05" },
      { name: "Firewall Rules (per rule)", rate: "$0.01" },
      { name: "SSL Certificates (per year)", rate: "$50" },
      { name: "Security Audits (per request)", rate: "$200" },
    ],
  },
  {
    title: "Enterprise Features",
    icon: FiTrendingUp,
    bg: "yellow.600",
    items: [
      { name: "Dedicated Account Manager", rate: "Custom Pricing" },
      { name: "Custom Cloud Deployments", rate: "Custom Pricing" },
      { name: "On-Prem Cloud Integration", rate: "Custom Pricing" },
      { name: "99.99% SLA Guarantee", rate: "Custom Pricing" },
    ],
  },
];

// Plans: On-Demand, Reserved, Spot, Enterprise
const pricingPlans = [
  { name: "On-Demand", description: "Flexible pricing, pay-as-you-go." },
  { name: "Reserved", description: "Commit to 1-3 years for lower prices." },
  { name: "Spot", description: "Best for short-term, cheap compute workloads." },
  { name: "Enterprise", description: "Custom solutions with dedicated support." },
];

function Pricing() {
  return (
    <Container maxW="100vw" minH="100vh" bg="gray.900" color="white" py={8}>
      <Flex align="center" justify="space-between" py={6} flexWrap="wrap">
        <Box textAlign="left" flex="1">
          <Text fontSize="3xl" fontWeight="bold">Cloud Pricing Plans</Text>
          <Text fontSize="md" color="gray.400">Compare pricing for compute, storage, security, and networking.</Text>
        </Box>
      </Flex>

      <Divider my={4} borderColor="gray.600" />

      {/* Tabs for Pricing Plans */}
      <Tabs variant="enclosed" colorScheme="blue">
        <TabList>
          {pricingPlans.map((plan, index) => (
            <Tab key={index}>{plan.name}</Tab>
          ))}
        </TabList>

        <TabPanels>
          {pricingPlans.map((plan, index) => (
            <TabPanel key={index}>
              <Text fontSize="xl" fontWeight="bold" mb={4}>{plan.name} Pricing</Text>
              <Text fontSize="md" color="gray.400" mb={6}>{plan.description}</Text>

              <Grid templateColumns={{ base: "1fr", md: "repeat(1, 1fr)" }} gap={6}>
                {pricingSections.map((section, idx) => (
                  <GridItem key={idx} p={6} borderRadius="lg" bg={section.bg} color="white">
                    <Flex align="center" mb={4}>
                      <Icon as={section.icon} boxSize={6} color="white" mr={2} />
                      <Text fontSize="xl" fontWeight="bold">{section.title}</Text>
                    </Flex>

                    <Table size="sm" variant="unstyled">
                      <Thead>
                        <Tr>
                          <Th color="gray.200">Service</Th>
                          <Th color="gray.200">Rate</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {section.items.map((item, idy) => (
                          <Tr key={idy}>
                            <Td>{item.name}</Td>
                            <Td>
                              <Badge colorScheme="blackAlpha" px={2}>
                                {item.rate}
                              </Badge>
                            </Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  </GridItem>
                ))}
              </Grid>
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
