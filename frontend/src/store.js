import { create } from 'zustand';

export const useStore = create((set) => ({
  user: JSON.parse(localStorage.getItem('user')) || null,
  setUser: (user) => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
    set({ user });
  },
  
  problems: [],
  setProblems: (problems) => set({ problems }),
  
  currentProblem: null,
  setCurrentProblem: (problem) => set({ currentProblem: problem }),
  
  savedCode: JSON.parse(localStorage.getItem('savedCode')) || {},
  saveCode: (problemId, language, code) => set((state) => {
    const updatedCode = {
      ...state.savedCode,
      [`${problemId}-${language}`]: code
    };
    localStorage.setItem('savedCode', JSON.stringify(updatedCode));
    return { savedCode: updatedCode };
  }),

  // Solved problems tracking
  solvedProblems: JSON.parse(localStorage.getItem('solvedProblems')) || [],
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
