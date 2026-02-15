"use client";

import { useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Button } from "@/components/Button";

interface ErrorModalProps {
  isOpen: boolean;
  message: string;
  onClose: () => void;
}

export function ErrorModal({ isOpen, message, onClose }: ErrorModalProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose],
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [isOpen, handleKeyDown]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-labelledby="error-modal-title"
        >
          <motion.div
            className="bg-surface rounded-2xl p-8 max-w-md border border-surface-alt"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3
              id="error-modal-title"
              className="text-lg font-semibold mb-3"
            >
              Playback Error
            </h3>
            <p className="text-text-secondary mb-6">{message}</p>
            <Button onClick={onClose} className="w-full">
              OK
            </Button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
