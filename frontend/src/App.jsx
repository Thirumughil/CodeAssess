import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Suspense, lazy, useState } from 'react';
import { motion } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import { useStore } from './store';

const Login = lazy(() => import('./pages/Login'));
const HomePage = lazy(() => import('./pages/HomePage'));
const ProblemsPage = lazy(() => import('./pages/ProblemsPage'));
const ProblemSolvePage = lazy(() => import('./pages/ProblemSolvePage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Background3D = lazy(() => import('./components/Background3D'));
const CustomCursor = lazy(() => import('./components/CustomCursor'));
import SplashIntro from './components/SplashIntro';


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
    const initApp = async () => {
      // 1. Load problems
      try {
        const probs = await getProblems();
        setProblems(probs);
      } catch (err) {
        console.error('Failed to load problems', err);
      }

      // 2. Load solved problems if user is logged in
      if (user && (user._id || user.id)) {
        try {
          const solved = await getUserSolvedProblems(user._id || user.id);
          setSolvedProblems(solved);
        } catch (err) {
          console.error('Failed to load solved problems', err);
        }
      }
    };

    initApp();
  }, [user, setProblems, setSolvedProblems]);

  const handleSplashComplete = () => {
    setShowSplash(false);
    sessionStorage.setItem('splash_shown', 'true');
  };

  if (showSplash) {
    return (
      <Suspense fallback={<PageLoader />}>
        <SplashIntro onComplete={handleSplashComplete} />
      </Suspense>
    );
  }

  return (
    <Router>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="relative min-h-screen bg-dark-900 overflow-hidden text-slate-200 cursor-none"
      >
        <Suspense fallback={null}><CustomCursor /></Suspense>
        {/* Persistent 3D Background */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <Suspense fallback={null}>
            <Background3D />
          </Suspense>
        </div>
        
        {/* Main Content */}
        <main className="relative z-10 min-h-screen">
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={!user ? <Login /> : <Navigate to="/home" />} />
              <Route path="/login" element={!user ? <Login /> : <Navigate to="/home" />} />
              <Route path="/home" element={user ? <HomePage /> : <Navigate to="/" />} />
              <Route path="/problems" element={user ? <ProblemsPage /> : <Navigate to="/" />} />
              <Route path="/problems/:id" element={user ? <ProblemSolvePage /> : <Navigate to="/" />} />
              <Route path="/profile" element={user ? <ProfilePage /> : <Navigate to="/" />} />
              <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/" />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </Suspense>
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
  );
}

export default App;
