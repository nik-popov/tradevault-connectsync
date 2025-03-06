import React, { useState, useEffect } from "react";
import { createFileRoute, useParams } from "@tanstack/react-router";
import { Container, Box, Text, Flex, Tabs, TabList, TabPanels, Tab, TabPanel, Table, Thead, Tbody, Tr, Th, Td, Spinner, Button, Input } from "@chakra-ui/react";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import EndpointSettings from "../../../../components/EndpointSettings";
import EndpointUsage from "../../../../components/ProxyUsage";
import Overview from "../../../../components/Overview";

// Define endpoint data for mapping endpointId to URL
const endpointData: Record<string, string> = {
  "G-CLOUD-SOUTHAMERICA-WEST1": "https://southamerica-west1-image-scraper-451516.cloudfunctions.net/main",
  "G-CLOUD-US-CENTRAL1": "https://us-central1-image-scraper-451516.cloudfunctions.net/main",
  "G-CLOUD-US-EAST1": "https://us-east1-image-scraper-451516.cloudfunctions.net/main",
  "G-CLOUD-US-EAST4": "https://us-east4-image-scraper-451516.cloudfunctions.net/main",
  "G-CLOUD-US-WEST1": "https://us-west1-image-scraper-451516.cloudfunctions.net/main",
  "G-CLOUD-EUROPE-WEST4": "https://europe-west4-image-scraper-451516.cloudfunctions.net/main",
};

// Interface for traceroute hop data
interface TracerouteHop {
  hop: number;
  ip: string;
  city: string;
  latitude: number;
  longitude: number;
  latency: number;
}

const EndpointDetailPage = () => {
  const { endpointId } = useParams({ from: "/scraping-api/endpoints/$endpointId" }) as { endpointId: string };
  const [tracerouteData, setTracerouteData] = useState<TracerouteHop[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [autoRefresh, setAutoRefresh] = useState<boolean>(false); // Auto-refresh off by default
  const [refreshInterval, setRefreshInterval] = useState<number>(60000); // Default to 60 seconds

  const fetchTracerouteData = async () => {
    setIsLoading(true);
    try {
      const endpointUrl = endpointData[endpointId];
      if (!endpointUrl) throw new Error("Invalid endpoint ID");

      const mockHops: TracerouteHop[] = [
        { hop: 1, ip: "192.168.1.1", city: "Santiago, Chile", latitude: -33.4489, longitude: -70.6693, latency: 5 },
        { hop: 2, ip: "200.45.67.89", city: "Buenos Aires, Argentina", latitude: -34.6037, longitude: -58.3816, latency: 20 },
        { hop: 3, ip: "34.34.252.50", city: "São Paulo, Brazil", latitude: -23.5505, longitude: -46.6333, latency: 45 },
      ];

      setTracerouteData(mockHops);
    } catch (error) {
      console.error("Failed to fetch traceroute data:", error);
      setTracerouteData([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTracerouteData();
  }, [endpointId]);

  const tabsConfig = [
    { title: "Overview", component: () => <Overview toolId={endpointId} /> },
    { 
      title: "Settings", 
      component: () => (
        <Box>
          <Flex justify="space-between" mb={4}>
            <Text fontSize="lg" fontWeight="bold">Manage your Google SERP settings</Text>
            <Flex gap={2}>   
            </Flex>
          </Flex>
          <EndpointSettings endpointId={endpointId}  />
        </Box>
      )
    },
    { title: "Usage", component: () => <EndpointUsage /> },
    {
      title: "Traceroute",
      component: () => (
        <Box p={4}>
          <Text fontSize="lg" fontWeight="bold" mb={4}>Traceroute for {endpointId}</Text>
          {isLoading ? (
            <Flex justify="center" align="center" h="200px">
              <Spinner size="xl" color="blue.500" />
            </Flex>
          ) : tracerouteData.length > 0 ? (
            <>
              <Table variant="simple" mb={6}>
                <Thead>
                  <Tr>
                    <Th>Hop</Th>
                    <Th>City</Th>
                    <Th>IP Address</Th>
                    <Th>Latency (ms)</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {tracerouteData.map((hop) => (
                    <Tr key={hop.hop}>
                      <Td>{hop.hop}</Td>
                      <Td>{hop.city}</Td>
                      <Td>{hop.ip}</Td>
                      <Td>{hop.latency}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
              <Box height="400px" borderRadius="md" overflow="hidden">
                <MapContainer
                  center={[tracerouteData[0].latitude, tracerouteData[0].longitude]}
                  zoom={3}
                  style={{ height: "100%", width: "100%" }}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{52x}/{y}.png"
                    attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  {tracerouteData.map((hop) => (
                    <Marker key={hop.hop} position={[hop.latitude, hop.longitude]}>
                      <Popup>
                        Hop {hop.hop}: {hop.city} ({hop.ip})<br />
                        Latency: {hop.latency}ms
                      </Popup>
                    </Marker>
                  ))}
                  <Polyline
                    positions={tracerouteData.map(hop => [hop.latitude, hop.longitude])}
                    color="blue"
                    weight={2}
                  />
                </MapContainer>
              </Box>
            </>
          ) : (
            <Text color="gray.500">No traceroute data available.</Text>
          )}
          <Text mt={4} fontSize="sm" color="gray.500">
            Note: Real traceroute data requires server-side execution. This is a simulated visualization.
          </Text>
        </Box>
      ),
    },
  ];

  return (
    <Container maxW="full">
      <Flex align="center" justify="space-between" py={6} flexWrap="wrap" gap={4}>
        <Box textAlign="left" flex="1">
          <Text fontSize="xl" fontWeight="bold">Endpoint: {endpointId}</Text>
          <Text fontSize="sm">Manage settings for {endpointId}.</Text>
        </Box>
      </Flex>
      <Tabs variant="enclosed" isLazy>
        <TabList>
          {tabsConfig.map((tab) => (
            <Tab key={tab.title}>{tab.title}</Tab>
          ))}
        </TabList>
        <TabPanels>
          {tabsConfig.map((tab) => (
            <TabPanel key={tab.title}>{tab.component()}</TabPanel>
          ))}
        </TabPanels>
      </Tabs>
    </Container>
  );
};

export const Route = createFileRoute("/_layout/scraping-api/endpoints/$endpointId")({
  component: EndpointDetailPage,
});

export default EndpointDetailPage;