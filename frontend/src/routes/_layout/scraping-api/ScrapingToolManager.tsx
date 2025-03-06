import React from 'react';
import {
  Container,
  Box,
  Text,
  Flex,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Spinner,
  Alert,
  AlertIcon,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, useParams } from "@tanstack/react-router";
import ProxySettings from "../../../components/EndpointSettings";
import UserAgentDashboard from "../../../components/UserAgentDashboard";
import ProxyStarted from "../../../components/ProxyStarted";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css'; // Add this here or in your entry file
// Sample IP data (replace with real data from previous table or API)
const ipData = [
  { region: "G-CLOUD-SOUTHAMERICA-WEST1", publicIp: "34.34.252.50", lat: -33.4489, lng: -70.6693 }, // Santiago, Chile
  { region: "G-CLOUD-US-CENTRAL1", publicIp: "34.96.44.247", lat: 41.8781, lng: -93.0977 }, // Iowa, USA
  { region: "G-CLOUD-US-EAST1", publicIp: "34.96.49.218", lat: 33.7490, lng: -84.3880 }, // Atlanta, USA
  { region: "G-CLOUD-US-EAST4", publicIp: "34.34.234.250", lat: 38.9072, lng: -77.0369 }, // Washington D.C., USA
  { region: "G-CLOUD-US-WEST1", publicIp: "34.96.52.74", lat: 45.5152, lng: -122.6784 }, // Portland, USA
];

// IP Trace Route Component
const IPTraceRoute = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['ipTraceRoute'],
    queryFn: async () => {
      // Simulate traceroute (replace with real API call or traceroute logic)
      const response = await fetch('https://api.ipify.org?format=json'); // Example API to get client IP
      const clientIp = (await response.json()).ip;
      return ipData.map(ip => ({
        ...ip,
        hops: [
          { hop: 1, ip: clientIp, latency: "10ms" },
          { hop: 2, ip: "192.168.1.1", latency: "20ms" },
          { hop: 3, ip: ip.publicIp, latency: "50ms" },
        ],
      }));
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  if (isLoading) return <Spinner />;
  if (error) return <Alert status="error"><AlertIcon />Error: {error.message}</Alert>;

  return (
    <Box>
      <Text fontSize="lg" fontWeight="bold" mb={4}>IP Trace Route</Text>
      {data.map((trace, index) => (
        <Box key={index} mb={6}>
          <Text fontWeight="semibold">To: {trace.publicIp} ({trace.region})</Text>
          <Table variant="simple" size="sm" mt={2}>
            <Thead>
              <Tr>
                <Th>Hop</Th>
                <Th>IP</Th>
                <Th>Latency</Th>
              </Tr>
            </Thead>
            <Tbody>
              {trace.hops.map((hop, hopIndex) => (
                <Tr key={hopIndex}>
                  <Td>{hop.hop}</Td>
                  <Td>{hop.ip}</Td>
                  <Td>{hop.latency}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      ))}
    </Box>
  );
};

// IP Map Component
const IPMap = () => {
  return (
    <Box>
      <Text fontSize="lg" fontWeight="bold" mb={4}>IP Locations</Text>
      <MapContainer
        center={[39.8283, -98.5795]} // Center of the USA as a default
        zoom={3}
        style={{ height: "400px", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {ipData.map((ip, index) => (
          <Marker key={index} position={[ip.lat, ip.lng]}>
            <Popup>
              {ip.region}: {ip.publicIp}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </Box>
  );
};

type ScrapingTool = "google-serp" | "bing-serp" | "custom-scraper";

const ScrapingToolManager = (): JSX.Element => {
  const { toolId } = useParams<{ toolId: ScrapingTool }>();
  const PRODUCT = toolId || "google-serp";

  const { data: subscriptionSettings } = useQuery({
    queryKey: ["subscriptionSettings", PRODUCT],
    queryFn: () => {
      const storedSettings = localStorage.getItem("subscriptionSettings");
      return storedSettings ? JSON.parse(storedSettings) : {};
    },
    staleTime: Infinity,
  });

  const settings = subscriptionSettings?.[PRODUCT] || {
    hasSubscription: false,
    isTrial: false,
    isDeactivated: false,
  };

  const tabsConfig = [
    { title: "Get Started", component: <ProxyStarted /> },
    { title: "Endpoints", component: <ProxySettings /> },
    { title: "User Agent", component: <UserAgentDashboard /> },
    { title: "IP Trace Route", component: <IPTraceRoute /> },
    { title: "IP Map", component: <IPMap /> },
  ];

  const toolDisplayName = PRODUCT.split("-")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return (
    <Container maxW="full">
      <Flex align="center" justify="space-between" py={6} flexWrap="wrap" gap={4}>
        <Box textAlign="left" flex="1">
          <Text fontSize="xl" fontWeight="bold">{toolDisplayName} API</Text>
          <Text fontSize="sm">Manage your {toolDisplayName.toLowerCase()} settings.</Text>
        </Box>
      </Flex>
      <Tabs variant="enclosed">
        <TabList>
          {tabsConfig.map((tab, index) => <Tab key={index}>{tab.title}</Tab>)}
        </TabList>
        <TabPanels>
          {tabsConfig.map((tab, index) => <TabPanel key={index}>{tab.component}</TabPanel>)}
        </TabPanels>
      </Tabs>
    </Container>
  );
};

export const Route = createFileRoute("/scraping-api/:toolId")({
  component: ScrapingToolManager,
});

export default ScrapingToolManager;