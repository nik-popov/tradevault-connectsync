return (
  <Container maxW="full">
    {/* Header Section */}
    <Box bg="blue.100" p={4} textAlign="center" borderRadius="md">
      <Text fontWeight="bold" fontSize="lg">🚀 Get a 3-day free trial of our proxies!</Text>
      <Button colorScheme="blue" size="sm" mt={2} onClick={() => navigate({ to: "/proxies/pricing" })}>
        Try now
      </Button>
    </Box>

    {/* Filters & Toggle in the Same Row */}
    <Flex mt={6} gap={4} justify="space-between" align="center" flexWrap="wrap">
      {/* Filter Buttons */}
      <Stack direction="row" spacing={3} flexWrap="wrap">
        {["All", "Proxy", "SERP", "Data"].map((type) => (
          <Button 
            key={type} 
            size="md"
            fontWeight="bold"
            borderRadius="full"
            colorScheme={activeFilter === type || (type === "All" && activeFilter === "all") ? "blue" : "gray"}
            variant={activeFilter === type || (type === "All" && activeFilter === "all") ? "solid" : "outline"}
            onClick={() => setActiveFilter(type === "All" ? "all" : type)}
          >
            {type}
          </Button>
        ))}
      </Stack>

      {/* Owned Filter Toggle */}
      <Flex align="center">
        <Text fontWeight="bold" mr={2}>Owned Only</Text>
        <Switch 
          isChecked={ownedOnly} 
          onChange={() => setOwnedOnly(prev => !prev)} 
          colorScheme="blue" 
        />
      </Flex>

      {/* Welcome Message */}
      <Box textAlign="right">
        <Text fontSize="xl" fontWeight="bold">
          Hi, {currentUser?.full_name || currentUser?.email} 👋🏼
        </Text>
        <Text fontSize="sm">Welcome back, let’s get started!</Text>
      </Box>
    </Flex>

    {/* Divider below for separation */}
    <Divider my={4} />

    <Flex mt={6} gap={6} justify="space-between">
      {/* Main Content */}
      <Box flex="1">
        <VStack spacing={6} mt={6} align="stretch">
          {filteredProducts.length === 0 ? (
            <Text textAlign="center" fontSize="lg" color="gray.500">No products match this filter.</Text>
          ) : (
            filteredProducts.map((product) => (
              <Box 
                key={product.id} 
                p={5} 
                shadow="md" 
                borderWidth="1px" 
                borderRadius="lg" 
                bg="gray.50"
                _hover={{ shadow: "lg", transform: "scale(1.02)" }}
                transition="0.2s ease-in-out"
              >
                <Text fontWeight="bold" fontSize="lg">{product.name}</Text>
                <Text fontSize="sm" color="gray.600">{product.description}</Text>
                <Button 
                  mt={3} 
                  size="sm" 
                  colorScheme="blue" 
                  borderRadius="full"
                  onClick={() => navigate({ to: `/proxies/${product.id}` })}
                >
                  Manage
                </Button>
              </Box>
            ))
          )}
        </VStack>
      </Box>

      {/* Sidebar - This was missing a closing tag */}
      <Box w="250px" p={4} borderLeft="1px solid #E2E8F0">
        <VStack spacing={4} align="stretch">
          {/* Test Request */}
          <Box p={4} shadow="sm" borderWidth="1px" borderRadius="lg">
            <Text fontWeight="bold">Pick by Your Target</Text>
            <Text fontSize="sm">Not sure which product to choose?</Text>
            <Button mt={2} leftIcon={<FiSend />} size="sm" variant="outline" onClick={() => navigate({ to: "/test-request" })}>
              Send Test Request
            </Button>
          </Box>

          {/* Twitter */}
          <Box p={4} shadow="sm" borderWidth="1px" borderRadius="lg">
            <Text fontWeight="bold">Twitter</Text>
            <Text fontSize="sm">Join our Twitter community.</Text> 
            <Button mt={2} leftIcon={<FiGithub />} size="sm" variant="outline" onClick={() => window.open("https://twitter.com/CobaltData", "_blank")}>
              See Twitter
            </Button>
          </Box>

          {/* GitHub */}
          <Box p={4} shadow="sm" borderWidth="1px" borderRadius="lg">
            <Text fontWeight="bold">GitHub</Text>
            <Text fontSize="sm">Explore integration guides and open-source projects.</Text>
            <Button mt={2} leftIcon={<FiGithub />} size="sm" variant="outline" onClick={() => window.open("https://github.com/CobaltDataNet", "_blank")}>
              Join GitHub
            </Button>
          </Box>
        </VStack>
      </Box>
    </Flex>
  </Container>
);
