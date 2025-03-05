// src/components/ProxyUsage.tsx
import { Box, Text } from "@chakra-ui/react";

interface Request {
  id: string;
  url: string;
  status: string;
}

const ProxyUsage = (): JSX.Element => {
  const requests: Request[] = [
    { id: "1", url: "http://example.com", status: "active" },
    // ... more mock data
  ];

  return (
    <Box>
      {requests.map((request: Request, index: number) => (
        <Text key={request.id}>
          {index + 1}. {request.url} - {request.status}
        </Text>
      ))}
    </Box>
  );
};

export default ProxyUsage;