import React from 'react';
import { Activity, RefreshCw, Layers } from 'lucide-react';

export default function Navbar({ onRunScrape, isScraping, scrapeResult }) {
  return (
    <header>
      <div className="brand">
        <Activity className="w-8 h-8" size={28} color="#2563a6" />
        <div>
          <h1>INE Store Price Tracker</h1>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Real-time automated price & stock monitoring with resilient Playwright scraping
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {scrapeResult && (
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textAlign: 'right' }}>
            <span>Last Run: {scrapeResult.successful} Succeeded / {scrapeResult.failed} Failed</span>
          </div>
        )}
        <button
          className="btn btn-primary"
          onClick={onRunScrape}
          disabled={isScraping}
        >
          <RefreshCw size={16} className={isScraping ? 'spin' : ''} />
          {isScraping ? 'Scraping Storefront...' : 'Run Scrape Now'}
        </button>
      </div>
    </header>
  );
}
