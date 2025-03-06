import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Heading,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  useColorModeValue,
} from "@chakra-ui/react";

const ProxyStatus = () => {
  const bgColor = useColorModeValue("gray.50", "gray.800");
  const cardBg = useColorModeValue("white", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  // Sample initial data (replace with API fetch)
  const initialData = [
    { id: 1, url: "https://southamerica-west1-image-scraper-451516.cloudfunctions.net/main", region: "G-CLOUD-SOUTHAMERICA-WEST1", publicIp: "34.34.252.50", status: "Google is reachable", health: "Healthy", lastChecked: "9:15:56 PM", lastPublicIp: "34.34.252.48" },
    { id: 2, url: "https://us-central1-image-scraper-451516.cloudfunctions.net/main", region: "G-CLOUD-US-CENTRAL1", publicIp: "34.96.44.247", status: "Google is reachable", health: "Healthy", lastChecked: "9:15:56 PM", lastPublicIp: "34.96.44.245" },
    { id: 3, url: "https://us-east1-image-scraper-451516.cloudfunctions.net/main", region: "G-CLOUD-US-EAST1", publicIp: "34.96.49.218", status: "Google is reachable", health: "Healthy", lastChecked: "9:15:56 PM", lastPublicIp: "34.96.49.216" },
    { id: 4, url: "https://us-east4-image-scraper-451516.cloudfunctions.net/main", region: "G-CLOUD-US-EAST4", publicIp: "34.34.234.250", status: "Google is reachable", health: "Healthy", lastChecked: "9:15:56 PM", lastPublicIp: "34.34.234.248" },
    { id: 5, url: "https://us-west1-image-scraper-451516.cloudfunctions.net/main", region: "G-CLOUD-US-WEST1", publicIp: "34.96.52.74", status: "Google is reachable", health: "Healthy", lastChecked: "9:15:56 PM", lastPublicIp: "34.96.52.72" },
  ];

  // State to store current and previous data
  const [proxyData, setProxyData] = useState(initialData);

  // Simulate fetching new data and updating lastPublicIp (replace with real API call)
  useEffect(() => {
    const fetchData = async () => {
      // Mock API response (replace with actual fetch)
      const newData = initialData.map(item => ({
        ...item,
        publicIp: item.publicIp, // New IP from API
        lastPublicIp: item.publicIp, // Store current IP as last IP before updating
      }));
      setProxyData(newData);
    };

    // Fetch initially and optionally set an interval
    fetchData();
    // const interval = setInterval(fetchData, 60000); // Uncomment to refresh every minute
    // return () => clearInterval(interval);
  }, []);

  return (
    <Box maxW="100%" mx="auto" px={{ base: 4, md: 8 }} py={10} bg={bgColor}>
      <Grid
        templateColumns={{ base: "1fr", md: "repeat(1, 1fr)" }} // Single column for table
        gap={6}
      >
        <Box
          p={4}
          bg={cardBg}
          borderRadius="lg"
          boxShadow="md"
          border="1px"
          borderColor={borderColor}
        >
          <Table variant="simple" size="sm">
            <Thead>
              <Tr>
                <Th>#</Th>
                <Th>URL</Th>
                <Th>Region</Th>
                <Th>Public IP</Th>
                <Th>Last Public IP</Th>
                <Th>Status</Th>
                <Th>Health</Th>
                <Th>Last Checked</Th>
              </Tr>
            </Thead>
            <Tbody>
              {proxyData.map((item) => (
                <Tr key={item.id}>
                  <Td>{item.id}</Td>
                  <Td>
                    <Text isTruncated maxW="200px" title={item.url}>{item.url}</Text>
                  </Td>
                  <Td>{item.region}</Td>
                  <Td>{item.publicIp}</Td>
                  <Td>{item.lastPublicIp}</Td>
                  <Td>{item.status}</Td>
                  <Td>
                    <Badge colorScheme={item.health === "Healthy" ? "green" : "red"}>
                      {item.health}
                    </Badge>
                  </Td>
                  <Td>{item.lastChecked}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      </Grid>
    </Box>
  );
};

export default ProxyStatus;