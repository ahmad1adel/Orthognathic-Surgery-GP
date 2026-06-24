import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import LanguageSwitch from './LanguageSwitch';
import {
  Menu,
  X,
  Stethoscope,
  Home,
  Info,
  Mail,
  MessageCircle,
  Upload,
  Image,
  MapPin,
  FlaskConical,
  LogIn,
  UserPlus,
  LayoutDashboard,
  User,
  LogOut,
  ChevronDown,
  Sparkles,
  CreditCard,
} from 'lucide-react';

const Navigation: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t } = useLanguage();
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => location.pathname === path;

  const publicNavItems = [
    { path: '/', label: t('home'), icon: Home },
    { path: '/about', label: t('about'), icon: Info },
    { path: '/pricing', label: 'Pricing', icon: CreditCard },
    { path: '/contact', label: t('contact'), icon: Mail },
  ];

  const aiToolsItems = [
    { path: '/chatbot', label: t('chatbot'), icon: MessageCircle },
    { path: '/cnn-upload', label: t('cnn'), icon: Upload },
    { path: '/gan-upload', label: t('gan'), icon: Upload },
    { path: '/nearby-dentists', label: 'Nearby Dentists', icon: MapPin },
    { path: '/gallery', label: t('gallery'), icon: Image },
    { path: '/find-clinics', label: t('findClinics'), icon: MapPin },
    { path: '/ai-lab', label: t('aiLab'), icon: FlaskConical },
  ];

  const dashboardPath = user?.role === 'doctor' ? '/doctor-dashboard' : '/patient-profile';
  const toolsActive = aiToolsItems.some((i) => isActive(i.path));

  const initials = user
    ? user.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : '';

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    navigate('/login');
  };

  const linkClass = (active: boolean) =>
    `px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
      active
        ? 'bg-primary text-primary-foreground shadow-sm'
        : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
    }`;

  return (
    <nav className="bg-card/80 backdrop-blur-md border-b border-border sticky top-0 z-50 soft-shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 hover:opacity-90 transition-opacity">
            <div className="p-2 bg-gradient-to-br from-primary to-accent rounded-xl shadow-sm">
              <Stethoscope className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-gradient">DentalAI</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {publicNavItems.map((item) => (
              <Link key={item.path} to={item.path} className={linkClass(isActive(item.path))}>
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            ))}

            {/* AI Tools dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className={linkClass(toolsActive)}>
                  <Sparkles className="h-4 w-4" />
                  AI Tools
                  <ChevronDown className="h-3.5 w-3.5 opacity-70" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>AI Tools</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {aiToolsItems.map((item) => (
                  <DropdownMenuItem key={item.path} asChild>
                    <Link
                      to={item.path}
                      className={`flex items-center gap-2 cursor-pointer ${
                        isActive(item.path) ? 'text-primary font-medium' : ''
                      }`}
                    >
                      <item.icon className="h-4 w-4" />
                      {item.label}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="mx-2 h-6 w-px bg-border" />

            {/* Auth / user */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 rounded-full pl-1 pr-2 py-1 hover:bg-secondary transition-colors">
                    <Avatar className="h-8 w-8 border border-primary/20">
                      {user.profileImage ? <AvatarImage src={user.profileImage} alt={user.name} /> : null}
                      <AvatarFallback className="bg-primary/10 text-primary text-xs">{initials}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium max-w-[120px] truncate">{user.name}</span>
                    <ChevronDown className="h-3.5 w-3.5 opacity-70" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="flex flex-col">
                    <span>{user.name}</span>
                    <span className="text-xs font-normal text-muted-foreground capitalize">{user.role}</span>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to={dashboardPath} className="flex items-center gap-2 cursor-pointer">
                      {user.role === 'doctor' ? <LayoutDashboard className="h-4 w-4" /> : <User className="h-4 w-4" />}
                      {user.role === 'doctor' ? t('dashboard') : t('profile')}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout} className="text-destructive cursor-pointer">
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login">
                  <Button variant="ghost" size="sm" className="gap-2">
                    <LogIn className="h-4 w-4" />
                    {t('login')}
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button size="sm" className="gap-2">
                    <UserPlus className="h-4 w-4" />
                    {t('signup')}
                  </Button>
                </Link>
              </div>
            )}

            <LanguageSwitch />
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center gap-2">
            <LanguageSwitch />
            <Button variant="outline" size="sm" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden pb-4">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-card rounded-xl mt-2 border border-border soft-shadow">
              {user && (
                <div className="flex items-center gap-3 px-3 py-3 mb-1 border-b border-border">
                  <Avatar className="h-10 w-10 border border-primary/20">
                    {user.profileImage ? <AvatarImage src={user.profileImage} alt={user.name} /> : null}
                    <AvatarFallback className="bg-primary/10 text-primary">{initials}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
                  </div>
                </div>
              )}

              <div className="text-xs font-semibold text-muted-foreground px-3 py-2">Navigation</div>
              {publicNavItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`block ${linkClass(isActive(item.path))}`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              ))}

              <div className="text-xs font-semibold text-muted-foreground px-3 py-2 pt-4">AI Tools</div>
              {aiToolsItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`block ${linkClass(isActive(item.path))}`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              ))}

              <div className="text-xs font-semibold text-muted-foreground px-3 py-2 pt-4">Account</div>
              {user ? (
                <>
                  <Link
                    to={dashboardPath}
                    onClick={() => setIsMenuOpen(false)}
                    className={`block ${linkClass(isActive(dashboardPath))}`}
                  >
                    {user.role === 'doctor' ? <LayoutDashboard className="h-4 w-4" /> : <User className="h-4 w-4" />}
                    {user.role === 'doctor' ? t('dashboard') : t('profile')}
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setIsMenuOpen(false)} className={`block ${linkClass(isActive('/login'))}`}>
                    <LogIn className="h-4 w-4" />
                    {t('login')}
                  </Link>
                  <Link to="/signup" onClick={() => setIsMenuOpen(false)} className={`block ${linkClass(isActive('/signup'))}`}>
                    <UserPlus className="h-4 w-4" />
                    {t('signup')}
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
