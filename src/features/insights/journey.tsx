'use client';

import React, { useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../../stores/useAppStore';
import { ActionJourneyItem } from '../../types';
import { CheckCircle2, Circle, AlertCircle, Sparkles, Check } from 'lucide-react';

export function ActionJourney() {
  const journeyItems = useAppStore((state) => state.journeyItems);
  const toggleJourneyStatus = useAppStore((state) => state.toggleJourneyStatus);
  const reducedMotion = useAppStore((state) => state.reducedMotion);

  // Announcement live region ref
  const announcerRef = useRef<HTMLDivElement>(null);

  // Group items by week
  const groupedWeeks = useMemo(() => {
    const groups: Record<number, ActionJourneyItem[]> = {};
    journeyItems.forEach((item) => {
      if (!groups[item.week]) {
        groups[item.week] = [];
      }
      groups[item.week].push(item);
    });
    return groups;
  }, [journeyItems]);

  const stats = useMemo(() => {
    const total = journeyItems.length;
    const completed = journeyItems.filter((item) => item.status === 'completed').length;
    const saved = journeyItems
      .filter((item) => item.status === 'completed')
      .reduce((sum, item) => sum + item.estimatedCO2Saved, 0);

    return {
      total,
      completed,
      saved: parseFloat(saved.toFixed(1)),
      percent: total > 0 ? Math.round((completed / total) * 100) : 0,
    };
  }, [journeyItems]);

  const handleToggle = (id: number, currentStatus: ActionJourneyItem['status'], name: string) => {
    const nextStatus = currentStatus === 'completed' ? 'pending' : 'completed';
    toggleJourneyStatus(id, nextStatus);
    
    // Announce state change to screen readers
    if (announcerRef.current) {
      announcerRef.current.textContent = `Action "${name}" marked as ${
        nextStatus === 'completed' ? 'completed. Nice work!' : 'pending.'
      }`;
    }
  };

  const listVariants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: reducedMotion ? 0 : 0.05,
      },
    },
  } as const;

  const itemVariants = {
    hidden: { opacity: 0, y: reducedMotion ? 0 : 10 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 25 } },
  } as const;

  return (
    <section className="space-y-6" aria-label="Personalized Action Roadmap">
      {/* Screen Reader Live Region */}
      <div
        ref={announcerRef}
        className="sr-only"
        aria-live="polite"
        aria-atomic="true"
      ></div>

      {/* Progress Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-6">
        <div className="space-y-2 text-center sm:text-left w-full sm:w-auto">
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <Sparkles className="w-5 h-5 text-emerald-500" />
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Your Action Roadmap</h3>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            AI-generated personalized pathway based on your footprint. Check off items to log savings!
          </p>
        </div>

        <div className="flex items-center gap-6 shrink-0 w-full sm:w-auto justify-around sm:justify-end">
          <div className="text-center">
            <div className="text-2xl font-black text-slate-800 dark:text-slate-100">{stats.saved} kg</div>
            <div className="text-[10px] text-emerald-500 font-bold uppercase tracking-wider">Weekly CO₂ Saved</div>
          </div>

          <div className="h-10 w-[1px] bg-slate-200 dark:bg-slate-800" />

          <div className="text-center">
            <div className="text-2xl font-black text-slate-800 dark:text-slate-100">
              {stats.completed}/{stats.total}
            </div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
              Actions Done
            </div>
          </div>
        </div>
      </div>

      {/* Action Weeks */}
      {journeyItems.length === 0 ? (
        <div className="bg-slate-50 dark:bg-slate-900 p-8 rounded-xl text-center border border-slate-200 dark:border-slate-700/80">
          <AlertCircle className="w-8 h-8 text-slate-350 dark:text-slate-600 mx-auto mb-2" />
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
            Please complete onboarding to generate your action pathway!
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.keys(groupedWeeks)
            .map(Number)
            .sort((a, b) => a - b)
            .map((weekNum) => (
              <div key={weekNum} className="space-y-3">
                <h4 className="text-xs font-bold text-slate-500 dark:text-slate-500 uppercase tracking-widest pl-1">
                  Week {weekNum}
                </h4>

                <motion.div
                  variants={listVariants}
                  initial="hidden"
                  animate="show"
                  className="space-y-3"
                >
                  {groupedWeeks[weekNum].map((item) => {
                    const isCompleted = item.status === 'completed';
                    return (
                      <motion.div
                        key={item.id}
                        variants={itemVariants}
                        className={`p-4 rounded-xl border transition-all duration-200 flex items-start gap-4 shadow-sm shadow-slate-100/30 ${
                          isCompleted
                            ? 'bg-emerald-500/[0.02] border-emerald-500/20'
                            : 'bg-white border-slate-200/80 hover:border-emerald-500/20 hover:shadow-sm'
                        }`}
                      >
                        {/* Toggle Checkbox Button */}
                        <button
                          onClick={() => handleToggle(item.id!, item.status, item.action)}
                          aria-label={`Mark "${item.action}" as ${isCompleted ? 'incomplete' : 'complete'}`}
                          className={`mt-0.5 shrink-0 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
                            isCompleted ? 'text-emerald-500' : 'text-slate-300 dark:text-slate-600 hover:text-emerald-400'
                          }`}
                        >
                          {isCompleted ? (
                            <CheckCircle2 className="w-5 h-5 fill-emerald-500/10" />
                          ) : (
                            <Circle className="w-5 h-5" />
                          )}
                        </button>

                        <div className="flex-grow space-y-1">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <span
                              className={`text-sm font-bold transition-all ${
                                isCompleted
                                  ? 'line-through text-slate-450 dark:text-slate-500 font-medium'
                                  : 'text-slate-800 dark:text-slate-100'
                              }`}
                            >
                              {item.action}
                            </span>
                            
                            <span className="text-xxs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 dark:bg-emerald-500/20 px-2 py-0.5 rounded-full shrink-0">
                              -{item.estimatedCO2Saved} kg CO₂/wk
                            </span>
                          </div>
                          <p
                            className={`text-xs leading-relaxed transition-all ${
                              isCompleted ? 'text-slate-400 dark:text-slate-550' : 'text-slate-600 dark:text-slate-300'
                            }`}
                          >
                            {item.description}
                          </p>
                        </div>
                      </motion.div>
                    );
                  })}
                </motion.div>
              </div>
            ))}
        </div>
      )}
    </section>
  );
}
export default ActionJourney;
