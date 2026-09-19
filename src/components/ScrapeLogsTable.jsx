import React from 'react';
import { ShieldCheck } from 'lucide-react';

export default function ScrapeLogsTable({ logs = [] }) {
  const getBadgeClass = (status) => {
    switch (status) {
      case 'SUCCESS': return 'badge-success';
      case 'RETRY': return 'badge-retry';
      case 'FAILED': return 'badge-failed';
      default: return 'badge-pending';
    }
  };

  return (
    <div className="card" style={{ marginTop: '24px' }}>
      <h2 className="card-title">
        <ShieldCheck size={18} color="#2563a6" /> Scraper Audit Logs ({logs.length})
      </h2>

      {logs.length === 0 ? (
        <div style={{ color: 'var(--text-secondary)', padding: '20px 0', textAlign: 'center', fontSize: '0.85rem' }}>
          No scrape audit logs recorded yet. Run a scrape to view execution logs.
        </div>
      ) : (
        <div className="table-container" style={{ maxHeight: '300px', overflowY: 'auto' }}>
          <table>
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Attempt</th>
                <th>Status</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Message / Details</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id}>
                  <td style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    {new Date(log.started_at).toLocaleString()}
                  </td>
                  <td style={{ fontWeight: '600' }}>#{log.attempt_number}</td>
                  <td>
                    <span className={`badge ${getBadgeClass(log.status)}`}>
                      {log.status}
                    </span>
                  </td>
                  <td style={{ fontWeight: '600', color: log.extracted_price ? '#2563a6' : 'var(--text-muted)' }}>
                    {log.extracted_price ? `₹${log.extracted_price.toLocaleString('en-IN')}` : '-'}
                  </td>
                  <td style={{ fontSize: '0.8rem' }}>
                    {log.extracted_stock || '-'}
                  </td>
                  <td style={{ fontSize: '0.8rem', color: log.status === 'FAILED' ? '#b42318' : 'var(--text-secondary)' }}>
                    {log.message || '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
