const mongoose = require('mongoose');
const Tanker = require('./models/Tanker');
const Area = require('./models/Area');
const Delivery = require('./models/Delivery');
const WaterSource = require('./models/WaterSource');
const Slot = require('./models/Slot');

const karachiAreas = require('../data/karachiAreas.json');
const waterSourcesData = require('../data/waterSources.json');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/water-tanker-system';

const tankers = [
  { tankerId: "TK-001", capacity: 10000, type: "large", currentLocation: { lat: 24.8500, lng: 67.1500 }, driverName: "Ahmed Khan", driverPhone: "0300-1234567" },
  { tankerId: "TK-002", capacity: 5000, type: "medium", currentLocation: { lat: 24.9200, lng: 67.0650 }, driverName: "Muhammad Ali", driverPhone: "0301-2345678" },
  { tankerId: "TK-003", capacity: 3000, type: "small", currentLocation: { lat: 24.8700, lng: 67.1050 }, driverName: "Hassan Raza", driverPhone: "0302-3456789" },
  { tankerId: "TK-004", capacity: 10000, type: "large", currentLocation: { lat: 24.8050, lng: 67.0350 }, driverName: "Imran Shah", driverPhone: "0303-4567890" },
  { tankerId: "TK-005", capacity: 5000, type: "medium", currentLocation: { lat: 24.8650, lng: 67.1950 }, driverName: "Usman Malik", driverPhone: "0304-5678901" },
  { tankerId: "TK-006", capacity: 5000, type: "medium", currentLocation: { lat: 24.8550, lng: 67.0100 }, driverName: "Bilal Ahmed", driverPhone: "0305-6789012" },
  { tankerId: "TK-007", capacity: 3000, type: "small", currentLocation: { lat: 24.8900, lng: 67.1250 }, driverName: "Farooq Sindhi", driverPhone: "0306-7890123" },
  { tankerId: "TK-008", capacity: 10000, type: "large", currentLocation: { lat: 24.9250, lng: 67.0000 }, driverName: "Tariq Baloch", driverPhone: "0307-8901234" },
  { tankerId: "TK-009", capacity: 5000, type: "medium", currentLocation: { lat: 24.9350, lng: 66.9950 }, driverName: "Zubair Pathan", driverPhone: "0308-9012345" },
  { tankerId: "TK-010", capacity: 3000, type: "small", currentLocation: { lat: 24.9500, lng: 67.0350 }, driverName: "Kamran Sheikh", driverPhone: "0309-0123456" },
  { tankerId: "TK-011", capacity: 10000, type: "large", currentLocation: { lat: 24.8500, lng: 67.1500 }, driverName: "Naeem Gujjar", driverPhone: "0310-1234567" },
  { tankerId: "TK-012", capacity: 5000, type: "medium", currentLocation: { lat: 24.9200, lng: 67.0650 }, driverName: "Rashid Memon", driverPhone: "0311-2345678" },
  { tankerId: "TK-013", capacity: 5000, type: "medium", currentLocation: { lat: 24.8700, lng: 67.1050 }, driverName: "Shahid Jatt", driverPhone: "0312-3456789" },
  { tankerId: "TK-014", capacity: 3000, type: "small", currentLocation: { lat: 24.8050, lng: 67.0350 }, driverName: "Waseem Abro", driverPhone: "0313-4567890" },
  { tankerId: "TK-015", capacity: 10000, type: "large", currentLocation: { lat: 24.8650, lng: 67.1950 }, driverName: "Javed Khosa", driverPhone: "0314-5678901" },
  { tankerId: "TK-016", capacity: 5000, type: "medium", currentLocation: { lat: 24.8550, lng: 67.0100 }, driverName: "Asif Khanzada", driverPhone: "0315-6789012" },
  { tankerId: "TK-017", capacity: 3000, type: "small", currentLocation: { lat: 24.8900, lng: 67.1250 }, driverName: "Mansoor Dahri", driverPhone: "0316-7890123" },
  { tankerId: "TK-018", capacity: 10000, type: "large", currentLocation: { lat: 24.9250, lng: 67.0000 }, driverName: "Sarfraz Magsi", driverPhone: "0317-8901234" },
  { tankerId: "TK-019", capacity: 5000, type: "medium", currentLocation: { lat: 24.9350, lng: 66.9950 }, driverName: "Ghulam Murtaza", driverPhone: "0318-9012345" },
  { tankerId: "TK-020", capacity: 3000, type: "small", currentLocation: { lat: 24.9500, lng: 67.0350 }, driverName: "Qurban Buledi", driverPhone: "0319-0123456" },
  { tankerId: "TK-021", capacity: 10000, type: "large", currentLocation: { lat: 24.8500, lng: 67.1500 }, driverName: "Yar Muhammad", driverPhone: "0320-1234567" },
  { tankerId: "TK-022", capacity: 5000, type: "medium", currentLocation: { lat: 24.9200, lng: 67.0650 }, driverName: "Noor Muhammad", driverPhone: "0321-2345678" },
  { tankerId: "TK-023", capacity: 5000, type: "medium", currentLocation: { lat: 24.8700, lng: 67.1050 }, driverName: "Abdul Sattar", driverPhone: "0322-3456789" },
  { tankerId: "TK-024", capacity: 3000, type: "small", currentLocation: { lat: 24.8050, lng: 67.0350 }, driverName: "Mazeed Lehri", driverPhone: "0323-4567890" },
  { tankerId: "TK-025", capacity: 10000, type: "large", currentLocation: { lat: 24.8650, lng: 67.1950 }, driverName: "Bashir Shar", driverPhone: "0324-5678901" }
];

async function seedDatabase() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    await Tanker.deleteMany({});
    await Area.deleteMany({});
    await Delivery.deleteMany({});
    await WaterSource.deleteMany({});
    await Slot.deleteMany({});

    console.log('Cleared existing data');

    const createdAreas = await Area.insertMany(karachiAreas);
    console.log(`Created ${createdAreas.length} areas`);

    const createdSources = await WaterSource.insertMany(waterSourcesData);
    console.log(`Created ${createdSources.length} water sources`);

    const createdTankers = await Tanker.insertMany(tankers);
    console.log(`Created ${createdTankers.length} tankers`);

    const slots = [];
    for (const source of createdSources) {
      for (let hour = 6; hour < 20; hour++) {
        slots.push({
          slotId: `SLOT-${source.sourceId}-${hour}`,
          sourceId: source._id,
          startTime: new Date(2026, 0, 1, hour, 0),
          endTime: new Date(2026, 0, 1, hour + 1, 0),
          status: 'available'
        });
      }
    }
    await Slot.insertMany(slots);
    console.log(`Created ${slots.length} time slots`);

    const deliveries = [];
    const statuses = ['scheduled', 'completed', 'delayed', 'en-route'];
    for (let i = 0; i < 50; i++) {
      const tanker = createdTankers[Math.floor(Math.random() * createdTankers.length)];
      const area = createdAreas[Math.floor(Math.random() * createdAreas.length)];
      const source = createdSources[Math.floor(Math.random() * createdSources.length)];
      const hour = 6 + Math.floor(Math.random() * 12);
      deliveries.push({
        deliveryId: `DEL-${String(i + 1).padStart(3, '0')}`,
        tankerId: tanker._id,
        areaId: area._id,
        waterSourceId: source._id,
        scheduledTime: new Date(2026, 0, 1, hour, 0),
        timeWindow: {
          start: new Date(2026, 0, 1, hour, 0),
          end: new Date(2026, 0, 1, hour + 2, 0)
        },
        status: statuses[Math.floor(Math.random() * statuses.length)],
        loadAmount: tanker.capacity * (0.5 + Math.random() * 0.5),
        priority: ['critical', 'high', 'medium', 'low'][Math.floor(Math.random() * 4)],
        delayMinutes: Math.floor(Math.random() * 60),
        delayCost: Math.floor(Math.random() * 500)
      });
    }
    await Delivery.insertMany(deliveries);
    console.log(`Created ${deliveries.length} deliveries`);

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
}

seedDatabase();
