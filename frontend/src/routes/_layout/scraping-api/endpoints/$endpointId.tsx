import React, { useState, useEffect, useMemo } from "react";
import { createFileRoute, useParams } from "@tanstack/react-router";
import {
  Container,
  Box,
  Text,
  Flex,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Spinner,
  Button,
  Input,
  Card,
  CardBody,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Tooltip,
  Grid,
  GridItem,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from "@chakra-ui/react";
import EndpointSettings from "../../../../components/EndpointSettings";
import Usage from "../../../../components/Usage";
import Overview from "../../../../components/Overview";
import { LoadScript, GoogleMap, Marker, Polyline } from "@react-google-maps/api";

// Interface for traceroute hop data
interface TracerouteHop {
  hop: number;
  ip: string;
  city: string;
  latitude: number;
  longitude: number;
  latency: number;
}
type EndpointData = {
  endpoint: string;
  endpointId: string;
  publicIp?: string; // Optional, present in list page
  status?: string;
  health?: string;
  lastChecked?: string;
  error?: string;
};

const endpointData: Record<string, string> = {
  "SOUTHAMERICA-WEST1": "https://southamerica-west1-image-scraper-451516.cloudfunctions.net/main",
  "US-CENTRAL1": "https://us-central1-image-scraper-451516.cloudfunctions.net/main",
  "US-EAST1": "https://us-east1-image-scraper-451516.cloudfunctions.net/main",
  "US-EAST4": "https://us-east4-image-scraper-451516.cloudfunctions.net/main",
  "US-WEST1": "https://us-west1-image-scraper-451516.cloudfunctions.net/main",
  "EUROPE-WEST4": "https://europe-west4-image-scraper-451516.cloudfunctions.net/main",
  "US-WEST4":"https://us-west4-image-proxy-453319.cloudfunctions.net/main",
  "EUROPE-WEST1":"https://europe-west1-image-proxy-453319.cloudfunctions.net/main",
  "EUROPE-NORTH1":"https://europe-north1-image-proxy-453319.cloudfunctions.net/main",
  "ASIA-EAST1":"https://asia-east1-image-proxy-453319.cloudfunctions.net/main",
  "US-SOUTH1":"https://us-south1-gen-lang-client-0697423475.cloudfunctions.net/main",
  "US-WEST3": "https://us-west3-gen-lang-client-0697423475.cloudfunctions.net/main",
  "US-EAST5": "https://us-east5-gen-lang-client-0697423475.cloudfunctions.net/main",
  "ASIA-SOUTHEAST1": "https://asia-southeast1-gen-lang-client-0697423475.cloudfunctions.net/main",
  "US-WEST2": "https://us-west2-gen-lang-client-0697423475.cloudfunctions.net/main",
  "NORTHAMERICA-NORTHEAST2" : "https://northamerica-northeast2-image-proxy2-453320.cloudfunctions.net/main",
  "SOUTHAMERICA-EAST1": "https://southamerica-east1-image-proxy2-453320.cloudfunctions.net/main", 
  "EUROPE-WEST8": "https://europe-west8-icon-image3.cloudfunctions.net/main",
  "EUROPE-SOUTHWEST1": "https://europe-southwest1-icon-image3.cloudfunctions.net/main",
  "EUROPE-WEST6": "https://europe-west6-icon-image3.cloudfunctions.net/main",
  "EUROPE-WEST3": "https://europe-west3-icon-image3.cloudfunctions.net/main",
  "EUROPE-WEST2": "https://europe-west2-icon-image3.cloudfunctions.net/main",
  "EUROPE-WEST9": "https://europe-west9-image-proxy2-453320.cloudfunctions.net/main",
  "MIDDLEEAST-WEST1": "https://me-west1-image-proxy4.cloudfunctions.net/main",
  "MIDDLEEAST-CENTRAL1": "https://me-central1-image-proxy4.cloudfunctions.net/main",
  "EUROPE-WEST12": "https://europe-west12-image-proxy4.cloudfunctions.net/main",
  "EUROPE-WEST10": "https://europe-west10-image-proxy4.cloudfunctions.net/main",
  "ASIA-NORTHEAST2" : "https://asia-northeast2-image-proxy4.cloudfunctions.net/main",
};

// Updated static traceroute data with 6 datasets per endpoint
const staticTracerouteData: Record<string, TracerouteHop[][]> = {
  "SOUTHAMERICA-WEST1": [
    // Dataset 1
    [
      { hop: 1, ip: "192.168.1.1", city: "Santiago, Chile", latitude: -33.4489, longitude: -70.6693, latency: 5 },
      { hop: 2, ip: "200.45.67.89", city: "Buenos Aires, Argentina", latitude: -34.6037, longitude: -58.3816, latency: 20 },
      { hop: 3, ip: "34.34.252.50", city: "São Paulo, Brazil", latitude: -23.5505, longitude: -46.6333, latency: 45 },
      { hop: 4, ip: "201.54.32.10", city: "Lima, Peru", latitude: -12.0464, longitude: -77.0428, latency: 60 },
      { hop: 5, ip: "34.98.76.54", city: "Quito, Ecuador", latitude: -0.1807, longitude: -78.4678, latency: 80 },
    ],
    // Dataset 2
    [
      { hop: 1, ip: "192.168.1.2", city: "Valparaíso, Chile", latitude: -33.0472, longitude: -71.6127, latency: 6 },
      { hop: 2, ip: "200.45.67.90", city: "Córdoba, Argentina", latitude: -31.4201, longitude: -64.1888, latency: 25 },
      { hop: 3, ip: "34.34.252.51", city: "Rio de Janeiro, Brazil", latitude: -22.9068, longitude: -43.1729, latency: 30 },
      { hop: 4, ip: "201.54.32.11", city: "Bogotá, Colombia", latitude: 4.7110, longitude: -74.0721, latency: 70 },
      { hop: 5, ip: "34.98.76.55", city: "Caracas, Venezuela", latitude: 10.4806, longitude: -66.9036, latency: 90 },
    ],
    // Dataset 3 (New)
    [
      { hop: 1, ip: "192.168.1.3", city: "Concepción, Chile", latitude: -36.8270, longitude: -73.0503, latency: 7 },
      { hop: 2, ip: "200.45.67.91", city: "Mendoza, Argentina", latitude: -32.8895, longitude: -68.8458, latency: 30 },
      { hop: 3, ip: "34.34.252.52", city: "Brasília, Brazil", latitude: -15.8267, longitude: -47.9218, latency: 35 },
      { hop: 4, ip: "201.54.32.12", city: "Medellín, Colombia", latitude: 6.2442, longitude: -75.5812, latency: 75 },
      { hop: 5, ip: "34.98.76.56", city: "Guayaquil, Ecuador", latitude: -2.1894, longitude: -79.8891, latency: 95 },
    ],
    // Dataset 4 (New)
    [
      { hop: 1, ip: "192.168.1.4", city: "Antofagasta, Chile", latitude: -23.6509, longitude: -70.3975, latency: 8 },
      { hop: 2, ip: "200.45.67.92", city: "Rosario, Argentina", latitude: -32.9442, longitude: -60.6505, latency: 35 },
      { hop: 3, ip: "34.34.252.53", city: "Salvador, Brazil", latitude: -12.9714, longitude: -38.5014, latency: 60 },
      { hop: 4, ip: "201.54.32.13", city: "Cali, Colombia", latitude: 3.4516, longitude: -76.5320, latency: 80 },
      { hop: 5, ip: "34.98.76.57", city: "Cuenca, Ecuador", latitude: -2.9005, longitude: -79.0045, latency: 100 },
    ],
    // Dataset 5 (New)
    [
      { hop: 1, ip: "192.168.1.5", city: "La Serena, Chile", latitude: -29.9027, longitude: -71.2519, latency: 9 },
      { hop: 2, ip: "200.45.67.93", city: "Salta, Argentina", latitude: -24.7821, longitude: -65.4232, latency: 40 },
      { hop: 3, ip: "34.34.252.54", city: "Fortaleza, Brazil", latitude: -3.7172, longitude: -38.5434, latency: 65 },
      { hop: 4, ip: "201.54.32.14", city: "Cartagena, Colombia", latitude: 10.3910, longitude: -75.4794, latency: 85 },
      { hop: 5, ip: "34.98.76.58", city: "Loja, Ecuador", latitude: -3.9931, longitude: -79.2042, latency: 105 },
    ],
    // Dataset 6 (New)
    [
      { hop: 1, ip: "192.168.1.6", city: "Iquique, Chile", latitude: -20.2208, longitude: -70.1431, latency: 10 },
      { hop: 2, ip: "200.45.67.94", city: "San Miguel de Tucumán, Argentina", latitude: -26.8083, longitude: -65.2176, latency: 45 },
      { hop: 3, ip: "34.34.252.55", city: "Recife, Brazil", latitude: -8.0476, longitude: -34.8770, latency: 70 },
      { hop: 4, ip: "201.54.32.15", city: "Barranquilla, Colombia", latitude: 10.9685, longitude: -74.7813, latency: 90 },
      { hop: 5, ip: "34.98.76.59", city: "Manta, Ecuador", latitude: -0.9677, longitude: -80.7089, latency: 110 },
    ],
  ],
  "US-CENTRAL1": [
    // Dataset 1: From Los Angeles to Kansas City, MO
    [
      { hop: 1, ip: "10.0.0.1", city: "Los Angeles, CA", latitude: 34.05, longitude: -118.25, latency: 3 },
      { hop: 2, ip: "10.0.0.2", city: "Las Vegas, NV", latitude: 36.17, longitude: -115.14, latency: 13 },
      { hop: 3, ip: "10.0.0.3", city: "Salt Lake City, UT", latitude: 40.76, longitude: -111.89, latency: 35 },
      { hop: 4, ip: "10.0.0.4", city: "Denver, CO", latitude: 39.74, longitude: -104.99, latency: 30 },
      { hop: 5, ip: "10.0.0.5", city: "Kansas City, MO", latitude: 39.10, longitude: -94.58, latency: 65 },
    ],
    // Dataset 2: From New York to Kansas City, MO
    [
      { hop: 1, ip: "10.0.1.1", city: "New York, NY", latitude: 40.71, longitude: -74.01, latency: 5 },
      { hop: 2, ip: "10.0.1.2", city: "Philadelphia, PA", latitude: 39.95, longitude: -75.17, latency: 13 },
      { hop: 3, ip: "10.0.1.3", city: "Pittsburgh, PA", latitude: 40.44, longitude: -80.00, latency: 35 },
      { hop: 4, ip: "10.0.1.4", city: "Columbus, OH", latitude: 39.96, longitude: -83.00, latency: 50 },
      { hop: 5, ip: "10.0.1.5", city: "Kansas City, MO", latitude: 39.10, longitude: -94.58, latency: 65 },
    ],
    // Dataset 3: From Miami to Kansas City, MO
    [
      { hop: 1, ip: "10.0.2.1", city: "Miami, FL", latitude: 25.76, longitude: -80.19, latency: 5 },
      { hop: 2, ip: "10.0.2.2", city: "Orlando, FL", latitude: 28.54, longitude: -81.38, latency: 20 },
      { hop: 3, ip: "10.0.2.3", city: "Atlanta, GA", latitude: 33.75, longitude: -84.39, latency: 35 },
      { hop: 4, ip: "10.0.2.4", city: "St. Louis, MO", latitude: 38.63, longitude: -90.20, latency: 50 },
      { hop: 5, ip: "10.0.2.5", city: "Kansas City, MO", latitude: 39.10, longitude: -94.58, latency: 65 },
    ],
    // Dataset 4: From Seattle to Kansas City, MO
    [
      { hop: 1, ip: "10.0.3.1", city: "Seattle, WA", latitude: 47.61, longitude: -122.33, latency: 5 },
      { hop: 2, ip: "10.0.3.2", city: "Spokane, WA", latitude: 47.66, longitude: -117.43, latency: 20 },
      { hop: 3, ip: "10.0.3.3", city: "Billings, MT", latitude: 45.78, longitude: -108.50, latency: 35 },
      { hop: 4, ip: "10.0.3.4", city: "Denver, CO", latitude: 39.74, longitude: -104.99, latency: 30 },
      { hop: 5, ip: "10.0.3.5", city: "Kansas City, MO", latitude: 39.10, longitude: -94.58, latency: 65 },
    ],
    // Dataset 5: From Dallas to Kansas City, MO
    [
      { hop: 1, ip: "10.0.4.1", city: "Dallas, TX", latitude: 32.78, longitude: -96.80, latency: 3 },
      { hop: 2, ip: "10.0.4.2", city: "Oklahoma City, OK", latitude: 35.47, longitude: -97.52, latency: 13 },
      { hop: 3, ip: "10.0.4.3", city: "Tulsa, OK", latitude: 36.15, longitude: -95.99, latency: 35 },
      { hop: 4, ip: "10.0.4.4", city: "Wichita, KS", latitude: 37.69, longitude: -97.34, latency: 30 },
      { hop: 5, ip: "10.0.4.5", city: "Kansas City, MO", latitude: 39.10, longitude: -94.58, latency: 65 },
    ],
    // Dataset 6: From Minneapolis to Kansas City, MO
    [
      { hop: 1, ip: "10.0.5.1", city: "Minneapolis, MN", latitude: 44.98, longitude: -93.27, latency: 5 },
      { hop: 2, ip: "10.0.5.2", city: "Rochester, MN", latitude: 44.02, longitude: -92.48, latency: 13 },
      { hop: 3, ip: "10.0.5.3", city: "Des Moines, IA", latitude: 41.59, longitude: -93.62, latency: 35 },
      { hop: 4, ip: "10.0.5.4", city: "Omaha, NE", latitude: 41.26, longitude: -96.00, latency: 50 },
      { hop: 5, ip: "10.0.5.5", city: "Kansas City, MO", latitude: 39.10, longitude: -94.58, latency: 65 },
    ],
  ],
  "US-EAST1": [
    // Dataset 1: From Los Angeles to Charleston, SC
    [
      { hop: 1, ip: "10.1.0.1", city: "Los Angeles, CA", latitude: 34.05, longitude: -118.25, latency: 3 },
      { hop: 2, ip: "10.1.0.2", city: "Phoenix, AZ", latitude: 33.45, longitude: -112.07, latency: 13 },
      { hop: 3, ip: "10.1.0.3", city: "Albuquerque, NM", latitude: 35.08, longitude: -106.65, latency: 35 },
      { hop: 4, ip: "10.1.0.4", city: "Dallas, TX", latitude: 32.78, longitude: -96.80, latency: 30 },
      { hop: 5, ip: "10.1.0.5", city: "Charleston, SC", latitude: 32.78, longitude: -79.93, latency: 65 },
    ],
    // Dataset 2: From Seattle to Charleston, SC
    [
      { hop: 1, ip: "10.1.1.1", city: "Seattle, WA", latitude: 47.61, longitude: -122.33, latency: 3 },
      { hop: 2, ip: "10.1.1.2", city: "Boise, ID", latitude: 43.62, longitude: -116.20, latency: 13 },
      { hop: 3, ip: "10.1.1.3", city: "Salt Lake City, UT", latitude: 40.76, longitude: -111.89, latency: 35 },
      { hop: 4, ip: "10.1.1.4", city: "Denver, CO", latitude: 39.74, longitude: -104.99, latency: 30 },
      { hop: 5, ip: "10.1.1.5", city: "Charleston, SC", latitude: 32.78, longitude: -79.93, latency: 65 },
    ],
    // Dataset 3: From Chicago to Charleston, SC
    [
      { hop: 1, ip: "10.1.2.1", city: "Chicago, IL", latitude: 41.88, longitude: -87.63, latency: 5 },
      { hop: 2, ip: "10.1.2.2", city: "Indianapolis, IN", latitude: 39.77, longitude: -86.16, latency: 13 },
      { hop: 3, ip: "10.1.2.3", city: "Louisville, KY", latitude: 38.25, longitude: -85.76, latency: 35 },
      { hop: 4, ip: "10.1.2.4", city: "Knoxville, TN", latitude: 35.96, longitude: -83.92, latency: 50 },
      { hop: 5, ip: "10.1.2.5", city: "Charleston, SC", latitude: 32.78, longitude: -79.93, latency: 65 },
    ],
    // Dataset 4: From Dallas to Charleston, SC
    [
      { hop: 1, ip: "10.1.3.1", city: "Dallas, TX", latitude: 32.78, longitude: -96.80, latency: 5 },
      { hop: 2, ip: "10.1.3.2", city: "Little Rock, AR", latitude: 34.75, longitude: -92.29, latency: 13 },
      { hop: 3, ip: "10.1.3.3", city: "Memphis, TN", latitude: 35.15, longitude: -90.05, latency: 35 },
      { hop: 4, ip: "10.1.3.4", city: "Birmingham, AL", latitude: 33.52, longitude: -86.81, latency: 50 },
      { hop: 5, ip: "10.1.3.5", city: "Charleston, SC", latitude: 32.78, longitude: -79.93, latency: 65 },
    ],
    // Dataset 5: From Miami to Charleston, SC
    [
      { hop: 1, ip: "10.1.4.1", city: "Miami, FL", latitude: 25.76, longitude: -80.19, latency: 5 },
      { hop: 2, ip: "10.1.4.2", city: "Orlando, FL", latitude: 28.54, longitude: -81.38, latency: 20 },
      { hop: 3, ip: "10.1.4.3", city: "Jacksonville, FL", latitude: 30.33, longitude: -81.66, latency: 35 },
      { hop: 4, ip: "10.1.4.4", city: "Savannah, GA", latitude: 32.08, longitude: -81.09, latency: 30 },
      { hop: 5, ip: "10.1.4.5", city: "Charleston, SC", latitude: 32.78, longitude: -79.93, latency: 65 },
    ],
    // Dataset 6: From Boston to Charleston, SC
    [
      { hop: 1, ip: "10.1.5.1", city: "Boston, MA", latitude: 42.36, longitude: -71.06, latency: 3 },
      { hop: 2, ip: "10.1.5.2", city: "New York, NY", latitude: 40.71, longitude: -74.01, latency: 20 },
      { hop: 3, ip: "10.1.5.3", city: "Philadelphia, PA", latitude: 39.95, longitude: -75.17, latency: 35 },
      { hop: 4, ip: "10.1.5.4", city: "Baltimore, MD", latitude: 39.29, longitude: -76.61, latency: 30 },
      { hop: 5, ip: "10.1.5.5", city: "Charleston, SC", latitude: 32.78, longitude: -79.93, latency: 65 },
    ],
  ],
  "US-EAST4": [
    // Dataset 1: From Los Angeles to Ashburn, VA
    [
      { hop: 1, ip: "10.2.0.1", city: "Los Angeles, CA", latitude: 34.05, longitude: -118.25, latency: 3 },
      { hop: 2, ip: "10.2.0.2", city: "Phoenix, AZ", latitude: 33.45, longitude: -112.07, latency: 20 },
      { hop: 3, ip: "10.2.0.3", city: "Dallas, TX", latitude: 32.78, longitude: -96.80, latency: 35 },
      { hop: 4, ip: "10.2.0.4", city: "Atlanta, GA", latitude: 33.75, longitude: -84.39, latency: 30 },
      { hop: 5, ip: "10.2.0.5", city: "Ashburn, VA", latitude: 39.04, longitude: -77.49, latency: 65 },
    ],
    // Dataset 2: From Seattle to Ashburn, VA
    [
      { hop: 1, ip: "10.2.1.1", city: "Seattle, WA", latitude: 47.61, longitude: -122.33, latency: 3 },
      { hop: 2, ip: "10.2.1.2", city: "Spokane, WA", latitude: 47.66, longitude: -117.43, latency: 13 },
      { hop: 3, ip: "10.2.1.3", city: "Denver, CO", latitude: 39.74, longitude: -104.99, latency: 35 },
      { hop: 4, ip: "10.2.1.4", city: "Chicago, IL", latitude: 41.88, longitude: -87.63, latency: 30 },
      { hop: 5, ip: "10.2.1.5", city: "Ashburn, VA", latitude: 39.04, longitude: -77.49, latency: 65 },
    ],
    // Dataset 3: From Chicago to Ashburn, VA
    [
      { hop: 1, ip: "10.2.2.1", city: "Chicago, IL", latitude: 41.88, longitude: -87.63, latency: 3 },
      { hop: 2, ip: "10.2.2.2", city: "Indianapolis, IN", latitude: 39.77, longitude: -86.16, latency: 13 },
      { hop: 3, ip: "10.2.2.3", city: "Columbus, OH", latitude: 39.96, longitude: -83.00, latency: 35 },
      { hop: 4, ip: "10.2.2.4", city: "Pittsburgh, PA", latitude: 40.44, longitude: -80.00, latency: 30 },
      { hop: 5, ip: "10.2.2.5", city: "Ashburn, VA", latitude: 39.04, longitude: -77.49, latency: 65 },
    ],
    // Dataset 4: From Dallas to Ashburn, VA
    [
      { hop: 1, ip: "10.2.3.1", city: "Dallas, TX", latitude: 32.78, longitude: -96.80, latency: 3 },
      { hop: 2, ip: "10.2.3.2", city: "Memphis, TN", latitude: 35.15, longitude: -90.05, latency: 13 },
      { hop: 3, ip: "10.2.3.3", city: "Nashville, TN", latitude: 36.16, longitude: -86.78, latency: 35 },
      { hop: 4, ip: "10.2.3.4", city: "Charlotte, NC", latitude: 35.23, longitude: -80.84, latency: 50 },
      { hop: 5, ip: "10.2.3.5", city: "Ashburn, VA", latitude: 39.04, longitude: -77.49, latency: 65 },
    ],
    // Dataset 5: From Miami to Ashburn, VA
    [
      { hop: 1, ip: "10.2.4.1", city: "Miami, FL", latitude: 25.76, longitude: -80.19, latency: 5 },
      { hop: 2, ip: "10.2.4.2", city: "Orlando, FL", latitude: 28.54, longitude: -81.38, latency: 13 },
      { hop: 3, ip: "10.2.4.3", city: "Atlanta, GA", latitude: 33.75, longitude: -84.39, latency: 35 },
      { hop: 4, ip: "10.2.4.4", city: "Charlotte, NC", latitude: 35.23, longitude: -80.84, latency: 50 },
      { hop: 5, ip: "10.2.4.5", city: "Ashburn, VA", latitude: 39.04, longitude: -77.49, latency: 65 },
    ],
    // Dataset 6: From Boston to Ashburn, VA
    [
      { hop: 1, ip: "10.2.5.1", city: "Boston, MA", latitude: 42.36, longitude: -71.06, latency: 5 },
      { hop: 2, ip: "10.2.5.2", city: "New York, NY", latitude: 40.71, longitude: -74.01, latency: 13 },
      { hop: 3, ip: "10.2.5.3", city: "Philadelphia, PA", latitude: 39.95, longitude: -75.17, latency: 35 },
      { hop: 4, ip: "10.2.5.4", city: "Baltimore, MD", latitude: 39.29, longitude: -76.61, latency: 30 },
      { hop: 5, ip: "10.2.5.5", city: "Ashburn, VA", latitude: 39.04, longitude: -77.49, latency: 65 },
    ],
  ],
  "US-WEST1": [
    // Dataset 1: From New York to The Dalles, OR
    [
      { hop: 1, ip: "10.3.0.1", city: "New York, NY", latitude: 40.71, longitude: -74.01, latency: 3 },
      { hop: 2, ip: "10.3.0.2", city: "Chicago, IL", latitude: 41.88, longitude: -87.63, latency: 13 },
      { hop: 3, ip: "10.3.0.3", city: "Denver, CO", latitude: 39.74, longitude: -104.99, latency: 35 },
      { hop: 4, ip: "10.3.0.4", city: "Salt Lake City, UT", latitude: 40.76, longitude: -111.89, latency: 30 },
      { hop: 5, ip: "10.3.0.5", city: "The Dalles, OR", latitude: 45.59, longitude: -121.18, latency: 65 },
    ],
    // Dataset 2: From Miami to The Dalles, OR
    [
      { hop: 1, ip: "10.3.1.1", city: "Miami, FL", latitude: 25.76, longitude: -80.19, latency: 5 },
      { hop: 2, ip: "10.3.1.2", city: "Atlanta, GA", latitude: 33.75, longitude: -84.39, latency: 13 },
      { hop: 3, ip: "10.3.1.3", city: "Dallas, TX", latitude: 32.78, longitude: -96.80, latency: 35 },
      { hop: 4, ip: "10.3.1.4", city: "Phoenix, AZ", latitude: 33.45, longitude: -112.07, latency: 30 },
      { hop: 5, ip: "10.3.1.5", city: "The Dalles, OR", latitude: 45.59, longitude: -121.18, latency: 65 },
    ],
    // Dataset 3: From Chicago to The Dalles, OR
    [
      { hop: 1, ip: "10.3.2.1", city: "Chicago, IL", latitude: 41.88, longitude: -87.63, latency: 5 },
      { hop: 2, ip: "10.3.2.2", city: "Minneapolis, MN", latitude: 44.98, longitude: -93.27, latency: 13 },
      { hop: 3, ip: "10.3.2.3", city: "Billings, MT", latitude: 45.78, longitude: -108.50, latency: 35 },
      { hop: 4, ip: "10.3.2.4", city: "Spokane, WA", latitude: 47.66, longitude: -117.43, latency: 30 },
      { hop: 5, ip: "10.3.2.5", city: "The Dalles, OR", latitude: 45.59, longitude: -121.18, latency: 65 },
    ],
    // Dataset 4: From Dallas to The Dalles, OR
    [
      { hop: 1, ip: "10.3.3.1", city: "Dallas, TX", latitude: 32.78, longitude: -96.80, latency: 5 },
      { hop: 2, ip: "10.3.3.2", city: "Oklahoma City, OK", latitude: 35.47, longitude: -97.52, latency: 20 },
      { hop: 3, ip: "10.3.3.3", city: "Denver, CO", latitude: 39.74, longitude: -104.99, latency: 35 },
      { hop: 4, ip: "10.3.3.4", city: "Boise, ID", latitude: 43.62, longitude: -116.20, latency: 50 },
      { hop: 5, ip: "10.3.3.5", city: "The Dalles, OR", latitude: 45.59, longitude: -121.18, latency: 65 },
    ],
    // Dataset 5: From Seattle to The Dalles, OR
    [
      { hop: 1, ip: "10.3.4.1", city: "Seattle, WA", latitude: 47.61, longitude: -122.33, latency: 5 },
      { hop: 2, ip: "10.3.4.2", city: "Tacoma, WA", latitude: 47.25, longitude: -122.44, latency: 20 },
      { hop: 3, ip: "10.3.4.3", city: "Portland, OR", latitude: 45.52, longitude: -122.68, latency: 35 },
      { hop: 4, ip: "10.3.4.4", city: "Hood River, OR", latitude: 45.71, longitude: -121.52, latency: 30 },
      { hop: 5, ip: "10.3.4.5", city: "The Dalles, OR", latitude: 45.59, longitude: -121.18, latency: 65 },
    ],
    // Dataset 6: From Los Angeles to The Dalles, OR
    [
      { hop: 1, ip: "10.3.5.1", city: "Los Angeles, CA", latitude: 34.05, longitude: -118.25, latency: 3 },
      { hop: 2, ip: "10.3.5.2", city: "Sacramento, CA", latitude: 38.58, longitude: -121.49, latency: 13 },
      { hop: 3, ip: "10.3.5.3", city: "Redding, CA", latitude: 40.59, longitude: -122.39, latency: 35 },
      { hop: 4, ip: "10.3.5.4", city: "Portland, OR", latitude: 45.52, longitude: -122.68, latency: 30 },
      { hop: 5, ip: "10.3.5.5", city: "The Dalles, OR", latitude: 45.59, longitude: -121.18, latency: 65 },
    ],
  ],
  "EUROPE-WEST4": [
    // Dataset 1: From London to Eemshaven, Netherlands
    [
      { hop: 1, ip: "10.4.0.1", city: "London, UK", latitude: 51.51, longitude: -0.13, latency: 3 },
      { hop: 2, ip: "10.4.0.2", city: "Brussels, Belgium", latitude: 50.85, longitude: 4.35, latency: 20 },
      { hop: 3, ip: "10.4.0.3", city: "Antwerp, Belgium", latitude: 51.22, longitude: 4.40, latency: 35 },
      { hop: 4, ip: "10.4.0.4", city: "Rotterdam, Netherlands", latitude: 51.92, longitude: 4.48, latency: 30 },
      { hop: 5, ip: "10.4.0.5", city: "Eemshaven, Netherlands", latitude: 53.45, longitude: 6.83, latency: 65 },
    ],
    // Dataset 2: From Paris to Eemshaven, Netherlands
    [
      { hop: 1, ip: "10.4.1.1", city: "Paris, France", latitude: 48.86, longitude: 2.35, latency: 3 },
      { hop: 2, ip: "10.4.1.2", city: "Lille, France", latitude: 50.63, longitude: 3.06, latency: 13 },
      { hop: 3, ip: "10.4.1.3", city: "Brussels, Belgium", latitude: 50.85, longitude: 4.35, latency: 35 },
      { hop: 4, ip: "10.4.1.4", city: "Amsterdam, Netherlands", latitude: 52.37, longitude: 4.90, latency: 30 },
      { hop: 5, ip: "10.4.1.5", city: "Eemshaven, Netherlands", latitude: 53.45, longitude: 6.83, latency: 65 },
    ],
    // Dataset 3: From Berlin to Eemshaven, Netherlands
    [
      { hop: 1, ip: "10.4.2.1", city: "Berlin, Germany", latitude: 52.52, longitude: 13.41, latency: 5 },
      { hop: 2, ip: "10.4.2.2", city: "Hamburg, Germany", latitude: 53.55, longitude: 9.99, latency: 20 },
      { hop: 3, ip: "10.4.2.3", city: "Bremen, Germany", latitude: 53.08, longitude: 8.81, latency: 35 },
      { hop: 4, ip: "10.4.2.4", city: "Groningen, Netherlands", latitude: 53.22, longitude: 6.57, latency: 50 },
      { hop: 5, ip: "10.4.2.5", city: "Eemshaven, Netherlands", latitude: 53.45, longitude: 6.83, latency: 65 },
    ],
    // Dataset 4: From Madrid to Eemshaven, Netherlands
    [
      { hop: 1, ip: "10.4.3.1", city: "Madrid, Spain", latitude: 40.42, longitude: -3.70, latency: 5 },
      { hop: 2, ip: "10.4.3.2", city: "Barcelona, Spain", latitude: 41.39, longitude: 2.17, latency: 13 },
      { hop: 3, ip: "10.4.3.3", city: "Paris, France", latitude: 48.86, longitude: 2.35, latency: 35 },
      { hop: 4, ip: "10.4.3.4", city: "Amsterdam, Netherlands", latitude: 52.37, longitude: 4.90, latency: 30 },
      { hop: 5, ip: "10.4.3.5", city: "Eemshaven, Netherlands", latitude: 53.45, longitude: 6.83, latency: 65 },
    ],
    // Dataset 5: From Rome to Eemshaven, Netherlands
    [
      { hop: 1, ip: "10.4.4.1", city: "Rome, Italy", latitude: 41.90, longitude: 12.50, latency: 5 },
      { hop: 2, ip: "10.4.4.2", city: "Milan, Italy", latitude: 45.46, longitude: 9.19, latency: 20 },
      { hop: 3, ip: "10.4.4.3", city: "Frankfurt, Germany", latitude: 50.11, longitude: 8.68, latency: 35 },
      { hop: 4, ip: "10.4.4.4", city: "Cologne, Germany", latitude: 50.94, longitude: 6.96, latency: 50 },
      { hop: 5, ip: "10.4.4.5", city: "Eemshaven, Netherlands", latitude: 53.45, longitude: 6.83, latency: 65 },
    ],
    // Dataset 6: From Stockholm to Eemshaven, Netherlands
    [
      { hop: 1, ip: "10.4.5.1", city: "Stockholm, Sweden", latitude: 59.33, longitude: 18.07, latency: 5 },
      { hop: 2, ip: "10.4.5.2", city: "Copenhagen, Denmark", latitude: 55.68, longitude: 12.57, latency: 20 },
      { hop: 3, ip: "10.4.5.3", city: "Hamburg, Germany", latitude: 53.55, longitude: 9.99, latency: 35 },
      { hop: 4, ip: "10.4.5.4", city: "Amsterdam, Netherlands", latitude: 52.37, longitude: 4.90, latency: 30 },
      { hop: 5, ip: "10.4.5.5", city: "Eemshaven, Netherlands", latitude: 53.45, longitude: 6.83, latency: 65 },
    ],
  ],
};

// MapUpdater component
const MapUpdater: React.FC<{ hops: TracerouteHop[]; map: google.maps.Map | null }> = ({ hops, map }) => {
  useEffect(() => {
    if (map && hops.length > 0) {
      const bounds = new google.maps.LatLngBounds();
      hops.forEach((hop) => bounds.extend({ lat: hop.latitude, lng: hop.longitude }));
      map.fitBounds(bounds, 50);
      console.log("Map bounds set with hops:", hops);
    }
  }, [hops, map]);
  return null;
};

// LoadScript wrapper to ensure single load
const LoadScriptOnce: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <LoadScript
      googleMapsApiKey="AIzaSyCGkpSEixfDAVnE3UWw-8v9pd6L3OFXvM0"
      onLoad={() => {
        if (!loaded) {
          console.log("Google Maps API loaded successfully");
          setLoaded(true);
        } else {
          console.log("Google Maps API already loaded");
        }
      }}
      onError={(e) => {
        console.error("Google Maps API failed to load:", e);
      }}
    >
      {loaded && children}
    </LoadScript>
  );
};

const EndpointDetailPage = () => {
  const { endpointId } = useParams({ from: "/_layout/scraping-api/endpoints/$endpointId" });

  const [tracerouteData, setTracerouteData] = useState<TracerouteHop[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState<boolean>(false);
  const [refreshInterval, setRefreshInterval] = useState<number>(60000);
  const [dataSetIndex, setDataSetIndex] = useState<number>(0);
  const [showMarkers, setShowMarkers] = useState(true);
  const [showPolyline, setShowPolyline] = useState(true);
  const [map, setMap] = useState<google.maps.Map | null>(null);

  const fetchTracerouteData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const endpointUrl = endpointData[endpointId];
      if (!endpointUrl) throw new Error("Invalid endpoint ID");

      const datasets = staticTracerouteData[endpointId] || [];
      if (datasets.length === 0) {
        setTracerouteData([]);
        console.log("No datasets found for endpoint:", endpointId);
        return;
      }

      const data = datasets[dataSetIndex];
      console.log("Fetching traceroute data:", data);
      setTracerouteData(data);
      setDataSetIndex((prev) => (prev + 1) % 6); // Cycle through 6 datasets
    } catch (err) {
      console.error("Traceroute fetch error:", err);
      setError(err instanceof Error ? err.message : "An unknown error occurred");
      setTracerouteData([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTracerouteData();
    let interval: NodeJS.Timeout;
    if (autoRefresh) {
      interval = setInterval(fetchTracerouteData, refreshInterval);
    }
    return () => clearInterval(interval);
  }, [endpointId, autoRefresh, refreshInterval]);

  const polylinePath = useMemo(() => {
    return tracerouteData.map((hop) => ({ lat: hop.latitude, lng: hop.longitude }));
  }, [tracerouteData]);

  const tabsConfig = [
    { title: "Overview", component: () => <Overview endpointId={endpointId} /> },
    { title: "Usage", component: () => <Usage toolId={endpointId} /> },
    {
      title: "Traceroute",
      component: () => (
        <Box p={4}>
          <Flex justify="space-between" align="center" mb={4} wrap="wrap" gap={2}>
            <Text fontSize="lg" fontWeight="bold">Traceroute for {endpointId}</Text>
            <Flex align="center" gap={2} wrap="wrap">
              <Flex direction="row-reverse" align="center" gap={2}>
                <Button
                  size="sm"
                  colorScheme={autoRefresh ? "green" : "gray"}
                  onClick={() => setAutoRefresh(!autoRefresh)}
                >
                  {autoRefresh ? "Auto Refresh: On" : "Auto Refresh: Off"}
                </Button>
                {autoRefresh && (
                  <Flex align="center" gap={1}>
                    <Input
                      size="sm"
                      type="number"
                      value={refreshInterval / 1000}
                      onChange={(e) => setRefreshInterval(Math.max(30, Number(e.target.value)) * 1000)}
                      width="60px"
                    />
                    <Button size="sm" colorScheme="gray" isDisabled>
                      Interval (s):
                    </Button>
                  </Flex>
                )}
              </Flex>
              <Tooltip label="Refresh traceroute data immediately">
                <Button size="sm" colorScheme="blue" onClick={fetchTracerouteData} isLoading={isLoading}>
                  Refresh Now
                </Button>
              </Tooltip>
              <Button
                size="sm"
                colorScheme={showMarkers ? "green" : "gray"}
                onClick={() => setShowMarkers(!showMarkers)}
              >
                {showMarkers ? "Map Markers: On" : "Map Markers: Off"}
              </Button>
              <Button
                size="sm"
                colorScheme={showPolyline ? "green" : "gray"}
                onClick={() => setShowPolyline(!showPolyline)}
              >
                {showPolyline ? "Map Polyline: On" : "Map Polyline: Off"}
              </Button>
            </Flex>
          </Flex>

          {isLoading ? (
            <Flex justify="center" align="center" h="200px">
              <Spinner size="xl" color="blue.500" />
            </Flex>
          ) : error ? (
            <Text color="red.500">{error}</Text>
          ) : tracerouteData.length > 0 ? (
            <>
              <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={6} mb={6}>
                <GridItem>
                  <Text fontSize="md" fontWeight="semibold" mb={2}>Traceroute Map</Text>
                  <Box height="400px" borderRadius="md" overflow="hidden" shadow="md">
                    <GoogleMap
                      mapContainerStyle={{ height: "100%", width: "100%" }}
                      zoom={3}
                      center={
                        tracerouteData.length > 0
                          ? { lat: tracerouteData[0].latitude, lng: tracerouteData[0].longitude }
                          : { lat: 0, lng: 0 }
                      }
                      onLoad={(mapInstance) => {
                        setMap(mapInstance);
                        console.log("Map instance loaded");
                      }}
                      onUnmount={() => setMap(null)}
                    >
                      <MapUpdater hops={tracerouteData} map={map} />
                      {showMarkers &&
                        tracerouteData.map((hop) => (
                          <Marker
                            key={hop.hop}
                            position={{ lat: hop.latitude, lng: hop.longitude }}
                            title={`Hop ${hop.hop}: ${hop.city} (${hop.ip}) - ${hop.latency}ms`}
                          />
                        ))}
                      {showPolyline && polylinePath.length > 1 && (
                        <Polyline
                          path={polylinePath}
                          options={{ strokeColor: "#0000FF", strokeWeight: 2, strokeOpacity: 1 }}
                        />
                      )}
                    </GoogleMap>
                    {!map && !error && (
                      <Flex justify="center" align="center" h="100%">
                        <Text>Loading Google Maps...</Text>
                      </Flex>
                    )}
                  </Box>
                </GridItem>
                <GridItem>
                  <Text fontSize="md" fontWeight="semibold" mb={2}>Traceroute Details</Text>
                  <Card shadow="md" borderWidth="1px">
                    <CardBody>
                      <Stat>
                        <StatLabel>Total Hops</StatLabel>
                        <StatNumber>{tracerouteData.length}</StatNumber>
                      </Stat>
                      <Stat mt={4}>
                        <StatLabel>Average Latency</StatLabel>
                        <StatNumber>
                          {Math.round(
                            tracerouteData.reduce((sum, hop) => sum + hop.latency, 0) / tracerouteData.length
                          )}ms
                        </StatNumber>
                      </Stat>
                      <Stat mt={4}>
                        <StatLabel>Endpoint URL</StatLabel>
                        <StatHelpText wordBreak="break-all">{endpointData[endpointId]}</StatHelpText>
                      </Stat>
                    </CardBody>
                  </Card>
                </GridItem>
              </Grid>
              <Text fontSize="md" fontWeight="semibold" mb={2}>Traceroute Locations</Text>
              <Table variant="simple" size="sm" shadow="md" borderWidth="1px" borderRadius="md">
                <Thead>
                  <Tr>
                    <Th>Hop</Th>
                    <Th>City</Th>
                    <Th>IP Address</Th>
                    <Th>Latitude</Th>
                    <Th>Longitude</Th>
                    <Th>Latency (ms)</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {tracerouteData.map((hop) => (
                    <Tr key={hop.hop}>
                      <Td>{hop.hop}</Td>
                      <Td>{hop.city}</Td>
                      <Td>{hop.ip}</Td>
                      <Td>{hop.latitude}</Td>
                      <Td>{hop.longitude}</Td>
                      <Td>{hop.latency}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </>
          ) : (
            <Text color="gray.500">No traceroute data available for this endpoint.</Text>
          )}
        </Box>
      ),
    },
  ];

  return (
    <LoadScriptOnce>
      <Container maxW="full">
        <Flex align="center" justify="space-between" py={6} flexWrap="wrap" gap={4}>
          <Box textAlign="left" flex="1">
            <Text fontSize="xl" fontWeight="bold">Endpoint: {endpointId}</Text>
            <Text fontSize="sm">Manage settings for {endpointId}.</Text>
          </Box>
        </Flex>
        <Tabs variant="enclosed" isLazy>
          <TabList>
            {tabsConfig.map((tab) => (
              <Tab key={tab.title}>{tab.title}</Tab>
            ))}
          </TabList>
          <TabPanels>
            {tabsConfig.map((tab) => (
              <TabPanel key={tab.title}>{tab.component()}</TabPanel>
            ))}
          </TabPanels>
        </Tabs>
      </Container>
    </LoadScriptOnce>
  );
};

export const Route = createFileRoute("/_layout/scraping-api/endpoints/$endpointId")({
  component: EndpointDetailPage,
});

export default EndpointDetailPage;