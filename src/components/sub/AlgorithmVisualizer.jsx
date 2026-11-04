// File Name: AlgorithmVisualizer.jsx
import React, { useState, useEffect, useRef } from "react";
import { FaPlay, FaRedo, FaTimes, FaCode, FaCheck } from "react-icons/fa";
import { SiCplusplus, SiPython } from "react-icons/si";

const INITIAL_ARRAY_SIZE = 22;

const CODE_SNIPPETS = {
  quicksort: {
    name: "QuickSort",
    complexity: "O(n log n)",
    worst: "O(n²)",
    cpp: `// C++ QuickSort Implementation
void quickSort(int arr[], int low, int high) {
    if (low < high) {
        int pi = partition(arr, low, high);
        quickSort(arr, low, pi - 1);
        quickSort(arr, pi + 1, high);
    }
}
int partition(int arr[], int low, int high) {
    int pivot = arr[high];
    int i = (low - 1);
    for (int j = low; j < high; j++) {
        if (arr[j] < pivot) {
            std::swap(arr[++i], arr[j]);
        }
    }
    std::swap(arr[i + 1], arr[high]);
    return (i + 1);
}`,
    python: `# Python QuickSort Implementation
def quicksort(arr):
    if len(arr) <= 1:
        return arr
    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]
    return quicksort(left) + middle + quicksort(right)`,
  },
  bubblesort: {
    name: "BubbleSort",
    complexity: "O(n)",
    worst: "O(n²)",
    cpp: `// C++ BubbleSort with Early Exit
void bubbleSort(int arr[], int n) {
    for (int i = 0; i < n - 1; i++) {
        bool swapped = false;
        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                std::swap(arr[j], arr[j + 1]);
                swapped = true;
            }
        }
        if (!swapped) break;
    }
}`,
    python: `# Python BubbleSort Implementation
def bubble_sort(arr):
    n = len(arr)
    for i in range(n):
        swapped = False
        for j in range(0, n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
                swapped = True
        if not swapped:
            break
    return arr`,
  },
};

export const AlgorithmVisualizer = ({ isOpen, onClose }) => {
  const [array, setArray] = useState([]);
  const [algorithm, setAlgorithm] = useState("quicksort");
  const [codeTab, setCodeTab] = useState("cpp");
  const [isSorting, setIsSorting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [activeIndices, setActiveIndices] = useState([]);
  const [stats, setStats] = useState({ comparisons: 0, swaps: 0 });
  const isSortingRef = useRef(false);

  // Generate randomized array
  const generateNewArray = () => {
    isSortingRef.current = false;
    setIsSorting(false);
    setIsCompleted(false);
    setActiveIndices([]);
    setStats({ comparisons: 0, swaps: 0 });

    const newArr = [];
    for (let i = 0; i < INITIAL_ARRAY_SIZE; i++) {
      newArr.push(Math.floor(Math.random() * 85) + 12);
    }
    setArray(newArr);
  };

  useEffect(() => {
    if (isOpen) {
      generateNewArray();
    }
  }, [isOpen]);

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  // BubbleSort visual execution
  const runBubbleSort = async () => {
    isSortingRef.current = true;
    setIsSorting(true);
    const arr = [...array];
    let comparisons = 0;
    let swaps = 0;

    for (let i = 0; i < arr.length - 1; i++) {
      for (let j = 0; j < arr.length - i - 1; j++) {
        if (!isSortingRef.current) return;

        comparisons++;
        setActiveIndices([j, j + 1]);
        setStats({ comparisons, swaps });

        if (arr[j] > arr[j + 1]) {
          swaps++;
          const temp = arr[j];
          arr[j] = arr[j + 1];
          arr[j + 1] = temp;
          setArray([...arr]);
          setStats({ comparisons, swaps });
          await sleep(45);
        } else {
          await sleep(25);
        }
      }
    }

    setActiveIndices([]);
    setIsSorting(false);
    setIsCompleted(true);
    isSortingRef.current = false;
  };

  // QuickSort visual execution
  const runQuickSort = async () => {
    isSortingRef.current = true;
    setIsSorting(true);
    const arr = [...array];
    let comparisons = 0;
    let swaps = 0;

    const partition = async (low, high) => {
      const pivot = arr[high];
      let i = low - 1;

      for (let j = low; j < high; j++) {
        if (!isSortingRef.current) return -1;
        comparisons++;
        setActiveIndices([j, high]);
        setStats({ comparisons, swaps });
        await sleep(35);

        if (arr[j] < pivot) {
          i++;
          swaps++;
          const temp = arr[i];
          arr[i] = arr[j];
          arr[j] = temp;
          setArray([...arr]);
          setStats({ comparisons, swaps });
          await sleep(35);
        }
      }

      swaps++;
      const temp = arr[i + 1];
      arr[i + 1] = arr[high];
      arr[high] = temp;
      setArray([...arr]);
      setStats({ comparisons, swaps });
      await sleep(35);
      return i + 1;
    };

    const qs = async (low, high) => {
      if (low < high) {
        if (!isSortingRef.current) return;
        const pi = await partition(low, high);
        if (pi === -1) return;
        await qs(low, pi - 1);
        await qs(pi + 1, high);
      }
    };

    await qs(0, arr.length - 1);
    setActiveIndices([]);
    setIsSorting(false);
    setIsCompleted(true);
    isSortingRef.current = false;
  };

  const handleStartSort = () => {
    if (isSorting) return;
    if (algorithm === "quicksort") runQuickSort();
    else runBubbleSort();
  };

  if (!isOpen) return null;

  const currentInfo = CODE_SNIPPETS[algorithm];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-fade-in">
      <div className="relative w-full max-w-4xl bg-[#080d1e]/95 border border-cyan-500/40 rounded-3xl shadow-[0_0_60px_rgba(6,182,212,0.3)] overflow-hidden flex flex-col max-h-[92vh]">
        {/* Terminal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-cyan-500/20 bg-black/40">
          <div className="flex items-center gap-3">
            <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-yellow-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-green-500/80 inline-block" />
            <span className="font-mono text-xs sm:text-sm text-cyan-300 font-bold ml-2">
              algorithmic_workbench.exe --interactive
            </span>
          </div>

          <button
            onClick={() => {
              isSortingRef.current = false;
              onClose();
            }}
            className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
          >
            <FaTimes />
          </button>
        </div>

        {/* Workbench Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Controls Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 bg-white/5 p-4 rounded-2xl border border-white/5">
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  setAlgorithm("quicksort");
                  generateNewArray();
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-medium transition-all ${
                  algorithm === "quicksort"
                    ? "bg-cyan-500 text-black font-bold shadow-[0_0_15px_rgba(6,182,212,0.5)]"
                    : "bg-white/5 text-gray-300 hover:text-white"
                }`}
              >
                QuickSort
              </button>
              <button
                onClick={() => {
                  setAlgorithm("bubblesort");
                  generateNewArray();
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-medium transition-all ${
                  algorithm === "bubblesort"
                    ? "bg-amber-400 text-black font-bold shadow-[0_0_15px_rgba(250,204,21,0.5)]"
                    : "bg-white/5 text-gray-300 hover:text-white"
                }`}
              >
                BubbleSort
              </button>
            </div>

            {/* Metrics */}
            <div className="flex items-center gap-4 text-xs font-mono">
              <span className="text-gray-400">
                Comparisons: <strong className="text-cyan-300">{stats.comparisons}</strong>
              </span>
              <span className="text-gray-400">
                Swaps: <strong className="text-amber-300">{stats.swaps}</strong>
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 text-[11px]">
                {currentInfo.complexity}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleStartSort}
                disabled={isSorting || isCompleted}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-medium text-xs flex items-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.4)] disabled:opacity-40 cursor-pointer"
              >
                <FaPlay className="text-[10px]" />
                <span>Run Algorithm</span>
              </button>
              <button
                onClick={generateNewArray}
                className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 text-xs transition-colors cursor-pointer"
                title="Shuffle Array"
              >
                <FaRedo />
              </button>
            </div>
          </div>

          {/* Interactive Bars Canvas */}
          <div className="h-44 bg-[#030612] rounded-2xl p-4 border border-cyan-500/20 flex items-end justify-between gap-1.5 shadow-inner">
            {array.map((value, idx) => {
              const isActive = activeIndices.includes(idx);
              const barColor = isCompleted
                ? "bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.8)]"
                : isActive
                ? "bg-amber-400 shadow-[0_0_15px_rgba(250,204,21,0.9)]"
                : "bg-gradient-to-t from-cyan-600 to-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.4)]";

              return (
                <div
                  key={idx}
                  className="flex-1 flex flex-col items-center justify-end h-full group relative"
                >
                  <div
                    style={{ height: `${value}%` }}
                    className={`w-full rounded-t-md transition-all duration-75 ${barColor}`}
                  />
                  <span className="text-[9px] font-mono text-gray-500 mt-1 hidden sm:block">
                    {value}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Side-by-Side Dual-Code Snippet Window */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <div className="flex items-center gap-2 text-xs font-mono text-gray-300">
                <FaCode className="text-cyan-400" />
                <span>Code Architecture:</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCodeTab("cpp")}
                  className={`px-3 py-1 rounded-lg text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer ${
                    codeTab === "cpp"
                      ? "bg-sky-500/20 text-sky-300 border border-sky-400/50"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  <SiCplusplus />
                  <span>C++</span>
                </button>
                <button
                  onClick={() => setCodeTab("python")}
                  className={`px-3 py-1 rounded-lg text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer ${
                    codeTab === "python"
                      ? "bg-yellow-500/20 text-yellow-300 border border-yellow-400/50"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  <SiPython />
                  <span>Python</span>
                </button>
              </div>
            </div>

            <pre className="p-4 bg-black/60 rounded-2xl border border-cyan-500/20 text-xs font-mono text-cyan-200 overflow-x-auto leading-relaxed shadow-inner">
              <code>{codeTab === "cpp" ? currentInfo.cpp : currentInfo.python}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlgorithmVisualizer;
