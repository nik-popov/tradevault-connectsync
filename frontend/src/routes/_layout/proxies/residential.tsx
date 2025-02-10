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
  
  import ProxySettings from "../../components/Proxy/ProxySettings";
  import ProxyUsage from "../../components/Proxy/ProxyUsage";
  import ProxyBilling from "../../components/Proxy/ProxyBilling";
  import PromoContent from "../../components/Proxy/PromoContent";
  import ReactivationOptions from "../../components/Proxy/ReactivationOptions";
  
  const tabsConfig = [
    { title: "Settings", component: ProxySettings },
    { title: "Usage", component: ProxyUsage },
    { title: "Billing", component: ProxyBilling },
  ];
  
  export const Route = createFileRoute("/_layout/proxies/residential")({
    component: ResidentialProxy,
  });
  
  function ResidentialProxy() {
    const queryClient = useQueryClient();
    const currentUser = queryClient.getQueryData(["currentUser"]);
  
    // Determine user subscription status
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
          <ReactivationOptions />
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
  