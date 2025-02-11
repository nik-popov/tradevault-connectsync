import {
    Box,
    Container,
    Text,
    VStack,
    Button,
    Divider,
    Stack,
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
  import Navbar from "../../components/Common/Navbar"; // ✅ Make sure this file exists!
  
  // ✅ Fix Route Path
  export const Route = createFileRoute("/subscriptions")({
    component: Subscriptions,
  });
  
  // ✅ Mock Subscription State
  const initialSubscriptions = {
    proxy: { hasSubscription: false, isTrial: false, isDeactivated: false },
    scrapingAPI: { hasSubscription: false, isTrial: false, isDeactivated: false },
    dataset: { hasSubscription: false, isTrial: false, isDeactivated: false },
  };
  
  function SubscriptionToggle({ product, state, toggleState }) {
    return (
      <Box p={5} shadow="md" borderWidth="1px" borderRadius="lg" bg="gray.50">
        <Text fontSize="lg" fontWeight="bold">{product}</Text>
        <Flex justify="space-between" mt={3}>
          <Text>Active Subscription</Text>
          <Switch isChecked={state.hasSubscription} onChange={() => toggleState(product, "hasSubscription")} />
        </Flex>
        <Flex justify="space-between" mt={3}>
          <Text>Trial Mode</Text>
          <Switch isChecked={state.isTrial} onChange={() => toggleState(product, "isTrial")} />
        </Flex>
        <Flex justify="space-between" mt={3}>
          <Text>Deactivated</Text>
          <Switch isChecked={state.isDeactivated} onChange={() => toggleState(product, "isDeactivated")} />
        </Flex>
      </Box>
    );
  }
  
  function Subscriptions() {
    const { user: currentUser } = useAuth();
    const navigate = useNavigate();
    const [subscriptions, setSubscriptions] = useState(initialSubscriptions);
  
    // ✅ Prevent Invalid State Updates
    const toggleState = (product, key) => {
      setSubscriptions((prev) => ({
        ...prev,
        [product]: { ...prev[product], [key]: !prev[product][key] },
      }));
    };
  
    return (
      <Container maxW="full">
        {/* ✅ Header Section */}
        <Box bg="blue.100" p={4} textAlign="center" borderRadius="md">
          <Text fontWeight="bold" fontSize="lg">🚀 Manage Your Subscriptions</Text>
        </Box>
  
        {/* ✅ Ensure Navbar Exists */}
        {Navbar ? <Navbar type="Subscription" /> : <Text color="red.500">Error: Navbar not found!</Text>}
  
        {/* ✅ User Welcome Section */}
        <Flex mt={6} gap={4} justify="space-between" align="center">
          <Box textAlign="left">
            <Text fontSize="xl" fontWeight="bold">
              Hi, {currentUser?.full_name || currentUser?.email || "User"} 👋🏼
            </Text>
            <Text fontSize="sm">Manage your subscriptions below.</Text>
          </Box>
        </Flex>
  
        {/* ✅ Tabs for Different Subscriptions */}
        <Tabs variant="enclosed" mt={6}>
          <TabList>
            <Tab>Proxy</Tab>
            <Tab>Scraping API</Tab>
            <Tab>Dataset</Tab>
          </TabList>
  
          <TabPanels>
            <TabPanel>
              <SubscriptionToggle product="Proxy" state={subscriptions.proxy} toggleState={toggleState} />
            </TabPanel>
            <TabPanel>
              <SubscriptionToggle product="Scraping API" state={subscriptions.scrapingAPI} toggleState={toggleState} />
            </TabPanel>
            <TabPanel>
              <SubscriptionToggle product="Dataset" state={subscriptions.dataset} toggleState={toggleState} />
            </TabPanel>
          </TabPanels>
        </Tabs>
  
        {/* ✅ Sidebar with Actions */}
        <Flex mt={6} gap={6} justify="space-between">
          {/* Sidebar */}
          <Box w="250px" p={4} borderLeft="1px solid #E2E8F0">
            <VStack spacing={4} align="stretch">
              {/* Test Request */}
              <Box p={4} shadow="sm" borderWidth="1px" borderRadius="lg">
                <Text fontWeight="bold">Pick by Your Target</Text>
                <Text fontSize="sm">Not sure which product to choose?</Text>
                <Button mt={2} size="sm" variant="outline" onClick={() => navigate({ to: "/test-request" })}>
                  Send Test Request
                </Button>
              </Box>
  
              {/* GitHub */}
              <Box p={4} shadow="sm" borderWidth="1px" borderRadius="lg">
                <Text fontWeight="bold">GitHub</Text>
                <Text fontSize="sm">Explore integration guides and open-source projects.</Text>
                <Button mt={2} size="sm" variant="outline" onClick={() => window.open("https://github.com/CobaltDataNet", "_blank")}>
                  Join GitHub
                </Button>
              </Box>
            </VStack>
          </Box>
        </Flex>
      </Container>
    );
  }
  
  export default Subscriptions;
  