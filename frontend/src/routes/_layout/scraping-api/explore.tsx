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
  List,
  Alert,
  AlertIcon,
  HStack,
  Input,
  Heading,
  Collapse,
} from "@chakra-ui/react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { FiExternalLink, FiX, FiGithub } from "react-icons/fi";
import PromoDatasets from "../../../components/PromoDatasets";

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

  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  const scraperAPIs = [
    {
      id: "google-serp-api",
      name: "Google Search API",
      category: "search",
      description: "Fetches real-time search results from Google.",
      isLocked: false,
    },
    {
      id: "linkedin-api",
      name: "LinkedIn Scraping API",
      category: "social media",
      description: "Scrapes public LinkedIn profiles, job postings, and company data.",
      isLocked: true,
    },
    {
      id: "amazon-product-api",
      name: "Amazon Product API",
      category: "ecommerce",
      description: "Fetches product details, reviews, and price history from Amazon.",
      isLocked: true,
    },
  ];

  const categories = ["all", ...new Set(scraperAPIs.map((api) => api.category))];

  const filteredAPIs = useMemo(() => {
    return scraperAPIs.filter((api) => {
      const matchesFilter =
        activeFilter === "all" || api.category.toLowerCase() === activeFilter.toLowerCase();
      const matchesSearch = api.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [searchQuery, activeFilter, scraperAPIs]);

  return (
    <Container maxW="full" overflowX="hidden">
      <Flex justify="space-between" align="center" my={4} flexWrap="wrap">
        <Heading size="lg">Explore Scraper APIs</Heading>
      </Flex>

      <Divider my={4} />

      <Flex gap={6} justify="space-between" align="stretch" wrap="wrap">
        <Box flex="1" minW={{ base: "100%", md: "65%" }}>
          <VStack spacing={4} mt={6} align="stretch">
            {filteredAPIs.map((api) => (
              <APIListItem key={api.id} api={api} navigate={navigate} />
            ))}
          </VStack>
        </Box>
      </Flex>
    </Container>
  );
}

const APIListItem = ({ api, navigate }) => {
  return (
    <Box p={4} borderWidth="1px" borderRadius="lg">
      <Flex justify="space-between" align="center">
        <Box>
          <Text fontWeight="bold">{api.name}</Text>
          <Text fontSize="sm" color="gray.600">{api.description}</Text>
        </Box>
        <HStack spacing={2}>
          <Button size="sm" colorScheme="blue" onClick={() => navigate(`/apis/${api.id}`)}>View Details</Button>
          <Button size="sm" variant="outline" colorScheme={api.isLocked ? "gray" : "blue"} isDisabled={api.isLocked}>
            {api.isLocked ? "Locked" : "Access"}
          </Button>
        </HStack>
      </Flex>
    </Box>
  );
};

export default Explore;
