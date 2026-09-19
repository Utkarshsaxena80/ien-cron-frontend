import React, { useState } from 'react';
import { Search, Plus, Check } from 'lucide-react';
import { api } from '../services/api';

export default function ProductSearch({ onProductTracked, trackedProductIds = [] }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState(null);
  const [trackingId, setTrackingId] = useState(null);

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;

    setSearching(true);
    setError(null);

    try {
      const data = await api.searchProducts(query);
      setResults(data.products || []);
    } catch (err) {
      setError(err.message || 'Failed to search products');
    } finally {
      setSearching(false);
    }
  };

  const handleTrack = async (product) => {
    setTrackingId(product.product_id);
    try {
      await api.trackProduct({
        product_id: product.product_id,
        product_name: product.product_name,
        product_url: product.product_url,
        image_url: product.image_url
      });
      if (onProductTracked) onProductTracked();
    } catch (err) {
      alert(`Error tracking product: ${err.message}`);
    } finally {
      setTrackingId(null);
    }
  };

  return (
    <div className="card">
      <h2 className="card-title">
        <Search size={18} color="#2563a6" /> Search Mock Storefront
      </h2>

      <form onSubmit={handleSearch} className="search-input-group">
        <input
          type="text"
          className="input-field"
          placeholder="Search products (e.g. ultrabook, macbook, domus)..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit" className="btn btn-primary" disabled={searching}>
          {searching ? 'Searching...' : 'Search'}
        </button>
      </form>

      {error && (
        <div style={{ color: '#b42318', fontSize: '0.85rem', marginBottom: '12px' }}>
          {error}
        </div>
      )}

      {results.length > 0 && (
        <div style={{ maxHeight: '350px', overflowY: 'auto' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
            Found {results.length} products matching "{query}"
          </div>
          {results.map((prod) => {
            const isTracked = trackedProductIds.includes(String(prod.product_id));
            return (
              <div
                key={prod.product_id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '10px 12px',
                  background: '#f8fafb',
                  borderRadius: 'var(--radius-sm)',
                  marginBottom: '8px',
                  border: '1px solid var(--border-color)'
                }}
              >
                <div>
                  <div style={{ fontWeight: '600', fontSize: '0.9rem' }}>{prod.product_name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    Category: {prod.category} | SKU: {prod.sku}
                  </div>
                </div>

                <button
                  className={`btn btn-sm ${isTracked ? 'btn-secondary' : 'btn-primary'}`}
                  disabled={isTracked || trackingId === prod.product_id}
                  onClick={() => handleTrack(prod)}
                >
                  {isTracked ? (
                    <>
                      <Check size={14} /> Tracked
                    </>
                  ) : trackingId === prod.product_id ? (
                    'Tracking...'
                  ) : (
                    <>
                      <Plus size={14} /> Track
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
