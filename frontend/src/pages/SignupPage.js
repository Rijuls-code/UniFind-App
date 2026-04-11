import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, GraduationCap } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';

const SignupPage = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    college: '',
    branch: '',
    password: ''
  });

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = await signup(formData);
    
    if (result.success) {
      toast.success('Account created! Please check your email to verify your account.');
      navigate('/dashboard');
    } else {
      toast.error(result.error || 'Signup failed');
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left Side - Form */}
      <div className="flex items-center justify-center p-6 sm:p-8 md:p-12 lg:p-24 bg-slate-50">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="mb-10">
            <Link to="/" className="font-['Outfit'] font-black text-3xl text-blue-600 tracking-tight" data-testid="signup-logo">
              UniFinds
            </Link>
          </div>

          {/* Title */}
          <div className="mb-8">
            <h1 className="font-['Outfit'] text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 mb-2" data-testid="signup-title">
              Create Account
            </h1>
            <p className="text-base text-slate-600">Join the student marketplace community</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSignup} className="space-y-5">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2" htmlFor="name">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Arjun Sharma"
                  className="w-full rounded-xl border border-slate-200 pl-12 pr-4 py-3 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                  required
                  data-testid="signup-name-input"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2" htmlFor="email">
                College Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="your.email@college.edu"
                  className="w-full rounded-xl border border-slate-200 pl-12 pr-4 py-3 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                  required
                  data-testid="signup-email-input"
                />
              </div>
            </div>

            {/* College */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2" htmlFor="college">
                College/University
              </label>
              <div className="relative">
                <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  id="college"
                  type="text"
                  value={formData.college}
                  onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                  placeholder="IIT Delhi"
                  className="w-full rounded-xl border border-slate-200 pl-12 pr-4 py-3 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                  required
                  data-testid="signup-college-input"
                />
              </div>
            </div>

            {/* Branch */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2" htmlFor="branch">
                Branch/Department
              </label>
              <div className="relative">
                <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  id="branch"
                  type="text"
                  value={formData.branch}
                  onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                  placeholder="Computer Science"
                  className="w-full rounded-xl border border-slate-200 pl-12 pr-4 py-3 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                  data-testid="signup-branch-input"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-slate-200 pl-12 pr-4 py-3 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                  required
                  data-testid="signup-password-input"
                />
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white font-medium px-6 py-3 rounded-xl hover:bg-blue-700 shadow-[0_0_0_1px_rgba(37,99,235,1)_inset] transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              data-testid="signup-submit-btn"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </form>

          {/* Login Link */}
          <p className="mt-8 text-center text-sm text-slate-600">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium" data-testid="login-link">
              Login
            </Link>
          </p>
        </div>
      </div>

      {/* Right Side - Image */}
      <div className="hidden lg:block relative bg-slate-900">
        <img
          src="https://images.pexels.com/photos/1454360/pexels-photo-1454360.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
          alt="Students"
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 flex items-center justify-center p-12">
          <div className="text-center text-white">
            <h2 className="font-['Outfit'] text-4xl font-bold mb-4">
              Join UniFinds
            </h2>
            <p className="text-lg text-slate-300">
              Start buying and selling with verified students
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
