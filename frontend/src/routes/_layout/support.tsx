import React, { useState, useEffect } from "react";
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
import { createFileRoute } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { FiSend, FiMail, FiHelpCircle, FiGithub } from "react-icons/fi";

export const Route = createFileRoute("/_layout/support")({
  component: Support,
});

function Support() {
  const queryClient = useQueryClient();
  const toast = useToast();

  // ✅ Load Subscription State
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

  // ✅ Force disable support form for now
  const forceDisableSupport = true;

  // ✅ Form State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!name || !email || !message) {
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
        title: "Support Request Sent",
        description: "Our team will get back to you soon.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      // Reset form
      setName("");
      setEmail("");
      setMessage("");
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
      {/* 🔄 Title & Debugging Toggles */}
      <Flex justify="space-between" align="center" my={4} flexWrap="wrap">
        <Heading size="lg">Support & Help Center</Heading>

        {/* Debugging Toggles */}
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

      <Flex gap={6} mt={6}>
        {/* 🚀 Support Form or Locked Alert */}
        <Box flex="1">
          {forceDisableSupport || isLocked || isFullyDeactivated ? (
            <Alert status="warning" borderRadius="md">
              <AlertIcon />
              <Text>
                Support is currently disabled. Please upgrade your plan or
                contact sales for further assistance.
              </Text>
            </Alert>
          ) : (
            <Box
              p={6}
              border="1px solid"
              borderColor="gray.200"
              borderRadius="md"
              boxShadow="sm"
            >
              <Text fontSize="xl" fontWeight="bold" mb={4}>
                Contact Support
              </Text>

              <FormControl mb={4}>
                <FormLabel>Your Name</FormLabel>
                <Input
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </FormControl>

              <FormControl mb={4}>
                <FormLabel>Email Address</FormLabel>
                <Input
                  placeholder="Enter your email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </FormControl>

              <FormControl mb={4}>
                <FormLabel>Message</FormLabel>
                <Textarea
                  placeholder="Describe your issue"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
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
          )}
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
    </Container>
  );
}

export default Support;
