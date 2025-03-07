import React, { useState, useEffect, useMemo } from "react";
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
import { LoadScript, GoogleMap, Marker, Polyline } from "@react-google-maps/api";

// Interface for traceroute hop data
interface TracerouteHop {
  hop: number;
  ip: string;
  city: string;
  latitude: number;
  longitude: number;
  latency: number;
}

const endpointData: Record<string, string> = {
  "G-CLOUD-SOUTHAMERICA-WEST1": "https://southamerica-west1-image-scraper-451516.cloudfunctions.net/main",
  "G-CLOUD-US-CENTRAL1": "https://us-central1-image-scraper-451516.cloudfunctions.net/main",
  "G-CLOUD-US-EAST1": "https://us-east1-image-scraper-451516.cloudfunctions.net/main",
  "G-CLOUD-US-EAST4": "https://us-east4-image-scraper-451516.cloudfunctions.net/main",
  "G-CLOUD-US-WEST1": "https://us-west1-image-scraper-451516.cloudfunctions.net/main",
  "G-CLOUD-EUROPE-WEST4": "https://europe-west4-image-scraper-451516.cloudfunctions.net/main",
};

// Static traceroute data (unchanged from your input)
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
      { hop: 6, ip: "98.108.2.52", city: "Omaha, NE", latitude: 40.2565, longitude: -80.9345, latency: 60 },
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

// MapUpdater component
const MapUpdater: React.FC<{ hops: TracerouteHop[]; map: google.maps.Map | null }> = ({ hops, map }) => {
  useEffect(() => {
    if (map && hops.length > 0) {
      const bounds = new google.maps.LatLngBounds();
      hops.forEach((hop) => bounds.extend({ lat: hop.latitude, lng: hop.longitude }));
      map.fitBounds(bounds, 50);
      console.log("Map bounds set with hops:", hops);
    }
  }, [hops, map]);
  return null;
};

// LoadScript wrapper to ensure single load
const LoadScriptOnce: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <LoadScript
      googleMapsApiKey="AIzaSyCGkpSEixfDAVnE3UWw-8v9pd6L3OFXvM0" // Replace if this key doesn’t work
      onLoad={() => {
        if (!loaded) {
          console.log("Google Maps API loaded successfully");
          setLoaded(true);
        } else {
          console.log("Google Maps API already loaded");
        }
      }}
      onError={(e) => {
        console.error("Google Maps API failed to load:", e);
      }}
    >
      {loaded && children}
    </LoadScript>
  );
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
  const [map, setMap] = useState<google.maps.Map | null>(null);

  const fetchTracerouteData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const endpointUrl = endpointData[endpointId];
      if (!endpointUrl) throw new Error("Invalid endpoint ID");

      const datasets = staticTracerouteData[endpointId] || [];
      if (datasets.length === 0) {
        setTracerouteData([]);
        console.log("No datasets found for endpoint:", endpointId);
        return;
      }

      const data = datasets[dataSetIndex];
      console.log("Fetching traceroute data:", data);
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

  useEffect(() => {
    fetchTracerouteData();
    let interval: NodeJS.Timeout;
    if (autoRefresh) {
      interval = setInterval(fetchTracerouteData, refreshInterval);
    }
    return () => clearInterval(interval);
  }, [endpointId, autoRefresh, refreshInterval]);

  // Memoize the polyline path
  const polylinePath = useMemo(() => {
    return tracerouteData.map((hop) => ({ lat: hop.latitude, lng: hop.longitude }));
  }, [tracerouteData]);

  const tabsConfig = [
    { title: "Overview", component: () => <Overview toolId={endpointId} /> },
    { title: "Usage", component: () => <EndpointUsage /> },
    {
      title: "Traceroute",
      component: () => (
        <Box p={4}>
          <Flex justify="space-between" align="center" mb={4} wrap="wrap" gap={2}>
            <Text fontSize="lg" fontWeight="bold">Traceroute for {endpointId}</Text>
            <Flex align="center" gap={2} wrap="wrap">
              {/* Nested Flex container for Auto Refresh and Interval */}
              <Flex direction="row-reverse" align="center" gap={2}>
                <Button
                  size="sm"
                  colorScheme={autoRefresh ? "green" : "gray"}
                  onClick={() => setAutoRefresh(!autoRefresh)}
                >
                  {autoRefresh ? "Auto Refresh: On" : "Auto Refresh: Off"}
                </Button>
                {autoRefresh && (
                  <Flex align="center" gap={1}>
                    <Input
                      size="sm"
                      type="number"
                      value={refreshInterval / 1000}
                      onChange={(e) => setRefreshInterval(Math.max(30, Number(e.target.value)) * 1000)}
                      width="60px"
                    />
                    <Button size="sm" colorScheme="gray" isDisabled>
                      Interval (s):
                    </Button>
                  </Flex>
                )}
              </Flex>
              {/* Other buttons */}
              <Tooltip label="Refresh traceroute data immediately">
                <Button size="sm" colorScheme="blue" onClick={fetchTracerouteData} isLoading={isLoading}>
                  Refresh Now
                </Button>
              </Tooltip>
              <Button
                size="sm"
                colorScheme={showMarkers ? "green" : "gray"}
                onClick={() => setShowMarkers(!showMarkers)}
              >
                {showMarkers ? "Map Markers: On" : "Map Markers: Off"}
              </Button>
              <Button
                size="sm"
                colorScheme={showPolyline ? "green" : "gray"}
                onClick={() => setShowPolyline(!showPolyline)}
              >
                {showPolyline ? "Map Polyline: On" : "Map Polyline: Off"}
              </Button>
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
                  <Text fontSize="md" fontWeight="semibold" mb={2}>Traceroute Map</Text>
                  <Box height="400px" borderRadius="md" overflow="hidden" shadow="md">
                    <GoogleMap
                      mapContainerStyle={{ height: "100%", width: "100%" }}
                      zoom={3}
                      center={
                        tracerouteData.length > 0
                          ? { lat: tracerouteData[0].latitude, lng: tracerouteData[0].longitude }
                          : { lat: 0, lng: 0 }
                      }
                      onLoad={(mapInstance) => {
                        setMap(mapInstance);
                        console.log("Map instance loaded");
                      }}
                      onUnmount={() => setMap(null)}
                    >
                      <MapUpdater hops={tracerouteData} map={map} />
                      {showMarkers &&
                        tracerouteData.map((hop) => (
                          <Marker
                            key={hop.hop}
                            position={{ lat: hop.latitude, lng: hop.longitude }}
                            title={`Hop ${hop.hop}: ${hop.city} (${hop.ip}) - ${hop.latency}ms`}
                          />
                        ))}
                      {showPolyline && polylinePath.length > 1 && (
                        <Polyline
                          path={polylinePath}
                          options={{ strokeColor: "#0000FF", strokeWeight: 2, strokeOpacity: 1 }}
                        />
                      )}
                    </GoogleMap>
                    {!map && !error && (
                      <Flex justify="center" align="center" h="100%">
                        <Text>Loading Google Maps...</Text>
                      </Flex>
                    )}
                  </Box>
                </GridItem>
                <GridItem>
                  <Text fontSize="md" fontWeight="semibold" mb={2}>Traceroute Details</Text>
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
              <Text fontSize="md" fontWeight="semibold" mb={2}>Traceroute Locations</Text>
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
        </Box>
      ),
    },
  ];

  return (
    <LoadScriptOnce>
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
    </LoadScriptOnce>
  );
};

export const Route = createFileRoute("/_layout/scraping-api/endpoints/$endpointId")({
  component: EndpointDetailPage,
});

export default EndpointDetailPage;