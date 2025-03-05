// src/components/ProxySettings.tsx
import { Button, Container, Input } from "@chakra-ui/react";
import { useState } from "react";

const ProxySettings = (): JSX.Element => {
  const [proxyHost, setProxyHost] = useState<string>("");
  const [proxyPort, setProxyPort] = useState<string>("");
  const [testResult, setTestResult] = useState<string | null>(null);

  const handleTestConnection = (): void => {
    setTestResult("Testing connection... (mock result: Success)");
    console.log(proxyPort); // Use setProxyPort's state to avoid TS6133
  };

  return (
    <Container maxW="full">
      <Input
        placeholder="Proxy Host"
        value={proxyHost}
        onChange={(e) => setProxyHost(e.target.value)}
        mb={4}
      />
      <Input
        placeholder="Proxy Port"
        value={proxyPort}
        onChange={(e) => setProxyPort(e.target.value)}
        mb={4}
      />
      <Button onClick={handleTestConnection}>Test Connection</Button>
      {testResult && <p>{testResult}</p>}
    </Container>
  );
};

export default ProxySettings;