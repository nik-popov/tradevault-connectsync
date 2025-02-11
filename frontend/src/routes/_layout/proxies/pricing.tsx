import {
  Container,
  Box,
  Text,
  Button,
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
  FiCpu, FiDatabase, FiCloud, FiGlobe, FiHardDrive, 
  FiHeadphones, FiTrendingUp, FiZap, FiSettings 
} from "react-icons/fi";

// Pricing Categories for Compute, Traffic, Storage, Support, Databases, AI/ML
const pricingSections = [
  {
    title: "Compute Pricing",
    icon: FiCpu,
    items: [
      { name: "vCPU (per hour)", rate: "$0.05" },
      { name: "Memory (per GB-hour)", rate: "$0.01" },
      { name: "GPU Instance (per hour)", rate: "$2.50" },
    ],
  },
  {
    title: "Traffic Pricing",
    icon: FiGlobe,
    items: [
      { name: "Inbound Traffic (per GB)", rate: "Free" },
      { name: "Outbound Traffic (per GB)", rate: "$0.08" },
      { name: "Private Network Traffic (per GB)", rate: "$0.02" },
    ],
  },
  {
    title: "Storage Pricing",
    icon: FiHardDrive,
    items: [
      { name: "Block Storage (per GB-month)", rate: "$0.10" },
      { name: "Object Storage (per GB-month)", rate: "$0.02" },
      { name: "Snapshot (per GB-month)", rate: "$0.05" },
    ],
  },
  {
    title: "Database Pricing",
    icon: FiDatabase,
    items: [
      { name: "Managed PostgreSQL (per hour)", rate: "$0.12" },
      { name: "MySQL (per hour)", rate: "$0.10" },
      { name: "MongoDB Cluster (per hour)", rate: "$0.25" },
    ],
  },
  {
    title: "AI & Machine Learning",
    icon: FiZap,
    items: [
      { name: "Inference (per 1M calls)", rate: "$1.00" },
      { name: "Training (per GPU-hour)", rate: "$3.50" },
      { name: "AI API Calls (per 1000 reqs)", rate: "$0.50" },
    ],
  },
  {
    title: "Support Plans",
    icon: FiHeadphones,
    items: [
      { name: "Basic Support", rate: "Free" },
      { name: "Standard Support", rate: "$99/month" },
      { name: "Enterprise Support", rate: "Custom Pricing" },
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
          <Text fontSize="md" color="gray.400">Compare pricing for compute, storage, and networking.</Text>
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

              <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }} gap={6}>
                {pricingSections.map((section, idx) => (
                  <GridItem key={idx} p={6} border="2px solid" borderColor="blue.600" borderRadius="lg" bg="gray.800">
                    <Flex align="center" mb={4}>
                      <Icon as={section.icon} boxSize={6} color="blue.400" mr={2} />
                      <Text fontSize="xl" fontWeight="bold">{section.title}</Text>
                    </Flex>

                    <Table size="sm" variant="unstyled">
                      <Thead>
                        <Tr>
                          <Th color="gray.400">Service</Th>
                          <Th color="gray.400">Rate</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {section.items.map((item, idy) => (
                          <Tr key={idy}>
                            <Td>{item.name}</Td>
                            <Td>
                              <Badge colorScheme={item.rate === "Free" ? "green" : "blue"} px={2}>
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

      {/* CTA */}
      <Flex justify="center" mt={8}>
        <Button bg="blue.600" color="white" size="lg" _hover={{ bg: "blue.500" }}>
          Get Started
        </Button>
      </Flex>
    </Container>
  );
}

export const Route = createFileRoute("/_layout/pricing")({
  component: Pricing,
});

export default Pricing;
