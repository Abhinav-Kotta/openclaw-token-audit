'use client';

import { motion } from 'framer-motion';
import { format, parseISO } from 'date-fns';
import { Clock, User, MessageCircle, Activity } from 'lucide-react';
import { clsx } from 'clsx';

interface Session {
  timestamp: string;
  tokensIn: number;
  tokensOut: number;
  context: number;
  session: {
    id: string;
    agent: string;
    channel: string;
    started: string;
    simulated?: boolean;
  };
}

interface SessionsTableProps {
  sessions: Session[];
}

const getAgentColor = (agent: string) => {
  const colors: Record<string, string> = {
    'claude-3-sonnet': 'text-primary-400 bg-primary-500/20',
    'gpt-4': 'text-secondary-400 bg-secondary-500/20',
    'gpt-3.5-turbo': 'text-accent-400 bg-accent-500/20',
  };
  return colors[agent] || 'text-gray-400 bg-gray-500/20';
};

const getChannelIcon = (channel: string) => {
  switch (channel.toLowerCase()) {
    case 'webchat':
      return MessageCircle;
    case 'discord':
      return MessageCircle;
    case 'slack':
      return MessageCircle;
    default:
      return Activity;
  }
};

const SessionRow = ({ session, index }: { session: Session; index: number }) => {
  const ChannelIcon = getChannelIcon(session.session.channel);
  
  return (
    <motion.tr
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ backgroundColor: 'rgba(236, 72, 153, 0.05)' }}
      className="border-b border-primary-500/10 hover:border-primary-500/20 transition-all duration-200"
    >
      {/* Session ID & Status */}
      <td className="px-6 py-4">
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-primary-500/20 rounded-lg flex items-center justify-center">
              <Activity className="w-4 h-4 text-primary-400" />
            </div>
          </div>
          <div>
            <div className="text-text-primary font-mono text-sm font-medium">
              {session.session.id.slice(-8)}
            </div>
            {session.session.simulated && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
                Simulated
              </span>
            )}
          </div>
        </div>
      </td>

      {/* Agent */}
      <td className="px-6 py-4">
        <span className={clsx(
          'inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border',
          getAgentColor(session.session.agent)
        )}>
          <User className="w-3 h-3 mr-1" />
          {session.session.agent}
        </span>
      </td>

      {/* Channel */}
      <td className="px-6 py-4">
        <div className="flex items-center space-x-2 text-text-secondary">
          <ChannelIcon className="w-4 h-4" />
          <span className="capitalize font-medium">{session.session.channel}</span>
        </div>
      </td>

      {/* Token Usage */}
      <td className="px-6 py-4">
        <div className="grid grid-cols-3 gap-2 text-center">
          <div>
            <div className="text-primary-400 text-xs font-medium">In</div>
            <div className="text-text-primary font-mono text-sm">
              {session.tokensIn.toLocaleString()}
            </div>
          </div>
          <div>
            <div className="text-secondary-400 text-xs font-medium">Out</div>
            <div className="text-text-primary font-mono text-sm">
              {session.tokensOut.toLocaleString()}
            </div>
          </div>
          <div>
            <div className="text-accent-400 text-xs font-medium">Ctx</div>
            <div className="text-text-primary font-mono text-sm">
              {session.context.toLocaleString()}
            </div>
          </div>
        </div>
      </td>

      {/* Duration */}
      <td className="px-6 py-4">
        <div className="flex items-center space-x-2 text-text-secondary">
          <Clock className="w-4 h-4" />
          <span className="text-sm">
            {(() => {
              const start = parseISO(session.session.started);
              const end = parseISO(session.timestamp);
              const diffMinutes = Math.round((end.getTime() - start.getTime()) / (1000 * 60));
              return `${diffMinutes}m`;
            })()}
          </span>
        </div>
      </td>

      {/* Timestamp */}
      <td className="px-6 py-4">
        <div className="text-text-secondary text-sm">
          <div>{format(parseISO(session.timestamp), 'MMM dd, HH:mm')}</div>
          <div className="text-xs opacity-60">
            {format(parseISO(session.timestamp), 'yyyy')}
          </div>
        </div>
      </td>
    </motion.tr>
  );
};

export default function SessionsTable({ sessions }: SessionsTableProps) {
  const sortedSessions = [...sessions].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-background-secondary/50 backdrop-blur-sm border border-primary-500/20 rounded-xl overflow-hidden"
    >
      {/* Table Header */}
      <div className="px-6 py-4 border-b border-primary-500/20">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-text-primary">Recent Sessions</h3>
            <p className="text-text-secondary text-sm">
              Latest token usage sessions across all channels
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="text-text-secondary text-sm">
              {sortedSessions.length} total sessions
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-background-tertiary/30">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                Session
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                Agent
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                Channel
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-text-secondary uppercase tracking-wider">
                Tokens
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                Duration
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                Timestamp
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-primary-500/10">
            {sortedSessions.length > 0 ? (
              sortedSessions.slice(0, 10).map((session, index) => (
                <SessionRow
                  key={session.session.id}
                  session={session}
                  index={index}
                />
              ))
            ) : (
              <motion.tr
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <td colSpan={6} className="px-6 py-12 text-center">
                  <div className="text-text-secondary">
                    <Activity className="w-12 h-12 mx-auto mb-4 opacity-40" />
                    <p className="text-lg font-medium mb-2">No Sessions Found</p>
                    <p className="text-sm">
                      Sessions will appear here as they become available
                    </p>
                  </div>
                </td>
              </motion.tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Table Footer */}
      {sortedSessions.length > 10 && (
        <div className="px-6 py-3 bg-background-tertiary/20 border-t border-primary-500/10">
          <div className="text-center text-text-secondary text-sm">
            Showing 10 of {sortedSessions.length} sessions
          </div>
        </div>
      )}
    </motion.div>
  );
}