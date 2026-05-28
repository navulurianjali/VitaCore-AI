"use client";

import React, { useState, useEffect } from "react";
import { Milestone, TrendingUp, Sparkles, Layers, ShieldAlert, Award, Calendar, Heart } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import GlassCard from "@/components/ui/GlassCard";
import Button from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { getBaseMetrics, getDigitalTwinForecast, DailyMetrics, TwinForecastPoint } from "@/utils/mockData";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { calculateFutureHealthPredictions } from "@/utils/predictiveEngine";

export default function TimelinePage() {
  const { activeMode } = useTheme();
  const [metrics, setMetrics] = useState<DailyMetrics | null>(null);
  const [simulationMonths, setSimulationMonths] = useState(6);
  const [twinPoints, setTwinPoints] = useState<TwinForecastPoint[]>([]);

  useEffect(() => {
    const base = getBaseMetrics(activeMode);
    setMetrics(base);
    setTwinPoints(getDigitalTwinForecast(base.stabilityScore, simulationMonths));
  }, [activeMode, simulationMonths]);

  if (!metrics) return null;

  const predictions = calculateFutureHealthPredictions({
    sleepHours: metrics.sleepHours,
    sleepQuality: metrics.sleepQuality,
    hydrationMl: metrics.hydrationMl,
    hydrationTarget: metrics.hydrationTarget,
    stressLevel: metrics.stressLevel,
    fatigueScore: metrics.fatigueScore,
    physicalFatigue: metrics.physicalFatigue,
    mentalFatigue: metrics.mentalFatigue,
    sorenessLevel: 0,
    recoveryPercentage: metrics.recoveryPercentage,
    stabilityScore: metrics.stabilityScore,
    screenTimeHours: 6,
    caffeineIntake: 'moderate'
  });

  // Format milestone logs in a friendly, supportive tone
  const timelineEvents = [
    {
      date: "May 24, 2026",
      title: "Great Sleep Routine!",
      description: "Wonderful progress! You went to bed at the same time for 14 nights in a row, which is helping you feel much more energized during the day.",
      type: "milestone",
      color: "border-emerald-500 text-emerald-500 bg-emerald-500/10",
      icon: Award
    },
    {
      date: "May 18, 2026",
      title: "Bedtime Snack Tip",
      description: "We noticed your heart rate was slightly higher at night lately, which might be from eating late. Try having your last snack a few hours before bedtime so your body can rest fully.",
      type: "decline",
      color: "border-amber-500 text-amber-500 bg-amber-500/10",
      icon: ShieldAlert
    },
    {
      date: "May 10, 2026",
      title: "Smart Weather Switch",
      description: "Smart move! Swapping your outdoor run for an indoor stretch when it's freezing outside helps keep your body warm and protects your lungs.",
      type: "adaptation",
      color: "border-primary text-primary bg-primary/10",
      icon: Sparkles
    }
  ];

  // Format energy data for Recharts
  const energyChartData = predictions.futureEnergyTrends.map((val, idx) => ({
    name: `Day ${idx + 1}`,
    Energy: val,
    CircadianPeak: Math.min(98, val + 10),
    CircadianTrough: Math.max(10, val - 15)
  }));


  return (
    <DashboardLayout>
      <div className="space-y-8 pb-10">
        
        {/* Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl glass-panel border-foreground/5 bg-gradient-to-r from-primary/10 via-background to-secondary/5 p-6">
          <div className="space-y-1">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight flex items-center gap-2">
              <Milestone className="h-6 w-6 text-primary animate-pulse" />
              Your Health Journey
            </h1>
            <p className="text-xs text-foreground/70 font-semibold">
              See how your sleep, water, and work habits shape your daily energy and future health trends.
            </p>
          </div>
        </div>

        {/* 1. STABILITY & BIOLOGICAL TWIN AGE SHIFT */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Consistency Score Card */}
          <GlassCard glowColor="violet" className="p-5 flex justify-between items-center min-h-[130px]">
            <div className="space-y-2 pr-4">
              <span className="text-xs font-bold text-foreground/60">Your Habit Score</span>
              <h2 className="text-3xl font-black text-primary">{metrics.stabilityScore}% (Excellent)</h2>
              <p className="text-xs text-foreground/60 leading-relaxed font-semibold">
                Your regular sleep routines and water habits are keeping you fully energized and feeling great.
              </p>
            </div>
            <div className="h-12 w-12 rounded-2xl bg-primary/15 text-primary flex items-center justify-center font-bold text-lg shrink-0">
              📈
            </div>
          </GlassCard>

          {/* Health Age Card */}
          <GlassCard glowColor="emerald" className="p-5 flex justify-between items-center min-h-[130px]">
            <div className="space-y-2 pr-4">
              <span className="text-xs font-bold text-foreground/60">Your Body's Age</span>
              <h2 className="text-3xl font-black text-secondary">
                {metrics.biologicalAge + predictions.biologicalAgeShift} years
              </h2>
              <p className="text-xs text-foreground/60 leading-relaxed font-semibold">
                Amazing! Your good habits are helping you feel and stay younger than your calendar age.
              </p>
            </div>
            <div className="h-12 w-12 rounded-2xl bg-secondary/15 text-secondary flex items-center justify-center font-bold text-lg shrink-0">
              🌱
            </div>
          </GlassCard>

        </div>

        {/* 2. CORE INTELLIGENCE LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left panel: 7-Day Energy Forecast Chart & Predictions */}
          <div className="lg:col-span-7 rounded-2xl glass-panel p-6 border-foreground/5 flex flex-col justify-between space-y-6">
            <div className="space-y-6">
              
              <div className="flex justify-between items-center">
                <h3 className="text-xs font-bold text-foreground flex items-center gap-1.5 uppercase tracking-widest">
                  <Layers className="h-4.5 w-4.5 text-primary animate-pulse" />
                  7-Day Energy Forecast
                </h3>
                <span className="bg-secondary/15 text-secondary text-[8px] font-bold px-2 py-0.5 rounded-full uppercase">
                  Energy Forecast Active
                </span>
              </div>
              <p className="text-xs text-foreground/75 leading-relaxed font-semibold">
                Our simple daily forecast showing your expected energy and peak focus times over the next week:
              </p>

              {/* Chart container */}
              <div className="h-[200px] w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={energyChartData} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#222" opacity={0.1} />
                    <XAxis dataKey="name" stroke="#666" fontSize={9} tickLine={false} />
                    <YAxis stroke="#666" fontSize={9} domain={[0, 100]} tickLine={false} />
                    <Tooltip contentStyle={{ background: "#111", border: "1px solid #333", fontSize: "10px", borderRadius: "8px" }} />
                    <Line type="monotone" dataKey="Energy" stroke="#8b5cf6" strokeWidth={2.5} activeDot={{ r: 5 }} name="Expected Energy" />
                    <Line type="monotone" dataKey="CircadianPeak" stroke="#10b981" strokeWidth={1.5} strokeDasharray="3 3" name="Peak Focus" />
                    <Line type="monotone" dataKey="CircadianTrough" stroke="#f43f5e" strokeWidth={1.5} strokeDasharray="3 3" name="Rest Time" />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Predictive Risk Gauges */}
              <div className="grid grid-cols-3 gap-3 border-t border-foreground/5 pt-4 text-center">
                <div className="p-3 bg-foreground/5 rounded-xl border border-foreground/5 space-y-1">
                  <span className="text-[9px] font-bold text-foreground/50 block">TIREDNESS RISK</span>
                  <span className={`text-sm font-black block ${predictions.burnoutRisk > 60 ? "text-rose-400" : "text-emerald-400"}`}>
                    {predictions.burnoutRisk}%
                  </span>
                </div>
                <div className="p-3 bg-foreground/5 rounded-xl border border-foreground/5 space-y-1">
                  <span className="text-[9px] font-bold text-foreground/50 block">FATIGUE RISK</span>
                  <span className={`text-sm font-black block ${predictions.fatigueBuildup > 65 ? "text-rose-400" : "text-emerald-400"}`}>
                    {predictions.fatigueBuildup}%
                  </span>
                </div>
                <div className="p-3 bg-foreground/5 rounded-xl border border-foreground/5 space-y-1">
                  <span className="text-[9px] font-bold text-foreground/50 block">REST QUALITY</span>
                  <span className={`text-sm font-black block ${predictions.sleepDeteriorationRisk > 60 ? "text-rose-400" : "text-emerald-400"}`}>
                    {100 - predictions.sleepDeteriorationRisk}%
                  </span>
                </div>
              </div>

              {/* AI Longevity insights */}
              <div className="pt-2">
                <GlassCard glowColor="violet" className="p-4 border border-primary/10 bg-primary/5">
                  <h4 className="text-xs font-bold text-primary flex items-center gap-1.5 mb-2 uppercase tracking-widest">
                    <TrendingUp className="h-4 w-4" />
                    AI Future Habit Insights
                  </h4>
                  <ul className="space-y-2 text-xs text-foreground/75 leading-relaxed font-semibold">
                    {predictions.aiInsights.map((insight, idx) => (
                      <li key={idx} className="flex gap-2 items-start">
                        <span className="text-primary font-bold mt-0.5">•</span>
                        <span>{insight}</span>
                      </li>
                    ))}
                  </ul>
                </GlassCard>
              </div>

            </div>

            {/* Time mode active selector */}
            <div className="flex justify-between items-center pt-4 border-t border-foreground/5 shrink-0">
              <span className="text-xs text-foreground/50 font-semibold flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                Forecast Mode Active
              </span>
              <div className="flex gap-2">
                <Button 
                  variant="glass" 
                  size="sm" 
                  onClick={() => setSimulationMonths(3)} 
                  className={simulationMonths === 3 ? "border-primary text-primary font-bold text-xs bg-primary/5" : "text-xs font-bold"}
                >
                  3 Months View
                </Button>
                <Button 
                  variant="glass" 
                  size="sm" 
                  onClick={() => setSimulationMonths(6)} 
                  className={simulationMonths === 6 ? "border-primary text-primary font-bold text-xs bg-primary/5" : "text-xs font-bold"}
                >
                  6 Months View
                </Button>
              </div>
            </div>
          </div>

          {/* Right panel: Preventive Warnings & Milestones */}
          <div className="lg:col-span-5 rounded-2xl glass-panel p-6 border-foreground/5 space-y-6 flex flex-col justify-between">
            <div className="space-y-6">
              <h3 className="text-xs font-bold text-foreground uppercase tracking-widest">
                Healthy Reminders & Achievements
              </h3>

              {/* Warnings panel */}
              <div className="space-y-2.5">
                <span className="text-[10px] font-bold text-secondary uppercase tracking-widest flex items-center gap-1">
                  <ShieldAlert className="h-3.5 w-3.5" />
                  Daily Observations
                </span>
                <div className="space-y-2 text-xs font-semibold text-[var(--foreground)]">
                  {predictions.preventiveReminders.map((reminder, idx) => (
                    <div key={idx} className="flex gap-2 items-start p-3 bg-secondary/5 border border-secondary/15 rounded-xl">
                      <Sparkles className="h-3.5 w-3.5 text-secondary shrink-0 mt-0.5 animate-pulse" />
                      <span className="leading-snug">{reminder}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Milestones timeline */}
              <div className="space-y-4 pt-4 border-t border-foreground/5">
                <span className="text-[10px] font-bold text-foreground/50 uppercase tracking-widest block">
                  Your Wellness Achievements
                </span>
                <div className="space-y-6 relative pl-4 border-l border-foreground/5">
                  {timelineEvents.map((ev, idx) => {
                    const IconComponent = ev.icon;
                    return (
                      <div key={idx} className="space-y-1.5 relative">
                        <div className="absolute -left-[27.5px] top-0 h-5 w-5 rounded-full bg-background border border-foreground/10 flex items-center justify-center shrink-0">
                          <IconComponent className="h-3 w-3 text-foreground/60" />
                        </div>
                        
                        <span className="text-[10px] font-bold text-foreground/45 flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {ev.date}
                        </span>
                        <h4 className="text-xs font-bold text-foreground leading-snug">{ev.title}</h4>
                        <p className="text-xs text-foreground/70 leading-relaxed font-semibold">{ev.description}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

            <div className="text-[10px] text-foreground/45 leading-relaxed font-bold border-t border-foreground/5 pt-4">
              *Predictions are updated continuously based on your daily habit consistency.
            </div>
          </div>

        </div>

      </div>
    </DashboardLayout>
  );
}
