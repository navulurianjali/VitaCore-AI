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
  Footprints,
  ShieldAlert,
  Sparkles,
  Milestone,
  Calendar,
  Award
} from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import GlassCard from "@/components/ui/GlassCard";
import Button from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";
import { useTheme, ActiveMode } from "@/context/ThemeContext";
import { useHealthData, HealthDigitalTwin } from "@/hooks/useHealthData";
import { supabase } from "@/utils/supabase";
import { calculateFutureHealthPredictions } from "@/utils/predictiveEngine";

export default function DashboardPage() {
  const { profile } = useAuth();
  const { activeMode } = useTheme();

  const { metrics, loading, refetch } = useHealthData();
  const [waterLogged, setWaterLogged] = useState(0);
  const [totalCalories, setTotalCalories] = useState(0);
  const [sleepHrs, setSleepHrs] = useState(0);
  const [stepsLogged, setStepsLogged] = useState(0);

  // Simulation states
  const [simulating, setSimulating] = useState(false);
  const [simSleep, setSimSleep] = useState(8);
  const [simWater, setSimWater] = useState(2000);
  const [simStress, setSimStress] = useState(30);

  // Quick Logging visual feedback
  const [loggingInProgress, setLoggingInProgress] = useState(false);
  const [logStatus, setLogStatus] = useState<string | null>(null);

  // Breathing (wellness mode)
  const [breathPhase, setBreathPhase] = useState("Ready");
  const [breathingActive, setBreathingActive] = useState(false);

  // Medication (elderly mode)
  const [meds, setMeds] = useState([
    { name: "Blood Pressure Capsule", time: "8:00 AM", taken: true },
    { name: "Joint Strength Vitamin D", time: "12:00 PM", taken: false },
    { name: "Glucosamine Tablet", time: "6:00 PM", taken: false }
  ]);

  useEffect(() => {
    if (metrics) {
      setWaterLogged(metrics.hydrationMl);
      setTotalCalories(metrics.caloriesConsumed);
      setSleepHrs(metrics.sleepHours);
      setStepsLogged(metrics.steps);
    }
  }, [metrics]);

  // Real quick-logging handlers connected to Supabase
  const handleLogWater = async (amount: number) => {
    setLoggingInProgress(true);
    setLogStatus("Logging hydration...");
    try {
      if (supabase && profile) {
        const { error } = await supabase.from("hydration_logs").insert({
          user_id: profile.id,
          amount_ml: amount
        });
        if (error) throw error;
        
        await refetch();
        window.dispatchEvent(new Event("vitalcore-data-updated"));
      } else {
        // Fallback for unauthenticated/offline
        setWaterLogged(w => w + amount);
      }
      setLogStatus("Hydration logged! Enjoy your day! 💧");
      setTimeout(() => setLogStatus(null), 3000);
    } catch (e) {
      console.error("Hydration logging error:", e);
      setWaterLogged(w => w + amount);
      setLogStatus("Logged locally.");
      setTimeout(() => setLogStatus(null), 3000);
    } finally {
      setLoggingInProgress(false);
    }
  };

  const handleLogSteps = (amount: number) => {
    setLoggingInProgress(true);
    setLogStatus("Logging steps...");
    const newSteps = stepsLogged + amount;
    setStepsLogged(newSteps);
    localStorage.setItem("vitalcore_daily_steps", newSteps.toString());
    
    // Simulate updating global state
    setTimeout(() => {
      window.dispatchEvent(new Event("vitalcore-data-updated"));
      setLogStatus("Steps logged! Keep moving! 🚶");
      setTimeout(() => setLogStatus(null), 3000);
      setLoggingInProgress(false);
    }, 500);
  };

  const handleLogSleep = async (hours: number, quality: number) => {
    setLoggingInProgress(true);
    setLogStatus("Logging sleep patterns...");
    try {
      if (supabase && profile) {
        const { error } = await supabase.from("sleep_logs").insert({
          user_id: profile.id,
          sleep_hours: hours,
          recovery_quality: quality
        });
        if (error) throw error;
        
        await refetch();
        window.dispatchEvent(new Event("vitalcore-data-updated"));
      } else {
        setSleepHrs(hours);
      }
      setLogStatus("Sleep logged successfully! 🛌");
      setTimeout(() => setLogStatus(null), 3000);
    } catch (e) {
      console.error("Sleep logging error:", e);
      setSleepHrs(hours);
      setLogStatus("Logged locally.");
      setTimeout(() => setLogStatus(null), 3000);
    } finally {
      setLoggingInProgress(false);
    }
  };

  // No additional local state sync needed here for profile change, useHealthData handles it

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

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="text-[var(--muted)] font-medium text-sm animate-pulse">Syncing your telemetry...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (!metrics) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
          <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mb-2">
            <Activity className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-xl font-bold">No Data Available</h2>
          <p className="text-[var(--muted)] text-sm max-w-md text-center">
            We couldn't load your health metrics. Please log in or try refreshing the page.
          </p>
        </div>
      </DashboardLayout>
    );
  }

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
  const stepsPct = Math.min(100, (stepsLogged / metrics.stepsTarget) * 100);

  const predictions = calculateFutureHealthPredictions({
    sleepHours: simulating ? simSleep : (sleepHrs || metrics.sleepHours),
    sleepQuality: simulating ? (simSleep >= 8 ? 90 : simSleep >= 6 ? 70 : 45) : (sleepHrs > 0 ? 80 : metrics.sleepQuality),
    hydrationMl: simulating ? simWater : (waterLogged || metrics.hydrationMl),
    hydrationTarget: metrics.hydrationTarget,
    stressLevel: simulating ? simStress : metrics.stressLevel,
    fatigueScore: simulating ? (simStress > 60 ? 70 : 30) : metrics.fatigueScore,
    physicalFatigue: simulating ? (simStress > 60 ? 60 : 25) : metrics.physicalFatigue,
    mentalFatigue: simulating ? (simStress > 60 ? 75 : 35) : metrics.mentalFatigue,
    sorenessLevel: profile?.soreness_level || 0,
    recoveryPercentage: simulating ? (simSleep >= 8 ? 85 : 45) : metrics.recoveryPercentage,
    stabilityScore: metrics.stabilityScore,
    screenTimeHours: profile?.screen_time_hours || 6,
    caffeineIntake: profile?.caffeine_intake || 'moderate'
  });

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-7xl mx-auto">

        {/* Page Header Welcome */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-primary uppercase tracking-widest block">Wellness Companion</span>
            <h1 className="text-xl sm:text-2xl font-semibold text-[var(--foreground)] tracking-tight">
              {greeting}{profile?.full_name ? `, ${profile.full_name.split(" ")[0]}` : ""} 👋
            </h1>
            <p className="text-xs sm:text-sm text-[var(--muted)] leading-relaxed max-w-lg">
              {metrics.recoveryPercentage > 70 
                ? "Your recovery looks excellent today. A great day to move and connect." 
                : "Your body is in a gentle rest cycle. Focus on hydration and light mobility today."}
            </p>
          </div>
          <Link href="/ai-coach">
            <Button variant="primary" size="sm" className="gap-1.5 shadow-sm">
              <Brain className="h-3.5 w-3.5" />
              Coach Chat
            </Button>
          </Link>
        </div>

        {/* ======= COMMON FOCUS CARDS GRID ======= */}
        {activeMode !== "elderly" && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

            {/* Calories */}
            <GlassCard glowColor="rose" className="p-5 flex flex-col justify-between min-h-[140px] hover:scale-[1.01]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--muted)]">Meals</span>
                <div className="h-6 w-6 rounded-lg bg-rose-500/10 flex items-center justify-center">
                  <Flame className="h-3.5 w-3.5 text-rose-500" />
                </div>
              </div>
              <div>
                <div className="analytics-number text-[var(--foreground)]">{totalCalories}</div>
                <div className="text-[10px] text-[var(--muted)] mt-0.5">/ {calorieTarget} kcal</div>
              </div>
              <div className="progress-bar mt-3">
                <div className="progress-bar-fill bg-rose-500/80" style={{ width: `${caloriePct}%` }} />
              </div>
            </GlassCard>

            {/* Hydration */}
            <GlassCard glowColor="emerald" className="p-5 flex flex-col justify-between min-h-[160px] hover:scale-[1.01]">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--muted)]">Water</span>
                <div className="h-6 w-6 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                  <Droplet className="h-3.5 w-3.5 text-emerald-500" />
                </div>
              </div>
              <div>
                <div className="analytics-number text-[var(--foreground)]">{waterLogged} ml</div>
                <div className="text-[10px] text-[var(--muted)] mt-0.5">/ {metrics.hydrationTarget} ml goal</div>
              </div>
              <div className="flex gap-1.5 mt-2">
                <button
                  onClick={(e) => { e.preventDefault(); handleLogWater(250); }}
                  className="flex-1 py-1 rounded bg-emerald-500/10 border border-emerald-500/15 hover:bg-emerald-500/20 text-emerald-400 font-bold text-[9px] cursor-pointer"
                >
                  +250ml
                </button>
                <button
                  onClick={(e) => { e.preventDefault(); handleLogWater(500); }}
                  className="flex-1 py-1 rounded bg-emerald-500/10 border border-emerald-500/15 hover:bg-emerald-500/20 text-emerald-400 font-bold text-[9px] cursor-pointer"
                >
                  +500ml
                </button>
              </div>
              <div className="progress-bar mt-3">
                <div className="progress-bar-fill bg-emerald-500/80" style={{ width: `${hydrationPct}%` }} />
              </div>
            </GlassCard>

            {/* Sleep */}
            <GlassCard glowColor="violet" className="p-5 flex flex-col justify-between min-h-[160px] hover:scale-[1.01]">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--muted)]">Sleep</span>
                <div className="h-6 w-6 rounded-lg bg-violet-500/10 flex items-center justify-center">
                  <Moon className="h-3.5 w-3.5 text-violet-500" />
                </div>
              </div>
              <div>
                <div className="analytics-number text-[var(--foreground)]">{sleepHrs > 0 ? `${sleepHrs}h` : "—"}</div>
                <div className="text-[10px] text-[var(--muted)] mt-0.5">Quality: {metrics.sleepQuality}%</div>
              </div>
              <div className="flex gap-1.5 mt-2">
                <Link
                  href="/sleep"
                  className="flex-1 py-1 rounded bg-violet-500/10 border border-violet-500/15 hover:bg-violet-500/20 text-violet-400 font-bold text-[9px] cursor-pointer text-center block"
                >
                  Manage Sleep Data
                </Link>
              </div>
              <div className="progress-bar mt-3">
                <div className="progress-bar-fill bg-violet-500/80" style={{ width: `${sleepPct}%` }} />
              </div>
            </GlassCard>

            {/* Steps */}
            <GlassCard glowColor="amber" className="p-5 flex flex-col justify-between min-h-[140px] hover:scale-[1.01]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--muted)]">Steps</span>
                <div className="h-6 w-6 rounded-lg bg-amber-500/10 flex items-center justify-center">
                  <Footprints className="h-3.5 w-3.5 text-amber-500" />
                </div>
              </div>
              <div>
                <div className="analytics-number text-[var(--foreground)]">{stepsLogged.toLocaleString()}</div>
                <div className="text-[10px] text-[var(--muted)] mt-0.5">/ {metrics.stepsTarget.toLocaleString()} goal</div>
              </div>
              <div className="flex gap-1.5 mt-2">
                <button
                  onClick={(e) => { e.preventDefault(); handleLogSteps(1000); }}
                  className="flex-1 py-1 rounded bg-amber-500/10 border border-amber-500/15 hover:bg-amber-500/20 text-amber-500 font-bold text-[9px] cursor-pointer"
                >
                  +1k
                </button>
                <button
                  onClick={(e) => { e.preventDefault(); handleLogSteps(5000); }}
                  className="flex-1 py-1 rounded bg-amber-500/10 border border-amber-500/15 hover:bg-amber-500/20 text-amber-500 font-bold text-[9px] cursor-pointer"
                >
                  +5k
                </button>
              </div>
              <div className="progress-bar mt-3">
                <div className="progress-bar-fill bg-amber-500/80" style={{ width: `${stepsPct}%` }} />
              </div>
            </GlassCard>

          </div>
        )}

        {/* ======= ELDERLY MODE ACCESSIBLE LAYOUT ======= */}
        {activeMode === "elderly" && (
          <div className="space-y-6">

            {/* Emergency button */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-3xl border border-red-500/10 bg-red-500/5">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-6 w-6 text-red-500 shrink-0" />
                <div className="space-y-1">
                  <p className="font-semibold text-red-600 text-base">Quick Family Alert</p>
                  <p className="text-xs text-[var(--muted)]">Instantly notify your care circle if you need help.</p>
                </div>
              </div>
              <button
                onClick={() => alert("Signal broadcasted to your care circles!")}
                className="bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-3 rounded-2xl text-xs transition-all shrink-0 cursor-pointer shadow-sm shadow-red-500/20 active:scale-[0.98]"
              >
                Send Alert
              </button>
            </div>

            {/* Accessible metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <GlassCard glowColor="emerald" className="p-6 text-center rounded-3xl">
                <Footprints className="h-10 w-10 text-primary mx-auto mb-2" />
                <span className="text-xs font-semibold text-[var(--muted)] block">Steps Today</span>
                <span className="text-3xl font-bold text-[var(--foreground)] block my-1">{metrics.steps}</span>
                <span className="text-xs text-[var(--muted)]">Target: 5,000 steps</span>
              </GlassCard>

              <GlassCard glowColor="violet" className="p-6 text-center rounded-3xl">
                <Droplet className="h-10 w-10 text-secondary mx-auto mb-2" />
                <span className="text-xs font-semibold text-[var(--muted)] block">Water Logged</span>
                <span className="text-3xl font-bold text-[var(--foreground)] block my-1">{waterLogged} ml</span>
                <Button
                  variant="glass"
                  size="md"
                  onClick={() => setWaterLogged(w => w + 250)}
                  className="mt-3 w-full border-primary/20 text-primary bg-primary/5 rounded-2xl"
                >
                  + Add 1 Cup (250ml)
                </Button>
              </GlassCard>
            </div>

            {/* Medication list */}
            <GlassCard glowColor="none" className="p-6 rounded-3xl">
              <h3 className="font-semibold text-sm text-[var(--foreground)] mb-4">Your Daily Reminders</h3>
              <div className="space-y-3">
                {meds.map((med, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleToggleMed(idx)}
                    className={`flex justify-between items-center p-4 rounded-2xl border cursor-pointer transition-all ${
                      med.taken
                        ? "border-primary/10 bg-primary/5 opacity-60"
                        : "border-[var(--border)] bg-[var(--muted-bg)]/30 hover:bg-[var(--muted-bg)]/60"
                    }`}
                  >
                    <div className="space-y-1">
                      <span className="text-xs font-semibold text-[var(--foreground)] block">{med.name}</span>
                      <span className="text-[10px] text-[var(--muted)]">{med.time}</span>
                    </div>
                    <span className={`text-[10px] font-semibold px-3 py-1 rounded-full ${
                      med.taken
                        ? "bg-primary/10 text-primary"
                        : "bg-[var(--border)] text-[var(--muted)]"
                    }`}>
                      {med.taken ? "✓ Completed" : "Pending"}
                    </span>
                  </div>
                ))}
              </div>
            </GlassCard>

          </div>
        )}

        {/* ======= ATHLETE PERFORMANCE MODE ======= */}
        {activeMode === "performance" && (
          <div className="space-y-6">

            {/* Performance metrics row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <GlassCard glowColor="violet" className="p-5 flex flex-col justify-between min-h-[130px]">
                <span className="text-[10px] font-semibold text-[var(--muted)] block mb-1">CNS Fatigue</span>
                <div className="analytics-number text-[var(--foreground)]">42%</div>
                <span className="text-[10px] text-emerald-600 mt-1 block">Optimal Threshold</span>
                <div className="progress-bar mt-3">
                  <div className="progress-bar-fill bg-primary" style={{ width: "42%" }} />
                </div>
              </GlassCard>

              <GlassCard glowColor="emerald" className="p-5 flex flex-col justify-between min-h-[130px]">
                <span className="text-[10px] font-semibold text-[var(--muted)] block mb-1">HRV Status</span>
                <div className="analytics-number text-[var(--foreground)]">84 ms</div>
                <span className="text-[10px] text-emerald-600 mt-1 block">Stable Stance</span>
                <div className="progress-bar mt-3">
                  <div className="progress-bar-fill bg-secondary" style={{ width: "84%" }} />
                </div>
              </GlassCard>

              <GlassCard glowColor="rose" className="p-5 flex flex-col justify-between min-h-[130px]">
                <span className="text-[10px] font-semibold text-[var(--muted)] block mb-1">Metabolic Rate</span>
                <div className="analytics-number text-[var(--foreground)]">{metrics.metabolicEfficiency}%</div>
                <span className="text-[10px] text-[var(--muted)] mt-1 block">Optimal</span>
                <div className="progress-bar mt-3">
                  <div className="progress-bar-fill bg-rose-500/80" style={{ width: `${metrics.metabolicEfficiency}%` }} />
                </div>
              </GlassCard>

              <GlassCard glowColor="amber" className="p-5 flex flex-col justify-between min-h-[130px]">
                <span className="text-[10px] font-semibold text-[var(--muted)] block mb-1">Glycemic Level</span>
                <div className="analytics-number text-primary">{metrics.glycemicIndexLoad}</div>
                <span className="text-[10px] text-[var(--muted)] mt-1 block">Glycogen stores primed</span>
              </GlassCard>
            </div>

            {/* Precision macros */}
            <GlassCard glowColor="none" className="p-5">
              <div className="flex items-center gap-2 mb-4">
                <TrendingDown className="h-4 w-4 text-primary" />
                <h3 className="font-semibold text-xs text-[var(--foreground)] uppercase tracking-wider">Nutrition Target Mix</h3>
              </div>
              <div className="grid grid-cols-3 gap-4 text-center">
                {[
                  { label: "Protein", value: "165.4g", color: "text-primary" },
                  { label: "Carbs", value: "210.0g", color: "text-secondary" },
                  { label: "Healthy Fats", value: "54.2g", color: "text-accent" },
                ].map((m) => (
                  <div key={m.label} className="p-4 rounded-2xl bg-[var(--muted-bg)]/45 border border-[var(--border)]">
                    <span className={`text-[10px] font-semibold ${m.color} block uppercase tracking-wider`}>{m.label}</span>
                    <span className="text-base font-bold text-[var(--foreground)] block mt-1">{m.value}</span>
                    <span className="text-[9px] text-[var(--muted)] mt-0.5 block">Recommended</span>
                  </div>
                ))}
              </div>
            </GlassCard>

            {/* PR Tracker */}
            <GlassCard glowColor="rose" className="p-5">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-semibold text-[var(--muted)] flex items-center gap-1.5">
                  <Award className="h-4 w-4 text-rose-500" /> 
                  Personal Benchmarks
                </span>
                <span className="text-[9px] bg-rose-500/10 text-rose-500 font-semibold px-2.5 py-0.5 rounded-full uppercase tracking-wider">Active</span>
              </div>
              <div className="grid grid-cols-4 gap-3 text-center text-xs font-semibold">
                <div className="p-3 bg-[var(--muted-bg)]/40 rounded-2xl border border-[var(--border)]">
                  <span className="text-[9px] text-[var(--muted)] block uppercase tracking-wider">Deadlift</span>
                  <span className="text-sm font-bold text-[var(--foreground)] block mt-0.5">160 kg</span>
                </div>
                <div className="p-3 bg-[var(--muted-bg)]/40 rounded-2xl border border-[var(--border)]">
                  <span className="text-[9px] text-[var(--muted)] block uppercase tracking-wider">Squat</span>
                  <span className="text-sm font-bold text-[var(--foreground)] block mt-0.5">135 kg</span>
                </div>
                <div className="p-3 bg-[var(--muted-bg)]/40 rounded-2xl border border-[var(--border)]">
                  <span className="text-[9px] text-[var(--muted)] block uppercase tracking-wider">Bench</span>
                  <span className="text-sm font-bold text-[var(--foreground)] block mt-0.5">105 kg</span>
                </div>
                <div className="p-3 bg-[var(--muted-bg)]/40 rounded-2xl border border-[var(--border)]">
                  <span className="text-[9px] text-[var(--muted)] block uppercase tracking-wider">5K Run</span>
                  <span className="text-sm font-bold text-[var(--foreground)] block mt-0.5">19:42 m</span>
                </div>
              </div>
            </GlassCard>

          </div>
        )}

        {/* ======= EVERYDAY WELLNESS MODE ======= */}
        {activeMode === "wellness" && (
          <div className="space-y-6">

            {/* Wellness indicators */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <GlassCard glowColor="violet" className="p-5 flex flex-col justify-between min-h-[120px]">
                <div>
                  <span className="text-[10px] font-semibold text-[var(--muted)] block uppercase tracking-wider">Lifestyle Balance</span>
                  <div className="analytics-number text-[var(--foreground)] mt-2">{metrics.lifestyleSustainability}%</div>
                </div>
                <p className="text-xs text-[var(--muted)] leading-relaxed mt-2">Consistent rest schedules protect your cardiovascular rhythm.</p>
              </GlassCard>

              <GlassCard glowColor="rose" className="p-5 flex flex-col justify-between min-h-[120px]">
                <div>
                  <span className="text-[10px] font-semibold text-[var(--muted)] block uppercase tracking-wider">Daily Health Observations</span>
                  <p className="text-xs font-semibold text-rose-500 leading-snug mt-2">{metrics.micronutrientDeficiencies[0]}</p>
                </div>
                <p className="text-xs text-[var(--muted)] leading-relaxed mt-2">Spend 15 minutes in natural afternoon sunlight today.</p>
              </GlassCard>
            </div>

          </div>
        )}

        {/* ======= LIFESTYLE FORECASTS & TIMELINE ======= */}
        {predictions && (
          <GlassCard glowColor="violet" className="p-6 space-y-6 rounded-[28px]">
            {logStatus && (
              <div className="p-3 bg-secondary/15 border border-secondary/20 rounded-2xl text-xs font-semibold text-secondary text-center animate-bounce shadow-md">
                {logStatus}
              </div>
            )}
            
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-[var(--border)]">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                  <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Future Health Prediction Engine</span>
                </div>
                <h3 className="text-base font-semibold text-[var(--foreground)] tracking-tight">Looking ahead at tomorrow's energy</h3>
                <p className="text-xs text-[var(--muted)]">Calculated from your sleep regularity, water intake, and active neural stress logs.</p>
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => setSimulating(!simulating)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                    simulating 
                      ? "bg-secondary text-white border-secondary shadow-md shadow-secondary/15" 
                      : "bg-foreground/5 text-foreground/70 border-foreground/10 hover:border-secondary/30"
                  }`}
                >
                  🔮 {simulating ? "Close Sandbox" : "Try Lifestyle Simulator"}
                </button>
              </div>
            </div>

            {/* Simulated sliders panel */}
            {simulating && (
              <div className="p-4 bg-secondary/5 rounded-2xl border border-secondary/15 space-y-4 animate-[fadeIn_0.3s_ease-out]">
                <div className="flex justify-between items-center text-xs font-bold text-secondary">
                  <span>🔮 Lifestyle Prediction Simulator Active</span>
                  <span className="text-[10px] uppercase bg-secondary text-white px-2 py-0.5 rounded-full">Interactive Sandbox</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div className="space-y-1.5">
                    <div className="flex justify-between font-bold">
                      <span>Simulated Sleep Hours</span>
                      <span className="text-primary font-black">{simSleep}h</span>
                    </div>
                    <input
                      type="range"
                      min="4"
                      max="10"
                      step="0.5"
                      value={simSleep}
                      onChange={(e) => setSimSleep(Number(e.target.value))}
                      className="w-full h-1 bg-foreground/10 rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex justify-between font-bold">
                      <span>Simulated Water Target</span>
                      <span className="text-secondary font-black">{simWater} ml</span>
                    </div>
                    <input
                      type="range"
                      min="500"
                      max="4000"
                      step="250"
                      value={simWater}
                      onChange={(e) => setSimWater(Number(e.target.value))}
                      className="w-full h-1 bg-foreground/10 rounded-lg appearance-none cursor-pointer accent-secondary"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex justify-between font-bold">
                      <span>Simulated Daily Stress</span>
                      <span className="text-rose-400 font-black">{simStress}%</span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="95"
                      step="5"
                      value={simStress}
                      onChange={(e) => setSimStress(Number(e.target.value))}
                      className="w-full h-1 bg-foreground/10 rounded-lg appearance-none cursor-pointer accent-rose-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Rhythm Gauges Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Burnout Risk Indicator */}
              <div className="bg-[var(--muted-bg)]/40 p-5 rounded-2xl border border-[var(--border)] space-y-2.5">
                <div className="flex justify-between items-center text-xs font-semibold text-[var(--muted)]">
                  <span>Energy balance</span>
                  <span className={predictions.burnoutRisk > 60 ? "text-rose-500" : predictions.burnoutRisk > 35 ? "text-amber-600" : "text-primary"}>
                    {100 - predictions.burnoutRisk}%
                  </span>
                </div>
                <div className="w-full bg-[var(--border)] h-1.5 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${
                      predictions.burnoutRisk > 60 ? "bg-rose-500" : predictions.burnoutRisk > 35 ? "bg-amber-500" : "bg-primary"
                    }`}
                    style={{ width: `${100 - predictions.burnoutRisk}%` }} 
                  />
                </div>
                <span className="text-[10px] text-[var(--muted)] block leading-normal">
                  {predictions.burnoutRisk > 60 ? "⚠️ Focus on restorative periods today." : "Optimal energy reservoir."}
                </span>
              </div>

              {/* Central Nervous Strain (CNS) fatigue */}
              <div className="bg-[var(--muted-bg)]/40 p-5 rounded-2xl border border-[var(--border)] space-y-2.5">
                <div className="flex justify-between items-center text-xs font-semibold text-[var(--muted)]">
                  <span>Rest profile</span>
                  <span className={predictions.fatigueBuildup > 65 ? "text-rose-500" : predictions.fatigueBuildup > 40 ? "text-amber-600" : "text-primary"}>
                    {100 - predictions.fatigueBuildup}%
                  </span>
                </div>
                <div className="w-full bg-[var(--border)] h-1.5 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${
                      predictions.fatigueBuildup > 65 ? "bg-rose-500" : predictions.fatigueBuildup > 40 ? "bg-amber-500" : "bg-primary"
                    }`}
                    style={{ width: `${100 - predictions.fatigueBuildup}%` }} 
                  />
                </div>
                <span className="text-[10px] text-[var(--muted)] block leading-normal">
                  {predictions.fatigueBuildup > 65 ? "⚠️ Slight rest debt. Wind down early." : "Recovery battery charged."}
                </span>
              </div>



            </div>

            {/* Smart Proactive Notifications */}
            {predictions.preventiveReminders.length > 0 && (
              <div className="space-y-3 pt-4 border-t border-[var(--border)]">
                <span className="text-[10px] font-bold text-secondary uppercase tracking-widest flex items-center gap-1.5">
                  <ShieldAlert className="h-4 w-4" />
                  Daily recommendations for you
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-semibold text-[var(--foreground)]">
                  {predictions.preventiveReminders.slice(0, 4).map((reminder, idx) => (
                    <div key={idx} className="flex items-center gap-2 p-3 bg-secondary/5 rounded-2xl border border-secondary/10 hover:bg-secondary/8 transition-colors">
                      <Sparkles className="h-3.5 w-3.5 text-secondary shrink-0" />
                      <span className="leading-snug text-foreground/80">{reminder.replace("Circadian Debt Alert", "Rest Alert")}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </GlassCard>
        )}

        {/* ======= QUICK ACTIONS (all modes except elderly) ======= */}
        {activeMode !== "elderly" && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link href="/nutrition" className="block">
              <div className="flex items-center gap-3.5 p-4 rounded-3xl border border-[var(--border)] bg-[var(--card-bg)] hover:border-primary/30 hover:bg-primary/3 transition-all group cursor-pointer shadow-sm hover:shadow-[0_4px_12px_rgba(0,0,0,0.02)]">
                <div className="h-8 w-8 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/15 transition-colors">
                  <Flame className="h-4 w-4 text-primary" />
                </div>
                <div className="space-y-0.5">
                  <p className="text-xs font-semibold text-[var(--foreground)]">Log Meals</p>
                  <p className="text-[10px] text-[var(--muted)]">Track your daily foods</p>
                </div>
              </div>
            </Link>

            <Link href="/sleep" className="block">
              <div className="flex items-center gap-3.5 p-4 rounded-3xl border border-[var(--border)] bg-[var(--card-bg)] hover:border-violet-500/30 hover:bg-violet-500/3 transition-all group cursor-pointer shadow-sm hover:shadow-[0_4px_12px_rgba(0,0,0,0.02)]">
                <div className="h-8 w-8 rounded-2xl bg-violet-500/10 flex items-center justify-center shrink-0 group-hover:bg-violet-500/15 transition-colors">
                  <Moon className="h-4 w-4 text-violet-500" />
                </div>
                <div className="space-y-0.5">
                  <p className="text-xs font-semibold text-[var(--foreground)]">Log Sleep</p>
                  <p className="text-[10px] text-[var(--muted)]">Note last night's rest</p>
                </div>
              </div>
            </Link>

            <Link href="/ai-coach" className="block">
              <div className="flex items-center gap-3.5 p-4 rounded-3xl border border-[var(--border)] bg-[var(--card-bg)] hover:border-secondary/30 hover:bg-secondary/3 transition-all group cursor-pointer shadow-sm hover:shadow-[0_4px_12px_rgba(0,0,0,0.02)]">
                <div className="h-8 w-8 rounded-2xl bg-secondary/10 flex items-center justify-center shrink-0 group-hover:bg-secondary/15 transition-colors">
                  <Brain className="h-4 w-4 text-secondary" />
                </div>
                <div className="space-y-0.5">
                  <p className="text-xs font-semibold text-[var(--foreground)]">Wellness Chat</p>
                  <p className="text-[10px] text-[var(--muted)]">Speak with your companion</p>
                </div>
              </div>
            </Link>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}
