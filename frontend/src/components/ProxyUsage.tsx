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
  List,
  ListItem,
  ListIcon,
  Flex,
  Progress,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td
} from "@chakra-ui/react";
import { FiCheckCircle, FiBarChart2, FiAlertTriangle, FiTrendingUp } from "react-icons/fi";

const ProxyUsage = () => (
  <Box maxW="100%" mx="auto" px={{ base: 6, md: 12 }} py={12}>
    <VStack spacing={8} align="stretch">
      <Heading size="2xl" textAlign="center">Proxy Usage Dashboard</Heading>
      <Text fontSize="lg" textAlign="center" color="gray.600">
        Monitor your proxy usage, analyze traffic trends, and optimize performance.
      </Text>
      <Divider />
      
      {/* Overview Statistics */}
      <Heading size="lg">Usage Statistics</Heading>
      <StatGroup>
        <Stat>
          <StatLabel>Total Requests</StatLabel>
          <StatNumber>15,234</StatNumber>
          <StatHelpText>Last 24 hours</StatHelpText>
        </Stat>
        <Stat>
          <StatLabel>Data Transferred</StatLabel>
          <StatNumber>1.2GB</StatNumber>
          <StatHelpText>Last 24 hours</StatHelpText>
        </Stat>
        <Stat>
          <StatLabel>Avg. Response Time</StatLabel>
          <StatNumber>120ms</StatNumber>
          <StatHelpText>Last 24 hours</StatHelpText>
        </Stat>
        <Stat>
          <StatLabel>Peak Active Connections</StatLabel>
          <StatNumber>18</StatNumber>
          <StatHelpText>Highest in last 24 hours</StatHelpText>
        </Stat>
      </StatGroup>
      
      <Divider />
      
      {/* Connection Details */}
      <Heading size="lg">Connection Insights</Heading>
      <List spacing={4}>
        <ListItem>
          <ListIcon as={FiCheckCircle} color="green.500" />
          Active Connections: 12
        </ListItem>
        <ListItem>
          <ListIcon as={FiCheckCircle} color="green.500" />
          Successful Requests: 14,900
        </ListItem>
        <ListItem>
          <ListIcon as={FiAlertTriangle} color="yellow.500" />
          Failed Requests: 45
        </ListItem>
        <ListItem>
          <ListIcon as={FiCheckCircle} color="green.500" />
          Average Session Duration: 8m 24s
        </ListItem>
      </List>
      
      <Divider />
      
      {/* Bandwidth Usage */}
      <Heading size="lg">Bandwidth Usage</Heading>
      <Text>Current Usage: 1.2GB / 10GB Monthly Limit</Text>
      <Progress value={12} size="lg" colorScheme="blue" />
      
      <Divider />
      
      {/* Top Proxy Requests */}
      <Heading size="lg">Top Proxy Requests</Heading>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Endpoint</Th>
            <Th>Requests</Th>
            <Th>Status</Th>
          </Tr>
        </Thead>
        <Tbody>
          <Tr>
            <Td>/api/data</Td>
            <Td>5,234</Td>
            <Td><ListIcon as={FiCheckCircle} color="green.500" /> Success</Td>
          </Tr>
          <Tr>
            <Td>/api/auth</Td>
            <Td>3,120</Td>
            <Td><ListIcon as={FiAlertTriangle} color="yellow.500" /> Warning</Td>
          </Tr>
          <Tr>
            <Td>/api/stats</Td>
            <Td>2,560</Td>
            <Td><ListIcon as={FiCheckCircle} color="green.500" /> Success</Td>
          </Tr>
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
      
      <Alert status="error" borderRadius="md" mt={4}>
        <AlertIcon />
        <Text>Proxy downtime detected in the last 6 hours. Consider switching regions.</Text>
      </Alert>
    </VStack>
  </Box>
);

export default ProxyUsage;
