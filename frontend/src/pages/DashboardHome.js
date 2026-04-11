import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { ShoppingBag, Package, MessageCircle, BarChart3, Sparkles, List, TrendingUp, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { analyticsAPI } from '../services/api';

const DashboardHome = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [stats, setStats] = useState({
    active_listings: 0,
    sold_items: 0,
    total_views: 0,
    trust_score: 0,
    rating: 0.0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchAnalytics();
    }
  }, [user]);

  const fetchAnalytics = async () => {
    try {
      const response = await analyticsAPI.getDashboard();
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const navCards = [
    { icon: ShoppingBag, title: 'Browse & Buy', description: 'Explore listings', path: '/buyer', color: 'bg-blue-50', iconColor: 'text-blue-600', testId: 'nav-card-buyer' },
    { icon: Package, title: 'My Listings', description: 'Manage your items', path: '/seller', color: 'bg-green-50', iconColor: 'text-green-600', testId: 'nav-card-seller' },
    { icon: Sparkles, title: 'NeedBoard AI', description: 'AI-powered matching', path: '/need-board', color: 'bg-purple-50', iconColor: 'text-purple-600', testId: 'nav-card-need-board' },
    { icon: BarChart3, title: 'Analytics', description: 'Track your stats', path: '/analytics', color: 'bg-amber-50', iconColor: 'text-amber-600', testId: 'nav-card-analytics' },
    { icon: MessageCircle, title: 'Chats', description: 'Your conversations', path: '/chat', color: 'bg-pink-50', iconColor: 'text-pink-600', testId: 'nav-card-chat' },
    { icon: List, title: 'Orders', description: 'Purchase history', path: '/analytics', color: 'bg-teal-50', iconColor: 'text-teal-600', testId: 'nav-card-orders' }
  ];

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning,';
    if (hour < 18) return 'Good afternoon,';
    return 'Good evening,';
  };

  return (
    <div className="min-h-screen bg-[#f3f5f9]">
      <Header hideSearch />
      
      <div className="px-6 sm:px-8 md:px-12 lg:px-24 py-8">
        {/* Welcome Banner */}
        <div className="relative bg-gradient-to-br from-[#1e1b4b] via-[#312e81] to-[#4c1d95] rounded-3xl overflow-hidden mb-8 px-8 py-8 flex items-center justify-between">
          <div className="relative z-10">
            <p className="text-indigo-300 text-base mb-1" data-testid="dashboard-greeting">{getGreeting()}</p>
            <h1 className="font-['Outfit'] text-3xl sm:text-4xl font-bold tracking-tight text-white mb-1" data-testid="dashboard-welcome-title">
              {user?.name || 'Welcome'}! 👋
            </h1>
            <p className="text-indigo-300 text-sm">Your campus marketplace dashboard</p>
          </div>
          <div className="relative z-10 bg-white/10 border border-white/20 rounded-2xl px-6 py-4 text-center min-w-[120px]">
            <div className="text-indigo-200 text-xs font-medium mb-1">Trust Score</div>
            <div className="text-white text-3xl font-black" data-testid="dashboard-trust-score">
              {stats.trust_score || 0}%
            </div>
            <div className="flex items-center justify-center mt-1">
              <div className="h-7 w-7 rounded-full bg-white/20 flex items-center justify-center">
                <TrendingUp className="h-4 w-4 text-white" />
              </div>
            </div>
          </div>
          {/* Decorative blobs */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/20 rounded-full -translate-y-1/2 translate-x-1/4 blur-3xl" />
          <div className="absolute bottom-0 left-1/3 w-48 h-48 bg-indigo-500/20 rounded-full translate-y-1/2 blur-2xl" />
        </div>

        {/* Quick Stats */}
        <div className="mb-8">
          <h2 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
            <span className="w-1 h-5 bg-[#4f46e5] rounded-full inline-block" />
            Quick Stats
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 text-center shadow-sm" data-testid="stat-bought">
              <div className="text-3xl font-black text-[#4f46e5] mb-1">{stats.total_purchases || 0}</div>
              <div className="text-sm text-slate-500">Items Bought</div>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 p-6 text-center shadow-sm" data-testid="stat-sold">
              <div className="text-3xl font-black text-[#059669] mb-1">{stats.sold_items || 0}</div>
              <div className="text-sm text-slate-500">Items Sold</div>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 p-6 text-center shadow-sm" data-testid="stat-rating">
              <div className="text-3xl font-black text-[#d97706] mb-1">{stats.rating?.toFixed(1) || '0.0'} ⭐</div>
              <div className="text-sm text-slate-500">Rating</div>
            </div>
          </div>
        </div>

        {/* Quick Access */}
        <div className="mb-8">
          <h2 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
            <span className="w-1 h-5 bg-[#4f46e5] rounded-full inline-block" />
            Quick Access
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {navCards.map((card) => {
              const Icon = card.icon;
              return (
                <div
                  key={card.title}
                  onClick={() => navigate(card.path)}
                  className="group bg-white rounded-2xl border border-slate-200 p-5 cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:border-indigo-400/40 hover:shadow-lg hover:shadow-indigo-500/10 text-center"
                  data-testid={card.testId}
                >
                  <div className={`${card.color} h-12 w-12 rounded-xl flex items-center justify-center mb-3 mx-auto group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className={`h-6 w-6 ${card.iconColor}`} />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 mb-0.5">{card.title}</h3>
                  <p className="text-xs text-slate-500">{card.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Getting Started Tips */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span className="w-1 h-5 bg-[#4f46e5] rounded-full inline-block" />
              Getting Started
            </h2>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm p-6">
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-xl flex items-center justify-center bg-blue-50 shrink-0">
                  <ShoppingBag className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <div className="text-sm font-medium text-slate-900">Browse Products</div>
                  <div className="text-xs text-slate-500 mt-1">
                    Explore listings from verified students on your campus
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-xl flex items-center justify-center bg-green-50 shrink-0">
                  <Package className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <div className="text-sm font-medium text-slate-900">List Your Items</div>
                  <div className="text-xs text-slate-500 mt-1">
                    Sell textbooks, electronics, and more to fellow students
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-xl flex items-center justify-center bg-purple-50 shrink-0">
                  <Sparkles className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <div className="text-sm font-medium text-slate-900">Try NeedBoard AI</div>
                  <div className="text-xs text-slate-500 mt-1">
                    Post what you need and get AI-powered product matches
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
