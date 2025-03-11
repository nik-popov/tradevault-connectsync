import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Card,
  CardBody,
  Flex,
  Image,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";

interface JobDetails {
  records: {
    entryId: number;
    excelRowId: string;
    productModel: string;
    productBrand: string;
    productColor: string;
    productCategory: string;
    fileId?: string;
  }[];
  results: {
    entryId: number;
    imageUrlThumbnail: string;
    imageDesc: string;
    imageSource: string;
    imageUrl: string;
  }[];
}

const SearchRowsTab = ({ job }: { job: JobDetails }) => {
  const [debugMode, setDebugMode] = useState(false);
  const [showFileDetails, setShowFileDetails] = useState(false);
  const [showResultDetails, setShowResultDetails] = useState(true); // Controls image details visibility
  const [numImages, setNumImages] = useState(1); // Number of images per row, 1 to 5
  const [imageLimit, setImageLimit] = useState(10); // Debug mode image limit

  // Set showResultDetails to false when entering debug mode
  useEffect(() => {
    if (debugMode) {
      setShowResultDetails(false);
    }
  }, [debugMode]);

  // Function to get images for a given entry, with a specified limit
  const getImagesForEntry = (entryId: number, limit: number) => {
    return job.results.filter((r) => r.entryId === entryId).slice(0, limit);
  };

  // Utility functions for formatting URLs
  const shortenSourceUrl = (url: string) =>
    url.length > 30 ? `${url.slice(0, 27)}...` : url;

  const shortenImageUrl = (url: string) =>
    url.length > 30 ? `...${url.slice(-27)}` : url;

  const googleSearchModelUrl = (model: string) =>
    `https://www.google.com/search?q=${encodeURIComponent(`${model} - US`)}&udm=2`;

  const googleSearchBrandModelUrl = (model: string, brand: string) =>
    `https://www.google.com/search?q=${encodeURIComponent(`${brand} ${model} - US`)}&udm=2`;

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, url: string) => {
    e.preventDefault();
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const fileId = job.records[0]?.fileId || "N/A";

  return (
    <Box p={4}>
      {/* Header with controls */}
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
          {/* Image adjustment buttons, only in normal mode */}
          {!debugMode && (
            <Flex align="center" gap={2}>
              <Text>Images per row:</Text>
              <Button
                size="sm"
                onClick={() => setNumImages((prev) => Math.max(1, prev - 1))}
              >
                -
              </Button>
              <Text>{numImages}</Text>
              <Button
                size="sm"
                onClick={() => setNumImages((prev) => Math.min(5, prev + 1))}
              >
                +
              </Button>
            </Flex>
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

      {/* Normal Mode Table */}
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
                  {/* Dynamically generate image and details columns */}
                  {Array.from({ length: numImages }).map((_, idx) => (
                    <React.Fragment key={idx}>
                      <Th>Image {idx + 1}</Th>
                      {showResultDetails && <Th>Details {idx + 1}</Th>}
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
                </Tr>
              </Thead>
              <Tbody>
                {job.records.map((record) => {
                  const images = getImagesForEntry(record.entryId, numImages);
                  return (
                    <Tr key={record.entryId}>
                      {/* Dynamically render images and details */}
                      {Array.from({ length: numImages }).map((_, idx) => (
                        <React.Fragment key={idx}>
                          <Td>
                            {images[idx] ? (
                              <Box textAlign="center">
                                <Image
                                  src={images[idx].imageUrlThumbnail}
                                  alt={images[idx].imageDesc}
                                  maxW="80px"
                                  maxH="80px"
                                  objectFit="cover"
                                  cursor="pointer"
                                  onClick={() => window.open(images[idx].imageUrlThumbnail, "_blank")}
                                />
                              </Box>
                            ) : (
                              "-"
                            )}
                          </Td>
                          {showResultDetails && (
                            <Td>
                              {images[idx] ? (
                                <Box>
                                  <Text fontSize="xs" color="gray.100">
                                    <a
                                      href={googleSearchModelUrl(record.productModel)}
                                      onClick={(e) =>
                                        handleLinkClick(e, googleSearchModelUrl(record.productModel))
                                      }
                                    >
                                      {images[idx].imageDesc}
                                    </a>
                                  </Text>
                                  <Text fontSize="xs" color="gray.500">
                                    <a
                                      href={images[idx].imageSource}
                                      onClick={(e) => handleLinkClick(e, images[idx].imageSource)}
                                    >
                                      {shortenSourceUrl(images[idx].imageSource)}
                                    </a>
                                  </Text>
                                  <Text fontSize="xs" color="gray.300">
                                    <a
                                      href={images[idx].imageUrl}
                                      onClick={(e) => handleLinkClick(e, images[idx].imageUrl)}
                                    >
                                      {shortenImageUrl(images[idx].imageUrl)}
                                    </a>
                                  </Text>
                                </Box>
                              ) : (
                                "-"
                              )}
                            </Td>
                          )}
                        </React.Fragment>
                      ))}
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
        /* Debug Mode Modal */
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
                    const images = getImagesForEntry(record.entryId, imageLimit);
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
                        {Array.from({ length: imageLimit }).map((_, idx) => (
                          <React.Fragment key={idx}>
                            <Td>
                              {images[idx] ? (
                                <Box textAlign="center">
                                  <Image
                                    src={images[idx].imageUrlThumbnail}
                                    alt={images[idx].imageDesc}
                                    maxW="60px"
                                    maxH="60px"
                                    objectFit="cover"
                                    cursor="pointer"
                                    onClick={() => window.open(images[idx].imageUrlThumbnail, "_blank")}
                                  />
                                </Box>
                              ) : (
                                "-"
                              )}
                            </Td>
                            {showResultDetails && (
                              <Td>
                                {images[idx] ? (
                                  <Box>
                                    <Text fontSize="xs" color="gray.100">
                                      <a
                                        href={googleSearchModelUrl(record.productModel)}
                                        onClick={(e) =>
                                          handleLinkClick(e, googleSearchModelUrl(record.productModel))
                                        }
                                      >
                                        {images[idx].imageDesc}
                                      </a>
                                    </Text>
                                    <Text fontSize="xs" color="gray.500">
                                      <a
                                        href={images[idx].imageSource}
                                        onClick={(e) => handleLinkClick(e, images[idx].imageSource)}
                                      >
                                        {shortenSourceUrl(images[idx].imageSource)}
                                      </a>
                                    </Text>
                                    <Text fontSize="xs" color="gray.300">
                                      <a
                                        href={images[idx].imageUrl}
                                        onClick={(e) => handleLinkClick(e, images[idx].imageUrl)}
                                      >
                                        {shortenImageUrl(images[idx].imageUrl)}
                                      </a>
                                    </Text>
                                  </Box>
                                ) : (
                                  "-"
                                )}
                              </Td>
                            )}
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

export default SearchRowsTab;