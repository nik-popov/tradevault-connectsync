import {
  Container,
  Heading,
  Text,
  Button,
  VStack,
  HStack,
  Divider,
  Flex,
  Switch,
  Alert,
  AlertIcon,
  Box,
  Input,
  Textarea,
  FormControl,
  FormLabel,
  useToast,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { FiSend } from "react-icons/fi";
import PromoSERP from "../../../components/PromoSERP";

export const Route = createFileRoute("/_layout/scraping-api/request")({
  component: Request,
});

function Request() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const toast = useToast();

  // ✅ Load Subscription State from LocalStorage & React Query
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

  const { hasSubscription, isTrial, isDeactivated } = subscriptionSettings;
  const isLocked = !hasSubscription && !isTrial;
  const isFullyDeactivated = isDeactivated && !hasSubscription;

  // ✅ Form State
  const [apiName, setApiName] = useState("");
  const [apiDescription, setApiDescription] = useState("");
  const [apiUrl, setApiUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
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
      {/* 🔄 Title with Subscription Toggles */}
      <Flex justify="space-between" align="center" my={4} flexWrap="wrap">
        <Heading size="lg">Request a New API</Heading>

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

      <Divider my={4} />

      {/* 🚨 No Subscription - Show Promo */}
      {isLocked ? (
        <PromoSERP />
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
        <Flex gap={6} mt={6}>
          <Box flex="1">
            {/* ✅ Request API Form */}
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
   {/* ✅ Sidebar */}
   <Box w={{ base: "100%", md: "250px" }} p="4" borderLeft={{ md: "1px solid #E2E8F0" }}>
            <VStack spacing="4" align="stretch">
              <Box p="4" shadow="sm" borderWidth="1px" borderRadius="lg">
                <Text fontWeight="bold">Quick Actions</Text>
                <Button
                  as="a"
                  href="https://github.com/CobaltDataNet"
                  leftIcon={<FiGithub />}
                  variant="outline"
                  size="sm"
                  mt="2"
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
