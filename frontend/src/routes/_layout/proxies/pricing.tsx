import React, { useState } from "react";
import {
  Box,
  Container,
  Text,
  Button,
  VStack,
  HStack,
  Flex,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Badge,
  Heading,
  List,
  ListItem,
  ListIcon,
  Icon,
  Alert,
  AlertIcon,
  useColorModeValue,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from "@chakra-ui/react";
import { FaNetworkWired, FaCloud, FaMobileAlt, FaDatabase, FaDollarSign } from "react-icons/fa";
import { FiCheckCircle } from "react-icons/fi";

const proxyPricing = {
  Residential: [
    { tier: "Explorer", price: "$5/month", trafficLimit: "1,000 API requests", features: ["Basic dataset access", "Standard support"], badge: "Best Value" },
    { tier: "Archiver", price: "$100/month", trafficLimit: "10,000 API requests", features: ["Extended dataset history", "Priority support"], badge: "Most Popular" },
    { tier: "Researcher", price: "$500/month", trafficLimit: "100,000 API requests", features: ["High download limits", "Advanced analytics"] },
    { tier: "Enterprise", price: "Custom", trafficLimit: "Unlimited", features: ["Unlimited API requests", "Dedicated account manager", "Custom integrations"] },
  ],
};

const PricingPage = () => {
  const [selectedProduct, setSelectedProduct] = useState("Residential");
  const tabBg = useColorModeValue("gray.700", "gray.700");
  const tabHoverBg = useColorModeValue("gray.600", "gray.600");
  const textColor = useColorModeValue("gray.900", "white");

  return (
    <Container maxW="full" py={10} bg="gray.800" px={6}>
      <Alert status="info" borderRadius="md" bg="gray.700" color="gray.300" mb={6}>
        <AlertIcon color="blue.500" />
        <Text fontSize="sm">All plans include secure, high-speed API access with real-time data retrieval.</Text>
      </Alert>

      <Text fontSize="lg" fontWeight="bold" color={textColor} mb={4}>Dataset Subscription Plans</Text>
      <Flex>
        <Box w={{ base: "full", md: "250px" }} bg={tabBg} p={4} borderRadius="md">
          <Tabs variant="unstyled" onChange={(index) => setSelectedProduct(Object.keys(proxyPricing)[index])}>
            <TabList flexDirection="column" alignItems="flex-start" gap={2}>
              {Object.keys(proxyPricing).map((product) => (
                <Tab key={product} bg={tabBg} color={textColor} px={4} py={2} borderRadius="md" fontSize="sm" fontWeight="bold" _hover={{ bg: tabHoverBg }}>
                  <HStack spacing={2}>
                    <Icon as={FaDatabase} boxSize={4} /> <Text>{product} Datasets</Text>
                  </HStack>
                </Tab>
              ))}
            </TabList>
          </Tabs>
        </Box>
        <Box flex="1" pl={6}>
          <Tabs isLazy>
            <TabPanels>
              {Object.keys(proxyPricing).map((product) => (
                <TabPanel key={product}>
                  <VStack spacing={6} align="stretch">
                    {proxyPricing[product].map((tier) => (
                      <Box key={tier.tier} p={6} borderWidth="2px" borderRadius="lg" textAlign="center" bg="gray.700" borderColor="blue.500">
                        {tier.badge && (
                          <Badge colorScheme="blue" px={2} py={1} mb={2}>{tier.badge}</Badge>
                        )}
                        <Heading as="h3" size="md" color={textColor} mb={2}>{tier.tier}</Heading>
                        <Text fontSize="lg" fontWeight="bold" color="blue.400">{tier.price}</Text>
                        <Text fontSize="sm" color="gray.300" mt={1}>{tier.trafficLimit}</Text>
                        <List spacing={2} my={4} textAlign="left">
                          {tier.features.map((feature, index) => (
                            <ListItem key={index} display="flex" alignItems="center">
                              <ListIcon as={FiCheckCircle} color="blue.400" boxSize={4} /> {feature}
                            </ListItem>
                          ))}
                        </List>
                        <Button colorScheme="blue" size="sm" w="full">
                          {tier.price === "Custom" ? "Contact Sales" : "Choose Plan"}
                        </Button>
                      </Box>
                    ))}
                  </VStack>
                </TabPanel>
              ))}
            </TabPanels>
          </Tabs>
        </Box>
      </Flex>
    </Container>
  );
};

export default PricingPage;