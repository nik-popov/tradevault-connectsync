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
      { title: "Google SERP Results", path: "/scraping-api/google-serp-api" },
      { title: "Google SERP Images", path: "/scraping-api/google-images-serp-api" },     
      { title: "Pricing", path: "/scraping-api/pricing" },
    ],
    icon: FiLayers,
  },
  {
    title: "Datasets",
    subItems: [
      { title: "Explore", path: "/datasets/explore" },
      { title: "Pricing", path: "/datasets/pricing" },
      { title: "Request Data", path: "/datasets/request" },
    ],
    icon: FiDatabase,
  },
  { title: "Settings", icon: FiSettings, path: "/settings" },
  { title: "Billing", icon: FiBriefcase, path: "/items" },
  { title: "Help & Support", icon: FiTool, path: "/help-support" },
];

interface SidebarItemsProps {
  onClose?: () => void;
}

const SidebarItems = ({ onClose }: SidebarItemsProps) => {
  const queryClient = useQueryClient();
  const textColor = useColorModeValue("ui.main", "ui.light");
  const bgActive = useColorModeValue("#E2E8F0", "#4A5568");
  const currentUser = queryClient.getQueryData<UserPublic>(["currentUser"]);

  const finalSidebarStructure = [...sidebarStructure];
  if (currentUser?.is_superuser && !finalSidebarStructure.some(item => item.title === "Admin")) {
    finalSidebarStructure.push({ title: "Admin", icon: FiUsers, path: "/admin" });
  }

  const renderItems = (items: SidebarItem[]) =>
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
            {icon && <Icon as={icon} alignSelf="center" />}
            <Text ml={2}>{title}</Text>
          </Flex>
        ) : (
          <Box>
            <Flex p={2} color={textColor} fontWeight="bold">
              {icon && <Icon as={icon} alignSelf="center" />}
              <Text ml={2}>{title}</Text>
            </Flex>
            <Box ml={6}>{subItems && renderItems(subItems)}</Box>
          </Box>
        )}
      </Box>
    ));

  return <Box>{renderItems(finalSidebarStructure)}</Box>;
};

export default SidebarItems;
