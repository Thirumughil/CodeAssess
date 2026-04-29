import { motion } from 'framer-motion';

export default function ProblemDescription({ problem }) {
  if (!problem) return (
    <div className="glass-panel h-full flex items-center justify-center p-6 text-slate-500">
      Select a problem to view
    </div>
  );

  return (
    <motion.div 
      key={problem._id}
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className="glass-panel h-full flex flex-col overflow-hidden"
    >
      <div className="p-6 border-b border-white/10 shrink-0 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-100">{problem.title}</h2>
        <span className={`text-sm px-3 py-1 rounded-full font-medium
          ${problem.difficulty === 'Easy' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 
            problem.difficulty === 'Medium' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 
            'bg-red-500/10 text-red-400 border border-red-500/20'}
        `}>
          {problem.difficulty}
        </span>
      </div>
      
      <div className="flex-1 overflow-y-auto p-6 text-slate-300 prose prose-invert max-w-none">
        {/* Simple typing animation for description using Framer Motion */}
        <motion.div
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           transition={{ duration: 0.5 }}
           className="whitespace-pre-wrap leading-relaxed text-sm"
        >
          {problem.description}
        </motion.div>

        {problem.tags && problem.tags.length > 0 && (
          <div className="mt-8 pt-6 border-t border-white/10">
            <h3 className="text-sm font-semibold text-slate-400 mb-3">Tags</h3>
            <div className="flex gap-2 flex-wrap">
              {problem.tags.map(tag => (
                <span key={tag} className="text-xs px-2.5 py-1 bg-white/5 rounded text-slate-300 border border-white/10">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
