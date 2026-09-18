import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import ProductSearch from './components/ProductSearch';
import TrackedProductCard from './components/TrackedProductCard';
import PriceHistoryChart from './components/PriceHistoryChart';
import ScrapeLogsTable from './components/ScrapeLogsTable';
import { api } from './services/api';

export default function App() {
  const [trackedProducts, setTrackedProducts] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [history, setHistory] = useState([]);
  const [logs, setLogs] = useState([]);
  const [isScraping, setIsScraping] = useState(false);
  const [scrapeResult, setScrapeResult] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load tracked products list
  const loadTrackedProducts = async () => {
    try {
      const data = await api.getTrackedProducts();
      const prods = data.products || [];
      setTrackedProducts(prods);

      if (prods.length > 0 && !selectedProductId) {
        setSelectedProductId(prods[0].id);
      }
    } catch (err) {
      console.error('Failed to load tracked products:', err.message);
    } finally {
      setLoading(false);
    }
  };

  // Load history and logs for selected product
  const loadDetails = async (id) => {
    if (!id) return;
    try {
      const [histData, logsData] = await Promise.all([
        api.getProductHistory(id),
        api.getProductLogs(id)
      ]);
      setHistory(histData.history || []);
      setLogs(logsData.logs || []);
    } catch (err) {
      console.error(`Failed to load details for product ${id}:`, err.message);
    }
  };

  useEffect(() => {
    loadTrackedProducts();
  }, []);

  useEffect(() => {
    if (selectedProductId) {
      loadDetails(selectedProductId);
    }
  }, [selectedProductId]);

  const handleRunScrape = async () => {
    setIsScraping(true);
    setScrapeResult(null);

    try {
      const result = await api.triggerBatchScrape();
      setScrapeResult(result);
      await loadTrackedProducts();
      if (selectedProductId) {
        await loadDetails(selectedProductId);
      }
    } catch (err) {
      alert(`Scrape execution failed: ${err.message}`);
    } finally {
      setIsScraping(false);
    }
  };

  const handleUntrackProduct = async (id) => {
    if (!confirm('Are you sure you want to untrack this product?')) return;
    try {
      await api.untrackProduct(id);
      if (selectedProductId === id) {
        setSelectedProductId(null);
        setHistory([]);
        setLogs([]);
      }
      await loadTrackedProducts();
    } catch (err) {
      alert(`Failed to untrack product: ${err.message}`);
    }
  };

  const selectedProduct = trackedProducts.find(p => p.id === selectedProductId);
  const trackedProductIds = trackedProducts.map(p => String(p.product_id));

  return (
    <div className="app-container">
      <Navbar
        onRunScrape={handleRunScrape}
        isScraping={isScraping}
        scrapeResult={scrapeResult}
      />

      <div className="dashboard-grid">
        {/* Left Column: Search & Tracked List */}
        <div>
          <ProductSearch
            onProductTracked={loadTrackedProducts}
            trackedProductIds={trackedProductIds}
          />

          <div style={{ marginTop: '24px' }}>
            <TrackedProductCard
              products={trackedProducts}
              selectedProductId={selectedProductId}
              onSelectProduct={setSelectedProductId}
              onUntrackProduct={handleUntrackProduct}
            />
          </div>
        </div>

        {/* Right Column: Price Trend Chart & Audit Logs */}
        <div>
          <PriceHistoryChart
            history={history}
            productName={selectedProduct ? selectedProduct.product_name : 'Select a Product'}
          />

          <ScrapeLogsTable logs={logs} />
        </div>
      </div>
    </div>
  );
}
