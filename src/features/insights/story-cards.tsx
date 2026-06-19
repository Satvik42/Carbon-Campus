'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '../../stores/useAppStore';
import { Trees, Fuel, Smartphone, ShieldCheck } from 'lucide-react';

interface StoryCardsProps {
  co2SavedKg: number; // annual or active simulated savings in kg CO2
}

export function StoryCards({ co2SavedKg }: StoryCardsProps) {
  const reducedMotion = useAppStore((state) => state.reducedMotion);

  // Conversion calculations
  const treeMonths = Math.max(0, parseFloat((co2SavedKg / 2.0).toFixed(1)));
  const gasGallons = Math.max(0, parseFloat((co2SavedKg / 8.887).toFixed(1)));
  const phoneCharges = Math.max(0, Math.round(co2SavedKg / 0.008));
  const carKm = Math.max(0, Math.round(co2SavedKg / 0.251));

  const cards = [
    {
      id: 'trees',
      title: 'Forest Equivalent',
      value: treeMonths >= 12 ? `${(treeMonths / 12).toFixed(1)} years` : `${treeMonths} months`,
      label: 'of a mature tree\'s carbon absorption growth.',
      icon: Trees,
      color: 'text-emerald-500 bg-emerald-500/10 dark:bg-emerald-500/20',
      description: 'An average mature pine tree absorbs ~22kg of CO2 annually.',
    },
    {
      id: 'fuel',
      title: 'Gas Not Burned',
      value: `${gasGallons} gal`,
      label: 'of gasoline not consumed in a vehicle.',
      icon: Fuel,
      color: 'text-teal-500 bg-teal-500/10 dark:bg-teal-500/20',
      description: 'Burning 1 gallon of unleaded fuel releases ~8.9kg of CO2.',
    },
    {
      id: 'phones',
      title: 'Device Charges',
      value: phoneCharges.toLocaleString(),
      label: 'smartphone charges prevented.',
      icon: Smartphone,
      color: 'text-indigo-500 bg-indigo-500/10 dark:bg-indigo-500/20',
      description: 'Based on global utility grid carbon intensity coefficients.',
    },
    {
      id: 'car',
      title: 'Road Commutes',
      value: `${carKm.toLocaleString()} km`,
      label: 'of solo highway driving avoided.',
      icon: ShieldCheck,
      color: 'text-amber-500 bg-amber-500/10 dark:bg-amber-500/20',
      description: 'Calculated using average passenger gasoline car emission rates.',
    },
  ];

  const containerVariants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: reducedMotion ? 0 : 0.1,
      },
    },
  } as const;

  const cardVariants = {
    hidden: { opacity: 0, y: reducedMotion ? 0 : 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 260, damping: 25 } },
  } as const;

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 font-mono flex items-center gap-2">
        <span>Impact Translations</span>
        <span className="text-[10px] font-normal font-mono text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-900 px-2 py-0.5 rounded-full border border-slate-200/10">
          Relatable metrics
        </span>
      </h3>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 gap-4"
      >
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.id}
              variants={cardVariants}
              className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between hover:border-emerald-500/30 hover:shadow-md transition-all duration-250 cursor-default"
            >
              <div className="flex justify-between items-start mb-4">
                <div className={`p-2.5 rounded-xl border border-slate-100/50 bg-slate-50/50 ${card.color.split(' ')[0]}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  {card.title}
                </span>
              </div>

              <div>
                <div className="text-3xl font-extrabold text-slate-800 leading-none mb-1.5">
                  {card.value}
                </div>
                <p className="text-xs font-semibold text-slate-700 leading-relaxed">
                  {card.label}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 text-[10px] text-slate-600">
                {card.description}
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
export default StoryCards;
