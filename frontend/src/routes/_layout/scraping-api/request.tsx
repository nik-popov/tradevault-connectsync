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
} from "@chakra-ui/react";
import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { FiSend, FiGithub } from "react-icons/fi";
import PromoSERP from "../../../components/PromoSERP";

export const Route = createFileRoute("/_layout/scraping-api/request")({
  component: Request,
});

function Request() {
  const queryClient = useQueryClient();
  const currentUser = queryClient.getQueryData(["currentUser"]);

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

  return (
    <Container maxW="full">
      {/* 🔄 Title with Debug Toggles */}
      <Flex justify="space-between" align="center" my={4} flexWrap="wrap">
        <Heading size="lg">Submit API Request</Heading>

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
              <PromoSERP /> {/* ✅ Promo Content Under Alert */}
            </>
          ) : isFullyDeactivated ? (
            <Alert status="error" borderRadius="md">
              <AlertIcon />
              <Flex justify="space-between" align="center" w="full">
                <Text>Your subscription has been deactivated. Please renew to submit requests.</Text>
                <Button colorScheme="red" onClick={() => setHasSubscription(true)}>
                  Reactivate Now
                </Button>
              </Flex>
            </Alert>
          ) : (
            <>
              {/* ✅ Submit Request Section */}
              <Box p={6} border="1px solid" borderColor="gray.200" borderRadius="md" boxShadow="sm">
                <Text fontSize="xl" fontWeight="bold" mb={2}>Submit Your API Request</Text>
                <Text fontSize="sm" color="gray.600" mb={4}>
                  Click below to submit a request to the API.
                </Text>
                <Button colorScheme="blue" leftIcon={<FiSend />} size="lg">
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
              <Text fontWeight="bold">Test Your Request</Text>
              <Text fontSize="sm">Ensure your setup is correct.</Text>
              <Button mt={2} leftIcon={<FiSend />} size="sm" variant="outline">
                Send Test Request
              </Button>
            </Box>
            <Box p={4} shadow="sm" borderWidth="1px" borderRadius="lg">
              <Text fontWeight="bold">GitHub</Text>
              <Text fontSize="sm">Explore open-source projects.</Text>
              <Button mt={2} leftIcon={<FiGithub />} size="sm" variant="outline">
                Join GitHub
              </Button>
            </Box>
          </VStack>
        </Box>
      </Flex>
    </Container>
  );
}

export default Request;
