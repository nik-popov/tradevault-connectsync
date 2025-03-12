import { jsx as _jsx } from "react/jsx-runtime";
import { Box } from "@chakra-ui/react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import PaymentForm from "./PaymentForm"; // new componen
// IMPORTANT: Use your publishable key here (starts with pk_)
const stripePromise = loadStripe('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');
const Billing = () => {
    return (_jsx(Elements, { stripe: stripePromise, children: _jsx(Box, { p: 4, borderWidth: "1px", borderRadius: "md", children: _jsx(PaymentForm, {}) }) }));
};
export default Billing;
