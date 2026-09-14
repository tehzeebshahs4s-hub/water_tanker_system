import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import { useTheme } from '../context/ThemeContext';
import L from 'leaflet';

const API_BASE = '/api';

const sourceIcon = new L.DivIcon({
  html: '<div style="background:#22c55e;width:24px;height:24px;border-radius:50%;border:3px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3)"></div>',
  className: '', iconSize: [24, 24], iconAnchor: [12, 12]
});

const areaIcon = new L.DivIcon({
  html: '<div style="background:#3b82f6;width:24px;height:24px;border-radius:50%;border:3px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3)"></div>',
  className: '', iconSize: [24, 24], iconAnchor: [12, 12]
});

function MapUpdater({ center }) {
  const map = useMap();
  useEffect(() => { if (center) map.setView(center, 12); }, [center, map]);
  return null;
}

function RouteOptimizer() {
  const { colors, themeName } = useTheme();
  const t = colors;
  const th = themeName === 'dark'
    ? { bg: '#031220', card: '#0d2536', border: 'rgba(34,211,238,0.12)', text: '#e6f2f8', muted: '#94a3b8', dim: '#64748b', cyan: '#22d3ee', teal: '#06b6d4', green: '#10b981', red: '#ef4444', amber: '#f59e0b', purple: '#a78bfa', inputBg: '#031220' }
    : { bg: '#f0f4f8', card: '#ffffff', border: 'rgba(15,23,41,0.08)', text: '#0f1729', muted: '#64748b', dim: '#94a3b8', cyan: '#0891b2', teal: '#0e7490', green: '#059669', red: '#dc2626', amber: '#d97706', purple: '#7c3aed', inputBg: '#ffffff' };

  const [network, setNetwork] = useState(null);
  const [sources, setSources] = useState([]);
  const [areas, setAreas] = useState([]);
  const [selectedSource, setSelectedSource] = useState('');
  const [selectedArea, setSelectedArea] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mapCenter, setMapCenter] = useState([24.8607, 67.0011]);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [networkRes, sourcesRes, areasRes] = await Promise.all([
        fetch(`${API_BASE}/algorithms/road-network`),
        fetch(`${API_BASE}/sources`),
        fetch(`${API_BASE}/areas`)
      ]);
      const [networkData, sourcesData, areasData] = await Promise.all([
        networkRes.json(), sourcesRes.json(), areasRes.json()
      ]);
      setNetwork(networkData);
      setSources(sourcesData);
      setAreas(areasData);
    } catch (err) { console.error('Error fetching data:', err); }
  };

  const runDijkstra = async () => {
    if (!selectedSource || !selectedArea) { alert('Please select both source and destination'); return; }
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/algorithms/dijkstra`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ source: selectedSource, destination: selectedArea, weightType: 'weight' })
      });
      const data = await response.json();
      setResult(data);
      if (data.success && data.path.length > 0) {
        const lastNode = network.nodes.find(n => n.id === data.path[data.path.length - 1]);
        if (lastNode) setMapCenter([lastNode.lat, lastNode.lng]);
      }
    } catch (err) { console.error('Error running Dijkstra:', err); }
    setLoading(false);
  };

  const getNodeById = (id) => network?.nodes.find(n => n.id === id);

  const getEdgeCoordinates = () => {
    if (!result?.pathEdges || !network) return [];
    return result.pathEdges.map(edge => {
      const fromNode = getNodeById(edge.from);
      const toNode = getNodeById(edge.to);
      if (fromNode && toNode) return [[fromNode.lat, fromNode.lng], [toNode.lat, toNode.lng]];
      return null;
    }).filter(Boolean);
  };

  const s = {
    input: { width: '100%', padding: '10px 12px', borderRadius: 8, border: `1px solid ${th.border}`, background: th.inputBg, color: th.text, fontSize: '0.85rem', outline: 'none', boxSizing: 'border-box' },
    label: { display: 'block', fontSize: '0.78rem', fontWeight: 600, color: th.muted, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.5px' },
  };

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: th.text }}>Route Optimizer</h1>
        <p style={{ color: th.muted, fontSize: '0.85rem', marginTop: 4 }}>Dijkstra's Algorithm for Shortest Path</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 20 }}>
        <div>
          <div style={{ background: th.card, border: `1px solid ${th.border}`, borderRadius: 16, padding: 24, marginBottom: 16 }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: th.text, marginBottom: 16 }}>Route Selection</h3>
            <div style={{ marginBottom: 12 }}>
              <label style={s.label}>Water Source</label>
              <select value={selectedSource} onChange={(e) => setSelectedSource(e.target.value)} style={s.input}>
                <option value="">Select Source</option>
                {sources.map(source => <option key={source.sourceId} value={source.sourceId}>{source.name}</option>)}
              </select>
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={s.label}>Destination Area</label>
              <select value={selectedArea} onChange={(e) => setSelectedArea(e.target.value)} style={s.input}>
                <option value="">Select Area</option>
                {areas.map(area => <option key={area.areaId} value={area.areaId}>{area.name}</option>)}
              </select>
            </div>
            <button onClick={runDijkstra} disabled={loading || !selectedSource || !selectedArea} style={{
              width: '100%', padding: '10px', borderRadius: 8, border: 'none',
              background: `linear-gradient(135deg, ${th.teal}, ${th.cyan})`, color: '#fff',
              fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', opacity: loading ? 0.6 : 1
            }}>
              {loading ? 'Calculating...' : 'Find Shortest Route'}
            </button>
          </div>

          {result && (
            <div style={{ background: th.card, border: `1px solid ${th.border}`, borderRadius: 16, padding: 24, marginBottom: 16 }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: th.text, marginBottom: 12 }}>Result</h3>
              {result.success ? (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: '0.85rem' }}>
                    <span style={{ color: th.muted }}>Total Distance:</span>
                    <span style={{ fontWeight: 600, color: th.text }}>{result.totalKm?.toFixed(1)} km</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: '0.85rem' }}>
                    <span style={{ color: th.muted }}>Estimated Time:</span>
                    <span style={{ fontWeight: 600, color: th.text }}>{result.totalTime} min</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12, fontSize: '0.85rem' }}>
                    <span style={{ color: th.muted }}>Path Nodes:</span>
                    <span style={{ fontWeight: 600, color: th.text }}>{result.path?.length}</span>
                  </div>
                  <div style={{ marginTop: 12 }}>
                    <p style={{ fontSize: '0.8rem', fontWeight: 600, color: th.text, marginBottom: 8 }}>Route Path:</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, alignItems: 'center' }}>
                      {result.path?.map((node, idx) => (
                        <React.Fragment key={idx}>
                          <span style={{ padding: '4px 8px', background: `${th.cyan}20`, color: th.cyan, borderRadius: 6, fontSize: '0.72rem', fontWeight: 600 }}>{node}</span>
                          {idx < result.path.length - 1 && <span style={{ color: th.dim }}>→</span>}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                  <div style={{ marginTop: 12, padding: 10, borderRadius: 8, background: `${th.cyan}08`, border: `1px solid ${th.cyan}15` }}>
                    <p style={{ fontSize: '0.72rem', color: th.muted }}><strong>Complexity:</strong> {result.complexity?.time}</p>
                    <p style={{ fontSize: '0.72rem', color: th.muted }}><strong>Execution Time:</strong> {result.executionTime?.toFixed(2)} ms</p>
                  </div>
                </div>
              ) : <p style={{ color: th.red }}>{result.message}</p>}
            </div>
          )}

          {result?.steps && (
            <div style={{ background: th.card, border: `1px solid ${th.border}`, borderRadius: 16, padding: 24 }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: th.text, marginBottom: 12 }}>Algorithm Steps</h3>
              <div style={{ maxHeight: 250, overflow: 'auto' }}>
                {result.steps.slice(0, 20).map((step, idx) => (
                  <div key={idx} style={{ fontSize: '0.72rem', padding: '6px 8px', borderRadius: 6, background: `${th.cyan}08`, marginBottom: 4, color: th.text }}>
                    <strong>Step {step.step}:</strong> Visited {step.currentNode}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div style={{ background: th.card, border: `1px solid ${th.border}`, borderRadius: 16, overflow: 'hidden', height: 600 }}>
          <MapContainer center={[24.8607, 67.0011]} zoom={11} style={{ height: '100%', width: '100%' }}>
            <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <MapUpdater center={mapCenter} />
            {sources.map(source => (
              <Marker key={source.sourceId} position={[source.location.lat, source.location.lng]} icon={sourceIcon}>
                <Popup><div><p style={{ fontWeight: 700 }}>{source.name}</p><p style={{ fontSize: '0.8rem', color: '#666' }}>Type: {source.type} | Capacity: {source.capacity.toLocaleString()} L</p></div></Popup>
              </Marker>
            ))}
            {areas.map(area => (
              <Marker key={area.areaId} position={[area.coordinates.lat, area.coordinates.lng]} icon={areaIcon}>
                <Popup><div><p style={{ fontWeight: 700 }}>{area.name}</p><p style={{ fontSize: '0.8rem', color: '#666' }}>Town: {area.town} | Demand: {area.demand.toLocaleString()} L</p></div></Popup>
              </Marker>
            ))}
            {result?.success && getEdgeCoordinates().map((coords, idx) => (
              <Polyline key={idx} positions={coords} color="#ef4444" weight={4} opacity={0.8} />
            ))}
          </MapContainer>
        </div>
      </div>
    </div>
  );
}

export default RouteOptimizer;
