import React from 'react';
import { Box, Heading, Text, Divider, Alert, AlertIcon, List, ListItem, ListIcon } from "@chakra-ui/react";
import { FiCheckCircle } from "react-icons/fi";

const PromoSERP = () => (
  <Box maxW="3xl" mx="auto" px={{ base: 4, md: 8 }} py={8}>
    <Heading size="lg" textAlign="center">Google Search API</Heading>
    <Divider my={4} />
    <Text>Fetch Google Search results using our premium API:</Text>
    
    <List spacing={3} mt={4}>
      <ListItem>
        <ListIcon as={FiCheckCircle} color="green.500" />
        Real-time search results
      </ListItem>
      <ListItem>
        <ListIcon as={FiCheckCircle} color="green.500" />
        JSON structured data
      </ListItem>
      <ListItem>
        <ListIcon as={FiCheckCircle} color="green.500" />
        Custom query parameters
      </ListItem>
      <ListItem>
        <ListIcon as={FiCheckCircle} color="green.500" />
        Fast and reliable response times
      </ListItem>
    </List>
    
    <Alert status="success" borderRadius="md" mt={6}>
      <AlertIcon />
      <Text>All API requests are securely handled and optimized.</Text>
    </Alert>
  </Box>
);

export default PromoSERP;
