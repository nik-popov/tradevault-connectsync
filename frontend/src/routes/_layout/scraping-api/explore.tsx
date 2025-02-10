import React, { useState } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  Input,
  Button,
  Divider,
  Flex,
  Switch,
  HStack,
  List,
  ListItem,
  Alert,
  AlertIcon,
  Tabs,
  Tab,
  TabList,
  TabPanel,
  TabPanels
} from "@chakra-ui/react";
import { createFileRoute } from '@tanstack/react-router';
import { useQueryClient } from '@tanstack/react-query';
import { FiSearch } from 'react-icons/fi';

const Explore = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [ownedOnly, setOwnedOnly] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");
  const [hasSubscription, setHasSubscription] = useState(false);
  const [isTrial, setIsTrial] = useState(false);
  const [isDeactivated, setIsDeactivated] = useState(false);

  const queryClient = useQueryClient();
  const currentUser = queryClient.getQueryData(["currentUser"]);
  const ownedApis = currentUser?.ownedApis || [];

  const results = [
    { id: "google", name: "Google Search API", type: "SERP", owned: ownedApis.includes("google") },
    { id: "bing", name: "Bing Search API", type: "SERP", owned: ownedApis.includes("bing") }
  ];

  const filteredResults = results.filter(
    (result) =>
      (activeFilter === "all" || result.type === activeFilter) &&
      (!ownedOnly || result.owned) &&
      result.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isLocked = !hasSubscription && !isTrial;

  return (
    <Container maxW="full">
      <Flex align="center" justify="space-between" py={6} flexWrap="wrap" gap={4}>
        <Heading size="lg">Explore APIs</Heading>
        <HStack spacing={6}>
          <HStack>
            <Text fontWeight="bold">Subscription:</Text>
            <Switch isChecked={hasSubscription} onChange={() => setHasSubscription(!hasSubscription)} />
          </HStack>
          <HStack>
            <Text fontWeight="bold">Trial Mode:</Text>
            <Switch isChecked={isTrial} onChange={() => setIsTrial(!isTrial)} />
          </HStack>
          <HStack>
            <Text fontWeight="bold">Deactivated:</Text>
            <Switch isChecked={isDeactivated} onChange={() => setIsDeactivated(!isDeactivated)} />
          </HStack>
        </HStack>
      </Flex>

      {isLocked ? (
        <Alert status="warning" borderRadius="md">
          <AlertIcon />
          <Text>You need a subscription or trial to explore APIs.</Text>
        </Alert>
      ) : isDeactivated ? (
        <Alert status="error" borderRadius="md">
          <AlertIcon />
          <Text>Your subscription has expired. Please renew to access all features.</Text>
        </Alert>
      ) : (
        <>
          <Flex mt={6} gap={4} justify="space-between" align="center" flexWrap="wrap">
            <Input
              placeholder="Search APIs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              w={{ base: "100%", md: "300px" }}
            />
            <Button leftIcon={<FiSearch />} colorScheme="blue">Search</Button>
          </Flex>
          <Divider my={4} />

          <Tabs variant="enclosed">
            <TabList>
              <Tab onClick={() => setActiveFilter("all")}>All</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <VStack spacing={4} align="stretch">
                  {filteredResults.length === 0 ? (
                    <Text textAlign="center" fontSize="lg" color="gray.500">No results found.</Text>
                  ) : (
                    <List spacing={3}>
                      {filteredResults.map((result) => (
                        <ListItem key={result.id} p={3} shadow="sm" borderWidth="1px" borderRadius="md">
                          <Text fontWeight="bold">{result.name} {result.owned ? "(Owned)" : ""}</Text>
                        </ListItem>
                      ))}
                    </List>
                  )}
                </VStack>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </>
      )}
    </Container>
  );
};

export const Route = createFileRoute("/_layout/search-api/explore")({
  component: Explore
});

export default Explore;

