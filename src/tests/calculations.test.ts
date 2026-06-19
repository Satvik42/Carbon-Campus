import { describe, it, expect } from 'vitest';
import {
  calculateCommuteEmissions,
  calculateLightingEmissions,
  calculateHvacEmissions,
  calculateElectricityEmissions,
  calculateFoodEmissions,
  calculateTravelEmissions,
  calculateShoppingEmissions,
  calculateTotalFootprint,
  EMISSION_FACTORS,
} from '../features/footprint/calculations';

describe('Carbon Footprint Calculations', () => {
  describe('Commuting Emissions', () => {
    it('calculates walking or cycling as zero emissions', () => {
      expect(calculateCommuteEmissions(100, 'walk')).toBe(0);
      expect(calculateCommuteEmissions(50, 'bike')).toBe(0);
    });

    it('calculates transit emissions based on transit coefficient', () => {
      const miles = 50;
      const expected = miles * 52 * EMISSION_FACTORS.transport.transit;
      expect(calculateCommuteEmissions(miles, 'transit')).toBe(expected);
    });

    it('calculates standard gas car emissions', () => {
      const miles = 80;
      const expected = miles * 52 * EMISSION_FACTORS.transport.gasCar;
      expect(calculateCommuteEmissions(miles, 'car', 'gas')).toBe(expected);
    });

    it('calculates hybrid engine car emissions', () => {
      const miles = 80;
      const expected = miles * 52 * EMISSION_FACTORS.transport.hybrid;
      expect(calculateCommuteEmissions(miles, 'car', 'hybrid')).toBe(expected);
    });

    it('calculates electric vehicle car emissions', () => {
      const miles = 80;
      const expected = miles * 52 * EMISSION_FACTORS.transport.electric;
      expect(calculateCommuteEmissions(miles, 'car', 'electric')).toBe(expected);
    });

    it('divides emissions for carpooling passengers', () => {
      const miles = 100;
      const baseExpected = miles * 52 * EMISSION_FACTORS.transport.gasCar;
      const carpoolExpected = baseExpected / 2;
      expect(calculateCommuteEmissions(miles, 'carpool', 'gas')).toBe(carpoolExpected);
    });
  });

  describe('Lighting Emissions', () => {
    it('calculates incandescent bulb energy footprint', () => {
      const count = 10;
      const dailyKwh = count * EMISSION_FACTORS.energy.incandescentWatt * EMISSION_FACTORS.energy.avgLightingHoursDaily;
      const expected = dailyKwh * 365 * EMISSION_FACTORS.energy.gridKwh;
      expect(calculateLightingEmissions(count, false)).toBeCloseTo(expected, 4);
    });

    it('calculates LED energy savings footprint', () => {
      const count = 10;
      const dailyKwh = count * EMISSION_FACTORS.energy.ledWatt * EMISSION_FACTORS.energy.avgLightingHoursDaily;
      const expected = dailyKwh * 365 * EMISSION_FACTORS.energy.gridKwh;
      expect(calculateLightingEmissions(count, true)).toBeCloseTo(expected, 4);
    });
  });

  describe('HVAC and Temperature Control', () => {
    it('calculates base medium HVAC energy footprint', () => {
      expect(calculateHvacEmissions(false, 'medium')).toBe(EMISSION_FACTORS.energy.avgHvacCO2Annual);
    });

    it('saves 10% on HVAC with a smart thermostat', () => {
      const expected = EMISSION_FACTORS.energy.avgHvacCO2Annual * 0.90;
      expect(calculateHvacEmissions(true, 'medium')).toBe(expected);
    });
  });

  describe('Diet and Agriculture', () => {
    it('assigns correct yearly emissions for diet styles', () => {
      expect(calculateFoodEmissions('meat-heavy', 0)).toBe(EMISSION_FACTORS.diet.meatHeavy);
      expect(calculateFoodEmissions('vegetarian', 0)).toBe(EMISSION_FACTORS.diet.vegetarian);
      expect(calculateFoodEmissions('vegan', 0)).toBe(EMISSION_FACTORS.diet.vegan);
    });

    it('applies food waste reduction coefficient', () => {
      const base = EMISSION_FACTORS.diet.meatHeavy;
      // 50% waste reduction = 50 * 0.15 = 7.5% saving
      const expected = base * (1 - 0.075);
      expect(calculateFoodEmissions('meat-heavy', 50)).toBeCloseTo(expected, 4);
    });
  });

  describe('Flights and Travel', () => {
    it('calculates flight emissions based on travel hours', () => {
      expect(calculateTravelEmissions(10, false)).toBe(10 * EMISSION_FACTORS.travel.flight);
    });

    it('saves emissions when swapping train alternatives', () => {
      expect(calculateTravelEmissions(10, true)).toBe(10 * EMISSION_FACTORS.travel.train);
    });
  });

  describe('Shopping and Consumer Choice', () => {
    it('calculates new clothing emissions', () => {
      expect(calculateShoppingEmissions(10, 0)).toBe(10 * EMISSION_FACTORS.shopping.newGarment);
    });

    it('saves emissions when buying second-hand items', () => {
      const expected = (5 * EMISSION_FACTORS.shopping.newGarment) + (5 * EMISSION_FACTORS.shopping.secondHandGarment);
      expect(calculateShoppingEmissions(10, 50)).toBe(expected);
    });
  });
});
