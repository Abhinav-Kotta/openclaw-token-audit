'use client';

import { motion } from 'framer-motion';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { clsx } from 'clsx';

interface StatsCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    direction: 'up' | 'down';
  };
  color?: 'primary' | 'secondary' | 'accent';
  size?: 'normal' | 'small';
}

const colorClasses = {
  primary: {
    bg: 'bg-primary-500/20',
    border: 'border-primary-500/30',
    icon: 'text-primary-400',
    glow: 'shadow-primary-500/20',
  },
  secondary: {
    bg: 'bg-secondary-500/20',
    border: 'border-secondary-500/30',
    icon: 'text-secondary-400',
    glow: 'shadow-secondary-500/20',
  },
  accent: {
    bg: 'bg-accent-500/20',
    border: 'border-accent-500/30',
    icon: 'text-accent-400',
    glow: 'shadow-accent-500/20',
  },
};

export default function StatsCard({
  title,
  value,
  icon: Icon,
  trend,
  color = 'primary',
  size = 'normal'
}: StatsCardProps) {
  const colors = colorClasses[color];
  const isSmall = size === 'small';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ 
        scale: 1.02,
        boxShadow: `0 20px 40px -12px rgba(236, 72, 153, 0.25)`
      }}
      className={clsx(
        'relative overflow-hidden rounded-xl backdrop-blur-sm border transition-all duration-300',
        colors.bg,
        colors.border,
        'hover:border-opacity-50',
        isSmall ? 'p-4' : 'p-6'
      )}
    >
      {/* Background Gradient Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
      
      {/* Animated Border Glow */}
      <motion.div
        className={clsx(
          'absolute inset-0 rounded-xl opacity-0',
          colors.glow
        )}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        style={{
          boxShadow: `inset 0 0 20px rgba(236, 72, 153, 0.1)`
        }}
      />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className={clsx(
            'rounded-lg p-2 backdrop-blur-sm',
            colors.bg,
            colors.border,
            'border'
          )}>
            <Icon className={clsx(
              colors.icon,
              isSmall ? 'w-4 h-4' : 'w-5 h-5'
            )} />
          </div>
          
          {trend && (
            <div className={clsx(
              'flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium',
              trend.direction === 'up' 
                ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                : 'bg-red-500/20 text-red-400 border border-red-500/30'
            )}>
              {trend.direction === 'up' ? (
                <TrendingUp className="w-3 h-3" />
              ) : (
                <TrendingDown className="w-3 h-3" />
              )}
              <span>{trend.value}%</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="space-y-2">
          <h3 className={clsx(
            'font-medium text-text-secondary',
            isSmall ? 'text-sm' : 'text-base'
          )}>
            {title}
          </h3>
          
          <div className={clsx(
            'font-bold text-text-primary font-mono',
            isSmall ? 'text-xl' : 'text-3xl'
          )}>
            <motion.span
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ 
                duration: 0.5,
                delay: 0.2,
                type: "spring",
                stiffness: 100
              }}
              className="inline-block"
            >
              {value}
            </motion.span>
          </div>
        </div>

        {/* Floating Particles Effect */}
        <div className="absolute top-0 right-0 w-20 h-20 pointer-events-none">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className={clsx(
                'absolute w-1 h-1 rounded-full opacity-40',
                colors.icon
              )}
              style={{
                left: `${20 + i * 15}%`,
                top: `${30 + i * 10}%`,
              }}
              animate={{
                y: [-5, -15, -5],
                opacity: [0.4, 0.8, 0.4],
              }}
              transition={{
                duration: 3 + i * 0.5,
                repeat: Infinity,
                repeatType: "reverse",
                delay: i * 0.5,
              }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}