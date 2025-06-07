import {
  Box,
  Flex,
  Icon,
  Text,
  IconButton,
  Image,
  Link,
  Tooltip,
  useDisclosure,
} from "@chakra-ui/react";
import { useQueryClient } from "@tanstack/react-query";
import { Link as RouterLink } from "@tanstack/react-router";
import { FiLogOut, FiMenu, FiUsers } from "react-icons/fi";
import { MdPerson } from "react-icons/md";

import Logo from "../Common/Logo"
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

const navStructure: NavItem[] = [];

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
          <Box key={title}>
            <Flex
              px={4}
              py={2}
              color={textColor}
              _hover={{ color: hoverColor }}
              align="center"
              flexDir={isMobile ? "row" : "row"}
            >
              {icon && <Icon as={icon} mr={2} />}
              <Text>{title}</Text>
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
              <Text color={textColor} fontSize="sm">
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