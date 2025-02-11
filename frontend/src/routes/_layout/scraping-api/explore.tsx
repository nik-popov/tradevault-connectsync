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

  // ✅ Load Subscription State from LocalStorage & React Query
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

  // 🔍 Mock API Data
  const apis = [
    {
      id: "google-serp-api",
      name: "Google Search API",
      category: "search",
      description: "Fetches real-time search results from Google.",
      details: {
        endpoint: "/apis/google-serp",
        example: `GET /apis/google-serp?query=OpenAI`,
      },
    },
    {
      id: "linkedin-api",
      name: "LinkedIn Scraping API",
      category: "social media",
      description: "Scrapes public LinkedIn profiles, job postings, and company data.",
      details: {
        endpoint: "/apis/linkedin",
        example: `GET /apis/linkedin?profile_id=12345`,
      },
    },
    {
      id: "amazon-product-api",
      name: "Amazon Product API",
      category: "ecommerce",
      description: "Fetches product details, reviews, and price history from Amazon.",
      details: {
        endpoint: "/apis/amazon-product",
        example: `GET /apis/amazon-product?product_id=B08L5VG4RZ`,
      },
    },
  ];

  const categories = ["all", ...new Set(apis.map((api) => api.category))];

  // 🔄 Filtered API List
  const filteredAPIs = useMemo(() => {
    return apis.filter((api) => {
      const matchesFilter = activeFilter === "all" || api.category.toLowerCase() === activeFilter.toLowerCase();
      const matchesSearch = api.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [searchQuery, activeFilter, apis]);

  return (
    <Container maxW="full" overflowX="hidden">
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

      {isLocked ? (
        <PromoDatasets />
      ) : isFullyDeactivated ? (
        <Alert status="error" borderRadius="md">
          <AlertIcon />
          <Flex justify="space-between" align="center" w="full">
            <Text>
              Your subscription has been deactivated. Please renew to access APIs.
            </Text>
            <Button colorScheme="red" onClick={() => navigate("/billing")}>
              Reactivate Now
            </Button>
          </Flex>
        </Alert
      ) : (
        <Flex gap={6} justify="space-between" align="stretch" wrap="wrap">
          <Box flex="1" minW={{ base: "100%", md: "65%" }}>
            <Flex gap={4} justify="space-between" align="center" flexWrap="wrap">
              <Input
                placeholder="Search APIs..."
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

            <VStack spacing={4} mt={6} align="stretch">
              {filteredAPIs.map((api) => (
                <APIListItem
                  key={api.id}
                  api={api}
                  navigate={navigate}
                  isTrial={isTrial}
                />
              ))}
            </VStack>
          </Box>

          <Box w={{ base: "100%", md: "250px" }} p="4" borderLeft={{ md: "1px solid #E2E8F0" }}>
            <VStack spacing="4" align="stretch">
              <Box p="4" shadow="sm" borderWidth="1px" borderRadius="lg">
                <Text fontWeight="bold">Quick Actions</Text>
                <Button
                  as="a"
                  href="https://github.com/CobaltDataNet"
                  leftIcon={<FiGithub />}
                  variant="outline"
                  size="sm"
                  mt="2"
                >
                  GitHub Discussions
                </Button>
              </Box>
            </VStack>
          </Box>
        </Flex>
      )}
    </Container>
  );
}

// ✅ API list item component with expand/collapse toggle
const APIListItem = ({ api, navigate, isTrial }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Box p="4" borderWidth="1px" borderRadius="lg">
      <Flex justify="space-between" align="center">
        <Box>
          <Text fontWeight="bold">{api.name}</Text
          <Text fontSize="sm" color="gray.600">
            {api.description}
          </Text>
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
        </HStack>
      </Flex>
      <Collapse in={isExpanded} animateOpacity>
        <Box mt="4" p="2" borderWidth="1px" borderRadius="md">
          <Text fontSize="sm" color="gray.600">
            <strong>Endpoint:</strong> {api.details.endpoint}
          </Text>
          <Text fontSize="sm" color="gray.600">
            <strong>Example:</strong> {api.details.example}
          </Text>
        </Box>
      </Collapse>
    </Box>
  );
};

export default Explore;
