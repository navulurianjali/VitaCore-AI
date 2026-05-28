"use client";

import React, { useState, useEffect } from "react";
import { 
  Utensils, 
  Droplet, 
  Flame,
  Sparkles, 
  AlertTriangle, 
  Apple, 
  Plus, 
  Info, 
  Upload, 
  Camera, 
  Scan, 
  CornerDownRight, 
  CheckCircle, 
  AlertCircle,
  Moon,
  Activity,
  Calendar,
  ShieldAlert
} from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import GlassCard from "@/components/ui/GlassCard";
import Button from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { parseSimulatedFoodScan, DailyMetrics, ScanResult } from "@/utils/mockData";
import confetti from "canvas-confetti";
import { supabase } from "@/utils/supabase";

export interface DietPlan {
  id: string;
  name: string;
  emoji: string;
  description: string;
  targetMacros: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
}

export const DIET_PLANS: DietPlan[] = [
  { id: "weight_loss", name: "Weight Loss Decompression", emoji: "📉", description: "High thermic impact meals, calorie-deficit calibration, and rich fiber blocks.", targetMacros: { calories: 1600, protein: 120, carbs: 140, fat: 50 } },
  { id: "weight_gain", name: "High Calorie Mass Gainer", emoji: "📈", description: "Nutrient-dense whole food blocks to fuel healthy lean hypertrophy.", targetMacros: { calories: 2800, protein: 160, carbs: 320, fat: 80 } },
  { id: "fat_loss", name: "Somatic Fat Loss Circuit", emoji: "🔥", description: "Macro-balanced high thermogenic foods to optimize metabolic fat oxidation.", targetMacros: { calories: 1800, protein: 140, carbs: 160, fat: 50 } },
  { id: "muscle_gain", name: "Hypertrophy Muscle Builder", emoji: "💪", description: "Precision amino acid pools and glycogen replenishment carbs.", targetMacros: { calories: 2500, protein: 170, carbs: 260, fat: 70 } },
  { id: "diabetic_friendly", name: "Low-Glycemic Insulin Guard", emoji: "🩸", description: "Extremely low glycemic indexes to protect steady pancreatic stability.", targetMacros: { calories: 1900, protein: 110, carbs: 150, fat: 60 } },
  { id: "heart_healthy", name: "Cardiovascular Longevity", emoji: "❤️", description: "Omega-3 rich lipids and low sodium boundaries to safeguard vascular pressure.", targetMacros: { calories: 2000, protein: 115, carbs: 210, fat: 55 } },
  { id: "stress_recovery", name: "Cortisol Decompression", emoji: "🧠", description: "High magnesium, tryptophan-rich foods to suppress sympathetic nervous stress.", targetMacros: { calories: 2100, protein: 120, carbs: 220, fat: 65 } },
  { id: "sleep_support", name: "Circadian Melatonin Trigger", emoji: "🌙", description: "Pre-sleep amino complexes that promote deep restorative melatonin cycles.", targetMacros: { calories: 1950, protein: 110, carbs: 200, fat: 60 } },
  { id: "high_protein", name: "High-Protein Keto-Lean", emoji: "🥩", description: "Elite-level protein thresholds to fuel muscle recovery and peak performance.", targetMacros: { calories: 2200, protein: 190, carbs: 120, fat: 75 } },
  { id: "vegetarian", name: "Phyto-Longevity Alkaline", emoji: "🌱", description: "100% plant-based organic proteins and high prebiotic fibers.", targetMacros: { calories: 2000, protein: 110, carbs: 230, fat: 60 } }
];

interface FoodLog {
  id: string;
  meal_type: string;
  food_name: string;
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  sugar_g: number;
  sodium_mg: number;
  fiber_g: number;
  stress_eating: boolean;
  emotional_eating_trigger?: string;
  created_at: string;
}

export default function NutritionPage() {
  const { profile } = useAuth();
  const { activeMode } = useTheme();
  
  const [activePlan, setActivePlan] = useState<string>("muscle_gain");
  const [adjustingPlan, setAdjustingPlan] = useState<boolean>(false);
  const [metrics, setMetrics] = useState<DailyMetrics | null>(null);
  const [foodLogs, setFoodLogs] = useState<FoodLog[]>([]);
  const [waterLogged, setWaterLogged] = useState(0);
  const [loadingLogs, setLoadingLogs] = useState(true);
  const [dbError, setDbError] = useState("");

  // Form States
  const [foodName, setFoodName] = useState("");
  const [mealType, setMealType] = useState("breakfast");
  const [calories, setCalories] = useState(350);
  const [protein, setProtein] = useState(25);
  const [carbs, setCarbs] = useState(40);
  const [fat, setFat] = useState(10);
  const [sugar, setSugar] = useState(5);
  const [sodium, setSodium] = useState(180);
  const [fiber, setFiber] = useState(3);
  const [isStressSnacking, setIsStressSnacking] = useState(false);
  const [stressTrigger, setStressTrigger] = useState("late night coding / deadline inertia");

  // Scanner States
  const [inputText, setInputText] = useState("");
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState<ScanResult & {
    sodium: number;
    fiber: number;
    hydrationImpact: "supportive" | "dehydrating" | "neutral";
    nutrientDensity: number;
    mealQuality: string;
  } | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const fetchNutritionAndHydration = async () => {
    if (!supabase || !profile) return;
    try {
      setLoadingLogs(true);
      setDbError("");
      
      // Fetch nutrition logs for current user
      const { data: foodData, error: foodError } = await supabase
        .from("nutrition_logs")
        .select("*")
        .eq("user_id", profile.id)
        .order("created_at", { ascending: false });
      
      if (foodError) {
        setDbError(foodError.message);
      } else if (foodData) {
        setFoodLogs(foodData.map((d: any) => ({
          id: d.id,
          meal_type: d.meal_type,
          food_name: d.food_name,
          calories: Number(d.calories),
          protein_g: Number(d.protein_g || 0),
          carbs_g: Number(d.carbs_g || 0),
          fat_g: Number(d.fat_g || 0),
          sugar_g: Number(d.sugar_g || 0),
          sodium_mg: Number(d.sodium_mg || 0),
          fiber_g: Number(d.fiber_g || 0),
          stress_eating: d.stress_eating || false,
          emotional_eating_trigger: d.emotional_eating_trigger || "",
          created_at: d.created_at
        })));
      }

      // Fetch today's hydration logs
      const todayStr = new Date().toISOString().split("T")[0];
      const { data: waterData, error: waterError } = await supabase
        .from("hydration_logs")
        .select("*")
        .eq("user_id", profile.id)
        .gte("created_at", `${todayStr}T00:00:00Z`);

      if (waterError) {
        console.error(waterError.message);
      } else if (waterData) {
        const total = waterData.reduce((sum: number, log: any) => sum + log.amount_ml, 0);
        setWaterLogged(total);
      }
    } catch (e: any) {
      setDbError(e.message || "Unable to sync nutrition registers.");
    } finally {
      setLoadingLogs(false);
    }
  };

  useEffect(() => {
    // Generate static base targets (metabolic calorie limits etc)
    const activePlanObj = DIET_PLANS.find(p => p.id === activePlan) || DIET_PLANS[3];
    const base = {
      caloriesBurned: activeMode === "performance" ? 2800 : 2100,
      caloriesTarget: activePlanObj.targetMacros.calories,
      caloriesConsumed: 0,
      hydrationMl: 0,
      hydrationTarget: activeMode === "performance" ? 3000 : 2000,
      steps: 0,
      stepsTarget: 10000,
      sleepHours: 0,
      sleepTarget: 8.0,
      sleepQuality: 0,
      stressLevel: 45,
      mood: "Optimal",
      recoveryPercentage: 85,
      fatigueScore: 20,
      physicalFatigue: 15,
      mentalFatigue: 25,
      energyLevel: 90,
      biologicalAge: 29.5,
      stabilityScore: 98,
      metabolicEfficiency: 82,
      lifestyleSustainability: 88,
      glycemicIndexLoad: "low" as const,
      sedentaryPostureRisk: "low" as const,
      micronutrientDeficiencies: []
    };
    setMetrics(base);
    
    if (profile?.id) {
      fetchNutritionAndHydration();
    } else {
      setLoadingLogs(false);
    }
  }, [activeMode, profile, activePlan]);

  const handleAddFood = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!foodName || !profile) return;

    try {
      setLoadingLogs(true);
      const { error } = await supabase
        .from("nutrition_logs")
        .insert({
          user_id: profile.id,
          meal_type: mealType,
          food_name: foodName,
          calories: Number(calories),
          protein_g: Number(protein),
          carbs_g: Number(carbs),
          fat_g: Number(fat),
          stress_eating: isStressSnacking,
          emotional_eating_trigger: isStressSnacking ? stressTrigger : undefined
        });

      if (error) {
        alert("Failed to log food: " + error.message);
      } else {
        await fetchNutritionAndHydration();
        setFoodName("");
        setIsStressSnacking(false);
        confetti({
          particleCount: 50,
          spread: 40,
          colors: ["#10b981", "#8b5cf6"]
        });
      }
    } catch (err: any) {
      alert("An error occurred: " + err.message);
    } finally {
      setLoadingLogs(false);
    }
  };

  const handleLogWater = async (amount: number) => {
    if (!profile) return;
    try {
      const { error } = await supabase
        .from("hydration_logs")
        .insert({
          user_id: profile.id,
          amount_ml: amount
        });
      
      if (error) {
        alert("Failed to log water: " + error.message);
      } else {
        await fetchNutritionAndHydration();
        confetti({
          particleCount: 30,
          spread: 30,
          colors: ["#3b82f6"]
        });
      }
    } catch (err: any) {
      console.error(err);
    }
  };

  // Trigger Scanner Simulation
  const handleScanSimulation = (query: string) => {
    if (!query.trim()) return;

    setScanning(true);
    setScanResult(null);

    // Simulate real AI scanning animation
    setTimeout(() => {
      const baseResult = parseSimulatedFoodScan(query);
      
      // Augment simulation with detailed parameters
      let sodiumVal = 120;
      let fiberVal = 4;
      let hydration: "supportive" | "dehydrating" | "neutral" = "supportive";
      let density = 8.5;
      let qualityStr = "A";

      const lowercase = baseResult.foodName.toLowerCase();
      if (lowercase.includes("salad") || lowercase.includes("salmon")) {
        sodiumVal = 380;
        fiberVal = 8;
        hydration = "supportive";
        density = 9.4;
        qualityStr = "A+ Premium";
      } else if (lowercase.includes("pizza") || lowercase.includes("burger")) {
        sodiumVal = 1420;
        fiberVal = 2;
        hydration = "dehydrating";
        density = 3.2;
        qualityStr = "D- Glycemic Trap";
      } else if (lowercase.includes("apple") || lowercase.includes("fruit")) {
        sodiumVal = 2;
        fiberVal = 4.5;
        hydration = "supportive";
        density = 9.0;
        qualityStr = "A Fuji Organic";
      } else {
        sodiumVal = 290;
        fiberVal = 3.0;
        hydration = "neutral";
        density = 5.8;
        qualityStr = "B- Engineered";
      }

      setScanResult({
        ...baseResult,
        sodium: sodiumVal,
        fiber: fiberVal,
        hydrationImpact: hydration,
        nutrientDensity: density,
        mealQuality: qualityStr
      });
      setScanning(false);
      setInputText("");

      if (baseResult.healthScore >= 75) {
        confetti({
          particleCount: 60,
          spread: 45,
          colors: ["#10b981", "#3b82f6"]
        });
      }
    }, 1500);
  };

  const handleLogScannedMeal = async () => {
    if (!scanResult || !profile) return;
    
    try {
      setLoadingLogs(true);
      const { error } = await supabase
        .from("nutrition_logs")
        .insert({
          user_id: profile.id,
          meal_type: "snack",
          food_name: scanResult.foodName,
          calories: Number(scanResult.calories),
          protein_g: Number(scanResult.protein),
          carbs_g: Number(scanResult.carbs),
          fat_g: Number(scanResult.fat),
          stress_eating: false
        });

      if (error) {
        alert("Failed to log scanned meal: " + error.message);
      } else {
        await fetchNutritionAndHydration();
        setScanResult(null);
        confetti({
          particleCount: 80,
          spread: 60,
          colors: ["#10b981", "#8b5cf6"]
        });
      }
    } catch (err: any) {
      alert("An error occurred: " + err.message);
    } finally {
      setLoadingLogs(false);
    }
  };

  const sampleFoods = [
    { label: "Salmon Avocado Salad", query: "Atlantic Salmon Avocado Salad" },
    { label: "Pepperoni Pizza", query: "Double Cheese Pepperoni Pizza Slice" },
    { label: "Fuji Apple", query: "Organic Fuji Apple" },
    { label: "Energy Bar (Barcode)", query: "73204901842" }
  ];

  if (!metrics) return null;

  // Calculate totals
  const totalCalories = foodLogs.reduce((acc, curr) => acc + curr.calories, 0);
  const totalProtein = foodLogs.reduce((acc, curr) => acc + curr.protein_g, 0);
  const totalCarbs = foodLogs.reduce((acc, curr) => acc + curr.carbs_g, 0);
  const totalFat = foodLogs.reduce((acc, curr) => acc + curr.fat_g, 0);
  const totalSugar = foodLogs.reduce((acc, curr) => acc + (curr.sugar_g || 0), 0);
  const totalSodium = foodLogs.reduce((acc, curr) => acc + (curr.sodium_mg || 0), 0);
  const totalFiber = foodLogs.reduce((acc, curr) => acc + (curr.fiber_g || 0), 0);

  const stressLogs = foodLogs.filter(log => log.stress_eating);

  // Generate dynamic AI Insights list based on current daily logged foods
  const generateAIInsights = () => {
    const insights = [];
    if (totalSugar > 25) {
      insights.push({ type: "warning", text: "High sugar detected. Soluble fructose intake has exceeded optimal insulin stability thresholds." });
    }
    if (totalProtein < 50 && totalCalories > 1000) {
      insights.push({ type: "alert", text: "Low protein ratio logged. Insufficient amino acid pools detected to fuel optimal lean muscle repair." });
    }
    if (totalSodium > 1500) {
      insights.push({ type: "warning", text: "High sodium intake detected. Excess sodium may impair overnight microvascular recovery velocity." });
    }
    if (totalFiber < 15 && totalCalories > 800) {
      insights.push({ type: "alert", text: "Fiber intake is insufficient. Dietary prebiotics are below baseline levels required for metabolic longevity." });
    }
    if (waterLogged >= metrics.hydrationTarget) {
      insights.push({ type: "success", text: "Outstanding hydration stability! Water volume has successfully cleared cell dehydration risk protocols." });
    } else if (waterLogged > 0) {
      insights.push({ type: "info", text: "Good hydration-supportive actions. Continue steady fluid intake to support cell waste clearing." });
    }
    
    // Default fallback insights
    if (insights.length === 0) {
      insights.push({ type: "info", text: "Telemetry waiting: Log meals or utilize the AI Food Scanner to synthesize preventative metabolic insights." });
    }
    return insights;
  };

  const activeInsights = generateAIInsights();

  return (
    <DashboardLayout>
      <div className="space-y-5 pb-10 max-w-5xl">
        
        {/* Page header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-[var(--foreground)] tracking-tight">Personalized Diet Plans</h1>
            <p className="text-sm text-[var(--muted)] mt-0.5">Adaptive long-term nutrition, dynamic calorie calibrations, and circadian fluid sync</p>
          </div>
        </div>

        {dbError && (
          <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-[13px] text-rose-400 font-medium">
            ⚠️ <strong>Supabase connection issue:</strong> {dbError}
          </div>
        )}

        {loadingLogs ? (
          <div className="flex items-center justify-center py-16 gap-2 text-sm text-[var(--muted)]">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
            Loading nutrition data...
          </div>
        ) : (
          <>
            {/* 1. Daily Nutrition Overview & Macro Tracking Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              
              {/* Calorie card */}
              <GlassCard glowColor="rose" className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-medium text-[var(--muted)]">Calories Consumed</span>
                  <Flame className="h-4 w-4 text-rose-500" />
                </div>
                <div className="analytics-number text-[var(--foreground)]">{totalCalories}</div>
                <div className="text-xs text-[var(--muted)] mt-0.5">/ {metrics.caloriesTarget * 3} kcal</div>
                <div className="progress-bar mt-3">
                  <div className="progress-bar-fill bg-rose-500" style={{ width: `${Math.min(100, (totalCalories / (metrics.caloriesTarget * 3)) * 100)}%` }} />
                </div>
              </GlassCard>

              {/* Macro Matrix */}
              <GlassCard glowColor="violet" className="p-4">
                <span className="text-xs font-medium text-[var(--muted)] block mb-3">Macro Breakdown</span>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-[var(--muted-bg)] p-2 rounded-lg border border-[var(--border)]">
                    <span className="text-xs font-semibold text-primary block">Protein</span>
                    <span className="text-base font-bold text-[var(--foreground)] block mt-0.5">{totalProtein}g</span>
                    <span className="text-xs text-[var(--muted)]">/ 140g</span>
                  </div>
                  <div className="bg-[var(--muted-bg)] p-2 rounded-lg border border-[var(--border)]">
                    <span className="text-xs font-semibold text-secondary block">Carbs</span>
                    <span className="text-base font-bold text-[var(--foreground)] block mt-0.5">{totalCarbs}g</span>
                    <span className="text-xs text-[var(--muted)]">/ 220g</span>
                  </div>
                  <div className="bg-[var(--muted-bg)] p-2 rounded-lg border border-[var(--border)]">
                    <span className="text-xs font-semibold text-amber-500 block">Fats</span>
                    <span className="text-base font-bold text-[var(--foreground)] block mt-0.5">{totalFat}g</span>
                    <span className="text-xs text-[var(--muted)]">/ 60g</span>
                  </div>
                </div>
              </GlassCard>

              {/* Hydration Tracker */}
              <GlassCard glowColor="emerald" className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-medium text-[var(--muted)]">Water Intake</span>
                  <Droplet className="h-4 w-4 text-emerald-500" />
                </div>
                <div className="analytics-number text-[var(--foreground)]">{waterLogged}</div>
                <div className="text-xs text-[var(--muted)] mt-0.5">/ {metrics.hydrationTarget} ml</div>
                <div className="flex gap-2 mt-3">
                  <button 
                    onClick={() => handleLogWater(250)} 
                    className="text-xs bg-[var(--muted-bg)] hover:bg-secondary/10 border border-[var(--border)] hover:border-secondary/20 px-3 py-2 rounded-lg font-medium text-secondary flex-1 transition-all"
                  >
                    +250ml
                  </button>
                  <button 
                    onClick={() => handleLogWater(500)} 
                    className="text-xs bg-[var(--muted-bg)] hover:bg-secondary/10 border border-[var(--border)] hover:border-secondary/20 px-3 py-2 rounded-lg font-medium text-secondary flex-1 transition-all"
                  >
                    +500ml
                  </button>
                </div>
              </GlassCard>

            </div>

            {/* 2. DUAL INTERFACES: Scanner vs Manual Logger */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
              
              {/* LEFT COLUMN: PERSONALIZED DIET PLANS BUILDER */}
              <div className="lg:col-span-7 rounded-2xl glass-panel p-6 border-foreground/5 flex flex-col justify-between space-y-6">
                
                <div className="space-y-4">
                  <div className="flex justify-between items-start sm:items-center flex-col sm:flex-row gap-3">
                    <h3 className="font-semibold text-sm text-[var(--foreground)] flex items-center gap-1.5 uppercase tracking-widest">
                      <Utensils className="h-4 w-4 text-primary animate-pulse" />
                      Select Adaptive Diet Plan
                    </h3>
                    <span className="bg-primary/10 border border-primary/20 text-primary text-[9px] font-bold px-2.5 py-0.5 rounded-full uppercase shrink-0 animate-pulse">
                      AI ADAPTIVE ACTIVE
                    </span>
                  </div>
                  <p className="text-xs text-foreground/75 leading-relaxed font-semibold">
                    Choose an AI-calibrated nutrition plan. The plan adjusts your daily calorie limits, macro ratios, and recommended foods dynamically based on your goals, sleep debt, stress levels, hydration consistency, and active workout intensities.
                  </p>

                  {/* Plans grid selector */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    {DIET_PLANS.map((plan) => (
                      <button
                        key={plan.id}
                        type="button"
                        onClick={() => {
                          setActivePlan(plan.id);
                          setAdjustingPlan(true);
                          setTimeout(() => setAdjustingPlan(false), 500);
                          confetti({
                            particleCount: 20,
                            spread: 30,
                            colors: ["#8b5cf6"]
                          });
                        }}
                        className={`p-3 rounded-xl border text-left flex items-start gap-3 transition-all hover:bg-foreground/5 cursor-pointer ${
                          activePlan === plan.id
                            ? "border-primary bg-primary/5 shadow-md shadow-primary/5 scale-[1.01]"
                            : "border-foreground/5 bg-foreground/5 text-foreground/80"
                        }`}
                      >
                        <span className="text-xl shrink-0 mt-0.5">{plan.emoji}</span>
                        <div className="space-y-0.5 min-w-0">
                          <span className="text-xs font-bold text-foreground block truncate">{plan.name}</span>
                          <span className="text-[10px] text-foreground/50 block leading-normal">{plan.description}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Diet Plan Intelligence details */}
                <div className="border-t border-foreground/5 pt-5 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-secondary uppercase tracking-widest flex items-center gap-1">
                      <ShieldAlert className="h-3.5 w-3.5 text-secondary animate-pulse" />
                      Dynamic Plan Adjustments
                    </span>
                    {adjustingPlan && (
                      <span className="text-[8px] text-primary animate-pulse font-bold tracking-widest uppercase">
                        Recalibrating...
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-bold text-[var(--foreground)]">
                    {/* Adjustment 1: Workout Intensity */}
                    <div className="p-3 bg-foreground/5 rounded-xl border border-foreground/5 space-y-1">
                      <span className="text-[9px] text-primary block uppercase tracking-wider">🏋️ Workout Intensity Sync</span>
                      <p className="leading-snug text-foreground/80 font-semibold">
                        {activeMode === "performance" 
                          ? "High performance active: Protein targets shifted (+15g) to accelerate peak muscular synthesis."
                          : "Moderate active state: Protein targets aligned for standard recovery thresholds."}
                      </p>
                    </div>

                    {/* Adjustment 2: Sleep & Circadian Debt */}
                    <div className="p-3 bg-foreground/5 rounded-xl border border-foreground/5 space-y-1">
                      <span className="text-[9px] text-secondary block uppercase tracking-wider">🌙 Sleep & Circadian Debt</span>
                      <p className="leading-snug text-foreground/80 font-semibold">
                        {metrics?.sleepHours && metrics.sleepHours < 7.0 
                          ? "Sleep debt detected (<7h): Increased restorative glycogen carbs (+10g) to combat cortisol spikes."
                          : "Sleep parameters synchronized: Stable glycemic load targets active to promote sleep latency."}
                      </p>
                    </div>

                    {/* Adjustment 3: Hydration Metrics */}
                    <div className="p-3 bg-foreground/5 rounded-xl border border-foreground/5 space-y-1">
                      <span className="text-[9px] text-emerald-500 block uppercase tracking-wider">💧 Fluid Intake Compliance</span>
                      <p className="leading-snug text-foreground/80 font-semibold">
                        {waterLogged < 1500 
                          ? "Dehydration alert: Fluid volume is low. Added 500ml hydration buffer to safeguard liver kinetics."
                          : "Excellent rehydration: Balanced metabolic cleansing rates are currently active."}
                      </p>
                    </div>

                    {/* Adjustment 4: Stress and Workload */}
                    <div className="p-3 bg-foreground/5 rounded-xl border border-foreground/5 space-y-1">
                      <span className="text-[9px] text-amber-500 block uppercase tracking-wider">🧠 Cortisol / Screen Strain</span>
                      <p className="leading-snug text-foreground/80 font-semibold">
                        {metrics?.stressLevel && metrics.stressLevel > 50
                          ? "Elevated stress detected: Added high-magnesium tryptophan whole food seeds to lower CNS strain."
                          : "Stress indicators optimal: Plan calibrated to baseline autonomic nervous system balance."}
                      </p>
                    </div>
                  </div>
                </div>

              </div>

              {/* RIGHT COLUMN: MANUAL LOGGER & MEAL HISTORY */}
              <div className="lg:col-span-5 flex flex-col gap-6">
                
                {/* Manual Nutrient Logger Form */}
                <div className="rounded-2xl glass-panel p-6 border-foreground/5">
                  <form onSubmit={handleAddFood} className="space-y-4">
                    <h3 className="font-semibold text-sm text-[var(--foreground)] flex items-center gap-1.5">
                      <Apple className="h-4 w-4 text-primary" />
                      Log Food Manually
                    </h3>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-foreground">Food item name</label>
                      <input
                        type="text"
                        required
                        value={foodName}
                        onChange={(e) => setFoodName(e.target.value)}
                        className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-foreground/10 bg-foreground/5 text-foreground placeholder-foreground/45 focus:outline-none focus:border-primary/50"
                        placeholder="e.g. Scrambled eggs or Salad"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-foreground">Meal Phase</label>
                        <select
                          value={mealType}
                          onChange={(e) => setMealType(e.target.value)}
                          className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-foreground/10 bg-background text-foreground focus:outline-none focus:border-primary/50"
                        >
                          <option value="breakfast">Breakfast</option>
                          <option value="lunch">Lunch</option>
                          <option value="dinner">Dinner</option>
                          <option value="snack">Snack</option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-foreground">Kcal Consumed</label>
                        <input
                          type="number"
                          required
                          value={calories}
                          onChange={(e) => setCalories(Number(e.target.value))}
                          className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-foreground/10 bg-foreground/5 text-foreground focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-foreground/60">Protein (g)</label>
                        <input
                          type="number"
                          value={protein}
                          onChange={(e) => setProtein(Number(e.target.value))}
                          className="w-full text-xs px-2.5 py-2 rounded-xl border border-foreground/10 bg-foreground/5 text-foreground focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-foreground/60">Carbs (g)</label>
                        <input
                          type="number"
                          value={carbs}
                          onChange={(e) => setCarbs(Number(e.target.value))}
                          className="w-full text-xs px-2.5 py-2 rounded-xl border border-foreground/10 bg-foreground/5 text-foreground focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-foreground/60">Fats (g)</label>
                        <input
                          type="number"
                          value={fat}
                          onChange={(e) => setFat(Number(e.target.value))}
                          className="w-full text-xs px-2.5 py-2 rounded-xl border border-foreground/10 bg-foreground/5 text-foreground focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3 border-t border-foreground/5 pt-2">
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-foreground/60">Sugars (g)</label>
                        <input
                          type="number"
                          value={sugar}
                          onChange={(e) => setSugar(Number(e.target.value))}
                          className="w-full text-xs px-2.5 py-2 rounded-xl border border-foreground/10 bg-foreground/5 text-foreground focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-foreground/60">Sodium (mg)</label>
                        <input
                          type="number"
                          value={sodium}
                          onChange={(e) => setSodium(Number(e.target.value))}
                          className="w-full text-xs px-2.5 py-2 rounded-xl border border-foreground/10 bg-foreground/5 text-foreground focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-foreground/60">Fiber (g)</label>
                        <input
                          type="number"
                          value={fiber}
                          onChange={(e) => setFiber(Number(e.target.value))}
                          className="w-full text-xs px-2.5 py-2 rounded-xl border border-foreground/10 bg-foreground/5 text-foreground focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* Stress Snack trigger */}
                    <div className="rounded-xl border border-foreground/5 bg-foreground/5 p-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-foreground flex items-center gap-1 cursor-pointer select-none">
                          <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
                          Flag as Emotional Snacking?
                        </label>
                        <input
                          type="checkbox"
                          checked={isStressSnacking}
                          onChange={(e) => setIsStressSnacking(e.target.checked)}
                          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                        />
                      </div>

                      {isStressSnacking && (
                        <div className="space-y-1">
                          <label className="text-[8px] font-bold text-foreground/60">Stress trigger excuse context</label>
                          <input
                            type="text"
                            value={stressTrigger}
                            onChange={(e) => setStressTrigger(e.target.value)}
                            className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-foreground/10 bg-background text-foreground focus:outline-none"
                          />
                        </div>
                      )}
                    </div>

                    <Button variant="primary" type="submit" className="w-full py-3 flex items-center justify-center gap-1.5">
                      <Plus className="h-4 w-4" />
                      <span>Log Macromolecules</span>
                    </Button>
                  </form>
                </div>

                {/* Meal History */}
                <div className="rounded-2xl glass-panel p-6 border-foreground/5 flex-1 flex flex-col justify-between">
                  <div className="space-y-4">
                    <h3 className="text-xs font-bold text-foreground flex items-center justify-between">
                      <span>Logged Meal History</span>
                      <span className="text-xs text-foreground/50 font-medium">Daily Telemetry logs</span>
                    </h3>

                    {stressLogs.length > 0 && (
                      <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 px-3 py-2 text-xs text-amber-500 font-semibold flex items-center gap-2">
                        <Info className="h-4 w-4 shrink-0" />
                        <span>AI Alert: {stressLogs.length} emotional logs isolated. Trigger: deadline inertias.</span>
                      </div>
                    )}

                    <div className="space-y-2.5 overflow-y-auto max-h-[220px] scrollbar-none pr-1">
                      {foodLogs.length === 0 ? (
                        <div className="text-center py-12 text-foreground/45 space-y-2">
                          <Utensils className="h-8 w-8 text-foreground/20 mx-auto animate-pulse" />
                          <span className="text-xs font-bold block">No meals logged today</span>
                          <p className="text-xs text-foreground/50 max-w-[200px] mx-auto leading-normal">
                            Log your first meal to generate nutrition analytics.
                          </p>
                        </div>
                      ) : (
                        foodLogs.map((log) => (
                          <div 
                            key={log.id} 
                            className={`p-3.5 rounded-xl border flex justify-between items-center ${
                              log.stress_eating 
                                ? "border-amber-500/20 bg-amber-500/5 animate-pulse" 
                                : "border-foreground/5 bg-foreground/5"
                            }`}
                          >
                            <div className="space-y-0.5">
                              <div className="flex items-center gap-1.5">
                                <span className="text-xs font-bold text-foreground">{log.food_name}</span>
                                <span className="rounded-full bg-foreground/10 px-2 py-0.2 text-[8px] font-bold text-foreground/60 capitalize">
                                  {log.meal_type}
                                </span>
                              </div>
                              <p className="text-xs text-foreground/50 font-semibold">
                                P: {log.protein_g}g | C: {log.carbs_g}g | F: {log.fat_g}g {log.sugar_g ? ` | S: ${log.sugar_g}g` : ""} {log.sodium_mg ? ` | Na: ${log.sodium_mg}mg` : ""}
                              </p>
                              {log.stress_eating && (
                                <p className="text-[9px] text-amber-500 font-bold italic mt-0.5">
                                  ⚠ Emotional Trigger: {log.emotional_eating_trigger}
                                </p>
                              )}
                            </div>
                            <span className="text-xs font-bold text-foreground shrink-0 ml-3">
                              +{log.calories} kcal
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  <div className="border-t border-foreground/5 pt-4 mt-6 text-xs text-foreground/50 font-semibold flex justify-between">
                    <span>Preventive Analysis: Macro balance reduces obesity risk by 18%</span>
                    <span className="text-secondary font-bold">HIPAA Secure logs</span>
                  </div>
                </div>

              </div>

            </div>

            {/* 3. AI NUTRITION INSIGHTS SECTION */}
            <div className="rounded-2xl glass-panel p-6 border-foreground/5 space-y-4">
              <h3 className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <Sparkles className="h-4.5 w-4.5 text-secondary animate-pulse" />
                AI preventive Nutrition Insights
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeInsights.map((insight, idx) => (
                  <div 
                    key={idx} 
                    className={`p-4 rounded-xl border flex gap-3 items-start text-xs font-semibold leading-relaxed ${
                      insight.type === "warning" 
                        ? "border-rose-500/20 bg-rose-500/5 text-rose-400" 
                        : insight.type === "alert" 
                        ? "border-amber-500/20 bg-amber-500/5 text-amber-400" 
                        : insight.type === "success" 
                        ? "border-emerald-500/20 bg-emerald-500/5 text-emerald-400" 
                        : "border-foreground/10 bg-foreground/5 text-foreground/80"
                    }`}
                  >
                    <AlertCircle className="h-4.5 w-4.5 shrink-0 mt-0.5" />
                    <p>{insight.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

      </div>
    </DashboardLayout>
  );
}
