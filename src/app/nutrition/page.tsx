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
  AlertCircle 
} from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import GlassCard from "@/components/ui/GlassCard";
import Button from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { parseSimulatedFoodScan, DailyMetrics, ScanResult } from "@/utils/mockData";
import confetti from "canvas-confetti";
import { supabase } from "@/utils/supabase";

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
    // Calories consumed and logged items are fully loaded from Supabase below
    const base = {
      caloriesBurned: activeMode === "performance" ? 2800 : 2100,
      caloriesTarget: 2200,
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
  }, [activeMode, profile]);

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
            <h1 className="text-2xl font-bold text-[var(--foreground)] tracking-tight">Nutrition & Hydration</h1>
            <p className="text-sm text-[var(--muted)] mt-0.5">Track meals, macros, and daily water intake</p>
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
                    <span className="text-[11px] text-[var(--muted)]">/ 140g</span>
                  </div>
                  <div className="bg-[var(--muted-bg)] p-2 rounded-lg border border-[var(--border)]">
                    <span className="text-xs font-semibold text-secondary block">Carbs</span>
                    <span className="text-base font-bold text-[var(--foreground)] block mt-0.5">{totalCarbs}g</span>
                    <span className="text-[11px] text-[var(--muted)]">/ 220g</span>
                  </div>
                  <div className="bg-[var(--muted-bg)] p-2 rounded-lg border border-[var(--border)]">
                    <span className="text-xs font-semibold text-amber-500 block">Fats</span>
                    <span className="text-base font-bold text-[var(--foreground)] block mt-0.5">{totalFat}g</span>
                    <span className="text-[11px] text-[var(--muted)]">/ 60g</span>
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
              
              {/* LEFT COLUMN: FOOD SCANNER SECTION */}
              <div className="lg:col-span-7 rounded-2xl glass-panel p-6 border-foreground/5 flex flex-col justify-between space-y-6">
                
                <div className="space-y-4">
                  <h3 className="font-semibold text-sm text-[var(--foreground)] flex items-center gap-1.5">
                    <Scan className="h-4 w-4 text-primary" />
                    AI Food Scanner
                  </h3>
                  <p className="text-[11px] text-foreground/75 leading-relaxed font-semibold">
                    Upload images, snap camera captures, or search barcodes to run automated chemical audits, portion sizes, glycemic spikes, and recovery swaps.
                  </p>

                  {/* Drag & Drop Area */}
                  <div 
                    onClick={() => handleScanSimulation("Atlantic Salmon Avocado Salad")}
                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={(e) => { e.preventDefault(); setIsDragging(false); handleScanSimulation("Atlantic Salmon Avocado Salad"); }}
                    className={`h-44 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-2.5 cursor-pointer transition-all duration-300 group ${
                      isDragging 
                        ? "border-primary bg-primary/10 scale-[1.01]" 
                        : "border-foreground/15 bg-foreground/5 hover:border-primary/50 hover:bg-primary/5"
                    }`}
                  >
                    <div className="h-12 w-12 rounded-xl bg-background border border-foreground/5 flex items-center justify-center text-foreground/70 group-hover:scale-110 transition-transform">
                      <Upload className="h-5 w-5 text-primary" />
                    </div>
                    <div className="text-center space-y-0.5">
                      <span className="text-xs font-bold text-foreground block">Drag & Drop Food Image here</span>
                      <span className="text-[10px] text-foreground/50">or click to upload a snapshot</span>
                    </div>
                  </div>

                  {/* Camera & Barcode controls */}
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-1">
                    <button 
                      onClick={() => handleScanSimulation("Double Cheese Pepperoni Pizza Slice")}
                      className="sm:col-span-4 flex items-center justify-center gap-2 text-xs font-bold border border-foreground/10 hover:border-primary/45 rounded-xl bg-foreground/5 hover:bg-primary/5 transition-all py-3 px-4 text-foreground/90 cursor-pointer"
                    >
                      <Camera className="h-4 w-4 text-secondary" />
                      <span>Camera Capture</span>
                    </button>

                    <div className="sm:col-span-8 flex gap-2">
                      <input
                        type="text"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        placeholder="Enter package barcode or food name"
                        className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-foreground/10 bg-foreground/5 text-foreground focus:outline-none placeholder-foreground/45"
                      />
                      <Button 
                        variant="primary" 
                        onClick={() => handleScanSimulation(inputText)}
                        className="px-5 py-2.5 text-xs font-bold shrink-0"
                      >
                        Scan
                      </Button>
                    </div>
                  </div>

                  {/* Pre-sets */}
                  <div className="space-y-2 pt-2 border-t border-foreground/5">
                    <span className="text-[9px] font-bold text-foreground/50 uppercase block">Instant Food Simulators</span>
                    <div className="flex flex-wrap gap-2">
                      {sampleFoods.map((s, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleScanSimulation(s.query)}
                          className="px-2.5 py-1.5 text-[10px] font-bold rounded-xl bg-foreground/5 border border-foreground/5 hover:border-primary/40 transition-all cursor-pointer text-foreground/80 hover:text-foreground"
                        >
                          {s.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Results display panel */}
                <div className="border-t border-foreground/5 pt-5 min-h-[140px] flex flex-col justify-center">
                  {scanning && (
                    <div className="flex flex-col items-center gap-3 text-center py-6">
                      <div className="h-8 w-8 animate-spin rounded-full border-3 border-primary/20 border-t-primary" />
                      <span className="text-xs font-bold uppercase tracking-widest text-primary animate-pulse">Running Neural Food Scanner...</span>
                      <p className="text-[10px] text-foreground/60 max-w-xs leading-normal">Extracting chemical additives, sodium matrices, portion weights, and macro ratios.</p>
                    </div>
                  )}

                  {!scanning && !scanResult && (
                    <div className="flex flex-col items-center gap-1.5 text-center py-6 text-foreground/40 select-none">
                      <Scan className="h-8 w-8 text-foreground/25 animate-pulse" />
                      <span className="text-xs font-extrabold uppercase">Scanner Console Empty</span>
                      <p className="text-[10px] max-w-xs leading-normal">Upload a snapshot or scan a packaging barcode to perform automated audits.</p>
                    </div>
                  )}

                  {!scanning && scanResult && (
                    <div className="space-y-5 animate-slide-in">
                      <div className="flex justify-between items-start gap-4">
                        <div className="space-y-0.5">
                          <div className="flex flex-wrap gap-1.5 items-center">
                            <span className="rounded-full bg-primary/10 border border-primary/15 px-2.5 py-0.5 text-[9px] font-bold text-primary uppercase">
                              Portion: {scanResult.portionSize}
                            </span>
                            <span className={`rounded-full px-2.5 py-0.5 text-[9px] font-bold uppercase border ${
                              scanResult.healthScore >= 75
                                ? "bg-emerald-500/10 border-emerald-500/15 text-emerald-400"
                                : "bg-rose-500/10 border-rose-500/15 text-rose-400"
                            }`}>
                              {scanResult.healthScore >= 75 ? "✓ Clean Whole Food" : "⚠ Processed glycemic hazard"}
                            </span>
                          </div>
                          <h3 className="text-sm font-extrabold text-foreground mt-1">{scanResult.foodName}</h3>
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                          <div className="text-right">
                            <span className="text-[8px] font-bold text-foreground/40 block uppercase">Density Score</span>
                            <span className="text-[11px] font-extrabold text-secondary block">{scanResult.nutrientDensity}/10</span>
                          </div>
                          
                          <div className={`h-12 w-12 rounded-full border-2 flex flex-col items-center justify-center shrink-0 shadow-lg ${
                            scanResult.healthScore >= 75
                              ? "border-secondary text-secondary shadow-secondary/10"
                              : "border-rose-500 text-rose-500 shadow-rose-500/10"
                          }`}>
                            <span className="text-[7px] font-bold uppercase">Health</span>
                            <span className="text-sm font-extrabold">{scanResult.healthScore}</span>
                          </div>
                        </div>
                      </div>

                      {/* Macros */}
                      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 text-center text-[10px] font-extrabold">
                        <div className="bg-foreground/5 p-2 rounded-xl border border-foreground/5">
                          <span className="text-primary block font-bold">Protein</span>
                          <span className="text-xs font-extrabold block mt-0.5 text-foreground">{scanResult.protein}g</span>
                        </div>
                        <div className="bg-foreground/5 p-2 rounded-xl border border-foreground/5">
                          <span className="text-secondary block font-bold">Carbs</span>
                          <span className="text-xs font-extrabold block mt-0.5 text-foreground">{scanResult.carbs}g</span>
                        </div>
                        <div className="bg-foreground/5 p-2 rounded-xl border border-foreground/5">
                          <span className="text-accent block font-bold">Fats</span>
                          <span className="text-xs font-extrabold block mt-0.5 text-foreground">{scanResult.fat}g</span>
                        </div>
                        <div className="bg-foreground/5 p-2 rounded-xl border border-foreground/5">
                          <span className="text-rose-400 block font-bold">Sugars</span>
                          <span className="text-xs font-extrabold block mt-0.5 text-foreground">{scanResult.sugar}g</span>
                        </div>
                        <div className="bg-foreground/5 p-2 rounded-xl border border-foreground/5">
                          <span className="text-amber-500 block font-bold">Sodium</span>
                          <span className="text-xs font-extrabold block mt-0.5 text-foreground">{scanResult.sodium}mg</span>
                        </div>
                        <div className="bg-foreground/5 p-2 rounded-xl border border-foreground/5">
                          <span className="text-teal-400 block font-bold">Fiber</span>
                          <span className="text-xs font-extrabold block mt-0.5 text-foreground">{scanResult.fiber}g</span>
                        </div>
                      </div>

                      {/* Warnings & Swaps */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-foreground/5 pt-4">
                        <div className="space-y-2">
                          <span className="text-[9px] font-bold text-rose-500 uppercase block">Auditing Alerts:</span>
                          <div className="space-y-1.5 text-[9px] font-bold text-foreground/85">
                            {scanResult.sugarAlert && (
                              <div className="flex gap-1.5 items-center text-rose-400 bg-rose-400/5 rounded-lg px-2 py-1">
                                <AlertCircle className="h-3.5 w-3.5" />
                                <span>Glycemic spike: Sugar count exceeded</span>
                              </div>
                            )}
                            {scanResult.sodium > 800 && (
                              <div className="flex gap-1.5 items-center text-rose-400 bg-rose-400/5 rounded-lg px-2 py-1">
                                <AlertCircle className="h-3.5 w-3.5" />
                                <span>High sodium logged: Recovery blocker</span>
                              </div>
                            )}
                            {scanResult.unhealthyAdditives.length > 0 ? (
                              <div className="flex flex-wrap gap-1">
                                {scanResult.unhealthyAdditives.map((ad, idx) => (
                                  <span key={idx} className="bg-red-500/10 border border-red-500/20 px-2 py-0.5 rounded text-[8px] font-bold text-red-500">
                                    ⚠ {ad}
                                  </span>
                                ))}
                              </div>
                            ) : (
                              <div className="flex gap-1.5 items-center text-emerald-400 bg-emerald-400/5 rounded-lg px-2 py-1">
                                <CheckCircle className="h-3.5 w-3.5" />
                                <span>Additive Audit: 100% Chemical Safe</span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <span className="text-[9px] font-bold text-secondary uppercase block">Longevity Swaps:</span>
                          <div className="space-y-1.5">
                            {scanResult.alternatives.map((alt, idx) => (
                              <div key={idx} className="flex items-center gap-1.5 p-1.5 bg-secondary/5 rounded-lg border border-secondary/10 text-[9px] font-bold text-foreground/80">
                                <CornerDownRight className="h-3 w-3 text-secondary shrink-0" />
                                <span>{alt}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <Button 
                        variant="primary" 
                        onClick={handleLogScannedMeal}
                        className="w-full py-3 flex items-center justify-center gap-2"
                      >
                        <CheckCircle className="h-4 w-4" />
                        <span>Approve & Log Scanned Meal</span>
                      </Button>
                    </div>
                  )}
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
                      <label className="text-[10px] font-bold text-foreground">Food item name</label>
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
                        <label className="text-[10px] font-bold text-foreground">Meal Phase</label>
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
                        <label className="text-[10px] font-bold text-foreground">Kcal Consumed</label>
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
                        <label className="text-[10px] font-bold text-foreground flex items-center gap-1 cursor-pointer select-none">
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
                            className="w-full text-[10px] px-2.5 py-1.5 rounded-lg border border-foreground/10 bg-background text-foreground focus:outline-none"
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
                    <h3 className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center justify-between">
                      <span>Logged Meal History</span>
                      <span className="text-[10px] text-foreground/50 font-medium">Daily Telemetry logs</span>
                    </h3>

                    {stressLogs.length > 0 && (
                      <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 px-3 py-2 text-[10px] text-amber-500 font-semibold flex items-center gap-2">
                        <Info className="h-4 w-4 shrink-0" />
                        <span>AI Alert: {stressLogs.length} emotional logs isolated. Trigger: deadline inertias.</span>
                      </div>
                    )}

                    <div className="space-y-2.5 overflow-y-auto max-h-[220px] scrollbar-none pr-1">
                      {foodLogs.length === 0 ? (
                        <div className="text-center py-12 text-foreground/45 space-y-2">
                          <Utensils className="h-8 w-8 text-foreground/20 mx-auto animate-pulse" />
                          <span className="text-xs font-bold block">No meals logged today</span>
                          <p className="text-[10px] text-foreground/50 max-w-[200px] mx-auto leading-normal">
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
                                <span className="text-xs font-extrabold text-foreground">{log.food_name}</span>
                                <span className="rounded-full bg-foreground/10 px-2 py-0.2 text-[8px] font-bold text-foreground/60 capitalize">
                                  {log.meal_type}
                                </span>
                              </div>
                              <p className="text-[10px] text-foreground/50 font-semibold">
                                P: {log.protein_g}g | C: {log.carbs_g}g | F: {log.fat_g}g {log.sugar_g ? ` | S: ${log.sugar_g}g` : ""} {log.sodium_mg ? ` | Na: ${log.sodium_mg}mg` : ""}
                              </p>
                              {log.stress_eating && (
                                <p className="text-[9px] text-amber-500 font-bold italic mt-0.5">
                                  ⚠ Emotional Trigger: {log.emotional_eating_trigger}
                                </p>
                              )}
                            </div>
                            <span className="text-xs font-extrabold text-foreground shrink-0 ml-3">
                              +{log.calories} kcal
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  <div className="border-t border-foreground/5 pt-4 mt-6 text-[10px] text-foreground/50 font-semibold flex justify-between">
                    <span>Preventive Analysis: Macro balance reduces obesity risk by 18%</span>
                    <span className="text-secondary font-bold">HIPAA Secure logs</span>
                  </div>
                </div>

              </div>

            </div>

            {/* 3. AI NUTRITION INSIGHTS SECTION */}
            <div className="rounded-2xl glass-panel p-6 border-foreground/5 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
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
