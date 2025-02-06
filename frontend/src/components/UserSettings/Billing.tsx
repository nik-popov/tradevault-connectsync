import React from "react";
import { Box } from "@chakra-ui/react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import PaymentForm from "./PaymentForm"; // new componen


// IMPORTANT: Use your publishable key here (starts with pk_)
const stripePromise = loadStripe('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');

const Billing: React.FC = () => {
    return (
      <Elements stripe={stripePromise}>
        <Box p={4} borderWidth="1px" borderRadius="md">
          <PaymentForm />
        </Box>
      </Elements>
    );
  };
  
export default Billing;