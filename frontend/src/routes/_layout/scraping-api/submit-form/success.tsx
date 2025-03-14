import React from 'react';
import { Container, VStack, Heading, Text, Button } from '@chakra-ui/react';
import { createFileRoute, useNavigate, useParams } from '@tanstack/react-router';

export const Route = createFileRoute('/_layout/scraping-api/submit-form/success')({
  component: SuccessPage,
});

function SuccessPage() {
  const navigate = useNavigate();
  const { jobId } = useParams(); // Get jobId from URL

  return (
    <Container maxW="full" py={10}>
      <VStack spacing={6} align="center">
        <Heading color="green.400">Success!</Heading>
        <Text fontSize="lg" color="gray.300">
          Your request has been submitted successfully.
        </Text>
        <Button
          colorScheme="blue"
          onClick={() => navigate({ to: '/scraping-api/explore' })}
        >
          Jobs List
        </Button>
        <Button
          colorScheme="purple"
          onClick={() => navigate({ to: '/scraping-api/submit-form/google-serp' })}
        >
          Submit New Job
        </Button>
        {jobId && (
          <Button
            colorScheme="teal"
            onClick={() => navigate({ to: `/scraping-api/scraping-jobs/${jobId}` })}
          >
            Job {jobId} Details
          </Button>
        )}
      </VStack>
    </Container>
  );
}

export default SuccessPage;
