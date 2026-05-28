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
  CheckCircle, 
  AlertCircle,
  Moon,
  Activity,
  Calendar,
  ShieldAlert,
  Check,
  Star,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Award,
  Heart,
  BarChart2
} from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import GlassCard from "@/components/ui/GlassCard";
import Button from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import confetti from "canvas-confetti";
import { supabase } from "@/utils/supabase";
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  LineChart, 
  Line 
} from "recharts";

interface Meal {
  mealType: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  whyHelps: string;
  recoveryBenefits: string;
  energyBenefits: string;
  hydrationSupport: string;
}

interface FoodLog {
  id: string;
  meal_type: string;
  food_name: string;
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  created_at: string;
}

// Preset Alternatives library for meal swaps
const ALTERNATIVES_DATABASE: Record<string, Omit<Meal, "mealType">[]> = {
  breakfast: [
    { name: "Scrambled Tofu with Spinach & Avocado", calories: 310, protein: 20, carbs: 12, fat: 18, whyHelps: "Light, clean plant protein that sustains focus without early morning insulin spikes.", recoveryBenefits: "Rich in magnesium to relax muscle fibers and support thyroid kinetics.", energyBenefits: "Low glycemic starches provide 4 hours of steady cognitive fuel.", hydrationSupport: "High water content veggies contribute to cellular rehydration." },
    { name: "Greek Yogurt Parfait with Mixed Berries & Walnuts", calories: 340, protein: 26, carbs: 24, fat: 12, whyHelps: "High-protein recovery base with prebiotic fibers and healthy fats.", recoveryBenefits: "Slow-release casein proteins feed muscles and reduce muscle breakdown.", energyBenefits: "Steady energy profile backed by healthy brain-boosting omega-3 lipids.", hydrationSupport: "High electrolyte calcium content promotes neural fluid transfer." },
    { name: "Spiced Vegetable Poha with Peanuts", calories: 290, protein: 12, carbs: 42, fat: 9, whyHelps: "Traditional low-glycemic flattened rice providing excellent carb-loading stamina.", recoveryBenefits: "B-vitamins help synthesize glucose into muscular ATP recovery stores.", energyBenefits: "Light, easily digestible complex carbs ideal for active mornings.", hydrationSupport: "Pair with fresh lemon juice to bolster mineral electrolyte assimilation." }
  ],
  lunch: [
    { name: "Spiced Paneer Tikka Salad with Mint Chutney", calories: 480, protein: 24, carbs: 16, fat: 28, whyHelps: "Satisfying vegetarian fuel rich in calcium, fats and clean proteins.", recoveryBenefits: "Calcium pools facilitate muscular contraction and joint cartilage support.", energyBenefits: "Ketogenic fats provide slow, smooth ketone energy for stable afternoons.", hydrationSupport: "Hydrating cucumber and mint base supports kidney filtration." },
    { name: "Lentil Chickpea Quinoa Salad Bowl", calories: 450, protein: 22, carbs: 62, fat: 10, whyHelps: "Fiber-rich plant powerhouse containing complete vegetarian amino acids.", recoveryBenefits: "Plant iron helps oxygenate working muscle tissues to reduce fatigue.", energyBenefits: "High prebiotic fiber slows digestion to eliminate mid-day energy crashes.", hydrationSupport: "Rich in potassium to safeguard fluid boundaries inside cells." },
    { name: "Tender Grilled Chicken Avocado Sourdough Wrap", calories: 510, protein: 36, carbs: 38, fat: 16, whyHelps: "Optimal lean muscle fuel with high essential aminos and rich fat carriers.", recoveryBenefits: "Lean poultry aminos speed up post-workout muscle protein synthesis.", energyBenefits: "Complex grains paired with healthy avocado fats keep stamina peaked.", hydrationSupport: "Low sodium composition protects optimal blood pressure levels." }
  ],
  dinner: [
    { name: "Baked Cod Fillet with Roasted Asparagus", calories: 380, protein: 32, carbs: 14, fat: 10, whyHelps: "Highly digestible marine protein that prevents heavy overnight digestion strain.", recoveryBenefits: "Lean aminos facilitate tissue repair during deep sleep phases.", energyBenefits: "Keeps morning insulin levels low for optimal waking energy.", hydrationSupport: "Asparagus acts as a natural prebiotic fluid flush agent." },
    { name: "Hearty Black Bean & Lentil Chili with Cornbread", calories: 460, protein: 20, carbs: 68, fat: 8, whyHelps: "Fiber-rich evening bowl to sustain overnight metabolic activity.", recoveryBenefits: "High dietary magnesium supports parasympathetic muscle relaxation.", energyBenefits: "Slow starches stabilize baseline overnight growth hormone cycles.", hydrationSupport: "Lentil broths restore baseline systemic hydration balances." },
    { name: "Grilled Paneer & Stir-Fry Broccoli in Soy Sesame", calories: 430, protein: 22, carbs: 18, fat: 22, whyHelps: "High-protein, low-sugar evening plate to safeguard hormone pathways.", recoveryBenefits: "High amino density protects skeletal muscles from nocturnal catabolism.", energyBenefits: "Maintains optimal fat oxidation levels throughout overnight rest.", hydrationSupport: "Pair with warm herbal tea to maximize overnight hydration levels." }
  ],
  snack: [
    { name: "Roasted Makhana (Foxnuts) with Turmeric", calories: 140, protein: 4, carbs: 24, fat: 3, whyHelps: "Low-calorie, highly crunchy superfood to curb nervous eating cues.", recoveryBenefits: "Antioxidants suppress minor workout-induced muscle soreness.", energyBenefits: "Keeps blood sugars flat to prevent afternoon sluggishness.", hydrationSupport: "Turmeric curcumin aids systemic fluid cellular detox." },
    { name: "Whey / Plant Protein Shake with half a Banana", calories: 210, protein: 25, carbs: 20, fat: 2, whyHelps: "Rapid amino acid delivery to quickly replenish empty glycogen stores.", recoveryBenefits: "Direct muscular protein absorption accelerates hyper-recovery.", energyBenefits: "Quick potassium spike restores athletic focus and neural stamina.", hydrationSupport: "Mixes with 350ml fluid to directly target post-activity hydration." },
    { name: "Celery Sticks with Almond Butter", calories: 170, protein: 6, carbs: 10, fat: 13, whyHelps: "Highly crisp fat-burner snack rich in minerals and good fats.", recoveryBenefits: "Vitamins support immune function and counter cellular work strain.", energyBenefits: "Steady monounsaturated lipids keep nerve functions optimally calm.", hydrationSupport: "Celery is 95% water, restoring vital active fluid volumes." }
  ]
};

// Mock visual history chart data
const WEEKLY_TRENDS_DATA = [
  { name: "Mon", Target: 2200, Consumed: 1950, Protein: 125, Hydration: 2400 },
  { name: "Tue", Target: 2200, Consumed: 2100, Protein: 145, Hydration: 2800 },
  { name: "Wed", Target: 2200, Consumed: 1800, Protein: 110, Hydration: 2000 },
  { name: "Thu", Target: 2200, Consumed: 2450, Protein: 165, Hydration: 3200 },
  { name: "Fri", Target: 2200, Consumed: 2050, Protein: 135, Hydration: 2500 },
  { name: "Sat", Target: 2200, Consumed: 2300, Protein: 150, Hydration: 2700 },
  { name: "Sun", Target: 2200, Consumed: 1980, Protein: 120, Hydration: 2200 }
];

const SLEEP_NUTRITION_DATA = [
  { name: "Mon", Sleep: 6.2, NutritionScore: 68 },
  { name: "Tue", Sleep: 7.5, NutritionScore: 88 },
  { name: "Wed", Sleep: 5.8, NutritionScore: 60 },
  { name: "Thu", Sleep: 8.0, NutritionScore: 92 },
  { name: "Fri", Sleep: 7.0, NutritionScore: 85 },
  { name: "Sat", Sleep: 7.8, NutritionScore: 90 },
  { name: "Sun", Sleep: 7.2, NutritionScore: 82 }
];

export default function SmartNutritionPlansPage() {
  const { profile } = useAuth();
  const { activeMode } = useTheme();

  // Generator flow states
  const [plannerStep, setPlannerStep] = useState<"onboarding" | "generating" | "ready">("onboarding");
  const [selectedGoal, setSelectedGoal] = useState("Muscle Gain");
  const [selectedPreference, setSelectedPreference] = useState("Balanced");
  const [activePlan, setActivePlan] = useState<{
    plan: Meal[];
    insights: string[];
    habits: string[];
    warnings: string[];
  } | null>(null);

  const [loadingTextIndex, setLoadingTextIndex] = useState(0);
  const [waterLogged, setWaterLogged] = useState(0);
  const [foodLogs, setFoodLogs] = useState<FoodLog[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [expandedMeal, setExpandedMeal] = useState<string | null>(null);
  const [swappingMealType, setSwappingMealType] = useState<string | null>(null);

  // Stepper choices constants
  const GOAL_OPTIONS = [
    { id: "Weight Loss", label: "Weight Loss", icon: "📉", desc: "Burn fat steadily" },
    { id: "Weight Gain", label: "Weight Gain", icon: "📈", desc: "Increase lean mass" },
    { id: "Muscle Gain", label: "Muscle Gain", icon: "💪", desc: "Build strength & tone" },
    { id: "Better Energy", label: "Better Energy", icon: "⚡", desc: "Eradicate fatigue cycles" },
    { id: "Better Sleep", label: "Better Sleep", icon: "🌙", desc: "Calm evening hormone spikes" },
    { id: "Stress Recovery", label: "Stress Recovery", icon: "🧠", desc: "Lower nervous cortisol" },
    { id: "General Wellness", label: "General Wellness", icon: "🌱", desc: "Sustain cell longevity" }
  ];

  const PREFERENCE_OPTIONS = [
    { id: "Balanced", label: "Balanced", icon: "🍱", desc: "All macronutrient sources" },
    { id: "Vegetarian", label: "Vegetarian", icon: "🥗", desc: "Plant-based + dairy" },
    { id: "Vegan", label: "Vegan", icon: "🌿", desc: "100% strict plants only" },
    { id: "High Protein", label: "High Protein", icon: "🥩", desc: "Enhanced amino load" },
    { id: "South Indian", label: "South Indian", icon: "🥥", desc: "Rice, coconut, lentils" },
    { id: "North Indian", label: "North Indian", icon: "🫓", desc: "Wheat, paneer, spices" },
    { id: "Mediterranean", label: "Mediterranean", icon: "🫒", desc: "Olive oil, clean seafood" },
    { id: "Keto", label: "Keto", icon: "🥑", desc: "High-fat, low-carbs" },
    { id: "Low Sugar", label: "Low Sugar", icon: "🍋", desc: "Glucose spike protection" }
  ];

  const loadingPhrases = [
    "Ingesting biological telemetry...",
    "Analyzing workout recovery demands...",
    "Querying Gemini AI Metabolic Engine...",
    "Calibrating circadian macro thresholds...",
    "Synthesizing customized whole food schedules..."
  ];

  // Fetch logged meals & water
  const fetchLogs = async () => {
    if (!supabase || !profile) return;
    try {
      setLoadingHistory(true);
      const { data: foodData } = await supabase
        .from("nutrition_logs")
        .select("*")
        .eq("user_id", profile.id)
        .order("created_at", { ascending: false });

      if (foodData) {
        setFoodLogs(foodData.map((d: any) => ({
          id: d.id,
          meal_type: d.meal_type,
          food_name: d.food_name,
          calories: Number(d.calories),
          protein_g: Number(d.protein_g || 0),
          carbs_g: Number(d.carbs_g || 0),
          fat_g: Number(d.fat_g || 0),
          created_at: d.created_at
        })));
      }

      const todayStr = new Date().toISOString().split("T")[0];
      const { data: waterData } = await supabase
        .from("hydration_logs")
        .select("*")
        .eq("user_id", profile.id)
        .gte("created_at", `${todayStr}T00:00:00Z`);

      if (waterData) {
        const total = waterData.reduce((sum: number, log: any) => sum + log.amount_ml, 0);
        setWaterLogged(total);
      }
    } catch (e) {
      console.error("Supabase load error:", e);
    } finally {
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    if (profile?.id) {
      fetchLogs();
    } else {
      setLoadingHistory(false);
    }
  }, [profile]);

  // Loading text animator
  useEffect(() => {
    if (plannerStep === "generating") {
      const interval = setInterval(() => {
        setLoadingTextIndex(prev => (prev + 1) % loadingPhrases.length);
      }, 1200);
      return () => clearInterval(interval);
    }
  }, [plannerStep]);

  // Generate Plan via API
  const handleGeneratePlan = async () => {
    setPlannerStep("generating");
    setLoadingTextIndex(0);

    try {
      const response = await fetch("/api/nutrition-planner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          goal: selectedGoal,
          preference: selectedPreference,
          profile,
          metrics: {
            stressLevel: activeMode === "performance" ? 65 : 40,
            sleepHours: 7.2
          }
        })
      });

      if (response.ok) {
        const planData = await response.json();
        setActivePlan(planData);
        setPlannerStep("ready");
        confetti({
          particleCount: 100,
          spread: 70,
          colors: ["#8b5cf6", "#10b981", "#3b82f6"]
        });
      } else {
        throw new Error("API failed");
      }
    } catch (err) {
      console.error(err);
      // Fallback
      setPlannerStep("ready");
    }
  };

  // Add meal to Supabase Eaten Logs
  const handleMarkEaten = async (meal: Meal) => {
    if (!profile) return;
    try {
      const { error } = await supabase
        .from("nutrition_logs")
        .insert({
          user_id: profile.id,
          meal_type: meal.mealType,
          food_name: meal.name,
          calories: Number(meal.calories),
          protein_g: Number(meal.protein),
          carbs_g: Number(meal.carbs),
          fat_g: Number(meal.fat),
          stress_eating: false
        });

      if (!error) {
        await fetchLogs();
        confetti({
          particleCount: 40,
          spread: 30,
          colors: ["#10b981", "#8b5cf6"]
        });
      }
    } catch (err) {
      console.error("Mark eaten log fail:", err);
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
      
      if (!error) {
        await fetchLogs();
        confetti({
          particleCount: 25,
          spread: 25,
          colors: ["#3b82f6"]
        });
      }
    } catch (err) {
      console.error("Water log fail:", err);
    }
  };

  // Star Favorites Toggle
  const handleToggleFavorite = (mealName: string) => {
    setFavorites(prev => 
      prev.includes(mealName) 
        ? prev.filter(f => f !== mealName) 
        : [...prev, mealName]
    );
  };

  // Swap active meal with alternative
  const handleSwapMeal = (mealType: string, alt: Omit<Meal, "mealType">) => {
    if (!activePlan) return;
    const updatedMeals = activePlan.plan.map(m => {
      if (m.mealType === mealType) {
        return { ...alt, mealType };
      }
      return m;
    });
    setActivePlan({ ...activePlan, plan: updatedMeals });
    setSwappingMealType(null);
    confetti({
      particleCount: 30,
      spread: 30,
      colors: ["#3b82f6", "#10b981"]
    });
  };

  // Math totals from logged meals today
  const totalCalories = foodLogs.reduce((acc, curr) => acc + curr.calories, 0);
  const totalProtein = foodLogs.reduce((acc, curr) => acc + curr.protein_g, 0);
  const totalCarbs = foodLogs.reduce((acc, curr) => acc + curr.carbs_g, 0);
  const totalFat = foodLogs.reduce((acc, curr) => acc + curr.fat_g, 0);

  return (
    <DashboardLayout>
      <div className="space-y-6 pb-10 max-w-6xl">
        
        {/* Banner header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl glass-panel border-foreground/5 bg-gradient-to-r from-primary/10 via-background to-secondary/5 p-6">
          <div className="space-y-1">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight flex items-center gap-2">
              <Utensils className="h-6 w-6 text-primary animate-pulse" />
              Smart Nutrition Plans
            </h1>
            <p className="text-xs text-foreground/70 font-semibold">
              An intelligent nutrition coach that understands your habits, adapts daily meal recommendations, and protects your cellular energy.
            </p>
          </div>
          {plannerStep === "ready" && (
            <Button 
              variant="glass" 
              size="sm" 
              onClick={() => setPlannerStep("onboarding")} 
              className="text-xs font-bold shrink-0 flex items-center gap-1 border-primary/20 text-primary bg-primary/5"
            >
              <RefreshCw className="h-3 w-3" />
              Change Goal / Preference
            </Button>
          )}
        </div>

        {/* STEP 1 & 2: ONBOARDING QUESTIONS STEPPER */}
        {plannerStep === "onboarding" && (
          <div className="space-y-6 animate-[fadeIn_0.3s_ease-out]">
            <GlassCard glowColor="violet" className="p-6 space-y-6">
              
              {/* Question 1 */}
              <div className="space-y-4">
                <span className="text-xs font-bold text-primary flex items-center gap-1.5 uppercase tracking-widest">
                  <span className="h-4.5 w-4.5 rounded-full bg-primary/10 text-primary text-[10px] flex items-center justify-center font-bold">1</span>
                  What is your current wellness goal?
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
                  {GOAL_OPTIONS.map(opt => (
                    <button
                      key={opt.id}
                      onClick={() => setSelectedGoal(opt.id)}
                      className={`p-3 rounded-xl border text-center flex flex-col items-center justify-center gap-1.5 transition-all hover:bg-foreground/5 cursor-pointer ${
                        selectedGoal === opt.id
                          ? "border-primary bg-primary/5 shadow-md shadow-primary/5 scale-[1.03]"
                          : "border-foreground/5 bg-foreground/5 text-foreground/80"
                      }`}
                    >
                      <span className="text-2xl shrink-0">{opt.icon}</span>
                      <div className="space-y-0.5">
                        <span className="text-[11px] font-bold block">{opt.label}</span>
                        <span className="text-[8px] text-foreground/45 block font-semibold leading-tight">{opt.desc}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Question 2 */}
              <div className="space-y-4 border-t border-foreground/5 pt-6">
                <span className="text-xs font-bold text-secondary flex items-center gap-1.5 uppercase tracking-widest">
                  <span className="h-4.5 w-4.5 rounded-full bg-secondary/10 text-secondary text-[10px] flex items-center justify-center font-bold">2</span>
                  What kind of foods do you prefer?
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-9 gap-3">
                  {PREFERENCE_OPTIONS.map(opt => (
                    <button
                      key={opt.id}
                      onClick={() => setSelectedPreference(opt.id)}
                      className={`p-3 rounded-xl border text-center flex flex-col items-center justify-center gap-1.5 transition-all hover:bg-foreground/5 cursor-pointer ${
                        selectedPreference === opt.id
                          ? "border-secondary bg-secondary/5 shadow-md shadow-secondary/5 scale-[1.03]"
                          : "border-foreground/5 bg-foreground/5 text-foreground/80"
                      }`}
                    >
                      <span className="text-2xl shrink-0">{opt.icon}</span>
                      <div className="space-y-0.5">
                        <span className="text-[11px] font-bold block">{opt.label}</span>
                        <span className="text-[8px] text-foreground/45 block font-semibold leading-tight">{opt.desc}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Trigger Plan Generator */}
              <div className="border-t border-foreground/5 pt-5 flex justify-end">
                <Button 
                  variant="primary" 
                  onClick={handleGeneratePlan} 
                  className="px-6 py-3 text-xs font-bold flex items-center gap-1.5 bg-gradient-to-r from-primary to-secondary hover:from-primary/95 hover:to-secondary/95 shadow-lg shadow-primary/10"
                >
                  <Sparkles className="h-4.5 w-4.5 animate-pulse" />
                  Synthesize My AI Nutrition Plan
                </Button>
              </div>

            </GlassCard>
          </div>
        )}

        {/* LOADING SCREEN */}
        {plannerStep === "generating" && (
          <div className="flex flex-col items-center justify-center py-24 space-y-4 animate-[fadeIn_0.3s_ease-out]">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary/20 border-t-primary shrink-0" />
            <div className="text-center space-y-1">
              <span className="text-sm font-bold text-foreground block">Synthesizing Smart Plan</span>
              <p className="text-xs text-foreground/60 font-semibold animate-pulse">{loadingPhrases[loadingTextIndex]}</p>
            </div>
          </div>
        )}

        {/* READY PLAN STATE */}
        {plannerStep === "ready" && activePlan && (
          <div className="space-y-8 animate-[fadeIn_0.3s_ease-out]">

            {/* 1. DAILY MACRO PROGRESS TRACKER */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              
              {/* Calories card */}
              <GlassCard glowColor="rose" className="p-4 flex flex-col justify-between min-h-[110px]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold text-foreground/60 uppercase">Calories Logged</span>
                  <Flame className="h-4.5 w-4.5 text-rose-500" />
                </div>
                <div>
                  <h3 className="text-3xl font-black text-rose-500">{totalCalories} kcal</h3>
                  <div className="progress-bar mt-2 bg-foreground/5 h-1.5 rounded-full overflow-hidden">
                    <div className="progress-bar-fill bg-rose-500 h-full rounded-full" style={{ width: `${Math.min(100, (totalCalories / 2200) * 100)}%` }} />
                  </div>
                  <span className="text-[9px] font-bold text-foreground/45 block mt-1.5">Target Daily Ceiling: 2200 kcal</span>
                </div>
              </GlassCard>

              {/* Protein card */}
              <GlassCard glowColor="violet" className="p-4 flex flex-col justify-between min-h-[110px]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold text-foreground/60 uppercase">Protein Rebuild</span>
                  <Award className="h-4.5 w-4.5 text-primary" />
                </div>
                <div>
                  <h3 className="text-3xl font-black text-primary">{totalProtein}g</h3>
                  <div className="progress-bar mt-2 bg-foreground/5 h-1.5 rounded-full overflow-hidden">
                    <div className="progress-bar-fill bg-primary h-full rounded-full" style={{ width: `${Math.min(100, (totalProtein / 140) * 100)}%` }} />
                  </div>
                  <span className="text-[9px] font-bold text-foreground/45 block mt-1.5">Metabolic Target: 140g</span>
                </div>
              </GlassCard>

              {/* Carbohydrates card */}
              <GlassCard glowColor="emerald" className="p-4 flex flex-col justify-between min-h-[110px]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold text-foreground/60 uppercase">Glycogen Carbs</span>
                  <Activity className="h-4.5 w-4.5 text-emerald-500" />
                </div>
                <div>
                  <h3 className="text-3xl font-black text-emerald-500">{totalCarbs}g</h3>
                  <div className="progress-bar mt-2 bg-foreground/5 h-1.5 rounded-full overflow-hidden">
                    <div className="progress-bar-fill bg-emerald-500 h-full rounded-full" style={{ width: `${Math.min(100, (totalCarbs / 220) * 100)}%` }} />
                  </div>
                  <span className="text-[9px] font-bold text-foreground/45 block mt-1.5">Stable Cap: 220g</span>
                </div>
              </GlassCard>

              {/* Fats card */}
              <GlassCard glowColor="amber" className="p-4 flex flex-col justify-between min-h-[110px]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold text-foreground/60 uppercase">Healthy Lipids</span>
                  <Heart className="h-4.5 w-4.5 text-amber-500" />
                </div>
                <div>
                  <h3 className="text-3xl font-black text-amber-500">{totalFat}g</h3>
                  <div className="progress-bar mt-2 bg-foreground/5 h-1.5 rounded-full overflow-hidden">
                    <div className="progress-bar-fill bg-amber-500 h-full rounded-full" style={{ width: `${Math.min(100, (totalFat / 70) * 100)}%` }} />
                  </div>
                  <span className="text-[9px] font-bold text-foreground/45 block mt-1.5">Optimal Lipids: 70g</span>
                </div>
              </GlassCard>

            </div>

            {/* 2. DUAL INTUITIVE PANELS: PLANNER CARDS & AI HABITS */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              
              {/* LEFT: GENERATED PLAN CARD VIEW */}
              <div className="lg:col-span-7 space-y-4">
                <h3 className="text-xs font-bold text-foreground uppercase tracking-widest flex items-center justify-between">
                  <span>Your Dynamic Schedule ({selectedPreference})</span>
                  <span className="text-xs text-foreground/45 font-semibold">Today's Focus: {selectedGoal}</span>
                </h3>

                <div className="space-y-3">
                  {activePlan.plan.map((meal, index) => {
                    const isExpanded = expandedMeal === meal.mealType;
                    const isStarred = favorites.includes(meal.name);
                    const isEatenToday = foodLogs.some(
                      log => log.meal_type === meal.mealType && log.food_name === meal.name
                    );

                    return (
                      <GlassCard 
                        key={meal.mealType} 
                        glowColor={meal.mealType === "breakfast" ? "violet" : meal.mealType === "lunch" ? "emerald" : meal.mealType === "dinner" ? "rose" : "amber"} 
                        className="p-4 space-y-3"
                      >
                        {/* Header Block */}
                        <div className="flex justify-between items-start gap-3">
                          <div className="flex gap-3 items-start min-w-0">
                            <span className="h-8 w-8 rounded-xl bg-foreground/5 border border-foreground/5 flex items-center justify-center shrink-0 text-base font-bold">
                              {meal.mealType === "breakfast" ? "☕" : meal.mealType === "lunch" ? "🍱" : meal.mealType === "dinner" ? "🍲" : "🍎"}
                            </span>
                            <div className="space-y-0.5 min-w-0">
                              <span className="text-[10px] font-bold text-foreground/40 block uppercase tracking-wider">{meal.mealType}</span>
                              <span className="text-xs font-black text-foreground block truncate leading-snug">{meal.name}</span>
                              <span className="text-[10px] text-foreground/60 block font-semibold leading-relaxed">
                                {meal.whyHelps}
                              </span>
                            </div>
                          </div>
                          <span className="text-xs font-black text-foreground shrink-0 pl-2">
                            {meal.calories} kcal
                          </span>
                        </div>

                        {/* Expand details toggler */}
                        <div className="flex justify-between items-center border-t border-foreground/5 pt-2 text-[10px] font-semibold text-foreground/50">
                          <span className="font-bold text-primary flex gap-1">
                            <span>P: {meal.protein}g</span>
                            <span>C: {meal.carbs}g</span>
                            <span>F: {meal.fat}g</span>
                          </span>
                          <button 
                            onClick={() => setExpandedMeal(isExpanded ? null : meal.mealType)}
                            className="flex items-center gap-0.5 text-foreground/60 hover:text-foreground cursor-pointer"
                          >
                            <span>{isExpanded ? "Collapse Details" : "View Recovery Sync"}</span>
                            {isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                          </button>
                        </div>

                        {/* Collapsible details content */}
                        {isExpanded && (
                          <div className="border-t border-foreground/5 pt-3 space-y-2 animate-[slideDown_0.2s_ease-out]">
                            <div className="grid grid-cols-3 gap-2">
                              <div className="p-2 bg-foreground/5 rounded-xl border border-foreground/5 space-y-0.5">
                                <span className="text-[8px] font-bold text-primary block uppercase">Recovery Focus</span>
                                <p className="text-[9px] leading-normal text-foreground/75 font-semibold">{meal.recoveryBenefits}</p>
                              </div>
                              <div className="p-2 bg-foreground/5 rounded-xl border border-foreground/5 space-y-0.5">
                                <span className="text-[8px] font-bold text-secondary block uppercase">Stamina Index</span>
                                <p className="text-[9px] leading-normal text-foreground/75 font-semibold">{meal.energyBenefits}</p>
                              </div>
                              <div className="p-2 bg-foreground/5 rounded-xl border border-foreground/5 space-y-0.5">
                                <span className="text-[8px] font-bold text-emerald-500 block uppercase">Fluid Kinetics</span>
                                <p className="text-[9px] leading-normal text-foreground/75 font-semibold">{meal.hydrationSupport}</p>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Button Actions Block */}
                        <div className="border-t border-foreground/5 pt-3 flex justify-between items-center gap-2">
                          <div className="flex gap-2">
                            <button
                              onClick={() => setSwappingMealType(meal.mealType)}
                              className="text-[10px] bg-foreground/5 hover:bg-foreground/10 border border-foreground/5 rounded-lg px-2.5 py-1.5 font-bold transition-all text-foreground/80 flex items-center gap-1 cursor-pointer"
                            >
                              <RefreshCw className="h-3 w-3" />
                              Swap Meal
                            </button>
                            <button
                              onClick={() => handleToggleFavorite(meal.name)}
                              className="text-[10px] bg-foreground/5 hover:bg-foreground/10 border border-foreground/5 rounded-lg px-2.5 py-1.5 font-bold transition-all flex items-center gap-1 cursor-pointer text-foreground/80"
                            >
                              <Star className={`h-3 w-3 ${isStarred ? "fill-amber-400 text-amber-400" : ""}`} />
                              {isStarred ? "Starred" : "Favorite"}
                            </button>
                          </div>
                          <button
                            onClick={() => handleMarkEaten(meal)}
                            disabled={isEatenToday}
                            className={`text-[10px] font-black rounded-lg px-3.5 py-1.5 flex items-center gap-1 transition-all cursor-pointer ${
                              isEatenToday
                                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 cursor-default"
                                : "bg-primary text-white hover:bg-primary/90 shadow-md shadow-primary/5"
                            }`}
                          >
                            <Check className="h-3 w-3" />
                            {isEatenToday ? "Eaten" : "Mark Eaten"}
                          </button>
                        </div>
                      </GlassCard>
                    );
                  })}
                </div>
              </div>

              {/* RIGHT: SMART HABITS & FUTURE HEALTH PREDICTIONS */}
              <div className="lg:col-span-5 space-y-6">
                
                {/* AI HABITS LEARNING ENGINE */}
                <div className="rounded-2xl glass-panel p-5 border-foreground/5 space-y-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-secondary uppercase tracking-widest flex items-center gap-1">
                      <Sparkles className="h-3.5 w-3.5 text-secondary animate-pulse" />
                      AI Habit Analyzer
                    </span>
                    <p className="text-[9px] text-foreground/45 font-bold">Continuously tracking custom nutritional habits</p>
                  </div>
                  <div className="space-y-2">
                    {activePlan.habits.map((habit, idx) => (
                      <div key={idx} className="flex gap-2 items-start p-3 bg-foreground/5 rounded-xl border border-foreground/5">
                        <span className="text-secondary font-bold text-xs mt-0.5">•</span>
                        <span className="text-xs text-foreground/80 font-bold leading-normal">{habit}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* AI PREVENTION & LONGEVITY METRICS */}
                <div className="rounded-2xl glass-panel p-5 border-foreground/5 space-y-4 bg-gradient-to-b from-background to-secondary/5">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-primary uppercase tracking-widest flex items-center gap-1">
                      <ShieldAlert className="h-3.5 w-3.5 text-primary animate-pulse" />
                      AI Prevention Engine
                    </span>
                    <p className="text-[9px] text-foreground/45 font-bold">Predicting circadian fatigue and wellness shifts</p>
                  </div>

                  {/* Future Health Forecast Gauges */}
                  <div className="grid grid-cols-2 gap-3 border-b border-foreground/5 pb-4 text-center">
                    <div className="p-3 bg-foreground/5 rounded-xl border border-foreground/5 space-y-1">
                      <span className="text-[9px] font-bold text-foreground/50 block">FATIGUE RISK</span>
                      <span className="text-lg font-black block text-emerald-400">Low (14%)</span>
                    </div>
                    <div className="p-3 bg-foreground/5 rounded-xl border border-foreground/5 space-y-1">
                      <span className="text-[9px] font-bold text-foreground/50 block">BURNOUT GAP</span>
                      <span className="text-lg font-black block text-emerald-400">Minimal</span>
                    </div>
                  </div>

                  {/* Warnings & Suggestions list */}
                  <div className="space-y-2.5">
                    {activePlan.warnings.map((warn, idx) => (
                      <div key={idx} className="flex gap-2.5 items-start p-3 bg-rose-500/5 border border-rose-500/15 rounded-xl">
                        <AlertCircle className="h-3.5 w-3.5 text-rose-400 shrink-0 mt-0.5 animate-pulse" />
                        <span className="text-xs font-semibold text-rose-400 leading-snug">{warn}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>

            {/* 3. NUTRITION VISUALIZATION AND CHARTS */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Macro target consistency */}
              <div className="rounded-2xl glass-panel p-5 border-foreground/5 space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="text-xs font-bold text-foreground uppercase tracking-widest flex items-center gap-1.5">
                    <BarChart2 className="h-4.5 w-4.5 text-primary" />
                    Weekly Macro Target Consistency
                  </h4>
                  <span className="text-[9px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold uppercase">
                    Stable Index: 88%
                  </span>
                </div>
                <div className="h-[200px] w-full pt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={WEEKLY_TRENDS_DATA} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#222" opacity={0.05} />
                      <XAxis dataKey="name" stroke="#666" fontSize={9} tickLine={false} />
                      <YAxis stroke="#666" fontSize={9} tickLine={false} />
                      <Tooltip contentStyle={{ background: "#111", border: "1px solid #333", fontSize: "10px", borderRadius: "8px" }} />
                      <Legend fontSize={9} />
                      <Bar dataKey="Target" fill="#3b82f6" opacity={0.3} radius={[4, 4, 0, 0]} name="Metabolic Target" />
                      <Bar dataKey="Consumed" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="Actual Calories" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Sleep vs Nutrition */}
              <div className="rounded-2xl glass-panel p-5 border-foreground/5 space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="text-xs font-bold text-foreground uppercase tracking-widest flex items-center gap-1.5">
                    <Moon className="h-4.5 w-4.5 text-secondary" />
                    Sleep vs Nutrition Correlation
                  </h4>
                  <span className="text-[9px] bg-secondary/10 text-secondary px-2 py-0.5 rounded-full font-bold uppercase">
                    Sync Cleared
                  </span>
                </div>
                <div className="h-[200px] w-full pt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={SLEEP_NUTRITION_DATA} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#222" opacity={0.05} />
                      <XAxis dataKey="name" stroke="#666" fontSize={9} tickLine={false} />
                      <YAxis yAxisId="left" stroke="#666" fontSize={9} domain={[0, 10]} tickLine={false} />
                      <YAxis yAxisId="right" orientation="right" stroke="#666" fontSize={9} domain={[0, 100]} tickLine={false} />
                      <Tooltip contentStyle={{ background: "#111", border: "1px solid #333", fontSize: "10px", borderRadius: "8px" }} />
                      <Line yAxisId="left" type="monotone" dataKey="Sleep" stroke="#3b82f6" strokeWidth={2} name="Sleep Hours" />
                      <Line yAxisId="right" type="monotone" dataKey="NutritionScore" stroke="#10b981" strokeWidth={2} name="Compliance Score" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

            </div>

            {/* 4. REDESIGNED MEAL TIMELINE & QUICK HYDRATION */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              
              {/* EATEN MEALS TIMELINE */}
              <div className="lg:col-span-7 rounded-2xl glass-panel p-5 border-foreground/5 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <h3 className="text-xs font-bold text-foreground uppercase tracking-widest flex items-center justify-between">
                    <span>Eaten Meal Timeline</span>
                    <span className="text-[9px] text-foreground/40 font-bold">Real-time synchronized logs</span>
                  </h3>

                  <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1 scrollbar-none">
                    {foodLogs.length === 0 ? (
                      <div className="text-center py-10 space-y-1.5 text-foreground/45">
                        <Apple className="h-7 w-7 mx-auto opacity-20" />
                        <span className="text-xs font-bold block">No meals logged today</span>
                        <p className="text-[10px] leading-normal text-foreground/50 max-w-[200px] mx-auto">
                          Mark generated plan meals eaten above to populate your nutrition history log automatically!
                        </p>
                      </div>
                    ) : (
                      foodLogs.map((log) => (
                        <div key={log.id} className="p-3 bg-foreground/5 rounded-xl border border-foreground/5 flex justify-between items-center">
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-bold text-foreground leading-none">{log.food_name}</span>
                              <span className="rounded-full bg-primary/10 px-2 py-0.2 text-[8px] font-bold text-primary capitalize">
                                {log.meal_type}
                              </span>
                            </div>
                            <span className="text-[9px] font-bold text-foreground/45">
                              Protein: {log.protein_g}g | Carbs: {log.carbs_g}g | Fat: {log.fat_g}g
                            </span>
                          </div>
                          <span className="text-xs font-black text-foreground">
                            +{log.calories} kcal
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div className="border-t border-foreground/5 pt-3 text-[10px] font-bold text-foreground/45 flex justify-between">
                  <span>*Target macros are updated based on biological consistency indices.</span>
                  <span className="text-secondary uppercase">Secure logs</span>
                </div>
              </div>

              {/* QUICK HYDRATION MODULE */}
              <div className="lg:col-span-5 rounded-2xl glass-panel p-5 border-foreground/5 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-foreground/60 uppercase">Fluid Hydration</span>
                    <Droplet className="h-4.5 w-4.5 text-emerald-500" />
                  </div>
                  <div>
                    <h3 className="text-3xl font-black text-emerald-500">{waterLogged} ml</h3>
                    <span className="text-[9px] font-bold text-foreground/45 block mt-1">Today's Circadian Target: 2500 ml</span>
                  </div>

                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleLogWater(250)} 
                      className="text-xs bg-foreground/5 hover:bg-emerald-500/10 border border-foreground/5 hover:border-emerald-500/20 px-3 py-2.5 rounded-lg font-bold text-emerald-500 flex-1 transition-all cursor-pointer"
                    >
                      +250ml Glass
                    </button>
                    <button 
                      onClick={() => handleLogWater(500)} 
                      className="text-xs bg-foreground/5 hover:bg-emerald-500/10 border border-foreground/5 hover:border-emerald-500/20 px-3 py-2.5 rounded-lg font-bold text-emerald-500 flex-1 transition-all cursor-pointer"
                    >
                      +500ml Flask
                    </button>
                  </div>
                </div>

                <div className="border-t border-foreground/5 pt-3 text-[9px] font-bold text-foreground/45 leading-normal">
                  Steady fluid consumption facilitates kidney waste filtration and preserves cellular fluid volumes.
                </div>
              </div>

            </div>

          </div>
        )}

      </div>

      {/* SWAP MEAL SELECTION MODAL */}
      {swappingMealType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-[fadeIn_0.2s_ease-out]">
          <div className="fixed inset-0 bg-black/60" onClick={() => setSwappingMealType(null)} />
          <div className="relative w-full max-w-xl rounded-3xl glass-panel border border-foreground/10 bg-background/95 p-6 space-y-4 z-10 shadow-2xl">
            <h3 className="font-bold text-sm text-foreground uppercase tracking-widest">
              Select Healthy Alternative for {swappingMealType}
            </h3>

            <div className="space-y-3">
              {(ALTERNATIVES_DATABASE[swappingMealType] || []).map((alt, idx) => (
                <div 
                  key={idx} 
                  className="p-3.5 rounded-2xl border border-foreground/5 bg-foreground/5 hover:bg-foreground/10 transition-all flex justify-between items-center gap-4 group"
                >
                  <div className="space-y-1 min-w-0">
                    <span className="text-xs font-black text-foreground block leading-snug">{alt.name}</span>
                    <p className="text-[10px] text-foreground/60 leading-normal font-semibold pr-4">{alt.whyHelps}</p>
                    <div className="flex gap-2 text-[9px] font-bold text-primary">
                      <span>P: {alt.protein}g</span>
                      <span>C: {alt.carbs}g</span>
                      <span>F: {alt.fat}g</span>
                      <span className="text-foreground/45">| {alt.calories} kcal</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleSwapMeal(swappingMealType, alt)}
                    className="text-[10px] font-black bg-primary text-white px-3 py-2 rounded-lg hover:bg-primary/95 transition-all shrink-0 cursor-pointer"
                  >
                    Choose
                  </button>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-2">
              <button 
                onClick={() => setSwappingMealType(null)}
                className="text-[10px] font-black text-foreground/60 hover:text-foreground cursor-pointer"
              >
                Cancel / Return
              </button>
            </div>
          </div>
        </div>
      )}

    </DashboardLayout>
  );
}
