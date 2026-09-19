import React from 'react';
import { Trash2, TrendingDown, Clock, Tag } from 'lucide-react';

export default function TrackedProductCard({
  products = [],
  selectedProductId,
  onSelectProduct,
  onUntrackProduct
}) {
  const getBadgeClass = (status) => {
    switch (status) {
      case 'SUCCESS': return 'badge-success';
      case 'RETRY': return 'badge-retry';
      case 'FAILED': return 'badge-failed';
      default: return 'badge-pending';
    }
  };

  return (
    <div className="card">
      <h2 className="card-title">
        <Tag size={18} color="#2563a6" /> Tracked Products ({products.length})
      </h2>

      {products.length === 0 ? (
        <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textAlign: 'center', padding: '24px 0' }}>
          No products tracked yet. Search and click "Track" to start monitoring prices.
        </div>
      ) : (
        <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
          {products.map((prod) => {
            const isSelected = selectedProductId === prod.id;
            return (
              <div
                key={prod.id}
                className={`product-card ${isSelected ? 'active' : ''}`}
                onClick={() => onSelectProduct(prod.id)}
              >
                <div className="product-header">
                  <div className="product-name">{prod.product_name}</div>
                  <span className={`badge ${getBadgeClass(prod.latest_status)}`}>
                    {prod.latest_status}
                  </span>
                </div>

                <div className="product-price">
                  {prod.current_price !== null && prod.current_price !== undefined
                    ? `₹${prod.current_price.toLocaleString('en-IN')}`
                    : 'Awaiting Scrape'}
                </div>

                {prod.price_drop && (
                  <div className="price-drop-alert">
                    <TrendingDown size={14} /> Price Drop: -₹{prod.price_drop.amount} ({prod.price_drop.percentage}%)
                  </div>
                )}

                <div className="product-meta" style={{ marginTop: '8px' }}>
                  <span>Stock: {prod.current_stock || 'Unknown'}</span>
                  <button
                    className="btn btn-danger btn-sm"
                    style={{ padding: '2px 8px', fontSize: '0.75rem' }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onUntrackProduct(prod.id);
                    }}
                  >
                    <Trash2 size={12} /> Untrack
                  </button>
                </div>

                <div className="product-meta" style={{ marginTop: '6px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={12} /> {prod.last_scraped_at ? new Date(prod.last_scraped_at).toLocaleTimeString() : 'Never'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
