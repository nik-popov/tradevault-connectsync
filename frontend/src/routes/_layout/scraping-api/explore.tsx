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

export const Route = createFileRoute("/_layout/scraping-api/explore")({
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

  // 🔍 Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [sortOption, setSortOption] = useState("name");

  // 🛠️ API Data
  const proxyProducts = [
    { id: "google-serp-api", name: "Google Search API", type: "search", description: "Fetches real-time search results from Google." },
    { id: "linkedin-api", name: "LinkedIn Scraping API", type: "social media", description: "Scrapes public LinkedIn profiles, job postings, and company data." },
    { id: "amazon-product-api", name: "Amazon Product API", type: "ecommerce", description: "Fetches product details, reviews, and price history from Amazon." },
  ];

  const industries = ["all", ...new Set(proxyProducts.map((api) => api.type))];

  // 🔄 Filtered API List
  const filteredProducts = useMemo(() => {
    return proxyProducts.filter((product) => {
      const matchesFilter = activeFilter === "all" || product.type.toLowerCase() === activeFilter.toLowerCase();
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [searchQuery, activeFilter]);

  return (
    <Container maxW="full" overflowX="hidden">
      {/* 🔄 Title & Subscription Toggles */}
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
        <Flex mt={6} gap={6} justify="space-between" align="stretch" wrap="wrap">
          {/* 🔍 API Explorer */}
          <Box flex="1" minW={{ base: "100%", md: "65%" }}>
            <Flex gap={4} justify="space-between" align="center" flexWrap="wrap">
              <Input
                placeholder="Search APIs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                w={{ base: "100%", md: "250px" }}
              />
              <Select value={sortOption} onChange={(e) => setSortOption(e.target.value)} w="200px">
                <option value="name">Sort by Name</option>
              </Select>
            </Flex>

            <VStack spacing={4} mt={6} align="stretch">
              {filteredProducts.map((api) => (
                <ApiListItem key={api.id} api={api} navigate={navigate} isTrial={isTrial} />
              ))}
            </VStack>
          </Box>

          {/* ✅ Sidebar */}
          <Box w={{ base: "100%", md: "250px" }} p="4" borderLeft={{ md: "1px solid #E2E8F0" }}>
            <VStack spacing="4" align="stretch">
              <Box p="4" shadow="sm" borderWidth="1px" borderRadius="lg">
                <Text fontWeight="bold">Quick Actions</Text>
                <Button as="a" href="mailto:support@thedataproxy.com" leftIcon={<FiExternalLink />} variant="outline" size="sm" mt="2">
                  Email Support
                </Button>
              </Box>
            </VStack>
          </Box>
        </Flex>
      )}
    </Container>
  );
}

// ✅ API List Item Component with all buttons
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
            variant="solid"
            colorScheme="green"
            leftIcon={<FiSend />}
            onClick={() => navigate(`/scraping-api/${api.id}`)}
          >
            View
          </Button>
          {isTrial && (
            <Button
              size="sm"
              variant="outline"
              colorScheme="gray"
              disabled
              leftIcon={<FiX />}
              _hover={{ bg: "gray.200", cursor: "not-allowed" }}
              _disabled={{
                bg: "gray.200",
                borderColor: "gray.200",
                color: "gray.500",
                cursor: "not-allowed",
              }}
            >
              Locked
            </Button>
          )}
        </HStack>
      </Flex>
      <Collapse in={isExpanded} animateOpacity>
        <Box mt={4} p={2} borderWidth="1px" borderRadius="md">
          <Text fontSize="sm">Additional details about {api.name}.</Text>
        </Box>
      </Collapse>
    </Box>
  );
};

export default Explore;
