import React from 'react';
import {
  Box,
  Grid,
  GridItem,
  Heading,
  Text,
  Button,
  Code,
  Icon,
  Flex,
  Alert,
  AlertIcon,
  Divider,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  useColorModeValue,
} from "@chakra-ui/react";
import { FiCheckCircle, FiCopy, FiGlobe, FiCode, FiSettings, FiServer, FiList } from "react-icons/fi";
// Placeholder for chart component (you can replace with actual charting library)
import { Bar } from 'react-chartjs-2'; // Example, install react-chartjs-2 and chart.js if using

const ProxyStarted = () => {
  const bgColor = useColorModeValue("gray.50", "gray.800");
  const cardBg = useColorModeValue("white", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  // Sample chart data (replace with real data from your API)
  const usageChartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [{
      label: 'Requests',
      data: [120, 190, 300, 500, 200, 300, 450],
      backgroundColor: 'rgba(66, 153, 225, 0.6)',
      borderColor: 'rgba(66, 153, 225, 1)',
      borderWidth: 1,
    }],
  };

  const steps = [
    {
      title: "List Endpoints",
      icon: FiList,
      description: "Retrieve all available proxy endpoints.",
      content: (
        <Code p={2} fontSize="xs" bg="gray.600" borderRadius="md">
          {`curl -X GET https://api.iconluxury.group/api/v1/endpoints`}
        </Code>
      ),
    },
    {
      title: "Get Locations",
      icon: FiGlobe,
      description: "List of supported proxy locations.",
      content: (
        <Code p={2} fontSize="xs" bg="gray.600" borderRadius="md">
          {`curl -X GET https://api.iconluxury.group/api/v1/locations`}
        </Code>
      ),
    },
    {
      title: "Configure Endpoint",
      icon: FiGlobe,
      description: "Connect to residential proxy network.",
      content: (
        <Code p={2} fontSize="xs" bg="gray.600" borderRadius="md">
          https://api.iconluxury.group/api/v1/proxy/residential/
        </Code>
      ),
    },
    {
      title: "Set Authentication",
      icon: FiCode,
      description: "Authenticate with your credentials.",
      content: (
        <Box>
          <Code fontSize="xs" bg="gray.600" p={2} borderRadius="md" display="block" mb={2}>
            Username: your_username<br />
            Password: your_password
          </Code>
          <Button leftIcon={<FiCopy />} size="xs" colorScheme="blue" variant="outline">
            Copy
          </Button>
        </Box>
      ),
    },
    {
      title: "Retrieve Auth Info",
      icon: FiCode,
      description: "Check authentication status.",
      content: (
        <Code p={2} fontSize="xs" bg="gray.600" borderRadius="md">
          {`curl -X GET https://api.iconluxury.group/api/v1/auth`}
        </Code>
      ),
    },
    {
      title: "Optimize Settings",
      icon: FiSettings,
      description: "Adjust headers for performance.",
      content: (
        <Code p={2} fontSize="xs" bg="gray.600" borderRadius="md">
          {`headers = {'User-Agent': 'YourApp/1.0'}`}
        </Code>
      ),
    },
    {
      title: "Send Request",
      icon: FiServer,
      description: "Start making proxy requests.",
      content: (
        <Code p={2} fontSize="xs" bg="gray.600" borderRadius="md">
          {`curl --proxy-user username:password -x api.iconluxury.group/api/v1/proxy/residential/ https://api.mywebsite.com`}
        </Code>
      ),
    },
    {
      title: "Monitor Usage",
      icon: FiSettings,
      description: "Track and scale your usage.",
      content: (
        <Box>
          <Bar data={usageChartData} options={{ responsive: true, maintainAspectRatio: false }} height={100} />
        </Box>
      ),
    },
  ];

  return (
    <Box maxW="100%" mx="auto" px={{ base: 4, md: 8 }} py={10} bg={bgColor}>
      <Heading textAlign="center" mb={8} fontSize={{ base: "2xl", md: "3xl" }}>
        Get Started with Proxy
      </Heading>

      <Grid
        templateColumns={{ base: "1fr", md: "repeat(4, 1fr)" }}
        gap={6}
        alignItems="stretch"
      >
        {steps.map((step, index) => (
          <GridItem key={index}>
            <Box
              p={4}
              bg={cardBg}
              borderRadius="lg"
              boxShadow="md"
              border="1px"
              borderColor={borderColor}
              height="100%"
              transition="all 0.2s"
              _hover={{ boxShadow: "lg", transform: "translateY(-4px)" }}
            >
              <Flex align="center" mb={3}>
                <Icon as={step.icon} boxSize={6} color="blue.500" mr={2} />
                <Heading size="sm" fontWeight="semibold">{step.title}</Heading>
              </Flex>
              <Text fontSize="sm" color="gray.500" mb={3}>{step.description}</Text>
              {step.content}
            </Box>
          </GridItem>
        ))}
      </Grid>

      <Divider my={8} />

      {/* Stats and Verification */}
      <Flex justify="space-between" flexWrap="wrap" gap={6}>
        <Box flex="1" minW="200px">
          <Stat>
            <StatLabel>Requests Sent</StatLabel>
            <StatNumber>1,234</StatNumber>
            <StatHelpText>Last 24 hours</StatHelpText>
          </Stat>
        </Box>
        <Box flex="1" minW="200px">
          <Stat>
            <StatLabel>Active Endpoints</StatLabel>
            <StatNumber>56</StatNumber>
            <StatHelpText>Currently Online</StatHelpText>
          </Stat>
        </Box>
        <Alert status="success" borderRadius="md" flex="2" minW="200px">
          <AlertIcon as={FiCheckCircle} boxSize={5} />
          <Box>
            <Text fontWeight="bold">Setup Verified</Text>
            <Text fontSize="sm">
              Your proxy is working! Check the <Button variant="link" colorScheme="blue" size="sm">docs</Button> or contact support if needed.
            </Text>
          </Box>
        </Alert>
      </Flex>
    </Box>
  );
};

export default ProxyStarted;