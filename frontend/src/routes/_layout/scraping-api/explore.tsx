import React, { useState, useMemo } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  Box,
  Container,
  Spinner,
  Text,
  VStack,
  Button,
  Divider,
  Flex,
  HStack,
  Input,
  Select,
} from "@chakra-ui/react";
import { FiGithub } from "react-icons/fi";
import PromoSERP from "../../../components/ComingSoon";

const STORAGE_KEY = "subscriptionSettings";
const PRODUCT = "serp";

export const Route = createFileRoute("/_layout/scraping-api/explore")({
  component: Explore,
});
interface ScraperJob {
  id: number;
  inputFile?: string;
  rec?: number;
  img?: number;
  fileEnd?: string;
  imageStart?: string | null;
  fileStart?: string | null;
  user?: string;
  apiUsed?: string;
  logFileUrl?: string | null;
}
interface Item {
  id: number;
  name: string;
  description: string;
  details: {
    status: string;
    imageStart: string | null;
    fileStart: string | null;
    fileEnd: string | null;
    user: string;
    records: number; // Record count
    images: number;  // Image count
    apiUsed: string;
    logFileUrl: string | null;
  };
}
// Type ScraperJobListItem props
interface ScraperJobListItemProps {
  job: Item;
  navigate: ReturnType<typeof useNavigate>;
  isInitiallyExpanded: boolean;
}

async function fetchScraperJobs(): Promise<ScraperJob[]> {
  const response = await fetch("https://backend-dev.iconluxury.group/api/scraping-jobs", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  if (!response.ok) throw new Error(`Failed to fetch jobs: ${response.status}`);
  return response.json();
}

function Explore() {
  const navigate = useNavigate();

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

  const { data: scraperJobs, isLoading, error } = useQuery({
    queryKey: ["scraperJobs"],
    queryFn: fetchScraperJobs,
    staleTime: 5 * 60 * 1000,
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [sortBy, setSortBy] = useState("fileEnd");
  const [visibleCount, setVisibleCount] = useState(10); // Load first 10

  const formattedJobs = useMemo(() => {
    if (!scraperJobs) return [];
    return scraperJobs.map((job: any) => ({
      id: job.id, // Matches API "id"
      name: job.inputFile || "Unnamed Job", // Matches API "inputFile"
      description: `${job.inputFile || "Unnamed Job"} (${job.rec || 0} records, ${job.img || 0} images)`,
      details: {
        status: job.fileEnd ? "Completed" : "Pending", // Matches API "fileEnd"
        imageStart: job.imageStart,
        fileStart: job.fileStart,
        fileEnd: job.fileEnd,
        user: job.user || "Unknown", // Matches API "user"
        records: job.rec || 0, // Record count from API
        images: job.img || 0,  // Image count from API
        apiUsed: job.apiUsed || "google-serp", // Fallback if not provided
        logFileUrl: job.logFileUrl,
      },
    }));
  }, [scraperJobs]);

  const filterCategories = useMemo((): string[] => {
    if (!scraperJobs) return ["all"];
    return ["all", ...new Set(scraperJobs.map((job) => job.apiUsed || "google-serp"))];
  }, [scraperJobs]);

  const filteredAndSortedJobs = useMemo(() => {
    let result = formattedJobs.filter((job) => {
      const matchesFilter =
        activeFilter === "all" || job.details.apiUsed.toLowerCase() === activeFilter.toLowerCase();
      const matchesSearch = (job.name || "").toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    });
    result.sort((a: Item, b: Item) => {
      if (sortBy === "fileEnd") {
        const bDate = new Date(b.details.fileEnd || "1/1/1970").getTime();
        const aDate = new Date(a.details.fileEnd || "1/1/1970").getTime();
        return bDate - aDate;
      } else if (sortBy === "images") {
        return b.details.images - a.details.images;
      } else if (sortBy === "records") {
        return b.details.records - a.details.records;
      } else if (sortBy === "name") {
        return a.name.localeCompare(b.name);
      }
      return 0;
    });
    return result;
  }, [searchQuery, activeFilter, sortBy, formattedJobs]);

  const visibleJobs = useMemo(() => {
    return filteredAndSortedJobs.slice(0, visibleCount);
  }, [filteredAndSortedJobs, visibleCount]);

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 10); // Load 10 more
  };

  if (isLoading) {
    return (
      <Container maxW="full" py={6}>
        <Flex justify="center" align="center" h="200px">
          <Spinner size="xl" color="blue.500" />
        </Flex>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxW="full" py={6}>
        <Text color="red.500">Failed to load jobs: {error.message}</Text>
      </Container>
    );
  }

  return (
    <Container maxW="full">
      <Flex align="center" justify="space-between" py={6} flexWrap="wrap" gap={4}>
        <Box textAlign="left" flex="1">
          <Text fontSize="xl" fontWeight="bold">Scraping Jobs</Text>
          <Text fontSize="sm" color="gray.500">View and manage scraping jobs for luxury linesheets.</Text>
        </Box>
        <Button as={Link} to="/explore" colorScheme="blue" size="sm">
          Jobs Dashboard
        </Button>
      </Flex>

      <Divider my={4} />

      {isLocked ? (
        <PromoSERP />
      ) : isFullyDeactivated ? (
        <Flex justify="space-between" align="center" w="full" p={4} bg="red.50" borderRadius="md">
          <Text>Your subscription has been deactivated. Please renew to access jobs.</Text>
          <Button colorScheme="red" onClick={() => navigate({ to: "/proxies/pricing" })}>
            Reactivate Now
          </Button>
        </Flex>
      ) : (
        <Flex gap={6} justify="space-between" align="stretch" wrap="wrap">
          <Box flex="1" minW={{ base: "100%", md: "65%" }}>
            <Flex gap={4} justify="space-between" align="center" flexWrap="wrap">
             <Input
                placeholder="Search Jobs by File Name..."
                value={searchQuery}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                w={{ base: "100%", md: "250px" }}
              />
              <HStack spacing={4} ml="auto" align="center" flexWrap="wrap">
                {filterCategories.map((type) => (
                  <Button
                    key={type}
                    size="sm"
                    fontWeight="bold"
                    borderRadius="full"
                    colorScheme={activeFilter === type ? "blue" : "gray"}
                    variant={activeFilter === type ? "solid" : "outline"}
                    onClick={() => setActiveFilter(type)}
                  >
                    {type === "all" ? "All" : type}
                  </Button>
                ))}
<Select
  value={sortBy}
  size="sm"
  w={{ base: "100%", md: "220px" }}
  borderColor="gray.600"
  _hover={{ borderColor: "gray.500" }}
  _focus={{ borderColor: "blue.400" }}
  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSortBy(e.target.value)}
>
  <option value="fileEnd">Sort by Date</option>
  <option value="images">Sort by Image Count</option>
  <option value="records">Sort by Row Count</option>
  <option value="name">Sort by Name</option>
</Select>
              </HStack>
            </Flex>

            <VStack spacing={4} mt={6} align="stretch">
              {visibleJobs.map((job, index) => (
                <ScraperJobListItem
                  key={job.id}
                  job={job}
                  navigate={navigate}
                  isInitiallyExpanded={index === 0}
                />
              ))}
              {visibleCount < filteredAndSortedJobs.length && (
                <Button
                  colorScheme="blue"
                  size="sm"
                  onClick={handleLoadMore}
                  mt={4}
                  alignSelf="center"
                >
                  Load More
                </Button>
              )}
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
                <Button
                  as={Link}
                  to="/scraping-jobs"
                  variant="outline"
                  size="sm"
                  mt="2"
                >
                  View Jobs Dashboard
                </Button>
              </Box>
            </VStack>
          </Box>
        </Flex>
      )}
    </Container>
  );
}
interface ScraperJobListItemProps {
  job: Item;
  navigate: ReturnType<typeof useNavigate>;
  isInitiallyExpanded: boolean;
}
const ScraperJobListItem = ({ job, navigate, isInitiallyExpanded }: ScraperJobListItemProps) => {
  const [isExpanded, setIsExpanded] = useState(isInitiallyExpanded);

  const handleNavigate = () => {
    navigate({ to: `/_layout/scraping-api/scraping-jobs/${job.id}` });
  };

  return (
    <Box p="4" borderWidth="1px" borderRadius="lg">
      <Flex justify="space-between" align="center">
        <Box>
          <Text fontWeight="bold">{job.name}</Text>
          <Text fontSize="sm" color="gray.300">{job.description}</Text>
        </Box>
        <HStack spacing={2}>
          <Button size="sm" colorScheme="blue" onClick={() => setIsExpanded(!isExpanded)}>
            {isExpanded ? "Less" : "More"}
          </Button>
          <Button size="sm" onClick={handleNavigate}>
            View Details
          </Button>
        </HStack>
      </Flex>
      {isExpanded && (
        <Box mt="4" p="2" borderWidth="1px" borderRadius="md">
          <Text fontSize="sm" color="gray.600">
            <strong>Status:</strong> {job.details.status}
          </Text>
          <Text fontSize="sm" color="gray.600">
            <strong>API Used:</strong> {job.details.apiUsed}
          </Text>
          <Text fontSize="sm" color="gray.600">
            <strong>Image Start:</strong> {job.details.imageStart || "N/A"}
          </Text>
          <Text fontSize="sm" color="gray.600">
            <strong>File Start:</strong> {job.details.fileStart || "N/A"}
          </Text>
          <Text fontSize="sm" color="gray.600">
            <strong>File End:</strong> {job.details.fileEnd || "Pending"}
          </Text>
          <Text fontSize="sm" color="gray.600">
            <strong>User:</strong> {job.details.user}
          </Text>
          <Text fontSize="sm" color="gray.600">
            <strong>Records:</strong> {job.details.records}
          </Text>
          <Text fontSize="sm" color="gray.600">
            <strong>Images:</strong> {job.details.images}
          </Text>
        </Box>
      )}
    </Box>
  );
};

export default Explore;