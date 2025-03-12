import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, Heading, Text, VStack, HStack, Switch, Button, Divider, } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useQueryClient, useQuery } from "@tanstack/react-query";
// Define product categories
const PRODUCTS = ["proxy", "serp", "data"];
const STORAGE_KEY = "subscriptionSettings"; // Key for localStorage
const SubscriptionManagement = () => {
    const queryClient = useQueryClient();
    // Load subscription settings with React Query
    const { data: subscriptionSettings, refetch } = useQuery({
        queryKey: ["subscriptionSettings"],
        queryFn: () => {
            const storedSettings = localStorage.getItem(STORAGE_KEY);
            return storedSettings ? JSON.parse(storedSettings) : {};
        },
        staleTime: Infinity,
    });
    // Store subscription settings locally for UI updates
    const [settings, setSettings] = useState(() => PRODUCTS.reduce((acc, product) => {
        acc[product] = subscriptionSettings?.[product] || {
            hasSubscription: false,
            isTrial: false,
            isDeactivated: false,
        };
        return acc;
    }, {}));
    // Sync React Query Data into State
    useEffect(() => {
        setSettings((prevSettings) => PRODUCTS.reduce((acc, product) => {
            acc[product] = subscriptionSettings?.[product] || prevSettings[product];
            return acc;
        }, {}));
    }, [subscriptionSettings]);
    // Update settings locally and sync with localStorage & React Query
    const updateSettings = (product, newSettings) => {
        const updatedSettings = { ...subscriptionSettings, [product]: newSettings };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedSettings));
        queryClient.setQueryData(["subscriptionSettings"], updatedSettings);
        refetch(); // Ensure UI updates reflect instantly
    };
    return (_jsxs(Box, { borderWidth: "1px", borderRadius: "lg", p: 5, w: "100%", children: [_jsx(Heading, { size: "md", mb: 4, children: "Subscription Management" }), _jsx(VStack, { align: "stretch", spacing: 6, children: PRODUCTS.map((product, index) => (_jsxs(Box, { p: 4, borderWidth: "1px", borderRadius: "md", children: [_jsxs(Heading, { size: "sm", mb: 2, children: [product, " Subscription"] }), _jsx(Divider, { my: 2 }), _jsxs(VStack, { align: "stretch", spacing: 3, children: [_jsxs(HStack, { justify: "space-between", children: [_jsx(Text, { fontWeight: "bold", children: "Subscription Active" }), _jsx(Switch, { isChecked: settings[product].hasSubscription, onChange: () => updateSettings(product, {
                                                ...settings[product],
                                                hasSubscription: !settings[product].hasSubscription,
                                            }) })] }), _jsxs(HStack, { justify: "space-between", children: [_jsx(Text, { fontWeight: "bold", children: "Trial Mode" }), _jsx(Switch, { isChecked: settings[product].isTrial, onChange: () => updateSettings(product, {
                                                ...settings[product],
                                                isTrial: !settings[product].isTrial,
                                            }) })] }), _jsxs(HStack, { justify: "space-between", children: [_jsx(Text, { fontWeight: "bold", children: "Deactivated" }), _jsx(Switch, { isChecked: settings[product].isDeactivated, onChange: () => updateSettings(product, {
                                                ...settings[product],
                                                isDeactivated: !settings[product].isDeactivated,
                                            }) })] })] }), index !== PRODUCTS.length - 1 && _jsx(Divider, { my: 4 })] }, product))) }), _jsx(Button, { mt: 6, colorScheme: "blue", w: "full", onClick: () => console.log("Updated Settings:", settings), children: "Save Changes" })] }));
};
export default SubscriptionManagement;
