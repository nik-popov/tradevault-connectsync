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