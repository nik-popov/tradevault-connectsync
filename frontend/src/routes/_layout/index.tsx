import React from "react";
import {
  Box,
  Container,
  Text,
  Grid,
  GridItem,
  Heading,
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
      description: "Reroute any HTTPS request in any region",
      path: "/scraping-tools/https-proxy",
    },
    // Add more products here in the future
  ];

  return (
    <Container maxW="7xl" bg="gray.50" minH="100vh" py={10}>
      <VStack spacing={8} align="stretch">
        <Heading as="h1" size="xl" color="gray.800">
          Dashboard
        </Heading>
        <Grid
          templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }}
          gap={6}
        >
          {proxyProducts.map((product) => (
            <GridItem key={product.id}>
              <Box
                p={6}
                bg="white"
                borderRadius="lg"
                shadow="md"
                borderWidth="1px"
                borderColor="gray.200"
                cursor="pointer"
                _hover={{
                  bg: "gray.50",
                  shadow: "lg",
                  transition: "all 0.2s",
                }}
                onClick={() => navigate({ to: product.path })}
                h="full"
              >
                <Text fontSize="lg" fontWeight="bold" color="gray.800" mb={2}>
                  {product.name}
                </Text>
                <Text fontSize="sm" color="gray.600">
                  {product.description}
                </Text>
              </Box>
            </GridItem>
          ))}
        </Grid>
      </VStack>
    </Container>
  );
}

export default Dashboard;