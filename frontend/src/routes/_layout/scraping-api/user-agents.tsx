import { useState, useEffect } from "react";
import {
  Box,
  Grid,
  GridItem,
  Heading,
  Text,
  Badge,
  useColorModeValue,
  Spinner,
  Alert,
  AlertIcon,
  Container,
  Flex,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from "@chakra-ui/react";
import { createFileRoute } from "@tanstack/react-router";

interface UserAgent {
  id: string;
  user_agent: string;
  device: string;
  browser: string;
  os: string;
  percentage: number;
}

const UserAgentDashboard = () => {
  const bgColor = useColorModeValue("gray.50", "gray.800");
  const cardBg = useColorModeValue("white", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  const [userAgents, setUserAgents] = useState<UserAgent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserAgents = async () => {
      try {
        const response = await fetch(
          "https://api.thedataproxy.com/api/v1/user-agents/?skip=0&limit=100",
          { method: "GET", headers: { accept: "application/json" } }
        );
        if (!response.ok) throw new Error("Failed to fetch user agents");
        const data = await response.json();
        console.log("Fetched User Agents:", data.data);
        setUserAgents(data.data || []);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchUserAgents();
  }, []);

  const chartData = {
    labels: userAgents.map((agent) => agent.user_agent.split(",")[0]),
    datasets: [
      {
        label: "Usage Percentage",
        data: userAgents.map((agent) => agent.percentage),
        backgroundColor: "rgba(66, 153, 225, 0.6)",
        borderColor: "rgba(66, 153, 225, 1)",
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        title: { display: true, text: "Percentage (%)" },
      },
    },
    plugins: {
      legend: { position: "top" as const },
      title: { display: true, text: "User Agent Usage Distribution" },
    },
  };

  const overviewContent = (
    <Box py={10} bg={bgColor}>
      <Heading textAlign="center" mb={8} fontSize={{ base: "2xl", md: "3xl" }}>
        User Agent Overview
      </Heading>
      <Grid templateColumns={{ base: "1fr", md: "repeat(4, 1fr)" }} gap={6} mb={8}>
        {userAgents.slice(0, 8).map((agent) => (
          <GridItem key={agent.id}>
            <Box
              p={4}
              bg={cardBg}
              borderRadius="lg"
              boxShadow="md"
              border="1px"
              borderColor={borderColor}
              height="100%"
              transition="all 0.2s"
              _hover={{ boxShadow: "lg", transform: "translateY(-4px)" }}
            >
              <Text fontWeight="bold" fontSize="sm" isTruncated title={agent.user_agent}>
                {agent.user_agent}
              </Text>
              <Text fontSize="xs" color="gray.500">Device: {agent.device || "N/A"}</Text>
              <Text fontSize="xs" color="gray.500">Browser: {agent.browser || "N/A"}</Text>
              <Text fontSize="xs" color="gray.500">OS: {agent.os || "N/A"}</Text>
              <Badge colorScheme={agent.percentage > 0 ? "green" : "gray"} mt={2}>
                {agent.percentage}% Usage
              </Badge>
            </Box>
          </GridItem>
        ))}
      </Grid>
      <Box
        p={4}
        bg={cardBg}
        borderRadius="lg"
        boxShadow="md"
        border="1px"
        borderColor={borderColor}
        height="400px"
      >
     
      </Box>
    </Box>
  );

  if (loading) {
    return (
      <Box maxW="100%" mx="auto" py={10} textAlign="center">
        <Spinner size="xl" />
      </Box>
    );
  }

  if (error) {
    return (
      <Box maxW="100%" mx="auto" py={10}>
        <Alert status="error">
          <AlertIcon />
          <Text>{error}</Text>
        </Alert>
      </Box>
    );
  }


  return (
    <Container maxW="full">
      <Flex align="center" justify="space-between" py={6} flexWrap="wrap" gap={4}>
        <Box textAlign="left" flex="1">
          <Text fontSize="xl" fontWeight="bold">User Agents</Text>
          <Text fontSize="sm">Manage your user agent settings.</Text>
        </Box>
      </Flex>
    </Container>
  );
};

export const Route = createFileRoute("/_layout/scraping-api/user-agents")({
  component: UserAgentDashboard,
});

export default UserAgentDashboard;