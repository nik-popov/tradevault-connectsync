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
  TabPanels,
  Tooltip,
  Select,
  useColorMode,
  IconButton,
} from "@chakra-ui/react";
import { createFileRoute } from '@tanstack/react-router';
import { useQueryClient } from '@tanstack/react-query';
import { FiSearch, FiMoon, FiSun } from 'react-icons/fi';
import { motion } from "framer-motion";

const Explore = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const [searchQuery, setSearchQuery] = useState("");
  const [ownedOnly, setOwnedOnly] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");
  const [hasSubscription, setHasSubscription] = useState(false);
  const [isTrial, setIsTrial] = useState(false);
  const [isDeactivated, setIsDeactivated] = useState(false);
  const [sortOption, setSortOption] = useState("name");

  const queryClient = useQueryClient();
  const currentUser = queryClient.getQueryData(["currentUser"]);
  const ownedApis = currentUser?.ownedApis || [];

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

  const industries = [...new Set(apis.map((api) => api.type))];

  const isLocked = !hasSubscription && !isTrial;

  // **Filter & Sort Logic**
  const filteredResults = useMemo(() => {
    let filtered = apis.filter(api => 
      (!ownedOnly || api.owned) &&
      (activeFilter === "all" || api.type === activeFilter) &&
      api.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // **Sorting Logic**
    return filtered.sort((a, b) => {
      if (sortOption === "name") return a.name.localeCompare(b.name);
      if (sortOption === "price") return parseFloat(a.price.replace(/\D/g, "")) - parseFloat(b.price.replace(/\D/g, ""));
      if (sortOption === "rating") return b.rating - a.rating;
    });
  }, [searchQuery, ownedOnly, activeFilter, sortOption]);

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
          <IconButton
            icon={colorMode === "light" ? <FiMoon /> : <FiSun />}
            onClick={toggleColorMode}
            variant="ghost"
            aria-label="Toggle Dark Mode"
          />
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
            <Select value={sortOption} onChange={(e) => setSortOption(e.target.value)} w="200px">
              <option value="name">Sort by Name</option>
              <option value="price">Sort by Price</option>
              <option value="rating">Sort by Rating</option>
            </Select>
            <Button leftIcon={<FiSearch />} colorScheme="blue">Search</Button>
          </Flex>
          <Divider my={4} />

          <Tabs variant="enclosed">
            <TabList>
              <Tab onClick={() => setActiveFilter("all")}>All</Tab>
              {industries.map((industry, index) => (
                <Tab key={index} onClick={() => setActiveFilter(industry)}>{industry}</Tab>
              ))}
            </TabList>
            <TabPanels>
              {filteredResults.map((api) => (
                <motion.div key={api.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                  <ListItem p={3} shadow="sm" borderWidth="1px" borderRadius="md">
                    <Tooltip label={api.description} hasArrow>
                      <Text fontWeight="bold">{api.name} {api.owned ? "(Owned)" : ""}</Text>
                    </Tooltip>
                  </ListItem>
                </motion.div>
              ))}
            </TabPanels>
          </Tabs>
        </>
      )}
    </Container>
  );
};

export const Route = createFileRoute("/_layout/search-api/explore")({ component: Explore });

export default Explore;
