import {
  Container,
  Box,
  Text,
  Button,
  VStack,
  Divider,
  Flex,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TabPanel,
} from "@chakra-ui/react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, useParams } from "@tanstack/react-router";

import PromoContent from "../../../components/PromoSERP";
import ProxySettings from "../../../components/EndpointSettings";
import ProxyUsage from "../../../components/ProxyUsage";
import ProxyStarted from "../../../components/ProxyStarted";

// Define types for scraping tools
type ScrapingTool = "google-serp" | "bing-serp" | "custom-scraper";

// Subscription settings type
interface SubscriptionSettings {
  [key: string]: {
    hasSubscription: boolean;
    isTrial: boolean;
    isDeactivated: boolean;
  };
}

// Top-Ups Component
const TopUps = (): JSX.Element => {
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
const Connections = (): JSX.Element => {
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
const Logs = (): JSX.Element => {
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

// Key Management Component
const KeyManagement = (): JSX.Element => {
  interface KeyItem {
    id: number;
    value: string;
    isHidden: boolean;
    copied: boolean;
  }

  const [keys, setKeys] = useState<KeyItem[]>([]);

  const generateSecret = (length: number = 16): string => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let secret = "";
    for (let i = 0; i < length; i++) {
      secret += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return secret;
  };

  const addKey = (): void => {
    const nextId = keys.length ? Math.max(...keys.map((k) => k.id)) + 1 : 1;
    const newKey: KeyItem = {
      id: nextId,
      value: generateSecret(),
      isHidden: false,
      copied: false,
    };
    setKeys([...keys, newKey]);
  };

  const deleteKey = (id: number): void => {
    setKeys(keys.filter((key) => key.id !== id));
  };

  const toggleVisibility = (id: number): void => {
    setKeys(keys.map((key) => (key.id === id ? { ...key, isHidden: !key.isHidden } : key)));
  };

  const copyKey = (id: number): void => {
    const keyToCopy = keys.find((key) => key.id === id);
    if (keyToCopy) {
      navigator.clipboard
        .writeText(keyToCopy.value)
        .then(() => {
          setKeys(keys.map((key) => (key.id === id ? { ...key, copied: true } : key)));
          setTimeout(() => {
            setKeys((currentKeys) =>
              currentKeys.map((key) => (key.id === id ? { ...key, copied: false } : key))
            );
          }, 2000);
        })
        .catch((err) => console.error("Failed to copy key", err));
    }
  };

  return (
    <Box p={4} borderWidth="1px" borderRadius="md">
      <Text fontSize="xl" mb={4}>Key Management</Text>
      <VStack align="stretch" spacing={3}>
        {keys.length > 0 ? (
          keys.map((key) => (
            <Flex
              key={key.id}
              align="center"
              justify="space-between"
              p={2}
              borderWidth="1px"
              borderRadius="md"
            >
              <Text fontFamily="monospace" flex="1">
                {key.isHidden ? "********" : key.value}
              </Text>
              <Button size="xs" ml={2} onClick={() => toggleVisibility(key.id)}>
                {key.isHidden ? "Show" : "Hide"}
              </Button>
              <Button size="xs" ml={2} onClick={() => copyKey(key.id)}>
                {key.copied ? "Copied" : "Copy"}
              </Button>
              <Button size="xs" ml={2} colorScheme="red" onClick={() => deleteKey(key.id)}>
                Delete
              </Button>
            </Flex>
          ))
        ) : (
          <Text>No keys available.</Text>
        )}
        <Button mt={2} colorScheme="blue" onClick={addKey}>
          Add Key
        </Button>
      </VStack>
    </Box>
  );
};

// Main Dynamic Scraping Tool Manager Component
const ScrapingToolManager = (): JSX.Element => {
  const { toolId } = useParams<{ toolId: ScrapingTool }>(); // Dynamic tool ID from route

  const STORAGE_KEY = "subscriptionSettings";
  const PRODUCT = toolId || "google-serp"; // Fallback to google-serp if no toolId

  // Fetch subscription settings
  const { data: subscriptionSettings } = useQuery<SubscriptionSettings>({
    queryKey: ["subscriptionSettings", PRODUCT],
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

  // Dynamic tab configuration based on tool
  const tabsConfig = [
    { title: "Get Started", component: <ProxyStarted /> },
    { title: "Endpoints", component: <ProxySettings /> },
    { title: "Usage", component: <ProxyUsage /> },
    { title: "Top-Ups", component: <TopUps /> },
    { title: "Connections", component: <Connections /> },
    { title: "Logs", component: <Logs /> },
    { title: "Key Management", component: <KeyManagement /> },
  ];

  // Dynamic title based on tool
  const toolDisplayName = PRODUCT.split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return (
    <Container maxW="full">
      <Flex align="center" justify="space-between" py={6} flexWrap="wrap" gap={4}>
        <Box textAlign="left" flex="1">
          <Text fontSize="xl" fontWeight="bold">{toolDisplayName} API</Text>
          <Text fontSize="sm">Manage your {toolDisplayName.toLowerCase()} settings and subscriptions.</Text>
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
                    {restrictedTabs.includes(tab.title) ? (
                      <Text>Feature locked during trial.</Text>
                    ) : (
                      tab.component
                    )}
                  </TabPanel>
                ))}
              </TabPanels>
            </Tabs>
          </Box>
        </Flex>
      )}
    </Container>
  );
};

// Dynamic Route Creation
export const Route = createFileRoute("/_layout/scraping-api/:toolId")({
  component: ScrapingToolManager,
});

export default ScrapingToolManager;