import { createFileRoute, Link } from "@tanstack/react-router";
import { Container, Box, Text, Flex } from "@chakra-ui/react";

interface EndpointData {
  endpoint: string;
  toolId: string;
  publicIp: string;
  status: string;
  health: string;
  lastChecked: string;
  error: string;
}

const endpointData: EndpointData[] = [
  {
    endpoint: "https://southamerica-west1-image-scraper-451516.cloudfunctions.net/main",
    toolId: "G-CLOUD-SOUTHAMERICA-WEST1",
    publicIp: "34.34.252.50",
    status: "Google is reachable",
    health: "Healthy",
    lastChecked: "10:26:22 AM",
    error: "None",
  },
  {
    endpoint: "https://us-central1-image-scraper-451516.cloudfunctions.net/main",
    toolId: "G-CLOUD-US-CENTRAL1",
    publicIp: "34.96.44.247",
    status: "Google is reachable",
    health: "Healthy",
    lastChecked: "10:26:22 AM",
    error: "None",
  },
  {
    endpoint: "https://europe-west1-image-serp-451516.cloudfunctions.net/main",
    toolId: "G-IMAGE-SERP-EUROPE-WEST1",
    publicIp: "35.246.78.123",
    status: "Google Images is reachable",
    health: "Healthy",
    lastChecked: "10:30:00 AM",
    error: "None",
  },
  {
    endpoint: "https://us-central1-image-serp-451516.cloudfunctions.net/main",
    toolId: "G-IMAGE-SERP-US-CENTRAL1",
    publicIp: "34.96.44.248",
    status: "Google Images is reachable",
    health: "Healthy",
    lastChecked: "10:31:00 AM",
    error: "None",
  },
];

const EndpointsListPage = () => {
  return (
    <Container maxW="full">
      <Flex align="center" justify="space-between" py={6} flexWrap="wrap" gap={4}>
        <Box textAlign="left" flex="1">
          <Text fontSize="xl" fontWeight="bold">Scraping API Endpoints</Text>
          <Text fontSize="sm">View and manage all available endpoints.</Text>
        </Box>
      </Flex>
      <Box>
        <Text fontSize="lg" fontWeight="bold" mb={2}>
          Endpoint List
        </Text>
        <table>
          <thead>
            <tr>
              <th>Tool ID</th>
              <th>Endpoint URL</th>
              <th>Public IP</th>
              <th>Status</th>
              <th>Health</th>
              <th>Last Checked</th>
              <th>Error</th>
            </tr>
          </thead>
          <tbody>
            {endpointData.map((endpoint) => (
              <tr key={endpoint.toolId}>
                <td>
                  <Link to="/scraping-api/endpoints/$endpointId" params={{ endpointId: endpoint.toolId }}>
                    {endpoint.toolId}
                  </Link>
                </td>
                <td>{endpoint.endpoint}</td>
                <td>{endpoint.publicIp}</td>
                <td>{endpoint.status}</td>
                <td>{endpoint.health}</td>
                <td>{endpoint.lastChecked}</td>
                <td>{endpoint.error}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Box>
    </Container>
  );
};

export const Route = createFileRoute("/_layout/scraping-api/endpoints/")({
  component: EndpointsListPage,
});

export default EndpointsListPage;