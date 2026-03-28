import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { ArrowLeft, ArrowRight, Upload, X } from 'lucide-react';
import { Button } from '../components/ui/button';
import { categories } from '../data/mockData';

const PostListingPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    price: '',
    condition: '',
    description: '',
    location: '',
    images: []
  });

  const conditions = ['Like New', 'Excellent', 'Good', 'Fair'];

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = () => {
    // Mock submit - navigate to seller page
    navigate('/seller');
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    // Mock image preview
    setFormData({ ...formData, images: [...formData.images, ...files.map(f => URL.createObjectURL(f))] });
  };

  const removeImage = (index) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    setFormData({ ...formData, images: newImages });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header hideSearch />
      
      <div className="px-6 sm:px-8 md:px-12 lg:px-24 py-12">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <h1 className="font-['Outfit'] text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-slate-900 mb-2" data-testid="post-listing-title">
              Post New Listing
            </h1>
            <p className="text-base text-slate-600">Fill in the details to list your item</p>
          </div>

          {/* Progress Indicator */}
          <div className="flex items-center justify-between mb-12">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center flex-1">
                <div className={`h-10 w-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                  s <= step ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-500'
                }`} data-testid={`step-indicator-${s}`}>
                  {s}
                </div>
                {s < 3 && (
                  <div className={`flex-1 h-1 mx-2 rounded transition-all ${
                    s < step ? 'bg-blue-600' : 'bg-slate-200'
                  }`} />
                )}
              </div>
            ))}
          </div>

          {/* Form */}
          <div className="bg-white rounded-2xl border border-slate-200 p-8">
            {/* Step 1: Basic Details */}
            {step === 1 && (
              <div className="space-y-6" data-testid="step-1-form">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2" htmlFor="title">
                    Product Title
                  </label>
                  <input
                    id="title"
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g., MacBook Air M2 2023"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                    data-testid="title-input"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2" htmlFor="category">
                    Category
                  </label>
                  <select
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                    data-testid="category-select"
                  >
                    <option value="">Select a category</option>
                    {categories.filter(c => c !== 'All').map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2" htmlFor="price">
                    Price (₹)
                  </label>
                  <input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="75000"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                    data-testid="price-input"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2" htmlFor="location">
                    Location
                  </label>
                  <input
                    id="location"
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="Delhi"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                    data-testid="location-input"
                  />
                </div>
              </div>
            )}

            {/* Step 2: Condition & Description */}
            {step === 2 && (
              <div className="space-y-6" data-testid="step-2-form">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-3">
                    Condition
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {conditions.map((cond) => (
                      <button
                        key={cond}
                        type="button"
                        onClick={() => setFormData({ ...formData, condition: cond })}
                        className={`p-4 rounded-xl border-2 font-medium transition-all ${
                          formData.condition === cond
                            ? 'border-blue-600 bg-blue-50 text-blue-600'
                            : 'border-slate-200 text-slate-700 hover:border-blue-300'
                        }`}
                        data-testid={`condition-btn-${cond.toLowerCase().replace(' ', '-')}`}
                      >
                        {cond}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2" htmlFor="description">
                    Description
                  </label>
                  <textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe your product in detail..."
                    rows="6"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all resize-none"
                    data-testid="description-textarea"
                  />
                </div>
              </div>
            )}

            {/* Step 3: Images */}
            {step === 3 && (
              <div className="space-y-6" data-testid="step-3-form">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-3">
                    Upload Images
                  </label>
                  
                  {/* Upload Area */}
                  <label className="block border-2 border-dashed border-slate-300 rounded-xl p-12 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50/50 transition-all" data-testid="image-upload-area">
                    <Upload className="h-12 w-12 text-slate-400 mx-auto mb-3" />
                    <div className="text-sm text-slate-600 mb-1">Click to upload images</div>
                    <div className="text-xs text-slate-500">PNG, JPG up to 10MB</div>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      data-testid="image-upload-input"
                    />
                  </label>

                  {/* Image Previews */}
                  {formData.images.length > 0 && (
                    <div className="grid grid-cols-3 gap-3 mt-4">
                      {formData.images.map((img, index) => (
                        <div key={index} className="relative aspect-square rounded-xl overflow-hidden bg-slate-100 group">
                          <img src={img} alt="" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            data-testid={`remove-image-${index}`}
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-8 border-t border-slate-200">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={step === 1}
                className="rounded-xl"
                data-testid="back-btn"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              {step < 3 ? (
                <Button
                  onClick={handleNext}
                  className="bg-blue-600 text-white font-medium px-6 py-3 rounded-xl hover:bg-blue-700 transition-all duration-200 active:scale-95"
                  data-testid="next-btn"
                >
                  Next
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  className="bg-green-600 text-white font-medium px-6 py-3 rounded-xl hover:bg-green-700 transition-all duration-200 active:scale-95"
                  data-testid="submit-listing-btn"
                >
                  Publish Listing
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostListingPage;
