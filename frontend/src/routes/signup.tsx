import {
  Button,
  Container,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Image,
  Input,
  Link,
  Text,
  Box,
  Heading,
} from "@chakra-ui/react"
import {
  Link as RouterLink,
  createFileRoute,
  redirect,
} from "@tanstack/react-router"
import { type SubmitHandler, useForm } from "react-hook-form"
import Logo from "/assets/images/data-proxy-logo.png"
import type { UserRegister } from "../client"
import useAuth, { isLoggedIn } from "../hooks/useAuth"
import { confirmPasswordRules, emailPattern, passwordRules } from "../utils"

export const Route = createFileRoute("/signup")({
  component: SignUp,
  beforeLoad: async () => {
    if (isLoggedIn()) {
      throw redirect({
        to: "/",
      })
    }
  },
})

interface UserRegisterForm extends UserRegister {
  confirm_password: string
}

function SignUp() {
  const { signUpMutation } = useAuth()
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<UserRegisterForm>({
    mode: "onBlur",
    criteriaMode: "all",
    defaultValues: {
      email: "",
      full_name: "",
      password: "",
      confirm_password: "",
    },
  })

  const onSubmit: SubmitHandler<UserRegisterForm> = (data) => {
    signUpMutation.mutate(data)
  }

  return (
    <Container maxW="container.xl" p={0} height="100vh" display="flex" alignItems="center">
      <Flex 
        direction={{ base: "column", md: "row" }} 
        width="100%"
        maxW="container.xl"
        bg="white"
        boxShadow="md"
        borderRadius="md"
      >
        {/* Left Column - Text Section */}
        <Box
          flex="1"
          bg="gray.50"
          p={10}
          display="flex"
          flexDirection="column"
          alignItems="flex-start"
          borderRadius={{ md: "md 0 0 md" }}
        >
        <Heading as="h1" size="xl" mb={6} color="gray.800">
            Access Your Data Insights
          </Heading>
          <Text fontSize="lg" color="gray.600" mb={4}>
            Sign up to wield cutting-edge tools and transform your data into pure power.
          </Text>
          <Text fontSize="md" color="gray.500">
            Curious how far you can go? Our expert crew and secret knowledge base are your launchpad to greatness.
          </Text>
        </Box>

        {/* Right Column - Form Section */}
        <Box
          flex="1"
          as="form"
          onSubmit={handleSubmit(onSubmit)}
          p={10}
          display="flex"
          flexDirection="column"
          alignItems="center"
          gap={6}
        >
          <Link href="https://thedataproxy.com" target="_blank" rel="noopener noreferrer">
            <Image src={Logo} alt="logo" height="auto" maxW="2xs" mb={4} />
          </Link>

          <FormControl id="full_name" isInvalid={!!errors.full_name}>
            <FormLabel htmlFor="full_name" srOnly>
              Full Name
            </FormLabel>
            <Input
              id="full_name"
              minLength={3}
              {...register("full_name", { required: "Full Name is required" })}
              placeholder="Full Name"
              type="text"
            />
            {errors.full_name && (
              <FormErrorMessage>{errors.full_name.message}</FormErrorMessage>
            )}
          </FormControl>

          <FormControl id="email" isInvalid={!!errors.email}>
            <FormLabel htmlFor="email" srOnly>
              Email
            </FormLabel>
            <Input
              id="email"
              {...register("email", {
                required: "Email is required",
                pattern: emailPattern,
              })}
              placeholder="Email"
              type="email"
            />
            {errors.email && (
              <FormErrorMessage>{errors.email.message}</FormErrorMessage>
            )}
          </FormControl>

          <FormControl id="password" isInvalid={!!errors.password}>
            <FormLabel htmlFor="password" srOnly>
              Password
            </FormLabel>
            <Input
              id="password"
              {...register("password", passwordRules())}
              placeholder="Password"
              type="password"
            />
            {errors.password && (
              <FormErrorMessage>{errors.password.message}</FormErrorMessage>
            )}
          </FormControl>

          <FormControl id="confirm_password" isInvalid={!!errors.confirm_password}>
            <FormLabel htmlFor="confirm_password" srOnly>
              Confirm Password
            </FormLabel>
            <Input
              id="confirm_password"
              {...register("confirm_password", confirmPasswordRules(getValues))}
              placeholder="Repeat Password"
              type="password"
            />
            {errors.confirm_password && (
              <FormErrorMessage>{errors.confirm_password.message}</FormErrorMessage>
            )}
          </FormControl>

          <Button variant="primary" type="submit" isLoading={isSubmitting} width="full">
            Sign Up
          </Button>

          <Text>
            Already have an account?{" "}
            <Link as={RouterLink} to="/login" color="blue.500">
              Log In
            </Link>
          </Text>
        </Box>
      </Flex>
    </Container>
  )
}

export default SignUp