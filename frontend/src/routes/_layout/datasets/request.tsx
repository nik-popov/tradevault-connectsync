import {
  Container,
  Text,
  Button,
  VStack,
  Divider,
  Flex,
  Alert,
  AlertIcon,
  Box,
  Input,
  Textarea,
  FormControl,
  FormLabel,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { FiSend, FiGithub, FiMail, FiHelpCircle } from "react-icons/fi";
import PromoDatasets from "../../../components/ComingSoon";

// Storage and Product Key
const STORAGE_KEY = "subscriptionSettings";
const PRODUCT = "data"; // Define product-specific subscription management

export const Route = createFileRoute("/_layout/datasets/request")({
  component: Request,
});

function Request() {
  const navigate = useNavigate();
  const toast = useToast();

  // ✅ Load Subscription State using useQuery
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

  // ✅ Form State
  const [datasetName, setDatasetName] = useState("");
  const [datasetDescription, setDatasetDescription] = useState("");
  const [datasetUrl, setDatasetUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!datasetName.trim() || !datasetDescription.trim() || !datasetUrl.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all fields before submitting.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API request
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast({
        title: "Request Submitted",
        description: "Your dataset request has been submitted successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      // Reset form
      setDatasetName("");
      setDatasetDescription("");
      setDatasetUrl("");
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "Something went wrong. Please try again later.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }

    setIsSubmitting(false);
  };

  return (
    <Container maxW="full">
    <Flex align="center" justify="space-between" py={6} flexWrap="wrap" gap={4}>
      <Box textAlign="left" flex="1">
        <Text fontSize="xl" fontWeight="bold">Request Datasets</Text>
        <Text fontSize="sm">Request a website to add to our available datasets.</Text>
      </Box>
    </Flex>

      <Divider my={4} />

      {/* 🚨 No Subscription - Show Promo */}
      {isLocked ? (
        <PromoDatasets />
      ) : isFullyDeactivated ? (
        <Alert status="error" borderRadius="md">
          <AlertIcon />
          <Flex justify="space-between" align="center" w="full">
            <Text>Your subscription has been deactivated. Please renew to submit requests.</Text>
            <Button colorScheme="red" onClick={() => navigate("/billing")}>
              Reactivate Now
            </Button>
          </Flex>
        </Alert>
      ) : (
        <Flex mt={6} gap={6} justify="space-between" align="stretch" wrap="wrap">
          {/* ✅ Request Dataset Form */}
          <Box flex="1" minW={{ base: "100%", md: "65%" }}>
            <Box p={6} border="1px solid" borderColor="gray.200" borderRadius="md" boxShadow="sm">
              <Text fontSize="xl" fontWeight="bold" mb={4}>
                Request a New Dataset
              </Text>

              <FormControl mb={4}>
                <FormLabel>Dataset Name</FormLabel>
                <Input
                  placeholder="Enter dataset name"
                  value={datasetName}
                  onChange={(e) => setDatasetName(e.target.value)}
                />
              </FormControl>

              <FormControl mb={4}>
                <FormLabel>Dataset Description</FormLabel>
                <Textarea
                  placeholder="Describe the dataset and its purpose"
                  value={datasetDescription}
                  onChange={(e) => setDatasetDescription(e.target.value)}
                />
              </FormControl>

              <FormControl mb={4}>
                <FormLabel>Dataset Website URL</FormLabel>
                <Input
                  placeholder="https://example.com/dataset"
                  value={datasetUrl}
                  onChange={(e) => setDatasetUrl(e.target.value)}
                />
              </FormControl>

              <Button
                colorScheme="blue"
                leftIcon={<FiSend />}
                size="lg"
                isLoading={isSubmitting}
                onClick={handleSubmit}
              >
                Submit Request
              </Button>
            </Box>
          </Box>

          {/* ✅ Sidebar */}
          <Box w={{ base: "100%", md: "250px" }} p="4" borderLeft={{ md: "1px solid #E2E8F0" }}>
            <VStack spacing="4" align="stretch">
              <Box p="4" shadow="sm" borderWidth="1px" borderRadius="lg">
                <Text fontWeight="bold">Quick Actions</Text>
                <Button
                  as="a"
                  href="mailto:support@iconluxury.group"
                  leftIcon={<FiMail />}
                  variant="outline"
                  size="sm"
                  mt="2"
                >
                  Email Support
                </Button>
                <Button
                  as="a"
                  href="https://iconluxury.group/report-issue"
                  leftIcon={<FiHelpCircle />}
                  variant="outline"
                  size="sm"
                  mt="2"
                >
                  Report an Issue
                </Button>
              </Box>

              <Box p="4" shadow="sm" borderWidth="1px" borderRadius="lg">
                <Text fontWeight="bold">Community Support</Text>
                <Button
                  as="a"
                  href="https://github.com/iconluxurygroupNet"
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

export default Request;
