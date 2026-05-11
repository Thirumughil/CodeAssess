import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LogIn, UserPlus, Mail, Lock, User, Github, Chrome, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import { useStore } from '../store';
import { loginUser, registerUser, sendOtp, verifyOtp, socialAuth } from '../services/api';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [showOtpStep, setShowOtpStep] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  
  const { setUser } = useStore();
  const navigate = useNavigate();

  // Check for social login callback parameters
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const userData = params.get('user');

    if (token && userData) {
      const parsedUser = JSON.parse(userData);
      setUser({ ...parsedUser, token });
      toast.success('Signed in with social account!');
      navigate('/home');
    }
  }, [navigate, setUser]);

  const handleSendOtp = async () => {
    if (!formData.email) return toast.error('Please enter your email');
    setLoading(true);
    try {
      await sendOtp(formData.email);
      setOtpSent(true);
      setShowOtpStep(true);
      toast.success('Verification code sent to your email!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    
    if (!isLogin && !otpSent) {
      return handleSendOtp();
    }

    setLoading(true);
    try {
      let data;
      if (isLogin) {
        data = await loginUser(formData.email, formData.password);
        toast.success('Welcome back!');
      } else {
        data = await registerUser(formData.username, formData.email, formData.password, otp);
        toast.success('Account verified and created successfully!');
      }
      setUser(data);
      setTimeout(() => navigate('/home'), 500);
    } catch (error) {
      const message = error.response?.data?.message || 'Authentication failed.';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = (provider) => {
    // Real OAuth Redirect
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    window.location.href = `${API_URL}/auth/${provider}`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-[#050505]">
      {/* Animated Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-600/10 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-600/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl overflow-hidden">
          <div className="text-center mb-10">
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <h1 className="text-4xl font-extrabold tracking-tight text-white mb-2">
                Code<span className="text-primary-500">Practice</span>
              </h1>
              <p className="text-slate-400 font-medium">Master the art of competitive coding</p>
            </motion.div>
          </div>

          {/* Premium Toggle Switch */}
          <div className="flex p-1 bg-white/[0.05] rounded-xl mb-8 relative">
            <motion.div
              className="absolute h-[calc(100%-8px)] top-1 bg-primary-600 rounded-lg shadow-lg z-0"
              initial={false}
              animate={{ 
                x: isLogin ? 0 : '100%',
                width: '50%'
              }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
            <button
              onClick={() => { setIsLogin(true); setShowOtpStep(false); }}
              className={`flex-1 py-2 text-sm font-semibold rounded-lg relative z-10 transition-colors ${isLogin ? 'text-white' : 'text-slate-400 hover:text-slate-200'}`}
            >
              Sign In
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 text-sm font-semibold rounded-lg relative z-10 transition-colors ${!isLogin ? 'text-white' : 'text-slate-400 hover:text-slate-200'}`}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleAuth} className="space-y-5">
            <AnimatePresence mode="wait">
              {!isLogin && !showOtpStep && (
                <motion.div 
                  key="username"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-2"
                >
                  <label className="text-sm font-semibold text-slate-300 ml-1">Username</label>
                  <div className="relative group">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary-400 transition-colors" size={18} />
                    <input
                      type="text"
                      required
                      placeholder="johndoe"
                      className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-10 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-primary-500/50 focus:ring-4 focus:ring-primary-500/10 transition-all"
                      value={formData.username}
                      onChange={e => setFormData({...formData, username: e.target.value})}
                    />
                  </div>
                </motion.div>
              )}

              {showOtpStep && (
                <motion.div 
                  key="otp"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-2"
                >
                  <label className="text-sm font-semibold text-slate-300 ml-1">Verification Code</label>
                  <div className="relative group">
                    <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 text-primary-400" size={18} />
                    <input
                      type="text"
                      required
                      placeholder="Enter 6-digit code"
                      maxLength={6}
                      className="w-full bg-white/[0.05] border border-primary-500/30 rounded-xl px-10 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-primary-500 transition-all text-center tracking-[0.5em] font-bold text-xl"
                      value={otp}
                      onChange={e => setOtp(e.target.value)}
                    />
                  </div>
                  <p className="text-xs text-slate-500 text-center mt-2">
                    Check your email for the code sent to {formData.email}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {!showOtpStep && (
              <>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-300 ml-1">Email Address</label>
                  <div className="relative group">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary-400 transition-colors" size={18} />
                    <input
                      type="email"
                      required
                      placeholder="name@example.com"
                      className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-10 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-primary-500/50 focus:ring-4 focus:ring-primary-500/10 transition-all"
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-300 ml-1">Password</label>
                  <div className="relative group">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary-400 transition-colors" size={18} />
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-10 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-primary-500/50 focus:ring-4 focus:ring-primary-500/10 transition-all"
                      value={formData.password}
                      onChange={e => setFormData({...formData, password: e.target.value})}
                    />
                  </div>
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-primary-600 hover:bg-primary-500 text-white rounded-xl font-bold shadow-lg shadow-primary-600/20 transform hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-4 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                isLogin ? <><LogIn size={20} /> Sign In</> : 
                showOtpStep ? <><ShieldCheck size={20} /> Verify & Sign Up</> :
                <><UserPlus size={20} /> Send Verification Code</>
              )}
            </button>
            
            {showOtpStep && (
              <button 
                type="button" 
                onClick={() => setShowOtpStep(false)}
                className="w-full text-xs text-slate-500 hover:text-white transition-colors py-2"
              >
                Back to signup
              </button>
            )}
          </form>

          <div className="mt-8 text-center">
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
              <div className="relative flex justify-center text-xs uppercase"><span className="bg-[#0f1115] px-2 text-slate-500 font-semibold tracking-widest">Or continue with</span></div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => handleSocialLogin('github')}
                className="flex items-center justify-center gap-2 py-2.5 bg-white/[0.05] border border-white/10 rounded-xl text-sm font-semibold text-white hover:bg-white/[0.1] transition-all"
              >
                <Github size={18} /> GitHub
              </button>
              <button 
                onClick={() => handleSocialLogin('google')}
                className="flex items-center justify-center gap-2 py-2.5 bg-white/[0.05] border border-white/10 rounded-xl text-sm font-semibold text-white hover:bg-white/[0.1] transition-all"
              >
                <Chrome size={18} /> Google
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
