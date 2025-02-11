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
    { id: "google", name: "Google Search API", type: "Search", owned: ownedApis.includes("google") },
    { id: "bing", name: "Bing Search API", type: "Search", owned: ownedApis.includes("bing") },
    { id: "real-estate", name: "Real Estate Data API", type: "Real Estate", owned: ownedApis.includes("real-estate") },
    { id: "ecommerce", name: "E-commerce Scraper API", type: "E-commerce", owned: ownedApis.includes("ecommerce") },
    { id: "finance", name: "Financial Data API", type: "Finance", owned: ownedApis.includes("finance") },
    { id: "fashion", name: "Fashion Trends API", type: "Fashion", owned: ownedApis.includes("fashion") },
    { id: "healthcare", name: "Healthcare Data API", type: "Healthcare", owned: ownedApis.includes("healthcare") },
    { id: "travel", name: "Travel Deals API", type: "Travel", owned: ownedApis.includes("travel") }
  ];

  const industries = [...new Set(results.map((r) => r.type))];
  
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
              {industries.map((industry, index) => (
                <Tab key={index} onClick={() => setActiveFilter(industry)}>{industry}</Tab>
              ))}
            </TabList>
            <TabPanels>
              {industries.map((industry, index) => (
                <TabPanel key={index}>
                  <VStack spacing={4} align="stretch">
                    {results.filter(r => r.type === industry).length === 0 ? (
                      <Text textAlign="center" fontSize="lg" color="gray.500">No results found.</Text>
                    ) : (
                      <List spacing={3}>
                        {results.filter(r => r.type === industry).map((result) => (
                          <ListItem key={result.id} p={3} shadow="sm" borderWidth="1px" borderRadius="md">
                            <Text fontWeight="bold">{result.name} {result.owned ? "(Owned)" : ""}</Text>
                          </ListItem>
                        ))}
                      </List>
                    )}
                  </VStack>
                </TabPanel>
              ))}
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
