import {
  Container,
  Heading,
  Grid,
  GridItem,
  Box,
  Text,
  VStack,
  Divider,
  Badge,
  Flex,
} from "@chakra-ui/react";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_layout/proxies/pricing")({
  component: PricingPage,
});

// Per GB Pricing for Each Product and Tier
const pricingPlans = {
  Residential: [
    { name: "Starter", pricePerGB: "$2.00/GB", traffic: "Up to 500GB", features: ["Standard Speed", "Shared IP Pool"] },
    { name: "Business", pricePerGB: "$1.50/GB", traffic: "Up to 2TB", features: ["Faster Speeds", "Priority Support"], badge: "Most Popular" },
    { name: "Enterprise", pricePerGB: "Custom Pricing", traffic: "Unlimited", features: ["Dedicated IP Pools", "24/7 Support"] },
  ],
  "Residential Mobile": [
    { name: "Starter", pricePerGB: "$2.50/GB", traffic: "Up to 500GB", features: ["Mobile IPs", "Basic Support"] },
    { name: "Business", pricePerGB: "$1.80/GB", traffic: "Up to 2TB", features: ["Fast Mobile IPs", "Priority Support"] },
    { name: "Enterprise", pricePerGB: "Custom Pricing", traffic: "Unlimited", features: ["Custom Mobile IPs", "Dedicated Support"] },
  ],
  Datacenter: [
    { name: "Basic", pricePerGB: "$1.00/GB", traffic: "Up to 5TB", features: ["Shared IPs", "Basic Support"] },
    { name: "Business", pricePerGB: "$0.75/GB", traffic: "Up to 20TB", features: ["Dedicated IPs", "Priority Support"] },
    { name: "Enterprise", pricePerGB: "Custom Pricing", traffic: "Unlimited", features: ["Dedicated Resources", "24/7 SLA"] },
  ],
  "Datacenter Mobile": [
    { name: "Basic", pricePerGB: "$1.20/GB", traffic: "Up to 5TB", features: ["Mobile-Friendly", "Basic Support"] },
    { name: "Business", pricePerGB: "$0.85/GB", traffic: "Up to 20TB", features: ["Dedicated Mobile IPs", "Priority Support"] },
    { name: "Enterprise", pricePerGB: "Custom Pricing", traffic: "Unlimited", features: ["Private Pools", "Dedicated Manager"] },
  ],
  "Browser Proxy": [
    { name: "Standard", pricePerGB: "$2.00/GB", traffic: "Up to 500GB", features: ["Secure Browser Proxy", "Basic Support"] },
    { name: "Premium", pricePerGB: "$1.50/GB", traffic: "Up to 2TB", features: ["Anonymity Mode", "Priority Support"] },
    { name: "Enterprise", pricePerGB: "Custom Pricing", traffic: "Unlimited", features: ["Custom Browser Configs", "Dedicated Sessions"] },
  ],
};

function PricingPage() {
  return (
    <Container maxW="6xl" py={10}>
      {/* PAGE TITLE */}
      <Heading size="lg" textAlign="center" mb={8}>
        Proxy Billing Rates (Per GB)
      </Heading>

      {/* PRICING GRID BY CATEGORY */}
      <VStack spacing={12}>
        {Object.keys(pricingPlans).map((category) => (
          <Box key={category} w="full">
            {/* Category Title */}
            <Heading size="md" textAlign="left" mb={4} borderBottom="2px solid #E2E8F0" pb={2}>
              {category}
            </Heading>

            {/* Grid Layout for Plans */}
            <Grid templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} gap={6}>
              {pricingPlans[category].map((plan) => (
                <GridItem key={plan.name}>
                  <Box
                    p={6}
                    borderWidth="2px"
                    borderRadius="lg"
                    textAlign="center"
                    borderColor="gray.300"
                    shadow="sm"
                    transition="all 0.2s ease-in-out"
                    _hover={{ shadow: "md" }}
                    position="relative"
                  >
                    {/* Badge for Popular Plans */}
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

                    {/* Plan Name */}
                    <Text fontSize="xl" fontWeight="bold">{plan.name}</Text>

                    {/* Price Per GB */}
                    <Text fontSize="2xl" fontWeight="bold" color="teal.500" mt={2}>
                      {plan.pricePerGB}
                    </Text>

                    {/* Traffic Limit */}
                    <Text fontSize="md" color="gray.500">{plan.traffic}</Text>

                    <Divider my={4} />

                    {/* Feature List */}
                    <VStack align="center" spacing={2}>
                      {plan.features.map((feature, index) => (
                        <Text key={index} fontSize="sm">• {feature}</Text>
                      ))}
                    </VStack>
                  </Box>
                </GridItem>
              ))}
            </Grid>
          </Box>
        ))}
      </VStack>

      {/* PRICING NOTICE */}
      <Box mt={8} textAlign="center">
        <Text fontSize="sm" color="gray.500">
          Pricing is based on per GB usage. **Enterprise clients** can request **custom pricing & volume discounts**.
        </Text>
      </Box>
    </Container>
  );
}

export default PricingPage;
