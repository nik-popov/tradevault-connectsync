// src/components/Support.tsx
import React, { useState } from "react";
import {
  Container,
  Box,
  Text,
  Button,
  VStack,
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
  Table,
  Thead,
  Tr,
  Th,
  Td,
  Tbody,
} from "@chakra-ui/react";
import { createFileRoute } from "@tanstack/react-router";
import { FiSend, FiHelpCircle, FiGithub } from "react-icons/fi";
import useCustomToast from "./../../hooks/useCustomToast"; // Import the custom hook

// Route Setup
export const Route = createFileRoute("/_layout/support")({
  component: Support,
});

function Support() {
  const showToast = useCustomToast(); // Use the custom toast hook

  // Form State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!name || !email || !message) {
      showToast("Error", "Please fill in all fields before submitting.", "error");
      return;
    }

    setIsSubmitting(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      showToast("Support Request Sent", "Our team will get back to you soon.", "success");

      // Reset form
      setName("");
      setEmail("");
      setMessage("");
    } catch (error) {
      showToast("Submission Failed", "Something went wrong. Please try again later.", "error");
    }

    setIsSubmitting(false);
  };

  // Dummy Support Tickets
  const dummyTickets = [
    { id: 1, subject: "File Upload Issue", status: "Open", date: "2025-02-10" },
    { id: 2, subject: "Proxy Connection Issue", status: "Closed", date: "2025-02-11" },
  ];

  // Tabs Configuration
  const tabsConfig = [
    // { title: "Community", component: <CommunitySection /> },
    // { title: "Support Tickets", component: <SupportTickets tickets={dummyTickets} /> },
    {
      title: "Submit Request",
      component: (
        <SubmitRequest
          handleSubmit={handleSubmit}
          name={name}
          setName={setName}
          email={email}
          setEmail={setEmail}
          message={message}
          setMessage={setMessage}
          isSubmitting={isSubmitting}
        />
      ),
    },
    // { title: "FAQs", component: <FAQSection /> },
  ];

  return (
    <Container maxW="full">
      <Flex align="center" justify="space-between" py={6} flexWrap="wrap" gap={4}>
        <Box textAlign="left" flex="1">
          <Text fontSize="xl" fontWeight="bold">Support & Help Center</Text>
          <Text fontSize="sm">Find help, open tickets, or contact support.</Text>
        </Box>
      </Flex>

      <Divider my={4} />

      <Flex mt={6} gap={6} justify="space-between">
        <Box flex="1">
          <Tabs variant="enclosed">
            <TabList>
              {tabsConfig.map((tab, index) => (
                <Tab key={index}>{tab.title}</Tab>
              ))}
            </TabList>
            <TabPanels>
              {tabsConfig.map((tab, index) => (
                <TabPanel key={index}>{tab.component}</TabPanel>
              ))}
            </TabPanels>
          </Tabs>
        </Box>
      </Flex>
    </Container>
  );
}

// FAQs Section
const FAQSection = () => {
  const faqs = [
    {
      question: "How do I set up my proxy?",
      answer: "Follow our quick start guide in the documentation to configure your proxy settings.",
    },
    {
      question: "What should I do if my proxy isn’t working?",
      answer: "Check your authentication credentials, ensure your IP is whitelisted, and review our status page.",
    },
    {
      question: "Can I use multiple devices with my proxy?",
      answer: "Yes, but you may need additional authentication methods depending on your plan.",
    },
    {
      question: "Where can I get billing support?",
      answer: "Contact our billing team at billing@iconluxury.group for assistance.",
    },
  ];

  return (
    <VStack align="stretch" spacing={6}>
      {faqs.map((faq, index) => (
        <Box key={index} p={4} borderWidth="1px" borderRadius="md">
          <Text fontSize="lg" fontWeight="bold">{faq.question}</Text>
          <Text mt={2}>{faq.answer}</Text>
        </Box>
      ))}

      <Box textAlign="center" mt={6}>
        <Text fontSize="sm">Need more help?</Text>
        <Button as="a" href="mailto:support@iconluxury.group" leftIcon={<FiHelpCircle />} mt={2} variant="outline">
          Contact Support
        </Button>
      </Box>
    </VStack>
  );
};

// Community Section
const CommunitySection = () => (
  <Box>
    <Text fontSize="xl" fontWeight="bold">Community Support</Text>
    <Text mt={2}>Join discussions with other users on GitHub.</Text>
    <Button as="a" href="https://github.com/iconluxurygroupNet" leftIcon={<FiGithub />} mt={4} variant="outline">
      GitHub Discussions
    </Button>
  </Box>
);

// Support Tickets Section
const SupportTickets = ({ tickets }: { tickets: { id: number; subject: string; status: string; date: string }[] }) => (
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
const SubmitRequest = ({
  handleSubmit,
  name,
  setName,
  email,
  setEmail,
  message,
  setMessage,
  isSubmitting,
}: {
  handleSubmit: () => void;
  name: string;
  setName: (value: string) => void;
  email: string;
  setEmail: (value: string) => void;
  message: string;
  setMessage: (value: string) => void;
  isSubmitting: boolean;
}) => (
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
    <Button colorScheme="blue" leftIcon={<FiSend />} isLoading={isSubmitting} onClick={handleSubmit}>
      Submit
    </Button>
  </Box>
);

export default Support;