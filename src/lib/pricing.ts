import type { FeeBreakdown } from '../types';

const BASE_FEE = 3; // 起步价 ¥3
const DISTANCE_RATE = 1; // ¥1/km
const WEIGHT_THRESHOLD = 5; // kg
const WEIGHT_RATE = 1; // 超重部分 ¥1/kg

export function quoteFee(distanceMeters: number, weightKg: number): FeeBreakdown {
  const distanceKm = distanceMeters / 1000;
  const distanceFee = distanceKm * DISTANCE_RATE;
  const overweight = Math.max(0, weightKg - WEIGHT_THRESHOLD);
  const overweightFee = overweight * WEIGHT_RATE;
  const total = BASE_FEE + distanceFee + overweightFee;

  return {
    base: BASE_FEE,
    distance: Math.round(distanceFee * 10) / 10,
    overweight: Math.round(overweightFee * 10) / 10,
    total: Math.round(total * 10) / 10,
  };
}
