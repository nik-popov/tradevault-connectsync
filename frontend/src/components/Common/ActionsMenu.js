import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Button, Menu, MenuButton, MenuItem, MenuList, useDisclosure, } from "@chakra-ui/react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FiEdit, FiTrash } from "react-icons/fi";
import EditUser from "../Admin/EditUser";
import EditItem from "../Items/EditItem";
import Delete from "./DeleteAlert";
const ActionsMenu = ({ type, value, disabled }) => {
    const editUserModal = useDisclosure();
    const deleteModal = useDisclosure();
    return (_jsx(_Fragment, { children: _jsxs(Menu, { children: [_jsx(MenuButton, { isDisabled: disabled, as: Button, rightIcon: _jsx(BsThreeDotsVertical, {}), variant: "unstyled" }), _jsxs(MenuList, { children: [_jsxs(MenuItem, { onClick: editUserModal.onOpen, icon: _jsx(FiEdit, { fontSize: "16px" }), children: ["Edit ", type] }), _jsxs(MenuItem, { onClick: deleteModal.onOpen, icon: _jsx(FiTrash, { fontSize: "16px" }), color: "ui.danger", children: ["Delete ", type] })] }), type === "User" ? (_jsx(EditUser, { user: value, isOpen: editUserModal.isOpen, onClose: editUserModal.onClose })) : (_jsx(EditItem, { item: value, isOpen: editUserModal.isOpen, onClose: editUserModal.onClose })), _jsx(Delete, { type: type, id: value.id, isOpen: deleteModal.isOpen, onClose: deleteModal.onClose })] }) }));
};
export default ActionsMenu;
