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
const PRODUCT = "serp"; // Define product-specific subscription management

export const Route = createFileRoute("/_layout/scraper-api/explore")({
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

  // 🔍 Mock API Data
  const apis = [
    // SEARCH & DISCOVERY
    {
      id: "google-serp-api",
      name: "Google Search API",
      category: "search",
      description: "Fetches real-time search results from Google.",
      details: {
        endpoint: "/apis/google-serp",
        example: "GET /apis/google-serp?query=OpenAI",
      },
    },
    {
      id: "bing-api",
      name: "Bing Search API",
      category: "search",
      description: "Retrieves search results and related data from Bing.",
      details: {
        endpoint: "/apis/bing",
        example: "GET /apis/bing?query=artificial+intelligence",
      },
    },
  
    // LEAD GENERATION
    {
      id: "sales-leads-api",
      name: "B2B Sales Leads API",
      category: "lead_generation",
      description: "Generates qualified B2B sales leads with contact information.",
      details: {
        endpoint: "/apis/sales-leads",
        example: "GET /apis/sales-leads?industry=technology&role=CTO",
      },
    },
    {
      id: "email-verification-api",
      name: "Email Verification API",
      category: "lead_generation",
      description: "Verifies email addresses and enriches contact data.",
      details: {
        endpoint: "/apis/email-verify",
        example: "GET /apis/email-verify?email=contact@company.com",
      },
    },
    {
      id: "website-visitor-api",
      name: "Website Visitor Intelligence API",
      category: "lead_generation",
      description: "Identifies companies visiting your website and their interests.",
      details: {
        endpoint: "/apis/visitor-intel",
        example: "GET /apis/visitor-intel?domain=example.com",
      },
    },
  
    // SOCIAL MEDIA
    {
      id: "linkedin-api",
      name: "LinkedIn Scraping API",
      category: "social",
      description: "Scrapes public LinkedIn profiles, job postings, and company data.",
      details: {
        endpoint: "/apis/linkedin",
        example: "GET /apis/linkedin?profile_id=12345",
      },
    },
    {
      id: "twitter-api",
      name: "Twitter Scraping API",
      category: "social",
      description: "Scrapes tweets, user profiles, and trends from Twitter.",
      details: {
        endpoint: "/apis/twitter",
        example: "GET /apis/twitter?username=elonmusk",
      },
    },
  
    // E-COMMERCE
    {
      id: "amazon-product-api",
      name: "Amazon Product API",
      category: "ecommerce",
      description: "Fetches product details, reviews, and price history from Amazon.",
      details: {
        endpoint: "/apis/amazon-product",
        example: "GET /apis/amazon-product?product_id=B08L5VG4RZ",
      },
    },
    {
      id: "shopify-store-api",
      name: "Shopify Store API",
      category: "ecommerce",
      description: "Fetches product data from any Shopify store.",
      details: {
        endpoint: "/apis/shopify",
        example: "GET /apis/shopify?store=example-store&product_id=123",
      },
    },
  
    // REAL ESTATE
    {
      id: "property-listings-api",
      name: "Property Listings API",
      category: "real_estate",
      description: "Aggregates real estate listings from multiple sources.",
      details: {
        endpoint: "/apis/properties",
        example: "GET /apis/properties?location=Miami&type=residential",
      },
    },
    {
      id: "property-valuation-api",
      name: "Property Valuation API",
      category: "real_estate",
      description: "Provides property valuations and market analysis.",
      details: {
        endpoint: "/apis/valuation",
        example: "GET /apis/valuation?address=123+Main+St",
      },
    },
    {
      id: "mortgage-api",
      name: "Mortgage Data API",
      category: "real_estate",
      description: "Fetches mortgage rates and lending information.",
      details: {
        endpoint: "/apis/mortgage",
        example: "GET /apis/mortgage?loan_type=30year_fixed",
      },
    },
  
    // FINANCE & MARKETS
    {
      id: "crypto-api",
      name: "Cryptocurrency Market API",
      category: "finance",
      description: "Fetches real-time cryptocurrency prices and trends.",
      details: {
        endpoint: "/apis/crypto",
        example: "GET /apis/crypto?symbol=BTC",
      },
    },
    {
      id: "stock-market-api",
      name: "Stock Market API",
      category: "finance",
      description: "Real-time stock prices and market data.",
      details: {
        endpoint: "/apis/stocks",
        example: "GET /apis/stocks?symbol=AAPL",
      },
    },
  
    // TRAVEL & HOSPITALITY
    {
      id: "flight-api",
      name: "Flight Data API",
      category: "travel",
      description: "Fetches real-time flight statuses and pricing.",
      details: {
        endpoint: "/apis/flight",
        example: "GET /apis/flight?flight_no=AA100",
      },
    },
    {
      id: "hotel-booking-api",
      name: "Hotel Booking API",
      category: "travel",
      description: "Searches and books hotels worldwide.",
      details: {
        endpoint: "/apis/hotels",
        example: "GET /apis/hotels?city=Paris",
      },
    },
  
    // ENTERTAINMENT & MEDIA
    {
      id: "streaming-api",
      name: "Streaming Services API",
      category: "entertainment",
      description: "Aggregates content from major streaming platforms.",
      details: {
        endpoint: "/apis/streaming",
        example: "GET /apis/streaming?title=Stranger+Things",
      },
    },
    {
      id: "gaming-api",
      name: "Gaming Platform API",
      category: "entertainment",
      description: "Retrieves game data from major gaming platforms.",
      details: {
        endpoint: "/apis/gaming",
        example: "GET /apis/gaming?game=Fortnite",
      },
    },
  
    // BUSINESS INTELLIGENCE
    {
      id: "company-data-api",
      name: "Company Intelligence API",
      category: "business",
      description: "Provides company information and financials.",
      details: {
        endpoint: "/apis/company",
        example: "GET /apis/company?name=Apple+Inc",
      },
    },
    {
      id: "market-research-api",
      name: "Market Research API",
      category: "business",
      description: "Delivers industry trends and market analysis.",
      details: {
        endpoint: "/apis/market-research",
        example: "GET /apis/market-research?industry=Technology",
      },
    },
  
    // ANALYTICS & RESEARCH
    {
      id: "web-analytics-api",
      name: "Web Analytics API",
      category: "analytics",
      description: "Aggregates website traffic and user behavior data.",
      details: {
        endpoint: "/apis/analytics",
        example: "GET /apis/analytics?website=example.com",
      },
    },
    {
      id: "competitive-analysis-api",
      name: "Competitive Analysis API",
      category: "analytics",
      description: "Analyzes competitor websites, pricing, and strategies.",
      details: {
        endpoint: "/apis/competitive",
        example: "GET /apis/competitive?competitor=competitor.com",
      },
    }
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
          <SubscriptionManagement product={PRODUCT} />
        </Flex>
  
        <Divider my={4} />
  
        {isLocked ? (
          <PromoDatasets />
        ) : isFullyDeactivated ? (
          <Alert status="error" borderRadius="md">
            <AlertIcon />
            <Flex justify="space-between" align="center" w="full">
              <Text>Your subscription has been deactivated. Please renew to access APIs.</Text>
              <Button colorScheme="red" onClick={() => navigate("/proxies/billing")}>
                Reactivate Now
              </Button>
            </Flex>
          </Alert>
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
                  <APIListItem key={api.id} api={api} navigate={navigate} isTrial={isTrial} />
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
            <Text fontWeight="bold">{api.name}</Text> 
            <Text fontSize="sm" color="gray.600">{api.description}</Text>
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
  