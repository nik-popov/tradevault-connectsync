import {
  Box,
  Flex,
  Icon,
  Text,
  IconButton,
  Tooltip,
  useDisclosure,
} from "@chakra-ui/react";
import { useQueryClient } from "@tanstack/react-query";
import { Link as RouterLink } from "@tanstack/react-router";
import {
  FiLogOut,
  FiMenu,
  FiUsers,
  FiSearch,
  FiShield,
  FiUserCheck,
  FiSettings, // Added gear icon
} from "react-icons/fi";
// MdPerson is no longer used, so the import is removed.

import Logo from "../Common/Logo";
import type { UserPublic } from "../../client";
import useAuth from "../../hooks/useAuth";

// NavItem interface
interface NavItem {
  title: string;
  icon?: any;
  path?: string;
  subItems?: NavItem[];
}

interface NavItemsProps {
  onClose?: () => void;
  isMobile?: boolean;
}

// Data structure for navigation
const navStructure: NavItem[] = [
  {
    title: "HTTPS Proxy API",
    path: "/web-scraping-tools/https-proxy-api",
    icon: FiShield,
  },
  {
    title: "SERP API",
    path: "/web-scraping-tools/serp-api",
    icon: FiSearch,
  },
  {
    title: "User Agents Today",
    path: "/web-scraping-tools/user-agents",
    icon: FiUserCheck,
  },
];

const NavItems = ({ onClose, isMobile = false }: NavItemsProps) => {
  const queryClient = useQueryClient();
  const textColor = "gray.800";
  const disabledColor = "gray.300";
  const hoverColor = "orange.600";
  const bgActive = "orange.100";
  const activeTextColor = "orange.800";
  const currentUser = queryClient.getQueryData<UserPublic>(["currentUser"]);

  const finalNavStructure = [...navStructure];
  if (
    currentUser?.is_superuser &&
    !finalNavStructure.some((item) => item.title === "Admin")
  ) {
    finalNavStructure.push({ title: "Admin", icon: FiUsers, path: "/admin" });
  }

  const isEnabled = (title: string) => {
    return [
      "Admin",
      "HTTPS Proxy API",
      "SERP API",
      "User Agents Today",
    ].includes(title);
  };

  const renderNavItems = (items: NavItem[]) =>
    items.map((item) => {
      const { icon, title, path } = item;
      const enabled = isEnabled(title);

      if (!enabled) {
        return (
          <Tooltip
            key={title}
            label="Coming Soon"
            placement={isMobile ? "right" : "bottom"}
          >
            <Flex
              px={4}
              py={2}
              color={disabledColor}
              cursor="not-allowed"
              align="center"
              flexDir="row"
            >
              {icon && <Icon as={icon} mr={2} boxSize={5} color={disabledColor} />}
              <Text fontWeight="500">{title}</Text>
            </Flex>
          </Tooltip>
        );
      }

      // Render a standard link for each item
      return (
        <Flex
          key={title}
          as={RouterLink}
          to={path}
          px={4}
          py={2}
          color={textColor}
          _hover={{ color: hoverColor, textDecoration: "none" }}
          activeProps={{
            style: { background: bgActive, color: activeTextColor },
          }}
          align="center"
          onClick={onClose}
          w={isMobile ? "100%" : "auto"}
          borderRadius="md"
        >
          {/* MODIFIED: Added boxSize for uniform icon size */}
          {icon && <Icon as={icon} mr={2} boxSize={5} />}
          {/* MODIFIED: Ensured fontWeight is consistent */}
          <Text fontWeight="500">{title}</Text>
        </Flex>
      );
    });

  return (
    <Flex
      align="center"
      gap={isMobile ? 2 : 1}
      flexDir={isMobile ? "column" : "row"}
      w={isMobile ? "100%" : "auto"}
    >
      {renderNavItems(finalNavStructure)}
    </Flex>
  );
};

const TopNav = () => {
  const queryClient = useQueryClient();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { logout } = useAuth();
  const currentUser = queryClient.getQueryData<UserPublic>(["currentUser"]);
  const textColor = "gray.800";
  const hoverColor = "orange.600";
  const bgActive = "orange.100";
  const activeTextColor = "orange.800";

  const handleLogout = async () => {
    logout();
    onClose();
  };

  return (
    <Box
      bg="white"
      px={4}
      py={2}
      position="sticky"
      top="0"
      zIndex="sticky"
      boxShadow="sm"
      w="100%"
    >
      <Flex align="center" justify="space-between" maxW="1200px" mx="auto">
        {/* Logo */}
        <Logo href="/" />

        {/* Mobile Menu Button */}
        <IconButton
          onClick={isOpen ? onClose : onOpen}
          display={{ base: "flex", md: "none" }}
          aria-label="Open Menu"
          fontSize="20px"
          color="orange.600"
          icon={<FiMenu />}
          variant="ghost"
        />

        {/* Desktop Navigation */}
        <Flex align="center" gap={4} display={{ base: "none", md: "flex" }}>
          <NavItems />
          {currentUser && (
            <>
              {/* MODIFIED: "Profile" changed to "Settings" with a gear icon */}
              <Flex
                as={RouterLink}
                to="/settings"
                px={4}
                py={2}
                color={textColor}
                _hover={{ color: hoverColor, textDecoration: "none" }}
                activeProps={{
                  style: { background: bgActive, color: activeTextColor },
                }}
                align="center"
                borderRadius="md"
              >
                <Icon as={FiSettings} mr={2} boxSize={5} />
                <Text fontWeight="500">Settings</Text>
              </Flex>
              <Flex
                as="button"
                onClick={handleLogout}
                px={4}
                py={2}
                color={textColor}
                _hover={{ color: hoverColor }}
                align="center"
                borderRadius="md"
              >
                {/* MODIFIED: Added boxSize for uniform icon size */}
                <Icon as={FiLogOut} mr={2} boxSize={5} />
                <Text fontWeight="500">Log out</Text>
              </Flex>
            </>
          )}
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
          <NavItems onClose={onClose} isMobile={true} />
          {currentUser && (
            <>
              <Text
                color={textColor}
                fontSize="sm"
                mt={4}
                borderTopWidth="1px"
                pt={4}
              >
                Logged in as: {currentUser.email}
              </Text>
              <Flex flexDir="column" gap={2}>
                {/* MODIFIED: "Profile" changed to "Settings" with a gear icon */}
                <Flex
                  as={RouterLink}
                  to="/settings"
                  px={4}
                  py={2}
                  color={textColor}
                  _hover={{ color: hoverColor }}
                  onClick={onClose}
                  align="center"
                >
                  <Icon as={FiSettings} mr={2} boxSize={5} />
                  <Text fontWeight="500">Settings</Text>
                </Flex>
                <Flex
                  as="button"
                  onClick={handleLogout}
                  px={4}
                  py={2}
                  color={textColor}
                  _hover={{ color: hoverColor }}
                  align="center"
                >
                  <Icon as={FiLogOut} mr={2} boxSize={5} />
                  <Text fontWeight="500">Log out</Text>
                </Flex>
              </Flex>
            </>
          )}
        </Flex>
      </Box>
    </Box>
  );
};

export default TopNav;