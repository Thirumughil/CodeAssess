import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { useStore } from '../store';
import Navbar from '../components/Navbar';
import ProblemDescription from '../components/ProblemDescription';
import CodeEditor from '../components/CodeEditor';
import { getProblems } from '../services/api';
import toast from 'react-hot-toast';

import { FALLBACK_PROBLEMS } from '../services/fallbackData';

import { Panel, Group, Separator } from 'react-resizable-panels';

export default function ProblemSolvePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { problems, setProblems, currentProblem, setCurrentProblem } = useStore();

  useEffect(() => {
    const loadProblems = async () => {
      let allProblems = problems;
      if (allProblems.length === 0) {
        try {
          allProblems = await getProblems();
          setProblems(allProblems);
        } catch {
          allProblems = FALLBACK_PROBLEMS;
          setProblems(FALLBACK_PROBLEMS);
        }
      }
      const found = allProblems.find(p => p._id === id || p._id === String(id));
      if (found) setCurrentProblem(found);
    };
    loadProblems();
  }, [id]);

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

        {/* 2-column layout: description | editor with Resizable Panels */}
        <div className="flex-1 min-h-0">
          <Group direction="horizontal" className="flex gap-0">
            <Panel defaultSize={40} minSize={20} className="flex flex-col">
              <div className="h-full pr-2">
                <ProblemDescription problem={currentProblem} />
              </div>
            </Panel>

            <Separator className="group w-2 flex items-center justify-center transition-all">
              <div className="w-1 h-12 rounded-full bg-slate-700/50 group-hover:bg-blue-500/50 group-active:bg-blue-500 transition-colors" />
            </Separator>

            <Panel defaultSize={60} minSize={30} className="flex flex-col">
              <div className="h-full pl-2">
                <CodeEditor problem={currentProblem} />
              </div>
            </Panel>
          </Group>
        </div>
      </div>
    </div>
  );
}
