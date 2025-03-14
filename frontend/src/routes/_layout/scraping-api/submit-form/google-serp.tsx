import React, { useState } from 'react';
import {
  Container,
  Text,
  Button,
  VStack,
  HStack,
  Box,
  Input,
  FormControl,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Table,
  Tr,
  Td,
  Tbody,
  Select,
  Spinner,
} from '@chakra-ui/react';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { FiSend } from 'react-icons/fi';
import * as XLSX from 'xlsx';
import ExcelJS from 'exceljs';
import ExcelDataTable from '../../../../components/ExcelDataTable';
import useCustomToast from '../../../../hooks/useCustomToast';

// Interfaces
interface ColumnMapping {
  style: number | null;
  brand: number | null;
  imageAdd: number | null;
  readImage: number | null;
  category: number | null;
  colorName: number | null;
}

interface ExcelData {
  headers: string[];
  rows: { row: ExcelJS.CellValue[] }[];
}

// Helper Functions
function getDisplayValue(cellValue: any): string {
  if (cellValue === null || cellValue === undefined) return '';
  else if (typeof cellValue === 'string' || typeof cellValue === 'number' || typeof cellValue === 'boolean')
    return String(cellValue);
  else if (cellValue instanceof Date) return cellValue.toLocaleString();
  else if (typeof cellValue === 'object') {
    if (cellValue.error) return cellValue.error;
    else if (cellValue.result !== undefined) return getDisplayValue(cellValue.result);
    else if (cellValue.text) return cellValue.text;
    else if (cellValue.hyperlink) return cellValue.text || cellValue.hyperlink;
    else return JSON.stringify(cellValue);
  }
  return String(cellValue);
}

function indexToColumnLetter(index: number): string {
  let column = '';
  let temp = index;
  while (temp >= 0) {
    column = String.fromCharCode((temp % 26) + 65) + column;
    temp = Math.floor(temp / 26) - 1;
  }
  return column;
}

const ExcelDataTableMemo = React.memo(ExcelDataTable);

function GoogleSerpForm() {
  const [file, setFile] = useState<File | null>(null);
  const [isLoadingFile, setIsLoadingFile] = useState(false);
  const [excelData, setExcelData] = useState<ExcelData>({ headers: [], rows: [] });
  const [previewRows, setPreviewRows] = useState<any[]>([]);
  const [isHeaderModalOpen, setIsHeaderModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isMappingModalOpen, setIsMappingModalOpen] = useState(false);
  const [selectedRowIndex, setSelectedRowIndex] = useState<number | null>(null);
  const [selectedColumn, setSelectedColumn] = useState<number | null>(null);
  const [selectedField, setSelectedField] = useState<string>('');
  const [headerRowIndex, setHeaderRowIndex] = useState<number | null>(null);
  const [columnMapping, setColumnMapping] = useState<ColumnMapping>({
    style: null,
    brand: null,
    imageAdd: null,
    readImage: null,
    category: null,
    colorName: null,
  });
  const [manualBrand, setManualBrand] = useState<string>('');
  const showToast = useCustomToast();
  const navigate = useNavigate();

  const requiredColumns = ['style', 'brand'];
  const optionalColumns = ['category', 'colorName', 'readImage', 'imageAdd'];
  const allColumns = [...requiredColumns, ...optionalColumns];
  const targetHeaders = ['BRAND', 'STYLE', 'COLOR NAME', 'CATEGORY'];
  const SERVER_URL = 'https://backend-dev.iconluxury.group';

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const selectedFile = event.target.files?.[0];
      if (!selectedFile) return;
      if (!['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'].includes(selectedFile.type)) {
        throw new Error('Invalid file type. Please upload an Excel file (.xlsx or .xls)');
      }
      setFile(selectedFile);
      setExcelData({ headers: [], rows: [] });
      setColumnMapping({ style: null, brand: null, imageAdd: null, readImage: null, category: null, colorName: null });
      setManualBrand('');
      setIsLoadingFile(true);

      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = e.target?.result;
          if (!data) throw new Error('Failed to read file');
          const workbook = XLSX.read(data, { type: 'binary' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1, blankrows: true, defval: '', raw: true });
          const preview = jsonData.slice(0, 1000);
          setPreviewRows(preview);

          let headerRowIndex: number | null = null;
          for (let i = 0; i < Math.min(10, preview.length); i++) {
            const row = preview[i] as any[];
            const rowValues = row.map((cell: any) => String(cell).toUpperCase().trim());
            const matchedHeaders = rowValues.filter((value: string) => targetHeaders.includes(value));
            if (matchedHeaders.length >= 2) {
              headerRowIndex = i;
              break;
            }
          }

          if (headerRowIndex !== null) {
            const headers = preview[headerRowIndex] as string[];
            const rows = preview.slice(headerRowIndex + 1).map(row => ({ row: row as ExcelJS.CellValue[] }));
            setExcelData({ headers, rows });
            const newColumnMapping: ColumnMapping = { 
              style: null,
              brand: null,
              imageAdd: null,
              readImage: null,
              category: null,
              colorName: null,
            };
            headers.forEach((header, index) => {
              const upperHeader = String(header).toUpperCase().trim();
              if (upperHeader === 'STYLE') newColumnMapping.style = index;
              if (upperHeader === 'BRAND') newColumnMapping.brand = index;
              if (upperHeader === 'CATEGORY') newColumnMapping.category = index;
              if (upperHeader === 'COLOR NAME') newColumnMapping.colorName = index;
            });
            setColumnMapping(newColumnMapping);
            setHeaderRowIndex(headerRowIndex); // Record the header row index
            showToast('Header Auto-Detected', `Row ${headerRowIndex + 1} selected`, 'info');
          } else {
            setIsHeaderModalOpen(true);
          }
        } catch (error) {
          throw new Error('Error parsing Excel file: ' + error.message);
        } finally {
          setIsLoadingFile(false);
        }
      };
      reader.onerror = () => { throw new Error('Error reading file'); };
      reader.readAsBinaryString(selectedFile);
    } catch (error) {
      showToast('File Upload Error', error.message, 'error');
      setFile(null);
      setIsLoadingFile(false);
    }
  };

  const handleRowSelect = (rowIndex: number) => {
    setSelectedRowIndex(rowIndex);
    setIsConfirmModalOpen(true);
  };

  const confirmHeaderSelect = () => {
    if (selectedRowIndex === null) return;
    const headers = previewRows[selectedRowIndex] as string[];
    const rows = previewRows.slice(selectedRowIndex + 1).map(row => ({ row: row as ExcelJS.CellValue[] }));
    setExcelData({ headers, rows });
    const newColumnMapping: ColumnMapping = { 
      style: null,
      brand: null,
      imageAdd: null,
      readImage: null,
      category: null,
      colorName: null,
    };
    headers.forEach((header, index) => {
      const upperHeader = String(header).toUpperCase().trim();
      if (upperHeader === 'STYLE') newColumnMapping.style = index;
      if (upperHeader === 'BRAND') newColumnMapping.brand = index;
      if (upperHeader === 'CATEGORY') newColumnMapping.category = index;
      if (upperHeader === 'COLOR NAME') newColumnMapping.colorName = index;
    });
    setColumnMapping(newColumnMapping);
    setHeaderRowIndex(selectedRowIndex); // Record the header row index
    setIsHeaderModalOpen(false);
    setIsConfirmModalOpen(false);
    setIsLoadingFile(false);
    showToast('Header Selected', `Row ${selectedRowIndex + 1} confirmed`, 'info');
  };

  const applyManualBrand = () => {
    if (!manualBrand || columnMapping.brand !== null) return;
    const newHeaders = [...excelData.headers, 'BRAND (Manual)'];
    const newRows = excelData.rows.map(row => ({
      row: [...row.row, manualBrand],
    }));
    setExcelData({ headers: newHeaders, rows: newRows });
    setColumnMapping(prev => ({ ...prev, brand: newHeaders.length - 1 }));
    showToast('Manual Brand Applied', `Brand "${manualBrand}" added to all rows`, 'success');
  };

  const handleSubmit = async () => {
    try {
      const missingRequired = requiredColumns.filter(col => columnMapping[col] === null);
      if (missingRequired.length > 0) {
        showToast('Missing Required Columns', `Map: ${missingRequired.join(', ')}`, 'warning');
        return;
      }
      if (!file) throw new Error('No file selected');
      if (headerRowIndex === null) throw new Error('Header row not selected');
      setIsLoadingFile(true);
      const formData = new FormData();
      formData.append('fileUploadImage', file);
      const styleCol = columnMapping.style !== null ? indexToColumnLetter(columnMapping.style) : 'A';
      const brandCol = columnMapping.brand !== null ? indexToColumnLetter(columnMapping.brand) : 'B';
      const imageAddCol = columnMapping.imageAdd !== null ? indexToColumnLetter(columnMapping.imageAdd) : null;
      const readImageCol = columnMapping.readImage !== null ? indexToColumnLetter(columnMapping.readImage) : null;
      const colorCol = columnMapping.colorName !== null ? indexToColumnLetter(columnMapping.colorName) : null;
      const categoryCol = columnMapping.category !== null ? indexToColumnLetter(columnMapping.category) : null;
      const imageColumnImage = readImageCol || imageAddCol;
      if (imageColumnImage) formData.append('imageColumnImage', imageColumnImage);
      formData.append('searchColImage', styleCol);
      formData.append('brandColImage', brandCol);
      if (colorCol) formData.append('ColorColImage', colorCol);
      if (categoryCol) formData.append('CategoryColImage', categoryCol);
      formData.append('headerRow', String(headerRowIndex)); // Add header row index
      const response = await fetch(`${SERVER_URL}/submitImage`, { method: 'POST', body: formData });
      if (!response.ok) throw new Error(`Server error: ${response.status} - ${await response.text()}`);
      const result = await response.json();
      showToast('Success', 'Data submitted', 'success');
      navigate({ to: '/scraping-api/submit-form/success' });
      return result;
    } catch (error) {
      showToast('Submission Error', error.message, 'error');
      throw error;
    } finally {
      setIsLoadingFile(false);
    }
  };

  const handleMappingConfirm = (confirm: boolean) => {
    if (confirm && selectedColumn !== null) {
      const newMapping = { ...columnMapping };
      Object.keys(newMapping).forEach(key => {
        if (newMapping[key] === selectedColumn) {
          newMapping[key] = null;
        }
      });
      if (selectedField && selectedField !== '') {
        newMapping[selectedField] = selectedColumn;
      }
      setColumnMapping(newMapping);
    }
    setIsMappingModalOpen(false);
    setSelectedColumn(null);
    setSelectedField('');
  };

  const openMappingModal = (columnIndex: number) => {
    setSelectedColumn(columnIndex);
    const currentField = Object.keys(columnMapping).find(key => columnMapping[key] === columnIndex);
    if (currentField) {
      setSelectedField(currentField);
    } else {
      if (columnMapping.style === null) setSelectedField('style');
      else if (columnMapping.brand === null) setSelectedField('brand');
      else if (columnMapping.category === null) setSelectedField('category');
      else if (columnMapping.colorName === null) setSelectedField('colorName');
      else setSelectedField('');
    }
    setIsMappingModalOpen(true);
  };

  const allRequiredSelected = requiredColumns.every(col => columnMapping[col] !== null);
  const missingRequired = requiredColumns.filter(col => columnMapping[col] === null);
  const mappedColumns = Object.entries(columnMapping)
    .filter(([_, index]) => index !== null)
    .map(([col, index]) => `${col.replace(/([A-Z])/g, ' $1').trim()}: ${excelData.headers[index as number] || `Column ${index! + 1}`}`);

  return (
    <Container maxW="full" h="100vh" p={4}>
      <VStack spacing={1} align="stretch" h="full">
        <Text fontSize="2xl" fontWeight="bold" color="white">Submit Form</Text>
        <Text fontSize="md" color="gray.300">
          Upload an Excel file, select header row, and map required fields (Style, Brand).
        </Text>
        <Text fontSize="md" color="gray.300">Up to 1000 rows.</Text>
        <HStack spacing={2} align="flex-end" wrap="wrap"> {/* Changed align to flex-end */}
          <FormControl w="xl">
            <Input
              placeholder="Upload Excel File"
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileChange}
              disabled={isLoadingFile}
              mt={2}
              css={{
                '&::-webkit-file-upload-button': {
                  padding: '4px 12px',
                  borderRadius: 'md',
                  marginTop: '-8px',
                  backgroundColor: 'transparent',
                  border: 'none',
                  color: 'gray.500',
                  fontSize: 'md',
                  cursor: 'pointer',
                },
                '&:focus': {
                  outline: 'none',
                  boxShadow: 'outline',
                },
              }}
            />
          </FormControl>
          <Button
            colorScheme="green"
            leftIcon={<FiSend />}
            onClick={handleSubmit}
            isDisabled={!excelData.rows.length || isLoadingFile || !allRequiredSelected}
            isLoading={isLoadingFile}
            mt={2}
            mb={0} // Ensure button bottom aligns with input
          />
          {excelData.headers.length > 0 && (
            <VStack align="start" spacing={0} mb={0}> {/* Changed mt to mb to align bottom */}
              {missingRequired.length > 0 ? (
                <VStack align="start" spacing={0} flexDirection="column-reverse"> {/* Stack upwards */}
                  {missingRequired.map((col) => (
                    <Text key={col} fontSize="sm" color="red.300">{col}</Text>
                  ))}
                  <Text fontSize="sm" color="red.300">Missing:</Text>
                </VStack>
              ) : (
                <VStack align="start" spacing={0} flexDirection="column-reverse"> {/* Stack upwards */}
                  {mappedColumns.map((mapping, index) => (
                    <Text key={index} fontSize="sm" color="teal.300">{mapping}</Text>
                  ))}
                  <Text fontSize="sm" color="teal.300">Mapped:</Text>
                </VStack>
              )}
              <Text fontSize="sm" color="gray.400">Rows: {excelData.rows.length}</Text>
            </VStack>
          )}
          {isLoadingFile && <Text color="gray.400" mt={2} mb={0}>Processing...</Text>}
        </HStack>

        {/* Manual Brand Input Section */}
        {excelData.rows.length > 0 && columnMapping.brand === null && (
          <HStack spacing={2} mt={1}>
            <FormControl w="sm">
              <Input
                placeholder="Add Brand for All Rows"
                value={manualBrand}
                onChange={(e) => setManualBrand(e.target.value)}
                disabled={isLoadingFile}
                mt={1}
              />
            </FormControl>
            <Button
              colorScheme="orange"
              onClick={applyManualBrand}
              isDisabled={!manualBrand || isLoadingFile}
              mt={1}
            >
              Apply
            </Button>
          </HStack>
        )}

        <Box borderBottomWidth="1px" borderColor="gray.600" my={2} />

        {excelData.rows.length > 0 && (
          <Box flex="1" overflowY="auto" maxH="60vh" borderWidth="1px" borderRadius="md" p={4}>
            {isLoadingFile ? (
              <VStack justify="center" h="full">
                <Spinner size="lg" color="gray.400" />
                <Text color="gray.400">Loading table data...</Text>
              </VStack>
            ) : (
              <ExcelDataTableMemo
                excelData={excelData}
                columnMapping={columnMapping}
                setColumnMapping={setColumnMapping}
                onColumnClick={openMappingModal}
                isManualBrand={columnMapping.brand !== null && excelData.headers[columnMapping.brand] === 'BRAND (Manual)'}
              />
            )}
          </Box>
        )}

        <Modal isOpen={isMappingModalOpen} onClose={() => setIsMappingModalOpen(false)}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Map Column</ModalHeader>
            <ModalBody>
              <Text>
                Map "{selectedColumn !== null ? excelData.headers[selectedColumn] || `Column ${selectedColumn + 1}` : 'Select a column'}" to:
              </Text>
              <Select 
                value={selectedField} 
                onChange={(e) => setSelectedField(e.target.value)}
                mt={2}
              >
                <option value="">None</option>
                {allColumns.map(col => (
                  <option key={col} value={col}>
                    {col}
                  </option>
                ))}
              </Select>
              {allRequiredSelected && (
                <Text fontSize="sm" color="gray.500" mt={2}>
                  Optional mappings: {optionalColumns
                    .filter(col => columnMapping[col] !== null)
                    .map(col => `${col}: ${excelData.headers[columnMapping[col]!] || `Column ${columnMapping[col]! + 1}`}`)
                    .join(', ') || 'None'}
                </Text>
              )}
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="green" mr={3} onClick={() => handleMappingConfirm(true)}>
                Confirm
              </Button>
              <Button variant="ghost" onClick={() => handleMappingConfirm(false)}>
                Cancel
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        <Modal isOpen={isHeaderModalOpen} onClose={() => setIsHeaderModalOpen(false)} size="xl">
          <ModalOverlay />
          <ModalContent alignSelf="left" ml={4} mt={16}>
            <ModalHeader>Select Header Row (Click a row) - {previewRows.length} Rows</ModalHeader>
            <ModalBody maxH="60vh" overflowY="auto">
              <Table size="sm">
                <Tbody>
                  {previewRows.map((row, rowIndex) => (
                    <Tr key={rowIndex} onClick={() => handleRowSelect(rowIndex)} cursor="pointer" _hover={{ bg: 'gray.100' }}>
                      {row.map((cell: any, cellIndex: number) => (
                        <Td key={cellIndex} py={2} px={3}>{getDisplayValue(cell)}</Td>
                      ))}
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </ModalBody>
            <ModalFooter>
              <Button size="sm" onClick={() => setIsHeaderModalOpen(false)}>Cancel</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        <Modal isOpen={isConfirmModalOpen} onClose={() => setIsConfirmModalOpen(false)}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Confirm Header Selection</ModalHeader>
            <ModalBody>
              <Text>Use row {selectedRowIndex !== null ? selectedRowIndex + 1 : ''} as header?</Text>
              {selectedRowIndex !== null && <Text mt={2}>{previewRows[selectedRowIndex].join(', ')}</Text>}
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="green" mr={3} onClick={confirmHeaderSelect}>Confirm</Button>
              <Button variant="ghost" onClick={() => setIsConfirmModalOpen(false)}>Cancel</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </VStack>
    </Container>
  );
}

export const Route = createFileRoute('/_layout/scraping-api/submit-form/google-serp')({
  component: GoogleSerpForm,
});