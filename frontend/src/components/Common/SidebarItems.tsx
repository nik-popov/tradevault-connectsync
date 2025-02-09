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
} from "react-icons/fi";

import type { UserPublic } from "../../client";

const sidebarStructure = [
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
  { title: "Help & Support", icon: FiUsers, path: "/help-support" },
];

interface SidebarItemsProps {
  onClose?: () => void;
}

const SidebarItems = ({ onClose }: SidebarItemsProps) => {
  const queryClient = useQueryClient();
  const textColor = useColorModeValue("ui.main", "ui.light");
  const bgActive = useColorModeValue("#E2E8F0", "#4A5568");
  const currentUser = queryClient.getQueryData<UserPublic>(["currentUser"]);

  if (currentUser?.is_superuser) {
    sidebarStructure.push({ title: "Admin", icon: FiUsers, path: "/admin" });
  }

  const renderItems = (items) =>
    items.map(({ icon, title, path, subItems }) => (
      <Box key={title}>
        {path ? (
          <Flex
            as={Link}
            to={path}
            w="100%"
            p={2}
            activeProps={{
              style: { background: bgActive, borderRadius: "12px" },
            }}
            color={textColor}
            onClick={onClose}
          >
            <Icon as={icon} alignSelf="center" />
            <Text ml={2}>{title}</Text>
          </Flex>
        ) : (
          <Box>
            <Flex p={2} color={textColor} fontWeight="bold">
              <Icon as={icon} alignSelf="center" />
              <Text ml={2}>{title}</Text>
            </Flex>
            <Box ml={6}>{renderItems(subItems)}</Box>
          </Box>
        )}
      </Box>
    ));

  return <Box>{renderItems(sidebarStructure)}</Box>;
};

export default SidebarItems;
