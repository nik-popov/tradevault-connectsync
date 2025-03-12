import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Button, Flex, Icon, useDisclosure } from "@chakra-ui/react";
import { FaPlus } from "react-icons/fa";
const Navbar = ({ type, addModalAs }) => {
    const addModal = useDisclosure();
    const AddModal = addModalAs;
    return (_jsx(_Fragment, { children: _jsxs(Flex, { py: 8, gap: 4, children: [_jsxs(Button, { variant: "primary", gap: 1, fontSize: { base: "sm", md: "inherit" }, onClick: addModal.onOpen, children: [_jsx(Icon, { as: FaPlus }), " Add ", type] }), _jsx(AddModal, { isOpen: addModal.isOpen, onClose: addModal.onClose })] }) }));
};
export default Navbar;
