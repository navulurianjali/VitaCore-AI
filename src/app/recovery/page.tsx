"use client";

import React, { useState, useEffect } from "react";
import { HeartPulse, CloudSun, Sparkles, Thermometer, ShieldAlert, Brain, Footprints, Info } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import GlassCard from "@/components/ui/GlassCard";
import Button from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { getBaseMetrics, getEnvironmentAdjustedRoutine, DailyMetrics, EnvironmentInfo } from "@/utils/mockData";

export default function RecoveryPage() {
  const { activeMode } = useTheme();
  const [metrics, setMetrics] = useState<DailyMetrics | null>(null);
  
  // Lifestyle atmospheric factors
  const [temp, setTemp] = useState(34); // High heat to trigger adaptive override
  const [aqi, setAqi] = useState(165); // High pollution to trigger respiratory warning
  const [workHours, setWorkHours] = useState(10); // Overtime focus hours

  useEffect(() => {
    setMetrics(getBaseMetrics(activeMode));
  }, [activeMode]);

  if (!metrics) return null;

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
  
  // Format soreness details in friendly language
  const bodyRecoveryPercentage = 60; // Equivalent to Grade 4/10 soreness

  // Generate dynamic, supportive AI coaching advice based on current lifestyle sliders
  const getAICoachInsight = () => {
    if (temp >= 32) {
      return "☀️ High external heat detected. We have lowered your recommended workout intensity and added a 600ml hydration buffer to keep your energy levels safe and balanced.";
    }
    if (aqi > 150) {
      return "⚠️ Poor air quality detected outside. Your coach recommends moving your workout indoors today to protect your respiration and aid muscular oxygenation.";
    }
    if (workHours > 9) {
      return "🧠 Extended screen hours noticed. We've switched your training target to a gentle decompression walk and chest-opening stretches to prevent mental burnout.";
    }
    return "✨ Your body is in a stable, healthy recovery phase. Today is an ideal day for regular workouts, keeping proper hydration in mind!";
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        
        {/* Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl glass-panel border-foreground/5 bg-gradient-to-r from-primary/10 via-background to-secondary/5 p-6">
          <div className="space-y-1">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight flex items-center gap-2">
              <HeartPulse className="h-6 w-6 text-primary animate-pulse" />
              Personal Recovery & Energy
            </h1>
            <p className="text-xs text-foreground/70 font-semibold">
              Understand your body's energy levels, muscular recovery, and daily lifestyle recommendations
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
                <span className="text-xs font-bold text-foreground/60">Mental Energy Level</span>
              </div>
              <div className="text-2xl font-bold mt-1.5">{mentalEnergy}% (Good Focus)</div>
            </div>
            <div className="w-full bg-foreground/10 h-2 rounded-full overflow-hidden my-3">
              <div className="bg-primary h-full rounded-full" style={{ width: `${mentalEnergy}%` }} />
            </div>
            <p className="text-xs text-foreground/60 leading-relaxed font-medium">
              Your cognitive capacity is strong. An excellent day for strategic thinking or deep focus work.
            </p>
          </GlassCard>

          {/* Card 2: Body Recovery */}
          <GlassCard glowColor="rose" className="flex flex-col justify-between min-h-[160px] p-5">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5">
                <Footprints className="h-4 w-4 text-rose-400" />
                <span className="text-xs font-bold text-foreground/60">Body Recovery Status</span>
              </div>
              <div className="text-2xl font-bold mt-1.5">{bodyRecoveryPercentage}% Recovered</div>
            </div>
            <div className="w-full bg-foreground/10 h-2 rounded-full overflow-hidden my-3">
              <div className="bg-rose-500 h-full rounded-full" style={{ width: `${bodyRecoveryPercentage}%` }} />
            </div>
            <p className="text-xs text-foreground/60 leading-relaxed font-medium">
              You have light muscle tightness in your hamstrings. A gentle mobility or stretching routine is ideal today.
            </p>
          </GlassCard>

          {/* Card 3: Workout Stress Risk */}
          <GlassCard glowColor="emerald" className="flex flex-col justify-between min-h-[160px] p-5">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 text-secondary" />
                <span className="text-xs font-bold text-foreground/60">Workout Stress Risk</span>
              </div>
              <div className="text-2xl font-bold mt-1.5">Low Risk (28%)</div>
            </div>
            <div className="w-full bg-foreground/10 h-2 rounded-full overflow-hidden my-3">
              <div className="bg-secondary h-full rounded-full" style={{ width: "28%" }} />
            </div>
            <p className="text-xs text-foreground/60 leading-relaxed font-medium">
              Your recovery buffer is excellent. You are perfectly ready for either light or moderate exercises today.
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
                Today's Recovery Suggestions
              </h3>
              
              <div className="space-y-3 pt-1">
                <div className="p-3.5 bg-foreground/5 rounded-xl border border-foreground/5 text-xs font-semibold flex justify-between items-center">
                  <span className="text-foreground/65">Recommended Intensity</span>
                  <span className="text-rose-500 font-bold bg-rose-500/10 px-2.5 py-1 rounded-lg">
                    {adjustedRoutine.workoutIntensity}
                  </span>
                </div>

                <div className="p-3.5 bg-foreground/5 rounded-xl border border-foreground/5 text-xs font-semibold flex flex-col gap-1.5">
                  <span className="text-foreground/65">Suggested Activity</span>
                  <span className="text-primary font-bold">{adjustedRoutine.workoutRecommendation}</span>
                </div>

                <div className="p-3.5 bg-foreground/5 rounded-xl border border-foreground/5 text-xs font-semibold flex justify-between items-center">
                  <span className="text-foreground/65">Hydration Target</span>
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
                AI Recovery Insight
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
                  Important Daily Alerts
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
                <h3 className="text-xs font-bold text-foreground">Daily Lifestyle Factors</h3>
                <p className="text-[11px] text-foreground/60 leading-relaxed font-semibold">
                  Adjust these sliders to see how weather changes or workload hours immediately reshape your recovery suggestions.
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
                  <span>Workplace Screen Hours</span>
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
              <span>Calculated dynamically to keep you safe under changing environment conditions.</span>
            </div>
          </div>

        </div>

      </div>
    </DashboardLayout>
  );
}
