import React, { useEffect, useState } from 'react';
import {
  Box,
  VStack,
  Heading,
  Text,
  Divider,
  Alert,
  AlertIcon,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatGroup,
  ListIcon,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Link
} from "@chakra-ui/react";
import { FiCheckCircle, FiAlertTriangle, FiExternalLink } from "react-icons/fi";

const ProxyUsage = () => {
  const [usageData, setUsageData] = useState(null);
  
  useEffect(() => {
    fetch("https://api.thedataproxy.com/api/v1/usage")
      .then(response => response.json())
      .then(data => setUsageData(data))
      .catch(error => console.error("Error fetching proxy usage data:", error));
  }, []);

  return (
    <Box maxW="100%" mx="auto" px={{ base: 6, md: 12 }} py={12}>
      <VStack spacing={8} align="stretch">
        <Heading size="2xl" textAlign="center">Proxy Usage Dashboard</Heading>
        <Text fontSize="lg" textAlign="center" color="gray.600">
          Monitor your proxy usage, analyze traffic trends, and optimize performance.
        </Text>
        <Divider />
        
        {/* Overview Statistics */}
        <Heading size="lg">Usage Statistics</Heading>
        {usageData ? (
          <StatGroup>
            <Stat>
              <StatLabel>Total Requests</StatLabel>
              <StatNumber>{usageData.total_requests}</StatNumber>
              <StatHelpText>Last 24 hours</StatHelpText>
            </Stat>
            <Stat>
              <StatLabel>Data Transferred</StatLabel>
              <StatNumber>{usageData.data_transferred}GB</StatNumber>
              <StatHelpText>Last 24 hours</StatHelpText>
            </Stat>
            <Stat>
              <StatLabel>Avg. Response Time</StatLabel>
              <StatNumber>{usageData.avg_response_time}ms</StatNumber>
              <StatHelpText>Last 24 hours</StatHelpText>
            </Stat>
          </StatGroup>
        ) : (
          <Text>Loading statistics...</Text>
        )}
        
        <Divider />
        
        {/* Top Proxy Requests */}
        <Heading size="lg">Top Proxy Requests</Heading>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Endpoint</Th>
              <Th>Requests</Th>
              <Th>Status</Th>
              <Th>Link</Th>
            </Tr>
          </Thead>
          <Tbody>
            {usageData && usageData.top_requests ? (
              usageData.top_requests.map((request, index) => (
                <Tr key={index}>
                  <Td>{request.endpoint}</Td>
                  <Td>{request.requests}</Td>
                  <Td>
                    <ListIcon as={request.status === "success" ? FiCheckCircle : FiAlertTriangle} color={request.status === "success" ? "green.500" : "yellow.500"} />
                    {request.status}
                  </Td>
                  <Td>
                    <Link href={`https://api.thedataproxy.com${request.endpoint}`} isExternal>
                      <FiExternalLink />
                    </Link>
                  </Td>
                </Tr>
              ))
            ) : (
              <Tr>
                <Td colSpan={4}>Loading top requests...</Td>
              </Tr>
            )}
          </Tbody>
        </Table>
        
        <Divider />
        
        {/* Alerts and Notifications */}
        <Heading size="lg">Alerts & Notifications</Heading>
        <Alert status="success" borderRadius="md">
          <AlertIcon />
          <Text>All proxy usage details are verified and up-to-date.</Text>
        </Alert>
        <Alert status="warning" borderRadius="md" mt={4}>
          <AlertIcon />
          <Text>Some failed requests detected. Check your authentication settings.</Text>
        </Alert>
      </VStack>
    </Box>
  );
};

export default ProxyUsage;
