import { Box, Container, Text, VStack, HStack, Button, Icon, Divider } from "@chakra-ui/react"
import { createFileRoute } from "@tanstack/react-router"
import { FiSettings, FiDatabase, FiLogOut } from "react-icons/fi"

import useAuth from "../../hooks/useAuth"

export const Route = createFileRoute("/_layout/")({
  component: Dashboard,
})

function Dashboard() {
  const { user: currentUser, logout } = useAuth()

  return (
    <>
      <Container maxW="full">
        <Box pt={12} m={4}>
          <Text fontSize="2xl" fontWeight="bold">
            Hi, {currentUser?.full_name || currentUser?.email} 👋🏼
          </Text>
          <Text>Welcome back, nice to see you again!</Text>
        </Box>

        <Divider my={4} />

        {/* Dashboard Actions */}
        <VStack spacing={4} align="stretch">
          <HStack spacing={4}>
            <Button leftIcon={<Icon as={FiDatabase} />} colorScheme="blue" variant="solid">
              Manage Datasets
            </Button>
            <Button leftIcon={<Icon as={FiSettings} />} colorScheme="teal" variant="solid">
              Settings
            </Button>
          </HStack>
          <HStack>
            <Button leftIcon={<Icon as={FiLogOut} />} colorScheme="red" variant="outline" onClick={logout}>
              Logout
            </Button>
          </HStack>
        </VStack>
      </Container>
    </>
  )
}
