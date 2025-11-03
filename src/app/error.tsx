"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function GlobalError({ error, reset }: any) {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    console.error("Global error caught:", error);
    setIsVisible(true);
  }, [error]);

  const createRipple = (e: React.MouseEvent) => {
    const button = e.currentTarget;
    const ripple = document.createElement("span");
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    ripple.className = "ripple-effect";

    button.appendChild(ripple);

    setTimeout(() => {
      ripple.remove();
    }, 600);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50 dark:from-slate-900 dark:via-gray-900 dark:to-zinc-900 relative overflow-hidden">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-5 dark:opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(#64748b_1px,transparent_1px)] [background-size:16px_16px]"></div>
      </div>

      {/* Subtle Floating Elements */}
      <motion.div
        className="absolute top-20 left-10 w-24 h-24 bg-emerald-200 dark:bg-emerald-800 rounded-full blur-3xl opacity-20"
        animate={{
          y: [0, -20, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-20 right-10 w-32 h-32 bg-sky-200 dark:bg-sky-800 rounded-full blur-3xl opacity-20"
        animate={{
          y: [0, 20, 0],
          scale: [1.1, 1, 1.1],
        }}
        transition={{ duration: 10, repeat: Infinity }}
      />

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <AnimatePresence>
          {isVisible && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.6, type: "spring" }}
              className="max-w-md w-full"
            >
              <motion.div
                className="relative bg-white/95 dark:bg-slate-800/95 backdrop-blur-2xl rounded-3xl shadow-lg dark:shadow-slate-900/30 border border-slate-200/60 dark:border-slate-700/60 p-8"
                whileHover={{ scale: 1.01 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {/* Main Content */}
                <div className="text-center relative z-10">
                  {/* Icon Container */}
                  <motion.div
                    className="relative mb-8"
                    animate={{
                      y: [0, -8, 0],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    <div className="relative mx-auto w-20 h-20">
                      {/* Outer Ring */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-600 rounded-2xl"
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 12,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      />

                      {/* Inner Icon */}
                      <div className="absolute inset-2 bg-white dark:bg-slate-800 rounded-xl shadow-sm flex items-center justify-center">
                        <motion.svg
                          className="w-10 h-10 text-slate-600 dark:text-slate-300"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          animate={{
                            scale: [1, 1.05, 1],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                          }}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                          />
                        </motion.svg>
                      </div>
                    </div>
                  </motion.div>

                  {/* Title */}
                  <motion.h1
                    className="text-2xl font-semibold text-slate-800 dark:text-slate-100 mb-4"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    Something went wrong
                  </motion.h1>

                  {/* Error Message */}
                  <motion.div
                    className="bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl p-4 mb-6"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <p className="text-slate-600 dark:text-slate-300 text-sm">
                      {error?.message ||
                        "We encountered an unexpected issue. Please try again."}
                    </p>
                  </motion.div>

                  {/* Action Buttons */}
                  <motion.div
                    className="flex flex-col sm:flex-row gap-3 justify-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <motion.button
                      onClick={(e) => {
                        createRipple(e);
                        reset();
                      }}
                      onMouseEnter={() => setIsHovered(true)}
                      onMouseLeave={() => setIsHovered(false)}
                      className="relative flex-1 bg-slate-800 hover:bg-slate-900 dark:bg-slate-700 dark:hover:bg-slate-600 text-white font-medium py-3 px-6 rounded-xl shadow-sm hover:shadow-md transform transition-all duration-200 flex items-center justify-center gap-2 overflow-hidden group"
                      whileHover={{
                        scale: 1.02,
                        y: -1,
                      }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <motion.svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        animate={{ rotate: isHovered ? 180 : 0 }}
                        transition={{ duration: 0.4 }}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                        />
                      </motion.svg>
                      Try Again
                    </motion.button>

                    <motion.button
                      onClick={(e) => {
                        createRipple(e);
                        window.location.href = "/";
                      }}
                      className="relative flex-1 border border-slate-300 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-500 bg-white/80 dark:bg-slate-700/80 text-slate-700 dark:text-slate-200 font-medium py-3 px-6 rounded-xl shadow-sm hover:shadow-md transform transition-all duration-200 flex items-center justify-center gap-2 overflow-hidden"
                      whileHover={{
                        scale: 1.02,
                        y: -1,
                      }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <motion.svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        animate={{
                          y: [0, -2, 0],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                        }}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                        />
                      </motion.svg>
                      Go Home
                    </motion.button>
                  </motion.div>

                  {/* Additional Help */}
                  <motion.div
                    className="mt-6 flex flex-wrap justify-center gap-3"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    <button
                      onClick={() =>
                        window.open("mailto:support@yourapp.com", "_blank")
                      }
                      className="text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 font-medium transition-colors duration-200 flex items-center gap-1"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                      Contact Support
                    </button>

                    <span className="text-slate-300 dark:text-slate-600">
                      •
                    </span>

                    <button
                      onClick={() => window.location.reload()}
                      className="text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 font-medium transition-colors duration-200 flex items-center gap-1"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                      Search Help
                    </button>
                  </motion.div>

                  {/* Error Code */}
                  {error?.digest && (
                    <motion.div
                      className="mt-4 p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg border border-slate-200 dark:border-slate-600"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                    >
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                        Error ID: {error.digest}
                      </p>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style jsx>{`
        .ripple-effect {
          position: absolute;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.4);
          transform: scale(0);
          animation: ripple 0.6s linear;
        }

        @keyframes ripple {
          to {
            transform: scale(4);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
