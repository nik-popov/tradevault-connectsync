import {
  Box,
  Flex,
  IconButton,
  Image,
  Link,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react"
import { useQueryClient } from "@tanstack/react-query"
import { FiLogOut, FiMenu } from "react-icons/fi"

import Logo from "/assets/images/data-proxy-logo.png"
import type { UserPublic } from "../../client"
import useAuth from "../../hooks/useAuth"
import SidebarItems from "./SidebarItems" // Note: You'll need to modify this component too

const TopNav = () => {
  const queryClient = useQueryClient()
  const bgColor = "white"  // Fixed light background
  const textColor = "gray.800"  // Dark text for visibility
  const currentUser = queryClient.getQueryData<UserPublic>(["currentUser"])
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { logout } = useAuth()

  const handleLogout = async () => {
    logout()
  }
  
  return (
    <Box
      bg={bgColor}
      px={4}
      py={2}
      position="sticky"
      top="0"
      zIndex="sticky"
      boxShadow="sm"
      w="100%"
    >
      <Flex
        align="center"
        justify="space-between"
        maxW="1200px"
        mx="auto"
      >
        {/* Left Section - Logo */}
        <Link href="https://dashboard.thedataproxy.com">
          <Image src={Logo} alt="Logo" h="40px" />
        </Link>

        {/* Mobile Menu Button */}
        <IconButton
          onClick={onOpen}
          display={{ base: "flex", md: "none" }}
          aria-label="Open Menu"
          fontSize="20px"
          color="blue.600"
          icon={<FiMenu />}
          variant="ghost"
        />

        {/* Desktop Navigation */}
        <Flex
          align="center"
          gap={8}
          display={{ base: "none", md: "flex" }}
        >
          <SidebarItems /> {/* Note: Modify this to render horizontally */}
          
          {/* User Info and Logout */}
          <Flex align="center" gap={4}>
            {currentUser?.email && (
              <Text color="gray.800" fontSize="sm" maxW="200px" isTruncated>
                {currentUser.email}
              </Text>
            )}
            <IconButton
              as="button"
              onClick={handleLogout}
              color="blue.600"
              icon={<FiLogOut />}
              aria-label="Log out"
              variant="ghost"
            />
          </Flex>
        </Flex>
      </Flex>

      {/* Mobile Menu */}
      <Box
        display={{ base: isOpen ? "block" : "none", md: "none" }}
        position="absolute"
        top="100%"
        left={0}
        right={0}
        bg="white"
        boxShadow="md"
        p={4}
      >
        <Flex flexDir="column" gap={4}>
          <SidebarItems onClose={onClose} />
          {currentUser?.email && (
            <Text color="gray.800" fontSize="sm">
              Logged in as: {currentUser.email}
            </Text>
          )}
          <Flex
            as="button"
            onClick={handleLogout}
            color="blue.600"
            fontWeight="bold"
            alignItems="center"
            gap={2}
          >
            <FiLogOut />
            <Text>Log out</Text>
          </Flex>
        </Flex>
      </Box>
    </Box>
  )
}

export default TopNav