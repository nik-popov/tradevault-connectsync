import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Box, Text, Flex, Button, Input, Table, Thead, Tbody, Tr, Th, Td, Tooltip, IconButton, } from "@chakra-ui/react";
import { CopyIcon, DeleteIcon } from "@chakra-ui/icons";
const mockApiKeys = [
    { id: "1", key: "sk-xxxx-xxxx-xxxx-1234", createdAt: "2023-01-15T10:00:00Z" },
    { id: "2", key: "sk-yyyy-yyyy-yyyy-5678", createdAt: "2023-02-20T14:30:00Z" },
];
const ApiKeyGSerp = () => {
    const [apiKeys, setApiKeys] = useState(mockApiKeys);
    const [newKeyName, setNewKeyName] = useState("");
    const generateKey = () => {
        if (newKeyName) {
            const newKey = {
                id: `${apiKeys.length + 1}`,
                key: `sk-${Math.random().toString(36).substring(2, 15)}`,
                createdAt: new Date().toISOString(),
            };
            setApiKeys([...apiKeys, newKey]);
            setNewKeyName("");
        }
    };
    const deleteKey = (id) => {
        setApiKeys(apiKeys.filter((key) => key.id !== id));
    };
    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
    };
    return (_jsxs(Box, { p: 4, width: "100%", children: [_jsx(Flex, { justify: "space-between", align: "center", mb: 4, children: _jsx(Text, { fontSize: "lg", fontWeight: "bold", children: "API Key Management" }) }), _jsxs(Flex, { direction: "column", gap: 6, children: [_jsxs(Box, { children: [_jsx(Text, { fontSize: "md", fontWeight: "semibold", mb: 2, children: "Generate New API Key" }), _jsxs(Flex, { gap: 4, alignItems: "center", children: [_jsx(Input, { value: newKeyName, onChange: (e) => setNewKeyName(e.target.value), placeholder: "Enter key name (optional)", size: "sm", width: "300px" }), _jsx(Tooltip, { label: "Generate a new API key", children: _jsx(Button, { size: "sm", colorScheme: "blue", onClick: generateKey, children: "Generate" }) })] })] }), _jsxs(Box, { children: [_jsx(Text, { fontSize: "md", fontWeight: "semibold", mb: 2, children: "Existing API Keys" }), _jsx(Box, { shadow: "md", borderWidth: "1px", borderRadius: "md", overflowX: "auto", children: _jsxs(Table, { variant: "simple", size: "sm", children: [_jsx(Thead, { children: _jsxs(Tr, { children: [_jsx(Th, { children: "ID" }), _jsx(Th, { children: "Key" }), _jsx(Th, { children: "Created At" }), _jsx(Th, { children: "Actions" })] }) }), _jsx(Tbody, { children: apiKeys.map((key) => (_jsxs(Tr, { children: [_jsx(Td, { children: key.id }), _jsx(Td, { children: key.key }), _jsx(Td, { children: new Date(key.createdAt).toLocaleString() }), _jsx(Td, { children: _jsxs(Flex, { gap: 2, children: [_jsx(Tooltip, { label: "Copy API key", children: _jsx(IconButton, { "aria-label": "Copy key", icon: _jsx(CopyIcon, {}), size: "sm", onClick: () => copyToClipboard(key.key) }) }), _jsx(Tooltip, { label: "Delete API key", children: _jsx(IconButton, { "aria-label": "Delete key", icon: _jsx(DeleteIcon, {}), size: "sm", colorScheme: "red", onClick: () => deleteKey(key.id) }) })] }) })] }, key.id))) })] }) })] })] })] }));
};
export default ApiKeyGSerp;
