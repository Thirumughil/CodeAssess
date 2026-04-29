import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';
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

const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[100vh] bg-dark-900 absolute inset-0 z-50">
    <div className="w-12 h-12 border-4 border-slate-700/50 border-t-blue-500 rounded-full animate-spin"></div>
  </div>
);

function App() {
  const { user } = useStore();

  return (
    <Router>
      <div className="relative min-h-screen bg-dark-900 overflow-hidden text-slate-200 cursor-none">
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
      </div>
    </Router>
  );
}

export default App;
