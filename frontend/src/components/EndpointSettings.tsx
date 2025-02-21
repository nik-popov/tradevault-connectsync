import {
    Container,
    Box,
    Text,
    Button,
    VStack,
    HStack,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Divider,
    Flex,
  } from "@chakra-ui/react";
  import { useState } from "react";
  
  const EndpointSettings = () => {
    const [endpoints, setEndpoints] = useState([
      { id: 2, url: "https://image-backend-cms-icon-7.popovtech.com/generate-download-file/?file_id=$FileID$", description: "Used in ImageScraperForm.asp to call generate xlsx file", owner: "Vlad" },
      { id: 3, url: "https://image-submit-form-cms-icon-7.popovtech.com/image-luxurymarket-cms.html", description: "Used in ImageScraper.asp as actual Iframe URL", owner: "Vlad" },
      { id: 4, url: "https://image-backend-cms-icon-7.popovtech.com/process_image_batch/", description: "Used by NodeJS backend in ImageScraper.asp iframe", owner: "Nik" },
      { id: 5, url: "https://manager-brand-parse-api-icon-7.popovtech.com/submit_job?job_id=$JobID$", description: "Used in BrandScanningJobs to start API method", owner: "Vlad" },
    ]);
  
    const addEndpoint = () => {
      const newEndpoint = {
        id: endpoints.length + 2,
        url: "https://new-endpoint.com/api",
        description: "Newly added endpoint",
        owner: "Admin",
      };
      setEndpoints([...endpoints, newEndpoint]);
    };
  
    return (
      <Container maxW="full">
        <Flex align="center" justify="space-between" py={6} flexWrap="wrap" gap={4}>
          <Text fontSize="2xl" fontWeight="bold">RTS Administration Panel</Text>
          <HStack>
            <Button colorScheme="blue">Export to Excel</Button>
            <Button colorScheme="green" onClick={addEndpoint}>Add New Record</Button>
          </HStack>
        </Flex>
        <Divider my={4} />
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>#</Th>
              <Th>Endpoint</Th>
              <Th>Description</Th>
              <Th>Owner</Th>
            </Tr>
          </Thead>
          <Tbody>
            {endpoints.map((endpoint) => (
              <Tr key={endpoint.id}>
                <Td>{endpoint.id}</Td>
                <Td>{endpoint.url}</Td>
                <Td>{endpoint.description}</Td>
                <Td>{endpoint.owner}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Container>
    );
  };
  
  export default EndpointSettings;
  