import {
    Button,
    Container,
    FormControl,
    FormErrorMessage,
    FormLabel,
    Heading,
    Input,
    Text,
  } from "@chakra-ui/react"
  import { useMutation } from "@tanstack/react-query"
  import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router"
  import { type SubmitHandler, useForm } from "react-hook-form"
  
  import { type ApiError } from "../client"
  import { isLoggedIn } from "../hooks/useAuth"
  import useCustomToast from "../hooks/useCustomToast"
  import { confirmPasswordRules, handleError, passwordRules } from "../utils"
  
  // Define the route for /activate
  export const Route = createFileRoute('/activate')({
    component: ActivateAccount,
    beforeLoad: async () => {
      if (isLoggedIn()) {
        throw redirect({
          to: "/",
        })
      }
    },
  })
  
  interface NewPasswordForm {
    new_password: string
    confirm_password: string
  }
  
  async function activateAccount(data: { new_password: string; token: string }) {
    const apiUrl = `${import.meta.env.VITE_API_URL}/v2/activate`
    const requestOptions = {
      method: "POST",
      url: apiUrl,
      headers: {
        "Content-Type": "application/json",
      },
    }
  
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: requestOptions.headers,
      body: JSON.stringify({
        token: data.token,
        new_password: data.new_password,
      }),
    })
  
    if (!response.ok) {
      const errorData = await response.json()
      const error: ApiError = {
        url: apiUrl,
        status: response.status,
        statusText: response.statusText,
        body: errorData,
        request: requestOptions,
        message: errorData.detail || "Failed to activate account",
      }
      throw error
    }
  
    return response.json()
  }
  
  function ActivateAccount() {
    const {
      register,
      handleSubmit,
      getValues,
      reset,
      formState: { errors },
    } = useForm<NewPasswordForm>({
      mode: "onBlur",
      criteriaMode: "all",
      defaultValues: {
        new_password: "",
        confirm_password: "",
      },
    })
    const showToast = useCustomToast()
    const navigate = useNavigate()
  
    const mutation = useMutation<{ message: string }, ApiError, { new_password: string; token: string }>({
      mutationFn: activateAccount,
      onSuccess: () => {
        showToast("Success!", "Account activated successfully.", "success")
        reset()
        navigate({ to: "/login" })
      },
      onError: (err: ApiError) => {
        handleError(err, showToast)
      },
    })
  
    const onSubmit: SubmitHandler<NewPasswordForm> = async (data) => {
      const token = new URLSearchParams(window.location.search).get("token")
      if (!token) {
        showToast("Error", "Activation token is missing.", "error")
        return
      }
      mutation.mutate({ new_password: data.new_password, token })
    }
  
    return (
      <Container
        as="form"
        onSubmit={handleSubmit(onSubmit)}
        h="100vh"
        maxW="sm"
        alignItems="stretch"
        justifyContent="center"
        gap={4}
        centerContent
      >
        <Heading size="xl" color="ui.main" textAlign="center" mb={2}>
          Activate Account
        </Heading>
        <Text textAlign="center">
          Please enter your new password and confirm it to activate your account.
        </Text>
        <FormControl mt={4} isInvalid={!!errors.new_password}>
          <FormLabel htmlFor="password">Set Password</FormLabel>
          <Input
            id="password"
            {...register("new_password", passwordRules())}
            placeholder="Password"
            type="password"
          />
          {errors.new_password && (
            <FormErrorMessage>{errors.new_password.message}</FormErrorMessage>
          )}
        </FormControl>
        <FormControl mt={4} isInvalid={!!errors.confirm_password}>
          <FormLabel htmlFor="confirm_password">Confirm Password</FormLabel>
          <Input
            id="confirm_password"
            {...register("confirm_password", confirmPasswordRules(getValues))}
            placeholder="Confirm Password"
            type="password"
          />
          {errors.confirm_password && (
            <FormErrorMessage>{errors.confirm_password.message}</FormErrorMessage>
          )}
        </FormControl>
        <Button variant="primary" type="submit">
          Activate Account
        </Button>
      </Container>
    )
  }