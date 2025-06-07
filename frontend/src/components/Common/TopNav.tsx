import {
  Box,
  Flex,
  Icon,
  Text,
  IconButton,
  Tooltip,
  useDisclosure,
  // MODIFIED: Added Menu components for dropdown
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
// MODIFIED: Added icon for dropdown
import { ChevronDownIcon } from "@chakra-ui/icons";
import { useQueryClient } from "@tanstack/react-query";
// MODIFIED: useMatch is no longer needed, using useRouterState instead
import { Link as RouterLink, useRouterState } from "@tanstack/react-router";
import {
  FiLogOut,
  FiMenu,
  FiUsers,
  FiSearch,
  FiShield,
  FiUserCheck,
  FiSettings,
} from "react-icons/fi";
// MODIFIED: Added FaSitemap for the group icon
import { FaBook, FaKey, FaCreditCard, FaGlobe, FaSearch, FaSitemap } from 'react-icons/fa';

import Logo from "../Common/Logo";
import type { UserPublic } from "../../client";
import useAuth from "../../hooks/useAuth";

// NavItem interface remains the same, supporting subItems
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

// MODIFIED: Data structure for navigation is now nested
const navStructure: NavItem[] = [
  {
    title: "Web Scraping APIs",
    subItems: [
      {
        title: "HTTPS API",
        path: "/web-scraping-tools/https-api",
        icon: FaGlobe,
      },
      {
        title: "SERP API",
        path: "/web-scraping-tools/serp-api",
        icon: FiSearch,
      },
    ],
  },
  {
    title: "User Agents",
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
  // MODIFIED: Get current location to determine active state for dropdowns
  const { location } = useRouterState();
  const { pathname } = location;

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
      "HTTPS API",
      "SERP API",
      "User Agents",
    ].includes(title);
  };

  // MODIFIED: The rendering logic is updated to handle nested items
  const renderNavItems = (items: NavItem[]) =>
    items.map((item) => {
      const { icon, title, path, subItems } = item;
      const hasSubItems = subItems && subItems.length > 0;

      // --- RENDER DROPDOWN/GROUP FOR ITEMS WITH SUB-ITEMS ---
      if (hasSubItems) {
        const isGroupActive = subItems.some(sub => pathname.startsWith(sub.path!));

        // Desktop Dropdown Menu
        if (!isMobile) {
          return (
            <Menu key={title} placement="bottom">
              <MenuButton
                as={Flex}
                px={4}
                py={2}
                align="center"
                cursor="pointer"
                color={isGroupActive ? activeTextColor : textColor}
                bg={isGroupActive ? bgActive : "transparent"}
                _hover={{ color: hoverColor, textDecoration: "none" }}
                borderRadius="md"
              >
             
                <Text fontWeight="500">{title}</Text>
              
              </MenuButton>
              <MenuList>
                {subItems.map((subItem) => (
                  <MenuItem
                    key={subItem.title}
                    as={RouterLink}
                    to={subItem.path}
                    onClick={onClose}
                    icon={<Icon as={subItem.icon} boxSize={4} />}
                     activeProps={{
                       style: { background: bgActive, color: activeTextColor },
                     }}
                  >
                    {subItem.title}
                  </MenuItem>
                ))}
              </MenuList>
            </Menu>
          );
        }

        // Mobile Grouped List
        return (
          <Box key={title} w="100%">
            <Flex px={4} py={2} color={textColor} align="center">
              <Icon as={icon} mr={2} boxSize={5} />
              <Text fontWeight="600">{title}</Text>
            </Flex>
            <Flex direction="column" pl={6}>
              {subItems.map((subItem) => (
                <Flex
                  key={subItem.title}
                  as={RouterLink}
                  to={subItem.path}
                  px={4}
                  py={2}
                  color={textColor}
                  _hover={{ color: hoverColor, textDecoration: "none" }}
                  activeProps={{
                    style: { background: bgActive, color: activeTextColor },
                  }}
                  align="center"
                  onClick={onClose}
                  w="100%"
                  borderRadius="md"
                >
                  <Icon as={subItem.icon} mr={2} boxSize={5} />
                  <Text fontWeight="500">{subItem.title}</Text>
                </Flex>
              ))}
            </Flex>
          </Box>
        );
      }
      
      // --- RENDER A SINGLE NAV ITEM (NO SUB-ITEMS) ---
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
          {icon && <Icon as={icon} mr={2} boxSize={5} />}
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