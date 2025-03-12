import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Button, Container, Text } from "@chakra-ui/react";
import { Link } from "@tanstack/react-router";
const NotFound = () => {
    return (_jsx(_Fragment, { children: _jsxs(Container, { h: "100vh", alignItems: "stretch", justifyContent: "center", textAlign: "center", maxW: "sm", centerContent: true, children: [_jsx(Text, { fontSize: "8xl", color: "ui.main", fontWeight: "bold", lineHeight: "1", mb: 4, children: "404" }), _jsx(Text, { fontSize: "md", children: "Oops!" }), _jsx(Text, { fontSize: "md", children: "Page not found." }), _jsx(Button, { as: Link, to: "/", color: "ui.main", borderColor: "ui.main", variant: "outline", mt: 4, children: "Go back" })] }) }));
};
export default NotFound;
