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
import PromoSERP from "../../../components/PromoSERP";

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
        id: "global-traffic",
        name: "Global Traffic Data",
        category: "transportation",
        owned: ownedDatasets.includes("global-traffic"),
        description: "Comprehensive traffic data from major cities worldwide.",
        details: {
          endpoint: "/datasets/global-traffic",
          example: `GET /datasets/global-traffic?city=LosAngeles`,
        },
      },
      {
        id: "weather-forecasts",
        name: "Weather Forecasts",
        category: "climate",
        owned: ownedDatasets.includes("weather-forecasts"),
        description: "Real-time and predictive weather data.",
        details: {
          endpoint: "/datasets/weather-forecasts",
          example: `GET /datasets/weather-forecasts?city=NewYork`,
        },
      },
      {
        id: "stock-market",
        name: "Stock Market Data",
        category: "finance",
        owned: ownedDatasets.includes("stock-market"),
        description: "Historical and real-time stock market information.",
        details: {
          endpoint: "/datasets/stock-market",
          example: `GET /datasets/stock-market?symbol=AAPL`,
        },
      },
      {
        id: "social-media-trends",
        name: "Social Media Trends",
        category: "social",
        owned: ownedDatasets.includes("social-media-trends"),
        description: "Trending topics and hashtags across major platforms.",
        details: {
          endpoint: "/datasets/social-media-trends",
          example: `GET /datasets/social-media-trends?platform=Twitter`,
        },
      },
      {
        id: "covid-statistics",
        name: "COVID-19 Statistics",
        category: "health",
        owned: ownedDatasets.includes("covid-statistics"),
        description: "Global COVID-19 cases, deaths, and vaccination rates.",
        details: {
          endpoint: "/datasets/covid-statistics",
          example: `GET /datasets/covid-statistics?country=USA`,
        },
      },
      {
        id: "renewable-energy",
        name: "Renewable Energy Production",
        category: "energy",
        owned: ownedDatasets.includes("renewable-energy"),
        description: "Global renewable energy production and consumption data.",
        details: {
          endpoint: "/datasets/renewable-energy",
          example: `GET /datasets/renewable-energy?type=solar`,
        },
      },
      {
        id: "air-quality",
        name: "Air Quality Index",
        category: "environment",
        owned: ownedDatasets.includes("air-quality"),
        description: "Real-time air quality measurements from major cities.",
        details: {
          endpoint: "/datasets/air-quality",
          example: `GET /datasets/air-quality?city=Beijing`,
        },
      },
      {
        id: "population-demographics",
        name: "Population Demographics",
        category: "demographics",
        owned: ownedDatasets.includes("population-demographics"),
        description: "Global population statistics and demographic trends.",
        details: {
          endpoint: "/datasets/population-demographics",
          example: `GET /datasets/population-demographics?country=Canada`,
        },
      },
      {
        id: "crime-statistics",
        name: "Crime Statistics",
        category: "public-safety",
        owned: ownedDatasets.includes("crime-statistics"),
        description: "Crime rates and types across major cities.",
        details: {
          endpoint: "/datasets/crime-statistics",
          example: `GET /datasets/crime-statistics?city=Chicago`,
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
        id: "education-statistics",
        name: "Education Statistics",
        category: "education",
        owned: ownedDatasets.includes("education-statistics"),
        description: "Global education metrics and performance indicators.",
        details: {
          endpoint: "/datasets/education-statistics",
          example: `GET /datasets/education-statistics?country=Finland`,
        },
      },
      {
        id: "restaurant-reviews",
        name: "Restaurant Reviews",
        category: "food",
        owned: ownedDatasets.includes("restaurant-reviews"),
        description: "Aggregated restaurant reviews and ratings.",
        details: {
          endpoint: "/datasets/restaurant-reviews",
          example: `GET /datasets/restaurant-reviews?city=Paris`,
        },
      },
      {
        id: "job-market",
        name: "Job Market Trends",
        category: "employment",
        owned: ownedDatasets.includes("job-market"),
        description: "Employment rates and job market analytics.",
        details: {
          endpoint: "/datasets/job-market",
          example: `GET /datasets/job-market?industry=tech`,
        },
      },
      {
        id: "public-transportation",
        name: "Public Transportation Usage",
        category: "transportation",
        owned: ownedDatasets.includes("public-transportation"),
        description: "Public transit ridership and performance metrics.",
        details: {
          endpoint: "/datasets/public-transportation",
          example: `GET /datasets/public-transportation?city=London`,
        },
      },
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
        id: "sports-statistics",
        name: "Sports Statistics",
        category: "sports",
        owned: ownedDatasets.includes("sports-statistics"),
        description: "Professional sports leagues and player statistics.",
        details: {
          endpoint: "/datasets/sports-statistics",
          example: `GET /datasets/sports-statistics?sport=basketball`,
        },
      },
      {
        id: "music-charts",
        name: "Music Charts Data",
        category: "entertainment",
        owned: ownedDatasets.includes("music-charts"),
        description: "Music popularity charts and streaming statistics.",
        details: {
          endpoint: "/datasets/music-charts",
          example: `GET /datasets/music-charts?country=UK`,
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
        id: "food-prices",
        name: "Food Price Index",
        category: "economics",
        owned: ownedDatasets.includes("food-prices"),
        description: "Global food price trends and variations.",
        details: {
          endpoint: "/datasets/food-prices",
          example: `GET /datasets/food-prices?region=Europe`,
        },
      },
      {
        id: "carbon-emissions",
        name: "Carbon Emissions",
        category: "environment",
        owned: ownedDatasets.includes("carbon-emissions"),
        description: "Global carbon emission measurements and trends.",
        details: {
          endpoint: "/datasets/carbon-emissions",
          example: `GET /datasets/carbon-emissions?sector=industry`,
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
        id: "water-quality",
        name: "Water Quality Data",
        category: "environment",
        owned: ownedDatasets.includes("water-quality"),
        description: "Water quality measurements from major water bodies.",
        details: {
          endpoint: "/datasets/water-quality",
          example: `GET /datasets/water-quality?location=GreatLakes`,
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
        id: "electric-vehicles",
        name: "Electric Vehicle Adoption",
        category: "transportation",
        owned: ownedDatasets.includes("electric-vehicles"),
        description: "Electric vehicle sales and charging infrastructure data.",
        details: {
          endpoint: "/datasets/electric-vehicles",
          example: `GET /datasets/electric-vehicles?country=Norway`,
        },
      },
      {
        id: "tourism-statistics",
        name: "Tourism Data",
        category: "travel",
        owned: ownedDatasets.includes("tourism-statistics"),
        description: "International tourism trends and statistics.",
        details: {
          endpoint: "/datasets/tourism-statistics",
          example: `GET /datasets/tourism-statistics?destination=Japan`,
        },
      },
      {
        id: "patent-filings",
        name: "Patent Statistics",
        category: "innovation",
        owned: ownedDatasets.includes("patent-filings"),
        description: "Global patent filing trends and categories.",
        details: {
          endpoint: "/datasets/patent-filings",
          example: `GET /datasets/patent-filings?industry=biotech`,
        },
      },
      {
        id: "urban-development",
        name: "Urban Development Metrics",
        category: "urban-planning",
        owned: ownedDatasets.includes("urban-development"),
        description: "City development and planning statistics.",
        details: {
          endpoint: "/datasets/urban-development",
          example: `GET /datasets/urban-development?city=Singapore`,
        },
      },
      {
        id: "drug-prescriptions",
        name: "Prescription Drug Data",
        category: "health",
        owned: ownedDatasets.includes("drug-prescriptions"),
        description: "Prescription drug usage and trends.",
        details: {
          endpoint: "/datasets/drug-prescriptions",
          example: `GET /datasets/drug-prescriptions?drug=antibiotics`,
        },
      },
      {
        id: "solar-installations",
        name: "Solar Installation Data",
        category: "energy",
        owned: ownedDatasets.includes("solar-installations"),
        description: "Solar panel installation and capacity statistics.",
        details: {
          endpoint: "/datasets/solar-installations",
          example: `GET /datasets/solar-installations?state=California`,
        },
      },
      {
        id: "coffee-production",
        name: "Coffee Production Statistics",
        category: "agriculture",
        owned: ownedDatasets.includes("coffee-production"),
        description: "Global coffee production and consumption data.",
        details: {
          endpoint: "/datasets/coffee-production",
          example: `GET /datasets/coffee-production?country=Brazil`,
        },
      },
      {
        id: "startup-funding",
        name: "Startup Funding Data",
        category: "business",
        owned: ownedDatasets.includes("startup-funding"),
        description: "Venture capital and startup funding statistics.",
        details: {
          endpoint: "/datasets/startup-funding",
          example: `GET /datasets/startup-funding?sector=fintech`,
        },
      },
      {
        id: "ocean-temperatures",
        name: "Ocean Temperature Data",
        category: "climate",
        owned: ownedDatasets.includes("ocean-temperatures"),
        description: "Global ocean temperature measurements.",
        details: {
          endpoint: "/datasets/ocean-temperatures",
          example: `GET /datasets/ocean-temperatures?ocean=Pacific`,
        },
      },
      {
        id: "book-sales",
        name: "Book Sales Statistics",
        category: "retail",
        owned: ownedDatasets.includes("book-sales"),
        description: "Book sales and publishing industry data.",
        details: {
          endpoint: "/datasets/book-sales",
          example: `GET /datasets/book-sales?genre=fiction`,
        },
      },
      {
        id: "social-media-ads",
        name: "Social Media Advertising",
        category: "marketing",
        owned: ownedDatasets.includes("social-media-ads"),
        description: "Social media advertising performance metrics.",
        details: {
          endpoint: "/datasets/social-media-ads",
          example: `GET /datasets/social-media-ads?platform=Instagram`,
        },
      },
      {
        id: "language-usage",
        name: "Language Usage Statistics",
        category: "linguistics",
        owned: ownedDatasets.includes("language-usage"),
        description: "Global language usage and trends.",
        details: {
          endpoint: "/datasets/language-usage",
          example: `GET /datasets/language-usage?language=Spanish`,
        },
      },
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
        <PromoSERP />
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