const IPMap = ({ toolId }) => {
    const navigate = useNavigate();
    const { data, isLoading, error } = useQuery({ queryKey: ['ipData'], queryFn: fetchIPData });
  
    if (isLoading) return <Spinner />;
    if (error) return <Alert status="error"><AlertIcon />{error.message}</Alert>;
  
    const handleNavigate = (path) => {
      if (!toolId) {
        console.error('toolId is undefined');
        return;
      }
      navigate({ to: path });
    };
  
    return (
      <Box>
        <MapContainer center={[39.8283, -98.5795]} zoom={3} style={{ height: "500px", width: "100%" }} scrollWheelZoom={true}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' />
          {data.map((ip) => (
            <Marker key={ip.id} position={[ip.lat, ip.lng]}>
              <Popup>
                <Box p={2} borderWidth="1px" borderRadius="md">
                  <Tooltip label={`IP: ${ip.publicIp}`}>
                    <Text><strong>{ip.city}</strong> ({ip.region})</Text>
                  </Tooltip>
                  <Text>IP: {ip.publicIp}</Text>
                  <Text>Status: {ip.status}</Text>
                  <Button size="sm" mt={2} onClick={() => handleNavigate(`/scraping-api/${toolId}/ip/${ip.publicIp}`)}>
                    Full Details
                  </Button>
                </Box>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </Box>
    );
  };