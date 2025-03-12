import { jsxs as _jsxs, jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import { AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Button, } from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { useForm } from "react-hook-form";
import { ItemsService, UsersService } from "../../client";
import useCustomToast from "../../hooks/useCustomToast";
const Delete = ({ type, id, isOpen, onClose }) => {
    const queryClient = useQueryClient();
    const showToast = useCustomToast();
    const cancelRef = React.useRef(null);
    const { handleSubmit, formState: { isSubmitting }, } = useForm();
    const deleteEntity = async (id) => {
        if (type === "Item") {
            await ItemsService.deleteItem({ id: id });
        }
        else if (type === "User") {
            await UsersService.deleteUser({ userId: id });
        }
        else {
            throw new Error(`Unexpected type: ${type}`);
        }
    };
    const mutation = useMutation({
        mutationFn: deleteEntity,
        onSuccess: () => {
            showToast("Success", `The ${type.toLowerCase()} was deleted successfully.`, "success");
            onClose();
        },
        onError: () => {
            showToast("An error occurred.", `An error occurred while deleting the ${type.toLowerCase()}.`, "error");
        },
        onSettled: () => {
            queryClient.invalidateQueries({
                queryKey: [type === "Item" ? "items" : "users"],
            });
        },
    });
    const onSubmit = async () => {
        mutation.mutate(id);
    };
    return (_jsx(_Fragment, { children: _jsx(AlertDialog, { isOpen: isOpen, onClose: onClose, leastDestructiveRef: cancelRef, size: { base: "sm", md: "md" }, isCentered: true, children: _jsx(AlertDialogOverlay, { children: _jsxs(AlertDialogContent, { as: "form", onSubmit: handleSubmit(onSubmit), children: [_jsxs(AlertDialogHeader, { children: ["Delete ", type] }), _jsxs(AlertDialogBody, { children: [type === "User" && (_jsxs("span", { children: ["All items associated with this user will also be", " ", _jsx("strong", { children: "permantly deleted. " })] })), "Are you sure? You will not be able to undo this action."] }), _jsxs(AlertDialogFooter, { gap: 3, children: [_jsx(Button, { variant: "danger", type: "submit", isLoading: isSubmitting, children: "Delete" }), _jsx(Button, { ref: cancelRef, onClick: onClose, isDisabled: isSubmitting, children: "Cancel" })] })] }) }) }) }));
};
export default Delete;
