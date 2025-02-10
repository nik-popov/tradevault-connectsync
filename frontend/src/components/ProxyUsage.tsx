import React from 'react';
import { Box, Heading, Text, Divider, Alert, AlertIcon, List, ListItem, ListIcon } from "@chakra-ui/react";
import { FiCheckCircle } from "react-icons/fi";

const ProxyUsage = () => (
  <Box maxW="3xl" mx="auto" px={{ base: 4, md: 8 }} py={8}>
    <Heading size="lg" textAlign="center">Proxy Usage</Heading>
    <Divider my={4} />
    <Text>Below are details on how you are utilizing the proxy services:</Text>
    
    <List spacing={3} mt={4}>
      <ListItem>
        <ListIcon as={FiCheckCircle} color="green.500" />
        Total Requests: 15,234
      </ListItem>
      <ListItem>
        <ListIcon as={FiCheckCircle} color="green.500" />
        Data Transferred: 1.2GB
      </ListItem>
      <ListItem>
        <ListIcon as={FiCheckCircle} color="green.500" />
        Active Connections: 12
      </ListItem>
      <ListItem>
        <ListIcon as={FiCheckCircle} color="green.500" />
        Failed Requests: 45
      </ListItem>
    </List>
    
    <Alert status="success" borderRadius="md" mt={6}>
      <AlertIcon />
      <Text>All proxy usage details are verified and up-to-date.</Text>
    </Alert>
  </Box>
);

export default ProxyUsage;
