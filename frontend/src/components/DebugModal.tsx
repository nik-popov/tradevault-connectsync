import React from "react";
import {
  Box,
  Button,
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

interface DebugModalProps {
  job: JobDetails;
  isOpen: boolean;
  onClose: () => void;
  showFileDetails: boolean;
  showResultDetails: boolean;
  imageLimit: number;
}

const DebugModal: React.FC<DebugModalProps> = ({
  job,
  isOpen,
  onClose,
  showFileDetails,
  showResultDetails,
  imageLimit,
}) => {
  const fileId = job.records[0]?.fileId || "N/A";

  // Get images associated with a specific entry, limited by imageLimit
  const getImagesForEntry = (entryId: number) => {
    return job.results.filter((r) => r.entryId === entryId).slice(0, imageLimit);
  };

  // Shorten URLs for display
  const shortenSourceUrl = (url: string) => {
    return url.length > 30 ? `${url.slice(0, 27)}...` : url;
  };

  const shortenImageUrl = (url: string) => {
    return url.length > 30 ? `...${url.slice(-27)}` : url;
  };

  // Generate Google search URL for a product model
  const googleSearchModelUrl = (model: string) =>
    `https://www.google.com/search?q=${encodeURIComponent(`${model} - US`)}&udm=2`;

  // Handle link clicks to open in a new tab
  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, url: string) => {
    e.preventDefault();
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="full">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Flex justify="space-between" align="center">
            <Text>Debug Mode - Search Rows (File ID: {fileId})</Text>
            <Button size="sm" variant="ghost" onClick={onClose}>
              Close
            </Button>
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
                        <Td>{record.productBrand}</Td>
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
                      <React.Fragment key={`${result.imageUrl}-${result.entryId}`}>
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
                              <Text fontSize="xs" color="gray.600">
                                <a
                                  href={result.imageSource}
                                  onClick={(e) => handleLinkClick(e, result.imageSource)}
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
                              <Text fontSize="xs" color="gray.400">
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
  );
};

export default DebugModal;