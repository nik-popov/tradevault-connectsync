import {
    Box,
    Container,
    Heading,
    Table,
    TableContainer,
    Tbody,
    Td,
    Th,
    Thead,
    Tr,
    Switch,
    Tab,
    Tabs,
    TabList,
    TabPanel,
    TabPanels,
    Badge,
    VStack,
    Flex,
  } from "@chakra-ui/react";
  import { useState } from "react";
  import { createFileRoute } from "@tanstack/react-router";
  import Navbar from "../../components/Common/Navbar";
  import useAuth from "../../hooks/useAuth";
  
  // ✅ Define Route Properly
  export const Route = createFileRoute("/_layout/subscriptions")({
    component: Subscriptions,
  });
  
  // ✅ Mock Subscription State for Each Product
  const initialSubscriptions = {
    proxy: { hasSubscription: false, isTrial: false, isDeactivated: false },
    scrapingAPI: { hasSubscription: false, isTrial: false, isDeactivated: false },
    dataset: { hasSubscription: false, isTrial: false, isDeactivated: false },
  };
  
  function SubscriptionTable({ product, state, toggleState }) {
    return (
      <TableContainer>
        <Table size="md">
          <Thead>
            <Tr>
              <Th>Product</Th>
              <Th>Subscription</Th>
              <Th>Trial</Th>
              <Th>Deactivated</Th>
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Td>
                {product}{" "}
                {state.hasSubscription && (
                  <Badge ml={2} colorScheme="blue">
                    Active
                  </Badge>
                )}
              </Td>
              <Td>
                <Switch isChecked={state.hasSubscription} onChange={() => toggleState(product, "hasSubscription")} />
              </Td>
              <Td>
                <Switch isChecked={state.isTrial} onChange={() => toggleState(product, "isTrial")} />
              </Td>
              <Td>
                <Switch isChecked={state.isDeactivated} onChange={() => toggleState(product, "isDeactivated")} />
              </Td>
            </Tr>
          </Tbody>
        </Table>
      </TableContainer>
    );
  }
  
  function Subscriptions() {
    const { user: currentUser } = useAuth();
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
          <Heading size="md">🚀 Manage Your Subscriptions</Heading>
        </Box>
  
        {/* ✅ Navbar */}
        <Navbar type="Subscription" />
  
        {/* ✅ Top Bar: User Info */}
        <Flex mt={6} justify="space-between" align="center">
          <Box textAlign="left">
            <Heading size="lg">
              Hi, {currentUser?.full_name || currentUser?.email} 👋🏼
            </Heading>
            <Box fontSize="sm">Manage your subscriptions below.</Box>
          </Box>
        </Flex>
  
        {/* ✅ Tabs for Different Products */}
        <Tabs variant="enclosed" mt={6}>
          <TabList>
            <Tab>Proxy</Tab>
            <Tab>Scraping API</Tab>
            <Tab>Dataset</Tab>
          </TabList>
  
          <TabPanels>
            <TabPanel>
              <SubscriptionTable product="Proxy" state={subscriptions.proxy} toggleState={toggleState} />
            </TabPanel>
            <TabPanel>
              <SubscriptionTable product="Scraping API" state={subscriptions.scrapingAPI} toggleState={toggleState} />
            </TabPanel>
            <TabPanel>
              <SubscriptionTable product="Dataset" state={subscriptions.dataset} toggleState={toggleState} />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Container>
    );
  }
  
  export default Subscriptions;
  