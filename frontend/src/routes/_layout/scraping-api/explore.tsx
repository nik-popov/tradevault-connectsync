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
} from "@chakra-ui/react";
import { createFileRoute } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { FiSend, FiGithub } from "react-icons/fi";
import PromoSERP from "../../../components/PromoSERP"; // ✅ Ensure PromoSERP is imported

export const Route = createFileRoute("/_layout/scraping-api/explore")({
  component: Explore,
});

function Explore() {
  const queryClient = useQueryClient();
  const currentUser = queryClient.getQueryData(["currentUser"]);

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
  const [isDeactivated, setIsDeactivated] = useState(false); // ✅ Fixed: Deactivation state now works properly
  const [ownedOnly, setOwnedOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [sortOption, setSortOption] = useState("name");

  const ownedApis = currentUser?.ownedApis || [];
  const isLocked = !hasSubscription && !isTrial;
  const isTrialMode = isTrial && !hasSubscription;
  const isFullyDeactivated = isDeactivated && !hasSubscription; // ✅ Now properly checks for a deactivated account

  // 🔍 Mock API Data
  const proxyProducts = [
    { id: "google", name: "Google Search API", type: "search", owned: ownedApis.includes("google"), description: "Fetches real-time search results from Google." },
    { id: "bing", name: "Bing Search API", type: "search", owned: ownedApis.includes("bing"), description: "Provides search results from Bing, including images and news." },
    { id: "real-estate", name: "Real Estate Data API", type: "real estate", owned: ownedApis.includes("real-estate"), description: "Get property listings, pricing trends, and real estate analytics." },
    { id: "finance", name: "Financial Data API", type: "finance", owned: ownedApis.includes("finance"), description: "Access stock market trends, forex rates, and economic indicators." },
  ];

  const industries = ["All", "owned", ...new Set(proxyProducts.map(api => api.type))];

  // 🔄 Filtered List Logic
  const filteredProducts = useMemo(() => {
    return proxyProducts.filter((product) => {
      const matchesFilter = activeFilter === "all" || product.type.toLowerCase() === activeFilter.toLowerCase();
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
          {/* 🚨 Show Locked Message */}
          {isLocked ? (
            <>
              <Alert status="warning" borderRadius="md">
                <AlertIcon />
                <Text>You need a subscription or trial to explore APIs.</Text>
              </Alert>
              <PromoSERP /> {/* ✅ Promo Content Under Alert */}
            </>
          ) : isFullyDeactivated ? ( // ✅ Fixed: This correctly detects deactivated users
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
                <Input placeholder="Search APIs..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} w={{ base: "100%", md: "300px" }} />
                
                <Select value={sortOption} onChange={(e) => setSortOption(e.target.value)} w="200px" isDisabled={isTrialMode}>
                  <option value="name">Sort by Name</option>
                  <option value="price">Sort by Price</option>
                  <option value="rating">Sort by Rating</option>
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
                    isDisabled={isTrialMode}
                  >
                    {type}
                  </Button>
                ))}
              </Stack>

              <Divider my={4} />

              <VStack spacing={6} mt={6} align="stretch">
                {filteredProducts.length === 0 ? (
                  <Text textAlign="center" fontSize="lg" color="gray.500">No APIs match this filter.</Text>
                ) : (
                  <List spacing={4}>
                    {filteredProducts.map((api) => (
                      <ListItem key={api.id}>
                        <Text fontWeight="bold">{api.name}</Text>
                        <Text fontSize="sm" color="gray.600">{api.description}</Text>
                      </ListItem>
                    ))}
                  </List>
                )}
              </VStack>
            </>
          )}
        </Box>

        {/* ✅ Sidebar */}
        <Box w="250px" p={4} borderLeft="1px solid #E2E8F0">
          <VStack spacing={4} align="stretch">
            <Box p={4} shadow="sm" borderWidth="1px" borderRadius="lg">
              <Text fontWeight="bold">Pick by Your Target</Text>
              <Button mt={2} leftIcon={<FiSend />} size="sm" variant="outline">
                Send Test Request
              </Button>
            </Box>
            <Box p={4} shadow="sm" borderWidth="1px" borderRadius="lg">
              <Text fontWeight="bold">GitHub</Text>
              <Button mt={2} leftIcon={<FiGithub />} size="sm" variant="outline">
                Join GitHub
              </Button>
            </Box>
          </VStack>
        </Box>
      </Flex>
    </Container>
  );
}

export default Explore;
