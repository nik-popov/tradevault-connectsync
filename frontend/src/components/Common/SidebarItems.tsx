import { Box, Flex, Icon, Text, useColorModeValue, Tooltip, Menu, MenuButton, MenuList, MenuItem } from "@chakra-ui/react";
import { useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import {
  FiHome,
  FiUsers,
  FiGlobe,
  FiChevronDown,
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
      {title : 'Submit Batch',path: " /scraping-api/submit-form/google-serp" },
      { title: "Proxies", path: "/scraping-api/search-proxies" },
    ],
    icon: FiGlobe,
  },
];

const NavItems = () => {  // Changed name from SidebarItems
  const queryClient = useQueryClient();
  const textColor = "gray.800";
  const disabledColor = "gray.300";
  const hoverColor = "blue.600";
  const bgActive = "blue.100";
  const activeTextColor = "blue.800";
  const currentUser = queryClient.getQueryData<UserPublic>(["currentUser"]);

  const finalSidebarStructure = [...sidebarStructure];
  if (currentUser?.is_superuser && !finalSidebarStructure.some(item => item.title === "Admin")) {
    finalSidebarStructure.push({ title: "Admin", icon: FiUsers, path: "/admin" });
  }

  const isEnabled = (title: string) =>
    ["Dashboard", "Scraping", "Admin"].includes(title) ||
    (title === "Jobs" && 
      finalSidebarStructure.some(item => 
        item.title === "Scraping" && 
        item.subItems?.some(sub => sub.title === "Jobs")
      )) ||
    (title === "Proxies" && 
      finalSidebarStructure.some(item => 
        item.title === "Scraping" && 
        item.subItems?.some(sub => sub.title === "Proxies")
      ));

  const renderItems = (items: SidebarItem[]) =>
    items.map(({ icon, title, path, subItems }) => {
      const enabled = isEnabled(title);
      
      if (!enabled) {
        return (
          <Tooltip key={title} label="Restricted" placement="bottom">
            <Flex
              px={4}
              py={2}
              color={disabledColor}
              cursor="not-allowed"
              _hover={{ color: hoverColor }}
              align="center"
            >
              {icon && <Icon as={icon} mr={2} color={disabledColor} />}
              <Text>{title}</Text>
            </Flex>
          </Tooltip>
        );
      }

      if (subItems) {
        return (
          <Menu key={title}>
            <MenuButton
              px={4}
              py={2}
              color={textColor}
              _hover={{ color: hoverColor }}
              _active={{ bg: bgActive, color: activeTextColor }}
            >
              <Flex align="center">
                {icon && <Icon as={icon} mr={2} />}
                <Text>{title}</Text>
                <Icon as={FiChevronDown} ml={1} />
              </Flex>
            </MenuButton>
            <MenuList>
              {subItems.map((subItem) => (
                <MenuItem
                  key={subItem.title}
                  as={Link}
                  to={subItem.path}
                  color={textColor}
                  _hover={{ color: hoverColor, bg: "gray.100" }}
                >
                  {subItem.title}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
        );
      }

      return (
        <Flex
          key={title}
          as={Link}
          to={path}
          px={4}
          py={2}
          color={textColor}
          _hover={{ color: hoverColor }}
          activeProps={{
            style: { background: bgActive, color: activeTextColor },
          }}
          align="center"
        >
          {icon && <Icon as={icon} mr={2} />}
          <Text>{title}</Text>
        </Flex>
      );
    });

  return (
    <Flex align="center" gap={2}>
      {renderItems(finalSidebarStructure)}
    </Flex>
  );
};

export default NavItems;