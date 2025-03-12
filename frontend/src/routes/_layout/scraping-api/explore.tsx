import React, { useState, useEffect } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useQuery, keepPreviousData } from "@tanstack/react-query"; // Import keepPreviousData
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
import { FiGithub } from "react-icons/fi";
import PromoSERP from "../../../components/ComingSoon";

const STORAGE_KEY = "subscriptionSettings";
const PRODUCT = "serp";

export const Route = createFileRoute("/_layout/scraping-api/explore")({
  component: Explore,
});

interface JobSummary {
  id: number;
  inputFile: string;
  fileEnd: string | null;
  user: string;
  rec: number;
  img: number;
}

async function fetchJobs(page: number): Promise<JobSummary[]> {
  const response = await fetch(`https://backend-dev.iconluxury.group/api/scraping-jobs?page=${page}&page_size=10`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  if (!response.ok) throw new Error(`Failed to fetch jobs: ${response.status}`);
  return response.json();
}

function Explore() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [jobs, setJobs] = useState<JobSummary[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

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

  const { data: freshJobs, isFetching } = useQuery({
    queryKey: ["scraperJobs", page],
    queryFn: () => fetchJobs(page),
    placeholderData: keepPreviousData, // Use placeholderData with keepPreviousData
  });

  useEffect(() => {
    if (freshJobs) {
      setJobs((prev: JobSummary[]) =>
        page === 1 ? freshJobs : [...prev, ...freshJobs]
      );
    }
  }, [freshJobs, page]);

  const filteredJobs = jobs.filter((job) =>
    job.inputFile.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleLoadMore = () => setPage((prev) => prev + 1);

  return (
    <Container maxW="full">
      <Flex align="center" justify="space-between" py={6} flexWrap="wrap" gap={4}>
        <Box textAlign="left" flex="1">
          <Text fontSize="xl" fontWeight="bold">Scraping Jobs</Text>
          <Text fontSize="sm" color="gray.500">View and manage scraping jobs</Text>
        </Box>
        <Button as={Link} to="/scraping-api/submit-form/google-serp" colorScheme="blue" size="sm">
          Submit Form
        </Button>
      </Flex>

      <Divider my={4} />

      {isLocked ? (
        <PromoSERP />
      ) : isFullyDeactivated ? (
        <Flex justify="space-between" align="center" w="full" p={4} bg="red.50" borderRadius="md">
          <Text>Your subscription has been deactivated.</Text>
          <Button colorScheme="red" onClick={() => navigate({ to: "/proxies/pricing" })}>
            Reactivate Now
          </Button>
        </Flex>
      ) : (
        <Flex gap={6} justify="space-between" align="stretch" wrap="wrap">
          <Box flex="1" minW={{ base: "100%", md: "65%" }}>
            <Input
              placeholder="Search Jobs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              w={{ base: "100%", md: "250px" }}
              mb={4}
            />
            <VStack spacing={4} align="stretch">
              {filteredJobs.map((job) => (
                <Box key={job.id} p="4" borderWidth="1px" borderRadius="lg">
                  <Flex justify="space-between" align="center">
                    <Box>
                      <Text fontWeight="bold">{job.inputFile}</Text>
                      <Text fontSize="sm" color="gray.300">
                        {job.rec} records, {job.img} images
                      </Text>
                    </Box>
                    <Button
                      size="sm"
                      onClick={() =>
                        navigate({
                          to: "/scraping-api/scraping-jobs/$jobId",
                          params: { jobId: job.id.toString() },
                        })
                      }
                    >
                      View Details
                    </Button>
                  </Flex>
                </Box>
              ))}
              {isFetching ? (
                <Text fontSize="sm" color="gray.500">Loading more...</Text>
              ) : (
                filteredJobs.length > 0 && (
                  <Button
                    colorScheme="blue"
                    size="sm"
                    onClick={handleLoadMore}
                    mt={4}
                    alignSelf="center"
                  >
                    Load More
                  </Button>
                )
              )}
            </VStack>
          </Box>

          <Box w={{ base: "100%", md: "250px" }} p="4" borderLeft={{ md: "1px solid #E2E8F0" }}>
            <VStack spacing="4" align="stretch">
              <Box p="4" shadow="sm" borderWidth="1px" borderRadius="lg">
                <Text fontWeight="bold">Quick Actions</Text>
                <Button
                  as="a"
                  href="https://github.com/iconluxurygroup"
                  leftIcon={<FiGithub />}
                  variant="outline"
                  size="sm"
                  mt="2"
                >
                  GitHub
                </Button>
              </Box>
            </VStack>
          </Box>
        </Flex>
      )}
    </Container>
  );
}

export default Explore;