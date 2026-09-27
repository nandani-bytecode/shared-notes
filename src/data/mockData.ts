import { 
  User, 
  Community, 
  Subject, 
  Resource, 
  PersonalReference, 
  PersonalFolder, 
  Comment, 
  Announcement,
  CommunityMember 
} from '../types';

export const CURRENT_USER: User = {
  id: 'usr-current',
  name: 'Arjun Sharma',
  email: 'arjun.sharma@college.edu',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  college: 'National Institute of Technology',
  branch: 'Computer Science & Engineering',
  semester: 'Semester 5',
  role: 'student',
  joinedAt: '2024-08-15',
};

export const DEMO_USERS: User[] = [
  CURRENT_USER,
  {
    id: 'usr-priya',
    name: 'Priya Patel',
    email: 'priya.patel@college.edu',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    college: 'National Institute of Technology',
    branch: 'Computer Science & Engineering',
    semester: 'Semester 5',
    role: 'cr',
    joinedAt: '2024-08-10',
  },
  {
    id: 'usr-rohit',
    name: 'Rohit Verma',
    email: 'rohit.v@college.edu',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    college: 'National Institute of Technology',
    branch: 'Information Technology',
    semester: 'Semester 5',
    role: 'student',
    joinedAt: '2024-08-12',
  },
  {
    id: 'usr-ananya',
    name: 'Ananya Rao',
    email: 'ananya.rao@college.edu',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80',
    college: 'National Institute of Technology',
    branch: 'Computer Science & Engineering',
    semester: 'Semester 5',
    role: 'ta',
    joinedAt: '2024-07-20',
  },
  {
    id: 'usr-prof-gupta',
    name: 'Dr. Ramesh Gupta',
    email: 'r.gupta@college.edu',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    college: 'National Institute of Technology',
    branch: 'Computer Science & Engineering',
    semester: 'Faculty',
    role: 'professor',
    joinedAt: '2023-01-10',
  }
];

export const INITIAL_SUBJECTS: Subject[] = [
  {
    id: 'subj-dsa',
    code: 'CS201',
    name: 'Data Structures & Algorithms',
    color: 'blue',
    description: 'Arrays, Linked Lists, Trees, Graphs, Sorting, Dynamic Programming & Complexity Analysis',
    icon: 'Binary',
  },
  {
    id: 'subj-coa',
    code: 'CS202',
    name: 'Computer Organization',
    color: 'amber',
    description: 'ALU Design, Instruction Sets, Pipelining, Memory Hierarchy, Cache & Interfacing',
    icon: 'Cpu',
  },
  {
    id: 'subj-discrete',
    code: 'MA201',
    name: 'Discrete Mathematics',
    color: 'emerald',
    description: 'Set Theory, Relations, Predicate Logic, Combinatorics, Graph Theory & Proofs',
    icon: 'Network',
  },
  {
    id: 'subj-prob',
    code: 'MA202',
    name: 'Probability & Statistics',
    color: 'purple',
    description: 'Random Variables, Probability Distributions, Bayes Theorem, Hypothesis Testing & Regression',
    icon: 'Sigma',
  },
  {
    id: 'subj-os',
    code: 'CS203',
    name: 'Operating Systems',
    color: 'rose',
    description: 'Processes, Threads, CPU Scheduling, Deadlocks, Memory Management & File Systems',
    icon: 'Terminal',
  },
  {
    id: 'subj-placement',
    code: 'PL301',
    name: 'Placement & Interviews',
    color: 'indigo',
    description: 'FAANG DSA patterns, CS Fundamentals, System Design, HR prep & Mock Interviews',
    icon: 'Briefcase',
  }
];

export const INITIAL_COMMUNITIES: Community[] = [
  {
    id: 'comm-cseh',
    name: 'CSE Section H',
    code: 'CSEH-2024',
    description: 'Official class community for CSE 3rd Year Section H. Timetable updates, classroom lecture slides, official PYQs & CR notices.',
    category: 'Classroom',
    membersCount: 68,
    bannerGradient: 'from-blue-600 to-indigo-800',
    avatar: '💻',
    subjects: ['subj-dsa', 'subj-coa', 'subj-discrete', 'subj-prob', 'subj-os'],
    createdBy: 'usr-priya',
    createdAt: '2024-08-01',
    isAdmin: false,
  },
  {
    id: 'comm-coding',
    name: 'Coding Club & DSA Study Group',
    code: 'DSA-ELITE',
    description: 'Competitive programming, LeetCode discussion, handwritten algorithmic notes, contest editorial analysis, and peer mock coding.',
    category: 'Club & Interest',
    membersCount: 142,
    bannerGradient: 'from-emerald-600 to-teal-800',
    avatar: '⚡',
    subjects: ['subj-dsa', 'subj-placement'],
    createdBy: 'usr-rohit',
    createdAt: '2024-08-10',
    isAdmin: true,
  },
  {
    id: 'comm-placement',
    name: 'Placement Preparation 2025',
    code: 'PLACE-2025',
    description: 'On-campus & off-campus recruitment drive materials: company-specific test papers, core CS sheets, and technical interview transcripts.',
    category: 'Career & Placement',
    membersCount: 230,
    bannerGradient: 'from-purple-600 to-pink-800',
    avatar: '🎯',
    subjects: ['subj-dsa', 'subj-coa', 'subj-os', 'subj-placement'],
    createdBy: 'usr-ananya',
    createdAt: '2024-07-15',
    isAdmin: false,
  },
  {
    id: 'comm-semester3',
    name: 'Semester 3 Core Archives',
    code: 'SEM3-CORE',
    description: 'Curated previous year solved question papers, handwritten topper notes, and formula sheets for semester examinations.',
    category: 'Exam Archive',
    membersCount: 95,
    bannerGradient: 'from-amber-600 to-orange-800',
    avatar: '📚',
    subjects: ['subj-coa', 'subj-discrete', 'subj-prob'],
    createdBy: 'usr-prof-gupta',
    createdAt: '2024-06-20',
    isAdmin: false,
  }
];

export const INITIAL_MEMBERS: CommunityMember[] = [
  {
    id: 'mem-1',
    communityId: 'comm-cseh',
    userId: 'usr-current',
    name: 'Arjun Sharma',
    email: 'arjun.sharma@college.edu',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    role: 'member',
    joinedAt: '2024-08-15',
  },
  {
    id: 'mem-2',
    communityId: 'comm-cseh',
    userId: 'usr-priya',
    name: 'Priya Patel (CR)',
    email: 'priya.patel@college.edu',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    role: 'admin',
    joinedAt: '2024-08-01',
  },
  {
    id: 'mem-3',
    communityId: 'comm-coding',
    userId: 'usr-current',
    name: 'Arjun Sharma',
    email: 'arjun.sharma@college.edu',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    role: 'admin',
    joinedAt: '2024-08-10',
  },
  {
    id: 'mem-4',
    communityId: 'comm-coding',
    userId: 'usr-rohit',
    name: 'Rohit Verma',
    email: 'rohit.v@college.edu',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    role: 'admin',
    joinedAt: '2024-08-10',
  },
  {
    id: 'mem-5',
    communityId: 'comm-placement',
    userId: 'usr-current',
    name: 'Arjun Sharma',
    email: 'arjun.sharma@college.edu',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    role: 'member',
    joinedAt: '2024-08-16',
  }
];

export const INITIAL_RESOURCES: Resource[] = [
  // Community A: CSE Section H
  {
    id: 'res-dsa-01',
    title: 'DSA Lecture 1.pdf',
    description: 'Introduction to Asymptotic Notations: Big-O, Omega, Theta. Analysis of iterative loops, amortized complexity, and array memory allocation.',
    type: 'pdf',
    url: 'https://example.com/dsa-lecture-1.pdf',
    size: '3.8 MB',
    communityId: 'comm-cseh',
    subjectId: 'subj-dsa',
    uploaderId: 'usr-priya',
    uploaderName: 'Priya Patel (CR)',
    uploaderAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    createdAt: '2024-09-02',
    viewsCount: 148,
    pagesCount: 24,
    authorSummary: 'Contains Professor presentation slides for Week 1 lecture with derivation proofs and loop counting techniques.',
    pdfContent: [
      `### DATA STRUCTURES & ALGORITHMS (CS201) — LECTURE 1
**Topic**: Asymptotic Analysis & Space-Time Complexity
**Instructor**: Dr. R. Gupta | Department of CSE

#### 1. Why Analyze Algorithms?
Algorithms solve problems. But in software engineering and competitive programming, computing resources (CPU time, memory) are finite.
* **Execution Time depends on**: CPU architecture, compiler optimizations, background processes.
* **Solution**: Asymptotic notation characterizes running time independently of specific machine hardware as input size $n \\to \\infty$.

#### 2. The Big-O Notation (Upper Bound)
Formal Definition:
$f(n) = O(g(n))$ if there exist positive constants $c > 0$ and $n_0 \\ge 1$ such that:
$$0 \\le f(n) \\le c \\cdot g(n) \\quad \\forall n \\ge n_0$$

Common Growth Orders:
* $O(1)$ — Constant time (e.g., hash table lookup, array index access)
* $O(\\log n)$ — Logarithmic time (e.g., binary search, balanced BST search)
* $O(n)$ — Linear time (e.g., linear scan, counting)
* $O(n \\log n)$ — Linearithmic time (e.g., Merge Sort, Heap Sort)
* $O(n^2)$ — Quadratic time (e.g., Nested loops, Bubble sort)
* $O(2^n)$ — Exponential time (e.g., Naive Fibonacci, subsets generation)`,

      `#### 3. Analyzing Loops & Nested Iterations
Let us examine common loop structures:

\`\`\`cpp
// Example 1: Linear Loop
for (int i = 0; i < n; i++) {
    sum += arr[i]; // O(1) executed n times => O(n)
}

// Example 2: Logarithmic Loop
for (int i = 1; i < n; i *= 2) {
    // i takes values 1, 2, 4, 8, ... 2^k
    // 2^k < n => k = log2(n) iterations => O(log n)
}
\`\`\`

#### 4. Space Complexity
Space complexity includes:
1. **Instruction Space**: Fixed space required by the compiled code.
2. **Data Space**: Variables, dynamic arrays allocated via malloc/new.
3. **Environment Stack Space**: Call stack activation records for recursive functions.

*Note for Mid-semester Exam*: Remember that in recursive algorithms like Merge Sort, the recursion stack depth is $O(\\log n)$, while total auxiliary array memory is $O(n)$.`
    ]
  },
  {
    id: 'res-dsa-02',
    title: 'DSA PYQ.pdf',
    description: 'Previous 5 years mid-semester and end-semester solved exam questions covering Arrays, Stacks, Queues, Linked Lists, and Binary Trees.',
    type: 'pdf',
    url: 'https://example.com/dsa-pyq-2019-2024.pdf',
    size: '6.4 MB',
    communityId: 'comm-cseh',
    subjectId: 'subj-dsa',
    uploaderId: 'usr-priya',
    uploaderName: 'Priya Patel (CR)',
    uploaderAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    createdAt: '2024-09-08',
    viewsCount: 284,
    pagesCount: 36,
    authorSummary: 'Official solved PYQs from 2019 to 2024. Questions 4 and 7 appear frequently in midsems.',
    pdfContent: [
      `### MID-SEMESTER EXAMINATION SOLVED QUESTIONS (2020-2024)
**Course**: CS201 Data Structures & Algorithms

#### Question 1 (6 Marks)
*Problem*: Implement an efficient algorithm to detect a cycle in a Singly Linked List and find the start node of the cycle without extra memory.
*Solution Approach*: Floyd's Cycle-Finding Algorithm (Tortoise and Hare).
1. Initialize two pointers: \`slow = head\`, \`fast = head\`.
2. Move \`slow\` by 1 step, \`fast\` by 2 steps.
3. If they meet at any node $M$, a cycle exists.
4. Reset \`slow = head\`. Move both pointers 1 step at a time until they collide. The meeting point is the starting node of the loop!

*Complexity Proof*:
* Time Complexity: $O(N)$ because the fast pointer catches up inside the loop in at most $L$ steps where $L \\le N$.
* Auxiliary Space: $O(1)$ constant pointers.`,

      `#### Question 2 (8 Marks)
*Problem*: Convert Infix Expression to Postfix using a Stack:
Expression: \`A + B * (C ^ D - E) ^ (F + G * H) - I\`
*Precedence Hierarchy*:
1. Parentheses: \`()\`
2. Exponentiation: \`^\` (Right-to-Left associativity)
3. Multiplication / Division: \`*\`, \`/\` (Left-to-Right)
4. Addition / Subtraction: \`+\`, \`-\` (Left-to-Right)

Step-by-step Postfix evaluation table included in Section 3 of this document.`
    ]
  },
  {
    id: 'res-coa-01',
    title: 'COA Unit 1.pdf',
    description: 'Computer Organization & Architecture Unit 1 notes: Von Neumann vs Harvard architecture, Bus structures, and Booth multiplication algorithm.',
    type: 'pdf',
    url: 'https://example.com/coa-unit-1.pdf',
    size: '4.1 MB',
    communityId: 'comm-cseh',
    subjectId: 'subj-coa',
    uploaderId: 'usr-priya',
    uploaderName: 'Priya Patel (CR)',
    uploaderAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    createdAt: '2024-09-04',
    viewsCount: 112,
    pagesCount: 18,
    pdfContent: [
      `### COMPUTER ORGANIZATION & ARCHITECTURE (CS202)
**Unit 1**: Functional Units, Basic Operational Concepts & Arithmetic Algorithms

#### 1. Von Neumann Architecture
* Core idea: Stored-Program Concept where instructions and data share the same unified physical memory space and bus system.
* Components:
  - Central Processing Unit (ALU + Control Unit + Registers)
  - Memory Unit
  - Input/Output Subsystem
* Bottleneck: Von Neumann bottleneck occurs because data throughput is restricted by the single shared bus between CPU and Memory.

#### 2. Booth's Multiplication Algorithm for Signed Numbers
Booth's algorithm multiplies two signed binary numbers in 2's complement representation.
Inspect bits $(Q_0, Q_{-1})$:
- \`10\` -> Subtract Multiplicand from Accumulator ($A \\leftarrow A - M$)
- \`01\` -> Add Multiplicand to Accumulator ($A \\leftarrow A + M$)
- \`00\` or \`11\` -> No arithmetic operation
- In all cases: Perform Arithmetic Shift Right (ASR) of $[A, Q, Q_{-1}]$`
    ]
  },
  {
    id: 'res-discrete-01',
    title: 'Discrete Math Set Theory.pdf',
    description: 'Set operations, Venn diagrams, Relations, Equivalence classes, Partial Orders, and Hasse Diagrams with exam practice proofs.',
    type: 'pdf',
    url: 'https://example.com/discrete-math-unit-1.pdf',
    size: '3.2 MB',
    communityId: 'comm-cseh',
    subjectId: 'subj-discrete',
    uploaderId: 'usr-priya',
    uploaderName: 'Priya Patel (CR)',
    uploaderAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    createdAt: '2024-08-28',
    viewsCount: 89,
    pagesCount: 22,
    pdfContent: [
      `### DISCRETE MATHEMATICS (MA201)
**Topic**: Relations, Posets and Lattices

#### 1. Types of Binary Relations on Set A
Let $R$ be a binary relation on set $A$:
1. **Reflexive**: $\\forall a \\in A, (a, a) \\in R$.
2. **Symmetric**: If $(a, b) \\in R \\implies (b, a) \\in R$.
3. **Antisymmetric**: If $(a, b) \\in R$ and $(b, a) \\in R \\implies a = b$.
4. **Transitive**: If $(a, b) \\in R$ and $(b, c) \\in R \\implies (a, c) \\in R$.

#### 2. Equivalence vs Partial Ordering
* **Equivalence Relation**: Reflexive, Symmetric, and Transitive.
* **Partial Order Relation (POSET)**: Reflexive, Antisymmetric, and Transitive. Represented using a Hasse Diagram.`
    ]
  },
  {
    id: 'res-prob-01',
    title: 'Probability Bayes Theorem.pdf',
    description: 'Conditional probability, Law of Total Probability, Bayes Theorem derivations, prior and posterior probability practical problems.',
    type: 'pdf',
    url: 'https://example.com/bayes-theorem.pdf',
    size: '2.9 MB',
    communityId: 'comm-cseh',
    subjectId: 'subj-prob',
    uploaderId: 'usr-priya',
    uploaderName: 'Priya Patel (CR)',
    uploaderAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    createdAt: '2024-09-01',
    viewsCount: 76,
    pagesCount: 16,
    pdfContent: [
      `### PROBABILITY & STATISTICS (MA202)
**Topic**: Bayes Theorem & Conditional Probability

#### The Law of Total Probability
If $B_1, B_2, \\dots, B_k$ form a partition of the sample space $S$, then for any event $A$:
$$P(A) = \\sum_{i=1}^k P(A \\mid B_i) \\cdot P(B_i)$$

#### Bayes Theorem
$$P(B_j \\mid A) = \\frac{P(A \\mid B_j) \\cdot P(B_j)}{\\sum_{i=1}^k P(A \\mid B_i) \\cdot P(B_i)}$$
Where:
* $P(B_j)$ is the **Prior Probability**
* $P(B_j \\mid A)$ is the **Posterior Probability** (updated belief after evidence $A$)`
    ]
  },

  // Community B: Coding Club & DSA Study Group
  {
    id: 'res-dsa-03',
    title: 'DSA Notes.pdf',
    description: 'Comprehensive handwritten handwritten-style digital notes covering Two Pointers, Sliding Window, Monotonic Stack, and Heap patterns.',
    type: 'pdf',
    url: 'https://example.com/coding-club-dsa-notes.pdf',
    size: '5.2 MB',
    communityId: 'comm-coding',
    subjectId: 'subj-dsa',
    uploaderId: 'usr-rohit',
    uploaderName: 'Rohit Verma',
    uploaderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    createdAt: '2024-09-05',
    viewsCount: 310,
    pagesCount: 42,
    authorSummary: 'Handwritten summaries created by the NIT coding club toppers for quick interview pattern recall.',
    pdfContent: [
      `### CODING CLUB COMPREHENSIVE DSA CHEAT NOTES
**Focus**: The 14 Essential LeetCode Patterns

#### Pattern 1: Sliding Window (Dynamic & Fixed)
When to use: Contiguous subarray/substring problems with conditions (e.g., maximum sum of size $K$, longest substring with unique chars).

\`\`\`python
def longest_substring_k_distinct(s: str, k: int) -> int:
    char_map = {}
    left = 0
    max_len = 0
    for right, ch in enumerate(s):
        char_map[ch] = char_map.get(ch, 0) + 1
        while len(char_map) > k:
            char_map[s[left]] -= 1
            if char_map[s[left]] == 0:
                del char_map[s[left]]
            left += 1
        max_len = max(max_len, right - left + 1)
    return max_len
\`\`\`

#### Pattern 2: Two Pointers (Opposite Direction & Fast-Slow)
Applied on sorted arrays or linked lists to achieve $O(N)$ time with $O(1)$ space.`
    ]
  },
  {
    id: 'res-dsa-04',
    title: 'DSA Important Questions.pdf',
    description: 'Must-solve top 50 coding problems curated for midsems and technical rounds with full optimal solutions and edge case warnings.',
    type: 'pdf',
    url: 'https://example.com/dsa-important-50.pdf',
    size: '4.7 MB',
    communityId: 'comm-coding',
    subjectId: 'subj-dsa',
    uploaderId: 'usr-rohit',
    uploaderName: 'Rohit Verma',
    uploaderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    createdAt: '2024-09-07',
    viewsCount: 420,
    pagesCount: 30,
    pdfContent: [
      `### TOP 50 MUST-SOLVE DSA QUESTIONS
*Curated by Coding Club & Placement Seniors*

1. **Trapping Rain Water** (Hard) — Two-pointer approach with $O(1)$ space.
2. **LRU Cache** (Medium) — Hash Map + Doubly Linked List.
3. **Course Schedule / Topological Sort** (Medium) — Kahn's Algorithm BFS vs DFS cycle detection.
4. **Lowest Common Ancestor in Binary Tree** (Medium) — Recursive subtree check.
5. **Merge K Sorted Lists** (Hard) — Min-Heap priority queue $O(N \\log K)$.`
    ]
  },
  {
    id: 'res-coa-02',
    title: 'COA Unit 3.pdf',
    description: 'Memory Hierarchy, Cache Mapping Techniques (Direct, Associative, Set-Associative), Cache Miss penalty, and Virtual Memory translation.',
    type: 'pdf',
    url: 'https://example.com/coa-unit-3.pdf',
    size: '3.6 MB',
    communityId: 'comm-coding',
    subjectId: 'subj-coa',
    uploaderId: 'usr-rohit',
    uploaderName: 'Rohit Verma',
    uploaderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    createdAt: '2024-09-10',
    viewsCount: 165,
    pagesCount: 20,
    pdfContent: [
      `### COMPUTER ORGANIZATION & ARCHITECTURE — UNIT 3
**Topic**: Memory Organization, Cache Mapping & Virtual Memory

#### 1. The Memory Hierarchy
* Registers ($< 1$ ns, Bytes)
* L1, L2, L3 Cache (1-10 ns, KBs - MBs)
* Main Memory DRAM (50-100 ns, GBs)
* Secondary Storage SSD/HDD (10-100 ms, TBs)

#### 2. Cache Mapping Techniques
Given a 32-bit physical address:
1. **Direct Mapped**:
   \`[ Tag | Line/Index | Byte Offset ]\`
   Formula: $\\text{Line Number} = (\\text{Block Address}) \\bmod (\\text{Number of Lines})$
2. **Fully Associative**:
   \`[ Tag | Byte Offset ]\` (Block can go anywhere, requires parallel comparison)
3. **K-Way Set Associative**:
   \`[ Tag | Set Index | Byte Offset ]\`
   Formula: $\\text{Set Index} = (\\text{Block Address}) \\bmod (\\text{Number of Sets})$`
    ]
  },
  {
    id: 'res-dsa-05',
    title: 'DSA Unit 3 Linked Lists.pdf',
    description: 'Complete breakdown of Singly, Doubly, and Circular Linked Lists. Pointer manipulation, reverse in K-groups, and cycle detection.',
    type: 'pdf',
    url: 'https://example.com/dsa-unit-3-linked-lists.pdf',
    size: '3.9 MB',
    communityId: 'comm-coding',
    subjectId: 'subj-dsa',
    uploaderId: 'usr-rohit',
    uploaderName: 'Rohit Verma',
    uploaderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    createdAt: '2024-09-03',
    viewsCount: 215,
    pagesCount: 26,
    authorSummary: 'Contains step-by-step diagrams of linked list pointer adjustments and memory deallocation.',
    pdfContent: [
      `### DSA UNIT 3: LINKED LISTS IN DEPTH
**Department of CSE & Coding Club**

#### 1. Why Linked Lists Over Arrays?
* **Dynamic sizing**: Allocates nodes as needed on heap.
* **Insertion & Deletion at Head**: $O(1)$ without shifting elements.
* **Downside**: No random access ($O(n)$ search time) and extra pointer overhead.

#### 2. Reverse a Singly Linked List (Iterative & Recursive)
\`\`\`cpp
ListNode* reverseList(ListNode* head) {
    ListNode* prev = nullptr;
    ListNode* curr = head;
    while (curr != nullptr) {
        ListNode* nextTemp = curr->next;
        curr->next = prev;
        prev = curr;
        curr = nextTemp;
    }
    return prev;
}
\`\`\`

#### 3. Reverse in K-Groups (Hard Problem)
Algorithm checks whether $K$ nodes exist before reversing each chunk, linking the tail of reversed sublist to next sublist recursive call.`
    ]
  },
  {
    id: 'res-dsa-06',
    title: 'LeetCode Top 75 Cheat Sheet.pdf',
    description: 'Blind 75 curated questions with quick visual patterns, time complexities, and one-liner algorithmic insights.',
    type: 'pdf',
    url: 'https://example.com/blind-75-sheet.pdf',
    size: '2.1 MB',
    communityId: 'comm-coding',
    subjectId: 'subj-dsa',
    uploaderId: 'usr-current',
    uploaderName: 'Arjun Sharma',
    uploaderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    createdAt: '2024-09-12',
    viewsCount: 390,
    pagesCount: 15,
    pdfContent: [
      `### BLIND 75 MASTER CHEAT SHEET
*Categorized by Subject & Difficulty*

* **Arrays**: Two Sum ($O(n)$ hash map), Best Time to Buy Stock ($O(n)$ min-so-far), Maximum Subarray (Kadane's algorithm).
* **Strings**: Valid Anagram (frequency counter array), Group Anagrams (sorted tuple keys), Longest Palindromic Substring (expand around center).
* **Binary Trees**: Invert Tree, Maximum Depth, Validate BST (min/max range recursion), Level Order Traversal (queue BFS).`
    ]
  },

  // Community C: Placement Preparation 2025
  {
    id: 'res-place-01',
    title: 'DSA FAANG Roadmap 2025.pdf',
    description: 'Week-by-week interview roadmap for Google, Microsoft, Amazon, and Adobe recruitment rounds. Covers behavioral + tech rounds.',
    type: 'pdf',
    url: 'https://example.com/faang-dsa-roadmap.pdf',
    size: '4.5 MB',
    communityId: 'comm-placement',
    subjectId: 'subj-placement',
    uploaderId: 'usr-ananya',
    uploaderName: 'Ananya Rao',
    uploaderAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80',
    createdAt: '2024-08-25',
    viewsCount: 520,
    pagesCount: 28,
    pdfContent: [
      `### TIER-1 TECH COMPANY PLACEMENT PREPARATION BLUEPRINT
**Authors**: NIT Placement Cell Alumni & Senior Mentors

#### Phase 1: Core DSA Mastery (Weeks 1-8)
* Week 1-2: Arrays, Strings, Two Pointers, Sliding Window.
* Week 3-4: Stacks, Queues, Hash Tables, Linked Lists.
* Week 5-6: Binary Trees, Binary Search Trees, Heaps.
* Week 7-8: Graphs (BFS/DFS, Dijkstra, Topo Sort) & Dynamic Programming.

#### Phase 2: Mock Interviews & Timed Contests
* Practice communicating your thought process out loud before coding.
* Write clean, modular code with descriptive variable names.
* Ask clarifying questions regarding constraints and null/empty inputs.`
    ]
  },
  {
    id: 'res-place-02',
    title: 'COA Pipelining & Cache Architecture.pdf',
    description: 'Hardware interview questions: 5-stage RISC pipeline, Structural, Data, and Control Hazards, Branch prediction, and Cache coherence protocols.',
    type: 'pdf',
    url: 'https://example.com/coa-pipelining.pdf',
    size: '3.1 MB',
    communityId: 'comm-placement',
    subjectId: 'subj-coa',
    uploaderId: 'usr-ananya',
    uploaderName: 'Ananya Rao',
    uploaderAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80',
    createdAt: '2024-09-06',
    viewsCount: 198,
    pagesCount: 19,
    pdfContent: [
      `### COMPUTER ARCHITECTURE INTERVIEW GUIDE
**Focus**: Pipelining & Pipeline Hazards

#### The Classical 5-Stage RISC Pipeline:
1. **IF** (Instruction Fetch)
2. **ID** (Instruction Decode & Register Read)
3. **EX** (Execution & ALU Operation)
4. **MEM** (Memory Access)
5. **WB** (Write Back to Registers)

#### Pipeline Hazards & Solutions:
* **Structural Hazard**: Hardware resource conflict. Solution: Separate instruction and data memories (Harvard concept).
* **Data Hazard**: Read-After-Write (RAW). Solution: Operand Forwarding / Bypassing, or Compiler Stalls (NOPs).
* **Control Hazard**: Branch instructions. Solution: Branch Prediction Buffers, Delayed Branching.`
    ]
  },
  {
    id: 'res-place-03',
    title: 'Discrete Graphs & Trees Review.pdf',
    description: 'Graph connectivity, Euler paths, Hamiltonian cycles, Planar graphs, Euler formula, and Tree isomorphism frequently asked in tests.',
    type: 'pdf',
    url: 'https://example.com/discrete-graphs.pdf',
    size: '2.8 MB',
    communityId: 'comm-placement',
    subjectId: 'subj-discrete',
    uploaderId: 'usr-ananya',
    uploaderName: 'Ananya Rao',
    uploaderAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80',
    createdAt: '2024-09-09',
    viewsCount: 140,
    pagesCount: 17,
    pdfContent: [
      `### DISCRETE MATHEMATICS: GRAPH THEORY CRASH COURSE
*Essential for Placement Screening Tests*

#### Handshaking Lemma
In any graph $G = (V, E)$:
$$\\sum_{v \\in V} \\deg(v) = 2 |E|$$
Corollary: The number of vertices of odd degree in any graph is always **even**!

#### Planar Graphs & Euler's Formula
For any connected planar graph with $V$ vertices, $E$ edges, and $F$ faces:
$$V - E + F = 2$$`
    ]
  },
  {
    id: 'res-place-04',
    title: 'Operating Systems System Calls.pdf',
    description: 'Fork, Exec, Wait, Pipes, Shared Memory, Synchronization Mutex vs Semaphores, and Paging Architecture explained with C examples.',
    type: 'pdf',
    url: 'https://example.com/os-system-calls.pdf',
    size: '4.0 MB',
    communityId: 'comm-placement',
    subjectId: 'subj-os',
    uploaderId: 'usr-ananya',
    uploaderName: 'Ananya Rao',
    uploaderAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80',
    createdAt: '2024-09-11',
    viewsCount: 220,
    pagesCount: 25,
    pdfContent: [
      `### OPERATING SYSTEMS CONCEPTS & SYSTEM PROGRAMMING
**Topic**: Process Management, IPC & Concurrency

#### 1. Fork() and Process Creation
* \`fork()\` duplicates the calling process.
* Returns \`0\` to the child process.
* Returns the child PID to the parent process.
* Returns negative value on failure.

#### 2. Classical Synchronization: Producer-Consumer Problem
Solved using counting semaphores (\`empty\`, \`full\`) and a binary semaphore / mutex (\`mutex\`) to prevent race conditions on buffer queue.`
    ]
  },

  // Media & External Links
  {
    id: 'res-video-01',
    title: 'MIT 6.006 - Introduction to Algorithms Video Lectures',
    description: 'Official MIT open courseware video playlist covering asymptotic complexity, sorting algorithms, and shortest paths in graphs.',
    type: 'video',
    url: 'https://www.youtube.com/watch?v=ZA-tUyM_y7s',
    size: 'YouTube Playlist',
    communityId: 'comm-coding',
    subjectId: 'subj-dsa',
    uploaderId: 'usr-rohit',
    uploaderName: 'Rohit Verma',
    uploaderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    createdAt: '2024-09-10',
    viewsCount: 650,
    authorSummary: 'World class lecture series by Prof. Erik Demaine & Dr. Srini Devadas.',
    previewUrl: 'https://www.youtube.com/embed/ZA-tUyM_y7s'
  },
  {
    id: 'res-link-01',
    title: 'Visualgo - Visualising Data Structures and Algorithms',
    description: 'Interactive animations for sorting, binary search trees, Dijkstra shortest path, and disjoint set union with step-by-step pseudo-code tracking.',
    type: 'link',
    url: 'https://visualgo.net/en',
    size: 'Interactive Web',
    communityId: 'comm-cseh',
    subjectId: 'subj-dsa',
    uploaderId: 'usr-priya',
    uploaderName: 'Priya Patel (CR)',
    uploaderAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    createdAt: '2024-08-30',
    viewsCount: 410
  },
  {
    id: 'res-img-01',
    title: 'Complete Git Branching & Merge Cheat Map.png',
    description: 'High resolution visual diagram explaining rebase, merge commits, cherry-pick, and stash workflows for collaborative software development.',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1618401471353-b98aedd04e11?w=1200&auto=format&fit=crop&q=80',
    size: '1.8 MB',
    communityId: 'comm-coding',
    subjectId: 'subj-placement',
    uploaderId: 'usr-rohit',
    uploaderName: 'Rohit Verma',
    uploaderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    createdAt: '2024-09-04',
    viewsCount: 180
  }
];

// Initial Personal Folders for current user
export const INITIAL_PERSONAL_FOLDERS: PersonalFolder[] = [
  {
    id: 'folder-dsa',
    userId: 'usr-current',
    name: 'DSA',
    color: '#3b82f6', // blue
    icon: 'Binary',
    parentId: null,
    createdAt: '2024-09-05',
    subjectMapping: 'subj-dsa'
  },
  {
    id: 'folder-coa',
    userId: 'usr-current',
    name: 'COA',
    color: '#f59e0b', // amber
    icon: 'Cpu',
    parentId: null,
    createdAt: '2024-09-05',
    subjectMapping: 'subj-coa'
  },
  {
    id: 'folder-maths',
    userId: 'usr-current',
    name: 'Maths & Discrete',
    color: '#10b981', // emerald
    icon: 'Network',
    parentId: null,
    createdAt: '2024-09-06',
    subjectMapping: 'subj-discrete'
  },
  {
    id: 'folder-important',
    userId: 'usr-current',
    name: 'Important',
    color: '#ef4444', // red
    icon: 'Flame',
    parentId: null,
    createdAt: '2024-09-07'
  },
  {
    id: 'folder-revision',
    userId: 'usr-current',
    name: 'Exam Revision',
    color: '#8b5cf6', // purple
    icon: 'Bookmark',
    parentId: null,
    createdAt: '2024-09-08'
  }
];

// Initial Personal References demonstrating the Multi-Community Aggregation & Personal Layer!
// Notice how resources from Community A (CSE Section H) AND Community B (Coding Club)
// are referenced inside the SAME personal folder ('folder-dsa')!
// And one reference has been customized with a personal title ("🔥 MUST DO — Linked Lists")
// while the underlying resource 'res-dsa-05' title in the community remains "DSA Unit 3 Linked Lists.pdf"!
export const INITIAL_PERSONAL_REFERENCES: PersonalReference[] = [
  // In personal folder 'folder-dsa':
  // Resource from Community A:
  {
    id: 'pref-001',
    userId: 'usr-current',
    resourceId: 'res-dsa-01', // Community A: "DSA Lecture 1.pdf"
    personalName: 'DSA Lecture 1.pdf',
    personalFolderId: 'folder-dsa',
    personalTags: ['Lecture Notes', 'Week 1', 'Basics'],
    personalNotes: 'Review Big-O formal epsilon-delta style definition on page 2 before midsem!',
    starred: true,
    completed: true,
    addedAt: '2024-09-03T10:00:00Z',
    lastOpenedAt: '2024-09-14T09:30:00Z'
  },
  // Resource from Community A:
  {
    id: 'pref-002',
    userId: 'usr-current',
    resourceId: 'res-dsa-02', // Community A: "DSA PYQ.pdf"
    personalName: 'DSA PYQ.pdf',
    personalFolderId: 'folder-dsa',
    personalTags: ['High Priority', 'Midsem Prep'],
    personalNotes: 'Question 1 cycle finding code is tested every year. Memorize proof of slow/fast pointers.',
    starred: true,
    completed: false,
    addedAt: '2024-09-08T11:00:00Z',
    lastOpenedAt: '2024-09-13T14:20:00Z'
  },
  // Resource from Community B:
  {
    id: 'pref-003',
    userId: 'usr-current',
    resourceId: 'res-dsa-03', // Community B: "DSA Notes.pdf"
    personalName: 'DSA Notes.pdf',
    personalFolderId: 'folder-dsa',
    personalTags: ['LeetCode', 'Cheatsheet'],
    personalNotes: 'Sliding window template on page 1 is super clean.',
    starred: false,
    completed: false,
    addedAt: '2024-09-09T15:00:00Z',
    lastOpenedAt: '2024-09-12T16:00:00Z'
  },
  // Resource from Community B:
  {
    id: 'pref-004',
    userId: 'usr-current',
    resourceId: 'res-dsa-04', // Community B: "DSA Important Questions.pdf"
    personalName: 'DSA Important Questions.pdf',
    personalFolderId: 'folder-dsa',
    personalTags: ['Practice', 'Top 50'],
    personalNotes: 'Solved 12 out of 50. Target: finish tree problems by Sunday.',
    starred: false,
    completed: false,
    addedAt: '2024-09-10T12:00:00Z',
    lastOpenedAt: '2024-09-11T18:00:00Z'
  },
  // Resource from Community B, with PERSONAL CUSTOM TITLE!
  {
    id: 'pref-005',
    userId: 'usr-current',
    resourceId: 'res-dsa-05', // Community B: Original title is "DSA Unit 3 Linked Lists.pdf"
    personalName: '🔥 MUST DO — Linked Lists', // Customized personal name!
    personalFolderId: 'folder-important', // Moved to personal 'Important' folder!
    personalTags: ['Exam Must Do', 'Critical'],
    personalNotes: 'Special attention to reverse in K-groups. The recursive solution is tricky but elegant.',
    starred: true,
    completed: false,
    addedAt: '2024-09-07T09:00:00Z',
    lastOpenedAt: '2024-09-14T08:15:00Z'
  },

  // In personal folder 'folder-coa':
  // Resource from Community A:
  {
    id: 'pref-006',
    userId: 'usr-current',
    resourceId: 'res-coa-01', // Community A: "COA Unit 1.pdf"
    personalName: 'COA Unit 1.pdf',
    personalFolderId: 'folder-coa',
    personalTags: ['Unit 1', 'Booth Algorithm'],
    personalNotes: 'Practice Booth step table with negative multiplier.',
    starred: false,
    completed: true,
    addedAt: '2024-09-05T14:00:00Z',
    lastOpenedAt: '2024-09-10T11:00:00Z'
  },
  // Resource from Community B:
  {
    id: 'pref-007',
    userId: 'usr-current',
    resourceId: 'res-coa-02', // Community B: "COA Unit 3.pdf"
    personalName: 'COA Unit 3.pdf',
    personalFolderId: 'folder-coa',
    personalTags: ['Cache Memory', 'Numerical'],
    personalNotes: 'Cache tag calculation formulas are summarized on page 4.',
    starred: true,
    completed: false,
    addedAt: '2024-09-10T16:00:00Z',
    lastOpenedAt: '2024-09-12T19:00:00Z'
  }
];

export const INITIAL_COMMENTS: Comment[] = [
  {
    id: 'comm-101',
    resourceId: 'res-dsa-01',
    userId: 'usr-rohit',
    userName: 'Rohit Verma',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    content: 'Does this lecture slide set cover amortized time analysis for vector dynamic array doubling?',
    createdAt: '2024-09-03T14:22:00Z',
    replies: [
      {
        id: 'rep-101-1',
        commentId: 'comm-101',
        userId: 'usr-priya',
        userName: 'Priya Patel (CR)',
        userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
        content: 'Yes! Check page 18. Dr. Gupta used the accounting method and potential method proof.',
        createdAt: '2024-09-03T15:10:00Z',
      },
      {
        id: 'rep-101-2',
        commentId: 'comm-101',
        userId: 'usr-current',
        userName: 'Arjun Sharma',
        userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        content: 'Thanks Priya, that section saved me on yesterday quiz!',
        createdAt: '2024-09-03T16:45:00Z',
      }
    ]
  },
  {
    id: 'comm-102',
    resourceId: 'res-dsa-02',
    userId: 'usr-current',
    userName: 'Arjun Sharma',
    userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    content: 'Can someone explain Question 4 on Infix to Postfix with exponentiation? Why does ^ associate right to left?',
    createdAt: '2024-09-08T18:30:00Z',
    replies: [
      {
        id: 'rep-102-1',
        commentId: 'comm-102',
        userId: 'usr-ananya',
        userName: 'Ananya Rao',
        userAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80',
        content: 'In mathematical convention, 2^3^2 means 2^(3^2) = 2^9 = 512, NOT (2^3)^2 = 64. So the exponent operator has right-to-left associativity.',
        createdAt: '2024-09-08T19:05:00Z',
      }
    ]
  },
  {
    id: 'comm-103',
    resourceId: 'res-dsa-05',
    userId: 'usr-priya',
    userName: 'Priya Patel (CR)',
    userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    content: 'Everyone in Section H, please make sure to read page 14 of this linked list guide. The professor hinted it will be in the midsem question paper!',
    createdAt: '2024-09-05T11:20:00Z',
    replies: []
  },
  {
    id: 'comm-104',
    resourceId: 'res-coa-02',
    userId: 'usr-rohit',
    userName: 'Rohit Verma',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    content: 'Is direct mapping cache covered in Unit 3 test or will they only ask 4-way set associative?',
    createdAt: '2024-09-11T10:14:00Z',
    replies: [
      {
        id: 'rep-104-1',
        commentId: 'comm-104',
        userId: 'usr-prof-gupta',
        userName: 'Dr. Ramesh Gupta',
        userAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
        content: 'Both direct mapping and set-associative numericals are in the syllabus. Practice calculating tag and index bits from 32-bit addresses.',
        createdAt: '2024-09-11T12:00:00Z',
      }
    ]
  }
];

export const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann-1',
    communityId: 'comm-cseh',
    title: '📢 Mid-Semester Examination Schedule & Syllabus Announced',
    content: 'Midsems will commence on October 14th. DSA and COA will cover Units 1 through 3. All lecture notes and official PYQs have been uploaded to our Resources tab under respective subjects. Please organize them into your personal workspaces for revision.',
    authorName: 'Priya Patel (CR)',
    authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    authorRole: 'Class Representative / Admin',
    createdAt: '2024-09-12T08:00:00Z',
    pinned: true,
  },
  {
    id: 'ann-2',
    communityId: 'comm-cseh',
    title: 'Lab Test 1 Guidelines for Data Structures',
    content: 'Lab test will be conducted this Friday in CS Lab 3. Permitted language: C/C++ or Java. Topics include Singly/Doubly Linked Lists and Stack applications.',
    authorName: 'Dr. Ramesh Gupta',
    authorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    authorRole: 'Course Faculty',
    createdAt: '2024-09-09T14:30:00Z',
    pinned: false,
  },
  {
    id: 'ann-3',
    communityId: 'comm-coding',
    title: '🏆 Weekend Contest Editorial & LeetCode Hard Solutions Uploaded',
    content: 'Great participation in Saturday internal mock contest! The editorial solution PDF and dynamic programming breakdown has been uploaded to DSA resources.',
    authorName: 'Rohit Verma',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    authorRole: 'Club Lead',
    createdAt: '2024-09-10T19:00:00Z',
    pinned: true,
  },
  {
    id: 'ann-4',
    communityId: 'comm-placement',
    title: '🎯 Google & Microsoft On-Campus Drive Registration Closes Soon',
    content: 'Eligible 7th & 5th semester students must submit their verified resumes by 5 PM today. Review the FAANG Roadmap document in our resources tab.',
    authorName: 'Ananya Rao',
    authorAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80',
    authorRole: 'Placement Coordinator',
    createdAt: '2024-09-11T09:00:00Z',
    pinned: true,
  }
];
