import React, { useState, useMemo } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  Input,
  Button,
  Divider,
  Stack,
  Flex,
  Switch,
  List,
  ListItem,
  Tooltip,
  Select,
  Alert,
  AlertIcon,
  HStack
} from "@chakra-ui/react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { FiSearch, FiSend, FiGithub } from "react-icons/fi";
import { useQueryClient } from '@tanstack/react-query';
import { motion } from "framer-motion";

const Explore = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const currentUser = queryClient.getQueryData(["currentUser"]);
  const ownedApis = currentUser?.ownedApis || [];

  const [searchQuery, setSearchQuery] = useState("");
  const [ownedOnly, setOwnedOnly] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");
  const [hasSubscription, setHasSubscription] = useState(false);
  const [isTrial, setIsTrial] = useState(false);
  const [isDeactivated, setIsDeactivated] = useState(false);
  const [sortOption, setSortOption] = useState("name");

  const apis = [
    { id: "google", name: "Google Search API", type: "Search", owned: ownedApis.includes("google"), price: "Free", rating: 4.7, description: "Fetches real-time search results from Google." },
    { id: "bing", name: "Bing Search API", type: "Search", owned: ownedApis.includes("bing"), price: "$10/month", rating: 4.5, description: "Provides search results from Bing, including images and news." },
    { id: "real-estate", name: "Real Estate Data API", type: "Real Estate", owned: ownedApis.includes("real-estate"), price: "$20/month", rating: 4.8, description: "Get property listings, pricing trends, and real estate analytics." },
    { id: "ecommerce", name: "E-commerce Scraper API", type: "E-commerce", owned: ownedApis.includes("ecommerce"), price: "$30/month", rating: 4.6, description: "Extract product data from e-commerce platforms like Amazon and eBay." },
    { id: "finance", name: "Financial Data API", type: "Finance", owned: ownedApis.includes("finance"), price: "$50/month", rating: 4.9, description: "Access stock market trends, forex rates, and economic indicators." },
    { id: "fashion", name: "Fashion Trends API", type: "Fashion", owned: ownedApis.includes("fashion"), price: "$15/month", rating: 4.4, description: "Analyze fashion trends, top-selling apparel, and style reports." },
    { id: "healthcare", name: "Healthcare Data API", type: "Healthcare", owned: ownedApis.includes("healthcare"), price: "$40/month", rating: 4.7, description: "Retrieve medical research, pharmaceutical pricing, and health trends." },
    { id: "travel", name: "Travel Deals API", type: "Travel", owned: ownedApis.includes("travel"), price: "$25/month", rating: 4.6, description: "Find flight deals, hotel prices, and travel packages." }
  ];

  const industries = ["All", ...new Set(apis.map(api => api.type))];

  const isLocked = !hasSubscription && !isTrial;

  const filteredResults = useMemo(() => {
    let filtered = apis.filter(api =>
      (!ownedOnly || api.owned) &&
      (activeFilter === "all" || api.type === activeFilter) &&
      api.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return filtered.sort((a, b) => {
      if (sortOption === "name") return a.name.localeCompare(b.name);
      if (sortOption === "price") return parseFloat(a.price.replace(/\D/g, "")) - parseFloat(b.price.replace(/\D/g, ""));
      if (sortOption === "rating") return b.rating - a.rating;
    });
  }, [searchQuery, ownedOnly, activeFilter, sortOption]);

  return (
    <Container maxW="full">
      {/* Header Section */}
      <Box bg="blue.100" p={4} textAlign="center" borderRadius="md">
        <Text fontWeight="bold" fontSize="lg">🚀 Get a 3-day free trial of our APIs!</Text>
        <Button colorScheme="blue" size="sm" mt={2} onClick={() => navigate({ to: "/pricing" })}>
          Try Now
        </Button>
      </Box>

      {/* Toggle Section */}
      <Flex justify="space-between" py={6} flexWrap="wrap" gap={4}>
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
      </Flex>

      {/* Subscription Alerts */}
      {isLocked ? (
        <Alert status="warning" borderRadius="md" mt={4}>
          <AlertIcon />
          <Text>You need a subscription or trial to explore APIs.</Text>
        </Alert>
      ) : isDeactivated ? (
        <Alert status="error" borderRadius="md" mt={4}>
          <AlertIcon />
          <Text>Your subscription has expired. Please renew to access all features.</Text>
        </Alert>
      ) : (
        <>
          {/* Filters & Sorting */}
          <Flex mt={6} gap={4} justify="space-between" align="center" flexWrap="wrap">
            <Input
              placeholder="Search APIs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              w={{ base: "100%", md: "300px" }}
            />
            <Select value={sortOption} onChange={(e) => setSortOption(e.target.value)} w="200px">
              <option value="name">Sort by Name</option>
              <option value="price">Sort by Price</option>
              <option value="rating">Sort by Rating</option>
            </Select>
            <Stack direction="row" spacing={3}>
              {industries.map((type) => (
                <Button
                  key={type}
                  size="md"
                  fontWeight="bold"
                  borderRadius="full"
                  colorScheme={activeFilter === type.toLowerCase() ? "blue" : "gray"}
                  variant={activeFilter === type.toLowerCase() ? "solid" : "outline"}
                  onClick={() => setActiveFilter(type.toLowerCase())}
                >
                  {type}
                </Button>
              ))}
            </Stack>
          </Flex>

          <Divider my={4} />

          {/* API List */}
          <List spacing={4}>
            {filteredResults.length === 0 ? (
              <Text textAlign="center" fontSize="lg" color="gray.500">No APIs match this filter.</Text>
            ) : (
              filteredResults.map((api) => (
                <motion.div key={api.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                  <ListItem p={5} shadow="md" borderWidth="1px" borderRadius="lg" bg="gray.50" _hover={{ shadow: "lg", transform: "scale(1.02)" }} transition="0.2s ease-in-out">
                    <Tooltip label={api.description} hasArrow>
                      <Text fontWeight="bold">{api.name} {api.owned ? "(Owned)" : ""}</Text>
                    </Tooltip>
                    <Button mt={3} size="sm" colorScheme="blue" borderRadius="full" onClick={() => navigate({ to: "/explore/" + api.id })}>
                      Explore
                    </Button>
                  </ListItem>
                </motion.div>
              ))
            )}
          </List>
        </>
      )}
    </Container>
  );
};

export const Route = createFileRoute("/_layout/search-api/explore")({ component: Explore });

export default Explore;
