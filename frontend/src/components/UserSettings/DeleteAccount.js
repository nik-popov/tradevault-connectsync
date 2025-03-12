import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Button, Container, Heading, Text, useDisclosure, } from "@chakra-ui/react";
import DeleteConfirmation from "./DeleteConfirmation";
const DeleteAccount = () => {
    const confirmationModal = useDisclosure();
    return (_jsx(_Fragment, { children: _jsxs(Container, { maxW: "full", children: [_jsx(Heading, { size: "sm", py: 4, children: "Delete Account" }), _jsx(Text, { children: "Permanently delete your data and everything associated with your account." }), _jsx(Button, { variant: "danger", mt: 4, onClick: confirmationModal.onOpen, children: "Delete" }), _jsx(DeleteConfirmation, { isOpen: confirmationModal.isOpen, onClose: confirmationModal.onClose })] }) }));
};
export default DeleteAccount;
