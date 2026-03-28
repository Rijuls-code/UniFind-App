import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { products, users } from '../data/mockData';
import { MapPin, Eye, MessageCircle, Heart, Share2, ShieldCheck, Star, CheckCircle2 } from 'lucide-react';
import { Button } from '../components/ui/button';

const ListingDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = products.find(p => p.id === parseInt(id));
  const seller = users.find(u => u.id === product?.sellerId);
  const [selectedImage, setSelectedImage] = useState(0);

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      
      <div className="px-6 sm:px-8 md:px-12 lg:px-24 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left - Images */}
            <div>
              {/* Main Image */}
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden mb-4 aspect-square">
                <img
                  src={product.images[selectedImage]}
                  alt={product.title}
                  className="w-full h-full object-cover"
                  data-testid="listing-main-image"
                />
              </div>
              
              {/* Thumbnails */}
              {product.images.length > 1 && (
                <div className="flex gap-3">
                  {product.images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`flex-1 aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                        selectedImage === index ? 'border-blue-600' : 'border-slate-200 hover:border-blue-300'
                      }`}
                      data-testid={`thumbnail-${index}`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right - Details */}
            <div>
              {/* Condition Badge */}
              <div className="mb-4">
                <span className="bg-green-500 px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider text-white" data-testid="listing-condition">
                  {product.condition}
                </span>
              </div>

              {/* Title */}
              <h1 className="font-['Outfit'] text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-slate-900 mb-4" data-testid="listing-title">
                {product.title}
              </h1>

              {/* Price */}
              <div className="text-4xl font-black text-blue-600 mb-6" data-testid="listing-price">
                ₹{product.price.toLocaleString()}
              </div>

              {/* Meta Info */}
              <div className="flex items-center gap-6 mb-8 pb-8 border-b border-slate-200">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <MapPin className="h-4 w-4" />
                  <span data-testid="listing-location">{product.location}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Eye className="h-4 w-4" />
                  <span data-testid="listing-views">{product.views} views</span>
                </div>
              </div>

              {/* Seller Info */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-8">
                <div className="text-sm font-medium text-slate-600 mb-4">Seller Information</div>
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={seller?.avatar}
                    alt={seller?.name}
                    className="h-16 w-16 rounded-full object-cover"
                    data-testid="seller-avatar"
                  />
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-slate-900" data-testid="seller-name">{seller?.name}</h3>
                    <p className="text-sm text-slate-600">{seller?.college}</p>
                  </div>
                </div>
                
                {/* Trust Score - Highlighted */}
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="h-5 w-5 text-green-600" />
                      <span className="text-sm font-medium text-green-900">Trust Score</span>
                    </div>
                    <div className="text-2xl font-black text-green-600" data-testid="seller-trust-score">
                      {seller?.trustScore}%
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    <span className="font-medium">{seller?.rating}</span>
                  </div>
                  <div className="text-slate-600">{seller?.reviewCount} reviews</div>
                  <div className="text-slate-600">Member since {seller?.memberSince}</div>
                </div>
              </div>

              {/* Specifications */}
              <div className="mb-8">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Specifications</h3>
                <div className="bg-white rounded-2xl border border-slate-200 p-6">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="flex justify-between py-2 border-b border-slate-100 last:border-0">
                      <span className="text-sm text-slate-600 capitalize">{key.replace('_', ' ')}</span>
                      <span className="text-sm font-medium text-slate-900" data-testid={`spec-${key}`}>{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div className="mb-8">
                <h3 className="text-lg font-bold text-slate-900 mb-3">Description</h3>
                <p className="text-base text-slate-700 leading-relaxed" data-testid="listing-description">
                  {product.description}
                </p>
              </div>

              {/* Condition Breakdown */}
              <div className="mb-8">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Condition Breakdown</h3>
                <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-3">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                    <span className="text-sm text-slate-700">No major scratches or dents</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                    <span className="text-sm text-slate-700">All features working perfectly</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                    <span className="text-sm text-slate-700">Original accessories included</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons - Sticky on mobile */}
              <div className="sticky bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-6 -mx-6 lg:mx-0 lg:border-0 lg:p-0 lg:static">
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    size="lg"
                    className="rounded-xl border-slate-200 hover:bg-slate-50"
                    data-testid="listing-favorite-btn"
                  >
                    <Heart className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="rounded-xl border-slate-200 hover:bg-slate-50"
                    data-testid="listing-share-btn"
                  >
                    <Share2 className="h-5 w-5" />
                  </Button>
                  <Button
                    size="lg"
                    onClick={() => navigate('/chat')}
                    className="flex-1 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-all duration-200 active:scale-95"
                    data-testid="listing-chat-btn"
                  >
                    <MessageCircle className="h-5 w-5 mr-2" />
                    Chat with Seller
                  </Button>
                  <Button
                    size="lg"
                    className="flex-1 bg-green-600 text-white font-medium rounded-xl hover:bg-green-700 transition-all duration-200 active:scale-95"
                    data-testid="listing-make-offer-btn"
                  >
                    Make Offer
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingDetailPage;
