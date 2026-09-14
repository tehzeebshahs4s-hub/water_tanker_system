const waterSources = [
  {
    sourceId: "WS-001",
    name: "Keenjhar Lake Treatment Plant",
    type: "treatment-plant",
    location: { lat: 24.8500, lng: 67.1500 },
    capacity: 2000000,
    currentOutput: 1500000,
    waterQuality: "excellent",
    maxTankerCapacity: 10000,
    averageWaitTime: 20
  },
  {
    sourceId: "WS-002",
    name: "Hub Dam Intake",
    type: "dam",
    location: { lat: 24.7800, lng: 66.8500 },
    capacity: 3000000,
    currentOutput: 2200000,
    waterQuality: "excellent",
    maxTankerCapacity: 10000,
    averageWaitTime: 25
  },
  {
    sourceId: "WS-003",
    name: "Norai Abad Pumping Station",
    type: "well",
    location: { lat: 24.9200, lng: 67.2200 },
    capacity: 800000,
    currentOutput: 600000,
    waterQuality: "good",
    maxTankerCapacity: 5000,
    averageWaitTime: 15
  },
  {
    sourceId: "WS-004",
    name: "Gulshan Hydrant Station",
    type: "hydrant",
    location: { lat: 24.9150, lng: 67.0600 },
    capacity: 500000,
    currentOutput: 450000,
    waterQuality: "good",
    maxTankerCapacity: 5000,
    averageWaitTime: 10
  },
  {
    sourceId: "WS-005",
    name: "Korangi Hydrant Complex",
    type: "hydrant",
    location: { lat: 24.8650, lng: 67.1000 },
    capacity: 600000,
    currentOutput: 550000,
    waterQuality: "good",
    maxTankerCapacity: 5000,
    averageWaitTime: 12
  },
  {
    sourceId: "WS-006",
    name: "SITE Treatment Plant",
    type: "treatment-plant",
    location: { lat: 24.8950, lng: 67.1300 },
    capacity: 1500000,
    currentOutput: 1200000,
    waterQuality: "fair",
    maxTankerCapacity: 10000,
    averageWaitTime: 18
  },
  {
    sourceId: "WS-007",
    name: "North Nazimabad Reservoir",
    type: "reservoir",
    location: { lat: 24.9450, lng: 67.0300 },
    capacity: 1000000,
    currentOutput: 800000,
    waterQuality: "good",
    maxTankerCapacity: 5000,
    averageWaitTime: 15
  },
  {
    sourceId: "WS-008",
    name: "Malir Groundwater Well",
    type: "well",
    location: { lat: 24.8600, lng: 67.1900 },
    capacity: 400000,
    currentOutput: 350000,
    waterQuality: "fair",
    maxTankerCapacity: 3000,
    averageWaitTime: 10
  },
  {
    sourceId: "WS-009",
    name: "Landhi Industrial Hydrant",
    type: "hydrant",
    location: { lat: 24.8400, lng: 67.1500 },
    capacity: 300000,
    currentOutput: 280000,
    waterQuality: "fair",
    maxTankerCapacity: 5000,
    averageWaitTime: 8
  },
  {
    sourceId: "WS-010",
    name: "Keamari Port Water Station",
    type: "treatment-plant",
    location: { lat: 24.8050, lng: 66.9800 },
    capacity: 1200000,
    currentOutput: 900000,
    waterQuality: "good",
    maxTankerCapacity: 10000,
    averageWaitTime: 22
  }
];

module.exports = waterSources;
