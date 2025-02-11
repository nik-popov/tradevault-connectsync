import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  Container,
  Text,
  VStack,
  Button,
  Divider,
  Flex,
  Switch,
  HStack,
  Input,
  Heading,
  Collapse,
  Alert,
  AlertIcon,
  List,
  ListItem,
  Select,
} from "@chakra-ui/react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { FiSend, FiGithub, FiExternalLink } from "react-icons/fi";
import PromoSERP from "../../../components/PromoSERP";
import { FiX } from "react-icons/fi";
export const Route = createFileRoute("/_layout/scraping-api/explore")({
  component: Explore,
});

function Explore() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // ✅ Load Subscription Settings from LocalStorage & React Query
  const [subscriptionSettings, setSubscriptionSettings] = useState({
    hasSubscription: false,
    isTrial: false,
    isDeactivated: false,
  });

  useEffect(() => {
    const storedSettings = localStorage.getItem("subscriptionSettings");
    if (storedSettings) {
      setSubscriptionSettings(JSON.parse(storedSettings));
    } else {
      const querySettings = queryClient.getQueryData("subscriptionSettings");
      if (querySettings) {
        setSubscriptionSettings(querySettings);
      }
    }
  }, [queryClient]);

  const { hasSubscription, isTrial, isDeactivated } = subscriptionSettings;
  const isLocked = !hasSubscription && !isTrial;
  const isFullyDeactivated = isDeactivated && !hasSubscription;

  // 🔍 Search, Filter, and Sort State
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [sortOption, setSortOption] = useState("name");

  // 🛠️ Mock API Data
  const proxyProducts = [
    { id: "google-serp-api", name: "Google Search API", type: "search", description: "Fetches real-time search results from Google." },
    { id: "bing-serp-api", name: "Bing Search API", type: "search", description: "Provides search results from Bing, including images and news." },
    { id: "real-estate-api", name: "Real Estate Data API", type: "real estate", description: "Get property listings, pricing trends, and analytics." },
    { id: "weather-api", name: "Weather Data API", type: "weather", description: "Provides real-time and forecasted weather data." },
    { id: "twitter-api", name: "Twitter Data API", type: "social media", description: "Fetches tweets, trends, and user data from Twitter." },
    { id: "linkedin-api", name: "LinkedIn Scraping API", type: "social media", description: "Scrapes public LinkedIn profiles, job postings, and company data." },
    { id: "amazon-product-api", name: "Amazon Product API", type: "ecommerce", description: "Fetches product details, reviews, and price history from Amazon." },
    { id: "stock-market-api", name: "Stock Market API", type: "finance", description: "Fetches real-time and historical stock market data." },
    { id: "news-api", name: "News Aggregation API", type: "news", description: "Aggregates top news headlines from various sources." },
    { id: "jobs-api", name: "Job Listings API", type: "jobs", description: "Fetches job postings, salaries, and company reviews." },
  ];

  const industries = ["all", ...new Set(proxyProducts.map((api) => api.type))];

  // 🔄 Filtered API List
  const filteredProducts = useMemo(() => {
    return proxyProducts.filter((product) => {
      const matchesFilter = activeFilter === "all" || product.type.toLowerCase() === activeFilter.toLowerCase();
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [searchQuery, activeFilter, proxyProducts]);

  return (
    <Container maxW="full">
      {/* 🔄 Title & Debugging Toggles */}
      <Flex justify="space-between" align="center" my={4} flexWrap="wrap">
        <Heading size="lg">Explore APIs</Heading>
        <HStack spacing={6}>
          <HStack>
            <Text fontWeight="bold">Subscription:</Text>
            <Switch isChecked={hasSubscription} isDisabled />
          </HStack>
          <HStack>
            <Text fontWeight="bold">Trial Mode:</Text>
            <Switch isChecked={isTrial} isDisabled />
          </HStack>
          <HStack>
            <Text fontWeight="bold">Deactivated:</Text>
            <Switch isChecked={isDeactivated} isDisabled />
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
            <Button colorScheme="red">Reactivate Now</Button>
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

              <HStack spacing={2}>
                {industries.map((type) => (
                  <Button
                    key={type}
                    size="sm"
                    fontWeight="bold"
                    borderRadius="full"
                    colorScheme={activeFilter === type ? "blue" : "gray"}
                    variant={activeFilter === type ? "solid" : "outline"}
                    onClick={() => setActiveFilter(type)}
                  >
                    {type}
                  </Button>
                ))}
              </HStack>

              <Select value={sortOption} onChange={(e) => setSortOption(e.target.value)} w="200px">
                <option value="name">Sort by Name</option>
              </Select>
            </Flex>

            <VStack spacing={4} mt={6} align="stretch">
              {/* Instead of a List, we map over filteredProducts using a custom component */}
              {filteredProducts.map((api) => (
                <ApiListItem key={api.id} api={api} navigate={navigate} isTrial={isTrial} />
              ))}
            </VStack>
          </Box>

          {/* ✅ Sidebar */}
          <Box w="250px" p={4} borderLeft="1px solid #E2E8F0">
            <VStack spacing={4} align="stretch">
              <Box p={4} shadow="sm" borderWidth="1px" borderRadius="lg">
                <Text fontWeight="bold">How It Works</Text>
                <Text fontSize="sm">Explore various APIs and integrate them easily.</Text>
              </Box>
              <Box p={4} shadow="sm" borderWidth="1px" borderRadius="lg">
                <Text fontWeight="bold">Need Help?</Text>
                <Text fontSize="sm">Contact support for assistance.</Text>
              </Box>
            </VStack>
          </Box>
        </Flex>
      )}
    </Container>
  );
}

// Component for individual API list items
const ApiListItem = ({ api, navigate, isTrial }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Box p={4} borderWidth="1px" borderRadius="lg">
      <Flex justify="space-between" align="center">
        <Box>
          <Text fontWeight="bold">{api.name}</Text>
          <Text fontSize="sm" color="gray.600">{api.description}</Text>
        </Box>
        <HStack spacing={2}>
          <Button size="sm" colorScheme="blue" onClick={() => setIsExpanded(!isExpanded)}>
            {isExpanded ? "Less" : "More"}
          </Button>


          <Button
  size="sm"
  variant="outline"
  colorScheme="gray"
  disabled
  leftIcon={<FiX />}
  _hover={{ bg: "gray.200", cursor: "not-allowed" }} // Ensures no hover effect change
  _disabled={{
    bg: "gray.200",
    color: "gray.500",
    cursor: "not-allowed",
    _hover: { bg: "gray.200" }, // Cancel any hover effect while disabled
  }}
>
  Locked
</Button>

        </HStack>
      </Flex>
      <Collapse in={isExpanded} animateOpacity>
        <Box mt={4} p={2} borderWidth="1px" borderRadius="md">
          <Text fontSize="sm">
            Additional details about {api.name} and integration instructions can be placed here.
          </Text>
        </Box>
      </Collapse>
    </Box>
  );
};

export default Explore;
