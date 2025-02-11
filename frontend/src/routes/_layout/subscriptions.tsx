import {
    Box,
    Container,
    Text,
    VStack,
    Button,
    Flex,
    Switch,
    Tab,
    Tabs,
    TabList,
    TabPanel,
    TabPanels,
    Heading,
  } from "@chakra-ui/react";
  import { createFileRoute, useNavigate } from "@tanstack/react-router";
  import { useState } from "react";
  import useAuth from "../../hooks/useAuth";
  import Navbar from "../../components/Common/Navbar";
  
  // Define Route
  export const Route = createFileRoute("/subscriptions")({
    component: Subscriptions,
  });
  
  // Initial Subscription States
  const initialSubscriptions = {
    proxy: { hasSubscription: true, isTrial: false, isDeactivated: false },
    scrapingAPI: { hasSubscription: false, isTrial: false, isDeactivated: false },
    dataset: { hasSubscription: false, isTrial: false, isDeactivated: false },
  };
  
  // Subscription Toggle Component
  function SubscriptionToggle({ productKey, productName, state, toggleState }) {
    return (
      <Box p={5} shadow="md" borderWidth="1px" borderRadius="lg" bg="gray.50">
        <Text fontSize="lg" fontWeight="bold">{productName}</Text>
        <Flex justify="space-between" mt={3}>
          <Text>Active Subscription</Text>
          <Switch isChecked={state.hasSubscription} onChange={() => toggleState(productKey, "hasSubscription")} />
        </Flex>
        <Flex justify="space-between" mt={3}>
          <Text>Trial Mode</Text>
          <Switch isChecked={state.isTrial} onChange={() => toggleState(productKey, "isTrial")} />
        </Flex>
        <Flex justify="space-between" mt={3}>
          <Text>Deactivated</Text>
          <Switch isChecked={state.isDeactivated} onChange={() => toggleState(productKey, "isDeactivated")} />
        </Flex>
      </Box>
    );
  }
  
  // Subscriptions Page Component
  function Subscriptions() {
    const { user: currentUser } = useAuth();
    const navigate = useNavigate();
    const [subscriptions, setSubscriptions] = useState(initialSubscriptions);
  
    // Toggle Subscription State
    const toggleState = (productKey, key) => {
      setSubscriptions((prev) => ({
        ...prev,
        [productKey]: { ...prev[productKey], [key]: !prev[productKey][key] },
      }));
    };
  
    return (
      <Container maxW="full" p={6}>
        <Box bg="blue.100" p={4} textAlign="center" borderRadius="md">
          <Text fontWeight="bold" fontSize="lg">🚀 Manage Your Subscriptions</Text>
        </Box>
  
        <Navbar type="Subscription" />
  
        <Flex mt={6} gap={4} justify="space-between" align="center">
          <Box textAlign="left">
            <Text fontSize="xl" fontWeight="bold">
              Hi, {currentUser?.full_name || currentUser?.email || "User"} 👋🏼
            </Text>
            <Text fontSize="sm">Manage your subscriptions below.</Text>
          </Box>
        </Flex>
  
        <Tabs variant="enclosed" mt={6}>
          <TabList>
            <Tab>Proxy</Tab>
            <Tab>Scraping API</Tab>
            <Tab>Dataset</Tab>
          </TabList>
  
          <TabPanels>
            <TabPanel>
              <SubscriptionToggle productKey="proxy" productName="Proxy" state={subscriptions.proxy} toggleState={toggleState} />
            </TabPanel>
            <TabPanel>
              <SubscriptionToggle productKey="scrapingAPI" productName="Scraping API" state={subscriptions.scrapingAPI} toggleState={toggleState} />
            </TabPanel>
            <TabPanel>
              <SubscriptionToggle productKey="dataset" productName="Dataset" state={subscriptions.dataset} toggleState={toggleState} />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Container>
    );
  }
  
  export default Subscriptions;
  
  