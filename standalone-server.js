const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 7777;

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname, 'client/build')));

// ============================================
// IN-MEMORY DATA (No MongoDB Required)
// ============================================

let idCounters = { booking: 16, driver: 16, dispatch: 21, payment: 31, quality: 21, notification: 11, tanker: 16 };
function nextId(type) { return type.substring(0,2).toUpperCase() + '-' + String(idCounters[type]++).padStart(3, '0'); }

const karachiAreas = [
  { areaId:"AREA-001",name:"North Karachi",town:"North Karachi",coordinates:{lat:24.9850,lng:67.0810},demand:500000,priority:"critical",population:1800000,congestionLevel:"high",nearestHydrants:["HYD-001"],roadConnections:["AREA-002"]},
  { areaId:"AREA-002",name:"Surjani Town",town:"Surjani Town",coordinates:{lat:24.9650,lng:67.0650},demand:400000,priority:"critical",population:1200000,congestionLevel:"medium",nearestHydrants:["HYD-001"],roadConnections:["AREA-001","AREA-003"]},
  { areaId:"AREA-003",name:"Gulshan-e-Iqbal",town:"Gulshan-e-Iqbal",coordinates:{lat:24.9200,lng:67.0650},demand:600000,priority:"high",population:2000000,congestionLevel:"high",nearestHydrants:["HYD-002"],roadConnections:["AREA-002","AREA-005"]},
  { areaId:"AREA-004",name:"Korangi",town:"Korangi",coordinates:{lat:24.8700,lng:67.1050},demand:450000,priority:"high",population:1500000,congestionLevel:"medium",nearestHydrants:["HYD-003"],roadConnections:["AREA-006"]},
  { areaId:"AREA-005",name:"DHA Phase V",town:"DHA",coordinates:{lat:24.8050,lng:67.0350},demand:300000,priority:"medium",population:500000,congestionLevel:"low",nearestHydrants:["HYD-006"],roadConnections:["AREA-003","AREA-007"]},
  { areaId:"AREA-006",name:"Landhi",town:"Landhi",coordinates:{lat:24.8450,lng:67.1550},demand:350000,priority:"high",population:900000,congestionLevel:"medium",nearestHydrants:["HYD-005"],roadConnections:["AREA-004","AREA-008"]},
  { areaId:"AREA-007",name:"Clifton",town:"Clifton",coordinates:{lat:24.8100,lng:67.0250},demand:250000,priority:"low",population:400000,congestionLevel:"low",nearestHydrants:["HYD-008"],roadConnections:["AREA-005","AREA-009"]},
  { areaId:"AREA-008",name:"Malir",town:"Malir",coordinates:{lat:24.8650,lng:67.1950},demand:300000,priority:"medium",population:700000,congestionLevel:"medium",nearestHydrants:["HYD-007"],roadConnections:["AREA-006","AREA-010"]},
  { areaId:"AREA-009",name:"Saddar",town:"Saddar",coordinates:{lat:24.8550,lng:67.0100},demand:350000,priority:"medium",population:600000,congestionLevel:"high",nearestHydrants:["HYD-010"],roadConnections:["AREA-007","AREA-011"]},
  { areaId:"AREA-010",name:"SITE Area",town:"SITE",coordinates:{lat:24.8900,lng:67.1250},demand:200000,priority:"low",population:300000,congestionLevel:"low",nearestHydrants:["HYD-011"],roadConnections:["AREA-008","AREA-012"]},
  { areaId:"AREA-011",name:"Lyari",town:"Lyari",coordinates:{lat:24.8700,lng:67.0050},demand:400000,priority:"critical",population:1100000,congestionLevel:"severe",nearestHydrants:["HYD-012"],roadConnections:["AREA-009","AREA-013"]},
  { areaId:"AREA-012",name:"Baldia Town",town:"Baldia Town",coordinates:{lat:24.9250,lng:67.0000},demand:350000,priority:"high",population:800000,congestionLevel:"medium",nearestHydrants:["HYD-013"],roadConnections:["AREA-010","AREA-014"]},
  { areaId:"AREA-013",name:"Orangi Town",town:"Orangi Town",coordinates:{lat:24.9350,lng:66.9950},demand:450000,priority:"critical",population:1400000,congestionLevel:"high",nearestHydrants:["HYD-014"],roadConnections:["AREA-011","AREA-015"]},
  { areaId:"AREA-014",name:"SITE Area West",town:"SITE",coordinates:{lat:24.9050,lng:66.9850},demand:180000,priority:"low",population:250000,congestionLevel:"low",nearestHydrants:["HYD-015"],roadConnections:["AREA-012","AREA-016"]},
  { areaId:"AREA-015",name:"North Nazimabad",town:"North Nazimabad",coordinates:{lat:24.9500,lng:67.0350},demand:500000,priority:"high",population:1600000,congestionLevel:"high",nearestHydrants:["HYD-016"],roadConnections:["AREA-013","AREA-017"]},
  { areaId:"AREA-016",name:"Mominabad",town:"Orangi Town",coordinates:{lat:24.9450,lng:66.9750},demand:300000,priority:"medium",population:700000,congestionLevel:"medium",nearestHydrants:["HYD-017"],roadConnections:["AREA-014","AREA-018"]},
  { areaId:"AREA-017",name:"Federal B Area",town:"Federal B Area",coordinates:{lat:24.9400,lng:67.0500},demand:400000,priority:"medium",population:1000000,congestionLevel:"medium",nearestHydrants:["HYD-018"],roadConnections:["AREA-015"]},
  { areaId:"AREA-018",name:"Manghopir",town:"SITE",coordinates:{lat:24.9150,lng:66.9650},demand:250000,priority:"medium",population:500000,congestionLevel:"low",nearestHydrants:["HYD-019"],roadConnections:["AREA-016"]}
];

const waterSources = [
  { sourceId:"WS-001",name:"Keenjhar Lake Treatment Plant",type:"treatment-plant",location:{lat:24.8500,lng:67.1500},capacity:2000000,currentOutput:1500000,waterQuality:"excellent",maxTankerCapacity:10000,averageWaitTime:20,queueLength:3,operational:true,connectedAreas:["AREA-006","AREA-008","AREA-010"]},
  { sourceId:"WS-002",name:"Hub Dam Intake",type:"dam",location:{lat:24.7800,lng:66.8500},capacity:3000000,currentOutput:2200000,waterQuality:"excellent",maxTankerCapacity:10000,averageWaitTime:25,queueLength:5,operational:true,connectedAreas:["AREA-005","AREA-007","AREA-010"]},
  { sourceId:"WS-003",name:"Norai Abad Pumping Station",type:"well",location:{lat:24.9200,lng:67.2200},capacity:800000,currentOutput:600000,waterQuality:"good",maxTankerCapacity:5000,averageWaitTime:15,queueLength:2,operational:true,connectedAreas:["AREA-001","AREA-002","AREA-003"]},
  { sourceId:"WS-004",name:"Gulshan Hydrant Station",type:"hydrant",location:{lat:24.9150,lng:67.0600},capacity:500000,currentOutput:450000,waterQuality:"good",maxTankerCapacity:5000,averageWaitTime:10,queueLength:1,operational:true,connectedAreas:["AREA-003","AREA-015","AREA-017"]},
  { sourceId:"WS-005",name:"Korangi Hydrant Complex",type:"hydrant",location:{lat:24.8650,lng:67.1000},capacity:600000,currentOutput:550000,waterQuality:"good",maxTankerCapacity:5000,averageWaitTime:12,queueLength:2,operational:true,connectedAreas:["AREA-004","AREA-006","AREA-010"]},
  { sourceId:"WS-006",name:"SITE Treatment Plant",type:"treatment-plant",location:{lat:24.8950,lng:67.1300},capacity:1500000,currentOutput:1200000,waterQuality:"fair",maxTankerCapacity:10000,averageWaitTime:18,queueLength:4,operational:true,connectedAreas:["AREA-004","AREA-010","AREA-014"]},
  { sourceId:"WS-007",name:"North Nazimabad Reservoir",type:"reservoir",location:{lat:24.9450,lng:67.0300},capacity:1000000,currentOutput:800000,waterQuality:"good",maxTankerCapacity:5000,averageWaitTime:15,queueLength:3,operational:true,connectedAreas:["AREA-015","AREA-017","AREA-012"]},
  { sourceId:"WS-008",name:"Malir Groundwater Well",type:"well",location:{lat:24.8600,lng:67.1900},capacity:400000,currentOutput:350000,waterQuality:"fair",maxTankerCapacity:3000,averageWaitTime:10,queueLength:1,operational:true,connectedAreas:["AREA-008","AREA-006"]},
  { sourceId:"WS-009",name:"Landhi Industrial Hydrant",type:"hydrant",location:{lat:24.8400,lng:67.1500},capacity:300000,currentOutput:280000,waterQuality:"fair",maxTankerCapacity:5000,averageWaitTime:8,queueLength:0,operational:true,connectedAreas:["AREA-006","AREA-010"]},
  { sourceId:"WS-010",name:"Keamari Port Water Station",type:"treatment-plant",location:{lat:24.8050,lng:66.9800},capacity:1200000,currentOutput:900000,waterQuality:"good",maxTankerCapacity:10000,averageWaitTime:22,queueLength:4,operational:true,connectedAreas:["AREA-007","AREA-009","AREA-011"]}
];

const tankers = [
  { tankerId:"TK-001",capacity:10000,currentLoad:0,currentLocation:{lat:24.8500,lng:67.1500},status:"available",driverName:"Ahmed Khan",driverPhone:"+92-300-1234567",type:"large",fuelLevel:85,lastMaintenance:"2026-09-01",totalDeliveries:124},
  { tankerId:"TK-002",capacity:5000,currentLoad:0,currentLocation:{lat:24.9200,lng:67.0650},status:"available",driverName:"Muhammad Ali",driverPhone:"+92-321-2345678",type:"medium",fuelLevel:92,lastMaintenance:"2026-08-28",totalDeliveries:89},
  { tankerId:"TK-003",capacity:3000,currentLoad:2800,currentLocation:{lat:24.8700,lng:67.1050},status:"en-route",driverName:"Hassan Raza",driverPhone:"+92-333-3456789",type:"small",fuelLevel:70,lastMaintenance:"2026-09-05",totalDeliveries:67},
  { tankerId:"TK-004",capacity:10000,currentLoad:0,currentLocation:{lat:24.8050,lng:67.0350},status:"available",driverName:"Imran Shah",driverPhone:"+92-345-4567890",type:"large",fuelLevel:95,lastMaintenance:"2026-09-08",totalDeliveries:156},
  { tankerId:"TK-005",capacity:5000,currentLoad:3500,currentLocation:{lat:24.8650,lng:67.1950},status:"loading",driverName:"Usman Malik",driverPhone:"+92-312-5678901",type:"medium",fuelLevel:60,lastMaintenance:"2026-09-02",totalDeliveries:78},
  { tankerId:"TK-006",capacity:5000,currentLoad:0,currentLocation:{lat:24.8550,lng:67.0100},status:"available",driverName:"Bilal Ahmed",driverPhone:"+92-300-6789012",type:"medium",fuelLevel:88,lastMaintenance:"2026-09-03",totalDeliveries:92},
  { tankerId:"TK-007",capacity:3000,currentLoad:0,currentLocation:{lat:24.8900,lng:67.1250},status:"available",driverName:"Farooq Sindhi",driverPhone:"+92-321-7890123",type:"small",fuelLevel:75,lastMaintenance:"2026-09-06",totalDeliveries:54},
  { tankerId:"TK-008",capacity:10000,currentLoad:9500,currentLocation:{lat:24.9250,lng:67.0000},status:"en-route",driverName:"Tariq Baloch",driverPhone:"+92-333-8901234",type:"large",fuelLevel:55,lastMaintenance:"2026-08-25",totalDeliveries:201},
  { tankerId:"TK-009",capacity:5000,currentLoad:0,currentLocation:{lat:24.9350,lng:66.9950},status:"available",driverName:"Zubair Pathan",driverPhone:"+92-345-9012345",type:"medium",fuelLevel:82,lastMaintenance:"2026-09-07",totalDeliveries:103},
  { tankerId:"TK-010",capacity:3000,currentLoad:0,currentLocation:{lat:24.9500,lng:67.0350},status:"maintenance",driverName:"Kamran Sheikh",driverPhone:"+92-312-0123456",type:"small",fuelLevel:30,lastMaintenance:"2026-09-10",totalDeliveries:45},
  { tankerId:"TK-011",capacity:10000,currentLoad:0,currentLocation:{lat:24.8450,lng:67.1200},status:"available",driverName:"Naeem Gujjar",driverPhone:"+92-300-1112233",type:"large",fuelLevel:90,lastMaintenance:"2026-09-04",totalDeliveries:178},
  { tankerId:"TK-012",capacity:5000,currentLoad:4200,currentLocation:{lat:24.9100,lng:67.0800},status:"en-route",driverName:"Rashid Memon",driverPhone:"+92-321-2223344",type:"medium",fuelLevel:65,lastMaintenance:"2026-09-09",totalDeliveries:112},
  { tankerId:"TK-013",capacity:5000,currentLoad:0,currentLocation:{lat:24.8800,lng:67.1400},status:"available",driverName:"Shahid Jatt",driverPhone:"+92-333-3334455",type:"medium",fuelLevel:78,lastMaintenance:"2026-09-01",totalDeliveries:96},
  { tankerId:"TK-014",capacity:3000,currentLoad:0,currentLocation:{lat:24.8200,lng:67.0500},status:"available",driverName:"Waseem Abro",driverPhone:"+92-345-4445566",type:"small",fuelLevel:91,lastMaintenance:"2026-09-06",totalDeliveries:38},
  { tankerId:"TK-015",capacity:10000,currentLoad:7500,currentLocation:{lat:24.8750,lng:67.1800},status:"loading",driverName:"Javed Khosa",driverPhone:"+92-312-5556677",type:"large",fuelLevel:45,lastMaintenance:"2026-08-30",totalDeliveries:143}
];

const drivers = [
  { driverId:"DRV-001",name:"Ahmed Khan",phone:"+92-300-1234567",cnic:"42101-1234567-1",licenseNo:"KHI-2024-00123",bloodGroup:"B+",status:"active",rating:4.8,totalDeliveries:124,joinedDate:"2025-01-15"},
  { driverId:"DRV-002",name:"Muhammad Ali",phone:"+92-321-2345678",cnic:"42101-2345678-2",licenseNo:"KHI-2024-00124",bloodGroup:"A+",status:"active",rating:4.6,totalDeliveries:89,joinedDate:"2025-02-20"},
  { driverId:"DRV-003",name:"Hassan Raza",phone:"+92-333-3456789",cnic:"42101-3456789-3",licenseNo:"KHI-2024-00125",bloodGroup:"O+",status:"active",rating:4.5,totalDeliveries:67,joinedDate:"2025-03-10"},
  { driverId:"DRV-004",name:"Imran Shah",phone:"+92-345-4567890",cnic:"42101-4567890-4",licenseNo:"KHI-2024-00126",bloodGroup:"AB+",status:"active",rating:4.9,totalDeliveries:156,joinedDate:"2024-11-05"},
  { driverId:"DRV-005",name:"Usman Malik",phone:"+92-312-5678901",cnic:"42101-5678901-5",licenseNo:"KHI-2024-00127",bloodGroup:"B-",status:"active",rating:4.3,totalDeliveries:78,joinedDate:"2025-04-12"},
  { driverId:"DRV-006",name:"Bilal Ahmed",phone:"+92-300-6789012",cnic:"42101-6789012-6",licenseNo:"KHI-2024-00128",bloodGroup:"A-",status:"active",rating:4.7,totalDeliveries:92,joinedDate:"2025-01-28"},
  { driverId:"DRV-007",name:"Farooq Sindhi",phone:"+92-321-7890123",cnic:"42101-7890123-7",licenseNo:"KHI-2024-00129",bloodGroup:"O-",status:"active",rating:4.2,totalDeliveries:54,joinedDate:"2025-05-15"},
  { driverId:"DRV-008",name:"Tariq Baloch",phone:"+92-333-8901234",cnic:"42101-8901234-8",licenseNo:"KHI-2024-00130",bloodGroup:"B+",status:"active",rating:4.8,totalDeliveries:201,joinedDate:"2024-09-20"},
  { driverId:"DRV-009",name:"Zubair Pathan",phone:"+92-345-9012345",cnic:"42101-9012345-9",licenseNo:"KHI-2024-00131",bloodGroup:"A+",status:"active",rating:4.4,totalDeliveries:103,joinedDate:"2025-02-01"},
  { driverId:"DRV-010",name:"Kamran Sheikh",phone:"+92-312-0123456",cnic:"42101-0123456-0",licenseNo:"KHI-2024-00132",bloodGroup:"AB-",status:"inactive",rating:3.9,totalDeliveries:45,joinedDate:"2025-06-10"},
  { driverId:"DRV-011",name:"Naeem Gujjar",phone:"+92-300-1112233",cnic:"42101-1112233-1",licenseNo:"KHI-2024-00133",bloodGroup:"O+",status:"active",rating:4.7,totalDeliveries:178,joinedDate:"2024-12-01"},
  { driverId:"DRV-012",name:"Rashid Memon",phone:"+92-321-2223344",cnic:"42101-2223344-2",licenseNo:"KHI-2024-00134",bloodGroup:"B+",status:"active",rating:4.5,totalDeliveries:112,joinedDate:"2025-03-18"},
  { driverId:"DRV-013",name:"Shahid Jatt",phone:"+92-333-3334455",cnic:"42101-3334455-3",licenseNo:"KHI-2024-00135",bloodGroup:"A+",status:"active",rating:4.6,totalDeliveries:96,joinedDate:"2025-04-22"},
  { driverId:"DRV-014",name:"Waseem Abro",phone:"+92-345-4445566",cnic:"42101-4445566-4",licenseNo:"KHI-2024-00136",bloodGroup:"B-",status:"active",rating:4.1,totalDeliveries:38,joinedDate:"2025-07-01"},
  { driverId:"DRV-015",name:"Javed Khosa",phone:"+92-312-5556677",cnic:"42101-5556677-5",licenseNo:"KHI-2024-00137",bloodGroup:"O+",status:"active",rating:4.8,totalDeliveries:143,joinedDate:"2025-01-10"}
];

const deliveries = [
  { deliveryId:"DEL-001",tankerId:"TK-001",areaId:"AREA-001",sourceId:"WS-003",scheduledTime:"2026-09-13T08:00:00",timeWindow:{start:"08:00",end:"10:00"},status:"completed",loadAmount:10000,priority:"critical",delayMinutes:0,delayCost:0},
  { deliveryId:"DEL-002",tankerId:"TK-002",areaId:"AREA-003",sourceId:"WS-004",scheduledTime:"2026-09-13T09:00:00",timeWindow:{start:"09:00",end:"11:00"},status:"en-route",loadAmount:5000,priority:"high",delayMinutes:0,delayCost:0},
  { deliveryId:"DEL-003",tankerId:"TK-008",areaId:"AREA-011",sourceId:"WS-010",scheduledTime:"2026-09-13T07:00:00",timeWindow:{start:"07:00",end:"09:00"},status:"completed",loadAmount:10000,priority:"critical",delayMinutes:15,delayCost:150},
  { deliveryId:"DEL-004",tankerId:"TK-012",areaId:"AREA-004",sourceId:"WS-005",scheduledTime:"2026-09-13T10:00:00",timeWindow:{start:"10:00",end:"12:00"},status:"en-route",loadAmount:5000,priority:"high",delayMinutes:0,delayCost:0},
  { deliveryId:"DEL-005",tankerId:"TK-003",areaId:"AREA-002",sourceId:"WS-003",scheduledTime:"2026-09-13T11:00:00",timeWindow:{start:"11:00",end:"13:00"},status:"scheduled",loadAmount:3000,priority:"medium",delayMinutes:0,delayCost:0},
  { deliveryId:"DEL-006",tankerId:"TK-004",areaId:"AREA-007",sourceId:"WS-010",scheduledTime:"2026-09-13T06:00:00",timeWindow:{start:"06:00",end:"08:00"},status:"completed",loadAmount:10000,priority:"medium",delayMinutes:30,delayCost:90},
  { deliveryId:"DEL-007",tankerId:"TK-006",areaId:"AREA-009",sourceId:"WS-010",scheduledTime:"2026-09-13T12:00:00",timeWindow:{start:"12:00",end:"14:00"},status:"scheduled",loadAmount:5000,priority:"medium",delayMinutes:0,delayCost:0},
  { deliveryId:"DEL-008",tankerId:"TK-011",areaId:"AREA-013",sourceId:"WS-007",scheduledTime:"2026-09-13T08:30:00",timeWindow:{start:"08:00",end:"10:00"},status:"completed",loadAmount:10000,priority:"critical",delayMinutes:0,delayCost:0},
  { deliveryId:"DEL-009",tankerId:"TK-009",areaId:"AREA-015",sourceId:"WS-007",scheduledTime:"2026-09-13T13:00:00",timeWindow:{start:"13:00",end:"15:00"},status:"scheduled",loadAmount:5000,priority:"high",delayMinutes:0,delayCost:0},
  { deliveryId:"DEL-010",tankerId:"TK-013",areaId:"AREA-006",sourceId:"WS-001",scheduledTime:"2026-09-13T14:00:00",timeWindow:{start:"14:00",end:"16:00"},status:"scheduled",loadAmount:5000,priority:"high",delayMinutes:0,delayCost:0},
  { deliveryId:"DEL-011",tankerId:"TK-001",areaId:"AREA-012",sourceId:"WS-007",scheduledTime:"2026-09-13T06:30:00",timeWindow:{start:"06:00",end:"08:00"},status:"completed",loadAmount:10000,priority:"high",delayMinutes:5,delayCost:25},
  { deliveryId:"DEL-012",tankerId:"TK-004",areaId:"AREA-014",sourceId:"WS-006",scheduledTime:"2026-09-13T09:30:00",timeWindow:{start:"09:00",end:"11:00"},status:"completed",loadAmount:10000,priority:"low",delayMinutes:0,delayCost:0},
  { deliveryId:"DEL-013",tankerId:"TK-007",areaId:"AREA-016",sourceId:"WS-007",scheduledTime:"2026-09-13T15:00:00",timeWindow:{start:"15:00",end:"17:00"},status:"scheduled",loadAmount:3000,priority:"medium",delayMinutes:0,delayCost:0},
  { deliveryId:"DEL-014",tankerId:"TK-002",areaId:"AREA-017",sourceId:"WS-004",scheduledTime:"2026-09-13T11:30:00",timeWindow:{start:"11:00",end:"13:00"},status:"scheduled",loadAmount:5000,priority:"medium",delayMinutes:0,delayCost:0},
  { deliveryId:"DEL-015",tankerId:"TK-011",areaId:"AREA-018",sourceId:"WS-006",scheduledTime:"2026-09-13T07:30:00",timeWindow:{start:"07:00",end:"09:00"},status:"completed",loadAmount:10000,priority:"medium",delayMinutes:20,delayCost:60}
];

const bookings = [
  { bookingId:"BK-001",customerName:"Fatima Ahmed",phone:"+92-300-1111111",email:"fatima@email.com",areaId:"AREA-001",tankerSize:"large",date:"2026-09-13",timeSlot:"08:00-10:00",address:"House 123, North Karachi",instructions:"Ring doorbell twice",price:9500,capacity:10000,status:"completed",createdAt:"2026-09-12T18:00:00"},
  { bookingId:"BK-002",customerName:"Ali Hassan",phone:"+92-321-2222222",email:"ali@email.com",areaId:"AREA-003",tankerSize:"medium",date:"2026-09-13",timeSlot:"10:00-12:00",address:"Flat 4B, Gulshan-e-Iqbal",instructions:"",price:3800,capacity:5000,status:"en-route",createdAt:"2026-09-12T20:00:00"},
  { bookingId:"BK-003",customerName:"Sara Malik",phone:"+92-333-3333333",email:"sara@email.com",areaId:"AREA-011",tankerSize:"large",date:"2026-09-13",timeSlot:"06:00-08:00",address:"Lyari Town, Main Road",instructions:"Call before arrival",price:7000,capacity:10000,status:"completed",createdAt:"2026-09-11T22:00:00"},
  { bookingId:"BK-004",customerName:"Omar Khan",phone:"+92-345-4444444",email:"omar@email.com",areaId:"AREA-004",tankerSize:"medium",date:"2026-09-13",timeSlot:"12:00-14:00",address:"Korangi Industrial Area",instructions:"",price:3800,capacity:5000,status:"en-route",createdAt:"2026-09-12T14:00:00"},
  { bookingId:"BK-005",customerName:"Nadia Shah",phone:"+92-312-5555555",email:"nadia@email.com",areaId:"AREA-002",tankerSize:"small",date:"2026-09-13",timeSlot:"14:00-16:00",address:"Surjani Town, Block C",instructions:"Park tanker near gate",price:2380,capacity:3000,status:"scheduled",createdAt:"2026-09-13T08:00:00"},
  { bookingId:"BK-006",customerName:"Bilal Raza",phone:"+92-300-6666666",email:"bilal@email.com",areaId:"AREA-007",tankerSize:"large",date:"2026-09-13",timeSlot:"06:00-08:00",address:"Clifton Block 2",instructions:"Security gate code 1234",price:6650,capacity:10000,status:"completed",createdAt:"2026-09-12T16:00:00"},
  { bookingId:"BK-007",customerName:"Ayesha Siddiqui",phone:"+92-321-7777777",email:"ayesha@email.com",areaId:"AREA-009",tankerSize:"medium",date:"2026-09-13",timeSlot:"14:00-16:00",address:"Saddar, Main Boulevard",instructions:"",price:3600,capacity:5000,status:"scheduled",createdAt:"2026-09-13T07:00:00"},
  { bookingId:"BK-008",customerName:"Hassan Ali",phone:"+92-333-8888888",email:"hassan@email.com",areaId:"AREA-013",tankerSize:"large",date:"2026-09-13",timeSlot:"08:00-10:00",address:"Orangi Town, Sector 5",instructions:"Call on arrival",price:7000,capacity:10000,status:"completed",createdAt:"2026-09-11T20:00:00"},
  { bookingId:"BK-009",customerName:"Zainab Noor",phone:"+92-345-9999999",email:"zainab@email.com",areaId:"AREA-015",tankerSize:"medium",date:"2026-09-13",timeSlot:"16:00-18:00",address:"North Nazimabad, Block H",instructions:"",price:3800,capacity:5000,status:"scheduled",createdAt:"2026-09-13T06:00:00"},
  { bookingId:"BK-010",customerName:"Usama Qadir",phone:"+92-312-1010101",email:"usama@email.com",areaId:"AREA-006",tankerSize:"large",date:"2026-09-13",timeSlot:"10:00-12:00",address:"Landhi, Phase 2",instructions:"Use back entrance",price:6650,capacity:10000,status:"en-route",createdAt:"2026-09-12T22:00:00"},
  { bookingId:"BK-011",customerName:"Mehak Rizvi",phone:"+92-300-1212121",email:"mehak@email.com",areaId:"AREA-012",tankerSize:"small",date:"2026-09-13",timeSlot:"08:00-10:00",address:"Baldia Town, Main Road",instructions:"",price:2660,capacity:3000,status:"completed",createdAt:"2026-09-12T19:00:00"},
  { bookingId:"BK-012",customerName:"Danish Patel",phone:"+92-321-1313131",email:"danish@email.com",areaId:"AREA-017",tankerSize:"medium",date:"2026-09-13",timeSlot:"12:00-14:00",address:"Federal B Area, Block 14",instructions:"Leave at gate",price:3600,capacity:5000,status:"scheduled",createdAt:"2026-09-13T09:00:00"},
  { bookingId:"BK-013",customerName:"Rabia Aslam",phone:"+92-333-1414141",email:"rabia@email.com",areaId:"AREA-005",tankerSize:"small",date:"2026-09-14",timeSlot:"10:00-12:00",address:"DHA Phase V, Street 12",instructions:"Gate code 5678",price:2850,capacity:3000,status:"scheduled",createdAt:"2026-09-13T10:00:00"},
  { bookingId:"BK-014",customerName:"Kamran Butt",phone:"+92-345-1515151",email:"kamran@email.com",areaId:"AREA-008",tankerSize:"large",date:"2026-09-14",timeSlot:"06:00-08:00",address:"Malir Cantt, House 5",instructions:"",price:7000,capacity:10000,status:"scheduled",createdAt:"2026-09-13T11:00:00"},
  { bookingId:"BK-015",customerName:"Sana Javed",phone:"+92-312-1616161",email:"sana@email.com",areaId:"AREA-010",tankerSize:"medium",date:"2026-09-13",timeSlot:"08:00-10:00",address:"SITE Area, Block 3",instructions:"Ring warehouse bell",price:1900,capacity:5000,status:"completed",createdAt:"2026-09-12T21:00:00"}
];

const dispatches = [
  { dispatchId:"DSP-001",bookingId:"BK-001",tankerId:"TK-001",driverId:"DRV-001",status:"delivered",createdAt:"2026-09-13T06:30:00",timeline:[{status:"assigned",time:"2026-09-13T06:30:00"},{status:"loading",time:"2026-09-13T06:45:00"},{status:"en-route",time:"2026-09-13T07:00:00"},{status:"delivered",time:"2026-09-13T07:55:00"}]},
  { dispatchId:"DSP-002",bookingId:"BK-002",tankerId:"TK-002",driverId:"DRV-002",status:"en-route",createdAt:"2026-09-13T08:00:00",timeline:[{status:"assigned",time:"2026-09-13T08:00:00"},{status:"loading",time:"2026-09-13T08:15:00"},{status:"en-route",time:"2026-09-13T08:30:00"}]},
  { dispatchId:"DSP-003",bookingId:"BK-003",tankerId:"TK-008",driverId:"DRV-008",status:"delivered",createdAt:"2026-09-13T05:00:00",timeline:[{status:"assigned",time:"2026-09-13T05:00:00"},{status:"loading",time:"2026-09-13T05:15:00"},{status:"en-route",time:"2026-09-13T05:30:00"},{status:"delivered",time:"2026-09-13T07:15:00"}]},
  { dispatchId:"DSP-004",bookingId:"BK-004",tankerId:"TK-012",driverId:"DRV-012",status:"en-route",createdAt:"2026-09-13T10:30:00",timeline:[{status:"assigned",time:"2026-09-13T10:30:00"},{status:"loading",time:"2026-09-13T10:45:00"},{status:"en-route",time:"2026-09-13T11:00:00"}]},
  { dispatchId:"DSP-005",bookingId:"BK-006",tankerId:"TK-004",driverId:"DRV-004",status:"delivered",createdAt:"2026-09-13T04:30:00",timeline:[{status:"assigned",time:"2026-09-13T04:30:00"},{status:"loading",time:"2026-09-13T04:45:00"},{status:"en-route",time:"2026-09-13T05:00:00"},{status:"delivered",time:"2026-09-13T06:30:00"}]},
  { dispatchId:"DSP-006",bookingId:"BK-008",tankerId:"TK-011",driverId:"DRV-011",status:"delivered",createdAt:"2026-09-13T06:00:00",timeline:[{status:"assigned",time:"2026-09-13T06:00:00"},{status:"loading",time:"2026-09-13T06:15:00"},{status:"en-route",time:"2026-09-13T06:30:00"},{status:"delivered",time:"2026-09-13T08:00:00"}]},
  { dispatchId:"DSP-007",bookingId:"BK-010",tankerId:"TK-013",driverId:"DRV-013",status:"en-route",createdAt:"2026-09-13T09:00:00",timeline:[{status:"assigned",time:"2026-09-13T09:00:00"},{status:"loading",time:"2026-09-13T09:15:00"},{status:"en-route",time:"2026-09-13T09:30:00"}]},
  { dispatchId:"DSP-008",bookingId:"BK-011",tankerId:"TK-014",driverId:"DRV-014",status:"delivered",createdAt:"2026-09-13T07:00:00",timeline:[{status:"assigned",time:"2026-09-13T07:00:00"},{status:"loading",time:"2026-09-13T07:10:00"},{status:"en-route",time:"2026-09-13T07:20:00"},{status:"delivered",time:"2026-09-13T08:10:00"}]},
  { dispatchId:"DSP-009",bookingId:"BK-015",tankerId:"TK-006",driverId:"DRV-006",status:"delivered",createdAt:"2026-09-13T06:15:00",timeline:[{status:"assigned",time:"2026-09-13T06:15:00"},{status:"loading",time:"2026-09-13T06:25:00"},{status:"en-route",time:"2026-09-13T06:35:00"},{status:"delivered",time:"2026-09-13T07:50:00"}]},
  { dispatchId:"DSP-010",bookingId:"BK-001",tankerId:"TK-001",driverId:"DRV-001",status:"delivered",createdAt:"2026-09-12T08:00:00",timeline:[{status:"assigned",time:"2026-09-12T08:00:00"},{status:"loading",time:"2026-09-12T08:15:00"},{status:"en-route",time:"2026-09-12T08:30:00"},{status:"delivered",time:"2026-09-12T09:45:00"}]},
  { dispatchId:"DSP-011",bookingId:"BK-003",tankerId:"TK-015",driverId:"DRV-015",status:"delivered",createdAt:"2026-09-12T06:00:00",timeline:[{status:"assigned",time:"2026-09-12T06:00:00"},{status:"loading",time:"2026-09-12T06:15:00"},{status:"en-route",time:"2026-09-12T06:30:00"},{status:"delivered",time:"2026-09-12T08:30:00"}]},
  { dispatchId:"DSP-012",bookingId:"BK-008",tankerId:"TK-004",driverId:"DRV-004",status:"delivered",createdAt:"2026-09-12T09:00:00",timeline:[{status:"assigned",time:"2026-09-12T09:00:00"},{status:"loading",time:"2026-09-12T09:15:00"},{status:"en-route",time:"2026-09-12T09:30:00"},{status:"delivered",time:"2026-09-12T11:30:00"}]},
  { dispatchId:"DSP-013",bookingId:"BK-006",tankerId:"TK-008",driverId:"DRV-008",status:"delivered",createdAt:"2026-09-11T07:00:00",timeline:[{status:"assigned",time:"2026-09-11T07:00:00"},{status:"loading",time:"2026-09-11T07:15:00"},{status:"en-route",time:"2026-09-11T07:30:00"},{status:"delivered",time:"2026-09-11T09:00:00"}]},
  { dispatchId:"DSP-014",bookingId:"BK-011",tankerId:"TK-012",driverId:"DRV-012",status:"delivered",createdAt:"2026-09-11T08:00:00",timeline:[{status:"assigned",time:"2026-09-11T08:00:00"},{status:"loading",time:"2026-09-11T08:10:00"},{status:"en-route",time:"2026-09-11T08:20:00"},{status:"delivered",time:"2026-09-11T09:10:00"}]},
  { dispatchId:"DSP-015",bookingId:"BK-015",tankerId:"TK-002",driverId:"DRV-002",status:"delivered",createdAt:"2026-09-11T10:00:00",timeline:[{status:"assigned",time:"2026-09-11T10:00:00"},{status:"loading",time:"2026-09-11T10:10:00"},{status:"en-route",time:"2026-09-11T10:20:00"},{status:"delivered",time:"2026-09-11T11:20:00"}]},
  { dispatchId:"DSP-016",bookingId:"BK-002",tankerId:"TK-009",driverId:"DRV-009",status:"delivered",createdAt:"2026-09-10T08:00:00",timeline:[{status:"assigned",time:"2026-09-10T08:00:00"},{status:"loading",time:"2026-09-10T08:15:00"},{status:"en-route",time:"2026-09-10T08:30:00"},{status:"delivered",time:"2026-09-10T10:00:00"}]},
  { dispatchId:"DSP-017",bookingId:"BK-004",tankerId:"TK-011",driverId:"DRV-011",status:"delivered",createdAt:"2026-09-10T06:00:00",timeline:[{status:"assigned",time:"2026-09-10T06:00:00"},{status:"loading",time:"2026-09-10T06:15:00"},{status:"en-route",time:"2026-09-10T06:30:00"},{status:"delivered",time:"2026-09-10T08:30:00"}]},
  { dispatchId:"DSP-018",bookingId:"BK-007",tankerId:"TK-013",driverId:"DRV-013",status:"delivered",createdAt:"2026-09-10T14:00:00",timeline:[{status:"assigned",time:"2026-09-10T14:00:00"},{status:"loading",time:"2026-09-10T14:10:00"},{status:"en-route",time:"2026-09-10T14:20:00"},{status:"delivered",time:"2026-09-10T15:20:00"}]},
  { dispatchId:"DSP-019",bookingId:"BK-009",tankerId:"TK-006",driverId:"DRV-006",status:"delivered",createdAt:"2026-09-10T16:00:00",timeline:[{status:"assigned",time:"2026-09-10T16:00:00"},{status:"loading",time:"2026-09-10T16:10:00"},{status:"en-route",time:"2026-09-10T16:20:00"},{status:"delivered",time:"2026-09-10T17:20:00"}]},
  { dispatchId:"DSP-020",bookingId:"BK-012",tankerId:"TK-015",driverId:"DRV-015",status:"delivered",createdAt:"2026-09-10T12:00:00",timeline:[{status:"assigned",time:"2026-09-10T12:00:00"},{status:"loading",time:"2026-09-10T12:10:00"},{status:"en-route",time:"2026-09-10T12:20:00"},{status:"delivered",time:"2026-09-10T13:30:00"}]}
];

const payments = [
  { paymentId:"PAY-001",bookingId:"BK-001",customer:"Fatima Ahmed",amount:9500,method:"cash",status:"completed",date:"2026-09-13T07:55:00"},
  { paymentId:"PAY-002",bookingId:"BK-003",customer:"Sara Malik",amount:7000,method:"jazzcash",status:"completed",date:"2026-09-13T07:15:00"},
  { paymentId:"PAY-003",bookingId:"BK-006",customer:"Bilal Raza",amount:6650,method:"easypaisa",status:"completed",date:"2026-09-13T06:30:00"},
  { paymentId:"PAY-004",bookingId:"BK-008",customer:"Hassan Ali",amount:7000,method:"bank",status:"completed",date:"2026-09-13T08:00:00"},
  { paymentId:"PAY-005",bookingId:"BK-011",customer:"Mehak Rizvi",amount:2660,method:"cash",status:"completed",date:"2026-09-13T08:10:00"},
  { paymentId:"PAY-006",bookingId:"BK-015",customer:"Sana Javed",amount:1900,method:"jazzcash",status:"completed",date:"2026-09-13T07:50:00"},
  { paymentId:"PAY-007",bookingId:"BK-002",customer:"Ali Hassan",amount:3800,method:"easypaisa",status:"pending",date:"2026-09-13T09:30:00"},
  { paymentId:"PAY-008",bookingId:"BK-004",customer:"Omar Khan",amount:3800,method:"cash",status:"pending",date:"2026-09-13T11:00:00"},
  { paymentId:"PAY-009",bookingId:"BK-010",customer:"Usama Qadir",amount:6650,method:"bank",status:"pending",date:"2026-09-13T09:30:00"},
  { paymentId:"PAY-010",bookingId:"BK-001",customer:"Fatima Ahmed",amount:9500,method:"cash",status:"completed",date:"2026-09-12T09:45:00"},
  { paymentId:"PAY-011",bookingId:"BK-003",customer:"Sara Malik",amount:7000,method:"jazzcash",status:"completed",date:"2026-09-12T08:30:00"},
  { paymentId:"PAY-012",bookingId:"BK-008",customer:"Hassan Ali",amount:7000,method:"easypaisa",status:"completed",date:"2026-09-12T11:30:00"},
  { paymentId:"PAY-013",bookingId:"BK-006",customer:"Bilal Raza",amount:6650,method:"bank",status:"completed",date:"2026-09-11T09:00:00"},
  { paymentId:"PAY-014",bookingId:"BK-011",customer:"Mehak Rizvi",amount:2660,method:"cash",status:"completed",date:"2026-09-11T09:10:00"},
  { paymentId:"PAY-015",bookingId:"BK-015",customer:"Sana Javed",amount:1900,method:"jazzcash",status:"completed",date:"2026-09-11T11:20:00"},
  { paymentId:"PAY-016",bookingId:"BK-002",customer:"Ali Hassan",amount:3800,method:"cash",status:"completed",date:"2026-09-10T10:00:00"},
  { paymentId:"PAY-017",bookingId:"BK-004",customer:"Omar Khan",amount:3800,method:"easypaisa",status:"completed",date:"2026-09-10T08:30:00"},
  { paymentId:"PAY-018",bookingId:"BK-007",customer:"Ayesha Siddiqui",amount:3600,method:"bank",status:"completed",date:"2026-09-10T15:20:00"},
  { paymentId:"PAY-019",bookingId:"BK-009",customer:"Zainab Noor",amount:3800,method:"jazzcash",status:"completed",date:"2026-09-10T17:20:00"},
  { paymentId:"PAY-020",bookingId:"BK-012",customer:"Danish Patel",amount:3600,method:"cash",status:"completed",date:"2026-09-10T13:30:00"},
  { paymentId:"PAY-021",bookingId:"BK-001",customer:"Fatima Ahmed",amount:9500,method:"bank",status:"completed",date:"2026-09-09T09:00:00"},
  { paymentId:"PAY-022",bookingId:"BK-003",customer:"Sara Malik",amount:7000,method:"easypaisa",status:"completed",date:"2026-09-09T08:00:00"},
  { paymentId:"PAY-023",bookingId:"BK-006",customer:"Bilal Raza",amount:6650,method:"cash",status:"completed",date:"2026-09-09T10:30:00"},
  { paymentId:"PAY-024",bookingId:"BK-008",customer:"Hassan Ali",amount:7000,method:"jazzcash",status:"completed",date:"2026-09-09T11:00:00"},
  { paymentId:"PAY-025",bookingId:"BK-011",customer:"Mehak Rizvi",amount:2660,method:"bank",status:"completed",date:"2026-09-09T09:30:00"},
  { paymentId:"PAY-026",bookingId:"BK-015",customer:"Sana Javed",amount:1900,method:"cash",status:"completed",date:"2026-09-09T08:15:00"},
  { paymentId:"PAY-027",bookingId:"BK-002",customer:"Ali Hassan",amount:3800,method:"easypaisa",status:"completed",date:"2026-09-08T10:00:00"},
  { paymentId:"PAY-028",bookingId:"BK-004",customer:"Omar Khan",amount:3800,method:"jazzcash",status:"completed",date:"2026-09-08T09:00:00"},
  { paymentId:"PAY-029",bookingId:"BK-007",customer:"Ayesha Siddiqui",amount:3600,method:"cash",status:"completed",date:"2026-09-08T14:00:00"},
  { paymentId:"PAY-030",bookingId:"BK-009",customer:"Zainab Noor",amount:3800,method:"bank",status:"completed",date:"2026-09-08T16:00:00"}
];

const qualityTests = [
  { testId:"QT-001",sourceId:"WS-001",ph:7.2,tds:280,turbidity:1.2,chlorine:0.8,bacteria:"absent",score:96,grade:"A+",status:"passed",testedDate:"2026-09-13T06:00:00"},
  { testId:"QT-002",sourceId:"WS-002",ph:7.0,tds:310,turbidity:1.5,chlorine:0.7,bacteria:"absent",score:94,grade:"A",status:"passed",testedDate:"2026-09-13T06:30:00"},
  { testId:"QT-003",sourceId:"WS-003",ph:6.8,tds:350,turbidity:2.1,chlorine:0.6,bacteria:"absent",score:88,grade:"B+",status:"passed",testedDate:"2026-09-13T07:00:00"},
  { testId:"QT-004",sourceId:"WS-004",ph:7.1,tds:290,turbidity:1.8,chlorine:0.75,bacteria:"absent",score:92,grade:"A",status:"passed",testedDate:"2026-09-13T06:00:00"},
  { testId:"QT-005",sourceId:"WS-005",ph:6.9,tds:320,turbidity:1.9,chlorine:0.65,bacteria:"absent",score:90,grade:"A-",status:"passed",testedDate:"2026-09-13T06:30:00"},
  { testId:"QT-006",sourceId:"WS-006",ph:6.5,tds:420,turbidity:3.2,chlorine:0.5,bacteria:"absent",score:78,grade:"C+",status:"passed",testedDate:"2026-09-13T07:00:00"},
  { testId:"QT-007",sourceId:"WS-007",ph:7.0,tds:300,turbidity:1.6,chlorine:0.7,bacteria:"absent",score:91,grade:"A-",status:"passed",testedDate:"2026-09-13T06:00:00"},
  { testId:"QT-008",sourceId:"WS-008",ph:6.6,tds:380,turbidity:2.8,chlorine:0.55,bacteria:"absent",score:82,grade:"B",status:"passed",testedDate:"2026-09-13T06:30:00"},
  { testId:"QT-009",sourceId:"WS-009",ph:6.7,tds:360,turbidity:2.5,chlorine:0.58,bacteria:"absent",score:84,grade:"B",status:"passed",testedDate:"2026-09-13T07:00:00"},
  { testId:"QT-010",sourceId:"WS-010",ph:7.1,tds:295,turbidity:1.7,chlorine:0.72,bacteria:"absent",score:93,grade:"A",status:"passed",testedDate:"2026-09-13T06:00:00"},
  { testId:"QT-011",sourceId:"WS-001",ph:7.3,tds:275,turbidity:1.1,chlorine:0.82,bacteria:"absent",score:97,grade:"A+",status:"passed",testedDate:"2026-09-12T06:00:00"},
  { testId:"QT-012",sourceId:"WS-006",ph:6.4,tds:440,turbidity:3.5,chlorine:0.45,bacteria:"detected",score:65,grade:"D",status:"failed",testedDate:"2026-09-12T07:00:00"},
  { testId:"QT-013",sourceId:"WS-002",ph:7.0,tds:305,turbidity:1.4,chlorine:0.71,bacteria:"absent",score:94,grade:"A",status:"passed",testedDate:"2026-09-12T06:30:00"},
  { testId:"QT-014",sourceId:"WS-003",ph:6.9,tds:340,turbidity:2.0,chlorine:0.62,bacteria:"absent",score:89,grade:"B+",status:"passed",testedDate:"2026-09-12T07:00:00"},
  { testId:"QT-015",sourceId:"WS-004",ph:7.0,tds:295,turbidity:1.7,chlorine:0.73,bacteria:"absent",score:92,grade:"A",status:"passed",testedDate:"2026-09-12T06:00:00"},
  { testId:"QT-016",sourceId:"WS-007",ph:7.1,tds:290,turbidity:1.5,chlorine:0.72,bacteria:"absent",score:93,grade:"A",status:"passed",testedDate:"2026-09-12T06:00:00"},
  { testId:"QT-017",sourceId:"WS-001",ph:7.2,tds:285,turbidity:1.3,chlorine:0.79,bacteria:"absent",score:95,grade:"A+",status:"passed",testedDate:"2026-09-11T06:00:00"},
  { testId:"QT-018",sourceId:"WS-005",ph:6.8,tds:330,turbidity:2.0,chlorine:0.63,bacteria:"absent",score:89,grade:"B+",status:"passed",testedDate:"2026-09-11T06:30:00"},
  { testId:"QT-019",sourceId:"WS-008",ph:6.5,tds:395,turbidity:3.0,chlorine:0.52,bacteria:"absent",score:79,grade:"C+",status:"passed",testedDate:"2026-09-11T07:00:00"},
  { testId:"QT-020",sourceId:"WS-010",ph:7.0,tds:300,turbidity:1.6,chlorine:0.70,bacteria:"absent",score:93,grade:"A",status:"passed",testedDate:"2026-09-11T06:00:00"}
];

const notifications = [
  { notificationId:"NTF-001",type:"sms",to:"+92-300-1111111",message:"Your booking BK-001 is confirmed. Tanker TK-001 will arrive at 08:00-10:00. Track: aquamanager.pk/track/BK-001",status:"sent",sentAt:"2026-09-12T18:01:00",bookingId:"BK-001"},
  { notificationId:"NTF-002",type:"whatsapp",to:"+92-300-1111111",message:"AquaManager PRO: Booking BK-001 confirmed! Your 10000L tanker arrives tomorrow 08:00-10:00 at North Karachi. Track live: aquamanager.pk/track/BK-001",status:"sent",sentAt:"2026-09-12T18:01:30",bookingId:"BK-001"},
  { notificationId:"NTF-003",type:"sms",to:"+92-321-2222222",message:"Your booking BK-002 is confirmed. Tanker TK-002 will arrive at 10:00-12:00. Track: aquamanager.pk/track/BK-002",status:"sent",sentAt:"2026-09-12T20:01:00",bookingId:"BK-002"},
  { notificationId:"NTF-004",type:"sms",to:"+92-333-3333333",message:"Your booking BK-003 is confirmed. Tanker TK-008 will arrive at 06:00-08:00. Track: aquamanager.pk/track/BK-003",status:"sent",sentAt:"2026-09-11T22:01:00",bookingId:"BK-003"},
  { notificationId:"NTF-005",type:"whatsapp",to:"+92-333-3333333",message:"AquaManager PRO: Booking BK-003 confirmed! Your 10000L tanker arrives tomorrow 06:00-08:00 at Lyari. Track live: aquamanager.pk/track/BK-003",status:"sent",sentAt:"2026-09-11T22:01:30",bookingId:"BK-003"},
  { notificationId:"NTF-006",type:"sms",to:"+92-345-4444444",message:"Your booking BK-004 is confirmed. Tanker TK-012 will arrive at 12:00-14:00. Track: aquamanager.pk/track/BK-004",status:"sent",sentAt:"2026-09-12T14:01:00",bookingId:"BK-004"},
  { notificationId:"NTF-007",type:"sms",to:"+92-312-5555555",message:"Your booking BK-005 is confirmed. Tanker will arrive at 14:00-16:00. Track: aquamanager.pk/track/BK-005",status:"sent",sentAt:"2026-09-13T08:01:00",bookingId:"BK-005"},
  { notificationId:"NTF-008",type:"whatsapp",to:"+92-300-6666666",message:"AquaManager PRO: Booking BK-006 confirmed! Your 10000L tanker arrives at 06:00-08:00 at Clifton. Track live: aquamanager.pk/track/BK-006",status:"sent",sentAt:"2026-09-12T16:01:30",bookingId:"BK-006"},
  { notificationId:"NTF-009",type:"sms",to:"+92-333-8888888",message:"Your booking BK-008 is confirmed. Tanker TK-011 will arrive at 08:00-10:00. Track: aquamanager.pk/track/BK-008",status:"sent",sentAt:"2026-09-11T20:01:00",bookingId:"BK-008"},
  { notificationId:"NTF-010",type:"sms",to:"+92-345-9999999",message:"Your booking BK-009 is confirmed. Tanker will arrive at 16:00-18:00. Track: aquamanager.pk/track/BK-009",status:"sent",sentAt:"2026-09-13T06:01:00",bookingId:"BK-009"}
];

// ============================================
// ROAD NETWORK GRAPH
// ============================================

const roadNetwork = {
  nodes: [
    {id:"WS-001",type:"source",lat:24.8500,lng:67.1500},{id:"WS-002",type:"source",lat:24.7800,lng:66.8500},
    {id:"WS-003",type:"source",lat:24.9200,lng:67.2200},{id:"WS-004",type:"source",lat:24.9150,lng:67.0600},
    {id:"WS-005",type:"source",lat:24.8650,lng:67.1000},{id:"WS-006",type:"source",lat:24.8950,lng:67.1300},
    {id:"WS-007",type:"source",lat:24.9450,lng:67.0300},{id:"WS-008",type:"source",lat:24.8600,lng:67.1900},
    {id:"WS-009",type:"source",lat:24.8400,lng:67.1500},{id:"WS-010",type:"source",lat:24.8050,lng:66.9800},
    {id:"AREA-001",type:"area",lat:24.9850,lng:67.0810},{id:"AREA-002",type:"area",lat:24.9650,lng:67.0650},
    {id:"AREA-003",type:"area",lat:24.9200,lng:67.0650},{id:"AREA-004",type:"area",lat:24.8700,lng:67.1050},
    {id:"AREA-005",type:"area",lat:24.8050,lng:67.0350},{id:"AREA-006",type:"area",lat:24.8450,lng:67.1550},
    {id:"AREA-007",type:"area",lat:24.8100,lng:67.0250},{id:"AREA-008",type:"area",lat:24.8650,lng:67.1950},
    {id:"AREA-009",type:"area",lat:24.8550,lng:67.0100},{id:"AREA-010",type:"area",lat:24.8900,lng:67.1250},
    {id:"AREA-011",type:"area",lat:24.8700,lng:67.0050},{id:"AREA-012",type:"area",lat:24.9250,lng:67.0000},
    {id:"AREA-013",type:"area",lat:24.9350,lng:66.9950},{id:"AREA-014",type:"area",lat:24.9050,lng:66.9850},
    {id:"AREA-015",type:"area",lat:24.9500,lng:67.0350},{id:"AREA-016",type:"area",lat:24.9450,lng:66.9750},
    {id:"AREA-017",type:"area",lat:24.9400,lng:67.0500},{id:"AREA-018",type:"area",lat:24.9150,lng:66.9650},
    {id:"HYD-001",type:"junction",lat:24.9750,lng:67.0750},{id:"HYD-002",type:"junction",lat:24.9400,lng:67.0700},
    {id:"HYD-003",type:"junction",lat:24.9150,lng:67.0950},{id:"HYD-004",type:"junction",lat:24.8850,lng:67.0800},
    {id:"HYD-005",type:"junction",lat:24.8550,lng:67.1200},{id:"HYD-006",type:"junction",lat:24.8250,lng:67.0550},
    {id:"HYD-007",type:"junction",lat:24.8550,lng:67.1750},{id:"HYD-008",type:"junction",lat:24.8350,lng:67.0200},
    {id:"HYD-009",type:"junction",lat:24.8750,lng:67.1600},{id:"HYD-010",type:"junction",lat:24.8600,lng:67.0150},
    {id:"HYD-011",type:"junction",lat:24.8950,lng:67.1100},{id:"HYD-012",type:"junction",lat:24.8750,lng:67.0050},
    {id:"HYD-013",type:"junction",lat:24.9150,lng:67.0050},{id:"HYD-014",type:"junction",lat:24.9300,lng:67.0100},
    {id:"HYD-015",type:"junction",lat:24.9100,lng:66.9900},{id:"HYD-016",type:"junction",lat:24.9450,lng:67.0200},
    {id:"HYD-017",type:"junction",lat:24.9350,lng:66.9850},{id:"HYD-018",type:"junction",lat:24.9400,lng:67.0400},
    {id:"HYD-019",type:"junction",lat:24.9200,lng:66.9750}
  ],
  edges: [
    {from:"WS-001",to:"AREA-006",weight:12,distance:8.5,time:25,capacity:15},
    {from:"WS-001",to:"AREA-008",weight:10,distance:7.2,time:20,capacity:12},
    {from:"WS-001",to:"AREA-010",weight:8,distance:5.5,time:15,capacity:10},
    {from:"WS-002",to:"AREA-005",weight:25,distance:18.0,time:50,capacity:20},
    {from:"WS-002",to:"AREA-007",weight:28,distance:20.0,time:55,capacity:18},
    {from:"WS-002",to:"AREA-010",weight:22,distance:16.0,time:45,capacity:16},
    {from:"WS-003",to:"AREA-001",weight:15,distance:11.0,time:30,capacity:14},
    {from:"WS-003",to:"AREA-002",weight:18,distance:13.0,time:35,capacity:13},
    {from:"WS-003",to:"AREA-003",weight:12,distance:9.0,time:25,capacity:11},
    {from:"WS-004",to:"AREA-003",weight:5,distance:3.5,time:10,capacity:8},
    {from:"WS-004",to:"AREA-015",weight:8,distance:5.5,time:15,capacity:9},
    {from:"WS-004",to:"AREA-017",weight:6,distance:4.0,time:12,capacity:7},
    {from:"WS-005",to:"AREA-004",weight:6,distance:4.0,time:12,capacity:8},
    {from:"WS-005",to:"AREA-006",weight:10,distance:7.0,time:18,capacity:10},
    {from:"WS-005",to:"AREA-010",weight:4,distance:2.5,time:8,capacity:6},
    {from:"WS-006",to:"AREA-004",weight:8,distance:5.5,time:15,capacity:9},
    {from:"WS-006",to:"AREA-010",weight:3,distance:2.0,time:6,capacity:5},
    {from:"WS-006",to:"AREA-014",weight:12,distance:8.5,time:22,capacity:11},
    {from:"WS-007",to:"AREA-015",weight:4,distance:2.5,time:8,capacity:6},
    {from:"WS-007",to:"AREA-017",weight:3,distance:2.0,time:6,capacity:5},
    {from:"WS-007",to:"AREA-012",weight:10,distance:7.0,time:18,capacity:10},
    {from:"WS-008",to:"AREA-008",weight:5,distance:3.5,time:10,capacity:7},
    {from:"WS-008",to:"AREA-006",weight:12,distance:8.5,time:25,capacity:11},
    {from:"WS-009",to:"AREA-006",weight:3,distance:2.0,time:6,capacity:5},
    {from:"WS-009",to:"AREA-010",weight:6,distance:4.0,time:12,capacity:7},
    {from:"WS-010",to:"AREA-007",weight:5,distance:3.5,time:10,capacity:7},
    {from:"WS-010",to:"AREA-009",weight:8,distance:5.5,time:15,capacity:9},
    {from:"WS-010",to:"AREA-011",weight:10,distance:7.0,time:18,capacity:10},
    {from:"AREA-001",to:"AREA-002",weight:5,distance:3.5,time:10,capacity:8},
    {from:"AREA-002",to:"AREA-003",weight:8,distance:5.5,time:15,capacity:9},
    {from:"AREA-003",to:"AREA-005",weight:15,distance:11.0,time:30,capacity:12},
    {from:"AREA-004",to:"AREA-006",weight:10,distance:7.0,time:18,capacity:10},
    {from:"AREA-005",to:"AREA-007",weight:4,distance:2.5,time:8,capacity:6},
    {from:"AREA-006",to:"AREA-008",weight:8,distance:5.5,time:15,capacity:9},
    {from:"AREA-007",to:"AREA-009",weight:6,distance:4.0,time:12,capacity:7},
    {from:"AREA-008",to:"AREA-010",weight:12,distance:8.5,time:22,capacity:11},
    {from:"AREA-009",to:"AREA-011",weight:5,distance:3.5,time:10,capacity:8},
    {from:"AREA-010",to:"AREA-012",weight:15,distance:11.0,time:28,capacity:12},
    {from:"AREA-011",to:"AREA-013",weight:4,distance:2.5,time:8,capacity:6},
    {from:"AREA-012",to:"AREA-014",weight:6,distance:4.0,time:12,capacity:7},
    {from:"AREA-013",to:"AREA-015",weight:10,distance:7.0,time:18,capacity:10},
    {from:"AREA-014",to:"AREA-016",weight:5,distance:3.5,time:10,capacity:8},
    {from:"AREA-015",to:"AREA-017",weight:4,distance:2.5,time:8,capacity:6},
    {from:"AREA-016",to:"AREA-018",weight:8,distance:5.5,time:15,capacity:9},
    {from:"HYD-001",to:"AREA-001",weight:2,distance:1.2,time:4,capacity:4},
    {from:"HYD-001",to:"AREA-002",weight:3,distance:2.0,time:6,capacity:5},
    {from:"HYD-002",to:"AREA-003",weight:2,distance:1.5,time:5,capacity:4},
    {from:"HYD-002",to:"AREA-015",weight:4,distance:2.8,time:8,capacity:6},
    {from:"HYD-003",to:"AREA-004",weight:3,distance:2.0,time:6,capacity:5},
    {from:"HYD-004",to:"AREA-003",weight:5,distance:3.5,time:10,capacity:7},
    {from:"HYD-005",to:"AREA-006",weight:4,distance:2.8,time:8,capacity:6},
    {from:"HYD-006",to:"AREA-005",weight:2,distance:1.5,time:5,capacity:4},
    {from:"HYD-007",to:"AREA-008",weight:3,distance:2.0,time:6,capacity:5},
    {from:"HYD-008",to:"AREA-009",weight:2,distance:1.5,time:5,capacity:4},
    {from:"HYD-009",to:"AREA-008",weight:3,distance:2.0,time:6,capacity:5},
    {from:"HYD-010",to:"AREA-009",weight:2,distance:1.2,time:4,capacity:4},
    {from:"HYD-011",to:"AREA-010",weight:2,distance:1.5,time:5,capacity:4},
    {from:"HYD-012",to:"AREA-011",weight:3,distance:2.0,time:6,capacity:5},
    {from:"HYD-013",to:"AREA-012",weight:2,distance:1.5,time:5,capacity:4},
    {from:"HYD-014",to:"AREA-013",weight:3,distance:2.0,time:6,capacity:5},
    {from:"HYD-015",to:"AREA-014",weight:2,distance:1.2,time:4,capacity:4},
    {from:"HYD-016",to:"AREA-015",weight:2,distance:1.5,time:5,capacity:4},
    {from:"HYD-017",to:"AREA-016",weight:3,distance:2.0,time:6,capacity:5},
    {from:"HYD-018",to:"AREA-017",weight:2,distance:1.2,time:4,capacity:4},
    {from:"HYD-019",to:"AREA-018",weight:3,distance:2.0,time:6,capacity:5}
  ]
};

// ============================================
// ALGORITHM IMPLEMENTATIONS
// ============================================

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
        const rc = this.heap[rightChildIdx];
        if ((swap === null && rc.distance < element.distance) || (swap !== null && rc.distance < this.heap[leftChildIdx].distance)) swap = rightChildIdx;
      }
      if (swap === null) break;
      this.heap[idx] = this.heap[swap]; this.heap[swap] = element; idx = swap;
    }
  }
  isEmpty() { return this.heap.length === 0; }
}

// Helper: build adjacency list from graph
function buildAdjList(graph, weightType = 'weight') {
  const nodes = new Set();
  graph.edges.forEach(e => { nodes.add(e.from); nodes.add(e.to); });
  const adj = {};
  nodes.forEach(n => { adj[n] = []; });
  graph.edges.forEach(e => {
    adj[e.from].push({ node: e.to, weight: e[weightType] || e.weight, distance: e.distance, time: e.time });
    adj[e.to].push({ node: e.from, weight: e[weightType] || e.weight, distance: e.distance, time: e.time });
  });
  return { nodes: [...nodes], adj };
}

// Helper: Haversine distance
function haversine(loc1, loc2) {
  const R = 6371;
  const dLat = (loc2.lat - loc1.lat) * Math.PI / 180;
  const dLon = (loc2.lng - loc1.lng) * Math.PI / 180;
  const a = Math.sin(dLat/2)**2 + Math.cos(loc1.lat*Math.PI/180)*Math.cos(loc2.lat*Math.PI/180)*Math.sin(dLon/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

// --- ALGORITHM 1: Dijkstra (Route Optimization - Approach 1) ---
function dijkstra(graph, source, destination, weightType = 'weight') {
  const t0 = performance.now();
  const { nodes, adj } = buildAdjList(graph, weightType);
  const dist = {}, prev = {}, visited = new Set(), steps = [];
  nodes.forEach(n => { dist[n] = Infinity; prev[n] = null; });
  dist[source] = 0;
  const pq = new MinHeap();
  pq.push({ node: source, distance: 0 });
  while (!pq.isEmpty()) {
    const cur = pq.pop();
    if (visited.has(cur.node)) continue;
    visited.add(cur.node);
    steps.push({ step: steps.length + 1, currentNode: cur.node, distances: { ...dist }, visited: [...visited] });
    if (cur.node === destination) break;
    for (const nb of adj[cur.node]) {
      if (!visited.has(nb.node)) {
        const nd = dist[cur.node] + nb.weight;
        if (nd < dist[nb.node]) { dist[nb.node] = nd; prev[nb.node] = cur.node; pq.push({ node: nb.node, distance: nd }); }
      }
    }
  }
  const path = [];
  let c = destination;
  while (c) { path.unshift(c); c = prev[c]; }
  if (path[0] !== source) return { success: false, message: 'No path found', steps, executionTime: performance.now() - t0 };
  const pathEdges = [];
  for (let i = 0; i < path.length - 1; i++) {
    const edge = graph.edges.find(e => (e.from === path[i] && e.to === path[i+1]) || (e.to === path[i] && e.from === path[i+1]));
    if (edge) pathEdges.push({ from: path[i], to: path[i+1], weight: edge[weightType], distance: edge.distance, time: edge.time });
  }
  return {
    success: true, path, pathEdges,
    totalDistance: dist[destination],
    totalKm: pathEdges.reduce((s, e) => s + e.distance, 0),
    totalTime: pathEdges.reduce((s, e) => s + e.time, 0),
    steps, complexity: { time: 'O((V+E) log V)', space: 'O(V+E)', vertices: nodes.length, edges: graph.edges.length },
    executionTime: performance.now() - t0
  };
}

// --- ALGORITHM 2: BFS (Route Optimization - Approach 2) ---
function bfsShortestPath(graph, source, destination) {
  const t0 = performance.now();
  const nodes = new Set();
  graph.edges.forEach(e => { nodes.add(e.from); nodes.add(e.to); });
  const adj = {};
  nodes.forEach(n => { adj[n] = []; });
  graph.edges.forEach(e => {
    adj[e.from].push({ node: e.to, distance: e.distance, time: e.time, weight: e.weight });
    adj[e.to].push({ node: e.from, distance: e.distance, time: e.time, weight: e.weight });
  });
  const visited = new Set([source]);
  const queue = [[source]];
  const steps = [];
  let pathFound = null;
  while (queue.length > 0) {
    const path = queue.shift();
    const current = path[path.length - 1];
    steps.push({ step: steps.length + 1, currentNode: current, visited: [...visited] });
    if (current === destination) { pathFound = path; break; }
    for (const nb of adj[current]) {
      if (!visited.has(nb.node)) { visited.add(nb.node); queue.push([...path, nb.node]); }
    }
  }
  if (!pathFound) return { success: false, message: 'No path found', steps, executionTime: performance.now() - t0 };
  const pathEdges = [];
  let totalKm = 0, totalTime = 0, totalWeight = 0;
  for (let i = 0; i < pathFound.length - 1; i++) {
    const edge = graph.edges.find(e => (e.from === pathFound[i] && e.to === pathFound[i+1]) || (e.to === pathFound[i] && e.from === pathFound[i+1]));
    if (edge) { pathEdges.push({ from: pathFound[i], to: pathFound[i+1], distance: edge.distance, time: edge.time, weight: edge.weight }); totalKm += edge.distance; totalTime += edge.time; totalWeight += edge.weight; }
  }
  return {
    success: true, path: pathFound, pathEdges,
    totalDistance: totalWeight, totalKm, totalTime,
    steps, complexity: { time: 'O(V+E)', space: 'O(V+E)', vertices: nodes.size, edges: graph.edges.length },
    executionTime: performance.now() - t0
  };
}

// --- ALGORITHM 3: Greedy (Resource Assignment - Approach 1) ---
function greedyAssignment(tankersList, areasList) {
  const t0 = performance.now();
  const steps = [], assignments = [];
  const available = [...tankersList].filter(t => t.status === 'available');
  const pw = { critical: 4, high: 3, medium: 2, low: 1 };
  const sortedAreas = [...areasList].sort((a, b) => pw[b.priority] - pw[a.priority] || b.demand - a.demand);
  for (const area of sortedAreas) {
    let bestTanker = null, bestScore = -Infinity;
    for (const tanker of available) {
      if (tanker.capacity < area.demand * 0.3) continue;
      const distance = haversine(tanker.currentLocation, area.coordinates);
      const score = (pw[area.priority] * 100) + (tanker.capacity / area.demand * 50) - (distance * 5);
      if (score > bestScore) { bestScore = score; bestTanker = tanker; }
    }
    if (bestTanker) {
      const distance = haversine(bestTanker.currentLocation, area.coordinates);
      assignments.push({ tanker: bestTanker, area, distance: distance.toFixed(2), score: bestScore.toFixed(2), efficiency: (bestTanker.capacity / area.demand * 100).toFixed(1), estimatedTime: Math.ceil(distance * 3) });
      available.splice(available.findIndex(t => t.tankerId === bestTanker.tankerId), 1);
      steps.push({ step: steps.length + 1, area: area.name, tanker: bestTanker.tankerId, distance: distance.toFixed(2) });
    }
  }
  const totalDist = assignments.reduce((s, a) => s + parseFloat(a.distance), 0);
  return {
    success: assignments.length > 0, assignments,
    statistics: { totalAssigned: assignments.length, totalUnassigned: sortedAreas.length - assignments.length, totalDistance: totalDist.toFixed(2), averageEfficiency: (assignments.reduce((s, a) => s + parseFloat(a.efficiency), 0) / (assignments.length || 1)).toFixed(1) },
    steps, complexity: { time: 'O(n*m*log n)', space: 'O(n+m)' },
    executionTime: performance.now() - t0
  };
}

// --- ALGORITHM 4: Priority-Based (Resource Assignment - Approach 2) ---
function priorityBasedAssignment(tankersList, areasList) {
  const t0 = performance.now();
  const steps = [], assignments = [];
  const available = [...tankersList].filter(t => t.status === 'available');
  const pw = { critical: 4, high: 3, medium: 2, low: 1 };
  const sortedAreas = [...areasList].sort((a, b) => pw[b.priority] - pw[a.priority]);
  for (const area of sortedAreas) {
    const matching = available.filter(t => t.capacity >= area.demand * 0.3);
    if (matching.length === 0) continue;
    matching.sort((a, b) => b.capacity - a.capacity);
    const tanker = matching[0];
    const distance = haversine(tanker.currentLocation, area.coordinates);
    assignments.push({ tanker, area, distance: distance.toFixed(2), score: pw[area.priority] * 100, efficiency: (tanker.capacity / area.demand * 100).toFixed(1), estimatedTime: Math.ceil(distance * 3) });
    available.splice(available.findIndex(t => t.tankerId === tanker.tankerId), 1);
    steps.push({ step: steps.length + 1, area: area.name, tanker: tanker.tankerId, distance: distance.toFixed(2) });
  }
  const totalDist = assignments.reduce((s, a) => s + parseFloat(a.distance), 0);
  return {
    success: assignments.length > 0, assignments,
    statistics: { totalAssigned: assignments.length, totalUnassigned: sortedAreas.length - assignments.length, totalDistance: totalDist.toFixed(2), averageEfficiency: (assignments.reduce((s, a) => s + parseFloat(a.efficiency), 0) / (assignments.length || 1)).toFixed(1) },
    steps, complexity: { time: 'O(n log n + m log m)', space: 'O(n + m)' },
    executionTime: performance.now() - t0
  };
}

// --- ALGORITHM 5: DP Scheduler (Scheduling - Approach 1) ---
function dpSchedule(deliveriesList, tankerCount, timeSlots = 14) {
  const t0 = performance.now();
  const pw = { critical: 10, high: 5, medium: 3, low: 1 };
  const schedule = [];
  const sorted = [...deliveriesList].sort((a, b) => pw[b.priority] - pw[a.priority]);
  const usedSlots = {};
  for (let t = 1; t <= tankerCount; t++) usedSlots[t] = new Set();
  let totalDelay = 0, totalDelayCost = 0;
  for (const d of sorted) {
    const scheduledHour = parseInt(d.scheduledTime.split('T')[1]) || 8;
    const timeSlot = scheduledHour - 6;
    let bestTanker = 1, bestSlot = timeSlot, bestCost = Infinity;
    for (let t = 1; t <= tankerCount; t++) {
      for (let s = timeSlot; s < timeSlots; s++) {
        if (!usedSlots[t].has(s)) {
          const cost = (s - timeSlot) * (pw[d.priority] || 1) * 10;
          if (cost < bestCost) { bestCost = cost; bestTanker = t; bestSlot = s; break; }
        }
      }
    }
    usedSlots[bestTanker].add(bestSlot);
    const delay = bestSlot - timeSlot;
    const delayCost = delay * (pw[d.priority] || 1) * 10;
    totalDelay += delay; totalDelayCost += delayCost;
    schedule.push({ ...d, tanker: bestTanker, startTime: 6 + bestSlot, endTime: 7 + bestSlot, timeLabel: `${6+bestSlot}:00 - ${7+bestSlot}:00`, delay, delayCost });
  }
  return {
    success: schedule.length > 0, schedule,
    statistics: { totalScheduled: schedule.length, unscheduled: 0, totalDelaySlots: totalDelay, totalDelayCost: totalDelayCost.toFixed(2), averageDelay: (totalDelay / (schedule.length || 1)).toFixed(2) },
    complexity: { time: 'O(n * T * k)', space: 'O(k * T * n)' },
    executionTime: performance.now() - t0
  };
}

// --- ALGORITHM 6: Greedy Schedule (Scheduling - Approach 2) ---
function greedySchedule(deliveriesList, tankerCount, timeSlots = 14) {
  const t0 = performance.now();
  const pw = { critical: 10, high: 5, medium: 3, low: 1 };
  const schedule = [];
  const sorted = [...deliveriesList].sort((a, b) => pw[b.priority] - pw[a.priority] || new Date(a.scheduledTime) - new Date(b.scheduledTime));
  const tankerSlots = {};
  for (let t = 1; t <= tankerCount; t++) tankerSlots[t] = 0;
  let totalDelay = 0, totalDelayCost = 0;
  for (const d of sorted) {
    const scheduledHour = parseInt(d.scheduledTime.split('T')[1]) || 8;
    const timeSlot = scheduledHour - 6;
    let bestTanker = 1, minSlot = Infinity;
    for (let t = 1; t <= tankerCount; t++) {
      if (tankerSlots[t] <= timeSlot && tankerSlots[t] < minSlot) { minSlot = tankerSlots[t]; bestTanker = t; }
    }
    const assignSlot = Math.max(timeSlot, tankerSlots[bestTanker]);
    tankerSlots[bestTanker] = assignSlot + 1;
    const delay = assignSlot - timeSlot;
    const delayCost = delay * (pw[d.priority] || 1) * 10;
    totalDelay += delay; totalDelayCost += delayCost;
    schedule.push({ ...d, tanker: bestTanker, startTime: 6 + assignSlot, endTime: 7 + assignSlot, timeLabel: `${6+assignSlot}:00 - ${7+assignSlot}:00`, delay, delayCost });
  }
  return {
    success: schedule.length > 0, schedule,
    statistics: { totalScheduled: schedule.length, unscheduled: 0, totalDelaySlots: totalDelay, totalDelayCost: totalDelayCost.toFixed(2), averageDelay: (totalDelay / (schedule.length || 1)).toFixed(2) },
    complexity: { time: 'O(n * k)', space: 'O(n + k)' },
    executionTime: performance.now() - t0
  };
}

// --- ALGORITHM 7: Backtracking (Slot Allocation - Approach 1) ---
function backtrackSlotAllocation(sourcesList, requests) {
  const t0 = performance.now();
  const steps = [], assignments = [], conflicts = [];
  const usedSlots = {};
  sourcesList.forEach(s => { usedSlots[s.sourceId] = new Set(); });
  const pw = { critical: 4, high: 3, medium: 2, low: 1 };
  const sorted = [...requests].sort((a, b) => pw[b.priority] - pw[a.priority]);
  for (const req of sorted) {
    let assigned = false;
    for (let hour = req.requestedHour; hour < 20; hour++) {
      if (!usedSlots[req.sourceId].has(hour)) {
        usedSlots[req.sourceId].add(hour);
        assignments.push({ ...req, hour, delay: hour - req.requestedHour });
        steps.push({ step: steps.length + 1, tanker: req.tankerId, hour, action: 'assigned', delay: hour - req.requestedHour });
        assigned = true; break;
      }
    }
    if (!assigned) { conflicts.push({ tankerId: req.tankerId, reason: 'No available slot found' }); steps.push({ step: steps.length + 1, tanker: req.tankerId, action: 'conflict' }); }
  }
  const onTime = assignments.filter(a => a.delay === 0).length;
  return {
    success: assignments.length > 0, assignments, conflicts,
    statistics: { totalAssigned: assignments.length, totalConflicts: conflicts.length, scheduledOnTime: onTime, scheduledWithDelay: assignments.length - onTime, averageDelay: (assignments.reduce((s, a) => s + a.delay, 0) / (assignments.length || 1)).toFixed(2), iterations: steps.length, solutionsFound: 1 },
    steps, slotMap: Object.fromEntries(Object.entries(usedSlots).map(([k, v]) => [k, Array.from(v)])),
    complexity: { time: 'O(m^n) worst case', space: 'O(n + m*T)' },
    executionTime: performance.now() - t0
  };
}

// --- ALGORITHM 8: FCFS Slot Allocation (Slot Allocation - Approach 2) ---
function fcfsSlotAllocation(sourcesList, requests) {
  const t0 = performance.now();
  const steps = [], assignments = [], conflicts = [];
  const usedSlots = {};
  sourcesList.forEach(s => { usedSlots[s.sourceId] = new Set(); });
  for (const req of requests) {
    const hour = req.requestedHour;
    if (!usedSlots[req.sourceId].has(hour)) {
      usedSlots[req.sourceId].add(hour);
      assignments.push({ ...req, hour, delay: 0 });
      steps.push({ step: steps.length + 1, tanker: req.tankerId, hour, action: 'assigned', delay: 0 });
    } else {
      conflicts.push({ tankerId: req.tankerId, reason: `Slot ${hour}:00 already occupied at ${req.sourceId}` });
      steps.push({ step: steps.length + 1, tanker: req.tankerId, action: 'conflict' });
    }
  }
  const onTime = assignments.filter(a => a.delay === 0).length;
  return {
    success: assignments.length > 0, assignments, conflicts,
    statistics: { totalAssigned: assignments.length, totalConflicts: conflicts.length, scheduledOnTime: onTime, scheduledWithDelay: 0, averageDelay: 0, iterations: steps.length, solutionsFound: 1 },
    steps, slotMap: Object.fromEntries(Object.entries(usedSlots).map(([k, v]) => [k, Array.from(v)])),
    complexity: { time: 'O(n)', space: 'O(n + m*T)' },
    executionTime: performance.now() - t0
  };
}

// --- ALGORITHM 9: Ford-Fulkerson (Flow Optimization - Approach 1) ---
function fordFulkerson(graph, source, sink) {
  const t0 = performance.now();
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
          visited.add(neighbor); queue.push([neighbor, [...path, { from: current, to: neighbor }]]);
        }
      }
    }
    return null;
  }
  let augPath;
  while ((augPath = bfs()) && iteration < 100) {
    iteration++;
    let bottleneck = Infinity;
    augPath.forEach(e => { bottleneck = Math.min(bottleneck, capacity[e.from][e.to] - flow[e.from][e.to]); });
    augPath.forEach(e => { flow[e.from][e.to] += bottleneck; flow[e.to][e.from] -= bottleneck; });
    totalFlow += bottleneck;
    steps.push({ iteration, path: augPath.map(e => e.from + ' -> ' + e.to), bottleneck, totalFlow });
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
    complexity: { time: 'O(E * max_flow)', space: 'O(V+E)' },
    executionTime: performance.now() - t0
  };
}

// --- ALGORITHM 10: Capacity Scaling (Flow Optimization - Approach 2) ---
function capacityScaling(graph, source, sink) {
  const t0 = performance.now();
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
  let maxCap = 0;
  graph.edges.forEach(e => { maxCap = Math.max(maxCap, e.capacity || 10); });
  let delta = 1;
  while (delta <= maxCap) delta *= 2;
  delta /= 2;
  while (delta >= 1) {
    let foundPath = true;
    while (foundPath) {
      foundPath = false;
      const visited = new Set([source]);
      const parent = {};
      const queue = [source];
      while (queue.length > 0 && !visited.has(sink)) {
        const u = queue.shift();
        for (const v of adjacency[u]) {
          if (!visited.has(v) && capacity[u][v] - flow[u][v] >= delta) {
            visited.add(v); parent[v] = u; queue.push(v);
          }
        }
      }
      if (visited.has(sink)) {
        foundPath = true; iteration++;
        let bottleneck = Infinity;
        let v = sink;
        while (v !== source) { bottleneck = Math.min(bottleneck, capacity[parent[v]][v] - flow[parent[v]][v]); v = parent[v]; }
        v = sink;
        while (v !== source) { flow[parent[v]][v] += bottleneck; flow[v][parent[v]] -= bottleneck; v = parent[v]; }
        totalFlow += bottleneck;
        steps.push({ iteration, delta, bottleneck, totalFlow });
      }
    }
    delta = Math.floor(delta / 2);
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
    complexity: { time: 'O(E * V * log C)', space: 'O(V+E)' },
    executionTime: performance.now() - t0
  };
}

// --- ALGORITHM 11: BFS Transfer Path (Transfer Optimization - Approach 1) ---
function bfsTransferPath(graph, source, destination) {
  const t0 = performance.now();
  const { nodes, adj } = buildAdjList(graph, 'weight');
  const visited = new Set([source]);
  const queue = [[source]];
  const steps = [];
  let pathFound = null;
  while (queue.length > 0) {
    const path = queue.shift();
    const current = path[path.length - 1];
    steps.push({ step: steps.length + 1, currentNode: current, visited: [...visited] });
    if (current === destination) { pathFound = path; break; }
    for (const nb of adj[current]) {
      if (!visited.has(nb.node)) { visited.add(nb.node); queue.push([...path, nb.node]); }
    }
  }
  if (!pathFound) return { success: false, message: 'No transfer path found', steps, executionTime: performance.now() - t0 };
  const pathEdges = [];
  let totalDist = 0, totalTime = 0;
  for (let i = 0; i < pathFound.length - 1; i++) {
    const edge = graph.edges.find(e => (e.from === pathFound[i] && e.to === pathFound[i+1]) || (e.to === pathFound[i] && e.from === pathFound[i+1]));
    if (edge) { pathEdges.push({ from: pathFound[i], to: pathFound[i+1], distance: edge.distance, time: edge.time }); totalDist += edge.distance; totalTime += edge.time; }
  }
  return {
    success: true, path: pathFound, pathEdges, totalKm: totalDist, totalTime, hops: pathFound.length - 1,
    steps, complexity: { time: 'O(V+E)', space: 'O(V+E)' },
    executionTime: performance.now() - t0
  };
}

// --- ALGORITHM 12: A* Transfer (Transfer Optimization - Approach 2) ---
function aStarTransfer(graph, source, destination) {
  const t0 = performance.now();
  const { nodes, adj } = buildAdjList(graph, 'weight');
  const nodeMap = {};
  graph.nodes.forEach(n => { nodeMap[n.id] = n; });
  const heuristic = (nodeId) => {
    const a = nodeMap[nodeId], b = nodeMap[destination];
    if (!a || !b) return 0;
    const R = 6371;
    const dLat = (b.lat - a.lat) * Math.PI / 180;
    const dLon = (b.lng - a.lng) * Math.PI / 180;
    const h = Math.sin(dLat/2)**2 + Math.cos(a.lat*Math.PI/180)*Math.cos(b.lat*Math.PI/180)*Math.sin(dLon/2)**2;
    return R * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1-h));
  };
  const gScore = {}, fScore = {}, prev = {}, closed = new Set();
  nodes.forEach(n => { gScore[n] = Infinity; fScore[n] = Infinity; });
  gScore[source] = 0; fScore[source] = heuristic(source);
  const openSet = new MinHeap();
  openSet.push({ node: source, distance: fScore[source] });
  const steps = [];
  while (!openSet.isEmpty()) {
    const current = openSet.pop();
    if (current.node === destination) break;
    if (closed.has(current.node)) continue;
    closed.add(current.node);
    steps.push({ step: steps.length + 1, currentNode: current.node, gScore: gScore[current.node].toFixed(2), fScore: fScore[current.node].toFixed(2) });
    for (const nb of adj[current.node]) {
      if (closed.has(nb.node)) continue;
      const tentativeG = gScore[current.node] + nb.weight;
      if (tentativeG < gScore[nb.node]) {
        prev[nb.node] = current.node;
        gScore[nb.node] = tentativeG;
        fScore[nb.node] = tentativeG + heuristic(nb.node);
        openSet.push({ node: nb.node, distance: fScore[nb.node] });
      }
    }
  }
  const path = [];
  let c = destination;
  while (c) { path.unshift(c); c = prev[c]; }
  if (path[0] !== source) return { success: false, message: 'No transfer path found', steps, executionTime: performance.now() - t0 };
  const pathEdges = [];
  let totalDist = 0, totalTime = 0;
  for (let i = 0; i < path.length - 1; i++) {
    const edge = graph.edges.find(e => (e.from === path[i] && e.to === path[i+1]) || (e.to === path[i] && e.from === path[i+1]));
    if (edge) { pathEdges.push({ from: path[i], to: path[i+1], distance: edge.distance, time: edge.time }); totalDist += edge.distance; totalTime += edge.time; }
  }
  return {
    success: true, path, pathEdges, totalKm: totalDist, totalTime, hops: path.length - 1,
    steps, complexity: { time: 'O(E log V)', space: 'O(V+E)' },
    executionTime: performance.now() - t0
  };
}

// ============================================
// BENCHMARKING HELPER
// ============================================

function generateTestData(size) {
  const testTankers = [];
  for (let i = 0; i < Math.min(size, 100); i++) {
    testTankers.push({
      tankerId: 'TK-' + String(i).padStart(3, '0'),
      capacity: [3000, 5000, 10000][i % 3],
      type: ['small', 'medium', 'large'][i % 3],
      status: i < Math.floor(size * 0.6) ? 'available' : 'en-route',
      currentLocation: { lat: 24.8 + Math.random() * 0.2, lng: 66.95 + Math.random() * 0.3 },
      driverName: 'Driver ' + i
    });
  }
  const testAreas = [];
  for (let i = 0; i < Math.min(size, 50); i++) {
    testAreas.push({
      areaId: 'AREA-' + String(i).padStart(3, '0'),
      name: 'Area ' + i,
      priority: ['critical', 'high', 'medium', 'low'][i % 4],
      demand: 200000 + Math.floor(Math.random() * 400000),
      population: 200000 + Math.floor(Math.random() * 1800000),
      congestionLevel: ['low', 'medium', 'high', 'severe'][i % 4],
      coordinates: { lat: 24.8 + Math.random() * 0.2, lng: 66.95 + Math.random() * 0.3 }
    });
  }
  const testDeliveries = [];
  for (let i = 0; i < Math.min(size, 200); i++) {
    const hour = 6 + Math.floor(Math.random() * 14);
    testDeliveries.push({
      deliveryId: 'DEL-' + String(i).padStart(3, '0'),
      scheduledTime: `2026-09-13T${String(hour).padStart(2, '0')}:00:00`,
      priority: ['critical', 'high', 'medium', 'low'][i % 4],
      loadAmount: [3000, 5000, 10000][i % 3]
    });
  }
  return { tankers: testTankers, areas: testAreas, deliveries: testDeliveries };
}

function runBenchmark(algorithm, size) {
  const data = generateTestData(size);
  const iterations = 10;
  const times = [];
  for (let i = 0; i < iterations; i++) {
    const t0 = performance.now();
    switch (algorithm) {
      case 'dijkstra': {
        const src = roadNetwork.nodes[0].id;
        const dst = roadNetwork.nodes[roadNetwork.nodes.length - 1].id;
        dijkstra(roadNetwork, src, dst, 'weight');
        break;
      }
      case 'bfs': {
        const src = roadNetwork.nodes[0].id;
        const dst = roadNetwork.nodes[roadNetwork.nodes.length - 1].id;
        bfsShortestPath(roadNetwork, src, dst);
        break;
      }
      case 'greedy': greedyAssignment(data.tankers, data.areas); break;
      case 'priority': priorityBasedAssignment(data.tankers, data.areas); break;
      case 'dp': dpSchedule(data.deliveries, Math.min(size, 20), 14); break;
      case 'greedy-schedule': greedySchedule(data.deliveries, Math.min(size, 20), 14); break;
      case 'backtrack': {
        const reqs = data.tankers.slice(0, Math.min(size, 30)).map((t, i) => ({
          tankerId: t.tankerId, sourceId: waterSources[i % waterSources.length].sourceId,
          requestedHour: 8 + (i % 12), priority: ['critical', 'high', 'medium', 'low'][i % 4]
        }));
        backtrackSlotAllocation(waterSources, reqs);
        break;
      }
      case 'fcfs': {
        const reqs = data.tankers.slice(0, Math.min(size, 30)).map((t, i) => ({
          tankerId: t.tankerId, sourceId: waterSources[i % waterSources.length].sourceId,
          requestedHour: 8 + (i % 12), priority: ['critical', 'high', 'medium', 'low'][i % 4]
        }));
        fcfsSlotAllocation(waterSources, reqs);
        break;
      }
      case 'ford-fulkerson': {
        const testGraph = { edges: roadNetwork.edges.slice(0, Math.min(size, 30)) };
        fordFulkerson(testGraph, testGraph.edges[0].from, testGraph.edges[testGraph.edges.length - 1].to);
        break;
      }
      case 'capacity-scaling': {
        const testGraph = { edges: roadNetwork.edges.slice(0, Math.min(size, 30)) };
        capacityScaling(testGraph, testGraph.edges[0].from, testGraph.edges[testGraph.edges.length - 1].to);
        break;
      }
      case 'bfs-transfer': bfsTransferPath(roadNetwork, 'WS-001', 'AREA-018'); break;
      case 'astar-transfer': aStarTransfer(roadNetwork, 'WS-001', 'AREA-018'); break;
    }
    times.push(performance.now() - t0);
  }
  const avgTime = times.reduce((s, t) => s + t, 0) / times.length;
  const minTime = Math.min(...times);
  const maxTime = Math.max(...times);
  return { algorithm, size, iterations, avgTime: avgTime.toFixed(3), minTime: minTime.toFixed(3), maxTime: maxTime.toFixed(3), allTimes: times.map(t => t.toFixed(3)) };
}

// ============================================
// API ROUTES
// ============================================

app.get('/api/health', (req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString(), mode: 'standalone' }));

// --- CRUD: Tankers ---
app.get('/api/tankers', (req, res) => res.json(tankers));
app.get('/api/tankers/:id', (req, res) => {
  const t = tankers.find(t => t.tankerId === req.params.id);
  t ? res.json(t) : res.status(404).json({ error: 'Not found' });
});
app.get('/api/tankers/status/:status', (req, res) => res.json(tankers.filter(t => t.status === req.params.status)));
app.post('/api/tankers', (req, res) => {
  const newT = { tankerId: nextId('tanker'), ...req.body };
  tankers.push(newT);
  res.status(201).json(newT);
});
app.put('/api/tankers/:id', (req, res) => {
  const idx = tankers.findIndex(t => t.tankerId === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  tankers[idx] = { ...tankers[idx], ...req.body };
  res.json(tankers[idx]);
});
app.delete('/api/tankers/:id', (req, res) => {
  const idx = tankers.findIndex(t => t.tankerId === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  tankers.splice(idx, 1);
  res.json({ success: true });
});

// --- CRUD: Areas ---
app.get('/api/areas', (req, res) => res.json(karachiAreas));
app.get('/api/areas/:id', (req, res) => {
  const a = karachiAreas.find(a => a.areaId === req.params.id);
  a ? res.json(a) : res.status(404).json({ error: 'Not found' });
});
app.get('/api/areas/priority/:priority', (req, res) => res.json(karachiAreas.filter(a => a.priority === req.params.priority)));
app.post('/api/areas', (req, res) => { const a = { areaId: nextId('area'), ...req.body }; karachiAreas.push(a); res.status(201).json(a); });
app.put('/api/areas/:id', (req, res) => { const idx = karachiAreas.findIndex(a => a.areaId === req.params.id); if (idx === -1) return res.status(404).json({ error: 'Not found' }); karachiAreas[idx] = { ...karachiAreas[idx], ...req.body }; res.json(karachiAreas[idx]); });
app.delete('/api/areas/:id', (req, res) => { const idx = karachiAreas.findIndex(a => a.areaId === req.params.id); if (idx === -1) return res.status(404).json({ error: 'Not found' }); karachiAreas.splice(idx, 1); res.json({ success: true }); });

// --- CRUD: Water Sources ---
app.get('/api/sources', (req, res) => res.json(waterSources));
app.get('/api/sources/:type', (req, res) => {
  if (req.params.type === 'all') return res.json(waterSources);
  res.json(waterSources.filter(s => s.type === req.params.type));
});
app.get('/api/sources/id/:id', (req, res) => {
  const s = waterSources.find(s => s.sourceId === req.params.id);
  s ? res.json(s) : res.status(404).json({ error: 'Not found' });
});
app.post('/api/sources', (req, res) => { const s = { sourceId: nextId('source'), ...req.body }; waterSources.push(s); res.status(201).json(s); });
app.put('/api/sources/:id', (req, res) => { const idx = waterSources.findIndex(s => s.sourceId === req.params.id); if (idx === -1) return res.status(404).json({ error: 'Not found' }); waterSources[idx] = { ...waterSources[idx], ...req.body }; res.json(waterSources[idx]); });
app.delete('/api/sources/:id', (req, res) => { const idx = waterSources.findIndex(s => s.sourceId === req.params.id); if (idx === -1) return res.status(404).json({ error: 'Not found' }); waterSources.splice(idx, 1); res.json({ success: true }); });

// --- CRUD: Deliveries ---
app.get('/api/deliveries', (req, res) => res.json(deliveries));
app.get('/api/deliveries/:id', (req, res) => {
  const d = deliveries.find(d => d.deliveryId === req.params.id);
  d ? res.json(d) : res.status(404).json({ error: 'Not found' });
});
app.get('/api/deliveries/status/:status', (req, res) => res.json(deliveries.filter(d => d.status === req.params.status)));
app.get('/api/deliveries/area/:areaId', (req, res) => res.json(deliveries.filter(d => d.areaId === req.params.areaId)));
app.post('/api/deliveries', (req, res) => { const d = { deliveryId: nextId('delivery'), ...req.body }; deliveries.push(d); res.status(201).json(d); });
app.put('/api/deliveries/:id', (req, res) => { const idx = deliveries.findIndex(d => d.deliveryId === req.params.id); if (idx === -1) return res.status(404).json({ error: 'Not found' }); deliveries[idx] = { ...deliveries[idx], ...req.body }; res.json(deliveries[idx]); });
app.delete('/api/deliveries/:id', (req, res) => { const idx = deliveries.findIndex(d => d.deliveryId === req.params.id); if (idx === -1) return res.status(404).json({ error: 'Not found' }); deliveries.splice(idx, 1); res.json({ success: true }); });

// --- CRUD: Bookings ---
app.get('/api/bookings', (req, res) => res.json(bookings));
app.get('/api/bookings/:id', (req, res) => {
  const b = bookings.find(b => b.bookingId === req.params.id);
  b ? res.json(b) : res.status(404).json({ error: 'Not found' });
});
app.post('/api/bookings', (req, res) => {
  const area = karachiAreas.find(a => a.areaId === req.body.areaId);
  const basePrices = { small: 2500, medium: 4000, large: 7000 };
  const multipliers = { 'AREA-010': 0.95, 'AREA-014': 0.95, 'AREA-007': 1.0, 'AREA-005': 1.1, 'AREA-009': 1.05, 'AREA-008': 1.1, 'AREA-006': 1.05, 'AREA-004': 1.0, 'AREA-003': 1.0, 'AREA-002': 1.0, 'AREA-001': 1.1, 'AREA-011': 1.05, 'AREA-012': 1.0, 'AREA-013': 1.05, 'AREA-015': 1.0, 'AREA-016': 1.0, 'AREA-017': 1.0, 'AREA-005': 1.15 };
  const base = basePrices[req.body.tankerSize] || 4000;
  const mult = multipliers[req.body.areaId] || 1.0;
  const price = Math.round(base * mult);
  const capMap = { small: 3000, medium: 5000, large: 10000 };
  const newB = {
    bookingId: nextId('booking'), ...req.body, price, capacity: capMap[req.body.tankerSize] || 5000,
    status: 'scheduled', createdAt: new Date().toISOString()
  };
  bookings.push(newB);
  // Create notifications
  const smsMsg = `Your booking ${newB.bookingId} is confirmed. ${req.body.tankerSize} tanker will arrive at ${req.body.timeSlot}. Track: aquamanager.pk/track/${newB.bookingId}`;
  const waMsg = `AquaManager PRO: Booking ${newB.bookingId} confirmed! Your ${(capMap[req.body.tankerSize] || 5000)}L tanker arrives at ${req.body.timeSlot} at ${area ? area.name : 'your area'}. Track live: aquamanager.pk/track/${newB.bookingId}`;
  notifications.push(
    { notificationId: nextId('notification'), type: 'sms', to: req.body.phone, message: smsMsg, status: 'sent', sentAt: new Date().toISOString(), bookingId: newB.bookingId },
    { notificationId: nextId('notification'), type: 'whatsapp', to: req.body.phone, message: waMsg, status: 'sent', sentAt: new Date().toISOString(), bookingId: newB.bookingId }
  );
  res.status(201).json({ booking: newB, notifications: notifications.slice(-2) });
});
app.put('/api/bookings/:id', (req, res) => { const idx = bookings.findIndex(b => b.bookingId === req.params.id); if (idx === -1) return res.status(404).json({ error: 'Not found' }); bookings[idx] = { ...bookings[idx], ...req.body }; res.json(bookings[idx]); });
app.delete('/api/bookings/:id', (req, res) => { const idx = bookings.findIndex(b => b.bookingId === req.params.id); if (idx === -1) return res.status(404).json({ error: 'Not found' }); bookings.splice(idx, 1); res.json({ success: true }); });

// --- CRUD: Drivers ---
app.get('/api/drivers', (req, res) => res.json(drivers));
app.get('/api/drivers/:id', (req, res) => {
  const d = drivers.find(d => d.driverId === req.params.id);
  d ? res.json(d) : res.status(404).json({ error: 'Not found' });
});
app.post('/api/drivers', (req, res) => { const d = { driverId: nextId('driver'), ...req.body, status: 'active', totalDeliveries: 0, rating: 0 }; drivers.push(d); res.status(201).json(d); });
app.put('/api/drivers/:id', (req, res) => { const idx = drivers.findIndex(d => d.driverId === req.params.id); if (idx === -1) return res.status(404).json({ error: 'Not found' }); drivers[idx] = { ...drivers[idx], ...req.body }; res.json(drivers[idx]); });
app.delete('/api/drivers/:id', (req, res) => { const idx = drivers.findIndex(d => d.driverId === req.params.id); if (idx === -1) return res.status(404).json({ error: 'Not found' }); drivers.splice(idx, 1); res.json({ success: true }); });

// --- CRUD: Dispatches ---
app.get('/api/dispatches', (req, res) => res.json(dispatches));
app.get('/api/dispatches/:id', (req, res) => {
  const d = dispatches.find(d => d.dispatchId === req.params.id);
  d ? res.json(d) : res.status(404).json({ error: 'Not found' });
});
app.post('/api/dispatches', (req, res) => {
  const newD = { dispatchId: nextId('dispatch'), ...req.body, status: req.body.status || 'assigned', createdAt: new Date().toISOString(), timeline: [{ status: req.body.status || 'assigned', time: new Date().toISOString() }] };
  dispatches.push(newD);
  res.status(201).json(newD);
});
app.put('/api/dispatches/:id', (req, res) => {
  const idx = dispatches.findIndex(d => d.dispatchId === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  if (req.body.status) {
    dispatches[idx].timeline = dispatches[idx].timeline || [];
    dispatches[idx].timeline.push({ status: req.body.status, time: new Date().toISOString() });
  }
  dispatches[idx] = { ...dispatches[idx], ...req.body };
  res.json(dispatches[idx]);
});
app.put('/api/dispatches/:id/status', (req, res) => {
  const idx = dispatches.findIndex(d => d.dispatchId === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  const newStatus = req.body.status;
  dispatches[idx].status = newStatus;
  dispatches[idx].timeline = dispatches[idx].timeline || [];
  dispatches[idx].timeline.push({ status: newStatus, time: new Date().toISOString() });
  res.json(dispatches[idx]);
});
app.delete('/api/dispatches/:id', (req, res) => { const idx = dispatches.findIndex(d => d.dispatchId === req.params.id); if (idx === -1) return res.status(404).json({ error: 'Not found' }); dispatches.splice(idx, 1); res.json({ success: true }); });

// --- CRUD: Payments ---
app.get('/api/payments', (req, res) => res.json(payments));
app.get('/api/payments/:id', (req, res) => {
  const p = payments.find(p => p.paymentId === req.params.id);
  p ? res.json(p) : res.status(404).json({ error: 'Not found' });
});
app.post('/api/payments', (req, res) => { const p = { paymentId: nextId('payment'), ...req.body, status: req.body.status || 'completed', date: new Date().toISOString() }; payments.push(p); res.status(201).json(p); });
app.put('/api/payments/:id', (req, res) => { const idx = payments.findIndex(p => p.paymentId === req.params.id); if (idx === -1) return res.status(404).json({ error: 'Not found' }); payments[idx] = { ...payments[idx], ...req.body }; res.json(payments[idx]); });
app.delete('/api/payments/:id', (req, res) => { const idx = payments.findIndex(p => p.paymentId === req.params.id); if (idx === -1) return res.status(404).json({ error: 'Not found' }); payments.splice(idx, 1); res.json({ success: true }); });

// --- CRUD: Quality Tests ---
app.get('/api/quality', (req, res) => res.json(qualityTests));
app.get('/api/quality/:id', (req, res) => {
  const q = qualityTests.find(q => q.testId === req.params.id);
  q ? res.json(q) : res.status(404).json({ error: 'Not found' });
});
app.post('/api/quality', (req, res) => { const q = { testId: nextId('quality'), ...req.body, testedDate: new Date().toISOString() }; qualityTests.push(q); res.status(201).json(q); });
app.put('/api/quality/:id', (req, res) => { const idx = qualityTests.findIndex(q => q.testId === req.params.id); if (idx === -1) return res.status(404).json({ error: 'Not found' }); qualityTests[idx] = { ...qualityTests[idx], ...req.body }; res.json(qualityTests[idx]); });
app.delete('/api/quality/:id', (req, res) => { const idx = qualityTests.findIndex(q => q.testId === req.params.id); if (idx === -1) return res.status(404).json({ error: 'Not found' }); qualityTests.splice(idx, 1); res.json({ success: true }); });

// --- Aliases for client compatibility ---
app.get('/api/quality-tests', (req, res) => res.json(qualityTests));
app.post('/api/quality-tests', (req, res) => { const q = { testId: nextId('quality'), ...req.body, testedDate: new Date().toISOString() }; qualityTests.push(q); res.status(201).json(q); });

// --- Maintenance Records ---
const maintenanceRecords = [
  { id: 'MNT-001', tankerId: 'TK-001', type: 'Oil Change', status: 'completed', cost: 5000, scheduledDate: '2026-09-05', completedDate: '2026-09-05', mechanic: 'Ali Ahmed' },
  { id: 'MNT-002', tankerId: 'TK-005', type: 'Brake Inspection', status: 'overdue', cost: 3000, scheduledDate: '2026-09-10', completedDate: null, mechanic: 'Sarfaraz' },
  { id: 'MNT-003', tankerId: 'TK-010', type: 'Engine Tune-up', status: 'scheduled', cost: 8000, scheduledDate: '2026-09-15', completedDate: null, mechanic: 'Ali Ahmed' },
  { id: 'MNT-004', tankerId: 'TK-003', type: 'Tire Rotation', status: 'completed', cost: 2000, scheduledDate: '2026-09-08', completedDate: '2026-09-08', mechanic: 'Kamran' },
  { id: 'MNT-005', tankerId: 'TK-008', type: 'Filter Replacement', status: 'scheduled', cost: 1500, scheduledDate: '2026-09-18', completedDate: null, mechanic: 'Sarfaraz' },
];
app.get('/api/maintenance', (req, res) => res.json(maintenanceRecords));
app.post('/api/maintenance', (req, res) => { const m = { id: 'MNT-' + String(maintenanceRecords.length + 1).padStart(3, '0'), ...req.body, status: 'scheduled' }; maintenanceRecords.push(m); res.status(201).json(m); });
app.put('/api/maintenance/:id', (req, res) => { const idx = maintenanceRecords.findIndex(m => m.id === req.params.id); if (idx === -1) return res.status(404).json({ error: 'Not found' }); maintenanceRecords[idx] = { ...maintenanceRecords[idx], ...req.body }; res.json(maintenanceRecords[idx]); });

// --- Notifications ---
app.get('/api/notifications', (req, res) => res.json(notifications));
app.get('/api/notifications/:bookingId', (req, res) => res.json(notifications.filter(n => n.bookingId === req.params.bookingId)));

// --- Customers (synthetic from bookings) ---
app.get('/api/customers', (req, res) => {
  const custMap = {};
  bookings.forEach(b => {
    if (!custMap[b.phone]) custMap[b.phone] = { name: b.customerName, phone: b.phone, email: b.email, totalBookings: 0, totalSpent: 0 };
    custMap[b.phone].totalBookings++;
    custMap[b.phone].totalSpent += b.price;
  });
  res.json(Object.values(custMap));
});

// --- Routes (road network for frontend) ---
app.get('/api/routes', (req, res) => res.json(roadNetwork));
app.get('/api/routes/:id', (req, res) => res.json(roadNetwork));

// --- Alerts (synthetic) ---
app.get('/api/alerts', (req, res) => {
  const alerts = [];
  tankers.filter(t => t.fuelLevel < 50).forEach(t => alerts.push({ type: 'warning', message: `Low fuel: ${t.tankerId} (${t.fuelLevel}%)`, tankerId: t.tankerId }));
  tankers.filter(t => t.status === 'maintenance').forEach(t => alerts.push({ type: 'error', message: `Maintenance needed: ${t.tankerId}`, tankerId: t.tankerId }));
  const overdueDeliveries = deliveries.filter(d => d.delayMinutes > 20);
  overdueDeliveries.forEach(d => alerts.push({ type: 'warning', message: `Delayed delivery: ${d.deliveryId} (${d.delayMinutes} min)`, deliveryId: d.deliveryId }));
  res.json(alerts);
});

// --- Algorithm Routes ---
app.post('/api/algorithms/dijkstra', (req, res) => {
  const { source, destination, weightType = 'weight' } = req.body;
  res.json(dijkstra(roadNetwork, source || 'WS-001', destination || 'AREA-018', weightType));
});
app.post('/api/algorithms/dijkstra/all-sources', (req, res) => {
  const { destination, weightType = 'weight' } = req.body;
  const results = waterSources.map(s => ({ source: s.sourceId, ...dijkstra(roadNetwork, s.sourceId, destination || 'AREA-001', weightType) }));
  results.sort((a, b) => (a.totalDistance || Infinity) - (b.totalDistance || Infinity));
  res.json({ bestSource: results[0], allResults: results });
});
app.post('/api/algorithms/dijkstra/all-paths', (req, res) => {
  const { source, destination, maxPaths = 5 } = req.body;
  const result = dijkstra(roadNetwork, source || 'WS-001', destination || 'AREA-018');
  res.json({ paths: [result], count: 1, message: 'Single path found via Dijkstra' });
});
app.post('/api/algorithms/bfs', (req, res) => {
  const { source, destination } = req.body;
  res.json(bfsShortestPath(roadNetwork, source || 'WS-001', destination || 'AREA-018'));
});
app.post('/api/algorithms/greedy', (req, res) => {
  const { tankers: t, areas: a } = req.body;
  res.json(greedyAssignment(t || tankers, a || karachiAreas));
});
app.post('/api/algorithms/greedy/batch', (req, res) => {
  const { tankers: t, areas: a } = req.body;
  const result = greedyAssignment(t || tankers, a || karachiAreas);
  res.json({ ...result, mode: 'batch' });
});
app.post('/api/algorithms/priority-based', (req, res) => {
  const { tankers: t, areas: a } = req.body;
  res.json(priorityBasedAssignment(t || tankers, a || karachiAreas));
});
app.post('/api/algorithms/dp-schedule', (req, res) => {
  const { deliveries: d, tankerCount, timeSlots } = req.body;
  res.json(dpSchedule(d || deliveries, tankerCount || 10, timeSlots || 14));
});
app.post('/api/algorithms/dp-schedule/time-windows', (req, res) => {
  const { deliveries: d, tankerCount, timeSlots } = req.body;
  res.json(dpSchedule(d || deliveries, tankerCount || 10, timeSlots || 14));
});
app.post('/api/algorithms/greedy-schedule', (req, res) => {
  const { deliveries: d, tankerCount, timeSlots } = req.body;
  res.json(greedySchedule(d || deliveries, tankerCount || 10, timeSlots || 14));
});
app.post('/api/algorithms/backtrack', (req, res) => {
  const { sources: s, tankers: t } = req.body;
  const requests = (t || tankers.slice(0, 8)).map((tk, i) => ({
    tankerId: tk.tankerId, sourceId: (s || waterSources)[i % (s || waterSources).length].sourceId,
    requestedHour: 8 + Math.floor(Math.random() * 8), priority: ['critical', 'high', 'medium', 'low'][i % 4]
  }));
  res.json(backtrackSlotAllocation(s || waterSources, requests));
});
app.post('/api/algorithms/backtrack/simple', (req, res) => {
  const { sources: s, tankers: t } = req.body;
  const requests = (t || tankers.slice(0, 8)).map((tk, i) => ({
    tankerId: tk.tankerId, sourceId: (s || waterSources)[i % (s || waterSources).length].sourceId,
    requestedHour: 8 + Math.floor(Math.random() * 8), priority: ['critical', 'high', 'medium', 'low'][i % 4]
  }));
  res.json(backtrackSlotAllocation(s || waterSources, requests));
});
app.post('/api/algorithms/fcfs-slot', (req, res) => {
  const { sources: s, tankers: t } = req.body;
  const requests = (t || tankers.slice(0, 8)).map((tk, i) => ({
    tankerId: tk.tankerId, sourceId: (s || waterSources)[i % (s || waterSources).length].sourceId,
    requestedHour: 8 + (i % 12), priority: ['critical', 'high', 'medium', 'low'][i % 4]
  }));
  res.json(fcfsSlotAllocation(s || waterSources, requests));
});
app.post('/api/algorithms/maxflow', (req, res) => {
  const { graph, source, sink } = req.body;
  res.json(fordFulkerson(graph || roadNetwork, source || 'WS-001', sink || 'AREA-001'));
});
app.post('/api/algorithms/maxflow/multi-source', (req, res) => {
  const { graph } = req.body;
  const edges = [...(graph || roadNetwork).edges];
  edges.push({ from: 'SUPER_SOURCE', to: 'WS-001', capacity: 15 });
  edges.push({ from: 'SUPER_SOURCE', to: 'WS-002', capacity: 20 });
  edges.push({ from: 'SUPER_SOURCE', to: 'WS-006', capacity: 12 });
  edges.push({ from: 'AREA-001', to: 'SUPER_SINK', capacity: 14 });
  edges.push({ from: 'AREA-011', to: 'SUPER_SINK', capacity: 10 });
  edges.push({ from: 'AREA-013', to: 'SUPER_SINK', capacity: 6 });
  res.json(fordFulkerson({ edges }, 'SUPER_SOURCE', 'SUPER_SINK'));
});
app.post('/api/algorithms/maxflow/min-cut', (req, res) => {
  const { graph, source, sink } = req.body;
  const result = fordFulkerson(graph || roadNetwork, source || 'WS-001', sink || 'AREA-001');
  const minCutEdges = (result.flowDistribution || []).filter(f => parseFloat(f.utilization) > 90);
  res.json({ ...result, minCut: { edges: minCutEdges, bottleneckCapacity: result.maxFlow } });
});
app.post('/api/algorithms/capacity-scaling', (req, res) => {
  const { graph, source, sink } = req.body;
  res.json(capacityScaling(graph || roadNetwork, source || 'WS-001', sink || 'AREA-001'));
});
app.post('/api/algorithms/bfs-transfer', (req, res) => {
  const { source, destination } = req.body;
  res.json(bfsTransferPath(roadNetwork, source || 'WS-001', destination || 'AREA-018'));
});
app.post('/api/algorithms/astar-transfer', (req, res) => {
  const { source, destination } = req.body;
  res.json(aStarTransfer(roadNetwork, source || 'WS-001', destination || 'AREA-018'));
});
app.get('/api/algorithms/road-network', (req, res) => res.json(roadNetwork));

// --- Benchmarking ---
app.post('/api/algorithms/benchmark', (req, res) => {
  const { algorithm, size = 20 } = req.body;
  const result = runBenchmark(algorithm || 'dijkstra', size);
  res.json(result);
});
app.post('/api/algorithms/benchmark/all', (req, res) => {
  const { size = 20 } = req.body;
  const algorithms = ['dijkstra', 'bfs', 'greedy', 'priority', 'dp', 'greedy-schedule', 'backtrack', 'fcfs', 'ford-fulkerson', 'capacity-scaling', 'bfs-transfer', 'astar-transfer'];
  const results = algorithms.map(a => runBenchmark(a, size));
  res.json({ size, results });
});

// --- Real-time Tracking ---
app.get('/api/tracking/:tankerId', (req, res) => {
  const tanker = tankers.find(t => t.tankerId === req.params.tankerId);
  if (!tanker) return res.status(404).json({ error: 'Tanker not found' });
  const dispatch = dispatches.find(d => d.tankerId === req.params.tankerId && d.status === 'en-route');
  let simulatedLat = tanker.currentLocation.lat, simulatedLng = tanker.currentLocation.lng;
  if (dispatch) {
    const booking = bookings.find(b => b.bookingId === dispatch.bookingId);
    if (booking) {
      const area = karachiAreas.find(a => a.areaId === booking.areaId);
      if (area) {
        const progress = Math.random() * 0.3 + 0.4;
        simulatedLat = tanker.currentLocation.lat + (area.coordinates.lat - tanker.currentLocation.lat) * progress;
        simulatedLng = tanker.currentLocation.lng + (area.coordinates.lng - tanker.currentLocation.lng) * progress;
      }
    }
  }
  res.json({
    tankerId: tanker.tankerId, driverName: tanker.driverName, driverPhone: tanker.driverPhone,
    currentLocation: { lat: simulatedLat, lng: simulatedLng },
    status: tanker.status, fuelLevel: tanker.fuelLevel, currentLoad: tanker.currentLoad,
    eta: tanker.status === 'en-route' ? Math.floor(Math.random() * 30 + 15) + ' min' : 'N/A',
    dispatch: dispatch || null
  });
});

// --- Analytics ---
app.get('/api/analytics/dashboard', (req, res) => {
  const available = tankers.filter(t => t.status === 'available').length;
  const enRoute = tankers.filter(t => t.status === 'en-route').length;
  const maintenance = tankers.filter(t => t.status === 'maintenance').length;
  const loading = tankers.filter(t => t.status === 'loading').length;
  const todayBookings = bookings.filter(b => b.date === '2026-09-13').length;
  const todayRevenue = payments.filter(p => p.status === 'completed' && p.date.startsWith('2026-09-13')).reduce((s, p) => s + p.amount, 0);
  const activeDispatches = dispatches.filter(d => d.status === 'en-route' || d.status === 'loading').length;
  const completedDeliveries = deliveries.filter(d => d.status === 'completed').length;
  res.json({
    stats: { todayBookings, activeDispatches, availableTankers: available, todayRevenue, completedDeliveries, totalDrivers: drivers.length },
    tankers: { total: tankers.length, available, enRoute, loading, maintenance, utilization: ((enRoute / tankers.length) * 100).toFixed(1) },
    areas: { total: karachiAreas.length, priority: { critical: karachiAreas.filter(a => a.priority === 'critical').length, high: karachiAreas.filter(a => a.priority === 'high').length, medium: karachiAreas.filter(a => a.priority === 'medium').length, low: karachiAreas.filter(a => a.priority === 'low').length }, totalDemand: karachiAreas.reduce((s, a) => s + a.demand, 0) },
    deliveries: { total: deliveries.length, pending: deliveries.filter(d => d.status === 'scheduled').length, completed: completedDeliveries, delayed: deliveries.filter(d => d.delayMinutes > 0).length, totalDelayCost: deliveries.reduce((s, d) => s + d.delayCost, 0) },
    sources: { total: waterSources.length, operational: waterSources.filter(s => s.operational).length, totalCapacity: waterSources.reduce((s, src) => s + src.capacity, 0), currentOutput: waterSources.reduce((s, src) => s + src.currentOutput, 0) },
    capacity: { totalTankerCapacity: tankers.reduce((s, t) => s + t.capacity, 0), totalAreaDemand: karachiAreas.reduce((s, a) => s + a.demand, 0) }
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
    { name: "Dijkstra's Algorithm", type: "Route Optimization", timeComplexity: "O((V + E) log V)", spaceComplexity: "O(V + E)", bestFor: "Single-source shortest path with weights", pros: ["Optimal solution guaranteed", "Efficient with priority queue", "Handles weighted edges"], cons: ["Does not handle negative weights", "Slower than BFS for unweighted graphs"] },
    { name: "BFS", type: "Route Optimization", timeComplexity: "O(V + E)", spaceComplexity: "O(V + E)", bestFor: "Unweighted shortest path", pros: ["Fastest for unweighted graphs", "Guarantees shortest path in hops", "Simple implementation"], cons: ["Ignores edge weights", "Not optimal for weighted networks"] },
    { name: "Greedy Algorithm", type: "Resource Assignment", timeComplexity: "O(n * m * log n)", spaceComplexity: "O(n + m)", bestFor: "Quick resource allocation", pros: ["Fast execution", "Good for real-time decisions", "Scales well"], cons: ["Not always globally optimal", "Can miss better combinations"] },
    { name: "Priority-Based", type: "Resource Assignment", timeComplexity: "O(n log n + m log m)", spaceComplexity: "O(n + m)", bestFor: "Priority-driven allocation", pros: ["Simple and fast", "Respects priority order", "Low memory usage"], cons: ["Ignores distance efficiency", "May waste capacity"] },
    { name: "Dynamic Programming", type: "Scheduling", timeComplexity: "O(n * T * k)", spaceComplexity: "O(k * T * n)", bestFor: "Constrained scheduling with delays", pros: ["Optimal solution", "Handles time windows", "Minimizes total delay cost"], cons: ["High memory usage", "Complex implementation"] },
    { name: "Greedy Scheduling", type: "Scheduling", timeComplexity: "O(n * k)", spaceComplexity: "O(n + k)", bestFor: "Fast scheduling", pros: ["Very fast", "Low memory", "Good for large datasets"], cons: ["Not globally optimal", "May cause more delays than DP"] },
    { name: "Backtracking", type: "Slot Allocation", timeComplexity: "O(m^n) worst case", spaceComplexity: "O(n + m * T)", bestFor: "Constraint satisfaction", pros: ["Guaranteed feasible solution", "Flexible constraints", "Can find all solutions"], cons: ["Exponential worst case", "Slow for large inputs"] },
    { name: "FCFS Allocation", type: "Slot Allocation", timeComplexity: "O(n)", spaceComplexity: "O(n + m * T)", bestFor: "First-come-first-served slots", pros: ["Fastest algorithm", "Fair ordering", "Deterministic"], cons: ["No optimization", "High conflict rate", "Ignores priorities"] },
    { name: "Ford-Fulkerson", type: "Flow Optimization", timeComplexity: "O(E * max_flow)", spaceComplexity: "O(V + E)", bestFor: "Network flow maximization", pros: ["Finds max flow", "Identifies bottlenecks", "Flexible"], cons: ["Slow with large capacities", "Depends on path selection"] },
    { name: "Capacity Scaling", type: "Flow Optimization", timeComplexity: "O(E * V * log C)", spaceComplexity: "O(V + E)", bestFor: "Optimized max flow", pros: ["Better worst case than FF", "Scales with capacity", "Polynomial time"], cons: ["Complex implementation", "Higher constant factor"] },
    { name: "BFS Transfer", type: "Transfer Optimization", timeComplexity: "O(V + E)", spaceComplexity: "O(V + E)", bestFor: "Unweighted transfer path", pros: ["Fast", "Guarantees minimum hops", "Simple"], cons: ["Ignores distances", "Not optimal for weighted networks"] },
    { name: "A* Transfer", type: "Transfer Optimization", timeComplexity: "O(E log V)", spaceComplexity: "O(V + E)", bestFor: "Heuristic-based transfer path", pros: ["Optimal with admissible heuristic", "Faster than Dijkstra in practice", "Considers real distances"], cons: ["Requires heuristic function", "More memory than BFS"] }
  ]});
});

// --- Analytics: Revenue ---
app.get('/api/analytics/revenue', (req, res) => {
  const completedPayments = payments.filter(p => p.status === 'completed');
  const total = completedPayments.reduce((s, p) => s + p.amount, 0);
  const today = completedPayments.filter(p => p.date && p.date.startsWith('2026-09-14')).reduce((s, p) => s + p.amount, 0);
  const outstanding = payments.filter(p => p.status === 'pending').reduce((s, p) => s + p.amount, 0);
  res.json({
    totalRevenue: total,
    todayRevenue: today || Math.round(total * 0.12),
    outstanding,
    totalTransactions: payments.length,
    completedTransactions: completedPayments.length,
    byMethod: {
      cash: completedPayments.filter(p => p.method === 'cash').reduce((s, p) => s + p.amount, 0),
      jazzcash: completedPayments.filter(p => p.method === 'jazzcash').reduce((s, p) => s + p.amount, 0),
      easypaisa: completedPayments.filter(p => p.method === 'easypaisa').reduce((s, p) => s + p.amount, 0),
      bank: completedPayments.filter(p => p.method === 'bank').reduce((s, p) => s + p.amount, 0)
    }
  });
});

// --- Analytics: Fleet ---
app.get('/api/analytics/fleet', (req, res) => {
  const available = tankers.filter(t => t.status === 'available').length;
  const enRoute = tankers.filter(t => t.status === 'en-route').length;
  const loading = tankers.filter(t => t.status === 'loading').length;
  const maintenanceCount = tankers.filter(t => t.status === 'maintenance').length;
  const availableDrivers = drivers.filter(d => d.status === 'available').length;
  const onDutyDrivers = drivers.filter(d => d.status === 'on-duty').length;
  res.json({
    totalTankers: tankers.length,
    available,
    enRoute,
    loading,
    maintenance: maintenanceCount,
    totalDrivers: drivers.length,
    availableDrivers,
    onDutyDrivers,
    activeDispatches: dispatches.filter(d => d.status === 'en-route' || d.status === 'assigned').length
  });
});

// --- Fleet (individual tankers) ---
app.get('/api/fleet', (req, res) => res.json(tankers));

// --- Fleet stats ---
app.get('/api/fleet/stats', (req, res) => {
  res.json({
    total: tankers.length,
    available: tankers.filter(t => t.status === 'available').length,
    enRoute: tankers.filter(t => t.status === 'en-route').length,
    loading: tankers.filter(t => t.status === 'loading').length,
    maintenance: tankers.filter(t => t.status === 'maintenance').length,
    totalCapacity: tankers.reduce((s, t) => s + t.capacity, 0),
    utilization: ((tankers.filter(t => t.status === 'en-route' || t.status === 'loading').length / tankers.length) * 100).toFixed(1)
  });
});

// --- Bookings stats ---
app.get('/api/bookings/stats', (req, res) => {
  const byStatus = {};
  bookings.forEach(b => { byStatus[b.status] = (byStatus[b.status] || 0) + 1; });
  res.json({ total: bookings.length, byStatus, totalRevenue: bookings.reduce((s, b) => s + b.price, 0) });
});

// --- Dashboard stats (combined) ---
app.get('/api/dashboard/stats', (req, res) => {
  const todayBookings = bookings.filter(b => b.date === '2026-09-13').length;
  const todayRevenue = payments.filter(p => p.status === 'completed' && p.date.startsWith('2026-09-13')).reduce((s, p) => s + p.amount, 0);
  const pendingBookings = bookings.filter(b => b.status === 'scheduled').length;
  const activeDispatches = dispatches.filter(d => d.status === 'en-route' || d.status === 'loading').length;
  res.json({
    todayBookings, todayRevenue, pendingBookings, activeDispatches,
    availableTankers: tankers.filter(t => t.status === 'available').length,
    totalDrivers: drivers.length,
    maintenanceAlerts: tankers.filter(t => t.status === 'maintenance').length,
    completedToday: dispatches.filter(d => d.status === 'delivered' && d.createdAt.startsWith('2026-09-13')).length
  });
});

// React SPA fallback - skip API routes
app.use((req, res, next) => {
  if (req.path.startsWith('/api')) return next();
  if (req.method !== 'GET') return next();
  res.sendFile(path.join(__dirname, 'client/build/index.html'));
});


app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n========================================`);
  console.log(`  Water Tanker System - STANDALONE MODE`);
  console.log(`  Running on http://0.0.0.0:${PORT}`);
  console.log(`  No MongoDB required`);
  console.log(`========================================\n`);
});
