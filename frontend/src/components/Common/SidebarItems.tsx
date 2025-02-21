import { Box, Flex, Icon, Text, useColorModeValue } from "@chakra-ui/react";
import { useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import {
  FiHome,
  FiUsers,
  FiLayers,
} from "react-icons/fi";
import { FiMessageSquare,FiCpu, FiCalendar, FiFileText, FiSettings, FiTool, FiDatabase, FiGlobe, FiShield, FiCloud, FiMonitor, FiHelpCircle } from "react-icons/fi";

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
    title: "Scraping API",
    subItems: [
      { title: "Explore", path: "/scraping-api/explore" },
      { title: "Google SERP", path: "/scraping-api/google-serp-api" },
      { title: "Request Scraper", path: "/scraping-api/request" },
    ],
    icon: FiLayers,
  },
  
  {
    title: "Datasets",
    subItems: [
      { title: "Explore", path: "/datasets/explore" },
      { title: "Request Data", path: "/datasets/request" },
    ],
    icon: FiDatabase,
  },
  { title: "IconGpt", icon: FiCpu, path: "/ai/icongpt" },

    { title: "Messaging", icon: FiMessageSquare, path: "/messaging" },
    { title: "CMS Events", icon: FiCalendar, path: "/events" },
    { title: "Calendar", icon: FiCalendar, path: "/calendar" },
    { title: "News Feed", icon: FiFileText, path: "/news-feed" },
    { title: "Settings", icon: FiSettings, path: "/settings" },
  
    // Support & Tools Section
    { title: "Remote Desktop", icon: FiTool, path: "/support/remote-desktop" },
    { title: "FTP", icon: FiDatabase, path: "/support/ftp" },
    { title: "Network Logs", icon: FiFileText, path: "/support/network-logs" },
    { title: "System Logs", icon: FiFileText, path: "/support/system-logs" },
    { title: "File Explorer", icon: FiTool, path: "/support/file-explorer" },
    { title: "Email", icon: FiMessageSquare, path: "/support/email" },
    { title: "Video Conferencing", icon: FiGlobe, path: "/support/video-conferencing" },
    { title: "Cloud Storage", icon: FiCloud, path: "/support/cloud-storage" },
    { title: "VPN", icon: FiShield, path: "/support/vpn" },
    { title: "Firewall", icon: FiShield, path: "/support/firewall" },
    { title: "Backup & Recovery", icon: FiDatabase, path: "/support/backup-recovery" },
    { title: "Performance Monitoring", icon: FiMonitor, path: "/support/performance-monitoring" },
    { title: "Help & Support", icon: FiHelpCircle, path: "/support/help" },
  
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
