import {
  Container,
  Box,
  Text,
  Button,
  VStack,
  HStack,
  Divider,
  Flex,
  Tabs,
  Tr,
  Tbody,
  Th,
  Td,
  TabList,
  TabPanels,
  Tab,
  Table,
  Thead,
  
  TabPanel,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";

import { useQueryClient, useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import PromoContent from "../../../components/PromoContent";
import ProxyStarted from "../../../components/GetStarted";
import ProxySettings from "../../../components/ProxySettings";
import ProxyUsage from "../../../components/ProxyUsage";
/* 
  Expanded Inline Proxy Components 
  Replace dummy data and logic with your actual API calls or state management as needed.
*/

// Top-Ups Component
const TopUps = () => {
  const dummyTopUps = [
    { id: 1, amount: "$10", date: "2025-02-10" },
    { id: 2, amount: "$20", date: "2025-02-11" },
  ];

  return (
    <Box p={4} borderWidth="1px" borderRadius="md">
      <Text fontSize="xl" mb={4}>Top-Ups</Text>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>ID</Th>
            <Th>Amount</Th>
            <Th>Date</Th>
          </Tr>
        </Thead>
        <Tbody>
          {dummyTopUps.map((item) => (
            <Tr key={item.id}>
              <Td>{item.id}</Td>
              <Td>{item.amount}</Td>
              <Td>{item.date}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
      <Button mt={4} colorScheme="blue">Add Top-Up</Button>
    </Box>
  );
};

// Connections Component
const Connections = () => {
  const dummyConnections = [
    { id: 1, ip: "192.168.1.1", status: "Active", last_used: "2025-02-11" },
    { id: 2, ip: "192.168.1.2", status: "Inactive", last_used: "2025-02-10" },
  ];

  return (
    <Box p={4} borderWidth="1px" borderRadius="md">
      <Text fontSize="xl" mb={4}>Connections</Text>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>IP</Th>
            <Th>Status</Th>
            <Th>Last Used</Th>
          </Tr>
        </Thead>
        <Tbody>
          {dummyConnections.map((conn) => (
            <Tr key={conn.id}>
              <Td>{conn.ip}</Td>
              <Td>{conn.status}</Td>
              <Td>{conn.last_used}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

// Logs Component
const Logs = () => {
  const dummyLogs = [
    { id: 1, timestamp: "2025-02-11 10:00", message: "Connection established" },
    { id: 2, timestamp: "2025-02-11 10:05", message: "Connection lost" },
  ];

  return (
    <Box p={4} borderWidth="1px" borderRadius="md">
      <Text fontSize="xl" mb={4}>Logs</Text>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Timestamp</Th>
            <Th>Message</Th>
          </Tr>
        </Thead>
        <Tbody>
          {dummyLogs.map((log) => (
            <Tr key={log.id}>
              <Td>{log.timestamp}</Td>
              <Td>{log.message}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

const STORAGE_KEY = "subscriptionSettings";
const PRODUCT = "proxy"; // Define product-specific subscription management

function Pricing() {
  const queryClient = useQueryClient();

  // Fetch subscription settings
  const { data: subscriptionSettings } = useQuery({
    queryKey: ["subscriptionSettings"],
    queryFn: () => {
      const storedSettings = localStorage.getItem(STORAGE_KEY);
      return storedSettings ? JSON.parse(storedSettings) : {};
    },
    staleTime: Infinity,
  });

  const settings = subscriptionSettings?.[PRODUCT] || {
    hasSubscription: false,
    isTrial: false,
    isDeactivated: false,
  };

  const { hasSubscription, isTrial, isDeactivated } = settings;
  const isLocked = !hasSubscription && !isTrial;
  const restrictedTabs = isTrial ? ["Key Management", "Logs", "Top-Ups", "Connections"] : [];

  const tabsConfig = [
    { title: "Get Started", component: <ProxyStarted /> },
    { title: "Endpoints", component: <ProxySettings /> },
    { title: "Usage", component: <ProxyUsage /> },
    { title: "Top-Ups", component: <TopUps /> },
    { title: "Connections", component: <Connections /> },
    { title: "Logs", component: <Logs /> },
  ];

  return (
    <Container maxW="full">
      <Flex align="center" justify="space-between" py={6} flexWrap="wrap" gap={4}>
        <Box textAlign="left" flex="1">
          <Text fontSize="xl" fontWeight="bold">Pricing Breakdown</Text>
          <Text fontSize="sm">Understand your proxy billing and subscriptions.</Text>
        </Box>
      </Flex>
      <Divider my={4} />
      {isLocked ? (
        <PromoContent />
      ) : isDeactivated ? (
        <Box mt={6}>
          <Text>Your subscription has expired. Please renew to access all features.</Text>
        </Box>
      ) : (
        <Flex mt={6} gap={6} justify="space-between">
          <Box flex="1">
        
            <Tabs variant="enclosed">
              <TabList>
                {tabsConfig.map((tab, index) => (
                  <Tab key={index} isDisabled={restrictedTabs.includes(tab.title)}>
                    {tab.title}
                  </Tab>
                ))}
              </TabList>
              <TabPanels>
                {tabsConfig.map((tab, index) => (
                  <TabPanel key={index}>
                    {restrictedTabs.includes(tab.title) ? <Text>Feature locked during trial.</Text> : tab.component}
                  </TabPanel>
                ))}
              </TabPanels>
            </Tabs>
          </Box>
        </Flex>
      )}
    </Container>
  );
}

export const Route = createFileRoute("/_layout/proxies/pricing")({
  component: Pricing,
});

export default Pricing;
