import {
  Box,
  Container,
  Text,
  VStack,
  Button,
  Divider,
  Flex,
  HStack,
  Input,
} from "@chakra-ui/react";
import { useState, useMemo } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { FiGithub, FiX } from "react-icons/fi";
import PromoSERP from "../../../components/ComingSoon";

// Storage and Product Key
const STORAGE_KEY = "subscriptionSettings";
const PRODUCT = "datasets"; // Adjusted for datasets

export const Route = createFileRoute("/_layout/datasets/explore")({
  component: Explore,
});

function Explore(): JSX.Element {
  const navigate = useNavigate();

  // Load Subscription State using useQuery
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

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  // Mock API Data (adjusted for datasets)
  const datasets = [
    {
      id: "sales-data",
      name: "Sales Data",
      category: "business",
      description: "Sales data from various industries.",
      details: { source: "https://example.com/sales", format: "CSV" },
    },
    {
      id: "market-trends",
      name: "Market Trends",
      category: "business",
      description: "Market trend analysis dataset.",
      details: { source: "https://example.com/trends", format: "JSON" },
    },
  ];

  const categories = ["all", ...new Set(datasets.map((dataset) => dataset.category))];

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
      <Flex align="center" justify="space-between" py={6} flexWrap="wrap" gap={4}>
        <Box textAlign="left" flex="1">
          <Text fontSize="xl" fontWeight="bold">Explore Datasets</Text>
          <Text fontSize="sm">Explore available datasets.</Text>
        </Box>
      </Flex>

      <Divider my={4} />

      {isLocked ? (
        <PromoSERP />
      ) : isFullyDeactivated ? (
        <Flex justify="space-between" align="center" w="full" p={4} bg="red.50" borderRadius="md">
          <Text>Your subscription has been deactivated. Please renew to access datasets.</Text>
          <Button colorScheme="red" onClick={() => navigate({ to: "/proxies/billing" })}>
            Reactivate Now
          </Button>
        </Flex>
      ) : (
        <Flex gap={6} justify="space-between" align="stretch" wrap="wrap">
          <Box flex="1" minW={{ base: "100%", md: "65%" }}>
            <Flex gap={4} justify="space-between" align="center" flexWrap="wrap">
              <Input
                placeholder="Search datasets..."
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
                <DatasetListItem key={dataset.id} dataset={dataset} navigate={navigate} isTrial={isTrial} />
              ))}
            </VStack>
          </Box>

          <Box w={{ base: "100%", md: "250px" }} p="4" borderLeft={{ md: "1px solid #E2E8F0" }}>
            <VStack spacing="4" align="stretch">
              <Box p="4" shadow="sm" borderWidth="1px" borderRadius="lg">
                <Text fontWeight="bold">Quick Actions</Text>
                <Button
                  as="a"
                  href="https://github.com/iconluxurygroupNet"
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

interface Dataset {
  id: string;
  name: string;
  category: string;
  description: string;
  details: { source: string; format: string };
}

const DatasetListItem = ({
  dataset,
  navigate,
  isTrial,
}: {
  dataset: Dataset;
  navigate: ReturnType<typeof useNavigate>;
  isTrial: boolean;
}): JSX.Element => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleNavigate = () => {
    navigate({ to: `/datasets/${dataset.id}` });
  };

  return (
    <Box p="4" borderWidth="1px" borderRadius="lg">
      <Flex justify="space-between" align="center">
        <Box>
          <Text fontWeight="bold">{dataset.name}</Text>
          <Text fontSize="sm" color="gray.600">{dataset.description}</Text>
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
            onClick={handleNavigate}
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
      {isExpanded && (
        <Box mt="4" p="2" borderWidth="1px" borderRadius="md">
          <Text fontSize="sm" color="gray.600">
            <strong>Source:</strong> {dataset.details.source}
          </Text>
          <Text fontSize="sm" color="gray.600">
            <strong>Format:</strong> {dataset.details.format}
          </Text>
        </Box>
      )}
    </Box>
  );
};

export default Explore;