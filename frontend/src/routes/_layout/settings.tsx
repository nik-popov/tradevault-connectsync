import React from "react";
import {
  Container,
  Heading,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";

import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import type { UserPublic } from "../../client";
import Appearance from "../../components/UserSettings/Appearance";
import ChangePassword from "../../components/UserSettings/ChangePassword";
import DeleteAccount from "../../components/UserSettings/DeleteAccount";
import UserInformation from "../../components/UserSettings/UserInformation";
import Billing from "../../components/UserSettings/Billing";
import SubscriptionManagement from "../../components/UserSettings/SubscriptionManagement"; // ✅ Corrected Import

const tabsConfig = [
  { title: "My profile", component: UserInformation },
  { title: "Password", component: ChangePassword },
  { title: "Appearance", component: Appearance },
  { title: "Billing", component: Billing },
  { title: "Subscription", component: () => <SubscriptionManagement product="Residential" /> }, // ✅ Pass product name
  { title: "Danger zone", component: DeleteAccount },
];

export const Route = createFileRoute("/_layout/settings")({
  component: UserSettings,
});

function UserSettings() {
  const queryClient = useQueryClient();
  const currentUser = queryClient.getQueryData<UserPublic>(["currentUser"]);

  if (!currentUser) {
    return <p>Loading user data...</p>;
  }

  const finalTabs = currentUser?.is_superuser
    ? [...tabsConfig.slice(0, 3), tabsConfig[4]] // Ensures Subscription tab is included for superusers
    : tabsConfig;

  return (
    <Container maxW="full">
      <Heading size="lg" textAlign={{ base: "center", md: "left" }} py={12}>
        User Settings
      </Heading>
      <Tabs variant="enclosed">
        <TabList>
          {finalTabs.map((tab, index) => (
            <Tab key={index}>{tab.title}</Tab>
          ))}
        </TabList>
        <TabPanels>
          {finalTabs.map((tab, index) => (
            <TabPanel key={index}>
              {React.createElement(tab.component)}
            </TabPanel>
          ))}
        </TabPanels>
      </Tabs>
    </Container>
  );
}

export default UserSettings;
