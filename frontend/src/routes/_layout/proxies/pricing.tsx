import React, { useState } from "react";
import {
  Box,
  Container,
  Text,
  Button,
  VStack,
  HStack,
  Flex,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Badge,
  Heading,
  List,
  ListItem,
  ListIcon,
  Icon,
  Badge,
  Alert,
  AlertIcon,
  useColorModeValue,
} from "@chakra-ui/react";
import { FaNetworkWired, FaCloud, FaMobileAlt, FaDatabase, FaDollarSign } from "react-icons/fa";
import { FiCheckCircle } from "react-icons/fi";

const proxyPricing = {
  Residential: [
    { tier: "Explorer", price: "$5/month", features: ["Basic dataset access", "1,000 API requests/month", "Standard support"], badge: "Best Value" },
    { tier: "Archiver", price: "$100/month", features: ["Extended dataset history", "10,000 API requests/month", "Priority support"], badge: "Most Popular" },
    { tier: "Researcher", price: "$500/month", features: ["High download limits", "100,000 API requests/month", "Advanced analytics"] },
    { tier: "Enterprise", price: "Custom", features: ["Unlimited API requests", "Dedicated account manager", "Custom integrations"] },
  ],
};

const PricingPage = () => {
  const [selectedProduct, setSelectedProduct] = useState("Residential");
  const tabBg = useColorModeValue("gray.700", "gray.700");
  const tabHoverBg = useColorModeValue("gray.600", "gray.600");
  const textColor = "white";

  return (
    <Container maxW="full" py={10} bg="gray.800" px={6}>
      <Alert status="info" borderRadius="md" bg="gray.700" color="gray.300" mb={6}>
        <AlertIcon color="blue.500" />
        <Text fontSize="sm">All plans include secure, high-speed API access with real-time data retrieval.</Text>
      </Alert>

      <Text fontSize="lg" fontWeight="bold" color={textColor} mb={4}>Dataset Subscription Plans</Text>
      <Flex>
        <Box w={{ base: "full", md: "250px" }} bg={tabBg} p={4} borderRadius="md">
          <Tabs variant="unstyled" onChange={(index) => setSelectedProduct(Object.keys(proxyPricing)[index])}>
            <TabList flexDirection="column" alignItems="flex-start" gap={2}>
              {Object.keys(proxyPricing).map((product) => (
                <Tab key={product} bg={tabBg} color={textColor} px={4} py={2} borderRadius="md" fontSize="sm" fontWeight="bold" _hover={{ bg: tabHoverBg }}>
                  <HStack spacing={2}>
                    <Icon as={FaDatabase} boxSize={4} /> <Text>{product} Datasets</Text>
                  </HStack>
                </Tab>
              ))}
            </TabList>
          </Tabs>
        </Box>
        <Box flex="1" pl={6}>
          <Tabs isLazy>
            <TabPanels>
              {Object.keys(proxyPricing).map((product) => (
                <TabPanel key={product}>
                  <Flex wrap="wrap" gap={6} justifyContent="center" mt={6}>
                    {proxyPricing[product].map((tier) => (
                      <Box key={tier.tier} p={6} borderWidth="2px" borderRadius="lg" w={{ base: "full", md: "280px" }} textAlign="center" bg="gray.700" borderColor="blue.500">
                        {tier.badge && (
                          <Badge colorScheme="blue" px={2} py={1} mb={2}>{tier.badge}</Badge>
                        )}
                        <Heading as="h3" size="md" color={textColor} mb={2}>{tier.tier}</Heading>
                        <Text fontSize="lg" fontWeight="bold" color="blue.400">{tier.price}</Text>
                        <List spacing={2} my={4} textAlign="left">
                          {tier.features.map((feature, index) => (
                            <ListItem key={index} display="flex" alignItems="center">
                              <ListIcon as={FiCheckCircle} color="blue.400" boxSize={4} /> {feature}
                            </ListItem>
                          ))}
                        </List>
                        <Button colorScheme="blue" size="sm" w="full">
                          {tier.price === "Custom" ? "Contact Sales" : "Choose Plan"}
                        </Button>
                      </Box>
                    ))}
                  </Flex>
                </TabPanel>
              ))}
            </TabPanels>
          </Tabs>
        </Box>
      </Flex>
    </Container>
  );
};

export default PricingPage;



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
import ProxyStarted from "../../../components/ProxyStarted";
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

// Improved Key Management Component
const KeyManagement = () => {
  type KeyItem = {
    id: number;
    value: string;
    isHidden: boolean;
    copied: boolean;
  };

  const [keys, setKeys] = useState<KeyItem[]>([]);

  // Generate a random alphanumeric secret of a given length.
  const generateSecret = (length = 16) => {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let secret = "";
    for (let i = 0; i < length; i++) {
      secret += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return secret;
  };

  const addKey = () => {
    const nextId = keys.length ? Math.max(...keys.map((k) => k.id)) + 1 : 1;
    const newKey: KeyItem = {
      id: nextId,
      value: generateSecret(),
      isHidden: false, // show the secret by default
      copied: false,
    };
    setKeys([...keys, newKey]);
  };

  const deleteKey = (id: number) => {
    setKeys(keys.filter((key) => key.id !== id));
  };

  const toggleVisibility = (id: number) => {
    setKeys(
      keys.map((key) =>
        key.id === id ? { ...key, isHidden: !key.isHidden } : key
      )
    );
  };

  const copyKey = (id: number) => {
    const keyToCopy = keys.find((key) => key.id === id);
    if (keyToCopy) {
      navigator.clipboard
        .writeText(keyToCopy.value)
        .then(() => {
          setKeys(
            keys.map((key) =>
              key.id === id ? { ...key, copied: true } : key
            )
          );
          setTimeout(() => {
            setKeys((currentKeys) =>
              currentKeys.map((key) =>
                key.id === id ? { ...key, copied: false } : key
              )
            );
          }, 2000);
        })
        .catch((err) => {
          console.error("Failed to copy key", err);
        });
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
              <Button
                size="xs"
                ml={2}
                colorScheme="red"
                onClick={() => deleteKey(key.id)}
              >
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

// Reactivation Options Component
const ReactivationOptions = () => {
  const dummyOptions = [
    { id: 1, name: "Option A" },
    { id: 2, name: "Option B" },
  ];

  return (
    <Box p={4} borderWidth="1px" borderRadius="md">
      <Text fontSize="xl" mb={4}>Reactivation Options</Text>
      <VStack align="stretch">
        {dummyOptions.map((option) => (
          <Button key={option.id} colorScheme="blue">
            {option.name}
          </Button>
        ))}
      </VStack>
    </Box>
  );
};


const STORAGE_KEY = "subscriptionSettings";
const PRODUCT = "proxy"; // Define product-specific subscription management

function ResidentialProxy() {
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
    { title: "Key Management", component: <KeyManagement /> },
  ];

  return (
    <Container maxW="full">
      <Flex align="center" justify="space-between" py={6} flexWrap="wrap" gap={4}>
        <Box textAlign="left" flex="1">
          <Text fontSize="xl" fontWeight="bold">Residential Proxy</Text>
          <Text fontSize="sm">Manage your proxy settings and subscriptions.</Text>
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

export const Route = createFileRoute("/_layout/proxies/residential")({
  component: ResidentialProxy,
});

export default ResidentialProxy;
