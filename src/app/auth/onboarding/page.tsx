"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, ShieldCheck, ArrowRight, ArrowLeft, HeartPulse, Sparkles, LayoutGrid } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import Button from "@/components/ui/Button";
import GlassCard from "@/components/ui/GlassCard";
import confetti from "canvas-confetti";

export default function OnboardingPage() {
  const { profile, updateProfile } = useAuth();
  const router = useRouter();
  
  const [step, setStep] = useState(1);

  // STEP 1: Basic Info
  const [age, setAge] = useState(28);
  const [gender, setGender] = useState("male");
  const [weight, setWeight] = useState(72);
  const [height, setHeight] = useState(178);
  const [occupation, setOccupation] = useState("Software Engineer");
  const [timezone, setTimezone] = useState("UTC+5:30");

  // STEP 2: Fitness Info
  const [fitnessLevel, setFitnessLevel] = useState("intermediate");
  const [goal, setGoal] = useState("burnout_protection");
  const [workoutDuration, setWorkoutDuration] = useState(30);
  const [workoutTime, setWorkoutTime] = useState("morning");
  const [homeGym, setHomeGym] = useState("home");

  // STEP 3: Health Info
  const [injuries, setInjuries] = useState("none");
  const [conditions, setConditions] = useState("none");
  const [surgeries, setSurgeries] = useState("none");
  const [mobilityLimits, setMobilityLimits] = useState("none");
  const [sleepProblems, setSleepProblems] = useState(false);
  const [medications, setMedications] = useState("none");

  // STEP 4: Nutrition & Mental Wellness
  const [diet, setDiet] = useState("standard");
  const [allergies, setAllergies] = useState("none");
  const [caffeine, setCaffeine] = useState("medium");
  const [anxietyRating, setAnxietyRating] = useState(4);
  const [motivation, setMotivation] = useState(80);

  // STEP 5: Lifestyle & Smart Sync
  const [screenTime, setScreenTime] = useState(9);
  const [sittingHours, setSittingHours] = useState(8);
  const [wearableType, setWearableType] = useState("apple_health");
  const [loading, setLoading] = useState(false);
  const [chosenMode, setChosenMode] = useState<"wellness" | "performance" | "elderly">("wellness");

  // Math variables
  const heightM = height / 100;
  const bmi = Math.round((weight / (heightM * heightM)) * 10) / 10;
  const bodyFat = Math.round(
    (1.20 * bmi + 0.23 * age - (gender === "male" ? 16.2 : 5.4)) * 10
  ) / 10;

  const handleNext = () => {
    // When transitioning to step 6, pre-fill the recommended mode
    if (step === 5) {
      let recommended: "wellness" | "performance" | "elderly" = "wellness";
      if (goal === "burnout_protection") recommended = "wellness";
      if (fitnessLevel === "advanced" || goal === "stamina_optimization") recommended = "performance";
      if (age > 65) recommended = "elderly";
      setChosenMode(recommended);
    }
    setStep((prev) => Math.min(6, prev + 1));
  };

  const handleBack = () => {
    setStep((prev) => Math.max(1, prev - 1));
  };

  const handleCompleteOnboarding = async () => {
    setLoading(true);
    try {
      const updates = {
        weight_kg: Number(weight),
        height_cm: Number(height),
        fitness_goal: goal,
        bmi: bmi,
        body_fat_estimate: bodyFat,
        occupation: occupation,
        timezone: timezone,
        fitness_level: fitnessLevel,
        workout_duration_preference: Number(workoutDuration),
        preferred_workout_time: workoutTime,
        home_gym_preference: homeGym,
        previous_injuries: injuries,
        chronic_conditions: conditions,
        surgeries: surgeries,
        mobility_limitations: mobilityLimits,
        sleep_problems: sleepProblems,
        dietary_preferences: diet,
        allergies: allergies,
        caffeine_intake: caffeine,
        wearable_synced: true,
        anxiety_rating: Number(anxietyRating),
        motivation_level: Number(motivation),
        screen_time_hours: Number(screenTime),
        sitting_hours: Number(sittingHours),
        active_mode: chosenMode,
        onboarding_completed: true
      };

      await updateProfile(updates);

      // confettis
      confetti({
        particleCount: 120,
        spread: 80,
        colors: ["#8b5cf6", "#10b981", "#ec4899"]
      });

      router.push("/dashboard");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center bg-background px-4 py-16 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.05),transparent_60%)]" />

      <div className="w-full max-w-xl relative z-10 space-y-6">
        
        {/* Header Title */}
        <div className="text-center space-y-2">
          <div className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-white">
            <Activity className="h-5 w-5 animate-pulse" />
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">Onboarding Diagnostic Console</h2>
          <p className="text-[10px] text-foreground/50 font-bold tracking-widest uppercase flex items-center gap-1 justify-center">
            <ShieldCheck className="h-3.5 w-3.5 text-secondary" />
            Biometric Personalization Protocol (Step {step} / 6)
          </p>
        </div>

        <GlassCard glowColor="violet">
          
          <AnimatePresence mode="wait">
            
            {/* STEP 1: Basic Biometrics */}
            {step === 1 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <h3 className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1">
                  <Sparkles className="h-4 w-4 animate-bounce" />
                  Basic Telemetry Parameters
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-foreground">Chronological Age</label>
                    <input
                      type="number"
                      value={age}
                      onChange={(e) => setAge(Number(e.target.value))}
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-foreground/10 bg-foreground/5 text-foreground focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-foreground">Biological Gender</label>
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-foreground/10 bg-background text-foreground focus:outline-none"
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-foreground">Chronological Weight (kg)</label>
                    <input
                      type="number"
                      value={weight}
                      onChange={(e) => setWeight(Number(e.target.value))}
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-foreground/10 bg-foreground/5 text-foreground focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-foreground">Chronological Height (cm)</label>
                    <input
                      type="number"
                      value={height}
                      onChange={(e) => setHeight(Number(e.target.value))}
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-foreground/10 bg-foreground/5 text-foreground focus:outline-none"
                    />
                  </div>
                </div>

                <div className="rounded-xl border border-foreground/5 bg-foreground/5 p-3 flex justify-between items-center text-xs font-semibold">
                  <div>
                    <span className="text-foreground/50 block text-[9px] uppercase">BMI Score</span>
                    <span className="text-primary font-bold text-sm">{bmi}</span>
                  </div>
                  <div>
                    <span className="text-foreground/50 block text-[9px] uppercase">Body Fat Est.</span>
                    <span className="text-secondary font-bold text-sm">{bodyFat}%</span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 2: Lifestyle stats */}
            {step === 2 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <h3 className="text-xs font-bold uppercase tracking-wider text-primary">Lifestyle Activity Telemetry</h3>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-foreground">Main Occupation</label>
                  <input
                    type="text"
                    value={occupation}
                    onChange={(e) => setOccupation(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-foreground/10 bg-foreground/5 text-foreground focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-foreground">Screen time (hours / day)</label>
                    <input
                      type="number"
                      value={screenTime}
                      onChange={(e) => setScreenTime(Number(e.target.value))}
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-foreground/10 bg-foreground/5 text-foreground focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-foreground">Sedentary sitting hours</label>
                    <input
                      type="number"
                      value={sittingHours}
                      onChange={(e) => setSittingHours(Number(e.target.value))}
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-foreground/10 bg-foreground/5 text-foreground focus:outline-none"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 3: Fitness & Goals */}
            {step === 3 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <h3 className="text-xs font-bold uppercase tracking-wider text-primary">Fitness & Longevity Goals</h3>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-foreground">Active Goal</label>
                    <select
                      value={goal}
                      onChange={(e) => setGoal(e.target.value)}
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-foreground/10 bg-background text-foreground focus:outline-none"
                    >
                      <option value="burnout_protection">CNS Burnout Protection</option>
                      <option value="stamina_optimization">Cardiovascular Stamina</option>
                      <option value="longevity_maintenance">Biological Longevity</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-foreground">Current Level</label>
                    <select
                      value={fitnessLevel}
                      onChange={(e) => setFitnessLevel(e.target.value)}
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-foreground/10 bg-background text-foreground focus:outline-none"
                    >
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced Athlete</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-foreground">Workout Duration Preference (minutes)</label>
                  <input
                    type="number"
                    value={workoutDuration}
                    onChange={(e) => setWorkoutDuration(Number(e.target.value))}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-foreground/10 bg-foreground/5 text-foreground focus:outline-none"
                  />
                </div>
              </motion.div>
            )}

            {/* STEP 4: Injuries & medicals */}
            {step === 4 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <h3 className="text-xs font-bold uppercase tracking-wider text-primary">Injuries & Health Impediments</h3>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-foreground">Previous Injuries</label>
                    <input
                      type="text"
                      value={injuries}
                      onChange={(e) => setInjuries(e.target.value)}
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-foreground/10 bg-foreground/5 text-foreground focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-foreground">Surgeries History</label>
                    <input
                      type="text"
                      value={surgeries}
                      onChange={(e) => setSurgeries(e.target.value)}
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-foreground/10 bg-foreground/5 text-foreground focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-foreground">Chronic Conditions</label>
                  <input
                    type="text"
                    value={conditions}
                    onChange={(e) => setConditions(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-foreground/10 bg-foreground/5 text-foreground focus:outline-none"
                  />
                </div>

                <div className="flex items-center justify-between p-3 bg-foreground/5 rounded-xl border border-foreground/5">
                  <label className="text-xs font-bold text-foreground">Do you suffer from sleep problems?</label>
                  <input
                    type="checkbox"
                    checked={sleepProblems}
                    onChange={(e) => setSleepProblems(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-primary"
                  />
                </div>
              </motion.div>
            )}

            {/* STEP 5: Diets & Wearable integrations */}
            {step === 5 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <h3 className="text-xs font-bold uppercase tracking-wider text-primary">Dietary Preferences & Wearable Sync</h3>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-foreground">Dietary Preferences</label>
                    <select
                      value={diet}
                      onChange={(e) => setDiet(e.target.value)}
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-foreground/10 bg-background text-foreground focus:outline-none"
                    >
                      <option value="standard">Standard Mixed</option>
                      <option value="vegetarian">Vegetarian</option>
                      <option value="vegan">Vegan</option>
                      <option value="keto">Keto</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-foreground">Allergies / Restrictions</label>
                    <input
                      type="text"
                      value={allergies}
                      onChange={(e) => setAllergies(e.target.value)}
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-foreground/10 bg-foreground/5 text-foreground focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-foreground">Wearable Smartwatch Sync Integration</label>
                  <select
                    value={wearableType}
                    onChange={(e) => setWearableType(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-foreground/10 bg-background text-foreground focus:outline-none"
                  >
                    <option value="apple_health">Apple Health Sync</option>
                    <option value="google_fit">Google Fit Sync</option>
                    <option value="fitbit">Fitbit Integration</option>
                    <option value="none">No smartwatch (Manual entries)</option>
                  </select>
                </div>
              </motion.div>
            )}

            {/* STEP 6: Active Mode Selection */}
            {step === 6 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <h3 className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
                  <LayoutGrid className="h-4 w-4 text-primary" />
                  Select Active Optimization Path
                </h3>
                <p className="text-[11px] text-foreground/70 leading-relaxed font-medium">
                  VitalCore scales its visuals, features, and accessibility layout to align with your health focus. Select the mode that governs your telemetry terminal.
                </p>

                <div className="space-y-3 pt-1">
                  {/* Everyday Wellness Card */}
                  <div
                    onClick={() => setChosenMode("wellness")}
                    className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
                      chosenMode === "wellness"
                        ? "bg-emerald-500/10 border-emerald-500 shadow-md shadow-emerald-500/10 scale-[1.01]"
                        : "bg-foreground/5 border-foreground/10 hover:bg-foreground/10"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold text-lg">
                        🌿
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center">
                          <h4 className="text-xs font-bold text-foreground">Everyday Wellness</h4>
                          {chosenMode === "wellness" && (
                            <span className="text-[9px] font-bold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full uppercase">
                              Active Mode
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-foreground/60 mt-0.5 leading-relaxed font-medium">
                          Stress resilience, pranayama box breathing cycles, sleep tracking, and steady recovery balance.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Athletic Performance Card */}
                  <div
                    onClick={() => setChosenMode("performance")}
                    className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
                      chosenMode === "performance"
                        ? "bg-violet-500/10 border-violet-500 shadow-md shadow-violet-500/10 scale-[1.01]"
                        : "bg-foreground/5 border-foreground/10 hover:bg-foreground/10"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-lg bg-violet-500/10 text-violet-500 flex items-center justify-center font-bold text-lg">
                        ⚡
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center">
                          <h4 className="text-xs font-bold text-foreground">Athletic Performance</h4>
                          {chosenMode === "performance" && (
                            <span className="text-[9px] font-bold text-violet-400 bg-violet-400/10 px-2 py-0.5 rounded-full uppercase">
                              Active Mode
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-foreground/60 mt-0.5 leading-relaxed font-medium">
                          CNS fatigue thresholds, precise macro indicators, metabolic efficiency, and strength indexing.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Elderly Care & Longevity Card */}
                  <div
                    onClick={() => setChosenMode("elderly")}
                    className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
                      chosenMode === "elderly"
                        ? "bg-amber-500/10 border-amber-500 shadow-md shadow-amber-500/10 scale-[1.01]"
                        : "bg-foreground/5 border-foreground/10 hover:bg-foreground/10"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold text-lg">
                        🩺
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center">
                          <h4 className="text-xs font-bold text-foreground">Elderly Care & Longevity</h4>
                          {chosenMode === "elderly" && (
                            <span className="text-[9px] font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full uppercase">
                              Active Mode
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-foreground/60 mt-0.5 leading-relaxed font-medium">
                          AAA high-contrast readability, safety medical widgets, medication alerts, and low-impact posture.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

          </AnimatePresence>

          {/* Navigation Controls */}
          <div className="pt-6 mt-6 border-t border-foreground/5 flex justify-between gap-3">
            {step > 1 ? (
              <Button variant="glass" onClick={handleBack} className="flex items-center gap-1.5">
                <ArrowLeft className="h-4 w-4" />
                <span>Back</span>
              </Button>
            ) : (
              <div />
            )}

            {step < 6 ? (
              <Button variant="primary" onClick={handleNext} className="flex items-center gap-1.5 ml-auto">
                <span>Continue</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button variant="primary" onClick={handleCompleteOnboarding} isLoading={loading} className="flex items-center gap-1.5 ml-auto">
                <span>Complete Protocol</span>
                <ShieldCheck className="h-4 w-4" />
              </Button>
            )}
          </div>

        </GlassCard>

      </div>
    </div>
  );
}
