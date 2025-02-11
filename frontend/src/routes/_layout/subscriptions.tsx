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
    Button,
    Alert,
    AlertIcon,
    Spinner,
  } from "@chakra-ui/react";
  import { useState, useEffect } from "react";
  import Navbar from "../../components/Common/Navbar";
  import { loadStripe } from "@stripe/stripe-js";
  
  // ✅ Load Stripe with the correct publishable key
  const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
  
  // ✅ Mock Subscription Data (Can Be Replaced with API)
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
  
  // ✅ SubscriptionTable Component
  function SubscriptionTable({ category }) {
    const [subscriptions, setSubscriptions] = useState([]);
  
    // ✅ Initialize state properly
    useEffect(() => {
      setSubscriptions(subscriptionData[category] || []);
    }, [category]);
  
    const toggleSubscription = (id) => {
      setSubscriptions((prev) =>
        prev.map((sub) =>
          sub.id === id ? { ...sub, hasSubscription: !sub.hasSubscription } : sub
        )
      );
    };
  
    const toggleTrial = (id) => {
      setSubscriptions((prev) =>
        prev.map((sub) =>
          sub.id === id ? { ...sub, isTrial: !sub.isTrial } : sub
        )
      );
    };
  
    const toggleDeactivation = (id) => {
      setSubscriptions((prev) =>
        prev.map((sub) =>
          sub.id === id ? { ...sub, isDeactivated: !sub.isDeactivated } : sub
        )
      );
    };
  
    const handleSubscriptionPurchase = async (planId) => {
      const stripe = await stripePromise;
      if (!stripe) {
        console.error("Stripe failed to load.");
        return;
      }
  
      // Mock API Call (Replace with Backend Call)
      const checkoutSession = await fetch("/api/create-checkout-session", {
        method: "POST",
        body: JSON.stringify({ planId }),
      }).then((res) => res.json());
  
      // Redirect to Stripe Checkout
      const { error } = await stripe.redirectToCheckout({ sessionId: checkoutSession.id });
      if (error) console.error(error);
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
              <Th>Actions</Th>
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
                <Td>
                  <Button colorScheme="blue" size="sm" onClick={() => handleSubscriptionPurchase(sub.id)}>
                    Subscribe
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    );
  }
  
  // ✅ Subscriptions Component
  function Subscriptions() {
    return (
      <Container maxW="full">
        <Heading size="lg" textAlign={{ base: "center", md: "left" }} pt={12}>
          Subscription Management
        </Heading>
  
        <Navbar type={"Subscription"} />
  
        {/* ✅ Tabs for Different Product Memberships */}
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
  