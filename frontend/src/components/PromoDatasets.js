import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, Button, Text, Heading, Grid, GridItem, Flex, Icon, Badge, List, ListItem, ListIcon, Alert, AlertIcon, VStack } from "@chakra-ui/react";
import { Link, useNavigate } from '@tanstack/react-router';
import { FiCheckCircle, FiDatabase, FiTrendingUp, FiShoppingCart, FiCloud } from 'react-icons/fi';
const datasetCategories = [
    { name: "Traffic & Mobility Data", icon: FiTrendingUp, description: "Live and historical traffic insights, ride-sharing trends, and urban mobility analysis." },
    { name: "Weather & Forecasting", icon: FiCloud, description: "Detailed weather reports, climate patterns, and predictive models." },
    { name: "Business Intelligence", icon: FiDatabase, description: "Company financials, market trends, and competitor analysis." },
    { name: "Consumer & Product Data", icon: FiShoppingCart, description: "Consumer spending habits, pricing trends, and product metadata." }
];
const pricingPlans = [
    {
        name: "Explorer",
        price: "$5",
        features: ["Basic dataset access", "1,000 API requests/month", "Standard support"],
        borderColor: "blue.700",
        buttonVariant: "outline",
    },
    {
        name: "Archiver",
        price: "$100",
        features: ["Extended dataset history", "1,000 API requests/month", "Priority support"],
        borderColor: "blue.600",
        buttonVariant: "solid",
        badge: "MOST POPULAR",
    },
    {
        name: "Researcher",
        price: "$500",
        features: ["High download limits", "10,000 API requests/month", "Advanced analytics"],
        borderColor: "blue.500",
        buttonVariant: "solid",
    },
    {
        name: "Enterprise",
        price: "Custom",
        features: ["Unlimited API requests", "Dedicated account manager", "Custom integrations"],
        borderColor: "blue.400",
        buttonVariant: "outline",
    }
];
const PromoDatasets = () => {
    const navigate = useNavigate();
    return (_jsx(Box, { maxW: "100%", mx: "auto", px: { base: 6, md: 12 }, py: 10, bg: "gray.800", children: _jsxs(VStack, { spacing: 6, align: "stretch", children: [_jsxs(Alert, { status: "info", borderRadius: "md", bg: "gray.700", color: "gray.300", children: [_jsx(AlertIcon, { color: "blue.500" }), _jsx(Text, { fontSize: "sm", children: "All datasets are optimized for high-speed querying and secure data access." })] }), _jsx(Box, { w: "100%", py: 6, bg: "gray.700", borderRadius: "md", boxShadow: "lg", px: 6, children: _jsxs(Grid, { templateColumns: { base: "1fr", md: "1fr 1fr" }, gap: 6, alignItems: "center", children: [_jsxs(Box, { children: [_jsx(Heading, { as: "h1", size: "lg", fontWeight: "bold", color: "gray.100", children: "Unlock Datasets" }), _jsx(Text, { fontSize: "sm", color: "gray.400", mt: 1, children: "Customize and filter data to fit your exact requirements. Our flexible API delivers structured data, empowering you to make informed decisions." })] }), _jsxs(Box, { bg: "blue.800", color: "gray.300", borderRadius: "md", p: 5, boxShadow: "lg", textAlign: "left", display: "flex", flexDirection: "column", justifyContent: "center", children: [_jsx(Heading, { as: "h2", size: "md", fontWeight: "light", color: "gray.100", children: "Start Your Free Trial Today!" }), _jsx(Text, { fontSize: "xs", my: 2, color: "gray.300", children: "Get full access to our datasets with a 7-day free trial. No credit card required!" }), _jsx(Link, { to: "/proxies/pricing", children: _jsx(Button, { bg: "blue.600", color: "gray.100", _hover: { bg: "blue.500" }, variant: "solid", children: "Sign Up for Free" }) })] })] }) }), _jsxs(Box, { bg: "gray.700", py: 10, px: 6, borderRadius: "md", boxShadow: "lg", children: [_jsx(Grid, { templateColumns: { base: "1fr", md: "repeat(2, 1fr)" }, gap: 6, mt: 6, children: datasetCategories.map((dataset, index) => (_jsxs(GridItem, { p: 5, borderRadius: "lg", boxShadow: "md", _hover: { boxShadow: "lg" }, bg: "gray.600", children: [_jsxs(Flex, { align: "center", mb: 3, children: [_jsx(Icon, { as: dataset.icon, boxSize: 6, color: "blue.400", mr: 3 }), _jsx(Text, { fontSize: "md", fontWeight: "semibold", color: "gray.200", children: dataset.name })] }), _jsx(Text, { fontSize: "sm", color: "gray.400", children: dataset.description })] }, index))) }), _jsx(Grid, { templateColumns: { base: "1fr", md: "repeat(4, 1fr)" }, gap: 6, mt: 10, children: pricingPlans.map((plan, index) => (_jsxs(Box, { position: "relative", children: [plan.badge && (_jsx(Badge, { bg: "blue.600", color: "white", px: 3, py: 1, position: "absolute", top: "-12px", left: "10px", children: plan.badge })), _jsxs(Box, { p: 6, border: "2px solid", borderColor: plan.borderColor, borderRadius: "lg", textAlign: "left", bg: "gray.700", children: [_jsx(Heading, { as: "h3", size: "sm", fontWeight: "semibold", mb: 2, color: "gray.200", children: plan.name }), _jsx(List, { spacing: 2, mb: 6, children: plan.features.map((feature, idx) => (_jsxs(ListItem, { display: "flex", alignItems: "center", children: [_jsx(ListIcon, { as: FiCheckCircle, color: "blue.500", boxSize: 5 }), _jsx(Text, { fontSize: "sm", color: "gray.300", children: feature })] }, idx))) }), _jsx(Link, { to: "/proxies/pricing", style: { width: "100%" }, children: _jsx(Button, { w: "full", bg: "blue.600", color: "white", _hover: { bg: "blue.500" }, size: "sm", variant: plan.buttonVariant, children: plan.price === "Custom" ? "Contact Us" : `Choose ${plan.name}` }) })] })] }, index))) })] })] }) }));
};
export default PromoDatasets;
