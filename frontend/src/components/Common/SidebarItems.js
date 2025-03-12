import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, Flex, Icon, Text, useColorModeValue, Tooltip } from "@chakra-ui/react";
import { useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { FiHome, FiUsers, FiLayers, FiMessageSquare, FiCpu, FiMusic, FiWifi, FiCalendar, FiFileText, FiTool, FiDatabase, FiGlobe, FiShield, FiCloud, FiMonitor, FiHelpCircle, } from "react-icons/fi";
const sidebarStructure = [
    { title: "Dashboard", icon: FiHome, path: "/" },
    {
        title: "Scraping",
        subItems: [
            { title: "Jobs", path: "/scraping-api/explore" },
            { title: "Proxies", path: "/scraping-api/search-proxies" },
            { title: "Vision", path: "/scraping-api/vision" },
            { title: "Reasoning", path: "/scraping-api/language-model" },
            { title: "User Agents", path: "/scraping-api/user-agents" },
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
    { title: "Remote Desktop", icon: FiTool, path: "/support/remote-desktop" },
    { title: "FTP", icon: FiDatabase, path: "/support/ftp" },
    { title: "Network Logs", icon: FiFileText, path: "/support/network-logs" },
    { title: "System Logs", icon: FiFileText, path: "/support/system-logs" },
    { title: "File Explorer", icon: FiTool, path: "/support/file-explorer" },
    { title: "Email", icon: FiMessageSquare, path: "/support/email" },
    { title: "Video Conferencing", icon: FiGlobe, path: "/support/video-conferencing" },
    { title: "Cloud Storage", icon: FiCloud, path: "/support/cloud-storage" },
    { title: "VPN", icon: FiShield, path: "/support/vpn" },
    { title: "Hotspot", icon: FiWifi, path: "/hotspots" },
    { title: "Sonos", icon: FiMusic, path: "/sonos" },
    { title: "Firewall", icon: FiShield, path: "/support/firewall" },
    { title: "Backup & Recovery", icon: FiDatabase, path: "/support/backup-recovery" },
    { title: "Performance Monitoring", icon: FiMonitor, path: "/support/performance-monitoring" },
    { title: "Help & Support", icon: FiHelpCircle, path: "/support/help" },
];
const SidebarItems = ({ onClose }) => {
    const queryClient = useQueryClient();
    const textColor = useColorModeValue("ui.main", "ui.light");
    const disabledColor = useColorModeValue("gray.400", "gray.600");
    const hoverColor = useColorModeValue("gray.500", "gray.500"); // Slightly darker/lighter on hover
    const bgActive = useColorModeValue("#E2E8F0", "#4A5568");
    const currentUser = queryClient.getQueryData(["currentUser"]);
    const finalSidebarStructure = [...sidebarStructure];
    if (currentUser?.is_superuser && !finalSidebarStructure.some(item => item.title === "Admin")) {
        finalSidebarStructure.push({ title: "Admin", icon: FiUsers, path: "/admin" });
    }
    const isEnabled = (title) => ["Dashboard", "Scraping", "IconGpt", "Admin"].includes(title) ||
        (title === "Jobs" &&
            finalSidebarStructure.some(item => item.title === "Scraping" &&
                item.subItems?.some(sub => sub.title === "Jobs"))) ||
        (title === "Request" &&
            finalSidebarStructure.some(item => item.title === "Scraping" &&
                item.subItems?.some(sub => sub.title === "Request"))) ||
        (title === "Proxies" &&
            finalSidebarStructure.some(item => item.title === "Scraping" &&
                item.subItems?.some(sub => sub.title === "Proxies")))
        ||
            (title === "User Agents" &&
                finalSidebarStructure.some(item => item.title === "Scraping" &&
                    item.subItems?.some(sub => sub.title === "User Agents")));
    ;
    const renderItems = (items) => items.map(({ icon, title, path, subItems }) => {
        const enabled = isEnabled(title);
        return (_jsx(Box, { children: path ? (enabled ? (_jsxs(Flex, { as: Link, to: path, w: "100%", p: 2, activeProps: {
                    style: { background: bgActive, borderRadius: "12px" },
                }, color: textColor, onClick: onClose, children: [icon && _jsx(Icon, { as: icon, alignSelf: "center" }), _jsx(Text, { ml: 2, children: title })] })) : (_jsx(Tooltip, { label: "You do not have access to this resource", placement: "right", children: _jsxs(Flex, { w: "100%", p: 2, color: disabledColor, cursor: "not-allowed", _hover: { color: hoverColor }, children: [icon && _jsx(Icon, { as: icon, alignSelf: "center", color: disabledColor }), _jsx(Text, { ml: 2, color: disabledColor, children: title })] }) }))) : (_jsxs(Box, { children: [_jsxs(Flex, { p: 2, color: enabled ? textColor : disabledColor, fontWeight: "bold", children: [icon && _jsx(Icon, { as: icon, alignSelf: "center", color: enabled ? textColor : disabledColor }), _jsx(Text, { ml: 2, color: enabled ? textColor : disabledColor, children: title })] }), _jsx(Box, { ml: 6, children: subItems && renderItems(subItems) })] })) }, title));
    });
    return _jsx(Box, { children: renderItems(finalSidebarStructure) });
};
export default SidebarItems;
