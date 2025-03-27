// src/pages/GoogleSerpPage.tsx
import { createFileRoute } from "@tanstack/react-router";
import { Container, Flex, Text, Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import ProtectedComponent from "../components/ProtectedComponent"; // Adjust the import path
import OverviewGSerp from "../../../components/OverviewGSerp";
import LogsGSerp from "../../../components/LogsGSerp";
import PlaygroundGSerp from "../../../components/PlaygroundGSerp";
import ApiKeyGSerp from "../../../components/ApiKeyGSerp";
import WhitelistGSerp from "../../../components/WhitelistGSerp";

const GoogleSerpPage = () => {
  const tabsConfig = [
    // { title: "Overview", component: () => <OverviewGSerp /> },
    { title: "API Keys", component: () => <ApiKeyGSerp /> },
    { title: "Playground", component: () => <PlaygroundGSerp /> },
  ];

  return (
    <ProtectedComponent>
      <Container maxW="full">
        <Flex align="center" justify="space-between" py={6}>
          <Text fontSize="xl" fontWeight="bold">Https Proxy API</Text>
          <Text fontSize="sm">Manage your Google SERP settings and endpoints.</Text>
        </Flex>
        <Tabs variant="enclosed">
          <TabList>
            {tabsConfig.map((tab, index) => (
              <Tab key={index}>{tab.title}</Tab>
            ))}
          </TabList>
          <TabPanels>
            {tabsConfig.map((tab, index) => (
              <TabPanel key={index}>{tab.component()}</TabPanel>
            ))}
          </TabPanels>
        </Tabs>
      </Container>
    </ProtectedComponent>
  );
};

export const Route = createFileRoute("/_layout/scraping-api/google-serp")({
  component: GoogleSerpPage,
});

export default GoogleSerpPage;