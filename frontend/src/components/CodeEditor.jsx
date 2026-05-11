import { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { Play, RotateCcw, Cpu } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store';
import { executeCode, verifySolutionWithML, createSubmission } from '../services/api';
import { analyzeComplexity } from '../services/complexityAnalyzer';
import { complexityScore } from '../utils/stats';
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
  const [langFlash, setLangFlash] = useState(null);

  useEffect(() => {
    if (!problem) return;
    const local = savedCode[`${problem._id}-${language}`];
    if (local !== undefined) {
      setCode(local);
    } else {
      setCode(problem.defaultCode?.[language] || '// Write your code here');
    }
  }, [problem, language, savedCode]);

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
    
    const defaultCode = problem.defaultCode?.[language]?.trim();
    if (code.trim() === defaultCode) {
      toast.error('Please implement your solution before running analysis');
      return;
    }

    setIsExecuting(true);
    setOutput('Executing...');
    setIsError(false);

    try {
      const timeout = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('timeout')), 5000)
      );
      const result = await Promise.race([executeCode(language, code), timeout]);
      const baseOutput = result.output || 'Code executed with no output.';
      setOutput(baseOutput);
      setIsError(result.isError);

      if (result.isError) {
        toast.error('Execution finished with errors');
        setIsExecuting(false);
      } else {
        setOutput(baseOutput + '\n\n🤖 Verifying solution with AI...');
        try {
          const mlResult = await verifySolutionWithML(problem.description, language, code, baseOutput);
          
          if (mlResult.isCorrect) {
            const complexity = { time: mlResult.timeComplexity || 'O(?)', space: mlResult.spaceComplexity || 'O(?)' };
            const score = complexityScore(complexity.time, complexity.space);
            
            // 1. Update local store
            addSolvedProblem(problem._id, problem.title, problem.difficulty, complexity.time, complexity.space);
            
            // 2. Persist to backend
            try {
              await createSubmission({
                problemId: problem._id,
                language,
                code,
                isCorrect: true,
                timeComplexity: complexity.time,
                spaceComplexity: complexity.space,
                score
              });
            } catch (err) {
              console.error('Backend sync failed', err);
            }

            setComplexityResult(complexity);
            setOutput(baseOutput + `\n\n✅ AI: ${mlResult.feedback || 'Solution is correct!'}\nComplexity: Time ${complexity.time}, Space ${complexity.space}`);
          } else {
            setOutput(baseOutput + `\n\n❌ Status: Incorrect\n💡 AI Feedback: ${mlResult.feedback || 'Your solution does not meet the requirements.'}`);
          }
        } catch (mlErr) {
          const complexity = analyzeComplexity(code);
          addSolvedProblem(problem._id, problem.title, problem.difficulty, complexity.time, complexity.space);
          setComplexityResult(complexity);
          setOutput(baseOutput + '\n\n⚠️ AI verification offline. Fallback complexity applied.');
        }
        setIsExecuting(false);
      }
    } catch (error) {
      setIsExecuting(false);
      setOutput('⚡ Execution failed — check console or server.');
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
    <div className="flex flex-col h-full gap-2">
      <div className="glass-panel flex flex-col flex-1 overflow-hidden min-h-0">
        <div className="px-4 py-2 border-b border-white/10 flex justify-between items-center bg-dark-900/40">
          <select value={language} onChange={handleLanguageChange} className="bg-dark-800 text-slate-200 border border-white/10 rounded px-2 py-1 text-sm outline-none">
            {LANGUAGES.map(lang => <option key={lang.id} value={lang.id}>{lang.name}</option>)}
          </select>
          <div className="flex gap-2">
            <button onClick={handleClear} className="px-3 py-1.5 rounded bg-white/5 hover:bg-white/10 text-slate-300 text-sm flex items-center gap-1.5 transition-colors">
              <RotateCcw size={14} /> Reset
            </button>
            <button onClick={handleRun} disabled={isExecuting} className="px-4 py-1.5 rounded bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium flex items-center gap-1.5 transition-colors disabled:opacity-50">
              {isExecuting ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Play size={14} fill="currentColor" />}
              {isExecuting ? 'Running' : 'Run & Analyze'}
            </button>
          </div>
        </div>
        <div className="flex-1 relative min-h-0">
          <Editor height="100%" language={language === 'c' || language === 'cpp' ? 'cpp' : language} theme="vs-dark" value={code} onChange={handleEditorChange} options={{ minimap: { enabled: false }, fontSize: 14, fontFamily: '"Fira Code", monospace', padding: { top: 16 }, scrollBeyondLastLine: false, automaticLayout: true }} />
          {langFlash && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center gap-2 z-20 pointer-events-none">
              <motion.div initial={{ scale: 0.4 }} animate={{ scale: 1 }} className="text-5xl">{langFlash.emoji}</motion.div>
              <motion.div initial={{ y: 12 }} animate={{ y: 0 }} className="text-4xl font-black" style={{ color: langFlash.color }}>{langFlash.name}</motion.div>
            </motion.div>
          )}
        </div>
      </div>
      <div className="h-56 flex flex-col overflow-hidden rounded-xl border border-white/10 bg-black/90 backdrop-blur-md">
        <div className="flex items-center justify-between px-4 py-2 border-b border-white/5 bg-black/40">
          <div className="flex items-center gap-2">
            <div className="flex gap-1"><span className="w-2 h-2 rounded-full bg-red-500" /><span className="w-2 h-2 rounded-full bg-yellow-500" /><span className="w-2 h-2 rounded-full bg-green-500" /></div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-2">Console</span>
          </div>
          {complexityResult && (
            <button onClick={() => setComplexityResult({ ...complexityResult })} className="flex items-center gap-1 text-[10px] text-blue-400 uppercase font-bold hover:text-blue-300">
              <Cpu size={10} /> View Complexity
            </button>
          )}
        </div>
        <div className="flex-1 overflow-y-auto p-4 font-mono text-xs leading-relaxed">
          {output ? (
            <div className="flex flex-col gap-1">
              <div className="text-green-500/50">$ run {language}</div>
              <pre className={`whitespace-pre-wrap break-words ${isError ? 'text-red-400' : 'text-slate-200'}`}>{output}</pre>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-slate-600">
              <span className="text-green-500">▶</span>
              <span>Ready for execution...</span>
            </div>
          )}
        </div>
      </div>
      <AnimatePresence>
        {complexityResult && <ComplexityModal result={complexityResult} onClose={() => setComplexityResult(null)} />}
      </AnimatePresence>
    </div>
  );
}
