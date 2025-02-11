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
  Select,
} from "@chakra-ui/react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { FiExternalLink, FiX, FiGithub } from "react-icons/fi";
import PromoDatasets from "../../../components/PromoDatasets";

export const Route = createFileRoute("/_layout/datasets/explore")({
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

  // 🔍 Mock Dataset Data
  const datasets = [
    {
      id: "internet-speeds",
      name: "Internet Speed Tests",
      category: "technology",
      description: "Global internet speed data.",
      details: {
        endpoint: "/datasets/internet-speeds",
        example: `GET /datasets/internet-speeds?country=SouthKorea`,
      },
    },
    {
      id: "cybersecurity-incidents",
      name: "Cybersecurity Incidents",
      category: "technology",
      description: "Global cybersecurity breach statistics.",
      details: {
        endpoint: "/datasets/cybersecurity-incidents",
        example: `GET /datasets/cybersecurity-incidents?type=ransomware`,
      },
    },
    {
      id: "covid-statistics",
      name: "COVID-19 Statistics",
      category: "health",
      description: "Global COVID-19 data.",
      details: {
        endpoint: "/datasets/covid-statistics",
        example: `GET /datasets/covid-statistics?country=USA`,
      },
    },
  ];

  const categories = ["all", "owned", ...new Set(datasets.map((ds) => ds.category))];

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
      <Flex justify="space-between" align="center" my={4} flexWrap="wrap">
        <Heading size="lg">Explore Datasets</Heading>
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
              Your subscription has been deactivated. Please renew to access datasets.
            </Text>
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
                <DatasetListItem
                  key={dataset.id}
                  dataset={dataset}
                  navigate={navigate}
                  isTrial={isTrial}
                />
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
