// VITALCORE COMPREHENSIVE HEALTH DATA SIMULATOR & PREVENTATIVE AI ENGINE

export interface DailyMetrics {
  caloriesBurned: number;
  caloriesTarget: number;
  caloriesConsumed: number;
  hydrationMl: number;
  hydrationTarget: number;
  steps: number;
  stepsTarget: number;
  sleepHours: number;
  sleepTarget: number;
  sleepQuality: number;
  stressLevel: number;
  mood: string;
  recoveryPercentage: number;
  fatigueScore: number;
  physicalFatigue: number;
  mentalFatigue: number;
  energyLevel: number;
  biologicalAge: number;
  stabilityScore: number;
  
  // ADVANCED HEALTH INTELLIGENCE METRICS
  metabolicEfficiency: number; // 0-100%
  lifestyleSustainability: number; // 0-100%
  glycemicIndexLoad: "low" | "medium" | "high";
  sedentaryPostureRisk: "low" | "medium" | "critical";
  micronutrientDeficiencies: string[];
}

export interface AIPredictions {
  burnoutRisk: number;
  obesityRisk: number;
  sleepDeclineRisk: number;
  staminaDeclineRisk: number;
  hydrationRisk: number;
  muscleRecoveryDelay: number;
  inactivityRisk: number;
}

export interface EnvironmentInfo {
  weather: string;
  temperatureCelsius: number;
  pollutionIndexAqi: number;
  workloadHours: number;
  travelStatus: boolean;
}

export interface HabitItem {
  id: string;
  name: string;
  category: string;
  streak: number;
  maxStreak: number;
  excuseTrigger: string;
  habitBreakdown: string;
  consistencyScore: number;
}

export interface ChallengeItem {
  id: string;
  title: string;
  description: string;
  category: "fitness" | "nutrition" | "hydration" | "sleep" | "mental";
  difficulty: "easy" | "medium" | "hard";
  xpReward: number;
  durationDays: number;
  progress: number;
}

// FOOD SCANNER ESTIMATION INTERFACE
export interface ScanResult {
  foodName: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  sugar: number;
  portionSize: string;
  healthScore: number; // 0-100
  sugarAlert: boolean;
  unhealthyAdditives: string[];
  alternatives: string[];
  nutritionRecommendation: string;
}

// Generate base metrics that update with time and reflect settings
export const getBaseMetrics = (mode: string = "standard"): DailyMetrics => {
  const scale = mode === "elderly" ? 0.75 : mode === "beginner" ? 0.9 : 1.0;
  
  let metabolic = 78;
  let sustainability = 82;
  let glycemic: "low" | "medium" | "high" = "medium";
  let postureRisk: "low" | "medium" | "critical" = "medium";
  let deficiencies = ["Vitamin D3 (Optimal sunlight limit crossed)"];

  if (mode === "athlete") {
    metabolic = 94;
    sustainability = 88;
    glycemic = "low";
    postureRisk = "low";
  } else if (mode === "elderly") {
    metabolic = 62;
    sustainability = 70;
    glycemic = "medium";
    postureRisk = "medium";
    deficiencies.push("Calcium (Recommend custom bio-available synthesis logs)");
  } else if (mode === "professional") {
    metabolic = 70;
    sustainability = 58;
    glycemic = "high"; // High processed glycemic load due to convenience eating
    postureRisk = "critical"; // High screen hours
    deficiencies.push("Vitamin B12 (CNS fatigue indicator)");
  } else if (mode === "wellness") {
    metabolic = 84;
    sustainability = 92;
    glycemic = "low";
    postureRisk = "low";
  }

  return {
    caloriesBurned: Math.round(550 * scale),
    caloriesTarget: Math.round(600 * scale),
    caloriesConsumed: Math.round(1850 * scale),
    hydrationMl: 1400,
    hydrationTarget: mode === "elderly" ? 2000 : 2500,
    steps: Math.round(7600 * scale),
    stepsTarget: mode === "elderly" ? 5000 : 10000,
    sleepHours: 6.8,
    sleepTarget: mode === "elderly" ? 7.5 : 8.0,
    sleepQuality: 74,
    stressLevel: 58,
    mood: "good",
    recoveryPercentage: 68,
    fatigueScore: 42,
    physicalFatigue: 45,
    mentalFatigue: 38,
    energyLevel: 72,
    biologicalAge: mode === "elderly" ? 68.2 : mode === "beginner" ? 31.4 : 27.2,
    stabilityScore: 84,
    
    // ADVANCED HEALTH INTELLIGENCE
    metabolicEfficiency: metabolic,
    lifestyleSustainability: sustainability,
    glycemicIndexLoad: glycemic,
    sedentaryPostureRisk: postureRisk,
    micronutrientDeficiencies: deficiencies
  };
};

// Advanced Environment Modifier Engine: Adjusts workout & hydration dynamically
export const getEnvironmentAdjustedRoutine = (
  env: EnvironmentInfo,
  baseMetrics: DailyMetrics,
  mode: string = "standard"
) => {
  let hydrationModifier = 0;
  let workoutIntensity = "Medium";
  let workoutRecommendation = "Dynamic functional aerobic training";
  let alerts: string[] = [];

  // Weather and Temp check
  if (env.temperatureCelsius >= 32) {
    hydrationModifier += 600;
    workoutIntensity = mode === "elderly" ? "Very Low" : "Low";
    workoutRecommendation = "Indoor light dynamic stretching or yoga in cool air conditioning";
    alerts.push(`High Heat Warning (${env.temperatureCelsius}°C): Workout throttled. Added 600ml hydration buffer.`);
  } else if (env.temperatureCelsius < 5) {
    hydrationModifier -= 200;
    workoutRecommendation = "Warm-up indoors for at least 15 minutes before light outdoor cardio";
    alerts.push(`Freezing Temp Warning (${env.temperatureCelsius}°C): Focus on detailed cardiovascular warming.`);
  }

  // Air Pollution Check
  if (env.pollutionIndexAqi > 150) {
    workoutRecommendation = "Strictly indoor respiratory-safe anaerobic resistance work";
    alerts.push(`Poor Air Quality (AQI ${env.pollutionIndexAqi}): Exercise OUTDOORS forbidden due to microparticle exposure.`);
  } else if (env.pollutionIndexAqi > 100) {
    alerts.push(`Mild Air Quality issue (AQI ${env.pollutionIndexAqi}): Recommend indoor training for elderly and sensitive groups.`);
  }

  // Workload Check
  if (env.workloadHours > 9) {
    workoutIntensity = "Low";
    workoutRecommendation = "Decompression walk & focus on core stretching, foam rolling recovery";
    alerts.push(`High Cognitive Strain Alert (${env.workloadHours} hrs work): Workout intensity downgraded to prevent central fatigue.`);
  }

  return {
    hydrationTarget: baseMetrics.hydrationTarget + hydrationModifier,
    workoutIntensity,
    workoutRecommendation,
    alerts
  };
};

// Future Health Simulation (3-6 Months Digital Twin Forecasting)
export interface TwinForecastPoint {
  month: string;
  constructiveScore: number;
  destructiveScore: number;
}

export const getDigitalTwinForecast = (
  baseStability: number,
  months: number = 6
): TwinForecastPoint[] => {
  const points: TwinForecastPoint[] = [];
  let currentCon = baseStability;
  let currentDes = baseStability;

  for (let i = 0; i <= months; i++) {
    points.push({
      month: `Month ${i}`,
      constructiveScore: Math.round(Math.min(100, currentCon)),
      destructiveScore: Math.round(Math.max(10, currentDes))
    });
    
    currentCon += (100 - currentCon) * 0.18 + Math.random() * 2;
    currentDes -= (currentDes * 0.12) + Math.random() * 3;
  }
  return points;
};

// Energy & Productivity Hourly Scheduler
export interface EnergyTimelinePoint {
  hour: number;
  timeLabel: string;
  energyLevel: number;
  recommendedActivity: string;
}

export const getEnergyTimeline = (stressLevel: number): EnergyTimelinePoint[] => {
  const timeline: EnergyTimelinePoint[] = [];
  const hours = [7, 9, 11, 13, 15, 17, 19, 21, 23];

  hours.forEach((h) => {
    let level = 50;
    let activity = "Routine task";
    const label = h >= 12 ? `${h === 12 ? 12 : h - 12} PM` : `${h} AM`;

    if (h === 7) {
      level = 65;
      activity = "Morning light sunlight exposure & hydration";
    } else if (h === 9) {
      level = 88 - stressLevel * 0.1;
      activity = "High cognitive focus period: Critical strategic thinking";
    } else if (h === 11) {
      level = 80;
      activity = "Deep work focus: Core development / problem solving";
    } else if (h === 13) {
      level = 45;
      activity = "Post-lunch light walk or quick 15-minute mindfulness breathing";
    } else if (h === 15) {
      level = 60;
      activity = "Collaborative synchronizations & creative planning meetings";
    } else if (h === 17) {
      level = 75 - stressLevel * 0.15;
      activity = "Peak athletic performance window: Ideal workout timing";
    } else if (h === 19) {
      level = 55;
      activity = "Mindful dinner logging & recovery review";
    } else if (h === 21) {
      level = 35;
      activity = "Blue-light dimming: Evening relaxation & reading";
    } else if (h === 23) {
      level = 15;
      activity = "Circadian sleep transition phase: Melatonin peak";
    }

    timeline.push({
      hour: h,
      timeLabel: label,
      energyLevel: Math.round(level),
      recommendedActivity: activity
    });
  });

  return timeline;
};

// Default Habit list with AI Excuse memory
export const getDefaultHabits = (): HabitItem[] => [
  {
    id: "habit-1",
    name: "8,000 Step Cardio Target",
    category: "Fitness",
    streak: 6,
    maxStreak: 12,
    excuseTrigger: "Rainy outside or tired after complex work hours",
    habitBreakdown: "AI detected excuse routine: User defaults to skip cardiorespiratory activity when air is wet or cognitive load exceeds 8 hours. Suggestion: Indoor light functional bodyweight complexes.",
    consistencyScore: 82
  },
  {
    id: "habit-2",
    name: "Smart Hydration Logging (2.5L)",
    category: "Hydration",
    streak: 14,
    maxStreak: 21,
    excuseTrigger: "Forgotten when back-to-back coding",
    habitBreakdown: "AI breakdown: Habit fails when work focus times exceed 120 minutes without breaks. Recommendation: Link water to cursor activity triggers.",
    consistencyScore: 94
  },
  {
    id: "habit-3",
    name: "Blue-Light Shutdown by 10PM",
    category: "Sleep",
    streak: 2,
    maxStreak: 8,
    excuseTrigger: "Late night debugging / creative hyperfocus",
    habitBreakdown: "AI breakdown: Habit fails when screen time continues past 9:30 PM. Trigger warning: High caffeine consumption after 3:00 PM overrides fatigue sensors.",
    consistencyScore: 58
  }
];

export const getActiveChallenges = (): ChallengeItem[] => [
  {
    id: "challenge-1",
    title: "Vascular Optimization Circuit",
    description: "Perform 20 minutes of light metabolic exercises at HSL Peak Energy window for 5 consecutive days.",
    category: "fitness",
    difficulty: "medium",
    xpReward: 350,
    durationDays: 5,
    progress: 60
  },
  {
    id: "challenge-2",
    title: "Macro Nutrient Balance Sprint",
    description: "Log meals with 100% precision keeping protein levels target accurate and avoiding emotional snacking triggers.",
    category: "nutrition",
    difficulty: "hard",
    xpReward: 500,
    durationDays: 7,
    progress: 42
  },
  {
    id: "challenge-3",
    title: "Anxiety Suppression Breathing",
    description: "Maintain morning mindfulness logs and log daily recovery metrics before starting work.",
    category: "mental",
    difficulty: "easy",
    xpReward: 200,
    durationDays: 3,
    progress: 100
  }
];

// DYNAMIC FOOD IMAGES SIMULATED PARSER LIST
export const parseSimulatedFoodScan = (foodNameOrBarcode: string): ScanResult => {
  const lowercase = foodNameOrBarcode.toLowerCase();

  if (lowercase.includes("salad") || lowercase.includes("salmon") || lowercase.includes("vegetable")) {
    return {
      foodName: "Premium Atlantic Salmon Avocado Salad",
      calories: 420,
      protein: 34,
      carbs: 18,
      fat: 26,
      sugar: 4,
      portionSize: "320g regular bowl",
      healthScore: 94,
      sugarAlert: false,
      unhealthyAdditives: [],
      alternatives: ["Greek Salmon Bowl with Quinoa", "Steamed Cod with Spinach"],
      nutritionRecommendation: "Exceptional macromolecular density! High omega fatty acid profile aligns with cardiorespiratory cell repair. Portions target optimal recovery thresholds."
    };
  }

  if (lowercase.includes("pizza") || lowercase.includes("burger") || lowercase.includes("fast")) {
    return {
      foodName: "Double Cheese Pepperoni Pizza Slice",
      calories: 580,
      protein: 18,
      carbs: 64,
      fat: 28,
      sugar: 12,
      portionSize: "2 large slices",
      healthScore: 38,
      sugarAlert: true,
      unhealthyAdditives: ["Processed sodium nitrites", "Hydrogenated saturated fats"],
      alternatives: ["Cauliflower Crust Chicken Pizza", "Whole Wheat Turkey Burger wrap"],
      nutritionRecommendation: "Warning: High glycemic index load detected. Heavy processed trans-fat concentrations delay CNS muscular recovery and surges cardiovascular stress spikes by 14%."
    };
  }

  if (lowercase.includes("apple") || lowercase.includes("fruit") || lowercase.includes("banana")) {
    return {
      foodName: "Organic Fuji Apple",
      calories: 95,
      protein: 0.5,
      carbs: 25,
      fat: 0.3,
      sugar: 19,
      portionSize: "1 medium apple",
      healthScore: 88,
      sugarAlert: false, // Natural fructose is safe
      unhealthyAdditives: [],
      alternatives: ["Organic Strawberries", "Fuji Pears"],
      nutritionRecommendation: "Excellent bio-available micronutrient profile! Combats oxidative stress. Glycemic index is low due to rich soluble dietary fiber blocks."
    };
  }

  // Default barcode scan / package simulation
  return {
    foodName: "Pre-packaged Energy Nutrition Bar",
    calories: 280,
    protein: 10,
    carbs: 38,
    fat: 9,
    sugar: 22,
    portionSize: "60g snack pack",
    healthScore: 52,
    sugarAlert: true,
    unhealthyAdditives: ["High Fructose Corn Syrup", "Artificial Emulsifiers"],
    alternatives: ["Raw unsalted almonds & dates complex", "Whey isolate dry shake"],
    nutritionRecommendation: "Glycemic hazard alert: Sugar density exceeds 20g. High syrup additive triggers rapid insulin spikes, leading to an afternoon energy crash."
  };
};

// AI Engine Cloud Check and Config
export const getLLMApiKeysConfig = () => {
  // Never hardcoded, securely fetching from environment parameters
  return {
    openai: process.env.OPENAI_API_KEY || process.env.NEXT_PUBLIC_OPENAI_API_KEY || null,
    gemini: process.env.GEMINI_API_KEY || null,
    anthropic: process.env.ANTHROPIC_API_KEY || null,
  };
};

export const isLLMCloudActive = () => {
  const keys = getLLMApiKeysConfig();
  return !!(keys.openai || keys.gemini || keys.anthropic);
};

// Conversational AI Coach responses based on user messages
export const getAICoachReply = (
  message: string, 
  baseMetrics: DailyMetrics, 
  onboardingData?: any
): string => {
  const lowercase = message.toLowerCase();
  
  // Constructive context injection if user filled onboarding data
  const injuryMention = onboardingData?.previous_injuries && onboardingData.previous_injuries !== "none"
    ? `Since you noted a health history of "${onboardingData.previous_injuries}", we must be extremely careful to protect those joints during active drills.`
    : "Let's focus on maintaining functional biomechanics.";

  const dietMention = onboardingData?.dietary_preferences && onboardingData.dietary_preferences !== "standard"
    ? `Applying your "${onboardingData.dietary_preferences}" dietary filter for food selections.`
    : "Let's align your macromolecular thresholds.";

  let reply = "";

  if (lowercase.includes("tired") || lowercase.includes("fatigue") || lowercase.includes("sore")) {
    reply = `VitalCore AI Coach: I see your CNS mental fatigue is at ${baseMetrics.mentalFatigue}%, physical soreness is active, and metabolic efficiency is at ${baseMetrics.metabolicEfficiency}%. ${injuryMention} I highly advise swapping your high-intensity workout today for an active recovery stretching block. Your cumulative recovery score is ${baseMetrics.recoveryPercentage}%, which means overtraining risk is rising. Let's prevent any invisible health decline!`;
  }
  else if (lowercase.includes("workout") || lowercase.includes("exercise") || lowercase.includes("gym")) {
    reply = `VitalCore AI Coach: Based on your current energy profile and posture sedentary risk status (${baseMetrics.sedentaryPostureRisk}), your peak coordination and physical capability hours are scheduled for 5:00 PM today. ${injuryMention} Let's aim for a moderate session of 30 minutes, prioritizing stable form.`;
  }
  else if (lowercase.includes("hungry") || lowercase.includes("eat") || lowercase.includes("nutrition") || lowercase.includes("diet")) {
    reply = `VitalCore AI Coach: Analyzing your calories: consumed ${baseMetrics.caloriesConsumed} kcal. ${dietMention} Your macro stability score is solid, but I suggest adding a handful of omega-rich walnuts to combat afternoon stress-eating. Your cognitive focus is in a high-demand phase.`;
  }
  else if (lowercase.includes("sleep") || lowercase.includes("insomnia") || lowercase.includes("rest")) {
    reply = `VitalCore AI Coach: Your average sleep consistency is ${baseMetrics.sleepQuality}%. Yesterday, you accumulated a minor sleep debt of 1.2 hours. To reset your circadian rhythm tonight, I recommend complete screen lockout by 9:45 PM and introducing a cool ambient room temperature (around 19°C) to accelerate melatonin onset.`;
  }
  else {
    reply = `VitalCore AI Coach: Hello! I'm tracking your health stability parameters. Currently, your Wellness Stability is at ${baseMetrics.stabilityScore}% (Healthy). I have optimized your fluid intake targets and focus zones for the day. ${injuryMention} What part of your preventive routine would you like to refine?`;
  }

  return reply;
};
