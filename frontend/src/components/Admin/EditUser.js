import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Button, Checkbox, Flex, FormControl, FormErrorMessage, FormLabel, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, } from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { UsersService, } from "../../client";
import useCustomToast from "../../hooks/useCustomToast";
import { emailPattern, handleError } from "../../utils";
const EditUser = ({ user, isOpen, onClose }) => {
    const queryClient = useQueryClient();
    const showToast = useCustomToast();
    const { register, handleSubmit, reset, getValues, formState: { errors, isSubmitting, isDirty }, } = useForm({
        mode: "onBlur",
        criteriaMode: "all",
        defaultValues: user,
    });
    const mutation = useMutation({
        mutationFn: (data) => UsersService.updateUser({ userId: user.id, requestBody: data }),
        onSuccess: () => {
            showToast("Success!", "User updated successfully.", "success");
            onClose();
        },
        onError: (err) => {
            handleError(err, showToast);
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["users"] });
        },
    });
    const onSubmit = async (data) => {
        if (data.password === "") {
            data.password = undefined;
        }
        mutation.mutate(data);
    };
    const onCancel = () => {
        reset();
        onClose();
    };
    return (_jsx(_Fragment, { children: _jsxs(Modal, { isOpen: isOpen, onClose: onClose, size: { base: "sm", md: "md" }, isCentered: true, children: [_jsx(ModalOverlay, {}), _jsxs(ModalContent, { as: "form", onSubmit: handleSubmit(onSubmit), children: [_jsx(ModalHeader, { children: "Edit User" }), _jsx(ModalCloseButton, {}), _jsxs(ModalBody, { pb: 6, children: [_jsxs(FormControl, { isInvalid: !!errors.email, children: [_jsx(FormLabel, { htmlFor: "email", children: "Email" }), _jsx(Input, { id: "email", ...register("email", {
                                                required: "Email is required",
                                                pattern: emailPattern,
                                            }), placeholder: "Email", type: "email" }), errors.email && (_jsx(FormErrorMessage, { children: errors.email.message }))] }), _jsxs(FormControl, { mt: 4, children: [_jsx(FormLabel, { htmlFor: "name", children: "Full name" }), _jsx(Input, { id: "name", ...register("full_name"), type: "text" })] }), _jsxs(FormControl, { mt: 4, isInvalid: !!errors.password, children: [_jsx(FormLabel, { htmlFor: "password", children: "Set Password" }), _jsx(Input, { id: "password", ...register("password", {
                                                minLength: {
                                                    value: 8,
                                                    message: "Password must be at least 8 characters",
                                                },
                                            }), placeholder: "Password", type: "password" }), errors.password && (_jsx(FormErrorMessage, { children: errors.password.message }))] }), _jsxs(FormControl, { mt: 4, isInvalid: !!errors.confirm_password, children: [_jsx(FormLabel, { htmlFor: "confirm_password", children: "Confirm Password" }), _jsx(Input, { id: "confirm_password", ...register("confirm_password", {
                                                validate: (value) => value === getValues().password ||
                                                    "The passwords do not match",
                                            }), placeholder: "Password", type: "password" }), errors.confirm_password && (_jsx(FormErrorMessage, { children: errors.confirm_password.message }))] }), _jsxs(Flex, { children: [_jsx(FormControl, { mt: 4, children: _jsx(Checkbox, { ...register("is_superuser"), colorScheme: "teal", children: "Is superuser?" }) }), _jsx(FormControl, { mt: 4, children: _jsx(Checkbox, { ...register("is_active"), colorScheme: "teal", children: "Is active?" }) })] })] }), _jsxs(ModalFooter, { gap: 3, children: [_jsx(Button, { variant: "primary", type: "submit", isLoading: isSubmitting, isDisabled: !isDirty, children: "Save" }), _jsx(Button, { onClick: onCancel, children: "Cancel" })] })] })] }) }));
};
export default EditUser;
