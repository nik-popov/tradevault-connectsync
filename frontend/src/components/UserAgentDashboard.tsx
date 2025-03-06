import React, { useState, useEffect } from 'react';
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
} from "@chakra-ui/react";
import { Bar } from 'react-chartjs-2'; // Requires react-chartjs-2 and chart.js
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const UserAgentDashboard = () => {
  const bgColor = useColorModeValue("gray.50", "gray.800");
  const cardBg = useColorModeValue("white", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  const [userAgents, setUserAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data from the API
  useEffect(() => {
    const fetchUserAgents = async () => {
      try {
        const response = await fetch(
          'https://api.thedataproxy.com/api/v1/user-agents/?skip=0&limit=100',
          {
            method: 'GET',
            headers: {
              'accept': 'application/json',
            },
          }
        );
        if (!response.ok) throw new Error('Failed to fetch user agents');
        const data = await response.json();
        setUserAgents(data.data); // Store the user-agent data
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchUserAgents();
  }, []);

  // Prepare chart data
  const chartData = {
    labels: userAgents.map((agent) => agent.user_agent.split(',')[0]), // Simplified label
    datasets: [
      {
        label: 'Usage Percentage',
        data: userAgents.map((agent) => agent.percentage),
        backgroundColor: 'rgba(66, 153, 225, 0.6)',
        borderColor: 'rgba(66, 153, 225, 1)',
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
        title: { display: true, text: 'Percentage (%)' },
      },
    },
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'User Agent Usage Distribution' },
    },
  };

  // Render loading or error states
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
    <Box maxW="100%" mx="auto" px={{ base: 4, md: 8 }} py={10} bg={bgColor}>
      <Heading textAlign="center" mb={8} fontSize={{ base: "2xl", md: "3xl" }}>
        User Agent Dashboard
      </Heading>

      {/* 4-Column Grid */}
      <Grid
        templateColumns={{ base: "1fr", md: "repeat(4, 1fr)" }}
        gap={6}
        mb={8}
      >
        {userAgents.slice(0, 8).map((agent) => ( // Show top 8 for grid
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
              <Text fontSize="xs" color="gray.500">Device: {agent.device}</Text>
              <Text fontSize="xs" color="gray.500">Browser: {agent.browser}</Text>
              <Text fontSize="xs" color="gray.500">OS: {agent.os}</Text>
              <Badge colorScheme={agent.percentage > 0 ? "green" : "gray"} mt={2}>
                {agent.percentage}% Usage
              </Badge>
            </Box>
          </GridItem>
        ))}
      </Grid>

      {/* Chart Section */}
      <Box
        p={4}
        bg={cardBg}
        borderRadius="lg"
        boxShadow="md"
        border="1px"
        borderColor={borderColor}
        height="400px"
      >
        <Bar data={chartData} options={chartOptions} />
      </Box>
    </Box>
  );
};

export default UserAgentDashboard;