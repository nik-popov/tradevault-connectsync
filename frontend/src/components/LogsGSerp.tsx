import React, { useState, useEffect } from "react";
import {
  Box,
  Text,
  Flex,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Spinner,
  Button,
  Select,
  Tooltip,
} from "@chakra-ui/react";

interface LogEntry {
  timestamp: string;
  endpoint: string;
  query: string;
  status: "success" | "error";
  responseTime: number;
}

const mockLogs: LogEntry[] = Array.from({ length: 50 }, (_, i) => ({
  timestamp: new Date(Date.now() - i * 3600000).toISOString(),
  endpoint: ["SOUTHAMERICA-WEST1", "US-CENTRAL1", "US-EAST1"][Math.floor(Math.random() * 3)],
  query: ["best smartphones 2023", "weather forecast", "python programming"][Math.floor(Math.random() * 3)],
  status: Math.random() > 0.1 ? "success" : "error",
  responseTime: 100 + Math.floor(Math.random() * 400),
}));

const LogsGSerp: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [filter, setFilter] = useState<"all" | "success" | "error">("all");

  const fetchLogs = () => {
    setIsLoading(true);
    setTimeout(() => {
      setLogs(mockLogs);
      setIsLoading(false);
    }, 500);
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const filteredLogs = logs.filter((log) => filter === "all" || log.status === filter);

  return (
    <Box p={4} width="100%">
      <Flex justify="space-between" align="center" mb={4}>
        <Text fontSize="lg" fontWeight="bold">API Request Logs</Text>
        <Flex gap={2}>
          <Select
            size="sm"
            value={filter}
            onChange={(e) => setFilter(e.target.value as "all" | "success" | "error")}
            width="150px"
          >
            <option value="all">All Statuses</option>
            <option value="success">Success Only</option>
            <option value="error">Errors Only</option>
          </Select>
          <Tooltip label="Refresh logs">
            <Button size="sm" colorScheme="blue" onClick={fetchLogs} isLoading={isLoading}>
              Refresh
            </Button>
          </Tooltip>
        </Flex>
      </Flex>

      {isLoading ? (
        <Flex justify="center" align="center" h="200px">
          <Spinner size="xl" color="blue.500" />
        </Flex>
      ) : (
        <Box shadow="md" borderWidth="1px" borderRadius="md" overflowX="auto">
          <Table variant="simple" size="sm">
            <Thead>
              <Tr>
                <Th>Timestamp</Th>
                <Th>Endpoint</Th>
                <Th>Query</Th>
                <Th>Status</Th>
                <Th>Response Time</Th>
              </Tr>
            </Thead>
            <Tbody>
              {filteredLogs.map((log, index) => (
                <Tr key={index} bg={log.status === "error" ? "red.900" : "transparent"}>
                  <Td>{new Date(log.timestamp).toLocaleString()}</Td>
                  <Td>{log.endpoint}</Td>
                  <Td>{log.query}</Td>
                  <Td>{log.status}</Td>
                  <Td>{log.responseTime} ms</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      )}
    </Box>
  );
};

export default LogsGSerp;