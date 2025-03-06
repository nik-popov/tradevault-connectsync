import { Container, Box, Text, Flex, Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, useParams } from "@tanstack/react-router";
import ProxySettings from "../../../components/EndpointSettings";
import UserAgentDashboard from "../../../components/UserAgentDashboard";
import ProxyStarted from "../../../components/ProxyStarted";

type ScrapingTool = "google-serp" | "bing-serp" | "custom-scraper";

const ScrapingToolManager = (): JSX.Element => {
  const { toolId } = useParams<{ toolId: ScrapingTool }>();
  const PRODUCT = toolId || "google-serp";

  const { data: subscriptionSettings } = useQuery({
    queryKey: ["subscriptionSettings", PRODUCT],
    queryFn: () => {
      const storedSettings = localStorage.getItem("subscriptionSettings");
      return storedSettings ? JSON.parse(storedSettings) : {};
    },
    staleTime: Infinity,
  });

  const settings = subscriptionSettings?.[PRODUCT] || {
    hasSubscription: false,
    isTrial: false,
    isDeactivated: false,
  };

  const tabsConfig = [
    { title: "Get Started", component: <ProxyStarted /> },
    { title: "Endpoints", component: <ProxySettings /> },
    { title: "User Agent", component: <UserAgentDashboard /> },
  ];

  const toolDisplayName = PRODUCT.split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");

  return (
    <Container maxW="full">
      <Flex align="center" justify="space-between" py={6} flexWrap="wrap" gap={4}>
        <Box textAlign="left" flex="1">
          <Text fontSize="xl" fontWeight="bold">{toolDisplayName} API</Text>
          <Text fontSize="sm">Manage your {toolDisplayName.toLowerCase()} settings.</Text>
        </Box>
      </Flex>
      <Tabs variant="enclosed">
        <TabList>
          {tabsConfig.map((tab, index) => <Tab key={index}>{tab.title}</Tab>)}
        </TabList>
        <TabPanels>
          {tabsConfig.map((tab, index) => <TabPanel key={index}>{tab.component}</TabPanel>)}
        </TabPanels>
      </Tabs>
    </Container>
  );
};

export const Route = createFileRoute("/scraping-api/:toolId")({
  component: ScrapingToolManager,
});

export default ScrapingToolManager;