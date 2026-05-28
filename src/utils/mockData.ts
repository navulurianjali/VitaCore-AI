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
  let deficiencies = ["Vitamin D3 (Try getting a little more outdoor sunlight)"];

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
    deficiencies.push("Calcium (Try adding some calcium-rich foods to your meals)");
  } else if (mode === "professional") {
    metabolic = 70;
    sustainability = 58;
    glycemic = "high"; // High processed glycemic load due to convenience eating
    postureRisk = "critical"; // High screen hours
    deficiencies.push("Vitamin B12 (Helps keep your energy high and fight off fatigue)");
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
    workoutRecommendation = "Indoor light stretching or yoga in a cool, air-conditioned room";
    alerts.push(`It's quite warm today (${env.temperatureCelsius}°C). Let's take it easy and drink a bit more water.`);
  } else if (env.temperatureCelsius < 5) {
    hydrationModifier -= 200;
    workoutRecommendation = "Warm up indoors for about 15 minutes before any light outdoor walk or jog";
    alerts.push(`It's freezing outside (${env.temperatureCelsius}°C). Make sure to warm up thoroughly indoors before your exercise.`);
  }

  // Air Pollution Check
  if (env.pollutionIndexAqi > 150) {
    workoutRecommendation = "A cozy, strength-focused indoor workout";
    alerts.push(`Air quality is a bit poor today (AQI ${env.pollutionIndexAqi}). Let's stay indoors for our exercise.`);
  } else if (env.pollutionIndexAqi > 100) {
    alerts.push(`Air quality is slightly off today (AQI ${env.pollutionIndexAqi}). It's recommended to train indoors if you have sensitive lungs.`);
  }

  // Workload Check
  if (env.workloadHours > 9) {
    workoutIntensity = "Low";
    workoutRecommendation = "A relaxing walk and some gentle stretching to unwind";
    alerts.push(`You've worked a long day (${env.workloadHours} hours). Let's do a lighter workout to help you unwind and rest.`);
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
      activity = "Enjoy some morning sunlight and a glass of water";
    } else if (h === 9) {
      level = 88 - stressLevel * 0.1;
      activity = "Best time for deep focus and important tasks";
    } else if (h === 11) {
      level = 80;
      activity = "Focus on your main projects and creative work";
    } else if (h === 13) {
      level = 45;
      activity = "A quick post-lunch walk or a few minutes of quiet breathing";
    } else if (h === 15) {
      level = 60;
      activity = "Great time for catching up with others and casual planning";
    } else if (h === 17) {
      level = 75 - stressLevel * 0.15;
      activity = "Perfect time for a workout – your body is warmed up and ready!";
    } else if (h === 19) {
      level = 55;
      activity = "A relaxing dinner and a quick check-in on how your day went";
    } else if (h === 21) {
      level = 35;
      activity = "Wind down, put away the screens, and enjoy a good book";
    } else if (h === 23) {
      level = 15;
      activity = "Bedtime! Time to drift off for a restful night's sleep";
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
    name: "Daily Walk (8,000 steps)",
    category: "Fitness",
    streak: 6,
    maxStreak: 12,
    excuseTrigger: "It's rainy outside or I'm feeling tired after work",
    habitBreakdown: "We tend to skip walks on rainy days or after long workdays. Tip: Try a quick, fun 10-minute indoor stretching or bodyweight routine instead!",
    consistencyScore: 82
  },
  {
    id: "habit-2",
    name: "Stay Hydrated (2.5L)",
    category: "Hydration",
    streak: 14,
    maxStreak: 21,
    excuseTrigger: "I get so focused on work that I simply forget to drink",
    habitBreakdown: "It's easy to forget to hydrate when you're in the zone. Tip: Keep a favorite water bottle right next to your keyboard as a visual reminder.",
    consistencyScore: 94
  },
  {
    id: "habit-3",
    name: "Unwind Screens by 10PM",
    category: "Sleep",
    streak: 2,
    maxStreak: 8,
    excuseTrigger: "Getting caught up in late-night projects or watching shows",
    habitBreakdown: "Late-night screen time can make it hard to sleep. Tip: Try setting a gentle 'bedtime' alarm at 9:30 PM to remind yourself to shut down.",
    consistencyScore: 58
  }
];

export const getActiveChallenges = (): ChallengeItem[] => [
  {
    id: "challenge-1",
    title: "Daily Energy Booster",
    description: "Get moving for 20 minutes a day at your peak energy time for 5 days in a row.",
    category: "fitness",
    difficulty: "medium",
    xpReward: 350,
    durationDays: 5,
    progress: 60
  },
  {
    id: "challenge-2",
    title: "Healthy Eating Week",
    description: "Log your meals for a week and focus on adding fresh, wholesome ingredients to your plate.",
    category: "nutrition",
    difficulty: "hard",
    xpReward: 500,
    durationDays: 7,
    progress: 42
  },
  {
    id: "challenge-3",
    title: "Mindful Morning Breathing",
    description: "Take 5 minutes each morning to check in with how you feel and do a quiet breathing exercise.",
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
      foodName: "Fresh Salmon Avocado Salad",
      calories: 420,
      protein: 34,
      carbs: 18,
      fat: 26,
      sugar: 4,
      portionSize: "320g bowl",
      healthScore: 94,
      sugarAlert: false,
      unhealthyAdditives: [],
      alternatives: ["Greek Salmon Bowl with Quinoa", "Steamed Cod with Spinach"],
      nutritionRecommendation: "This meal is incredibly nourishing! It's packed with healthy fats and lean protein that help your body recover, stay energized, and feel its best."
    };
  }

  if (lowercase.includes("pizza") || lowercase.includes("burger") || lowercase.includes("fast")) {
    return {
      foodName: "Cheese Pepperoni Pizza",
      calories: 580,
      protein: 18,
      carbs: 64,
      fat: 28,
      sugar: 12,
      portionSize: "2 large slices",
      healthScore: 38,
      sugarAlert: true,
      unhealthyAdditives: ["Processed sodium preservatives", "Hydrogenated trans fats"],
      alternatives: ["Cauliflower Crust Chicken Pizza", "Whole Wheat Turkey Wrap"],
      nutritionRecommendation: "A delicious treat, but keep an eye on refined carbs and fats. Meals like this can cause a quick energy spike followed by a crash, making you feel a bit tired later."
    };
  }

  if (lowercase.includes("apple") || lowercase.includes("fruit") || lowercase.includes("banana")) {
    return {
      foodName: "Organic Apple",
      calories: 95,
      protein: 0.5,
      carbs: 25,
      fat: 0.3,
      sugar: 19,
      portionSize: "1 medium apple",
      healthScore: 88,
      sugarAlert: false, // Natural fructose is safe
      unhealthyAdditives: [],
      alternatives: ["Organic Strawberries", "Fresh Pears"],
      nutritionRecommendation: "Apples are a wonderful choice! They are full of vitamins and high in natural fiber, which helps keep your energy levels steady and supports digestion."
    };
  }

  // Default barcode scan / package simulation
  return {
    foodName: "Chewy Granola Bar",
    calories: 280,
    protein: 10,
    carbs: 38,
    fat: 9,
    sugar: 22,
    portionSize: "60g bar",
    healthScore: 52,
    sugarAlert: true,
    unhealthyAdditives: ["High Fructose Corn Syrup", "Artificial Flavors"],
    alternatives: ["Raw almonds and dates", "A high-quality protein shake"],
    nutritionRecommendation: "This bar is a bit high in added sugars. While it gives a quick burst of energy, it might lead to a mid-afternoon crash. Try pairing it with a few nuts for longer-lasting fuel."
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
    ? `Since you've had a previous injury with your ${onboardingData.previous_injuries}, let's make sure to move gently and protect that area.`
    : "Let's focus on moving with great form and listening to your body.";

  const dietMention = onboardingData?.dietary_preferences && onboardingData.dietary_preferences !== "standard"
    ? `I'm keeping your preference for a ${onboardingData.dietary_preferences} diet in mind.`
    : "Let's make sure you're getting a good balance of nutritious food.";

  let reply = "";

  if (lowercase.includes("tired") || lowercase.includes("fatigue") || lowercase.includes("sore")) {
    reply = `Hi there! I noticed you're feeling a bit tired today. Your mental tiredness is at ${baseMetrics.mentalFatigue}%, and your recovery score is at ${baseMetrics.recoveryPercentage}%. ${injuryMention} I highly recommend swapping any intense exercise today for some gentle stretching or a light walk. Taking time to rest now will help you bounce back stronger and prevent fatigue from building up!`;
  }
  else if (lowercase.includes("workout") || lowercase.includes("exercise") || lowercase.includes("gym")) {
    reply = `Hello! Looking at your energy pattern today, you'll likely feel most energized and ready for a workout around 5:00 PM. ${injuryMention} Let's aim for a nice, moderate 30-minute session, keeping our focus on smooth, comfortable movements. How does that sound?`;
  }
  else if (lowercase.includes("hungry") || lowercase.includes("eat") || lowercase.includes("nutrition") || lowercase.includes("diet")) {
    reply = `Hi! I just looked over your meals today (you've had ${baseMetrics.caloriesConsumed} calories so far). ${dietMention} You're doing a great job! If you get a bit hungry later, try having a handful of walnuts or an apple. It's a wonderful, healthy way to keep your energy steady while you're focusing on your work.`;
  }
  else if (lowercase.includes("sleep") || lowercase.includes("insomnia") || lowercase.includes("rest")) {
    reply = `Hi! Let's talk about your sleep. Your sleep score is around ${baseMetrics.sleepQuality}%, and you got slightly less rest than usual last night. To help you catch up tonight, I'd suggest putting screens away by 9:45 PM and keeping your bedroom nice and cool. It works wonders for falling asleep easily and getting deep, restful sleep!`;
  }
  else {
    reply = `Hi! I hope you're having a wonderful day. Your overall wellness score is at ${baseMetrics.stabilityScore}%, which is looking very healthy and strong! I've set up some friendly reminders for your water and active breaks today. ${injuryMention} What would you like to focus on or chat about next?`;
  }

  return reply;
};
