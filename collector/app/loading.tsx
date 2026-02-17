'use client';

import { motion } from 'framer-motion';
import { Activity } from 'lucide-react';

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background-primary via-background-secondary to-background-tertiary">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        {/* Loading Logo */}
        <motion.div
          animate={{ 
            rotate: 360,
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            rotate: { duration: 2, repeat: Infinity, ease: "linear" },
            scale: { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
          }}
          className="w-24 h-24 mx-auto mb-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center relative"
        >
          <Activity className="w-12 h-12 text-white" />
          
          <motion.div
            animate={{ 
              scale: [1, 1.5, 1],
              opacity: [0.3, 0.8, 0.3] 
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 bg-primary-500/40 rounded-2xl blur-xl -z-10"
          />
        </motion.div>

        {/* Loading Text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-2xl font-semibold mb-4 text-text-primary">
            Loading Dashboard
          </h2>
          <p className="text-text-secondary mb-8">
            Preparing your token analytics...
          </p>
        </motion.div>

        {/* Loading Dots */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex items-center justify-center space-x-2"
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{ 
                scale: [1, 1.3, 1],
                opacity: [0.4, 1, 0.4] 
              }}
              transition={{ 
                duration: 0.8,
                repeat: Infinity,
                delay: i * 0.2 
              }}
              className="w-3 h-3 bg-primary-500 rounded-full"
            />
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}