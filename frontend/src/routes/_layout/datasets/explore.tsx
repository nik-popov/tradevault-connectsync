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
  Alert,
  AlertIcon,
  HStack,
  Input,
  Heading,
  Collapse,
} from "@chakra-ui/react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { FiGithub, FiX } from "react-icons/fi";
import PromoDatasets from "../../../components/PromoDatasets";
import SubscriptionManagement from "../../../components/UserSettings/SubscriptionManagement";

// Storage and Product Key
const STORAGE_KEY = "subscriptionSettings";
const PRODUCT = "Datasets"; // Define product-specific subscription management

export const Route = createFileRoute("/_layout/datasets/explore")({
  component: Explore,
});

function Explore() {
  const navigate = useNavigate();

  // ✅ Load Subscription State using useQuery
  const { data: subscriptionSettings } = useQuery({
    queryKey: ["subscriptionSettings"],
    queryFn: () => {
      const storedSettings = localStorage.getItem(STORAGE_KEY);
      return storedSettings ? JSON.parse(storedSettings) : {};
    },
    staleTime: Infinity,
  });

  const settings = subscriptionSettings?.[PRODUCT] || {
    hasSubscription: false,
    isTrial: false,
    isDeactivated: false,
  };

  const { hasSubscription, isTrial, isDeactivated } = settings;
  const isLocked = !hasSubscription && !isTrial;
  const isFullyDeactivated = isDeactivated && !hasSubscription;

  // 🔍 Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  // 🔍 Mock Dataset Data (Replace with API Fetched Data)
  const datasets = [
    {
      id: "internet-speeds",
      name: "Internet Speed Tests",
      category: "technology",
      description: "Global internet speed and connectivity metrics by region.",
      details: {
        endpoint: "/datasets/internet-speeds",
        example: "GET /datasets/internet-speeds?country=SouthKorea",
      },
    },
    {
      id: "covid-statistics",
      name: "COVID-19 Statistics",
      category: "health",
      description: "Comprehensive COVID-19 case data, vaccinations, and variants.",
      details: {
        endpoint: "/datasets/covid-statistics",
        example: "GET /datasets/covid-statistics?country=USA",
      },
    },
  ];

  const categories = ["all", ...new Set(datasets.map((ds) => ds.category))];

  // 🔄 Filtered Dataset List
  const filteredDatasets = useMemo(() => {
    return datasets.filter((dataset) => {
      const matchesFilter =
        activeFilter === "all" ||
        dataset.category.toLowerCase() === activeFilter.toLowerCase();
      const matchesSearch = dataset.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [searchQuery, activeFilter, datasets]);

  return (
    <Container maxW="full" overflowX="hidden">
      {/* 🔄 Title with Subscription Management */}
      <Flex justify="space-between" align="center" my={4} flexWrap="wrap">
        <Heading size="lg">Explore Datasets</Heading>
        <SubscriptionManagement product={PRODUCT} />
      </Flex>

      <Divider my={4} />

      {/* 🚨 No Subscription - Show Promo */}
      {isLocked ? (
        <PromoDatasets />
      ) : isFullyDeactivated ? (
        <Alert status="error" borderRadius="md">
          <AlertIcon />
          <Flex justify="space-between" align="center" w="full">
            <Text>Your subscription has been deactivated. Please renew to access datasets.</Text>
            <Button colorScheme="red" onClick={() => navigate("/billing")}>
              Reactivate Now
            </Button>
          </Flex>
        </Alert>
      ) : (
        <Flex gap={6} justify="space-between" align="stretch" wrap="wrap">
          <Box flex="1" minW={{ base: "100%", md: "65%" }}>
            <Flex gap={4} justify="space-between" align="center" flexWrap="wrap">
              <Input
                placeholder="Search Datasets..."
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
              {filteredDatasets.map((dataset) => (
                <DatasetListItem key={dataset.id} dataset={dataset} isTrial={isTrial} />
              ))}
            </VStack>
          </Box>

          {/* ✅ Sidebar */}
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

// ✅ Dataset list item component with expand/collapse toggle
const DatasetListItem = ({ dataset, isTrial }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Box p={4} borderWidth="1px" borderRadius="lg">
      <Flex justify="space-between" align="center">
        <Box>
          <Text fontWeight="bold">{dataset.name}</Text>
          <Text fontSize="sm" color="gray.600">
            {dataset.description}
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
            disabled={!isTrial}
            leftIcon={<FiX />}
            _hover={{ bg: "gray.200", cursor: isTrial ? "pointer" : "not-allowed" }}
            _disabled={{
              bg: "gray.200",
              borderColor: "gray.200",
              color: "gray.500",
              cursor: "not-allowed",
            }}
          >
            {isTrial ? "Try" : "Locked"}
          </Button>
        </HStack>
      </Flex>
      <Collapse in={isExpanded} animateOpacity>
        <Box mt={4} p={2} borderWidth="1px" borderRadius="md">
          <Text fontSize="sm" color="gray.600">
            <strong>Endpoint:</strong> {dataset.details.endpoint}
          </Text>
          <Text fontSize="sm" color="gray.600">
            <strong>Example:</strong> {dataset.details.example}
          </Text>
        </Box>
      </Collapse>
    </Box>
  );
};

export default Explore;
