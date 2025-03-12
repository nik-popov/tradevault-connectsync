import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// PaymentForm.tsx
import { useState } from "react";
import { Button, FormControl, FormLabel, useToast, } from "@chakra-ui/react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
const PaymentForm = () => {
    const stripe = useStripe();
    const elements = useElements();
    const toast = useToast();
    const [loading, setLoading] = useState(false);
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!stripe || !elements)
            return;
        setLoading(true);
        const cardElement = elements.getElement(CardElement);
        if (!cardElement) {
            setLoading(false);
            return;
        }
        const { error, paymentMethod: _paymentMethod } = await stripe.createPaymentMethod({
            type: "card",
            card: cardElement,
        });
        if (error) {
            toast({
                title: "Billing Update Error",
                description: error.message,
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        }
        else {
            toast({
                title: "Billing Updated",
                description: "Your billing information has been updated.",
                status: "success",
                duration: 5000,
                isClosable: true,
            });
        }
        setLoading(false);
    };
    return (_jsxs("form", { onSubmit: handleSubmit, children: [_jsxs(FormControl, { mb: 4, children: [_jsx(FormLabel, { children: "Card Details" }), _jsx("div", { style: { border: "1px solid #ccc", borderRadius: "4px", padding: "8px" }, children: _jsx("div", { style: { minHeight: '28px' }, children: _jsx(CardElement, { options: { hidePostalCode: true, style: { base: { fontSize: '16px', lineHeight: '24px', padding: '10px', '::placeholder': { color: '#aab7c4' } } } } }) }) })] }), _jsx(Button, { type: "submit", colorScheme: "blue", isLoading: loading, disabled: !stripe, children: "Update Billing" })] }));
};
export default PaymentForm;
