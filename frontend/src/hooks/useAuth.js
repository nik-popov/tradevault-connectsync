import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { AxiosError } from "axios";
import { LoginService, UsersService, } from "../client";
import useCustomToast from "./useCustomToast";
const isLoggedIn = () => {
    return localStorage.getItem("access_token") !== null;
};
const useAuth = () => {
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const showToast = useCustomToast();
    const queryClient = useQueryClient();
    const { data: user, isLoading } = useQuery({
        queryKey: ["currentUser"],
        queryFn: UsersService.readUserMe,
        enabled: isLoggedIn(),
    });
    const signUpMutation = useMutation({
        mutationFn: (data) => UsersService.registerUser({ requestBody: data }),
        onSuccess: () => {
            navigate({ to: "/login" });
            showToast("Account created.", "Your account has been created successfully.", "success");
        },
        onError: (err) => {
            let errDetail = err.body?.detail;
            if (err instanceof AxiosError) {
                errDetail = err.message;
            }
            showToast("Something went wrong.", errDetail, "error");
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["users"] });
        },
    });
    const login = async (data) => {
        const response = await LoginService.loginAccessToken({
            formData: data,
        });
        localStorage.setItem("access_token", response.access_token);
    };
    const loginMutation = useMutation({
        mutationFn: login,
        onSuccess: () => {
            navigate({ to: "/" });
        },
        onError: (err) => {
            let errDetail = err.body?.detail;
            if (err instanceof AxiosError) {
                errDetail = err.message;
            }
            if (Array.isArray(errDetail)) {
                errDetail = "Something went wrong";
            }
            setError(errDetail);
        },
    });
    const logout = () => {
        localStorage.removeItem("access_token");
        navigate({ to: "/login" });
    };
    return {
        signUpMutation,
        loginMutation,
        logout,
        user,
        isLoading,
        error,
        resetError: () => setError(null),
    };
};
export { isLoggedIn };
export default useAuth;
