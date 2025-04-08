import React from "react";
import {
  Box,
  Container,
  Text,
  SimpleGrid,
  Heading,
} from "@chakra-ui/react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/_layout/")({
  component: Dashboard,
});

function Dashboard() {
  const navigate = useNavigate();

  const products = [
    {
      id: "https-proxy",
      name: "HTTPS Proxy",
      description: "Route HTTPS requests globally",
      path: "/scraping-tools/https-proxy",
    },
    // Add more products here as needed
  ];

  return (
    <Container maxW="5xl" py={12}>
      <Heading as="h1" size="lg" mb={8} textAlign="center" color="gray.700">
        Your Tools
      </Heading>
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
        {products.map((product) => (
          <Box
            key={product.id}
            p={5}
            bg="white"
            borderRadius="md"
            boxShadow="sm"
            _hover={{ boxShadow: "md", transform: "translateY(-2px)", transition: "all 0.2s" }}
            cursor="pointer"
            onClick={() => navigate({ to: product.path })}
          >
            <Text fontSize="xl" fontWeight="semibold" color="gray.800" mb={2}>
              {product.name}
            </Text>
            <Text fontSize="sm" color="gray.500">
              {product.description}
            </Text>
          </Box>
        ))}
      </SimpleGrid>
    </Container>
  );
}

export default Dashboard;