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
  Select,
} from "@chakra-ui/react";
import { useState, useMemo } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { FiGithub } from "react-icons/fi";
import PromoSERP from "../../../components/ComingSoon";

// Storage and Product Key
const STORAGE_KEY = "subscriptionSettings";
const PRODUCT = "serp";

export const Route = createFileRoute("/_layout/scraping-api/explore")({
  component: Explore,
});

function Explore() {
  const navigate = useNavigate();

  // Load Subscription State
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
  const [sortBy, setSortBy] = useState("fileEnd");

  // Scraper Jobs Data
  const scraperJobs = [
    { id: 80, inputFile: "d5a7b7d1-OffWhite.xlsx", imageStart: "3/6/2025 2:30:19 PM", fileStart: "3/6/2025 4:21:32 PM", fileEnd: "3/6/2025 4:25:01 PM", resultFile: "d5a7b7d1-OffWhite.xlsx", user: "", rec: 899, img: 14384, apiUsed: "google-serp" },
    { id: 79, inputFile: "803315e5-CopyofOWParisImagetest.xlsx", imageStart: "3/6/2025 1:11:02 PM", fileStart: "3/6/2025 4:05:42 PM", fileEnd: "3/6/2025 4:09:20 PM", resultFile: "803315e5-CopyofOWParisImagetest.xlsx", user: "NIk", rec: 923, img: 14768, apiUsed: "google-serp" },
    { id: 78, inputFile: "043a9b16-Scotch&SodaWomens.xlsx", imageStart: "3/5/2025 1:09:57 PM", fileStart: "3/5/2025 9:09:30 PM", fileEnd: "3/5/2025 9:10:14 PM", resultFile: "043a9b16-Scotch&SodaWomens.xlsx", user: "NIk", rec: 696, img: 6065, apiUsed: "google-serp" },
    { id: 77, inputFile: "f4f8db90-small-Scotch&SodaMens.xlsx", imageStart: "3/4/2025 5:09:49 PM", fileStart: "3/6/2025 5:51:11 PM", fileEnd: "3/6/2025 5:51:13 PM", resultFile: "f4f8db90-small-Scotch&SodaMens.xlsx", user: "NIk", rec: 7, img: 500, apiUsed: "google-serp" },
    { id: 76, inputFile: "72054289-Scotch&SodaMens.xlsx", imageStart: "3/4/2025 5:07:05 PM", fileStart: "3/5/2025 12:19:07 PM", fileEnd: "3/5/2025 12:19:39 PM", resultFile: "72054289-Scotch&SodaMens.xlsx", user: "NIk", rec: 597, img: 16363, apiUsed: "google-serp" },
    { id: 75, inputFile: "2f03faf3-D&GLUXOFFM&W.xlsx", imageStart: "3/4/2025 3:42:44 PM", fileStart: "3/4/2025 4:08:00 PM", fileEnd: "3/4/2025 4:08:56 PM", resultFile: "2f03faf3-D&GLUXOFFM&W.xlsx", user: "", rec: 397, img: 3609, apiUsed: "google-serp" },
    { id: 73, inputFile: "eaee7d88-CopyofListaperBulk03.02.25.xlsx", imageStart: "3/4/2025 1:01:51 PM", fileStart: "3/4/2025 3:03:19 PM", fileEnd: "3/4/2025 3:03:25 PM", resultFile: "eaee7d88-CopyofListaperBulk03.02.25.xlsx", user: "", rec: 112, img: 628, apiUsed: "google-serp" },
    { id: 72, inputFile: "047ae051-CopyofListaperBulk03.02.25.xlsx", imageStart: "3/4/2025 9:51:25 AM", fileStart: "3/4/2025 2:40:41 PM", fileEnd: "3/4/2025 2:40:56 PM", resultFile: "047ae051-CopyofListaperBulk03.02.25.xlsx", user: "", rec: 112, img: 1757, apiUsed: "google-serp" },
    { id: 70, inputFile: "1ff6b763-88e99742-OFFW1_processed.xlsx", imageStart: "3/3/2025 5:26:34 PM", fileStart: "3/3/2025 6:16:32 PM", fileEnd: "3/3/2025 6:17:32 PM", resultFile: "1ff6b763-88e99742-OFFW1_processed.xlsx", user: "", rec: 495, img: 7920, apiUsed: "google-serp" },
    { id: 69, inputFile: "48b6a543-ysl-test.xlsx", imageStart: "3/3/2025 5:22:33 PM", fileStart: "3/4/2025 2:45:33 PM", fileEnd: "3/4/2025 2:46:08 PM", resultFile: "48b6a543-ysl-test.xlsx", user: "", rec: 25, img: 326, apiUsed: "google-serp" },
    { id: 68, inputFile: "0b4d4c67-TIMBERLANDPICS3.3.xlsx", imageStart: "3/3/2025 4:56:07 PM", fileStart: "3/3/2025 4:57:13 PM", fileEnd: "3/3/2025 4:57:17 PM", resultFile: "0b4d4c67-TIMBERLANDPICS3.3.xlsx", user: "", rec: 62, img: 960, apiUsed: "google-serp" },
    { id: 63, inputFile: "2bcf5a79-large-test-OPMJ-tory.xlsx", imageStart: "2/28/2025 4:15:06 PM", fileStart: "3/4/2025 3:15:06 PM", fileEnd: "3/4/2025 3:15:10 PM", resultFile: "2bcf5a79-large-test-OPMJ-tory.xlsx", user: "", rec: 20, img: 296, apiUsed: "google-serp" },
    { id: 57, inputFile: "df8d951b-med-test-OPMJ-tory.xlsx", imageStart: "2/27/2025 2:40:07 PM", imageEnd: "2/27/2025 9:50:30 PM", fileStart: "3/4/2025 2:56:36 PM", fileEnd: "3/4/2025 2:56:41 PM", resultFile: "df8d951b-med-test-OPMJ-tory.xlsx", user: "NIk", rec: 5, img: 73, apiUsed: "google-serp" },
    { id: 54, inputFile: "3cbe5dfc-MultiBrandOpportunity+2.21(1).xlsx", imageStart: "2/26/2025 4:21:56 PM", imageEnd: "2/26/2025 5:37:52 PM", fileStart: "2/27/2025 1:28:30 PM", fileEnd: "2/27/2025 1:32:05 PM", resultFile: "3cbe5dfc-MultiBrandOpportunity+2.21(1).xlsx", user: "NIk", rec: 835, img: 13345, apiUsed: "google-serp" },
    { id: 53, inputFile: "4ddfa432-polandmensneedpics.xlsx", imageStart: "2/26/2025 2:19:47 PM", imageEnd: "2/26/2025 2:26:18 PM", fileStart: "2/26/2025 3:36:40 PM", fileEnd: "2/26/2025 3:48:47 PM", resultFile: "4ddfa432-polandmensneedpics.xlsx", user: "NIk", rec: 459, img: 10042, apiUsed: "google-serp" },
    { id: 47, inputFile: "6c1adb64-small-JilSander-shoesaccessories.xlsx", imageStart: "2/25/2025 5:58:54 PM", imageEnd: "2/25/2025 5:59:00 PM", fileStart: "3/4/2025 3:14:30 PM", fileEnd: "3/4/2025 3:14:33 PM", resultFile: "6c1adb64-small-JilSander-shoesaccessories.xlsx", user: "NIk", rec: 5, img: 80, apiUsed: "google-serp" },
    { id: 46, inputFile: "0a8e0211-OWAccAvail2_25(1).xlsx", imageStart: "2/25/2025 1:41:30 PM", imageEnd: "2/25/2025 1:56:29 PM", fileStart: "2/25/2025 1:56:29 PM", fileEnd: "2/25/2025 2:07:24 PM", resultFile: "0a8e0211-OWAccAvail2_25(1).xlsx", user: "", rec: 1155, img: 17991, apiUsed: "google-serp" },
    { id: 45, inputFile: "6d3f5905-83e74c63-test-MultiBrandOpportunity2.21.xlsx", imageStart: "2/24/2025 2:28:48 PM", imageEnd: "2/24/2025 2:38:30 PM", fileStart: "2/24/2025 2:38:30 PM", fileEnd: "2/24/2025 2:39:43 PM", resultFile: "6d3f5905-83e74c63-test-MultiBrandOpportunity2.21.xlsx", user: "", rec: 312, img: 4992, apiUsed: "google-serp" },
    { id: 40, inputFile: "54b8d24b-Dickies2-203.xlsx", imageStart: "2/20/2025 5:14:27 PM", imageEnd: "2/21/2025 2:53:31 PM", fileStart: "2/28/2025 1:40:08 PM", fileEnd: "2/21/2025 2:55:04 PM", resultFile: "54b8d24b-Dickies2-203.xlsx", user: "", rec: 498, img: 441, apiUsed: "google-serp" },
    { id: 39, inputFile: "07d53c0a-Dickies2-202.xlsx", imageStart: "2/20/2025 5:13:56 PM", imageEnd: "2/21/2025 2:49:33 PM", fileStart: "2/21/2025 2:49:33 PM", fileEnd: "2/21/2025 2:51:10 PM", resultFile: "07d53c0a-Dickies2-202.xlsx", user: "", rec: 498, img: 5778, apiUsed: "google-serp" },
    { id: 38, inputFile: "2291e537-Dickies2-201.xlsx", imageStart: "2/20/2025 5:11:48 PM", imageEnd: "2/21/2025 3:01:26 PM", fileStart: "2/22/2025 3:34:34 PM", fileEnd: "2/22/2025 3:36:42 PM", resultFile: "2291e537-Dickies2-201.xlsx", user: "", rec: 547, img: 6197, apiUsed: "google-serp" },
    { id: 22, inputFile: "e0d54075-c92e5c04-JilSander-Wbags,shoesaccessories.xlsx", imageStart: "2/19/2025 12:18:03 PM", imageEnd: "2/20/2025 3:14:34 PM", fileStart: "2/20/2025 3:14:34 PM", fileEnd: "2/20/2025 3:18:04 PM", resultFile: "e0d54075-c92e5c04-JilSander-Wbags,shoesaccessories.xlsx", user: "", rec: 343, img: 6113, apiUsed: "google-serp" },
    { id: 21, inputFile: "17017c0f-DOLCE&GABBANA_STOCK_FASHION_DEALS_FEB06.xlsx", imageStart: "2/19/2025 10:54:17 AM", imageEnd: "2/20/2025 3:58:45 PM", fileStart: "3/4/2025 2:43:39 PM", fileEnd: "3/4/2025 2:43:48 PM", resultFile: "17017c0f-DOLCE&GABBANA_STOCK_FASHION_DEALS_FEB06.xlsx", user: "", rec: 1, img: 8, apiUsed: "google-serp" },
    { id: 20, inputFile: "d6113639-Dickiesupload.xlsx", imageStart: "2/18/2025 5:28:03 PM", imageEnd: "2/18/2025 5:33:21 PM", fileStart: "2/18/2025 5:33:22 PM", fileEnd: "2/18/2025 5:34:51 PM", resultFile: "d6113639-Dickiesupload.xlsx", user: "", rec: 247, img: 3790, apiUsed: "google-serp" },
    { id: 19, inputFile: "c92e5c04-JilSander-Wbags,shoesaccessories.xlsx", imageStart: "2/18/2025 3:15:03 PM", imageEnd: "2/24/2025 6:11:37 PM", fileStart: "2/18/2025 3:19:50 PM", fileEnd: "2/18/2025 3:22:20 PM", resultFile: "c92e5c04-JilSander-Wbags,shoesaccessories.xlsx", user: "", rec: 343, img: 5315, apiUsed: "google-serp" },
    { id: 6, inputFile: "da7aab53-OFFW2.xlsx", imageStart: "1/31/2025 1:50:31 PM", imageEnd: "1/31/2025 2:01:45 PM", fileStart: "1/31/2025 2:01:46 PM", fileEnd: "1/31/2025 2:04:51 PM", resultFile: "da7aab53-OFFW2.xlsx", user: "", rec: 500, img: 8000, apiUsed: "google-serp" },
    { id: 5, inputFile: "88e99742-OFFW1.xlsx", imageStart: "1/31/2025 1:50:23 PM", imageEnd: "1/31/2025 1:56:18 PM", fileStart: "2/28/2025 2:24:36 PM", fileEnd: "2/28/2025 2:25:39 PM", resultFile: "88e99742-OFFW1.xlsx", user: "", rec: 495, img: 7920, apiUsed: "google-serp" },
    { id: 4, inputFile: "166ed63c-OPE442OffWhiteM-ACC.xlsx", imageStart: "1/31/2025 12:53:22 PM", imageEnd: "1/31/2025 12:56:38 PM", fileStart: "2/28/2025 3:06:07 PM", fileEnd: "2/28/2025 3:06:55 PM", resultFile: "166ed63c-OPE442OffWhiteM-ACC.xlsx", user: "", rec: 271, img: 4336, apiUsed: "google-serp" },
    { id: 3, inputFile: "5508ae0d-OffWSneakersTEST.xlsx", imageStart: "1/31/2025 12:30:25 PM", imageEnd: "2/20/2025 5:36:18 PM", fileStart: "2/28/2025 2:43:36 PM", fileEnd: "2/28/2025 2:44:21 PM", resultFile: "5508ae0d-OffWSneakersTEST.xlsx", user: "NIk", rec: 266, img: 4256, apiUsed: "google-serp" },
    { id: 999, inputFile: "mock-cettire-luxury.xlsx", imageStart: "3/7/2025 10:00:00 AM", fileStart: "3/7/2025 11:30:00 AM", fileEnd: "3/7/2025 11:45:00 AM", resultFile: "mock-cettire-luxury.xlsx", user: "TestUser", rec: 150, img: 2400, apiUsed: "cettire" },
  ];

  // Format Jobs for Display
  const formattedJobs = useMemo(() => {
    return scraperJobs.map((job) => ({
      id: job.id,
      name: job.inputFile,
      description: `Scrapes luxury data for linesheets using ${job.apiUsed} (${job.rec} records, ${job.img} images)`,
      details: {
        status: job.fileEnd ? "Completed" : "Pending",
        targetUrl: job.inputFile.includes("http") ? job.inputFile : "N/A",
        imageStart: job.imageStart,
        fileStart: job.fileStart,
        fileEnd: job.fileEnd,
        user: job.user || "Unknown",
        records: job.rec,
        images: job.img,
        apiUsed: job.apiUsed,
      },
    }));
  }, [scraperJobs]);

  // Filter Categories (based on APIs used)
  const filterCategories = ["all", ...new Set(scraperJobs.map((job) => job.apiUsed))];

  // Filtered and Sorted Jobs
  const filteredAndSortedJobs = useMemo(() => {
    let result = formattedJobs.filter((job) => {
      const matchesFilter =
        activeFilter === "all" || job.details.apiUsed.toLowerCase() === activeFilter.toLowerCase();
      const matchesSearch = job.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    });

    result.sort((a, b) => {
      if (sortBy === "fileEnd") {
        return new Date(b.details.fileEnd || "1/1/1970") - new Date(a.details.fileEnd || "1/1/1970");
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

  return (
    <Container maxW="full">
      <Flex align="center" justify="space-between" py={6} flexWrap="wrap" gap={4}>
        <Box textAlign="left" flex="1">
          <Text fontSize="xl" fontWeight="bold">Scraping Jobs</Text>
          <Text fontSize="sm" color="gray.500">View and manage scraping jobs for luxury linesheets.</Text>
        </Box>
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
                onChange={(e) => setSearchQuery(e.target.value)}
                w={{ base: "100%", md: "250px" }}
              />
              <HStack spacing={4} ml="auto" align="center">
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
            color="white"
            borderColor="gray.600"
            _hover={{ borderColor: "gray.500" }}
            _focus={{ borderColor: "blue.400" }}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="fileEnd">Date</option>
            <option value="images">Image Count</option>
            <option value="records">Row Count</option>
            <option value="name">Name</option>
          </Select>
              </HStack>
            </Flex>

            <VStack spacing={4} mt={6} align="stretch">
              {filteredAndSortedJobs.map((job, index) => (
                <ScraperJobListItem key={job.id} job={job} navigate={navigate} isInitiallyExpanded={index === 0} />
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

// Scraper Job List Item Component
const ScraperJobListItem = ({ job, navigate, isInitiallyExpanded }) => {
  const [isExpanded, setIsExpanded] = useState(isInitiallyExpanded || false);

  const handleNavigate = () => {
    navigate({ to: `/scraper-jobs/${job.id}` });
  };

  return (
    <Box p="4" borderWidth="1px" borderRadius="lg">
      <Flex justify="space-between" align="center">
        <Box>
          <Text fontWeight="bold">{job.name}</Text>
          <Text fontSize="sm" color="gray.300">{job.description}</Text> {/* Much lighter subtext */}
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
            <strong>Image Start:</strong> {job.details.imageStart}
          </Text>
          <Text fontSize="sm" color="gray.600">
            <strong>File Start:</strong> {job.details.fileStart}
          </Text>
          <Text fontSize="sm" color="gray.600">
            <strong>File End:</strong> {job.details.fileEnd}
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