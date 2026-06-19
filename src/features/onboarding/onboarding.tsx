'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../../stores/useAppStore';
import { UserProfile } from '../../types';
import { Leaf, Car, Home, ChevronRight, ChevronLeft, Check } from 'lucide-react';

interface OnboardingProps {
  onComplete: () => void;
}

export function Onboarding({ onComplete }: OnboardingProps) {
  const saveProfile = useAppStore((state) => state.saveProfile);
  const reducedMotion = useAppStore((state) => state.reducedMotion);
  const [step, setStep] = useState(1);
  const totalSteps = 3;

  // Form State
  const [diet, setDiet] = useState<UserProfile['dietPreference']>('meat-heavy');
  const [transport, setTransport] = useState<UserProfile['transportPreference']>('car');
  const [carType, setCarType] = useState<UserProfile['carType']>('petrol_hatchback');
  const [commutingDays, setCommutingDays] = useState(5);
  const [housing, setHousing] = useState<UserProfile['housingType']>('house');
  const [solar, setSolar] = useState(false);
  const [thermostat, setThermostat] = useState(false);
  const [leds, setLeds] = useState(false);
  const [airCon, setAirCon] = useState<UserProfile['airConUsage']>('medium');

  // Screen Reader Live Region Ref
  const announcerRef = useRef<HTMLDivElement>(null);

  // Announce step change to screen readers
  useEffect(() => {
    if (announcerRef.current) {
      announcerRef.current.textContent = `Step ${step} of ${totalSteps}. ${
        step === 1
          ? 'Dietary Habits'
          : step === 2
          ? 'Transportation and Commuting'
          : 'Home and Energy Setup'
      }`;
    }
  }, [step]);

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrev = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = async () => {
    const profileData: Omit<UserProfile, 'createdAt'> = {
      dietPreference: diet,
      transportPreference: transport,
      commutingDays,
      housingType: housing,
      solarPanels: solar,
      smartThermostat: thermostat,
      ledBulbs: leds,
      airConUsage: airCon,
    };
    if (transport === 'car' || transport === 'carpool') {
      profileData.carType = carType;
    }
    
    await saveProfile(profileData);
    onComplete();
  };

  // Keyboard navigation for step container
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.target instanceof HTMLButtonElement) {
      // Allow natural clicks
    }
  };

  const slideVariants = reducedMotion
    ? ({
        enter: { opacity: 0 },
        center: { opacity: 1 },
        exit: { opacity: 0 },
      } as const)
    : ({
        enter: (dir: number) => ({
          x: dir > 0 ? 100 : -100,
          opacity: 0,
        }),
        center: {
          x: 0,
          opacity: 1,
          transition: { type: 'spring', stiffness: 300, damping: 30 },
        },
        exit: (dir: number) => ({
          x: dir > 0 ? -100 : 100,
          opacity: 0,
          transition: { duration: 0.2 },
        }),
      } as const);

  return (
    <div
      className="relative flex items-center justify-center w-full"
      onKeyDown={handleKeyDown}
    >
      {/* Screen Reader Live Region */}
      <div
        ref={announcerRef}
        className="sr-only"
        aria-live="polite"
        aria-atomic="true"
      ></div>

      <div className="w-full max-w-2xl px-2 py-6 flex flex-col min-h-[480px] justify-between relative">
        {/* Top Progress bar */}
        <div className="mb-6">
          <div className="flex justify-between items-center text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">
            <span className="uppercase tracking-wider">Onboarding Checklist</span>
            <span>Step {step} of {totalSteps}</span>
          </div>
          <div
            className="w-full bg-slate-200 dark:bg-slate-800 h-[3px] rounded-full overflow-hidden"
            role="progressbar"
            aria-valuenow={step}
            aria-valuemin={1}
            aria-valuemax={totalSteps}
            aria-label="Onboarding Progress"
          >
            <div
              className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full transition-all duration-300"
              style={{ width: `${(step / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {/* Step Content with Motion */}
        <div className="flex-grow flex flex-col justify-center">
          <AnimatePresence mode="wait" initial={false}>
            {step === 1 && (
              <motion.div
                key="step1"
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                custom={1}
                className="space-y-6"
              >
                <div className="flex items-center space-x-3 mb-2">
                  <Leaf className="w-8 h-8 text-emerald-500" />
                  <h2 className="text-3xl font-black tracking-tight text-slate-800 dark:text-slate-100">
                    What are your dietary preferences?
                  </h2>
                </div>
                <p className="text-slate-600 dark:text-slate-350 text-sm leading-relaxed">
                  Food accounts for up to 30% of household greenhouse gas emissions. Selecting your diet helps us calibrate your initial baseline.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4" role="radiogroup" aria-label="Dietary choices">
                  {[
                    {
                      id: 'meat-heavy',
                      title: 'Meat Lover',
                      desc: 'Red meat, poultry, and fish play a major role in your daily meals.',
                    },
                    {
                      id: 'vegetarian',
                      title: 'Vegetarian',
                      desc: 'No meat or poultry, but eggs, cheese, and dairy are staples.',
                    },
                    {
                      id: 'vegan',
                      title: 'Vegan',
                      desc: 'Fully plant-based diet. Zero animal products or derivatives.',
                    },
                    {
                      id: 'local-focus',
                      title: 'Local/Seasonal',
                      desc: 'Prioritize locally-sourced ingredients and seasonal foods.',
                    },
                  ].map((option) => (
                    <button
                      key={option.id}
                      onClick={() => setDiet(option.id as UserProfile['dietPreference'])}
                      className={`p-5 rounded-2xl text-left border transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
                        diet === option.id
                          ? 'bg-emerald-500/5 border-emerald-500 dark:bg-emerald-500/10'
                          : 'bg-transparent border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-700'
                      }`}
                      role="radio"
                      aria-checked={diet === option.id}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-semibold text-slate-850 dark:text-slate-100">{option.title}</span>
                        {diet === option.id && <Check className="w-4 h-4 text-emerald-500" />}
                      </div>
                      <span className="text-xs text-slate-500 dark:text-slate-400 leading-normal">{option.desc}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                custom={1}
                className="space-y-6"
              >
                <div className="flex items-center space-x-3 mb-2">
                  <Car className="w-8 h-8 text-emerald-500" />
                  <h2 className="text-3xl font-black tracking-tight text-slate-800 dark:text-slate-100">
                    How do you commute?
                  </h2>
                </div>
                <p className="text-slate-600 dark:text-slate-350 text-sm leading-relaxed">
                  Transportation represents one of the largest personal sources of emissions. Give us the details on your primary transit behavior.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4" role="radiogroup" aria-label="Transit modes">
                  {[
                    { id: 'car', title: 'Drive Alone', desc: 'Commute primarily in your own vehicle.' },
                    { id: 'carpool', title: 'Carpool / Share', desc: 'Commute with family or rideshare.' },
                    { id: 'transit', title: 'Public Transport', desc: 'Rely on subways, buses, or regional trains.' },
                    { id: 'bike', title: 'Cycle / Walk', desc: 'Active commute with zero carbon footprint.' },
                  ].map((option) => (
                    <button
                      key={option.id}
                      onClick={() => setTransport(option.id as UserProfile['transportPreference'])}
                      className={`p-5 rounded-2xl text-left border transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
                        transport === option.id
                          ? 'bg-emerald-500/5 border-emerald-500 dark:bg-emerald-500/10'
                          : 'bg-transparent border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-700'
                      }`}
                      role="radio"
                      aria-checked={transport === option.id}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-semibold text-slate-850 dark:text-slate-100">{option.title}</span>
                        {transport === option.id && <Check className="w-4 h-4 text-emerald-500" />}
                      </div>
                      <span className="text-xs text-slate-500 dark:text-slate-400 leading-normal">{option.desc}</span>
                    </button>
                  ))}
                </div>

                {/* Sub-conditional inputs for vehicle choice */}
                {(transport === 'car' || transport === 'carpool') && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="p-5 bg-slate-100/30 dark:bg-surface rounded-2xl space-y-4 border border-slate-200 dark:border-slate-700"
                  >
                    <div>
                      <label htmlFor="carType" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                        What engine type is your car?
                      </label>
                      <select
                        id="carType"
                        value={carType}
                        onChange={(e) => setCarType(e.target.value as UserProfile['carType'])}
                        className="w-full p-2.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-surface-elevated text-slate-800 dark:text-slate-100 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      >
                        <option value="petrol_hatchback">Petrol Hatchback</option>
                        <option value="petrol_sedan">Petrol Sedan</option>
                        <option value="diesel_sedan">Diesel Sedan</option>
                        <option value="diesel_suv">Diesel SUV</option>
                        <option value="hybrid">Hybrid Vehicle</option>
                        <option value="electric">Electric Vehicle</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="commuteDays" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        How many days do you commute to work? ({commutingDays} days/week)
                      </label>
                      <input
                        id="commuteDays"
                        type="range"
                        min="0"
                        max="7"
                        value={commutingDays}
                        onChange={(e) => setCommutingDays(parseInt(e.target.value))}
                        className="w-full accent-emerald-500"
                        aria-valuemin={0}
                        aria-valuemax={7}
                        aria-valuenow={commutingDays}
                      />
                      <div className="flex justify-between text-[11px] font-mono text-slate-400">
                        <span>0 (Fully Remote)</span>
                        <span>7 Days</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                custom={1}
                className="space-y-6"
              >
                <div className="flex items-center space-x-3 mb-2">
                  <Home className="w-8 h-8 text-emerald-500" />
                  <h2 className="text-3xl font-black tracking-tight text-slate-800 dark:text-slate-100">
                    Home and Energy Setup
                  </h2>
                </div>
                <p className="text-slate-600 dark:text-slate-350 text-sm leading-relaxed">
                  Household energy usage (electricity, cooling, and lighting) heavily shapes your impact footprint. Check what fits.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  {[
                    { id: 'house', title: 'Single House' },
                    { id: 'apartment', title: 'Apartment' },
                    { id: 'shared', title: 'Shared Housing' },
                  ].map((option) => (
                    <button
                      key={option.id}
                      onClick={() => setHousing(option.id as UserProfile['housingType'])}
                      className={`p-4 rounded-xl text-center border font-semibold text-sm transition-all duration-200 ${
                        housing === option.id
                          ? 'bg-emerald-500/5 border-emerald-500 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                          : 'bg-transparent border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-350 dark:hover:border-slate-700'
                      }`}
                    >
                      {option.title}
                    </button>
                  ))}
                </div>

                <div className="space-y-4 bg-slate-100/30 dark:bg-surface p-5 rounded-2xl border border-slate-200 dark:border-slate-700">
                  <div className="flex justify-between items-center">
                    <label htmlFor="ledSwitch" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Do you use energy-efficient LED light bulbs?
                    </label>
                    <button
                      id="ledSwitch"
                      role="switch"
                      aria-checked={leds}
                      onClick={() => setLeds(!leds)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 ${
                        leds ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          leds ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex justify-between items-center">
                    <label htmlFor="solarSwitch" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Does your home have solar panels installed?
                    </label>
                    <button
                      id="solarSwitch"
                      role="switch"
                      aria-checked={solar}
                      onClick={() => setSolar(!solar)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 ${
                        solar ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          solar ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex justify-between items-center">
                    <label htmlFor="thermostatSwitch" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Do you have a smart thermostat?
                    </label>
                    <button
                      id="thermostatSwitch"
                      role="switch"
                      aria-checked={thermostat}
                      onClick={() => setThermostat(!thermostat)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 ${
                        thermostat ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          thermostat ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  <div>
                    <label htmlFor="airCon" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                      Air Conditioning and heating usage intensity
                    </label>
                    <select
                      id="airCon"
                      value={airCon}
                      onChange={(e) => setAirCon(e.target.value as UserProfile['airConUsage'])}
                      className="w-full p-2.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-surface-elevated text-slate-800 dark:text-slate-100 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    >
                      <option value="low">Low (Conservative thermostat, minimal AC)</option>
                      <option value="medium">Medium (Moderate usage)</option>
                      <option value="high">High (Maximum climate control/always on)</option>
                    </select>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer Navigation Buttons */}
        <div className="flex justify-between items-center mt-8 pt-4 border-t border-slate-100 dark:border-slate-700">
          <button
            onClick={handlePrev}
            disabled={step === 1}
            className={`flex items-center px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${
              step === 1
                ? 'opacity-40 cursor-not-allowed text-slate-400'
                : 'text-slate-650 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-850'
            }`}
            aria-label="Previous Step"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back
          </button>

          <button
            onClick={handleNext}
            className="flex items-center px-6 py-2.5 bg-slate-900 hover:bg-slate-800 dark:bg-slate-50 dark:hover:bg-slate-200 text-white dark:text-slate-950 font-semibold rounded-lg shadow-sm hover:shadow transition-all focus:outline-none focus:ring-2 focus:ring-slate-500"
            aria-label={step === totalSteps ? 'Complete onboarding' : 'Next Step'}
          >
            {step === totalSteps ? 'Get Started' : 'Next'}
            {step === totalSteps ? <Check className="w-4 h-4 ml-1" /> : <ChevronRight className="w-4 h-4 ml-1" />}
          </button>
        </div>
      </div>
    </div>
  );
}
export default Onboarding;
