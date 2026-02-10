"use client";

import { AnimatePresence, motion } from "motion/react";

interface ErrorModalProps {
  isOpen: boolean;
  message: string;
  onClose: () => void;
}

export function ErrorModal({ isOpen, message, onClose }: ErrorModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-surface rounded-2xl p-8 max-w-md border border-surface-alt"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold mb-3">Playback Error</h3>
            <p className="text-text-secondary mb-6">{message}</p>
            <button
              onClick={onClose}
              className="w-full px-4 py-2 rounded-xl bg-work text-white font-semibold
                hover:bg-work/80 transition-colors"
            >
              OK
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
