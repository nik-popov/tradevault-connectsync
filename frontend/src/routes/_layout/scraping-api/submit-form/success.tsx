import React from 'react';
import { Container, VStack, Heading, Text, Button } from '@chakra-ui/react';
import { createFileRoute, useNavigate } from '@tanstack/react-router';

export const Route = createFileRoute('/_layout/scraping-api/submit-form/success')({
  component: SuccessPage,
});

function SuccessPage() {
  const navigate = useNavigate();

  return (
    <Container maxW="full" py={10}>
      <VStack spacing={6} align="center">
        <Heading color="green.400">Success!</Heading>
        <Text fontSize="lg" color="gray.300">
          Your request has been submitted successfully.
        </Text>
        <Button
          colorScheme="blue"
          onClick={() => navigate({ to: '/scraping-api/submit-form/google-serp' })}
        >
          Submit Another Request
        </Button>
      </VStack>
    </Container>
  );
}

export default SuccessPage;