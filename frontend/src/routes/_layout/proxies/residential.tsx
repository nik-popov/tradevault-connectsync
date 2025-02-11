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
  HStack,
  Divider,
  Flex,
  Switch,
} from "@chakra-ui/react";
import { useState, useEffect, useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { FiGithub } from "react-icons/fi";

import PromoContent from "../../../components/PromoContent";
import ProxyStarted from "../../../components/ProxyStarted";
import ProxySettings from "../../../components/ProxySettings";
import ProxyUsage from "../../../components/ProxyUsage";

// Dummy data for example purposes
const KeyManagement = () => (
  <Box p={4} borderWidth="1px" borderRadius="md">
    <Text fontSize="xl" mb={4}>Key Management</Text>
    <Button colorScheme="blue">Manage Keys</Button>
  </Box>
);

function ResidentialProxy() {
  const queryClient = useQueryClient();
  const [subscriptionSettings, setSubscriptionSettings] = useState({
    hasSubscription: false,
    isTrial: false,
    isDeactivated: false,
  });

  useEffect(() => {
    const storedSettings = localStorage.getItem("subscriptionSettings");
    if (storedSettings) {
      setSubscriptionSettings(JSON.parse(storedSettings));
    } else {
      const querySettings = queryClient.getQueryData("subscriptionSettings");
      if (querySettings) {
        setSubscriptionSettings(querySettings);
      }
    }
  }, [queryClient]);

  // Load current user data
  const currentUser = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("currentUser") || "{}");
    } catch (error) {
      return {};
    }
  }, []);

  const { hasSubscription, isTrial, isDeactivated } = subscriptionSettings;
  const isLocked = !hasSubscription && !isTrial;

  const tabsConfig = [
    { title: "Get Started", component: <ProxyStarted /> },
    { title: "Endpoints", component: <ProxySettings /> },
    { title: "Usage", component: <ProxyUsage /> },
    { title: "Key Management", component: <KeyManagement /> },
  ];

  return (
    <Container maxW="full" overflowX="hidden">
      <Flex align="center" justify="space-between" py={6} flexWrap="wrap">
        <Heading size="lg">Residential Proxies</Heading>
        <HStack spacing={6}>
          <HStack>
            <Text fontWeight="bold">Subscription:</Text>
            <Switch isChecked={hasSubscription} isDisabled />
          </HStack>
          <HStack>
            <Text fontWeight="bold">Trial Mode:</Text>
            <Switch isChecked={isTrial} isDisabled />
          </HStack>
          <HStack>
            <Text fontWeight="bold">Deactivated:</Text>
            <Switch isChecked={isDeactivated} isDisabled />
          </HStack>
        </HStack>
      </Flex>

      {isLocked ? (
        <PromoContent />
      ) : (
        <Flex mt={6} gap={6} justify="space-between">
        {/* Main Content */}
        <Box flex="1">
          <VStack spacing={6} mt={6} align="stretch">
            {filteredProducts.length === 0 ? (
              <Text textAlign="center" fontSize="lg" color="gray.500">No products match this filter.</Text>
            ) : (
              filteredProducts.map((product) => (
                <Box 
                  key={product.id} 
                  p={5} 
                  shadow="md" 
                  borderWidth="1px" 
                  borderRadius="lg" 
                  bg="gray.50"
                  _hover={{ shadow: "lg", transform: "scale(1.02)" }}
                  transition="0.2s ease-in-out"
                >
                  <Text fontWeight="bold" fontSize="lg">{product.name}</Text>
                  <Text fontSize="sm" color="gray.600">{product.description}</Text>
                  <Button 
                    mt={3} 
                    size="sm" 
                    colorScheme="blue" 
                    borderRadius="full"
                    onClick={() => navigate({ to: product.path })}

                  >
                    Manage
                  </Button>
                </Box>
              ))
            )}
          </VStack>
        </Box>

       {/* Sidebar */}
       <Box w="250px" p="4" borderLeft="1px solid #E2E8F0">
          <VStack spacing="4" align="stretch">
            <Box p="4" shadow="sm" borderWidth="1px" borderRadius="lg">
              <Text fontWeight="bold">Quick Actions</Text>
              <Button
                as="a"
                href="mailto:support@thedataproxy.com"
                leftIcon={<FiMail />}
                variant="outline"
                size="sm"
                mt="2"
              >
                Email Support
              </Button>
              <Button
                as="a"
                href="https://dashboard.thedataproxy.com"
                leftIcon={<FiHelpCircle />}
                variant="outline"
                size="sm"
                mt="2"
              >
                Report an Issue
              </Button>
            </Box>

            <Box p="4" shadow="sm" borderWidth="1px" borderRadius="lg">
              <Text fontWeight="bold">FAQs</Text>
              <Text fontSize="sm">Common questions and answers.</Text>
              <Button as="a" href="/faqs" mt="2" size="sm" variant="outline">
                View FAQs
              </Button>
            </Box>

            <Box p="4" shadow="sm" borderWidth="1px" borderRadius="lg">
              <Text fontWeight="bold">Community Support</Text>
              <Text fontSize="sm">Join discussions with other users.</Text>
              <Button
                as="a"
                href="https://github.com/CobaltDataNet"
                mt="2"
                leftIcon={<FiGithub />}
                size="sm"
                variant="outline"
              >
                GitHub Discussions
              </Button>
            </Box>
          </VStack>
        </Box>
      </Flex>
      )}
    </Container>
  );
}

// Export Route AFTER the component definition
export const Route = createFileRoute("/_layout/proxies/residential")({
  component: ResidentialProxy,
});

export default ResidentialProxy;
