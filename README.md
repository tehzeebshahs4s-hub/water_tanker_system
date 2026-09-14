# Water Tanker Distribution Optimization System for Karachi

## DAA Semester Project

A comprehensive water tanker distribution optimization system implementing 5 different algorithms for Karachi's water supply management.

### Algorithms Implemented

1. **Dijkstra's Algorithm** - Route optimization for tanker navigation
2. **Greedy Algorithm** - Resource assignment for tanker-area allocation
3. **Dynamic Programming** - Delivery scheduling optimization
4. **Backtracking** - Slot allocation conflict resolution
5. **Ford-Fulkerson** - Maximum flow distribution optimization

### Tech Stack

- **Frontend:** React.js, Tailwind CSS, Leaflet.js, Chart.js
- **Backend:** Node.js, Express.js, MongoDB
- **Algorithms:** Pure JavaScript implementations

### Project Structure

```
water-tanker-system/
├── client/                  # React Frontend
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── pages/           # Dashboard pages
│   │   └── utils/           # API & helpers
│   └── public/
├── server/                  # Node.js Backend
│   ├── algorithms/          # Algorithm implementations
│   ├── models/              # MongoDB models
│   ├── routes/              # API routes
│   └── server.js            # Main server file
└── data/                    # Seed data
```

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (running locally or Atlas URI)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd water-tanker-system
```

2. Install dependencies:
```bash
# Install all dependencies
npm run install-all

# Or install separately
cd server && npm install
cd ../client && npm install
```

3. Configure environment:
```bash
# Server .env (already configured)
PORT=5000
MONGODB_URI=mongodb://localhost:27017/water-tanker-system
```

4. Start MongoDB:
```bash
mongod
```

5. Seed the database:
```bash
cd server
npm run seed
```

6. Start the application:
```bash
# From root directory
npm run dev

# Or start separately
# Terminal 1 - Server
cd server && npm run dev

# Terminal 2 - Client
cd client && npm start
```

7. Open browser:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

### API Endpoints

#### Tankers
- `GET /api/tankers` - List all tankers
- `POST /api/tankers` - Create tanker
- `PUT /api/tankers/:id` - Update tanker
- `DELETE /api/tankers/:id` - Delete tanker

#### Areas
- `GET /api/areas` - List all areas
- `POST /api/areas` - Create area

#### Deliveries
- `GET /api/deliveries` - List all deliveries
- `POST /api/deliveries` - Create delivery

#### Algorithms
- `POST /api/algorithms/dijkstra` - Run Dijkstra's algorithm
- `POST /api/algorithms/greedy` - Run Greedy assignment
- `POST /api/algorithms/dp-schedule` - Run DP scheduler
- `POST /api/algorithms/backtrack` - Run Backtracking
- `POST /api/algorithms/maxflow` - Run Ford-Fulkerson

#### Analytics
- `GET /api/analytics/dashboard` - Dashboard statistics
- `GET /api/analytics/performance` - Performance metrics
- `GET /api/analytics/algorithm-comparison` - Algorithm comparison

### Features

- **Interactive Dashboard** with real-time statistics
- **Route Optimizer** with map visualization
- **Resource Assignment** with greedy algorithm
- **Delivery Scheduler** with DP optimization
- **Slot Allocator** with backtracking
- **Flow Optimizer** with max flow visualization
- **Analytics Dashboard** with charts and comparisons

### Algorithm Complexity Analysis

| Algorithm | Time Complexity | Space Complexity | Best For |
|-----------|-----------------|------------------|----------|
| Dijkstra | O((V + E) log V) | O(V + E) | Shortest path |
| Greedy | O(n * m * log n) | O(n + m) | Quick assignment |
| DP | O(n * T * k) | O(k * T * n) | Scheduling |
| Backtracking | O(m^n) worst | O(n + m * T) | Constraint satisfaction |
| Ford-Fulkerson | O(E * max_flow) | O(V + E) | Network flow |

### Sample Data

The system comes pre-loaded with:
- 18 Karachi areas with real coordinates
- 10 water sources (treatment plants, dams, wells, hydrants)
- 25 tankers with different capacities
- 50 sample deliveries
- Road network graph with distances

### DAA Project Components

This project fulfills the following DAA requirements:

1. **Resource Assignment** - Greedy algorithm for tanker allocation
2. **Scheduling Under Constraints** - DP for delivery scheduling
3. **Contention/Slot Allocation** - Backtracking for hydrant access
4. **Network Route Optimization** - Dijkstra for path finding
5. **Flow Optimization** - Ford-Fulkerson for water distribution

### Contributors

- [Your Name] - Algorithm Implementation
- [Group Member 2] - Backend Development
- [Group Member 3] - Frontend Development
- [Group Member 4] - Testing & Documentation

### License

This project is for educational purposes as part of DAA course requirements.
