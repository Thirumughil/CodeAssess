import { useEffect } from 'react';
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

  useEffect(() => {
    const loadProblems = async () => {
      let allProblems = problems;
      if (allProblems.length === 0) {
        try {
          const data = await getProblems();
          allProblems = data.problems || data;
          setProblems(allProblems);
        } catch {
          allProblems = FALLBACK_PROBLEMS;
          setProblems(allProblems);
        }
      }
      const found = allProblems.find(p => p._id === id || p._id === String(id));
      if (found) setCurrentProblem(found);
    };
    loadProblems();
  }, [id, problems.length, setProblems, setCurrentProblem]);

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
          {currentProblem && (
            <span className="text-slate-600">/ {currentProblem.title}</span>
          )}
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
