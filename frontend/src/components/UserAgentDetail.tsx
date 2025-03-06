// src/routes/UserAgentDetail.tsx
import React from 'react';
import { Box, Heading, Text, Button } from "@chakra-ui/react";
import { useParams, useNavigate } from "@tanstack/react-router";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";

const fetchUserAgentDetail = async (agentId) => {
  const response = await fetch('https://api.thedataproxy.com/api/v1/user-agents/?skip=0&limit=100', {
    headers: { 'accept': 'application/json' },
  });
  const agents = (await response.json()).data;
  return agents.find(agent => agent.id === agentId) || { id: agentId, user_agent: "Unknown" };
};

const UserAgentDetail = () => {
  const { toolId, agentId } = useParams<{ toolId: string; agentId: string }>();
  const navigate = useNavigate();
  const { data, isLoading, error } = useQuery({
    queryKey: ['userAgentDetail', agentId],
    queryFn: () => fetchUserAgentDetail(agentId),
  });

  if (isLoading) return <Spinner />;
  if (error) return <Text>Error: {error.message}</Text>;

  return (
    <Box p={6}>
      <Heading size="lg" mb={4}>User Agent Details: {agentId}</Heading>
      <Box p={4} borderWidth="1px" borderRadius="md" mb={4}>
        <Text><strong>User Agent:</strong> {data.user_agent}</Text>
        <Text><strong>Device:</strong> {data.device}</Text>
        <Text><strong>Browser:</strong> {data.browser}</Text>
        <Text><strong>OS:</strong> {data.os}</Text>
        <Text><strong>Usage:</strong> {data.percentage}%</Text>
      </Box>
      <Button onClick={() => navigate({ to: `/scraping-api/${toolId}` })}>Back</Button>
    </Box>
  );
};

export const Route = createFileRoute("/scraping-api/:toolId/agent/:agentId")({
  component: UserAgentDetail,
});

export default UserAgentDetail;