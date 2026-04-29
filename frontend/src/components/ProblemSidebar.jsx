import { useStore } from '../store';

export default function ProblemSidebar({ problems }) {
  const { currentProblem, setCurrentProblem } = useStore();

  return (
    <div className="w-64 glass-panel flex flex-col h-full overflow-hidden">
      <div className="p-4 border-b border-white/10 shrink-0">
        <h2 className="font-semibold text-slate-200">Problems</h2>
      </div>
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {problems.map((problem) => (
          <button
            key={problem._id}
            onClick={() => setCurrentProblem(problem)}
            className={`w-full text-left px-3 py-3 rounded-lg flex items-center justify-between transition-colors
              ${currentProblem?._id === problem._id ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30' : 'text-slate-300 hover:bg-white/5 border border-transparent'}
            `}
          >
            <span className="truncate pr-2 font-medium text-sm">{problem.title}</span>
            <span className={`text-xs px-2 py-0.5 rounded-full shrink-0
              ${problem.difficulty === 'Easy' ? 'bg-emerald-500/10 text-emerald-400' : 
                problem.difficulty === 'Medium' ? 'bg-amber-500/10 text-amber-400' : 
                'bg-red-500/10 text-red-400'}
            `}>
              {problem.difficulty}
            </span>
          </button>
        ))}
        {problems.length === 0 && (
          <div className="text-sm text-slate-500 text-center mt-4">No problems available</div>
        )}
      </div>
    </div>
  );
}
