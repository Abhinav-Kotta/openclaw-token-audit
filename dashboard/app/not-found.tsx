'use client';

import { motion } from 'framer-motion';
import { Activity, Home } from 'lucide-react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background-primary via-background-secondary to-background-tertiary">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="text-center px-6"
      >
        {/* Animated Logo */}
        <motion.div
          animate={{ 
            rotate: 360,
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            rotate: { duration: 3, repeat: Infinity, ease: "linear" },
            scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
          }}
          className="w-24 h-24 mx-auto mb-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center relative"
        >
          <Activity className="w-12 h-12 text-white" />
          
          <motion.div
            animate={{ 
              scale: [1, 1.3, 1],
              opacity: [0.3, 0.6, 0.3] 
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 bg-primary-500/40 rounded-2xl blur-xl -z-10"
          />
        </motion.div>

        {/* Error Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="text-6xl md:text-8xl font-bold mb-4 bg-anime-gradient bg-clip-text text-transparent">
            404
          </h1>
          <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-text-primary">
            Page Not Found
          </h2>
          <p className="text-lg text-text-secondary mb-8 max-w-md mx-auto">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Link href="/">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-semibold rounded-lg transition-all duration-300 hover:shadow-lg"
            >
              <Home className="w-5 h-5" />
              <span>Go to Dashboard</span>
            </motion.button>
          </Link>
        </motion.div>

        {/* Debug Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-12 text-xs text-text-secondary/60"
        >
          OpenClaw Token Audit Dashboard
        </motion.div>
      </motion.div>
    </div>
  );
}