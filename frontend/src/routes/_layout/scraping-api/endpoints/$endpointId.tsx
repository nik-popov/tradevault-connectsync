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