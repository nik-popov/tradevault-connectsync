import { Container, Text, Button, Link, VStack } from "@chakra-ui/react";
import { createFileRoute } from '@tanstack/react-router';
export default function IconGPT() {
  return (
    <Container maxW="container.md" py={10}>
      <VStack spacing={6} align="center" textAlign="center">
        <Text fontSize="3xl" fontWeight="bold">
          IconGPT - Coming Soon
        </Text>
        <Text color="gray.500" maxW="md">
          Our AI-powered assistant will soon be embedded directly in your dashboard.
          Currently, you can preview and get early access by visiting{" "}
          <Link
            href="https://chat.thedataproxy.com/"
            color="blue.500"
            fontWeight="semibold"
            isExternal
          >
            chat.thedataproxy.com
          </Link>
          .
          <br /><br />
          Please ask Nik for access to this early preview.
        </Text>
        <Button
          as={Link}
          href="https://chat.thedataproxy.com/"
          colorScheme="blue"
          size="lg"
          isExternal
        >
          Visit IconGPT Preview
        </Button>
      </VStack>
    </Container>
  );
}
export const Route = createFileRoute('/_layout/ai/icongpt')({
  component: IconGPT,
});