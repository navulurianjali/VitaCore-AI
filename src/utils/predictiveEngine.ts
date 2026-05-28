// Centralized AI Wellness Prediction Engine for VitalCore

export interface TelemetryData {
  sleepHours: number;
  sleepQuality: number;
  hydrationMl: number;
  hydrationTarget: number;
  stressLevel: number;
  fatigueScore: number;
  physicalFatigue: number;
  mentalFatigue: number;
  sorenessLevel: number;
  recoveryPercentage: number;
  stabilityScore: number;
  caffeineIntake?: string; // e.g., 'high', 'moderate', 'none'
  screenTimeHours?: number;
}

export interface PredictionResult {
  burnoutRisk: number; // 0-100
  fatigueBuildup: number; // 0-100
  stressOverloadRisk: number; // 0-100
  sleepDeteriorationRisk: number; // 0-100
  recoveryDeclineRisk: number; // 0-100
  biologicalAgeShift: number; // e.g., -1.2 means feeling 1.2 years younger
  futureEnergyTrends: number[]; // 7-day forecast
  preventiveReminders: string[];
  aiInsights: string[];
}

/**
 * Calculates a complete suite of future health predictions and alerts
 * based on user habits and daily telemetry registers.
 */
export function calculateFutureHealthPredictions(data: TelemetryData): PredictionResult {
  // 1. Compute Burnout Risk
  // High stress, poor sleep quality, and high cumulative fatigue fuel burnout
  let burnout = Math.round(
    data.stressLevel * 0.45 + 
    (100 - data.sleepQuality) * 0.35 + 
    data.fatigueScore * 0.2
  );
  burnout = Math.min(100, Math.max(0, burnout));

  // 2. Compute Fatigue Buildup
  // Derived from active physical and mental fatigue indicators, amplified by sleep debt
  const sleepDebtHrs = Math.max(0, 8.0 - data.sleepHours);
  let fatigue = Math.round(
    data.physicalFatigue * 0.35 + 
    data.mentalFatigue * 0.35 + 
    (sleepDebtHrs > 0 ? sleepDebtHrs * 12.5 : 0)
  );
  fatigue = Math.min(100, Math.max(0, fatigue));

  // 3. Compute Stress Overload Risk
  let stressOverload = Math.round(
    data.stressLevel * 0.65 + 
    data.mentalFatigue * 0.35
  );
  stressOverload = Math.min(100, Math.max(0, stressOverload));

  // 4. Compute Sleep Deterioration Risk
  // Screen time and stress indicators directly threaten sleep onset latency
  const screenTimeImpact = data.screenTimeHours && data.screenTimeHours > 8 ? 15 : 0;
  const caffeineImpact = data.caffeineIntake === "high" ? 20 : data.caffeineIntake === "moderate" ? 8 : 0;
  let sleepDecline = Math.round(
    (100 - data.sleepQuality) * 0.4 + 
    data.stressLevel * 0.3 + 
    screenTimeImpact + 
    caffeineImpact
  );
  sleepDecline = Math.min(100, Math.max(0, sleepDecline));

  // 5. Compute Recovery Decline Risk
  // Low hydration levels and soreness delay muscular repair
  const hydrationRatio = data.hydrationMl / data.hydrationTarget;
  const hydrationDebtImpact = hydrationRatio < 0.8 ? (1.0 - hydrationRatio) * 40 : 0;
  let recoveryDecline = Math.round(
    (100 - data.recoveryPercentage) * 0.5 + 
    data.sorenessLevel * 4 + 
    hydrationDebtImpact
  );
  recoveryDecline = Math.min(100, Math.max(0, recoveryDecline));

  // 6. Biological Age Shift
  // Constructive lifestyle stability makes the digital twin younger
  let ageShift = 0.0;
  if (data.stabilityScore >= 85) {
    ageShift = -1.5 - ((data.stabilityScore - 85) * 0.1);
  } else if (data.stabilityScore < 60) {
    ageShift = 1.0 + ((60 - data.stabilityScore) * 0.15);
  } else {
    ageShift = -0.5;
  }
  ageShift = Math.round(ageShift * 10) / 10; // Round to 1 decimal

  // 7. Future 7-day energy trends simulation
  const futureEnergyTrends: number[] = [];
  const baseEnergy = 100 - (fatigue * 0.5 + data.stressLevel * 0.2);
  for (let i = 0; i < 7; i++) {
    // Incorporate positive growth if stability score is high, or default decline if low
    const growthFactor = data.stabilityScore >= 75 ? (i * (data.stabilityScore - 75) * 0.4) : (i * (data.stabilityScore - 75) * 0.5);
    const dayNoise = Math.sin(i * 1.2) * 5; // circadian noise
    const estVal = Math.round(baseEnergy + growthFactor + dayNoise);
    futureEnergyTrends.push(Math.min(95, Math.max(15, estVal)));
  }

  // 8. Generate preventive alerts / reminders
  const preventiveReminders: string[] = [];
  if (data.sleepHours < 6.0) {
    preventiveReminders.push("Rest Reminder: You got less than 6 hours of sleep recently. Let's try winding down early tonight.");
  }
  if (hydrationRatio < 0.7) {
    preventiveReminders.push("Hydration Check: You're a bit behind on your water goal. Let's grab a glass of water now!");
  }
  if (data.stressLevel > 65) {
    preventiveReminders.push("Take a Breather: We noticed your stress levels are climbing. Let's take a minute to do some slow, relaxing breathing.");
  }
  if (data.sorenessLevel > 6) {
    preventiveReminders.push("Active Recovery: Since your muscles are quite sore today, we recommend a gentle stretch or a light walk.");
  }
  if (data.physicalFatigue > 60 && data.recoveryPercentage < 50) {
    preventiveReminders.push("Time to Recharge: Your energy levels are running low. Let's skip the intense workout today and give your body some rest.");
  }

  // Fallback defaults if metrics are optimal
  if (preventiveReminders.length === 0) {
    preventiveReminders.push("You're doing amazing! Your energy is high and your body is ready for a great day.");
  }

  // 9. Generate AI future health insights
  const aiInsights: string[] = [];
  if (hydrationRatio < 0.85) {
    aiInsights.push("You've been drinking a bit less water this week. Staying hydrated helps your body recover better and keeps you feeling fresh.");
  } else {
    aiInsights.push("Great job keeping up with your water! It's helping your body stay fully energized and healthy.");
  }

  if (data.sleepQuality < 70) {
    aiInsights.push("A few rough nights of sleep can leave you feeling a bit worn out. Let's focus on a calming bedtime routine tonight.");
  } else {
    aiInsights.push("Your sleep has been wonderfully consistent! You should feel a great boost in your morning focus and energy.");
  }

  if (burnout > 55) {
    aiInsights.push("Your stress is starting to build up, which can make you tired. Try taking a little break from screens this evening.");
  } else {
    aiInsights.push("Your stress levels are looking good and well under control. Keep up the balanced pace!");
  }

  if (data.stabilityScore >= 80) {
    aiInsights.push("Your current routine is amazing! Keep this up, and you'll likely feel a wonderful boost in your daily energy soon.");
  } else {
    aiInsights.push("It looks like you've been a little less active lately. Even a small 10-minute walk today can make a big difference.");
  }

  return {
    burnoutRisk: burnout,
    fatigueBuildup: fatigue,
    stressOverloadRisk: stressOverload,
    sleepDeteriorationRisk: sleepDecline,
    recoveryDeclineRisk: recoveryDecline,
    biologicalAgeShift: ageShift,
    futureEnergyTrends,
    preventiveReminders,
    aiInsights
  };
}
