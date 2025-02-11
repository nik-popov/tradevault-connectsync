import {
  Container,
  Heading,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Box,
  Text,
  Button,
  VStack,
  HStack,
  Divider,
  Flex,
  Switch,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Input,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { FiSend, FiGithub } from "react-icons/fi";

import PromoContent from "../../../components/PromoContent";
import BrowserStarted from "../../../components/BrowserStarted";
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

function BrowserProxy() {
  const queryClient = useQueryClient();
  const [subscriptionSettings, setSubscriptionSettings] = useState({
    hasSubscription: false,
    isTrial: false,
    isDeactivated: false,
  });

  // Load subscription settings from localStorage or React Query cache
  useEffect(() => {
    const storedSettings = localStorage.getItem("subscriptionSettings");
    if (storedSettings) {
      setSubscriptionSettings(JSON.parse(storedSettings));
    } else {
      const querySettings = queryClient.getQueryData("subscriptionSettings");
      if (querySettings) {
        setSubscriptionSettings(querySettings);
      }
    }
  }, [queryClient]);

  // Load current user data from localStorage (or replace with your own user fetch logic)
  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "null");

  const { hasSubscription, isTrial, isDeactivated } = subscriptionSettings;

  // Define restricted tabs based on subscription state
  const restrictedTabs = isTrial
    ? ["Key Management", "Logs", "Top-Ups", "Connections"]
    : [];
  const isLocked = !hasSubscription && !isTrial;

  // Define tabs configuration with inline components
  const tabsConfig = [
    { title: "Get Started", component: <BrowserStarted /> },
    { title: "Endpoints", component: <ProxySettings /> },
    { title: "Usage", component: <ProxyUsage /> },
    { title: "Top-Ups", component: <TopUps /> },
    { title: "Connections", component: <Connections /> },
    { title: "Logs", component: <Logs /> },
    { title: "Key Management", component: <KeyManagement /> },
  ];

  return (
    <Container maxW="full">
      {/* Top Bar */}
      <Flex align="center" justify="space-between" py={6} flexWrap="wrap" gap={4}>
        <Heading size="lg">Browser Proxies</Heading>
        <HStack spacing={6}>
          <HStack>
            <Text fontWeight="bold">Subscription:</Text>
            <Switch isChecked={hasSubscription} isDisabled />
          </HStack>
          <HStack>
            <Text fontWeight="bold">Trial Mode:</Text>
            <Switch isChecked={isTrial} isDisabled />
          </HStack>
          <HStack>
            <Text fontWeight="bold">Deactivated:</Text>
            <Switch isChecked={isDeactivated} isDisabled />
          </HStack>
        </HStack>
      </Flex>

      {/* Main Content or Alternate Views */}
      {isLocked ? (
        <PromoContent />
      ) : isDeactivated ? (
        <Box mt={6}>
          <Text>
            Your subscription has expired. Please renew to access all features.
          </Text>
          <ReactivationOptions />
        </Box>
      ) : (
        <Flex mt={6} gap={6} justify="space-between">
          {/* Main Content */}
          <Box flex="1">
            <Box p={4}>
              {/* Updated Greeting with currentUser information */}
              <Text fontSize="2xl" fontWeight="bold">
                Hi, {currentUser?.full_name || currentUser?.email} 👋🏼
              </Text>
              <Text>Manage your proxy settings with ease.</Text>
            </Box>
            <Divider my={4} />
            <Tabs variant="enclosed">
              <TabList>
                {tabsConfig.map((tab, index) => (
                  <Tab
                    key={index}
                    isDisabled={restrictedTabs.includes(tab.title)}
                  >
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

          {/* Sidebar Section */}
          <Box w="250px" p="4" borderLeft="1px solid #E2E8F0">
          <VStack spacing="4" align="stretch">
            <Box p="4" shadow="sm" borderWidth="1px" borderRadius="lg">
              <Text fontWeight="bold">Quick Actions</Text>
              <Button
                as="a"
                href="mailto:support@thedataproxy.com"
                leftIcon={<FiMail />}
                variant="outline"
                size="sm"
                mt="2"
              >
                Email Support
              </Button>
              <Button
                as="a"
                href="https://dashboard.thedataproxy.com"
                leftIcon={<FiHelpCircle />}
                variant="outline"
                size="sm"
                mt="2"
              >
                Report an Issue
              </Button>
            </Box>

            <Box p="4" shadow="sm" borderWidth="1px" borderRadius="lg">
              <Text fontWeight="bold">FAQs</Text>
              <Text fontSize="sm">Common questions and answers.</Text>
              <Button as="a" href="/faqs" mt="2" size="sm" variant="outline">
                View FAQs
              </Button>
            </Box>

            <Box p="4" shadow="sm" borderWidth="1px" borderRadius="lg">
              <Text fontWeight="bold">Community Support</Text>
              <Text fontSize="sm">Join discussions with other users.</Text>
              <Button
                as="a"
                href="https://github.com/CobaltDataNet"
                mt="2"
                leftIcon={<FiGithub />}
                size="sm"
                variant="outline"
              >
                GitHub Discussions
              </Button>
            </Box>
          </VStack>
        </Box>    
        </Flex>
    </Container>
  );
}

// Export Route AFTER the component definition
export const Route = createFileRoute("/_layout/proxies/browser")({
  component: BrowserProxy,
});

export default BrowserProxy;
