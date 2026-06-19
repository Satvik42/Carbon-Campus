/**
 * Carbon Compass Footprint Calculation Engine
 * Values and coefficients are based on EPA (Environmental Protection Agency)
 * and Defra (UK Department for Environment, Food & Rural Affairs) standards.
 */

// Core Constants (CO2 emissions in kg)
export const EMISSION_FACTORS = {
  // Transport: kg CO2 per mile
  transport: {
    gasCar: 0.404,
    hybrid: 0.170,
    electric: 0.085,
    transit: 0.140,
    walkBike: 0.0,
  },
  // Flights: kg CO2 per flight hour
  travel: {
    flight: 90.0,
    train: 15.0, // Train alternative equivalent
  },
  // Energy: kg CO2 per kWh
  energy: {
    gridKwh: 0.380, // US average grid intensity
    avgHomeKwhAnnual: 9000, // Average annual household consumption in kWh
    avgHvacCO2Annual: 4500, // Average annual heating/cooling emissions in kg CO2
    incandescentWatt: 0.060, // kW (60W)
    ledWatt: 0.009, // kW (9W)
    avgLightingHoursDaily: 4.0, // average hours light is on per day
  },
  // Diet: kg CO2 per year per person
  diet: {
    meatHeavy: 2600,
    vegetarian: 1400,
    vegan: 1050,
    localFocus: 1200,
    avgFoodCO2Annual: 1600, // Average dietary footprint
  },
  // Shopping: kg CO2 per clothing item
  shopping: {
    newGarment: 15.0,
    secondHandGarment: 1.5,
  },
};

/**
 * Calculates commuting emissions in kg CO2 per year.
 */
export function calculateCommuteEmissions(
  milesPerWeek: number,
  mode: 'car' | 'carpool' | 'transit' | 'bike' | 'walk',
  carType?: 'gas' | 'petrol_hatchback' | 'petrol_sedan' | 'diesel_sedan' | 'diesel_suv' | 'hybrid' | 'electric'
): number {
  const annualMiles = milesPerWeek * 52;
  
  if (mode === 'walk' || mode === 'bike') {
    return 0;
  }
  
  if (mode === 'transit') {
    return annualMiles * EMISSION_FACTORS.transport.transit;
  }
  
  // Determine vehicle emission factor
  let carFactor = EMISSION_FACTORS.transport.gasCar;
  if (carType === 'hybrid') {
    carFactor = EMISSION_FACTORS.transport.hybrid;
  } else if (carType === 'electric') {
    carFactor = EMISSION_FACTORS.transport.electric;
  }
  
  // If carpooling, divide emissions by 2 passengers
  if (mode === 'carpool') {
    return (annualMiles * carFactor) / 2;
  }
  
  return annualMiles * carFactor;
}

/**
 * Calculates lighting emissions based on bulb counts and type.
 */
export function calculateLightingEmissions(bulbCount: number, isLed: boolean): number {
  const watt = isLed ? EMISSION_FACTORS.energy.ledWatt : EMISSION_FACTORS.energy.incandescentWatt;
  const dailyKwh = bulbCount * watt * EMISSION_FACTORS.energy.avgLightingHoursDaily;
  return dailyKwh * 365 * EMISSION_FACTORS.energy.gridKwh;
}

/**
 * Calculates HVAC emissions with smart thermostat savings (10% reduction).
 */
export function calculateHvacEmissions(hasSmartThermostat: boolean, usageLevel: 'low' | 'medium' | 'high'): number {
  let multiplier = 1.0;
  if (usageLevel === 'low') multiplier = 0.75;
  if (usageLevel === 'high') multiplier = 1.30;

  const baseHvac = EMISSION_FACTORS.energy.avgHvacCO2Annual * multiplier;
  if (hasSmartThermostat) {
    return baseHvac * 0.90; // 10% savings
  }
  return baseHvac;
}

/**
 * Calculates electricity emissions considering solar panels.
 */
export function calculateElectricityEmissions(solarPercent: number): number {
  const baseEmissions = EMISSION_FACTORS.energy.avgHomeKwhAnnual * EMISSION_FACTORS.energy.gridKwh;
  const reductionFactor = Math.max(0, Math.min(100, solarPercent)) / 100;
  return baseEmissions * (1 - reductionFactor);
}

/**
 * Calculates food emissions based on diet preference and food waste reduction.
 */
export function calculateFoodEmissions(
  diet: 'meat-heavy' | 'vegetarian' | 'vegan' | 'local-focus',
  foodWasteReductionPercent: number // 0 to 100
): number {
  let baseDietEmissions = EMISSION_FACTORS.diet.meatHeavy;
  if (diet === 'vegetarian') {
    baseDietEmissions = EMISSION_FACTORS.diet.vegetarian;
  } else if (diet === 'vegan') {
    baseDietEmissions = EMISSION_FACTORS.diet.vegan;
  } else if (diet === 'local-focus') {
    baseDietEmissions = EMISSION_FACTORS.diet.localFocus;
  }

  // Waste reduction can save up to 15% of total food carbon (assuming 30% waste baseline is halved)
  const wasteSavingMultiplier = (foodWasteReductionPercent / 100) * 0.15;
  return baseDietEmissions * (1 - wasteSavingMultiplier);
}

/**
 * Calculates travel emissions (flights).
 */
export function calculateTravelEmissions(flightHours: number, useTrainAlternative: boolean): number {
  const factor = useTrainAlternative ? EMISSION_FACTORS.travel.train : EMISSION_FACTORS.travel.flight;
  return flightHours * factor;
}

/**
 * Calculates shopping emissions.
 */
export function calculateShoppingEmissions(itemsCount: number, secondHandPercent: number): number {
  const secondHandCount = (itemsCount * secondHandPercent) / 100;
  const newCount = itemsCount - secondHandCount;
  
  return (
    newCount * EMISSION_FACTORS.shopping.newGarment +
    secondHandCount * EMISSION_FACTORS.shopping.secondHandGarment
  );
}

/**
 * Comprehensive calculator for baseline vs simulated values.
 * Returns emissions in kg CO2 per year.
 */
export interface FootprintData {
  transport: number;
  energy: number;
  food: number;
  travel: number;
  shopping: number;
  total: number;
}

export function calculateTotalFootprint(inputs: {
  // Transport
  milesPerWeek: number;
  transportMode: 'car' | 'carpool' | 'transit' | 'bike' | 'walk';
  carType?: 'gas' | 'petrol_hatchback' | 'petrol_sedan' | 'diesel_sedan' | 'diesel_suv' | 'hybrid' | 'electric';
  // Energy
  solarPercent: number;
  smartThermostat: boolean;
  ledBulbs: boolean;
  bulbCount: number;
  airConUsage: 'low' | 'medium' | 'high';
  // Food
  diet: 'meat-heavy' | 'vegetarian' | 'vegan' | 'local-focus';
  foodWasteReduction: number;
  // Travel
  flightHours: number;
  useTrainAlternative: boolean;
  // Shopping
  clothingItems: number;
  secondHandPercent: number;
}): FootprintData {
  const transport = calculateCommuteEmissions(inputs.milesPerWeek, inputs.transportMode, inputs.carType);
  
  const lighting = calculateLightingEmissions(inputs.bulbCount, inputs.ledBulbs);
  const hvac = calculateHvacEmissions(inputs.smartThermostat, inputs.airConUsage);
  const electricity = calculateElectricityEmissions(inputs.solarPercent);
  const energy = lighting + hvac + electricity;
  
  const food = calculateFoodEmissions(inputs.diet, inputs.foodWasteReduction);
  const travel = calculateTravelEmissions(inputs.flightHours, inputs.useTrainAlternative);
  const shopping = calculateShoppingEmissions(inputs.clothingItems, inputs.secondHandPercent);
  
  const total = transport + energy + food + travel + shopping;
  
  return {
    transport: Math.round(transport),
    energy: Math.round(energy),
    food: Math.round(food),
    travel: Math.round(travel),
    shopping: Math.round(shopping),
    total: Math.round(total),
  };
}
