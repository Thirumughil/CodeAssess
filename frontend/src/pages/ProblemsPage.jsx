import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Tag } from 'lucide-react';
import Navbar from '../components/Navbar';
import { useStore } from '../store';
import { getProblems } from '../services/api';
import toast from 'react-hot-toast';

import { FALLBACK_PROBLEMS } from '../services/fallbackData';

const ALL_TAGS = ['Array', 'String', 'Hash Table', 'Two Pointers', 'Dynamic Programming', 'Tree', 'BFS', 'Linked List', 'Heap'];

const difficultyColor = {
  Easy: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  Medium: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  Hard: 'bg-red-500/10 text-red-400 border-red-500/20',
};

export default function ProblemsPage() {
  const { problems, setProblems, currentProblem, setCurrentProblem, solvedProblems } = useStore();
  const [activeTag, setActiveTag] = useState(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProblems, setTotalProblems] = useState(0);

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const data = await getProblems({ page, limit: 20, search, tag: activeTag });
        setProblems(data.problems || []);
        setTotalPages(data.totalPages || 1);
        setTotalProblems(data.total || 0);
      } catch (err) {
        toast.error('Failed to fetch problems from server. Using offline data.');
        setProblems(FALLBACK_PROBLEMS);
        setTotalPages(1);
        setTotalProblems(FALLBACK_PROBLEMS.length);
      }
    };

    const timer = setTimeout(() => {
      fetchProblems();
    }, 300);

    return () => clearTimeout(timer);
  }, [page, search, activeTag]);

  const solvedIds = new Set(solvedProblems.map(s => s.problemId));

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleTag = (tag) => {
    setActiveTag(activeTag === tag ? null : tag);
    setPage(1);
  };

  return (
    <div className="min-h-screen pt-20 pb-10 px-4">
      <Navbar />

      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-slate-100 mb-1">Problems</h1>
          <p className="text-slate-500 text-sm">{totalProblems} problems found</p>
        </motion.div>

        {/* Search + Filter */}
        <div className="space-y-3 mb-8">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search problems..."
              value={search}
              onChange={handleSearch}
              className="w-full pl-9 pr-4 py-2.5 bg-dark-800/60 backdrop-blur-md border border-white/10 rounded-xl text-slate-200 placeholder-slate-500 text-sm outline-none focus:border-blue-500/50 transition-colors"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <Tag size={14} className="text-slate-500" />
            <button
              onClick={() => handleTag(null)}
              className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${
                !activeTag
                  ? 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                  : 'bg-white/5 text-slate-400 border-white/10 hover:bg-white/10'
              }`}
            >
              All
            </button>
            {ALL_TAGS.map(tag => (
              <button
                key={tag}
                onClick={() => handleTag(tag)}
                className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${
                  activeTag === tag
                    ? 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                    : 'bg-white/5 text-slate-400 border-white/10 hover:bg-white/10'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Problem List */}
        <div className="space-y-2">
          <AnimatePresence>
            {problems.map((problem, idx) => (
              <motion.div
                key={problem._id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ delay: idx * 0.03 }}
              >
                <Link
                  to={`/problems/${problem._id}`}
                  onClick={() => setCurrentProblem(problem)}
                  className="flex items-center justify-between px-5 py-4 glass-panel hover:bg-white/5 border border-white/5 hover:border-blue-500/20 transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <span className="w-8 text-center text-sm font-mono text-slate-500">{idx + 1}</span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-slate-200 group-hover:text-blue-400 transition-colors">
                          {problem.title}
                        </span>
                        {solvedIds.has(problem._id) && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            ✓ Solved
                          </span>
                        )}
                      </div>
                      <div className="flex gap-1.5 mt-1">
                        {problem.tags?.map(t => (
                          <span key={t} className="text-xs text-slate-500 bg-white/5 px-2 py-0.5 rounded">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <span className={`text-xs px-3 py-1 rounded-full border ${difficultyColor[problem.difficulty] || 'text-slate-400'}`}>
                    {problem.difficulty}
                  </span>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>

          {problems.length === 0 && (
            <div className="text-center py-16 text-slate-500">
              No problems match the selected filter.
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-8">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 rounded-lg bg-white/5 text-slate-300 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Previous
              </button>
              <span className="text-sm text-slate-500">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 rounded-lg bg-white/5 text-slate-300 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
