import { create } from 'zustand';

export const useStore = create((set) => ({
  user: (() => {
    try {
      const saved = localStorage.getItem('user');
      return saved && saved !== 'undefined' ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  })(),
  setUser: (user) => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
      localStorage.removeItem('solvedProblems');
      set({ solvedProblems: [] });
    }
    set({ user });
  },
  
  problems: [],
  setProblems: (problems) => set({ problems }),
  
  currentProblem: null,
  setCurrentProblem: (problem) => set({ currentProblem: problem }),
  
  savedCode: (() => {
    try {
      const saved = localStorage.getItem('savedCode');
      return saved && saved !== 'undefined' ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  })(),
  saveCode: (problemId, language, code) => set((state) => {
    const userId = state.user?._id || 'anonymous';
    const updatedCode = {
      ...state.savedCode,
      [`${userId}-${problemId}-${language}`]: code
    };
    localStorage.setItem('savedCode', JSON.stringify(updatedCode));
    return { savedCode: updatedCode };
  }),

  // Solved problems tracking
  solvedProblems: (() => {
    try {
      const saved = localStorage.getItem('solvedProblems');
      return saved && saved !== 'undefined' ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  })(),
  setSolvedProblems: (solvedProblems) => {
    localStorage.setItem('solvedProblems', JSON.stringify(solvedProblems));
    set({ solvedProblems });
  },
  addSolvedProblem: (problemId, title, difficulty, timeComplexity, spaceComplexity) =>
    set((state) => {
      const existing = state.solvedProblems.find(p => p.problemId === problemId);
      const entry = {
        problemId,
        title,
        difficulty,
        timeComplexity,
        spaceComplexity,
        solvedAt: new Date().toISOString()
      };
      const updated = existing
        ? state.solvedProblems.map(p => p.problemId === problemId ? entry : p)
        : [...state.solvedProblems, entry];
      localStorage.setItem('solvedProblems', JSON.stringify(updated));
      return { solvedProblems: updated };
    }),

  // Current complexity result for the modal
  complexityResult: null,
  setComplexityResult: (result) => set({ complexityResult: result }),
}));
