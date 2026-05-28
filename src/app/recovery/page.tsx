"use client";

import React, { useState, useEffect } from "react";
import { HeartPulse, CloudSun, AlertTriangle, Sparkles, Thermometer, ShieldAlert } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import GlassCard from "@/components/ui/GlassCard";
import Button from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { getBaseMetrics, getEnvironmentAdjustedRoutine, DailyMetrics, EnvironmentInfo } from "@/utils/mockData";

export default function RecoveryPage() {
  const { activeMode } = useTheme();
  const [metrics, setMetrics] = useState<DailyMetrics | null>(null);
  
  // Environment weather states
  const [temp, setTemp] = useState(34); // High heat to trigger the adaptive override
  const [aqi, setAqi] = useState(165); // High pollution to trigger the respiratory warning
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

  return (
    <DashboardLayout>
      <div className="space-y-8">
        
        {/* Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl glass-panel border-foreground/5 bg-gradient-to-r from-primary/10 via-background to-secondary/5">
          <div className="space-y-1">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight flex items-center gap-2">
              <HeartPulse className="h-6 w-6 text-primary animate-pulse" />
              Recovery & Fatigue Intelligence
            </h1>
            <p className="text-xs text-foreground/70 font-semibold">
              Physical vs mental fatigue indexes, environment routine overrides & soreness mapping
            </p>
          </div>
        </div>

        {/* 1. THREE CARD FATIGUE VALUES */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <GlassCard glowColor="violet" className="flex flex-col justify-between min-h-[140px]">
            <div>
              <span className="text-xs font-bold text-foreground/60">CNS Mental Fatigue</span>
              <div className="text-2xl font-bold mt-1">{metrics.mentalFatigue}%</div>
            </div>
            <div className="w-full bg-foreground/10 h-1.5 rounded-full overflow-hidden">
              <div className="bg-primary h-full rounded-full" style={{ width: `${metrics.mentalFatigue}%` }} />
            </div>
            <p className="text-xs text-foreground/50 leading-normal">
              Cognitive battery levels are depleted by prolonged coding work hours.
            </p>
          </GlassCard>

          <GlassCard glowColor="rose" className="flex flex-col justify-between min-h-[140px]">
            <div>
              <span className="text-xs font-bold text-foreground/60">Muscular soreness index</span>
              <div className="text-2xl font-bold mt-1">Grade 4 / 10</div>
            </div>
            <div className="w-full bg-foreground/10 h-1.5 rounded-full overflow-hidden">
              <div className="bg-red-500 h-full rounded-full" style={{ width: "40%" }} />
            </div>
            <p className="text-xs text-foreground/50 leading-normal">
              Soreness isolated in hamstrings and lower lumbar erectors.
            </p>
          </GlassCard>

          <GlassCard glowColor="emerald" className="flex flex-col justify-between min-h-[140px]">
            <div>
              <span className="text-xs font-bold text-foreground/60">Overtraining Risk threshold</span>
              <div className="text-2xl font-bold mt-1">28% (Low)</div>
            </div>
            <div className="w-full bg-foreground/10 h-1.5 rounded-full overflow-hidden">
              <div className="bg-secondary h-full rounded-full" style={{ width: "28%" }} />
            </div>
            <p className="text-xs text-foreground/50 leading-normal">
              Adequate recovery buffer exists to support light mobility drills today.
            </p>
          </GlassCard>

        </div>

        {/* 2. DUAL LAYOUT: Adaptive Environment AI overrides vs controller */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left panel: Env Routine adjustments list */}
          <div className="lg:col-span-7 rounded-2xl glass-panel p-6 border-foreground/5 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <CloudSun className="h-4.5 w-4.5 text-primary" />
                Adaptive Environment AI Recommendations
              </h3>
              
              <div className="space-y-3.5 pt-2">
                <div className="p-3 bg-foreground/5 rounded-xl border border-foreground/5 text-xs font-semibold flex justify-between">
                  <span className="text-foreground/65">Throttled Intensity Target</span>
                  <span className="text-red-500 font-bold">{adjustedRoutine.workoutIntensity}</span>
                </div>

                <div className="p-3 bg-foreground/5 rounded-xl border border-foreground/5 text-xs font-semibold flex flex-col gap-1.5">
                  <span className="text-foreground/65">AI Selected Exercise Zone</span>
                  <span className="text-primary font-bold">{adjustedRoutine.workoutRecommendation}</span>
                </div>

                <div className="p-3 bg-foreground/5 rounded-xl border border-foreground/5 text-xs font-semibold flex justify-between">
                  <span className="text-foreground/65">Adjusted Hydration buffer</span>
                  <span className="text-secondary font-bold">{adjustedRoutine.hydrationTarget} ml</span>
                </div>
              </div>
            </div>

            {/* Render env alerts */}
            {adjustedRoutine.alerts.length > 0 && (
              <div className="space-y-2.5 pt-4 border-t border-foreground/5">
                <h4 className="text-xs font-bold text-red-500 flex items-center gap-1">
                  <ShieldAlert className="h-4 w-4" />
                  Active Environmental Warnings
                </h4>
                {adjustedRoutine.alerts.map((al, idx) => (
                  <p key={idx} className="text-xs text-foreground/75 leading-normal font-semibold">
                    • {al}
                  </p>
                ))}
              </div>
            )}
          </div>

          {/* Right panel: Simulator parameters slider controller */}
          <div className="lg:col-span-5 rounded-2xl glass-panel p-6 border-foreground/5 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-foreground">Environment Simulator</h3>
              <p className="text-xs text-foreground/60 leading-normal font-semibold">
                Adjust slider coordinates to trigger reactive AI atmospheric overrides:
              </p>

              {/* Temperature slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold">
                  <span>External Air Temp</span>
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
              <div className="space-y-1.5">
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
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold">
                  <span>Focus Coding workload</span>
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

            <div className="text-[9px] text-foreground/50 leading-normal font-semibold border-t border-foreground/5 pt-3">
              *Calculated in real time using local weather matrices.
            </div>
          </div>

        </div>

      </div>
    </DashboardLayout>
  );
}
