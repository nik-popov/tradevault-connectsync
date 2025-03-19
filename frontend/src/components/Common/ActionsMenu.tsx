import {
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useDisclosure,
} from "@chakra-ui/react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FiEdit, FiTrash } from "react-icons/fi";

import type { ItemPublic, UserPublic } from "../../client";
import EditUser from "../Admin/EditUser";
import EditItem from "../Items/EditItem";
import Delete from "./DeleteAlert";

// Define specific prop types for each case
interface UserActionsMenuProps {
  type: "User";
  value: UserPublic; // Use UserPublic or ExtendedUserPublic based on your needs
  disabled?: boolean;
}

interface ItemActionsMenuProps {
  type: "Item";
  value: ItemPublic;
  disabled?: boolean;
}

// Union type for ActionsMenuProps
type ActionsMenuProps = UserActionsMenuProps | ItemActionsMenuProps;

const ActionsMenu = ({ type, value, disabled }: ActionsMenuProps) => {
  const editModal = useDisclosure(); // Renamed for clarity
  const deleteModal = useDisclosure();

  return (
    <>
      <Menu>
        <MenuButton
          isDisabled={disabled}
          as={Button}
          rightIcon={<BsThreeDotsVertical />}
          variant="unstyled"
        />
        <MenuList>
          <MenuItem
            onClick={editModal.onOpen}
            icon={<FiEdit fontSize="16px" />}
          >
            Edit {type}
          </MenuItem>
          <MenuItem
            onClick={deleteModal.onOpen}
            icon={<FiTrash fontSize="16px" />}
            color="ui.danger"
          >
            Delete {type}
          </MenuItem>
        </MenuList>
        {type === "User" ? (
          <EditUser
            user={value} // TypeScript knows value is UserPublic
            isOpen={editModal.isOpen}
            onClose={editModal.onClose}
          />
        ) : (
          <EditItem
            item={value} // TypeScript knows value is ItemPublic
            isOpen={editModal.isOpen}
            onClose={editModal.onClose}
          />
        )}
        <Delete
          type={type}
          id={value.id}
          isOpen={deleteModal.isOpen}
          onClose={deleteModal.onClose}
        />
      </Menu>
    </>
  );
};

export default ActionsMenu;