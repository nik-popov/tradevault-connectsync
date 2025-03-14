// src/hooks/useCustomToast.js
import { useToast } from "@chakra-ui/react";
import { useCallback } from "react";

const useCustomToast = () => {
  const toast = useToast();

  const showToast = useCallback(
    (title, description, status) => {
      toast({
        title,
        description,
        status,
        isClosable: true,
        position: "top", // Changed to top for consistency with your form
        duration: 4000,
        containerStyle: {
          background: "white", // Bright white
          color: "gray.900", // Dark text
          borderRadius: "md",
          boxShadow: "lg",
          padding: "16px",
          minWidth: "300px",
          maxWidth: "90%",
        },
      });
    },
    [toast]
  );

  return showToast;
};

export default useCustomToast;