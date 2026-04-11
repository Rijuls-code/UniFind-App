import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import { TrendingUp, ShoppingBag, Package, DollarSign, Star } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { analyticsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const AnalyticsPage = () => {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await analyticsAPI.getDashboard();
      setAnalytics(response.data);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  };
  // Mock chart data
  const salesData = [
    { month: 'Jan', sales: 4 },
    { month: 'Feb', sales: 3 },
    { month: 'Mar', sales: 5 },
    { month: 'Apr', sales: 7 },
    { month: 'May', sales: 6 },
    { month: 'Jun', sales: 8 }
  ];

  const earningsData = [
    { month: 'Jan', amount: 15000 },
    { month: 'Feb', amount: 22000 },
    { month: 'Mar', amount: 18000 },
    { month: 'Apr', amount: 28000 },
    { month: 'May', amount: 25000 },
    { month: 'Jun', amount: 32000 }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        <div className="flex items-center justify-center h-96">
          <div className="text-lg text-slate-600">Loading analytics...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      
      <div className="px-6 sm:px-8 md:px-12 lg:px-24 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="font-['Outfit'] text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-slate-900 mb-2" data-testid="analytics-title">
            Analytics Dashboard
          </h1>
          <p className="text-base text-slate-600">Track your marketplace performance</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-2xl border border-slate-200 p-6" data-testid="metric-bought">
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm font-medium text-slate-600">Items Bought</div>
              <div className="bg-blue-50 h-10 w-10 rounded-xl flex items-center justify-center">
                <ShoppingBag className="h-5 w-5 text-blue-600" />
              </div>
            </div>
            <div className="text-3xl font-black text-slate-900 mb-1">{analytics?.total_purchases || 0}</div>
            <div className="flex items-center gap-1 text-sm text-green-600">
              <TrendingUp className="h-4 w-4" />
              <span>+12% from last month</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6" data-testid="metric-sold">
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm font-medium text-slate-600">Items Sold</div>
              <div className="bg-green-50 h-10 w-10 rounded-xl flex items-center justify-center">
                <Package className="h-5 w-5 text-green-600" />
              </div>
            </div>
            <div className="text-3xl font-black text-slate-900 mb-1">{analytics?.sold_items || 0}</div>
            <div className="flex items-center gap-1 text-sm text-green-600">
              <TrendingUp className="h-4 w-4" />
              <span>+8% from last month</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6" data-testid="metric-earnings">
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm font-medium text-slate-600">Total Earnings</div>
              <div className="bg-amber-50 h-10 w-10 rounded-xl flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-amber-600" />
              </div>
            </div>
            <div className="text-3xl font-black text-slate-900 mb-1">₹0</div>
            <div className="flex items-center gap-1 text-sm text-green-600">
              <TrendingUp className="h-4 w-4" />
              <span>+15% from last month</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6" data-testid="metric-rating">
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm font-medium text-slate-600">Avg Rating</div>
              <div className="bg-purple-50 h-10 w-10 rounded-xl flex items-center justify-center">
                <Star className="h-5 w-5 text-purple-600" />
              </div>
            </div>
            <div className="text-3xl font-black text-slate-900 mb-1">{analytics?.rating?.toFixed(1) || '0.0'}</div>
            <div className="flex items-center gap-1 text-sm text-green-600">
              <TrendingUp className="h-4 w-4" />
              <span>Excellent performance</span>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
          {/* Sales Chart */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Monthly Sales</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="month" stroke="#64748B" />
                <YAxis stroke="#64748B" />
                <Tooltip />
                <Bar dataKey="sales" fill="#2563EB" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Earnings Chart */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Monthly Earnings</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={earningsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="month" stroke="#64748B" />
                <YAxis stroke="#64748B" />
                <Tooltip />
                <Line type="monotone" dataKey="amount" stroke="#10B981" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Financial Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-8 text-white" data-testid="earnings-card">
            <div className="text-sm font-medium text-blue-100 mb-2">Total Earnings</div>
            <div className="text-4xl font-black mb-4">₹0</div>
            <div className="text-sm text-blue-100">From {analytics?.sold_items || 0} successful sales</div>
          </div>

          <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-2xl p-8 text-white" data-testid="savings-card">
            <div className="text-sm font-medium text-green-100 mb-2">Total Savings</div>
            <div className="text-4xl font-black mb-4">₹0</div>
            <div className="text-sm text-green-100">From {analytics?.total_purchases || 0} smart purchases</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
