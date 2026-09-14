# Water Tanker Distribution Optimization System for Karachi

## DAA Semester Project

A comprehensive water tanker distribution optimization system implementing 5 different algorithms for Karachi's water supply management.

### Live URL

**https://water.33.jugaar.ai**

### Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@aqua.com | admin123 |
| Dispatcher | dispatcher@aqua.com | dispatch123 |
| Driver | driver@aqua.com | driver123 |
| Customer | customer@aqua.com | customer123 |

### Algorithms Implemented

1. **Dijkstra's Algorithm** - Route optimization for tanker navigation
2. **Greedy Algorithm** - Resource assignment for tanker-area allocation
3. **Dynamic Programming** - Delivery scheduling optimization
4. **Backtracking** - Slot allocation conflict resolution
5. **Ford-Fulkerson (Max Flow)** - Water distribution flow optimization

### Tech Stack

- **Frontend:** React.js, Tailwind CSS, Leaflet.js, Chart.js, Framer Motion
- **Backend:** Node.js, Express.js (In-memory data store)
- **Deployment:** Caddy (auto-HTTPS), PM2, Nginx
- **Algorithms:** Pure JavaScript implementations

### Features

- **4 Role-Based Dashboards** - Admin, Dispatcher, Driver, Customer (each with unique UI)
- **Interactive Dashboard** with real-time statistics
- **Route Optimizer** with map visualization
- **Resource Assignment** with greedy algorithm
- **Delivery Scheduler** with DP optimization
- **Slot Allocator** with backtracking for contention resolution
- **Flow Optimizer** with max flow visualization
- **Analytics Dashboard** with charts and algorithm comparisons
- **Dark/Light Theme Toggle** across all pages
- **35+ REST API Endpoints**
- **Responsive Design**

### API Endpoints

#### Bookings
- `GET /api/bookings` - List all bookings
- `POST /api/bookings` - Create booking
- `PUT /api/bookings/:id` - Update booking
- `DELETE /api/bookings/:id` - Delete booking

#### Fleet
- `GET /api/fleet` - List all tankers
- `GET /api/fleet/stats` - Fleet statistics

#### Drivers
- `GET /api/drivers` - List all drivers
- `POST /api/drivers` - Add driver
- `PUT /api/drivers/:id` - Update driver
- `DELETE /api/drivers/:id` - Remove driver

#### Quality
- `GET /api/quality` - Water quality tests
- `POST /api/quality-tests` - Submit test results

#### Payments
- `GET /api/payments` - Payment records

#### Algorithms
- `POST /api/algorithms/dijkstra` - Run Dijkstra's algorithm
- `POST /api/algorithms/greedy` - Run Greedy assignment
- `POST /api/algorithms/dp-schedule` - Run DP scheduler
- `POST /api/algorithms/backtrack` - Run Backtracking slot allocation
- `POST /api/algorithms/maxflow` - Run Ford-Fulkerson max flow
- `POST /api/algorithms/bfs` - BFS traversal
- `POST /api/algorithms/priority-based` - Priority-based scheduling
- `POST /api/algorithms/fcfs-slot` - FCFS slot allocation
- `POST /api/algorithms/capacity-scaling` - Capacity scaling flow
- `POST /api/algorithms/bfs-transfer` - BFS transfer optimizer
- `POST /api/algorithms/astar-transfer` - A* transfer optimizer
- `POST /api/analytics/benchmark` - Algorithm benchmarking

#### Analytics
- `GET /api/dashboard/stats` - Dashboard statistics
- `GET /api/analytics/algorithm-comparison` - Algorithm comparison
- `GET /api/analytics/revenue` - Revenue analytics
- `GET /api/analytics/fleet` - Fleet analytics

### Algorithm Complexity Analysis

| Algorithm | Time Complexity | Space Complexity | Best For |
|-----------|-----------------|------------------|----------|
| Dijkstra | O((V + E) log V) | O(V + E) | Shortest path routing |
| Greedy | O(n * m * log n) | O(n + m) | Quick resource assignment |
| DP Schedule | O(n * T * k) | O(k * T * n) | Delivery scheduling |
| Backtracking | O(m^n) worst | O(n + m * T) | Constraint satisfaction |
| Ford-Fulkerson | O(E * max_flow) | O(V + E) | Network flow distribution |

### DAA Project Components

This project fulfills the following DAA requirements:

1. **Resource Assignment** - Greedy algorithm for tanker allocation
2. **Scheduling Under Constraints** - DP for delivery scheduling
3. **Contention/Slot Allocation** - Backtracking for hydrant access
4. **Network Route Optimization** - Dijkstra for path finding
5. **Flow Optimization** - Ford-Fulkerson for water distribution

### License

This project is for educational purposes as part of DAA course requirements.
