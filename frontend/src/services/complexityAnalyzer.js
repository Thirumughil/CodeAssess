/**
 * Client-side heuristic code complexity analyzer.
 * Estimates Big-O time and space complexity from code structure.
 */

const patterns = [
  // Most complex first
  { regex: /factorial|permutation|n!\s/i, time: 'O(n!)', space: 'O(n)' },
  { regex: /2\s*\*\*\s*n|pow\(2,\s*n\)|Math\.pow\(2,/i, time: 'O(2ⁿ)', space: 'O(n)' },
  // Triple nested loops
  { regex: /for[\s\S]*?for[\s\S]*?for/m, time: 'O(n³)', space: 'O(1)' },
  // Double nested loops
  { regex: /for[\s\S]*?for/m, time: 'O(n²)', space: 'O(1)' },
  // n log n patterns
  { regex: /\.sort\(|merge_sort|mergeSort|sort\(/i, time: 'O(n log n)', space: 'O(n)' },
  // Log n patterns
  { regex: /binary.?search|bsearch|\/=\s*2|mid\s*=|>> 1/i, time: 'O(log n)', space: 'O(1)' },
  // Linear with dictionary/hash
  { regex: /dict\(\)|{}\s*\n|HashMap|new Map|defaultdict|Counter\(/i, time: 'O(n)', space: 'O(n)' },
  // Simple single loop
  { regex: /for\s+\w+|while\s*\(|\.forEach|\.map\(|\.filter\(/i, time: 'O(n)', space: 'O(1)' },
];

export function analyzeComplexity(code) {
  if (!code || code.trim().length < 10) return { time: 'O(1)', space: 'O(1)' };

  for (const p of patterns) {
    if (p.regex.test(code)) return { time: p.time, space: p.space };
  }

  return { time: 'O(1)', space: 'O(1)' };
}
