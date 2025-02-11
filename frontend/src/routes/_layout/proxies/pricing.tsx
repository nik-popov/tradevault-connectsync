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
  useColorModeValue,
} from "@chakra-ui/react";
import { FaNetworkWired, FaCloud, FaMobileAlt } from "react-icons/fa";
import { FiCheckCircle } from "react-icons/fi";

const proxyPricing = {
  Residential: [
    { tier: "Starter", price: "$2.00/GB", trafficLimit: "Up to 500GB" },
    { tier: "Business", price: "$1.50/GB", trafficLimit: "Up to 2TB", badge: "Most Popular" },
    { tier: "Business Plus+", price: "$1.25/GB", trafficLimit: "Up to 10TB" },
    { tier: "Ultra Enterprise", price: "Custom Pricing", trafficLimit: "Unlimited" },
  ],
  "Residential Mobile": [
    { tier: "Starter", price: "$2.50/GB", trafficLimit: "Up to 500GB" },
    { tier: "Business", price: "$1.80/GB", trafficLimit: "Up to 2TB" },
    { tier: "Business Plus+", price: "$1.50/GB", trafficLimit: "Up to 10TB" },
    { tier: "Ultra Enterprise", price: "Custom Pricing", trafficLimit: "Unlimited" },
  ],
  Datacenter: [
    { tier: "Starter", price: "$1.00/GB", trafficLimit: "Up to 5TB" },
    { tier: "Business", price: "$0.75/GB", trafficLimit: "Up to 20TB" },
    { tier: "Business Plus+", price: "$0.50/GB", trafficLimit: "Up to 50TB" },
    { tier: "Ultra Enterprise", price: "Custom Pricing", trafficLimit: "Unlimited" },
  ],
};

const PricingPage = () => {
  const [selectedProduct, setSelectedProduct] = useState("Residential");
  const tabBg = useColorModeValue("gray.700", "gray.700");
  const tabHoverBg = useColorModeValue("gray.600", "gray.600");
  const textColor = "white";

  const productIcons = {
    Residential: <FaCloud size={18} />, 
    "Residential Mobile": <FaMobileAlt size={18} />, 
    Datacenter: <FaNetworkWired size={18} />,
  };

  return (
    <Container maxW="full" py={10} bg="gray.800" px={6}>
      <Text fontSize="lg" fontWeight="bold" color={textColor} mb={4}>Proxy Pricing Plans</Text>
      <Flex>
        <Box w={{ base: "full", md: "250px" }} bg={tabBg} p={4} borderRadius="md">
          <Tabs variant="unstyled" onChange={(index) => setSelectedProduct(Object.keys(proxyPricing)[index])}>
            <TabList flexDirection="column" alignItems="flex-start" gap={2}>
              {Object.keys(proxyPricing).map((product) => (
                <Tab key={product} bg={tabBg} color={textColor} px={4} py={2} borderRadius="md" fontSize="sm" fontWeight="bold" _hover={{ bg: tabHoverBg }}>
                  <HStack spacing={2}>
                    {productIcons[product]} <Text>{product}</Text>
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
                  <Flex wrap="wrap" gap={6} justifyContent="center" mt={6}>
                    {proxyPricing[product].map((tier) => (
                      <Box key={tier.tier} p={6} borderWidth="2px" borderRadius="lg" w={{ base: "full", md: "250px" }} textAlign="center" bg="gray.700" borderColor="blue.500">
                        {tier.badge && (
                          <Badge colorScheme="blue" px={2} py={1} mb={2}>{tier.badge}</Badge>
                        )}
                        <Heading as="h3" size="md" color={textColor} mb={2}>{tier.tier}</Heading>
                        <Text fontSize="lg" fontWeight="bold" color="blue.400">{tier.price}</Text>
                        <Text fontSize="sm" color="gray.300" mt={1}>{tier.trafficLimit}</Text>
                        <List spacing={2} my={4} textAlign="left">
                          <ListItem display="flex" alignItems="center">
                            <ListIcon as={FiCheckCircle} color="blue.400" boxSize={4} /> High-speed proxy access
                          </ListItem>
                          <ListItem display="flex" alignItems="center">
                            <ListIcon as={FiCheckCircle} color="blue.400" boxSize={4} /> Secure encrypted connections
                          </ListItem>
                          <ListItem display="flex" alignItems="center">
                            <ListIcon as={FiCheckCircle} color="blue.400" boxSize={4} /> 24/7 customer support
                          </ListItem>
                        </List>
                        <Button colorScheme="blue" size="sm" w="full">
                          {tier.price === "Custom Pricing" ? "Contact Sales" : "Choose Plan"}
                        </Button>
                      </Box>
                    ))}
                  </Flex>
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