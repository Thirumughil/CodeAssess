import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, ChevronDown, Brain, TrendingUp, Clock, Database, Award } from 'lucide-react';
import Navbar from '../components/Navbar';
import { useStore } from '../store';

const complexityScore = {
  'O(1)': 100, 'O(log n)': 90, 'O(n)': 75,
  'O(n log n)': 55, 'O(n²)': 35, 'O(n³)': 20,
  'O(2ⁿ)': 10, 'O(n!)': 5,
};

const complexityColor = {
  'O(1)': '#22c55e', 'O(log n)': '#84cc16',
  'O(n)': '#eab308', 'O(n log n)': '#f97316',
  'O(n²)': '#ef4444', 'O(2ⁿ)': '#dc2626', 'O(n!)': '#991b1b',
};

function DonutChart({ value, max = 100, color, label, size = 100 }) {
  const r = 38;
  const circ = 2 * Math.PI * r;
  const offset = circ - (value / max) * circ;

  return (
    <div className="flex flex-col items-center gap-2">
      <svg width={size} height={size} viewBox="0 0 100 100" className="-rotate-90">
        <circle cx="50" cy="50" r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="10" />
        <motion.circle
          cx="50" cy="50" r={r} fill="none"
          stroke={color} strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
        />
      </svg>
      <div className="text-center -mt-1">
        <div className="text-xl font-bold text-slate-100">{Math.round(value)}</div>
        <div className="text-xs text-slate-500">{label}</div>
      </div>
    </div>
  );
}

function ToggleSection({ title, icon: Icon, color, children }) {
  const [open, setOpen] = useState(false);

  return (
    <div className={`glass-panel border border-white/5 overflow-hidden`}>
      <button
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-white/5 transition-colors"
        onClick={() => setOpen(!open)}
      >
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center`} style={{ background: `${color}20`, border: `1px solid ${color}40` }}>
            <Icon size={16} style={{ color }} />
          </div>
          <span className="font-semibold text-slate-200">{title}</span>
        </div>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.3 }}>
          <ChevronDown size={18} className="text-slate-400" />
        </motion.div>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35 }}
          >
            <div className="px-5 pb-5 border-t border-white/5 pt-4">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ComplexityBar({ label, value, color, max = 100 }) {
  return (
    <div className="mb-3">
      <div className="flex justify-between text-xs mb-1">
        <span className="font-mono" style={{ color }}>{label}</span>
        <span className="text-slate-500">score: {value}</span>
      </div>
      <div className="h-2 rounded-full bg-white/5 overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ background: color }}
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const { user, solvedProblems } = useStore();

  const totalSolved = solvedProblems.length;
  const easyCount = solvedProblems.filter(p => p.difficulty === 'Easy').length;
  const mediumCount = solvedProblems.filter(p => p.difficulty === 'Medium').length;
  const hardCount = solvedProblems.filter(p => p.difficulty === 'Hard').length;

  const avgTimeScore = totalSolved
    ? solvedProblems.reduce((sum, p) => sum + (complexityScore[p.timeComplexity] || 50), 0) / totalSolved
    : 0;
  const avgSpaceScore = totalSolved
    ? solvedProblems.reduce((sum, p) => sum + (complexityScore[p.spaceComplexity] || 50), 0) / totalSolved
    : 0;

  const logicalScore = Math.round((avgTimeScore * 0.6 + avgSpaceScore * 0.4));

  const timeFreq = solvedProblems.reduce((acc, p) => {
    acc[p.timeComplexity] = (acc[p.timeComplexity] || 0) + 1;
    return acc;
  }, {});

  const spaceFreq = solvedProblems.reduce((acc, p) => {
    acc[p.spaceComplexity] = (acc[p.spaceComplexity] || 0) + 1;
    return acc;
  }, {});

  const logicalLabel =
    logicalScore >= 85 ? 'Elite Algorithmist' :
    logicalScore >= 70 ? 'Efficient Thinker' :
    logicalScore >= 50 ? 'Growing Developer' :
    totalSolved === 0 ? 'No problems solved yet' :
    'Beginner';

  return (
    <div className="min-h-screen pt-20 pb-12 px-4">
      <Navbar />

      <div className="max-w-3xl mx-auto space-y-6">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel border border-white/5 px-8 py-6 flex items-center gap-6"
        >
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center text-2xl font-bold text-white shadow-lg shadow-blue-900/30">
            {user?.username?.[0]?.toUpperCase() || <User size={28} />}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-100">{user?.username}</h1>
            <p className="text-slate-500 text-sm">{user?.email}</p>
            <span className="mt-1.5 inline-block text-xs px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
              {logicalLabel}
            </span>
          </div>
        </motion.div>

        {/* Overview Stats */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4"
        >
          {[
            { label: 'Total Solved', value: totalSolved, color: '#60a5fa' },
            { label: 'Easy', value: easyCount, color: '#22c55e' },
            { label: 'Medium', value: mediumCount, color: '#eab308' },
            { label: 'Hard', value: hardCount, color: '#ef4444' },
          ].map(stat => (
            <div key={stat.label} className="glass-panel border border-white/5 p-5 text-center">
              <motion.div
                className="text-3xl font-bold"
                style={{ color: stat.color }}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, type: 'spring' }}
              >
                {stat.value}
              </motion.div>
              <div className="text-xs text-slate-500 mt-1">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Logical Thinking Score */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-panel border border-white/5 px-8 py-6"
        >
          <div className="flex items-center gap-2 mb-6">
            <Brain size={18} className="text-purple-400" />
            <h2 className="font-semibold text-slate-200">Logical Thinking Analysis</h2>
          </div>

          <div className="flex flex-wrap items-center justify-around gap-8">
            <DonutChart value={logicalScore} color="#a78bfa" label="Overall Score" size={130} />
            <DonutChart value={avgTimeScore} color="#60a5fa" label="Time Efficiency" size={110} />
            <DonutChart value={avgSpaceScore} color="#34d399" label="Space Efficiency" size={110} />

            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto mb-2">
                <Award size={28} className="text-amber-400" />
              </div>
              <div className="text-slate-200 font-medium text-sm">{logicalLabel}</div>
              <div className="text-slate-500 text-xs mt-0.5">Classification</div>
            </div>
          </div>

          {totalSolved === 0 && (
            <p className="text-center text-slate-500 text-sm mt-6">
              Solve problems to build your analysis. Each solution updates your score!
            </p>
          )}
        </motion.div>

        {/* Toggle Sections */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-3"
        >
          <ToggleSection title="Time Complexity History" icon={Clock} color="#60a5fa">
            {Object.keys(timeFreq).length === 0 ? (
              <p className="text-slate-500 text-sm">No data yet. Solve problems to see your history.</p>
            ) : (
              <div>
                {Object.entries(timeFreq).map(([comp, cnt]) => (
                  <ComplexityBar
                    key={comp}
                    label={`${comp} (×${cnt})`}
                    value={(complexityScore[comp] || 50)}
                    color={complexityColor[comp] || '#60a5fa'}
                  />
                ))}
              </div>
            )}
          </ToggleSection>

          <ToggleSection title="Space Complexity History" icon={Database} color="#34d399">
            {Object.keys(spaceFreq).length === 0 ? (
              <p className="text-slate-500 text-sm">No data yet. Solve problems to see your history.</p>
            ) : (
              <div>
                {Object.entries(spaceFreq).map(([comp, cnt]) => (
                  <ComplexityBar
                    key={comp}
                    label={`${comp} (×${cnt})`}
                    value={(complexityScore[comp] || 50)}
                    color={complexityColor[comp] || '#34d399'}
                  />
                ))}
              </div>
            )}
          </ToggleSection>

          <ToggleSection title="Solved Problems Detail" icon={TrendingUp} color="#f59e0b">
            {solvedProblems.length === 0 ? (
              <p className="text-slate-500 text-sm">No problems solved yet.</p>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {solvedProblems.map((p, i) => (
                  <motion.div
                    key={p.problemId}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="flex items-center justify-between bg-white/5 rounded-lg px-4 py-2.5 text-sm"
                  >
                    <div>
                      <span className="text-slate-200 font-medium">{p.title}</span>
                      <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
                        p.difficulty === 'Easy' ? 'bg-emerald-500/10 text-emerald-400' :
                        p.difficulty === 'Medium' ? 'bg-amber-500/10 text-amber-400' :
                        'bg-red-500/10 text-red-400'
                      }`}>{p.difficulty}</span>
                    </div>
                    <div className="flex gap-2 text-xs font-mono">
                      <span style={{ color: complexityColor[p.timeComplexity] || '#60a5fa' }}>{p.timeComplexity}</span>
                      <span className="text-slate-600">/</span>
                      <span style={{ color: complexityColor[p.spaceComplexity] || '#34d399' }}>{p.spaceComplexity}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </ToggleSection>
        </motion.div>
      </div>
    </div>
  );
}
