import {
  Container,
  Text,
  Button,
  VStack,
  Divider,
  Flex,
  Box,
  Input,
  Textarea,
  FormControl,
  FormLabel,
  useToast,
  Heading,
  Badge,
  Icon,
} from "@chakra-ui/react";
import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { FiSend, FiGithub, FiInfo } from "react-icons/fi";
import PromoSERP from "../../../components/ComingSoon";

// Storage and Product Key
const STORAGE_KEY = "subscriptionSettings";
const PRODUCT = "serp";

export const Route = createFileRoute("/_layout/scraping-api/request")({
  component: Request,
});

function Request(): JSX.Element {
  const navigate = useNavigate();
  const toast = useToast();

  // Load Subscription State using useQuery
  const { data: subscriptionSettings } = useQuery({
    queryKey: ["subscriptionSettings"],
    queryFn: () => {
      const storedSettings = localStorage.getItem(STORAGE_KEY);
      return storedSettings ? JSON.parse(storedSettings) : {};
    },
    staleTime: Infinity,
  });

  const settings = subscriptionSettings?.[PRODUCT] || {
    hasSubscription: false,
    isTrial: false,
    isDeactivated: false,
  };

  const { hasSubscription, isTrial, isDeactivated } = settings;
  const isLocked = !hasSubscription && !isTrial;
  const isFullyDeactivated = isDeactivated && !hasSubscription;

  // Form State
  const [websiteName, setWebsiteName] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [scrapingPurpose, setScrapingPurpose] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (): Promise<void> => {
    if (!websiteName.trim() || !websiteUrl.trim() || !scrapingPurpose.trim()) {
      toast({
        title: "Missing Information",
        description: "Please complete all fields to submit your scraping request.",
        status: "warning",
        duration: 4000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    if (!/^https?:\/\/[^\s/$.?#].[^\s]*$/.test(websiteUrl)) {
      toast({
        title: "Invalid URL",
        description: "Please provide a valid website URL (e.g., https://example.com).",
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API request
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast({
        title: "Request Submitted",
        description: "Your website scraping request has been successfully submitted. We'll review it shortly.",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top",
      });

      // Reset form
      setWebsiteName("");
      setWebsiteUrl("");
      setScrapingPurpose("");
    } catch (error) {
      toast({
        title: "Submission Error",
        description: "An error occurred while submitting your request. Please try again later.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container maxW="full">
      <VStack spacing={6} align="stretch">
        {/* Header */}
        <Flex align="center" justify="space-between" flexWrap="wrap" gap={4}>
          <Box>
          <Flex align="center" justify="space-between" py={6} flexWrap="wrap" gap={4}>
        <Box textAlign="left" flex="1">
          <Text fontSize="xl" fontWeight="bold">Request Scraper</Text>
          <Text fontSize="sm" color="gray.500">Provide details about the website you want to scrape.</Text>
        </Box>
      </Flex>
          </Box>
          <Badge colorScheme={isLocked ? "red" : "green"} alignSelf="center">
            {isLocked ? "Subscription Required" : "Active"}
          </Badge>
        </Flex>

        <Divider borderColor="gray.700" />

        {/* Conditional Content */}
        {isLocked ? (
          <PromoSERP />
        ) : isFullyDeactivated ? (
          <Box p={6} bg="red.900" borderRadius="md" textAlign="center">
            <Text fontSize="lg" fontWeight="semibold" color="red.200" mb={2}>
              Subscription Deactivated
            </Text>
            <Text color="red.300">
              Your account is deactivated. Please renew your subscription to request website scraping.
            </Text>
            <Button
              mt={4}
              colorScheme="blue"
              size="md"
              onClick={() => navigate({ to: "/proxies/pricing" })}
            >
              Reactivate Subscription
            </Button>
          </Box>
        ) : (
          <Flex gap={8} justify="space-between" align="stretch" wrap="wrap">
            {/* Request Form */}
            <Box flex="2" minW={{ base: "100%", md: "60%" }}>
              <Box
                p={6}
                bg="gray.800"
                border="1px solid"
                borderColor="gray.700"
                borderRadius="lg"
                boxShadow="md"
              >
               <VStack spacing={5} align="stretch">
                  <FormControl isRequired>
                    <FormLabel color="gray.300">Website Name</FormLabel>
                    <Input
                      placeholder="e.g., Luxury Retail Store"
                      value={websiteName}
                      onChange={(e) => setWebsiteName(e.target.value)}
                      size="md"
                      bg="gray.700"
                      color="white"
                      borderColor="gray.600"
                      focusBorderColor="blue.300"
                      _hover={{ borderColor: "gray.500" }}
                    />
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel color="gray.300">Website URL</FormLabel>
                    <Input
                      placeholder="e.g., https://luxuryretail.com"
                      value={websiteUrl}
                      onChange={(e) => setWebsiteUrl(e.target.value)}
                      size="md"
                      bg="gray.700"
                      color="white"
                      borderColor="gray.600"
                      focusBorderColor="blue.300"
                      _hover={{ borderColor: "gray.500" }}
                    />
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel color="gray.300">Purpose of Scraping</FormLabel>
                    <Textarea
                      placeholder="Describe what data you need and how it will be used (e.g., product prices for market analysis)"
                      value={scrapingPurpose}
                      onChange={(e) => setScrapingPurpose(e.target.value)}
                      size="md"
                      rows={4}
                      bg="gray.700"
                      color="white"
                      borderColor="gray.600"
                      focusBorderColor="blue.300"
                      _hover={{ borderColor: "gray.500" }}
                    />
                  </FormControl>

                  <Button
                    colorScheme="blue"
                    leftIcon={<FiSend />}
                    size="md"
                    isLoading={isSubmitting}
                    loadingText="Submitting"
                    onClick={handleSubmit}
                    w="full"
                  >
                    Submit Request
                  </Button>
                </VStack>
              </Box>
            </Box>

            {/* Sidebar */}
            <Box w={{ base: "100%", md: "300px" }} p={4}>
              <VStack spacing={6} align="stretch">
                <Box
                  p={4}
                  bg="gray.800"
                  border="1px solid"
                  borderColor="gray.700"
                  borderRadius="lg"
                  boxShadow="sm"
                >
                  <Text fontWeight="semibold" mb={3} color="white">
                    Quick Actions
                  </Text>
                  <VStack spacing={3} align="stretch">
                    <Button
                      as="a"
                      href="https://github.com/iconluxurygroupNet"
                      target="_blank"
                      leftIcon={<FiGithub />}
                      variant="outline"
                      size="md"
                      colorScheme="gray"
                      borderColor="gray.600"
                      color="gray.200"
                      _hover={{ bg: "gray.700" }}
                    >
                      Discuss on GitHub
                    </Button>
                  </VStack>
                </Box>

                <Box>
                  <Flex align="center" mb={2}>
                    <Icon as={FiInfo} color="blue.300" mr={2} />
                    <Text fontWeight="semibold" color="white">
                      Need Help?
                    </Text>
                  </Flex>
                  <Text fontSize="sm" color="gray.400">
                    Contact us via{" "}
                    <Button
                      as="a"
                      href="mailto:support@iconluxury.group"
                      variant="link"
                      colorScheme="blue"
                      size="sm"
                    >
                      email
                    </Button>{" "}
                    or check our{" "}
                    <Button as="a" href="/docs" variant="link" colorScheme="blue" size="sm">
                      documentation
                    </Button>.
                  </Text>
                </Box>
              </VStack>
            </Box>
          </Flex>
        )}
      </VStack>
    </Container>
  );
}

export default Request;