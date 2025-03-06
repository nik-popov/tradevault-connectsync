// src/routes/IPDetail.tsx
import React from 'react';
import { Box, Heading, Text, Button } from "@chakra-ui/react";
import { useParams, useNavigate } from "@tanstack/react-router";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";

const fetchIPDetail = async (ipId) => {
  // Mocked; replace with real API
  const ipData = {
    "34.34.252.50": { publicIp: "34.34.252.50", region: "South America West", city: "Santiago", lat: -33.4489, lng: -70.6693, status: "Active", lastChecked: "2025-03-07 10:00:00" },
    "34.96.44.247": { publicIp: "34.96.44.247", region: "US Central", city: "Ames", lat: 41.8781, lng: -93.0977, status: "Active", lastChecked: "2025-03-07 10:00:00" },
    // Add more as needed
  };
  return ipData[ipId] || { publicIp: ipId, region: "Unknown", city: "Unknown", status: "Unknown" };
};

const IPDetail = () => {
  const { toolId, ipId } = useParams<{ toolId: string; ipId: string }>();
  const navigate = useNavigate();
  const { data, isLoading, error } = useQuery({
    queryKey: ['ipDetail', ipId],
    queryFn: () => fetchIPDetail(ipId),
  });

  if (isLoading) return <Spinner />;
  if (error) return <Text>Error: {error.message}</Text>;

  return (
    <Box p={6}>
      <Heading size="lg" mb={4}>IP Details: {ipId}</Heading>
      <Box p={4} borderWidth="1px" borderRadius="md" mb={4}>
        <Text><strong>IP:</strong> {data.publicIp}</Text>
        <Text><strong>Region:</strong> {data.region}</Text>
        <Text><strong>City:</strong> {data.city}</Text>
        <Text><strong>Coordinates:</strong> {data.lat}, {data.lng}</Text>
        <Text><strong>Status:</strong> {data.status}</Text>
        <Text><strong>Last Checked:</strong> {data.lastChecked}</Text>
      </Box>
      <Button onClick={() => navigate({ to: `/scraping-api/${toolId}` })}>Back</Button>
    </Box>
  );
};

export const Route = createFileRoute("/scraping-api/:toolId/ip/:ipId")({
  component: IPDetail,
});

export default IPDetail;