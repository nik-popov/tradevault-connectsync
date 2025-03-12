import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Button, } from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { useForm } from "react-hook-form";
import { UsersService } from "../../client";
import useAuth from "../../hooks/useAuth";
import useCustomToast from "../../hooks/useCustomToast";
import { handleError } from "../../utils";
const DeleteConfirmation = ({ isOpen, onClose }) => {
    const queryClient = useQueryClient();
    const showToast = useCustomToast();
    const cancelRef = React.useRef(null);
    const { handleSubmit, formState: { isSubmitting }, } = useForm();
    const { logout } = useAuth();
    const mutation = useMutation({
        mutationFn: () => UsersService.deleteUserMe(),
        onSuccess: () => {
            showToast("Success", "Your account has been successfully deleted.", "success");
            logout();
            onClose();
        },
        onError: (err) => {
            handleError(err, showToast);
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["currentUser"] });
        },
    });
    const onSubmit = async () => {
        mutation.mutate();
    };
    return (_jsx(_Fragment, { children: _jsx(AlertDialog, { isOpen: isOpen, onClose: onClose, leastDestructiveRef: cancelRef, size: { base: "sm", md: "md" }, isCentered: true, children: _jsx(AlertDialogOverlay, { children: _jsxs(AlertDialogContent, { as: "form", onSubmit: handleSubmit(onSubmit), children: [_jsx(AlertDialogHeader, { children: "Confirmation Required" }), _jsxs(AlertDialogBody, { children: ["All your account data will be", " ", _jsx("strong", { children: "permanently deleted." }), " If you are sure, please click ", _jsx("strong", { children: "\"Confirm\"" }), " to proceed. This action cannot be undone."] }), _jsxs(AlertDialogFooter, { gap: 3, children: [_jsx(Button, { variant: "danger", type: "submit", isLoading: isSubmitting, children: "Confirm" }), _jsx(Button, { ref: cancelRef, onClick: onClose, isDisabled: isSubmitting, children: "Cancel" })] })] }) }) }) }));
};
export default DeleteConfirmation;
