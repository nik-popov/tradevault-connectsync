import { createFileRoute } from "@tanstack/react-router";
import { Container, Flex, Text, Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import EndpointSettings from "../../../components/EndpointSettings";
import ProxyUsage from "../../../components/Usage";
import Overview from "../../../components/Overview";
import UserAgentDashboard from "./user-agents";

// Define all Google SERP-specific endpoints
const endpointData = {
    "G-CLOUD-US-CENTRAL1": "https://us-central1-image-scraper-451516.cloudfunctions.net/main",
    "G-CLOUD-US-EAST1": "https://us-east1-image-scraper-451516.cloudfunctions.net/main",
    "G-CLOUD-EUROPE-WEST4": "https://europe-west4-image-scraper-451516.cloudfunctions.net/main",
    "G-CLOUD-US-EAST4": "https://us-east4-image-scraper-451516.cloudfunctions.net/main",
    "G-CLOUD-US-WEST1": "https://us-west1-image-scraper-451516.cloudfunctions.net/main",
    "G-CLOUD-SOUTHAMERICA-WEST1": "https://southamerica-west1-image-scraper-451516.cloudfunctions.net/main",


  }
const GoogleSerpPage = () => {
  const googleSerpEndpoints = Object.entries(endpointData).map(([id, url]) => ({
        endpointId: id,
        url,
      }))
  const tabsConfig = [
    { title: "Overview", component: () => <Overview endpointId="google-serp" /> },
    { title: "Endpoint Status", component: () => <EndpointSettings endpoints={googleSerpEndpoints} /> },
    { title: "Usage", component: () => <ProxyUsage /> },
    { title: "User Agents", component: () => <UserAgentDashboard /> },
  ];

  return (
    <Container maxW="full">
      <Flex align="center" justify="space-between" py={6} flexWrap="wrap" gap={4}>
        <Text fontSize="xl" fontWeight="bold">Google SERP API</Text>
        <Text fontSize="sm">Manage your Google SERP settings and endpoints.</Text>
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

export const Route = createFileRoute("/_layout/scraping-api/google-serp")({
  component: GoogleSerpPage,
});

export default GoogleSerpPage;