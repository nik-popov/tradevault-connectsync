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
  } from "@chakra-ui/react";
  import { useState } from "react";
  import Navbar from "../../components/Common/Navbar";
  
  // Mock Subscription Data
  const subscriptionData = {
    Proxy: [
      { id: "1", name: "Starter", price: "$99/mo", hasSubscription: true, isTrial: false, isDeactivated: false },
      { id: "2", name: "Business", price: "$499/mo", hasSubscription: true, isTrial: false, isDeactivated: false, badge: "Most Popular" },
      { id: "3", name: "Business Plus+", price: "$2,999/mo", hasSubscription: true, isTrial: false, isDeactivated: false },
      { id: "4", name: "Ultra Enterprise", price: "Contact Dev", hasSubscription: false, isTrial: false, isDeactivated: true },
    ],
    "Scraping API": [
      { id: "5", name: "For Developers", price: "$100/mo", hasSubscription: true, isTrial: false, isDeactivated: false },
      { id: "6", name: "SaaS", price: "$500/mo", hasSubscription: true, isTrial: false, isDeactivated: false, badge: "Most Popular" },
      { id: "7", name: "Pro", price: "$2,000/mo", hasSubscription: true, isTrial: false, isDeactivated: false },
      { id: "8", name: "Enterprise", price: "Custom Pricing", hasSubscription: false, isTrial: false, isDeactivated: true },
    ],
    "Dataset Access": [
      { id: "9", name: "Explorer", price: "$5/mo", hasSubscription: true, isTrial: false, isDeactivated: false, badge: "Most Popular" },
      { id: "10", name: "Archiver", price: "$100/mo", hasSubscription: true, isTrial: false, isDeactivated: false },
      { id: "11", name: "Researcher", price: "$500/mo", hasSubscription: true, isTrial: false, isDeactivated: false },
      { id: "12", name: "Enterprise", price: "Custom Pricing", hasSubscription: false, isTrial: false, isDeactivated: true },
    ],
  };
  
  function SubscriptionTable({ category }) {
    const [subscriptions, setSubscriptions] = useState(subscriptionData[category]);
  
    // Toggle Subscription Status
    const toggleSubscription = (id) => {
      setSubscriptions((prev) =>
        prev.map((sub) =>
          sub.id === id ? { ...sub, hasSubscription: !sub.hasSubscription } : sub
        )
      );
    };
  
    // Toggle Trial Status
    const toggleTrial = (id) => {
      setSubscriptions((prev) =>
        prev.map((sub) =>
          sub.id === id ? { ...sub, isTrial: !sub.isTrial } : sub
        )
      );
    };
  
    // Toggle Deactivation Status
    const toggleDeactivation = (id) => {
      setSubscriptions((prev) =>
        prev.map((sub) =>
          sub.id === id ? { ...sub, isDeactivated: !sub.isDeactivated } : sub
        )
      );
    };
  
    return (
      <TableContainer>
        <Table size={{ base: "sm", md: "md" }}>
          <Thead>
            <Tr>
              <Th>ID</Th>
              <Th>Name</Th>
              <Th>Price</Th>
              <Th>Subscription</Th>
              <Th>Trial</Th>
              <Th>Deactivated</Th>
            </Tr>
          </Thead>
          <Tbody>
            {subscriptions.map((sub) => (
              <Tr key={sub.id}>
                <Td>{sub.id}</Td>
                <Td>
                  {sub.name}{" "}
                  {sub.badge && (
                    <Badge colorScheme="blue" ml={2}>
                      {sub.badge}
                    </Badge>
                  )}
                </Td>
                <Td>{sub.price}</Td>
                <Td>
                  <Switch isChecked={sub.hasSubscription} onChange={() => toggleSubscription(sub.id)} />
                </Td>
                <Td>
                  <Switch isChecked={sub.isTrial} onChange={() => toggleTrial(sub.id)} />
                </Td>
                <Td>
                  <Switch isChecked={sub.isDeactivated} onChange={() => toggleDeactivation(sub.id)} />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    );
  }
  
  function Subscriptions() {
    return (
      <Container maxW="full">
        <Heading size="lg" textAlign={{ base: "center", md: "left" }} pt={12}>
          Subscription Management
        </Heading>
  
        <Navbar type={"Subscription"} />
  
        {/* Tabs for Different Product Memberships */}
        <Tabs variant="enclosed">
          <TabList>
            {Object.keys(subscriptionData).map((category) => (
              <Tab key={category}>{category}</Tab>
            ))}
          </TabList>
  
          <TabPanels>
  {Object.keys(subscriptionData).map((category) => (
    <TabPanel key={category}>
      {subscriptionData[category] ? <SubscriptionTable category={category} /> : null}
    </TabPanel>
  ))}
</TabPanels>

        </Tabs>
      </Container>
    );
  }
  
  // ✅ Fix: Ensure Route is correctly exported
  import { createFileRoute } from "@tanstack/react-router";
  
  export const Route = createFileRoute("/_layout/subscriptions")({
    component: Subscriptions,
  });
  
  export default Subscriptions;
  