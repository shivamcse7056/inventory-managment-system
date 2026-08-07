import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { getTransactionLogsApi } from '../services/product.service';
import { History, Search, Filter, Inbox } from 'lucide-react';

const StockLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [productSearch, setProductSearch] = useState('');

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        page,
        limit: 12,
      });
      const res = await getTransactionLogsApi(queryParams.toString());
      if (res.success) {
        setLogs(res.data);
        setTotalPages(res.pagination.pages);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch transaction logs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [page]);

  const filteredLogs = logs.filter(log => {
    if (!productSearch) return true;
    const nameMatch = log.product?.name?.toLowerCase().includes(productSearch.toLowerCase());
    const skuMatch = log.product?.sku?.toLowerCase().includes(productSearch.toLowerCase());
    const notesMatch = log.notes?.toLowerCase().includes(productSearch.toLowerCase());
    return nameMatch || skuMatch || notesMatch;
  });

  return (
    <Layout title="Inventory Transaction Logs">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 select-none">
        <div className="relative w-full sm:max-w-xs">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
            <Search size={18} />
          </span>
          <input
            type="text"
            placeholder="Search logs by product name, SKU, notes..."
            value={productSearch}
            onChange={(e) => setProductSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-emerald-500 transition-colors text-sm"
          />
        </div>

        <div className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-900 text-slate-500 dark:text-slate-400 rounded-lg text-xs font-semibold">
          <History size={14} className="text-emerald-500" />
          <span>Audit Logs History Tracker</span>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden select-none">
        {loading ? (
          <div className="flex h-[40vh] items-center justify-center">
            <span className="w-8 h-8 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin"></span>
          </div>
        ) : filteredLogs.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-400 uppercase tracking-wider bg-slate-50/50 dark:bg-slate-950/20">
                  <th className="px-6 py-4">Timestamp</th>
                  <th className="px-6 py-4">Product Name</th>
                  <th className="px-6 py-4">SKU Code</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">Changed Qty</th>
                  <th className="px-6 py-4">Ending Stock</th>
                  <th className="px-6 py-4">operator</th>
                  <th className="px-6 py-4">transaction notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
                {filteredLogs.map((log) => (
                  <tr key={log._id} className="text-slate-600 dark:text-slate-300 hover:bg-slate-50/40 dark:hover:bg-slate-800/10 transition-colors">
                    <td className="px-6 py-4.5 text-xs text-slate-400 font-medium">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>

                    <td className="px-6 py-4.5 font-bold text-slate-800 dark:text-white capitalize">
                      {log.product?.name || <span className="text-slate-400 italic">Deleted Product</span>}
                    </td>

                    <td className="px-6 py-4.5">
                      <code className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded text-xs">
                        {log.product?.sku || 'N/A'}
                      </code>
                    </td>

                    <td className="px-6 py-4.5">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        log.type === 'Stock In' ? 'bg-emerald-500/10 text-emerald-500' :
                        log.type === 'Stock Out' ? 'bg-rose-500/10 text-rose-500' :
                        'bg-blue-500/10 text-blue-500'
                      }`}>
                        {log.type}
                      </span>
                    </td>

                    <td className={`px-6 py-4.5 font-bold ${log.quantityChanged > 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                      {log.quantityChanged > 0 ? `+${log.quantityChanged}` : log.quantityChanged}
                    </td>

                    <td className="px-6 py-4.5 font-extrabold text-slate-800 dark:text-white">
                      {log.newQuantity}
                    </td>

                    <td className="px-6 py-4.5 text-xs font-medium text-slate-400 capitalize">
                      {log.performedBy?.name || 'System'}
                    </td>

                    <td className="px-6 py-4.5 text-slate-500 dark:text-slate-400 text-xs italic max-w-xs truncate" title={log.notes}>
                      {log.notes || 'No description provided'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-20 flex flex-col items-center justify-center text-slate-400">
            <Inbox size={48} className="mb-3 stroke-1" />
            <p className="text-sm">No transaction records found</p>
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 px-6 py-4">
            <button
              onClick={() => setPage(p => Math.max(p - 1, 1))}
              disabled={page === 1}
              className="px-4 py-2 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-800/40 rounded-xl text-xs font-semibold transition-colors"
            >
              Previous
            </button>
            <span className="text-xs text-slate-400 font-semibold">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage(p => Math.min(p + 1, totalPages))}
              disabled={page === totalPages}
              className="px-4 py-2 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-800/40 rounded-xl text-xs font-semibold transition-colors"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default StockLogs;
