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

import Logo from "../Common/Logo";
import type { UserPublic } from "../../client";
import useAuth from "../../hooks/useAuth";

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

const navStructure: NavItem[] = [
  {
    title: "Web Scraping Tools",
    subItems: [
      {
        title: "HTTPS Proxy API",
        path: "/web-scraping-tools/https-proxy",
        icon: FiShield,
      },
      {
        title: "User Agents Today",
        path: "/web-scraping-tools/user-agents",
        icon: FiUserCheck,
      },
    ],
  },
];

const NavItems = ({ onClose, isMobile = false }: NavItemsProps) => {
  const queryClient = useQueryClient();
  const textColor = "gray.800";
  const disabledColor = "gray.300";
  const hoverColor = "blue.600";
  const bgActive = "blue.100";
  const activeTextColor = "blue.800";
  const currentUser = queryClient.getQueryData<UserPublic>(["currentUser"]);

  const finalNavStructure = [...navStructure];
  if (currentUser?.is_superuser && !finalNavStructure.some(item => item.title === "Admin")) {
    finalNavStructure.push({ title: "Admin", icon: FiUsers, path: "/admin" });
  }

  const isEnabled = (title: string) => {
    return ["Admin", "Web Scraping Tools", "HTTPS Proxy API", "User Agents Today"].includes(title);
  }

  const renderNavItems = (items: NavItem[], isSubItem = false) =>
    items.map(({ icon, title, path, subItems }) => {
      const enabled = isEnabled(title);

      if (!enabled) {
        return (
          <Tooltip key={title} label="Restricted" placement={isMobile ? "right" : "bottom"}>
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
        if (!isMobile) {
          return (
            <Menu key={title} placement="bottom">
              <MenuButton
                as={Flex}
                px={4}
                py={2}
                color={textColor}
                _hover={{ color: hoverColor }}
                align="center"
                cursor="pointer"
              >
                {icon && <Icon as={icon} mr={2} />}
                <Text>{title}</Text>
              </MenuButton>
              <MenuList zIndex="popover">
                {subItems.map(subItem => (
                  <MenuItem
                    key={subItem.title}
                    as={RouterLink}
                    to={subItem.path}
                    onClick={onClose}
                    icon={subItem.icon && <Icon as={subItem.icon} />}
                    _hover={{ color: hoverColor, bg: bgActive }}
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
          w={isMobile ? '100%' : 'auto'}
        >
          {icon && <Icon as={icon} mr={2} />}
          <Text>{title}</Text>
        </Flex>
      );
    });

  return (
    <Flex align="center" gap={isMobile ? 2 : 0} flexDir={isMobile ? "column" : "row"} w={isMobile ? '100%' : 'auto'}>
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
  const hoverColor = "blue.600";
  const bgActive = "blue.100";
  const activeTextColor = "blue.800";

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
          color="blue.600"
          icon={<FiMenu />}
          variant="ghost"
        />

        {/* Desktop Navigation */}
        <Flex align="center" gap={4} display={{ base: "none", md: "flex" }}>
          {/* Use NavItems with gap={0} on its root to avoid double spacing with MenuButton's padding */}
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
              <Text color={textColor} fontSize="sm" mt={4} borderTopWidth="1px" pt={4}>
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