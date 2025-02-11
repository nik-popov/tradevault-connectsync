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
import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { FiSend } from "react-icons/fi";

export const Route = createFileRoute("/_layout/scraping-api/request")({
  component: Request,
});

function Request() {
  const queryClient = useQueryClient();
  const currentUser = queryClient.getQueryData(["currentUser"]);
  const toast = useToast();

  if (!currentUser) {
    return (
      <Container maxW="full">
        <Alert status="warning" borderRadius="md">
          <AlertIcon />
          <Text>Loading user data...</Text>
        </Alert>
      </Container>
    );
  }

  // ✅ Subscription & Trial State
  const [hasSubscription, setHasSubscription] = useState(false);
  const [isTrial, setIsTrial] = useState(false);
  const [isDeactivated, setIsDeactivated] = useState(false);
  const isLocked = !hasSubscription && !isTrial;
  const isFullyDeactivated = isDeactivated && !hasSubscription;

  // ✅ Form State
  const [apiName, setApiName] = useState("");
  const [apiDescription, setApiDescription] = useState("");
  const [apiUrl, setApiUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!apiName || !apiDescription || !apiUrl) {
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
      {/* 🔄 Title with Debug Toggles */}
      <Flex justify="space-between" align="center" my={4} flexWrap="wrap">
        <Heading size="lg">Request a New API</Heading>

        {/* Debugging Toggles */}
        <HStack spacing={6}>
          <HStack>
            <Text fontWeight="bold">Subscription:</Text>
            <Switch isChecked={hasSubscription} onChange={() => setHasSubscription(!hasSubscription)} />
          </HStack>
          <HStack>
            <Text fontWeight="bold">Trial Mode:</Text>
            <Switch isChecked={isTrial} onChange={() => setIsTrial(!isTrial)} />
          </HStack>
          <HStack>
            <Text fontWeight="bold">Deactivated:</Text>
            <Switch isChecked={isDeactivated} onChange={() => setIsDeactivated(!isDeactivated)} />
          </HStack>
        </HStack>
      </Flex>

      <Divider my={4} />

      <Flex gap={6} mt={6}>
        <Box flex="1">
          {/* 🚨 No Subscription - Show Promo */}
          {isLocked ? (
            <>
              <Alert status="warning" borderRadius="md">
                <AlertIcon />
                <Text>You need a subscription or trial to submit requests.</Text>
              </Alert>

              {/* 🚀 Promo Section */}
              <Box
                bg="blue.500"
                color="white"
                borderRadius="md"
                p={6}
                mt={4}
                textAlign="center"
                boxShadow="md"
              >
                <Heading as="h3" size="md" fontWeight="bold" mb={2}>
                  Unlock API Requests with a Subscription!
                </Heading>
                <Text fontSize="sm" mb={4}>
                  Get access to unlimited API requests and premium support.
                </Text>
                <Button colorScheme="whiteAlpha" variant="solid" onClick={() => navigate('/pricing')}>
                  View Plans
                </Button>
              </Box>
            </>
          ) : isFullyDeactivated ? (
            <>
              <Alert status="error" borderRadius="md">
                <AlertIcon />
                <Flex justify="space-between" align="center" w="full">
                  <Text>Your subscription has been deactivated. Please renew to submit requests.</Text>
                  <Button colorScheme="red" onClick={() => setHasSubscription(true)}>
                    Reactivate Now
                  </Button>
                </Flex>
              </Alert>

              {/* 🚀 Promo Section */}
              <Box
                bg="blue.500"
                color="white"
                borderRadius="md"
                p={6}
                mt={4}
                textAlign="center"
                boxShadow="md"
              >
                <Heading as="h3" size="md" fontWeight="bold" mb={2}>
                  Reactivate Your Subscription
                </Heading>
                <Text fontSize="sm" mb={4}>
                  Restore access to API requests and continue using our services.
                </Text>
                <Button colorScheme="whiteAlpha" variant="solid" onClick={() => navigate('/billing')}>
                  Renew Now
                </Button>
              </Box>
            </>
          ) : (
            <>
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
            </>
          )}
        </Box>

        {/* ✅ Sidebar */}
        <Box w="250px" p={4} borderLeft="1px solid #E2E8F0">
          <VStack spacing={4} align="stretch">
            <Box p={4} shadow="sm" borderWidth="1px" borderRadius="lg">
              <Text fontWeight="bold">How It Works</Text>
              <Text fontSize="sm">Submit your API request, and we’ll review it.</Text>
            </Box>
            <Box p={4} shadow="sm" borderWidth="1px" borderRadius="lg">
              <Text fontWeight="bold">Need Help?</Text>
              <Text fontSize="sm">Contact support for assistance.</Text>
            </Box>
          </VStack>
        </Box>
      </Flex>
    </Container>
  );
}

export default Request;
