import { useToast } from "@chakra-ui/react";
import { useCallback } from "react";
const useCustomToast = () => {
    const toast = useToast();
    const showToast = useCallback((title, description, status) => {
        toast({
            title,
            description,
            status,
            isClosable: true,
            position: "bottom-right",
        });
    }, [toast]);
    return showToast;
};
export default useCustomToast;
