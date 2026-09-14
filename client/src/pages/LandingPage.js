import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const LandingPage = () => {
  const { themeName, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const isDark = themeName === 'dark';

  const th = {
    bg: isDark ? '#031220' : '#f8fafc',
    card: isDark ? '#0d2536' : '#ffffff',
    cardHover: isDark ? '#112d42' : '#f1f5f9',
    text: isDark ? '#e2e8f0' : '#1e293b',
    textSecondary: isDark ? '#94a3b8' : '#64748b',
    textMuted: isDark ? '#64748b' : '#94a3b8',
    border: isDark ? '#1e3a52' : '#e2e8f0',
    borderHover: isDark ? '#2d4a6a' : '#cbd5e1',
    cyan: '#06b6d4',
    cyanLight: isDark ? 'rgba(6,182,212,0.15)' : 'rgba(6,182,212,0.1)',
    cyanDark: '#0891b2',
    gradient: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
    gradientText: 'linear-gradient(135deg, #06b6d4, #8b5cf6)',
    shadow: isDark ? '0 4px 24px rgba(0,0,0,0.3)' : '0 4px 24px rgba(0,0,0,0.08)',
    shadowHover: isDark ? '0 8px 32px rgba(0,0,0,0.4)' : '0 8px 32px rgba(0,0,0,0.12)',
    shadowCyan: '0 4px 24px rgba(6,182,212,0.3)',
    green: '#10b981',
    red: '#ef4444',
    orange: '#f59e0b',
    purple: '#8b5cf6',
    pink: '#ec4899',
    nav: isDark ? 'rgba(3,18,32,0.95)' : 'rgba(255,255,255,0.95)',
    input: isDark ? '#0a1e30' : '#f1f5f9',
  };

  const [scrolled, setScrolled] = useState(false);
  const [heroStats, setHeroStats] = useState([0, 0, 0, 0]);
  const [faqOpen, setFaqOpen] = useState(null);
  const [visibleSections, setVisibleSections] = useState(new Set());
  const [hoveredFeature, setHoveredFeature] = useState(null);
  const [hoveredPricing, setHoveredPricing] = useState(null);
  const [hoveredCity, setHoveredCity] = useState(null);
  const [hoveredAlgo, setHoveredAlgo] = useState(null);

  const heroStatsTarget = [500, 2400, 98.7, 9];
  const heroStatsLabels = ['Operators', 'K+ Litres/Day', '% On-Time', 'Cities'];
  const heroStatsIcons = ['fa-users', 'fa-droplet', 'fa-clock', 'fa-city'];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => new Set([...prev, entry.target.id]));
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );
    document.querySelectorAll('.reveal-section').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const animateCounters = useCallback(() => {
    const duration = 2000;
    const totalSteps = 60;
    const interval = duration / totalSteps;
    let current = 0;
    const timer = setInterval(() => {
      current++;
      const progress = current / totalSteps;
      const eased = 1 - Math.pow(1 - progress, 3);
      setHeroStats([
        Math.round(eased * heroStatsTarget[0]),
        Math.round(eased * heroStatsTarget[1]),
        parseFloat((eased * heroStatsTarget[2]).toFixed(1)),
        Math.round(eased * heroStatsTarget[3]),
      ]);
      if (current >= totalSteps) {
        setHeroStats([...heroStatsTarget]);
        clearInterval(timer);
      }
    }, interval);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (visibleSections.has('hero')) {
      const cleanup = animateCounters();
      return cleanup;
    }
  }, [visibleSections.has('hero'), animateCounters]);

  const features = [
    { icon: 'fa-truck-fast', title: 'Fleet Management', desc: 'Track all tankers in real-time with GPS monitoring and route optimization', color: '#06b6d4' },
    { icon: 'fa-flask', title: 'Water Quality Testing', desc: 'Automated quality checks at every stage - pH, TDS, chlorine levels', color: '#8b5cf6' },
    { icon: 'fa-mobile-screen', title: 'Mobile App', desc: 'Full-featured Android & iOS apps for operators and customers', color: '#ec4899' },
    { icon: 'fa-credit-card', title: 'Payment Gateway', desc: 'Secure payments via JazzCash, EasyPaisa, bank transfer & cash', color: '#10b981' },
    { icon: 'fa-chart-line', title: 'Analytics Dashboard', desc: 'Comprehensive reports, revenue tracking, and business insights', color: '#f59e0b' },
    { icon: 'fa-wrench', title: 'Maintenance Scheduling', desc: 'Preventive maintenance alerts and service history tracking', color: '#ef4444' },
    { icon: 'fa-id-card', title: 'Operator Licensing', desc: 'Digital licenses, certifications, and compliance management', color: '#3b82f6' },
    { icon: 'fa-gas-pump', title: 'Supply Chain', desc: 'Source management, procurement, and inventory tracking', color: '#14b8a6' },
    { icon: 'fa-shield-halved', title: 'Security & Compliance', desc: 'End-to-end encryption, NADRA verification, and regulatory compliance', color: '#f97316' },
  ];

  const steps = [
    { icon: 'fa-user-plus', title: 'Register Account', desc: 'Sign up in seconds with NADRA verification', time: '<30 sec', color: '#06b6d4' },
    { icon: 'fa-list-check', title: 'Place Order', desc: 'Select tanker size, schedule delivery, and confirm', time: '<2 min', color: '#8b5cf6' },
    { icon: 'fa-satellite-dish', title: 'Live Tracking', desc: 'Track your tanker in real-time with ETA updates', time: 'Real-time', color: '#10b981' },
    { icon: 'fa-check-double', title: 'Delivery Complete', desc: 'Quality verified delivery with digital receipt', time: '<45 min', color: '#f59e0b' },
  ];

  const algorithms = [
    { name: "Dijkstra's Algorithm", desc: 'Optimal route calculation for tanker deliveries minimizing distance and time', useCase: 'Route Optimization', icon: 'fa-route', color: '#06b6d4' },
    { name: 'Greedy Algorithm', desc: 'Dynamic order allocation based on proximity, capacity, and priority', useCase: 'Order Allocation', icon: 'fa-chess', color: '#8b5cf6' },
    { name: 'Dynamic Programming', desc: 'Demand forecasting and inventory optimization using historical patterns', useCase: 'Demand Prediction', icon: 'fa-chart-bar', color: '#10b981' },
    { name: 'Backtracking', desc: 'Solving complex scheduling constraints for multi-depot operations', useCase: 'Schedule Optimization', icon: 'fa-calendar-check', color: '#f59e0b' },
    { name: 'Ford-Fulkerson', desc: 'Maximum flow analysis for water distribution network optimization', useCase: 'Network Flow', icon: 'fa-network-wired', color: '#ef4444' },
  ];

  const cities = [
    { name: 'Karachi', operators: 180, volume: '850K', coverage: 95 },
    { name: 'Lahore', operators: 145, volume: '620K', coverage: 92 },
    { name: 'Islamabad', operators: 85, volume: '380K', coverage: 98 },
    { name: 'Faisalabad', operators: 65, volume: '210K', coverage: 87 },
    { name: 'Rawalpindi', operators: 52, volume: '180K', coverage: 90 },
    { name: 'Multan', operators: 38, volume: '120K', coverage: 82 },
  ];

  const qualityMetrics = [
    { name: 'pH Level', value: 95, target: '6.5-8.5', icon: 'fa-flask-vial', color: '#06b6d4' },
    { name: 'TDS', value: 88, target: '<500 mg/L', icon: 'fa-water', color: '#8b5cf6' },
    { name: 'Chlorine', value: 92, target: '0.2-0.5 mg/L', icon: 'fa-vial', color: '#10b981' },
    { name: 'Turbidity', value: 97, target: '<1 NTU', icon: 'fa-eye', color: '#f59e0b' },
  ];

  const testimonials = [
    { name: 'Ahmad Khan', role: 'Fleet Manager', company: 'Karachi Water Solutions', quote: 'AquaManager PRO transformed our operations. We reduced fuel costs by 35% and improved delivery times significantly.', avatar: 'AK', rating: 5, color: '#06b6d4' },
    { name: 'Fatima Malik', role: 'CEO', company: 'Lahore Clean Water Co.', quote: 'The water quality tracking feature gives our customers confidence. Our satisfaction rate jumped from 78% to 96%.', avatar: 'FM', rating: 5, color: '#8b5cf6' },
    { name: 'Hassan Ali', role: 'Operations Director', company: 'Pindi Tankers Ltd', quote: 'Managing 50+ tankers used to be chaos. Now everything is automated and we have complete visibility.', avatar: 'HA', rating: 5, color: '#10b981' },
  ];

  const pricingPlans = [
    {
      name: 'Starter', price: '5,000', period: '/month', popular: false, desc: 'Perfect for small operators',
      features: [
        { text: 'Up to 5 tankers', included: true }, { text: 'Basic route optimization', included: true },
        { text: 'Order management', included: true }, { text: 'SMS notifications', included: true },
        { text: 'Mobile app access', included: true }, { text: 'Analytics dashboard', included: false },
        { text: 'API access', included: false }, { text: 'Priority support', included: false },
      ],
    },
    {
      name: 'Professional', price: '12,000', period: '/month', popular: true, desc: 'Best for growing businesses',
      features: [
        { text: 'Up to 25 tankers', included: true }, { text: 'Advanced route optimization', included: true },
        { text: 'Order management', included: true }, { text: 'WhatsApp & SMS notifications', included: true },
        { text: 'Mobile app access', included: true }, { text: 'Full analytics dashboard', included: true },
        { text: 'API access', included: true }, { text: 'Priority support', included: false },
      ],
    },
    {
      name: 'Enterprise', price: '25,000', period: '/month', popular: false, desc: 'For large-scale operations',
      features: [
        { text: 'Unlimited tankers', included: true }, { text: 'AI-powered optimization', included: true },
        { text: 'Order management', included: true }, { text: 'Multi-channel notifications', included: true },
        { text: 'Mobile app access', included: true }, { text: 'Advanced analytics + AI', included: true },
        { text: 'Full API access', included: true }, { text: '24/7 priority support', included: true },
      ],
    },
  ];

  const faqs = [
    { q: 'How does the water quality testing work?', a: 'Every tanker undergoes automated quality testing at our purification stations. We check pH levels (6.5-8.5), TDS (<500 mg/L), chlorine content (0.2-0.5 mg/L), and turbidity (<1 NTU). Results are digitally recorded and accessible to customers via the app.' },
    { q: 'What payment methods are supported?', a: 'We support JazzCash, EasyPaisa, all major bank transfers (HBL, MCB, UBL, etc.), credit/debit cards, and cash on delivery. All digital transactions are secured with 256-bit SSL encryption.' },
    { q: 'How fast can I get water delivered?', a: 'Standard delivery is within 45 minutes in major cities. Express delivery (within 20 minutes) is available in Karachi, Lahore, and Islamabad for a small surcharge. You can track your tanker in real-time once dispatched.' },
    { q: 'Is there a minimum order requirement?', a: 'No minimum order requirement! You can order as little as 500 litres for residential use. We offer tanker sizes from 1,000 litres to 10,000 litres to suit different needs.' },
  ];

  const tickerStats = [
    { icon: 'fa-truck', label: 'Active Tankers', value: '1,247' },
    { icon: 'fa-droplet', label: 'Litres Delivered', value: '2.4B+' },
    { icon: 'fa-users', label: 'Happy Customers', value: '150K+' },
    { icon: 'fa-city', label: 'Cities Covered', value: '9' },
    { icon: 'fa-star', label: 'Average Rating', value: '4.9/5' },
    { icon: 'fa-shield-halved', label: 'Quality Tests', value: '1.2M+' },
    { icon: 'fa-clock', label: 'Avg Delivery Time', value: '32 min' },
  ];

  const navLinks = ['Features', 'How It Works', 'Coverage', 'Pricing', 'FAQ'];

  const getRevealStyle = (sectionId) => ({
    opacity: visibleSections.has(sectionId) ? 1 : 0,
    transform: visibleSections.has(sectionId) ? 'translateY(0)' : 'translateY(30px)',
    transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
  });

  const sectionBadgeStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    padding: '6px 14px',
    borderRadius: 20,
    background: th.cyanLight,
    border: '1px solid rgba(6,182,212,0.2)',
    fontSize: 12,
    fontWeight: 600,
    color: th.cyan,
    marginBottom: 16,
  };

  const sectionTitleStyle = {
    fontSize: 40,
    fontWeight: 800,
    color: th.text,
    marginBottom: 12,
    lineHeight: 1.2,
  };

  const sectionSubtitleStyle = {
    fontSize: 17,
    color: th.textSecondary,
    maxWidth: 600,
    lineHeight: 1.7,
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600;700&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Inter', sans-serif; }
        .reveal-section { opacity: 0; transform: translateY(30px); transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1); }
        .reveal-section.visible { opacity: 1; transform: translateY(0); }
        @keyframes ticker { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        @keyframes pulse { 0%, 100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.05); opacity: 0.8; } }
        @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-10px); } }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes glow { 0%, 100% { box-shadow: 0 0 5px rgba(6,182,212,0.3); } 50% { box-shadow: 0 0 20px rgba(6,182,212,0.6); } }
        .hero-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: center; max-width: 1280px; margin: 0 auto; padding: 0 32px; }
        .feature-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; max-width: 1280px; margin: 0 auto; padding: 0 32px; }
        .city-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; max-width: 1280px; margin: 0 auto; padding: 0 32px; }
        .steps-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; max-width: 1280px; margin: 0 auto; padding: 0 32px; position: relative; }
        .algo-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 20px; max-width: 1280px; margin: 0 auto; padding: 0 32px; }
        .quality-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; max-width: 1280px; margin: 0 auto; padding: 0 32px; }
        .pricing-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 32px; max-width: 1100px; margin: 0 auto; padding: 0 32px; }
        .testimonial-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 32px; max-width: 1280px; margin: 0 auto; padding: 0 32px; }
        .footer-grid { display: grid; grid-template-columns: 2fr 1fr 1fr 1.5fr; gap: 48px; max-width: 1280px; margin: 0 auto; padding: 0 32px; }
        .ticker-wrap { overflow: hidden; white-space: nowrap; }
        .ticker-track { display: inline-flex; animation: ticker 30s linear infinite; }
        .ticker-track:hover { animation-play-state: paused; }
        @media (max-width: 1200px) { .algo-grid { grid-template-columns: repeat(3, 1fr); } }
        @media (max-width: 1024px) {
          .hero-grid { grid-template-columns: 1fr; gap: 40px; text-align: center; }
          .feature-grid { grid-template-columns: repeat(2, 1fr); }
          .city-grid { grid-template-columns: repeat(2, 1fr); }
          .steps-grid { grid-template-columns: repeat(2, 1fr); }
          .quality-grid { grid-template-columns: repeat(2, 1fr); }
          .pricing-grid { grid-template-columns: 1fr; max-width: 480px; }
          .testimonial-grid { grid-template-columns: 1fr; max-width: 560px; }
          .footer-grid { grid-template-columns: 1fr 1fr; }
          .algo-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 768px) {
          .feature-grid { grid-template-columns: 1fr; }
          .city-grid { grid-template-columns: 1fr; }
          .steps-grid { grid-template-columns: 1fr; }
          .quality-grid { grid-template-columns: 1fr; }
          .footer-grid { grid-template-columns: 1fr; gap: 32px; }
          .algo-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      {/* Navigation */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000, padding: '0 32px', height: 72, display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: th.nav, backdropFilter: 'blur(20px)', borderBottom: `1px solid ${th.border}`, transition: 'all 0.3s ease', boxShadow: scrolled ? th.shadow : 'none' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: th.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, color: '#fff' }}>💧</div>
          <span style={{ fontSize: 22, fontWeight: 800, color: th.text }}>AquaManager</span>
          <span style={{ fontSize: 10, fontWeight: 700, color: '#06b6d4', background: th.cyanLight, padding: '2px 8px', borderRadius: 4, letterSpacing: 1 }}>PRO</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
          {navLinks.map((link) => (
            <a key={link} href={`#${link.toLowerCase().replace(/\s+/g, '-')}`} style={{ color: th.textSecondary, textDecoration: 'none', fontSize: 14, fontWeight: 500, transition: 'color 0.2s' }} onMouseEnter={(e) => (e.target.style.color = th.cyan)} onMouseLeave={(e) => (e.target.style.color = th.textSecondary)}>{link}</a>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <button onClick={toggleTheme} style={{ width: 36, height: 36, borderRadius: 8, border: `1px solid ${th.border}`, background: th.card, color: th.text, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, transition: 'all 0.2s' }} onMouseEnter={(e) => { e.currentTarget.style.borderColor = th.cyan; e.currentTarget.style.background = th.cyanLight; }} onMouseLeave={(e) => { e.currentTarget.style.borderColor = th.border; e.currentTarget.style.background = th.card; }}>{isDark ? '☀️' : '🌙'}</button>
          <button onClick={() => navigate('/login')} style={{ padding: '8px 20px', borderRadius: 8, border: `1px solid ${th.border}`, background: 'transparent', color: th.text, fontSize: 14, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }} onMouseEnter={(e) => { e.currentTarget.style.borderColor = th.cyan; e.currentTarget.style.color = th.cyan; }} onMouseLeave={(e) => { e.currentTarget.style.borderColor = th.border; e.currentTarget.style.color = th.text; }}>Login</button>
          <button onClick={() => navigate('/login')} style={{ padding: '8px 20px', borderRadius: 8, border: 'none', background: th.gradient, color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 2px 8px rgba(6,182,212,0.3)' }} onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-1px)')} onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}>Book Water</button>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="hero" className="reveal-section" style={{ ...getRevealStyle('hero'), paddingTop: 120, paddingBottom: 80, background: isDark ? 'radial-gradient(ellipse at 20% 50%, rgba(6,182,212,0.08) 0%, transparent 50%)' : 'radial-gradient(ellipse at 20% 50%, rgba(6,182,212,0.05) 0%, transparent 50%)', minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
        <div className="hero-grid">
          <div>
            <div style={sectionBadgeStyle}>
              <i className="fa-solid fa-users" style={{ fontSize: 12 }}></i>
              Serving 500+ Operators Across Pakistan
            </div>
            <h1 style={{ fontSize: 56, fontWeight: 900, lineHeight: 1.1, marginBottom: 20, color: th.text }}>
              Pakistan's{' '}
              <span style={{ background: th.gradientText, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>#1</span>{' '}
              Water Tanker{' '}
              <span style={{ background: th.gradientText, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Distribution</span>{' '}
              System
            </h1>
            <p style={{ fontSize: 18, lineHeight: 1.7, color: th.textSecondary, marginBottom: 32, maxWidth: 520 }}>Professional water tanker management platform with real-time tracking, automated scheduling, DAA-powered route optimization, and comprehensive analytics for operators across Pakistan.</p>
            <div style={{ display: 'flex', gap: 16, marginBottom: 48, flexWrap: 'wrap' }}>
              <button onClick={() => navigate('/register')} style={{ padding: '14px 32px', borderRadius: 12, border: 'none', background: th.gradient, color: '#fff', fontSize: 16, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, boxShadow: th.shadowCyan, transition: 'all 0.2s' }} onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-2px)')} onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}>
                <i className="fa-solid fa-rocket"></i> Start Free Trial
              </button>
              <button onClick={() => navigate('/login')} style={{ padding: '14px 32px', borderRadius: 12, border: `2px solid ${th.cyan}`, background: 'transparent', color: th.cyan, fontSize: 16, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, transition: 'all 0.2s' }} onMouseEnter={(e) => { e.currentTarget.style.background = th.cyanLight; e.currentTarget.style.transform = 'translateY(-2px)'; }} onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.transform = 'translateY(0)'; }}>
                <i className="fa-solid fa-droplet"></i> Book Water Now
              </button>
              <button onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })} style={{ padding: '14px 32px', borderRadius: 12, border: `1px solid ${th.border}`, background: th.card, color: th.text, fontSize: 16, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, transition: 'all 0.2s' }} onMouseEnter={(e) => { e.currentTarget.style.borderColor = th.cyan; e.currentTarget.style.transform = 'translateY(-2px)'; }} onMouseLeave={(e) => { e.currentTarget.style.borderColor = th.border; e.currentTarget.style.transform = 'translateY(0)'; }}>
                <i className="fa-solid fa-play-circle"></i> See How It Works
              </button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
              {heroStats.map((stat, i) => (
                <div key={i} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 14, color: th.cyan, marginBottom: 4 }}><i className={`fa-solid ${heroStatsIcons[i]}`}></i></div>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 28, fontWeight: 800, color: th.text, lineHeight: 1 }}>{stat}{i === 2 ? '%' : i === 1 ? 'K+' : '+'}</div>
                  <div style={{ fontSize: 12, color: th.textMuted, marginTop: 4 }}>{heroStatsLabels[i]}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ position: 'relative' }}>
            <div style={{ background: th.card, borderRadius: 20, border: `1px solid ${th.border}`, padding: 24, boxShadow: th.shadow, animation: 'float 6s ease-in-out infinite' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: th.text }}>Dashboard Overview</h3>
                  <p style={{ fontSize: 12, color: th.textMuted }}>Real-time metrics</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 10px', borderRadius: 12, background: 'rgba(16,185,129,0.1)', fontSize: 12, color: '#10b981', fontWeight: 600 }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981', display: 'inline-block', animation: 'pulse 2s infinite' }}></span>
                  Live
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12, marginBottom: 20 }}>
                {[{ label: 'Active Tankers', value: '127', icon: 'fa-truck', color: '#06b6d4' }, { label: 'Revenue PKR', value: '2.4M', icon: 'fa-coins', color: '#10b981' }, { label: 'Pending Orders', value: '34', icon: 'fa-clock', color: '#f59e0b' }, { label: 'Deliveries', value: '842', icon: 'fa-check-circle', color: '#8b5cf6' }].map((s, i) => (
                  <div key={i} style={{ padding: 14, borderRadius: 12, background: th.input, border: `1px solid ${th.border}` }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                      <span style={{ fontSize: 11, color: th.textMuted }}>{s.label}</span>
                      <i className={`fa-solid ${s.icon}`} style={{ fontSize: 12, color: s.color }}></i>
                    </div>
                    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 22, fontWeight: 800, color: th.text }}>{s.value}</div>
                  </div>
                ))}
              </div>
              <div style={{ padding: 16, borderRadius: 12, background: isDark ? '#0a1e30' : '#e2e8f0', border: `1px solid ${th.border}`, marginBottom: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: th.text }}>Live Tracking</span>
                  <span style={{ fontSize: 11, color: th.textMuted }}>Karachi Region</span>
                </div>
                <div style={{ height: 80, borderRadius: 8, background: isDark ? 'linear-gradient(135deg, #0d2536, #1a3a52)' : 'linear-gradient(135deg, #cbd5e1, #94a3b8)', position: 'relative', overflow: 'hidden' }}>
                  {[{ x: 15, y: 30 }, { x: 45, y: 50 }, { x: 70, y: 25 }, { x: 85, y: 60 }].map((pos, i) => (
                    <div key={i} style={{ position: 'absolute', left: `${pos.x}%`, top: `${pos.y}%`, width: 8, height: 8, borderRadius: '50%', background: '#06b6d4', boxShadow: '0 0 8px rgba(6,182,212,0.5)', animation: `pulse 2s infinite ${i * 0.3}s` }}></div>
                  ))}
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[{ id: 'TK-127', status: 'En Route', time: '12 min', color: '#10b981' }, { id: 'TK-089', status: 'Loading', time: '5 min', color: '#f59e0b' }, { id: 'TK-203', status: 'Delivered', time: 'Done', color: '#06b6d4' }].map((t, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', borderRadius: 10, background: th.input, border: `1px solid ${th.border}` }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: `${t.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <i className="fa-solid fa-truck" style={{ fontSize: 12, color: t.color }}></i>
                    </div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: th.text }}>{t.id}</div>
                      <div style={{ fontSize: 11, color: th.textMuted }}>{t.time}</div>
                    </div>
                  </div>
                  <span style={{ padding: '3px 8px', borderRadius: 6, fontSize: 11, fontWeight: 600, background: `${t.color}20`, color: t.color }}>{t.status}</span>
                </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Ticker */}
      <section style={{ background: th.gradient, padding: '16px 0', overflow: 'hidden' }}>
        <div className="ticker-wrap">
          <div className="ticker-track">
            {[...tickerStats, ...tickerStats].map((s, i) => (
              <div key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '0 40px', color: '#fff', whiteSpace: 'nowrap' }}>
                <i className={`fa-solid ${s.icon}`} style={{ fontSize: 16, opacity: 0.9 }}></i>
                <span style={{ fontSize: 13, fontWeight: 600 }}>{s.label}</span>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 16, fontWeight: 800 }}>{s.value}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="reveal-section" style={{ ...getRevealStyle('features'), padding: '100px 0', background: th.bg }}>
        <div style={{ textAlign: 'center', marginBottom: 60, padding: '0 32px' }}>
          <div style={sectionBadgeStyle}><i className="fa-solid fa-grid-2" style={{ fontSize: 12 }}></i> Platform Features</div>
          <h2 style={sectionTitleStyle}>Everything You Need to <span style={{ background: th.gradientText, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Manage Water</span></h2>
          <p style={sectionSubtitleStyle}>Comprehensive suite of tools designed for the modern water tanker industry</p>
        </div>
        <div className="feature-grid">
          {features.map((f, i) => (
            <div key={i} onMouseEnter={() => setHoveredFeature(i)} onMouseLeave={() => setHoveredFeature(null)} style={{ padding: 28, borderRadius: 16, background: hoveredFeature === i ? th.cardHover : th.card, border: `1px solid ${hoveredFeature === i ? th.borderHover : th.border}`, boxShadow: hoveredFeature === i ? th.shadowHover : th.shadow, transition: 'all 0.3s ease', cursor: 'default', transform: hoveredFeature === i ? 'translateY(-4px)' : 'translateY(0)' }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: `${f.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                <i className={`fa-solid ${f.icon}`} style={{ fontSize: 20, color: f.color }}></i>
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: th.text, marginBottom: 8 }}>{f.title}</h3>
              <p style={{ fontSize: 14, lineHeight: 1.7, color: th.textSecondary }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="reveal-section" style={{ ...getRevealStyle('how-it-works'), padding: '100px 0', background: isDark ? '#061a2e' : '#f1f5f9' }}>
        <div style={{ textAlign: 'center', marginBottom: 60, padding: '0 32px' }}>
          <div style={sectionBadgeStyle}><i className="fa-solid fa-diagram-project" style={{ fontSize: 12 }}></i> How It Works</div>
          <h2 style={sectionTitleStyle}>Simple Steps to <span style={{ background: th.gradientText, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Get Started</span></h2>
          <p style={sectionSubtitleStyle}>From registration to delivery in minutes, not hours</p>
        </div>
        <div className="steps-grid">
          {steps.map((s, i) => (
            <div key={i} style={{ position: 'relative', textAlign: 'center', padding: 32, borderRadius: 16, background: th.card, border: `1px solid ${th.border}`, boxShadow: th.shadow }}>
              {i < 3 && <div style={{ position: 'absolute', top: 40, right: -16, width: 32, height: 2, background: th.border }}></div>}
              <div style={{ width: 64, height: 64, borderRadius: '50%', background: `${s.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', position: 'relative' }}>
                <span style={{ position: 'absolute', top: -4, right: -4, width: 22, height: 22, borderRadius: '50%', background: s.color, color: '#fff', fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{i + 1}</span>
                <i className={`fa-solid ${s.icon}`} style={{ fontSize: 24, color: s.color }}></i>
              </div>
              <h3 style={{ fontSize: 17, fontWeight: 700, color: th.text, marginBottom: 8 }}>{s.title}</h3>
              <p style={{ fontSize: 13, color: th.textSecondary, marginBottom: 12, lineHeight: 1.6 }}>{s.desc}</p>
              <span style={{ display: 'inline-block', padding: '4px 10px', borderRadius: 6, fontSize: 11, fontWeight: 600, background: `${s.color}15`, color: s.color }}>{s.time}</span>
            </div>
          ))}
        </div>
      </section>

      {/* DAA Algorithms */}
      <section id="algorithms" className="reveal-section" style={{ ...getRevealStyle('algorithms'), padding: '100px 0', background: th.bg }}>
        <div style={{ textAlign: 'center', marginBottom: 60, padding: '0 32px' }}>
          <div style={sectionBadgeStyle}><i className="fa-solid fa-brain" style={{ fontSize: 12 }}></i> DAA Algorithms</div>
          <h2 style={sectionTitleStyle}>Powered by <span style={{ background: th.gradientText, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Advanced Algorithms</span></h2>
          <p style={sectionSubtitleStyle}>Our platform leverages Design and Analysis of Algorithms for optimal performance</p>
        </div>
        <div className="algo-grid">
          {algorithms.map((a, i) => (
            <div key={i} onMouseEnter={() => setHoveredAlgo(i)} onMouseLeave={() => setHoveredAlgo(null)} style={{ padding: 24, borderRadius: 16, background: hoveredAlgo === i ? th.cardHover : th.card, border: `1px solid ${hoveredAlgo === i ? `${a.color}40` : th.border}`, boxShadow: hoveredAlgo === i ? `0 8px 32px ${a.color}20` : th.shadow, transition: 'all 0.3s ease', transform: hoveredAlgo === i ? 'translateY(-4px)' : 'translateY(0)' }}>
              <div style={{ width: 44, height: 44, borderRadius: 10, background: `${a.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
                <i className={`fa-solid ${a.icon}`} style={{ fontSize: 18, color: a.color }}></i>
              </div>
              <h4 style={{ fontSize: 15, fontWeight: 700, color: th.text, marginBottom: 8 }}>{a.name}</h4>
              <p style={{ fontSize: 12, color: th.textSecondary, lineHeight: 1.6, marginBottom: 12 }}>{a.desc}</p>
              <span style={{ display: 'inline-block', padding: '4px 10px', borderRadius: 6, fontSize: 11, fontWeight: 600, background: `${a.color}15`, color: a.color }}>{a.useCase}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Coverage Section */}
      <section id="coverage" className="reveal-section" style={{ ...getRevealStyle('coverage'), padding: '100px 0', background: isDark ? '#061a2e' : '#f1f5f9' }}>
        <div style={{ textAlign: 'center', marginBottom: 60, padding: '0 32px' }}>
          <div style={sectionBadgeStyle}><i className="fa-solid fa-map-location-dot" style={{ fontSize: 12 }}></i> Coverage</div>
          <h2 style={sectionTitleStyle}>Serving <span style={{ background: th.gradientText, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>9 Major Cities</span> Across Pakistan</h2>
          <p style={sectionSubtitleStyle}>Nationwide network with local expertise in every region</p>
        </div>
        <div className="city-grid">
          {cities.map((c, i) => (
            <div key={i} onMouseEnter={() => setHoveredCity(i)} onMouseLeave={() => setHoveredCity(null)} style={{ padding: 24, borderRadius: 16, background: hoveredCity === i ? th.cardHover : th.card, border: `1px solid ${hoveredCity === i ? th.borderHover : th.border}`, boxShadow: th.shadow, transition: 'all 0.3s ease', transform: hoveredCity === i ? 'translateY(-4px)' : 'translateY(0)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: th.text }}>{c.name}</h3>
                <span style={{ fontSize: 28, fontWeight: 800, fontFamily: "'JetBrains Mono', monospace", color: th.cyan }}>{c.coverage}%</span>
              </div>
              <div style={{ display: 'flex', gap: 24, marginBottom: 16 }}>
                <div><div style={{ fontSize: 20, fontWeight: 800, fontFamily: "'JetBrains Mono', monospace", color: th.text }}>{c.operators}</div><div style={{ fontSize: 12, color: th.textMuted }}>Operators</div></div>
                <div><div style={{ fontSize: 20, fontWeight: 800, fontFamily: "'JetBrains Mono', monospace", color: th.text }}>{c.volume}</div><div style={{ fontSize: 12, color: th.textMuted }}>Litres/Day</div></div>
              </div>
              <div style={{ height: 6, borderRadius: 3, background: isDark ? '#0a1e30' : '#e2e8f0', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${c.coverage}%`, borderRadius: 3, background: th.gradient, transition: 'width 1s ease' }}></div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Water Quality */}
      <section className="reveal-section" style={{ ...getRevealStyle('quality'), padding: '100px 0', background: th.bg }}>
        <div style={{ textAlign: 'center', marginBottom: 60, padding: '0 32px' }}>
          <div style={sectionBadgeStyle}><i className="fa-solid fa-flask-vial" style={{ fontSize: 12 }}></i> Water Quality</div>
          <h2 style={sectionTitleStyle}>Quality <span style={{ background: th.gradientText, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Assurance</span></h2>
          <p style={sectionSubtitleStyle}>Every drop is tested and certified for your safety</p>
        </div>
        <div className="quality-grid">
          {qualityMetrics.map((q, i) => (
            <div key={i} style={{ padding: 24, borderRadius: 16, background: th.card, border: `1px solid ${th.border}`, boxShadow: th.shadow, textAlign: 'center' }}>
              <div style={{ width: 52, height: 52, borderRadius: 12, background: `${q.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <i className={`fa-solid ${q.icon}`} style={{ fontSize: 22, color: q.color }}></i>
              </div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: th.text, marginBottom: 4 }}>{q.name}</h3>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 32, fontWeight: 800, color: q.color, marginBottom: 4 }}>{q.value}%</div>
              <p style={{ fontSize: 12, color: th.textMuted, marginBottom: 16 }}>Target: {q.target}</p>
              <div style={{ height: 8, borderRadius: 4, background: isDark ? '#0a1e30' : '#e2e8f0', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${q.value}%`, borderRadius: 4, background: q.color, transition: 'width 1.2s ease' }}></div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="reveal-section" style={{ ...getRevealStyle('testimonials'), padding: '100px 0', background: isDark ? '#061a2e' : '#f1f5f9' }}>
        <div style={{ textAlign: 'center', marginBottom: 60, padding: '0 32px' }}>
          <div style={sectionBadgeStyle}><i className="fa-solid fa-quote-left" style={{ fontSize: 12 }}></i> Testimonials</div>
          <h2 style={sectionTitleStyle}>Trusted by <span style={{ background: th.gradientText, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Industry Leaders</span></h2>
          <p style={sectionSubtitleStyle}>See what our operators and customers have to say</p>
        </div>
        <div className="testimonial-grid">
          {testimonials.map((t, i) => (
            <div key={i} style={{ padding: 32, borderRadius: 16, background: th.card, border: `1px solid ${th.border}`, boxShadow: th.shadow }}>
              <div style={{ display: 'flex', gap: 2, marginBottom: 16 }}>
                {Array.from({ length: t.rating }).map((_, j) => (
                  <i key={j} className="fa-solid fa-star" style={{ color: '#f59e0b', fontSize: 14 }}></i>
                ))}
              </div>
              <p style={{ fontSize: 15, lineHeight: 1.7, color: th.textSecondary, marginBottom: 24, fontStyle: 'italic' }}>"{t.quote}"</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ width: 48, height: 48, borderRadius: '50%', background: `${t.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 700, color: t.color }}>{t.avatar}</div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: th.text }}>{t.name}</div>
                  <div style={{ fontSize: 12, color: th.textMuted }}>{t.role}, {t.company}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="reveal-section" style={{ ...getRevealStyle('pricing'), padding: '100px 0', background: th.bg }}>
        <div style={{ textAlign: 'center', marginBottom: 60, padding: '0 32px' }}>
          <div style={sectionBadgeStyle}><i className="fa-solid fa-tag" style={{ fontSize: 12 }}></i> Pricing</div>
          <h2 style={sectionTitleStyle}>Simple, Transparent <span style={{ background: th.gradientText, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Pricing</span></h2>
          <p style={sectionSubtitleStyle}>Choose the plan that fits your business needs</p>
        </div>
        <div className="pricing-grid">
          {pricingPlans.map((p, i) => (
            <div key={i} onMouseEnter={() => setHoveredPricing(i)} onMouseLeave={() => setHoveredPricing(null)} style={{ padding: 36, borderRadius: 20, background: p.popular ? (isDark ? '#0d2536' : '#ffffff') : th.card, border: p.popular ? `2px solid ${th.cyan}` : `1px solid ${th.border}`, boxShadow: p.popular ? th.shadowCyan : th.shadow, position: 'relative', transition: 'all 0.3s ease', transform: hoveredPricing === i ? 'translateY(-6px)' : 'translateY(0)' }}>
              {p.popular && <div style={{ position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)', padding: '4px 16px', borderRadius: 12, background: th.gradient, color: '#fff', fontSize: 12, fontWeight: 700, whiteSpace: 'nowrap' }}>Most Popular</div>}
              <h3 style={{ fontSize: 20, fontWeight: 700, color: th.text, marginBottom: 4 }}>{p.name}</h3>
              <p style={{ fontSize: 13, color: th.textMuted, marginBottom: 20 }}>{p.desc}</p>
              <div style={{ marginBottom: 24 }}>
                <span style={{ fontSize: 14, color: th.textSecondary }}>PKR </span>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 40, fontWeight: 800, color: th.text }}>{p.price}</span>
                <span style={{ fontSize: 14, color: th.textMuted }}>{p.period}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 28 }}>
                {p.features.map((f, j) => (
                  <div key={j} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14 }}>
                    <i className={`fa-solid ${f.included ? 'fa-check' : 'fa-xmark'}`} style={{ fontSize: 12, color: f.included ? th.green : th.red, width: 16 }}></i>
                    <span style={{ color: f.included ? th.textSecondary : th.textMuted }}>{f.text}</span>
                  </div>
                ))}
              </div>
              <button onClick={() => navigate('/register')} style={{ width: '100%', padding: '14px 0', borderRadius: 12, border: p.popular ? 'none' : `1px solid ${th.border}`, background: p.popular ? th.gradient : 'transparent', color: p.popular ? '#fff' : th.text, fontSize: 15, fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s' }} onMouseEnter={(e) => { if (!p.popular) { e.currentTarget.style.borderColor = th.cyan; e.currentTarget.style.color = th.cyan; } }} onMouseLeave={(e) => { if (!p.popular) { e.currentTarget.style.borderColor = th.border; e.currentTarget.style.color = th.text; } }}>
                Get Started
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="reveal-section" style={{ ...getRevealStyle('faq'), padding: '100px 0', background: isDark ? '#061a2e' : '#f1f5f9' }}>
        <div style={{ textAlign: 'center', marginBottom: 60, padding: '0 32px' }}>
          <div style={sectionBadgeStyle}><i className="fa-solid fa-circle-question" style={{ fontSize: 12 }}></i> FAQ</div>
          <h2 style={sectionTitleStyle}>Frequently Asked <span style={{ background: th.gradientText, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Questions</span></h2>
          <p style={sectionSubtitleStyle}>Find answers to common questions about our platform</p>
        </div>
        <div style={{ maxWidth: 800, margin: '0 auto', padding: '0 32px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          {faqs.map((faq, i) => (
            <div key={i} style={{ borderRadius: 16, background: th.card, border: `1px solid ${th.border}`, boxShadow: th.shadow, overflow: 'hidden', transition: 'all 0.3s ease' }}>
              <div onClick={() => setFaqOpen(faqOpen === i ? null : i)} style={{ padding: '20px 24px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, userSelect: 'none' }}>
                <span style={{ fontSize: 16, fontWeight: 600, color: th.text }}>{faq.q}</span>
                <i className={`fa-solid ${faqOpen === i ? 'fa-chevron-up' : 'fa-chevron-down'}`} style={{ fontSize: 14, color: th.cyan, transition: 'transform 0.3s', flexShrink: 0 }}></i>
              </div>
              {faqOpen === i && (
                <div style={{ padding: '0 24px 20px', animation: 'fadeInUp 0.3s ease' }}>
                  <p style={{ fontSize: 15, lineHeight: 1.7, color: th.textSecondary, borderTop: `1px solid ${th.border}`, paddingTop: 16 }}>{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="reveal-section" style={{ ...getRevealStyle('cta'), padding: '100px 0', background: th.bg }}>
        <div style={{ maxWidth: 800, margin: '0 auto', padding: '0 32px', textAlign: 'center' }}>
          <div style={{ padding: 60, borderRadius: 24, background: th.gradient, position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 30% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)' }}></div>
            <div style={{ position: 'relative', zIndex: 1 }}>
              <h2 style={{ fontSize: 36, fontWeight: 800, color: '#fff', marginBottom: 16 }}>Ready to Modernize Your Fleet?</h2>
              <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.85)', marginBottom: 32, maxWidth: 500, margin: '0 auto 32px' }}>Join 500+ operators who trust AquaManager PRO for their water distribution needs across Pakistan.</p>
              <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
                <button style={{ padding: '14px 32px', borderRadius: 12, border: '2px solid rgba(255,255,255,0.3)', background: 'transparent', color: '#fff', fontSize: 16, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, transition: 'all 0.2s' }} onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.15)'; e.currentTarget.style.transform = 'translateY(-2px)'; }} onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.transform = 'translateY(0)'; }}>
                  <i className="fa-solid fa-phone"></i> Call Us
                </button>
                <button style={{ padding: '14px 32px', borderRadius: 12, border: 'none', background: '#25d366', color: '#fff', fontSize: 16, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, transition: 'all 0.2s', boxShadow: '0 4px 16px rgba(37,211,102,0.3)' }} onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-2px)')} onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}>
                  <i className="fa-brands fa-whatsapp"></i> WhatsApp
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: '60px 0 0', background: isDark ? '#020d18' : '#0f172a', color: '#94a3b8' }}>
        <div className="footer-grid">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: th.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>💧</div>
              <span style={{ fontSize: 20, fontWeight: 800, color: '#fff' }}>AquaManager</span>
              <span style={{ fontSize: 10, fontWeight: 700, color: '#06b6d4', background: 'rgba(6,182,212,0.15)', padding: '2px 8px', borderRadius: 4 }}>PRO</span>
            </div>
            <p style={{ fontSize: 14, lineHeight: 1.7, marginBottom: 20, color: '#94a3b8' }}>Pakistan's leading water tanker distribution management platform. Empowering operators with modern technology.</p>
            <div style={{ display: 'flex', gap: 12 }}>
              {['fa-facebook-f', 'fa-twitter', 'fa-linkedin-in', 'fa-instagram'].map((icon, i) => (
                <a key={i} href="#" style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', textDecoration: 'none', transition: 'all 0.2s', fontSize: 14 }} onMouseEnter={(e) => { e.currentTarget.style.background = '#06b6d4'; e.currentTarget.style.borderColor = '#06b6d4'; e.currentTarget.style.color = '#fff'; }} onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#94a3b8'; }}>
                  <i className={`fa-brands ${icon}`}></i>
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 style={{ fontSize: 15, fontWeight: 700, color: '#fff', marginBottom: 20 }}>Quick Links</h4>
            {['Features', 'Pricing', 'Coverage', 'API Docs', 'Blog'].map((link, i) => (
              <a key={i} href="#" style={{ display: 'block', fontSize: 14, color: '#94a3b8', textDecoration: 'none', marginBottom: 10, transition: 'color 0.2s' }} onMouseEnter={(e) => (e.target.style.color = '#06b6d4')} onMouseLeave={(e) => (e.target.style.color = '#94a3b8')}>{link}</a>
            ))}
          </div>

          <div>
            <h4 style={{ fontSize: 15, fontWeight: 700, color: '#fff', marginBottom: 20 }}>Legal</h4>
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'Refund Policy'].map((link, i) => (
              <a key={i} href="#" style={{ display: 'block', fontSize: 14, color: '#94a3b8', textDecoration: 'none', marginBottom: 10, transition: 'color 0.2s' }} onMouseEnter={(e) => (e.target.style.color = '#06b6d4')} onMouseLeave={(e) => (e.target.style.color = '#94a3b8')}>{link}</a>
            ))}
          </div>

          <div>
            <h4 style={{ fontSize: 15, fontWeight: 700, color: '#fff', marginBottom: 20 }}>Contact Us</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, fontSize: 14 }}>
                <i className="fa-solid fa-location-dot" style={{ color: '#06b6d4', marginTop: 3 }}></i>
                <span>Blue Area, Islamabad, Pakistan</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 14 }}>
                <i className="fa-solid fa-phone" style={{ color: '#06b6d4' }}></i>
                <span>+92 51 123 4567</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 14 }}>
                <i className="fa-solid fa-envelope" style={{ color: '#06b6d4' }}></i>
                <span>info@aquamanager.pk</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 14 }}>
                <i className="fa-solid fa-clock" style={{ color: '#06b6d4' }}></i>
                <span>24/7 Customer Support</span>
              </div>
            </div>
          </div>
        </div>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', marginTop: 48, padding: '20px 32px', textAlign: 'center', fontSize: 13, color: '#64748b' }}>
          &copy; 2024 AquaManager PRO. All rights reserved. Built with ❤️ in Pakistan
        </div>
      </footer>
    </>
  );
};

export default LandingPage;
