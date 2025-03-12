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
}

// Component to fetch and display log content
interface LogDisplayProps {
  logUrl: string | null;
}

const LogDisplay: React.FC<LogDisplayProps> = ({ logUrl }) => {
  const [logContent, setLogContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLog = async () => {
      if (!logUrl) return;
      setIsLoading(true);
      try {
        const response = await fetch(logUrl);
        if (!response.ok) throw new Error('Failed to fetch log');
        const text = await response.text();
        setLogContent(text);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setIsLoading(false);
      }
    };
    fetchLog();
  }, [logUrl]);

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
  fetchJobData: () => Promise<void>; // Added for auto-reload
}

const OverviewTab: React.FC<OverviewTabProps> = ({ job, sortBy, setSortBy, fetchJobData }) => {
  const status = job.fileEnd ? "Completed" : "Pending";
  const duration = job.fileEnd && job.fileStart
    ? (new Date(job.fileEnd).getTime() - new Date(job.fileStart).getTime()) / 1000 / 60
    : null;
  const [isRestarting, setIsRestarting] = useState(false); // Loading state for Dev Restart
  const [isCreatingXLS, setIsCreatingXLS] = useState(false); // Loading state for XLS

  const handleDevRestart = async () => {
    setIsRestarting(true);
    try {
      const response = await fetch(`https://dev-image-distro.popovtech.com/restart-failed-batch/?file_id_db=${job.id}`, {
        method: "POST",
        headers: {
          "Accept": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error(`Failed to restart dev: ${response.status} - ${response.statusText}`);
      }
      const responseText = await response.text();
      console.log("Dev Restart successful:", responseText);
      // Auto-reload after 5 seconds
      setTimeout(() => {
        fetchJobData();
        setIsRestarting(false);
      }, 5000);
    } catch (error) {
      console.error("Error during Dev Restart:", error);
      setIsRestarting(false);
    }
  };

  const handleCreateXLS = async () => {
    setIsCreatingXLS(true);
    try {
      const response = await fetch(`https://image-backend-cms-icon-7.popovtech.com/generate-download-file/?file_id=${job.id}`, {
        method: "POST",
        headers: {
          "Accept": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error(`Failed to create XLS file: ${response.status} - ${response.statusText}`);
      }
      const responseText = await response.text();
      console.log("XLS File creation successful:", responseText);
      // No auto-reload here unless specified
    } catch (error) {
      console.error("Error during XLS creation:", error);
    } finally {
      setIsCreatingXLS(false);
    }
  };

  return (
    <Box p={4}>
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
            colorScheme={sortBy === "match" ? "green" : "gray"}
            onClick={() => setSortBy(sortBy === "match" ? null : "match")}
          >
            Sort by Match
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
      <Card shadow="md" borderWidth="1px">
        <CardBody>
          <Stat>
            <StatLabel>Job ID</StatLabel>
            <StatNumber>{job.id}</StatNumber>
          </Stat>
          <Stat mt={4}>
            <StatLabel>Input File</StatLabel>
            <StatHelpText wordBreak="break-all">{job.inputFile}</StatHelpText>
          </Stat>
          <Stat mt={4}>
            <StatLabel>Status</StatLabel>
            <StatNumber>
              <Badge colorScheme={status === "Completed" ? "green" : "yellow"}>{status}</Badge>
            </StatNumber>
          </Stat>
          {duration && (
            <Stat mt={4}>
              <StatLabel>Processing Duration</StatLabel>
              <StatNumber>{duration.toFixed(2)} minutes</StatNumber>
            </Stat>
          )}
          <Stat mt={4}>
            <StatLabel>API Used</StatLabel>
            <StatHelpText>{job.apiUsed}</StatHelpText>
          </Stat>
        </CardBody>
      </Card>
    </Box>
  );
};



const UsageTab = ({ job }: { job: JobDetails }) => {
  const totalRecords = job.records.length;
  const totalImages = job.results.length;
  const imagesPerRecord = totalRecords > 0 ? (totalImages / totalRecords).toFixed(2) : 'N/A';
  const maxRecords = 1000;
  const maxImages = 20000;
  const totalRequests = totalRecords; // Assuming each record is a request
  const successfulRequests = job.records.filter(record =>
    job.results.some(result => result.entryId === record.entryId)
  ).length;
  const successRate = totalRequests > 0 ? `${((successfulRequests / totalRequests) * 100).toFixed(1)}%` : 'N/A';
  const avgResponseTime = 'N/A'; // Cannot calculate without timestamps

  return (
    <Box p={4}>
      <Text fontSize="lg" fontWeight="bold" mb={4}>Usage Statistics</Text>
      <Flex direction="column" gap={6}>
        <Card shadow="md" borderWidth="1px">
          <CardBody>
            <Stat>
              <StatLabel>Total Records Processed</StatLabel>
              <StatNumber>{totalRecords}</StatNumber>
              <Progress value={(totalRecords / maxRecords) * 100} size="sm" colorScheme="blue" mt={2} />
              <StatHelpText>{((totalRecords / maxRecords) * 100).toFixed(1)}% of max ({maxRecords})</StatHelpText>
            </Stat>
          </CardBody>
        </Card>
        <Card shadow="md" borderWidth="1px">
          <CardBody>
            <Stat>
              <StatLabel>Total Images Scraped</StatLabel>
              <StatNumber>{totalImages}</StatNumber>
              <Progress value={(totalImages / maxImages) * 100} size="sm" colorScheme="green" mt={2} />
              <StatHelpText>{((totalImages / maxImages) * 100).toFixed(1)}% of max ({maxImages})</StatHelpText>
            </Stat>
          </CardBody>
        </Card>
        <Card shadow="md" borderWidth="1px">
          <CardBody>
            <Stat>
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
                  <Td>Success Rate</Td>
                  <Td>{successRate}</Td>
                </Tr>
                <Tr>
                  <Td>Avg Response Time</Td>
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
  if (!job || !job.results || !job.records || typeof setSearchQuery !== "function") {
    console.error("Invalid props in ResultsTab:", { job, setSearchQuery });
    return <Box p={4}><Text color="red.500">Invalid job data or configuration</Text></Box>;
  }

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 50;

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

  const shortenUrl = (url: string) => {
    if (!url) return "";
    let cleanedUrl = url
      .replace(/^https?:\/\//i, "")
      .replace(/^www\./i, "");
    if (cleanedUrl.length <= 22) return cleanedUrl;
    return `${cleanedUrl.slice(0, 12)}...${cleanedUrl.slice(-10)}`;
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <Box p={4}>
      <Flex justify="space-between" align="center" mb={4} flexWrap="wrap" gap={3}>
        <Text fontSize="lg" fontWeight="bold">Job Results</Text>
        <Input
          placeholder="Search by description, source, model, brand, etc..."
          value={searchQuery}
          onChange={(e) => {
            console.log("onChange called with value:", e.target.value);
            setSearchQuery(e.target.value);
          }}
          onPaste={(e) => {
            const pastedText = e.clipboardData.getData("text");
            console.log("onPaste called with value:", pastedText);
            setSearchQuery(pastedText);
            e.preventDefault();
          }}
          width="300px"
          readOnly={false}
          disabled={false}
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
                  <StatHelpText wordBreak="break-all">{job.resultFile || "Not available"}</StatHelpText>
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
                              maxW="50px"
                              maxH="50px"
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
                        <Th w="80px">Entry ID</Th>
                        <Th w="80px">File ID</Th>
                        <Th w="80px">Excel Row ID</Th>
                        <Th w="120px">Product Model</Th>
                        <Th w="120px">Brand</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {filteredRecords.map((record) => (
                        <Tr key={record.entryId}>
                          <Td w="80px">{record.entryId || "N/A"}</Td>
                          <Td w="80px">{record.fileId || "N/A"}</Td>
                          <Td w="80px">{record.excelRowId || "N/A"}</Td>
                          <Td w="120px">{record.productModel || "N/A"}</Td>
                          <Td w="120px">{record.productBrand || "N/A"}</Td>
                        </Tr>
                      ))}
                      {filteredRecords.length === 0 && (
                        <Tr>
                          <Td colSpan={5} textAlign="center">
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
          <Button size="sm" onClick={() => window.open(job.logFileUrl, '_blank')}>
            Download Log File
          </Button>
        )}
      </Flex>
      <Flex direction="column" gap={6}>
        <Card shadow="md" borderWidth="1px">
          <CardBody>
            <Text fontSize="md" fontWeight="semibold" mb={2}>Timeline Events</Text>
            <Table variant="simple" size="sm">
              <Thead>
                <Tr>
                  <Th>Event</Th>
                  <Th>Time</Th>
                </Tr>
              </Thead>
              <Tbody>
                <Tr>
                  <Td>Image Scraping Start</Td>
                  <Td>{job.imageStart}</Td>
                </Tr>
                {job.imageEnd && (
                  <Tr>
                    <Td>Image Scraping End</Td>
                    <Td>{job.imageEnd}</Td>
                  </Tr>
                )}
                <Tr>
                  <Td>File Processing Start</Td>
                  <Td>{job.fileStart}</Td>
                </Tr>
                {job.fileEnd && (
                  <Tr>
                    <Td>File Processing End</Td>
                    <Td>{job.fileEnd}</Td>
                  </Tr>
                )}
              </Tbody>
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
  setSearchQuery: (value: string) => void;
  setActiveTab: (index: number) => void;
}

const SearchRowsTab: React.FC<SearchRowsTabProps> = ({ job, setSearchQuery, setActiveTab }) => {
  const [debugMode, setDebugMode] = useState(false);
  const [showFileDetails, setShowFileDetails] = useState(true);
  const [showResultDetails, setShowResultDetails] = useState(false);
  const [numImages, setNumImages] = useState(1);
  const [hideEmptyRows, setHideEmptyRows] = useState(true);

  useEffect(() => {
    const maxImages = showResultDetails ? 3 : 10;
    if (numImages > maxImages) {
      setNumImages(maxImages);
    }
  }, [showResultDetails]);

  const getImagesForEntry = (entryId: number, limit: number) => {
    const filteredResults = job.results.filter((r) => r.entryId === entryId && r.sortOrder > 0);
    return [...filteredResults].sort((a, b) => a.sortOrder - b.sortOrder).slice(0, limit);
  };

  const getImageCountForEntry = (entryId: number) => {
    return job.results.filter((r) => r.entryId === entryId && r.sortOrder > 0).length;
  };
  const shortenUrl = (url: string) => {
    if (!url) return "";
    let cleanedUrl = url
      .replace(/^https?:\/\//i, "")
      .replace(/^www\./i, "");
    if (cleanedUrl.length <= 22) return cleanedUrl;
    return `${cleanedUrl.slice(0, 12)}...${cleanedUrl.slice(-10)}`;
  };

  const googleSearchModelUrl = (model: string) =>
    `https://www.google.com/search?q=${encodeURIComponent(`${model || ""}`)}&udm=2`;

  const googleSearchBrandModelUrl = (model: string, brand: string) =>
    `https://www.google.com/search?q=${encodeURIComponent(`${brand || ""} ${model || ""}`)}&udm=2`;

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, url: string) => {
    e.preventDefault();
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleIncreaseImages = () => {
    const maxImages = showResultDetails ? 3 : 10;
    setNumImages((prev) => Math.min(prev + 1, maxImages));
  };

  const handleDecreaseImages = () => {
    setNumImages((prev) => Math.max(prev - 1, 1));
  };

  const handleRowIdClick = (e: React.MouseEvent<HTMLTextElement, MouseEvent>, productModel: string) => {
    e.preventDefault(); // Prevent any default navigation
    const url = `${window.location.pathname}?activeTab=2&search=${encodeURIComponent(productModel || "")}`;
    window.open(url, "_blank", "noopener,noreferrer"); // Open in new tab, no navigation in current tab
  };

  const fileId = job.records[0]?.fileId || "N/A";

  const displayedRecords = hideEmptyRows
    ? job.records.filter((record) => getImageCountForEntry(record.entryId) > 0)
    : job.records;

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
      >
        <Text fontSize="lg" fontWeight="bold">File Rows</Text>
        <Flex gap={3}>
          <Button size="sm" colorScheme="purple" onClick={() => setShowResultDetails(!showResultDetails)}>
            {showResultDetails ? "Hide Image Details" : "Show Image Details"}
          </Button>
          <Button size="sm" colorScheme="gray" onClick={() => setDebugMode(true)}>
            Debug
          </Button>
          <Button size="sm" colorScheme="blue" onClick={() => setShowFileDetails(!showFileDetails)}>
            {showFileDetails ? "Hide File Details" : "Show File Details"}
          </Button>
          <Button size="sm" colorScheme="teal" onClick={() => setHideEmptyRows(!hideEmptyRows)}>
            {hideEmptyRows ? "Show All Rows" : "Hide Empty Rows"}
          </Button>
          <Flex align="center" gap={2}>
            <Button size="sm" onClick={handleDecreaseImages} isDisabled={numImages <= 1}>
              -
            </Button>
            <Button size="sm" onClick={handleIncreaseImages} isDisabled={numImages >= (showResultDetails ? 3 : 10)}>
              +
            </Button>
          </Flex>
        </Flex>
      </Flex>
      {!debugMode ? (
        <Card shadow="md" borderWidth="1px">
          <CardBody p={0}>
            <Table
              variant="simple"
              size="sm"
              borderWidth="1px"
              borderColor="gray.200"
              sx={{ "td, th": { border: "1px solid", borderColor: "gray.200" } }}
            >
              <Thead>
                <Tr>
                  {Array.from({ length: numImages }).map((_, index) => (
                    <React.Fragment key={index}>
                      <Th>Image {index + 1}</Th>
                      {showResultDetails && <Th>Details {index + 1}</Th>}
                    </React.Fragment>
                  ))}
                  <Th>Excel Row ID</Th>
                  <Th>Product Model</Th>
                  <Th>Brand</Th>
                  {showFileDetails && (
                    <>
                      <Th>Color</Th>
                      <Th>Category</Th>
                    </>
                  )}
                  <Th>Image Count</Th>
                </Tr>
              </Thead>
              <Tbody>
                {displayedRecords.map((record) => {
                  const imagedetails = getImagesForEntry(record.entryId, numImages);
                  const imageCount = getImageCountForEntry(record.entryId);
                  return (
                    <Tr
                      key={record.entryId}
                      opacity={imageCount === 0 && !hideEmptyRows ? 0.3 : 1}
                    >
                      {imagedetails.map((image, index) => (
                        <React.Fragment key={index}>
                          <Td>
                            <Box textAlign="center">
                              <Image
                                src={image.imageUrlThumbnail}
                                alt={image.imageDesc || "No description"}
                                maxW="80px"
                                maxH="80px"
                                objectFit="cover"
                                cursor="pointer"
                                onClick={() => window.open(image.imageUrlThumbnail, "_blank")}
                              />
                              <Text fontSize="xs">Sort Order: {image.sortOrder}</Text>
                            </Box>
                          </Td>
                          {showResultDetails && (
                            <Td>
                              <Box>
                                <Text fontSize="xs" color="gray.100">
                                  <a href={googleSearchModelUrl(record.productModel)} onClick={(e) => handleLinkClick(e, googleSearchModelUrl(record.productModel))}>
                                    {image.imageDesc || "N/A"}
                                  </a>
                                </Text>
                                <Text fontSize="xs" color="gray.500">
                                  <a href={image.imageSource} onClick={(e) => handleLinkClick(e, image.imageSource)}>
                                    {shortenUrl(image.imageSource)}
                                  </a>
                                </Text>
                                <Text fontSize="xs" color="gray.300">
                                  <a href={image.imageUrl} onClick={(e) => handleLinkClick(e, image.imageUrl)}>
                                    {shortenUrl(image.imageUrl)}
                                  </a>
                                </Text>
                              </Box>
                            </Td>
                          )}
                        </React.Fragment>
                      ))}
                      {Array.from({ length: numImages - imagedetails.length }).map((_, index) => (
                        <React.Fragment key={`empty-${index}`}>
                          <Td>-</Td>
                          {showResultDetails && <Td>-</Td>}
                        </React.Fragment>
                      ))}
                      <Td>
                        <Text
                          cursor="pointer"
                          color="white"
                          _hover={{ textDecoration: "underline" }}
                          onClick={(e) => handleRowIdClick(e, record.productModel)}
                        >
                          {record.excelRowId}
                        </Text>
                      </Td>
                      <Td>
                        <a href={googleSearchModelUrl(record.productModel)} onClick={(e) => handleLinkClick(e, googleSearchModelUrl(record.productModel))}>
                          {record.productModel || "N/A"}
                        </a>
                      </Td>
                      <Td>
                        <a href={googleSearchBrandModelUrl(record.productModel, record.productBrand)} onClick={(e) => handleLinkClick(e, googleSearchBrandModelUrl(record.productModel, record.productBrand))}>
                          {record.productBrand || "N/A"}
                        </a>
                      </Td>
                      {showFileDetails && (
                        <>
                          <Td>{record.productColor || "N/A"}</Td>
                          <Td>{record.productCategory || "N/A"}</Td>
                        </>
                      )}
                      <Td>{imageCount}</Td>
                    </Tr>
                  );
                })}
              </Tbody>
            </Table>
          </CardBody>
        </Card>
      ) : (
        <Modal isOpen={debugMode} onClose={() => setDebugMode(false)} size="full">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>
              <Flex justify="space-between" align="center">
                <Text>Debug Mode - Search Rows (File ID: {fileId})</Text>
                <Flex gap={3}>
                  <Button
                    colorScheme="blue"
                    size="sm"
                    onClick={() => setShowFileDetails(!showFileDetails)}
                  >
                    {showFileDetails ? "Hide File Details" : "Show File Details"}
                  </Button>
                  <Button
                    colorScheme="purple"
                    size="sm"
                    onClick={() => setShowResultDetails(!showResultDetails)}
                  >
                    {showResultDetails ? "Hide Image Details" : "Show Image Details"}
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setDebugMode(false)}>
                    Close
                  </Button>
                </Flex>
              </Flex>
            </ModalHeader>
            <ModalBody overflowX="auto">
              {/* Debug mode table content omitted for brevity */}
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
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error(`Failed to fetch job data: ${response.status} - ${response.statusText}`);
      }
      const data: JobDetails = await response.json();
      setJobData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
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
    { title: "Overview", component: () => <OverviewTab job={jobData} sortBy={sortBy} setSortBy={setSortBy} fetchJobData={fetchJobData} /> },
    { title: "Usage", component: () => <UsageTab job={jobData} /> },
    { title: "Results", component: () => (
      <ResultsTab
        job={jobData}
        sortBy={sortBy}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery} // Explicitly passed
      />
    )},
    { title: "Logs", component: () => <LogsTab job={jobData} /> },
    { title: "File Rows", component: () => <SearchRowsTab job={jobData} setSearchQuery={setSearchQuery} setActiveTab={setActiveTab} /> },
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
        onChange={(index) => setActiveTab(index)}
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