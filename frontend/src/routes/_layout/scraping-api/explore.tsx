import React, { useState, useMemo } from 'react';
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
  List,
  ListItem,
  Tooltip,
  Select,
  Alert,
  AlertIcon,
  HStack,
  Input
} from "@chakra-ui/react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { FiSearch, FiSend, FiGithub } from "react-icons/fi";
import { useQueryClient } from '@tanstack/react-query';
import { motion } from "framer-motion";
import useAuth from "../../../hooks/useAuth";
const Explore = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user: currentUser } = useAuth();
  const ownedApis = currentUser?.ownedApis || [];

  const [searchQuery, setSearchQuery] = useState("");
  const [ownedOnly, setOwnedOnly] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");
  const [hasSubscription, setHasSubscription] = useState(false);
  const [isTrial, setIsTrial] = useState(false);
  const [isDeactivated, setIsDeactivated] = useState(false);
  const [sortOption, setSortOption] = useState("name");

  const proxyProducts = [
    { id: "google", name: "Google Search API", type: "Search", owned: ownedApis.includes("google"), description: "Fetches real-time search results from Google." },
    { id: "bing", name: "Bing Search API", type: "Search", owned: ownedApis.includes("bing"), description: "Provides search results from Bing, including images and news." },
    { id: "real-estate", name: "Real Estate Data API", type: "Real Estate", owned: ownedApis.includes("real-estate"), description: "Get property listings, pricing trends, and real estate analytics." },
    { id: "ecommerce", name: "E-commerce Scraper API", type: "E-commerce", owned: ownedApis.includes("ecommerce"), description: "Extract product data from e-commerce platforms like Amazon and eBay." },
    { id: "finance", name: "Financial Data API", type: "Finance", owned: ownedApis.includes("finance"), description: "Access stock market trends, forex rates, and economic indicators." },
    { id: "fashion", name: "Fashion Trends API", type: "Fashion", owned: ownedApis.includes("fashion"), description: "Analyze fashion trends, top-selling apparel, and style reports." },
    { id: "healthcare", name: "Healthcare Data API", type: "Healthcare", owned: ownedApis.includes("healthcare"), description: "Retrieve medical research, pharmaceutical pricing, and health trends." },
    { id: "travel", name: "Travel Deals API", type: "Travel", owned: ownedApis.includes("travel"), description: "Find flight deals, hotel prices, and travel packages." }
  ];

  const industries = ["All", "Owned", ...new Set(proxyProducts.map(api => api.type))];

  const isLocked = !hasSubscription && !isTrial;

  const filteredProducts = useMemo(() => {
    return proxyProducts.filter(
      (product) =>
        (activeFilter === "all" ||
          (activeFilter === "owned" && product.owned) ||
          product.type === activeFilter) &&
        (!ownedOnly || product.owned) &&
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, ownedOnly, activeFilter, hasSubscription, isTrial]);

  return (
    <Container maxW="full">
      {/* Header Section */}
      <Box bg="blue.100" p={4} textAlign="center" borderRadius="md">
        <Text fontWeight="bold" fontSize="lg">🚀 Get a 3-day free trial of our APIs!</Text>
        <Button colorScheme="blue" size="sm" mt={2} onClick={() => navigate({ to: "/pricing" })}>
          Try Now
        </Button>
      </Box>

      {/* Filters & Toggles */}
      <Flex mt={6} gap={4} justify="space-between" align="center" flexWrap="wrap">
        {/* Welcome Message */}
        <Box textAlign="left" flex="1">
          <Text fontSize="xl" fontWeight="bold">
            Hi, {currentUser?.full_name || currentUser?.email} 👋🏼
          </Text>
          <Text fontSize="sm">Welcome back, let’s get started!</Text>
        </Box>

        {/* Subscription Toggles */}
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

      <Divider my={4} />

      {/* Search, Filters, and Sorting */}
      <Flex mt={6} gap={4} justify="space-between" align="center" flexWrap="wrap">
        <Input
          placeholder="Search APIs..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          w={{ base: "100%", md: "300px" }}
        />
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
        <Select value={sortOption} onChange={(e) => setSortOption(e.target.value)} w="200px">
          <option value="name">Sort by Name</option>
          <option value="price">Sort by Price</option>
          <option value="rating">Sort by Rating</option>
        </Select>
      </Flex>

      <Divider my={4} />

      {/* API List */}
      <VStack spacing={6} mt={6} align="stretch">
        {filteredProducts.length === 0 ? (
          <Text textAlign="center" fontSize="lg" color="gray.500">No APIs match this filter.</Text>
        ) : (
          <List spacing={4}>
            {filteredProducts.map((api) => (
              <motion.div key={api.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                <ListItem p={5} shadow="md" borderWidth="1px" borderRadius="lg" bg="gray.50" _hover={{ shadow: "lg", transform: "scale(1.02)" }} transition="0.2s ease-in-out">
                  <Tooltip label={api.description} hasArrow>
                    <Text fontWeight="bold">{api.name} {api.owned ? `(Owned by ${currentUser?.full_name || "You"})` : ""}</Text>
                  </Tooltip>
                  <Button mt={3} size="sm" colorScheme="blue" borderRadius="full" onClick={() => navigate({ to: "/explore/" + api.id })}>
                    Explore
                  </Button>
                </ListItem>
              </motion.div>
            ))}
          </List>
        )}
      </VStack>
    </Container>
  );
};

export const Route = createFileRoute("/_layout/search-api/explore")({ component: Explore });

export default Explore;
