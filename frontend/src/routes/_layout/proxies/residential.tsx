import {
  Container,
  Heading,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  HStack,
  Divider,
  Flex,
  Switch,
} from "@chakra-ui/react";
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { FiSend, FiGithub } from "react-icons/fi";
import PromoContent from "../../../components/PromoContent";
import ProxyStarted from "../../../components/ProxyStarted";
import ProxySettings from "../../../components/ProxySettings";
import ProxyUsage from "../../../components/ProxyUsage";

import { useState } from "react";
import {
  Box,
  Text,
  Button,
  VStack,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Input,
  Alert,
  AlertIcon,
  Spinner
} from "@chakra-ui/react";
import { useQuery, useMutation } from "@tanstack/react-query";

// Placeholder API functions
const fetchTopUps = async () => []; // Replace with API call later
const fetchConnections = async () => [];
const fetchLogs = async () => [];
const fetchKeys = async () => [];
const fetchReactivationOptions = async () => [];

const TopUps = () => {
  const { data: topUps, isLoading, error } = useQuery(["topUps"], fetchTopUps);
  return (
    <Box p={4} borderWidth={1} borderRadius="md">
      <Text fontSize="xl" mb={4}>Top-Ups</Text>
      {isLoading ? <Spinner /> : error ? <Alert status="error"><AlertIcon />Error loading data</Alert> : (
        <Table variant="simple">
          <Thead><Tr><Th>ID</Th><Th>Amount</Th><Th>Date</Th></Tr></Thead>
          <Tbody>{topUps.map((topUp) => <Tr key={topUp.id}><Td>{topUp.id}</Td><Td>{topUp.amount}</Td><Td>{topUp.date}</Td></Tr>)}</Tbody>
        </Table>
      )}
      <Button mt={4} colorScheme="blue">Add Top-Up</Button>
    </Box>
  );
};

const Connections = () => {
  const { data: connections, isLoading, error } = useQuery(["connections"], fetchConnections);
  return (
    <Box p={4} borderWidth={1} borderRadius="md">
      <Text fontSize="xl" mb={4}>Connections</Text>
      {isLoading ? <Spinner /> : error ? <Alert status="error"><AlertIcon />Error loading connections</Alert> : (
        <Table variant="simple">
          <Thead><Tr><Th>IP</Th><Th>Status</Th><Th>Last Used</Th></Tr></Thead>
          <Tbody>{connections.map((conn) => <Tr key={conn.id}><Td>{conn.ip}</Td><Td>{conn.status}</Td><Td>{conn.last_used}</Td></Tr>)}</Tbody>
        </Table>
      )}
    </Box>
  );
};

const Logs = () => {
  const { data: logs, isLoading, error } = useQuery(["logs"], fetchLogs);
  return (
    <Box p={4} borderWidth={1} borderRadius="md">
      <Text fontSize="xl" mb={4}>Logs</Text>
      {isLoading ? <Spinner /> : error ? <Alert status="error"><AlertIcon />Error loading logs</Alert> : (
        <Table variant="simple">
          <Thead><Tr><Th>Timestamp</Th><Th>Message</Th></Tr></Thead>
          <Tbody>{logs.map((log) => <Tr key={log.id}><Td>{log.timestamp}</Td><Td>{log.message}</Td></Tr>)}</Tbody>
        </Table>
      )}
    </Box>
  );
};

const KeyManagement = () => {
  const [newKey, setNewKey] = useState("");
  const { data: keys, isLoading, error } = useQuery(["keys"], fetchKeys);
  const mutation = useMutation(() => Promise.resolve()); // Replace with API call

  const addKey = () => mutation.mutate(newKey);

  return (
    <Box p={4} borderWidth={1} borderRadius="md">
      <Text fontSize="xl" mb={4}>Key Management</Text>
      {isLoading ? <Spinner /> : error ? <Alert status="error"><AlertIcon />Error loading keys</Alert> : (
        <VStack align="stretch">
          {keys.map((key) => <Text key={key.id}>{key.value}</Text>)}
          <Input placeholder="New Key" value={newKey} onChange={(e) => setNewKey(e.target.value)} />
          <Button mt={2} colorScheme="blue" onClick={addKey}>Add Key</Button>
        </VStack>
      )}
    </Box>
  );
};

const ReactivationOptions = () => {
  const { data: options, isLoading, error } = useQuery(["reactivationOptions"], fetchReactivationOptions);
  return (
    <Box p={4} borderWidth={1} borderRadius="md">
      <Text fontSize="xl" mb={4}>Reactivation Options</Text>
      {isLoading ? <Spinner /> : error ? <Alert status="error"><AlertIcon />Error loading options</Alert> : (
        <VStack align="stretch">
          {options.map((opt) => <Button key={opt.id} colorScheme="blue">{opt.name}</Button>)}
        </VStack>
      )}
    </Box>
  );
};

export { TopUps, Connections, Logs, KeyManagement, ReactivationOptions };

// ✅ Route Export
export const Route = createFileRoute("/_layout/proxies/residential")({
  component: ResidentialProxy,
});

const tabsConfig = [
  { title: "Get Started", component: <ProxyStarted /> },
  { title: "Endpoints", component: <ProxySettings /> },
  { title: "Usage", component: <ProxyUsage /> },
  { title: "Top-Ups", component: <TopUps /> },
  { title: "Connections", component: <Connections /> },
  { title: "Logs", component: <Logs /> },
  { title: "Key Management", component: <KeyManagement /> },
];

function ResidentialProxy() {
  const queryClient = useQueryClient();
  const [subscriptionSettings, setSubscriptionSettings] = useState({
    hasSubscription: false,
    isTrial: false,
    isDeactivated: false,
  });

  // Load subscription settings from localStorage and React Query
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

  const { hasSubscription, isTrial, isDeactivated } = subscriptionSettings;

  // Define restricted tabs based on subscription state
  const restrictedTabs = isTrial ? ["Key Management", "Logs", "Top-Ups", "Connections"] : [];
  const isLocked = !hasSubscription && !isTrial;

  return (
    <Container maxW="full">
      {/* Top Bar with Heading and Toggles */}
      <Flex align="center" justify="space-between" py={6} flexWrap="wrap" gap={4}>
        <Heading size="lg">Residential Proxies</Heading>
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

      {/* Conditional Content Based on Subscription Status */}
      {isLocked ? (
        <PromoContent />
      ) : isDeactivated ? (
        <Box mt={6}>
          <Text>Your subscription has expired. Please renew to access all features.</Text>
          <ReactivationOptions />
        </Box>
      ) : (
        <Flex mt={6} gap={6} justify="space-between">
          {/* Main Content */}
          <Box flex="1">
            <Box p={4}>
              <Text fontSize="2xl" fontWeight="bold">
                Hi, Welcome Back 👋🏼
              </Text>
              <Text>Manage your proxy settings with ease.</Text>
            </Box>
            <Divider my={4} />
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

          {/* Sidebar Section */}
          <Box w="250px" p={4} borderLeft="1px solid #E2E8F0">
            <VStack spacing={4} align="stretch">
              <Box p={4} shadow="sm" borderWidth="1px" borderRadius="lg">
                <Text fontWeight="bold">Pick by Your Target</Text>
                <Text fontSize="sm">Not sure which product to choose?</Text>
                <Button mt={2} leftIcon={<FiSend />} size="sm" variant="outline">
                  Send Test Request
                </Button>
              </Box>
              <Box p={4} shadow="sm" borderWidth="1px" borderRadius="lg">
                <Text fontWeight="bold">GitHub</Text>
                <Text fontSize="sm">Explore integration guides and open-source projects.</Text>
                <Button mt={2} leftIcon={<FiGithub />} size="sm" variant="outline">
                  Join GitHub
                </Button>
              </Box>
            </VStack>
          </Box>
        </Flex>
      )}
    </Container>
  );
}

export default ResidentialProxy;
