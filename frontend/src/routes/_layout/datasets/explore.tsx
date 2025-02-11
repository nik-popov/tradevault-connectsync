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
  // TECHNOLOGY & DIGITAL
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
    id: "cybersecurity-incidents",
    name: "Cybersecurity Incidents",
    category: "technology",
    description: "Comprehensive database of global cybersecurity breaches and attacks.",
    details: {
      endpoint: "/datasets/cybersecurity-incidents",
      example: "GET /datasets/cybersecurity-incidents?type=ransomware",
    },
  },
  {
    id: "cloud-usage",
    name: "Cloud Computing Usage",
    category: "technology",
    description: "Enterprise cloud adoption and usage patterns worldwide.",
    details: {
      endpoint: "/datasets/cloud-usage",
      example: "GET /datasets/cloud-usage?provider=AWS",
    },
  },

  // HEALTH & MEDICAL
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
  {
    id: "global-health-metrics",
    name: "Global Health Indicators",
    category: "health",
    description: "WHO health metrics and population health statistics.",
    details: {
      endpoint: "/datasets/health-metrics",
      example: "GET /datasets/health-metrics?indicator=life_expectancy",
    },
  },
  {
    id: "medical-research",
    name: "Clinical Trials Database",
    category: "health",
    description: "Global database of clinical trials and research outcomes.",
    details: {
      endpoint: "/datasets/clinical-trials",
      example: "GET /datasets/clinical-trials?condition=cancer",
    },
  },

  // CLIMATE & ENVIRONMENT
  {
    id: "climate-data",
    name: "Climate Measurements",
    category: "environment",
    description: "Historical climate data and environmental measurements.",
    details: {
      endpoint: "/datasets/climate",
      example: "GET /datasets/climate?location=Arctic&metric=temperature",
    },
  },
  {
    id: "pollution-metrics",
    name: "Global Pollution Data",
    category: "environment",
    description: "Air quality and pollution measurements worldwide.",
    details: {
      endpoint: "/datasets/pollution",
      example: "GET /datasets/pollution?city=Beijing",
    },
  },
  {
    id: "renewable-energy",
    name: "Renewable Energy Statistics",
    category: "environment",
    description: "Global renewable energy adoption and capacity data.",
    details: {
      endpoint: "/datasets/renewable-energy",
      example: "GET /datasets/renewable-energy?country=Germany&type=solar",
    },
  },

  // ECONOMIC INDICATORS
  {
    id: "gdp-data",
    name: "GDP Statistics",
    category: "economics",
    description: "Global GDP and economic growth indicators.",
    details: {
      endpoint: "/datasets/gdp",
      example: "GET /datasets/gdp?country=China&year=2023",
    },
  },
  {
    id: "employment-stats",
    name: "Employment Statistics",
    category: "economics",
    description: "Global employment rates and labor market data.",
    details: {
      endpoint: "/datasets/employment",
      example: "GET /datasets/employment?region=EU",
    },
  },
  {
    id: "inflation-metrics",
    name: "Inflation Data",
    category: "economics",
    description: "Global inflation rates and consumer price indices.",
    details: {
      endpoint: "/datasets/inflation",
      example: "GET /datasets/inflation?country=Japan",
    },
  },

  // DEMOGRAPHICS & POPULATION
  {
    id: "population-stats",
    name: "Population Statistics",
    category: "demographics",
    description: "Global population demographics and trends.",
    details: {
      endpoint: "/datasets/population",
      example: "GET /datasets/population?country=India",
    },
  },
  {
    id: "migration-patterns",
    name: "Migration Patterns",
    category: "demographics",
    description: "International migration flows and patterns.",
    details: {
      endpoint: "/datasets/migration",
      example: "GET /datasets/migration?destination=Canada",
    },
  },
  {
    id: "urbanization-metrics",
    name: "Urbanization Data",
    category: "demographics",
    description: "Global urbanization trends and city growth data.",
    details: {
      endpoint: "/datasets/urbanization",
      example: "GET /datasets/urbanization?continent=Asia",
    },
  },

  // EDUCATION & RESEARCH
  {
    id: "education-metrics",
    name: "Education Statistics",
    category: "education",
    description: "Global education metrics and academic performance data.",
    details: {
      endpoint: "/datasets/education",
      example: "GET /datasets/education?country=Finland",
    },
  },
  {
    id: "research-output",
    name: "Research Publications",
    category: "education",
    description: "Academic research output and citation metrics.",
    details: {
      endpoint: "/datasets/research",
      example: "GET /datasets/research?field=AI",
    },
  },

  // TRANSPORTATION & INFRASTRUCTURE
  {
    id: "traffic-patterns",
    name: "Traffic Analysis",
    category: "transportation",
    description: "Urban traffic patterns and congestion data.",
    details: {
      endpoint: "/datasets/traffic",
      example: "GET /datasets/traffic?city=London",
    },
  },
  {
    id: "public-transit",
    name: "Public Transit Usage",
    category: "transportation",
    description: "Public transportation utilization statistics.",
    details: {
      endpoint: "/datasets/transit",
      example: "GET /datasets/transit?system=NYC_Subway",
    },
  },

  // AGRICULTURE & FOOD
  {
    id: "crop-production",
    name: "Agricultural Production",
    category: "agriculture",
    description: "Global crop production and agricultural yields.",
    details: {
      endpoint: "/datasets/agriculture",
      example: "GET /datasets/agriculture?crop=wheat",
    },
  },
  {
    id: "food-security",
    name: "Food Security Metrics",
    category: "agriculture",
    description: "Global food security and nutrition data.",
    details: {
      endpoint: "/datasets/food-security",
      example: "GET /datasets/food-security?region=Africa",
    },
  },

  // ENERGY & UTILITIES
  {
    id: "energy-consumption",
    name: "Energy Usage Statistics",
    category: "energy",
    description: "Global energy consumption patterns.",
    details: {
      endpoint: "/datasets/energy",
      example: "GET /datasets/energy?sector=industrial",
    },
  },
  {
    id: "power-grid",
    name: "Power Grid Data",
    category: "energy",
    description: "Electricity grid performance and reliability metrics.",
    details: {
      endpoint: "/datasets/power-grid",
      example: "GET /datasets/power-grid?country=France",
    },
  },

  // SOCIAL TRENDS
  {
    id: "social-media-trends",
    name: "Social Media Analytics",
    category: "social",
    description: "Global social media usage and trend data.",
    details: {
      endpoint: "/datasets/social-trends",
      example: "GET /datasets/social-trends?platform=Instagram",
    },
  },
  {
    id: "digital-behavior",
    name: "Digital Behavior Patterns",
    category: "social",
    description: "Online behavior and digital consumption trends.",
    details: {
      endpoint: "/datasets/digital-behavior",
      example: "GET /datasets/digital-behavior?demographic=GenZ",
    },
  }
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
