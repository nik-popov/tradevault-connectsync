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
  Button,
  VStack,
  Divider,
  Badge,
} from "@chakra-ui/react";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_layout/proxies/pricing")({
  component: PricingPage,
});

// Proxy Pricing Plans (Per GB)
const pricingPlans = {
  Residential: [
    { plan: "Starter", price: "$2.00/GB", features: ["Up to 500GB", "Standard Speed", "Shared IP Pool"] },
    { plan: "Business", price: "$1.50/GB", features: ["Up to 2TB", "Faster Speeds", "Priority Support"], badge: "Most Popular" },
    { plan: "Enterprise", price: "Custom Pricing", features: ["Unlimited Data", "Dedicated IP Pools", "24/7 Support"] },
  ],
  "Residential Mobile": [
    { plan: "Starter", price: "$2.50/GB", features: ["Up to 500GB", "Mobile IPs", "Basic Support"] },
    { plan: "Business", price: "$1.80/GB", features: ["Up to 2TB", "Fast Mobile IPs", "Priority Support"] },
    { plan: "Enterprise", price: "Custom Pricing", features: ["Unlimited Mobile Data", "Custom IPs", "Dedicated Support"] },
  ],
  Datacenter: [
    { plan: "Basic", price: "$1.00/GB", features: ["Up to 5TB", "Shared IPs", "Basic Support"] },
    { plan: "Business", price: "$0.75/GB", features: ["Up to 20TB", "Dedicated IPs", "Priority Support"] },
    { plan: "Enterprise", price: "Custom Pricing", features: ["Unlimited Traffic", "Dedicated Resources", "24/7 SLA"] },
  ],
  "Datacenter Mobile": [
    { plan: "Basic", price: "$1.20/GB", features: ["Up to 5TB", "Mobile-Friendly", "Basic Support"] },
    { plan: "Business", price: "$0.85/GB", features: ["Up to 20TB", "Dedicated Mobile IPs", "Priority Support"] },
    { plan: "Enterprise", price: "Custom Pricing", features: ["Custom Traffic Limits", "Private Pools", "Dedicated Manager"] },
  ],
  "Browser Proxy": [
    { plan: "Standard", price: "$2.00/GB", features: ["Secure Browser Proxy", "Standard Speed", "Basic Support"] },
    { plan: "Premium", price: "$1.50/GB", features: ["High Speed", "Anonymity Mode", "Priority Support"] },
    { plan: "Enterprise", price: "Custom Pricing", features: ["Custom Browser Configs", "Dedicated Sessions", "Private Network"] },
  ],
};

function PricingPage() {
  return (
    <Container maxW="6xl">
      {/* HEADER */}
      <Heading size="lg" textAlign="center" py={8}>
        Proxy Pricing (Per GB)
      </Heading>

      {/* PRICING TABS */}
      <Tabs variant="enclosed">
        <TabList>
          {Object.keys(pricingPlans).map((category) => (
            <Tab key={category}>{category}</Tab>
          ))}
        </TabList>

        <TabPanels>
          {Object.keys(pricingPlans).map((category) => (
            <TabPanel key={category}>
              <VStack spacing={6} align="stretch">
                {pricingPlans[category].map((plan) => (
                  <Box
                    key={plan.plan}
                    p={6}
                    shadow="md"
                    borderWidth="1px"
                    borderRadius="lg"
                    position="relative"
                  >
                    {plan.badge && (
                      <Badge
                        colorScheme="blue"
                        variant="solid"
                        position="absolute"
                        top="-10px"
                        left="50%"
                        transform="translateX(-50%)"
                      >
                        {plan.badge}
                      </Badge>
                    )}
                    <Text fontSize="xl" fontWeight="bold">{plan.plan}</Text>
                    <Text fontSize="lg" color="teal.500">{plan.price}</Text>
                    <Divider my={4} />
                    <VStack align="start">
                      {plan.features.map((feature, index) => (
                        <Text key={index}>- {feature}</Text>
                      ))}
                    </VStack>
                    <Button mt={4} colorScheme="blue" w="full">
                      Choose Plan
                    </Button>
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
          Volume discounts are available for high-usage customers. Contact us for
          **custom enterprise pricing**.
        </Text>
      </Box>
    </Container>
  );
}

export default PricingPage;
