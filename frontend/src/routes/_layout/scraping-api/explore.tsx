import React, { useState, useMemo } from "react";
import {
  Box,
  Container,
  Text,
  VStack,
  Button,
  Divider,
  Flex,
  Switch,
  List,
  ListItem,
  Select,
  Alert,
  AlertIcon,
  HStack,
  Input,
  Heading,
  Stack,
  Collapse,
} from "@chakra-ui/react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { FiSend, FiGithub, FiExternalLink } from "react-icons/fi";
import PromoSERP from "../../../components/PromoSERP";

export const Route = createFileRoute("/_layout/scraping-api/explore")({
  component: Explore,
});

function Explore() {
  const queryClient = useQueryClient();
  const currentUser = queryClient.getQueryData(["currentUser"]);
  const navigate = useNavigate();

  // ✅ Subscription & Trial State
  const [hasSubscription, setHasSubscription] = useState(false);
  const [isTrial, setIsTrial] = useState(false);
  const [isDeactivated, setIsDeactivated] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [sortOption, setSortOption] = useState("name");
  const [hoveredApi, setHoveredApi] = useState(null);

  const ownedApis = currentUser?.ownedApis || [];
  const isLocked = !hasSubscription && !isTrial;
  const isTrialMode = isTrial && !hasSubscription;
  const isFullyDeactivated = isDeactivated && !hasSubscription;

  // 🔍 Mock API Data
  const proxyProducts = [
    {
      id: "google-serp-api",
      name: "Google Search API",
      type: "search",
      owned: ownedApis.includes("google-serp-api"),
      description: "Fetches real-time search results from Google.",
      details: {
        endpoint: "/scraping-api/google-serp-api",
        example: `GET /scraping-api/google-serp-api?query=OpenAI`,
      },
    },
    {
      id: "bing-serp-api",
      name: "Bing Search API",
      type: "search",
      owned: ownedApis.includes("bing-serp-api"),
      description: "Provides search results from Bing, including images and news.",
      details: {
        endpoint: "/scraping-api/bing-serp-api",
        example: `GET /scraping-api/bing-serp-api?query=AI Trends`,
      },
    },
    {
      id: "real-estate-api",
      name: "Real Estate Data API",
      type: "real estate",
      owned: ownedApis.includes("real-estate-api"),
      description: "Get property listings, pricing trends, and real estate analytics.",
      details: {
        endpoint: "/scraping-api/real-estate-api",
        example: `GET /scraping-api/real-estate-api?location=NewYork`,
      },
    },
    {
      id: "weather-api",
      name: "Weather Data API",
      type: "weather",
      owned: ownedApis.includes("weather-api"),
      description: "Provides real-time and forecasted weather data.",
      details: {
        endpoint: "/scraping-api/weather-api",
        example: `GET /scraping-api/weather-api?city=SanFrancisco`,
      },
    },
    {
      id: "twitter-api",
      name: "Twitter Data API",
      type: "social media",
      owned: ownedApis.includes("twitter-api"),
      description: "Fetches tweets, trends, and user data from Twitter.",
      details: {
        endpoint: "/scraping-api/twitter-api",
        example: `GET /scraping-api/twitter-api?hashtag=AI`,
      },
    },
    {
      id: "linkedin-api",
      name: "LinkedIn Scraping API",
      type: "social media",
      owned: ownedApis.includes("linkedin-api"),
      description: "Scrapes public LinkedIn profiles, job postings, and company data.",
      details: {
        endpoint: "/scraping-api/linkedin-api",
        example: `GET /scraping-api/linkedin-api?company=Microsoft`,
      },
    },
    {
      id: "youtube-api",
      name: "YouTube Data API",
      type: "video",
      owned: ownedApis.includes("youtube-api"),
      description: "Retrieves video metadata, comments, and channel insights from YouTube.",
      details: {
        endpoint: "/scraping-api/youtube-api",
        example: `GET /scraping-api/youtube-api?videoId=dQw4w9WgXcQ`,
      },
    },
    {
      id: "amazon-product-api",
      name: "Amazon Product API",
      type: "ecommerce",
      owned: ownedApis.includes("amazon-product-api"),
      description: "Fetches product details, reviews, and price history from Amazon.",
      details: {
        endpoint: "/scraping-api/amazon-product-api",
        example: `GET /scraping-api/amazon-product-api?productId=B08N5WRWNW`,
      },
    },
    {
      id: "ebay-product-api",
      name: "eBay Product API",
      type: "ecommerce",
      owned: ownedApis.includes("ebay-product-api"),
      description: "Provides real-time product listings, bidding data, and seller info from eBay.",
      details: {
        endpoint: "/scraping-api/ebay-product-api",
        example: `GET /scraping-api/ebay-product-api?query=Smartphone`,
      },
    },
    {
      id: "stock-market-api",
      name: "Stock Market API",
      type: "finance",
      owned: ownedApis.includes("stock-market-api"),
      description: "Fetches real-time and historical stock market data.",
      details: {
        endpoint: "/scraping-api/stock-market-api",
        example: `GET /scraping-api/stock-market-api?ticker=AAPL`,
      },
    },
    {
      id: "crypto-api",
      name: "Cryptocurrency API",
      type: "finance",
      owned: ownedApis.includes("crypto-api"),
      description: "Provides real-time cryptocurrency prices, trends, and market analysis.",
      details: {
        endpoint: "/scraping-api/crypto-api",
        example: `GET /scraping-api/crypto-api?symbol=BTC`,
      },
    },
    {
      id: "news-api",
      name: "News Aggregation API",
      type: "news",
      owned: ownedApis.includes("news-api"),
      description: "Aggregates top news headlines from various sources.",
      details: {
        endpoint: "/scraping-api/news-api",
        example: `GET /scraping-api/news-api?category=technology`,
      },
    },
    {
      id: "jobs-api",
      name: "Job Listings API",
      type: "jobs",
      owned: ownedApis.includes("jobs-api"),
      description: "Fetches job postings, salaries, and company reviews.",
      details: {
        endpoint: "/scraping-api/jobs-api",
        example: `GET /scraping-api/jobs-api?position=SoftwareEngineer`,
      },
    },
    {
      id: "hotel-api",
      name: "Hotel Pricing API",
      type: "travel",
      owned: ownedApis.includes("hotel-api"),
      description: "Compares hotel prices and availability from multiple booking platforms.",
      details: {
        endpoint: "/scraping-api/hotel-api",
        example: `GET /scraping-api/hotel-api?location=Paris`,
      },
    },
    {
      id: "flight-api",
      name: "Flight Data API",
      type: "travel",
      owned: ownedApis.includes("flight-api"),
      description: "Fetches real-time flight data, pricing, and availability.",
      details: {
        endpoint: "/scraping-api/flight-api",
        example: `GET /scraping-api/flight-api?route=NYC-LAX`,
      },
    },
    {
      id: "restaurant-api",
      name: "Restaurant Reviews API",
      type: "food",
      owned: ownedApis.includes("restaurant-api"),
      description: "Provides restaurant reviews, menus, and ratings.",
      details: {
        endpoint: "/scraping-api/restaurant-api",
        example: `GET /scraping-api/restaurant-api?city=Chicago`,
      },
    },
    {
      id: "app-store-api",
      name: "App Store Data API",
      type: "mobile",
      owned: ownedApis.includes("app-store-api"),
      description: "Fetches app rankings, reviews, and developer details from the App Store.",
      details: {
        endpoint: "/scraping-api/app-store-api",
        example: `GET /scraping-api/app-store-api?appId=284882215`,
      },
    },
    {
      id: "play-store-api",
      name: "Google Play Store API",
      type: "mobile",
      owned: ownedApis.includes("play-store-api"),
      description: "Fetches app data, reviews, and rankings from Google Play.",
      details: {
        endpoint: "/scraping-api/play-store-api",
        example: `GET /scraping-api/play-store-api?appId=com.whatsapp`,
      },
    },
    {
      id: "github-api",
      name: "GitHub Repository API",
      type: "developer",
      owned: ownedApis.includes("github-api"),
      description: "Retrieves repository metadata, commits, and pull requests from GitHub.",
      details: {
        endpoint: "/scraping-api/github-api",
        example: `GET /scraping-api/github-api?repo=openai/gpt-4`,
      },
    },
    {
      id: "stackoverflow-api",
      name: "Stack Overflow API",
      type: "developer",
      owned: ownedApis.includes("stackoverflow-api"),
      description: "Fetches top answers, questions, and user insights from Stack Overflow.",
      details: {
        endpoint: "/scraping-api/stackoverflow-api",
        example: `GET /scraping-api/stackoverflow-api?query=JavaScript`,
      },
    },
  ];

  

  
    const industries = ["all", "owned", ...new Set(proxyProducts.map((api) => api.type))];
  
    // 🔄 Filtered API List
    const filteredProducts = useMemo(() => {
      return proxyProducts.filter((product) => {
        const matchesFilter =
          activeFilter === "all" || product.type.toLowerCase() === activeFilter.toLowerCase();
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
  
        return matchesFilter && matchesSearch;
      });
    }, [searchQuery, activeFilter]);
  
    return (
      <Container maxW="full">
        {/* 🔄 Title & Debugging Toggles */}
        <Flex justify="space-between" align="center" my={4} flexWrap="wrap">
          <Heading size="lg">Explore APIs</Heading>
  
          {/* DEV Debug Bar */}
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
  
        <Divider my={4} />
  
        {/* 🚨 No Subscription - Show Promo */}
        {isLocked ? (
          <PromoSERP />
        ) : isFullyDeactivated ? (
          <Alert status="error" borderRadius="md">
            <AlertIcon />
            <Flex justify="space-between" align="center" w="full">
              <Text>Your subscription has been deactivated. Please renew to explore APIs.</Text>
              <Button colorScheme="red" onClick={() => setHasSubscription(true)}>Reactivate Now</Button>
            </Flex>
          </Alert>
        ) : (
          <Flex gap={6}>
            {/* 🔍 API Explorer */}
            <Box flex="1">
              <Flex gap={4} justify="space-between" align="center" flexWrap="wrap">
                <Input
                  placeholder="Search APIs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  w={{ base: "100%", md: "250px" }}
                />
  
                {/* Filter Buttons */}
                <HStack spacing={2}>
                  {industries.map((type) => (
                    <Button
                      key={type}
                      size="sm"
                      fontWeight="bold"
                      borderRadius="full"
                      colorScheme={activeFilter === type ? "blue" : "gray"}
                      variant={activeFilter === type ? "solid" : "outline"}
                      textTransform="lowercase"
                      onClick={() => setActiveFilter(type)}
                    >
                      {type}
                    </Button>
                  ))}
                </HStack>
  
                {/* Sorting Dropdown */}
                {!isTrialMode && (
                  <Select value={sortOption} onChange={(e) => setSortOption(e.target.value)} w="200px">
                    <option value="name">Sort by Name</option>
                  </Select>
                )}
              </Flex>
  
              <VStack spacing={4} mt={6} align="stretch">
                <List spacing={4}>
                  {filteredProducts.map((api) => (
                    <ListItem
                      key={api.id}
                      p={4}
                      borderWidth="1px"
                      borderRadius="lg"
                      onMouseEnter={() => setHoveredApi(api.id)}
                      onMouseLeave={() => setHoveredApi(null)}
                    >
                      <Flex justify="space-between" align="center">
                        <Box>
                          <Text fontWeight="bold">{api.name}</Text>
                          <Text fontSize="sm" color="gray.600">{api.description}</Text>
                        </Box>
                        <Button size="sm" colorScheme="blue" rightIcon={<FiExternalLink />} onClick={() => navigate(`/scraping-api/${api.id}`)}>Manage</Button>
                      </Flex>
                      <Collapse in={hoveredApi === api.id}>
                        <Box mt={2} p={2} bg="gray.100" borderRadius="md">
                          <Text fontSize="xs"><strong>Endpoint:</strong> {api.details.endpoint}</Text>
                          <Text fontSize="xs"><strong>Example:</strong> {api.details.example}</Text>
                        </Box>
                      </Collapse>
                    </ListItem>
                  ))}
                </List>
              </VStack>
            </Box>
  
            {/* 📌 Sidebar */}
            <Box w="250px" p={4} borderLeft="1px solid #E2E8F0">
              <VStack spacing={4} align="stretch">
                <Box p={4} borderWidth="1px" borderRadius="lg">
                  <Text fontWeight="bold">Need Help?</Text>
                  <Text fontSize="sm">Contact support or visit our documentation.</Text>
                </Box>
                <Box p={4} borderWidth="1px" borderRadius="lg">
                  <Text fontWeight="bold">GitHub</Text>
                  <Button mt={2} leftIcon={<FiGithub />} size="sm" variant="outline">Join GitHub</Button>
                </Box>
              </VStack>
            </Box>
          </Flex>
        )}
      </Container>
    );
  }
  
  export default Explore;
  