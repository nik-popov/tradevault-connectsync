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
import { FiSend, FiGithub } from "react-icons/fi";

export const Route = createFileRoute("/_layout/scraping-api/explore")({
  component: Explore,
});

function Explore() {
  const queryClient = useQueryClient();
  const currentUser = queryClient.getQueryData(["currentUser"]);
  const navigate = useNavigate();

  if (!currentUser) {
    return (
      <Container maxW="full">
        <Alert status="warning" borderRadius="md">
          <AlertIcon />
          <Text>Loading user data...</Text>
        </Alert>
      </Container>
    );
  }

  // ✅ Subscription & Trial State
  const [hasSubscription, setHasSubscription] = useState(false);
  const [isTrial, setIsTrial] = useState(false);
  const [isDeactivated, setIsDeactivated] = useState(false);
  const [ownedOnly, setOwnedOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [sortOption, setSortOption] = useState("name");
  const [hoveredApi, setHoveredApi] = useState(null); // ✅ Track API being hovered
  const [expandedApi, setExpandedApi] = useState(null); // ✅ Track API being expanded

  const ownedApis = currentUser?.ownedApis || [];
  const isLocked = !hasSubscription && !isTrial;
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
  ];

  const industries = ["All", "owned", ...new Set(proxyProducts.map((api) => api.type))];

  // 🔄 Filtered List Logic
  const filteredProducts = useMemo(() => {
    return proxyProducts.filter((product) => {
      const matchesFilter =
        activeFilter === "all" || product.type.toLowerCase() === activeFilter.toLowerCase();
      const matchesOwned = !ownedOnly || product.owned;
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesFilter && matchesOwned && matchesSearch;
    });
  }, [searchQuery, ownedOnly, activeFilter]);

  return (
    <Container maxW="full">
      {/* 🔄 Title with Debug Toggles */}
      <Flex justify="space-between" align="center" my={4} flexWrap="wrap">
        <Heading size="lg">Explore APIs</Heading>

        {/* Debugging Toggles */}
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

      <Flex gap={6} mt={6}>
        <Box flex="1">
          {isLocked ? (
            <Alert status="warning" borderRadius="md">
              <AlertIcon />
              <Text>You need a subscription or trial to explore APIs.</Text>
            </Alert>
          ) : isFullyDeactivated ? (
            <Alert status="error" borderRadius="md">
              <AlertIcon />
              <Flex justify="space-between" align="center" w="full">
                <Text>Your subscription has been deactivated. Please renew to continue using the API services.</Text>
                <Button colorScheme="red" onClick={() => setHasSubscription(true)}>
                  Reactivate Now
                </Button>
              </Flex>
            </Alert>
          ) : (
            <>
              {/* ✅ API Explorer */}
              <Flex gap={4} justify="space-between" align="center" flexWrap="wrap">
                <Input
                  placeholder="Search APIs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  w={{ base: "100%", md: "300px" }}
                />

                <Select value={sortOption} onChange={(e) => setSortOption(e.target.value)} w="200px">
                  <option value="name">Sort by Name</option>
                </Select>
              </Flex>

              <Stack direction="row" spacing={3} mt={4}>
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

              <Divider my={4} />

              <VStack spacing={4} mt={6} align="stretch">
                {filteredProducts.length === 0 ? (
                  <Text textAlign="center" fontSize="lg" color="gray.500">
                    No APIs match this filter.
                  </Text>
                ) : (
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
                          <Button size="sm" colorScheme="blue" onClick={() => navigate(`/scraping-api/${api.id}`)}>
                            Manage
                          </Button>
                        </Flex>

                        <Collapse in={hoveredApi === api.id}>
                          <Text mt={2} fontSize="xs" color="gray.500">
                            {api.details.endpoint}
                          </Text>
                        </Collapse>
                      </ListItem>
                    ))}
                  </List>
                )}
              </VStack>
            </>
          )}
        </Box>
      </Flex>
    </Container>
  );
}

export default Explore;
