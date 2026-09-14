import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const API_BASE = '/api';

const AREAS = ['North Karachi', 'Surjani Town', 'Gulshan-e-Iqbal', 'Korangi', 'DHA Phase V', 'Landhi', 'Clifton', 'Malir', 'Saddar', 'SITE Area', 'Lyari', 'Baldia Town', 'Orangi Town', 'SITE Area West', 'North Nazimabad', 'Mominabad', 'Federal B Area', 'Manghopir'];
const TANKER_SIZES = [{ id: 'small', label: 'Small (3,000 L)', capacity: 3000, basePrice: 2500 }, { id: 'medium', label: 'Medium (5,000 L)', capacity: 5000, basePrice: 4000 }, { id: 'large', label: 'Large (10,000 L)', capacity: 10000, basePrice: 7000 }];
const TIME_SLOTS = ['06:00 AM - 08:00 AM', '08:00 AM - 10:00 AM', '10:00 AM - 12:00 PM', '12:00 PM - 02:00 PM', '02:00 PM - 04:00 PM', '04:00 PM - 06:00 PM', '06:00 PM - 08:00 PM'];
const AREA_DISTANCE_MULTIPLIER = { 'North Karachi': 1.0, 'Surjani Town': 1.05, 'Gulshan-e-Iqbal': 1.1, 'Korangi': 1.15, 'DHA Phase V': 1.4, 'Landhi': 1.2, 'Clifton': 1.35, 'Malir': 1.25, 'Saddar': 1.1, 'SITE Area': 0.95, 'Lyari': 1.05, 'Baldia Town': 1.1, 'Orangi Town': 1.0, 'SITE Area West': 1.0, 'North Nazimabad': 1.05, 'Mominabad': 1.0, 'Federal B Area': 1.1, 'Manghopir': 1.15 };

function BookingPage() {
  const navigate = useNavigate();
  const { colors, themeName } = useTheme();
  const t = colors;
  const th = themeName === 'dark'
    ? { bg: '#031220', card: '#0d2536', border: 'rgba(34,211,238,0.12)', text: '#e6f2f8', muted: '#94a3b8', dim: '#64748b', cyan: '#22d3ee', teal: '#06b6d4', green: '#10b981', red: '#ef4444', inputBg: '#031220' }
    : { bg: '#f0f4f8', card: '#ffffff', border: 'rgba(15,23,41,0.1)', text: '#0f1729', muted: '#64748b', dim: '#94a3b8', cyan: '#0891b2', teal: '#0e7490', green: '#059669', red: '#dc2626', inputBg: '#ffffff' };

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(null);
  const [form, setForm] = useState({ customerName: '', phone: '', email: '', area: '', tankerSize: '', deliveryDate: '', timeSlot: '', address: '', instructions: '' });

  const handleChange = (e) => { setForm({ ...form, [e.target.name]: e.target.value }); setError(''); };
  const calculatePrice = () => { if (!form.tankerSize || !form.area) return 0; const tanker = TANKER_SIZES.find(t => t.id === form.tankerSize); const multiplier = AREA_DISTANCE_MULTIPLIER[form.area] || 1; return Math.round(tanker.basePrice * multiplier); };
  const selectedTanker = TANKER_SIZES.find(t => t.id === form.tankerSize);
  const estimatedPrice = calculatePrice();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.customerName || !form.phone || !form.area || !form.tankerSize || !form.deliveryDate || !form.timeSlot || !form.address) { setError('Please fill all required fields'); return; }
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/bookings`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, areaId: form.area, date: form.deliveryDate, price: estimatedPrice, tankerCapacity: selectedTanker?.capacity }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Booking failed');
      setSuccess(data);
    } catch (err) { setError(err.message); } finally { setLoading(false); }
  };

  if (success) return (
    <div style={{ background: th.bg, minHeight: '100vh', padding: 32 }}>
      <div style={{ maxWidth: 600, margin: '0 auto' }}>
        <div style={{ background: th.card, border: `1px solid ${th.border}`, borderRadius: 16, padding: 40, textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: 16 }}>✅</div>
          <div style={{ fontSize: '1.3rem', fontWeight: 700, color: th.cyan, marginBottom: 8 }}>Booking Confirmed!</div>
          <p style={{ color: th.muted, marginBottom: 16 }}>Your water tanker has been booked successfully</p>
          <div><span style={{ fontSize: '0.75rem', color: th.muted }}>Booking ID</span><br /><span style={{ fontFamily: 'monospace', background: th.inputBg, padding: '6px 14px', borderRadius: 8, color: th.cyan, marginTop: 4, display: 'inline-block' }}>{success.id || success.bookingId || 'N/A'}</span></div>
          {estimatedPrice > 0 && <div style={{ marginTop: 16 }}><span style={{ fontSize: '0.75rem', color: th.muted }}>Total Amount</span><br /><span style={{ fontSize: '1.5rem', fontWeight: 700, color: th.cyan }}>PKR {estimatedPrice.toLocaleString()}</span></div>}
          <button onClick={() => navigate('/dashboard/bookings')} style={{ marginTop: 24, padding: '10px 24px', borderRadius: 8, border: 'none', background: `linear-gradient(135deg, ${th.teal}, ${th.cyan})`, color: '#fff', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}>View Bookings</button>
        </div>
      </div>
    </div>
  );

  const input = { width: '100%', padding: '10px 12px', borderRadius: 8, border: `1px solid ${th.border}`, background: th.inputBg, color: th.text, fontSize: '0.85rem', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' };
  const label = { display: 'block', fontSize: '0.75rem', fontWeight: 600, color: th.muted, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.5px' };

  return (
    <div style={{ background: th.bg, minHeight: '100vh', padding: 32 }}>
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: th.cyan }}>Book Water Tanker</h1>
          <p style={{ color: th.muted, fontSize: '0.85rem', marginTop: 4 }}>Schedule a water delivery to your location in Karachi</p>
        </div>

        {error && <div style={{ padding: 12, borderRadius: 8, background: `${th.red}15`, border: `1px solid ${th.red}30`, color: th.red, fontSize: '0.85rem', marginBottom: 16 }}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div style={{ background: th.card, border: `1px solid ${th.border}`, borderRadius: 16, padding: 24, marginBottom: 16 }}>
            <div style={{ fontSize: '0.95rem', fontWeight: 600, color: th.cyan, marginBottom: 16, paddingBottom: 12, borderBottom: `1px solid ${th.border}` }}>Customer Information</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div><label style={label}>Full Name *</label><input style={input} type="text" name="customerName" value={form.customerName} onChange={handleChange} placeholder="Enter your full name" /></div>
              <div><label style={label}>Phone Number *</label><input style={input} type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="03XX-XXXXXXX" /></div>
            </div>
            <div style={{ marginTop: 12 }}><label style={label}>Email (Optional)</label><input style={input} type="email" name="email" value={form.email} onChange={handleChange} placeholder="your@email.com" /></div>
          </div>

          <div style={{ background: th.card, border: `1px solid ${th.border}`, borderRadius: 16, padding: 24, marginBottom: 16 }}>
            <div style={{ fontSize: '0.95rem', fontWeight: 600, color: th.cyan, marginBottom: 16, paddingBottom: 12, borderBottom: `1px solid ${th.border}` }}>Delivery Details</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div><label style={label}>Area / Town *</label><select style={input} name="area" value={form.area} onChange={handleChange}><option value="">Select area</option>{AREAS.map(a => <option key={a} value={a}>{a}</option>)}</select></div>
              <div><label style={label}>Tanker Size *</label><select style={input} name="tankerSize" value={form.tankerSize} onChange={handleChange}><option value="">Select tanker</option>{TANKER_SIZES.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}</select></div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 12 }}>
              <div><label style={label}>Delivery Date *</label><input style={input} type="date" name="deliveryDate" value={form.deliveryDate} onChange={handleChange} min={new Date().toISOString().split('T')[0]} /></div>
              <div><label style={label}>Time Slot *</label><select style={input} name="timeSlot" value={form.timeSlot} onChange={handleChange}><option value="">Select time slot</option>{TIME_SLOTS.map(s => <option key={s} value={s}>{s}</option>)}</select></div>
            </div>
            <div style={{ marginTop: 12 }}><label style={label}>Delivery Address *</label><textarea style={{ ...input, resize: 'vertical', minHeight: 70 }} name="address" value={form.address} onChange={handleChange} placeholder="Full delivery address with landmarks" /></div>
            <div style={{ marginTop: 12 }}><label style={label}>Special Instructions</label><textarea style={{ ...input, resize: 'vertical', minHeight: 60 }} name="instructions" value={form.instructions} onChange={handleChange} placeholder="Any special instructions for delivery..." /></div>
          </div>

          <div style={{ background: th.card, border: `1px solid ${th.border}`, borderRadius: 16, padding: 24, marginBottom: 16 }}>
            <div style={{ fontSize: '0.95rem', fontWeight: 600, color: th.cyan, marginBottom: 12 }}>Price Estimate</div>
            {form.tankerSize && form.area ? (
              <div style={{ padding: 16, borderRadius: 8, background: `${th.cyan}10`, border: `1px solid ${th.cyan}25` }}>
                <div style={{ fontSize: '0.75rem', color: th.muted }}>Estimated Total</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: th.cyan }}>PKR {estimatedPrice.toLocaleString()}</div>
                <div style={{ fontSize: '0.72rem', color: th.muted, marginTop: 4 }}>Base: PKR {selectedTanker.basePrice.toLocaleString()} x Distance Factor: {AREA_DISTANCE_MULTIPLIER[form.area]}x — {selectedTanker.capacity.toLocaleString()} liters</div>
              </div>
            ) : <p style={{ color: th.muted, fontSize: '0.85rem' }}>Select tanker size and area to see price estimate</p>}
          </div>

          <button type="submit" disabled={loading} style={{ width: '100%', padding: 12, borderRadius: 8, border: 'none', background: `linear-gradient(135deg, ${th.teal}, ${th.cyan})`, color: '#fff', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer', opacity: loading ? 0.6 : 1 }}>{loading ? 'Booking...' : 'Confirm Booking'}</button>
        </form>
      </div>
    </div>
  );
}

export default BookingPage;
