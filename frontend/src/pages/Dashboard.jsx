import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  CheckCircle2, Clock, Cpu, Brain, TrendingUp,
  ArrowLeft, Trophy, Zap, Target, BarChart2
} from 'lucide-react';
import { useStore } from '../store';

/* ── helpers ──────────────────────────────────────── */
const diffColor = {
  Easy:   { bg: 'rgba(16,185,129,0.12)', text: '#34d399', border: 'rgba(16,185,129,0.3)' },
  Medium: { bg: 'rgba(245,158,11,0.12)', text: '#fbbf24', border: 'rgba(245,158,11,0.3)' },
  Hard:   { bg: 'rgba(239,68,68,0.12)',  text: '#f87171', border: 'rgba(239,68,68,0.3)'  },
};

const complexityScore = (tc, sc) => {
  const order = ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)', 'O(n²)', 'O(2ⁿ)', 'O(n!)'];
  const ti = order.indexOf(tc ?? ''); 
  const si = order.indexOf(sc ?? '');
  const ts = ti === -1 ? 3 : ti;
  const ss = si === -1 ? 3 : si;
  return Math.max(0, Math.round(100 - (ts + ss) * 8));
};

const logicalScore = (solved) => {
  if (!solved.length) return 0;
  const avg = solved.reduce((s, p) => s + complexityScore(p.timeComplexity, p.spaceComplexity), 0) / solved.length;
  return Math.round(avg);
};

const formatDate = (iso) => {
  const d = new Date(iso);
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
};

/* ── stat card ────────────────────────────────────── */
function StatCard({ icon: Icon, label, value, color, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.45 }}
      style={{
        background: 'rgba(15,23,42,0.65)',
        border: `1px solid ${color}33`,
        borderRadius: 16,
        padding: '1.25rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        backdropFilter: 'blur(12px)',
        boxShadow: `0 0 30px ${color}18`,
      }}
    >
      <div style={{
        width: 48, height: 48, borderRadius: 14,
        background: color + '1a',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>
        <Icon size={22} style={{ color }} />
      </div>
      <div>
        <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#e2e8f0', lineHeight: 1 }}>
          {value}
        </div>
        <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          {label}
        </div>
      </div>
    </motion.div>
  );
}

/* ── complexity badge ─────────────────────────────── */
function ComplexBadge({ label, value, color }) {
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
      padding: '0.25rem 0.65rem',
      borderRadius: 9999,
      background: color + '18',
      border: `1px solid ${color}44`,
      fontSize: '0.78rem', fontWeight: 600, color,
      fontFamily: '"Fira Code", monospace',
    }}>
      <span style={{ color: '#64748b', fontSize: '0.7rem', fontFamily: 'sans-serif' }}>{label}</span>
      {value ?? '—'}
    </div>
  );
}

/* ── score ring ───────────────────────────────────── */
function ScoreRing({ score }) {
  const r = 52;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;

  return (
    <div style={{ position: 'relative', width: 130, height: 130 }}>
      <svg width="130" height="130" style={{ transform: 'rotate(-90deg)' }}>
        <circle cx="65" cy="65" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10" />
        <motion.circle
          cx="65" cy="65" r={r} fill="none"
          stroke="url(#scoreGrad)" strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: circ - dash }}
          transition={{ duration: 1.2, ease: 'easeOut', delay: 0.4 }}
        />
        <defs>
          <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#60a5fa" />
            <stop offset="100%" stopColor="#34d399" />
          </linearGradient>
        </defs>
      </svg>
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
      }}>
        <span style={{ fontSize: '1.8rem', fontWeight: 900, color: '#e2e8f0', lineHeight: 1 }}>{score}</span>
        <span style={{ fontSize: '0.65rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em' }}>score</span>
      </div>
    </div>
  );
}

/* ── main ─────────────────────────────────────────── */
export default function Dashboard() {
  const { user, solvedProblems, problems } = useStore();
  const navigate = useNavigate();

  const total      = solvedProblems.length;
  const easy       = solvedProblems.filter(p => p.difficulty === 'Easy').length;
  const medium     = solvedProblems.filter(p => p.difficulty === 'Medium').length;
  const hard       = solvedProblems.filter(p => p.difficulty === 'Hard').length;
  const lScore     = logicalScore(solvedProblems);
  const totalAvail = problems.length || 50;

  /* most common complexities */
  const tcFreq = {};
  const scFreq = {};
  solvedProblems.forEach(p => {
    if (p.timeComplexity)  tcFreq[p.timeComplexity]  = (tcFreq[p.timeComplexity]  || 0) + 1;
    if (p.spaceComplexity) scFreq[p.spaceComplexity] = (scFreq[p.spaceComplexity] || 0) + 1;
  });
  const topTC = Object.entries(tcFreq).sort((a,b) => b[1]-a[1])[0]?.[0] ?? '—';
  const topSC = Object.entries(scFreq).sort((a,b) => b[1]-a[1])[0]?.[0] ?? '—';

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
  };

  return (
    <div style={{
      minHeight: '100vh',
      padding: '1.5rem',
      position: 'relative',
      zIndex: 1,
      boxSizing: 'border-box',
    }}>
      {/* subtle orb */}
      <div style={{
        position: 'fixed', width: 420, height: 420,
        background: 'rgba(99,102,241,0.08)',
        borderRadius: '50%', filter: 'blur(100px)',
        top: -100, right: -100, pointerEvents: 'none', zIndex: 0,
      }} />

      <div style={{ maxWidth: 1100, margin: '0 auto', position: 'relative', zIndex: 1 }}>

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}
        >
          <div>
            <button
              onClick={() => navigate('/')}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.4rem',
                background: 'none', border: 'none', cursor: 'pointer',
                color: '#64748b', fontSize: '0.85rem', marginBottom: '0.5rem',
              }}
            >
              <ArrowLeft size={14} /> Back to Home
            </button>
            <h1 style={{
              margin: 0, fontSize: 'clamp(1.5rem, 3vw, 2.2rem)',
              fontWeight: 900, letterSpacing: '-0.03em',
            }}>
              <span style={{
                background: 'linear-gradient(135deg,#60a5fa,#34d399)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>Dashboard</span>
            </h1>
            <p style={{ margin: '0.25rem 0 0', color: '#64748b', fontSize: '0.9rem' }}>
              {user?.username ? `@${user.username}` : 'Your'} performance overview
            </p>
          </div>

          {/* progress pill */}
          <div style={{
            background: 'rgba(99,102,241,0.1)',
            border: '1px solid rgba(99,102,241,0.25)',
            borderRadius: 9999,
            padding: '0.5rem 1.25rem',
            display: 'flex', alignItems: 'center', gap: '0.5rem',
          }}>
            <Target size={14} style={{ color: '#818cf8' }} />
            <span style={{ fontSize: '0.85rem', color: '#a5b4fc', fontWeight: 600 }}>
              {total} / {totalAvail} solved
            </span>
          </div>
        </motion.div>

        {/* ── Top stat cards ── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '1rem',
          marginBottom: '1.5rem',
        }}>
          <StatCard icon={CheckCircle2} label="Total Solved"   value={total}  color="#60a5fa" delay={0.1} />
          <StatCard icon={Trophy}       label="Easy"           value={easy}   color="#34d399" delay={0.15} />
          <StatCard icon={Zap}          label="Medium"         value={medium} color="#fbbf24" delay={0.2} />
          <StatCard icon={TrendingUp}   label="Hard"           value={hard}   color="#f87171" delay={0.25} />
        </div>

        {/* ── Middle row: score ring + complexity summary ── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '1rem',
          marginBottom: '1.5rem',
        }}>

          {/* Logical Thinking Score card */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.35, duration: 0.45 }}
            style={{
              background: 'rgba(15,23,42,0.65)',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: 16,
              backdropFilter: 'blur(12px)',
              padding: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '1.5rem',
            }}
          >
            <ScoreRing score={lScore} />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <Brain size={18} style={{ color: '#818cf8' }} />
                <span style={{ fontWeight: 700, fontSize: '1rem', color: '#e2e8f0' }}>Logical Thinking Score</span>
              </div>
              <p style={{ margin: 0, fontSize: '0.82rem', color: '#64748b', lineHeight: 1.6, maxWidth: 250 }}>
                Computed from the time & space complexity of all your submissions.
                Higher efficiency = higher score.
              </p>
              <div style={{ marginTop: '0.75rem' }}>
                {lScore >= 80 && <span style={{ fontSize: '0.8rem', color: '#34d399', fontWeight: 600 }}>🏆 Excellent</span>}
                {lScore >= 60 && lScore < 80 && <span style={{ fontSize: '0.8rem', color: '#fbbf24', fontWeight: 600 }}>⚡ Good</span>}
                {lScore > 0  && lScore < 60  && <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>📈 Keep going</span>}
                {lScore === 0 && <span style={{ fontSize: '0.8rem', color: '#475569' }}>Solve problems to earn a score</span>}
              </div>
            </div>
          </motion.div>

          {/* Complexity summary card */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.35, duration: 0.45 }}
            style={{
              background: 'rgba(15,23,42,0.65)',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: 16,
              backdropFilter: 'blur(12px)',
              padding: '1.5rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <BarChart2 size={18} style={{ color: '#60a5fa' }} />
              <span style={{ fontWeight: 700, fontSize: '1rem', color: '#e2e8f0' }}>Complexity Overview</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              {[
                { icon: Clock, label: 'Most Common Time', value: topTC, color: '#60a5fa' },
                { icon: Cpu,   label: 'Most Common Space', value: topSC, color: '#8b5cf6' },
              ].map(item => (
                <div key={item.label} style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: 12, padding: '0.9rem',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
                    <item.icon size={13} style={{ color: item.color }} />
                    <span style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                      {item.label}
                    </span>
                  </div>
                  <div style={{
                    fontSize: '1.3rem', fontWeight: 800,
                    fontFamily: '"Fira Code", monospace',
                    color: item.color,
                    textShadow: `0 0 20px ${item.color}55`,
                  }}>
                    {item.value}
                  </div>
                </div>
              ))}

              {/* Difficulty breakdown mini‑bars */}
              {[
                { label: 'Easy',   count: easy,   total, color: '#34d399' },
                { label: 'Medium', count: medium, total, color: '#fbbf24' },
                { label: 'Hard',   count: hard,   total, color: '#f87171' },
              ].map(d => (
                <div key={d.label} style={{ gridColumn: d.label === 'Hard' ? 'span 1' : 'span 1' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontSize: '0.75rem', color: d.color, fontWeight: 600 }}>{d.label}</span>
                    <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{d.count}</span>
                  </div>
                  <div style={{ height: 6, borderRadius: 9999, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: total ? `${(d.count / total) * 100}%` : '0%' }}
                      transition={{ delay: 0.6, duration: 0.8, ease: 'easeOut' }}
                      style={{ height: '100%', background: d.color, borderRadius: 9999 }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* ── Solved Problems Table ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.45 }}
          style={{
            background: 'rgba(15,23,42,0.65)',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: 16,
            backdropFilter: 'blur(12px)',
            overflow: 'hidden',
          }}
        >
          <div style={{
            padding: '1rem 1.5rem',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            display: 'flex', alignItems: 'center', gap: '0.5rem',
          }}>
            <CheckCircle2 size={16} style={{ color: '#34d399' }} />
            <span style={{ fontWeight: 700, color: '#e2e8f0', fontSize: '0.95rem' }}>
              Solved Problems
            </span>
            <span style={{
              marginLeft: 'auto',
              background: 'rgba(52,211,153,0.12)',
              border: '1px solid rgba(52,211,153,0.25)',
              color: '#34d399', fontSize: '0.75rem', fontWeight: 600,
              borderRadius: 9999, padding: '0.15rem 0.6rem',
            }}>{total} total</span>
          </div>

          {total === 0 ? (
            <div style={{
              padding: '3rem', textAlign: 'center',
              color: '#475569', fontSize: '0.9rem',
            }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🎯</div>
              You haven't solved any problems yet. 
              <button
                onClick={() => navigate('/problems')}
                style={{
                  display: 'block', margin: '1rem auto 0',
                  background: 'linear-gradient(135deg,#3b82f6,#6366f1)',
                  border: 'none', borderRadius: 10, padding: '0.6rem 1.4rem',
                  color: '#fff', fontWeight: 700, cursor: 'pointer', fontSize: '0.9rem',
                }}
              >
                Start Solving →
              </button>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: 'rgba(255,255,255,0.03)' }}>
                    {['#', 'Problem', 'Difficulty', 'Time Complexity', 'Space Complexity', 'Score', 'Solved On'].map(h => (
                      <th key={h} style={{
                        padding: '0.6rem 1rem',
                        textAlign: 'left', fontSize: '0.72rem',
                        color: '#475569', fontWeight: 600,
                        textTransform: 'uppercase', letterSpacing: '0.06em',
                        borderBottom: '1px solid rgba(255,255,255,0.05)',
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[...solvedProblems].reverse().map((p, i) => {
                    const dc = diffColor[p.difficulty] ?? diffColor.Easy;
                    const sc = complexityScore(p.timeComplexity, p.spaceComplexity);
                    return (
                      <motion.tr
                        key={p.problemId}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.55 + i * 0.05 }}
                        style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
                      >
                        <td style={{ padding: '0.75rem 1rem', color: '#475569', fontSize: '0.82rem' }}>{i + 1}</td>
                        <td style={{ padding: '0.75rem 1rem', color: '#cbd5e1', fontSize: '0.88rem', fontWeight: 600 }}>
                          {p.title}
                        </td>
                        <td style={{ padding: '0.75rem 1rem' }}>
                          <span style={{
                            padding: '0.2rem 0.6rem',
                            borderRadius: 9999,
                            background: dc.bg,
                            border: `1px solid ${dc.border}`,
                            color: dc.text,
                            fontSize: '0.75rem', fontWeight: 600,
                          }}>{p.difficulty}</span>
                        </td>
                        <td style={{ padding: '0.75rem 1rem' }}>
                          <ComplexBadge label="T:" value={p.timeComplexity  ?? '—'} color="#60a5fa" />
                        </td>
                        <td style={{ padding: '0.75rem 1rem' }}>
                          <ComplexBadge label="S:" value={p.spaceComplexity ?? '—'} color="#8b5cf6" />
                        </td>
                        <td style={{ padding: '0.75rem 1rem' }}>
                          <span style={{
                            fontWeight: 700, fontSize: '0.9rem',
                            color: sc >= 80 ? '#34d399' : sc >= 60 ? '#fbbf24' : '#94a3b8',
                          }}>{sc}</span>
                        </td>
                        <td style={{ padding: '0.75rem 1rem', color: '#475569', fontSize: '0.8rem' }}>
                          {p.solvedAt ? formatDate(p.solvedAt) : '—'}
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>

      </div>
    </div>
  );
}
