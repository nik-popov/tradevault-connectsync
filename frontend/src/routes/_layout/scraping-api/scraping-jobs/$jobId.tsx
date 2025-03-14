import React, { useState, useEffect } from "react";
import { useSearch } from "@tanstack/react-router"; // Search params hook
import { createFileRoute, useParams } from "@tanstack/react-router";
import {
  Container,
  Box,
  Text,
  Flex,
  Tabs,
  TabList,
  Input,
  TabPanels,
  Tab,
  TabPanel,
  Spinner,
  Button,
  Card,
  Link,
  CardBody,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Progress,
  Badge,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Image,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
} from "@chakra-ui/react";
import { BsRecord } from "react-icons/bs";
import useCustomToast from "../../../../hooks/useCustomToast"; // Import the custom toast hook

interface JobDetails {
  id: number;
  inputFile: string;
  imageStart: string;
  fileStart: string;
  fileEnd?: string;
  resultFile: string;
  fileLocationUrl: string;
  logFileUrl: string | null;
  user: string;
  rec: number;
  img: number;
  apiUsed: string;
  imageEnd?: string;
  results: ResultItem[];
  records: RecordItem[];
}

interface ResultItem {
  resultId: number;
  entryId: number;
  imageUrl: string;
  imageDesc: string;
  imageSource: string;
  createTime: string;
  imageUrlThumbnail: string;
  sortOrder: number;
  imageIsFashion: number;
  aiCaption: string | null;
  aiJson: string | null;
  aiLabel: string | null;
}

interface RecordItem {
  entryId: number;
  fileId: number;
  excelRowId: number;
  productModel: string;
  productBrand: string;
  createTime: string;
  step1: string | null;
  step2: string | null;
  step3: string | null;
  step4: string | null;
  completeTime: string | null;
  productColor: string;
  productCategory: string;
  excelRowImageRef: string | null;
}

// Component to fetch and display log content
interface LogDisplayProps {
  logUrl: string | null;
}

const LogDisplay: React.FC<LogDisplayProps> = ({ logUrl }) => {
  const [logContent, setLogContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const showToast = useCustomToast(); // Use custom toast

  useEffect(() => {
    const fetchLog = async () => {
      if (!logUrl) return;
      setIsLoading(true);
      try {
        const response = await fetch(logUrl);
        if (!response.ok) throw new Error('Failed to fetch log');
        const text = await response.text();
        setLogContent(text);
        showToast("Log Fetched", "Log content loaded successfully", "success");
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
        setError(errorMessage);
        showToast("Log Fetch Error", errorMessage, "error");
      } finally {
        setIsLoading(false);
      }
    };
    fetchLog();
  }, [logUrl, showToast]);

  if (isLoading) return <Spinner />;
  if (error) return <Text color="red.500">{error}</Text>;
  if (!logContent) return <Text>No log content available</Text>;

  return (
    <Box
      maxH="300px"
      w="full" // Matches the full width of the parent (CardBody)
      overflowY="auto"
      overflowX="auto" // Fallback for any unwrapped content
      bg="gray.800"
      color="white"
      p={2}
      borderRadius="md"
    >
      <pre
        style={{
          whiteSpace: "pre-wrap", // Wraps long lines
          wordBreak: "break-word", // Breaks long words if needed
          margin: 0, // Removes default <pre> margin for tight fit
        }}
      >
        {logContent}
      </pre>
    </Box>
  );
};

interface OverviewTabProps {
  job: JobDetails;
  sortBy: "match" | "linesheet" | null;
  setSortBy: (value: "match" | "linesheet" | null) => void;
  fetchJobData: () => Promise<void>;
  setSearchQuery: (query: string) => void;
  setActiveTab: (index: number) => void;
}

const OverviewTab: React.FC<OverviewTabProps> = ({
  job,
  sortBy,
  setSortBy,
  setSearchQuery,
  setActiveTab,
}) => {
  const [isRestarting, setIsRestarting] = useState(false);
  const [isCreatingXLS, setIsCreatingXLS] = useState(false);
  const showToast = useCustomToast(); // Use custom toast

  // State to manage sorting configuration
  const [sortConfig, setSortConfig] = useState<{
    key: "domain" | "totalResults" | "positiveSortOrderCount";
    direction: "ascending" | "descending";
  }>({
    key: "positiveSortOrderCount",
    direction: "descending",
  });

  // Function to extract domain from URL
  const getDomain = (url: string): string => {
    try {
      const hostname = new URL(url).hostname;
      return hostname.replace(/^www\./, "");
    } catch {
      return "unknown";
    }
  };

  // Aggregate domain data, excluding average sort order
  const domainData = job.results.reduce((acc, result) => {
    const domain = getDomain(result.imageSource);
    if (!acc[domain]) {
      acc[domain] = {
        totalResults: 0,
        positiveSortOrderCount: 0,
      };
    }
    acc[domain].totalResults += 1;
    if (result.sortOrder > 0) {
      acc[domain].positiveSortOrderCount += 1;
    }
    return acc;
  }, {} as Record<string, { totalResults: number; positiveSortOrderCount: number }>);

  // Get top 20 domains based on positive sort order count
  const topDomains = Object.entries(domainData)
    .map(([domain, data]) => ({
      domain,
      totalResults: data.totalResults,
      positiveSortOrderCount: data.positiveSortOrderCount,
    }))
    .sort((a, b) => b.positiveSortOrderCount - a.positiveSortOrderCount)
    .slice(0, 20); // Updated to top 20

  // Apply sorting based on sortConfig
  const sortedTopDomains = [...topDomains].sort((a, b) => {
    if (sortConfig.key === "domain") {
      const aValue = a.domain.toLowerCase();
      const bValue = b.domain.toLowerCase();
      return sortConfig.direction === "ascending"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    } else if (sortConfig.key === "totalResults") {
      return sortConfig.direction === "ascending"
        ? a.totalResults - b.totalResults
        : b.totalResults - a.totalResults;
    } else if (sortConfig.key === "positiveSortOrderCount") {
      return sortConfig.direction === "ascending"
        ? a.positiveSortOrderCount - b.positiveSortOrderCount
        : b.positiveSortOrderCount - a.positiveSortOrderCount;
    }
    return 0;
  });

  // Handle column header clicks for sorting
  const handleSort = (key: "domain" | "totalResults" | "positiveSortOrderCount") => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        return {
          key,
          direction: prev.direction === "ascending" ? "descending" : "ascending",
        };
      }
      return { key, direction: "ascending" };
    });
  };

  // Handle domain click to filter results
  const handleDomainClick = (domain: string) => {
    setSearchQuery(domain);
    setActiveTab(2); // Switch to Results tab
    showToast("Filter Applied", `Filtering results by domain: ${domain}`, "info");
  };

  // Placeholder for restart logic with toast
  const handleDevRestart = () => {
    setIsRestarting(true);
    showToast("Restart Initiated", "Restarting job in development mode", "info");
    // Add restart logic here
    setTimeout(() => {
      setIsRestarting(false);
      showToast("Restart Complete", "Job restarted successfully", "success");
    }, 2000); // Simulate async operation
  };

  // Placeholder for file generation logic with toast
  const handleCreateXLS = () => {
    setIsCreatingXLS(true);
    showToast("XLS Creation Started", "Generating XLS file", "info");
    // Add file generation logic here
    setTimeout(() => {
      setIsCreatingXLS(false);
      showToast("XLS Created", "XLS file generated successfully", "success");
    }, 2000); // Simulate async operation
  };

  return (
    <Box p={4}>
      {/* Title and Buttons */}
      <Flex justify="space-between" align="center" mb={4} flexWrap="wrap" gap={3}>
        <Text fontSize="lg" fontWeight="bold">Job Overview</Text>
        <Flex gap={3}>
          <Button size="sm" colorScheme="red" onClick={handleDevRestart} isLoading={isRestarting}>
            Dev Restart
          </Button>
          <Button size="sm" colorScheme="blue" onClick={handleCreateXLS} isLoading={isCreatingXLS}>
            Click Here To Create XLS File
          </Button>
          <Button
            size="sm"
            colorScheme={sortBy === "linesheet" ? "green" : "gray"}
            onClick={() => setSortBy(sortBy === "linesheet" ? null : "linesheet")}
          >
            Sort by Linesheet Pic
          </Button>
        </Flex>
      </Flex>

      {/* Job Overview Stats */}
      <Box mb={6}>
        <Stat>
          <StatLabel>Job ID</StatLabel>
          <StatNumber>{job.id}</StatNumber>
        </Stat>
        <Stat mt={4}>
          <StatLabel>Input File</StatLabel>
          <StatHelpText wordBreak="break-all">
            <Link href={job.fileLocationUrl} isExternal color="blue.500">
              {job.inputFile}
            </Link>
          </StatHelpText>
        </Stat>
        <Stat mt={4}>
          <StatLabel>Status</StatLabel>
          <StatNumber>
            <Badge colorScheme={job.fileEnd ? "green" : "yellow"}>
              {job.fileEnd ? "Completed" : "Pending"}
            </Badge>
          </StatNumber>
        </Stat>
        {job.fileEnd && (
          <Stat mt={4}>
            <StatLabel>Processing Duration</StatLabel>
            <StatNumber>
              {(
                (new Date(job.fileEnd).getTime() - new Date(job.fileStart).getTime()) /
                1000 /
                60
              ).toFixed(2)}{" "}
              minutes
            </StatNumber>
          </Stat>
        )}
        <Stat mt={4}>
          <StatLabel>API Used</StatLabel>
          <StatHelpText>{job.apiUsed}</StatHelpText>
        </Stat>
        <Stat mt={4}>
          <StatLabel>Total Results</StatLabel>
          <StatNumber>{job.results.length}</StatNumber>
        </Stat>
      </Box>

      {/* Top Domains Table */}
      {job.results.length > 0 && (
        <Box mt={6}>
          <Text fontSize="md" fontWeight="semibold" mb={2}>
            Top Domains by Positive Sort Orders (Top 20)
          </Text>
          <Table variant="simple" size="sm">
            <Thead>
              <Tr>
                <Th onClick={() => handleSort("domain")} cursor="pointer">
                  Domain{" "}
                  {sortConfig.key === "domain" &&
                    (sortConfig.direction === "ascending" ? "↑" : "↓")}
                </Th>
                <Th onClick={() => handleSort("totalResults")} cursor="pointer">
                  Total Results{" "}
                  {sortConfig.key === "totalResults" &&
                    (sortConfig.direction === "ascending" ? "↑" : "↓")}
                </Th>
                <Th onClick={() => handleSort("positiveSortOrderCount")} cursor="pointer">
                  Positive Sort Orders Count{" "}
                  {sortConfig.key === "positiveSortOrderCount" &&
                    (sortConfig.direction === "ascending" ? "↑" : "↓")}
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {sortedTopDomains.map(({ domain, totalResults, positiveSortOrderCount }) => (
                <Tr key={domain}>
                  <Td>
                    <Text
                      color="blue.500"
                      cursor="pointer"
                      onClick={() => handleDomainClick(domain)}
                      _hover={{ textDecoration: "underline" }}
                    >
                      {domain}
                    </Text>
                  </Td>
                  <Td>{totalResults}</Td>
                  <Td>{positiveSortOrderCount}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      )}
    </Box>
  );
};

const UsageTab = ({ job }: { job: JobDetails }) => {
  const totalRecords = job.records.length;
  const completedRecords = job.records.filter(record => record.completeTime).length;
  const pendingRecords = totalRecords - completedRecords;
  const totalImages = job.results.length;
  const imagesPerRecord = totalRecords > 0 ? Math.round(totalImages / totalRecords) : 'N/A';
  const totalRequests = totalRecords;
  const successfulRequests = job.records.filter(record =>
    job.results.some(result => result.entryId === record.entryId)
  ).length;
  const successRate = totalRequests > 0 ? `${((successfulRequests / totalRequests) * 100).toFixed(1)}%` : 'N/A';

  const calculateAvgResponseTime = (): string => {
    const completedRecordsWithTimes = job.records.filter(
      (record) => record.createTime && record.completeTime // Ensure both are non-null
    );
    if (completedRecordsWithTimes.length === 0) return 'N/A';
    const totalDuration = completedRecordsWithTimes.reduce((sum, record) => {
      const start = new Date(record.createTime!).getTime(); // Non-null assertion after filter
      const end = new Date(record.completeTime!).getTime(); // Non-null assertion after filter
      if (!isNaN(start) && !isNaN(end) && end >= start) {
        return sum + (end - start);
      }
      return sum;
    }, 0);
    const avgDurationSec = (totalDuration / completedRecordsWithTimes.length / 1000).toFixed(2);
    return `${avgDurationSec} seconds`;
  };
  const avgResponseTime = calculateAvgResponseTime();

  return (
    <Box p={4}>
      <Text fontSize="lg" fontWeight="bold" mb={4}>Usage Statistics</Text>
      <Flex direction="column" gap={6}>
        <Card shadow="md" borderWidth="1px">
          <CardBody>
            <Stat>
              <StatLabel>Total Records</StatLabel>
              <StatNumber>{totalRecords}</StatNumber>
            </Stat>
            <Stat mt={4}>
              <StatLabel>Completed Records</StatLabel>
              <StatNumber>{completedRecords}</StatNumber>
            </Stat>
            <Stat mt={4}>
              <StatLabel>Pending Records</StatLabel>
              <StatNumber>{pendingRecords}</StatNumber>
            </Stat>
          </CardBody>
        </Card>
        <Card shadow="md" borderWidth="1px">
          <CardBody>
            <Stat>
              <StatLabel>Total Images Scraped</StatLabel>
              <StatNumber>{totalImages}</StatNumber>
            </Stat>
            <Stat mt={4}>
              <StatLabel>Average Images per Record</StatLabel>
              <StatNumber>{imagesPerRecord}</StatNumber>
            </Stat>
          </CardBody>
        </Card>
        <Card shadow="md" borderWidth="1px">
          <CardBody>
            <Text fontSize="md" fontWeight="semibold" mb={2}>Scraping Metrics</Text>
            <Table variant="simple" size="sm">
              <Thead>
                <Tr>
                  <Th>Metric</Th>
                  <Th>Value</Th>
                </Tr>
              </Thead>
              <Tbody>
                <Tr>
                  <Td>Total Requests</Td>
                  <Td>{totalRequests}</Td>
                </Tr>
                <Tr>
                  <Td>Successful Requests</Td>
                  <Td>{successfulRequests}</Td>
                </Tr>
                <Tr>
                  <Td>Success Rate</Td>
                  <Td>{successRate}</Td>
                </Tr>
                <Tr>
                  <Td>Average Response Time</Td>
                  <Td>{avgResponseTime}</Td>
                </Tr>
              </Tbody>
            </Table>
          </CardBody>
        </Card>
      </Flex>
    </Box>
  );
};

interface ResultsTabProps {
  job: JobDetails;
  sortBy: "match" | "linesheet" | null;
  searchQuery: string;
  setSearchQuery: (value: string) => void;
}

const ResultsTab: React.FC<ResultsTabProps> = ({ job, sortBy, searchQuery, setSearchQuery }) => {
  const showToast = useCustomToast(); // Use custom toast

  if (!job || !job.results || !job.records || typeof setSearchQuery !== "function") {
    showToast(
      "Invalid Props",
      "Invalid job data or configuration in ResultsTab",
      "error"
    );
    return <Box p={4}><Text color="red.500">Invalid job data or configuration</Text></Box>;
  }

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 500;

  const query = (searchQuery || "").trim().toLowerCase();

  const filteredResults = job.results.filter((result) =>
    (result.imageDesc || "").toLowerCase().includes(query) ||
    (result.imageSource || "").toLowerCase().includes(query) ||
    (result.imageUrl || "").toLowerCase().includes(query)
  );

  const sortedResults = [...filteredResults].sort((a, b) => {
    if (sortBy === "match" && query) {
      const aScore = (a.imageDesc || "").toLowerCase().indexOf(query);
      const bScore = (b.imageDesc || "").toLowerCase().indexOf(query);
      return aScore === -1 ? 1 : bScore === -1 ? -1 : aScore - bScore;
    } else if (sortBy === "linesheet") {
      return (a.sortOrder || 0) - (b.sortOrder || 0);
    }
    return 0;
  });

  const filteredRecords = job.records.filter((record) =>
    (record.productModel || "").toLowerCase().includes(query) ||
    (record.productBrand || "").toLowerCase().includes(query) ||
    (record.excelRowId?.toString() || "").toLowerCase().includes(query)
  );

  const totalResults = sortedResults.length;
  const totalPages = query ? Math.ceil(totalResults / itemsPerPage) : 1;
  const startIndex = query ? (currentPage - 1) * itemsPerPage : 0;
  const paginatedResults = query ? sortedResults.slice(startIndex, startIndex + itemsPerPage) : sortedResults;

  const totalRecords = filteredRecords.length;
  const totalImages = job.results.length;
  const totalAllRecords = job.records.length;

  // Check for thumbnails (adjust key to match API)
  const hasThumbnails = filteredRecords.some((record) => record.excelRowImageRef);

  const shortenUrl = (url: string) => {
    if (!url) return "";
    let cleanedUrl = url.replace(/^https?:\/\//i, "").replace(/^www\./i, "");
    if (cleanedUrl.length <= 22) return cleanedUrl;
    return `${cleanedUrl.slice(0, 12)}...${cleanedUrl.slice(-10)}`;
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    showToast("Page Changed", `Navigated to page ${page}`, "info");
  };

  return (
    <Box p={4}>
      <Flex
        justify="space-between"
        align="center"
        mb={4}
        position="sticky"
        top="0"
        bg="transparent"
        zIndex="10"
        py={5}
        borderBottom="1px solid"
        borderColor="gray.200"
        flexWrap="wrap"
        gap={3}
        id="input-search"
      >
        <Text fontSize="lg" fontWeight="bold">Job Results</Text>
        <Input
          placeholder="Search by description, source, model, brand, etc..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onPaste={(e) => {
            const pastedText = e.clipboardData.getData("text");
            setSearchQuery(pastedText);
            showToast("Search Pasted", `Pasted search query: ${pastedText}`, "info");
            e.preventDefault();
          }}
          width="300px"
        />
      </Flex>
      <Flex direction="column" gap={6}>
        <Card shadow="md" borderWidth="1px">
          <CardBody>
            {query ? (
              <Box>
                <Stat>
                  <StatLabel>Filtered Results</StatLabel>
                  <StatNumber>{totalResults} images</StatNumber>
                  <StatHelpText>out of {totalImages} total</StatHelpText>
                </Stat>
                <Stat mt={4}>
                  <StatLabel>Filtered Records</StatLabel>
                  <StatNumber>{totalRecords} records</StatNumber>
                  <StatHelpText>out of {totalAllRecords} total</StatHelpText>
                </Stat>
              </Box>
            ) : (
              <>
                <Stat>
                  <StatLabel>Result File</StatLabel>
                  <Link href={job.resultFile} isExternal color="blue.500">
                    {job.inputFile}
                  </Link>
                </Stat>
                <Stat mt={4}>
                  <StatLabel>Total Records</StatLabel>
                  <StatNumber>{totalAllRecords}</StatNumber>
                </Stat>
                <Stat mt={4}>
                  <StatLabel>Total Images</StatLabel>
                  <StatNumber>{totalImages}</StatNumber>
                </Stat>
              </>
            )}
          </CardBody>
        </Card>
        <Card shadow="md" borderWidth="1px">
          <CardBody>
            <Text fontSize="md" fontWeight="semibold" mb={2}>Details</Text>
            <Accordion allowToggle defaultIndex={[0, 1]}>
              <AccordionItem>
                <AccordionButton>
                  <Box flex="1" textAlign="left">Results ({totalResults})</Box>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel pb={4}>
                  <Table variant="simple" size="sm" border="none">
                    <Thead>
                      <Tr>
                        <Th w="60px">Preview</Th>
                        <Th w="80px">Result ID</Th>
                        <Th w="80px">Entry ID</Th>
                        <Th w="120px">Image URL</Th>
                        <Th w="120px">Description</Th>
                        <Th w="120px">Source</Th>
                        <Th w="80px">Sort Order</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {paginatedResults.map((result) => (
                        <Tr key={result.resultId}>
                          <Td w="60px">
                            <Image
                              src={result.imageUrlThumbnail || ""}
                              alt={result.imageDesc || "No description"}
                              maxW="80px"
                              maxH="80px"
                              objectFit="cover"
                              fallback={<Text fontSize="xs">No image</Text>}
                            />
                          </Td>
                          <Td w="80px">{result.resultId || "N/A"}</Td>
                          <Td w="80px">{result.entryId || "N/A"}</Td>
                          <Td w="120px">
                            <a href={result.imageUrl || "#"} target="_blank" rel="noopener noreferrer">
                              {shortenUrl(result.imageUrl)}
                            </a>
                          </Td>
                          <Td w="120px">{result.imageDesc || "N/A"}</Td>
                          <Td w="120px">
                            <a href={result.imageSource || "#"} target="_blank" rel="noopener noreferrer">
                              {shortenUrl(result.imageSource)}
                            </a>
                          </Td>
                          <Td w="80px">{result.sortOrder || "0"}</Td>
                        </Tr>
                      ))}
                      {paginatedResults.length === 0 && (
                        <Tr>
                          <Td colSpan={7} textAlign="center">
                            No results match your search query.
                          </Td>
                        </Tr>
                      )}
                    </Tbody>
                  </Table>
                </AccordionPanel>
              </AccordionItem>
              <AccordionItem>
                <AccordionButton>
                  <Box flex="1" textAlign="left">Records ({totalRecords})</Box>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel pb={4}>
                  <Table variant="simple" size="sm" border="none">
                    <Thead>
                      <Tr>
                        {hasThumbnails && <Th w="60px">Excel Picture</Th>}
                        <Th w="80px">Entry ID</Th>
                        <Th w="80px">File ID</Th>
                        <Th w="80px">Excel Row ID</Th>
                        <Th w="120px">Style #</Th>
                        <Th w="120px">Brand</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {filteredRecords.map((record) => (
                        <Tr key={record.entryId}>
                          {hasThumbnails && (
                            <Td w="60px">
                              {record.excelRowImageRef ? (
                                <Image
                                  src={record.excelRowImageRef}
                                  alt={`Thumbnail for ${record.productModel || "Record ID " + record.entryId}`}
                                  maxW="80px"
                                  maxH="80px"
                                  objectFit="cover"
                                  cursor="pointer"
                                  onClick={() => {
                                    if (record.excelRowImageRef) {
                                      window.open(record.excelRowImageRef, "_blank");
                                      showToast("Image Opened", `Opened thumbnail for record ${record.entryId}`, "info");
                                    }
                                  }}
                                  onError={(e) => {
                                    showToast(
                                      "Image Load Failed",
                                      `Failed to load S3 image: ${record.excelRowImageRef}`,
                                      "warning"
                                    );
                                    e.currentTarget.style.display = "none";
                                    if (e.currentTarget.nextSibling) {
                                      (e.currentTarget.nextSibling as HTMLElement).style.display = "block";
                                    }
                                  }}
                                
                                  fallback={<Text fontSize="xs" display="none" color="red.500">Load failed</Text>}
                                  loading="lazy"
                                />
                              ) : (
                                <Text fontSize="xs" color="gray.500">No picture</Text>
                              )}
                            </Td>
                          )}
                          <Td w="80px">{record.entryId || "N/A"}</Td>
                          <Td w="80px">{record.fileId || "N/A"}</Td>
                          <Td w="80px">{record.excelRowId || "N/A"}</Td>
                          <Td w="120px">{record.productModel || "N/A"}</Td>
                          <Td w="120px">{record.productBrand || "N/A"}</Td>
                        </Tr>
                      ))}
                      {filteredRecords.length === 0 && (
                        <Tr>
                          <Td colSpan={hasThumbnails ? 6 : 5} textAlign="center">
                            No records match your search query.
                          </Td>
                        </Tr>
                      )}
                    </Tbody>
                  </Table>
                </AccordionPanel>
              </AccordionItem>
            </Accordion>
            {query && totalPages > 1 && (
              <Flex justify="center" mt={4} gap={2} align="center">
                <Button
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  isDisabled={currentPage === 1}
                >
                  Previous
                </Button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    size="sm"
                    variant={currentPage === page ? "solid" : "outline"}
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </Button>
                ))}
                <Button
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  isDisabled={currentPage === totalPages}
                >
                  Next
                </Button>
                <Text fontSize="sm">
                  Page {currentPage} of {totalPages}
                </Text>
              </Flex>
            )}
          </CardBody>
        </Card>
      </Flex>
    </Box>
  );
};

const LogsTab = ({ job }: { job: JobDetails }) => {
  return (
    <Box p={4}>
      <Flex justify="space-between" align="center" mb={4}>
        <Text fontSize="lg" fontWeight="bold">Logs</Text>
        {job.logFileUrl && (
          <Button
            size="sm"
            onClick={() => window.open(job.logFileUrl as string, '_blank')}
          >
            Download Log File
          </Button>
        )}
      </Flex>
      <Flex direction="column" gap={6}>
        <Card shadow="md" borderWidth="1px">
          <CardBody>
            <Text fontSize="md" fontWeight="semibold" mb={2}>Timeline Events</Text>
            <Table variant="simple" size="sm">
              {/* Table content */}
            </Table>
          </CardBody>
        </Card>
        <Card shadow="md" borderWidth="1px">
          <CardBody>
            <Text fontSize="md" fontWeight="semibold" mb={2}>Log File Preview</Text>
            <LogDisplay logUrl={job.logFileUrl} />
          </CardBody>
        </Card>
      </Flex>
    </Box>
  );
};

interface SearchRowsTabProps {
  job: JobDetails;
}

const SearchRowsTab: React.FC<SearchRowsTabProps> = ({ job }) => {
  const showToast = useCustomToast(); // Use custom toast

  // State management
  const [debugMode, setDebugMode] = useState(false);
  const [showFileDetails, setShowFileDetails] = useState(true);
  const [showResultDetails, setShowResultDetails] = useState(false);
  const [numImages, setNumImages] = useState(1);
  const [hideEmptyRows, setHideEmptyRows] = useState(false);
  const [sortConfig, setSortConfig] = useState<{
    key: string | null;
    direction: "ascending" | "descending";
  }>({ key: null, direction: "ascending" });

  // Adjust max images based on showResultDetails
  useEffect(() => {
    const maxImages = showResultDetails ? 1 : 5;
    if (numImages > maxImages) setNumImages(maxImages);
  }, [showResultDetails]);

  // Utility Functions
  const getImagesForEntry = (entryId: number, limit: number): ResultItem[] => {
    const filteredResults = job.results.filter((r) => r.entryId === entryId && r.sortOrder > 0);
    return [...filteredResults].sort((a, b) => a.sortOrder - b.sortOrder).slice(0, limit);
  };

  const getPositiveSortCountForEntry = (entryId: number): number => {
    return job.results.filter((r) => r.entryId === entryId && r.sortOrder > 0).length;
  };

  const getTotalImageCountForEntry = (entryId: number): number => {
    return job.results.filter((r) => r.entryId === entryId).length;
  };

  const shortenUrl = (url: string): string => {
    if (!url) return "";
    let cleanedUrl = url.replace(/^https?:\/\//i, "").replace(/^www\./i, "");
    if (cleanedUrl.length <= 22) return cleanedUrl;
    if (cleanedUrl.length <= 40)
      return `${cleanedUrl.slice(0, 12)}...${cleanedUrl.slice(-10)}`;
    else
      return `${cleanedUrl.slice(0, 20)}...${cleanedUrl.slice(-20)}`;
  };
  const googleSearch = (model: string): string =>
    `https://www.google.com/search?q=${encodeURIComponent(model || "")}&udm=2`;
  const googleSearchBrandModelUrl = (model: string, brand: string): string =>
    `https://www.google.com/search?q=${encodeURIComponent(`${brand || ""} ${model || ""}`)}&udm=2`;

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, url: string) => {
    e.preventDefault();
    window.open(url, "_blank", "noopener,noreferrer");
    showToast("Link Opened", `Opened URL: ${shortenUrl(url)}`, "info");
  };

  const handleIncreaseImages = () => {
    setShowResultDetails(false);
    const maxImages = showResultDetails ? 1 : 5;
    setNumImages((prev) => {
      const newValue = Math.min(prev + 1, maxImages);
      showToast("Images Increased", `Number of images set to ${newValue}`, "info");
      return newValue;
    });
  };

  const handleDecreaseImages = () => {
    setNumImages((prev) => {
      const newValue = Math.max(prev - 1, 1);
      showToast("Images Decreased", `Number of images set to ${newValue}`, "info");
      return newValue;
    });
  };

  const handleRowIdClick = (e: React.MouseEvent<HTMLElement, MouseEvent>, productModel: string) => {
    e.preventDefault();
    const url = `${window.location.pathname}?activeTab=2&search=${encodeURIComponent(productModel || "")}#input-search`;
    window.open(url, "_blank", "noopener,noreferrer");
    showToast("Row Clicked", `Opened results for model: ${productModel}`, "info");
  };

  // Sorting Logic
  const handleSort = (key: string) => {
    setSortConfig((prev) => {
      const newDirection = prev.key === key && prev.direction === "ascending" ? "descending" : "ascending";
      showToast("Sort Applied", `Sorted by ${key} (${newDirection})`, "info");
      return { key, direction: newDirection };
    });
  };

  // Check if any record has positive sort images
  const hasPositiveSortImages = job.records.some((record) => getPositiveSortCountForEntry(record.entryId) > 0);

  // Filter and sort records
  const displayedRecords = hideEmptyRows && hasPositiveSortImages
    ? job.records.filter((record) => getPositiveSortCountForEntry(record.entryId) > 0)
    : job.records;

  const sortedRecords = [...displayedRecords].sort((a, b) => {
    if (!sortConfig.key) return 0;
    let aValue: any, bValue: any;
    if (sortConfig.key === "positiveSortCount") {
      aValue = getPositiveSortCountForEntry(a.entryId);
      bValue = getPositiveSortCountForEntry(b.entryId);
    } else if (sortConfig.key === "totalImageCount") {
      aValue = getTotalImageCountForEntry(a.entryId);
      bValue = getTotalImageCountForEntry(b.entryId);
    } else {
      aValue = a[sortConfig.key as keyof RecordItem] || "";
      bValue = b[sortConfig.key as keyof RecordItem] || "";
    }
    if (aValue < bValue) return sortConfig.direction === "ascending" ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === "ascending" ? 1 : -1;
    return 0;
  });

  const hasThumbnails = sortedRecords.some((record) => record.excelRowImageRef);
  const fileId = job.records[0]?.fileId || "N/A";

  return (
    <Box p={4}>
      {/* Header with Controls */}
      <Flex
        justify="space-between"
        align="center"
        mb={4}
        position="sticky"
        top="0"
        bg="transparent"
        zIndex="10"
        py={5}
        borderBottom="1px solid"
        borderColor="gray.200"
      >
        <Text fontSize="lg" fontWeight="bold">File Rows ({sortedRecords.length})</Text>
        <Flex gap={3}>
          <Button
            borderBottom="2px solid"
            borderColor="purple.200"
            size="sm"
            colorScheme="purple"
            onClick={() => {
              setShowResultDetails(!showResultDetails);
              showToast(
                "Toggle Result Details",
                `Result details ${showResultDetails ? "hidden" : "shown"}`,
                "info"
              );
            }}
          >
            {showResultDetails ? "- Picture Details" : "+ Picture Details"}
          </Button>
          <Button
            borderBottom="2px solid"
            borderColor="blue.300"
            size="sm"
            colorScheme="blue"
            onClick={() => {
              setShowFileDetails(!showFileDetails);
              showToast(
                "Toggle File Details",
                `File details ${showFileDetails ? "hidden" : "shown"}`,
                "info"
              );
            }}
          >
            {showFileDetails ? "- File Details" : "+ File Details"}
          </Button>
          <Button
            size="sm"
            onClick={() => {
              if (job.records.length > 0) {
                setHideEmptyRows(!hideEmptyRows);
                showToast(
                  "Toggle Empty Rows",
                  hideEmptyRows ? "Showing all rows" : "Hiding empty rows",
                  "info"
                );
              }
            }}
            colorScheme={job.records.length === 0 ? "gray" : "blue"}
            variant={job.records.length === 0 ? "outline" : "solid"}
          >
            {hideEmptyRows ? "Show All Rows" : "Hide Empty Rows"}
          </Button>
          <Flex align="center" gap={2}>
            <Button size="sm" onClick={handleDecreaseImages} isDisabled={numImages <= 1}>
              -
            </Button>
            <Text>{numImages}</Text>
            <Button
              size="sm"
              onClick={handleIncreaseImages}
              isDisabled={numImages >= (showResultDetails ? 2 : 5)}
            >
              +
            </Button>
          </Flex>
          <Button
            size="sm"
            colorScheme="gray"
            onClick={() => {
              setDebugMode(true);
              showToast("Debug Mode", "Entered debug mode", "info");
            }}
          >
            Debug
          </Button>
        </Flex>
      </Flex>

      {/* Main Content */}
      {!debugMode ? (
        <Card shadow="md" borderWidth="1px" bg="rgba(113, 128, 150, 0.2)">
          <CardBody p={0}>
            <Table
              variant="simple"
              size="sm"
              borderWidth="1px"
              borderColor="gray.100"
              sx={{
                "td, th": {
                  border: "1px solid",
                  borderColor: "gray.100",
                  p: 2, // Consistent padding
                  verticalAlign: "middle", // Center content vertically
                },
              }}
            >
              <Thead>
                <Tr>
                  {showFileDetails && hasThumbnails && (
                    <Th w="80px" bg="blue.300" color="white">
                      Excel Picture
                    </Th>
                  )}
                  {Array.from({ length: numImages }).map((_, index) => (
                    <React.Fragment key={index}>
                      <Th w="100px">Picture {index + 1}</Th>
                      {showResultDetails && (
                        <Th w="200px" bg="purple.300" color="white">
                          Picture Detail {index + 1}
                        </Th>
                      )}
                    </React.Fragment>
                  ))}
                  <Th w="90px" onClick={() => handleSort("excelRowId")} cursor="pointer">
                    Row #{" "}
                    {sortConfig.key === "excelRowId" &&
                      (sortConfig.direction === "ascending" ? "↑" : "↓")}
                  </Th>
                  <Th w="150px" onClick={() => handleSort("productModel")} cursor="pointer">
                    Style #{" "}
                    {sortConfig.key === "productModel" &&
                      (sortConfig.direction === "ascending" ? "↑" : "↓")}
                  </Th>
                  <Th w="150px" onClick={() => handleSort("productBrand")} cursor="pointer">
                    Brand{" "}
                    {sortConfig.key === "productBrand" &&
                      (sortConfig.direction === "ascending" ? "↑" : "↓")}
                  </Th>
                  {showFileDetails && (
                    <>
                      <Th
                        w="120px"
                        bg="blue.300"
                        color="white"
                        onClick={() => handleSort("productColor")}
                        cursor="pointer"
                      >
                        Color Name{" "}
                        {sortConfig.key === "productColor" &&
                          (sortConfig.direction === "ascending" ? "↑" : "↓")}
                      </Th>
                      <Th
                        w="120px"
                        bg="blue.300"
                        color="white"
                        onClick={() => handleSort("productCategory")}
                        cursor="pointer"
                      >
                        Category{" "}
                        {sortConfig.key === "productCategory" &&
                          (sortConfig.direction === "ascending" ? "↑" : "↓")}
                      </Th>
                    </>
                  )}
                  <Th
                    w="100px"
                    onClick={() => handleSort("totalImageCount")}
                    cursor="pointer"
                  >
                    Total Image{" "}
                    {sortConfig.key === "totalImageCount" &&
                      (sortConfig.direction === "ascending" ? "↑" : "↓")}
                  </Th>
                  <Th
                    w="100px"
                    onClick={() => handleSort("positiveSortCount")}
                    cursor="pointer"
                  >
                    Positive Count{" "}
                    {sortConfig.key === "positiveSortCount" &&
                      (sortConfig.direction === "ascending" ? "↑" : "↓")}
                  </Th>
                </Tr>
              </Thead>
              <Tbody>
                {sortedRecords.map((record) => {
                  const imagedetails = getImagesForEntry(record.entryId, numImages);
                  const totalImageCount = getTotalImageCountForEntry(record.entryId);
                  const positiveSortCount = getPositiveSortCountForEntry(record.entryId);
                  return (
                    <Tr
                      key={record.entryId}
                      _hover={{ bg: "gray.800", opacity: 1 }}
                      opacity={positiveSortCount === 0 && !hideEmptyRows ? 0.8 : 1}
                    >
                      {showFileDetails && hasThumbnails && (
                        <Td w="80px" bg="blue.100">
                          {record.excelRowImageRef ? (
                            <Image
                              src={record.excelRowImageRef}
                              alt={`Pic of ${record.productModel || "Record"}`}
                              maxW="80px"
                              maxH="80px"
                              fallback={<Text fontSize="xs" color="red.500">Failed</Text>}
                              objectFit="cover"
  
                              onError={() => showToast("Thumbnail Error", `Failed to load thumbnail for record ${record.entryId}`, "error")}
                            />
                          ) : (
                            <Text fontSize="xs" color="gray.500">No image</Text>
                          )}
                        </Td>
                      )}
                      {imagedetails.map((image, index) => (
                        <React.Fragment key={index}>
                          <Td w="100px">
                            <Image
                              src={image.imageUrlThumbnail}
                              alt={image.imageDesc || "No description"}
                              maxW="80px"
                              maxH="80px"
                              objectFit="cover"
                              fallback={<Text fontSize="xs" color="gray.500">No image</Text>}
                              onError={() => showToast("Image Error", `Failed to load image ${index + 1} for record ${record.entryId}`, "error")}
                            />
                          </Td>
                          {showResultDetails && (
                            <Td w="200px" bg="purple.100">
                              <Box wordBreak="break-all">
                                <Text fontSize="xs" color="gray.900">
                                  <a
                                    href={googleSearch(image.imageDesc)}
                                    onClick={(e) => handleLinkClick(e, googleSearch(image.imageDesc))}
                                  >
                                    {image.imageDesc || "N/A"}
                                  </a>
                                </Text>
                                <Text fontSize="xs" color="blue.500">
                                  <a
                                    href={image.imageSource}
                                    onClick={(e) => handleLinkClick(e, image.imageSource)}
                                  >
                                    {shortenUrl(image.imageSource)}
                                  </a>
                                </Text>
                                <Text fontSize="xs" color="gray.600">
                                  <a
                                    href={image.imageUrl}
                                    onClick={(e) => handleLinkClick(e, image.imageUrl)}
                                  >
                                    {shortenUrl(image.imageUrl)}
                                  </a>
                                </Text>
                                {image.aiCaption && (
                                  <Text fontSize="xs" color="gray.400">
                                    AI Caption: {image.aiCaption}
                                  </Text>
                                )}
                                {image.aiLabel && (
                                  <Text fontSize="xs" color="gray.400">
                                    AI Label: {image.aiLabel}
                                  </Text>
                                )}
                              </Box>
                            </Td>
                          )}
                        </React.Fragment>
                      ))}
                      {/* Empty Image Slots */}
                      {Array.from({ length: numImages - imagedetails.length }).map((_, index) => (
                        <React.Fragment key={`empty-${index}`}>
                          <Td w="100px">
                            <Text fontSize="xs" color="gray.500">No picture</Text>
                          </Td>
                          {showResultDetails && (
                            <Td w="200px" bg="purple.50">
                              <Text fontSize="xs" color="gray.500">No picture detail</Text>
                            </Td>
                          )}
                        </React.Fragment>
                      ))}
                      <Td w="90px">
                        <Text
                          cursor="pointer"
                          color="white"
                          _hover={{ textDecoration: "underline" }}
                          onClick={(e) => handleRowIdClick(e, record.productModel)}
                        >
                          {record.excelRowId}
                        </Text>
                      </Td>
                      <Td w="150px">
                        {record.productModel ? (
                          <a
                            href={googleSearch(record.productModel)}
                            onClick={(e) => handleLinkClick(e, googleSearch(record.productModel))}
                          >
                            {record.productModel}
                          </a>
                        ) : (
                          <Text fontSize="xs" color="gray.500">No style</Text>
                        )}
                      </Td>
                      <Td w="150px">
                        {record.productBrand ? (
                          <a
                            href={googleSearchBrandModelUrl(record.productModel, record.productBrand)}
                            onClick={(e) =>
                              handleLinkClick(e, googleSearchBrandModelUrl(record.productModel, record.productBrand))
                            }
                          >
                            {record.productBrand}
                          </a>
                        ) : (
                          <Text fontSize="xs" color="gray.500">No brand</Text>
                        )}
                      </Td>
                      {showFileDetails && (
                        <>
                          <Td w="120px" bg="blue.50" color="gray.700">
                            {record.productColor || <Text fontSize="xs" color="gray.500">No color</Text>}
                          </Td>
                          <Td w="120px" bg="blue.50" color="gray.700">
                            {record.productCategory || <Text fontSize="xs" color="gray.500">No category</Text>}
                          </Td>
                        </>
                      )}
                      <Td w="100px">
                        {totalImageCount === 0 ? (
                          <Text fontSize="xs" color="gray.500">0</Text>
                        ) : (
                          totalImageCount
                        )}
                      </Td>
                      <Td w="100px">
                        {positiveSortCount === 0 ? (
                          <Text fontSize="xs" color="gray.500">0</Text>
                        ) : (
                          positiveSortCount
                        )}
                      </Td>
                    </Tr>
                  );
                })}
              </Tbody>
            </Table>
          </CardBody>
        </Card>
      ) : (
        <Modal isOpen={debugMode} onClose={() => {
          setDebugMode(false);
          showToast("Debug Mode Closed", "Exited debug mode", "info");
        }} size="full">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>
              <Flex justify="space-between" align="center">
                <Text>Debug Mode - Search Rows (File ID: {fileId})</Text>
                <Flex gap={3}>
                  <Button
                    colorScheme="blue"
                    size="sm"
                    onClick={() => {
                      setShowFileDetails(!showFileDetails);
                      showToast(
                        "Toggle File Details",
                        `File details ${showFileDetails ? "hidden" : "shown"} in debug mode`,
                        "info"
                      );
                    }}
                  >
                    {showFileDetails ? "Hide File Details" : "Show File Details"}
                  </Button>
                  <Button
                    colorScheme="purple"
                    size="sm"
                    onClick={() => {
                      setShowResultDetails(!showResultDetails);
                      showToast(
                        "Toggle Result Details",
                        `Result details ${showResultDetails ? "hidden" : "shown"} in debug mode`,
                        "info"
                      );
                    }}
                  >
                    {showResultDetails ? "Hide Image Details" : "Show Image Details"}
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => {
                    setDebugMode(false);
                    showToast("Debug Mode Closed", "Exited debug mode", "info");
                  }}>
                    Close
                  </Button>
                </Flex>
              </Flex>
            </ModalHeader>
            <ModalBody overflowX="auto">
              <Text>Debug mode content placeholder</Text>
            </ModalBody>
          </ModalContent>
        </Modal>
      )}
    </Box>
  );
};

const JobsDetailPage = () => {
  const { jobId } = useParams({ from: "/_layout/scraping-api/scraping-jobs/$jobId" }) as { jobId: string };
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [jobData, setJobData] = useState<JobDetails | null>(null);
  const showToast = useCustomToast(); // Use custom toast

  const searchParams = useSearch({ from: "/_layout/scraping-api/scraping-jobs/$jobId" }) as { search?: string; activeTab?: string };
  const initialTab = searchParams.activeTab ? parseInt(searchParams.activeTab, 10) : 4;
  const [activeTab, setActiveTab] = useState<number>(isNaN(initialTab) || initialTab < 0 || initialTab > 4 ? 4 : initialTab);
  const [sortBy, setSortBy] = useState<"match" | "linesheet" | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>(searchParams.search || "");

  const fetchJobData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const apiUrl = `https://backend-dev.iconluxury.group/api/scraping-jobs/${jobId}`;
      const response = await fetch(apiUrl, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) {
        throw new Error(`Failed to fetch job data: ${response.status} - ${response.statusText}`);
      }
      const data: JobDetails = await response.json();
      showToast("Job Data Loaded", `Fetched data for job ${jobId}`, "success");
      setJobData(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred";
      showToast("Fetch Error", errorMessage, "error");
      setError(errorMessage);
      setJobData(null);
    } finally {
      setIsLoading(false);
    }
  };
    useEffect(() => {
    fetchJobData();
  }, [jobId]);

  if (isLoading) {
    return (
      <Container maxW="full" py={6}>
        <Flex justify="center" align="center" h="200px">
          <Spinner size="xl" color="blue.500" />
        </Flex>
      </Container>
    );
  }

  if (error || !jobData) {
    return (
      <Container maxW="full" py={6}>
        <Text color="red.500">{error || "Job data not available"}</Text>
      </Container>
    );
  }

  const tabsConfig = [
    {
      title: "Overview",
      component: () => (
        <OverviewTab
          job={jobData}
          sortBy={sortBy}
          setSortBy={setSortBy}
          fetchJobData={fetchJobData}
          setSearchQuery={setSearchQuery}
          setActiveTab={setActiveTab}
        />
      ),
    },
    { title: "Usage", component: () => <UsageTab job={jobData} /> },
    {
      title: "Results",
      component: () => (
        <ResultsTab
          job={jobData}
          sortBy={sortBy}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
      ),
    },
    { title: "Logs", component: () => <LogsTab job={jobData} /> },
    { title: "File Rows", component: () => <SearchRowsTab job={jobData} /> },
  ];

  return (
    <Container maxW="full">
      <Flex align="center" justify="space-between" py={6} flexWrap="wrap" gap={4}>
        <Box textAlign="left" flex="1">
          <Text fontSize="xl" fontWeight="bold">Job: {jobId}</Text>
          <Text fontSize="sm">Details and results for scraping job {jobData.inputFile}.</Text>
        </Box>
      </Flex>
      <Tabs
        variant="enclosed"
        isLazy
        index={activeTab}
        onChange={(index) => {
          setActiveTab(index);
        }}
      >
        <TabList>
          {tabsConfig.map((tab) => (
            <Tab key={tab.title}>{tab.title}</Tab>
          ))}
        </TabList>
        <TabPanels>
          {tabsConfig.map((tab) => (
            <TabPanel key={tab.title}>{tab.component()}</TabPanel>
          ))}
        </TabPanels>
      </Tabs>
    </Container>
  );
};

export const Route = createFileRoute("/_layout/scraping-api/scraping-jobs/$jobId")({
  component: JobsDetailPage,
});

export default JobsDetailPage;