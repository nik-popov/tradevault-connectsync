import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons"
import {
  Button,
  Container,
  FormControl,
  FormErrorMessage,
  Icon,
  Image,
  Input,
  InputGroup,
  InputRightElement,
  Link,
  Text,
  Flex,
  useBoolean,
} from "@chakra-ui/react"
import { Link as RouterLink, createFileRoute, redirect } from "@tanstack/react-router"
import { type SubmitHandler, useForm } from "react-hook-form"

import Logo from "/assets/images/cobalt-data-logo.svg"
import type { Body_login_login_access_token as AccessToken } from "../client"
import useAuth, { isLoggedIn } from "../hooks/useAuth"
import { emailPattern } from "../utils"

export const Route = createFileRoute("/login")({
  component: Login,
  beforeLoad: async () => {
    if (isLoggedIn()) {
      throw redirect({ to: "/" })
    }
  },
})

function Login() {
  const [show, setShow] = useBoolean()
  const { loginMutation, error, resetError } = useAuth()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AccessToken>({
    mode: "onBlur",
    criteriaMode: "all",
    defaultValues: { username: "", password: "" },
  })

  const onSubmit: SubmitHandler<AccessToken> = async (data) => {
    if (isSubmitting) return

    resetError()

    try {
      await loginMutation.mutateAsync(data)
    } catch {
      // error is handled by useAuth hook
    }
  }

  // Social media logo components

  // GitHub logo remains unchanged
  const GitHubLogo = () => (
    <Link
      href="https://github.com/CobaltDataNet/cobaltdata.net"
      target="_blank"
      rel="noopener noreferrer"
    >
      <Image
        src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png"
        alt="GitHub Logo"
        boxSize="32px"
      />
    </Link>
  )

  // LinkedIn logo component
  const LinkedInLogo = () => (
    <Link
      href="https://www.linkedin.com/company/cobaltdatanet"
      target="_blank"
      rel="noopener noreferrer"
    >
      <Image
        src="https://upload.wikimedia.org/wikipedia/commons/c/ca/LinkedIn_logo_initials.png"
        alt="LinkedIn Logo"
        boxSize="32px"
      />
    </Link>
  )

  // Updated Medium logo component with a new URL so it loads correctly
  const MediumLogo = () => (
    <Link
      href="https://medium.com/@cobaltdatanet"
      target="_blank"
      rel="noopener noreferrer"
    >
      <Image
        src="https://upload.wikimedia.org/wikipedia/commons/4/4e/Medium_Logo.svg"
        alt="Medium Logo"
        boxSize="32px"
      />
    </Link>
  )

  return (
    <Container
      as="form"
      onSubmit={handleSubmit(onSubmit)}
      h="100vh"
      maxW="sm"
      centerContent
      gap={4}
      p={6}
    >
      <Image
        src={Logo}
        alt="CobaltData logo"
        height="auto"
        maxW="2xs"
        alignSelf="center"
        mb={4}
      />

      <FormControl id="username" isInvalid={!!errors.username || !!error}>
        <Input
          id="username"
          {...register("username", {
            required: "Username is required",
            pattern: emailPattern,
          })}
          placeholder="Email"
          type="email"
          required
        />
        {errors.username && (
          <FormErrorMessage>{errors.username.message}</FormErrorMessage>
        )}
      </FormControl>

      <FormControl id="password" isInvalid={!!error}>
        <InputGroup>
          <Input
            {...register("password", { required: "Password is required" })}
            type={show ? "text" : "password"}
            placeholder="Password"
            required
          />
          <InputRightElement color="ui.dim" _hover={{ cursor: "pointer" }}>
            <Icon
              as={show ? ViewOffIcon : ViewIcon}
              onClick={setShow.toggle}
              aria-label={show ? "Hide password" : "Show password"}
            >
              {show ? <ViewOffIcon /> : <ViewIcon />}
            </Icon>
          </InputRightElement>
        </InputGroup>
        {error && <FormErrorMessage>{error}</FormErrorMessage>}
      </FormControl>

      <Link as={RouterLink} to="/recover-password" color="blue.500">
        Forgot password?
      </Link>

      <Button variant="primary" type="submit" isLoading={isSubmitting}>
        Log In
      </Button>

      <Text>
        Don't have an account?{" "}
        <Link as={RouterLink} to="/signup" color="blue.500">
          Sign up
        </Link>
      </Text>

      {/* Social media icons row remains in its original position */}
      <Flex direction="row" justify="center" align="center" gap={4} mt={4}>
        <GitHubLogo />
        <LinkedInLogo />
        <MediumLogo />
      </Flex>
    </Container>
  )
}

export default Login
