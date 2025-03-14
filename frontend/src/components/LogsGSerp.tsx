import React, { useState, useEffect, useCallback } from "react";
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
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from "@chakra-ui/react";
import useCustomToast from "./../hooks/useCustomToast"; // Ensure path is correct
import debounce from "lodash/debounce"; // Add lodash for debouncing

// Interface for individual log entry
interface LogEntry {
  timestamp: string;
  endpoint: string;
  query: string;
  status: "success" | "error";
  responseTime: number;
}

// Interface for log file
interface LogFile {
  fileId: string;
  fileName: string;
  url: string | "null"; // Allow null for URLs
  lastModified: string;
  entries: LogEntry[] | null; // Null until fetched
}

// Provided S3 log file URLs
const logFileUrls = [
  "https://iconluxurygroup-s3.s3.us-east-2.amazonaws.com/job_logs/job_3.log",
  "https://iconluxurygroup-s3.s3.us-east-2.amazonaws.com/job_logs/job_4.log",
  "https://iconluxurygroup-s3.s3.us-east-2.amazonaws.com/job_logs/job_5.log",
  "https://iconluxurygroup-s3.s3.us-east-2.amazonaws.com/job_logs/job_21.log",
  "https://iconluxurygroup-s3.s3.us-east-2.amazonaws.com/job_logs/job_47.log",
  "https://iconluxurygroup-s3.s3.us-east-2.amazonaws.com/job_logs/job_57.log",
  "https://iconluxurygroup-s3.s3.us-east-2.amazonaws.com/job_logs/job_63.log",
  "https://iconluxurygroup-s3.s3.us-east-2.amazonaws.com/job_logs/job_70.log",
  "https://iconluxurygroup-s3.s3.us-east-2.amazonaws.com/job_logs/job_72.log",
  "https://iconluxurygroup-s3.s3.us-east-2.amazonaws.com/job_logs/job_73.log",
  "https://iconluxurygroup-s3.s3.us-east-2.amazonaws.com/job_logs/job_75.log",
  "https://iconluxurygroup-s3.s3.us-east-2.amazonaws.com/job_logs/job_76.log",
  "https://iconluxurygroup-s3.s3.us-east-2.amazonaws.com/job_logs/job_77.log",
  "https://iconluxurygroup-s3.s3.us-east-2.amazonaws.com/job_logs/job_78.log",
  "https://iconluxurygroup-s3.s3.us-east-2.amazonaws.com/job_logs/job_79.log",
  "https://iconluxurygroup-s3.s3.us-east-2.amazonaws.com/job_logs/job_80.log",
  "https://iconluxurygroup-s3.s3.us-east-2.amazonaws.com/job_logs/job_82.log",
];

// Simple log parser (adjust based on actual log format)
const parseLogContent = (content: string): LogEntry[] => {
  const lines = content.split("\n").filter((line) => line.trim());
  return lines.map((line) => {
    const parts = line.split(" ");
    return {
      timestamp: parts[0] || new Date().toISOString(),
      endpoint: parts[1] || "Unknown",
      query: parts.slice(2, -2).join(" ") || "N/A",
      status: (parts[parts.length - 2] === "SUCCESS" ? "success" : "error") as "success" | "error",
      responseTime: parseInt(parts[parts.length - 1]) || 0,
    };
  }).filter((entry) => entry.timestamp && entry.endpoint && entry.query);
};

const LogsGSerp: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true); // For initial load
  const [logFiles, setLogFiles] = useState<LogFile[]>([]);
  const [filter, setFilter] = useState<"all" | "success" | "error">("all");
  const showToast = useCustomToast();

  // Initialize log files without entries
  const initializeLogFiles = () => {
    const initialLogFiles = logFileUrls.map((url, index) => {
      const jobId = parseInt(url?.split("/").pop()?.replace("job_", "").replace(".log", "") || `${index + 3}`, 10);
      const fileName = url ? url.split("/").pop() || `job_${jobId}.log` : `job_${jobId}.log`;
      const fileId = fileName.replace(".log", "");
      return {
        fileId,
        fileName,
        url,
        lastModified: new Date(Date.now() - index * 86400000).toISOString(),
        entries: null, // Entries are null until fetched
      };
    });
    setLogFiles(initialLogFiles);
    setIsLoading(false);
    showToast("Log Files Initialized", `Loaded ${initialLogFiles.length} log files`, "success");
  };

  // Fetch log entries for a specific file
  const fetchLogEntries = async (file: LogFile) => {
    if (!file.url || file.entries !== null) return; // Skip if no URL or already fetched

    // Since we've checked file.url is not null, TypeScript should infer it's a string here
    try {
      const response = await fetch(file.url, { cache: "no-store" }); // No type assertion needed
      if (!response.ok) throw new Error(`Failed to fetch ${file.fileName}: ${response.statusText}`);
      const content = await response.text();
      const entries = parseLogContent(content);

      setLogFiles((prev) =>
        prev.map((f) =>
          f.fileId === file.fileId ? { ...f, entries } : f
        )
      );
      showToast("Log Entries Loaded", `Fetched entries for ${file.fileName}`, "success");
    } catch (err) {
      showToast(
        "Log Fetch Error",
        `Failed to load ${file.fileName}: ${err instanceof Error ? err.message : "Unknown error"}`,
        "error"
      );
      setLogFiles((prev) =>
        prev.map((f) =>
          f.fileId === file.fileId ? { ...f, entries: [] } : f
        )
      );
    }
  };

  // Debounced refresh function
  const debouncedFetchLogFiles = useCallback(
    debounce(() => {
      setIsLoading(true);
      setLogFiles([]); // Clear existing logs
      initializeLogFiles(); // Re-initialize without fetching entries
    }, 500), // 500ms debounce delay
    []
  );

  // Initial fetch on mount
  useEffect(() => {
    initializeLogFiles();
  }, []);

  // Filter log entries within each file based on status
  const getFilteredEntries = (entries: LogEntry[] | null) => {
    if (!entries) return [];
    return entries.filter((log) => filter === "all" || log.status === filter);
  };

  return (
    <Box p={4} width="100%">
      <Flex justify="space-between" align="center" mb={4}>
        <Text fontSize="lg" fontWeight="bold">API Request Logs</Text>
        <Flex gap={2}>
          <Select
            size="sm"
            value={filter}
            onChange={(e) => {
              setFilter(e.target.value as "all" | "success" | "error");
              showToast("Filter Applied", `Showing ${e.target.value} logs`, "info");
            }}
            width="150px"
          >
            <option value="all">All Statuses</option>
            <option value="success">Success Only</option>
            <option value="error">Errors Only</option>
          </Select>
          <Tooltip label="Refresh log files">
            <Button
              size="sm"
              colorScheme="blue"
              onClick={debouncedFetchLogFiles}
              isLoading={isLoading}
            >
              Refresh
            </Button>
          </Tooltip>
        </Flex>
      </Flex>

      {isLoading ? (
        <Flex justify="center" align="center" h="200px">
          <Spinner size="xl" color="blue.500" />
          <Text ml={4}>Loading log files...</Text>
        </Flex>
      ) : logFiles.length === 0 ? (
        <Text color="gray.500" textAlign="center">
          No log files available.
        </Text>
      ) : (
        <Box shadow="md" borderWidth="1px" borderRadius="md" overflowX="auto">
          {/* Display all log files initially */}
          <Table variant="simple" size="sm">
            <Thead>
              <Tr>
                <Th>File Name</Th>
                <Th>Last Modified</Th>
                <Th>Total Entries</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {logFiles.map((file) => (
                <Tr key={file.fileId}>
                  <Td>{file.fileName}</Td>
                  <Td>{new Date(file.lastModified).toLocaleString()}</Td>
                  <Td>{file.entries ? file.entries.length : "Not loaded"}</Td>
                  <Td>
                    {file.url ? (
                      <Button
                        size="xs"
                        colorScheme="teal"
                        onClick={() => {
                          window.open(file.url, "_blank");
                          showToast("File Opened", `Opened ${file.fileName} in new tab`, "info");
                        }}
                      >
                        Download
                      </Button>
                    ) : (
                      <Text fontSize="xs" color="gray.500">No file</Text>
                    )}
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>

          {/* Expandable log entries */}
          <Accordion allowMultiple mt={4}>
            {logFiles.map((file) => (
              <AccordionItem key={file.fileId}>
                <AccordionButton onClick={() => fetchLogEntries(file)}>
                  <Box flex="1" textAlign="left">
                    <Text fontWeight="bold">{file.fileName}</Text>
                    <Text fontSize="sm" color="gray.500">
                      Last Modified: {new Date(file.lastModified).toLocaleString()} | Entries: {file.entries ? file.entries.length : "Not loaded"}
                    </Text>
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel pb={4}>
                  {file.entries === null ? (
                    <Flex justify="center" align="center" py={4}>
                      <Spinner size="sm" color="blue.500" />
                      <Text ml={2}>Loading entries...</Text>
                    </Flex>
                  ) : (
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
                        {getFilteredEntries(file.entries).map((log, index) => (
                          <Tr key={index} bg={log.status === "error" ? "red.900" : "transparent"}>
                            <Td>{new Date(log.timestamp).toLocaleString()}</Td>
                            <Td>{log.endpoint}</Td>
                            <Td>{log.query}</Td>
                            <Td>{log.status}</Td>
                            <Td>{log.responseTime} ms</Td>
                          </Tr>
                        ))}
                        {getFilteredEntries(file.entries).length === 0 && (
                          <Tr>
                            <Td colSpan={5} textAlign="center">
                              <Text color="gray.500">No logs match the current filter.</Text>
                            </Td>
                          </Tr>
                        )}
                      </Tbody>
                    </Table>
                  )}
                </AccordionPanel>
              </AccordionItem>
            ))}
          </Accordion>
        </Box>
      )}
    </Box>
  );
};

export default LogsGSerp;