// src/routes/IPDetail.tsx
const IPDetail = () => {
    const { toolId, ipId } = useParams<{ toolId: string; ipId: string }>();
    const navigate = useNavigate();
    const { data, isLoading, error } = useQuery({
      queryKey: ['ipDetail', ipId],
      queryFn: () => fetchIPDetail(ipId),
    });
  
    if (isLoading) return <Spinner />;
    if (error) return <Text>Error: {error.message}</Text>;
    if (!data) return <Text>No data found for IP: {ipId}</Text>;
  
    return (
      <Box p={6}>
        <Heading size="lg" mb={4}>IP Details: {ipId}</Heading>
        <Box p={4} borderWidth="1px" borderRadius="md" mb={4}>
          <Text><strong>IP:</strong> {data.publicIp}</Text>
          <Text><strong>Region:</strong> {data.region}</Text>
          <Text><strong>City:</strong> {data.city}</Text>
          <Text><strong>Coordinates:</strong> {data.lat}, {data.lng}</Text>
          <Text><strong>Status:</strong> {data.status}</Text>
          <Text><strong>Last Checked:</strong> {data.lastChecked}</Text>
        </Box>
        <Button onClick={() => navigate({ to: `/scraping-api/${toolId}` })}>Back</Button>
      </Box>
    );
  };