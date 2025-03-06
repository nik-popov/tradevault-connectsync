// src/components/IPDetail.tsx
import React from 'react';
import { Box, Heading, Text, Button } from "@chakra-ui/react";
import { useParams, useNavigate } from "@tanstack/react-router";
import { createFileRoute } from "@tanstack/react-router";

const IPDetail = () => {
  const { toolId, ipId } = useParams<{ toolId: string; ipId: string }>();
  const navigate = useNavigate();

  // Mock data for now; replace with API fetch
  const ipData = {
    publicIp: ipId,
    region: "US Central",
    city: "Ames",
    lat: 41.8781,
    lng: -93.0977,
    status: "Active",
    lastChecked: "2025-03-07 10:00:00",
  };

  return (
    <Box p={6}>
      <Heading size="lg" mb={4}>IP Details: {ipId}</Heading>
      <Box p={4} borderWidth="1px" borderRadius="md" mb={4}>
        <Text><strong>Region:</strong> {ipData.region}</Text>
        <Text><strong>City:</strong> {ipData.city}</Text>
        <Text><strong>Coordinates:</strong> {ipData.lat}, {ipData.lng}</Text>
        <Text><strong>Status:</strong> {ipData.status}</Text>
        <Text><strong>Last Checked:</strong> {ipData.lastChecked}</Text>
      </Box>
      <Button onClick={() => navigate({ to: `/scraping-api/${toolId}` })}>Back</Button>
    </Box>
  );
};

export const Route = createFileRoute("/scraping-api/:toolId/ip/:ipId")({
  component: IPDetail,
});

export default IPDetail;