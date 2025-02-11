import React from 'react';
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
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Link,
  Spinner
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { FiCheckCircle, FiAlertTriangle, FiExternalLink } from "react-icons/fi";

const fetchUsageData = async () => {
  const response = await fetch(`${process.env.REACT_APP_PROXY_API_URL}/api/v1/usage`);
  if (!response.ok) {
    throw new Error("Failed to fetch proxy usage data");
  }
  return response.json();
};

const ProxyUsage = () => {
  const { data: usageData, error, isLoading } = useQuery({
    queryKey: ["proxyUsage"],
    queryFn: fetchUsageData,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });

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
        {isLoading ? (
          <Spinner size="xl" />
        ) : error ? (
          <Alert status="error">
            <AlertIcon />
            Error loading proxy usage data.
          </Alert>
        ) : (
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
        )}

        <Divider />

        {/* Top Proxy Requests */}
        <Heading size="lg">Top Proxy Requests</Heading>
        {isLoading ? (
          <Spinner size="lg" />
        ) : error ? (
          <Alert status="error">
            <AlertIcon />
            Failed to load top requests.
          </Alert>
        ) : (
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
              {usageData.top_requests.map((request, index) => (
                <Tr key={index}>
                  <Td>{request.endpoint}</Td>
                  <Td>{request.requests}</Td>
                  <Td>
                    <FiCheckCircle color={request.status === "success" ? "green.500" : "yellow.500"} />
                    {request.status}
                  </Td>
                  <Td>
                    <Link href={`${process.env.REACT_APP_PROXY_API_URL}${request.endpoint}`} isExternal>
                      <FiExternalLink />
                    </Link>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        )}

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
