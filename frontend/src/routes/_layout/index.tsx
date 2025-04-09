import React from "react";
import {
  Box,
  Container,
  Text,
  SimpleGrid,
  Heading,
  VStack,
  Divider,
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
      isActive: true,
    },
    {
      id: "http-tunneling",
      name: "HTTP Tunneling",
      description: "Securely tunnel HTTP traffic",
      path: "",
      isActive: false,
    },
    {
      id: "socks5-proxy",
      name: "SOCKS5 Proxy",
      description: "Flexible protocol routing",
      path: "",
      isActive: false,
    },
    {
      id: "web-scraper",
      name: "Web Scraper",
      description: "Extract data from websites",
      path: "",
      isActive: false,
    },
    {
      id: "rotating-proxy",
      name: "Rotating Proxy",
      description: "Dynamic IP rotation",
      path: "",
      isActive: false,
    },
    {
      id: "geo-spoofing",
      name: "Geo-Spoofing",
      description: "Simulate locations worldwide",
      path: "",
      isActive: false,
    },
    {
      id: "cloud-spaces",
      name: "Cloud Spaces",
      description: "Code in the cloud with scalable compute",
      path: "",
      isActive: false,
    },
    {
      id: "vpn-service",
      name: "VPN Service",
      description: "Private network access",
      path: "",
      isActive: false,
    },
  ];

  return (
    <Container maxW="5xl" py={12}>
      {/* Informational Block */}
      <VStack spacing={6} align="stretch" mb={12}>
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
          <Box>
            <Heading as="h3" size="md" mb={2}>
              Getting Started
            </Heading>
            <Text fontSize="sm" color="gray.500">
              New to TheDataProxy? Start with our HTTPS Proxy to route requests globally with ease.
            </Text>
          </Box>

          <Box>
            <Heading as="h3" size="md" mb={2}>
              Scale Your Scraping
            </Heading>
            <Text fontSize="sm" color="gray.500">
              Use our upcoming Web Scraper and Rotating Proxy tools to gather data efficiently.
            </Text>
          </Box>

          <Box>
            <Heading as="h3" size="md" mb={2}>
              Cloud Solutions
            </Heading>
            <Text fontSize="sm" color="gray.500">
              Code anywhere with Cloud Spaces - scalable compute coming soon to TheDataProxy.
            </Text>
          </Box>
        </SimpleGrid>
      </VStack>

      <Divider mb={12} />

      {/* Product Grid */}
      <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={6}>
        {products.map((product) => (
          <Box
            key={product.id}
            p={5}
            bg="white"
            borderRadius="md"
            boxShadow="sm"
            opacity={product.isActive ? 1 : 0.5}
            cursor={product.isActive ? "pointer" : "not-allowed"}
            _hover={
              product.isActive
                ? { boxShadow: "md", transform: "translateY(-2px)", transition: "all 0.2s" }
                : {}
            }
            onClick={product.isActive ? () => navigate({ to: product.path }) : undefined}
          >
            <Text fontSize="xl" fontWeight="semibold" color={product.isActive ? "gray.800" : "gray.500"} mb={2}>
              {product.name}
            </Text>
            <Text fontSize="sm" color={product.isActive ? "gray.500" : "gray.400"}>
              {product.description}
            </Text>
          </Box>
        ))}
      </SimpleGrid>
    </Container>
  );
}

export default Dashboard;