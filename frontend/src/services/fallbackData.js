export const FALLBACK_PROBLEMS = [
  { 
    _id: '1', 
    title: 'Two Sum', 
    difficulty: 'Easy', 
    tags: ['Array', 'Hash Table'], 
    description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.\n\nExample:\nInput: nums = [2,7,11,15], target = 9\nOutput: [0,1]', 
    defaultCode: { 
      python: 'def two_sum(nums, target):\n    # Write your code here\n    pass', 
      javascript: 'function twoSum(nums, target) {\n    // Write your code here\n}', 
      java: 'class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        // Write your code here\n    }\n}', 
      cpp: 'class Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        // Write your code here\n    }\n};', 
      c: 'int* twoSum(int* nums, int numsSize, int target, int* returnSize){\n    // Write your code here\n}' 
    } 
  },
  { 
    _id: '2', 
    title: 'Reverse String', 
    difficulty: 'Easy', 
    tags: ['String', 'Two Pointers'], 
    description: 'Write a function that reverses a string.\n\nExample:\nInput: s = ["h","e","l","l","o"]\nOutput: ["o","l","l","e","h"]', 
    defaultCode: { 
      python: 'def reverse_string(s):\n    # Write your code here\n    pass', 
      javascript: 'function reverseString(s) {\n    // Write your code here\n}', 
      java: 'class Solution {\n    public void reverseString(char[] s) {\n        // Write your code here\n    }\n}', 
      cpp: 'class Solution {\npublic:\n    void reverseString(vector<char>& s) {\n        // Write your code here\n    }\n};', 
      c: 'void reverseString(char* s, int sSize){\n    // Write your code here\n}' 
    } 
  },
  { 
    _id: '3', 
    title: 'Maximum Subarray', 
    difficulty: 'Medium', 
    tags: ['Array', 'Dynamic Programming'], 
    description: 'Find the contiguous subarray which has the largest sum and return its sum.\n\nExample:\nInput: nums = [-2,1,-3,4,-1,2,1,-5,4]\nOutput: 6', 
    defaultCode: { 
      python: 'def max_subarray(nums):\n    # Write your code here\n    pass', 
      javascript: 'function maxSubArray(nums) {\n    // Write your code here\n}' 
    } 
  },
  { 
    _id: '4', 
    title: 'Linked List Cycle', 
    difficulty: 'Easy', 
    tags: ['Linked List', 'Two Pointers'], 
    description: 'Determine if a linked list has a cycle in it.\n\nReturn true if there is a cycle, otherwise false.', 
    defaultCode: { 
      python: 'def has_cycle(head):\n    # Write your code here\n    pass' 
    } 
  },
  { 
    _id: '5', 
    title: 'Binary Tree Level Order', 
    difficulty: 'Medium', 
    tags: ['Tree', 'BFS'], 
    description: 'Given the root of a binary tree, return the level order traversal of its nodes\' values.\n\nExample:\nInput: root = [3,9,20,null,null,15,7]\nOutput: [[3],[9,20],[15,7]]', 
    defaultCode: { 
      python: 'def level_order(root):\n    # Write your code here\n    pass' 
    } 
  },
  { 
    _id: '6', 
    title: 'Coin Change', 
    difficulty: 'Medium', 
    tags: ['Dynamic Programming', 'Array'], 
    description: 'Given an array of coins and an amount, return the fewest number of coins needed to make up that amount.\n\nExample:\nInput: coins = [1,5,11], amount = 11\nOutput: 1', 
    defaultCode: { 
      python: 'def coin_change(coins, amount):\n    # Write your code here\n    pass' 
    } 
  },
  { 
    _id: '7', 
    title: 'Merge K Sorted Lists', 
    difficulty: 'Hard', 
    tags: ['Linked List', 'Heap'], 
    description: 'You are given k linked-lists, each sorted in ascending order. Merge all of them into one sorted linked list.', 
    defaultCode: { 
      python: 'def merge_k_lists(lists):\n    # Write your code here\n    pass' 
    } 
  },
  { 
    _id: '8', 
    title: 'Trapping Rain Water', 
    difficulty: 'Hard', 
    tags: ['Array', 'Two Pointers'], 
    description: 'Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.\n\nExample:\nInput: height = [0,1,0,2,1,0,1,3,2,1,2,1]\nOutput: 6', 
    defaultCode: { 
      python: 'def trap(height):\n    # Write your code here\n    pass' 
    } 
  },
];
