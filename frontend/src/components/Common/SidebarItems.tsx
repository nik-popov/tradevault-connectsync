import { Box, Flex, Icon, Text, useColorModeValue, Tooltip } from "@chakra-ui/react";
import { useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import {
  FiHome,
  FiUsers,
  FiLayers,
  FiMessageSquare,
  FiCpu,
  FiMusic,
  FiWifi,
  FiCalendar,
  FiFileText,
  FiSettings,
  FiTool,
  FiDatabase,
  FiGlobe,
  FiShield,
  FiCloud,
  FiMonitor,
  FiHelpCircle,
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
    title: "Scraping",
    subItems: [
      { title: "Jobs", path: "/scraping-api/explore" },
      { title: "Proxies", path: "/scraping-api/search-proxies" },
      { title: "Vision", path: "/scraping-api/vision" },
      { title: "Reasoning", path: "/scraping-api/language-model" },

    ],
    icon: FiLayers,
  },
  { title: "Remote Desktop", icon: FiTool, path: "/support/remote-desktop" },
  { title: "FTP", icon: FiDatabase, path: "/support/ftp" },
  { title: "Network Logs", icon: FiFileText, path: "/support/network-logs" },
  { title: "System Logs", icon: FiFileText, path: "/support/system-logs" },
  { title: "File Explorer", icon: FiTool, path: "/support/file-explorer" },
  { title: "Email", icon: FiMessageSquare, path: "/support/email" },
  { title: "Cloud Storage", icon: FiCloud, path: "/support/cloud-storage" },
  { title: "VPN", icon: FiShield, path: "/support/vpn" },
  { title: "Hotspot", icon: FiWifi, path: "/hotspots" },
  // { title: "Sonos", icon: FiMusic, path: "/sonos" },
  { title: "Firewall", icon: FiShield, path: "/support/firewall" },
  { title: "Backup & Recovery", icon: FiDatabase, path: "/support/backup-recovery" },
];

interface SidebarItemsProps {
  onClose?: () => void;
}

const SidebarItems = ({ onClose }: SidebarItemsProps) => {
  const queryClient = useQueryClient();
  const textColor = useColorModeValue("ui.main", "ui.light");
  const disabledColor = useColorModeValue("gray.400", "gray.600");
  const hoverColor = useColorModeValue("gray.500", "gray.500"); // Slightly darker/lighter on hover
  const bgActive = useColorModeValue("#E2E8F0", "#4A5568");
  const currentUser = queryClient.getQueryData<UserPublic>(["currentUser"]);

  const finalSidebarStructure = [...sidebarStructure];
  if (currentUser?.is_superuser && !finalSidebarStructure.some(item => item.title === "Admin")) {
    finalSidebarStructure.push({ title: "Admin", icon: FiUsers, path: "/admin" });
  }
  const isEnabled = (title: string) =>
    ["Dashboard", "Scraping","Admin"].includes(title) ||
    (title === "Jobs" && 
      finalSidebarStructure.some(item => 
        item.title === "Scraping" && 
        item.subItems?.some(sub => sub.title === "Jobs")
      )) ||
    (title === "Proxies" && 
      finalSidebarStructure.some(item => 
        item.title === "Scraping" && 
        item.subItems?.some(sub => sub.title === "Proxies")
      ))
      ||
      (title === "User Agents" && 
        finalSidebarStructure.some(item => 
          item.title === "Scraping" && 
          item.subItems?.some(sub => sub.title === "User Agents")
        ));;
  const renderItems = (items: SidebarItem[]) =>
    items.map(({ icon, title, path, subItems }) => {
      const enabled = isEnabled(title);
      return (
        <Box key={title}>
          {path ? (
            enabled ? (
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
              <Tooltip label="You do not have access to this resource" placement="right">
                <Flex
                  w="100%"
                  p={2}
                  color={disabledColor}
                  cursor="not-allowed"
                  _hover={{ color: hoverColor }}
                >
                  {icon && <Icon as={icon} alignSelf="center" color={disabledColor} />}
                  <Text ml={2} color={disabledColor}>{title}</Text>
                </Flex>
              </Tooltip>
            )
          ) : (
            <Box>
              <Flex p={2} color={enabled ? textColor : disabledColor} fontWeight="bold">
                {icon && <Icon as={icon} alignSelf="center" color={enabled ? textColor : disabledColor} />}
                <Text ml={2} color={enabled ? textColor : disabledColor}>{title}</Text>
              </Flex>
              <Box ml={6}>{subItems && renderItems(subItems)}</Box>
            </Box>
          )}
        </Box>
      );
    });

  return <Box>{renderItems(finalSidebarStructure)}</Box>;
};

export default SidebarItems;