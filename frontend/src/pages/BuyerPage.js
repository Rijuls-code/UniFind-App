import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import ProductCard from '../components/ProductCard';
import { ProductCardSkeleton } from '../components/SkeletonLoader';
import { categories } from '../data/mockData';
import { productsAPI } from '../services/api';
import { SlidersHorizontal } from 'lucide-react';
import { toast } from 'sonner';

const BuyerPage = () => {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [priceRange, setPriceRange] = useState('all');
  const [condition, setCondition] = useState('all');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productsAPI.getAll();
      setProducts(response.data);
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  // Filter products
  const filteredProducts = products.filter(product => {
    if (selectedCategory !== 'All' && product.category !== selectedCategory) return false;
    
    if (priceRange === 'under-20k' && product.price >= 20000) return false;
    if (priceRange === '20k-50k' && (product.price < 20000 || product.price >= 50000)) return false;
    if (priceRange === 'above-50k' && product.price < 50000) return false;
    
    if (condition !== 'all' && product.condition !== condition) return false;
    
    return true;
  });

  return (
    <div className="min-h-screen bg-[#f3f5f9]">
      <Header />
      
      <div className="px-6 sm:px-8 md:px-12 lg:px-24 py-8">
        {/* Filters Section */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-5">
            <SlidersHorizontal className="h-5 w-5 text-slate-600" />
            <h2 className="text-base font-bold text-slate-900">Filters</h2>
          </div>

          {/* Category Chips */}
          <div className="mb-4">
            <div className="text-xs font-medium text-slate-500 mb-2 uppercase tracking-wide">Category</div>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    selectedCategory === cat
                      ? 'bg-[#4f46e5] text-white shadow-md shadow-indigo-500/20'
                      : 'bg-white text-slate-700 border border-slate-200 hover:border-indigo-300'
                  }`}
                  data-testid={`category-filter-${cat.toLowerCase()}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Price & Condition Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="text-xs font-medium text-slate-500 mb-2 uppercase tracking-wide">Price Range</div>
              <div className="flex flex-wrap gap-2">
                {[
                  { key: 'all', label: 'All' },
                  { key: 'under-20k', label: 'Under ₹20k' },
                  { key: '20k-50k', label: '₹20k - ₹50k' },
                  { key: 'above-50k', label: 'Above ₹50k' },
                ].map(({ key, label }) => (
                  <button
                    key={key}
                    onClick={() => setPriceRange(key)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                      priceRange === key
                        ? 'bg-[#4f46e5] text-white'
                        : 'bg-white text-slate-700 border border-slate-200 hover:border-indigo-300'
                    }`}
                    data-testid={`price-filter-${key}`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="text-xs font-medium text-slate-500 mb-2 uppercase tracking-wide">Condition</div>
              <div className="flex flex-wrap gap-2">
                {[
                  { key: 'all', label: 'All' },
                  { key: 'Like New', label: 'Like New' },
                  { key: 'Excellent', label: 'Excellent' },
                  { key: 'Good', label: 'Good' },
                ].map(({ key, label }) => (
                  <button
                    key={key}
                    onClick={() => setCondition(key)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                      condition === key
                        ? 'bg-[#4f46e5] text-white'
                        : 'bg-white text-slate-700 border border-slate-200 hover:border-indigo-300'
                    }`}
                    data-testid={`condition-filter-${key.toLowerCase().replace(' ', '-')}`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-5">
          <p className="text-sm text-slate-600" data-testid="results-count">
            Showing <span className="font-bold text-slate-900">{filteredProducts.length}</span> results
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => <ProductCardSkeleton key={i} />)
          ) : (
            filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          )}
        </div>

        {filteredProducts.length === 0 && !loading && (
          <div className="text-center py-20">
            <p className="text-lg text-slate-500" data-testid="no-results-message">No products found matching your filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BuyerPage;
