"use client";

import React, { useState, useEffect } from "react";
import { 
  Dumbbell, Play, Pause, RotateCcw, Check, Sparkles, ShieldAlert, 
  Award, Clock, Flame, Droplet, Calendar, TrendingUp, Compass, 
  Heart, CheckSquare, Plus, Save, BookOpen, AlertTriangle, ArrowRight, ArrowLeft,
  ChevronRight, RefreshCw, Layers, Activity
} from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import GlassCard from "@/components/ui/GlassCard";
import Button from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { getBaseMetrics, DailyMetrics } from "@/utils/mockData";
import { supabase } from "@/utils/supabase";
import confetti from "canvas-confetti";

// Curated exercise library
interface Exercise {
  name: string;
  description: string;
  sets: number;
  reps: string;
  durationSeconds: number;
  restSeconds: number;
  equipment: string;
  primaryMuscle: string;
  secondaryMuscle: string;
}

const EXERCISE_DATABASE: Record<string, Exercise[]> = {
  full_body: [
    { name: "Jumping Jacks", description: "Standard cardio warmup. Activates full body coordination and increases core temperature.", sets: 3, reps: "30 sec", durationSeconds: 30, restSeconds: 15, equipment: "Bodyweight", primaryMuscle: "Cardio", secondaryMuscle: "Calves" },
    { name: "Bodyweight Squats", description: "Lower body fundamental. Keeps weight back on heels and maintains posture.", sets: 3, reps: "15 reps", durationSeconds: 45, restSeconds: 20, equipment: "Bodyweight", primaryMuscle: "Legs (Quads/Glutes)", secondaryMuscle: "Core" },
    { name: "Push-ups (or Knee Push-ups)", description: "Upper body push exercise. Trains chest and arms while protecting shoulder joints.", sets: 3, reps: "10-12 reps", durationSeconds: 40, restSeconds: 25, equipment: "Bodyweight", primaryMuscle: "Chest & Arms", secondaryMuscle: "Shoulders" },
    { name: "Plank Hold", description: "Core isometric stability. Keeps hips level and neck neutral to protect the spine.", sets: 3, reps: "30 sec", durationSeconds: 30, restSeconds: 20, equipment: "Bodyweight", primaryMuscle: "Core (Abs)", secondaryMuscle: "Shoulders" }
  ],
  chest: [
    { name: "Push-ups (standard)", description: "Bodyweight push. Targets chest fibers and improves anterior shoulder strength.", sets: 3, reps: "12 reps", durationSeconds: 45, restSeconds: 20, equipment: "Bodyweight", primaryMuscle: "Chest", secondaryMuscle: "Triceps" },
    { name: "Dumbbell Floor Press", description: "Safe press alternative. Limits range of motion at floor to protect rotator cuff.", sets: 3, reps: "10 reps", durationSeconds: 45, restSeconds: 25, equipment: "Dumbbells", primaryMuscle: "Chest", secondaryMuscle: "Shoulders" },
    { name: "Dumbbell Chest Fly", description: "Isolates outer chest muscles while stretching and improving pectoral mobility.", sets: 3, reps: "12 reps", durationSeconds: 40, restSeconds: 30, equipment: "Dumbbells", primaryMuscle: "Chest", secondaryMuscle: "Shoulders" }
  ],
  back: [
    { name: "Prone Cobra Lift", description: "Excellent posterior chain builder. Strengthens upper back and improves posture.", sets: 3, reps: "12 reps", durationSeconds: 35, restSeconds: 15, equipment: "Bodyweight", primaryMuscle: "Upper Back", secondaryMuscle: "Lower Back" },
    { name: "Single-Arm Dumbbell Rows", description: "Unilateral pulling movement. Fixes strength imbalances and targets latissimus dorsi.", sets: 3, reps: "10 reps each", durationSeconds: 50, restSeconds: 20, equipment: "Dumbbells", primaryMuscle: "Mid Back (Lats)", secondaryMuscle: "Biceps" },
    { name: "Bird-Dog Extensions", description: "Decompresses back muscles and builds deep stabilizing spinal cord support.", sets: 3, reps: "12 reps", durationSeconds: 45, restSeconds: 15, equipment: "Bodyweight", primaryMuscle: "Glutes & Back", secondaryMuscle: "Core" }
  ],
  legs: [
    { name: "Bodyweight Squats", description: "Basic squat pattern. Increases mobility in hips, knees, and ankles.", sets: 3, reps: "15 reps", durationSeconds: 45, restSeconds: 20, equipment: "Bodyweight", primaryMuscle: "Legs", secondaryMuscle: "Glutes" },
    { name: "Dumbbell Romanian Deadlifts", description: "Focuses on hip hinge, hamstring load, and strengthening lower lumbar spine.", sets: 3, reps: "10 reps", durationSeconds: 40, restSeconds: 25, equipment: "Dumbbells", primaryMuscle: "Hamstrings", secondaryMuscle: "Lower Back" },
    { name: "Reverse Lunges", description: "Single-leg balance. Safer on knees than forward lunges. Builds glute balance.", sets: 3, reps: "10 reps each", durationSeconds: 50, restSeconds: 20, equipment: "Bodyweight", primaryMuscle: "Legs", secondaryMuscle: "Glutes" }
  ],
  core: [
    { name: "Abdominal Crunches", description: "Compresses abdominal wall. Targets rectus abdominis with controlled flexes.", sets: 3, reps: "15 reps", durationSeconds: 35, restSeconds: 15, equipment: "Bodyweight", primaryMuscle: "Core", secondaryMuscle: "Abs" },
    { name: "Bicycle Crunches", description: "Rotational oblique work. Improves dynamic core rotation strength.", sets: 3, reps: "15 reps each", durationSeconds: 45, restSeconds: 20, equipment: "Bodyweight", primaryMuscle: "Obliques", secondaryMuscle: "Core" },
    { name: "Russian Twists", description: "Engages full transverse abdominis. Can be weighted with light weight.", sets: 3, reps: "20 reps", durationSeconds: 40, restSeconds: 20, equipment: "Bodyweight", primaryMuscle: "Core", secondaryMuscle: "Obliques" }
  ],
  shoulders: [
    { name: "Dumbbell Shoulder Press", description: "Vertical press. Builds shoulder width and enhances posture alignment.", sets: 3, reps: "10 reps", durationSeconds: 45, restSeconds: 25, equipment: "Dumbbells", primaryMuscle: "Shoulders", secondaryMuscle: "Triceps" },
    { name: "Dumbbell Lateral Raise", description: "Targets lateral deltoids to create a balanced, strong shoulder appearance.", sets: 3, reps: "12 reps", durationSeconds: 40, restSeconds: 20, equipment: "Dumbbells", primaryMuscle: "Shoulders", secondaryMuscle: "Trapezius" }
  ],
  mobility: [
    { name: "Cat-Cow Stretch", description: "Relieves tension in upper back, shoulders, and neck while boosting spine mobility.", sets: 3, reps: "45 sec", durationSeconds: 45, restSeconds: 10, equipment: "Bodyweight", primaryMuscle: "Spine", secondaryMuscle: "Shoulders" },
    { name: "Child's Pose Decompression", description: "Stretches chest, lat muscles, and lower back. Slows down heart rate.", sets: 2, reps: "60 sec", durationSeconds: 60, restSeconds: 10, equipment: "Bodyweight", primaryMuscle: "Lower Back", secondaryMuscle: "Shoulders" },
    { name: "Downward Facing Dog Flow", description: "Stretches calves and hamstrings while opening chest and shoulder joints.", sets: 3, reps: "30 sec", durationSeconds: 30, restSeconds: 15, equipment: "Bodyweight", primaryMuscle: "Hamstrings", secondaryMuscle: "Spine" }
  ]
};

export default function FitnessPage() {
  const { profile } = useAuth();
  const { activeMode } = useTheme();
  
  const [metrics, setMetrics] = useState<DailyMetrics | null>(null);
  const [activeTab, setActiveTab] = useState<"coach" | "history" | "progress" | "routines" | "recovery">("coach");
  const [coachState, setCoachState] = useState<"form" | "generating" | "preview" | "active" | "summary">("form");

  // Onboarding questionnaire steps (1 to 6)
  const [questionStep, setQuestionStep] = useState(1);

  // Questionnaire form states
  const [feeling, setFeeling] = useState("normal");
  const [location, setLocation] = useState("home");
  const [focus, setFocus] = useState("full_body");
  const [duration, setDuration] = useState(30);
  const [equipment, setEquipment] = useState("none");
  const [intensity, setIntensity] = useState("moderate");

  // Loading screen ticks state
  const [loadingTick, setLoadingTick] = useState(0);

  // Generated workout session states
  const [generatedWorkout, setGeneratedWorkout] = useState<Exercise[]>([]);
  const [recoveryWarning, setRecoveryWarning] = useState("");
  const [activeWorkoutName, setActiveWorkoutName] = useState("Custom Adaptive Workout");

  // Readiness / Fatigue Score
  const [readinessScore, setReadinessScore] = useState(85);

  // Live Timer states
  const [currentExerciseIdx, setCurrentExerciseIdx] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(45);
  const [isResting, setIsResting] = useState(false);
  const [completedExercises, setCompletedExercises] = useState<boolean[]>([]);

  // Post workout stats
  const [workoutDurationSpent, setWorkoutDurationSpent] = useState(0);
  const [caloriesBurned, setCaloriesBurned] = useState(0);
  const [postWorkoutFeedback, setPostWorkoutFeedback] = useState("");

  // History states
  const [workoutHistory, setWorkoutHistory] = useState<any[]>([]);

  // Saved routines states
  const [savedRoutines, setSavedRoutines] = useState<any[]>([]);

  // Load metrics and local logs on mount
  useEffect(() => {
    const base = getBaseMetrics(activeMode);
    setMetrics(base);

    setSavedRoutines([
      { id: "r1", name: "Everyday Core Decompression", focus: "core", duration: 15, exercisesCount: 3 },
      { id: "r2", name: "Hamstring Recovery Flow", focus: "mobility", duration: 20, exercisesCount: 3 }
    ]);

    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("vitalcore_workout_history");
      if (stored) {
        setWorkoutHistory(JSON.parse(stored));
      } else {
        const dummyHistory = [
          { date: "May 25, 2026", focus: "Mobility", duration: 15, calories: 75, completed: true, rating: "Light Restorative" },
          { date: "May 20, 2026", focus: "Full Body", duration: 30, calories: 210, completed: true, rating: "Moderate Training" }
        ];
        setWorkoutHistory(dummyHistory);
        localStorage.setItem("vitalcore_workout_history", JSON.stringify(dummyHistory));
      }
    }
  }, [activeMode]);

  // Fetch Supabase workouts if possible
  useEffect(() => {
    async function fetchDBWorkouts() {
      if (supabase && profile?.id) {
        try {
          const { data, error } = await supabase
            .from("workouts")
            .select("*")
            .eq("user_id", profile.id)
            .order("created_at", { ascending: false });
          if (data && !error) {
            const merged = data.map((w: any) => ({
              date: new Date(w.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
              focus: w.type,
              duration: w.duration_minutes,
              calories: w.calories_burned,
              completed: w.completed,
              rating: w.intensity
            }));
            setWorkoutHistory(prev => {
              const unique = [...merged];
              prev.forEach(p => {
                if (!unique.some(u => u.date === p.date && u.focus === p.focus)) {
                  unique.push(p);
                }
              });
              return unique;
            });
          }
        } catch (e) {
          console.warn("Could not retrieve online workouts. Fallback to local logs active.");
        }
      }
    }
    if (profile?.id) {
      fetchDBWorkouts();
    }
  }, [profile]);

  // Timer intervals
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timerRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timerRunning && timeLeft === 0) {
      setTimerRunning(false);
      handleTimeExpired();
    }
    return () => clearInterval(interval);
  }, [timerRunning, timeLeft]);

  // Loading Screen ticks animation
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (coachState === "generating") {
      interval = setInterval(() => {
        setLoadingTick(prev => {
          if (prev >= 3) {
            clearInterval(interval);
            setTimeout(() => {
              setCoachState("preview");
            }, 600);
            return 3;
          }
          return prev + 1;
        });
      }, 700);
    }
    return () => clearInterval(interval);
  }, [coachState]);

  const handleTimeExpired = () => {
    if (isResting) {
      setIsResting(false);
      const nextIdx = currentExerciseIdx + 1;
      if (nextIdx < generatedWorkout.length) {
        setCurrentExerciseIdx(nextIdx);
        setTimeLeft(generatedWorkout[nextIdx].durationSeconds);
        setTimerRunning(true);
      } else {
        finishWorkoutSession();
      }
    } else {
      const updated = [...completedExercises];
      updated[currentExerciseIdx] = true;
      setCompletedExercises(updated);

      const nextIdx = currentExerciseIdx + 1;
      if (nextIdx < generatedWorkout.length) {
        setIsResting(true);
        setTimeLeft(generatedWorkout[currentExerciseIdx].restSeconds);
        setTimerRunning(true);
      } else {
        finishWorkoutSession();
      }
    }
  };

  // Compile final adaptive workout
  const compileWorkout = () => {
    setRecoveryWarning("");
    setLoadingTick(0);
    setCoachState("generating");

    const focusKey = focus === "yoga" || focus === "recovery" ? "mobility" : focus;
    const originalList = EXERCISE_DATABASE[focusKey] || EXERCISE_DATABASE["full_body"];
    
    let filteredList = originalList.filter(ex => {
      if (equipment === "none") return ex.equipment === "Bodyweight";
      if (equipment === "dumbbells") return ex.equipment === "Bodyweight" || ex.equipment === "Dumbbells";
      return true;
    });

    if (filteredList.length === 0) {
      filteredList = originalList;
    }

    let finalIntensity = intensity;
    let restBuffer = 0;
    
    // Bio-feedback calculations
    const isFatigued = feeling === "tired" || feeling === "stressed" || feeling === "sore" || (metrics && metrics.sleepQuality < 65);
    const isHighSoreness = profile?.soreness_level && profile.soreness_level > 5;
    
    let readiness = 88;
    if (isFatigued) readiness -= 20;
    if (isHighSoreness) readiness -= 15;
    setReadinessScore(Math.max(30, readiness));

    if (isFatigued || isHighSoreness) {
      finalIntensity = "light";
      restBuffer = 10; 
      setRecoveryWarning(
        "💡 We detected higher fatigue, sleep debt, or muscular soreness. To protect your joints, we have calibrated your workout to a supportive Light intensity and added extra rest buffers."
      );
    }

    const formattedExercises = filteredList.map(ex => {
      let repsLabel = ex.reps;
      let dur = ex.durationSeconds;
      
      if (finalIntensity === "light") {
        dur = Math.round(ex.durationSeconds * 0.8);
        repsLabel = ex.reps.includes("reps") ? `${Math.round(parseInt(ex.reps) * 0.8)} reps` : ex.reps;
      } else if (finalIntensity === "intense") {
        dur = Math.round(ex.durationSeconds * 1.2);
        repsLabel = ex.reps.includes("reps") ? `${Math.round(parseInt(ex.reps) * 1.2)} reps` : ex.reps;
      }

      return {
        ...ex,
        reps: repsLabel,
        durationSeconds: dur,
        restSeconds: ex.restSeconds + restBuffer
      };
    });

    const titleFocus = focus.replace("_", " ").toUpperCase();
    setActiveWorkoutName(`AI ${finalIntensity.toUpperCase()} ${titleFocus} ROUTINE`);
    setGeneratedWorkout(formattedExercises);
    setCompletedExercises(new Array(formattedExercises.length).fill(false));
    setCurrentExerciseIdx(0);
    setTimeLeft(formattedExercises[0].durationSeconds);
    setIsResting(false);
    setTimerRunning(false);
  };

  const handleMarkComplete = () => {
    const updated = [...completedExercises];
    updated[currentExerciseIdx] = true;
    setCompletedExercises(updated);

    const nextIdx = currentExerciseIdx + 1;
    if (nextIdx < generatedWorkout.length) {
      setIsResting(true);
      setTimeLeft(generatedWorkout[currentExerciseIdx].restSeconds);
      setTimerRunning(true);
    } else {
      finishWorkoutSession();
    }
  };

  const handleSkipExercise = () => {
    const nextIdx = currentExerciseIdx + 1;
    if (nextIdx < generatedWorkout.length) {
      setCurrentExerciseIdx(nextIdx);
      setTimeLeft(generatedWorkout[nextIdx].durationSeconds);
      setIsResting(false);
      setTimerRunning(false);
    } else {
      finishWorkoutSession();
    }
  };

  const finishWorkoutSession = async () => {
    setTimerRunning(false);
    confetti({
      particleCount: 150,
      spread: 80,
      colors: ["#8b5cf6", "#10b981", "#ec4899"]
    });

    const mins = duration;
    setWorkoutDurationSpent(mins);
    
    const calorieBurn = Math.round(mins * (intensity === "intense" ? 10 : intensity === "moderate" ? 7 : 4));
    setCaloriesBurned(calorieBurn);

    let feedback = "";
    if (feeling === "tired" || feeling === "stressed") {
      feedback = "🧘 Excellent! Your active mobility and gentle intensity choice today kept cardiac strain low. Remember to hydrate with 600ml of mineralized water within 30 minutes to reduce muscle tension.";
    } else {
      feedback = "⚡ Outstanding! High coordination capacity detected. Your active training today has optimized your muscle glycogen pathways and increased metabolic burn indexes. Great work!";
    }
    setPostWorkoutFeedback(feedback);

    const newLog = {
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      focus: focus.replace("_", " ").toUpperCase(),
      duration: mins,
      calories: calorieBurn,
      completed: true,
      rating: intensity.toUpperCase()
    };

    const stored = localStorage.getItem("vitalcore_workout_history");
    const parsed = stored ? JSON.parse(stored) : [];
    parsed.unshift(newLog);
    setWorkoutHistory(parsed);
    localStorage.setItem("vitalcore_workout_history", JSON.stringify(parsed));

    if (supabase && profile?.id) {
      try {
        await supabase.from("workouts").insert({
          user_id: profile.id,
          name: activeWorkoutName,
          type: focus.replace("_", " ").toUpperCase(),
          duration_minutes: mins,
          intensity: intensity.toLowerCase() as any,
          calories_burned: calorieBurn,
          completed: true,
          adaptive_adapted: recoveryWarning !== "",
          notes: feedback
        });
      } catch (err) {
        console.error("Database save failed. Local session cached successfully.");
      }
    }

    setCoachState("summary");
  };

  const handleSaveRoutine = () => {
    const newRoutine = {
      id: `r-${Date.now()}`,
      name: activeWorkoutName,
      focus: focus,
      duration: duration,
      exercisesCount: generatedWorkout.length
    };
    setSavedRoutines(prev => [newRoutine, ...prev]);
    alert("Routine successfully added to your Saved Routines library!");
  };

  // Advance step in form and automatically submit if final step
  const handleSelectOption = (key: string, val: any) => {
    if (key === "feeling") setFeeling(val);
    if (key === "location") setLocation(val);
    if (key === "focus") setFocus(val);
    if (key === "duration") setDuration(Number(val));
    if (key === "equipment") setEquipment(val);
    if (key === "intensity") {
      setIntensity(val);
      // Last step answered, compile immediately
      setTimeout(() => {
        compileWorkout();
      }, 200);
      return;
    }
    
    // Smooth transition to next step
    setTimeout(() => {
      setQuestionStep(prev => Math.min(6, prev + 1));
    }, 200);
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        
        {/* Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl glass-panel border-foreground/5 bg-gradient-to-r from-primary/10 via-background to-secondary/5 p-6">
          <div className="space-y-1">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight flex items-center gap-2">
              <Dumbbell className="h-6 w-6 text-primary animate-pulse" />
              AI Adaptive Fitness Coach
            </h1>
            <p className="text-xs text-foreground/70 font-semibold">
              Recovery-aware personalized daily routines, live guided training, and visual strength progress
            </p>
          </div>
        </div>

        {/* Tab navigation */}
        <div className="flex border-b border-foreground/5 pb-1 gap-2 overflow-x-auto scrollbar-none">
          {[
            { id: "coach", label: "AI Workout Coach", icon: Dumbbell },
            { id: "history", label: "Workout History", icon: Calendar },
            { id: "progress", label: "Progress Tracking", icon: TrendingUp },
            { id: "routines", label: "Saved Routines", icon: BookOpen },
            { id: "recovery", label: "Recovery Guidance", icon: Heart }
          ].map((tab) => {
            const TabIcon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as any);
                  if (tab.id === "coach") {
                    setCoachState("form");
                    setQuestionStep(1);
                  }
                }}
                className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 shrink-0 ${
                  activeTab === tab.id
                    ? "bg-primary text-white shadow-md shadow-primary/15"
                    : "text-foreground/60 hover:text-foreground hover:bg-foreground/5"
                }`}
              >
                <TabIcon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB CONTENTS */}
        <div className="space-y-6">
          
          {/* TAB 1: COACH TAB */}
          {activeTab === "coach" && (
            <>
              {/* STATE A: MULTI-STEP CONVERSATIONAL QUESTIONNAIRE */}
              {coachState === "form" && (
                <div className="max-w-[500px] mx-auto py-10">
                  <GlassCard glowColor="violet" className="p-6 border border-foreground/5 space-y-6">
                    
                    {/* Header Step progress */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-[10px] font-bold text-foreground/50 tracking-wider uppercase">
                        <span>Step {questionStep} of 6</span>
                        <span>{Math.round((questionStep / 6) * 100)}% Complete</span>
                      </div>
                      <div className="w-full bg-foreground/10 h-1.5 rounded-full overflow-hidden">
                        <div 
                          className="bg-primary h-full rounded-full transition-all duration-300"
                          style={{ width: `${(questionStep / 6) * 100}%` }}
                        />
                      </div>
                    </div>

                    {/* Step 1: Feeling */}
                    {questionStep === 1 && (
                      <div className="space-y-5">
                        <h2 className="text-base font-bold text-foreground tracking-tight leading-snug">
                          How are you feeling today?
                        </h2>
                        <div className="flex flex-col gap-2">
                          {[
                            { value: "energetic", label: "💪 Energetic & Dynamic" },
                            { value: "normal", label: "😌 Good & Normal" },
                            { value: "tired", label: "😴 Tired & Low Energy" },
                            { value: "stressed", label: "🧠 Stressed & Burnt-out" },
                            { value: "sore", label: "🩹 Sore Muscles" }
                          ].map((opt) => (
                            <button
                              key={opt.value}
                              onClick={() => handleSelectOption("feeling", opt.value)}
                              className={`w-full text-left px-4 py-3 rounded-xl border text-xs font-bold transition-all hover:bg-foreground/5 ${
                                feeling === opt.value
                                  ? "border-primary text-primary bg-primary/5 shadow-md shadow-primary/5"
                                  : "border-foreground/5 bg-foreground/5 text-foreground/80"
                              }`}
                            >
                              {opt.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Step 2: Location */}
                    {questionStep === 2 && (
                      <div className="space-y-5">
                        <h2 className="text-base font-bold text-foreground tracking-tight leading-snug">
                          Where are you working out today?
                        </h2>
                        <div className="flex flex-col gap-2">
                          {[
                            { value: "home", label: "🏡 Home Living Space" },
                            { value: "gym", label: "🏋️ Commercial Gym" },
                            { value: "outdoors", label: "🌳 Outdoors & Park" },
                            { value: "office", label: "🏢 Office Desk Area" },
                            { value: "traveling", label: "✈️ Hotel / Traveling" }
                          ].map((opt) => (
                            <button
                              key={opt.value}
                              onClick={() => handleSelectOption("location", opt.value)}
                              className={`w-full text-left px-4 py-3 rounded-xl border text-xs font-bold transition-all hover:bg-foreground/5 ${
                                location === opt.value
                                  ? "border-primary text-primary bg-primary/5 shadow-md shadow-primary/5"
                                  : "border-foreground/5 bg-foreground/5 text-foreground/80"
                              }`}
                            >
                              {opt.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Step 3: Focus */}
                    {questionStep === 3 && (
                      <div className="space-y-5">
                        <h2 className="text-base font-bold text-foreground tracking-tight leading-snug">
                          What is your target focus today?
                        </h2>
                        <div className="flex flex-col gap-2">
                          {[
                            { value: "full_body", label: "🌀 Full Body Integration" },
                            { value: "chest", label: "🏋️ Chest Press & Push" },
                            { value: "back", label: "👐 Back Pulls & Lats" },
                            { value: "legs", label: "🦿 Leg strength & Squat" },
                            { value: "core", label: "🪵 Core Stability & Abs" },
                            { value: "shoulders", label: "🛡️ Shoulders & Upper Posture" },
                            { value: "mobility", label: "🧘 Restorative Mobility Flow" }
                          ].map((opt) => (
                            <button
                              key={opt.value}
                              onClick={() => handleSelectOption("focus", opt.value)}
                              className={`w-full text-left px-4 py-3 rounded-xl border text-xs font-bold transition-all hover:bg-foreground/5 ${
                                focus === opt.value
                                  ? "border-primary text-primary bg-primary/5 shadow-md shadow-primary/5"
                                  : "border-foreground/5 bg-foreground/5 text-foreground/80"
                              }`}
                            >
                              {opt.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Step 4: Duration */}
                    {questionStep === 4 && (
                      <div className="space-y-5">
                        <h2 className="text-base font-bold text-foreground tracking-tight leading-snug">
                          How much time do you have today?
                        </h2>
                        <div className="flex flex-col gap-2">
                          {[
                            { value: "15", label: "⏱️ 15 Mins (Express Routine)" },
                            { value: "30", label: "⏱️ 30 Mins (Standard Balance)" },
                            { value: "45", label: "⏱️ 45 Mins (Optimized Power)" },
                            { value: "60", label: "⏱️ 60+ Mins (Peak Performance)" }
                          ].map((opt) => (
                            <button
                              key={opt.value}
                              onClick={() => handleSelectOption("duration", opt.value)}
                              className={`w-full text-left px-4 py-3 rounded-xl border text-xs font-bold transition-all hover:bg-foreground/5 ${
                                duration.toString() === opt.value
                                  ? "border-primary text-primary bg-primary/5 shadow-md shadow-primary/5"
                                  : "border-foreground/5 bg-foreground/5 text-foreground/80"
                              }`}
                            >
                              {opt.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Step 5: Equipment */}
                    {questionStep === 5 && (
                      <div className="space-y-5">
                        <h2 className="text-base font-bold text-foreground tracking-tight leading-snug">
                          What equipment is available?
                        </h2>
                        <div className="flex flex-col gap-2">
                          {[
                            { value: "none", label: "🤸 Bodyweight Only (No Gear)" },
                            { value: "dumbbells", label: "🏋️ Dumbbells Only" },
                            { value: "bands", label: "🧬 Resistance Bands / Gym Equipment" }
                          ].map((opt) => (
                            <button
                              key={opt.value}
                              onClick={() => handleSelectOption("equipment", opt.value)}
                              className={`w-full text-left px-4 py-3 rounded-xl border text-xs font-bold transition-all hover:bg-foreground/5 ${
                                equipment === opt.value
                                  ? "border-primary text-primary bg-primary/5 shadow-md shadow-primary/5"
                                  : "border-foreground/5 bg-foreground/5 text-foreground/80"
                              }`}
                            >
                              {opt.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Step 6: Intensity */}
                    {questionStep === 6 && (
                      <div className="space-y-5">
                        <h2 className="text-base font-bold text-foreground tracking-tight leading-snug">
                          How intense should today be?
                        </h2>
                        <div className="flex flex-col gap-2">
                          {[
                            { value: "light", label: "🕊️ Light (Aerobic & Recovery)" },
                            { value: "moderate", label: "⚡ Moderate (Steady & Active)" },
                            { value: "intense", label: "🔥 Intense (High Power & Stamina)" }
                          ].map((opt) => (
                            <button
                              key={opt.value}
                              onClick={() => handleSelectOption("intensity", opt.value)}
                              className={`w-full text-left px-4 py-3 rounded-xl border text-xs font-bold transition-all hover:bg-foreground/5 ${
                                intensity === opt.value
                                  ? "border-primary text-primary bg-primary/5 shadow-md shadow-primary/5"
                                  : "border-foreground/5 bg-foreground/5 text-foreground/80"
                              }`}
                            >
                              {opt.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Footer Nav Controls */}
                    <div className="flex justify-between items-center pt-4 border-t border-foreground/5 text-xs font-semibold">
                      {questionStep > 1 ? (
                        <button 
                          onClick={() => setQuestionStep(prev => prev - 1)} 
                          className="flex items-center gap-1.5 text-foreground/60 hover:text-foreground transition-colors"
                        >
                          <ArrowLeft className="h-4 w-4" />
                          <span>Back</span>
                        </button>
                      ) : (
                        <div />
                      )}
                      
                      {questionStep < 6 && (
                        <button 
                          onClick={() => setQuestionStep(prev => prev + 1)}
                          className="flex items-center gap-1 text-primary hover:underline transition-colors"
                        >
                          <span>Skip</span>
                          <ArrowRight className="h-4 w-4" />
                        </button>
                      )}
                    </div>

                  </GlassCard>
                </div>
              )}

              {/* STATE B: NEURAL GENERATING LOADING SCREEN */}
              {coachState === "generating" && (
                <div className="max-w-[460px] mx-auto py-16 text-center">
                  <GlassCard glowColor="violet" className="p-8 space-y-6">
                    <div className="flex justify-center">
                      <RefreshCw className="h-12 w-12 text-primary animate-spin" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-base font-bold text-foreground">Generating Your Adaptive Workout...</h3>
                      <p className="text-xs text-foreground/50 font-bold tracking-widest uppercase">
                        AI Telemetry Processing
                      </p>
                    </div>

                    <div className="space-y-3 pt-3 text-left max-w-sm mx-auto">
                      {[
                        "Checking circadian sleep quality indicators...",
                        "Mapping active soreness and telemetry zones...",
                        "Calculating screen time focus fatigue...",
                        "Formulating joint-safe physical adjustments..."
                      ].map((stepMsg, idx) => (
                        <div key={idx} className="flex gap-2.5 items-center text-xs font-semibold">
                          <div className={`h-4 w-4 rounded-full flex items-center justify-center shrink-0 text-[10px] ${
                            loadingTick >= idx 
                              ? "bg-emerald-500/10 text-emerald-500 font-bold" 
                              : "bg-foreground/5 text-foreground/20"
                          }`}>
                            {loadingTick >= idx ? "✓" : idx + 1}
                          </div>
                          <span className={loadingTick >= idx ? "text-foreground" : "text-foreground/30"}>
                            {stepMsg}
                          </span>
                        </div>
                      ))}
                    </div>
                  </GlassCard>
                </div>
              )}

              {/* STATE C: PRE-WORKOUT PREVIEW DASHBOARD */}
              {coachState === "preview" && generatedWorkout.length > 0 && (
                <div className="max-w-3xl mx-auto space-y-6">
                  
                  {/* Integrated Readiness & Generation Summary */}
                  <GlassCard glowColor="violet" className="p-6 space-y-4">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-foreground/5">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5">
                          <Sparkles className="h-4 w-4 text-primary animate-pulse" />
                          <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Circadian Generation Summary</span>
                        </div>
                        <h2 className="text-lg font-bold text-foreground">Your Custom Adaptive Workout</h2>
                      </div>
                      
                      {/* Integrated Readiness Badge */}
                      <div className="flex items-center gap-3 bg-primary/10 border border-primary/20 rounded-2xl px-4 py-2 shrink-0">
                        <div className="text-right">
                          <span className="text-[8px] font-bold text-foreground/50 uppercase block">Workout Readiness</span>
                          <span className="text-xs font-bold text-foreground">{readinessScore > 75 ? "Excellent Capacity" : "Recovery-Aware Active"}</span>
                        </div>
                        <div className="h-10 w-10 rounded-full border-2 border-primary flex items-center justify-center font-extrabold text-sm text-primary shadow-lg shadow-primary/15 bg-background shrink-0">
                          {readinessScore}%
                        </div>
                      </div>
                    </div>

                    {/* AI Reasoning Text */}
                    <div className="text-xs text-foreground/85 leading-relaxed font-semibold bg-foreground/5 p-4 rounded-xl border border-foreground/5">
                      {recoveryWarning || "Your bodily systems are fully recharged! We compiled a high-productivity strength and cardio session to lock in your metabolic gains and optimize cardiorespiratory longevity."}
                    </div>

                    <div className="flex justify-between items-center text-[10px] text-foreground/50 font-bold uppercase tracking-wider pt-2">
                      <span>Biometric Telemetry: Fully Synced</span>
                      <span>Target Duration: {duration} Mins</span>
                    </div>
                  </GlassCard>

                  {/* Exercises list preview */}
                  <div className="space-y-3">
                    <h3 className="text-xs font-bold text-foreground uppercase tracking-widest pl-1">
                      Exercise Routine Preview ({generatedWorkout.length} exercises)
                    </h3>
                    <div className="space-y-3">
                      {generatedWorkout.map((ex, idx) => (
                        <div key={idx} className="p-4 rounded-2xl glass-panel border border-foreground/5 bg-background/30 flex justify-between items-center gap-4">
                          <div className="space-y-1 min-w-0">
                            <h4 className="text-xs font-bold text-foreground leading-normal flex items-center gap-1.5">
                              <span className="text-[10px] font-bold text-primary bg-primary/10 h-5 w-5 rounded-lg flex items-center justify-center shrink-0">
                                {idx + 1}
                              </span>
                              {ex.name}
                            </h4>
                            <p className="text-[11px] text-foreground/60 leading-relaxed font-semibold max-w-lg truncate">
                              {ex.description}
                            </p>
                          </div>

                          <div className="flex gap-4 text-xs font-bold shrink-0">
                            <div className="text-right">
                              <span className="text-[9px] text-foreground/45 uppercase block">Target</span>
                              <span>{ex.reps}</span>
                            </div>
                            <div className="text-right">
                              <span className="text-[9px] text-secondary uppercase block">Equipment</span>
                              <span className="text-secondary">{ex.equipment}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action triggers */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-3">
                    <Button 
                      variant="glass" 
                      onClick={() => {
                        setCoachState("form");
                        setQuestionStep(1);
                      }} 
                      className="flex-1 py-3 text-xs font-bold flex items-center justify-center gap-1"
                    >
                      <RefreshCw className="h-4 w-4" />
                      <span>Re-compile Questionnaire</span>
                    </Button>

                    <Button 
                      variant="primary" 
                      onClick={() => setCoachState("active")} 
                      className="flex-[2] py-3 text-xs font-bold flex items-center justify-center gap-1.5 shadow-lg shadow-primary/25"
                    >
                      <Play className="h-4 w-4 fill-white" />
                      <span>Launch Guided Workout Terminal</span>
                    </Button>
                  </div>

                </div>
              )}

              {/* STATE D: ACTIVE GUIDED IMMERSIVE COACHING TERMINAL */}
              {coachState === "active" && generatedWorkout.length > 0 && (
                <div className="max-w-4xl mx-auto space-y-6">
                  
                  {/* Header Progress Header */}
                  <GlassCard glowColor="violet" className="p-4 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-red-500 animate-ping" />
                      <span className="text-xs font-bold uppercase tracking-wider text-foreground">
                        {activeWorkoutName}
                      </span>
                    </div>

                    {/* Progress details */}
                    <div className="flex items-center gap-4 text-xs font-bold text-foreground/70 shrink-0">
                      <span>Exercise {currentExerciseIdx + 1} of {generatedWorkout.length}</span>
                      <span className="bg-primary/10 text-primary px-2.5 py-0.5 rounded-full text-[10px]">
                        {Math.round(((currentExerciseIdx) / generatedWorkout.length) * 100)}% Done
                      </span>
                      <span className="text-rose-400">
                        🔥 {Math.round((currentExerciseIdx / generatedWorkout.length) * caloriesBurned || (currentExerciseIdx * 35))} kcal
                      </span>
                    </div>
                  </GlassCard>

                  {/* Immersive Screen Splitter */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
                    
                    {/* Left Column: Visual AI Posture Guidance & Demo Area */}
                    <GlassCard glowColor="rose" className="md:col-span-7 p-5 flex flex-col justify-between space-y-4 min-h-[380px]">
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-[9px] font-bold text-rose-500 uppercase tracking-widest flex items-center gap-1">
                            <Activity className="h-3 w-3 animate-pulse" />
                            AI Posture Tracking Stream
                          </span>
                          <span className="bg-rose-500/10 text-rose-400 text-[8px] font-bold px-2 py-0.5 rounded-full uppercase">
                            Webcam Sync Ready
                          </span>
                        </div>
                        
                        {/* Animated Joint Grid Placeholder */}
                        <div className="relative rounded-2xl overflow-hidden aspect-video bg-black/60 border border-foreground/10 flex flex-col items-center justify-center p-6 text-center group">
                          {/* Animated vector scanner lines */}
                          <div className="absolute top-0 bottom-0 left-0 right-0 border-2 border-primary/20 rounded-xl m-4 pointer-events-none" />
                          <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary/60 to-transparent animate-bounce pointer-events-none" />
                          
                          {/* Floating metrics over camera */}
                          <div className="absolute top-3 left-3 bg-black/50 backdrop-blur-sm border border-foreground/5 rounded-lg p-2 text-[9px] font-bold text-left text-foreground/80 space-y-0.5">
                            <div>• Range of Motion: 104°</div>
                            <div>• Hip-Spine Angle: Stable</div>
                            <div>• Velocity: Optimal</div>
                          </div>

                          <div className="absolute bottom-3 right-3 bg-emerald-500/90 text-white text-[8px] font-bold px-2 py-0.5 rounded">
                            Posture Match: 96%
                          </div>

                          <Dumbbell className="h-10 w-10 text-primary animate-bounce mb-3" />
                          <span className="text-xs font-bold text-foreground">Virtual Posture Grid Overlay</span>
                          <p className="text-[10px] text-foreground/50 max-w-xs leading-relaxed mt-1 font-semibold">
                            Simulated camera skeleton mapping your joint angles in real-time. Stand in full view of your device.
                          </p>
                        </div>
                      </div>

                      {/* Step-by-Step interactive instructions */}
                      <div className="space-y-2 pt-2 border-t border-foreground/5">
                        <span className="text-[10px] font-bold text-foreground/50 uppercase block">Coaching Execution Cues</span>
                        <div className="space-y-1.5 text-xs text-foreground/80 font-semibold leading-relaxed">
                          {generatedWorkout[currentExerciseIdx].name === "Cat-Cow Stretch" ? (
                            <>
                              <div className="flex gap-2 items-start"><span className="text-primary font-bold">1.</span><span>Start on hands and knees with a neutral spine.</span></div>
                              <div className="flex gap-2 items-start"><span className="text-primary font-bold">2.</span><span>Inhale, drop your belly, and arch your back (Cow Pose).</span></div>
                              <div className="flex gap-2 items-start"><span className="text-primary font-bold">3.</span><span>Exhale, round your spine toward the ceiling (Cat Pose).</span></div>
                            </>
                          ) : generatedWorkout[currentExerciseIdx].name === "Bodyweight Squats" ? (
                            <>
                              <div className="flex gap-2 items-start"><span className="text-primary font-bold">1.</span><span>Place feet shoulder-width apart, chest upright.</span></div>
                              <div className="flex gap-2 items-start"><span className="text-primary font-bold">2.</span><span>Lower hips down and back as if sitting in a chair.</span></div>
                              <div className="flex gap-2 items-start"><span className="text-primary font-bold">3.</span><span>Keep knees behind toes, push through heels to stand.</span></div>
                            </>
                          ) : (
                            <>
                              <div className="flex gap-2 items-start"><span className="text-primary font-bold">1.</span><span>Position yourself on a flat, joint-supportive surface.</span></div>
                              <div className="flex gap-2 items-start"><span className="text-primary font-bold">2.</span><span>Maintain deep, steady diaphragmatic respiration beats.</span></div>
                              <div className="flex gap-2 items-start"><span className="text-primary font-bold">3.</span><span>Execute with complete control, prioritizing orthopedic safety.</span></div>
                            </>
                          )}
                        </div>
                      </div>
                    </GlassCard>

                    {/* Right Column: Timer, Details, and Active AI Guidance */}
                    <div className="md:col-span-5 flex flex-col gap-6 justify-between">
                      
                      {/* Active Exercise Detail Card */}
                      <GlassCard glowColor={isResting ? "emerald" : "violet"} className="p-6 text-center space-y-4 flex-1 flex flex-col justify-between">
                        
                        {isResting ? (
                          <div className="space-y-2">
                            <span className="text-xs font-bold text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full uppercase tracking-wider">
                              Rest & Transition
                            </span>
                            <h2 className="text-xl font-bold mt-2">Catch Your Breath</h2>
                            <p className="text-[11px] text-foreground/60 leading-relaxed font-semibold">
                              Prepare for the next exercise:
                            </p>
                            <div className="p-3 bg-emerald-500/5 border border-emerald-500/10 rounded-xl inline-block mt-2">
                              <span className="text-xs font-bold text-foreground">
                                {generatedWorkout[Math.min(generatedWorkout.length - 1, currentExerciseIdx + 1)].name}
                              </span>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <span className="text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full uppercase tracking-wider">
                              Active Routine
                            </span>
                            <h2 className="text-2xl font-black mt-2 leading-tight">{generatedWorkout[currentExerciseIdx].name}</h2>
                            <p className="text-xs text-foreground/70 font-semibold leading-relaxed">
                              {generatedWorkout[currentExerciseIdx].description}
                            </p>
                          </div>
                        )}

                        {/* Interactive Countdown Timer */}
                        <div className="flex flex-col items-center py-4">
                          <div className="h-32 w-32 rounded-full border-4 border-foreground/5 flex flex-col items-center justify-center bg-foreground/5 relative shadow-inner">
                            <span className="text-3xl font-black tracking-tight text-foreground">{timeLeft}s</span>
                            <span className="text-[9px] uppercase font-bold text-foreground/45 mt-0.5">
                              {isResting ? "rest break" : "seconds left"}
                            </span>
                          </div>
                        </div>

                        {/* Active AI Guidance Display */}
                        <div className="p-3 bg-primary/5 border border-primary/10 rounded-2xl text-[11px] font-bold text-primary leading-normal text-center min-h-[50px] flex items-center justify-center">
                          {isResting ? (
                            <span>🧘 Deep box-breathing: Inhale 4s, exhale slowly to lower active cortisol.</span>
                          ) : timeLeft > 30 ? (
                            <span>💡 AI Cue: "Slow down your breathing and focus on isometric core control."</span>
                          ) : timeLeft > 15 ? (
                            <span>💡 AI Cue: "Maintain posture shoulder alignment. Keep joints soft."</span>
                          ) : (
                            <span>💡 AI Cue: "Last push! Keep your spine straight and push through heels."</span>
                          )}
                        </div>

                        {/* Target values */}
                        {!isResting && (
                          <div className="grid grid-cols-3 gap-2 text-center text-xs font-bold border-t border-foreground/5 pt-4">
                            <div>
                              <span className="text-foreground/45 uppercase text-[9px] block">Target</span>
                              <span className="text-foreground font-black">{generatedWorkout[currentExerciseIdx].reps}</span>
                            </div>
                            <div>
                              <span className="text-foreground/45 uppercase text-[9px] block">Sets</span>
                              <span className="text-foreground font-black">{generatedWorkout[currentExerciseIdx].sets} Sets</span>
                            </div>
                            <div>
                              <span className="text-foreground/45 uppercase text-[9px] block">Equipment</span>
                              <span className="text-secondary font-black truncate">{generatedWorkout[currentExerciseIdx].equipment}</span>
                            </div>
                          </div>
                        )}

                      </GlassCard>

                      {/* Interactive Guided Controls */}
                      <GlassCard glowColor="none" className="p-4 space-y-4">
                        <div className="flex justify-center items-center gap-4">
                          
                          <Button variant="glass" size="sm" onClick={handleSkipExercise} className="flex items-center gap-1 text-xs font-bold">
                            <ArrowRight className="h-4 w-4" />
                            <span>Skip</span>
                          </Button>

                          <button 
                            onClick={() => setTimerRunning(!timerRunning)}
                            className={`h-14 w-14 rounded-full flex items-center justify-center text-white shadow-lg transition-transform hover:scale-105 active:scale-95 ${
                              timerRunning 
                                ? "bg-amber-500 shadow-amber-500/20" 
                                : "bg-primary shadow-primary/20"
                            }`}
                          >
                            {timerRunning ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6 ml-0.5" />}
                          </button>

                          <Button variant="primary" size="sm" onClick={handleMarkComplete} className="flex items-center gap-1 text-xs font-bold">
                            <Check className="h-4 w-4" />
                            <span>Complete</span>
                          </Button>

                        </div>

                        {/* Quit Trigger */}
                        <div className="text-center">
                          <button 
                            onClick={() => {
                              if (confirm("Are you sure you want to stop this workout? Your active progress will be lost.")) {
                                setCoachState("form");
                              }
                            }}
                            className="text-[10px] font-bold text-foreground/40 hover:text-red-400 transition-colors uppercase tracking-widest cursor-pointer"
                          >
                            Quit Active Session
                          </button>
                        </div>
                      </GlassCard>

                    </div>

                  </div>

                </div>
              )}

              {/* STATE E: SESSION SUMMARY */}
              {coachState === "summary" && (
                <div className="max-w-xl mx-auto space-y-6">
                  
                  <GlassCard glowColor="emerald" className="p-6 space-y-6 text-center">
                    
                    <div className="space-y-2">
                      <div className="h-12 w-12 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto text-xl animate-bounce">
                        🎉
                      </div>
                      <h2 className="text-2xl font-bold">Session Completed!</h2>
                      <p className="text-xs text-foreground/60 leading-relaxed font-semibold">
                        Sensory tracking records successfully logged. Let's look at your dynamic session telemetry:
                      </p>
                    </div>

                    {/* Stats metrics grid */}
                    <div className="grid grid-cols-3 gap-4 py-4 border-y border-foreground/5">
                      <div className="text-center space-y-1">
                        <span className="text-[10px] text-foreground/50 uppercase font-bold flex items-center gap-1 justify-center">
                          <Clock className="h-3.5 w-3.5 text-primary" />
                          Duration
                        </span>
                        <div className="text-base font-extrabold">{workoutDurationSpent} mins</div>
                      </div>

                      <div className="text-center space-y-1">
                        <span className="text-[10px] text-foreground/50 uppercase font-bold flex items-center gap-1 justify-center">
                          <Flame className="h-3.5 w-3.5 text-rose-500" />
                          Burned Est
                        </span>
                        <div className="text-base font-extrabold text-rose-400">{caloriesBurned} kcal</div>
                      </div>

                      <div className="text-center space-y-1">
                        <span className="text-[10px] text-foreground/50 uppercase font-bold flex items-center gap-1 justify-center">
                          <Droplet className="h-3.5 w-3.5 text-secondary" />
                          Water Add
                        </span>
                        <div className="text-base font-extrabold text-secondary">600 ml</div>
                      </div>
                    </div>

                    {/* AI Coach Feedback */}
                    <div className="text-left space-y-2.5 bg-foreground/5 p-4 rounded-2xl border border-foreground/5">
                      <h4 className="text-xs font-bold text-primary flex items-center gap-1">
                        <Sparkles className="h-4 w-4" />
                        AI Coach Adaptive Feedback
                      </h4>
                      <p className="text-xs text-foreground/75 leading-relaxed font-semibold">
                        {postWorkoutFeedback}
                      </p>
                    </div>

                    {/* Interactive controls */}
                    <div className="flex gap-3 pt-2">
                      <Button variant="glass" onClick={handleSaveRoutine} className="flex-1 py-3 text-xs font-bold flex items-center justify-center gap-1">
                        <Save className="h-4 w-4" />
                        <span>Save as Routine</span>
                      </Button>
                      <Button variant="primary" onClick={() => setCoachState("form")} className="flex-1 py-3 text-xs font-bold">
                        Finish Portal
                      </Button>
                    </div>

                  </GlassCard>

                </div>
              )}
            </>
          )}

          {/* TAB 2: HISTORY */}
          {activeTab === "history" && (
            <div className="max-w-2xl mx-auto space-y-4">
              <h3 className="text-xs font-bold text-foreground uppercase tracking-widest pl-1">
                Your Fitness History Logs
              </h3>

              {workoutHistory.length === 0 ? (
                <GlassCard className="p-8 text-center text-xs text-foreground/50 font-bold">
                  No fitness records logged yet. Go to AI Workout Coach to generate your first session!
                </GlassCard>
              ) : (
                <div className="space-y-3">
                  {workoutHistory.map((item, idx) => (
                    <GlassCard key={idx} className="p-4 flex items-center justify-between border border-foreground/5">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center text-sm shrink-0">
                          💪
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-foreground leading-normal">{item.focus} Routine</h4>
                          <span className="text-[10px] text-foreground/45 flex items-center gap-1 mt-0.5">
                            <Calendar className="h-3 w-3" />
                            {item.date}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-6 text-xs font-bold">
                        <div className="text-right">
                          <span className="text-[9px] text-foreground/50 uppercase block">Duration</span>
                          <span>{item.duration} mins</span>
                        </div>
                        <div className="text-right">
                          <span className="text-[9px] text-rose-400/80 uppercase block">Burned</span>
                          <span className="text-rose-400">{item.calories} kcal</span>
                        </div>
                        <span className="text-[9px] uppercase px-2 py-0.5 bg-emerald-500/10 text-emerald-400 rounded-full font-bold">
                          {item.rating || "MODERATE"}
                        </span>
                      </div>
                    </GlassCard>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: PROGRESS TRACKING */}
          {activeTab === "progress" && (
            <div className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                
                <GlassCard glowColor="violet" className="p-4 text-center space-y-1">
                  <span className="text-[10px] text-foreground/50 uppercase font-bold">Current Active Streak</span>
                  <div className="text-2xl font-bold text-primary">3 Days</div>
                </GlassCard>

                <GlassCard glowColor="rose" className="p-4 text-center space-y-1">
                  <span className="text-[10px] text-foreground/50 uppercase font-bold">Calories Burned (This Week)</span>
                  <div className="text-2xl font-bold text-rose-400">820 kcal</div>
                </GlassCard>

                <GlassCard glowColor="emerald" className="p-4 text-center space-y-1">
                  <span className="text-[10px] text-foreground/50 uppercase font-bold">Workout Frequency</span>
                  <div className="text-2xl font-bold text-secondary">3.4 sessions/wk</div>
                </GlassCard>

                <GlassCard glowColor="amber" className="p-4 text-center space-y-1">
                  <span className="text-[10px] text-foreground/50 uppercase font-bold">Volume Consistency</span>
                  <div className="text-2xl font-bold text-amber-500">92.4%</div>
                </GlassCard>

              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                
                {/* Muscle Group Balance */}
                <div className="lg:col-span-6 rounded-2xl glass-panel p-6 border-foreground/5 space-y-5">
                  <h3 className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    <TrendingUp className="h-4.5 w-4.5 text-primary" />
                    Muscle Group Training Balance
                  </h3>
                  <p className="text-xs text-foreground/60 leading-relaxed font-semibold">
                    Ensuring a balanced training frequency prevents injuries and develops high joint stability.
                  </p>

                  <div className="space-y-4 pt-2">
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs font-bold">
                        <span>Upper Body Strength (Chest/Back/Arms)</span>
                        <span className="text-primary">45% Volume</span>
                      </div>
                      <div className="w-full bg-foreground/15 h-2 rounded-full overflow-hidden">
                        <div className="bg-primary h-full rounded-full" style={{ width: "45%" }} />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs font-bold">
                        <span>Lower Body Strength (Squat/Posterior)</span>
                        <span className="text-secondary">30% Volume</span>
                      </div>
                      <div className="w-full bg-foreground/15 h-2 rounded-full overflow-hidden">
                        <div className="bg-secondary h-full rounded-full" style={{ width: "30%" }} />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs font-bold">
                        <span>Core & Abs Stability</span>
                        <span className="text-amber-500">15% Volume</span>
                      </div>
                      <div className="w-full bg-foreground/15 h-2 rounded-full overflow-hidden">
                        <div className="bg-amber-500 h-full rounded-full" style={{ width: "15%" }} />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs font-bold">
                        <span>Restorative Mobility & Yoga</span>
                        <span className="text-rose-400">10% Volume</span>
                      </div>
                      <div className="w-full bg-foreground/15 h-2 rounded-full overflow-hidden">
                        <div className="bg-rose-400 h-full rounded-full" style={{ width: "10%" }} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* AI Insights */}
                <div className="lg:col-span-6 rounded-2xl glass-panel p-6 border-foreground/5 space-y-4">
                  <h3 className="text-xs font-bold text-foreground">AI Predictive Fitness Insights</h3>
                  
                  <div className="space-y-3 pt-2">
                    
                    <div className="p-3.5 bg-foreground/5 rounded-xl border border-foreground/5 text-xs font-semibold leading-relaxed flex items-start gap-2.5">
                      <span className="text-emerald-500 font-bold shrink-0 mt-0.5">🌱</span>
                      <span>**Sleep Correlation**: You perform workouts with 18% higher coordination when sleep duration is above 7.0 hours.</span>
                    </div>

                    <div className="p-3.5 bg-foreground/5 rounded-xl border border-foreground/5 text-xs font-semibold leading-relaxed flex items-start gap-2.5">
                      <span className="text-emerald-500 font-bold shrink-0 mt-0.5">🌱</span>
                      <span>**Cardio Protection**: Rehydration consistency of 2.5L has dropped your physical soreness recovery delay by 8 hours.</span>
                    </div>

                    <div className="p-3.5 bg-foreground/5 rounded-xl border border-foreground/5 text-xs font-semibold leading-relaxed flex items-start gap-2.5">
                      <span className="text-emerald-500 font-bold shrink-0 mt-0.5">🌱</span>
                      <span>**Joint Integrity Alert**: High workplace screen hours increase lower lumbar stiffness. Your coach recommends increasing mobility exercises to twice a week.</span>
                    </div>

                  </div>
                </div>

              </div>

            </div>
          )}

          {/* TAB 4: SAVED ROUTINES */}
          {activeTab === "routines" && (
            <div className="max-w-2xl mx-auto space-y-4">
              <h3 className="text-xs font-bold text-foreground uppercase tracking-widest pl-1">
                Your Saved Routines
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {savedRoutines.map((routine) => (
                  <GlassCard key={routine.id} className="p-5 flex flex-col justify-between h-[160px] border border-foreground/5">
                    <div className="space-y-2">
                      <span className="text-[10px] font-bold text-primary uppercase bg-primary/10 px-2 py-0.5 rounded-full inline-block">
                        {routine.focus.replace("_", " ")}
                      </span>
                      <h4 className="text-sm font-bold text-foreground leading-snug">{routine.name}</h4>
                      <p className="text-[11px] text-foreground/50 font-semibold flex items-center gap-3">
                        <span>⏱️ {routine.duration} mins</span>
                        <span>🏋️ {routine.exercisesCount} Exercises</span>
                      </p>
                    </div>

                    <Button 
                      variant="primary" 
                      onClick={() => {
                        setFocus(routine.focus);
                        setDuration(routine.duration);
                        setActiveTab("coach");
                        setGeneratedWorkout([]); // Reset previous
                        setCoachState("preview");
                        // Compile automatically based on routine
                        const originalList = EXERCISE_DATABASE[routine.focus] || EXERCISE_DATABASE["full_body"];
                        const formatted = originalList.slice(0, routine.exercisesCount).map(ex => ({
                          ...ex,
                          durationSeconds: ex.durationSeconds,
                          restSeconds: ex.restSeconds
                        }));
                        setActiveWorkoutName(routine.name);
                        setGeneratedWorkout(formatted);
                        setCompletedExercises(new Array(formatted.length).fill(false));
                        setCurrentExerciseIdx(0);
                        setTimeLeft(formatted[0].durationSeconds);
                        setIsResting(false);
                      }}
                      className="w-full py-2.5 text-xs font-bold flex items-center justify-center gap-1 mt-3"
                    >
                      <Play className="h-3.5 w-3.5 fill-white" />
                      <span>Launch Routine</span>
                    </Button>
                  </GlassCard>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: RECOVERY GUIDANCE */}
          {activeTab === "recovery" && (
            <div className="max-w-2xl mx-auto space-y-6">
              
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-foreground uppercase tracking-widest">
                  Restorative Recovery Protocols
                </h3>
                <p className="text-xs text-foreground/60 leading-relaxed font-semibold">
                  Intelligent cooldowns and box-breathing triggers designed to decompress your joints and switch off your sympathetic nervous stress response:
                </p>
              </div>

              <div className="space-y-4">
                
                <GlassCard className="p-4 flex gap-4 items-start border border-foreground/5">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 font-bold text-lg">
                    🧘
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-foreground">Sympathetic Decompression Box Breathing</h4>
                    <p className="text-xs text-foreground/75 leading-relaxed font-semibold">
                      *Instructions*: Inhale for 4 seconds, hold for 4 seconds, exhale for 4 seconds, hold for 4 seconds. Repeat 6 cycles. Excellent to trigger immediately after a workout to reduce active cortisol.
                    </p>
                  </div>
                </GlassCard>

                <GlassCard className="p-4 flex gap-4 items-start border border-foreground/5">
                  <div className="h-10 w-10 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center shrink-0 font-bold text-lg">
                    🩹
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-foreground">Lower Lumbar Foam Rolling & Hamstring stretches</h4>
                    <p className="text-xs text-foreground/75 leading-relaxed font-semibold">
                      *Instructions*: Place foam roller under mid back. Roll up and down slowly for 2 minutes. Stretch hamstrings by reaching towards toes for 30s. Protects posture against long sedentary sitting hours.
                    </p>
                  </div>
                </GlassCard>

              </div>

            </div>
          )}

        </div>

      </div>
    </DashboardLayout>
  );
}
