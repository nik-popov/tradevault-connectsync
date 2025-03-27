import { Flex, Spinner } from "@chakra-ui/react"
import { Outlet, createFileRoute, redirect } from "@tanstack/react-router"

import TopNav from "../components/Common/TopNav" // Changed from Sidebar
import UserMenu from "../components/Common/UserMenu"
import useAuth, { isLoggedIn } from "../hooks/useAuth"

export const Route = createFileRoute("/_layout")({
  component: Layout,
  beforeLoad: async () => {
    if (!isLoggedIn()) {
      throw redirect({
        to: "/login",
      })
    }
  },
})

function Layout() {
  const { isLoading } = useAuth()

  return (
    <Flex 
      direction="column" // Changed to column layout
      minH="100vh"    // Ensure full height
      w="100%"
    >
      <TopNav /> {/* Changed from Sidebar */}
      {isLoading ? (
        <Flex 
          justify="center" 
          align="center" 
          flex="1" // Allow it to fill remaining space
        >
          <Spinner size="xl" color="ui.main" />
        </Flex>
      ) : (
        <Flex
          flex="1" // Allow content to fill remaining space
          direction="column"
          maxW="1200px" // Match TopNav max-width if desired
          mx="auto"     // Center the content
          w="100%"
        >
          <Outlet />
        </Flex>
      )}
      <UserMenu /> {/* Note: You might want to move this into TopNav */}
    </Flex>
  )
}