import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const titles = [
  "C++ Systems Programmer",
  "Python Algorithm Builder",
  "Curious by Nature",
  "Creative Problem Solver",
  "Student Developer & Explorer",
];

const RotatingTitles = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % titles.length);
    }, 2800);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="h-8 flex items-center justify-center relative overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 12, filter: "blur(4px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -12, filter: "blur(4px)" }}
          transition={{ duration: 0.45, ease: "easeInOut" }}
          className="text-lg sm:text-xl md:text-2xl font-medium text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 text-center tracking-wide"
        >
          {titles[index]}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default RotatingTitles;
