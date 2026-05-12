import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Suspense, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import { useStore } from './store';

import Login from './pages/Login';
import HomePage from './pages/HomePage';
import ProblemsPage from './pages/ProblemsPage';
import ProblemSolvePage from './pages/ProblemSolvePage';
import ProfilePage from './pages/ProfilePage';
import Dashboard from './pages/Dashboard';
import Background3D from './components/Background3D';
import CustomCursor from './components/CustomCursor';
import SplashIntro from './components/SplashIntro';
import ErrorBoundary from './components/ErrorBoundary';


const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[100vh] bg-dark-900 absolute inset-0 z-50">
    <div className="w-12 h-12 border-4 border-slate-700/50 border-t-blue-500 rounded-full animate-spin"></div>
  </div>
);

import { getProblems, getUserSolvedProblems } from './services/api';

function App() {
  const { user, setUser, setProblems, setSolvedProblems } = useStore();
  const [showSplash, setShowSplash] = useState(() => {
    // Check session storage to avoid repeating the intro in the same session
    return !sessionStorage.getItem('splash_shown');
  });

  useEffect(() => {
    console.log('App initializing...');
    const initApp = async () => {
      try {
        console.log('Fetching problems...');
        const data = await getProblems();
        setProblems(data.problems || data);
        console.log('Problems loaded:', (data.problems || data).length);
      } catch (err) {
        console.warn('Failed to load problems', err);
      }

      if (user && (user._id || user.id)) {
        try {
          console.log('Fetching solved problems for user:', user._id || user.id);
          const solved = await getUserSolvedProblems(user._id || user.id);
          setSolvedProblems(Array.isArray(solved) ? solved : []);
        } catch (err) {
          console.warn('Failed to load solved problems', err);
        }
      }
    };

    initApp();
  }, [user, setProblems, setSolvedProblems]);

  const handleSplashComplete = () => {
    console.log('Splash intro complete');
    setShowSplash(false);
    sessionStorage.setItem('splash_shown', 'true');
  };

  if (showSplash) {
    return <SplashIntro onComplete={handleSplashComplete} />;
  }

  return (
    <ErrorBoundary>
      <Router>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="relative min-h-screen bg-dark-900 overflow-hidden text-slate-200"
      >
        <CustomCursor />
        {/* 3D Background */}
        <Background3D />
        
        {/* Main Content */}
        <main className="relative z-10 min-h-screen">
          <Routes>
            <Route path="/" element={!user ? <Login /> : <Navigate to="/home" />} />
            <Route path="/login" element={!user ? <Login /> : <Navigate to="/home" />} />
            <Route path="/home" element={user ? <HomePage /> : <Navigate to="/" />} />
            <Route path="/problems" element={user ? <ProblemsPage /> : <Navigate to="/" />} />
            <Route path="/problems/:id" element={user ? <ProblemSolvePage /> : <Navigate to="/" />} />
            <Route path="/profile" element={user ? <ProfilePage /> : <Navigate to="/" />} />
            <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/" />} />
            <Route path="/dom-extension" element={user ? <ProfilePage /> : <Navigate to="/" />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>

        <Toaster position="top-right"
          toastOptions={{
            style: {
              background: '#1e293b',
              color: '#fff',
              border: '1px solid rgba(255,255,255,0.1)'
            }
          }} 
        />
      </motion.div>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
