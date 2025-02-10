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
  } from "@chakra-ui/react";
  import { createFileRoute } from "@tanstack/react-router";
  
  export const Route = createFileRoute("/_layout/proxies/pricing")({
    component: PricingPage,
  });
  
  const pricingPlans = {
    Residential: [
      { plan: "Starter", price: "$50/month", features: ["10GB Data", "Standard Speed", "Basic Support"] },
      { plan: "Pro", price: "$200/month", features: ["50GB Data", "High Speed", "Priority Support"] },
      { plan: "Starter", price: "$50/month", features: ["10GB Data", "Standard Speed", "Basic Support"] },
      { plan: "Pro", price: "$200/month", features: ["50GB Data", "High Speed", "Priority Support"] },
    ],
    "Residential Mobile": [
      { plan: "Starter", price: "$70/month", features: ["10GB Data", "Mobile IPs", "Basic Support"] },
      { plan: "Pro", price: "$250/month", features: ["50GB Data", "Fast Mobile IPs", "Priority Support"] },
    ],
    Datacenter: [
      { plan: "Basic", price: "$30/month", features: ["Unlimited Bandwidth", "Shared IPs", "Basic Support"] },
      { plan: "Enterprise", price: "$150/month", features: ["Dedicated IPs", "High Speed", "24/7 Support"] },
    ],
    "Datacenter Mobile": [
      { plan: "Basic", price: "$40/month", features: ["Unlimited Bandwidth", "Mobile-Friendly", "Basic Support"] },
      { plan: "Enterprise", price: "$180/month", features: ["Dedicated IPs", "Fast Mobile Access", "24/7 Support"] },
    ],
    "Browser Proxy": [
      { plan: "Standard", price: "$60/month", features: ["Secure Browser Proxy", "Standard Speed", "Basic Support"] },
      { plan: "Premium", price: "$220/month", features: ["High Speed", "Anonymity Mode", "Priority Support"] },
    ],
  };
  
  function PricingPage() {
    return (
      <Container maxW="full">
        <Heading size="lg" textAlign={{ base: "center", md: "left" }} py={12}>
          Proxy Pricing Plans
        </Heading>
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
                    <Box key={plan.plan} p={6} shadow="md" borderWidth="1px" borderRadius="lg">
                      <Text fontSize="xl" fontWeight="bold">{plan.plan}</Text>
                      <Text fontSize="lg" color="teal.500">{plan.price}</Text>
                      <Divider my={4} />
                      <VStack align="start">
                        {plan.features.map((feature, index) => (
                          <Text key={index}>- {feature}</Text>
                        ))}
                      </VStack>
                      <Button mt={4} colorScheme="blue">Choose Plan</Button>
                    </Box>
                  ))}
                </VStack>
              </TabPanel>
            ))}
          </TabPanels>
        </Tabs>
      </Container>
    );
  }
  