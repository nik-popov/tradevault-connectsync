import React, { useState } from 'react';
import {
  Box,
  VStack,
  Heading,
  Text,
  Button,
  Code,
  Icon,
  Flex,
  Alert,
  AlertIcon,
  Divider,
  Select,
  Spinner,
} from "@chakra-ui/react";
import {
  FiCheckCircle,
  FiCopy,
  FiGlobe,
  FiCode,
  FiSettings,
  FiServer,
  FiList,
} from "react-icons/fi";
import { useQuery } from "@tanstack/react-query";

// Define the interface for a scraping tool
interface ScrapingTool {
  id: string;
  name: string;
  description: string;
  endpoint: string;
  locationsEndpoint: string;
  authEndpoint: string;
  usageEndpoint: string;
}

// Mock API function to fetch available tools (replace with real API call)
const fetchScrapingTools = async (): Promise<ScrapingTool[]> => {
  // Simulate API response
  return [
    {
      id: "google-serp",
      name: "Google SERP",
      description: "Fetches real-time search results from Google.",
      endpoint: "https://api.iconluxury.group/api/v1/proxy/google-serp/",
      locationsEndpoint: "https://api.iconluxury.group/api/v1/locations?type=google-serp",
      authEndpoint: "https://api.iconluxury.group/api/v1/auth/google-serp",
      usageEndpoint: "https://api.iconluxury.group/api/v1/usage/google-serp/",
    },
    {
      id: "bing-serp",
      name: "Bing SERP",
      description: "Retrieves search results and related data from Bing.",
      endpoint: "https://api.iconluxury.group/api/v1/proxy/bing-serp/",
      locationsEndpoint: "https://api.iconluxury.group/api/v1/locations?type=bing-serp",
      authEndpoint: "https://api.iconluxury.group/api/v1/auth/bing-serp",
      usageEndpoint: "https://api.iconluxury.group/api/v1/usage/bing-serp/",
    },
    // Add more tools as needed
  ];
};

// Mock function to fetch tool-specific data (replace with real API calls)
const fetchToolData = async (toolId: string): Promise<any> => {
  // Simulate fetching data for the tool
  return {
    endpoints: [`https://api.iconluxury.group/api/v1/proxy/${toolId}/`],
    locations: ["US", "UK", "CA"],
    auth: { username: "your_username", password: "your_password" },
    usage: { requests: 100, limit: 1000 },
  };
};

const ScraperDashboard = () => {
  const [selectedTool, setSelectedTool] = useState<string | null>(null);

  // Fetch available scraping tools
  const { data: tools, isLoading: isLoadingTools } = useQuery({
    queryKey: ["scrapingTools"],
    queryFn: fetchScrapingTools,
  });

  // Fetch data for the selected tool
  const { data: toolData, isLoading: isLoadingToolData } = useQuery({
    queryKey: ["toolData", selectedTool],
    queryFn: () => fetchToolData(selectedTool!),
    enabled: !!selectedTool,
  });

  const steps = selectedTool && toolData ? [
    {
      title: "List Available Endpoints",
      icon: FiList,
      description: `Retrieve all available endpoints for ${tools?.find(t => t.id === selectedTool)?.name}.`,
      content: (
        <Code p={3} borderRadius="md" fontSize="sm" bg="gray.700">
          {`curl -X GET "https://api.iconluxury.group/api/v1/endpoints?type=${selectedTool}"`}
        </Code>
      ),
    },
    {
      title: "Get Available Locations",
      icon: FiGlobe,
      description: `Retrieve a list of supported locations for ${tools?.find(t => t.id === selectedTool)?.name} proxies.`,
      content: (
        <Code p={3} borderRadius="md" fontSize="sm" bg="gray.700">
          {`curl -X GET "${tools?.find(t => t.id === selectedTool)?.locationsEndpoint}"`}
        </Code>
      ),
    },
    {
      title: "Configure Your Endpoint",
      icon: FiGlobe,
      description: `Connect to our ${tools?.find(t => t.id === selectedTool)?.name} API using this endpoint.`,
      content: (
        <Code p={3} borderRadius="md" fontSize="sm" bg="gray.700">
          {tools?.find(t => t.id === selectedTool)?.endpoint}
        </Code>
      ),
    },
    {
      title: "Set Your Authentication",
      icon: FiCode,
      description: "Use your credentials to authenticate your API requests.",
      content: (
        <Box bg="gray.700" p={3} borderRadius="md">
          <Code display="block" mb={2}>
            Username: {toolData.auth.username}<br />
            Password: {toolData.auth.password}
          </Code>
          <Button leftIcon={<FiCopy />} variant="link" size="sm" colorScheme="blue">
            Copy credentials
          </Button>
        </Box>
      ),
    },
    {
      title: "Retrieve Authentication Info",
      icon: FiCode,
      description: "Check your authentication details and status.",
      content: (
        <Code p={3} borderRadius="md" fontSize="sm" bg="gray.700">
          {`curl -X GET "${tools?.find(t => t.id === selectedTool)?.authEndpoint}"`}
        </Code>
      ),
    },
    {
      title: "Optimize Your Settings",
      icon: FiSettings,
      description: "Adjust request headers and connection settings for optimal performance.",
      content: (
        <Code p={3} borderRadius="md" fontSize="sm" bg="gray.700">
          {`headers = {'User-Agent': 'YourApp/1.0', 'X-Proxy-Type': '${selectedTool}'}`}
        </Code>
      ),
    },
    {
      title: "Send Your First Request",
      icon: FiServer,
      description: "Test your connection using the proper proxy format.",
      content: (
        <Code p={3} borderRadius="md" fontSize="sm" bg="gray.700">
          {`curl --proxy-user ${toolData.auth.username}:${toolData.auth.password} -x ${tools?.find(t => t.id === selectedTool)?.endpoint} "https://www.google.com/search?q=example"`}
        </Code>
      ),
    },
    {
      title: "Monitor and Scale",
      icon: FiSettings,
      description: "Track your usage and scale your API calls as needed.",
      content: (
        <Code p={3} borderRadius="md" fontSize="sm" bg="gray.700">
          {`curl -X GET "${tools?.find(t => t.id === selectedTool)?.usageEndpoint}"`}
        </Code>
      ),
    },
  ] : [];

  return (
    <Box maxW="100%" mx="auto" px={{ base: 6, md: 12 }} py={12}>
      <VStack spacing={8} align="stretch">
        {/* Tool Selection */}
        <Heading size="lg" fontWeight="bold">Scraper Dashboard</Heading>
        <Text fontSize="md" color="gray.300">Select a scraping tool to view its configuration and usage instructions.</Text>
        {isLoadingTools ? (
          <Spinner size="lg" />
        ) : (
          <Select
            placeholder="Select a tool"
            value={selectedTool || ""}
            onChange={(e) => setSelectedTool(e.target.value)}
          >
            {tools?.map((tool) => (
              <option key={tool.id} value={tool.id}>
                {tool.name}
              </option>
            ))}
          </Select>
        )}

        {/* Step-by-Step Guide */}
        {selectedTool && (
          <>
            <Heading size="md" fontWeight="semibold" mt={6}>
              {tools?.find(t => t.id === selectedTool)?.name} Overview
            </Heading>
            {isLoadingToolData ? (
              <Spinner size="lg" />
            ) : (
              <VStack spacing={6} align="stretch">
                {steps.map((step, index) => (
                  <Flex key={index} gap={4} align="flex-start">
                    <Flex align="center" justify="center" w="50px" h="50px" borderRadius="full" bg="blue.100">
                      <Icon as={step.icon} boxSize={6} color="blue.500" />
                    </Flex>
                    <Box flex={1}>
                      <Heading size="md" fontWeight="semibold" mb={1}>
                        {step.title}
                      </Heading>
                      <Text color="gray.300" mb={2}>
                        {step.description}
                      </Text>
                      {step.content}
                    </Box>
                  </Flex>
                ))}
              </VStack>
            )}
          </>
        )}

        <Divider />

        {/* Verification & Support */}
        <Alert status="success" borderRadius="md">
          <AlertIcon as={FiCheckCircle} boxSize={5} />
          <Box>
            <Text fontWeight="bold">Verify Your Setup</Text>
            <Text fontSize="sm">
              Test your connection using the examples above. If your API calls succeed and you receive valid results, you're all set!
              Need help? Visit our{" "}
              <Button variant="link" colorScheme="blue" size="sm">
                troubleshooting guide
              </Button>{" "}
              or contact support.
            </Text>
          </Box>
        </Alert>
      </VStack>
    </Box>
  );
};

export default ScraperDashboard;