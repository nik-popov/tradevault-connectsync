import React from 'react';
import { Box, Text } from "@chakra-ui/react";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet'; // Import Leaflet directly for icon fix
import 'leaflet/dist/leaflet.css';

// Fix default marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const ipData = [
  { region: "South America West", publicIp: "34.34.252.50", lat: -33.4489, lng: -70.6693, city: "Santiago" },
  { region: "US Central", publicIp: "34.96.44.247", lat: 41.8781, lng: -93.0977, city: "Ames" },
  { region: "US East", publicIp: "34.96.49.218", lat: 33.7490, lng: -84.3880, city: "Atlanta" },
  { region: "US East 4", publicIp: "34.34.234.250", lat: 38.9072, lng: -77.0369, city: "Washington D.C." },
  { region: "US West", publicIp: "34.96.52.74", lat: 45.5152, lng: -122.6784, city: "Portland" },
];

const IPMap = () => {
  return (
    <Box>
      <Text fontSize="lg" fontWeight="bold" mb={4}>IP Locations Map</Text>
      <MapContainer
        center={[39.8283, -98.5795]} // Center of USA
        zoom={3}
        style={{ height: "400px", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        {ipData.map((ip, index) => (
          <Marker key={index} position={[ip.lat, ip.lng]}>
            <Popup>
              {ip.city} ({ip.region}): {ip.publicIp}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </Box>
  );
};

export default IPMap;