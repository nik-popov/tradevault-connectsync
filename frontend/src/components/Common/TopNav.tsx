import {
  Box,
  Flex,
  Icon,
  Text,
  IconButton,
  Image,
  Link,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Tooltip,
  useDisclosure,
} from "@chakra-ui/react";
import { useQueryClient } from "@tanstack/react-query";
import { Link as RouterLink } from "@tanstack/react-router";
import { FiLogOut, FiMenu  , FiUsers, FiSearch , FiChevronDown, FiUser } from "react-icons/fi";

import Logo from "/assets/images/the-data-proxy-logo-dark.png";
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
  // {
  //   title: "Scraping Tools",
  //   subItems: [
    
  //     { title: "HTTPS Request API", path: "/scraping-tools/https-proxy" },
 
  //     { title: "Realtime Proxy Status", path: "/scraping-tools/search-proxies" },
  //   ],
  // icon: FiSearch,
  // },
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
  const isEnabled = (title: string) =>
    ["Home", "Scraping Tools", "Admin"].includes(title) ||
    (title === "Jobs" && 
      finalNavStructure.some(item => 
        item.title === "Scraping Tools" && 
        item.subItems?.some(sub => sub.title === "Jobs")
      )) ||
      (title === "HTTPS Request API" &&   
        finalNavStructure.some(item => 
        item.title === "Scraping Tools" && 
        item.subItems?.some(sub => sub.title === "HTTPS Request API")
      )) ||
    (title === "Realtime Proxy Status" && 
      finalNavStructure.some(item => 
        item.title === "Scraping Tools" && 
        item.subItems?.some(sub => sub.title === "Realtime Proxy Status")
      ));

  const renderNavItems = (items: NavItem[]) =>
    items.map(({ icon, title, path, subItems }) => {
      const enabled = isEnabled(title);

      if (!enabled) {
        return (
          <Tooltip key={title} label="Restricted" placement={isMobile ? "right" : "bottom"}>
            <Flex
              px={4}
              py={2}
              color={disabledColor}
              cursor="not-allowed"
              _hover={{ color: hoverColor }}
              align="center"
              flexDir={isMobile ? "row" : "column"}
            >
              {icon && <Icon as={icon} mr={isMobile ? 2 : 0} mb={isMobile ? 0 : 1} color={disabledColor} />}
              <Text>{title}</Text>
            </Flex>
          </Tooltip>
        );
      }

      if (subItems) {
        return (
          <Menu key={title}>
            <MenuButton
              px={4}
              py={2}
              color={textColor}
              _hover={{ color: hoverColor }}
              _active={{ bg: bgActive, color: activeTextColor }}
            >
              <Flex align="center" flexDir={isMobile ? "row" : "row"}>
                {icon && <Icon as={icon} mr={2} />}
                <Text>{title}</Text>
                <Icon as={FiChevronDown} ml={1} />
              </Flex>
            </MenuButton>
            <MenuList>
              {subItems.map((subItem) => (
                <MenuItem
                  key={subItem.title}
                  as={RouterLink}
                  to={subItem.path}
                  color={textColor}
                  _hover={{ color: hoverColor, bg: "gray.100" }}
                  onClick={onClose}
                >
                  {subItem.title}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
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
          _hover={{ color: hoverColor }}
          activeProps={{
            style: { background: bgActive, color: activeTextColor },
          }}
          align="center"
          onClick={onClose}
        >
          {icon && <Icon as={icon} mr={2} />}
          <Text>{title}</Text>
        </Flex>
      );
    });

  return (
    <Flex align="center" gap={2} flexDir={isMobile ? "column" : "row"}>
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
        <Link href="https://cloud.thedataproxy.com">
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
        <Flex align="center" gap={4} display={{ base: "none", md: "flex" }}>
          <NavItems />
          {currentUser && (
            <Menu>
              <MenuButton
                px={4}
                py={2}
                color={textColor}
                _hover={{ color: hoverColor }}
              >
                <Flex align="center">
                  <Icon as={FiUser} mr={2} />
                  <Text maxW="200px" isTruncated>{currentUser.email}</Text>
                  <Icon as={FiChevronDown} ml={1} />
                </Flex>
              </MenuButton>
              <MenuList>
                <MenuItem
                  as={RouterLink}
                  to="/settings" // Adjust path as needed
                  color={textColor}
                  _hover={{ color: hoverColor, bg: "gray.100" }}
                >
                  Settings
                </MenuItem>
                <MenuItem
                  onClick={handleLogout}
                  color={textColor}
                  _hover={{ color: hoverColor, bg: "gray.100" }}
                >
                  Log out
                </MenuItem>
              </MenuList>
            </Menu>
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
              <Text color={textColor} fontSize="sm">
                Logged in as: {currentUser.email}
              </Text>
              <Flex flexDir="column" gap={2}>
                <Box
                  as={RouterLink}
                  to="/settings" // Adjust path as needed
                  p={2}
                  color={textColor}
                  _hover={{ color: hoverColor }}
                  onClick={onClose}
                >
                  Profile
                </Box>
                <Flex
                  as="button"
                  onClick={handleLogout}
                  color={hoverColor}
                  fontWeight="bold"
                  alignItems="center"
                  gap={2}
                >
                  <FiLogOut />
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