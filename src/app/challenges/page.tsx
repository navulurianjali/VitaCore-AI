"use client";

import React, { useState, useEffect } from "react";
import { CheckSquare, Sparkles, AlertTriangle, ArrowRight, ShieldAlert, Award, Plus, Trash } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import GlassCard from "@/components/ui/GlassCard";
import Button from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { getBaseMetrics, getActiveChallenges, getDefaultHabits, DailyMetrics, ChallengeItem, HabitItem } from "@/utils/mockData";

export default function ChallengesPage() {
  const { activeMode } = useTheme();
  
  const [metrics, setMetrics] = useState<DailyMetrics | null>(null);
  const [challenges, setChallenges] = useState<ChallengeItem[]>([]);
  const [habits, setHabits] = useState<HabitItem[]>([]);
  const [newHabit, setNewHabit] = useState("");
  const [newHabitCategory, setNewHabitCategory] = useState("Fitness");

  useEffect(() => {
    setMetrics(getBaseMetrics(activeMode));
    setChallenges(getActiveChallenges());
    setHabits(getDefaultHabits());
  }, [activeMode]);

  const handleAddHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHabit.trim()) return;

    const added: HabitItem = {
      id: `habit-${Date.now()}`,
      name: newHabit,
      category: newHabitCategory,
      streak: 0,
      maxStreak: 0,
      excuseTrigger: "Unmapped. Continue routine to seed AI excuse trackers.",
      habitBreakdown: "AI correlation seeding: Habit logged recently. Continue logging for 7 days to trigger excuse diagnostics.",
      consistencyScore: 100
    };

    setHabits(prev => [...prev, added]);
    setNewHabit("");
  };

  const handleCheckInHabit = (id: string) => {
    setHabits(prev => prev.map(h => {
      if (h.id === id) {
        const newStreak = h.streak + 1;
        return {
          ...h,
          streak: newStreak,
          maxStreak: Math.max(h.maxStreak, newStreak),
          consistencyScore: Math.min(100, Math.round(h.consistencyScore + 5))
        };
      }
      return h;
    }));
  };

  const handleDeleteHabit = (id: string) => {
    setHabits(prev => prev.filter(h => h.id !== id));
  };

  if (!metrics) return null;

  return (
    <DashboardLayout>
      <div className="space-y-8">
        
        {/* Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl glass-panel border-foreground/5 bg-gradient-to-r from-primary/10 via-background to-secondary/5">
          <div className="space-y-1">
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight flex items-center gap-2">
              <CheckSquare className="h-6 w-6 text-primary animate-pulse" />
              AI Habit Breakdowns & Challenges
            </h1>
            <p className="text-xs text-foreground/70 font-semibold uppercase tracking-wider">
              Gamified challenges, excuse detection algorithms & cognitive habit loops
            </p>
          </div>
        </div>

        {/* 1. DUAL COLUMNS: Smart Challenges vs Habit Logger */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left panel: Smart Challenges list */}
          <div className="lg:col-span-7 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
                <Award className="h-4.5 w-4.5 text-primary" />
                Active Biometric Sprint Challenges
              </h3>

              <div className="grid grid-cols-1 gap-4">
                {challenges.map((ch) => (
                  <GlassCard key={ch.id} glowColor={ch.progress === 100 ? "emerald" : "violet"} className="p-4 space-y-3 relative overflow-hidden">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="rounded-full bg-foreground/5 border border-foreground/5 px-2 py-0.5 text-[8px] font-bold text-foreground/60 capitalize">
                          {ch.category}
                        </span>
                        <h4 className="text-xs font-bold text-foreground mt-1">{ch.title}</h4>
                      </div>
                      <span className="text-[10px] font-bold text-secondary">
                        +{ch.xpReward} XP
                      </span>
                    </div>
                    <p className="text-[10px] text-foreground/70 font-semibold leading-normal">{ch.description}</p>
                    <div className="space-y-1">
                      <div className="flex justify-between text-[9px] font-bold">
                        <span>Exertion sprint completion</span>
                        <span>{ch.progress}%</span>
                      </div>
                      <div className="w-full bg-foreground/10 h-1 rounded-full overflow-hidden">
                        <div className="bg-primary h-full rounded-full transition-all duration-300" style={{ width: `${ch.progress}%` }} />
                      </div>
                    </div>
                  </GlassCard>
                ))}
              </div>
            </div>

            <div className="text-[10px] text-foreground/50 leading-normal font-semibold border-t border-foreground/5 pt-3 mt-4">
              Biomedical Impact: Completing focus challenges reinforces biological stability scores by <span className="text-secondary font-bold">14.8%</span>.
            </div>
          </div>

          {/* Right panel: Habits list & input logger */}
          <div className="lg:col-span-5 rounded-2xl glass-panel p-6 border-foreground/5 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">Habits Registry</h3>
              
              {/* Habits list */}
              <div className="space-y-3 max-h-[300px] overflow-y-auto scrollbar-none pr-1">
                {habits.map((h) => (
                  <div key={h.id} className="p-3 bg-foreground/5 rounded-xl border border-foreground/5 flex justify-between items-center text-xs">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        <span className="font-extrabold text-foreground">{h.name}</span>
                        <span className="text-[8px] bg-foreground/10 px-1.5 py-0.2 rounded font-bold text-foreground/60">{h.category}</span>
                      </div>
                      <p className="text-[9px] text-foreground/55 font-bold">Streak: {h.streak} days | Max: {h.maxStreak}</p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 ml-3">
                      <button 
                        onClick={() => handleCheckInHabit(h.id)}
                        className="text-[9px] bg-secondary/15 hover:bg-secondary/20 text-secondary border border-secondary/10 px-2 py-1 rounded font-bold transition-all"
                      >
                        Check-in
                      </button>
                      <button 
                        onClick={() => handleDeleteHabit(h.id)}
                        className="p-1 hover:text-red-500 transition-all text-foreground/40"
                      >
                        <Trash className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Habit form inline */}
              <form onSubmit={handleAddHabit} className="border-t border-foreground/5 pt-4 flex gap-2">
                <input
                  type="text"
                  required
                  value={newHabit}
                  onChange={(e) => setNewHabit(e.target.value)}
                  className="w-full text-[10px] px-3.5 py-2 rounded-xl border border-foreground/10 bg-foreground/5 text-foreground placeholder-foreground/45 focus:outline-none"
                  placeholder="Queue new habit (e.g. read 15 min)"
                />
                <Button variant="primary" type="submit" className="p-2 rounded-xl shrink-0 text-xs font-bold">
                  Add
                </Button>
              </form>
            </div>
          </div>

        </div>

        {/* 3. DEDICATED AI EXCUSE ANALYSIS */}
        <div className="space-y-4 pt-4 border-t border-foreground/5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
            <ShieldAlert className="h-4.5 w-4.5 text-amber-500 animate-bounce" />
            AI Excuse Breakdown Analysis
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {habits.slice(0, 3).map((h, idx) => (
              <GlassCard key={idx} glowColor="amber" className="p-5 space-y-3 flex flex-col justify-between">
                <div className="space-y-1">
                  <span className="text-[9px] font-bold text-foreground/50 uppercase">Habit: {h.name}</span>
                  <h4 className="text-xs font-bold text-amber-500 leading-normal">excuse memory trigger:</h4>
                  <p className="text-[10px] text-foreground/75 font-semibold italic leading-normal">
                    "{h.excuseTrigger}"
                  </p>
                </div>
                <div className="border-t border-foreground/5 pt-3 mt-2 text-[9px] text-foreground/70 font-semibold leading-relaxed">
                  {h.habitBreakdown}
                </div>
              </GlassCard>
            ))}
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
