import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Box, Button, Container, FormControl, FormErrorMessage, FormLabel, Heading, Input, useColorModeValue, } from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { UsersService } from "../../client";
import useCustomToast from "../../hooks/useCustomToast";
import { confirmPasswordRules, handleError, passwordRules } from "../../utils";
const ChangePassword = () => {
    const color = useColorModeValue("inherit", "ui.light");
    const showToast = useCustomToast();
    const { register, handleSubmit, reset, getValues, formState: { errors, isSubmitting }, } = useForm({
        mode: "onBlur",
        criteriaMode: "all",
    });
    const mutation = useMutation({
        mutationFn: (data) => UsersService.updatePasswordMe({ requestBody: data }),
        onSuccess: () => {
            showToast("Success!", "Password updated successfully.", "success");
            reset();
        },
        onError: (err) => {
            handleError(err, showToast);
        },
    });
    const onSubmit = async (data) => {
        mutation.mutate(data);
    };
    return (_jsx(_Fragment, { children: _jsxs(Container, { maxW: "full", children: [_jsx(Heading, { size: "sm", py: 4, children: "Change Password" }), _jsxs(Box, { w: { sm: "full", md: "50%" }, as: "form", onSubmit: handleSubmit(onSubmit), children: [_jsxs(FormControl, { isRequired: true, isInvalid: !!errors.current_password, children: [_jsx(FormLabel, { color: color, htmlFor: "current_password", children: "Current Password" }), _jsx(Input, { id: "current_password", ...register("current_password"), placeholder: "Password", type: "password", w: "auto" }), errors.current_password && (_jsx(FormErrorMessage, { children: errors.current_password.message }))] }), _jsxs(FormControl, { mt: 4, isRequired: true, isInvalid: !!errors.new_password, children: [_jsx(FormLabel, { htmlFor: "password", children: "Set Password" }), _jsx(Input, { id: "password", ...register("new_password", passwordRules()), placeholder: "Password", type: "password", w: "auto" }), errors.new_password && (_jsx(FormErrorMessage, { children: errors.new_password.message }))] }), _jsxs(FormControl, { mt: 4, isRequired: true, isInvalid: !!errors.confirm_password, children: [_jsx(FormLabel, { htmlFor: "confirm_password", children: "Confirm Password" }), _jsx(Input, { id: "confirm_password", ...register("confirm_password", confirmPasswordRules(getValues)), placeholder: "Password", type: "password", w: "auto" }), errors.confirm_password && (_jsx(FormErrorMessage, { children: errors.confirm_password.message }))] }), _jsx(Button, { variant: "primary", mt: 4, type: "submit", isLoading: isSubmitting, children: "Save" })] })] }) }));
};
export default ChangePassword;
