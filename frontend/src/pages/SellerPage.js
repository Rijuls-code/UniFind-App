import React, { useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { Edit2, Trash2, CheckCircle2, Plus, Eye, Search, ArrowUpDown, ChevronDown } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useAuth } from '../context/AuthContext';
import { productsAPI } from '../services/api';
import { toast } from 'sonner';

const categories = ['All', 'Electronics', 'Books', 'Furniture', 'Clothing', 'Sports', 'Other'];

const SellerPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [statusFilter, setStatusFilter] = useState('all');
  const [myListings, setMyListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchMyListings();
    }
  }, [user]);

  const fetchMyListings = async () => {
    try {
      setLoading(true);
      const response = await productsAPI.getUserProducts(user.id);
      setMyListings(response.data);
    } catch (error) {
      toast.error('Failed to fetch your listings');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this listing?')) return;
    
    try {
      await productsAPI.delete(productId);
      toast.success('Listing deleted successfully');
      fetchMyListings();
    } catch (error) {
      toast.error('Failed to delete listing');
    }
  };

  const filteredListings = useMemo(() => {
    return myListings.filter((product) => {
      const matchesSearch =
        query.trim().length === 0 ||
        product.title.toLowerCase().includes(query.toLowerCase()) ||
        product.category.toLowerCase().includes(query.toLowerCase());

      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;

      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'active' && product.status === 'active') ||
        (statusFilter === 'sold' && product.status === 'sold');

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [myListings, query, selectedCategory, statusFilter]);

  const activeCount = myListings.filter((item) => item.status === 'active').length;
  const soldCount = myListings.filter((item) => item.status === 'sold').length;

  return (
    <div className="min-h-screen bg-[#f3f5f9]">
      <Header />
      
      <div className="px-6 sm:px-8 md:px-12 lg:px-24 py-10">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-['Outfit'] text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-slate-900 mb-2" data-testid="seller-page-title">
              My Listings
            </h1>
            <p className="text-base text-slate-500">Manage your campus products</p>
          </div>
          <Button
            onClick={() => navigate('/post-listing')}
            className="h-12 bg-[#5b3ee4] text-white font-semibold px-7 rounded-2xl hover:bg-[#4b34c8] shadow-lg shadow-indigo-500/20 transition-all duration-200 active:scale-95"
            data-testid="post-new-listing-btn"
          >
            <Plus className="h-5 w-5 mr-2" />
            New Listing
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-3xl border border-slate-200 px-6 py-5 text-center shadow-sm" data-testid="seller-stat-active">
            <div className="text-[42px] leading-none font-bold text-[#4f46e5] mb-2">{activeCount}</div>
            <div className="text-2xl font-black text-slate-900">Active</div>
          </div>
          <div className="bg-white rounded-3xl border border-slate-200 px-6 py-5 text-center shadow-sm" data-testid="seller-stat-sold">
            <div className="text-[42px] leading-none font-bold text-[#059669] mb-2">{soldCount}</div>
            <div className="text-2xl font-black text-slate-900">Sold</div>
          </div>
          <div className="bg-white rounded-3xl border border-slate-200 px-6 py-5 text-center shadow-sm" data-testid="seller-stat-revenue">
            <div className="text-[42px] leading-none font-bold text-[#d97706] mb-2">₹0k</div>
            <div className="text-2xl font-black text-slate-900">Revenue</div>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search your listings..."
            className="w-full bg-white rounded-2xl border border-slate-200 pl-14 pr-4 py-4 text-lg text-slate-800 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
            data-testid="seller-search-input"
          />
        </div>

        {/* Category + Status + Sort */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-8">
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2.5 rounded-2xl text-sm font-medium border transition-all ${
                  selectedCategory === cat
                    ? 'bg-[#4f46e5] text-white border-[#4f46e5] shadow-md shadow-indigo-500/20'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-indigo-300'
                }`}
                data-testid={`seller-category-filter-${cat.toLowerCase()}`}
              >
                {cat}
              </button>
            ))}

            <div className="flex items-center gap-2 ml-2">
              {[
                { key: 'all', label: 'All' },
                { key: 'active', label: 'Active' },
                { key: 'sold', label: 'Sold' },
              ].map((status) => (
                <button
                  key={status.key}
                  onClick={() => setStatusFilter(status.key)}
                  className={`px-5 py-2.5 rounded-2xl text-sm font-medium border transition-all ${
                    statusFilter === status.key
                      ? 'bg-[#4f46e5] text-white border-[#4f46e5] shadow-md shadow-indigo-500/20'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-indigo-300'
                  }`}
                  data-testid={`seller-status-filter-${status.key}`}
                >
                  {status.label}
                </button>
              ))}
            </div>
          </div>

          <button
            className="h-12 px-5 rounded-2xl bg-white border border-slate-200 text-slate-700 text-base font-medium flex items-center gap-3 hover:border-slate-300"
            data-testid="seller-sort-btn"
          >
            <ArrowUpDown className="h-5 w-5" />
            Sort
            <ChevronDown className="h-4 w-4" />
          </button>
        </div>

        <p className="text-2xl font-semibold text-slate-800 mb-5" data-testid="seller-listings-count">
          {filteredListings.length} listings
        </p>

        {/* Listings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredListings.map((product) => (
            <div
              key={product.id}
              className="group bg-white rounded-3xl border border-slate-200 overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-indigo-400/40 hover:shadow-lg hover:shadow-indigo-500/10"
              data-testid={`seller-listing-${product.id}`}
            >
              {/* Image */}
              <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                <img
                  src={product.images[0]}
                  alt={product.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {/* Views Badge */}
                <div className="absolute top-3 right-3 bg-black/55 px-2.5 py-1 rounded-xl flex items-center gap-1.5">
                  <Eye className="h-3 w-3 text-white" />
                  <span className="text-xs text-white font-semibold">{product.views}</span>
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="text-lg font-bold text-slate-900 mb-2 line-clamp-1" data-testid="seller-listing-title">
                  {product.title}
                </h3>
                <div className="text-2xl font-black text-[#4f46e5] mb-4" data-testid="seller-listing-price">
                  ₹{product.price.toLocaleString()}
                </div>

                {/* Condition & Location */}
                <div className="flex items-center gap-2 mb-5 pb-5 border-b border-slate-100">
                  <span className="bg-green-100 text-green-700 px-2 py-1 rounded-lg text-xs font-semibold">
                    {product.condition}
                  </span>
                  <span className="text-sm text-slate-500">{product.location}</span>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-3 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/edit-listing/${product.id}`);
                    }}
                    className="rounded-xl border-slate-200 hover:border-indigo-400 hover:bg-indigo-50 transition-all"
                    data-testid="seller-listing-edit-btn"
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(product.id);
                    }}
                    className="rounded-xl border-slate-200 hover:border-red-500 hover:bg-red-50 hover:text-red-600 transition-all"
                    data-testid="seller-listing-delete-btn"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={async (e) => {
                      e.stopPropagation();
                      try {
                        await productsAPI.update(product.id, { status: 'sold' });
                        toast.success('Marked as sold');
                        fetchMyListings();
                      } catch (error) {
                        toast.error('Failed to update status');
                      }
                    }}
                    className="rounded-xl border-slate-200 hover:border-green-500 hover:bg-green-50 hover:text-green-600 transition-all"
                    data-testid="seller-listing-sold-btn"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredListings.length === 0 && (
          <div className="text-center py-20">
            <p className="text-lg text-slate-500 mb-6">No listings found for the selected filters</p>
            <Button
              onClick={() => {
                setSelectedCategory('All');
                setStatusFilter('all');
                setQuery('');
              }}
              className="bg-blue-600 text-white"
              data-testid="empty-post-listing-btn"
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerPage;
