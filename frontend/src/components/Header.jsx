import { Link, useLocation, useNavigate } from 'react-router-dom';
import authService from '../services/auth.service';

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const isActive = (path) => location.pathname === path;
  // Header re-renders on route change because of useLocation hook.
  // We can read the current user directly from local storage on every render.
  const user = authService.getCurrentUser();

  const handleLogout = () => {
    authService.logout();
    navigate('/');
    window.location.reload();
  };

  return (
    <header className="bg-white/90 backdrop-blur-md shadow-sm sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="text-2xl font-bold tracking-tight text-primary hover:text-secondary transition-colors">
              JustBookAndRelax
            </Link>
          </div>
          <nav>
            <ul className="flex items-center space-x-6">
              {/* Search is primarily on Home Hero now, but can keep a link */}
              <li className="hidden md:block">
                <Link
                  to="/search"
                  className="text-gray-700 font-medium border-b-2 border-transparent hover:border-primary transition-all text-sm flex items-center gap-1 hover:text-primary"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                  Search
                </Link>
              </li>

              {user ? (
                <>
                  <li>
                    <Link
                      to="/dashboard"
                      className={`text-sm font-medium transition-colors duration-200 ${isActive('/dashboard') ? 'text-primary' : 'text-gray-500 hover:text-primary'}`}
                    >
                      Dashboard
                    </Link>
                  </li>
                  <li className="relative group">
                    <button onClick={() => navigate('/profile')} className="flex items-center gap-2 focus:outline-none">
                      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold text-xs ring-2 ring-white shadow-sm hover:ring-secondary transition-all">
                        {user.name.charAt(0)}
                      </div>
                    </button>
                    {/* Dropdown for Profile/Logout - Simplified as links for now */}
                  </li>
                  <li>
                    <button
                      onClick={handleLogout}
                      className="text-sm font-medium text-red-500 hover:text-red-700 transition-colors"
                    >
                      Logout
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link
                      to="/login"
                      className={`text-sm font-medium transition-colors duration-200 ${isActive('/login') ? 'text-primary' : 'text-gray-500 hover:text-primary'}`}
                    >
                      Login
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/register"
                      className="btn-premium px-5 py-2 text-sm"
                    >
                      Register
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}
