import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';
import { LineChart as ChartIcon } from 'lucide-react';

export default function PriceHistoryChart({ history = [], productName = 'Selected Product' }) {
  if (!history || history.length === 0) {
    return (
      <div className="card">
        <h2 className="card-title">
          <ChartIcon size={18} color="#2563a6" /> Price History Trend
        </h2>
        <div style={{ color: 'var(--text-secondary)', padding: '40px 0', textAlign: 'center', fontSize: '0.9rem' }}>
          Select a tracked product to view its price history graph over time.
        </div>
      </div>
    );
  }

  // Format data for Recharts
  const chartData = history.map(item => ({
    time: new Date(item.scraped_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    fullDate: new Date(item.scraped_at).toLocaleString(),
    price: parseFloat(item.price),
    stock: item.stock_status
  }));

  const prices = chartData.map(d => d.price);
  const minPrice = Math.floor(Math.min(...prices) * 0.95);
  const maxPrice = Math.ceil(Math.max(...prices) * 1.05);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div style={{
          background: '#ffffff',
          border: '1px solid #dce2e8',
          padding: '10px 14px',
          borderRadius: '6px',
          boxShadow: '0 4px 12px rgba(31,41,51,0.12)',
          fontSize: '0.85rem'
        }}>
          <div style={{ color: '#52606d', fontSize: '0.75rem', marginBottom: '4px' }}>{data.fullDate}</div>
          <div style={{ color: '#2563a6', fontWeight: '700', fontSize: '1rem' }}>₹{data.price.toLocaleString('en-IN')}</div>
          <div style={{ color: '#237a57', fontSize: '0.8rem', marginTop: '2px' }}>Stock: {data.stock}</div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="card">
      <h2 className="card-title">
        <ChartIcon size={18} color="#2563a6" /> Price Trend: {productName}
      </h2>

      <div style={{ width: '100%', height: 280, marginTop: '16px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
            <defs>
              <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563a6" stopOpacity={0.25}/>
                <stop offset="95%" stopColor="#2563a6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e1e6eb" />
            <XAxis dataKey="time" stroke="#7b8794" fontSize={12} />
            <YAxis domain={[minPrice, maxPrice]} stroke="#7b8794" fontSize={12} tickFormatter={(v) => `₹${v}`} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="price" stroke="#2563a6" strokeWidth={2} fillOpacity={1} fill="url(#priceGradient)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
