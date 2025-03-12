import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/components/ProxySettings.tsx
import { Button, Container, Input } from "@chakra-ui/react";
import { useState } from "react";
const ProxySettings = () => {
    const [proxyHost, setProxyHost] = useState("");
    const [proxyPort, setProxyPort] = useState("");
    const [testResult, setTestResult] = useState(null);
    const handleTestConnection = () => {
        setTestResult("Testing connection... (mock result: Success)");
        console.log(proxyPort); // Use setProxyPort's state to avoid TS6133
    };
    return (_jsxs(Container, { maxW: "full", children: [_jsx(Input, { placeholder: "Proxy Host", value: proxyHost, onChange: (e) => setProxyHost(e.target.value), mb: 4 }), _jsx(Input, { placeholder: "Proxy Port", value: proxyPort, onChange: (e) => setProxyPort(e.target.value), mb: 4 }), _jsx(Button, { onClick: handleTestConnection, children: "Test Connection" }), testResult && _jsx("p", { children: testResult })] }));
};
export default ProxySettings;
