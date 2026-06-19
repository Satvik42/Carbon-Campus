'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useAppStore } from '../../stores/useAppStore';
import { calculateTotalFootprint, calculateCommuteEmissions, EMISSION_FACTORS } from '../footprint/calculations';
import { StoryCards } from '../insights/story-cards';
import { Car, Zap, Utensils, Plane, ShoppingBag, RotateCcw, HelpCircle } from 'lucide-react';

const kmToMiles = (km: number): number => {
  if (km <= 100) return km;
  return 100 + ((km - 100) * 200) / 400;
};

const milesToKm = (miles: number): number => {
  if (miles <= 100) return miles;
  return 100 + ((miles - 100) * 400) / 200;
};

// Custom hook that exposes snapshot data for use in parent (Carbon Snapshot bar)
export function useSimulatorData() {
  const profile = useAppStore((state) => state.profile);

  const baselineInputs = useMemo(() => {
    if (profile) {
      return {
        milesPerWeek: kmToMiles(profile.commutingDays * 20 || 80),
        transportMode: profile.transportPreference,
        carType: profile.carType || 'gas',
        solarPercent: profile.solarPanels ? 100 : 0,
        smartThermostat: profile.smartThermostat,
        ledBulbs: profile.ledBulbs,
        bulbCount: 25,
        airConUsage: profile.airConUsage,
        diet: profile.dietPreference,
        foodWasteReduction: 0,
        flightHours: 12,
        useTrainAlternative: false,
        clothingItems: 15,
        secondHandPercent: 10,
      };
    }
    return {
      milesPerWeek: kmToMiles(100),
      transportMode: 'car' as const,
      carType: 'gas' as const,
      solarPercent: 0,
      smartThermostat: false,
      ledBulbs: false,
      bulbCount: 25,
      airConUsage: 'medium' as const,
      diet: 'meat-heavy' as const,
      foodWasteReduction: 0,
      flightHours: 12,
      useTrainAlternative: false,
      clothingItems: 15,
      secondHandPercent: 10,
    };
  }, [profile]);

  const baselineFootprint = useMemo(() => {
    return calculateTotalFootprint(baselineInputs);
  }, [baselineInputs]);

  return { baselineFootprint, baselineInputs };
}

export function WhatIfSimulator() {
  const profile = useAppStore((state) => state.profile);
  const isDbLoaded = useAppStore((state) => state.isDbLoaded);

  // --- Initial Calibration State ---
  // Default values based on profile or standard US baseline
  const [travelDistance, setTravelDistance] = useState(100);
  const [transportMode, setTransportMode] = useState<'car' | 'carpool' | 'transit' | 'bike' | 'walk'>('car');
  const [carType, setCarType] = useState<
    | 'gas'
    | 'petrol_hatchback'
    | 'petrol_sedan'
    | 'diesel_sedan'
    | 'diesel_suv'
    | 'hybrid'
    | 'electric'
  >('petrol_sedan');
  const [solarPercent, setSolarPercent] = useState(0);
  const [smartThermostat, setSmartThermostat] = useState(false);
  const [ledBulbs, setLedBulbs] = useState(false);
  const [bulbCount, setBulbCount] = useState(25);
  const [airConUsage, setAirConUsage] = useState<'low' | 'medium' | 'high'>('medium');
  const [diet, setDiet] = useState<'meat-heavy' | 'vegetarian' | 'vegan' | 'local-focus'>('meat-heavy');
  const [foodWasteReduction, setFoodWasteReduction] = useState(0);
  const [flightHours, setFlightHours] = useState(12);
  const [useTrainAlternative, setUseTrainAlternative] = useState(false);
  const [clothingItems, setClothingItems] = useState(15);
  const [secondHandPercent, setSecondHandPercent] = useState(10);

  // Sync state with user profile once loaded
  useEffect(() => {
    if (profile) {
      setDiet(profile.dietPreference);
      setTransportMode(profile.transportPreference);
      if (profile.carType) {
        setCarType(profile.carType);
      }
      setTravelDistance(profile.commutingDays * 20 || 80); // Estimate based on commuting days (treated as km)
      setSolarPercent(profile.solarPanels ? 100 : 0);
      setSmartThermostat(profile.smartThermostat);
      setLedBulbs(profile.ledBulbs);
      setAirConUsage(profile.airConUsage);
    }
  }, [profile]);

  // --- Baseline Footprint (Frozen snapshot of the original profile answers) ---
  const baselineInputs = useMemo(() => {
    if (profile) {
      return {
        milesPerWeek: kmToMiles(profile.commutingDays * 20 || 80),
        transportMode: profile.transportPreference,
        carType: profile.carType || 'gas',
        solarPercent: profile.solarPanels ? 100 : 0,
        smartThermostat: profile.smartThermostat,
        ledBulbs: profile.ledBulbs,
        bulbCount: 25,
        airConUsage: profile.airConUsage,
        diet: profile.dietPreference,
        foodWasteReduction: 0,
        flightHours: 12,
        useTrainAlternative: false,
        clothingItems: 15,
        secondHandPercent: 10,
      };
    }
    // General fallback baseline
    return {
      milesPerWeek: kmToMiles(100),
      transportMode: 'car' as const,
      carType: 'gas' as const,
      solarPercent: 0,
      smartThermostat: false,
      ledBulbs: false,
      bulbCount: 25,
      airConUsage: 'medium' as const,
      diet: 'meat-heavy' as const,
      foodWasteReduction: 0,
      flightHours: 12,
      useTrainAlternative: false,
      clothingItems: 15,
      secondHandPercent: 10,
    };
  }, [profile]);

  const baselineFootprint = useMemo(() => {
    return calculateTotalFootprint(baselineInputs);
  }, [baselineInputs]);

  // --- Simulated Footprint (Reactive state) ---
  const simulatedFootprint = useMemo(() => {
    return calculateTotalFootprint({
      milesPerWeek: kmToMiles(travelDistance),
      transportMode,
      carType,
      solarPercent,
      smartThermostat,
      ledBulbs,
      bulbCount,
      airConUsage,
      diet,
      foodWasteReduction,
      flightHours,
      useTrainAlternative,
      clothingItems,
      secondHandPercent,
    });
  }, [
    travelDistance,
    transportMode,
    carType,
    solarPercent,
    smartThermostat,
    ledBulbs,
    bulbCount,
    airConUsage,
    diet,
    foodWasteReduction,
    flightHours,
    useTrainAlternative,
    clothingItems,
    secondHandPercent,
  ]);

  // Savings
  const annualSavings = Math.max(0, baselineFootprint.total - simulatedFootprint.total);
  const monthlySavings = Math.round(annualSavings / 12);

  // Reset to original profile
  const resetToProfile = () => {
    setDiet(baselineInputs.diet);
    setTransportMode(baselineInputs.transportMode);
    setCarType(baselineInputs.carType as any);
    setTravelDistance(milesToKm(baselineInputs.milesPerWeek));
    setSolarPercent(baselineInputs.solarPercent);
    setSmartThermostat(baselineInputs.smartThermostat);
    setLedBulbs(baselineInputs.ledBulbs);
    setBulbCount(baselineInputs.bulbCount);
    setAirConUsage(baselineInputs.airConUsage);
    setFoodWasteReduction(baselineInputs.foodWasteReduction);
    setFlightHours(baselineInputs.flightHours);
    setUseTrainAlternative(baselineInputs.useTrainAlternative);
    setClothingItems(baselineInputs.clothingItems);
    setSecondHandPercent(baselineInputs.secondHandPercent);
  };

  // Section configuration for the tabs
  const [activeSection, setActiveSection] = useState<'transport' | 'energy' | 'food' | 'travel' | 'shopping'>('transport');

  if (!isDbLoaded) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500" />
      </div>
    );
  }

  return (
    <section className="space-y-6" aria-label="Carbon footprint calculator and simulator">

      {/* Simulator Controls */}
      <div className="space-y-5">
        <div className="flex justify-between items-center pb-3 border-b border-slate-200/60">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono">Decision Simulator</h3>
          <button
            onClick={resetToProfile}
            className="flex items-center text-xs font-semibold text-slate-600 hover:text-emerald-600 transition-colors cursor-pointer"
            aria-label="Reset simulation to profile values"
          >
            <RotateCcw className="w-3.5 h-3.5 mr-1" />
            Reset values
          </button>
        </div>

        {/* Section Tabs */}
        <div className="flex flex-wrap bg-slate-100/60 p-1 rounded-xl gap-1" role="tablist" aria-label="Simulator sections">
          {[
            { id: 'transport', label: 'Commute', icon: Car },
            { id: 'energy', label: 'Energy', icon: Zap },
            { id: 'food', label: 'Diet', icon: Utensils },
            { id: 'travel', label: 'Flights', icon: Plane },
            { id: 'shopping', label: 'Shopping', icon: ShoppingBag },
          ].map((section) => {
            const Icon = section.icon;
            const isSelected = activeSection === section.id;
            return (
              <button
                key={section.id}
                role="tab"
                aria-selected={isSelected}
                onClick={() => setActiveSection(section.id as any)}
                className={`flex-grow sm:flex-1 flex items-center justify-center space-x-1.5 px-3.5 py-2 text-xs font-bold rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500/20 cursor-pointer ${
                  isSelected
                    ? 'bg-white text-slate-850 shadow-sm border border-slate-200/80'
                    : 'text-slate-500 hover:text-slate-850'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{section.label}</span>
              </button>
            );
          })}
        </div>

        {/* Section Inputs */}
        <div className="mt-2">
          
          {/* TRANSPORTATION SIMULATION */}
          {activeSection === 'transport' && (
            <div className="space-y-6 animate-fade-in">
              <div className="space-y-2">
                <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-slate-400 block pl-0.5">Transport Mode</span>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {[
                    { id: 'car', label: 'Petrol Car' },
                    { id: 'carpool', label: 'Carpool' },
                    { id: 'transit', label: 'Public Transport' },
                    { id: 'bike', label: 'Bicycle' },
                    { id: 'walk', label: 'Walk' },
                  ].map((mode) => {
                    const isActive = transportMode === mode.id;
                    return (
                      <button
                        key={mode.id}
                        onClick={() => setTransportMode(mode.id as any)}
                        className={`p-2.5 rounded-xl border text-xs font-bold transition-all duration-200 cursor-pointer focus:outline-none ${
                          isActive
                            ? 'bg-emerald-500/5 border-emerald-500 text-emerald-700 shadow-sm'
                            : 'bg-white border-slate-200/80 text-slate-600 hover:border-slate-300 hover:text-slate-800'
                        }`}
                      >
                        {mode.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {(transportMode === 'car' || transportMode === 'carpool') && (
                <div className="space-y-4 p-5 bg-white rounded-2xl border border-slate-200/80 shadow-sm animate-fade-in">
                  <span className="text-[9px] uppercase font-mono font-bold tracking-wider text-slate-400 block">Vehicle Performance</span>
                  <div>
                    <label htmlFor="simCarType" className="block text-xs font-semibold text-slate-600 mb-2">
                      Fuel efficiency type
                    </label>
                    <select
                      id="simCarType"
                      value={carType}
                      onChange={(e) => setCarType(e.target.value as any)}
                      className="w-full p-2.5 border border-slate-200 rounded-xl bg-white text-slate-800 text-sm font-medium focus:ring-2 focus:ring-emerald-500/15 focus:border-emerald-500 focus:outline-none transition-all shadow-sm hover:border-slate-300"
                    >
                      <option value="petrol_hatchback">Petrol Hatchback</option>
                      <option value="petrol_sedan">Petrol Sedan</option>
                      <option value="diesel_sedan">Diesel Sedan</option>
                      <option value="diesel_suv">Diesel SUV</option>
                      <option value="hybrid">Hybrid Vehicle</option>
                      <option value="electric">Electric Vehicle</option>
                    </select>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm font-semibold text-slate-700">
                  <label htmlFor="simMiles">Weekly Travel Distance</label>
                  <span className="text-emerald-600 font-bold">{travelDistance} km</span>
                </div>
                <input
                  id="simMiles"
                  type="range"
                  min="0"
                  max="500"
                  step="10"
                  value={travelDistance}
                  onChange={(e) => setTravelDistance(parseInt(e.target.value))}
                  className="w-full accent-emerald-500"
                  aria-valuemin={0}
                  aria-valuemax={500}
                  aria-valuenow={travelDistance}
                />
                <div className="flex justify-between text-[10px] font-mono text-slate-400 pl-0.5 pr-0.5">
                  <span>0 km (Work from Home)</span>
                  <span>500 km (Heavy commuter)</span>
                </div>
              </div>
            </div>
          )}

          {/* ENERGY SIMULATION */}
          {activeSection === 'energy' && (
            <div className="space-y-6 animate-fade-in">
              <div className="space-y-4 p-5 bg-white rounded-2xl border border-slate-200/80 shadow-sm">
                <div className="flex justify-between items-center">
                  <label htmlFor="simLedSwitch" className="text-sm font-semibold text-slate-700">
                    Use energy-efficient LEDs?
                  </label>
                  <button
                    id="simLedSwitch"
                    role="switch"
                    aria-checked={ledBulbs}
                    onClick={() => setLedBulbs(!ledBulbs)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500/20 ${
                      ledBulbs ? 'bg-emerald-500' : 'bg-slate-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        ledBulbs ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                {ledBulbs && (
                  <div className="space-y-2 pt-3 border-t border-slate-100">
                    <div className="flex justify-between items-center text-xs font-semibold text-slate-600">
                      <label htmlFor="simBulbCount">Number of switched bulbs</label>
                      <span className="text-emerald-600 font-bold">{bulbCount} bulbs</span>
                    </div>
                    <input
                      id="simBulbCount"
                      type="range"
                      min="1"
                      max="50"
                      value={bulbCount}
                      onChange={(e) => setBulbCount(parseInt(e.target.value))}
                      className="w-full accent-emerald-500"
                      aria-valuemin={1}
                      aria-valuemax={50}
                      aria-valuenow={bulbCount}
                    />
                  </div>
                )}

                <div className="flex justify-between items-center pt-3 border-t border-slate-100">
                  <label htmlFor="simThermostat" className="text-sm font-semibold text-slate-700">
                    Smart thermostat activated (Saves 10%)
                  </label>
                  <button
                    id="simThermostat"
                    role="switch"
                    aria-checked={smartThermostat}
                    onClick={() => setSmartThermostat(!smartThermostat)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500/20 ${
                      smartThermostat ? 'bg-emerald-500' : 'bg-slate-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        smartThermostat ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="pt-3 border-t border-slate-100">
                  <label htmlFor="simAirCon" className="block text-xs font-semibold text-slate-600 mb-2">
                    HVAC temperature preference
                  </label>
                  <select
                    id="simAirCon"
                    value={airConUsage}
                    onChange={(e) => setAirConUsage(e.target.value as any)}
                    className="w-full p-2.5 border border-slate-200 rounded-xl bg-white text-slate-800 text-sm font-medium focus:ring-2 focus:ring-emerald-500/15 focus:border-emerald-500 focus:outline-none transition-all shadow-sm hover:border-slate-300"
                  >
                    <option value="low">Eco-friendly (Minimize AC & Heating)</option>
                    <option value="medium">Standard comfort levels</option>
                    <option value="high">Heavy usage (Continuous climate control)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm font-semibold text-slate-700">
                  <label htmlFor="simSolar">Solar panels energy offset</label>
                  <span className="text-emerald-600 font-bold">{solarPercent}% solar offset</span>
                </div>
                <input
                  id="simSolar"
                  type="range"
                  min="0"
                  max="100"
                  step="10"
                  value={solarPercent}
                  onChange={(e) => setSolarPercent(parseInt(e.target.value))}
                  className="w-full accent-emerald-500"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={solarPercent}
                />
                <div className="flex justify-between text-[10px] font-mono text-slate-400 pl-0.5 pr-0.5">
                  <span>0% (Grid energy only)</span>
                  <span>100% (Fully offset by panels)</span>
                </div>
              </div>
            </div>
          )}

          {/* DIET SIMULATION */}
          {activeSection === 'food' && (
            <div className="space-y-6 animate-fade-in">
              <div className="space-y-2">
                <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-slate-400 block pl-0.5">Dietary Choice</span>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'meat-heavy', label: 'Meat Lover' },
                    { id: 'vegetarian', label: 'Vegetarian' },
                    { id: 'vegan', label: 'Vegan' },
                    { id: 'local-focus', label: 'Local Focus' },
                  ].map((mode) => {
                    const isActive = diet === mode.id;
                    return (
                      <button
                        key={mode.id}
                        onClick={() => setDiet(mode.id as any)}
                        className={`p-3 rounded-xl border text-xs font-bold transition-all duration-200 cursor-pointer focus:outline-none ${
                          isActive
                            ? 'bg-emerald-500/5 border-emerald-500 text-emerald-700 shadow-sm'
                            : 'bg-white border-slate-200/80 text-slate-600 hover:border-slate-300 hover:text-slate-800'
                        }`}
                      >
                        {mode.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm font-semibold text-slate-700">
                  <label htmlFor="simFoodWaste">Weekly food waste reduction</label>
                  <span className="text-emerald-600 font-bold">{foodWasteReduction}% reduction</span>
                </div>
                <input
                  id="simFoodWaste"
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={foodWasteReduction}
                  onChange={(e) => setFoodWasteReduction(parseInt(e.target.value))}
                  className="w-full accent-emerald-500"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={foodWasteReduction}
                />
                <div className="flex justify-between text-[10px] font-mono text-slate-400 pl-0.5 pr-0.5">
                  <span>0% (Standard waste)</span>
                  <span>100% (Zero waste target)</span>
                </div>
              </div>
            </div>
          )}

          {/* TRAVEL SIMULATION */}
          {activeSection === 'travel' && (
            <div className="space-y-6 animate-fade-in">
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm font-semibold text-slate-700">
                  <label htmlFor="simFlights">Annual flight hours</label>
                  <span className="text-emerald-600 font-bold">{flightHours} hours/year</span>
                </div>
                <input
                  id="simFlights"
                  type="range"
                  min="0"
                  max="100"
                  step="2"
                  value={flightHours}
                  onChange={(e) => setFlightHours(parseInt(e.target.value))}
                  className="w-full accent-emerald-500"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={flightHours}
                />
                <div className="flex justify-between text-[10px] font-mono text-slate-400 pl-0.5 pr-0.5">
                  <span>0 hours (No flights)</span>
                  <span>100 hours (Frequent flyer)</span>
                </div>
              </div>

              <div className="flex justify-between items-center p-5 bg-white border border-slate-200/80 rounded-2xl shadow-sm">
                <label htmlFor="simTrain" className="text-sm font-semibold text-slate-700">
                  Swap high-speed rail for flights where possible?
                </label>
                <button
                  id="simTrain"
                  role="switch"
                  aria-checked={useTrainAlternative}
                  onClick={() => setUseTrainAlternative(!useTrainAlternative)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500/20 ${
                    useTrainAlternative ? 'bg-emerald-500' : 'bg-slate-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      useTrainAlternative ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          )}

          {/* SHOPPING SIMULATION */}
          {activeSection === 'shopping' && (
            <div className="space-y-6 animate-fade-in">
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm font-semibold text-slate-700">
                  <label htmlFor="simClothing">Annual apparel items purchased</label>
                  <span className="text-emerald-600 font-bold">{clothingItems} items/year</span>
                </div>
                <input
                  id="simClothing"
                  type="range"
                  min="0"
                  max="50"
                  value={clothingItems}
                  onChange={(e) => setClothingItems(parseInt(e.target.value))}
                  className="w-full accent-emerald-500"
                  aria-valuemin={0}
                  aria-valuemax={50}
                  aria-valuenow={clothingItems}
                />
                <div className="flex justify-between text-[10px] font-mono text-slate-400 pl-0.5 pr-0.5">
                  <span>0 items (Minimalist)</span>
                  <span>50 items (Fast Fashion fan)</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm font-semibold text-slate-700">
                  <label htmlFor="simSecondHand">Second-hand or repaired ratio</label>
                  <span className="text-emerald-600 font-bold">{secondHandPercent}% second-hand</span>
                </div>
                <input
                  id="simSecondHand"
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={secondHandPercent}
                  onChange={(e) => setSecondHandPercent(parseInt(e.target.value))}
                  className="w-full accent-emerald-500"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={secondHandPercent}
                />
                <div className="flex justify-between text-[10px] font-mono text-slate-400 pl-0.5 pr-0.5">
                  <span>0% (All brand new items)</span>
                  <span>100% (All thrifted/repaired)</span>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Footprint Comparison Panel */}
      <div className="space-y-5">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono border-b border-slate-200/60 pb-3 flex items-center justify-between pl-0.5">
          <span>Footprint Comparison</span>
          <span className="text-[10px] font-mono text-slate-450">kg CO₂ / year</span>
        </h3>

        <div className="space-y-4">
          
          {/* Baseline Footprint Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold text-slate-650">
              <span>Profile Baseline Footprint</span>
              <span className="font-bold text-slate-700">{baselineFootprint.total.toLocaleString()} kg</span>
            </div>
            <div className="w-full bg-slate-100 border border-slate-200/40 h-3.5 rounded-lg overflow-hidden relative shadow-inner">
              <div className="bg-slate-400 h-full rounded-lg" style={{ width: '100%' }} />
            </div>
          </div>

          {/* Simulated Footprint Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold text-slate-655">
              <span>Simulated Current Choices</span>
              <span className="font-bold text-emerald-600">{simulatedFootprint.total.toLocaleString()} kg</span>
            </div>
            <div className="w-full bg-slate-100 border border-slate-200/40 h-3.5 rounded-lg overflow-hidden relative shadow-inner">
              <div
                className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full transition-all duration-300 rounded-lg"
                style={{
                  width: `${Math.min(100, Math.max(8, (simulatedFootprint.total / (baselineFootprint.total || 1)) * 100))}%`
                }}
              />
            </div>
          </div>

        </div>

        {/* Footprint Breakdown */}
        <div className="p-5 bg-white border border-slate-200/80 rounded-2xl shadow-sm space-y-3.5 animate-fade-in">
          <span className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-wider block">Simulated Emission Breakdown</span>
          {[
            { label: 'Commuting & Transport', current: simulatedFootprint.transport, base: baselineFootprint.transport, color: 'bg-indigo-500' },
            { label: 'Household Energy', current: simulatedFootprint.energy, base: baselineFootprint.energy, color: 'bg-amber-500' },
            { label: 'Diet & Food Waste', current: simulatedFootprint.food, base: baselineFootprint.food, color: 'bg-emerald-500' },
            { label: 'Flights & Travel', current: simulatedFootprint.travel, base: baselineFootprint.travel, color: 'bg-teal-500' },
            { label: 'Shopping & Gear', current: simulatedFootprint.shopping, base: baselineFootprint.shopping, color: 'bg-pink-500' },
          ].map((item, idx) => (
            <div key={idx} className="flex justify-between items-center text-xs font-semibold text-slate-600">
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${item.color}`} />
                <span>{item.label}</span>
              </div>
              <div className="font-mono text-xs">
                <span className="text-slate-700 font-bold">{item.current} kg</span>
                {item.current < item.base && (
                  <span className="text-emerald-600 font-bold ml-1.5">(-{item.base - item.current} kg)</span>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="text-[10px] text-slate-500 leading-relaxed flex items-start gap-1.5 pl-0.5">
          <HelpCircle className="w-3.5 h-3.5 mt-0.5 shrink-0 text-slate-400" />
          <span>
            All formulas utilize standardized CO2 coefficients mapping grid electric, passenger automotive, aviation, and crop factors according to recent EPA and Defra standards.
          </span>
        </div>
      </div>

      {/* Story Cards displayed underneath the simulator results */}
      {annualSavings > 0 ? (
        <StoryCards co2SavedKg={annualSavings} />
      ) : (
        <div className="bg-white p-6 rounded-2xl text-center border border-dashed border-slate-200/80 shadow-sm">
          <p className="text-xs text-slate-500 font-semibold leading-relaxed">
            Move sliders to lower your simulated footprint and unlock impact story translations!
          </p>
        </div>
      )}
    </section>
  );
}
export default WhatIfSimulator;
