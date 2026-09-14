const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 7777;

app.use(cors());
app.use(express.json());

// Serve static files from React build
app.use(express.static(path.join(__dirname, 'client/build')));

// ============================================
// IN-MEMORY DATA (No MongoDB Required)
// ============================================

const karachiAreas = [
  { areaId: "AREA-001", name: "North Karachi", town: "North Karachi", coordinates: { lat: 24.9850, lng: 67.0810 }, demand: 500000, priority: "critical", population: 1800000, congestionLevel: "high" },
  { areaId: "AREA-002", name: "Surjani Town", town: "Surjani Town", coordinates: { lat: 24.9650, lng: 67.0650 }, demand: 400000, priority: "critical", population: 1200000, congestionLevel: "medium" },
  { areaId: "AREA-003", name: "Gulshan-e-Iqbal", town: "Gulshan-e-Iqbal", coordinates: { lat: 24.9200, lng: 67.0650 }, demand: 600000, priority: "high", population: 2000000, congestionLevel: "high" },
  { areaId: "AREA-004", name: "Korangi", town: "Korangi", coordinates: { lat: 24.8700, lng: 67.1050 }, demand: 450000, priority: "high", population: 1500000, congestionLevel: "medium" },
  { areaId: "AREA-005", name: "DHA Phase V", town: "DHA", coordinates: { lat: 24.8050, lng: 67.0350 }, demand: 300000, priority: "medium", population: 500000, congestionLevel: "low" },
  { areaId: "AREA-006", name: "Landhi", town: "Landhi", coordinates: { lat: 24.8450, lng: 67.1550 }, demand: 350000, priority: "high", population: 900000, congestionLevel: "medium" },
  { areaId: "AREA-007", name: "Clifton", town: "Clifton", coordinates: { lat: 24.8100, lng: 67.0250 }, demand: 250000, priority: "low", population: 400000, congestionLevel: "low" },
  { areaId: "AREA-008", name: "Malir", town: "Malir", coordinates: { lat: 24.8650, lng: 67.1950 }, demand: 300000, priority: "medium", population: 700000, congestionLevel: "medium" },
  { areaId: "AREA-009", name: "Saddar", town: "Saddar", coordinates: { lat: 24.8550, lng: 67.0100 }, demand: 350000, priority: "medium", population: 600000, congestionLevel: "high" },
  { areaId: "AREA-010", name: "SITE Area", town: "SITE", coordinates: { lat: 24.8900, lng: 67.1250 }, demand: 200000, priority: "low", population: 300000, congestionLevel: "low" },
  { areaId: "AREA-011", name: "Lyari", town: "Lyari", coordinates: { lat: 24.8700, lng: 67.0050 }, demand: 400000, priority: "critical", population: 1100000, congestionLevel: "severe" },
  { areaId: "AREA-012", name: "Baldia Town", town: "Baldia Town", coordinates: { lat: 24.9250, lng: 67.0000 }, demand: 350000, priority: "high", population: 800000, congestionLevel: "medium" },
  { areaId: "AREA-013", name: "Orangi Town", town: "Orangi Town", coordinates: { lat: 24.9350, lng: 66.9950 }, demand: 450000, priority: "critical", population: 1400000, congestionLevel: "high" },
  { areaId: "AREA-014", name: "SITE Area West", town: "SITE", coordinates: { lat: 24.9050, lng: 66.9850 }, demand: 180000, priority: "low", population: 250000, congestionLevel: "low" },
  { areaId: "AREA-015", name: "North Nazimabad", town: "North Nazimabad", coordinates: { lat: 24.9500, lng: 67.0350 }, demand: 500000, priority: "high", population: 1600000, congestionLevel: "high" },
  { areaId: "AREA-016", name: "Mominabad", town: "Orangi Town", coordinates: { lat: 24.9450, lng: 66.9750 }, demand: 300000, priority: "medium", population: 700000, congestionLevel: "medium" },
  { areaId: "AREA-017", name: "Federal B Area", town: "Federal B Area", coordinates: { lat: 24.9400, lng: 67.0500 }, demand: 400000, priority: "medium", population: 1000000, congestionLevel: "medium" },
  { areaId: "AREA-018", name: "Manghopir", town: "SITE", coordinates: { lat: 24.9150, lng: 66.9650 }, demand: 250000, priority: "medium", population: 500000, congestionLevel: "low" }
];

const waterSources = [
  { sourceId: "WS-001", name: "Keenjhar Lake Treatment Plant", type: "treatment-plant", location: { lat: 24.8500, lng: 67.1500 }, capacity: 2000000, currentOutput: 1500000, waterQuality: "excellent", maxTankerCapacity: 10000, averageWaitTime: 20 },
  { sourceId: "WS-002", name: "Hub Dam Intake", type: "dam", location: { lat: 24.7800, lng: 66.8500 }, capacity: 3000000, currentOutput: 2200000, waterQuality: "excellent", maxTankerCapacity: 10000, averageWaitTime: 25 },
  { sourceId: "WS-003", name: "Norai Abad Pumping Station", type: "well", location: { lat: 24.9200, lng: 67.2200 }, capacity: 800000, currentOutput: 600000, waterQuality: "good", maxTankerCapacity: 5000, averageWaitTime: 15 },
  { sourceId: "WS-004", name: "Gulshan Hydrant Station", type: "hydrant", location: { lat: 24.9150, lng: 67.0600 }, capacity: 500000, currentOutput: 450000, waterQuality: "good", maxTankerCapacity: 5000, averageWaitTime: 10 },
  { sourceId: "WS-005", name: "Korangi Hydrant Complex", type: "hydrant", location: { lat: 24.8650, lng: 67.1000 }, capacity: 600000, currentOutput: 550000, waterQuality: "good", maxTankerCapacity: 5000, averageWaitTime: 12 },
  { sourceId: "WS-006", name: "SITE Treatment Plant", type: "treatment-plant", location: { lat: 24.8950, lng: 67.1300 }, capacity: 1500000, currentOutput: 1200000, waterQuality: "fair", maxTankerCapacity: 10000, averageWaitTime: 18 },
  { sourceId: "WS-007", name: "North Nazimabad Reservoir", type: "reservoir", location: { lat: 24.9450, lng: 67.0300 }, capacity: 1000000, currentOutput: 800000, waterQuality: "good", maxTankerCapacity: 5000, averageWaitTime: 15 },
  { sourceId: "WS-008", name: "Malir Groundwater Well", type: "well", location: { lat: 24.8600, lng: 67.1900 }, capacity: 400000, currentOutput: 350000, waterQuality: "fair", maxTankerCapacity: 3000, averageWaitTime: 10 },
  { sourceId: "WS-009", name: "Landhi Industrial Hydrant", type: "hydrant", location: { lat: 24.8400, lng: 67.1500 }, capacity: 300000, currentOutput: 280000, waterQuality: "fair", maxTankerCapacity: 5000, averageWaitTime: 8 },
  { sourceId: "WS-010", name: "Keamari Port Water Station", type: "treatment-plant", location: { lat: 24.8050, lng: 66.9800 }, capacity: 1200000, currentOutput: 900000, waterQuality: "good", maxTankerCapacity: 10000, averageWaitTime: 22 }
];

const tankers = [
  { tankerId: "TK-001", capacity: 10000, type: "large", currentLocation: { lat: 24.8500, lng: 67.1500 }, driverName: "Ahmed Khan", status: "available", currentLoad: 0, fuelLevel: 85 },
  { tankerId: "TK-002", capacity: 5000, type: "medium", currentLocation: { lat: 24.9200, lng: 67.0650 }, driverName: "Muhammad Ali", status: "available", currentLoad: 0, fuelLevel: 92 },
  { tankerId: "TK-003", capacity: 3000, type: "small", currentLocation: { lat: 24.8700, lng: 67.1050 }, driverName: "Hassan Raza", status: "en-route", currentLoad: 2800, fuelLevel: 70 },
  { tankerId: "TK-004", capacity: 10000, type: "large", currentLocation: { lat: 24.8050, lng: 67.0350 }, driverName: "Imran Shah", status: "available", currentLoad: 0, fuelLevel: 95 },
  { tankerId: "TK-005", capacity: 5000, type: "medium", currentLocation: { lat: 24.8650, lng: 67.1950 }, driverName: "Usman Malik", status: "loading", currentLoad: 3500, fuelLevel: 60 },
  { tankerId: "TK-006", capacity: 5000, type: "medium", currentLocation: { lat: 24.8550, lng: 67.0100 }, driverName: "Bilal Ahmed", status: "available", currentLoad: 0, fuelLevel: 88 },
  { tankerId: "TK-007", capacity: 3000, type: "small", currentLocation: { lat: 24.8900, lng: 67.1250 }, driverName: "Farooq Sindhi", status: "available", currentLoad: 0, fuelLevel: 75 },
  { tankerId: "TK-008", capacity: 10000, type: "large", currentLocation: { lat: 24.9250, lng: 67.0000 }, driverName: "Tariq Baloch", status: "en-route", currentLoad: 9500, fuelLevel: 55 },
  { tankerId: "TK-009", capacity: 5000, type: "medium", currentLocation: { lat: 24.9350, lng: 66.9950 }, driverName: "Zubair Pathan", status: "available", currentLoad: 0, fuelLevel: 82 },
  { tankerId: "TK-010", capacity: 3000, type: "small", currentLocation: { lat: 24.9500, lng: 67.0350 }, driverName: "Kamran Sheikh", status: "maintenance", currentLoad: 0, fuelLevel: 30 },
  { tankerId: "TK-011", capacity: 10000, type: "large", currentLocation: { lat: 24.8450, lng: 67.1200 }, driverName: "Naeem Gujjar", status: "available", currentLoad: 0, fuelLevel: 90 },
  { tankerId: "TK-012", capacity: 5000, type: "medium", currentLocation: { lat: 24.9100, lng: 67.0800 }, driverName: "Rashid Memon", status: "en-route", currentLoad: 4200, fuelLevel: 65 },
  { tankerId: "TK-013", capacity: 5000, type: "medium", currentLocation: { lat: 24.8800, lng: 67.1400 }, driverName: "Shahid Jatt", status: "available", currentLoad: 0, fuelLevel: 78 },
  { tankerId: "TK-014", capacity: 3000, type: "small", currentLocation: { lat: 24.8200, lng: 67.0500 }, driverName: "Waseem Abro", status: "available", currentLoad: 0, fuelLevel: 91 },
  { tankerId: "TK-015", capacity: 10000, type: "large", currentLocation: { lat: 24.8750, lng: 67.1800 }, driverName: "Javed Khosa", status: "loading", currentLoad: 7500, fuelLevel: 45 }
];

const deliveries = [
  { deliveryId: "DEL-001", tankerId: "TK-001", areaId: "AREA-001", scheduledTime: "2026-09-11T08:00:00", status: "completed", loadAmount: 10000, priority: "critical", delayMinutes: 0, delayCost: 0 },
  { deliveryId: "DEL-002", tankerId: "TK-002", areaId: "AREA-003", scheduledTime: "2026-09-11T09:00:00", status: "en-route", loadAmount: 5000, priority: "high", delayMinutes: 0, delayCost: 0 },
  { deliveryId: "DEL-003", tankerId: "TK-008", areaId: "AREA-011", scheduledTime: "2026-09-11T07:00:00", status: "completed", loadAmount: 10000, priority: "critical", delayMinutes: 15, delayCost: 150 },
  { deliveryId: "DEL-004", tankerId: "TK-012", areaId: "AREA-004", scheduledTime: "2026-09-11T10:00:00", status: "en-route", loadAmount: 5000, priority: "high", delayMinutes: 0, delayCost: 0 },
  { deliveryId: "DEL-005", tankerId: "TK-003", areaId: "AREA-002", scheduledTime: "2026-09-11T11:00:00", status: "scheduled", loadAmount: 3000, priority: "medium", delayMinutes: 0, delayCost: 0 },
  { deliveryId: "DEL-006", tankerId: "TK-004", areaId: "AREA-007", scheduledTime: "2026-09-11T06:00:00", status: "completed", loadAmount: 10000, priority: "medium", delayMinutes: 30, delayCost: 90 },
  { deliveryId: "DEL-007", tankerId: "TK-006", areaId: "AREA-009", scheduledTime: "2026-09-11T12:00:00", status: "scheduled", loadAmount: 5000, priority: "medium", delayMinutes: 0, delayCost: 0 },
  { deliveryId: "DEL-008", tankerId: "TK-011", areaId: "AREA-013", scheduledTime: "2026-09-11T08:30:00", status: "completed", loadAmount: 10000, priority: "critical", delayMinutes: 0, delayCost: 0 },
  { deliveryId: "DEL-009", tankerId: "TK-009", areaId: "AREA-015", scheduledTime: "2026-09-11T13:00:00", status: "scheduled", loadAmount: 5000, priority: "high", delayMinutes: 0, delayCost: 0 },
  { deliveryId: "DEL-010", tankerId: "TK-013", areaId: "AREA-006", scheduledTime: "2026-09-11T14:00:00", status: "scheduled", loadAmount: 5000, priority: "high", delayMinutes: 0, delayCost: 0 }
];

const roadNetwork = {
  nodes: [
    { id: "WS-001", type: "source", lat: 24.8500, lng: 67.1500 },
    { id: "WS-002", type: "source", lat: 24.7800, lng: 66.8500 },
    { id: "WS-003", type: "source", lat: 24.9200, lng: 67.2200 },
    { id: "WS-004", type: "source", lat: 24.9150, lng: 67.0600 },
    { id: "WS-005", type: "source", lat: 24.8650, lng: 67.1000 },
    { id: "WS-006", type: "source", lat: 24.8950, lng: 67.1300 },
    { id: "WS-007", type: "source", lat: 24.9450, lng: 67.0300 },
    { id: "WS-008", type: "source", lat: 24.8600, lng: 67.1900 },
    { id: "WS-009", type: "source", lat: 24.8400, lng: 67.1500 },
    { id: "WS-010", type: "source", lat: 24.8050, lng: 66.9800 },
    { id: "AREA-001", type: "area", lat: 24.9850, lng: 67.0810 },
    { id: "AREA-002", type: "area", lat: 24.9650, lng: 67.0650 },
    { id: "AREA-003", type: "area", lat: 24.9200, lng: 67.0650 },
    { id: "AREA-004", type: "area", lat: 24.8700, lng: 67.1050 },
    { id: "AREA-005", type: "area", lat: 24.8050, lng: 67.0350 },
    { id: "AREA-006", type: "area", lat: 24.8450, lng: 67.1550 },
    { id: "AREA-007", type: "area", lat: 24.8100, lng: 67.0250 },
    { id: "AREA-008", type: "area", lat: 24.8650, lng: 67.1950 },
    { id: "AREA-009", type: "area", lat: 24.8550, lng: 67.0100 },
    { id: "AREA-010", type: "area", lat: 24.8900, lng: 67.1250 },
    { id: "AREA-011", type: "area", lat: 24.8700, lng: 67.0050 },
    { id: "AREA-012", type: "area", lat: 24.9250, lng: 67.0000 },
    { id: "AREA-013", type: "area", lat: 24.9350, lng: 66.9950 },
    { id: "AREA-014", type: "area", lat: 24.9050, lng: 66.9850 },
    { id: "AREA-015", type: "area", lat: 24.9500, lng: 67.0350 },
    { id: "AREA-016", type: "area", lat: 24.9450, lng: 66.9750 },
    { id: "AREA-017", type: "area", lat: 24.9400, lng: 67.0500 },
    { id: "AREA-018", type: "area", lat: 24.9150, lng: 66.9650 },
    { id: "HYD-001", type: "junction", lat: 24.9750, lng: 67.0750 },
    { id: "HYD-002", type: "junction", lat: 24.9400, lng: 67.0700 },
    { id: "HYD-003", type: "junction", lat: 24.9150, lng: 67.0950 },
    { id: "HYD-004", type: "junction", lat: 24.8850, lng: 67.0800 },
    { id: "HYD-005", type: "junction", lat: 24.8550, lng: 67.1200 },
    { id: "HYD-006", type: "junction", lat: 24.8250, lng: 67.0550 },
    { id: "HYD-007", type: "junction", lat: 24.8550, lng: 67.1750 },
    { id: "HYD-008", type: "junction", lat: 24.8350, lng: 67.0200 },
    { id: "HYD-009", type: "junction", lat: 24.8750, lng: 67.1600 },
    { id: "HYD-010", type: "junction", lat: 24.8600, lng: 67.0150 },
    { id: "HYD-011", type: "junction", lat: 24.8950, lng: 67.1100 },
    { id: "HYD-012", type: "junction", lat: 24.8750, lng: 67.0050 },
    { id: "HYD-013", type: "junction", lat: 24.9150, lng: 67.0050 },
    { id: "HYD-014", type: "junction", lat: 24.9300, lng: 67.0100 },
    { id: "HYD-015", type: "junction", lat: 24.9100, lng: 66.9900 },
    { id: "HYD-016", type: "junction", lat: 24.9450, lng: 67.0200 },
    { id: "HYD-017", type: "junction", lat: 24.9350, lng: 66.9850 },
    { id: "HYD-018", type: "junction", lat: 24.9400, lng: 67.0400 },
    { id: "HYD-019", type: "junction", lat: 24.9200, lng: 66.9750 }
  ],
  edges: [
    { from: "WS-001", to: "AREA-006", weight: 12, distance: 8.5, time: 25, capacity: 15 },
    { from: "WS-001", to: "AREA-008", weight: 10, distance: 7.2, time: 20, capacity: 12 },
    { from: "WS-001", to: "AREA-010", weight: 8, distance: 5.5, time: 15, capacity: 10 },
    { from: "WS-002", to: "AREA-005", weight: 25, distance: 18.0, time: 50, capacity: 20 },
    { from: "WS-002", to: "AREA-007", weight: 28, distance: 20.0, time: 55, capacity: 18 },
    { from: "WS-002", to: "AREA-010", weight: 22, distance: 16.0, time: 45, capacity: 16 },
    { from: "WS-003", to: "AREA-001", weight: 15, distance: 11.0, time: 30, capacity: 14 },
    { from: "WS-003", to: "AREA-002", weight: 18, distance: 13.0, time: 35, capacity: 13 },
    { from: "WS-003", to: "AREA-003", weight: 12, distance: 9.0, time: 25, capacity: 11 },
    { from: "WS-004", to: "AREA-003", weight: 5, distance: 3.5, time: 10, capacity: 8 },
    { from: "WS-004", to: "AREA-015", weight: 8, distance: 5.5, time: 15, capacity: 9 },
    { from: "WS-004", to: "AREA-017", weight: 6, distance: 4.0, time: 12, capacity: 7 },
    { from: "WS-005", to: "AREA-004", weight: 6, distance: 4.0, time: 12, capacity: 8 },
    { from: "WS-005", to: "AREA-006", weight: 10, distance: 7.0, time: 18, capacity: 10 },
    { from: "WS-005", to: "AREA-010", weight: 4, distance: 2.5, time: 8, capacity: 6 },
    { from: "WS-006", to: "AREA-004", weight: 8, distance: 5.5, time: 15, capacity: 9 },
    { from: "WS-006", to: "AREA-010", weight: 3, distance: 2.0, time: 6, capacity: 5 },
    { from: "WS-006", to: "AREA-014", weight: 12, distance: 8.5, time: 22, capacity: 11 },
    { from: "WS-007", to: "AREA-015", weight: 4, distance: 2.5, time: 8, capacity: 6 },
    { from: "WS-007", to: "AREA-017", weight: 3, distance: 2.0, time: 6, capacity: 5 },
    { from: "WS-007", to: "AREA-012", weight: 10, distance: 7.0, time: 18, capacity: 10 },
    { from: "WS-008", to: "AREA-008", weight: 5, distance: 3.5, time: 10, capacity: 7 },
    { from: "WS-008", to: "AREA-006", weight: 12, distance: 8.5, time: 25, capacity: 11 },
    { from: "WS-009", to: "AREA-006", weight: 3, distance: 2.0, time: 6, capacity: 5 },
    { from: "WS-009", to: "AREA-010", weight: 6, distance: 4.0, time: 12, capacity: 7 },
    { from: "WS-010", to: "AREA-007", weight: 5, distance: 3.5, time: 10, capacity: 7 },
    { from: "WS-010", to: "AREA-009", weight: 8, distance: 5.5, time: 15, capacity: 9 },
    { from: "WS-010", to: "AREA-011", weight: 10, distance: 7.0, time: 18, capacity: 10 },
    { from: "AREA-001", to: "AREA-002", weight: 5, distance: 3.5, time: 10, capacity: 8 },
    { from: "AREA-002", to: "AREA-003", weight: 8, distance: 5.5, time: 15, capacity: 9 },
    { from: "AREA-003", to: "AREA-005", weight: 15, distance: 11.0, time: 30, capacity: 12 },
    { from: "AREA-004", to: "AREA-006", weight: 10, distance: 7.0, time: 18, capacity: 10 },
    { from: "AREA-005", to: "AREA-007", weight: 4, distance: 2.5, time: 8, capacity: 6 },
    { from: "AREA-006", to: "AREA-008", weight: 8, distance: 5.5, time: 15, capacity: 9 },
    { from: "AREA-007", to: "AREA-009", weight: 6, distance: 4.0, time: 12, capacity: 7 },
    { from: "AREA-008", to: "AREA-010", weight: 12, distance: 8.5, time: 22, capacity: 11 },
    { from: "AREA-009", to: "AREA-011", weight: 5, distance: 3.5, time: 10, capacity: 8 },
    { from: "AREA-010", to: "AREA-012", weight: 15, distance: 11.0, time: 28, capacity: 12 },
    { from: "AREA-011", to: "AREA-013", weight: 4, distance: 2.5, time: 8, capacity: 6 },
    { from: "AREA-012", to: "AREA-014", weight: 6, distance: 4.0, time: 12, capacity: 7 },
    { from: "AREA-013", to: "AREA-015", weight: 10, distance: 7.0, time: 18, capacity: 10 },
    { from: "AREA-014", to: "AREA-016", weight: 5, distance: 3.5, time: 10, capacity: 8 },
    { from: "AREA-015", to: "AREA-017", weight: 4, distance: 2.5, time: 8, capacity: 6 },
    { from: "AREA-016", to: "AREA-018", weight: 8, distance: 5.5, time: 15, capacity: 9 },
    { from: "HYD-001", to: "AREA-001", weight: 2, distance: 1.2, time: 4, capacity: 4 },
    { from: "HYD-001", to: "AREA-002", weight: 3, distance: 2.0, time: 6, capacity: 5 },
    { from: "HYD-002", to: "AREA-003", weight: 2, distance: 1.5, time: 5, capacity: 4 },
    { from: "HYD-002", to: "AREA-015", weight: 4, distance: 2.8, time: 8, capacity: 6 },
    { from: "HYD-003", to: "AREA-004", weight: 3, distance: 2.0, time: 6, capacity: 5 },
    { from: "HYD-004", to: "AREA-003", weight: 5, distance: 3.5, time: 10, capacity: 7 },
    { from: "HYD-005", to: "AREA-006", weight: 4, distance: 2.8, time: 8, capacity: 6 },
    { from: "HYD-006", to: "AREA-005", weight: 2, distance: 1.5, time: 5, capacity: 4 },
    { from: "HYD-007", to: "AREA-008", weight: 3, distance: 2.0, time: 6, capacity: 5 },
    { from: "HYD-008", to: "AREA-009", weight: 2, distance: 1.5, time: 5, capacity: 4 },
    { from: "HYD-009", to: "AREA-008", weight: 3, distance: 2.0, time: 6, capacity: 5 },
    { from: "HYD-010", to: "AREA-009", weight: 2, distance: 1.2, time: 4, capacity: 4 },
    { from: "HYD-011", to: "AREA-010", weight: 2, distance: 1.5, time: 5, capacity: 4 },
    { from: "HYD-012", to: "AREA-011", weight: 3, distance: 2.0, time: 6, capacity: 5 },
    { from: "HYD-013", to: "AREA-012", weight: 2, distance: 1.5, time: 5, capacity: 4 },
    { from: "HYD-014", to: "AREA-013", weight: 3, distance: 2.0, time: 6, capacity: 5 },
    { from: "HYD-015", to: "AREA-014", weight: 2, distance: 1.2, time: 4, capacity: 4 },
    { from: "HYD-016", to: "AREA-015", weight: 2, distance: 1.5, time: 5, capacity: 4 },
    { from: "HYD-017", to: "AREA-016", weight: 3, distance: 2.0, time: 6, capacity: 5 },
    { from: "HYD-018", to: "AREA-017", weight: 2, distance: 1.2, time: 4, capacity: 4 },
    { from: "HYD-019", to: "AREA-018", weight: 3, distance: 2.0, time: 6, capacity: 5 }
  ]
};

const bookings = [
  { id: 'BK-001', customerName: 'Ahmed Khan', phone: '0300-1234567', email: 'ahmed@email.com', area: 'DHA Phase V', areaId: 'AREA-005', tankerSize: 'large', capacity: 10000, address: 'DHA Phase 5, Street 12, House 45', instructions: 'Ring doorbell twice', date: '2026-09-11', timeSlot: '10:00-12:00', status: 'delivered', amount: 4500, paymentMethod: 'cash', paymentStatus: 'completed', createdAt: '2026-09-10T08:00:00' },
  { id: 'BK-002', customerName: 'Fatima Ali', phone: '0301-2345678', email: 'fatima@email.com', area: 'Gulshan-e-Iqbal', areaId: 'AREA-003', tankerSize: 'medium', capacity: 5000, address: 'Gulshan-e-Iqbal, Block 13, Apt 2B', instructions: '', date: '2026-09-11', timeSlot: '14:00-16:00', status: 'dispatched', amount: 3000, paymentMethod: 'jazzcash', paymentStatus: 'completed', createdAt: '2026-09-10T09:30:00' },
  { id: 'BK-003', customerName: 'Muhammad Hassan', phone: '0302-3456789', email: 'hassan@email.com', area: 'North Nazimabad', areaId: 'AREA-015', tankerSize: 'small', capacity: 3000, address: 'North Nazimabad, Sector 7, House 12', instructions: 'Call before arriving', date: '2026-09-12', timeSlot: '08:00-10:00', status: 'confirmed', amount: 2200, paymentMethod: 'easypaisa', paymentStatus: 'completed', createdAt: '2026-09-11T06:00:00' },
  { id: 'BK-004', customerName: 'Ayesha Siddiqui', phone: '0303-4567890', email: 'ayesha@email.com', area: 'Korangi', areaId: 'AREA-004', tankerSize: 'large', capacity: 10000, address: 'Korangi Industrial Area, Plot 56', instructions: '', date: '2026-09-12', timeSlot: '12:00-14:00', status: 'pending', amount: 4200, paymentMethod: 'bank', paymentStatus: 'pending', createdAt: '2026-09-11T07:15:00' },
  { id: 'BK-005', customerName: 'Usman Malik', phone: '0304-5678901', email: 'usman@email.com', area: 'Saddar', areaId: 'AREA-009', tankerSize: 'medium', capacity: 5000, address: 'Saddar, Circular Road, Shop 8', instructions: 'Delivery at back entrance', date: '2026-09-11', timeSlot: '16:00-18:00', status: 'delivered', amount: 3200, paymentMethod: 'cash', paymentStatus: 'completed', createdAt: '2026-09-10T10:00:00' },
  { id: 'BK-006', customerName: 'Zainab Bibi', phone: '0305-6789012', email: 'zainab@email.com', area: 'Lyari', areaId: 'AREA-011', tankerSize: 'small', capacity: 3000, address: 'Lyari Town, Mohalla Abbas, House 3', instructions: '', date: '2026-09-12', timeSlot: '10:00-12:00', status: 'pending', amount: 2500, paymentMethod: 'jazzcash', paymentStatus: 'pending', createdAt: '2026-09-11T08:30:00' }
];

const drivers = [
  { id: 'DRV-001', name: 'Ahmed Khan', cnic: '42101-1234567-8', license: 'KHI-2024-001', phone: '0300-1111111', bloodGroup: 'B+', emergencyContact: '0300-2222222', status: 'available', rating: 4.8, totalTrips: 245, onTimePercent: 96, joinDate: '2024-01-15' },
  { id: 'DRV-002', name: 'Muhammad Ali', cnic: '42101-2345678-9', license: 'KHI-2024-002', phone: '0301-3333333', bloodGroup: 'A+', emergencyContact: '0301-4444444', status: 'on-duty', rating: 4.6, totalTrips: 189, onTimePercent: 94, joinDate: '2024-03-20' },
  { id: 'DRV-003', name: 'Hassan Raza', cnic: '42101-3456789-0', license: 'KHI-2024-003', phone: '0302-5555555', bloodGroup: 'O-', emergencyContact: '0302-6666666', status: 'available', rating: 4.9, totalTrips: 312, onTimePercent: 98, joinDate: '2023-11-10' },
  { id: 'DRV-004', name: 'Imran Shah', cnic: '42101-4567890-1', license: 'KHI-2024-004', phone: '0303-7777777', bloodGroup: 'AB+', emergencyContact: '0303-8888888', status: 'off-duty', rating: 4.3, totalTrips: 156, onTimePercent: 91, joinDate: '2024-06-01' },
  { id: 'DRV-005', name: 'Bilal Ahmed', cnic: '42101-5678901-2', license: 'KHI-2024-005', phone: '0304-9999999', bloodGroup: 'A-', emergencyContact: '0304-0000000', status: 'available', rating: 4.7, totalTrips: 198, onTimePercent: 95, joinDate: '2024-02-28' }
];

const dispatches = [
  { id: 'DSP-001', bookingId: 'BK-002', tankerId: 'TK-003', driverId: 'DRV-002', status: 'en-route', dispatchTime: '2026-09-11T10:30:00', estimatedArrival: '2026-09-11T14:30:00', actualArrival: null, route: 'WS-004 → AREA-003', distance: 3.5, currentLat: 24.895, currentLng: 67.075 },
  { id: 'DSP-002', bookingId: 'BK-001', tankerId: 'TK-001', driverId: 'DRV-003', status: 'delivered', dispatchTime: '2026-09-11T08:30:00', estimatedArrival: '2026-09-11T11:00:00', actualArrival: '2026-09-11T10:45:00', route: 'WS-001 → AREA-005', distance: 18.0, currentLat: 24.805, currentLng: 67.035 }
];

const payments = [
  { id: 'PAY-001', bookingId: 'BK-001', customerName: 'Ahmed Khan', amount: 4500, method: 'cash', status: 'completed', date: '2026-09-11T10:45:00', reference: null },
  { id: 'PAY-002', bookingId: 'BK-002', customerName: 'Fatima Ali', amount: 3000, method: 'jazzcash', status: 'completed', date: '2026-09-10T09:35:00', reference: 'JC-887766' },
  { id: 'PAY-003', bookingId: 'BK-003', customerName: 'Muhammad Hassan', amount: 2200, method: 'easypaisa', status: 'completed', date: '2026-09-11T06:05:00', reference: 'EP-554433' },
  { id: 'PAY-004', bookingId: 'BK-005', customerName: 'Usman Malik', amount: 3200, method: 'cash', status: 'completed', date: '2026-09-11T17:00:00', reference: null },
  { id: 'PAY-005', bookingId: 'BK-004', customerName: 'Ayesha Siddiqui', amount: 4200, method: 'bank', status: 'pending', date: null, reference: null }
];

const qualityTests = [
  { id: 'QT-001', tankerId: 'TK-001', source: 'WS-001', ph: 7.2, tds: 180, turbidity: 0.5, chlorine: 0.8, bacteria: 'pass', testDate: '2026-09-11T07:00:00', testedBy: 'Lab Tech 1', score: 95 },
  { id: 'QT-002', tankerId: 'TK-003', source: 'WS-004', ph: 7.0, tds: 200, turbidity: 0.8, chlorine: 0.7, bacteria: 'pass', testDate: '2026-09-11T09:00:00', testedBy: 'Lab Tech 2', score: 92 },
  { id: 'QT-003', tankerId: 'TK-011', source: 'WS-006', ph: 6.8, tds: 250, turbidity: 1.2, chlorine: 0.6, bacteria: 'pass', testDate: '2026-09-10T14:00:00', testedBy: 'Lab Tech 1', score: 85 }
];

const maintenance = [
  { id: 'MNT-001', tankerId: 'TK-001', type: 'Oil Change', lastService: '2026-08-15', nextService: '2026-10-15', mileage: 45000, cost: 8500, status: 'current', notes: 'Regular 10W-40 oil change' },
  { id: 'MNT-002', tankerId: 'TK-001', type: 'Tank Cleaning', lastService: '2026-07-01', nextService: '2026-10-01', mileage: 42000, cost: 12000, status: 'current', notes: 'Deep clean with sanitizer' },
  { id: 'MNT-003', tankerId: 'TK-002', type: 'Brake Service', lastService: '2026-06-20', nextService: '2026-09-20', mileage: 38000, cost: 15000, status: 'overdue', notes: 'Front and rear brake pad replacement' },
  { id: 'MNT-004', tankerId: 'TK-003', type: 'Tire Rotation', lastService: '2026-08-01', nextService: '2026-11-01', mileage: 32000, cost: 4000, status: 'current', notes: 'All 6 tires rotated' },
  { id: 'MNT-005', tankerId: 'TK-004', type: 'Engine Service', lastService: '2026-05-10', nextService: '2026-08-10', mileage: 55000, cost: 25000, status: 'overdue', notes: 'Full engine tune-up required' }
];

// ============================================
// ALGORITHM IMPLEMENTATIONS
// ============================================

// Min-Heap for Dijkstra
class MinHeap {
  constructor() { this.heap = []; }
  push(node) { this.heap.push(node); this.bubbleUp(this.heap.length - 1); }
  pop() {
    if (this.heap.length === 0) return null;
    const min = this.heap[0];
    const end = this.heap.pop();
    if (this.heap.length > 0) { this.heap[0] = end; this.sinkDown(0); }
    return min;
  }
  bubbleUp(idx) {
    const element = this.heap[idx];
    while (idx > 0) {
      const parentIdx = Math.floor((idx - 1) / 2);
      const parent = this.heap[parentIdx];
      if (element.distance >= parent.distance) break;
      this.heap[parentIdx] = element; this.heap[idx] = parent; idx = parentIdx;
    }
  }
  sinkDown(idx) {
    const length = this.heap.length;
    const element = this.heap[idx];
    while (true) {
      const leftChildIdx = 2 * idx + 1;
      const rightChildIdx = 2 * idx + 2;
      let swap = null;
      if (leftChildIdx < length && this.heap[leftChildIdx].distance < element.distance) swap = leftChildIdx;
      if (rightChildIdx < length) {
        const rightChild = this.heap[rightChildIdx];
        if ((swap === null && rightChild.distance < element.distance) || (swap !== null && rightChild.distance < this.heap[leftChildIdx].distance)) swap = rightChildIdx;
      }
      if (swap === null) break;
      this.heap[idx] = this.heap[swap]; this.heap[swap] = element; idx = swap;
    }
  }
  isEmpty() { return this.heap.length === 0; }
}

// Dijkstra's Algorithm
function dijkstra(graph, source, destination, weightType = 'weight') {
  const startTime = performance.now();
  const distances = {}, previous = {}, visited = new Set(), steps = [];
  const nodes = new Set();
  graph.edges.forEach(edge => { nodes.add(edge.from); nodes.add(edge.to); });
  const adjacencyList = {};
  nodes.forEach(node => { adjacencyList[node] = []; });
  graph.edges.forEach(edge => {
    adjacencyList[edge.from].push({ node: edge.to, weight: edge[weightType] });
    adjacencyList[edge.to].push({ node: edge.from, weight: edge[weightType] });
  });
  nodes.forEach(node => { distances[node] = Infinity; previous[node] = null; });
  distances[source] = 0;
  const pq = new MinHeap();
  pq.push({ node: source, distance: 0 });
  while (!pq.isEmpty()) {
    const current = pq.pop();
    if (visited.has(current.node)) continue;
    visited.add(current.node);
    steps.push({ step: steps.length + 1, currentNode: current.node, distances: { ...distances }, visited: [...visited] });
    if (current.node === destination) break;
    adjacencyList[current.node].forEach(neighbor => {
      if (!visited.has(neighbor.node)) {
        const newDist = distances[current.node] + neighbor.weight;
        if (newDist < distances[neighbor.node]) {
          distances[neighbor.node] = newDist;
          previous[neighbor.node] = current.node;
          pq.push({ node: neighbor.node, distance: newDist });
        }
      }
    });
  }
  const path = [];
  let curr = destination;
  while (curr) { path.unshift(curr); curr = previous[curr]; }
  if (path[0] !== source) return { success: false, message: 'No path found', steps, executionTime: performance.now() - startTime };
  const pathEdges = [];
  for (let i = 0; i < path.length - 1; i++) {
    const edge = graph.edges.find(e => (e.from === path[i] && e.to === path[i+1]) || (e.to === path[i] && e.from === path[i+1]));
    if (edge) pathEdges.push({ from: path[i], to: path[i+1], weight: edge[weightType], distance: edge.distance, time: edge.time });
  }
  return {
    success: true, path, pathEdges, totalDistance: distances[destination],
    totalTime: pathEdges.reduce((sum, e) => sum + e.time, 0),
    totalKm: pathEdges.reduce((sum, e) => sum + e.distance, 0),
    steps,
    complexity: { time: 'O((V + E) log V)', space: 'O(V + E)', vertices: nodes.size, edges: graph.edges.length },
    executionTime: performance.now() - startTime
  };
}

// Greedy Algorithm
function greedyAssignment(tankersList, areasList) {
  const startTime = performance.now();
  const steps = [], assignments = [];
  const availableTankers = [...tankersList];
  const calculateDistance = (loc1, loc2) => {
    const R = 6371;
    const dLat = (loc2.lat - loc1.lat) * Math.PI / 180;
    const dLon = (loc2.lng - loc1.lng) * Math.PI / 180;
    const a = Math.sin(dLat/2)**2 + Math.cos(loc1.lat*Math.PI/180) * Math.cos(loc2.lat*Math.PI/180) * Math.sin(dLon/2)**2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  };
  const pw = { critical: 4, high: 3, medium: 2, low: 1 };
  const sortedAreas = [...areasList].sort((a, b) => pw[b.priority] - pw[a.priority] || b.demand - a.demand);
  for (const area of sortedAreas) {
    let bestTanker = null, bestScore = -Infinity;
    for (const tanker of availableTankers) {
      if (tanker.status !== 'available' || tanker.capacity < 1000) continue;
      const distance = calculateDistance(tanker.currentLocation, area.coordinates);
      const score = (pw[area.priority] * 100) + (tanker.capacity / area.demand * 50) - (distance * 5);
      if (score > bestScore) { bestScore = score; bestTanker = tanker; }
    }
    if (bestTanker) {
      const distance = calculateDistance(bestTanker.currentLocation, area.coordinates);
      assignments.push({ tanker: bestTanker, area, distance: distance.toFixed(2), score: bestScore.toFixed(2), efficiency: (bestTanker.capacity / area.demand * 100).toFixed(1) });
      const idx = availableTankers.findIndex(t => t.tankerId === bestTanker.tankerId);
      if (idx > -1) availableTankers.splice(idx, 1);
      steps.push({ step: steps.length + 1, area: area.name, tanker: bestTanker.tankerId, distance: distance.toFixed(2) });
    }
  }
  const totalDist = assignments.reduce((s, a) => s + parseFloat(a.distance), 0);
  return {
    success: assignments.length > 0, assignments,
    statistics: { totalAssigned: assignments.length, totalUnassigned: sortedAreas.length - assignments.length, totalDistance: totalDist.toFixed(2), averageEfficiency: (assignments.reduce((s, a) => s + parseFloat(a.efficiency), 0) / (assignments.length || 1)).toFixed(1) },
    steps,
    complexity: { time: 'O(n * m * log n)', space: 'O(n + m)' },
    executionTime: performance.now() - startTime
  };
}

// DP Scheduler
function dpSchedule(deliveriesList, tankerCount, timeSlots = 14) {
  const startTime = performance.now();
  const pw = { critical: 10, high: 5, medium: 3, low: 1 };
  const schedule = [];
  const sortedDeliveries = [...deliveriesList].sort((a, b) => pw[b.priority] - pw[a.priority]);
  const usedSlots = {};
  for (let t = 1; t <= tankerCount; t++) usedSlots[t] = new Set();
  let totalDelay = 0, totalDelayCost = 0;
  for (const delivery of sortedDeliveries) {
    const scheduledHour = parseInt(delivery.scheduledTime.split('T')[1]) || 8;
    const timeSlot = scheduledHour - 6;
    let bestTanker = 1, bestSlot = timeSlot, bestCost = Infinity;
    for (let t = 1; t <= tankerCount; t++) {
      for (let s = timeSlot; s < timeSlots; s++) {
        if (!usedSlots[t].has(s)) {
          const delay = s - timeSlot;
          const cost = delay * (pw[delivery.priority] || 1) * 10;
          if (cost < bestCost) { bestCost = cost; bestTanker = t; bestSlot = s; }
        }
      }
    }
    usedSlots[bestTanker].add(bestSlot);
    const delay = bestSlot - timeSlot;
    const delayCost = delay * (pw[delivery.priority] || 1) * 10;
    totalDelay += delay;
    totalDelayCost += delayCost;
    schedule.push({ ...delivery, tanker: bestTanker, startTime: 6 + bestSlot, endTime: 7 + bestSlot, timeLabel: `${6+bestSlot}:00 - ${7+bestSlot}:00`, delay, delayCost });
  }
  return {
    success: schedule.length > 0, schedule,
    statistics: { totalScheduled: schedule.length, totalDelaySlots: totalDelay, totalDelayCost: totalDelayCost.toFixed(2), averageDelay: (totalDelay / (schedule.length || 1)).toFixed(2) },
    complexity: { time: 'O(n * T * k)', space: 'O(k * T * n)' },
    executionTime: performance.now() - startTime
  };
}

// Backtracking Slot Allocator
function backtrackSlotAllocation(sourcesList, requests) {
  const startTime = performance.now();
  const steps = [], assignments = [];
  const usedSlots = {};
  sourcesList.forEach(s => { usedSlots[s.sourceId] = new Set(); });
  const pw = { critical: 4, high: 3, medium: 2, low: 1 };
  const sortedRequests = [...requests].sort((a, b) => pw[b.priority] - pw[a.priority]);
  for (const req of sortedRequests) {
    let assigned = false;
    for (let hour = req.requestedHour; hour < 20; hour++) {
      if (!usedSlots[req.sourceId].has(hour)) {
        usedSlots[req.sourceId].add(hour);
        assignments.push({ ...req, hour, delay: hour - req.requestedHour });
        steps.push({ step: steps.length + 1, tanker: req.tankerId, hour, action: 'assigned', delay: hour - req.requestedHour });
        assigned = true;
        break;
      }
    }
    if (!assigned) steps.push({ step: steps.length + 1, tanker: req.tankerId, action: 'conflict' });
  }
  const onTime = assignments.filter(a => a.delay === 0).length;
  return {
    success: assignments.length > 0, assignments,
    statistics: { totalAssigned: assignments.length, totalConflicts: requests.length - assignments.length, scheduledOnTime: onTime, averageDelay: (assignments.reduce((s, a) => s + a.delay, 0) / (assignments.length || 1)).toFixed(2) },
    steps,
    complexity: { time: 'O(m^n) worst case', space: 'O(n + m * T)' },
    executionTime: performance.now() - startTime
  };
}

// Ford-Fulkerson Max Flow
function fordFulkerson(graph, source, sink) {
  const startTime = performance.now();
  const nodes = new Set();
  graph.edges.forEach(e => { nodes.add(e.from); nodes.add(e.to); });
  const capacity = {}, flow = {}, adjacency = {};
  nodes.forEach(n => { adjacency[n] = new Set(); capacity[n] = {}; flow[n] = {}; });
  graph.edges.forEach(e => {
    capacity[e.from][e.to] = (capacity[e.from][e.to] || 0) + (e.capacity || 10);
    flow[e.from][e.to] = 0; flow[e.to][e.from] = 0;
    adjacency[e.from].add(e.to); adjacency[e.to].add(e.from);
  });
  const steps = [];
  let totalFlow = 0, iteration = 0;
  function bfs() {
    const visited = new Set(), queue = [[source, []]];
    visited.add(source);
    while (queue.length > 0) {
      const [current, path] = queue.shift();
      if (current === sink) return path;
      for (const neighbor of adjacency[current]) {
        if (!visited.has(neighbor) && capacity[current][neighbor] - flow[current][neighbor] > 0) {
          visited.add(neighbor);
          queue.push([neighbor, [...path, { from: current, to: neighbor }]]);
        }
      }
    }
    return null;
  }
  let augmentingPath;
  while ((augmentingPath = bfs()) && iteration < 100) {
    iteration++;
    let bottleneck = Infinity;
    augmentingPath.forEach(e => { bottleneck = Math.min(bottleneck, capacity[e.from][e.to] - flow[e.from][e.to]); });
    augmentingPath.forEach(e => { flow[e.from][e.to] += bottleneck; flow[e.to][e.from] -= bottleneck; });
    totalFlow += bottleneck;
    steps.push({ iteration, path: augmentingPath.map(e => `${e.from} -> ${e.to}`), bottleneck, totalFlow });
  }
  const flowDistribution = [];
  graph.edges.forEach(e => {
    if (flow[e.from][e.to] > 0) {
      flowDistribution.push({ from: e.from, to: e.to, flow: flow[e.from][e.to], capacity: capacity[e.from][e.to], utilization: ((flow[e.from][e.to] / capacity[e.from][e.to]) * 100).toFixed(1) });
    }
  });
  return {
    success: totalFlow > 0, maxFlow: totalFlow, flowDistribution, steps,
    statistics: { totalFlow, iterations: iteration, edgesWithFlow: flowDistribution.length, avgUtilization: (flowDistribution.reduce((s, f) => s + parseFloat(f.utilization), 0) / (flowDistribution.length || 1)).toFixed(1) },
    complexity: { time: 'O(E * max_flow)', space: 'O(V + E)' },
    executionTime: performance.now() - startTime
  };
}

// ============================================
// API ROUTES
// ============================================

app.get('/api/health', (req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

// CRUD Routes
app.get('/api/tankers', (req, res) => res.json(tankers));
app.get('/api/areas', (req, res) => res.json(karachiAreas));
app.get('/api/sources', (req, res) => res.json(waterSources));
app.get('/api/deliveries', (req, res) => res.json(deliveries));
app.get('/api/sources/:type', (req, res) => res.json(waterSources.filter(s => s.type === req.params.type)));
app.get('/api/tankers/status/:status', (req, res) => res.json(tankers.filter(t => t.status === req.params.status)));
app.get('/api/areas/priority/:priority', (req, res) => res.json(karachiAreas.filter(a => a.priority === req.params.priority)));

// Algorithm Routes
app.post('/api/algorithms/dijkstra', (req, res) => {
  const { source, destination, weightType = 'weight' } = req.body;
  res.json(dijkstra(roadNetwork, source, destination, weightType));
});

app.post('/api/algorithms/greedy', (req, res) => {
  const { tankers: t, areas: a } = req.body;
  res.json(greedyAssignment(t || tankers, a || karachiAreas));
});

app.post('/api/algorithms/dp-schedule', (req, res) => {
  const { deliveries: d, tankerCount, timeSlots } = req.body;
  res.json(dpSchedule(d || deliveries, tankerCount || 10, timeSlots || 14));
});

app.post('/api/algorithms/backtrack', (req, res) => {
  const { sources: s, tankers: t } = req.body;
  const requests = (t || tankers.slice(0, 8)).map((tk, i) => ({
    tankerId: tk.tankerId, sourceId: (s || waterSources)[i % (s || waterSources).length].sourceId,
    requestedHour: 8 + Math.floor(Math.random() * 8), priority: ['critical', 'high', 'medium', 'low'][i % 4]
  }));
  res.json(backtrackSlotAllocation(s || waterSources, requests));
});

app.post('/api/algorithms/maxflow', (req, res) => {
  const { graph, source, sink } = req.body;
  res.json(fordFulkerson(graph || roadNetwork, source || 'WS-001', sink || 'AREA-001'));
});

app.get('/api/algorithms/road-network', (req, res) => res.json(roadNetwork));

// Analytics Routes
app.get('/api/analytics/dashboard', (req, res) => {
  const available = tankers.filter(t => t.status === 'available').length;
  const enRoute = tankers.filter(t => t.status === 'en-route').length;
  const maintenance = tankers.filter(t => t.status === 'maintenance').length;
  res.json({
    tankers: { total: tankers.length, available, enRoute, maintenance, utilization: ((enRoute / tankers.length) * 100).toFixed(1) },
    areas: { total: karachiAreas.length, priority: { critical: karachiAreas.filter(a => a.priority === 'critical').length, high: karachiAreas.filter(a => a.priority === 'high').length, medium: karachiAreas.filter(a => a.priority === 'medium').length, low: karachiAreas.filter(a => a.priority === 'low').length }, totalDemand: karachiAreas.reduce((s, a) => s + a.demand, 0) },
    deliveries: { total: deliveries.length, pending: deliveries.filter(d => d.status === 'scheduled').length, completed: deliveries.filter(d => d.status === 'completed').length, delayed: deliveries.filter(d => d.delayMinutes > 0).length, totalDelayCost: deliveries.reduce((s, d) => s + d.delayCost, 0) },
    sources: { total: waterSources.length, operational: waterSources.filter(s => true).length, totalCapacity: waterSources.reduce((s, src) => s + src.capacity, 0), currentOutput: waterSources.reduce((s, src) => s + src.currentOutput, 0) },
    capacity: { totalTankerCapacity: tankers.reduce((s, t) => s + t.capacity, 0), totalAreaDemand: karachiAreas.reduce((s, a) => s + a.demand, 0), supplyDemandRatio: (tankers.reduce((s, t) => s + t.capacity, 0) / karachiAreas.reduce((s, a) => s + a.demand, 0)).toFixed(2) }
  });
});

app.get('/api/analytics/performance', (req, res) => {
  const byStatus = {}, byPriority = {};
  deliveries.forEach(d => { byStatus[d.status] = (byStatus[d.status] || 0) + 1; byPriority[d.priority] = (byPriority[d.priority] || 0) + 1; });
  const delays = deliveries.filter(d => d.delayMinutes > 0);
  const hourlyDistribution = Array(14).fill(0);
  deliveries.forEach(d => { const h = new Date(d.scheduledTime).getHours(); if (h >= 6 && h < 20) hourlyDistribution[h-6]++; });
  res.json({ totalDeliveries: deliveries.length, byStatus, byPriority, delays: { count: delays.length, averageMinutes: (delays.reduce((s,d) => s+d.delayMinutes, 0) / (delays.length || 1)).toFixed(1), totalCost: deliveries.reduce((s,d) => s+d.delayCost, 0) }, hourlyDistribution });
});

app.get('/api/analytics/algorithm-comparison', (req, res) => {
  res.json({ algorithms: [
    { name: "Dijkstra's Algorithm", type: "Route Optimization", timeComplexity: "O((V + E) log V)", spaceComplexity: "O(V + E)", bestFor: "Single-source shortest path", pros: ["Optimal solution", "Efficient with priority queue"], cons: ["Doesn't handle negative weights"] },
    { name: "Greedy Algorithm", type: "Resource Assignment", timeComplexity: "O(n * m * log n)", spaceComplexity: "O(n + m)", bestFor: "Quick resource allocation", pros: ["Fast execution", "Good for real-time"], cons: ["Not always optimal"] },
    { name: "Dynamic Programming", type: "Scheduling", timeComplexity: "O(n * T * k)", spaceComplexity: "O(k * T * n)", bestFor: "Constrained scheduling", pros: ["Optimal solution", "Handles constraints"], cons: ["High memory usage"] },
    { name: "Backtracking", type: "Slot Allocation", timeComplexity: "O(m^n) worst case", spaceComplexity: "O(n + m * T)", bestFor: "Constraint satisfaction", pros: ["Guaranteed solution", "Flexible"], cons: ["Exponential worst case"] },
    { name: "Ford-Fulkerson", type: "Flow Optimization", timeComplexity: "O(E * max_flow)", spaceComplexity: "O(V + E)", bestFor: "Network flow maximization", pros: ["Finds max flow", "Identifies bottlenecks"], cons: ["Slow with large capacities"] }
  ]});
});

// Fleet (tankers)
app.get('/api/fleet', (req, res) => res.json(tankers));

// Bookings CRUD
app.get('/api/bookings', (req, res) => res.json(bookings));
app.get('/api/bookings/:id', (req, res) => { const b = bookings.find(x => x.id === req.params.id); if (!b) return res.status(404).json({error:'Not found'}); res.json(b); });
app.post('/api/bookings', (req, res) => { const newBooking = { id: 'BK-' + String(bookings.length + 1).padStart(3, '0'), ...req.body, status: 'pending', createdAt: new Date().toISOString() }; bookings.push(newBooking); res.status(201).json(newBooking); });
app.put('/api/bookings/:id', (req, res) => { const idx = bookings.findIndex(x => x.id === req.params.id); if (idx === -1) return res.status(404).json({error:'Not found'}); bookings[idx] = {...bookings[idx], ...req.body}; res.json(bookings[idx]); });
app.delete('/api/bookings/:id', (req, res) => { const idx = bookings.findIndex(x => x.id === req.params.id); if (idx === -1) return res.status(404).json({error:'Not found'}); bookings.splice(idx, 1); res.json({message:'Deleted'}); });

// Drivers CRUD
app.get('/api/drivers', (req, res) => res.json(drivers));
app.get('/api/drivers/:id', (req, res) => { const d = drivers.find(x => x.id === req.params.id); if (!d) return res.status(404).json({error:'Not found'}); res.json(d); });
app.post('/api/drivers', (req, res) => { const newDriver = { id: 'DRV-' + String(drivers.length + 1).padStart(3, '0'), ...req.body, status: 'available', rating: 0, totalTrips: 0, onTimePercent: 100, joinDate: new Date().toISOString().split('T')[0] }; drivers.push(newDriver); res.status(201).json(newDriver); });
app.put('/api/drivers/:id', (req, res) => { const idx = drivers.findIndex(x => x.id === req.params.id); if (idx === -1) return res.status(404).json({error:'Not found'}); drivers[idx] = {...drivers[idx], ...req.body}; res.json(drivers[idx]); });
app.delete('/api/drivers/:id', (req, res) => { const idx = drivers.findIndex(x => x.id === req.params.id); if (idx === -1) return res.status(404).json({error:'Not found'}); drivers.splice(idx, 1); res.json({message:'Deleted'}); });

// Dispatches CRUD
app.get('/api/dispatches', (req, res) => res.json(dispatches));
app.post('/api/dispatches', (req, res) => { const newDispatch = { id: 'DSP-' + String(dispatches.length + 1).padStart(3, '0'), ...req.body, status: 'assigned', dispatchTime: new Date().toISOString(), estimatedArrival: null, actualArrival: null }; dispatches.push(newDispatch); res.status(201).json(newDispatch); });
app.put('/api/dispatches/:id', (req, res) => { const idx = dispatches.findIndex(x => x.id === req.params.id); if (idx === -1) return res.status(404).json({error:'Not found'}); dispatches[idx] = {...dispatches[idx], ...req.body}; res.json(dispatches[idx]); });

// Payments CRUD
app.get('/api/payments', (req, res) => res.json(payments));
app.post('/api/payments', (req, res) => { const newPayment = { id: 'PAY-' + String(payments.length + 1).padStart(3, '0'), ...req.body, date: new Date().toISOString() }; payments.push(newPayment); res.status(201).json(newPayment); });
app.put('/api/payments/:id', (req, res) => { const idx = payments.findIndex(x => x.id === req.params.id); if (idx === -1) return res.status(404).json({error:'Not found'}); payments[idx] = {...payments[idx], ...req.body}; res.json(payments[idx]); });

// Quality Tests
app.get('/api/quality-tests', (req, res) => res.json(qualityTests));
app.post('/api/quality-tests', (req, res) => { const newTest = { id: 'QT-' + String(qualityTests.length + 1).padStart(3, '0'), ...req.body, testDate: new Date().toISOString() }; const phScore = Math.max(0, 100 - Math.abs(req.body.ph - 7.0) * 20); const tdsScore = Math.max(0, 100 - Math.max(0, req.body.tds - 200) * 0.5); const turbScore = Math.max(0, 100 - req.body.turbidity * 20); const chlorScore = Math.max(0, 100 - Math.abs(req.body.chlorine - 0.8) * 50); newTest.score = Math.round((phScore + tdsScore + turbScore + chlorScore) / 4); qualityTests.push(newTest); res.status(201).json(newTest); });

// Maintenance
app.get('/api/maintenance', (req, res) => res.json(maintenance));
app.post('/api/maintenance', (req, res) => { const newRecord = { id: 'MNT-' + String(maintenance.length + 1).padStart(3, '0'), ...req.body, status: 'current' }; maintenance.push(newRecord); res.status(201).json(newRecord); });
app.put('/api/maintenance/:id', (req, res) => { const idx = maintenance.findIndex(x => x.id === req.params.id); if (idx === -1) return res.status(404).json({error:'Not found'}); maintenance[idx] = {...maintenance[idx], ...req.body}; res.json(maintenance[idx]); });

// Enhanced Analytics
app.get('/api/analytics/revenue', (req, res) => { const total = payments.filter(p => p.status === 'completed').reduce((s, p) => s + p.amount, 0); const today = payments.filter(p => p.status === 'completed' && p.date && p.date.startsWith('2026-09-11')).reduce((s, p) => s + p.amount, 0); const outstanding = payments.filter(p => p.status === 'pending').reduce((s, p) => s + p.amount, 0); res.json({ totalRevenue: total, todayRevenue: today, outstanding: outstanding, totalTransactions: payments.length, completedTransactions: payments.filter(p => p.status === 'completed').length, byMethod: { cash: payments.filter(p => p.method === 'cash' && p.status === 'completed').reduce((s,p) => s+p.amount, 0), jazzcash: payments.filter(p => p.method === 'jazzcash' && p.status === 'completed').reduce((s,p) => s+p.amount, 0), easypaisa: payments.filter(p => p.method === 'easypaisa' && p.status === 'completed').reduce((s,p) => s+p.amount, 0), bank: payments.filter(p => p.method === 'bank' && p.status === 'completed').reduce((s,p) => s+p.amount, 0) } }); });

app.get('/api/analytics/fleet', (req, res) => { res.json({ totalTankers: tankers.length, available: tankers.filter(t => t.status === 'available').length, enRoute: tankers.filter(t => t.status === 'en-route').length, loading: tankers.filter(t => t.status === 'loading').length, maintenance: tankers.filter(t => t.status === 'maintenance').length, totalDrivers: drivers.length, availableDrivers: drivers.filter(d => d.status === 'available').length, onDutyDrivers: drivers.filter(d => d.status === 'on-duty').length, activeDispatches: dispatches.filter(d => d.status === 'en-route' || d.status === 'assigned').length }); });

app.get('/api/analytics/quality', (req, res) => { const passed = qualityTests.filter(t => t.score >= 80).length; res.json({ totalTests: qualityTests.length, passed, failed: qualityTests.length - passed, passRate: qualityTests.length > 0 ? ((passed / qualityTests.length) * 100).toFixed(1) : 0, avgScore: qualityTests.length > 0 ? (qualityTests.reduce((s, t) => s + t.score, 0) / qualityTests.length).toFixed(1) : 0, recentTests: qualityTests.slice(-5) }); });

// React SPA fallback
app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'client/build/index.html')));

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Water Tanker System running on http://0.0.0.0:${PORT}`);
});
