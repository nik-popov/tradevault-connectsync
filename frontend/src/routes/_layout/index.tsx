import { useState, useMemo } from "react";
import {
  Box,
  Container,
  Text,
  VStack,
} from "@chakra-ui/react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/_layout/")({
  component: Dashboard,
});

function Dashboard() {
  const navigate = useNavigate();

  const proxyProducts = [
    {
      id: "https-proxy",
      name: "HTTPS Proxy API ⚙️",
      type: "proxy",
      description: "Reroute any https request in any region",
      owned: true,
      path: "/scraping-tools/https-proxy"
    },
  ];

  return (
    <Container maxW="full" bg="gray.50" minH="100vh" p={6}>
      <Text fontSize="2xl" fontWeight="bold" mb={6}>
        Dashboard
      </Text>
      <VStack spacing={6} align="stretch">
        {proxyProducts.map((product) => (
          <Box
            key={product.id}
            p={5}
            shadow="md"
            borderWidth="1px"
            borderRadius="lg"
            bg="white"
            borderColor="gray.200"
            cursor="pointer"
            _hover={{
              bg: "gray.50",
              transition: "background-color 0.2s"
            }}
            onClick={() => navigate({ to: product.path })}
          >
            <Text fontSize="lg" color="gray.800">{product.name}</Text>
            <Text fontSize="sm" color="gray.600">{product.description}</Text>
          </Box>
        ))}
      </VStack>
    </Container>
  );
}

export default Dashboard;