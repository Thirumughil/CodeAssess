import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { useStore } from '../store';
import Navbar from '../components/Navbar';
import ProblemDescription from '../components/ProblemDescription';
import CodeEditor from '../components/CodeEditor';
import { getProblems } from '../services/api';


import { FALLBACK_PROBLEMS } from '../services/fallbackData';



export default function ProblemSolvePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { problems, setProblems, currentProblem, setCurrentProblem } = useStore();

  useEffect(() => {
    window.onerror = (msg, url, line) => {
      console.log('PANIC ERROR:', msg, 'at', line);
      alert('Production Error: ' + msg);
    };
  }, []);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadProblems = async () => {
      setIsLoading(true);
      setError(null);
      let allProblems = problems;
      try {
        if (!allProblems || allProblems.length === 0) {
          const data = await getProblems();
          allProblems = data.problems || data;
          if (Array.isArray(allProblems)) setProblems(allProblems);
        }
        const found = allProblems?.find(p => p?._id === id || p?._id === String(id));
        if (found) {
          setCurrentProblem(found);
        } else {
          setError('Problem not found');
        }
      } catch (err) {
        console.error('Failed to load problems:', err);
        const fallback = FALLBACK_PROBLEMS.find(p => p?._id === id || p?._id === String(id));
        if (fallback) {
          setCurrentProblem(fallback);
        } else {
          setError('Failed to load problem data');
        }
      } finally {
        setIsLoading(false);
      }
    };
    loadProblems();
  }, [id, setProblems, setCurrentProblem]);

  if (isLoading) {
    return (
      <div className="h-screen flex flex-col bg-dark-900">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
            <p className="text-slate-400 animate-pulse font-medium">Loading challenge...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !currentProblem) {
    return (
      <div className="h-screen flex flex-col bg-dark-900">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="glass-panel p-10 max-w-md w-full text-center border-red-500/20">
            <div className="text-4xl mb-4">⚠️</div>
            <h2 className="text-xl font-bold text-slate-100 mb-2">{error || 'Problem Not Found'}</h2>
            <p className="text-slate-500 mb-6 text-sm">
              The problem you are looking for doesn't exist or could not be loaded.
            </p>
            <button
              onClick={() => navigate('/problems')}
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-all shadow-lg shadow-blue-500/20"
            >
              Back to Problems
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      <Navbar />

      <div className="flex-1 flex flex-col pt-16 px-4 pb-4 overflow-hidden">
        {/* Back + Title bar */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 mb-3 shrink-0"
        >
          <button
            onClick={() => navigate('/problems')}
            className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-200 transition-colors"
          >
            <ArrowLeft size={16} /> Back to Problems
          </button>
          <span className="text-slate-600">/ {currentProblem.title}</span>
        </motion.div>

        {/* 2-column layout: description | editor */}
        <div className="flex-1 min-h-0 flex gap-4">
          <div className="w-[40%] h-full flex flex-col min-w-[300px]">
            <ProblemDescription problem={currentProblem} />
          </div>
          
          <div className="flex-1 h-full flex flex-col">
            <CodeEditor problem={currentProblem} />
          </div>
        </div>
      </div>
    </div>
  );
}
