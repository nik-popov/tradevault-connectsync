import { useState } from 'react';
import { Box, Table, Thead, Tbody, Tr, Th, Td, Text, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Select, useDisclosure, useToast, Image } from '@chakra-ui/react';
export interface ColumnMapping {
  style: number | null;
  brand: number | null;
  imageAdd: number | null;
  readImage: number | null;
  category: number | null;
  colorName: number | null;
}
function isImageColumn(header) {
  if (!header || typeof header !== 'string') return false;
  const headerLower = header.toLowerCase();
  return ['image', 'image2', 'picture', 'photo', 'img', 'image add', 'read image'].some(keyword =>
    headerLower.includes(keyword)
  );
}

export function getDisplayValue(cellValue) {
  if (cellValue === null || cellValue === undefined) {
    return '';
  } else if (typeof cellValue === 'string' || typeof cellValue === 'number' || typeof cellValue === 'boolean') {
    return cellValue;
  } else if (cellValue instanceof Date) {
    return cellValue.toLocaleString();
  } else if (typeof cellValue === 'object' && cellValue !== null) {
    if (cellValue.v !== undefined) return cellValue.v;
    if (cellValue.w !== undefined) return cellValue.w;
    if (cellValue.f !== undefined) return cellValue.f;
    if (cellValue.error) return cellValue.error;
    return JSON.stringify(cellValue);
  } else {
    return String(cellValue);
  }
}

function ExcelDataTable({ excelData, columnMapping, setColumnMapping }) {
  const { headers, rows } = excelData;
  if (!headers || headers.length === 0 || !rows || rows.length === 0) {
    return null;
  }

  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedColumn, setSelectedColumn] = useState<number | null>(null);
  const [selectedField, setSelectedField] = useState<string>('');
  const requiredColumns = ['style', 'brand'];
  const optionalColumns = ['category', 'colorName', 'imageAdd', 'readImage'];
  const allColumns = [...requiredColumns, ...optionalColumns];
  const imageColumns = headers.map((header, index) => isImageColumn(header) ? index : -1).filter(i => i !== -1);
  const allRequiredSelected = requiredColumns.every(col => columnMapping[col] !== null);

  const handleColumnClick = (index: number) => {
    setSelectedColumn(index);
    const currentField = Object.entries(columnMapping).find(([, idx]) => idx === index)?.[0];
    const unmappedRequired = requiredColumns.find(col => columnMapping[col] === null);
    // Default to unmapped required field, then first unmapped optional field if all required are mapped
    setSelectedField(currentField || unmappedRequired || (allRequiredSelected ? optionalColumns.find(col => columnMapping[col] === null) || '' : ''));
    onOpen();
  };

  const handleMappingConfirm = (confirm: boolean) => {
    if (confirm && selectedColumn !== null && selectedField) {
      setColumnMapping((prev: ColumnMapping) => {
        const newMapping = { ...prev };
        // Remove the current mapping for this column, if any
        const currentField = Object.entries(newMapping).find(([, idx]) => idx === selectedColumn)?.[0];
        if (currentField) newMapping[currentField] = null;
        // Assign the new field to the selected column
        newMapping[selectedField] = selectedColumn;
        return newMapping;
      });
    }
    onClose();
  };

  return (
    <Box
      mt={4}
      bg="gray.800"
      p={4}
      borderRadius="lg"
      overflowX="auto"
      sx={{
        '& table': {
          tableLayout: 'fixed',
          width: 'max-content',
          minWidth: '100%',
        },
        '& th, & td': {
          whiteSpace: 'nowrap',
          minWidth: '3px',
          padding: '8px',
          borderRight: '1px solid gray.600',
        },
        '& th:last-child, & td:last-child': {
          borderRight: 'none',
        },
      }}
    >
      <Text fontSize="md" fontWeight="semibold" color="white">
        Excel Data Preview
      </Text>
      <Text fontSize="sm" color="gray.400" mt={1}>
        Row Count: {excelData.rows.length}
      </Text>
      <Table variant="striped" size="sm" colorScheme="gray">
        <Thead>
          <Tr>
            {headers.map((header, i) => {
              const mappedField = Object.entries(columnMapping).find(([, idx]) => idx === i)?.[0];
              const isMapped = !!mappedField;
              const bgColor = isMapped ? 'teal.500' : 'gray.700';

              return (
                <Th
                  key={i}
                  color="white"
                  bg={bgColor}
                  _hover={{ bg: isMapped ? 'teal.600' : 'gray.600' }}
                  onClick={() => handleColumnClick(i)}
                >
                  <Text>{mappedField || header || `Column ${i + 1}`}</Text>
                </Th>
              );
            })}
          </Tr>
        </Thead>
        <Tbody>
          {rows.map((rowData, rowIndex) => (
            <Tr key={rowIndex}>
              {headers.map((_, cellIndex) => (
                <Td key={cellIndex} color="gray.200">
                  {imageColumns.includes(cellIndex) && rowData.row[cellIndex] ? (
                    <Image
                      src={rowData.row[cellIndex]}
                      boxSize="60px"
                      objectFit="cover"
                      mr={2}
                      display="inline-block"
                      fallback={<Text>{rowData.row[cellIndex] || 'No Image'}</Text>}
                    />
                  ) : (
                    getDisplayValue(rowData.row[cellIndex]) || <span> </span>
                  )}
                </Td>
              ))}
            </Tr>
          ))}
        </Tbody>
      </Table>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Map Column</ModalHeader>
          <ModalBody>
            <Text>
              Map "{selectedColumn !== null ? headers[selectedColumn] || `Column ${selectedColumn + 1}` : 'Select a column'}" to:
            </Text>
            <Select 
              value={selectedField} 
              onChange={(e) => setSelectedField(e.target.value)}
              mt={2}
            >
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
                  .map(col => `${col}: ${headers[columnMapping[col]!] || `Column ${columnMapping[col]! + 1}`}`)
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
    </Box>
  );
}

export default ExcelDataTable;