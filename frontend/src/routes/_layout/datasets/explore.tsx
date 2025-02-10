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
    VStack,
    HStack,
    Divider,
    Select,
    Stack,
    Flex,
    Switch,
  } from "@chakra-ui/react";
  import { useState } from "react";
  import { useQueryClient } from "@tanstack/react-query";
  import { createFileRoute } from "@tanstack/react-router";
  import { FiSend, FiGithub } from "react-icons/fi";
  
  const ProxySettings = () => <Box><Text>Proxy Settings Component</Text></Box>;
  const ProxyUsage = () => <Box><Text>Proxy Usage Component</Text></Box>;
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
    { title: "Top-Ups", component: <TopUps /> },
    { title: "Connections", component: <Connections /> },
    { title: "Logs", component: <Logs /> },
    { title: "Key Management", component: <KeyManagement /> },
  ];
  
  export const Route = createFileRoute("/_layout/proxies/browser")({
    component: BrowserProxy,
  });
  
  function BrowserProxy() {
    const queryClient = useQueryClient();
    const [hasSubscription, setHasSubscription] = useState(false);
    const [isTrial, setIsTrial] = useState(false);
    const [isDeactivated, setIsDeactivated] = useState(false);
    const currentUser = queryClient.getQueryData(["currentUser"]);
  
    const isLocked = !hasSubscription;
    const restrictedTabs = isTrial ? ["Key Management", "Logs", "Top-Ups","Connections"] : [];
  
    return (
      <Container maxW="full">
        <Heading size="lg" textAlign={{ base: "center", md: "left" }} py={12}>
          Explore Data Sets
        </Heading>
        <Box p={4}>
          <Text fontWeight="bold">Toggle Subscription:</Text>
          <Switch isChecked={hasSubscription} onChange={() => setHasSubscription(!hasSubscription)} />
          <Text fontWeight="bold" mt={4}>Toggle Trial Mode:</Text>
          <Switch isChecked={isTrial} onChange={() => setIsTrial(!isTrial)} />
          <Text fontWeight="bold" mt={4}>Toggle Deactivated Mode:</Text>
          <Switch isChecked={isDeactivated} onChange={() => setIsDeactivated(!isDeactivated)} />
        </Box>
        {isLocked ? (
          <PromoContent />
        ) : isDeactivated ? (
          <Box>
            <Text>Your subscription has expired. Please renew to access all features.</Text>
            <ReactivationOptions />
          </Box>
        ) : (
          <Flex mt={6} gap={6} justify="space-between">
            <Box flex="1">
              <Box p={4}>
                <Text fontSize="2xl" fontWeight="bold">
                  Hi, {currentUser?.full_name || currentUser?.email} 👋🏼
                </Text>
                <Text>Welcome back, nice to see you again!</Text>
              </Box>
              <Divider my={4} />
              <Tabs variant="enclosed">
                <TabList>
                  {tabsConfig.map((tab, index) => (
                    <Tab key={index} isDisabled={restrictedTabs.includes(tab.title)}>{tab.title}</Tab>
                  ))}
                </TabList>
                <TabPanels>
                  {tabsConfig.map((tab, index) => (
                    <TabPanel key={index}>{restrictedTabs.includes(tab.title) ? <Text>Feature locked during trial.</Text> : tab.component}</TabPanel>
                  ))}
                </TabPanels>
              </Tabs>
            </Box>
            <Box w="250px" p={4} borderLeft="1px solid #E2E8F0">
              <VStack spacing={4} align="stretch">
                <Box p={4} shadow="sm" borderWidth="1px" borderRadius="lg">
                  <Text fontWeight="bold">Pick by Your Target</Text>
                  <Text fontSize="sm">Not sure which product to choose?</Text>
                  <Button mt={2} leftIcon={<FiSend />} size="sm" variant="outline">Send Test Request</Button>
                </Box>
                <Box p={4} shadow="sm" borderWidth="1px" borderRadius="lg">
                  <Text fontWeight="bold">GitHub</Text>
                  <Text fontSize="sm">Explore integration guides and open-source projects.</Text>
                  <Button mt={2} leftIcon={<FiGithub />} size="sm" variant="outline">Join GitHub</Button>
                </Box>
              </VStack>
            </Box>
          </Flex>
        )}
      </Container>
    );
  }