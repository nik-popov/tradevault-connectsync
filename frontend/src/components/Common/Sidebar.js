import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Box, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerOverlay, Flex, IconButton, Image, Link, Text, useColorModeValue, useDisclosure, } from "@chakra-ui/react";
import { useQueryClient } from "@tanstack/react-query";
import { FiLogOut, FiMenu } from "react-icons/fi";
import Logo from "/assets/images/icon-luxury-logo.svg";
import useAuth from "../../hooks/useAuth";
import SidebarItems from "./SidebarItems";
const Sidebar = () => {
    const queryClient = useQueryClient();
    const bgColor = useColorModeValue("ui.light", "ui.dark");
    const textColor = useColorModeValue("ui.dark", "ui.light");
    const secBgColor = useColorModeValue("ui.secondary", "ui.darkSlate");
    const currentUser = queryClient.getQueryData(["currentUser"]);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { logout } = useAuth();
    const handleLogout = async () => {
        logout();
    };
    // GitHubLogo displays only the GitHub logo as a clickable link
    const GitHubLogo = () => (_jsx(Link, { href: "https://github.com/iconluxurygroupNet", target: "_blank", rel: "noopener noreferrer", children: _jsx(Image, { src: "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png", alt: "GitHub Logo", boxSize: "32px" }) }));
    return (_jsxs(_Fragment, { children: [_jsx(IconButton, { onClick: onOpen, display: { base: "flex", md: "none" }, "aria-label": "Open Menu", position: "absolute", fontSize: "20px", m: 4, icon: _jsx(FiMenu, {}) }), _jsxs(Drawer, { isOpen: isOpen, placement: "left", onClose: onClose, children: [_jsx(DrawerOverlay, {}), _jsxs(DrawerContent, { maxW: "250px", children: [_jsx(DrawerCloseButton, {}), _jsx(DrawerBody, { py: 8, children: _jsxs(Flex, { flexDir: "column", justify: "space-between", h: "100%", children: [_jsxs(Box, { children: [_jsx(Link, { href: "https://dashboard.iconluxury.group", children: _jsx(Image, { src: Logo, alt: "Logo", p: 6 }) }), _jsx(SidebarItems, { onClose: onClose }), _jsxs(Flex, { as: "button", onClick: handleLogout, p: 2, color: "ui.danger", fontWeight: "bold", alignItems: "center", children: [_jsx(FiLogOut, {}), _jsx(Text, { ml: 2, children: "Log out" })] })] }), _jsx(Box, { mt: 4, children: _jsx(GitHubLogo, {}) })] }) })] })] }), _jsx(Box, { bg: bgColor, p: 3, h: "100%", position: "sticky", top: "0", display: { base: "none", md: "flex" }, children: _jsxs(Flex, { flexDir: "column", justify: "space-between", bg: secBgColor, p: 4, borderRadius: 12, w: "250px", children: [_jsxs(Box, { children: [_jsx(Link, { href: "https://dashboard.iconluxury.group", children: _jsx(Image, { src: Logo, alt: "Logo", w: "180px", maxW: "2xs", p: 6 }) }), _jsx(SidebarItems, {})] }), _jsxs(Box, { children: [currentUser?.email && (_jsxs(Text, { color: textColor, noOfLines: 2, fontSize: "sm", p: 2, maxW: "180px", children: ["Logged in as: ", currentUser.email] })), _jsx(GitHubLogo, {})] })] }) })] }));
};
export default Sidebar;
