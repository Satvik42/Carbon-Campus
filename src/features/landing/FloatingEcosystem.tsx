'use client';

import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';

/* ─────────────────────────────────────────────
   SVG Illustrations — Minimal, professional,
   inspired by Linear / Notion style.
   ───────────────────────────────────────────── */

function TrainIllustration() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      {/* Rail tracks */}
      <rect x="8" y="32" width="24" height="2" rx="1" fill="currentColor" opacity="0.12" />
      <rect x="12" y="34" width="2" height="3" rx="0.5" fill="currentColor" opacity="0.1" />
      <rect x="26" y="34" width="2" height="3" rx="0.5" fill="currentColor" opacity="0.1" />
      {/* Train body */}
      <rect x="10" y="10" width="20" height="20" rx="4" fill="currentColor" opacity="0.08" />
      <rect x="10" y="10" width="20" height="20" rx="4" stroke="currentColor" strokeWidth="1.5" opacity="0.35" />
      {/* Windshield */}
      <rect x="14" y="14" width="12" height="6" rx="2" fill="currentColor" opacity="0.15" />
      {/* Door */}
      <rect x="17" y="22" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1" opacity="0.25" />
      {/* Front light */}
      <circle cx="20" cy="11" r="1.5" fill="#10b981" opacity="0.7" />
      {/* Speed lines */}
      <line x1="5" y1="18" x2="9" y2="18" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.15" />
      <line x1="3" y1="22" x2="9" y2="22" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.1" />
    </svg>
  );
}

function CarIllustration() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      {/* Road */}
      <rect x="4" y="30" width="32" height="2" rx="1" fill="currentColor" opacity="0.1" />
      {/* Car body */}
      <path d="M8 24 L10 18 Q11 16 13 16 L27 16 Q29 16 30 18 L32 24 L32 28 Q32 29 31 29 L9 29 Q8 29 8 28 Z"
        fill="currentColor" fillOpacity="0.07" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.3" opacity="0.3" />
      {/* Windshield */}
      <path d="M13 17 L15 21 L25 21 L27 17 Z" fill="currentColor" opacity="0.12" />
      {/* Wheels */}
      <circle cx="14" cy="29" r="2.5" fill="currentColor" opacity="0.2" />
      <circle cx="14" cy="29" r="1" fill="currentColor" opacity="0.1" />
      <circle cx="26" cy="29" r="2.5" fill="currentColor" opacity="0.2" />
      <circle cx="26" cy="29" r="1" fill="currentColor" opacity="0.1" />
      {/* People dots (shared ride) */}
      <circle cx="17" cy="19" r="1.2" fill="#10b981" opacity="0.6" />
      <circle cx="23" cy="19" r="1.2" fill="#10b981" opacity="0.6" />
    </svg>
  );
}

function ProduceIllustration() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      {/* Basket */}
      <path d="M10 22 Q9 30 12 32 L28 32 Q31 30 30 22 Z"
        fill="currentColor" fillOpacity="0.07" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.3" opacity="0.3" />
      {/* Basket weave lines */}
      <line x1="14" y1="24" x2="13" y2="30" stroke="currentColor" strokeWidth="0.8" opacity="0.12" />
      <line x1="20" y1="23" x2="20" y2="31" stroke="currentColor" strokeWidth="0.8" opacity="0.12" />
      <line x1="26" y1="24" x2="27" y2="30" stroke="currentColor" strokeWidth="0.8" opacity="0.12" />
      {/* Produce items */}
      <circle cx="16" cy="20" r="3" fill="#10b981" opacity="0.25" />
      <circle cx="22" cy="19" r="2.5" fill="#f59e0b" opacity="0.25" />
      <circle cx="26" cy="21" r="2" fill="#ef4444" opacity="0.2" />
      {/* Leaf */}
      <path d="M16 17 Q18 13 20 15" stroke="#10b981" strokeWidth="1" fill="none" opacity="0.5" />
    </svg>
  );
}

function SolarPanelIllustration() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      {/* Sun rays */}
      <circle cx="30" cy="10" r="3" fill="#f59e0b" opacity="0.2" />
      <line x1="30" y1="5" x2="30" y2="7" stroke="#f59e0b" strokeWidth="1" strokeLinecap="round" opacity="0.3" />
      <line x1="34" y1="10" x2="32.5" y2="10" stroke="#f59e0b" strokeWidth="1" strokeLinecap="round" opacity="0.3" />
      <line x1="33" y1="7" x2="32" y2="8" stroke="#f59e0b" strokeWidth="1" strokeLinecap="round" opacity="0.25" />
      {/* Panel frame */}
      <rect x="6" y="14" width="24" height="16" rx="2" fill="currentColor" fillOpacity="0.06"
        stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.3" opacity="0.3" transform="skewY(-3)" />
      {/* Grid lines */}
      <line x1="14" y1="14" x2="14" y2="30" stroke="currentColor" strokeWidth="0.8" opacity="0.15" />
      <line x1="22" y1="14" x2="22" y2="30" stroke="currentColor" strokeWidth="0.8" opacity="0.15" />
      <line x1="6" y1="20" x2="30" y2="20" stroke="currentColor" strokeWidth="0.8" opacity="0.15" />
      <line x1="6" y1="26" x2="30" y2="26" stroke="currentColor" strokeWidth="0.8" opacity="0.15" />
      {/* Stand */}
      <line x1="18" y1="30" x2="16" y2="36" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.2" />
      <line x1="22" y1="30" x2="24" y2="36" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.2" />
      {/* Reflection highlight */}
      <rect x="8" y="16" width="4" height="3" rx="0.5" fill="#10b981" opacity="0.12" />
    </svg>
  );
}

function TreeIllustration() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      {/* Ground */}
      <ellipse cx="20" cy="36" rx="8" ry="1.5" fill="currentColor" opacity="0.08" />
      {/* Trunk */}
      <rect x="18" y="26" width="4" height="10" rx="1" fill="currentColor" opacity="0.2" />
      {/* Canopy layers */}
      <ellipse cx="20" cy="20" rx="10" ry="9" fill="#10b981" opacity="0.12" />
      <ellipse cx="20" cy="18" rx="8" ry="7" fill="#10b981" opacity="0.1" />
      <ellipse cx="20" cy="16" rx="5" ry="5" fill="#10b981" opacity="0.08" />
      {/* Outline */}
      <ellipse cx="20" cy="20" rx="10" ry="9" stroke="#10b981" strokeWidth="1" opacity="0.3" fill="none" />
      {/* Small leaf detail */}
      <circle cx="15" cy="18" r="1" fill="#10b981" opacity="0.3" />
      <circle cx="24" cy="16" r="1.2" fill="#10b981" opacity="0.25" />
    </svg>
  );
}

function LightbulbIllustration() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      {/* Glow effect */}
      <circle cx="20" cy="16" r="12" fill="#f59e0b" opacity="0.04" />
      {/* Bulb */}
      <path d="M14 18 Q14 8 20 8 Q26 8 26 18 Q26 22 24 24 L16 24 Q14 22 14 18 Z"
        fill="currentColor" fillOpacity="0.06" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.3" opacity="0.3" />
      {/* Filament / LED lines */}
      <path d="M17 16 Q20 12 23 16" stroke="#f59e0b" strokeWidth="1" fill="none" opacity="0.4" />
      <path d="M18 19 Q20 16 22 19" stroke="#f59e0b" strokeWidth="0.8" fill="none" opacity="0.3" />
      {/* Base */}
      <rect x="16" y="24" width="8" height="3" rx="1" fill="currentColor" opacity="0.15" />
      <rect x="17" y="27" width="6" height="2" rx="1" fill="currentColor" opacity="0.1" />
      <rect x="18" y="29" width="4" height="1.5" rx="0.75" fill="currentColor" opacity="0.08" />
      {/* Light rays */}
      <line x1="20" y1="3" x2="20" y2="6" stroke="#f59e0b" strokeWidth="1" strokeLinecap="round" opacity="0.2" />
      <line x1="28" y1="8" x2="26" y2="9.5" stroke="#f59e0b" strokeWidth="1" strokeLinecap="round" opacity="0.15" />
      <line x1="12" y1="8" x2="14" y2="9.5" stroke="#f59e0b" strokeWidth="1" strokeLinecap="round" opacity="0.15" />
    </svg>
  );
}

/* ─────────────────────────────────────────────
   Card Data
   ───────────────────────────────────────────── */

interface FloatingCardData {
  id: string;
  title: string;
  subtitle: string;
  insight: string;
  icon: React.ComponentType;
  /** Position in % */
  x: string;
  y: string;
  /** Animation config — staggered to prevent sync */
  floatDuration: number;
  floatDelay: number;
  floatAmplitudeY: number;
  floatAmplitudeX: number;
  rotation: number;
}

/*
  Card positions map — safe zones that avoid the two content blocks:
  ┌─────────────────────────────────────────────┐
  │ [Public Transport]    gap   [Carpooling]    │
  │                                             │
  │   ┌─ Left text ──┐  ┌── Sim card ─────┐    │
  │   │ Headline      │  │                 │    │
  │   │ Subtitle      │  │  Decision Sim   │    │
  │   │ CTA button    │  │                 │    │
  │   └───────────────┘  └─────────────────┘    │
  │ [Local Food]                  [Solar Energy] │
  │       [Efficient Energy] [Tree Restoration]  │
  └─────────────────────────────────────────────┘
*/
const floatingCards: FloatingCardData[] = [
  {
    id: 'public-transport',
    title: 'Public Transport',
    subtitle: 'Lower Daily Emissions',
    insight: 'Efficient Daily Commute',
    icon: TrainIllustration,
    x: '2%',
    y: '2%',
    floatDuration: 10,
    floatDelay: 0,
    floatAmplitudeY: 8,
    floatAmplitudeX: 3,
    rotation: 1,
  },
  {
    id: 'carpooling',
    title: 'Carpooling',
    subtitle: 'Shared Impact',
    insight: 'Reduce Individual Footprint',
    icon: CarIllustration,
    x: '84%',
    y: '2%',
    floatDuration: 11,
    floatDelay: 1.5,
    floatAmplitudeY: 7,
    floatAmplitudeX: 4,
    rotation: 0.8,
  },
  {
    id: 'local-food',
    title: 'Local Food',
    subtitle: 'Reduced Transport Impact',
    insight: 'Support Sustainable Consumption',
    icon: ProduceIllustration,
    x: '46%',
    y: '3%',
    floatDuration: 9,
    floatDelay: 2.2,
    floatAmplitudeY: 7,
    floatAmplitudeX: 3,
    rotation: 1.2,
  },
  {
    id: 'solar-energy',
    title: 'Solar Energy',
    subtitle: 'Clean Energy',
    insight: 'Long-Term Savings',
    icon: SolarPanelIllustration,
    x: '84%',
    y: '78%',
    floatDuration: 12,
    floatDelay: 0.8,
    floatAmplitudeY: 6,
    floatAmplitudeX: 3,
    rotation: 0.6,
  },
  {
    id: 'tree-growth',
    title: 'Tree Restoration',
    subtitle: 'Natural Carbon Capture',
    insight: 'Offset Your Footprint',
    icon: TreeIllustration,
    x: '48%',
    y: '80%',
    floatDuration: 10.5,
    floatDelay: 3,
    floatAmplitudeY: 6,
    floatAmplitudeX: 3,
    rotation: 0.9,
  },
  {
    id: 'energy-efficiency',
    title: 'Efficient Energy',
    subtitle: 'Lower Consumption',
    insight: 'Smart Energy Choices',
    icon: LightbulbIllustration,
    x: '2%',
    y: '80%',
    floatDuration: 8.5,
    floatDelay: 1.8,
    floatAmplitudeY: 6,
    floatAmplitudeX: 3,
    rotation: 1.1,
  },
];


/* ─────────────────────────────────────────────
   Single Floating Card
   ───────────────────────────────────────────── */

interface FloatingCardProps {
  card: FloatingCardData;
  reducedMotion: boolean;
  constraintRef: React.RefObject<HTMLDivElement | null>;
}

function FloatingCard({ card, reducedMotion, constraintRef }: FloatingCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const IconComponent = card.icon;

  return (
    <motion.div
      style={{ left: card.x, top: card.y }}
      animate={(!reducedMotion && !isDragging) ? {
        y: [0, -card.floatAmplitudeY, 0, card.floatAmplitudeY * 0.3, 0],
        x: [0, card.floatAmplitudeX, 0, -card.floatAmplitudeX * 0.5, 0],
        rotate: [0, card.rotation, 0, -card.rotation, 0],
      } : {}}
      transition={(!reducedMotion && !isDragging) ? {
        duration: card.floatDuration,
        repeat: Infinity,
        ease: 'easeInOut',
        delay: card.floatDelay,
      } : {}}
      className="absolute hidden lg:block z-0"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => { setIsHovered(false); setIsDragging(false); }}
    >
      <motion.div
        drag
        dragConstraints={constraintRef}
        dragElastic={0.35}
        dragMomentum={true}
        dragTransition={{ bounceStiffness: 200, bounceDamping: 10 }}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={() => setIsDragging(false)}
        whileDrag={{ scale: 1.08, cursor: 'grabbing' }}
        animate={isHovered && !isDragging ? {
          scale: 1.05,
          y: -8,
        } : {
          scale: 1,
          y: 0,
        }}
        transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="floating-eco-card group cursor-grab active:cursor-grabbing"
        role="presentation"
        aria-hidden="true"
      >
        {/* Card content */}
        <div className="floating-eco-card-inner">
          {/* Icon area */}
          <div className="floating-eco-icon">
            <IconComponent />
          </div>

          {/* Text content */}
          <div className="floating-eco-text">
            <div className="floating-eco-title">{card.title}</div>
            <div className="floating-eco-subtitle">{card.subtitle}</div>
          </div>

          {/* Hover insight reveal */}
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={isHovered && !isDragging ? { opacity: 1, height: 'auto' } : { opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="floating-eco-insight"
          >
            <span>{card.insight}</span>
          </motion.div>
        </div>

        {/* Hover glow border */}
        <motion.div
          className="floating-eco-glow"
          animate={isHovered ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.25 }}
        />
      </motion.div>
    </motion.div>
  );
}


/* ─────────────────────────────────────────────
   Background Atmosphere (Layer 1)
   ───────────────────────────────────────────── */

function AtmosphereLayer({ reducedMotion }: { reducedMotion: boolean }) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0" aria-hidden="true">
      {/* Soft gradient orbs */}
      <motion.div
        className="atmosphere-orb atmosphere-orb--emerald"
        animate={reducedMotion ? {} : {
          x: [0, 30, 0],
          y: [0, -20, 0],
          scale: [1, 1.1, 1],
        }}
        transition={reducedMotion ? {} : {
          duration: 20,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        className="atmosphere-orb atmosphere-orb--teal"
        animate={reducedMotion ? {} : {
          x: [0, -25, 0],
          y: [0, 15, 0],
          scale: [1, 1.05, 1],
        }}
        transition={reducedMotion ? {} : {
          duration: 25,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 5,
        }}
      />
      <motion.div
        className="atmosphere-orb atmosphere-orb--amber"
        animate={reducedMotion ? {} : {
          x: [0, 15, 0],
          y: [0, 25, 0],
          scale: [1, 1.08, 1],
        }}
        transition={reducedMotion ? {} : {
          duration: 22,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 8,
        }}
      />
    </div>
  );
}


/* ─────────────────────────────────────────────
   Carbon Particles (Hero enhancement)
   Subtle particles near the simulation card
   ───────────────────────────────────────────── */

function CarbonParticles({ reducedMotion }: { reducedMotion: boolean }) {
  if (reducedMotion) return null;

  const particles = [
    { x: '85%', y: '30%', size: 3, duration: 6, delay: 0 },
    { x: '90%', y: '50%', size: 2, duration: 8, delay: 1 },
    { x: '82%', y: '65%', size: 2.5, duration: 7, delay: 2 },
    { x: '95%', y: '40%', size: 2, duration: 9, delay: 3 },
    { x: '78%', y: '45%', size: 1.5, duration: 7.5, delay: 1.5 },
  ];

  return (
    <div className="absolute inset-0 pointer-events-none z-[1] hidden lg:block" aria-hidden="true">
      {particles.map((p, i) => (
        <motion.div
          key={i}
          className="carbon-particle"
          style={{
            left: p.x,
            top: p.y,
            width: p.size,
            height: p.size,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.3, 0.6, 0.3],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: p.delay,
          }}
        />
      ))}
    </div>
  );
}


/* ─────────────────────────────────────────────
   Main Export — Floating Ecosystem
   ───────────────────────────────────────────── */

interface FloatingEcosystemProps {
  reducedMotion: boolean;
  /** Ref to the parent container — used as drag boundary */
  constraintRef: React.RefObject<HTMLDivElement | null>;
}

export function FloatingEcosystem({ reducedMotion, constraintRef }: FloatingEcosystemProps) {
  return (
    <>
      {/* Layer 1: Atmospheric background */}
      <AtmosphereLayer reducedMotion={reducedMotion} />

      {/* Layer 2: Floating sustainability cards */}
      {floatingCards.map((card) => (
        <FloatingCard key={card.id} card={card} reducedMotion={reducedMotion} constraintRef={constraintRef} />
      ))}

      {/* Carbon particles near hero area */}
      <CarbonParticles reducedMotion={reducedMotion} />
    </>
  );
}
