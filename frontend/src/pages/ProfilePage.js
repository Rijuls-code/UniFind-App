import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { userStats, reviews } from '../data/mockData';
import { useAuth } from '../context/AuthContext';
import {
  Shield,
  Star,
  Award,
  Calendar,
  GraduationCap,
  Mail,
  GitBranch,
  Pencil,
  LogOut,
  Sun,
  CheckCircle2,
  User,
} from 'lucide-react';
import { Button } from '../components/ui/button';

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  const currentUser = user;

  return (
    <div className="min-h-screen bg-[#f3f5f9]">
      <Header />
      
      <div className="px-6 sm:px-8 md:px-12 lg:px-24 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-end mb-5">
            <button
              className="bg-white border border-slate-200 rounded-2xl h-12 px-4 text-slate-700 text-base font-medium flex items-center gap-3"
              data-testid="profile-theme-toggle"
            >
              <span className="h-7 w-12 rounded-full bg-slate-200 relative flex items-center px-1">
                <span className="h-5 w-5 rounded-full bg-white shadow-sm flex items-center justify-center">
                  <Sun className="h-3.5 w-3.5 text-amber-500" />
                </span>
              </span>
              Light Mode
            </button>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="h-52 bg-gradient-to-r from-[#2f66e5] via-[#4f46e5] to-[#9333ea] px-4 py-4 flex justify-end">
              <Button
                variant="outline"
                className="h-12 rounded-2xl border-white/30 bg-white/90 text-slate-700 font-semibold hover:bg-white"
                data-testid="edit-profile-btn"
              >
                <Pencil className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            </div>

            <div className="px-8 pb-8 relative">
              <div
                className="absolute -top-16 left-8 h-32 w-32 rounded-3xl bg-white shadow-lg border-2 border-slate-200 overflow-hidden"
                data-testid="profile-avatar"
              >
                {currentUser.avatar ? (
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full bg-slate-100 flex items-center justify-center">
                    <User className="h-12 w-12 text-slate-300" />
                  </div>
                )}
              </div>

              <div className="pt-14 flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                <div>
                  <div className="flex flex-wrap items-center gap-3 mb-4">
                    <h1 className="font-['Outfit'] text-3xl font-bold tracking-tight text-slate-900" data-testid="profile-name">
                      {currentUser.name}
                    </h1>
                    <div className="h-8 px-3 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-700 text-sm font-semibold flex items-center gap-1.5">
                      <CheckCircle2 className="h-4 w-4" />
                      Verified
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                    <div className="flex items-start gap-3">
                      <div className="h-9 w-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mt-0.5 shrink-0">
                        <GraduationCap className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="text-xs text-slate-500">College</div>
                        <div className="text-sm text-slate-800 font-medium" data-testid="profile-college">
                          {currentUser.college}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="h-9 w-9 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center mt-0.5 shrink-0">
                        <GitBranch className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="text-xs text-slate-500">Branch</div>
                        <div className="text-sm text-slate-800 font-medium">
                          {currentUser.branch || 'Not specified'}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="h-9 w-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mt-0.5 shrink-0">
                        <Calendar className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="text-xs text-slate-500">Member Since</div>
                        <div className="text-sm text-slate-800 font-medium">
                          {new Date(currentUser.member_since || currentUser.created_at || Date.now()).getFullYear()}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="h-9 w-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mt-0.5 shrink-0">
                        <Mail className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="text-xs text-slate-500">Email</div>
                        <div className="text-sm text-slate-800 font-medium">{currentUser.email}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <Button
                  variant="outline"
                  onClick={handleLogout}
                  className="h-10 px-5 rounded-2xl border-red-200 text-red-600 hover:bg-red-50 hover:text-red-600 text-sm font-semibold"
                  data-testid="logout-btn"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          </div>

          {/* Trust Score Card */}
          <div className="bg-emerald-50 rounded-3xl border border-emerald-200 p-8 mt-8 mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Shield className="h-6 w-6 text-emerald-700" />
              <h2 className="text-[34px] font-bold text-emerald-900">Trust Score</h2>
            </div>
            <div className="relative w-44 h-44 mx-auto">
              <svg className="w-44 h-44" viewBox="0 0 120 120">
                <circle
                  cx="60"
                  cy="60"
                  r="54"
                  fill="none"
                  stroke="#D1FAE5"
                  strokeWidth="10"
                />
                <circle
                  cx="60"
                  cy="60"
                  r="54"
                  fill="none"
                  stroke="#10B981"
                  strokeWidth="10"
                  strokeDasharray={`${((currentUser.trust_score || 0) / 100) * 339} 339`}
                  strokeLinecap="round"
                  transform="rotate(-90 60 60)"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-5xl font-black text-emerald-700" data-testid="profile-trust-score">
                  {currentUser.trust_score || 0}%
                </div>
              </div>
            </div>
            <p className="text-center text-emerald-800 mt-4 text-lg font-medium">Trusted campus member</p>
          </div>

          {/* Badges + Reviews */}
          <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
            <div className="bg-white rounded-3xl border border-slate-200 p-8 xl:col-span-2">
              <h2 className="text-xl font-bold text-slate-900 mb-6">Achievements</h2>
              <div className="grid grid-cols-2 gap-4">
              <div className="text-center" data-testid="badge-verified">
                <div className="bg-blue-50 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Shield className="h-8 w-8 text-blue-600" />
                </div>
                <div className="text-sm font-medium text-slate-900">Verified</div>
              </div>
              <div className="text-center" data-testid="badge-trusted">
                <div className="bg-green-50 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Award className="h-8 w-8 text-green-600" />
                </div>
                <div className="text-sm font-medium text-slate-900">Trusted Seller</div>
              </div>
              <div className="text-center" data-testid="badge-star">
                <div className="bg-amber-50 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Star className="h-8 w-8 text-amber-400" />
                </div>
                <div className="text-sm font-medium text-slate-900">Top Rated</div>
              </div>
              <div className="text-center" data-testid="badge-pro">
                <div className="bg-purple-50 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Award className="h-8 w-8 text-purple-600" />
                </div>
                <div className="text-sm font-medium text-slate-900">Pro Seller</div>
              </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 p-8 xl:col-span-3">
              <h2 className="text-xl font-bold text-slate-900 mb-6">Recent Reviews</h2>
              <div className="space-y-6">
              {reviews.map((review) => {
                const reviewer = users.find(u => u.id === review.userId);
                return (
                  <div key={review.id} className="border-b border-slate-100 last:border-0 pb-6 last:pb-0" data-testid={`review-${review.id}`}>
                    <div className="flex items-start gap-4">
                      <img
                        src={reviewer?.avatar}
                        alt={reviewer?.name}
                        className="h-12 w-12 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-sm font-bold text-slate-900">{reviewer?.name}</h3>
                          <div className="flex items-center gap-1">
                            {Array.from({ length: review.rating }).map((_, i) => (
                              <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                            ))}
                          </div>
                        </div>
                        <p className="text-sm text-slate-700 mb-2">{review.comment}</p>
                        <p className="text-xs text-slate-500">{review.date}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
