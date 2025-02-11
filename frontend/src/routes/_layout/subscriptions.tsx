import {
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
    Flex,
  } from "@chakra-ui/react";
  import { useState } from "react";
  import Navbar from "../../components/Common/Navbar";
  
  // ✅ Subscription State for Each Product
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
                <Switch isChecked={state.hasSubscription} onChange={() => toggleState("hasSubscription", product)} />
              </Td>
              <Td>
                <Switch isChecked={state.isTrial} onChange={() => toggleState("isTrial", product)} />
              </Td>
              <Td>
                <Switch isChecked={state.isDeactivated} onChange={() => toggleState("isDeactivated", product)} />
              </Td>
            </Tr>
          </Tbody>
        </Table>
      </TableContainer>
    );
  }
  
  function Subscriptions() {
    const [subscriptions, setSubscriptions] = useState(initialSubscriptions);
  
    const toggleState = (key, product) => {
      setSubscriptions((prev) => ({
        ...prev,
        [product]: { ...prev[product], [key]: !prev[product][key] },
      }));
    };
  
    return (
      <Container maxW="full">
        <Heading size="lg" textAlign={{ base: "center", md: "left" }} pt={12}>
          Subscription Management
        </Heading>
  
        <Navbar type={"Subscription"} />
  
        {/* ✅ Tabs for Each Product Subscription */}
        <Tabs variant="enclosed">
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
  
  // ✅ Correctly Export Route for TanStack Router
  import { createFileRoute } from "@tanstack/react-router";
  
  export const Route = createFileRoute("/_layout/subscriptions")({
    component: Subscriptions,
  });
  
export default Subscriptions;
