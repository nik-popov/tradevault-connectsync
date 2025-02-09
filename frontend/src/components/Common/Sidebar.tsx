import { Box, Flex, Icon, Text, useColorModeValue } from "@chakra-ui/react";
import { useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import {
  FiBriefcase,
  FiHome,
  FiSettings,
  FiUsers,
  FiGlobe,
  FiDatabase,
  FiTool,
  FiLayers,
  FiMenu,
  FiLogOut,
} from "react-icons/fi";

import type { UserPublic } from "../../client";
import useAuth from "../../hooks/useAuth";

interface SidebarItem {
  title: string;
  icon?: any;
  path?: string;
  subItems?: SidebarItem[];
}

const sidebarStructure: SidebarItem[] = [
  { title: "Dashboard", icon: FiHome, path: "/" },
  {
    title: "Proxies",
    subItems: [
      { title: "Residential", path: "/proxies/residential" },
      { title: "Residential Mobile", path: "/proxies/residential-mobile" },
      { title: "Datacenter", path: "/proxies/datacenter" },
      { title: "Datacenter Mobile", path: "/proxies/datacenter-mobile" },
      { title: "Browser Proxy", path: "/proxies/browser" },
      { title: "Pricing", path: "/proxies/pricing" },
    ],
    icon: FiGlobe,
  },
  {
    title: "Scraping API",
    subItems: [
      { title: "Explore", path: "/scraping-api/explore" },
      { title: "Add More", path: "/scraping-api/add-more" },
      { title: "Pricing", path: "/scraping-api/pricing" },
    ],
    icon: FiLayers,
  },
  {
    title: "Tools",
    subItems: [
      { title: "Add", path: "/tools/add-1" },
      { title: "Add", path: "/tools/add-2" },
      { title: "Add", path: "/tools/add-3" },
    ],
    icon: FiTool,
  },
  {
    title: "Datasets",
    subItems: [
      { title: "Explore", path: "/datasets/explore" },
      { title: "Request Dataset", path: "/datasets/request" },
      { title: "Realtime", path: "/datasets/realtime" },
    ],
    icon: FiDatabase,
  },
  { title: "Settings", icon: FiSettings, path: "/settings" },
  { title: "Items", icon: FiBriefcase, path: "/items" },
  { title: "Help & Support", icon: FiUsers, path: "help-support" },
];

interface SidebarItemsProps {
  onClose?: () => void;
}

const SidebarItems = ({ onClose }: SidebarItemsProps) => {
  const queryClient = useQueryClient();
  const textColor = useColorModeValue("ui.dark", "ui.light");
  const bgActive = useColorModeValue("#CBD5E0", "#2D3748");
  const hoverBg = useColorModeValue("#E2E8F0", "#4A5568");
  const currentUser = queryClient.getQueryData<UserPublic>(["currentUser"]);
  const { logout } = useAuth();

  const finalSidebarStructure = [...sidebarStructure];
  if (currentUser?.is_superuser && !finalSidebarStructure.some(item => item.title === "Admin")) {
    finalSidebarStructure.push({ title: "Admin", icon: FiUsers, path: "/admin" });
  }

  const handleLogout = async () => {
    logout();
  };

  const renderItems = (items: SidebarItem[]) =>
    items.map(({ icon, title, path, subItems }) => (
      <Box key={title}>
        {path ? (
          <Flex
            as={Link}
            to={path}
            w="100%"
            p={3}
            borderRadius="md"
            _hover={{ background: hoverBg }}
            activeProps={{
              style: { background: bgActive, borderRadius: "12px" },
            }}
            color={textColor}
            onClick={onClose}
          >
            {icon && <Icon as={icon} alignSelf="center" mr={3} />}
            <Text>{title}</Text>
          </Flex>
        ) : (
          <Box>
            <Flex p={3} fontWeight="bold" color={textColor}>
              {icon && <Icon as={icon} alignSelf="center" mr={3} />}
              <Text>{title}</Text>
            </Flex>
            <Box ml={6}>{subItems && renderItems(subItems)}</Box>
          </Box>
        )}
      </Box>
    ));

  return (
    <Box>
      {renderItems(finalSidebarStructure)}
      <Flex
        as="button"
        onClick={handleLogout}
        p={3}
        borderRadius="md"
        _hover={{ background: hoverBg }}
        color="ui.danger"
        fontWeight="bold"
        alignItems="center"
      >
        <FiLogOut />
        <Text ml={2}>Log out</Text>
      </Flex>
    </Box>
  );
};

export default SidebarItems;
