import {
    Container,
    Heading,
    Tab,
    TabList,
    TabPanel,
    TabPanels,
    Tabs,
    Box,
    Text,
    Button,
  } from "@chakra-ui/react";
  import { useQueryClient } from "@tanstack/react-query";
  import { createFileRoute } from "@tanstack/react-router";
  
  import ProxySettings from "../../components/Proxy/ProxySettings";
  import ProxyUsage from "../../components/Proxy/ProxyUsage";
  import ProxyBilling from "../../components/Proxy/ProxyBilling";
  import TopUps from "../../components/Proxy/TopUps";
  import Connections from "../../components/Proxy/Connections";
  import Logs from "../../components/Proxy/Logs";
  import GetStarted from "../../components/Proxy/GetStarted";
  import KeyManagement from "../../components/Proxy/KeyManagement";
  import PromoContent from "../../components/Proxy/PromoContent";
  import ReactivationOptions from "../../components/Proxy/ReactivationOptions";
  
  const tabsConfig = [
    { title: "Get Started", component: GetStarted },
    { title: "Settings", component: ProxySettings },
    { title: "Usage", component: ProxyUsage },
    { title: "Billing", component: ProxyBilling },
    { title: "Top-Ups", component: TopUps },
    { title: "Connections", component: Connections },
    { title: "Logs", component: Logs },
    { title: "Key Management", component: KeyManagement },
  ];
  
  export const Route = createFileRoute("/_layout/proxies/residential")({
    component: ResidentialProxy,
  });
  
  function ResidentialProxy() {
    const queryClient = useQueryClient();
    const currentUser = queryClient.getQueryData(["currentUser"]);
  
    const isLocked = !currentUser?.hasSubscription;
    const isDeactivated = currentUser?.subscriptionStatus === "expired";
  
    return (
      <Container maxW="full">
        <Heading size="lg" textAlign={{ base: "center", md: "left" }} py={12}>
          Residential Proxy Management
        </Heading>
        {isLocked ? (
          <PromoContent />
        ) : isDeactivated ? (
          <Box>
            <Text>Your subscription has expired. Please renew to access all features.</Text>
            <ReactivationOptions />
          </Box>
        ) : (
          <Tabs variant="enclosed">
            <TabList>
              {tabsConfig.map((tab, index) => (
                <Tab key={index}>{tab.title}</Tab>
              ))}
            </TabList>
            <TabPanels>
              {tabsConfig.map((tab, index) => (
                <TabPanel key={index}>
                  <tab.component />
                </TabPanel>
              ))}
            </TabPanels>
          </Tabs>
        )}
      </Container>
    );
  }
  