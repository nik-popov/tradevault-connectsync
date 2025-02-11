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
import { FiExternalLink, FiX } from "react-icons/fi";
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
    {
      id: "carbon-emissions",
      name: "Carbon Emissions",
      category: "environment",
      description: "Global carbon emission data.",
      details: {
        endpoint: "/datasets/carbon-emissions",
        example: `GET /datasets/carbon-emissions?sector=industry`,
      },
    },
    {
      id: "stock-market",
      name: "Stock Market Data",
      category: "finance",
      description: "Real-time stock market information.",
      details: {
        endpoint: "/datasets/stock-market",
        example: `GET /datasets/stock-market?symbol=AAPL`,
      },
    },
    {
      id: "flight-data",
      name: "Flight Statistics",
      category: "transportation",
      description: "Global flight statistics.",
      details: {
        endpoint: "/datasets/flight-data",
        example: `GET /datasets/flight-data?airline=Delta`,
      },
    },
    {
      id: "streaming-trends",
      name: "Streaming Content Trends",
      category: "entertainment",
      description: "Popular content trends.",
      details: {
        endpoint: "/datasets/streaming-trends",
        example: `GET /datasets/streaming-trends?platform=Netflix`,
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
    <Container maxW="full">
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
        <Flex gap={6}>
          <Box flex="1">
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
          {/* Sidebar */}
          <Box w="250px" p="4" borderLeft="1px solid #E2E8F0">
          <VStack spacing="4" align="stretch">
            <Box p="4" shadow="sm" borderWidth="1px" borderRadius="lg">
              <Text fontWeight="bold">Quick Actions</Text>
              <Button
                as="a"
                href="mailto:support@thedataproxy.com"
                leftIcon={<FiMail />}
                variant="outline"
                size="sm"
                mt="2"
              >
                Email Support
              </Button>
              <Button
                as="a"
                href="https://dashboard.thedataproxy.com"
                leftIcon={<FiHelpCircle />}
                variant="outline"
                size="sm"
                mt="2"
              >
                Report an Issue
              </Button>
            </Box>

            <Box p="4" shadow="sm" borderWidth="1px" borderRadius="lg">
              <Text fontWeight="bold">FAQs</Text>
              <Text fontSize="sm">Common questions and answers.</Text>
              <Button as="a" href="/faqs" mt="2" size="sm" variant="outline">
                View FAQs
              </Button>
            </Box>

            <Box p="4" shadow="sm" borderWidth="1px" borderRadius="lg">
              <Text fontWeight="bold">Community Support</Text>
              <Text fontSize="sm">Join discussions with other users.</Text>
              <Button
                as="a"
                href="https://github.com/CobaltDataNet"
                mt="2"
                leftIcon={<FiGithub />}
                size="sm"
                variant="outline"
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

// Dataset list item component with an expand/collapse toggle and locked "View" button when in trial mode.
const DatasetListItem = ({ dataset, navigate, isTrial }) => {
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
          <Button
            size="sm"
            colorScheme="blue"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? "Less" : "More"}
          </Button>
          {isTrial ? (
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
                _hover: { bg: "gray.200" },
              }}
            >
              Locked
            </Button>
          ) : (
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
                _hover: { bg: "gray.200" },
              }}
            >
              Locked
            </Button>
          )}
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
