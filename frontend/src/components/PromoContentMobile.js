import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, Button, Text, Heading, Grid, GridItem, Flex, Icon, Badge, List, ListItem, ListIcon, Alert, AlertIcon, } from "@chakra-ui/react";
import { useNavigate } from '@tanstack/react-router';
import { FiCheckCircle, FiGlobe, FiZap, FiShield } from 'react-icons/fi';
const PromoContent = () => {
    const navigate = useNavigate();
    const features = [
        { icon: FiGlobe, title: "Global Coverage", description: "Access to residential IPs from 195+ locations worldwide." },
        { icon: FiZap, title: "Lightning Fast", description: "Industry-leading connection speeds with 99.9% uptime." },
        { icon: FiShield, title: "Secure & Private", description: "Enterprise-grade security with IP rotation and authentication." }
    ];
    const pricingPlans = [
        {
            name: "Starter",
            price: "$99",
            traffic: "100GB/month",
            features: ["1 concurrent connection", "Basic support", "Shared IP pool"],
            borderColor: "gray.300",
            buttonVariant: "outline",
        },
        {
            name: "Business",
            price: "$499",
            traffic: "1TB/month",
            features: ["10 concurrent connections", "Priority support", "Dedicated IP options"],
            borderColor: "blue.400",
            buttonVariant: "solid",
            badge: "MOST POPULAR",
        },
        {
            name: "Business Plus+",
            price: "$2,999",
            traffic: "Unlimited",
            features: ["Unlimited concurrent connections", "Dedicated support", "Custom IP pools", "24/7 SLA"],
            borderColor: "purple.400",
            buttonVariant: "solid",
        },
        {
            name: "Ultra Enterprise",
            price: "Custom",
            traffic: "Unlimited + Dedicated Resources",
            features: ["Dedicated proxies", "Custom traffic limits", "Private network setup"],
            borderColor: "gray.600",
            buttonVariant: "outline",
        }
    ];
    return (_jsx(Box, { w: "full", px: { base: 4, md: 8 }, py: 8, children: _jsxs(Box, { maxW: "5xl", mx: "auto", textAlign: "center", children: [_jsx(Heading, { as: "h1", size: "xl", fontWeight: "bold", mb: 4, children: "Unlock Premium Mobile Proxies" }), _jsx(Text, { fontSize: "lg", color: "gray.600", mb: 12, children: "Get instant access to our global network of residential IPs with unlimited bandwidth." }), _jsxs(Box, { bg: "blue.500", color: "white", borderRadius: "lg", py: 4, px: 6, mb: 6, boxShadow: "md", children: [_jsx(Heading, { as: "h2", size: "lg", fontWeight: "bold", mb: 2, children: "Start Your Free Trial Today!" }), _jsx(Text, { fontSize: "md", mb: 3, children: "Experience unlimited access to all features for 7 days. No credit card required!" }), _jsx(Button, { colorScheme: "whiteAlpha", variant: "solid", onClick: () => navigate({ to: '/signup' }), children: "Sign Up for Free" })] }), _jsx(Grid, { templateColumns: { base: "1fr", md: "repeat(3, 1fr)" }, gap: 6, mb: 12, children: features.map((feature, index) => (_jsxs(GridItem, { p: 6, border: "1px solid", borderColor: "gray.200", borderRadius: "lg", boxShadow: "sm", _hover: { boxShadow: "md" }, children: [_jsx(Flex, { justify: "center", mb: 4, children: _jsx(Icon, { as: feature.icon, boxSize: 10, color: "blue.500" }) }), _jsx(Text, { fontSize: "lg", fontWeight: "semibold", children: feature.title }), _jsx(Text, { color: "gray.600", children: feature.description })] }, index))) }), _jsx(Grid, { templateColumns: { base: "1fr", md: "repeat(4, 1fr)" }, gap: 6, children: pricingPlans.map((plan, index) => (_jsxs(Box, { position: "relative", children: [plan.badge && (_jsx(Badge, { colorScheme: "blue", variant: "solid", px: 3, py: 1, position: "absolute", top: "-12px", left: "50%", transform: "translateX(-50%)", zIndex: "1", children: plan.badge })), _jsxs(Box, { p: 6, border: "2px solid", borderColor: plan.borderColor, borderRadius: "lg", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-between", minH: "400px", children: [_jsx(Heading, { as: "h3", size: "md", fontWeight: "semibold", mb: 2, minH: "48px", children: plan.name }), _jsx(List, { spacing: 3, textAlign: "left", mb: 6, px: 4, children: plan.features.map((feature, idx) => (_jsxs(ListItem, { display: "flex", alignItems: "center", children: [_jsx(ListIcon, { as: FiCheckCircle, color: "blue.500", boxSize: 5 }), feature] }, idx))) }), _jsxs(Box, { minH: "60px", display: "flex", alignItems: "center", justifyContent: "center", children: [_jsx(Text, { fontSize: "2xl", fontWeight: "bold", children: plan.price === "Custom" ? "Contact Us" : plan.price }), plan.price !== "Custom" && (_jsx(Text, { as: "span", fontSize: "lg", color: "gray.500", children: "/mo" }))] }), _jsx(Button, { w: "full", colorScheme: "blue", size: "md", variant: plan.buttonVariant, onClick: () => navigate({ to: '/proxies/pricing' }), children: plan.price === "Custom" ? "Contact Us" : `Choose ${plan.name}` })] })] }, index))) }), _jsxs(Alert, { status: "success", borderRadius: "md", mt: 6, children: [_jsx(AlertIcon, {}), _jsx(Text, { children: "All proxy requests are securely encrypted and optimized for maximum speed." })] })] }) }));
};
export default PromoContent;
