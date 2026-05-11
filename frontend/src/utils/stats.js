export const complexityScore = (tc, sc) => {
    const order = ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)', 'O(n²)', 'O(2ⁿ)', 'O(n!)'];
    const ti = order.indexOf(tc ?? ''); 
    const si = order.indexOf(sc ?? '');
    const ts = ti === -1 ? 3 : ti;
    const ss = si === -1 ? 3 : si;
    return Math.max(0, Math.round(100 - (ts + ss) * 8));
};

export const logicalScore = (solved) => {
    if (!solved.length) return 0;
    const avg = solved.reduce((s, p) => s + complexityScore(p.timeComplexity, p.spaceComplexity), 0) / solved.length;
    return Math.round(avg);
};
