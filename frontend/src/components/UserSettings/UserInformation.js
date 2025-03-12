import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Box, Button, Container, Flex, FormControl, FormErrorMessage, FormLabel, Heading, Input, Text, useColorModeValue, } from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { UsersService, } from "../../client";
import useAuth from "../../hooks/useAuth";
import useCustomToast from "../../hooks/useCustomToast";
import { emailPattern, handleError } from "../../utils";
const UserInformation = () => {
    const queryClient = useQueryClient();
    const color = useColorModeValue("inherit", "ui.light");
    const showToast = useCustomToast();
    const [editMode, setEditMode] = useState(false);
    const { user: currentUser } = useAuth();
    const { register, handleSubmit, reset, getValues, formState: { isSubmitting, errors, isDirty }, } = useForm({
        mode: "onBlur",
        criteriaMode: "all",
        defaultValues: {
            full_name: currentUser?.full_name,
            email: currentUser?.email,
        },
    });
    const toggleEditMode = () => {
        setEditMode(!editMode);
    };
    const mutation = useMutation({
        mutationFn: (data) => UsersService.updateUserMe({ requestBody: data }),
        onSuccess: () => {
            showToast("Success!", "User updated successfully.", "success");
        },
        onError: (err) => {
            handleError(err, showToast);
        },
        onSettled: () => {
            queryClient.invalidateQueries();
        },
    });
    const onSubmit = async (data) => {
        mutation.mutate(data);
    };
    const onCancel = () => {
        reset();
        toggleEditMode();
    };
    return (_jsx(_Fragment, { children: _jsxs(Container, { maxW: "full", children: [_jsx(Heading, { size: "sm", py: 4, children: "User Information" }), _jsxs(Box, { w: { sm: "full", md: "50%" }, as: "form", onSubmit: handleSubmit(onSubmit), children: [_jsxs(FormControl, { children: [_jsx(FormLabel, { color: color, htmlFor: "name", children: "Full name" }), editMode ? (_jsx(Input, { id: "name", ...register("full_name", { maxLength: 30 }), type: "text", size: "md", w: "auto" })) : (_jsx(Text, { size: "md", py: 2, color: !currentUser?.full_name ? "ui.dim" : "inherit", isTruncated: true, maxWidth: "250px", children: currentUser?.full_name || "N/A" }))] }), _jsxs(FormControl, { mt: 4, isInvalid: !!errors.email, children: [_jsx(FormLabel, { color: color, htmlFor: "email", children: "Email" }), editMode ? (_jsx(Input, { id: "email", ...register("email", {
                                        required: "Email is required",
                                        pattern: emailPattern,
                                    }), type: "email", size: "md", w: "auto" })) : (_jsx(Text, { size: "md", py: 2, isTruncated: true, maxWidth: "250px", children: currentUser?.email })), errors.email && (_jsx(FormErrorMessage, { children: errors.email.message }))] }), _jsxs(Flex, { mt: 4, gap: 3, children: [_jsx(Button, { variant: "primary", onClick: toggleEditMode, type: editMode ? "button" : "submit", isLoading: editMode ? isSubmitting : false, isDisabled: editMode ? !isDirty || !getValues("email") : false, children: editMode ? "Save" : "Edit" }), editMode && (_jsx(Button, { onClick: onCancel, isDisabled: isSubmitting, children: "Cancel" }))] })] })] }) }));
};
export default UserInformation;
