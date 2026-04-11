import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, ShoppingBag, MessageCircle, User, Menu, LayoutGrid, Sparkles, Users } from 'lucide-react';
import { Button } from './ui/button';

const Header = ({ hideSearch = false }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navItems = [
    { label: 'Buy', path: '/buyer', icon: ShoppingBag },
    { label: 'Sell', path: '/seller', icon: ShoppingBag },
    { label: 'NeedBoard AI', path: '/need-board', icon: Sparkles },
    { label: 'Chats', path: '/chat', icon: MessageCircle },
    { label: 'Dashboard', path: '/dashboard', icon: LayoutGrid },
    { label: 'Find Users', path: '/profile', icon: Users },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200">
      <div className="px-6 sm:px-8 md:px-12 lg:px-24 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Link 
            to="/" 
            className="inline-flex items-center gap-2"
            data-testid="header-logo"
          >
            <img
              src="/favicon.png"
              alt="UniFind"
              className="h-9 w-9 object-contain"
            />
            <span className="font-['Outfit'] font-black text-2xl leading-none tracking-tight text-[#4f46e5] hover:text-[#3f37c9] transition-colors">UniFind</span>
          </Link>

          {/* Search Bar - Desktop */}
          {!hideSearch && (
            <div className="hidden md:flex flex-1 max-w-xl mx-8">
              <div className="relative w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search products..."
                  className="w-full rounded-xl border border-slate-200 pl-12 pr-4 py-3 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                  data-testid="header-search-input"
                />
              </div>
            </div>
          )}

          {/* Navigation - Desktop */}
          <nav className="hidden md:flex items-center gap-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = location.pathname === item.path;

              return (
                <Button
                  key={item.label}
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate(item.path)}
                  className={`h-11 rounded-2xl px-4 text-base font-medium ${
                    active
                      ? 'bg-slate-100 text-[#4f46e5]'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  data-testid={`nav-${item.label.toLowerCase().replace(/\s+/g, '-')}-btn`}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {item.label}
                </Button>
              );
            })}

            <Button
              onClick={() => navigate('/profile')}
              className="h-11 bg-[#5b3ee4] text-white font-semibold px-6 rounded-2xl hover:bg-[#4b34c8] shadow-md shadow-indigo-500/20 ml-2"
              data-testid="nav-profile-btn"
            >
              <User className="h-4 w-4 mr-2" />
              Profile
            </Button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-slate-700"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            data-testid="mobile-menu-btn"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-slate-200 pt-4" data-testid="mobile-menu">
            <nav className="flex flex-col gap-2">
              {navItems.map((item) => {
                const Icon = item.icon;

                return (
                  <Button
                    key={item.label}
                    variant="ghost"
                    onClick={() => { navigate(item.path); setMobileMenuOpen(false); }}
                    className="justify-start text-slate-700"
                    data-testid={`mobile-nav-${item.label.toLowerCase().replace(/\s+/g, '-')}-btn`}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {item.label}
                  </Button>
                );
              })}
              <Button
                onClick={() => { navigate('/profile'); setMobileMenuOpen(false); }}
                className="bg-[#5b3ee4] text-white mt-2"
                data-testid="mobile-nav-profile-btn"
              >
                Profile
              </Button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
