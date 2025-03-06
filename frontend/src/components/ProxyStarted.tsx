import React from 'react';
import { Box, Heading, Text, Button, VStack } from "@chakra-ui/react";

const ProxyStarted = () => {
  return (
    <Box py={10}>
      <Heading size="lg" mb={4}>Start Using Proxies</Heading>
      <VStack spacing={4} align="start">
        <Text>1. Copy this command to list endpoints:</Text>
        <Text fontFamily="monospace" bg="gray.100" p={2} borderRadius="md">
          curl -X GET https://api.iconluxury.group/api/v1/endpoints
        </Text>
        <Text>2. Set your username and password:</Text>
        <Button colorScheme="blue" size="sm">Copy Credentials</Button>
        <Text>3. Test your first request:</Text>
        <Text fontFamily="monospace" bg="gray.100" p={2} borderRadius="md">
          curl --proxy-user username:password -x api.iconluxury.group/api/v1/proxy/residential/ https://api.mywebsite.com
        </Text>
      </VStack>
    </Box>
  );
};

export default ProxyStarted;