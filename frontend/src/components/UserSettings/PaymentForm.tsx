// PaymentForm.tsx
import React, { useState } from "react";
import {
  Button,
  FormControl,
  FormLabel,
  useToast,
} from "@chakra-ui/react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

const PaymentForm: React.FC = () => {
  const stripe = useStripe();
  const elements = useElements();
  const toast = useToast();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      setLoading(false);
      return;
    }
    
    const { error, paymentMethod } = await stripe.createPaymentMethod({
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
    } else {
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

  return (
    <form onSubmit={handleSubmit}>
      <FormControl mb={4}>
        <FormLabel>Card Details</FormLabel>
        <div style={{ border: "1px solid #ccc", borderRadius: "4px", padding: "8px" }}>
        <div style={{ minHeight: '28px' }}>
  <CardElement options={{ hidePostalCode: true, style: { base: { fontSize: '16px', lineHeight: '24px', padding: '10px', '::placeholder': { color: '#aab7c4' } } } }} />
</div>


        </div>
      </FormControl>
      <Button type="submit" colorScheme="blue" isLoading={loading} disabled={!stripe}>
        Update Billing
      </Button>
    </form>
  );
};

export default PaymentForm;
