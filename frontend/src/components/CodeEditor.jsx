import { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { Play, RotateCcw, Cpu } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store';
import { executeCode, verifySolutionWithML } from '../services/api';
import { analyzeComplexity } from '../services/complexityAnalyzer';
import ComplexityModal from './ComplexityModal';

const LANGUAGES = [
  { id: 'python',     name: 'Python 3', color: '#3b82f6', emoji: '🐍' },
  { id: 'javascript', name: 'Node.js',  color: '#f59e0b', emoji: '⚡' },
  { id: 'java',       name: 'Java',     color: '#f97316', emoji: '☕' },
  { id: 'cpp',        name: 'C++',      color: '#8b5cf6', emoji: '⚙️' },
  { id: 'c',          name: 'C',        color: '#10b981', emoji: '🔧' },
];


export default function CodeEditor({ problem }) {
  const { savedCode, saveCode, addSolvedProblem } = useStore();
  const [language, setLanguage] = useState('python');
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);
  const [isError, setIsError] = useState(false);
  const [complexityResult, setComplexityResult] = useState(null);
  const [langFlash, setLangFlash] = useState(null); // {name, color} while animating

  useEffect(() => {
    if (!problem) return;
    const local = savedCode[`${problem._id}-${language}`];
    if (local !== undefined) {
      setCode(local);
    } else {
      setCode(problem.defaultCode?.[language] || '// Write your code here');
    }
  }, [problem, language]);

  const handleEditorChange = (value) => {
    setCode(value);
    if (problem) saveCode(problem._id, language, value);
  };

  const handleLanguageChange = (e) => {
    const newLang = LANGUAGES.find(l => l.id === e.target.value);
    setLanguage(e.target.value);
    if (newLang) {
      setLangFlash(newLang);
      setTimeout(() => setLangFlash(null), 900);
    }
  };

  const handleRun = async () => {
    if (!code.trim() || !problem) return;
    
    // Check if code is still just the default boilerplate
    const defaultCode = problem.defaultCode?.[language]?.trim();
    if (code.trim() === defaultCode) {
      toast.error('Please implement your solution before running analysis');
      return;
    }

    setIsExecuting(true);
    setOutput('Executing...');
    setIsError(false);

    try {
      try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
        oscillator.connect(audioContext.destination);
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.1);
      } catch (e) {}

      const timeout = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('timeout')), 3000)
      );
      const result = await Promise.race([executeCode(language, code), timeout]);
      const baseOutput = result.output || 'Code executed with no output.';
      setOutput(baseOutput);
      setIsError(result.isError);

      if (result.isError) {
        toast.error('Execution finished with errors');
        setIsExecuting(false);
      } else {
        // Now verify with ML
        setOutput(baseOutput + '\n\n🤖 Verifying solution with AI...');
        try {
          const mlResult = await verifySolutionWithML(problem.description, language, code, baseOutput);
          
          if (mlResult.isCorrect) {
            const complexity = analyzeComplexity(code);
            addSolvedProblem(problem._id, problem.title, problem.difficulty, complexity.time, complexity.space);
            setComplexityResult(complexity);
            setOutput(baseOutput + `\n\n✅ AI: ${mlResult.feedback || 'Solution is correct!'}\nComplexity analysis generated.`);
          } else {
            setOutput(baseOutput + `\n\n❌ AI Feedback: ${mlResult.feedback || 'Incorrect solution.'}`);
          }
        } catch (mlErr) {
          setOutput(baseOutput + '\n\n⚠️ Failed to contact AI verifier. Showing complexity analysis anyway.');
          const complexity = analyzeComplexity(code);
          addSolvedProblem(problem._id, problem.title, problem.difficulty, complexity.time, complexity.space);
          setComplexityResult(complexity);
        }
        setIsExecuting(false);
      }
    } catch (error) {
      setIsExecuting(false);
      setOutput('⚡ Server offline or timeout — cannot verify solution.');
      setIsError(true);
      toast.error('Execution failed');
    }
  };

  const handleClear = () => {
    if (problem) {
      const defaultState = problem.defaultCode?.[language] || '// Write your code here';
      setCode(defaultState);
      saveCode(problem._id, language, defaultState);
      setOutput('');
    }
  };

  if (!problem) return (
    <div className="glass-panel h-full flex items-center justify-center p-6 text-slate-500">
      Select a problem to start coding
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '8px' }}>

      {/* ── EDITOR SECTION ───────────────────────────────────── */}
      <div className="glass-panel flex flex-col overflow-hidden min-h-0" style={{ flex: 1 }}>
        {/* Toolbar */}
        <div className="px-4 py-2 border-b border-white/10 flex justify-between items-center bg-dark-900/40 shrink-0">
          <select
            value={language}
          onChange={handleLanguageChange}
            className="bg-dark-800 text-slate-200 border border-white/10 rounded px-2 py-1 text-sm outline-none focus:border-primary-500 transition-colors"
          >
            {LANGUAGES.map(lang => (
              <option key={lang.id} value={lang.id}>{lang.name}</option>
            ))}
          </select>

          <div className="flex gap-2">
            <button
              onClick={handleClear}
              className="px-3 py-1.5 rounded bg-white/5 hover:bg-white/10 text-slate-300 text-sm font-medium transition-colors flex items-center gap-1.5"
            >
              <RotateCcw size={14} /> Reset
            </button>
            <button
              onClick={handleRun}
              disabled={isExecuting}
              className="px-4 py-1.5 rounded bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium transition-colors flex items-center gap-1.5 disabled:opacity-50"
            >
              {isExecuting ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Play size={14} fill="currentColor" />
              )}
              {isExecuting ? 'Running' : 'Run & Analyze'}
            </button>
          </div>
        </div>

        {/* Monaco editor */}
        <div style={{ flex: 1, position: 'relative', minHeight: 0 }}>
          <Editor
            height="100%"
            language={language === 'c' || language === 'cpp' ? 'cpp' : language}
            theme="vs-dark"
            value={code}
            onChange={handleEditorChange}
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              fontFamily: '"Fira Code", monospace',
              padding: { top: 16 },
              scrollBeyondLastLine: false,
              smoothScrolling: true,
              cursorBlinking: 'smooth',
              automaticLayout: true
            }}
          />

          {/* ── Language Flash Overlay ── */}
          <AnimatePresence>
            {langFlash && (
              <motion.div
                key={langFlash.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'rgba(0,0,0,0.82)',
                  backdropFilter: 'blur(4px)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  zIndex: 20,
                  pointerEvents: 'none',
                }}
              >
                {/* Emoji */}
                <motion.div
                  initial={{ scale: 0.4, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 1.4, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 280, damping: 18 }}
                  style={{ fontSize: '2.8rem', lineHeight: 1 }}
                >
                  {langFlash.emoji}
                </motion.div>

                {/* Language name */}
                <motion.div
                  initial={{ scale: 0.55, opacity: 0, y: 12 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 1.25, opacity: 0, y: -8 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 16, delay: 0.04 }}
                  style={{
                    fontSize: 'clamp(2rem, 5vw, 3.2rem)',
                    fontWeight: 900,
                    letterSpacing: '-0.04em',
                    color: langFlash.color,
                    textShadow: `0 0 40px ${langFlash.color}99, 0 0 80px ${langFlash.color}44`,
                    fontFamily: '"Fira Code", monospace',
                    lineHeight: 1,
                  }}
                >
                  {langFlash.name}
                </motion.div>

                {/* Thin glow underline */}
                <motion.div
                  initial={{ scaleX: 0, opacity: 0 }}
                  animate={{ scaleX: 1, opacity: 1 }}
                  exit={{ scaleX: 0, opacity: 0 }}
                  transition={{ duration: 0.25, delay: 0.08 }}
                  style={{
                    height: '2px',
                    width: '120px',
                    background: `linear-gradient(90deg, transparent, ${langFlash.color}, transparent)`,
                    borderRadius: '9999px',
                    transformOrigin: 'center',
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── CONSOLE SECTION (always below editor) ────────────── */}
      <div style={{
        height: '220px',
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        borderRadius: '12px',
        border: '1px solid rgba(255,255,255,0.08)',
        background: 'rgba(8,10,18,0.9)',
        backdropFilter: 'blur(12px)',
      }}>
        {/* Console header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.4rem 1rem',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
          background: 'rgba(0,0,0,0.35)',
          flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            {/* macOS traffic dots */}
            <span style={{ width:10,height:10,borderRadius:'50%',background:'#ff5f57',display:'inline-block' }} />
            <span style={{ width:10,height:10,borderRadius:'50%',background:'#febc2e',display:'inline-block' }} />
            <span style={{ width:10,height:10,borderRadius:'50%',background:'#28c840',display:'inline-block' }} />
            <span style={{ marginLeft:'0.5rem',fontSize:'0.78rem',fontWeight:600,color:'#94a3b8',letterSpacing:'0.06em',textTransform:'uppercase' }}>
              Console
            </span>
          </div>
          {complexityResult && (
            <button
              onClick={() => setComplexityResult({ ...complexityResult })}
              style={{ display:'flex',alignItems:'center',gap:'0.35rem',fontSize:'0.75rem',color:'#60a5fa',background:'none',border:'none',cursor:'pointer' }}
            >
              <Cpu size={12} /> View Complexity
            </button>
          )}
        </div>

        {/* Console body */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '0.6rem 1rem',
          fontFamily: '"Fira Code","Cascadia Code",monospace',
          fontSize: '0.82rem',
          lineHeight: 1.7,
        }}>
          {output ? (
            <>
              <div style={{ color:'#4ade80', marginBottom:'0.2rem', fontSize:'0.72rem', opacity:0.7 }}>
                $ run {language}
              </div>
              <pre style={{
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                margin: 0,
                color: isError ? '#f87171' : '#e2e8f0',
              }}>
                {output}
              </pre>
            </>
          ) : (
            <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', color:'#475569' }}>
              <span style={{ color:'#4ade80', fontSize:'0.8rem' }}>▶</span>
              <span>Run your code to see output here...</span>
            </div>
          )}
        </div>
      </div>

      {/* 3D Complexity Modal */}
      <AnimatePresence>
        {complexityResult && (
          <ComplexityModal result={complexityResult} onClose={() => setComplexityResult(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}

