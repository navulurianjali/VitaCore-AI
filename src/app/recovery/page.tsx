"use client";

import React, { useState, useEffect } from "react";
import { HeartPulse, CloudSun, Sparkles, Thermometer, ShieldAlert, Brain, Footprints, Info, Wind, Play, Pause, RefreshCw, Smile, Moon } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import GlassCard from "@/components/ui/GlassCard";
import Button from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { useHealthData } from "@/hooks/useHealthData";
import { getEnvironmentAdjustedRoutine, EnvironmentInfo } from "@/utils/predictiveEngine";
import { supabase } from "@/utils/supabase";

export default function RecoveryPage() {
  const { profile } = useAuth();
  const { activeMode } = useTheme();
  const { metrics, loading } = useHealthData();
  const [recentWorkouts, setRecentWorkouts] = useState(0);

  // Fetch recent workouts for workout load calculation
  useEffect(() => {
    async function fetchWorkouts() {
      if (!supabase || !profile?.id) return;
      const threeDaysAgo = new Date();
      threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
      const { data: workoutData } = await supabase
        .from("workouts")
        .select("id")
        .eq("user_id", profile.id)
        .gte("created_at", threeDaysAgo.toISOString());
      if (workoutData) {
        setRecentWorkouts(workoutData.length);
      }
    }
    fetchWorkouts();
  }, [profile]);
  
  // Lifestyle atmospheric factors
  const [temp, setTemp] = useState(34); // High heat to trigger adaptive override
  const [aqi, setAqi] = useState(165); // High pollution to trigger respiratory warning
  const [workHours, setWorkHours] = useState(10); // Overtime focus hours

  // Breathing Coach states
  const [breathingActive, setBreathingActive] = useState(false);
  const [breathPhase, setBreathPhase] = useState("Ready");
  const [selectedSession, setSelectedSession] = useState<"box" | "sleep" | "cns">("box");

  // Box breathing timer
  useEffect(() => {
    if (!breathingActive) return;
    let count = 0;
    const interval = setInterval(() => {
      count = (count + 1) % 4;
      const phases = selectedSession === "box"
        ? ["Inhale (4s)", "Hold (4s)", "Exhale (4s)", "Hold (4s)"]
        : selectedSession === "sleep"
        ? ["Inhale (4s)", "Hold (7s)", "Exhale (8s)", "Rest (2s)"]
        : ["Inhale (5s)", "Hold (2s)", "Exhale (5s)", "Rest (2s)"];
      setBreathPhase(phases[count]);
    }, selectedSession === "box" ? 4000 : selectedSession === "sleep" ? 5250 : 3500);
    return () => clearInterval(interval);
  }, [breathingActive, selectedSession]);

  if (loading || !metrics) return <div className="p-8 text-center text-[var(--muted)]">Loading recovery telemetry...</div>;

  const envInfo: EnvironmentInfo = {
    weather: "Sunny / Heatwave",
    temperatureCelsius: temp,
    pollutionIndexAqi: aqi,
    workloadHours: workHours,
    travelStatus: false
  };

  const adjustedRoutine = getEnvironmentAdjustedRoutine(envInfo, metrics, activeMode);

  // Compute positive, user-friendly equivalents of fatigue scores
  const mentalEnergy = Math.max(0, 100 - metrics.mentalFatigue);
  
  // Derive body recovery from actual data: sleep, hydration, recent workouts
  const hydrationRatio = Math.min(1, metrics.hydrationMl / metrics.hydrationTarget);
  const sleepRatio = Math.min(1, metrics.sleepHours / metrics.sleepTarget);
  const workoutLoad = Math.min(1, recentWorkouts / 5); // 5 workouts in 3 days = fully loaded
  const bodyRecoveryPercentage = Math.round(
    (sleepRatio * 40 + hydrationRatio * 30 + (1 - workoutLoad) * 20 + (metrics.recoveryPercentage / 100) * 10)
  );
  
  // Derive stress from actual metrics
  const computedStress = Math.round(metrics.stressLevel * 0.6 + metrics.mentalFatigue * 0.4);

  // Generate dynamic, supportive AI coaching advice based on current lifestyle sliders
  const getAICoachInsight = () => {
    if (temp >= 32) {
      return "☀️ It's warm outside today. We've suggested a lighter activity level and added 600ml of water to your daily goal to help you stay hydrated.";
    }
    if (aqi > 150) {
      return "⚠️ The air quality is a bit poor today. We recommend staying indoors for your exercises to keep your breathing easy and your body happy.";
    }
    if (workHours > 9) {
      return "🧠 You've had a lot of screen time today. We've adjusted your suggestions to a gentle walk and light stretching to help you unwind and clear your mind.";
    }
    return "✨ Your body is resting and recovering beautifully. Today is a wonderful day for a regular workout—just remember to drink enough water!";
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        
        {/* Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl glass-panel border-foreground/5 bg-gradient-to-r from-primary/10 via-background to-secondary/5 p-6">
          <div className="space-y-1">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight flex items-center gap-2">
              <HeartPulse className="h-6 w-6 text-primary animate-pulse" />
              Energy & Rest Insights
            </h1>
            <p className="text-xs text-foreground/70 font-semibold">
              See how well your body is resting and get simple, friendly tips for your day.
            </p>
          </div>
        </div>

        {/* 1. EMOTIONAL & SUPPORTIVE WELLNESS CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: Mental Energy */}
          <GlassCard glowColor="violet" className="flex flex-col justify-between min-h-[160px] p-5">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5">
                <Brain className="h-4 w-4 text-primary" />
                <span className="text-xs font-bold text-foreground/60">Mental Energy</span>
              </div>
              <div className="text-2xl font-bold mt-1.5">{mentalEnergy}% (Focused)</div>
            </div>
            <div className="w-full bg-foreground/10 h-2 rounded-full overflow-hidden my-3">
              <div className="bg-primary h-full rounded-full" style={{ width: `${mentalEnergy}%` }} />
            </div>
            <p className="text-xs text-foreground/60 leading-relaxed font-medium">
              Your mind is clear and ready. It's a great day for focusing on important tasks or learning something new.
            </p>
          </GlassCard>

          {/* Card 2: Body Recovery */}
          <GlassCard glowColor="rose" className="flex flex-col justify-between min-h-[160px] p-5">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5">
                <Footprints className="h-4 w-4 text-rose-400" />
                <span className="text-xs font-bold text-foreground/60">Physical Rest & Energy</span>
              </div>
              <div className="text-2xl font-bold mt-1.5">{bodyRecoveryPercentage}% Charged</div>
            </div>
            <div className="w-full bg-foreground/10 h-2 rounded-full overflow-hidden my-3">
              <div className="bg-rose-500 h-full rounded-full" style={{ width: `${bodyRecoveryPercentage}%` }} />
            </div>
            <p className="text-xs text-foreground/60 leading-relaxed font-medium">
              Your muscles are a bit tight today. We suggest some gentle stretching or a light walk to help them relax.
            </p>
          </GlassCard>

          {/* Card 3: Workout Stress Risk */}
          <GlassCard glowColor="emerald" className="flex flex-col justify-between min-h-[160px] p-5">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 text-secondary" />
                <span className="text-xs font-bold text-foreground/60">Stress Level</span>
              </div>
              <div className="text-2xl font-bold mt-1.5">{computedStress <= 35 ? "Low" : computedStress <= 60 ? "Moderate" : "High"} ({computedStress}%)</div>
            </div>
            <div className="w-full bg-foreground/10 h-2 rounded-full overflow-hidden my-3">
              <div className={`h-full rounded-full ${computedStress <= 35 ? "bg-secondary" : computedStress <= 60 ? "bg-amber-500" : "bg-red-500"}`} style={{ width: `${computedStress}%` }} />
            </div>
            <p className="text-xs text-foreground/60 leading-relaxed font-medium">
              {computedStress <= 35
                ? "Your stress is low and your energy is high. You're ready for any light activity or a fun workout today."
                : computedStress <= 60
                ? "You're carrying some stress today. A short walk or quiet breathing can help bring things back into balance."
                : "Stress is running high today. Let's take it easy — try a calming breathing exercise and skip anything intense."}
            </p>
          </GlassCard>

        </div>

        {/* 2. DUAL LAYOUT: Suggestions vs Lifestyle Simulator */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left panel: Daily Recovery Suggestions */}
          <div className="lg:col-span-7 rounded-2xl glass-panel p-6 border-foreground/5 flex flex-col justify-between space-y-6">
            <div className="space-y-5">
              <h3 className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <CloudSun className="h-4.5 w-4.5 text-primary" />
                Today's Suggestions
              </h3>
              
              <div className="space-y-3 pt-1">
                <div className="p-3.5 bg-foreground/5 rounded-xl border border-foreground/5 text-xs font-semibold flex justify-between items-center">
                  <span className="text-foreground/65">Suggested Effort</span>
                  <span className="text-rose-500 font-bold bg-rose-500/10 px-2.5 py-1 rounded-lg">
                    {adjustedRoutine.workoutIntensity}
                  </span>
                </div>

                <div className="p-3.5 bg-foreground/5 rounded-xl border border-foreground/5 text-xs font-semibold flex flex-col gap-1.5">
                  <span className="text-foreground/65">Suggested Movement / Exercise</span>
                  <span className="text-primary font-bold">{adjustedRoutine.workoutRecommendation}</span>
                </div>

                <div className="p-3.5 bg-foreground/5 rounded-xl border border-foreground/5 text-xs font-semibold flex justify-between items-center">
                  <span className="text-foreground/65">Water Target</span>
                  <span className="text-secondary font-bold bg-secondary/10 px-2.5 py-1 rounded-lg">
                    {adjustedRoutine.hydrationTarget} ml
                  </span>
                </div>
              </div>
            </div>

            {/* AI Recovery Insight Message Box */}
            <div className="pt-4 border-t border-foreground/5 space-y-3">
              <h4 className="text-xs font-bold text-primary flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 text-primary animate-spin" />
                Coach's Observations & Advice
              </h4>
              <div className="p-4 rounded-xl border border-primary/10 bg-primary/5 text-xs font-semibold text-foreground/85 leading-relaxed">
                {getAICoachInsight()}
              </div>
            </div>

            {/* Active environmental warnings rendered as friendly coaching advice */}
            {adjustedRoutine.alerts.length > 0 && (
              <div className="space-y-2.5 pt-4 border-t border-foreground/5">
                <h4 className="text-xs font-bold text-red-500 flex items-center gap-1">
                  <ShieldAlert className="h-4 w-4" />
                  Things to Keep in Mind
                </h4>
                {adjustedRoutine.alerts.map((al, idx) => (
                  <p key={idx} className="text-xs text-foreground/75 leading-relaxed font-semibold pl-1.5 border-l-2 border-red-500">
                    {al}
                  </p>
                ))}
              </div>
            )}
          </div>

          {/* Right panel: Sliders for Daily Lifestyle Factors */}
          <div className="lg:col-span-5 rounded-2xl glass-panel p-6 border-foreground/5 flex flex-col justify-between space-y-6">
            <div className="space-y-5">
              <div className="space-y-1">
                <h3 className="text-xs font-bold text-foreground">Your Daily Environment</h3>
                <p className="text-[11px] text-foreground/60 leading-relaxed font-semibold">
                  Use these sliders to see how the weather or screen time changes your daily tips.
                </p>
              </div>

              {/* Temperature slider */}
              <div className="space-y-2 pt-2">
                <div className="flex justify-between text-xs font-bold">
                  <span className="flex items-center gap-1">
                    <Thermometer className="h-4 w-4 text-primary" />
                    Outside Temperature
                  </span>
                  <span className="text-primary">{temp}°C</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="45"
                  value={temp}
                  onChange={(e) => setTemp(Number(e.target.value))}
                  className="w-full h-1 bg-foreground/10 rounded-lg appearance-none cursor-pointer accent-primary"
                />
              </div>

              {/* Pollution slider */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold">
                  <span>Air Quality Index (AQI)</span>
                  <span className="text-secondary">AQI {aqi}</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="300"
                  value={aqi}
                  onChange={(e) => setAqi(Number(e.target.value))}
                  className="w-full h-1 bg-foreground/10 rounded-lg appearance-none cursor-pointer accent-secondary"
                />
              </div>

              {/* Workload hours slider */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold">
                  <span>Daily Screen Time</span>
                  <span className="text-accent">{workHours} hours</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="14"
                  value={workHours}
                  onChange={(e) => setWorkHours(Number(e.target.value))}
                  className="w-full h-1 bg-foreground/10 rounded-lg appearance-none cursor-pointer accent-accent"
                />
              </div>
            </div>

            <div className="text-[10px] text-foreground/50 leading-relaxed font-semibold border-t border-foreground/5 pt-4 flex gap-1.5 items-start">
              <Info className="h-3.5 w-3.5 shrink-0 text-primary mt-0.5" />
              <span>Adjusted automatically to help you stay active and feel great in any weather.</span>
            </div>
          </div>

        </div>

        {/* 3. MIND & RECOVERY INTERACTIVE MINDFULNESS SECTION */}
        <GlassCard glowColor="emerald" className="p-6 space-y-6 mt-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-foreground/5">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Wind className="h-4.5 w-4.5 text-secondary animate-pulse" />
                <span className="text-[10px] font-bold text-secondary uppercase tracking-widest">Mind & Recovery</span>
              </div>
              <h3 className="text-base font-extrabold text-[var(--foreground)] tracking-tight">Calming Breathing & Mindfulness Coach</h3>
              <p className="text-xs text-[var(--muted)]">Synchronize your breathing cycles, lower stress levels, and feel deeply rested.</p>
            </div>
            <span className="bg-emerald-500/10 text-emerald-400 text-[9px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider shrink-0 animate-pulse">
              Mind: Calm
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            
            {/* Left Column: Preset meditation selector cards */}
            <div className="md:col-span-6 space-y-3">
              <span className="text-[10px] font-bold text-foreground/50 uppercase block">Select Calm Protocol</span>
              
              <div className="space-y-2">
                {[
                  { id: "box", label: "Calming Box Breathing", desc: "Inhale, hold, exhale, hold for 4 seconds each. A classic slow breathing rhythm to help calm your mind and body.", icon: Wind },
                  { id: "sleep", label: "Relaxing Bedtime Breathing", desc: "Inhale 4s, hold 7s, exhale 8s. A gentle breathing pattern that helps you unwind and drift off to sleep easily.", icon: Moon },
                  { id: "cns", label: "Deep Tension Release", desc: "Inhale 5s, hold 2s, exhale 5s. Helps let go of stress, relax your muscles, and clear a busy mind.", icon: Brain }
                ].map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => {
                      setSelectedSession(opt.id as any);
                      setBreathingActive(false);
                      setBreathPhase("Ready");
                    }}
                    className={`w-full text-left p-3.5 rounded-xl border text-xs font-bold transition-all hover:bg-foreground/5 flex items-start gap-3 cursor-pointer ${
                      selectedSession === opt.id
                        ? "border-secondary bg-secondary/5 shadow-md shadow-secondary/5"
                        : "border-foreground/5 bg-foreground/5 text-foreground/80"
                    }`}
                  >
                    <span className="text-xl shrink-0 mt-0.5"><opt.icon className="h-4.5 w-4.5 text-secondary" /></span>
                    <div className="space-y-0.5 min-w-0">
                      <span className="text-xs font-bold block">{opt.label}</span>
                      <span className="text-[10px] text-foreground/50 block font-semibold leading-normal">{opt.desc}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Right Column: Visual Breath Sphere and Controls */}
            <div className="md:col-span-6 flex flex-col items-center justify-center p-4 bg-foreground/5 rounded-2xl border border-foreground/5 space-y-4">
              <span className="text-[9px] font-bold text-foreground/45 uppercase tracking-wider block">Breath Synchronization Sphere</span>
              
              {/* Expanding/Contracting Breathing Indicator */}
              <div className="relative flex items-center justify-center h-28 w-28 rounded-full border-4 border-secondary/20 bg-secondary/5 shadow-inner shrink-0">
                <div
                  className={`absolute rounded-full bg-secondary/15 transition-all duration-[4000ms] ${
                    breathingActive ? "h-24 w-24 opacity-100 animate-pulse" : "h-12 w-12 opacity-60"
                  }`}
                />
                <span className="relative z-10 text-xs font-black text-secondary text-center leading-tight">
                  {breathingActive ? breathPhase : "Ready"}
                </span>
              </div>

              {/* Start / Stop Trigger controls */}
              <div className="flex gap-2 w-full pt-2">
                {!breathingActive ? (
                  <Button 
                    variant="primary" 
                    onClick={() => {
                      setBreathingActive(true);
                      setBreathPhase(selectedSession === "box" ? "Inhale (4s)" : selectedSession === "sleep" ? "Inhale (4s)" : "Inhale (5s)");
                    }}
                    className="w-full py-2.5 text-xs font-bold flex items-center justify-center gap-1 bg-secondary text-white hover:bg-secondary/90 shadow-md shadow-secondary/20"
                  >
                    <Play className="h-4 w-4 fill-white" />
                    <span>Start Breathing</span>
                  </Button>
                ) : (
                  <Button 
                    variant="glass" 
                    onClick={() => {
                      setBreathingActive(false);
                      setBreathPhase("Ready");
                    }}
                    className="w-full py-2.5 text-xs font-bold flex items-center justify-center gap-1 border-secondary/20 text-secondary"
                  >
                    <Pause className="h-4 w-4" />
                    <span>Pause Session</span>
                  </Button>
                )}
              </div>

              <span className="text-[9px] font-bold text-foreground/40 leading-relaxed text-center block max-w-[280px]">
                *Follow the expanding circle to naturally relax your body.
              </span>
            </div>

          </div>
        </GlassCard>

      </div>
    </DashboardLayout>
  );
}
