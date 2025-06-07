import {
  Box,
  Flex,
  Icon,
  Text,
  IconButton,
  Tooltip,
  useDisclosure,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { useQueryClient } from "@tanstack/react-query";
import { Link as RouterLink } from "@tanstack/react-router";
import {
  FiLogOut,
  FiMenu,
  FiUsers,
  FiTool,
  FiShield,
  FiUserCheck,
} from "react-icons/fi";
import { MdPerson } from "react-icons/md";
import { useRef } from "react"; // Added import

import Logo from "../Common/Logo";
import type { UserPublic } from "../../client";
import useAuth from "../../hooks/useAuth";

// Updated NavItem to include an optional description
interface NavItem {
  title: string;
  icon?: any;
  path?: string;
  subItems?: NavItem[];
  description?: string;
}

interface NavItemsProps {
  onClose?: () => void;
  isMobile?: boolean;
}

// Data structure for navigation, now with icons and descriptions
const navStructure: NavItem[] = [
  {
    title: "Web Scraping Tools",
    subItems: [
      {
        title: "HTTPS Proxy API",
        path: "/web-scraping-tools/https-proxy",
        icon: FiShield,
        description: "Access web pages with our rotating proxy network.",
      },
      {
        title: "User Agents Today",
        path: "/web-scraping-tools/user-agents",
        icon: FiUserCheck,
        description: "Get lists of the most common user agents for your scrapers.",
      },
    ],
  },
];

// New component to render the menu item as a "card" with a description
const MenuItemCard = ({
  item,
  onClose,
}: {
  item: NavItem;
  onClose?: () => void;
}) => {
  const bgActive = "orange.100";
  const hoverBg = "gray.50";

  return (
    <MenuItem
      as={RouterLink}
      to={item.path}
      onClick={onClose}
      _hover={{ bg: hoverBg, textDecoration: "none" }}
      activeProps={{
        style: { background: bgActive },
      }}
      borderRadius="lg"
      p={3}
      m={1}
      transition="background-color 0.2s"
    >
      <Flex alignItems="center">
        {item.icon && (
          <Icon as={item.icon} mr={4} boxSize={6} color="orange.500" />
        )}
        <Box>
          <Text fontWeight="600" color="gray.800">
            {item.title}
          </Text>
          {item.description && (
            <Text fontSize="sm" color="gray.500" whiteSpace="normal" mt={1}>
              {item.description}
            </Text>
          )}
        </Box>
      </Flex>
    </MenuItem>
  );
};

// MODIFIED COMPONENT: Handles the hover-to-open dropdown with a delay
const HoverableDropdown = ({
  item,
  onClose,
}: {
  item: NavItem;
  onClose?: () => void;
}) => {
  const { isOpen, onOpen, onClose: closeMenu } = useDisclosure();
  const textColor = "gray.800";
  const hoverColor = "orange.600";
  const timeoutRef = useRef<NodeJS.Timeout | null>(null); // To store timer

  // Clear any pending close timer and open the menu
  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    onOpen();
  };

  // Set a timer to close the menu after a short delay
  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      closeMenu();
    }, 150); // 150ms delay
  };

  return (
    // The hover area now uses the new handlers
    <Box onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <Menu isOpen={isOpen} placement="bottom" gutter={16}>
        <MenuButton
          as={Flex}
          px={4}
          py={2}
          color={textColor}
          _hover={{ color: hoverColor }}
          align="center"
          cursor="pointer"
          sx={isOpen ? { color: hoverColor } : {}}
        >
          {item.icon && <Icon as={item.icon} mr={2} />}
          <Text>{item.title}</Text>
        </MenuButton>
        <MenuList
          zIndex="popover"
          p={2}
          borderRadius="xl"
          boxShadow="lg"
          border="1px solid"
          borderColor="gray.100"
        >
          {item.subItems!.map((subItem) => (
            <MenuItemCard
              key={subItem.title}
              item={subItem}
              onClose={() => {
                if (onClose) onClose();
                closeMenu();
              }}
            />
          ))}
        </MenuList>
      </Menu>
    </Box>
  );
};


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
      "Web Scraping Tools",
      "HTTPS Proxy API",
      "User Agents Today",
    ].includes(title);
  };

  const renderNavItems = (items: NavItem[], isSubItem = false) =>
    items.map((item) => {
      const { icon, title, path, subItems } = item;
      const enabled = isEnabled(title);

      if (!enabled) {
        return (
          <Tooltip
            key={title}
            label="Restricted"
            placement={isMobile ? "right" : "bottom"}
          >
            <Flex
              px={4}
              py={2}
              pl={isMobile && isSubItem ? 8 : 4}
              color={disabledColor}
              cursor="not-allowed"
              align="center"
              flexDir="row"
            >
              {icon && <Icon as={icon} mr={2} color={disabledColor} />}
              <Text>{title}</Text>
            </Flex>
          </Tooltip>
        );
      }

      if (subItems) {
        // Use the new HoverableDropdown for desktop
        if (!isMobile) {
          return <HoverableDropdown key={title} item={item} onClose={onClose} />;
        }
        // Keep the original collapsible section for mobile
        return (
          <Box key={title} w="100%">
            <Flex px={4} py={2} color={textColor} align="center" w="100%">
              {icon && <Icon as={icon} mr={2} />}
              <Text fontWeight="bold">{title}</Text>
              <Icon as={ChevronDownIcon} ml="auto" w={5} h={5} />
            </Flex>
            <Flex direction="column" w="100%">
              {renderNavItems(subItems, true)}
            </Flex>
          </Box>
        );
      }

      // Render a standard link for items without sub-items
      return (
        <Flex
          key={title}
          as={RouterLink}
          to={path}
          px={4}
          py={2}
          pl={isMobile && isSubItem ? 8 : 4}
          color={textColor}
          _hover={{ color: hoverColor }}
          activeProps={{
            style: { background: bgActive, color: activeTextColor },
          }}
          align="center"
          onClick={onClose}
          w={isMobile ? "100%" : "auto"}
        >
          {icon && <Icon as={icon} mr={2} />}
          <Text>{title}</Text>
        </Flex>
      );
    });

  return (
    <Flex
      align="center"
      gap={isMobile ? 2 : 0}
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
                _hover={{ color: hoverColor }}
                activeProps={{
                  style: { background: bgActive, color: activeTextColor },
                }}
                align="center"
              >
                <Icon as={MdPerson} mr={2} />
                <Text>Profile</Text>
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
                <Icon as={FiLogOut} mr={2} />
                <Text>Log out</Text>
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
                  <Icon as={MdPerson} mr={2} />
                  <Text>Profile</Text>
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
                  <Icon as={FiLogOut} mr={2} />
                  <Text>Log out</Text>
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