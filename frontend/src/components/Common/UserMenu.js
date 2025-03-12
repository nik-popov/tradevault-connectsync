import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Box, IconButton, Menu, MenuButton, MenuItem, MenuList, } from "@chakra-ui/react";
import { Link } from "@tanstack/react-router";
import { FaUserSecret } from "react-icons/fa";
import { FiLogOut, FiUser } from "react-icons/fi";
import useAuth from "../../hooks/useAuth";
const UserMenu = () => {
    const { logout } = useAuth();
    const handleLogout = async () => {
        logout();
    };
    return (_jsx(_Fragment, { children: _jsx(Box, { display: { base: "none", md: "block" }, position: "fixed", top: 4, right: 4, children: _jsxs(Menu, { children: [_jsx(MenuButton, { as: IconButton, "aria-label": "Options", icon: _jsx(FaUserSecret, { color: "white", fontSize: "18px" }), bg: "ui.main", isRound: true, "data-testid": "user-menu" }), _jsxs(MenuList, { children: [_jsx(MenuItem, { icon: _jsx(FiUser, { fontSize: "18px" }), as: Link, to: "settings", children: "Settings" }), _jsx(MenuItem, { icon: _jsx(FiLogOut, { fontSize: "18px" }), onClick: handleLogout, color: "ui.danger", fontWeight: "bold", children: "Log out" })] })] }) }) }));
};
export default UserMenu;
