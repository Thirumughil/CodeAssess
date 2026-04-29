import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Code2, CheckCircle2, LayoutDashboard, LogOut,
  Zap, BarChart3, Brain, Shield, ArrowRight
} from 'lucide-react';
import { useStore } from '../store';
import toast from 'react-hot-toast';

const navOptions = [
  {
    id: 'problems',
    label: 'Problems',
    icon: Code2,
    route: '/problems',
    gradient: 'linear-gradient(135deg,#3b82f6,#60a5fa)',
    glow: 'rgba(59,130,246,0.35)',
    border: 'rgba(59,130,246,0.4)',
    iconColor: '#60a5fa',
  },
  {
    id: 'solved',
    label: 'Solved Problems',
    icon: CheckCircle2,
    route: '/profile',
    gradient: 'linear-gradient(135deg,#10b981,#34d399)',
    glow: 'rgba(16,185,129,0.35)',
    border: 'rgba(16,185,129,0.4)',
    iconColor: '#34d399',
  },
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    route: '/dashboard',
    gradient: 'linear-gradient(135deg,#8b5cf6,#a78bfa)',
    glow: 'rgba(139,92,246,0.35)',
    border: 'rgba(139,92,246,0.4)',
    iconColor: '#a78bfa',
  },
  {
    id: 'logout',
    label: 'Logout',
    icon: LogOut,
    route: null,
    gradient: 'linear-gradient(135deg,#f43f5e,#fb7185)',
    glow: 'rgba(244,63,94,0.35)',
    border: 'rgba(244,63,94,0.4)',
    iconColor: '#fb7185',
  },
];

const features = [
  {
    icon: Zap,
    title: '3D Complexity Visualizer',
    desc: `See your code's time & space complexity rendered in stunning 3D after every submission.`,
    color: '#f59e0b',
  },
  {
    icon: BarChart3,
    title: 'Performance Analytics',
    desc: 'Every problem you solve is tracked. View your historical efficiency trends at a glance.',
    color: '#3b82f6',
  },
  {
    icon: Brain,
    title: 'Logical Thinking Score',
    desc: 'A unique score computed from the efficiency of all your solutions combined.',
    color: '#8b5cf6',
  },
  {
    icon: Shield,
    title: 'Secure & Fast',
    desc: 'Code runs in an isolated sandbox. Results returned in milliseconds, completely safely.',
    color: '#10b981',
  },
];

export default function HomePage() {
  const { user, setUser, solvedProblems, problems } = useStore();
  const navigate = useNavigate();

  const handleOptionClick = (option) => {
    if (option.id === 'logout') {
      setUser(null);
      toast.success('Logged out successfully');
      navigate('/login');
    } else {
      navigate(option.route);
    }
  };

  return (
    <div className="hp-root">
      {/* Ambient orbs */}
      <div className="hp-orb hp-orb-blue" />
      <div className="hp-orb hp-orb-purple" />
      <div className="hp-orb hp-orb-teal" />

      {/* ── HEADER ──────────────────────────────────────────────── */}
      <motion.header
        className="hp-header"
        initial={{ opacity: 0, y: -24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, ease: 'easeOut' }}
      >
        {/* Welcome chip */}
        <motion.div
          className="hp-badge"
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15, duration: 0.4 }}
        >
          <span className="hp-badge-dot" />
          Welcome back, <strong>{user?.username || user?.name || 'Coder'}</strong>
        </motion.div>

        {/* Title */}
        <h1 className="hp-title">
          <span className="hp-title-grad">Code</span>
          <span className="hp-title-white">Practice</span>
        </h1>

        <p className="hp-tagline">
          Sharpen your algorithmic edge — one problem at a time.
        </p>

        {/* ── HORIZONTAL NAV PILLS ─────────────────────────── */}
        <motion.nav
          className="hp-nav"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.5 }}
        >
          {navOptions.map((opt, i) => {
            const Icon = opt.icon;
            return (
              <motion.button
                key={opt.id}
                className="hp-nav-btn"
                onClick={() => handleOptionClick(opt)}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.08 }}
                whileHover={{ y: -3, scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  '--grad': opt.gradient,
                  '--glow': opt.glow,
                  '--border': opt.border,
                  '--icon': opt.iconColor,
                }}
              >
                <Icon size={17} className="hp-nav-icon" />
                {opt.label}
              </motion.button>
            );
          })}
        </motion.nav>
      </motion.header>

      {/* ── DIVIDER ─────────────────────────────────────────────── */}
      <motion.div
        className="hp-divider"
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.6, ease: 'easeOut' }}
      />

      {/* ── ABOUT / CONTENT ─────────────────────────────────────── */}
      <motion.section
        className="hp-about"
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.85, duration: 0.6 }}
      >
        {/* Stats row */}
        <div className="hp-stats">
          {[
            { value: problems.length || '50+', label: 'Curated Problems' },
            { value: solvedProblems.length,    label: 'Solved by You'   },
            { value: '10+',                    label: 'Topic Tags'       },
            { value: '4',                      label: 'Languages'        },
          ].map((s) => (
            <div key={s.label} className="hp-stat">
              <span className="hp-stat-val">{s.value}</span>
              <span className="hp-stat-lbl">{s.label}</span>
            </div>
          ))}
        </div>

        {/* About blurb */}
        <div className="hp-about-body">
          <h2 className="hp-about-title">What is CodePractice?</h2>
          <p className="hp-about-text">
            <strong>CodePractice</strong> is a fully-featured algorithmic coding platform built for
            developers who want to level up. Tackle hand-picked problems across Arrays, Strings,
            Trees, Dynamic Programming, and more — then get instant feedback powered by a secure
            multi-language sandbox that supports <em>Python, Java, C++, and C</em>.
          </p>
          <p className="hp-about-text">
            Beyond just running your code, CodePractice analyses the <em>time and space complexity</em> of
            every submission and displays it as an interactive 3D visualisation. Your Logical
            Thinking Score grows as your solutions become more efficient, giving you a concrete
            measure of your progress as an engineer.
          </p>
        </div>

        {/* Feature cards */}
        <div className="hp-features">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={f.title}
                className="hp-feat"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.95 + i * 0.1 }}
                whileHover={{ y: -4 }}
              >
                <div className="hp-feat-icon" style={{ background: f.color + '1a', color: f.color }}>
                  <Icon size={20} />
                </div>
                <h3 className="hp-feat-title">{f.title}</h3>
                <p className="hp-feat-desc">{f.desc}</p>
              </motion.div>
            );
          })}
        </div>

        {/* CTA */}
        <motion.button
          className="hp-cta"
          onClick={() => navigate('/problems')}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
        >
          Start Solving Now <ArrowRight size={17} />
        </motion.button>
      </motion.section>

      {/* ── FOOTER ──────────────────────────────────────────────── */}
      <motion.footer
        className="hp-footer"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <div className="hp-footer-divider" />
        <div className="hp-footer-content">
          <span className="hp-footer-brand">
            <span className="hp-footer-grad">Code</span>Practice
          </span>
          <span className="hp-footer-copy">
            &copy; {new Date().getFullYear()} CodePractice. All rights reserved.
          </span>
          <span className="hp-footer-tagline">Built with ❤️ for developers.</span>
        </div>
      </motion.footer>

      {/* ── STYLES ──────────────────────────────────────────────── */}
      <style>{`
        /* Root */
        .hp-root {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
          overflow-x: hidden;
          padding: 0 1.25rem 0;
        }

        /* Orbs */
        .hp-orb {
          position: fixed;
          border-radius: 50%;
          filter: blur(130px);
          pointer-events: none;
          z-index: 0;
        }
        .hp-orb-blue   { width:520px;height:520px;background:rgba(59,130,246,.13);top:-180px;left:-180px; }
        .hp-orb-purple { width:440px;height:440px;background:rgba(139,92,246,.11);bottom:-130px;right:-130px; }
        .hp-orb-teal   { width:300px;height:300px;background:rgba(20,184,166,.09);top:55%;left:50%;transform:translate(-50%,-50%); }

        /* ── HEADER ── */
        .hp-header {
          position: relative;
          z-index: 1;
          width: 100%;
          max-width: 900px;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 3.5rem 1rem 2rem;
          gap: 1rem;
        }

        .hp-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          padding: 0.35rem 1rem;
          border-radius: 9999px;
          background: rgba(59,130,246,.1);
          border: 1px solid rgba(59,130,246,.22);
          color: #93c5fd;
          font-size: 0.82rem;
          font-weight: 500;
        }
        .hp-badge strong { color: #bfdbfe; }
        .hp-badge-dot {
          width: 7px; height: 7px;
          border-radius: 50%;
          background: #60a5fa;
          animation: blink 2s infinite;
        }
        @keyframes blink {
          0%,100% { opacity:1; transform:scale(1); }
          50%      { opacity:.4; transform:scale(.8); }
        }

        .hp-title {
          font-size: clamp(3.2rem, 9vw, 6rem);
          font-weight: 900;
          letter-spacing: -0.04em;
          line-height: 1;
          margin: 0;
        }
        .hp-title-grad {
          background: linear-gradient(135deg,#60a5fa,#34d399);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .hp-title-white { color: #f1f5f9; }

        .hp-tagline {
          font-size: 1.05rem;
          color: #94a3b8;
          margin: 0;
          line-height: 1.6;
        }

        /* ── NAV PILLS ── */
        .hp-nav {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 0.75rem;
          margin-top: 0.5rem;
        }

        .hp-nav-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.6rem 1.4rem;
          border-radius: 9999px;
          border: 1px solid var(--border);
          background: rgba(255,255,255,0.04);
          backdrop-filter: blur(12px);
          color: #e2e8f0;
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.25s, box-shadow 0.25s, border-color 0.25s;
          position: relative;
          overflow: hidden;
        }
        .hp-nav-btn::before {
          content:'';
          position: absolute;
          inset: 0;
          background: var(--grad);
          opacity: 0;
          transition: opacity 0.25s;
          border-radius: inherit;
        }
        .hp-nav-btn:hover::before { opacity: 0.12; }
        .hp-nav-btn:hover {
          box-shadow: 0 0 24px var(--glow);
          border-color: var(--border);
        }
        .hp-nav-icon {
          color: var(--icon);
          flex-shrink: 0;
          position: relative;
          z-index: 1;
        }
        .hp-nav-btn span, .hp-nav-btn { position: relative; }

        /* ── DIVIDER ── */
        .hp-divider {
          position: relative;
          z-index: 1;
          width: 100%;
          max-width: 900px;
          height: 1px;
          background: linear-gradient(90deg,
            transparent,
            rgba(99,102,241,0.5) 25%,
            rgba(59,130,246,0.7) 50%,
            rgba(16,185,129,0.5) 75%,
            transparent
          );
          transform-origin: left;
          margin: 0 auto;
        }

        /* ── ABOUT ── */
        .hp-about {
          position: relative;
          z-index: 1;
          width: 100%;
          max-width: 900px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2.5rem;
          padding: 2.5rem 1rem;
        }

        /* Stats */
        .hp-stats {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 1px;
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 16px;
          overflow: hidden;
          background: rgba(255,255,255,0.04);
          backdrop-filter: blur(10px);
          width: 100%;
        }
        .hp-stat {
          flex: 1;
          min-width: 120px;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 1.25rem 1rem;
          border-right: 1px solid rgba(255,255,255,0.06);
          gap: 0.25rem;
        }
        .hp-stat:last-child { border-right: none; }
        .hp-stat-val {
          font-size: 2rem;
          font-weight: 800;
          background: linear-gradient(135deg,#60a5fa,#34d399);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          line-height: 1;
        }
        .hp-stat-lbl { font-size: 0.78rem; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; }

        /* About text */
        .hp-about-body {
          max-width: 700px;
          text-align: center;
        }
        .hp-about-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: #e2e8f0;
          margin: 0 0 1rem;
          letter-spacing: -0.02em;
        }
        .hp-about-text {
          font-size: 0.97rem;
          color: #94a3b8;
          line-height: 1.8;
          margin: 0 0 0.75rem;
        }
        .hp-about-text strong { color: #cbd5e1; }
        .hp-about-text em { color: #7dd3fc; font-style: normal; }

        /* Features */
        .hp-features {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1rem;
          width: 100%;
        }
        @media (max-width: 768px) {
          .hp-features { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 480px) {
          .hp-features { grid-template-columns: 1fr; }
          .hp-nav { flex-direction: column; align-items: center; }
          .hp-stats { flex-direction: column; }
          .hp-stat { border-right: none; border-bottom: 1px solid rgba(255,255,255,0.06); }
          .hp-stat:last-child { border-bottom: none; }
        }

        .hp-feat {
          display: flex;
          flex-direction: column;
          gap: 0.65rem;
          padding: 1.4rem;
          border-radius: 16px;
          background: rgba(15,23,42,0.6);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255,255,255,0.07);
          transition: border-color 0.25s;
        }
        .hp-feat:hover { border-color: rgba(255,255,255,0.14); }
        .hp-feat-icon {
          width: 42px; height: 42px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .hp-feat-title {
          font-size: 0.92rem;
          font-weight: 700;
          color: #e2e8f0;
          margin: 0;
          letter-spacing: -0.01em;
        }
        .hp-feat-desc {
          font-size: 0.8rem;
          color: #64748b;
          line-height: 1.55;
          margin: 0;
        }

        /* CTA */
        .hp-cta {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.8rem 2rem;
          border-radius: 14px;
          background: linear-gradient(135deg,#3b82f6,#6366f1);
          color: #fff;
          font-size: 0.95rem;
          font-weight: 700;
          border: none;
          cursor: pointer;
          letter-spacing: -0.01em;
          box-shadow: 0 8px 30px rgba(59,130,246,0.3);
          transition: box-shadow 0.25s;
        }
        .hp-cta:hover { box-shadow: 0 12px 40px rgba(99,102,241,0.45); }

        /* ── FOOTER ── */
        .hp-footer {
          position: relative;
          z-index: 1;
          width: 100%;
          max-width: 900px;
          padding: 0 1rem 2rem;
        }
        .hp-footer-divider {
          height: 1px;
          background: rgba(255,255,255,0.07);
          margin-bottom: 1.25rem;
        }
        .hp-footer-content {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: space-between;
          gap: 0.5rem;
        }
        .hp-footer-brand {
          font-size: 1rem;
          font-weight: 800;
          letter-spacing: -0.02em;
          color: #e2e8f0;
        }
        .hp-footer-grad {
          background: linear-gradient(135deg,#60a5fa,#34d399);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .hp-footer-copy {
          font-size: 0.8rem;
          color: #475569;
        }
        .hp-footer-tagline {
          font-size: 0.8rem;
          color: #475569;
        }
      `}</style>
    </div>
  );
}
