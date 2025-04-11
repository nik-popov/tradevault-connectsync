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
  Box,
  Heading,
  useBoolean,
} from "@chakra-ui/react"
import { Link as RouterLink, createFileRoute, redirect } from "@tanstack/react-router"
import { type SubmitHandler, useForm } from "react-hook-form"
import Logo from "/assets/images/the-data-proxy-logo-dark.png"
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
  const GitHubLogo = () => (
    <Link href="https://github.com/CobaltDataNet" target="_blank" rel="noopener noreferrer">
      <Image src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png" alt="GitHub Logo" boxSize="32px" />
    </Link>
  )

  const LinkedInLogo = () => (
    <Link href="https://www.linkedin.com/company/CobaltDataNet" target="_blank" rel="noopener noreferrer">
      <Image src="https://upload.wikimedia.org/wikipedia/commons/c/ca/LinkedIn_logo_initials.png" alt="LinkedIn Logo" boxSize="32px" />
    </Link>
  )

  const XLogo = () => (
    <Link href="https://twitter.com/cobaltdata" target="_blank" rel="noopener noreferrer">
      <Image src="https://images.freeimages.com/image/large-previews/f35/x-twitter-logo-on-black-circle-5694247.png" alt="XLogo" boxSize="32px" />
    </Link>
  )

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
          Unlock Your Data’s Potential
          </Heading>
          <Text fontSize="lg" color="gray.600" mb={4}>
          Sign in to experience seamless data management and take control with confidence.
          </Text>
          <Text fontSize="md" color="gray.500">
Need a Boost? Our expert support team and comprehensive documentation are here to fuel your success.
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
                />
              </InputRightElement>
            </InputGroup>
            {error && <FormErrorMessage>{error}</FormErrorMessage>}
          </FormControl>

          <Link as={RouterLink} to="/recover-password" color="blue.500">
            Forgot password?
          </Link>

          <Button variant="primary" type="submit" isLoading={isSubmitting} width="full">
            Log In
          </Button>

          <Text>
            Don't have an account?{" "}
            <Link as={RouterLink} to="/signup" color="blue.500">
              Sign up
            </Link>
          </Text>

          <Flex direction="row" justify="center" align="center" gap={4} mt={6}>
            <GitHubLogo />
            <LinkedInLogo />
            <XLogo />
          </Flex>
        </Box>
      </Flex>
    </Container>
  )
}

export default Login