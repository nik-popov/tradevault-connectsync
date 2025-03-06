import React from 'react';
import { Box, Text, Table, Thead, Tbody, Tr, Th, Td, Spinner, Alert, AlertIcon } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";

const IPTraceRoute = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['ipTraceRoute'],
    queryFn: async () => {
      const response = await fetch('https://api.ipify.org?format=json');
      const clientIp = (await response.json()).ip;
      return ipData.map(ip => ({
        ...ip,
        hops: [
          { hop: 1, ip: clientIp, latency: "10ms", city: "Your Location" },
          { hop: 2, ip: "192.168.1.1", latency: "20ms", city: "Local Router" },
          { hop: 3, ip: ip.publicIp, latency: "50ms", city: ip.city },
        ],
      }));
    },
    staleTime: 5 * 60 * 1000,
  });

  if (isLoading) return <Spinner />;
  if (error) return <Alert status="error"><AlertIcon />Error: {error.message}</Alert>;

  return (
    <Box>
      <Text fontSize="lg" fontWeight="bold" mb={4}>IP Path Tracer</Text>
      {data.map((trace, index) => (
        <Box key={index} mb={6}>
          <Text fontWeight="semibold">Destination: {trace.publicIp} ({trace.city})</Text>
          <Table variant="simple" size="sm" mt={2}>
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
        </Box>
      ))}
    </Box>
  );
};

export default IPTraceRoute;