'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useAppStore } from '../stores/useAppStore';
import { Onboarding } from '../features/onboarding/onboarding';
import { WhatIfSimulator, useSimulatorData } from '../features/simulator/simulator';
import { CarbonAssistant } from '../features/assistant/assistant';
import { ActionJourney } from '../features/insights/journey';
import { FloatingEcosystem } from '../features/landing/FloatingEcosystem';
import { Compass, Sparkles, ListChecks, ChevronRight, ArrowDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/* ─── Hero Simulation Data ─── */
const heroScenarios = [
  { from: 'Drive Alone', to: 'Carpool', impact: '67%' },
  { from: 'Meat Heavy Diet', to: 'Plant Based', impact: '54%' },
  { from: 'Frequent Flyer', to: 'Train Travel', impact: '72%' },
];

/* ─── Hero Simulation Card ─── */
function HeroSimulation({ reducedMotion }: { reducedMotion: boolean }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % heroScenarios.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  const scenario = heroScenarios[index];

  return (
    <div className="w-full max-w-sm mx-auto">
      {/* Simulated product card */}
      <div className="rounded-2xl border border-slate-200/60 dark:border-slate-700/40 bg-white/60 dark:bg-surface-elevated/60 backdrop-blur-xl p-6 shadow-lg shadow-black/5 dark:shadow-black/20">
        <div className="text-[10px] uppercase font-mono font-bold tracking-widest text-slate-400 dark:text-slate-500 mb-4">
          Decision Simulation
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            {/* From state */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-100/60 dark:bg-slate-800/40 border border-slate-200/40 dark:border-slate-700/30">
              <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">{scenario.from}</span>
              <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 uppercase">Current</span>
            </div>

            {/* Arrow */}
            <div className="flex justify-center">
              <ArrowDown className="w-4 h-4 text-emerald-500" />
            </div>

            {/* To state */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/20">
              <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">{scenario.to}</span>
              <span className="text-[10px] font-mono text-emerald-500 uppercase">Alternative</span>
            </div>

            {/* Impact */}
            <div className="pt-2 border-t border-slate-200/40 dark:border-slate-700/30 flex items-baseline justify-between">
              <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 dark:text-slate-500">Impact Reduction</span>
              <span className="text-2xl font-black text-emerald-500 tracking-tight">{scenario.impact}</span>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ─── Carbon Snapshot Bar ─── */
function CarbonSnapshot() {
  const { baselineFootprint } = useSimulatorData();

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl px-6 py-4 shadow-sm">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono">Carbon Snapshot</h2>
          <p className="text-[11px] text-slate-500 mt-0.5">Your baseline footprint from profile data. Adjust in the simulator below.</p>
        </div>

        <div className="flex items-center gap-6 sm:gap-10 shrink-0">
          <div className="text-right">
            <div className="text-[9px] uppercase font-mono font-bold tracking-wider text-slate-400">Annual Footprint</div>
            <div className="text-xl font-extrabold text-slate-800 tracking-tight">
              {baselineFootprint.total.toLocaleString()} <span className="text-xs font-medium text-slate-400">kg</span>
            </div>
          </div>

          <div className="h-8 w-[1px] bg-slate-200/80" />

          <div className="text-right">
            <div className="text-[9px] uppercase font-mono font-bold tracking-wider text-slate-400">Monthly Average</div>
            <div className="text-xl font-extrabold text-slate-800 tracking-tight">
              {Math.round(baselineFootprint.total / 12).toLocaleString()} <span className="text-xs font-medium text-slate-400">kg</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Landing Screen ─── */
interface LandingScreenProps {
  onStart: () => void;
  reducedMotion: boolean;
}

function LandingScreen({ onStart, reducedMotion }: LandingScreenProps) {
  const constraintRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={constraintRef}
      className="relative w-full max-w-6xl mx-auto px-6 flex flex-col lg:flex-row items-center justify-between min-h-[80vh] gap-12 lg:gap-16 py-16 overflow-hidden"
    >

      {/* Floating Sustainability Ecosystem */}
      <FloatingEcosystem reducedMotion={reducedMotion} constraintRef={constraintRef} />

      {/* LEFT: Text content */}
      <div className="flex-1 max-w-xl z-10 text-center lg:text-left">
        <h2 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900 dark:text-slate-50 leading-[1.2]">
          Understand the environmental impact of everyday choices{' '}
          <span className="bg-gradient-to-r from-emerald-500 to-teal-400 bg-clip-text text-transparent">
            before making them.
          </span>
        </h2>

        <p className="mt-4 text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-md mx-auto lg:mx-0">
          Simulate transportation, food, energy and lifestyle decisions using personalized carbon impact analysis.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center gap-4 lg:justify-start justify-center">
          <button
            onClick={onStart}
            className="px-7 py-3 bg-slate-900 hover:bg-slate-800 dark:bg-slate-50 dark:hover:bg-slate-200 text-white dark:text-slate-950 font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2 group text-sm cursor-pointer"
          >
            <span>Start Exploring</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>

          <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 tracking-widest uppercase">
            No Sign Up Required
          </span>
        </div>
      </div>

      {/* RIGHT: Hero Simulation */}
      <div className="flex-1 max-w-md z-10 w-full">
        <HeroSimulation reducedMotion={reducedMotion} />
      </div>
    </div>
  );
}

/* ─── Top Navbar (shared across all views) ─── */
function TopNavbar() {
  return (
    <header className="bg-white/50 dark:bg-surface/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-700 sticky top-0 z-50 px-6 py-3.5">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="p-1.5 bg-emerald-500/10 rounded-lg">
            <Compass className="w-5 h-5 text-emerald-500" />
          </div>
          <div>
            <h1 className="text-base font-black text-slate-800 dark:text-slate-100 tracking-tight leading-none">
              Carbon <span className="text-emerald-500">Compass</span>
            </h1>
            <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-0.5 block">
              AI Carbon Decision Platform
            </span>
          </div>
        </div>

        <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 bg-slate-100/60 dark:bg-surface-elevated px-3 py-1 rounded-full border border-slate-200/20 dark:border-slate-700 hidden sm:block">
          Your Data Stays On This Device
        </span>
      </div>
    </header>
  );
}

/* ─── Main Application ─── */
export default function Home() {
  const loadFromDB = useAppStore((state) => state.loadFromDB);
  const isOnboarded = useAppStore((state) => state.isOnboarded);
  const isDbLoaded = useAppStore((state) => state.isDbLoaded);
  const setReducedMotion = useAppStore((state) => state.setReducedMotion);
  const reducedMotion = useAppStore((state) => state.reducedMotion);

  const [activeTab, setActiveTab] = useState<'assistant' | 'roadmap'>('assistant');
  const [started, setStarted] = useState(false);

  useEffect(() => {
    loadFromDB();

    if (typeof window !== 'undefined') {
      // Explicitly ensure light theme is standard by removing any 'dark' class
      document.documentElement.classList.remove('dark');

      // Synchronize prefers-reduced-motion
      const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      setReducedMotion(motionQuery.matches);
      const motionHandler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
      motionQuery.addEventListener('change', motionHandler);

      return () => {
        motionQuery.removeEventListener('change', motionHandler);
      };
    }
  }, [loadFromDB, setReducedMotion]);

  if (!isDbLoaded) {
    return (
      <div className="flex items-center justify-center min-h-[90vh]">
        <div className="flex flex-col items-center space-y-4">
          <Compass className="w-10 h-10 text-emerald-500 animate-spin" />
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Loading Carbon Compass...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#0f1629] text-slate-900 dark:text-slate-100 transition-colors duration-300">
      
      {/* Top Navbar — always visible */}
      <TopNavbar />

      <AnimatePresence mode="wait">
        
        {/* Landing screen — always shown first for all users */}
        {!started && (
          <motion.div
            key="landing"
            initial={{ opacity: 1 }}
            exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="flex-grow flex flex-col justify-center"
          >
            <LandingScreen onStart={() => setStarted(true)} reducedMotion={reducedMotion} />
          </motion.div>
        )}

        {/* Onboarding checklist — only shown after Start Exploring if not yet onboarded */}
        {started && !isOnboarded && (
          <motion.div
            key="onboarding"
            initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="flex-grow flex flex-col justify-center py-12"
          >
            <div className="max-w-2xl w-full mx-auto px-4">
              <header className="flex flex-col items-center mb-10 space-y-2 text-center">
                <div className="flex items-center space-x-3">
                  <Compass className="w-7 h-7 text-emerald-500" />
                  <h1 className="text-2xl font-black tracking-tight text-slate-800 dark:text-slate-50 leading-none">
                    Carbon <span className="text-emerald-500">Compass</span>
                  </h1>
                </div>
                <span className="text-xs text-slate-400 dark:text-slate-500 tracking-wide">
                  Personalize your carbon baseline
                </span>
              </header>
              <main>
                <Onboarding onComplete={loadFromDB} />
              </main>
            </div>
          </motion.div>
        )}

        {/* Main dashboard — shown after Start Exploring for onboarded users */}
        {started && isOnboarded && (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="min-h-screen flex flex-col w-full"
          >
            <main className="max-w-6xl mx-auto px-6 py-6 flex-grow w-full space-y-6">
              
              {/* Carbon Snapshot Bar */}
              <CarbonSnapshot />

              {/* Main Two-Column Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                
                {/* Left: Decision Simulator */}
                <section aria-label="What-If Decision Simulator">
                  <WhatIfSimulator />
                </section>

                {/* Right: AI Assistant & Journey Roadmap Tabs */}
                <section className="space-y-4" aria-label="Assistant and Action Roadmap">
                  {/* Tab Selector */}
                  <div className="flex bg-slate-100/60 dark:bg-surface p-1 rounded-xl" role="tablist" aria-label="Navigation Tabs">
                    <button
                      role="tab"
                      aria-selected={activeTab === 'assistant'}
                      onClick={() => setActiveTab('assistant')}
                      className={`flex-1 flex items-center justify-center space-x-2 py-2.5 text-xs font-bold rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                        activeTab === 'assistant'
                          ? 'bg-white dark:bg-surface-elevated text-slate-800 dark:text-slate-100 shadow-sm border border-slate-200/20 dark:border-slate-700/30'
                          : 'text-slate-500 dark:text-slate-400 hover:text-emerald-500'
                      }`}
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>AI Assistant</span>
                    </button>
                    
                    <button
                      role="tab"
                      aria-selected={activeTab === 'roadmap'}
                      onClick={() => setActiveTab('roadmap')}
                      className={`flex-1 flex items-center justify-center space-x-2 py-2.5 text-xs font-bold rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                        activeTab === 'roadmap'
                          ? 'bg-white dark:bg-surface-elevated text-slate-800 dark:text-slate-100 shadow-sm border border-slate-200/20 dark:border-slate-700'
                          : 'text-slate-500 dark:text-slate-400 hover:text-emerald-500'
                      }`}
                    >
                      <ListChecks className="w-3.5 h-3.5" />
                      <span>Action Journey</span>
                    </button>
                  </div>

                  {/* Render Active Content */}
                  <div className="transition-all duration-300">
                    {activeTab === 'assistant' ? (
                      <CarbonAssistant />
                    ) : (
                      <ActionJourney />
                    )}
                  </div>
                </section>

              </div>
            </main>

            {/* Footer */}
            <footer className="border-t border-slate-200 dark:border-slate-700 py-5 text-center text-[10px] text-slate-400 dark:text-slate-500">
              <div className="max-w-6xl mx-auto px-6">
                <p>© {new Date().getFullYear()} Carbon Compass. Powered by Gemini Flash. All data stored locally on your device.</p>
              </div>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
