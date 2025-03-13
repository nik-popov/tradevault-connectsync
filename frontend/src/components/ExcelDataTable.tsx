// src/components/ExcelDataTable.tsx
import React from 'react';
import { Table, Thead, Tbody, Tr, Th, Td, Box } from '@chakra-ui/react';

interface ColumnMapping {
  style: number | null;
  brand: number | null;
  imageAdd: number | null;
  readImage: number | null;
  category: number | null;
  colorName: number | null;
}

interface ExcelDataTableProps {
  excelData: { headers: string[]; rows: { row: any[] }[] };
  columnMapping: ColumnMapping;
  setColumnMapping?: React.Dispatch<React.SetStateAction<ColumnMapping>>;
  onColumnClick: (columnIndex: number) => void;
}

const ExcelDataTable: React.FC<ExcelDataTableProps> = ({ excelData, columnMapping, onColumnClick }) => {
  const isColumnMapped = (index: number) =>
    Object.values(columnMapping).some(value => value === index && value !== null);

  // Determine the maximum number of columns from headers or rows
  const maxColumns = Math.max(
    excelData.headers.length,
    ...excelData.rows.map(row => row.row.length)
  );

  return (
    <Box overflowX="auto">
      <Table size="sm">
        <Thead>
          <Tr>
            {Array.from({ length: maxColumns }, (_, index) => (
              <Th
                key={index}
                onClick={() => onColumnClick(index)}
                cursor="pointer"
                bg={isColumnMapped(index) ? 'teal.100' : 'transparent'}
                _hover={{ bg: 'gray.100' }}
              >
                {excelData.headers[index] || `Column ${index + 1}`}
              </Th>
            ))}
          </Tr>
        </Thead>
        <Tbody>
          {excelData.rows.map((row, rowIndex) => (
            <Tr key={rowIndex}>
              {Array.from({ length: maxColumns }, (_, cellIndex) => (
                <Td key={cellIndex}>
                  {row.row[cellIndex] !== undefined ? String(row.row[cellIndex]) : ''}
                </Td>
              ))}
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default ExcelDataTable;