import {
  Container,
  Heading,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Box,
  Text,
  VStack,
  Divider,
  Badge,
} from "@chakra-ui/react";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_layout/proxies/pricing")({
  component: PricingPage,
});

// Proxy Billing Rates (Per GB)
const pricingRates = {
  Residential: [
    { tier: "Starter", price: "$2.00/GB", details: ["Up to 500GB", "Standard Speed", "Shared IP Pool"] },
    { tier: "Business", price: "$1.50/GB", details: ["Up to 2TB", "Faster Speeds", "Priority Support"], badge: "Most Popular" },
    { tier: "Enterprise", price: "Custom Pricing", details: ["Unlimited Data", "Dedicated IP Pools", "24/7 Support"] },
  ],
  "Residential Mobile": [
    { tier: "Starter", price: "$2.50/GB", details: ["Up to 500GB", "Mobile IPs", "Basic Support"] },
    { tier: "Business", price: "$1.80/GB", details: ["Up to 2TB", "Fast Mobile IPs", "Priority Support"] },
    { tier: "Enterprise", price: "Custom Pricing", details: ["Unlimited Mobile Data", "Custom IPs", "Dedicated Support"] },
  ],
  Datacenter: [
    { tier: "Basic", price: "$1.00/GB", details: ["Up to 5TB", "Shared IPs", "Basic Support"] },
    { tier: "Business", price: "$0.75/GB", details: ["Up to 20TB", "Dedicated IPs", "Priority Support"] },
    { tier: "Enterprise", price: "Custom Pricing", details: ["Unlimited Traffic", "Dedicated Resources", "24/7 SLA"] },
  ],
  "Datacenter Mobile": [
    { tier: "Basic", price: "$1.20/GB", details: ["Up to 5TB", "Mobile-Friendly", "Basic Support"] },
    { tier: "Business", price: "$0.85/GB", details: ["Up to 20TB", "Dedicated Mobile IPs", "Priority Support"] },
    { tier: "Enterprise", price: "Custom Pricing", details: ["Custom Traffic Limits", "Private Pools", "Dedicated Manager"] },
  ],
  "Browser Proxy": [
    { tier: "Standard", price: "$2.00/GB", details: ["Secure Browser Proxy", "Standard Speed", "Basic Support"] },
    { tier: "Premium", price: "$1.50/GB", details: ["High Speed", "Anonymity Mode", "Priority Support"] },
    { tier: "Enterprise", price: "Custom Pricing", details: ["Custom Browser Configs", "Dedicated Sessions", "Private Network"] },
  ],
};

function PricingPage() {
  return (
    <Container maxW="6xl">
      {/* HEADER */}
      <Heading size="lg" textAlign="center" py={8}>
        Proxy Billing Rates (Per GB)
      </Heading>

      {/* PRICING TABS */}
      <Tabs variant="enclosed">
        <TabList>
          {Object.keys(pricingRates).map((category) => (
            <Tab key={category}>{category}</Tab>
          ))}
        </TabList>

        <TabPanels>
          {Object.keys(pricingRates).map((category) => (
            <TabPanel key={category}>
              <VStack spacing={6} align="stretch">
                {pricingRates[category].map((tier) => (
                  <Box
                    key={tier.tier}
                    p={6}
                    shadow="md"
                    borderWidth="1px"
                    borderRadius="lg"
                    position="relative"
                  >
                    {tier.badge && (
                      <Badge
                        colorScheme="blue"
                        variant="solid"
                        position="absolute"
                        top="-10px"
                        left="50%"
                        transform="translateX(-50%)"
                      >
                        {tier.badge}
                      </Badge>
                    )}
                    <Text fontSize="xl" fontWeight="bold">{tier.tier}</Text>
                    <Text fontSize="lg" color="teal.500">{tier.price}</Text>
                    <Divider my={4} />
                    <VStack align="start">
                      {tier.details.map((detail, index) => (
                        <Text key={index}>- {detail}</Text>
                      ))}
                    </VStack>
                  </Box>
                ))}
              </VStack>
            </TabPanel>
          ))}
        </TabPanels>
      </Tabs>

      {/* SECURITY & PRICING NOTICE */}
      <Box mt={8} textAlign="center">
        <Text fontSize="sm" color="gray.500">
          Pricing is based on per GB usage. **Enterprise clients** can request **custom volume pricing**.
        </Text>
      </Box>
    </Container>
  );
}

export default PricingPage;
