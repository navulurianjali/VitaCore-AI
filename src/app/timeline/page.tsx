"use client";

import React, { useState, useEffect } from "react";
import { Milestone, TrendingUp, Sparkles, Layers, ShieldAlert, Award, Calendar, Heart } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import GlassCard from "@/components/ui/GlassCard";
import Button from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { getBaseMetrics, getDigitalTwinForecast, DailyMetrics, TwinForecastPoint } from "@/utils/mockData";

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

  // Format milestone logs in a friendly, supportive tone
  const timelineEvents = [
    {
      date: "May 24, 2026",
      title: "Sleep Consistency Milestone",
      description: "Wonderful progress! You completed 14 consecutive nights of stable sleep timing, increasing your daytime recovery index by 8%.",
      type: "milestone",
      color: "border-emerald-500 text-emerald-500 bg-emerald-500/10",
      icon: Award
    },
    {
      date: "May 18, 2026",
      title: "Active Wellness Notification",
      description: "We detected a slight 4.5% uptick in your resting heart rate over two weeks, likely due to late-night snacking. Try keeping a 3-hour buffer before bedtime!",
      type: "decline",
      color: "border-amber-500 text-amber-500 bg-amber-500/10",
      icon: ShieldAlert
    },
    {
      date: "May 10, 2026",
      title: "Adaptive Routine Integration",
      description: "Smart adjustment! Swapped outdoor jogging for an indoor dynamic stretching routine during cold weather to protect your throat and keep lungs safe.",
      type: "adaptation",
      color: "border-primary text-primary bg-primary/10",
      icon: Sparkles
    }
  ];

  // Grab forecasted endpoints for a summary comparison
  const finalPoint = twinPoints[twinPoints.length - 1] || { constructiveScore: 90, destructiveScore: 40 };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        
        {/* Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl glass-panel border-foreground/5 bg-gradient-to-r from-primary/10 via-background to-secondary/5 p-6">
          <div className="space-y-1">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight flex items-center gap-2">
              <Milestone className="h-6 w-6 text-primary animate-pulse" />
              Your Future Health Journey
            </h1>
            <p className="text-xs text-foreground/70 font-semibold">
              Visualize how your daily habits today shape your health age, consistency scores, and long-term vitality
            </p>
          </div>
        </div>

        {/* 1. STABILITY & HEALTH AGE CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Consistency Score Card */}
          <GlassCard glowColor="violet" className="p-5 flex justify-between items-center min-h-[130px]">
            <div className="space-y-2 pr-4">
              <span className="text-xs font-bold text-foreground/60">Lifestyle Consistency Score</span>
              <h2 className="text-3xl font-bold text-primary">{metrics.stabilityScore}% (Excellent)</h2>
              <p className="text-xs text-foreground/60 leading-relaxed font-semibold">
                Your regular sleep routines and stable hydration parameters are actively protecting your cells and daily energy.
              </p>
            </div>
            <div className="h-12 w-12 rounded-2xl bg-primary/15 text-primary flex items-center justify-center font-bold text-lg shrink-0">
              📈
            </div>
          </GlassCard>

          {/* Health Age Card */}
          <GlassCard glowColor="emerald" className="p-5 flex justify-between items-center min-h-[130px]">
            <div className="space-y-2 pr-4">
              <span className="text-xs font-bold text-foreground/60">Health Age</span>
              <h2 className="text-3xl font-bold text-secondary">{metrics.biologicalAge} years</h2>
              <p className="text-xs text-foreground/60 leading-relaxed font-semibold">
                Outstanding! Your preventative daily habits keep your body functioning younger than your biological milestone.
              </p>
            </div>
            <div className="h-12 w-12 rounded-2xl bg-secondary/15 text-secondary flex items-center justify-center font-bold text-lg shrink-0">
              🌱
            </div>
          </GlassCard>

        </div>

        {/* 2. DUAL LAYOUT: Visual forecast comparison vs Milestones */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left panel: Visual Forecasting comparison */}
          <div className="lg:col-span-7 rounded-2xl glass-panel p-6 border-foreground/5 flex flex-col justify-between space-y-6">
            <div className="space-y-5">
              <h3 className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <Layers className="h-4.5 w-4.5 text-primary" />
                Future Health Forecast
              </h3>
              <p className="text-xs text-foreground/75 leading-relaxed font-semibold">
                A simple projection of your wellness scores over the next few months, illustrating a healthy progress path compared to a default lifestyle decline:
              </p>

              {/* Clean visual habit paths comparison */}
              <div className="space-y-6 pt-2">
                
                {/* 1. Healthy Path */}
                <div className="space-y-2 p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/10">
                  <div className="flex justify-between items-center text-xs font-bold">
                    <span className="text-emerald-500 flex items-center gap-1">
                      <Sparkles className="h-4 w-4 animate-pulse" />
                      Healthy Progress Path
                    </span>
                    <span className="text-emerald-500">{finalPoint.constructiveScore}% Consistency</span>
                  </div>
                  <div className="w-full bg-emerald-500/10 h-3 rounded-full overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-500" 
                      style={{ width: `${finalPoint.constructiveScore}%` }} 
                    />
                  </div>
                  <p className="text-[11px] text-foreground/60 leading-relaxed font-semibold">
                    *Maintained by consistent sleep, adequate hydration, daily walks, and moderate workouts.
                  </p>
                </div>

                {/* 2. Unhealthy Path */}
                <div className="space-y-2 p-4 rounded-2xl bg-rose-500/5 border border-rose-500/10">
                  <div className="flex justify-between items-center text-xs font-bold">
                    <span className="text-rose-400 flex items-center gap-1">
                      <ShieldAlert className="h-4 w-4" />
                      Unhealthy Lifestyle Path
                    </span>
                    <span className="text-rose-400">{finalPoint.destructiveScore}% Consistency</span>
                  </div>
                  <div className="w-full bg-rose-500/10 h-3 rounded-full overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-rose-500 to-amber-500 h-full rounded-full transition-all duration-500" 
                      style={{ width: `${finalPoint.destructiveScore}%` }} 
                    />
                  </div>
                  <p className="text-[11px] text-foreground/60 leading-relaxed font-semibold">
                    *Expected decline if sleep debt rises, hydration is skipped, and screen hours remain high.
                  </p>
                </div>

              </div>

              {/* Friendly Predictive Insights Box */}
              <div className="pt-2">
                <GlassCard glowColor="violet" className="p-4 border border-primary/10 bg-primary/5">
                  <h4 className="text-xs font-bold text-primary flex items-center gap-1.5 mb-1.5">
                    <TrendingUp className="h-4 w-4" />
                    AI Future Habit Insights
                  </h4>
                  <ul className="space-y-2 text-xs text-foreground/75 leading-relaxed font-semibold">
                    <li className="flex gap-2">
                      <span className="text-emerald-500 font-bold">•</span>
                      <span>💡 **Sleep Advantage**: Adjusting your sleep routine by just 30 minutes can boost your long-term energy consistency by 15%.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-emerald-500 font-bold">•</span>
                      <span>💡 **Hydration Impact**: Keeping hydration above 2.5L protects metabolic efficiency and reduces afternoon fatigue levels.</span>
                    </li>
                  </ul>
                </GlassCard>
              </div>

            </div>

            {/* Time duration selection */}
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

          {/* Right panel: Health evolution milestones */}
          <div className="lg:col-span-5 rounded-2xl glass-panel p-6 border-foreground/5 space-y-5 flex flex-col">
            <h3 className="text-xs font-bold text-foreground">Your Health Milestones & Alerts</h3>
            
            <div className="space-y-6 pt-3 relative pl-4 border-l border-foreground/5 flex-1">
              {timelineEvents.map((ev, idx) => {
                const IconComponent = ev.icon;
                return (
                  <div key={idx} className="space-y-1.5 relative">
                    {/* Clean timeline dot indicator with matching theme icon color */}
                    <div className="absolute -left-[27.5px] top-1 h-5 w-5 rounded-full bg-background border border-foreground/10 flex items-center justify-center shrink-0">
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

      </div>
    </DashboardLayout>
  );
}
