import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Button, FormControl, FormErrorMessage, FormLabel, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, } from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { ItemsService, } from "../../client";
import useCustomToast from "../../hooks/useCustomToast";
import { handleError } from "../../utils";
const EditItem = ({ item, isOpen, onClose }) => {
    const queryClient = useQueryClient();
    const showToast = useCustomToast();
    const { register, handleSubmit, reset, formState: { isSubmitting, errors, isDirty }, } = useForm({
        mode: "onBlur",
        criteriaMode: "all",
        defaultValues: item,
    });
    const mutation = useMutation({
        mutationFn: (data) => ItemsService.updateItem({ id: item.id, requestBody: data }),
        onSuccess: () => {
            showToast("Success!", "Item updated successfully.", "success");
            onClose();
        },
        onError: (err) => {
            handleError(err, showToast);
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["items"] });
        },
    });
    const onSubmit = async (data) => {
        mutation.mutate(data);
    };
    const onCancel = () => {
        reset();
        onClose();
    };
    return (_jsx(_Fragment, { children: _jsxs(Modal, { isOpen: isOpen, onClose: onClose, size: { base: "sm", md: "md" }, isCentered: true, children: [_jsx(ModalOverlay, {}), _jsxs(ModalContent, { as: "form", onSubmit: handleSubmit(onSubmit), children: [_jsx(ModalHeader, { children: "Edit Item" }), _jsx(ModalCloseButton, {}), _jsxs(ModalBody, { pb: 6, children: [_jsxs(FormControl, { isInvalid: !!errors.title, children: [_jsx(FormLabel, { htmlFor: "title", children: "Title" }), _jsx(Input, { id: "title", ...register("title", {
                                                required: "Title is required",
                                            }), type: "text" }), errors.title && (_jsx(FormErrorMessage, { children: errors.title.message }))] }), _jsxs(FormControl, { mt: 4, children: [_jsx(FormLabel, { htmlFor: "description", children: "Description" }), _jsx(Input, { id: "description", ...register("description"), placeholder: "Description", type: "text" })] })] }), _jsxs(ModalFooter, { gap: 3, children: [_jsx(Button, { variant: "primary", type: "submit", isLoading: isSubmitting, isDisabled: !isDirty, children: "Save" }), _jsx(Button, { onClick: onCancel, children: "Cancel" })] })] })] }) }));
};
export default EditItem;
