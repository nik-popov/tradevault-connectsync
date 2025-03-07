import React, { useState, useEffect, useRef } from "react";
import { createFileRoute, useParams } from "@tanstack/react-router";
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
  Button,
  Input,
  Card,
  CardBody,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Tooltip,
  Grid,
  GridItem,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from "@chakra-ui/react";
import EndpointSettings from "../../../../components/EndpointSettings";
import EndpointUsage from "../../../../components/ProxyUsage";
import Overview from "../../../../components/Overview";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline } from "react-leaflet";
import { Marker as LeafletMarker } from "leaflet";
import "leaflet-defaulticon-compatibility";
// Define endpoint data
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

// Static traceroute data with two datasets per endpoint
const staticTracerouteData: Record<string, TracerouteHop[][]> = {
  "G-CLOUD-SOUTHAMERICA-WEST1": [
    [
      { hop: 1, ip: "192.168.1.1", city: "Santiago, Chile", latitude: -33.4489, longitude: -70.6693, latency: 5 },
      { hop: 2, ip: "200.45.67.89", city: "Buenos Aires, Argentina", latitude: -34.6037, longitude: -58.3816, latency: 20 },
      { hop: 3, ip: "34.34.252.50", city: "São Paulo, Brazil", latitude: -23.5505, longitude: -46.6333, latency: 45 },
      { hop: 4, ip: "201.54.32.10", city: "Lima, Peru", latitude: -12.0464, longitude: -77.0428, latency: 60 },
      { hop: 5, ip: "34.98.76.54", city: "Quito, Ecuador", latitude: -0.1807, longitude: -78.4678, latency: 80 },
    ],
    [
      { hop: 1, ip: "192.168.1.2", city: "Valparaíso, Chile", latitude: -33.0472, longitude: -71.6127, latency: 6 },
      { hop: 2, ip: "200.45.67.90", city: "Córdoba, Argentina", latitude: -31.4201, longitude: -64.1888, latency: 25 },
      { hop: 3, ip: "34.34.252.51", city: "Rio de Janeiro, Brazil", latitude: -22.9068, longitude: -43.1729, latency: 50 },
      { hop: 4, ip: "201.54.32.11", city: "Bogotá, Colombia", latitude: 4.7110, longitude: -74.0721, latency: 70 },
      { hop: 5, ip: "34.98.76.55", city: "Caracas, Venezuela", latitude: 10.4806, longitude: -66.9036, latency: 90 },
    ],
  ],
  "G-CLOUD-US-CENTRAL1": [
    [
      { hop: 1, ip: "10.0.0.1", city: "Kansas City, MO", latitude: 39.0997, longitude: -94.5786, latency: 3 },
      { hop: 2, ip: "172.16.254.1", city: "Chicago, IL", latitude: 41.8781, longitude: -87.6298, latency: 15 },
      { hop: 3, ip: "34.67.89.12", city: "Council Bluffs, IA", latitude: 41.2619, longitude: -95.8608, latency: 30 },
      { hop: 4, ip: "192.34.56.78", city: "St. Louis, MO", latitude: 38.6270, longitude: -90.1994, latency: 45 },
      { hop: 5, ip: "34.102.34.56", city: "Omaha, NE", latitude: 41.2565, longitude: -95.9345, latency: 60 },
    ],
    [
      { hop: 1, ip: "10.0.0.2", city: "Springfield, MO", latitude: 37.2089, longitude: -93.2923, latency: 4 },
      { hop: 2, ip: "172.16.254.2", city: "Indianapolis, IN", latitude: 39.7684, longitude: -86.1581, latency: 20 },
      { hop: 3, ip: "34.67.89.13", city: "Des Moines, IA", latitude: 41.5868, longitude: -93.6250, latency: 35 },
      { hop: 4, ip: "192.34.56.79", city: "Minneapolis, MN", latitude: 44.9778, longitude: -93.2650, latency: 50 },
      { hop: 5, ip: "34.102.34.57", city: "Fargo, ND", latitude: 46.8772, longitude: -96.7898, latency: 70 },
    ],
  ],
  "G-CLOUD-US-EAST1": [
    [
      { hop: 1, ip: "192.168.0.1", city: "New York, NY", latitude: 40.7128, longitude: -74.0060, latency: 4 },
      { hop: 2, ip: "203.45.67.89", city: "Washington, DC", latitude: 38.9072, longitude: -77.0369, latency: 18 },
      { hop: 3, ip: "34.45.67.89", city: "Charleston, SC", latitude: 32.7765, longitude: -79.9311, latency: 35 },
      { hop: 4, ip: "172.18.34.56", city: "Atlanta, GA", latitude: 33.7490, longitude: -84.3880, latency: 50 },
      { hop: 5, ip: "34.120.56.78", city: "Miami, FL", latitude: 25.7617, longitude: -80.1918, latency: 70 },
    ],
    [
      { hop: 1, ip: "192.168.0.2", city: "Boston, MA", latitude: 42.3601, longitude: -71.0589, latency: 5 },
      { hop: 2, ip: "203.45.67.90", city: "Philadelphia, PA", latitude: 39.9526, longitude: -75.1652, latency: 15 },
      { hop: 3, ip: "34.45.67.90", city: "Raleigh, NC", latitude: 35.7796, longitude: -78.6382, latency: 30 },
      { hop: 4, ip: "172.18.34.57", city: "Charlotte, NC", latitude: 35.2271, longitude: -80.8431, latency: 45 },
      { hop: 5, ip: "34.120.56.79", city: "Orlando, FL", latitude: 28.5383, longitude: -81.3792, latency: 65 },
    ],
  ],
  "G-CLOUD-US-EAST4": [
    [
      { hop: 1, ip: "10.10.10.1", city: "Ashburn, VA", latitude: 39.0437, longitude: -77.4875, latency: 2 },
      { hop: 2, ip: "172.16.1.1", city: "Richmond, VA", latitude: 37.5407, longitude: -77.4360, latency: 10 },
      { hop: 3, ip: "34.89.12.34", city: "North Virginia", latitude: 38.8339, longitude: -77.3078, latency: 25 },
      { hop: 4, ip: "192.45.67.89", city: "Raleigh, NC", latitude: 35.7796, longitude: -78.6382, latency: 40 },
      { hop: 5, ip: "34.130.78.90", city: "Charlotte, NC", latitude: 35.2271, longitude: -80.8431, latency: 55 },
    ],
    [
      { hop: 1, ip: "10.10.10.2", city: "Leesburg, VA", latitude: 39.1157, longitude: -77.5636, latency: 3 },
      { hop: 2, ip: "172.16.1.2", city: "Baltimore, MD", latitude: 39.2904, longitude: -76.6122, latency: 12 },
      { hop: 3, ip: "34.89.12.35", city: "Norfolk, VA", latitude: 36.8508, longitude: -76.2859, latency: 28 },
      { hop: 4, ip: "192.45.67.90", city: "Greensboro, NC", latitude: 36.0726, longitude: -79.7910, latency: 43 },
      { hop: 5, ip: "34.130.78.91", city: "Columbia, SC", latitude: 34.0007, longitude: -81.0348, latency: 60 },
    ],
  ],
  "G-CLOUD-US-WEST1": [
    [
      { hop: 1, ip: "192.168.2.1", city: "Los Angeles, CA", latitude: 34.0522, longitude: -118.2437, latency: 6 },
      { hop: 2, ip: "200.45.78.90", city: "San Francisco, CA", latitude: 37.7749, longitude: -122.4194, latency: 22 },
      { hop: 3, ip: "34.56.78.90", city: "The Dalles, OR", latitude: 45.5946, longitude: -121.1787, latency: 40 },
      { hop: 4, ip: "172.19.23.45", city: "Seattle, WA", latitude: 47.6062, longitude: -122.3321, latency: 55 },
      { hop: 5, ip: "34.145.67.89", city: "Las Vegas, NV", latitude: 36.1699, longitude: -115.1398, latency: 70 },
    ],
    [
      { hop: 1, ip: "192.168.2.2", city: "San Diego, CA", latitude: 32.7157, longitude: -117.1611, latency: 7 },
      { hop: 2, ip: "200.45.78.91", city: "Sacramento, CA", latitude: 38.5816, longitude: -121.4944, latency: 20 },
      { hop: 3, ip: "34.56.78.91", city: "Portland, OR", latitude: 45.5051, longitude: -122.6750, latency: 38 },
      { hop: 4, ip: "172.19.23.46", city: "Boise, ID", latitude: 43.6150, longitude: -116.2023, latency: 52 },
      { hop: 5, ip: "34.145.67.90", city: "Salt Lake City, UT", latitude: 40.7608, longitude: -111.8910, latency: 68 },
    ],
  ],
  "G-CLOUD-EUROPE-WEST4": [
    [
      { hop: 1, ip: "10.0.0.2", city: "Amsterdam, Netherlands", latitude: 52.3676, longitude: 4.9041, latency: 5 },
      { hop: 2, ip: "172.16.2.2", city: "Brussels, Belgium", latitude: 50.8503, longitude: 4.3517, latency: 15 },
      { hop: 3, ip: "34.78.90.12", city: "Eemshaven, Netherlands", latitude: 53.4386, longitude: 6.8335, latency: 30 },
      { hop: 4, ip: "192.67.89.12", city: "Paris, France", latitude: 48.8566, longitude: 2.3522, latency: 45 },
      { hop: 5, ip: "34.156.78.90", city: "London, UK", latitude: 51.5074, longitude: -0.1278, latency: 60 },
    ],
    [
      { hop: 1, ip: "10.0.0.3", city: "Rotterdam, Netherlands", latitude: 51.9244, longitude: 4.4777, latency: 6 },
      { hop: 2, ip: "172.16.2.3", city: "Antwerp, Belgium", latitude: 51.2213, longitude: 4.4051, latency: 18 },
      { hop: 3, ip: "34.78.90.13", city: "Hamburg, Germany", latitude: 53.5488, longitude: 9.9872, latency: 35 },
      { hop: 4, ip: "192.67.89.13", city: "Copenhagen, Denmark", latitude: 55.6761, longitude: 12.5683, latency: 50 },
      { hop: 5, ip: "34.156.78.91", city: "Stockholm, Sweden", latitude: 59.3293, longitude: 18.0686, latency: 65 },
    ],
  ],
};

interface TracerouteHop {
  hop: number;
  ip: string;
  city: string;
  latitude: number;
  longitude: number;
  latency: number;
}

const MapUpdater: React.FC<{ hops: TracerouteHop[] }> = ({ hops }) => {
  const map = useMap();
  useEffect(() => {
    if (hops.length > 0) {
      const bounds = hops.map((hop) => [hop.latitude, hop.longitude] as [number, number]);
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [hops, map]);
  return null;
};

const EndpointDetailPage = () => {
  const { endpointId } = useParams({ from: "/_layout/scraping-api/endpoints/$endpointId" }) as { endpointId: string };
  const [tracerouteData, setTracerouteData] = useState<TracerouteHop[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState<boolean>(false);
  const [refreshInterval, setRefreshInterval] = useState<number>(60000);
  const [dataSetIndex, setDataSetIndex] = useState<number>(0);
  const [showMarkers, setShowMarkers] = useState(true);
  const [showPolyline, setShowPolyline] = useState(true);
  const firstMarkerRef = useRef<LeafletMarker | null>(null);

  useEffect(() => {
    if (firstMarkerRef.current) {
      firstMarkerRef.current.openPopup();
    }
  }, [tracerouteData]);

  const fetchTracerouteData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const endpointUrl = endpointData[endpointId];
      if (!endpointUrl) throw new Error("Invalid endpoint ID");

      const datasets = staticTracerouteData[endpointId] || [];
      if (datasets.length === 0) {
        setTracerouteData([]);
        return;
      }

      const data = datasets[dataSetIndex];
      setTracerouteData(data);
      setDataSetIndex((prev) => (prev === 0 ? 1 : 0));
    } catch (err) {
      console.error("Traceroute fetch error:", err);
      setError(err instanceof Error ? err.message : "An unknown error occurred");
      setTracerouteData([]);
    } finally {
      setIsLoading(false);
    }
  };

  const copyTracerouteData = () => {
    const jsonData = JSON.stringify(tracerouteData, null, 2);
    navigator.clipboard.writeText(jsonData).then(() => {
      alert("Traceroute data copied to clipboard!");
    }).catch((err) => {
      console.error("Failed to copy data:", err);
      alert("Failed to copy data to clipboard.");
    });
  };

  useEffect(() => {
    fetchTracerouteData();
    let interval: NodeJS.Timeout;
    if (autoRefresh) {
      interval = setInterval(fetchTracerouteData, refreshInterval);
    }
    return () => clearInterval(interval);
  }, [endpointId, autoRefresh, refreshInterval]);

  const tabsConfig = [
    { title: "Overview", component: () => <Overview toolId={endpointId} /> },
    {
      title: "Settings",
      component: () => (
        <Box>
          <Text fontSize="lg" fontWeight="bold" mb={4}>Traceroute Settings</Text>
          <Flex direction="column" gap={4}>
            <Flex align="center">
              <Text mr={2}>Auto-Refresh:</Text>
              <Button
                size="sm"
                colorScheme={autoRefresh ? "green" : "gray"}
                onClick={() => setAutoRefresh(!autoRefresh)}
              >
                {autoRefresh ? "Enabled" : "Disabled"}
              </Button>
            </Flex>
            {autoRefresh && (
              <Flex align="center">
                <Text mr={2}>Refresh Interval (seconds):</Text>
                <Input
                  size="sm"
                  type="number"
                  value={refreshInterval / 1000}
                  onChange={(e) => setRefreshInterval(Math.max(30, Number(e.target.value)) * 1000)}
                  width="100px"
                />
              </Flex>
            )}
            <Flex align="center">
              <Text mr={2}>Show Markers:</Text>
              <Button
                size="sm"
                colorScheme={showMarkers ? "green" : "gray"}
                onClick={() => setShowMarkers(!showMarkers)}
              >
                {showMarkers ? "Enabled" : "Disabled"}
              </Button>
            </Flex>
            <Flex align="center">
              <Text mr={2}>Show Polyline:</Text>
              <Button
                size="sm"
                colorScheme={showPolyline ? "green" : "gray"}
                onClick={() => setShowPolyline(!showPolyline)}
              >
                {showPolyline ? "Enabled" : "Disabled"}
              </Button>
            </Flex>
          </Flex>
        </Box>
      ),
    },
    { title: "Usage", component: () => <EndpointUsage /> },
    {
      title: "Traceroute",
      component: () => (
        <Box p={4}>
          <Flex justify="space-between" align="center" mb={4}>
            <Text fontSize="lg" fontWeight="bold">
              Traceroute for {endpointId}
            </Text>
            <Flex gap={2}>
              <Tooltip label="Refresh traceroute data immediately">
                <Button
                  size="sm"
                  colorScheme="blue"
                  onClick={fetchTracerouteData}
                  isLoading={isLoading}
                >
                  Refresh Now
                </Button>
              </Tooltip>
              {tracerouteData.length > 0 && (
                <Tooltip label="Copy traceroute data as JSON">
                  <Button size="sm" colorScheme="gray" onClick={copyTracerouteData}>
                    Copy Data
                  </Button>
                </Tooltip>
              )}
            </Flex>
          </Flex>
          {isLoading ? (
            <Flex justify="center" align="center" h="200px">
              <Spinner size="xl" color="blue.500" />
            </Flex>
          ) : error ? (
            <Text color="red.500">{error}</Text>
          ) : tracerouteData.length > 0 ? (
            <>
              <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={6} mb={6}>
                <GridItem>
                  <Text fontSize="md" fontWeight="semibold" mb={2}>Map</Text>
                  <Box height="400px" borderRadius="md" overflow="hidden" shadow="md">
                    <MapContainer
                      center={[0, 0]}
                      zoom={3}
                      style={{ height: "100%", width: "100%" }}
                    >
                      <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      />
                      <MapUpdater hops={tracerouteData} />
                      {showMarkers &&
                        tracerouteData.map((hop, index) => (
                          <Marker
                            key={hop.hop}
                            position={[hop.latitude, hop.longitude]}
                            ref={index === 0 ? firstMarkerRef : null}
                          >
                            <Popup>
                              Hop {hop.hop}: {hop.city} ({hop.ip})
                              <br />
                              Latency: {hop.latency}ms
                            </Popup>
                          </Marker>
                        ))}
                      {showPolyline && (
                        <Polyline
                          positions={tracerouteData.map((hop) => [hop.latitude, hop.longitude])}
                          color="blue"
                          weight={2}
                        />
                      )}
                    </MapContainer>
                  </Box>
                </GridItem>
                <GridItem>
                  <Text fontSize="md" fontWeight="semibold" mb={2}>Details</Text>
                  <Card shadow="md" borderWidth="1px">
                    <CardBody>
                      <Stat>
                        <StatLabel>Total Hops</StatLabel>
                        <StatNumber>{tracerouteData.length}</StatNumber>
                      </Stat>
                      <Stat mt={4}>
                        <StatLabel>Average Latency</StatLabel>
                        <StatNumber>
                          {Math.round(
                            tracerouteData.reduce((sum, hop) => sum + hop.latency, 0) / tracerouteData.length
                          )}ms
                        </StatNumber>
                      </Stat>
                      <Stat mt={4}>
                        <StatLabel>Endpoint URL</StatLabel>
                        <StatHelpText wordBreak="break-all">{endpointData[endpointId]}</StatHelpText>
                      </Stat>
                    </CardBody>
                  </Card>
                </GridItem>
              </Grid>
              <Text fontSize="md" fontWeight="semibold" mb={2}>Trace Locations</Text>
              <Table variant="simple" size="sm" shadow="md" borderWidth="1px" borderRadius="md">
                <Thead>
                  <Tr>
                    <Th>Hop</Th>
                    <Th>City</Th>
                    <Th>IP Address</Th>
                    <Th>Latitude</Th>
                    <Th>Longitude</Th>
                    <Th>Latency (ms)</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {tracerouteData.map((hop) => (
                    <Tr key={hop.hop}>
                      <Td>{hop.hop}</Td>
                      <Td>{hop.city}</Td>
                      <Td>{hop.ip}</Td>
                      <Td>{hop.latitude}</Td>
                      <Td>{hop.longitude}</Td>
                      <Td>{hop.latency}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </>
          ) : (
            <Text color="gray.500">No traceroute data available for this endpoint.</Text>
          )}
          <Text mt={4} fontSize="sm" color="gray.500">
            Traceroute data alternates between two static datasets on refresh to simulate changing routes. Latency represents the simulated delay to each hop.
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