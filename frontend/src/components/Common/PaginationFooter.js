import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Button, Flex } from "@chakra-ui/react";
export function PaginationFooter({ hasNextPage, hasPreviousPage, onChangePage, page, }) {
    return (_jsxs(Flex, { gap: 4, alignItems: "center", mt: 4, direction: "row", justifyContent: "flex-end", children: [_jsx(Button, { onClick: () => onChangePage(page - 1), isDisabled: !hasPreviousPage || page <= 1, children: "Previous" }), _jsxs("span", { children: ["Page ", page] }), _jsx(Button, { isDisabled: !hasNextPage, onClick: () => onChangePage(page + 1), children: "Next" })] }));
}
