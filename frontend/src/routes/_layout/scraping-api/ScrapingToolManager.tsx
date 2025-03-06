// src/routes/ScrapingToolManager.tsx
import React from 'react';
import {
  Container, Box, Text, Flex, Tabs, TabList, TabPanels, Tab, TabPanel, Tooltip, Accordion, AccordionItem,
  AccordionButton, AccordionPanel, AccordionIcon, Table, Thead, Tbody, Tr, Th, Td, Spinner, Alert, AlertIcon,
  Button,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, useParams, useNavigate, useRouter } from "@tanstack/react-router";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip as ChartTooltip, Legend } from 'chart.js';
import 'leaflet/dist/leaflet.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, ChartTooltip, Legend);

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const fetchIPData = async () => [
  { id: "1", region: "South America West", publicIp: "34.34.252.50", lat: -33.4489, lng: -70.6693, city: "Santiago", status: "Active" },
  { id: "2", region: "US Central", publicIp: "34.96.44.247", lat: 41.8781, lng: -93.0977, city: "Ames", status: "Active" },
  { id: "3", region: "US East", publicIp: "34.96.49.218", lat: 33.7490, lng: -84.3880, city: "Atlanta", status: "Active" },
  { id: "4", region: "US East 4", publicIp: "34.34.234.250", lat: 38.9072, lng: -77.0369, city: "Washington D.C.", status: "Active" },
  { id: "5", region: "US West", publicIp: "34.96.52.74", lat: 45.5152, lng: -122.6784, city: "Portland", status: "Active" },
];

class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Caught error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <Text>Error: {this.state.error?.message || 'Unknown error'}</Text>;
    }
    return this.props.children;
  }
}

const StartHere = () => (
  <Accordion allowToggle>
    <AccordionItem>
      <AccordionButton>
        <Box flex="1" textAlign="left">Quick Setup Guide</Box>
        <AccordionIcon />
      </AccordionButton>
      <AccordionPanel pb={4}>
        <Box p={4} borderWidth="1px" borderRadius="md" mb={2}>
          <Tooltip label="List all proxy endpoints">
            <Text fontFamily="monospace">curl -X GET https://api.iconluxury.group/api/v1/endpoints</Text>
          </Tooltip>
          <Text mt={2}>Status: Ready to use</Text>
        </Box>
        <Box p={4} borderWidth="1px" borderRadius="md">
          <Tooltip label="Test your proxy connection">
            <Text fontFamily="monospace">curl --proxy-user username:password -x api.iconluxury.group/api/v1/proxy/residential/ https://api.mywebsite.com</Text>
          </Tooltip>
          <Text mt={2}>Credentials: Set your username:password</Text>
        </Box>
      </AccordionPanel>
    </AccordionItem>
  </Accordion>
);

const IPPathTracer = ({ toolId }) => {
  const navigate = useNavigate();
  const router = useRouter();
  const effectiveToolId = toolId || "google-serp";
  const { data, isLoading, error } = useQuery({
    queryKey: ['ipTraceRoute'],
    queryFn: async () => {
      const ips = await fetchIPData();
      const response = await fetch('https://api.ipify.org?format=json');
      const clientIp = (await response.json()).ip;
      return ips.map(ip => ({
        ...ip,
        hops: [
          { hop: 1, ip: clientIp, latency: "10ms", city: "Your Location", status: "Local" },
          { hop: 2, ip: "192.168.1.1", latency: "20ms", city: "Local Router", status: "Gateway" },
          { hop: 3, ip: ip.publicIp, latency: "50ms", city: ip.city, status: "Destination" },
        ],
      }));
    },
  });

  if (isLoading) return <Spinner />;
  if (error) return <Alert status="error"><AlertIcon />{error.message}</Alert>;

  const handleNavigate = (ipId) => {
    const currentPath = router.state.location.pathname;
    console.log('Navigating from:', currentPath, 'to:', `/scraping-api/${effectiveToolId}/ip/${ipId}`);
    try {
      navigate({ to: `/scraping-api/${effectiveToolId}/ip/${ipId}` });
    } catch (err) {
      console.error('Navigation error:', err);
    }
  };

  return (
    <Accordion allowToggle>
      {data?.map((trace) => (
        <AccordionItem key={trace.id}>
          <AccordionButton>
            <Box flex="1" textAlign="left">
              <Tooltip label={`Path to ${trace.city}`}>
                <Text>{trace.city} ({trace.publicIp})</Text>
              </Tooltip>
            </Box>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel pb={4}>
            <Box p={4} borderWidth="1px" borderRadius="md" mb={2}>
              <Text><strong>IP:</strong> {trace.publicIp}</Text>
              <Text><strong>Region:</strong> {trace.region}</Text>
              <Text><strong>City:</strong> {trace.city}</Text>
              <Text><strong>Status:</strong> {trace.status}</Text>
              <Button size="sm" mt={2} onClick={() => handleNavigate(trace.publicIp)}>
                Full Details
              </Button>
            </Box>
            <Table variant="simple" size="sm">
              <Thead>
                <Tr>
                  <Th>Hop</Th>
                  <Th>IP</Th>
                  <Th>City</Th>
                  <Th>Latency</Th>
                  <Th>Status</Th>
                </Tr>
              </Thead>
              <Tbody>
                {trace.hops.map((hop, hopIndex) => (
                  <Tr key={hopIndex}>
                    <Td>{hop.hop}</Td>
                    <Td>{hop.ip}</Td>
                    <Td>{hop.city}</Td>
                    <Td>{hop.latency}</Td>
                    <Td>{hop.status}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </AccordionPanel>
        </AccordionItem>
      ))}
    </Accordion>
  );
};

const IPMap = ({ toolId }) => {
  const navigate = useNavigate();
  const router = useRouter();
  const effectiveToolId = toolId || "google-serp";
  const { data, isLoading, error } = useQuery({ queryKey: ['ipData'], queryFn: fetchIPData });

  if (isLoading) return <Spinner />;
  if (error) return <Alert status="error"><AlertIcon />{error.message}</Alert>;

  const handleNavigate = (ipId) => {
    const currentPath = router.state.location.pathname;
    console.log('Navigating from:', currentPath, 'to:', `/scraping-api/${effectiveToolId}/ip/${ipId}`);
    try {
      navigate({ to: `/scraping-api/${effectiveToolId}/ip/${ipId}` });
    } catch (err) {
      console.error('Navigation error:', err);
    }
  };

  return (
    <Box>
      <MapContainer center={[39.8283, -98.5795]} zoom={3} style={{ height: "500px", width: "100%" }} scrollWheelZoom={true}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' />
        {data?.map((ip) => (
          <Marker key={ip.id} position={[ip.lat, ip.lng]}>
            <Popup>
              <Box p={2} borderWidth="1px" borderRadius="md">
                <Tooltip label={`IP: ${ip.publicIp}`}>
                  <Text><strong>{ip.city}</strong> ({ip.region})</Text>
                </Tooltip>
                <Text>IP: {ip.publicIp}</Text>
                <Text>Status: {ip.status}</Text>
                <Button size="sm" mt={2} onClick={() => handleNavigate(ip.publicIp)}>
                  Full Details
                </Button>
              </Box>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </Box>
  );
};

const UserAgents = () => {
  const navigate = useNavigate();
  const router = useRouter();
  const { toolId } = useParams<{ toolId: string }>();
  const effectiveToolId = toolId || "google-serp";
  const { data, isLoading, error } = useQuery({
    queryKey: ['userAgents'],
    queryFn: async () => {
      const response = await fetch('https://api.thedataproxy.com/api/v1/user-agents/?skip=0&limit=100', {
        headers: { 'accept': 'application/json' },
      });
      if (!response.ok) throw new Error('Failed to fetch');
      return (await response.json()).data;
    },
  });

  const chartData = {
    labels: data?.map((agent) => agent.browser) || [],
    datasets: [{ label: 'Usage %', data: data?.map((agent) => agent.percentage) || [], backgroundColor: 'rgba(66, 153, 225, 0.6)' }],
  };

  if (isLoading) return <Spinner />;
  if (error) return <Alert status="error"><AlertIcon />{error.message}</Alert>;

  const handleNavigate = (agentId) => {
    const currentPath = router.state.location.pathname;
    console.log('Navigating from:', currentPath, 'to:', `/scraping-api/${effectiveToolId}/agent/${agentId}`);
    try {
      navigate({ to: `/scraping-api/${effectiveToolId}/agent/${agentId}` });
    } catch (err) {
      console.error('Navigation error:', err);
    }
  };

  return (
    <Accordion allowToggle>
      {data?.map((agent) => (
        <AccordionItem key={agent.id}>
          <AccordionButton>
            <Box flex="1" textAlign="left">
              <Tooltip label={`Usage: ${agent.percentage}%`}>
                <Text>{agent.browser} - {agent.os}</Text>
              </Tooltip>
            </Box>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel pb={4}>
            <Box p={4} borderWidth="1px" borderRadius="md">
              <Text><strong>User Agent:</strong> {agent.user_agent}</Text>
              <Text><strong>Device:</strong> {agent.device}</Text>
              <Text><strong>Browser:</strong> {agent.browser}</Text>
              <Text><strong>OS:</strong> {agent.os}</Text>
              <Text><strong>Usage:</strong> {agent.percentage}%</Text>
              <Button size="sm" mt={2} onClick={() => handleNavigate(agent.id)}>
                Full Details
              </Button>
            </Box>
          </AccordionPanel>
        </AccordionItem>
      ))}
      <Box mt={4} height="300px">
        <Bar data={chartData} options={{ responsive: true, maintainAspectRatio: false }} />
      </Box>
    </Accordion>
  );
};

const ScrapingToolManager = () => {
  const { toolId } = useParams<{ toolId: "google-serp" | "bing-serp" | "custom-scraper" }>();
  const PRODUCT = toolId || "google-serp";
  const router = useRouter();

  console.log('Current route:', router.state.location.pathname);

  if (!toolId) {
    console.warn('toolId is undefined, defaulting to "google-serp"');
  }

  const { data: subscriptionSettings } = useQuery({
    queryKey: ["subscriptionSettings", PRODUCT],
    queryFn: () => {
      const storedSettings = localStorage.getItem("subscriptionSettings");
      return storedSettings ? JSON.parse(storedSettings) : {};
    },
    staleTime: Infinity,
  });

  const tabsConfig = [
    { title: "Start Here", component: <StartHere /> },
    { title: "IP Paths", component: <IPPathTracer toolId={PRODUCT} /> },
    { title: "IP Map", component: <IPMap toolId={PRODUCT} /> },
    { title: "User Agents", component: <UserAgents /> },
  ];

  const toolDisplayName = PRODUCT.split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");

  return (
    <ErrorBoundary>
      <Container maxW="full" p={4}>
        <Flex align="center" justify="space-between" py={6} flexWrap="wrap" gap={4}>
          <Box textAlign="left" flex="1">
            <Text fontSize="xl" fontWeight="bold">{toolDisplayName} API</Text>
            <Text fontSize="sm">Explore and manage your proxy tools.</Text>
          </Box>
        </Flex>
        <Tabs variant="enclosed">
          <TabList>
            {tabsConfig.map((tab, index) => (
              <Tab key={index}>
                <Tooltip label={`View ${tab.title.toLowerCase()} details`}>
                  {tab.title}
                </Tooltip>
              </Tab>
            ))}
          </TabList>
          <TabPanels>
            {tabsConfig.map((tab, index) => (
              <TabPanel key={index}>
                {tab.component}
              </TabPanel>
            ))}
          </TabPanels>
        </Tabs>
      </Container>
    </ErrorBoundary>
  );
};

export const Route = createFileRoute("/scraping-api/:toolId")({
  component: ScrapingToolManager,
});

export default ScrapingToolManager;