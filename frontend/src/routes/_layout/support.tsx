import React, { useState, useEffect } from "react";
import {
  Container,
  Box,
  Text,
  Button,
  VStack,
  HStack,
  Divider,
  Flex,
  Tabs,
  Tab,
  TabList,
  TabPanels,
  TabPanel,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Alert,
  AlertIcon,
  Table,
  Thead,
  Tr,
  Th,
  Td,
  Tbody,
  useToast,
} from "@chakra-ui/react";
import { createFileRoute } from "@tanstack/react-router";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { FiSend, FiMail, FiHelpCircle, FiGithub } from "react-icons/fi";

import PromoContent from "../../../components/PromoContent";

// Subscription Settings Key
const STORAGE_KEY = "subscriptionSettings";
const PRODUCT = "support"; 

export const Route = createFileRoute("/_layout/support")({
  component: Support,
});

function Support() {
  const queryClient = useQueryClient();
  const toast = useToast();

  // Fetch subscription settings
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
  const restrictedTabs = isTrial ? ["Support Tickets", "Submit Request"] : [];

  // Form State
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

  // Dummy Support Tickets
  const dummyTickets = [
    { id: 1, subject: "Billing Issue", status: "Open", date: "2025-02-10" },
    { id: 2, subject: "Proxy Connection Issue", status: "Closed", date: "2025-02-11" },
  ];

  // Tabs Configuration
  const tabsConfig = [
    { title: "FAQs", component: <FAQSection /> },
    { title: "Community", component: <CommunitySection /> },
    { title: "Support Tickets", component: <SupportTickets tickets={dummyTickets} /> },
    { title: "Submit Request", component: <SubmitRequest handleSubmit={handleSubmit} name={name} setName={setName} email={email} setEmail={setEmail} message={message} setMessage={setMessage} isSubmitting={isSubmitting} /> },
  ];

  return (
    <Container maxW="full">
      <Flex align="center" justify="space-between" py={6} flexWrap="wrap" gap={4}>
        <Box textAlign="left" flex="1">
          <Text fontSize="xl" fontWeight="bold">Support & Help Center</Text>
          <Text fontSize="sm">Find help, open tickets, or contact support.</Text>
        </Box>
      </Flex>

      {isLocked ? (
        <PromoContent />
      ) : isDeactivated ? (
        <Box mt={6}>
          <Text>Your subscription has expired. Please renew to access support features.</Text>
        </Box>
      ) : (
        <Flex mt={6} gap={6} justify="space-between">
          <Box flex="1">
            <Divider my={4} />
            <Tabs variant="enclosed">
              <TabList>
                {tabsConfig.map((tab, index) => (
                  <Tab key={index} isDisabled={restrictedTabs.includes(tab.title)}>
                    {tab.title}
                  </Tab>
                ))}
              </TabList>
              <TabPanels>
                {tabsConfig.map((tab, index) => (
                  <TabPanel key={index}>
                    {restrictedTabs.includes(tab.title) ? <Text>Feature locked during trial.</Text> : tab.component}
                  </TabPanel>
                ))}
              </TabPanels>
            </Tabs>
          </Box>
        </Flex>
      )}
    </Container>
  );
}

// FAQs Section
const FAQSection = () => (
  <Box>
    <Text fontSize="xl" fontWeight="bold">Frequently Asked Questions</Text>
    <Text mt={2}>Check our common support questions and answers.</Text>
    <Button as="a" href="/faqs" mt={4} variant="outline">View FAQs</Button>
  </Box>
);

// Community Section
const CommunitySection = () => (
  <Box>
    <Text fontSize="xl" fontWeight="bold">Community Support</Text>
    <Text mt={2}>Join discussions with other users on GitHub.</Text>
    <Button as="a" href="https://github.com/CobaltDataNet" leftIcon={<FiGithub />} mt={4} variant="outline">
      GitHub Discussions
    </Button>
  </Box>
);

// Support Tickets Section
const SupportTickets = ({ tickets }) => (
  <Box>
    <Text fontSize="xl" fontWeight="bold">Your Support Tickets</Text>
    <Table variant="simple" mt={4}>
      <Thead>
        <Tr>
          <Th>ID</Th>
          <Th>Subject</Th>
          <Th>Status</Th>
          <Th>Date</Th>
        </Tr>
      </Thead>
      <Tbody>
        {tickets.map((ticket) => (
          <Tr key={ticket.id}>
            <Td>{ticket.id}</Td>
            <Td>{ticket.subject}</Td>
            <Td>{ticket.status}</Td>
            <Td>{ticket.date}</Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  </Box>
);

// Submit Request Section
const SubmitRequest = ({ handleSubmit, name, setName, email, setEmail, message, setMessage, isSubmitting }) => (
  <Box>
    <Text fontSize="xl" fontWeight="bold" mb={4}>Submit a Support Request</Text>
    <FormControl mb={4}>
      <FormLabel>Your Name</FormLabel>
      <Input value={name} onChange={(e) => setName(e.target.value)} />
    </FormControl>
    <FormControl mb={4}>
      <FormLabel>Email Address</FormLabel>
      <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
    </FormControl>
    <FormControl mb={4}>
      <FormLabel>Message</FormLabel>
      <Textarea value={message} onChange={(e) => setMessage(e.target.value)} />
    </FormControl>
    <Button colorScheme="blue" leftIcon={<FiSend />} isLoading={isSubmitting} onClick={handleSubmit}>Submit Request</Button>
  </Box>
);

export default Support;
