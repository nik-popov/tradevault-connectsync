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
  Heading,
  Collapse,
} from "@chakra-ui/react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";

export const Route = createFileRoute("/_layout/apis/explore")({
  component: Explore,
});

function Explore() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [subscriptionSettings, setSubscriptionSettings] = useState({
    hasSubscription: false,
    isTrial: false,
    isDeactivated: false,
  });

  useEffect(() => {
    console.log("Checking local storage and react-query for subscription settings");
    const storedSettings = localStorage.getItem("subscriptionSettings");
    if (storedSettings) {
      console.log("Found settings in local storage");
      setSubscriptionSettings(JSON.parse(storedSettings));
    } else {
      console.log("Fetching settings from react-query");
      const querySettings = queryClient.getQueryData("subscriptionSettings");
      if (querySettings) {
        setSubscriptionSettings(querySettings);
      }
    }
  }, [queryClient]);

  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  const scraperAPIs = useMemo(() => {
    console.log("Filtering APIs");
    return [
      { id: "google-serp-api", name: "Google Search API", category: "search", description: "Fetches real-time search results from Google.", isLocked: false },
      { id: "linkedin-api", name: "LinkedIn Scraping API", category: "social media", description: "Scrapes public LinkedIn profiles, job postings, and company data.", isLocked: true },
      { id: "amazon-product-api", name: "Amazon Product API", category: "ecommerce", description: "Fetches product details, reviews, and price history from Amazon.", isLocked: true },
    ].filter(api => {
      const matchesFilter = activeFilter === "all" || api.category.toLowerCase() === activeFilter.toLowerCase();
      const matchesSearch = api.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [searchQuery, activeFilter]);

  return (
    <Container maxW="full">
      <Heading size="lg">Explore Scraper APIs</Heading>
      <Divider my={4} />
      <Flex gap={4}>
        <Input
          placeholder="Search APIs..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {scraperAPIs.map(api => (
          <Box key={api.id}>
            <Text>{api.name}</Text>
            <Button onClick={() => navigate(`/apis/${api.id}`)}>View Details</Button>
          </Box>
        ))}
      </Flex>
    </Container>
  );
}

export default Explore;
