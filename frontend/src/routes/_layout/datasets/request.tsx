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
  Badge,
  Icon,
} from "@chakra-ui/react";
import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { FiSend, FiGithub, FiInfo } from "react-icons/fi";
import useCustomToast from "../../../hooks/useCustomToast"; // Import the custom toast hook
import PromoSERP from "../../../components/ComingSoon"; // Assuming a similar promo component

// Storage and Product Key
const STORAGE_KEY = "subscriptionSettings";
const PRODUCT = "datasets"; // Adjusted for datasets

export const Route = createFileRoute("/_layout/datasets/request")({
  component: Request,
});

function Request(): JSX.Element {
  const navigate = useNavigate();
  const showToast = useCustomToast(); // Use the custom toast hook

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
  const [datasetName, setDatasetName] = useState("");
  const [datasetDescription, setDatasetDescription] = useState("");
  const [datasetUrl, setDatasetUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (): Promise<void> => {
    if (!datasetName.trim() || !datasetDescription.trim() || !datasetUrl.trim()) {
      showToast(
        "Missing Information",
        "Please complete all fields to submit your dataset request.",
        "warning"
      );
      return;
    }

    if (!/^https?:\/\/[^\s/$.?#].[^\s]*$/.test(datasetUrl)) {
      showToast(
        "Invalid URL",
        "Please provide a valid dataset URL (e.g., https://example.com/dataset).",
        "error"
      );
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API request
      await new Promise((resolve) => setTimeout(resolve, 1000));

      showToast(
        "Request Submitted",
        "Your dataset request has been successfully submitted. We'll review it shortly.",
        "success"
      );

      // Reset form
      setDatasetName("");
      setDatasetDescription("");
      setDatasetUrl("");
    } catch (error) {
      showToast(
        "Submission Error",
        "An error occurred while submitting your request. Please try again later.",
        "error"
      );
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
                <Text fontSize="xl" fontWeight="bold">Request Datasets</Text>
                <Text fontSize="sm" color="gray.500">Request a dataset to add to our available datasets.</Text>
              </Box>
            </Flex>
          </Box>
          <Badge colorScheme={isLocked ? "red" : "green"} alignSelf="center">
            {isLocked ? "Restricted" : "Active"}
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
              Your account is deactivated. Please renew your subscription to request datasets.
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
                    <FormLabel color="gray.300">Dataset Name</FormLabel>
                    <Input
                      placeholder="e.g., Market Trends 2025"
                      value={datasetName}
                      onChange={(e) => setDatasetName(e.target.value)}
                      size="md"
                      bg="gray.700"
                      color="white"
                      borderColor="gray.600"
                      focusBorderColor="blue.300"
                      _hover={{ borderColor: "gray.500" }}
                    />
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel color="gray.300">Dataset Source URL</FormLabel>
                    <Input
                      placeholder="e.g., https://example.com/dataset"
                      value={datasetUrl}
                      onChange={(e) => setDatasetUrl(e.target.value)}
                      size="md"
                      bg="gray.700"
                      color="white"
                      borderColor="gray.600"
                      focusBorderColor="blue.300"
                      _hover={{ borderColor: "gray.500" }}
                    />
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel color="gray.300">Dataset Description</FormLabel>
                    <Textarea
                      placeholder="Describe the dataset and its purpose (e.g., sales data for analysis)"
                      value={datasetDescription}
                      onChange={(e) => setDatasetDescription(e.target.value)}
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