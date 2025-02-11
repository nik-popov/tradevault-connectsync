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
    Flex,
  } from "@chakra-ui/react";
  import { useState, useEffect } from "react";
  import Navbar from "../../components/Common/Navbar";
  
  // ✅ Mock Data for Subscription Management (Replace with API later)
  const mockUsers = [
    { id: "1", name: "Alice", email: "alice@example.com", subscription: "Business", isTrial: false, isDeactivated: false },
    { id: "2", name: "Bob", email: "bob@example.com", subscription: "Starter", isTrial: true, isDeactivated: false },
    { id: "3", name: "Charlie", email: "charlie@example.com", subscription: "Enterprise", isTrial: false, isDeactivated: true },
  ];
  
  const subscriptionTiers = ["Starter", "Business", "Business Plus+", "Enterprise"];
  
  // ✅ Subscription Management Table
  function SubscriptionTable() {
    const [users, setUsers] = useState(mockUsers);
  
    // ✅ Assign Subscription to a User (Manual until API integration)
    const changeSubscription = (id, newSubscription) => {
      setUsers((prev) =>
        prev.map((user) =>
          user.id === id ? { ...user, subscription: newSubscription } : user
        )
      );
    };
  
    // ✅ Toggle Trial Mode
    const toggleTrial = (id) => {
      setUsers((prev) =>
        prev.map((user) =>
          user.id === id ? { ...user, isTrial: !user.isTrial } : user
        )
      );
    };
  
    // ✅ Toggle Deactivation
    const toggleDeactivation = (id) => {
      setUsers((prev) =>
        prev.map((user) =>
          user.id === id ? { ...user, isDeactivated: !user.isDeactivated } : user
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
              <Th>Email</Th>
              <Th>Subscription</Th>
              <Th>Trial</Th>
              <Th>Deactivated</Th>
            </Tr>
          </Thead>
          <Tbody>
            {users.map((user) => (
              <Tr key={user.id}>
                <Td>{user.id}</Td>
                <Td>{user.name}</Td>
                <Td>{user.email}</Td>
                <Td>
                  <Flex gap={2}>
                    {subscriptionTiers.map((tier) => (
                      <Button
                        key={tier}
                        size="xs"
                        colorScheme={user.subscription === tier ? "blue" : "gray"}
                        onClick={() => changeSubscription(user.id, tier)}
                      >
                        {tier}
                      </Button>
                    ))}
                  </Flex>
                </Td>
                <Td>
                  <Switch isChecked={user.isTrial} onChange={() => toggleTrial(user.id)} />
                </Td>
                <Td>
                  <Switch isChecked={user.isDeactivated} onChange={() => toggleDeactivation(user.id)} />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    );
  }
  
  // ✅ Main Subscription Management Page
  function Subscriptions() {
    return (
      <Container maxW="full">
        <Heading size="lg" textAlign={{ base: "center", md: "left" }} pt={12}>
          Subscription Management
        </Heading>
  
        <Navbar type={"Subscription"} />
  
        {/* ✅ Subscription Management Table */}
        <SubscriptionTable />
      </Container>
    );
  }
  
  // ✅ Correctly Export Route for TanStack Router
  import { createFileRoute } from "@tanstack/react-router";
  
  export const Route = createFileRoute("/_layout/subscriptions")({
    component: Subscriptions,
  });
  
  export default Subscriptions;
  