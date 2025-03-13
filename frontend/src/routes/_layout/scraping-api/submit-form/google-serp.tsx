import React, { useState } from 'react';
import {
  Container,
  Text,
  Button,
  VStack,
  Flex,
  Box,
  Input,
  FormControl,
  FormLabel,
  useToast,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Image,
} from '@chakra-ui/react';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { FiSend } from 'react-icons/fi';
import ExcelJS from 'exceljs';
import { Buffer } from 'buffer';

// Helper function to convert cell values to displayable strings
function getDisplayValue(cellValue: any): string {
  if (cellValue === null || cellValue === undefined) {
    return '';
  } else if (typeof cellValue === 'string' || typeof cellValue === 'number' || typeof cellValue === 'boolean') {
    return String(cellValue);
  } else if (cellValue instanceof Date) {
    return cellValue.toLocaleString();
  } else if (typeof cellValue === 'object') {
    if (cellValue.error) {
      return cellValue.error;
    } else if (cellValue.result !== undefined) {
      return getDisplayValue(cellValue.result);
    } else if (cellValue.text) {
      return cellValue.text;
    } else if (cellValue.hyperlink) {
      return cellValue.text || cellValue.hyperlink;
    } else {
      return JSON.stringify(cellValue);
    }
  } else {
    return String(cellValue);
  }
}

// Helper function to determine image MIME type
function getImageMimeType(imageBuffer: ArrayBuffer): string {
  const arr = new Uint8Array(imageBuffer).subarray(0, 4);
  let header = '';
  for (let i = 0; i < arr.length; i++) {
    header += arr[i].toString(16);
  }
  switch (header) {
    case '89504e47':
      return 'image/png';
    case 'ffd8ffe0':
    case 'ffd8ffe1':
    case 'ffd8ffe2':
      return 'image/jpeg';
    default:
      return 'image/png';
  }
}

interface RowData {
  row: ExcelJS.CellValue[];
  images: { data: string; mimeType: string }[];
}

function GoogleSerpForm() {
  const [file, setFile] = useState<File | null>(null);
  const [isLoadingFile, setIsLoadingFile] = useState(false);
  const [excelData, setExcelData] = useState<{
    headers: ExcelJS.CellValue[];
    rows: RowData[];
  }>({ headers: [], rows: [] });
  const toast = useToast();
  const navigate = useNavigate();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFile(event.target.files?.[0] || null);
    setExcelData({ headers: [], rows: [] });
  };

  const handleLoadFile = async () => {
    if (!file) {
      toast({
        title: 'Missing File',
        description: 'Please choose an Excel file first.',
        status: 'warning',
        duration: 4000,
        isClosable: true,
        position: 'top',
      });
      return;
    }

    setIsLoadingFile(true);
    try {
      const workbook = new ExcelJS.Workbook();
      const buffer = await file.arrayBuffer();
      await workbook.xlsx.load(buffer);

      if (workbook.worksheets.length > 1) {
        console.warn('Multiple worksheets detected. Using the first one.');
      }
      const worksheet = workbook.worksheets[0];

      const headers = Array.isArray(worksheet.getRow(1).values)
        ? (worksheet.getRow(1).values as ExcelJS.CellValue[])
        : Object.values(worksheet.getRow(1).values) as ExcelJS.CellValue[];

      const rows: ExcelJS.CellValue[][] = [];
      worksheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {
        if (rowNumber > 1) {
          const values = Array.isArray(row.values)
            ? row.values
            : Object.values(row.values);
          rows.push(values as ExcelJS.CellValue[]);
        }
      });

      const images = worksheet.getImages();
      const imageMap: { [key: number]: { data: string; mimeType: string }[] } = {};
      images.forEach((image, index) => {
        const rowIndex = image.range.tl.row;
        const imageBuffer = workbook.getImage(index);
        const imageData = Buffer.from(imageBuffer as unknown as ArrayBuffer).toString('base64');
        const mimeType = getImageMimeType(imageBuffer as unknown as ArrayBuffer);
        if (!imageMap[rowIndex]) {
          imageMap[rowIndex] = [];
        }
        imageMap[rowIndex].push({ data: imageData, mimeType });
      });

      const rowsWithImages: RowData[] = rows.map((row, index) => {
        const rowImages = imageMap[index + 2] || [];
        return { row, images: rowImages };
      });

      setExcelData({ headers, rows: rowsWithImages });
    } catch (err) {
      console.error('Error reading Excel file:', err);
      toast({
        title: 'File Read Error',
        description: `Could not read the Excel file: ${(err as Error).message}`,
        status: 'error',
        duration: 4000,
        isClosable: true,
        position: 'top',
      });
    } finally {
      setIsLoadingFile(false);
    }
  };

  const handleSubmit = () => {
    // Implement your submission logic here
  };

  return (
    <Container maxW="full">
      <VStack spacing={6} align="stretch">
        <Text fontSize="xl" fontWeight="semibold">
          Google SERP Form
        </Text>
        <FormControl>
          <FormLabel color="white">Upload Excel File</FormLabel>
          <Input type="file" accept=".xlsx" onChange={handleFileChange} />
        </FormControl>
        <Flex gap={4}>
          <Button
            colorScheme="blue"
            onClick={handleLoadFile}
            isLoading={isLoadingFile}
          >
            Load File
          </Button>
          <Button
            colorScheme="green"
            leftIcon={<FiSend />}
            onClick={handleSubmit}
            isDisabled={!excelData.rows.length}
          >
            Submit
          </Button>
        </Flex>
        {excelData.rows.length > 0 && <ExcelDataTable excelData={excelData} />}
      </VStack>
    </Container>
  );
}

function ExcelDataTable({ excelData }: { excelData: { headers: ExcelJS.CellValue[]; rows: RowData[] } }) {
  const { headers, rows } = excelData;
  if (!headers || headers.length === 0 || !rows || rows.length === 0) {
    return null;
  }

  return (
    <Box mt={4} bg="gray.800" p={4} borderRadius="lg">
      <Text fontSize="md" fontWeight="semibold" mb={4} color="white">
        Excel Data Preview
      </Text>
      <Table variant="striped" size="sm" colorScheme="gray">
        <Thead>
          <Tr>
            <Th color="white" bg="gray.700">
              Image
            </Th>
            {headers.map((header, i) => (
              <Th key={i} color="white" bg="gray.700">
                {getDisplayValue(header) || <span>Unnamed</span>}
              </Th>
            ))}
          </Tr>
        </Thead>
        <Tbody>
          {rows.map((rowData, rowIndex) => (
            <Tr key={rowIndex}>
              <Td color="gray.200">
                {rowData.images.length > 0 ? (
                  rowData.images.map((image, imgIndex) => (
                    <Image
                      key={imgIndex}
                      src={`data:${image.mimeType};base64,${image.data}`}
                      alt={`Image ${imgIndex + 1}`}
                      boxSize="60px"
                      objectFit="cover"
                      mr={2}
                      display="inline-block"
                    />
                  ))
                ) : (
                  <Text>No Image</Text>
                )}
              </Td>
              {rowData.row.map((cell, cellIndex) => (
                <Td key={cellIndex} color="gray.200">
                  {getDisplayValue(cell) || <span> </span>}
                </Td>
              ))}
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
}

export const Route = createFileRoute('/_layout/scraping-api/submit-form/google-serp')({
  component: GoogleSerpForm,
});