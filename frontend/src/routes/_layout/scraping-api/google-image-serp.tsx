import { createFileRoute } from "@tanstack/react-router";
import { Container, Box, Text, Flex, Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import ProxySettings from "../../../components/EndpointSettings";
import ProxyUsage from "../../../components/Usage";
import Overview from "../../../components/Overview";

const GoogleImageSerp = () => {
  const tabsConfig = [
    { title: "Overview", component: () => <Overview toolId="google-image-serp" /> },
    { title: "Endpoint Status", component: () => <ProxySettings /> },
    { title: "Usage", component: () => <ProxyUsage /> },
  ];

  return (
    <Container maxW="full">
      <Flex align="center" justify="space-between" py={6} flexWrap="wrap" gap={4}>
        <Box textAlign="left" flex="1">
          <Text fontSize="xl" fontWeight="bold">Google Image SERP API</Text>
          <Text fontSize="sm">Manage your Google Image SERP settings.</Text>
        </Box>
      </Flex>
      <Tabs variant="enclosed">
        <TabList>
          {tabsConfig.map((tab, index) => <Tab key={index}>{tab.title}</Tab>)}
        </TabList>
        <TabPanels>
          {tabsConfig.map((tab, index) => (
            <TabPanel key={index}>{tab.component()}</TabPanel>
          ))}
        </TabPanels>
      </Tabs>
    </Container>
  );
};

export const Route = createFileRoute("/_layout/scraping-api/google-image-serp")({
  component: GoogleImageSerp,
});

export default GoogleImageSerp;