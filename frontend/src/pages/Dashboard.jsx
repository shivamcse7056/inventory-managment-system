import React, { useState, useEffect } from 'react';
import { 
  Package, 
  Tags, 
  Layers, 
  AlertTriangle, 
  XOctagon, 
  Activity, 
  ArrowUpRight,
  TrendingUp,
  Inbox
} from 'lucide-react';
import Layout from '../components/Layout';
import { getDashboardStatsApi } from '../services/product.service';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await getDashboardStatsApi();
        if (res.success) {
          setStats(res.data);
        }
      } catch (err) {
        setError(err.message || 'Failed to fetch dashboard metrics');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <Layout title="Dashboard Overview">
        <div className="flex h-[60vh] items-center justify-center">
          <span className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></span>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout title="Dashboard Overview">
        <div className="p-4 bg-rose-500/10 border border-rose-500/30 text-rose-400 rounded-xl max-w-xl mx-auto mt-10">
          <p className="font-semibold text-center">{error}</p>
        </div>
      </Layout>
    );
  }

  const barChartData = stats.categoryDistribution.map(cat => ({
    name: cat.name,
    Products: cat.count,
    Stock: cat.totalQuantity
  }));

  const pieChartData = [
    { name: 'In Stock', value: stats.totalProducts - (stats.lowStockItems + stats.outOfStockItems), color: '#10b981' },
    { name: 'Low Stock', value: stats.lowStockItems, color: '#f59e0b' },
    { name: 'Out of Stock', value: stats.outOfStockItems, color: '#ef4444' }
  ].filter(item => item.value > 0);

  const cardItems = [
    {
      title: 'Total Products',
      value: stats.totalProducts,
      icon: Package,
      gradient: 'from-blue-500 to-indigo-500',
      label: 'Unique items stored'
    },
    {
      title: 'Total Categories',
      value: stats.totalCategories,
      icon: Tags,
      gradient: 'from-purple-500 to-pink-500',
      label: 'Product classifications'
    },
    {
      title: 'Total Stock Quantity',
      value: stats.totalStockQuantity,
      icon: Layers,
      gradient: 'from-emerald-500 to-teal-500',
      label: 'Cumulative units in stock'
    },
    {
      title: 'Low Stock Items',
      value: stats.lowStockItems,
      icon: AlertTriangle,
      gradient: 'from-amber-500 to-orange-500',
      label: 'Requires attention (≤10 units)'
    },
    {
      title: 'Out of Stock Items',
      value: stats.outOfStockItems,
      icon: XOctagon,
      gradient: 'from-rose-500 to-red-600',
      label: 'Depleted stock items'
    }
  ];

  return (
    <Layout title="Dashboard Overview">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {cardItems.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div 
              key={idx} 
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 hover:shadow-lg transition-all duration-300 group select-none relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl opacity-[0.03] dark:opacity-[0.05] rounded-full group-hover:scale-110 transition-transform duration-300"></div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{card.title}</span>
                <div className={`p-2.5 bg-gradient-to-tr ${card.gradient} rounded-xl text-white shadow-sm`}>
                  <Icon size={18} />
                </div>
              </div>
              <div className="mt-4">
                <h3 className="text-3xl font-extrabold tracking-tight text-slate-800 dark:text-white">
                  {card.value}
                </h3>
                <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">{card.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-white">Stock Level by Category</h3>
              <p className="text-xs text-slate-400">Inventory volume distribution across classifications</p>
            </div>
            <TrendingUp size={20} className="text-slate-400" />
          </div>
          <div className="h-80 w-full">
            {barChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#33415520" />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(15, 23, 42, 0.9)', 
                      borderColor: '#334155', 
                      borderRadius: '8px',
                      color: '#fff',
                      fontSize: '12px'
                    }} 
                  />
                  <Bar dataKey="Stock" fill="#10b981" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Products" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-400">
                <Inbox size={40} className="mb-2 stroke-1" />
                <span className="text-sm">No data available</span>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-white">Status Breakdown</h3>
            <p className="text-xs text-slate-400">Proportion of product stock situations</p>
          </div>
          <div className="h-56 w-full relative flex items-center justify-center my-4">
            {pieChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieChartData.map((entry, idx) => (
                      <Cell key={`cell-${idx}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(15, 23, 42, 0.9)', 
                      borderColor: '#334155', 
                      borderRadius: '8px',
                      color: '#fff',
                      fontSize: '12px'
                    }} 
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-400">
                <Inbox size={40} className="mb-2 stroke-1" />
                <span className="text-sm">No data available</span>
              </div>
            )}
            {pieChartData.length > 0 && (
              <div className="absolute flex flex-col items-center">
                <span className="text-2xl font-black text-slate-800 dark:text-white">
                  {stats.totalProducts}
                </span>
                <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Products</span>
              </div>
            )}
          </div>
          <div className="space-y-2.5">
            {pieChartData.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-sm px-1.5">
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></span>
                  <span className="text-slate-600 dark:text-slate-400 font-medium">{item.name}</span>
                </div>
                <span className="font-bold text-slate-800 dark:text-white">
                  {item.value} ({Math.round((item.value / stats.totalProducts) * 100)}%)
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-white">Recent Transactions</h3>
            <p className="text-xs text-slate-400">Latest stock movements and adjustments logs</p>
          </div>
          <Activity size={20} className="text-emerald-500 animate-pulse" />
        </div>

        <div className="overflow-x-auto">
          {stats.recentActivities.length > 0 ? (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  <th className="pb-3 font-semibold">Product</th>
                  <th className="pb-3 font-semibold">SKU</th>
                  <th className="pb-3 font-semibold">Transaction Type</th>
                  <th className="pb-3 font-semibold">Qty Change</th>
                  <th className="pb-3 font-semibold">End Stock</th>
                  <th className="pb-3 font-semibold">Operator</th>
                  <th className="pb-3 font-semibold text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
                {stats.recentActivities.map((act) => (
                  <tr key={act._id} className="text-slate-600 dark:text-slate-300 hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                    <td className="py-3.5 font-medium text-slate-800 dark:text-white">{act.product?.name || 'Deleted Product'}</td>
                    <td className="py-3.5"><code className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded text-xs">{act.product?.sku || 'N/A'}</code></td>
                    <td className="py-3.5">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        act.type === 'Stock In' ? 'bg-emerald-500/10 text-emerald-500' :
                        act.type === 'Stock Out' ? 'bg-rose-500/10 text-rose-500' :
                        'bg-blue-500/10 text-blue-500'
                      }`}>
                        {act.type}
                      </span>
                    </td>
                    <td className={`py-3.5 font-bold ${act.quantityChanged > 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                      {act.quantityChanged > 0 ? `+${act.quantityChanged}` : act.quantityChanged}
                    </td>
                    <td className="py-3.5 font-semibold">{act.newQuantity}</td>
                    <td className="py-3.5 text-xs font-medium text-slate-400">{act.performedBy?.name || 'System'}</td>
                    <td className="py-3.5 text-right text-xs text-slate-400 font-medium">
                      {new Date(act.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="py-12 flex flex-col items-center justify-center text-slate-400">
              <History size={48} className="mb-2 stroke-1" />
              <p className="text-sm">No transaction records found</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
