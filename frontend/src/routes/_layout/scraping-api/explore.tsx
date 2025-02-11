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
  Select,
} from "@chakra-ui/react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { FiSend, FiGithub, FiExternalLink, FiX } from "react-icons/fi";
import PromoSERP from "../../../components/PromoSERP";

export const Route = createFileRoute("/_layout/scraper-api/explore")({
  component: Explore,
});

function Explore() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // ✅ Load Subscription Settings
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

  // 🛠️ API Data
  const scraperProducts = [
    { id: "google-serp-api", name: "Google Search API", type: "search", description: "Fetches real-time search results from Google.", isLocked: false },
    { id: "linkedin-api", name: "LinkedIn Scraping API", type: "social media", description: "Scrapes public LinkedIn profiles, job postings, and company data.", isLocked: true },
    { id: "amazon-product-api", name: "Amazon Product API", type: "ecommerce", description: "Fetches product details, reviews, and price history from Amazon.", isLocked: true },
  ];

  const categories = ["all", ...new Set(scraperProducts.map((api) => api.type))];

  // 🔄 Filtered API List
  const filteredProducts = useMemo(() => {
    return scraperProducts.filter((product) => {
      const matchesFilter =
        activeFilter === "all" || product.type.toLowerCase() === activeFilter.toLowerCase();
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [searchQuery, activeFilter, scraperProducts]);

  return (
    <Container maxW="full" overflowX="hidden">
      <Flex justify="space-between" align="center" my={4} flexWrap="wrap">
        <Heading size="lg">Explore Scraper APIs</Heading>
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
        <Flex mt={6} gap={6} justify="space-between" align="stretch" wrap="wrap">
          <Box flex="1" minW={{ base: "100%", md: "65%" }}>
            <Flex gap={4} justify="space-between" align="center" flexWrap="wrap">
              <Input
                placeholder="Search Scraper APIs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                w={{ base: "100%", md: "250px" }}
              />
              <HStack spacing={2}>
                {categories.map((type) => (
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
            </Flex>
          </Box>
        </Flex>
      )}
    </Container>
  );
}

export default Explore;