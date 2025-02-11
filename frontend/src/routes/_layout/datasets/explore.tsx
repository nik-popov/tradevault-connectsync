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
import { FiExternalLink, FiGithub } from "react-icons/fi";
import PromoDatasets from "../../../components/PromoDatasets";

export const Route = createFileRoute("/_layout/datasets/explore")({
  component: Explore,
});

function Explore() {
  const queryClient = useQueryClient();
  const currentUser = queryClient.getQueryData(["currentUser"]);
  const navigate = useNavigate();

  // ✅ Subscription & Trial State
  const [hasSubscription, setHasSubscription] = useState(false);
  const [isTrial, setIsTrial] = useState(false);
  const [isDeactivated, setIsDeactivated] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [sortOption, setSortOption] = useState("name");
  const [hoveredDataset, setHoveredDataset] = useState(null);

  const ownedDatasets = currentUser?.ownedDatasets || [];
  const isLocked = !hasSubscription && !isTrial;
  const isTrialMode = isTrial && hasSubscription;
  const isFullyDeactivated = isDeactivated && !hasSubscription;

  // 🔍 Mock Dataset Data
  const datasets = [
  {
    id: "smartphone-usage",
    name: "Smartphone Usage Statistics",
    category: "technology",
    owned: ownedDatasets.includes("smartphone-usage"),
    description: "Mobile device usage patterns and trends.",
    details: {
      endpoint: "/datasets/smartphone-usage",
      example: `GET /datasets/smartphone-usage?region=Asia`,
    },
  },
  {
    id: "internet-speeds",
    name: "Internet Speed Tests",
    category: "technology",
    owned: ownedDatasets.includes("internet-speeds"),
    description: "Global internet speed and connectivity data.",
    details: {
      endpoint: "/datasets/internet-speeds",
      example: `GET /datasets/internet-speeds?country=SouthKorea`,
    },
  },
  {
    id: "cloud-computing",
    name: "Cloud Computing Usage",
    category: "technology",
    owned: ownedDatasets.includes("cloud-computing"),
    description: "Cloud service adoption and usage statistics.",
    details: {
      endpoint: "/datasets/cloud-computing",
      example: `GET /datasets/cloud-computing?service=AWS`,
    },
  },
  {
    id: "cybersecurity-incidents",
    name: "Cybersecurity Incidents",
    category: "technology",
    owned: ownedDatasets.includes("cybersecurity-incidents"),
    description: "Global cybersecurity breach statistics.",
    details: {
      endpoint: "/datasets/cybersecurity-incidents",
      example: `GET /datasets/cybersecurity-incidents?type=ransomware`,
    },
  },
  {
    id: "ai-adoption",
    name: "AI Technology Adoption",
    category: "technology",
    owned: ownedDatasets.includes("ai-adoption"),
    description: "AI implementation across industries.",
    details: {
      endpoint: "/datasets/ai-adoption",
      example: `GET /datasets/ai-adoption?sector=healthcare`,
    },
  },

  // Health Category (4 entries)
  {
    id: "covid-statistics",
    name: "COVID-19 Statistics",
    category: "health",
    owned: ownedDatasets.includes("covid-statistics"),
    description: "Global COVID-19 cases and vaccination rates.",
    details: {
      endpoint: "/datasets/covid-statistics",
      example: `GET /datasets/covid-statistics?country=USA`,
    },
  },
  {
    id: "mental-health",
    name: "Mental Health Statistics",
    category: "health",
    owned: ownedDatasets.includes("mental-health"),
    description: "Mental health trends and statistics.",
    details: {
      endpoint: "/datasets/mental-health",
      example: `GET /datasets/mental-health?condition=anxiety`,
    },
  },
  {
    id: "vaccination-rates",
    name: "Vaccination Statistics",
    category: "health",
    owned: ownedDatasets.includes("vaccination-rates"),
    description: "Global vaccination coverage and trends.",
    details: {
      endpoint: "/datasets/vaccination-rates",
      example: `GET /datasets/vaccination-rates?vaccine=Influenza`,
    },
  },
  {
    id: "healthcare-costs",
    name: "Healthcare Costs",
    category: "health",
    owned: ownedDatasets.includes("healthcare-costs"),
    description: "Medical treatment and insurance costs.",
    details: {
      endpoint: "/datasets/healthcare-costs",
      example: `GET /datasets/healthcare-costs?procedure=surgery`,
    },
  },

  // Environment Category (4 entries)
  {
    id: "air-quality",
    name: "Air Quality Index",
    category: "environment",
    owned: ownedDatasets.includes("air-quality"),
    description: "Real-time air quality measurements.",
    details: {
      endpoint: "/datasets/air-quality",
      example: `GET /datasets/air-quality?city=Beijing`,
    },
  },
  {
    id: "carbon-emissions",
    name: "Carbon Emissions",
    category: "environment",
    owned: ownedDatasets.includes("carbon-emissions"),
    description: "Global carbon emission measurements.",
    details: {
      endpoint: "/datasets/carbon-emissions",
      example: `GET /datasets/carbon-emissions?sector=industry`,
    },
  },
  {
    id: "water-quality",
    name: "Water Quality Data",
    category: "environment",
    owned: ownedDatasets.includes("water-quality"),
    description: "Water quality measurements from water bodies.",
    details: {
      endpoint: "/datasets/water-quality",
      example: `GET /datasets/water-quality?location=GreatLakes`,
    },
  },
  {
    id: "waste-management",
    name: "Waste Management Statistics",
    category: "environment",
    owned: ownedDatasets.includes("waste-management"),
    description: "Global waste production and recycling data.",
    details: {
      endpoint: "/datasets/waste-management",
      example: `GET /datasets/waste-management?city=Tokyo`,
    },
  },

  // Finance Category (4 entries)
  {
    id: "stock-market",
    name: "Stock Market Data",
    category: "finance",
    owned: ownedDatasets.includes("stock-market"),
    description: "Real-time stock market information.",
    details: {
      endpoint: "/datasets/stock-market",
      example: `GET /datasets/stock-market?symbol=AAPL`,
    },
  },
  {
    id: "cryptocurrency",
    name: "Cryptocurrency Data",
    category: "finance",
    owned: ownedDatasets.includes("cryptocurrency"),
    description: "Cryptocurrency prices and trading volumes.",
    details: {
      endpoint: "/datasets/cryptocurrency",
      example: `GET /datasets/cryptocurrency?coin=Bitcoin`,
    },
  },
  {
    id: "forex-rates",
    name: "Foreign Exchange Rates",
    category: "finance",
    owned: ownedDatasets.includes("forex-rates"),
    description: "Global currency exchange rates.",
    details: {
      endpoint: "/datasets/forex-rates",
      example: `GET /datasets/forex-rates?currency=EUR`,
    },
  },
  {
    id: "investment-funds",
    name: "Investment Fund Performance",
    category: "finance",
    owned: ownedDatasets.includes("investment-funds"),
    description: "Mutual and hedge fund performance data.",
    details: {
      endpoint: "/datasets/investment-funds",
      example: `GET /datasets/investment-funds?type=mutual`,
    },
  },

  // Transportation Category (4 entries)
  {
    id: "global-traffic",
    name: "Global Traffic Data",
    category: "transportation",
    owned: ownedDatasets.includes("global-traffic"),
    description: "Traffic data from major cities worldwide.",
    details: {
      endpoint: "/datasets/global-traffic",
      example: `GET /datasets/global-traffic?city=LosAngeles`,
    },
  },
  {
    id: "public-transportation",
    name: "Public Transportation Usage",
    category: "transportation",
    owned: ownedDatasets.includes("public-transportation"),
    description: "Public transit ridership metrics.",
    details: {
      endpoint: "/datasets/public-transportation",
      example: `GET /datasets/public-transportation?city=London`,
    },
  },
  {
    id: "flight-data",
    name: "Flight Statistics",
    category: "transportation",
    owned: ownedDatasets.includes("flight-data"),
    description: "Global flight routes and airline performance.",
    details: {
      endpoint: "/datasets/flight-data",
      example: `GET /datasets/flight-data?airline=Delta`,
    },
  },
  {
    id: "electric-vehicles",
    name: "Electric Vehicle Adoption",
    category: "transportation",
    owned: ownedDatasets.includes("electric-vehicles"),
    description: "Electric vehicle sales and infrastructure.",
    details: {
      endpoint: "/datasets/electric-vehicles",
      example: `GET /datasets/electric-vehicles?country=Norway`,
    },
  },

  {
    id: "streaming-trends",
    name: "Streaming Content Trends",
    category: "entertainment",
    owned: ownedDatasets.includes("streaming-trends"),
    description: "Popular content across streaming platforms.",
    details: {
      endpoint: "/datasets/streaming-trends",
      example: `GET /datasets/streaming-trends?platform=Netflix`,
    },
  },
  {
    id: "music-charts",
    name: "Music Charts Data",
    category: "entertainment",
    owned: ownedDatasets.includes("music-charts"),
    description: "Music popularity and streaming statistics.",
    details: {
      endpoint: "/datasets/music-charts",
      example: `GET /datasets/music-charts?country=UK`,
    },
  },
  {
    id: "gaming-statistics",
    name: "Gaming Industry Data",
    category: "entertainment",
    owned: ownedDatasets.includes("gaming-statistics"),
    description: "Video game sales and player statistics.",
    details: {
      endpoint: "/datasets/gaming-statistics",
      example: `GET /datasets/gaming-statistics?platform=PlayStation`,
    },
  },
  {
    id: "box-office",
    name: "Box Office Revenue",
    category: "entertainment",
    owned: ownedDatasets.includes("box-office"),
    description: "Movie theater revenue and attendance.",
    details: {
      endpoint: "/datasets/box-office",
      example: `GET /datasets/box-office?region=NorthAmerica`,
    },
  },

  // Education Category (4 entries)
  {
    id: "education-statistics",
    name: "Education Statistics",
    category: "education",
    owned: ownedDatasets.includes("education-statistics"),
    description: "Global education metrics and indicators.",
    details: {
      endpoint: "/datasets/education-statistics",
      example: `GET /datasets/education-statistics?country=Finland`,
    },
  },
  {
    id: "online-learning",
    name: "Online Learning Analytics",
    category: "education",
    owned: ownedDatasets.includes("online-learning"),
    description: "E-learning platform usage statistics.",
    details: {
      endpoint: "/datasets/online-learning",
      example: `GET /datasets/online-learning?platform=Coursera`,
    },
  },
  {
    id: "student-performance",
    name: "Student Performance Metrics",
    category: "education",
    owned: ownedDatasets.includes("student-performance"),
    description: "Academic performance statistics.",
    details: {
      endpoint: "/datasets/student-performance",
      example: `GET /datasets/student-performance?grade=highschool`,
    },
  },
  {
    id: "education-spending",
    name: "Education Spending",
    category: "education",
    owned: ownedDatasets.includes("education-spending"),
    description: "Educational institution funding data.",
    details: {
      endpoint: "/datasets/education-spending",
      example: `GET /datasets/education-spending?level=university`,
    },
  },

  {
    id: "real-estate-prices",
    name: "Real Estate Prices",
    category: "real-estate",
    owned: ownedDatasets.includes("real-estate-prices"),
    description: "Property values and market trends.",
    details: {
      endpoint: "/datasets/real-estate-prices",
      example: `GET /datasets/real-estate-prices?city=SanFrancisco`,
    },
  },
  {
    id: "housing-starts",
    name: "Housing Construction Data",
    category: "real-estate",
    owned: ownedDatasets.includes("housing-starts"),
    description: "New housing construction statistics.",
    details: {
      endpoint: "/datasets/housing-starts",
      example: `GET /datasets/housing-starts?region=Northeast`,
    },
  },
  {
    id: "rental-market",
    name: "Rental Market Data",
    category: "real-estate",
    owned: ownedDatasets.includes("rental-market"),
    description: "Rental prices and occupancy rates.",
    details: {
      endpoint: "/datasets/rental-market",
      example: `GET /datasets/rental-market?city=Berlin`,
    },
  },
  {
    id: "commercial-property",
    name: "Commercial Property Data",
    category: "real-estate",
    owned: ownedDatasets.includes("commercial-property"),
    description: "Commercial real estate market statistics.",
    details: {
      endpoint: "/datasets/commercial-property",
      example: `GET /datasets/commercial-property?type=office`,
    },
  },

  // Energy Category (4 entries)
  {
    id: "renewable-energy",
    name: "Renewable Energy Production",
    category: "energy",
    owned: ownedDatasets.includes("renewable-energy"),
    description: "Global renewable energy production data.",
    details: {
      endpoint: "/datasets/renewable-energy",
      example: `GET /datasets/renewable-energy?type=solar`,
    },
  },
  {
    id: "energy-consumption",
    name: "Energy Consumption Data",
    category: "energy",
    owned: ownedDatasets.includes("energy-consumption"),
    description: "Global energy usage statistics.",
    details: {
      endpoint: "/datasets/energy-consumption",
      example: `GET /datasets/energy-consumption?sector=residential`,
    },
  },
  {
    id: "power-grid",
    name: "Power Grid Statistics",
    category: "energy",
    owned: ownedDatasets.includes("power-grid"),
    description: "Electricity grid performance data.",
    details: {
      endpoint: "/datasets/power-grid",
      example: `GET /datasets/power-grid?region=Texas`,
    },
  },
  {
    id: "energy-prices",
    name: "Energy Price Data",
    category: "energy",
    owned: ownedDatasets.includes("energy-prices"),
    description: "Global energy price tracking.",
    details: {
      endpoint: "/datasets/energy-prices",
      example: `GET /datasets/energy-prices?type=electricity`,
    },
  },
  {
    id: "startup-funding",
    name: "Startup Funding Data",
    category: "business",
    owned: ownedDatasets.includes("startup-funding"),
    description: "Venture capital and startup funding.",
    details: {
      endpoint: "/datasets/startup-funding",
      example: `GET /datasets/startup-funding?sector=fintech`,
    },
  },
  {
    id: "corporate-earnings",
    name: "Corporate Earnings",
    category: "business",
    owned: ownedDatasets.includes("corporate-earnings"),
    description: "Company financial performance data.",
    details: {
      endpoint: "/datasets/corporate-earnings",
      example: `GET /datasets/corporate-earnings?sector=tech`,
    },
  },
  {
    id: "market-research",
    name: "Market Research Data",
    category: "business",
    owned: ownedDatasets.includes("market-research"),
    description: "Consumer behavior and market trends.",
    details: {
      endpoint: "/datasets/market-research",
      example: `GET /datasets/market-research?industry=retail`,
    },
  }
  ];

  const categories = ["all", "owned", ...new Set(datasets.map((ds) => ds.category))];

  const filteredDatasets = useMemo(() => {
    return datasets.filter((dataset) => {
      const matchesFilter =
        activeFilter === "all" || dataset.category.toLowerCase() === activeFilter.toLowerCase();
      const matchesSearch = dataset.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [searchQuery, activeFilter]);

  return (
    <Container maxW="full">
      <Flex justify="space-between" align="center" my={4} flexWrap="wrap">
        <Heading size="lg">Explore Datasets</Heading>
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

      {isLocked ? (
        <PromoDatasets />
      ) : isFullyDeactivated ? (
        <Alert status="error" borderRadius="md">
          <AlertIcon />
          <Flex justify="space-between" align="center" w="full">
            <Text>Your subscription has been deactivated. Please renew to access datasets.</Text>
            <Button colorScheme="red" onClick={() => setHasSubscription(true)}>Reactivate Now</Button>
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
              {!isTrialMode && (
                <>
                  <HStack spacing={2}>
                    {categories.map((type) => (
                      <Button
                        key={type}
                        size="sm"
                        fontWeight="bold"
                        borderRadius="full"
                        colorScheme={activeFilter === type ? "blue" : "gray"}
                        variant={activeFilter === type ? "solid" : "outline"}
                        textTransform="lowercase"
                        onClick={() => setActiveFilter(type)}
                      >
                        {type}
                      </Button>
                    ))}
                  </HStack>
                  <Select value={sortOption} onChange={(e) => setSortOption(e.target.value)} w="200px">
                    <option value="name">Sort by Name</option>
                  </Select>
                </>
              )}
            </Flex>

            <VStack spacing={4} mt={6} align="stretch">
              <List spacing={4}>
                {filteredDatasets.map((dataset) => (
                  <ListItem
                    key={dataset.id}
                    p={4}
                    borderWidth="1px"
                    borderRadius="lg"
                    onMouseEnter={() => setHoveredDataset(dataset.id)}
                    onMouseLeave={() => setHoveredDataset(null)}
                  >
                    <Flex justify="space-between" align="center">
                      <Box>
                        <Text fontWeight="bold">{dataset.name}</Text>
                        <Text fontSize="sm" color="gray.600">{dataset.description}</Text>
                      </Box>
                      <Button size="sm" colorScheme="blue" rightIcon={<FiExternalLink />} onClick={() => navigate(`/datasets/${dataset.id}`)}>View</Button>
                    </Flex>
                    <Collapse in={hoveredDataset === dataset.id}>
                      <Box mt={2} p={2} bg="gray.100" borderRadius="md">
                        <Text fontSize="xs"><strong>Endpoint:</strong> {dataset.details.endpoint}</Text>
                        <Text fontSize="xs"><strong>Example:</strong> {dataset.details.example}</Text>
                      </Box>
                    </Collapse>
                  </ListItem>
                ))}
              </List>
            </VStack>
          </Box>
        </Flex>
      )}
    </Container>
  );
}

export default Explore;