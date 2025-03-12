// components/WhitelistGSerp.tsx
import React, { useState, useEffect } from "react";
import { Box, Text, Table, Thead, Tbody, Tr, Th, Td, Spinner, Flex } from "@chakra-ui/react";

interface DomainAggregation {
  domain: string;
  totalResults: number;
  positiveSortOrderCount: number;
}

const WhitelistGSerp: React.FC = () => {
  const [domains, setDomains] = useState<DomainAggregation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortConfig, setSortConfig] = useState<{
    key: "domain" | "totalResults" | "positiveSortOrderCount";
    direction: "asc" | "desc";
  }>({
    key: "positiveSortOrderCount",
    direction: "desc",
  });

  useEffect(() => {
    const fetchDomains = async () => {
      try {
        const response = await fetch("https://backend-dev.iconluxury.group/api/whitelist-domains", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        if (!response.ok) {
          throw new Error(`Failed to fetch domains: ${response.status}`);
        }
        const data: DomainAggregation[] = await response.json();
        console.log("Fetched domains:", data);
        setDomains(data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching domains:", error);
        setError("Failed to load data from the server.");
        setIsLoading(false);
      }
    };

    fetchDomains();
  }, []);

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

  // Handle column sorting
  const handleSort = (key: "domain" | "totalResults" | "positiveSortOrderCount") => {
    setSortConfig((prev) => {
      const newDirection = prev.key === key && prev.direction === "asc" ? "desc" : "asc";
      return { key, direction: newDirection };
    });
  };

  if (isLoading) {
    return (
      <Flex justify="center" align="center" height="200px">
        <Spinner size="xl" />
      </Flex>
    );
  }

  if (error) {
    return (
      <Box>
        <Text fontSize="lg" fontWeight="bold" mb={4}>
          Whitelist Domains
        </Text>
        <Text color="red.500">{error}</Text>
      </Box>
    );
  }

  return (
    <Box>
      <Text fontSize="lg" fontWeight="bold" mb={4}>
        Whitelist Domains
      </Text>
      {sortedDomains.length === 0 ? (
        <Text>No data available.</Text>
      ) : (
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
      )}
    </Box>
  );
};

export default WhitelistGSerp;