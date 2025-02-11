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
import { FiExternalLink, FiX, FiGithub } from "react-icons/fi";
import PromoSERP from "../../../components/PromoSERP";

export const Route = createFileRoute("/_layout/scraper-api/explore")({
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
        <Flex gap={6} justify="space-between" align="stretch" wrap="wrap">
          <Box flex="1" minW={{ base: "100%", md: "65%" }}>
            <VStack spacing={4} mt={6} align="stretch">
              {filteredAPIs.map((api) => (
                <Box key={api.id} p={4} borderWidth="1px" borderRadius="lg">
                  <Flex justify="space-between" align="center">
                    <Box>
                      <Text fontWeight="bold">{api.name}</Text>
                      <Text fontSize="sm" color="gray.600">{api.description}</Text>
                    </Box>
                    <HStack spacing={2}>
                      <Button size="sm" colorScheme="blue" onClick={() => navigate(`/scraper-api/${api.id}`)} isDisabled={api.isLocked}>
                        {api.isLocked ? "Locked" : "View"}
                      </Button>
                    </HStack>
                  </Flex>
                </Box>
              ))}
            </VStack>
          </Box>
        </Flex>
      )}
    </Container>
  );
}

export default Explore;
