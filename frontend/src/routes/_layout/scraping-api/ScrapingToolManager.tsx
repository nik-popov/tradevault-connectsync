import React, { useState } from 'react';
import {
  Container, Box, Text, Flex, Tabs, TabList, TabPanels, Tab, TabPanel, Tooltip, Accordion, AccordionItem,
  AccordionButton, AccordionPanel, AccordionIcon, Table, Thead, Tbody, Tr, Th, Td, Spinner, Alert, AlertIcon,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, useParams } from "@tanstack/react-router";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip as ChartTooltip, Legend } from 'chart.js';
import { motion } from 'framer-motion';
import 'leaflet/dist/leaflet.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, ChartTooltip, Legend);

// Fix Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Dynamic IP Data Fetch (Mocked for now, replace with API)
const fetchIPData = async () => {
  const response = await fetch('https://api.ipify.org?format=json');
  const clientIp = (await response.json()).ip;
  return [
    { region: "South America West", publicIp: "34.34.252.50", lat: -33.4489, lng: -70.6693, city: "Santiago" },
    { region: "US Central", publicIp: "34.96.44.247", lat: 41.8781, lng: -93.0977, city: "Ames" },
    { region: "US East", publicIp: "34.96.49.218", lat: 33.7490, lng: -84.3880, city: "Atlanta" },
    { region: "US East 4", publicIp: "34.34.234.250", lat: 38.9072, lng: -77.0369, city: "Washington D.C." },
    { region: "US West", publicIp: "34.96.52.74", lat: 45.5152, lng: -122.6784, city: "Portland" },
  ];
};

// Start Here Component
const StartHere = () => (
  <Accordion allowToggle>
    <AccordionItem>
      <AccordionButton>
        <Box flex="1" textAlign="left">Quick Setup</Box>
        <AccordionIcon />
      </AccordionButton>
      <AccordionPanel pb={4}>
        <Tooltip label="Copy this to list available endpoints">
          <Text fontFamily="monospace" bg="gray.100" p={2} mb={2}>curl -X GET https://api.iconluxury.group/api/v1/endpoints</Text>
        </Tooltip>
        <Tooltip label="Set your credentials here">
          <Text>Set username:password, then test:</Text>
        </Tooltip>
        <Tooltip label="Copy this to send your first request">
          <Text fontFamily="monospace" bg="gray.100" p={2}>curl --proxy-user username:password -x api.iconluxury.group/api/v1/proxy/residential/ https://api.mywebsite.com</Text>
        </Tooltip>
      </AccordionPanel>
    </AccordionItem>
  </Accordion>
);

// IP Path Tracer Component
const IPPathTracer = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['ipTraceRoute'],
    queryFn: async () => {
      const ips = await fetchIPData();
      const response = await fetch('https://api.ipify.org?format=json');
      const clientIp = (await response.json()).ip;
      return ips.map(ip => ({
        ...ip,
        hops: [
          { hop: 1, ip: clientIp, latency: "10ms", city: "Your Location" },
          { hop: 2, ip: "192.168.1.1", latency: "20ms", city: "Local Router" },
          { hop: 3, ip: ip.publicIp, latency: "50ms", city: ip.city },
        ],
      }));
    },
  });

  if (isLoading) return <Spinner />;
  if (error) return <Alert status="error"><AlertIcon />{error.message}</Alert>;

  return (
    <Accordion allowToggle>
      {data.map((trace, index) => (
        <AccordionItem key={index}>
          <AccordionButton>
            <Box flex="1" textAlign="left">
              <Tooltip label={`Explore path to ${trace.city}`}>
                <Text>{trace.city} ({trace.publicIp})</Text>
              </Tooltip>
            </Box>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel pb={4}>
            <Table variant="simple" size="sm">
              <Thead>
                <Tr>
                  <Th>Hop</Th>
                  <Th>IP</Th>
                  <Th>City</Th>
                  <Th>Latency</Th>
                </Tr>
              </Thead>
              <Tbody>
                {trace.hops.map((hop, hopIndex) => (
                  <Tr key={hopIndex}>
                    <Td>{hop.hop}</Td>
                    <Td>{hop.ip}</Td>
                    <Td>{hop.city}</Td>
                    <Td>{hop.latency}</Td>
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

// IP Map Component
const IPMap = () => {
  const { data, isLoading, error } = useQuery({ queryKey: ['ipData'], queryFn: fetchIPData });

  if (isLoading) return <Spinner />;
  if (error) return <Alert status="error"><AlertIcon />{error.message}</Alert>;

  return (
    <Box>
      <MapContainer
        center={[39.8283, -98.5795]}
        zoom={3}
        style={{ height: "500px", width: "100%" }}
        scrollWheelZoom={true}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        {data.map((ip, index) => (
          <Marker key={index} position={[ip.lat, ip.lng]}>
            <Popup>
              <Tooltip label={`IP: ${ip.publicIp}`}>
                <Text>{ip.city} ({ip.region})</Text>
              </Tooltip>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </Box>
  );
};

// User Agents Component
const UserAgents = () => {
  const [userAgents, setUserAgents] = useState([]);
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

  return (
    <Accordion allowToggle>
      {data.map((agent) => (
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
            <Text>{agent.user_agent}</Text>
            <Text>Device: {agent.device}</Text>
          </AccordionPanel>
        </AccordionItem>
      ))}
      <Box mt={4} height="300px">
        <Bar data={chartData} options={{ responsive: true, maintainAspectRatio: false }} />
      </Box>
    </Accordion>
  );
};

// Main Component
const ScrapingToolManager = () => {
  const { toolId } = useParams<{ toolId: "google-serp" | "bing-serp" | "custom-scraper" }>();
  const PRODUCT = toolId || "google-serp";

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
    { title: "IP Paths", component: <IPPathTracer /> },
    { title: "IP Map", component: <IPMap /> },
    { title: "User Agents", component: <UserAgents /> },
    // Add ProxySettings back if needed: { title: "Endpoints", component: <ProxySettings /> },
  ];

  const toolDisplayName = PRODUCT.split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");

  return (
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
            <TabPanel key={index} as={motion.div} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
              {tab.component}
            </TabPanel>
          ))}
        </TabPanels>
      </Tabs>
    </Container>
  );
};

export const Route = createFileRoute("/scraping-api/:toolId")({
  component: ScrapingToolManager,
});

export default ScrapingToolManager;