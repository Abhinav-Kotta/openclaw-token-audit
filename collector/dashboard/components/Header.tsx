'use client';

import { motion } from 'framer-motion';
import { RefreshCw, Activity, Settings, Bell } from 'lucide-react';
import { useState } from 'react';

interface HeaderProps {
  onRefresh: () => void;
}

export default function Header({ onRefresh }: HeaderProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await onRefresh();
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-background-secondary/80 backdrop-blur-sm border-b border-primary-500/20 sticky top-0 z-50"
    >
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Title */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="flex items-center space-x-3"
          >
            <div className="relative">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center"
              >
                <Activity className="w-5 h-5 text-white" />
              </motion.div>
              
              {/* Glow Effect */}
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 0.8, 0.5] 
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 bg-primary-500/30 rounded-lg blur-md -z-10"
              />
            </div>
            
            <div>
              <h1 className="text-xl font-bold text-text-primary">
                OpenClaw
              </h1>
              <p className="text-xs text-text-secondary -mt-1">
                Token Audit
              </p>
            </div>
          </motion.div>

          {/* Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <nav className="flex items-center space-x-6">
              <motion.a
                href="/"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="text-text-primary font-medium hover:text-primary-400 transition-colors relative"
              >
                Dashboard
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-500 origin-left"
                  initial={{ scaleX: 1 }}
                  animate={{ scaleX: 1 }}
                />
              </motion.a>
              
              <motion.a
                href="#"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="text-text-secondary hover:text-text-primary transition-colors"
              >
                Analytics
              </motion.a>
              
              <motion.a
                href="#"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="text-text-secondary hover:text-text-primary transition-colors"
              >
                Reports
              </motion.a>
            </nav>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-3">
            {/* Notifications */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative p-2 text-text-secondary hover:text-text-primary transition-colors"
            >
              <Bell className="w-5 h-5" />
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"
              />
            </motion.button>

            {/* Settings */}
            <motion.button
              whileHover={{ scale: 1.05, rotate: 90 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 text-text-secondary hover:text-text-primary transition-all duration-300"
            >
              <Settings className="w-5 h-5" />
            </motion.button>

            {/* Refresh Button */}
            <motion.button
              onClick={handleRefresh}
              disabled={isRefreshing}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-2 px-3 py-2 bg-primary-500/20 hover:bg-primary-500/30 border border-primary-500/30 hover:border-primary-500/50 rounded-lg transition-all duration-200 text-primary-400 hover:text-primary-300"
            >
              <motion.div
                animate={isRefreshing ? { rotate: 360 } : {}}
                transition={{ duration: 1, repeat: isRefreshing ? Infinity : 0, ease: "linear" }}
              >
                <RefreshCw className="w-4 h-4" />
              </motion.div>
              <span className="text-sm font-medium hidden sm:inline">
                {isRefreshing ? 'Refreshing...' : 'Refresh'}
              </span>
            </motion.button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 0, opacity: 0 }}
          className="md:hidden overflow-hidden border-t border-primary-500/20"
        >
          <div className="py-3 space-y-2">
            <a href="/" className="block py-2 text-text-primary font-medium">
              Dashboard
            </a>
            <a href="#" className="block py-2 text-text-secondary">
              Analytics
            </a>
            <a href="#" className="block py-2 text-text-secondary">
              Reports
            </a>
          </div>
        </motion.div>
      </div>

      {/* Animated Background Lines */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-px bg-gradient-to-r from-transparent via-primary-500/20 to-transparent"
            style={{
              top: `${30 + i * 20}%`,
              left: '-100%',
              right: '-100%',
            }}
            animate={{
              x: ['100%', '-100%'],
            }}
            transition={{
              duration: 10 + i * 2,
              repeat: Infinity,
              repeatType: 'loop',
              ease: 'linear',
              delay: i * 2,
            }}
          />
        ))}
      </div>
    </motion.header>
  );
}