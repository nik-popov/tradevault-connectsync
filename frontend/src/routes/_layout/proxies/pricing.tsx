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
} from "@chakra-ui/react";
import { createFileRoute } from "@tanstack/react-router";
import { FiCpu, FiDatabase, FiCloud, FiGlobe, FiHeadphones } from "react-icons/fi";

const pricingCategories = [
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
    icon: FiDatabase,
    items: [
      { name: "Block Storage (per GB-month)", rate: "$0.10" },
      { name: "Object Storage (per GB-month)", rate: "$0.02" },
      { name: "Snapshot (per GB-month)", rate: "$0.05" },
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

function Pricing() {
  return (
    <Container maxW="100vw" minH="100vh" bg="gray.900" color="white" py={8}>
      <Flex align="center" justify="space-between" py={6} flexWrap="wrap">
        <Box textAlign="left" flex="1">
          <Text fontSize="2xl" fontWeight="bold">Cloud Service Pricing</Text>
          <Text fontSize="md" color="gray.400">Transparent and predictable pricing for compute, storage, and traffic.</Text>
        </Box>
      </Flex>

      <Divider my={4} borderColor="gray.600" />

      <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={6}>
        {pricingCategories.map((category, index) => (
          <GridItem key={index} p={6} border="2px solid" borderColor="blue.600" borderRadius="lg" bg="gray.800">
            <Flex align="center" mb={4}>
              <Icon as={category.icon} boxSize={6} color="blue.400" mr={2} />
              <Text fontSize="xl" fontWeight="bold">{category.title}</Text>
            </Flex>

            <Table size="sm" variant="unstyled">
              <Thead>
                <Tr>
                  <Th color="gray.400">Service</Th>
                  <Th color="gray.400">Rate</Th>
                </Tr>
              </Thead>
              <Tbody>
                {category.items.map((item, idx) => (
                  <Tr key={idx}>
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

      <Flex justify="center" mt={8}>
        <Button bg="blue.600" color="white" _hover={{ bg: "blue.500" }}>
          Get Started
        </Button>
      </Flex>
    </Container>
  );
}

export const Route = createFileRoute("/_layout/proxies/pricing")({
  component: Pricing,
});

export default Pricing;
