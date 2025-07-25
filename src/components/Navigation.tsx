import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import LanguageSwitch from './LanguageSwitch';
import { 
  Menu, 
  X, 
  Stethoscope,
  Home,
  Info,
  FileText,
  HelpCircle,
  Mail,
  MessageCircle,
  Upload,
  Image,
  MapPin,
  FlaskConical,
  LogIn,
  UserPlus,
  LayoutDashboard,
  User
} from 'lucide-react';

const Navigation: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t } = useLanguage();
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const publicNavItems = [
    { path: '/', label: t('home'), icon: Home },
    { path: '/about', label: t('about'), icon: Info },
    { path: '/conditions', label: t('conditions'), icon: FileText },
    { path: '/faqs', label: t('faqs'), icon: HelpCircle },
    { path: '/contact', label: t('contact'), icon: Mail },
  ];

  const aiToolsItems = [
    { path: '/chatbot', label: t('chatbot'), icon: MessageCircle },
    { path: '/cnn-upload', label: t('cnn'), icon: Upload },
    { path: '/gan-upload', label: t('gan'), icon: Upload },
    { path: '/gallery', label: t('gallery'), icon: Image },
    { path: '/find-clinics', label: t('findClinics'), icon: MapPin },
    { path: '/ai-lab', label: t('aiLab'), icon: FlaskConical },
  ];

  const authItems = user ? [
    { 
      path: user.role === 'doctor' ? '/doctor-dashboard' : '/patient-profile', 
      label: user.role === 'doctor' ? t('dashboard') : t('profile'), 
      icon: user.role === 'doctor' ? LayoutDashboard : User 
    }
  ] : [
    { path: '/login', label: t('login'), icon: LogIn },
    { path: '/signup', label: t('signup'), icon: UserPlus },
  ];

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-card/95 backdrop-blur-sm border-b border-border sticky top-0 z-50 medical-shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2 hover:scale-105 transition-transform">
              <div className="p-2 bg-primary rounded-lg">
                <Stethoscope className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-gradient">DentalAI</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {/* Public Pages */}
            {publicNavItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
                  isActive(item.path)
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            ))}

            {/* AI Tools */}
            <div className="mx-2 h-6 w-px bg-border" />
            {aiToolsItems.slice(0, 3).map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
                  isActive(item.path)
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            ))}

            {/* Auth/User Actions */}
            <div className="mx-2 h-6 w-px bg-border" />
            {user ? (
              <div className="flex items-center gap-2">
                <Link
                  to={user.role === 'doctor' ? '/doctor-dashboard' : '/patient-profile'}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
                    isActive(user.role === 'doctor' ? '/doctor-dashboard' : '/patient-profile')
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                  }`}
                >
                  {user.role === 'doctor' ? <LayoutDashboard className="h-4 w-4" /> : <User className="h-4 w-4" />}
                  {user.role === 'doctor' ? t('dashboard') : t('profile')}
                </Link>
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  Logout
                </Button>
              </div>
            ) : (
              authItems.map((item) => (
                <Link key={item.path} to={item.path}>
                  <Button variant={isActive(item.path) ? "default" : "outline"} size="sm" className="flex items-center gap-2">
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </Button>
                </Link>
              ))
            )}

            <LanguageSwitch />
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center gap-2">
            <LanguageSwitch />
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-card rounded-lg mt-2 border border-border">
              {/* Public Pages */}
              <div className="text-xs font-semibold text-muted-foreground px-3 py-2">Navigation</div>
              {publicNavItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`block px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive(item.path)
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </div>
                </Link>
              ))}

              {/* AI Tools */}
              <div className="text-xs font-semibold text-muted-foreground px-3 py-2 pt-4">AI Tools</div>
              {aiToolsItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`block px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive(item.path)
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </div>
                </Link>
              ))}

              {/* Auth */}
              <div className="text-xs font-semibold text-muted-foreground px-3 py-2 pt-4">Account</div>
              {user ? (
                <>
                  <Link
                    to={user.role === 'doctor' ? '/doctor-dashboard' : '/patient-profile'}
                    onClick={() => setIsMenuOpen(false)}
                    className={`block px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive(user.role === 'doctor' ? '/doctor-dashboard' : '/patient-profile')
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {user.role === 'doctor' ? <LayoutDashboard className="h-4 w-4" /> : <User className="h-4 w-4" />}
                      {user.role === 'doctor' ? t('dashboard') : t('profile')}
                    </div>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left block px-3 py-2 rounded-md text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : (
                authItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={`block px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive(item.path)
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <item.icon className="h-4 w-4" />
                      {item.label}
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;