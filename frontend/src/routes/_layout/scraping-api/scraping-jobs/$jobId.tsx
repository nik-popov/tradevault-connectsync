import React, { useState, useEffect } from "react";
import { createFileRoute, useParams } from "@tanstack/react-router";
import {
  Container,
  Box,
  Text,
  Flex,
  Tabs,
  TabList,
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
const LogDisplay = ({ logUrl }: { logUrl: string | null }) => {
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
    <Box maxH="300px" overflowY="auto" bg="gray.50" p={2}>
      <pre>{logContent}</pre>
    </Box>
  );
};

const OverviewTab = ({ job }: { job: JobDetails }) => {
  const status = job.fileEnd ? "Completed" : "Pending";
  const duration = job.fileEnd && job.fileStart
    ? (new Date(job.fileEnd).getTime() - new Date(job.fileStart).getTime()) / 1000 / 60
    : null;

  return (
    <Box p={4}>
      <Text fontSize="lg" fontWeight="bold" mb={4}>Job Overview</Text>
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

const ResultsTab = ({ job }: { job: JobDetails }) => {
  const totalRecords = job.records.length;
  const totalImages = job.results.length;

  const handleDownload = () => {
    if (job.fileLocationUrl) {
      window.open(job.fileLocationUrl, "_blank", "noopener,noreferrer");
    }
  };

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, url: string) => {
    e.preventDefault();
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <Box p={4}>
      <Flex justify="space-between" align="center" mb={4}>
        <Text fontSize="lg" fontWeight="bold">Job Results</Text>
        {job.fileLocationUrl && (
          <Button size="sm" colorScheme="blue" onClick={handleDownload}>
            Download Result File
          </Button>
        )}
      </Flex>
      <Flex direction="column" gap={6}>
        <Card shadow="md" borderWidth="1px">
          <CardBody>
            <Stat>
              <StatLabel>Result File</StatLabel>
              <StatHelpText wordBreak="break-all">{job.resultFile || 'Not available'}</StatHelpText>
            </Stat>
            <Stat mt={4}>
              <StatLabel>Total Records</StatLabel>
              <StatNumber>{totalRecords}</StatNumber>
            </Stat>
            <Stat mt={4}>
              <StatLabel>Total Images</StatLabel>
              <StatNumber>{totalImages}</StatNumber>
            </Stat>
          </CardBody>
        </Card>
        <Card shadow="md" borderWidth="1px">
          <CardBody>
            <Text fontSize="md" fontWeight="semibold" mb={2}>Details</Text>
            <Accordion allowToggle>
              <AccordionItem>
                <AccordionButton>
                  <Box flex="1" textAlign="left">Scraping Results</Box>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel pb={4}>
                  <Table variant="simple" size="sm">
                    <Thead>
                      <Tr>
                        <Th>Result ID</Th>
                        <Th>Entry ID</Th>
                        <Th>Image URL</Th>
                        <Th>Description</Th>
                        <Th>Source</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {job.results.map((result) => (
                        <Tr key={result.resultId}>
                          <Td>{result.resultId}</Td>
                          <Td>{result.entryId}</Td>
                          <Td>
                            <a
                              href={result.imageUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => handleLinkClick(e, result.imageUrl)}
                            >
                              Link
                            </a>
                          </Td>
                          <Td>{result.imageDesc}</Td>
                          <Td>
                            <a
                              href={result.imageSource}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => handleLinkClick(e, result.imageSource)}
                            >
                              Source
                            </a>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </AccordionPanel>
              </AccordionItem>
              <AccordionItem>
                <AccordionButton>
                  <Box flex="1" textAlign="left">Scraping Records</Box>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel pb={4}>
                  <Table variant="simple" size="sm">
                    <Thead>
                      <Tr>
                        <Th>Entry ID</Th>
                        <Th>File ID</Th>
                        <Th>Excel Row ID</Th>
                        <Th>Product Model</Th>
                        <Th>Brand</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {job.records.map((record) => (
                        <Tr key={record.entryId}>
                          <Td>{record.entryId}</Td>
                          <Td>{record.fileId}</Td>
                          <Td>{record.excelRowId}</Td>
                          <Td>{record.productModel}</Td>
                          <Td>{record.productBrand}</Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </AccordionPanel>
              </AccordionItem>
            </Accordion>
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

const SearchRowsTab = ({ job }: { job: JobDetails }) => {
  const [debugMode, setDebugMode] = useState(false);
  const [showFileDetails, setShowFileDetails] = useState(false);
  const [showResultDetails, setShowResultDetails] = useState(true);
  const [showExtraImages, setShowExtraImages] = useState(false);
  const [imageLimit, setImageLimit] = useState(10);

  const getImagesForEntry = (entryId: number) => {
    const entryResults = job.results.filter((r) => r.entryId === entryId);
    const limit = debugMode ? imageLimit : (showExtraImages ? 2 : 1);
    return entryResults.slice(0, limit);
  };

  const shortenSourceUrl = (url: string) => {
    return url.length > 30 ? `${url.slice(0, 27)}...` : url;
  };

  const shortenImageUrl = (url: string) => {
    return url.length > 30 ? `...${url.slice(-27)}` : url;
  };

  const googleSearchModelUrl = (model: string) =>
    `https://www.google.com/search?q=${encodeURIComponent(`${model} - US`)}&udm=2`;

  const googleSearchBrandModelUrl = (model: string, brand: string) =>
    `https://www.google.com/search?q=${encodeURIComponent(`${brand} ${model} - US`)}&udm=2`;

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, url: string) => {
    e.preventDefault();
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const fileId = job.records[0]?.fileId || "N/A";

  return (
    <Box p={4}>
      <Flex justify="space-between" align="center" mb={4}>
        <Text fontSize="lg" fontWeight="bold">File Rows</Text>
        <Flex gap={3}>
          <Button size="sm" colorScheme="gray" onClick={() => setDebugMode(true)}>
            Debug
          </Button>
          <Button
            size="sm"
            colorScheme="purple"
            onClick={() => setShowResultDetails(!showResultDetails)}
          >
            {showResultDetails ? "Hide Image Details" : "Show Image Details"}
          </Button>
          {!debugMode && (
            <Button
              size="sm"
              colorScheme="teal"
              onClick={() => setShowExtraImages(!showExtraImages)}
            >
              {showExtraImages ? "Hide 2nd Image" : "Show 2nd Image"}
            </Button>
          )}
          {!debugMode && (
            <Button
              size="sm"
              colorScheme="blue"
              onClick={() => setShowFileDetails(!showFileDetails)}
            >
              {showFileDetails ? "Hide File Details" : "Show File Details"}
            </Button>
          )}
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
                  <Th>Image 1</Th>
                  {showExtraImages && <Th>Image 2</Th>}
                  {showResultDetails && (
                    <>
                      <Th>Details 1</Th>
                      {showExtraImages && <Th>Details 2</Th>}
                    </>
                  )}
                  <Th>Excel Row ID</Th>
                  <Th>Product Model</Th>
                  <Th>Brand</Th>
                  {showFileDetails && (
                    <>
                      <Th>Color</Th>
                      <Th>Category</Th>
                    </>
                  )}
                </Tr>
              </Thead>
              <Tbody>
                {job.records.map((record) => {
                  const images = getImagesForEntry(record.entryId);
                  const hasSecondImage = showExtraImages && images.length > 1;
                  return (
                    <Tr key={record.entryId}>
                      <Td>
                        {images[0] ? (
                          <Box textAlign="center">
                            <Image
                              src={images[0].imageUrlThumbnail}
                              alt={images[0].imageDesc}
                              maxW="80px"
                              maxH="80px"
                              objectFit="cover"
                              cursor="pointer"
                              onClick={() => window.open(images[0].imageUrlThumbnail, "_blank")}
                            />
                          </Box>
                        ) : (
                          "-"
                        )}
                      </Td>
                      {showExtraImages && (
                        <Td>
                          {hasSecondImage ? (
                            <Box textAlign="center">
                              <Image
                                src={images[1].imageUrlThumbnail}
                                alt={images[1].imageDesc}
                                maxW="80px"
                                maxH="80px"
                                objectFit="cover"
                                cursor="pointer"
                                onClick={() => window.open(images[1].imageUrlThumbnail, "_blank")}
                              />
                            </Box>
                          ) : (
                            "-"
                          )}
                        </Td>
                      )}
                      {showResultDetails && (
                        <>
                          <Td>
                            {images[0] ? (
                              <Box>
                                <Text fontSize="xs" color="gray.100">
                                  <a
                                    href={googleSearchModelUrl(record.productModel)}
                                    onClick={(e) =>
                                      handleLinkClick(e, googleSearchModelUrl(record.productModel))
                                    }
                                  >
                                    {images[0].imageDesc}
                                  </a>
                                </Text>
                                <Text fontSize="xs" color="gray.500">
                                  <a
                                    href={images[0].imageSource}
                                    onClick={(e) => handleLinkClick(e, images[0].imageSource)}
                                  >
                                    {shortenSourceUrl(images[0].imageSource)}
                                  </a>
                                </Text>
                                <Text fontSize="xs" color="gray.300">
                                  <a
                                    href={images[0].imageUrl}
                                    onClick={(e) => handleLinkClick(e, images[0].imageUrl)}
                                  >
                                    {shortenImageUrl(images[0].imageUrl)}
                                  </a>
                                </Text>
                              </Box>
                            ) : (
                              "-"
                            )}
                          </Td>
                          {showExtraImages && (
                            <Td>
                              {hasSecondImage ? (
                                <Box>
                                  <Text fontSize="xs" color="gray.100">
                                    <a
                                      href={googleSearchModelUrl(record.productModel)}
                                      onClick={(e) =>
                                        handleLinkClick(e, googleSearchModelUrl(record.productModel))
                                      }
                                    >
                                      {images[1].imageDesc}
                                    </a>
                                  </Text>
                                  <Text fontSize="xs" color="gray.500">
                                    <a
                                      href={images[1].imageSource}
                                      onClick={(e) => handleLinkClick(e, images[1].imageSource)}
                                    >
                                      {shortenSourceUrl(images[1].imageSource)}
                                    </a>
                                  </Text>
                                  <Text fontSize="xs" color="gray.300">
                                    <a
                                      href={images[1].imageUrl}
                                      onClick={(e) => handleLinkClick(e, images[1].imageUrl)}
                                    >
                                      {shortenImageUrl(images[1].imageUrl)}
                                    </a>
                                  </Text>
                                </Box>
                              ) : (
                                "-"
                              )}
                            </Td>
                          )}
                        </>
                      )}
                      <Td>{record.excelRowId}</Td>
                      <Td>
                        <a
                          href={googleSearchModelUrl(record.productModel)}
                          onClick={(e) => handleLinkClick(e, googleSearchModelUrl(record.productModel))}
                        >
                          {record.productModel}
                        </a>
                      </Td>
                      <Td>
                        <a
                          href={googleSearchBrandModelUrl(record.productModel, record.productBrand)}
                          onClick={(e) =>
                            handleLinkClick(e, googleSearchBrandModelUrl(record.productModel, record.productBrand))
                          }
                        >
                          {record.productBrand}
                        </a>
                      </Td>
                      {showFileDetails && (
                        <>
                          <Td>{record.productColor}</Td>
                          <Td>{record.productCategory}</Td>
                        </>
                      )}
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
                  <Button
                    colorScheme="green"
                    size="sm"
                    onClick={() => setImageLimit(imageLimit === 10 ? job.results.length : 10)}
                  >
                    {imageLimit === 10 ? "Show All" : "Top 10"}
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setDebugMode(false)}>
                    Close
                  </Button>
                </Flex>
              </Flex>
            </ModalHeader>
            <ModalBody overflowX="auto">
              <Table
                variant="simple"
                size="sm"
                borderWidth="1px"
                borderColor="gray.200"
                sx={{ "td, th": { border: "1px solid", borderColor: "gray.200", minWidth: "80px" } }}
              >
                <Thead>
                  <Tr>
                    {showFileDetails ? (
                      <>
                        <Th>Excel Row ID</Th>
                        <Th>Product Model</Th>
                        <Th>Brand</Th>
                        <Th>Color</Th>
                        <Th>Category</Th>
                      </>
                    ) : (
                      <>
                        <Th>Excel Row ID</Th>
                        <Th>Product Model</Th>
                      </>
                    )}
                    {Array.from({ length: imageLimit }).map((_, idx) => (
                      <React.Fragment key={idx}>
                        <Th>Image {idx + 1}</Th>
                        {showResultDetails && <Th>Details {idx + 1}</Th>}
                      </React.Fragment>
                    ))}
                  </Tr>
                </Thead>
                <Tbody>
                  {job.records.map((record) => {
                    const images = getImagesForEntry(record.entryId);
                    return (
                      <Tr key={record.entryId}>
                        {showFileDetails ? (
                          <>
                            <Td>{record.excelRowId}</Td>
                            <Td>
                              <a
                                href={googleSearchModelUrl(record.productModel)}
                                onClick={(e) => handleLinkClick(e, googleSearchModelUrl(record.productModel))}
                              >
                                {record.productModel}
                              </a>
                            </Td>
                            <Td>
                              <a
                                href={googleSearchBrandModelUrl(record.productModel, record.productBrand)}
                                onClick={(e) =>
                                  handleLinkClick(e, googleSearchBrandModelUrl(record.productModel, record.productBrand))
                                }
                              >
                                {record.productBrand}
                              </a>
                            </Td>
                            <Td>{record.productColor}</Td>
                            <Td>{record.productCategory}</Td>
                          </>
                        ) : (
                          <>
                            <Td>{record.excelRowId}</Td>
                            <Td>
                              <a
                                href={googleSearchModelUrl(record.productModel)}
                                onClick={(e) => handleLinkClick(e, googleSearchModelUrl(record.productModel))}
                              >
                                {record.productModel}
                              </a>
                            </Td>
                          </>
                        )}
                        {images.map((result) => (
                          <React.Fragment key={result.resultId}>
                            <Td>
                              <Box textAlign="center">
                                <Image
                                  src={result.imageUrlThumbnail}
                                  alt={result.imageDesc}
                                  maxW="60px"
                                  maxH="60px"
                                  objectFit="cover"
                                  cursor="pointer"
                                  onClick={() => window.open(result.imageUrlThumbnail, "_blank")}
                                />
                              </Box>
                            </Td>
                            {showResultDetails && (
                              <Td>
                                <Box>
                                  <Text fontSize="xs" color="gray.100">
                                    <a
                                      href={googleSearchModelUrl(record.productModel)}
                                      onClick={(e) =>
                                        handleLinkClick(e, googleSearchModelUrl(record.productModel))
                                      }
                                    >
                                      {result.imageDesc}
                                    </a>
                                  </Text>
                                  <Text fontSize="xs" color="gray.500">
                                    <a
                                      href={result.imageSource}
                                      onClick={(e) => handleLinkClick(e, result.imageSource)}
                                    >
                                      {shortenSourceUrl(result.imageSource)}
                                    </a>
                                  </Text>
                                  <Text fontSize="xs" color="gray.300">
                                    <a
                                      href={result.imageUrl}
                                      onClick={(e) => handleLinkClick(e, result.imageUrl)}
                                    >
                                      {shortenImageUrl(result.imageUrl)}
                                    </a>
                                  </Text>
                                </Box>
                              </Td>
                            )}
                          </React.Fragment>
                        ))}
                        {Array(imageLimit - images.length)
                          .fill(null)
                          .map((_, idx) => (
                            <React.Fragment key={`empty-${idx}`}>
                              <Td>-</Td>
                              {showResultDetails && <Td>-</Td>}
                            </React.Fragment>
                          ))}
                      </Tr>
                    );
                  })}
                </Tbody>
              </Table>
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
  const [activeTab, setActiveTab] = useState<number>(4); // Default to "Search Rows"

  const fetchJobData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      console.log("Fetching job with ID:", jobId);
      const apiUrl = `https://backend-dev.iconluxury.group/api/scraping-jobs/${jobId}`;
      console.log("API URL:", apiUrl);

      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("Response Status:", response.status);
      console.log("Response Headers:", [...response.headers.entries()]);
      const text = await response.text();
      console.log("Raw Response:", text);

      if (!response.ok) {
        throw new Error(`Failed to fetch job data: ${response.status} - ${response.statusText}`);
      }

      const data: JobDetails = JSON.parse(text);
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

  useEffect(() => {
    const handleFocus = () => {
      setActiveTab((prev) => prev); // Ensure tab state persists
    };
    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, []);

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
    { title: "Overview", component: () => <OverviewTab job={jobData} /> },
    { title: "Usage", component: () => <UsageTab job={jobData} /> },
    { title: "Results", component: () => <ResultsTab job={jobData} /> },
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