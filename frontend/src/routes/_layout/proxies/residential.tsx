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
  
  const ProxySettings = () => <Box><Text>Proxy Settings Component</Text></Box>;
  const ProxyUsage = () => <Box><Text>Proxy Usage Component</Text></Box>;
  const ProxyBilling = () => <Box><Text>Proxy Billing Component</Text></Box>;
  const TopUps = () => <Box><Text>Top-Ups Component</Text></Box>;
  const Connections = () => <Box><Text>Connections Component</Text></Box>;
  const Logs = () => <Box><Text>Logs Component</Text></Box>;
  const GetStarted = () => <Box><Text>Get Started Component</Text></Box>;
  const KeyManagement = () => <Box><Text>Key Management Component</Text></Box>;
  const PromoContent = () => <Box><Text>Promo Content Component</Text></Box>;
  const ReactivationOptions = () => <Box><Text>Reactivation Options Component</Text></Box>;
  
  const tabsConfig = [
    { title: "Get Started", component: <GetStarted /> },
    { title: "Settings", component: <ProxySettings /> },
    { title: "Usage", component: <ProxyUsage /> },
    { title: "Billing", component: <ProxyBilling /> },
    { title: "Top-Ups", component: <TopUps /> },
    { title: "Connections", component: <Connections /> },
    { title: "Logs", component: <Logs /> },
    { title: "Key Management", component: <KeyManagement /> },
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
                <TabPanel key={index}>{tab.component}</TabPanel>
              ))}
            </TabPanels>
          </Tabs>
        )}
      </Container>
    );
  }