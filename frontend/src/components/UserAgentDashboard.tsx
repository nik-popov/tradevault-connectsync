import React, { useState, useEffect } from 'react';
import { Box, Grid, GridItem, Text, Badge, Spinner, Alert, AlertIcon } from "@chakra-ui/react";
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const UserAgentDashboard = () => {
  const [userAgents, setUserAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserAgents = async () => {
      try {
        const response = await fetch('https://api.thedataproxy.com/api/v1/user-agents/?skip=0&limit=100', {
          headers: { 'accept': 'application/json' },
        });
        if (!response.ok) throw new Error('Failed to fetch user agents');
        const data = await response.json();
        setUserAgents(data.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchUserAgents();
  }, []);

  const chartData = {
    labels: userAgents.map((agent) => agent.browser),
    datasets: [{ label: 'Usage %', data: userAgents.map((agent) => agent.percentage), backgroundColor: 'rgba(66, 153, 225, 0.6)' }],
  };

  if (loading) return <Spinner />;
  if (error) return <Alert status="error"><AlertIcon />{error}</Alert>;

  return (
    <Box>
      <Grid templateColumns={{ base: "1fr", md: "repeat(4, 1fr)" }} gap={6}>
        {userAgents.slice(0, 8).map((agent) => (
          <GridItem key={agent.id} p={4} bg="white" borderRadius="lg" boxShadow="md">
            <Text fontSize="sm">{agent.user_agent}</Text>
            <Badge colorScheme={agent.percentage > 0 ? "green" : "gray"}>{agent.percentage}%</Badge>
          </GridItem>
        ))}
      </Grid>
      <Box mt={8} height="300px">
        <Bar data={chartData} options={{ responsive: true, maintainAspectRatio: false }} />
      </Box>
    </Box>
  );
};

export default UserAgentDashboard;