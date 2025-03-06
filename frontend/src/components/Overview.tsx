import { Box, Text, Stat, StatLabel, StatNumber, StatHelpText, SimpleGrid } from "@chakra-ui/react";

interface OverviewProps {
  toolId?: string;
}

// Simulated unique data per endpointId
const endpointUsageData: Record<string, { requestsToday: number; requestsThisMonth: number; successRate: number; gigsUsedToday: number; gigsUsedThisMonth: number; costPerGigabyte: number }> = {
  "G-CLOUD-SOUTHAMERICA-WEST1": {
    requestsToday: 1200,
    requestsThisMonth: 36000,
    successRate: 98.7,
    gigsUsedToday: 2.0,
    gigsUsedThisMonth: 60.0,
    costPerGigabyte: 0.05,
  },
  "G-CLOUD-US-CENTRAL1": {
    requestsToday: 1800,
    requestsThisMonth: 54000,
    successRate: 99.2,
    gigsUsedToday: 2.8,
    gigsUsedThisMonth: 84.0,
    costPerGigabyte: 0.04,
  },
  "G-IMAGE-SERP-EUROPE-WEST1": {
    requestsToday: 900,
    requestsThisMonth: 27000,
    successRate: 97.5,
    gigsUsedToday: 1.5,
    gigsUsedThisMonth: 45.0,
    costPerGigabyte: 0.06,
  },
  "G-IMAGE-SERP-US-CENTRAL1": {
    requestsToday: 1100,
    requestsThisMonth: 33000,
    successRate: 98.0,
    gigsUsedToday: 1.8,
    gigsUsedThisMonth: 54.0,
    costPerGigabyte: 0.05,
  },
  "endpoints-overview": {
    requestsToday: 0,
    requestsThisMonth: 0,
    successRate: 0,
    gigsUsedToday: 0,
    gigsUsedThisMonth: 0,
    costPerGigabyte: 0,
  },
  "default": {
    requestsToday: 0,
    requestsThisMonth: 0,
    successRate: 0,
    gigsUsedToday: 0,
    gigsUsedThisMonth: 0,
    costPerGigabyte: 0,
  },
};

const Overview = ({ toolId }: OverviewProps) => {
  const usageData = endpointUsageData[toolId || "default"] || endpointUsageData["default"];

  return (
    <Box p={4}>
      <Text fontSize="lg" fontWeight="bold" mb={4}>
        Overview {toolId ? `for ${toolId}` : ""}
      </Text>
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
        <Stat>
          <StatLabel>Requests Today</StatLabel>
          <StatNumber>{usageData.requestsToday.toLocaleString()}</StatNumber>
          <StatHelpText>Daily usage</StatHelpText>
        </Stat>
        <Stat>
          <StatLabel>Requests This Month</StatLabel>
          <StatNumber>{usageData.requestsThisMonth.toLocaleString()}</StatNumber>
          <StatHelpText>Monthly total</StatHelpText>
        </Stat>
        <Stat>
          <StatLabel>Success Rate</StatLabel>
          <StatNumber>{usageData.successRate}%</StatNumber>
          <StatHelpText>Request success</StatHelpText>
        </Stat>
        <Stat>
          <StatLabel>Gigabytes Used Today</StatLabel>
          <StatNumber>{usageData.gigsUsedToday.toFixed(1)} GB</StatNumber>
          <StatHelpText>Daily data usage</StatHelpText>
        </Stat>
        <Stat>
          <StatLabel>Gigabytes Used This Month</StatLabel>
          <StatNumber>{usageData.gigsUsedThisMonth.toFixed(1)} GB</StatNumber>
          <StatHelpText>Monthly data usage</StatHelpText>
        </Stat>
        <Stat>
          <StatLabel>Cost Per Gigabyte</StatLabel>
          <StatNumber>${usageData.costPerGigabyte.toFixed(2)}</StatNumber>
          <StatHelpText>Rate per GB</StatHelpText>
        </Stat>
      </SimpleGrid>
    </Box>
  );
};

export default Overview;