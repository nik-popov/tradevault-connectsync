// components/WhitelistGSerp.tsx
import React, { useState, useEffect } from "react";
import { Box, Text, Table, Thead, Tbody, Tr, Th, Td } from "@chakra-ui/react";

// Define the shape of each result (based on assumed Google SERP API data)
interface JobResult {
  imageSource: string;
  sortOrder: number;
}

const WhitelistGSerp: React.FC = () => {
  // State for fetched results and sort configuration
  const [results, setResults] = useState<JobResult[]>([]);
  const [sortConfig, setSortConfig] = useState<{
    key: "domain" | "totalResults" | "positiveSortOrderCount";
    direction: "asc" | "desc";
  }>({
    key: "positiveSortOrderCount",
    direction: "desc", // Default sort: descending by positive sort order count
  });

  // Fetch data when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Replace with actual API endpoint
        const response = await fetch("/api/whitelist-data"); // Placeholder endpoint
        const data: JobResult[] = await response.json();
        setResults(data);
      } catch (error) {
        console.error("Failed to fetch whitelist data:", error);
        // Optionally, set mock data or handle error state
      }
    };
    fetchData();
  }, []);

  // Function to extract domain from URL
  const getDomain = (url: string): string => {
    try {
      const hostname = new URL(url).hostname;
      return hostname.replace(/^www\./, "");
    } catch {
      return "unknown";
    }
  };

  // Aggregate data by domain
  const domainData = results.reduce((acc, result) => {
    const domain = getDomain(result.imageSource);
    if (!acc[domain]) {
      acc[domain] = { totalResults: 0, positiveSortOrderCount: 0 };
    }
    acc[domain].totalResults += 1;
    if (result.sortOrder > 0) {
      acc[domain].positiveSortOrderCount += 1;
    }
    return acc;
  }, {} as Record<string, { totalResults: number; positiveSortOrderCount: number }>);

  // Convert aggregated data to an array for display
  const domains = Object.entries(domainData).map(([domain, data]) => ({
    domain,
    totalResults: data.totalResults,
    positiveSortOrderCount: data.positiveSortOrderCount,
  }));

  // Sort domains based on sortConfig
  const sortedDomains = [...domains].sort((a, b) => {
    const { key, direction } = sortConfig;
    if (key === "domain") {
      const aValue = a.domain.toLowerCase();
      const bValue = b.domain.toLowerCase();
      return direction === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    } else {
      const aValue = a[key];
      const bValue = b[key];
      return direction === "asc" ? aValue - bValue : bValue - aValue;
    }
  });

  // Handle sorting when a column header is clicked
  const handleSort = (key: "domain" | "totalResults" | "positiveSortOrderCount") => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  return (
    <Box>
      <Text fontSize="lg" fontWeight="bold" mb={4}>
        Whitelist Domains
      </Text>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th onClick={() => handleSort("domain")} cursor="pointer">
              Domain {sortConfig.key === "domain" && (sortConfig.direction === "asc" ? "↑" : "↓")}
            </Th>
            <Th onClick={() => handleSort("totalResults")} cursor="pointer">
              Total Results {sortConfig.key === "totalResults" && (sortConfig.direction === "asc" ? "↑" : "↓")}
            </Th>
            <Th onClick={() => handleSort("positiveSortOrderCount")} cursor="pointer">
              Positive Sort Orders Count{" "}
              {sortConfig.key === "positiveSortOrderCount" && (sortConfig.direction === "asc" ? "↑" : "↓")}
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          {sortedDomains.map(({ domain, totalResults, positiveSortOrderCount }) => (
            <Tr key={domain}>
              <Td>{domain}</Td>
              <Td>{totalResults}</Td>
              <Td>{positiveSortOrderCount}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default WhitelistGSerp;