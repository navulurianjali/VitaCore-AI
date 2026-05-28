"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Flame,
  Droplet,
  Moon,
  Brain,
  Activity,
  Zap,
  TrendingDown,
  AlertCircle,
  CheckCircle,
  Wind,
  Footprints
} from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import GlassCard from "@/components/ui/GlassCard";
import Button from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";
import { useTheme, ActiveMode } from "@/context/ThemeContext";
import { getBaseMetrics, DailyMetrics } from "@/utils/mockData";
import { supabase } from "@/utils/supabase";

export default function DashboardPage() {
  const { profile } = useAuth();
  const { activeMode } = useTheme();

  const [metrics, setMetrics] = useState<DailyMetrics | null>(null);
  const [waterLogged, setWaterLogged] = useState(0);
  const [totalCalories, setTotalCalories] = useState(0);
  const [sleepHrs, setSleepHrs] = useState(0);

  // Breathing (wellness mode)
  const [breathPhase, setBreathPhase] = useState("Ready");
  const [breathingActive, setBreathingActive] = useState(false);

  // Medication (elderly mode)
  const [meds, setMeds] = useState([
    { name: "Blood Pressure Capsule", time: "8:00 AM", taken: true },
    { name: "Joint Strength Vitamin D", time: "12:00 PM", taken: false },
    { name: "Glucosamine Tablet", time: "6:00 PM", taken: false }
  ]);

  const fetchDashboardMetrics = async () => {
    if (!supabase || !profile) return;
    try {
      const todayStr = new Date().toISOString().split("T")[0];

      const { data: foodData } = await supabase
        .from("nutrition_logs")
        .select("calories")
        .eq("user_id", profile.id)
        .gte("created_at", `${todayStr}T00:00:00Z`);
      let kcal = 0;
      if (foodData) {
        kcal = foodData.reduce((sum, log) => sum + Number(log.calories), 0);
        setTotalCalories(kcal);
      }

      const { data: sleepData } = await supabase
        .from("sleep_logs")
        .select("sleep_hours, recovery_quality")
        .eq("user_id", profile.id)
        .order("created_at", { ascending: false })
        .limit(1);
      let sleep = 0;
      let recovery = 0;
      if (sleepData && sleepData.length > 0) {
        sleep = Number(sleepData[0].sleep_hours);
        recovery = Number(sleepData[0].recovery_quality || 0);
        setSleepHrs(sleep);
      }

      const { data: waterData } = await supabase
        .from("hydration_logs")
        .select("amount_ml")
        .eq("user_id", profile.id)
        .gte("created_at", `${todayStr}T00:00:00Z`);
      let water = 0;
      if (waterData) {
        water = waterData.reduce((sum, log) => sum + Number(log.amount_ml), 0);
        setWaterLogged(water);
      }

      const baseMetrics: DailyMetrics = {
        caloriesBurned: activeMode === "performance" ? 2800 : 2100,
        caloriesTarget: 2200,
        caloriesConsumed: kcal,
        hydrationMl: water,
        hydrationTarget: activeMode === "performance" ? 3000 : 2000,
        steps: 4250,
        stepsTarget: 10000,
        sleepHours: sleep,
        sleepTarget: 8.0,
        sleepQuality: sleep > 0 ? 8.5 : 0,
        stressLevel: sleep > 7 ? 25 : 65,
        mood: sleep > 7 ? "Restorative" : "Fatigued",
        recoveryPercentage: recovery > 0 ? recovery : 0,
        fatigueScore: sleep > 7 ? 15 : 75,
        physicalFatigue: sleep > 7 ? 10 : 60,
        mentalFatigue: sleep > 7 ? 20 : 80,
        energyLevel: sleep > 7 ? 85 : 40,
        biologicalAge: Number(profile.biological_age || 29.5),
        stabilityScore: Number(profile.stability_score || 95),
        metabolicEfficiency: kcal > 0 ? 82 : 0,
        lifestyleSustainability: sleep > 0 ? 92 : 0,
        glycemicIndexLoad: "low" as const,
        sedentaryPostureRisk: "low" as const,
        micronutrientDeficiencies: ["Vitamin D3 (Optimal sunlight limit crossed)"]
      };

      setMetrics(baseMetrics);
    } catch (err) {
      console.error("Dashboard metrics error:", err);
    }
  };

  useEffect(() => {
    if (profile?.id) {
      fetchDashboardMetrics();
    } else {
      const base = getBaseMetrics(activeMode);
      setMetrics({
        ...base,
        caloriesConsumed: 0,
        hydrationMl: 0,
        sleepHours: 0,
        recoveryPercentage: 0,
        lifestyleSustainability: 0,
        metabolicEfficiency: 0
      });
      setWaterLogged(0);
      setTotalCalories(0);
      setSleepHrs(0);
    }
  }, [activeMode, profile]);

  // Box breathing timer
  useEffect(() => {
    if (!breathingActive) return;
    let count = 0;
    const interval = setInterval(() => {
      count = (count + 1) % 4;
      const phases = ["Inhale (4s)", "Hold (4s)", "Exhale (4s)", "Hold (4s)"];
      setBreathPhase(phases[count]);
    }, 4000);
    return () => clearInterval(interval);
  }, [breathingActive]);

  if (!metrics) return null;

  const handleToggleMed = (idx: number) => {
    setMeds(prev => prev.map((m, i) => i === idx ? { ...m, taken: !m.taken } : m));
  };

  // Greeting helper
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const today = new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });

  const calorieTarget = metrics.caloriesTarget * 3;
  const hydrationPct = Math.min(100, (waterLogged / metrics.hydrationTarget) * 100);
  const caloriePct = Math.min(100, (totalCalories / calorieTarget) * 100);
  const sleepPct = Math.min(100, (sleepHrs / metrics.sleepTarget) * 100);
  const stepsPct = Math.min(100, (metrics.steps / metrics.stepsTarget) * 100);

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-5xl">

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-[var(--foreground)] tracking-tight">
              {greeting}{profile?.full_name ? `, ${profile.full_name.split(" ")[0]}` : ""}
            </h1>
            <p className="text-sm text-[var(--muted)] mt-0.5">{today} · {activeMode.charAt(0).toUpperCase() + activeMode.slice(1)} mode</p>
          </div>
          <Link href="/ai-coach">
            <Button variant="primary" size="sm" className="gap-1.5">
              <Brain className="h-3.5 w-3.5" />
              AI Coach
            </Button>
          </Link>
        </div>

        {/* ======= COMMON METRICS GRID ======= */}
        {activeMode !== "elderly" && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">

            {/* Calories */}
            <GlassCard glowColor="rose" className="p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-[var(--muted)]">Calories</span>
                <div className="h-7 w-7 rounded-lg bg-rose-500/10 flex items-center justify-center">
                  <Flame className="h-3.5 w-3.5 text-rose-500" />
                </div>
              </div>
              <div className="analytics-number text-[var(--foreground)]">{totalCalories}</div>
              <div className="text-xs text-[var(--muted)] mt-0.5">/ {calorieTarget} kcal</div>
              <div className="progress-bar mt-3">
                <div className="progress-bar-fill bg-rose-500" style={{ width: `${caloriePct}%` }} />
              </div>
            </GlassCard>

            {/* Hydration */}
            <GlassCard glowColor="emerald" className="p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-[var(--muted)]">Hydration</span>
                <div className="h-7 w-7 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                  <Droplet className="h-3.5 w-3.5 text-emerald-500" />
                </div>
              </div>
              <div className="analytics-number text-[var(--foreground)]">{waterLogged}</div>
              <div className="text-xs text-[var(--muted)] mt-0.5">/ {metrics.hydrationTarget} ml</div>
              <div className="progress-bar mt-3">
                <div className="progress-bar-fill bg-emerald-500" style={{ width: `${hydrationPct}%` }} />
              </div>
            </GlassCard>

            {/* Sleep */}
            <GlassCard glowColor="violet" className="p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-[var(--muted)]">Sleep</span>
                <div className="h-7 w-7 rounded-lg bg-violet-500/10 flex items-center justify-center">
                  <Moon className="h-3.5 w-3.5 text-violet-500" />
                </div>
              </div>
              <div className="analytics-number text-[var(--foreground)]">{sleepHrs > 0 ? `${sleepHrs}h` : "—"}</div>
              <div className="text-xs text-[var(--muted)] mt-0.5">Target: {metrics.sleepTarget}h</div>
              <div className="progress-bar mt-3">
                <div className="progress-bar-fill bg-violet-500" style={{ width: `${sleepPct}%` }} />
              </div>
            </GlassCard>

            {/* Steps */}
            <GlassCard glowColor="amber" className="p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-[var(--muted)]">Steps</span>
                <div className="h-7 w-7 rounded-lg bg-amber-500/10 flex items-center justify-center">
                  <Footprints className="h-3.5 w-3.5 text-amber-500" />
                </div>
              </div>
              <div className="analytics-number text-[var(--foreground)]">{metrics.steps.toLocaleString()}</div>
              <div className="text-xs text-[var(--muted)] mt-0.5">/ {metrics.stepsTarget.toLocaleString()} goal</div>
              <div className="progress-bar mt-3">
                <div className="progress-bar-fill bg-amber-500" style={{ width: `${stepsPct}%` }} />
              </div>
            </GlassCard>

          </div>
        )}

        {/* ======= ELDERLY MODE ======= */}
        {activeMode === "elderly" && (
          <div className="space-y-4">

            {/* Emergency button */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-xl border-2 border-red-500/30 bg-red-500/5">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-red-500 shrink-0" />
                <div>
                  <p className="font-semibold text-red-500 text-sm">Emergency / Fall Alarm</p>
                  <p className="text-sm text-[var(--muted)] mt-0.5">Notify your family accountability circle instantly.</p>
                </div>
              </div>
              <button
                onClick={() => alert("Emergency signal broadcasted to family circle contacts!")}
                className="bg-red-500 hover:bg-red-600 text-white font-semibold px-5 py-2.5 rounded-lg text-sm transition-all shrink-0 cursor-pointer"
              >
                Notify Family
              </button>
            </div>

            {/* Elderly metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <GlassCard glowColor="emerald" className="p-4 text-center">
                <Footprints className="h-8 w-8 text-secondary mx-auto mb-2" />
                <span className="text-xs font-medium text-[var(--muted)] block">Steps Today</span>
                <span className="text-4xl font-bold text-[var(--foreground)] block my-1">{metrics.steps}</span>
                <span className="text-sm text-[var(--muted)]">Goal: 5,000 steps</span>
              </GlassCard>

              <GlassCard glowColor="violet" className="p-4 text-center">
                <Droplet className="h-8 w-8 text-primary mx-auto mb-2" />
                <span className="text-xs font-medium text-[var(--muted)] block">Water Today</span>
                <span className="text-4xl font-bold text-[var(--foreground)] block my-1">{waterLogged} ml</span>
                <Button
                  variant="secondary"
                  size="md"
                  onClick={() => setWaterLogged(w => w + 250)}
                  className="mt-2 w-full"
                >
                  + Add 1 Cup (250ml)
                </Button>
              </GlassCard>
            </div>

            {/* Medication */}
            <GlassCard glowColor="none" className="p-4">
              <h3 className="font-semibold text-[var(--foreground)] mb-3">Medication Reminders</h3>
              <div className="space-y-2">
                {meds.map((med, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleToggleMed(idx)}
                    className={`flex justify-between items-center p-3 rounded-lg border cursor-pointer transition-all ${
                      med.taken
                        ? "border-emerald-500/20 bg-emerald-500/5 opacity-70"
                        : "border-[var(--border)] bg-[var(--muted-bg)]"
                    }`}
                  >
                    <div>
                      <span className="text-sm font-medium text-[var(--foreground)] block">{med.name}</span>
                      <span className="text-xs text-[var(--muted)]">{med.time}</span>
                    </div>
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                      med.taken
                        ? "bg-emerald-500/15 text-emerald-600"
                        : "bg-[var(--muted-bg)] text-[var(--muted)]"
                    }`}>
                      {med.taken ? "✓ Taken" : "Pending"}
                    </span>
                  </div>
                ))}
              </div>
            </GlassCard>

          </div>
        )}

        {/* ======= PERFORMANCE MODE ======= */}
        {activeMode === "performance" && (
          <div className="space-y-4">

            {/* Performance metrics row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <GlassCard glowColor="violet" className="p-4">
                <span className="text-xs font-medium text-[var(--muted)] block mb-2">CNS Fatigue</span>
                <div className="analytics-number text-[var(--foreground)]">42%</div>
                <span className="text-xs text-emerald-500 mt-0.5 block">Optimal</span>
                <div className="progress-bar mt-3">
                  <div className="progress-bar-fill bg-primary" style={{ width: "42%" }} />
                </div>
              </GlassCard>

              <GlassCard glowColor="emerald" className="p-4">
                <span className="text-xs font-medium text-[var(--muted)] block mb-2">HRV</span>
                <div className="analytics-number text-[var(--foreground)]">84 ms</div>
                <span className="text-xs text-emerald-500 mt-0.5 block">Stable</span>
                <div className="progress-bar mt-3">
                  <div className="progress-bar-fill bg-secondary" style={{ width: "84%" }} />
                </div>
              </GlassCard>

              <GlassCard glowColor="rose" className="p-4">
                <span className="text-xs font-medium text-[var(--muted)] block mb-2">Metabolic Efficiency</span>
                <div className="analytics-number text-[var(--foreground)]">{metrics.metabolicEfficiency}%</div>
                <div className="progress-bar mt-3">
                  <div className="progress-bar-fill bg-rose-500" style={{ width: `${metrics.metabolicEfficiency}%` }} />
                </div>
              </GlassCard>

              <GlassCard glowColor="amber" className="p-4">
                <span className="text-xs font-medium text-[var(--muted)] block mb-2">Glycemic Load</span>
                <div className="analytics-number capitalize text-secondary">{metrics.glycemicIndexLoad}</div>
                <span className="text-xs text-[var(--muted)] mt-0.5 block">Carb stores primed</span>
              </GlassCard>
            </div>

            {/* Precision macros */}
            <GlassCard glowColor="none" className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <TrendingDown className="h-4 w-4 text-primary" />
                <h3 className="font-semibold text-[var(--foreground)] text-sm">Athlete Macros</h3>
              </div>
              <div className="grid grid-cols-3 gap-3 text-center">
                {[
                  { label: "Protein", value: "165.4g", color: "text-primary" },
                  { label: "Carbs", value: "210.0g", color: "text-secondary" },
                  { label: "Fats", value: "54.2g", color: "text-amber-500" },
                ].map((m) => (
                  <div key={m.label} className="p-3 rounded-lg bg-[var(--muted-bg)] border border-[var(--border)]">
                    <span className={`text-xs font-semibold ${m.color} block`}>{m.label}</span>
                    <span className="text-lg font-bold text-[var(--foreground)] block mt-0.5">{m.value}</span>
                    <span className="text-xs text-[var(--muted)]">Target</span>
                  </div>
                ))}
              </div>
            </GlassCard>

          </div>
        )}

        {/* ======= WELLNESS MODE ======= */}
        {activeMode === "wellness" && (
          <div className="space-y-4">

            {/* Box Breathing Widget */}
            <GlassCard glowColor="emerald" className="p-5">
              <div className="flex items-center gap-2 mb-4">
                <Wind className="h-4 w-4 text-secondary" />
                <h3 className="font-semibold text-[var(--foreground)] text-sm">Box Breathing</h3>
                <span className="text-xs text-[var(--muted)]">· Lower cortisol, improve focus</span>
              </div>

              <div className="flex items-center gap-6">
                {/* Breathing sphere */}
                <div className="relative flex items-center justify-center h-20 w-20 rounded-full border-2 border-secondary/25 bg-secondary/8 shrink-0">
                  <div
                    className={`absolute rounded-full bg-secondary/15 transition-all duration-[4000ms] ${
                      breathingActive ? "h-16 w-16 opacity-100" : "h-10 w-10 opacity-60"
                    }`}
                  />
                  <span className="relative z-10 text-xs font-semibold text-secondary text-center leading-tight">
                    {breathingActive ? breathPhase : "Ready"}
                  </span>
                </div>

                <div className="flex-1 space-y-2">
                  <p className="text-sm text-[var(--muted)]">
                    4-4-4-4 box breathing pattern. Follow the expanding sphere to synchronize with your breath.
                  </p>
                  {!breathingActive ? (
                    <Button variant="secondary" size="sm" onClick={() => { setBreathingActive(true); setBreathPhase("Inhale (4s)"); }}>
                      Start Session
                    </Button>
                  ) : (
                    <Button variant="glass" size="sm" onClick={() => { setBreathingActive(false); setBreathPhase("Ready"); }}>
                      Stop Session
                    </Button>
                  )}
                </div>
              </div>
            </GlassCard>

            {/* Wellness indicators */}
            <div className="grid grid-cols-2 gap-3">
              <GlassCard glowColor="violet" className="p-4">
                <span className="text-xs font-medium text-[var(--muted)] block mb-2">Lifestyle Score</span>
                <div className="analytics-number text-[var(--foreground)]">{metrics.lifestyleSustainability}%</div>
                <p className="text-xs text-[var(--muted)] mt-1 leading-relaxed">Sleep consistency protects cardiac longevity.</p>
              </GlassCard>

              <GlassCard glowColor="rose" className="p-4">
                <span className="text-xs font-medium text-[var(--muted)] block mb-2">Micronutrient Alert</span>
                <p className="text-sm font-medium text-rose-500 leading-snug">{metrics.micronutrientDeficiencies[0]}</p>
                <p className="text-xs text-[var(--muted)] mt-1">15 min outdoor sunlight recommended.</p>
              </GlassCard>
            </div>

          </div>
        )}

        {/* ======= QUICK ACTIONS (all modes except elderly) ======= */}
        {activeMode !== "elderly" && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Link href="/nutrition" className="block">
              <div className="flex items-center gap-3 p-3.5 rounded-xl border border-[var(--border)] bg-[var(--card-bg)] hover:border-primary/30 hover:bg-primary/3 transition-all group cursor-pointer">
                <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/15 transition-colors">
                  <Flame className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-[var(--foreground)]">Log Nutrition</p>
                  <p className="text-xs text-[var(--muted)]">Track your meals</p>
                </div>
              </div>
            </Link>

            <Link href="/sleep" className="block">
              <div className="flex items-center gap-3 p-3.5 rounded-xl border border-[var(--border)] bg-[var(--card-bg)] hover:border-violet-500/30 hover:bg-violet-500/3 transition-all group cursor-pointer">
                <div className="h-8 w-8 rounded-lg bg-violet-500/10 flex items-center justify-center shrink-0 group-hover:bg-violet-500/15 transition-colors">
                  <Moon className="h-4 w-4 text-violet-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-[var(--foreground)]">Log Sleep</p>
                  <p className="text-xs text-[var(--muted)]">Track last night</p>
                </div>
              </div>
            </Link>

            <Link href="/ai-coach" className="block">
              <div className="flex items-center gap-3 p-3.5 rounded-xl border border-[var(--border)] bg-[var(--card-bg)] hover:border-secondary/30 hover:bg-secondary/3 transition-all group cursor-pointer">
                <div className="h-8 w-8 rounded-lg bg-secondary/10 flex items-center justify-center shrink-0 group-hover:bg-secondary/15 transition-colors">
                  <Brain className="h-4 w-4 text-secondary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-[var(--foreground)]">Ask AI Coach</p>
                  <p className="text-xs text-[var(--muted)]">Get personalized advice</p>
                </div>
              </div>
            </Link>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}
