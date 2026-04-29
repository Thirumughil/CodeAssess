import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Code2, Home, List, User, LogOut } from 'lucide-react';
import { useStore } from '../store';
import toast from 'react-hot-toast';

export default function Navbar() {
  const { user, setUser } = useStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    setUser(null);
    navigate('/login');
    toast.success('Logged out successfully');
  };

  const links = [
    { to: '/', label: 'Home', icon: Home },
    { to: '/problems', label: 'Problems', icon: List },
    { to: '/profile', label: 'Profile', icon: User },
  ];

  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-3 bg-dark-900/80 backdrop-blur-xl border-b border-white/5"
    >
      <Link to="/" className="flex items-center gap-2">
        <Code2 size={22} className="text-blue-400" />
        <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
          CodePractice
        </span>
      </Link>

      <div className="flex items-center gap-1">
        {links.map(({ to, label, icon: Icon }) => {
          const active = location.pathname === to;
          return (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all
                ${active
                  ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                }`}
            >
              <Icon size={15} />
              {label}
            </Link>
          );
        })}
      </div>

      <div className="flex items-center gap-3">
        <span className="text-sm text-slate-400 hidden sm:block">
          {user?.username}
        </span>
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
        >
          <LogOut size={15} />
          Logout
        </button>
      </div>
    </motion.nav>
  );
}
