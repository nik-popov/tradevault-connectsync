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
      });
    },
    [toast]
  );

  return showToast;
};

export default useCustomToast;