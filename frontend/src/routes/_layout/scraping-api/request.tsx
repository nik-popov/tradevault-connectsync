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
} from "@chakra-ui/react";
import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { FiSend, FiGithub } from "react-icons/fi";
import PromoSERP from "../../../components/ComingSoon";

// Storage and Product Key
const STORAGE_KEY = "subscriptionSettings";
const PRODUCT = "serp"; // Define product-specific subscription management

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
  const [apiName, setApiName] = useState("");
  const [apiDescription, setApiDescription] = useState("");
  const [apiUrl, setApiUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (): Promise<void> => {
    if (!apiName.trim() || !apiDescription.trim() || !apiUrl.trim()) {
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
        description: "Your API request has been submitted successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      // Reset form
      setApiName("");
      setApiDescription("");
      setApiUrl("");
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
          <Text fontSize="xl" fontWeight="bold">Request APIs</Text>
          <Text fontSize="sm">Request a website to add to our available APIs.</Text>
        </Box>
      </Flex>

      <Divider my={4} />

      {/* No Subscription - Show Promo */}
      {isLocked ? (
        <PromoSERP />
      ) : isFullyDeactivated ? (
        <Flex justify="space-between" align="center" w="full" p={4} bg="red.50" borderRadius="md">
          <Text>Your subscription has been deactivated. Please renew to submit requests.</Text>
          <Button
            colorScheme="red"
            onClick={() => navigate({ to: "/billing" })} // Fixed TS2345
          >
            Reactivate Now
          </Button>
        </Flex>
      ) : (
        <Flex mt={6} gap={6} justify="space-between" align="stretch" wrap="wrap">
          {/* Request API Form */}
          <Box flex="1" minW={{ base: "100%", md: "65%" }}>
            <Box p={6} border="1px solid" borderColor="gray.200" borderRadius="md" boxShadow="sm">
              <Text fontSize="xl" fontWeight="bold" mb={4}>
                Request a New API
              </Text>

              <FormControl mb={4}>
                <FormLabel>API Name</FormLabel>
                <Input
                  placeholder="Enter API name"
                  value={apiName}
                  onChange={(e) => setApiName(e.target.value)}
                />
              </FormControl>

              <FormControl mb={4}>
                <FormLabel>API Description</FormLabel>
                <Textarea
                  placeholder="Describe the API and its purpose"
                  value={apiDescription}
                  onChange={(e) => setApiDescription(e.target.value)}
                />
              </FormControl>

              <FormControl mb={4}>
                <FormLabel>API Website URL</FormLabel>
                <Input
                  placeholder="https://example.com/api"
                  value={apiUrl}
                  onChange={(e) => setApiUrl(e.target.value)}
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

          {/* Sidebar */}
          <Box w={{ base: "100%", md: "250px" }} p="4" borderLeft={{ md: "1px solid #E2E8F0" }}>
            <VStack spacing="4" align="stretch">
              <Box p="4" shadow="sm" borderWidth="1px" borderRadius="lg">
                <Text fontWeight="bold">Quick Actions</Text>
                <Button
                  as="a"
                  href="https://github.com/iconluxurygroupNet"
                  leftIcon={<FiGithub />}
                  variant="outline"
                  size="sm"
                  mt="2"
                >
                  GitHub Discussions
                </Button>
                <Button
                  as="a"
                  href="mailto:support@iconluxury.group"
                  leftIcon={<FiSend />}
                  variant="outline"
                  size="sm"
                  mt="2"
                >
                  Email Support
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