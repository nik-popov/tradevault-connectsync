import React, { useState } from 'react';
import {
  Box,
  Button,
  Text,
  Heading,
  Grid,
  GridItem,
  VStack,
  Badge,
  Tabs,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Divider,
  Container,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from "@chakra-ui/react";
import { useNavigate } from '@tanstack/react-router';
import { createFileRoute } from "@tanstack/react-router";

const proxyPricing = {
  Residential: [
    { tier: "Starter", pricePerGB: "$2.00", trafficLimit: "Up to 500GB" },
    { tier: "Business", pricePerGB: "$1.50", trafficLimit: "Up to 2TB", badge: "Most Popular" },
    { tier: "Business Plus+", pricePerGB: "$1.25", trafficLimit: "Up to 10TB" },
    { tier: "Ultra Enterprise", pricePerGB: "Custom Pricing", trafficLimit: "Unlimited" },
  ],
  "Residential Mobile": [
    { tier: "Starter", pricePerGB: "$2.50", trafficLimit: "Up to 500GB" },
    { tier: "Business", pricePerGB: "$1.80", trafficLimit: "Up to 2TB" },
    { tier: "Business Plus+", pricePerGB: "$1.50", trafficLimit: "Up to 10TB" },
    { tier: "Ultra Enterprise", pricePerGB: "Custom Pricing", trafficLimit: "Unlimited" },
  ],
  Datacenter: [
    { tier: "Starter", pricePerGB: "$1.00", trafficLimit: "Up to 5TB" },
    { tier: "Business", pricePerGB: "$0.75", trafficLimit: "Up to 20TB" },
    { tier: "Business Plus+", pricePerGB: "$0.50", trafficLimit: "Up to 50TB" },
    { tier: "Ultra Enterprise", pricePerGB: "Custom Pricing", trafficLimit: "Unlimited" },
  ],
};

const PricingPage = () => {
  const [selectedProduct, setSelectedProduct] = useState("Residential");
  const navigate = useNavigate();

  return (
    <Container maxW="6xl" py={10}>
      <Heading size="lg" textAlign="center" mb={8}>
        Proxy Pricing Plans
      </Heading>
      
      <Tabs variant="solid-rounded" colorScheme="blue" onChange={(index) => setSelectedProduct(Object.keys(proxyPricing)[index])}>
        <TabList justifyContent="center" flexWrap="wrap">
          {Object.keys(proxyPricing).map((product) => (
            <Tab key={product}>{product}</Tab>
          ))}
        </TabList>
        <TabPanels>
          {Object.keys(proxyPricing).map((product) => (
            <TabPanel key={product}>
              <Table variant="simple" size="lg" mt={6}>
                <Thead>
                  <Tr>
                    <Th>Plan</Th>
                    <Th>Price per GB</Th>
                    <Th>Traffic Limit</Th>
                    <Th>Action</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {proxyPricing[product].map((tier) => (
                    <Tr key={tier.tier}>
                      <Td>
                        <Text fontWeight="bold">{tier.tier}</Text>
                        {tier.badge && <Badge colorScheme="blue" ml={2}>{tier.badge}</Badge>}
                      </Td>
                      <Td color="teal.500" fontWeight="bold">{tier.pricePerGB}</Td>
                      <Td>{tier.trafficLimit}</Td>
                      <Td>
                        {tier.pricePerGB === "Custom Pricing" ? (
                          <Button colorScheme="blue" variant="outline" size="sm">Contact Sales</Button>
                        ) : (
                          <Button colorScheme="blue" size="sm">Choose Plan</Button>
                        )}
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TabPanel>
          ))}
        </TabPanels>
      </Tabs>
    </Container>
  );
};

export const Route = createFileRoute("/_layout/proxies/pricing")({
  component: PricingPage,
});

export default PricingPage;
