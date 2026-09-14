const axios = require('axios');

const API_BASE = '/api';

const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.response.use(
  response => response.data,
  error => {
    console.error('API Error:', error);
    throw error;
  }
);

export const tankerAPI = {
  getAll: () => api.get('/tankers'),
  getById: (id) => api.get(`/tankers/${id}`),
  create: (data) => api.post('/tankers', data),
  update: (id, data) => api.put(`/tankers/${id}`, data),
  delete: (id) => api.delete(`/tankers/${id}`),
  getByStatus: (status) => api.get(`/tankers/status/${status}`)
};

export const areaAPI = {
  getAll: () => api.get('/areas'),
  getById: (id) => api.get(`/areas/${id}`),
  create: (data) => api.post('/areas', data),
  update: (id, data) => api.put(`/areas/${id}`, data),
  delete: (id) => api.delete(`/areas/${id}`),
  getByPriority: (priority) => api.get(`/areas/priority/${priority}`)
};

export const deliveryAPI = {
  getAll: () => api.get('/deliveries'),
  getById: (id) => api.get(`/deliveries/${id}`),
  create: (data) => api.post('/deliveries', data),
  update: (id, data) => api.put(`/deliveries/${id}`, data),
  delete: (id) => api.delete(`/deliveries/${id}`),
  getByStatus: (status) => api.get(`/deliveries/status/${status}`),
  getByArea: (areaId) => api.get(`/deliveries/area/${areaId}`)
};

export const sourceAPI = {
  getAll: () => api.get('/sources'),
  getById: (id) => api.get(`/sources/${id}`),
  create: (data) => api.post('/sources', data),
  update: (id, data) => api.put(`/sources/${id}`, data),
  delete: (id) => api.delete(`/sources/${id}`),
  getByType: (type) => api.get(`/sources/type/${type}`)
};

export const algorithmAPI = {
  dijkstra: (data) => api.post('/algorithms/dijkstra', data),
  dijkstraAllSources: (data) => api.post('/algorithms/dijkstra/all-sources', data),
  dijkstraAllPaths: (data) => api.post('/algorithms/dijkstra/all-paths', data),
  greedy: (data) => api.post('/algorithms/greedy', data),
  greedyBatch: (data) => api.post('/algorithms/greedy/batch', data),
  dpSchedule: (data) => api.post('/algorithms/dp-schedule', data),
  dpScheduleTimeWindows: (data) => api.post('/algorithms/dp-schedule/time-windows', data),
  backtrack: (data) => api.post('/algorithms/backtrack', data),
  backtrackSimple: (data) => api.post('/algorithms/backtrack/simple', data),
  maxFlow: (data) => api.post('/algorithms/maxflow', data),
  maxFlowMultiSource: (data) => api.post('/algorithms/maxflow/multi-source', data),
  minCut: (data) => api.post('/algorithms/maxflow/min-cut', data),
  getRoadNetwork: () => api.get('/algorithms/road-network')
};

export const analyticsAPI = {
  getDashboard: () => api.get('/analytics/dashboard'),
  getPerformance: () => api.get('/analytics/performance'),
  getAlgorithmComparison: () => api.get('/analytics/algorithm-comparison')
};

export default api;
