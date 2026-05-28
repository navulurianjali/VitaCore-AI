"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Dumbbell, Play, Pause, RotateCcw, Check, Sparkles, ShieldAlert, 
  Award, Clock, Flame, Droplet, Calendar, TrendingUp, Compass, 
  Heart, CheckSquare, Plus, Save, BookOpen, AlertTriangle, ArrowRight, ArrowLeft 
} from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import GlassCard from "@/components/ui/GlassCard";
import Button from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { getBaseMetrics, DailyMetrics } from "@/utils/mockData";
import { supabase } from "@/utils/supabase";
import confetti from "canvas-confetti";

// Curated exercise library with beginner-friendly coaching labels
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
  const [coachState, setCoachState] = useState<"form" | "active" | "summary">("form");

  // Daily fitness questionnaire state
  const [feeling, setFeeling] = useState("normal");
  const [location, setLocation] = useState("home");
  const [focus, setFocus] = useState("full_body");
  const [duration, setDuration] = useState(30);
  const [equipment, setEquipment] = useState("none");
  const [intensity, setIntensity] = useState("moderate");

  // Generated workout session state
  const [generatedWorkout, setGeneratedWorkout] = useState<Exercise[]>([]);
  const [recoveryWarning, setRecoveryWarning] = useState("");
  const [activeWorkoutName, setActiveWorkoutName] = useState("Custom Adaptive Workout");

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

  // History state
  const [workoutHistory, setWorkoutHistory] = useState<any[]>([]);

  // Saved routines state
  const [savedRoutines, setSavedRoutines] = useState<any[]>([]);

  // Load metrics and local logs on mount
  useEffect(() => {
    const base = getBaseMetrics(activeMode);
    setMetrics(base);

    // Initial default routines
    setSavedRoutines([
      { id: "r1", name: "Everyday Core Decompression", focus: "core", duration: 15, exercisesCount: 3 },
      { id: "r2", name: "Hamstring Recovery Flow", focus: "mobility", duration: 20, exercisesCount: 3 }
    ]);

    // LocalStorage fallback loading for history
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
            // Merge with local logs securely
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

  // Handle countdown interval
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

  // Trigger when countdown reaches 0
  const handleTimeExpired = () => {
    if (isResting) {
      // Finished resting, go to next exercise
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
      // Completed active set, mark as complete and start rest
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

  // Generate dynamic, recovery-aware AI workout
  const handleGenerateWorkout = () => {
    setRecoveryWarning("");
    
    // 1. Gather filtered list from DB or fallback
    const focusKey = focus === "yoga" || focus === "recovery" ? "mobility" : focus;
    const originalList = EXERCISE_DATABASE[focusKey] || EXERCISE_DATABASE["full_body"];
    
    // Filter by equipment availability
    let filteredList = originalList.filter(ex => {
      if (equipment === "none") return ex.equipment === "Bodyweight";
      if (equipment === "dumbbells") return ex.equipment === "Bodyweight" || ex.equipment === "Dumbbells";
      return true; // Gym / bands / all available
    });

    if (filteredList.length === 0) {
      filteredList = originalList; // Safe fallback
    }

    // 2. Perform Recovery-Aware Dynamic Adaptations
    let finalIntensity = intensity;
    let restBuffer = 0;
    
    // Check bio-sensors (High fatigue, sleep debt, high soreness)
    const isFatigued = feeling === "tired" || feeling === "stressed" || feeling === "sore" || (metrics && metrics.sleepQuality < 65);
    const isHighSoreness = profile?.soreness_level && profile.soreness_level > 5;
    
    if (isFatigued || isHighSoreness) {
      finalIntensity = "light";
      restBuffer = 10; // Add 10s extra rest
      setRecoveryWarning(
        "⚠️ Recovery Adaptation Active: We detected higher levels of daily fatigue, sleep debt, or muscular soreness. To support your joints and CNS recovery, we have calibrated your workout intensity to Light and increased your rest break buffers."
      );
    }

    // Map intensity to duration variables
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

    // Configure naming
    const titleFocus = focus.replace("_", " ").toUpperCase();
    setActiveWorkoutName(`AI ${finalIntensity.toUpperCase()} ${titleFocus} ROUTINE`);
    setGeneratedWorkout(formattedExercises);
    setCompletedExercises(new Array(formattedExercises.length).fill(false));
    setCurrentExerciseIdx(0);
    setTimeLeft(formattedExercises[0].durationSeconds);
    setIsResting(false);
    setTimerRunning(false);
    
    // Switch state to active guided screen
    setCoachState("active");
  };

  // Mark exercise complete / skip
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

  // End workout flow
  const finishWorkoutSession = async () => {
    setTimerRunning(false);
    confetti({
      particleCount: 150,
      spread: 80,
      colors: ["#8b5cf6", "#10b981", "#ec4899"]
    });

    // Compute metrics
    const mins = duration;
    setWorkoutDurationSpent(mins);
    
    const calorieBurn = Math.round(mins * (intensity === "intense" ? 10 : intensity === "moderate" ? 7 : 4));
    setCaloriesBurned(calorieBurn);

    // Dynamic AI feedback
    let feedback = "";
    if (feeling === "tired" || feeling === "stressed") {
      feedback = "🧘 Excellent! Your active mobility and gentle intensity choice today kept cardiac strain low. Remember to hydrate with 600ml of mineralized water within 30 minutes to reduce muscle tension.";
    } else {
      feedback = "⚡ Outstanding! High coordination capacity detected. Your active training today has optimized your muscle glycogen pathways and increased metabolic burn indexes. Great work!";
    }
    setPostWorkoutFeedback(feedback);

    // Save Workout log
    const newLog = {
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      focus: focus.replace("_", " ").toUpperCase(),
      duration: mins,
      calories: calorieBurn,
      completed: true,
      rating: intensity.toUpperCase()
    };

    // Save to LocalStorage
    const stored = localStorage.getItem("vitalcore_workout_history");
    const parsed = stored ? JSON.parse(stored) : [];
    parsed.unshift(newLog);
    setWorkoutHistory(parsed);
    localStorage.setItem("vitalcore_workout_history", JSON.stringify(parsed));

    // Save to Supabase DB if authenticated
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

  // Add routine bookmarking
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

        {/* Cohesive Subsections Tab navigation */}
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
                  if (tab.id === "coach") setCoachState("form");
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
              {/* STATE A: QUESTIONNAIRE FORM */}
              {coachState === "form" && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  
                  {/* Left panel: Questionnaire */}
                  <div className="lg:col-span-8 space-y-6">
                    <GlassCard glowColor="violet" className="p-6 border border-foreground/5 space-y-5">
                      <div className="space-y-1">
                        <h3 className="text-sm font-bold text-foreground flex items-center gap-1.5">
                          <Sparkles className="h-4.5 w-4.5 text-primary" />
                          Today's Readiness Questionnaire
                        </h3>
                        <p className="text-xs text-foreground/60 leading-relaxed font-semibold">
                          Customize your target coordinates. The AI coach will instantly adapt your active workout block based on your sleep debt, soreness, and stress sensors.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
                        
                        {/* 1. Feeling */}
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-foreground">How are you feeling today?</label>
                          <select 
                            value={feeling} 
                            onChange={(e) => setFeeling(e.target.value)}
                            className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-foreground/10 bg-background text-foreground focus:outline-none"
                          >
                            <option value="energetic">💪 Energetic & Peak Power</option>
                            <option value="normal">😊 Normal / Steady</option>
                            <option value="tired">💤 Tired / Low sleep</option>
                            <option value="stressed">🧠 Stressed / Coding burnout</option>
                            <option value="sore">🩹 Sore muscles</option>
                          </select>
                        </div>

                        {/* 2. Location */}
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-foreground">Where are you training?</label>
                          <select 
                            value={location} 
                            onChange={(e) => setLocation(e.target.value)}
                            className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-foreground/10 bg-background text-foreground focus:outline-none"
                          >
                            <option value="home">🏡 Home living space</option>
                            <option value="gym">🏋️ Commercial Gym</option>
                            <option value="outdoors">🌳 Outdoor park</option>
                            <option value="office">🏢 Office desk block</option>
                            <option value="traveling">✈️ Hotel / Traveling</option>
                          </select>
                        </div>

                        {/* 3. Focus */}
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-foreground">What is your workout focus?</label>
                          <select 
                            value={focus} 
                            onChange={(e) => setFocus(e.target.value)}
                            className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-foreground/10 bg-background text-foreground focus:outline-none"
                          >
                            <option value="full_body">🌀 Full Body Integration</option>
                            <option value="chest">🏋️ Chest Press & Push</option>
                            <option value="back">👐 Back Pulls & Lat care</option>
                            <option value="legs">🦿 Leg strength & Squat</option>
                            <option value="core">🪵 Core Stability & Abs</option>
                            <option value="shoulders">🛡️ Shoulders & Upper Posture</option>
                            <option value="mobility">🧘 Restorative Mobility Flow</option>
                          </select>
                        </div>

                        {/* 4. Time */}
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-foreground">How much time do you have?</label>
                          <select 
                            value={duration.toString()} 
                            onChange={(e) => setDuration(Number(e.target.value))}
                            className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-foreground/10 bg-background text-foreground focus:outline-none"
                          >
                            <option value="15">⏱️ 15 min Express Express</option>
                            <option value="30">⏱️ 30 min Standard Balance</option>
                            <option value="45">⏱️ 45 min Optimized Power</option>
                            <option value="60">⏱️ 60+ min High Capacity</option>
                          </select>
                        </div>

                        {/* 5. Equipment */}
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-foreground">What equipment is available?</label>
                          <select 
                            value={equipment} 
                            onChange={(e) => setEquipment(e.target.value)}
                            className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-foreground/10 bg-background text-foreground focus:outline-none"
                          >
                            <option value="none">Bodyweight only (No gear)</option>
                            <option value="dumbbells">Dumbbells only</option>
                            <option value="bands">Full equipment (Gym, bands, gear)</option>
                          </select>
                        </div>

                        {/* 6. Intensity */}
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-foreground">Target Session Intensity</label>
                          <select 
                            value={intensity} 
                            onChange={(e) => setIntensity(e.target.value)}
                            className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-foreground/10 bg-background text-foreground focus:outline-none"
                          >
                            <option value="light">🕊️ Light (Aerobic Recovery)</option>
                            <option value="moderate">⚡ Moderate (Steady Balance)</option>
                            <option value="intense">🔥 Intense (High Peak Stamina)</option>
                          </select>
                        </div>

                      </div>

                      <Button variant="primary" onClick={handleGenerateWorkout} className="w-full mt-4 py-3 flex items-center justify-center gap-1 text-xs font-bold shadow-lg shadow-primary/20">
                        <Dumbbell className="h-4 w-4" />
                        <span>Dynamically Construct AI Routine</span>
                      </Button>
                    </GlassCard>
                  </div>

                  {/* Right panel: Live Bio-feedback indicators */}
                  <div className="lg:col-span-4 space-y-6">
                    <GlassCard glowColor="emerald" className="p-5 space-y-4">
                      <h3 className="text-xs font-bold text-foreground flex items-center gap-1">
                        <Heart className="h-4.5 w-4.5 text-secondary animate-pulse" />
                        Live Coaching Sensor Sync
                      </h3>
                      
                      <div className="space-y-3.5 text-xs font-semibold leading-relaxed">
                        
                        <div className="flex justify-between items-center border-b border-foreground/5 pb-2">
                          <span className="text-foreground/60">Sleep Quality</span>
                          <span className="text-primary font-bold">{metrics?.sleepQuality || 74}%</span>
                        </div>

                        <div className="flex justify-between items-center border-b border-foreground/5 pb-2">
                          <span className="text-foreground/60">Muscle Soreness</span>
                          <span className="text-amber-500 font-bold">Grade {profile?.soreness_level || 0} / 10</span>
                        </div>

                        <div className="flex justify-between items-center border-b border-foreground/5 pb-2">
                          <span className="text-foreground/60">Active Stress Index</span>
                          <span className="text-secondary font-bold">{metrics?.stressLevel || 58}%</span>
                        </div>

                        <div className="flex justify-between items-center pb-1">
                          <span className="text-foreground/60">Selected Fitness Mode</span>
                          <span className="text-secondary font-bold capitalize">Everyday Fitness</span>
                        </div>

                      </div>

                      <div className="p-3 bg-secondary/5 rounded-xl border border-secondary/10 text-[10px] text-foreground/75 leading-relaxed font-semibold">
                        💡 **Biometric Sync active**: Generates routines adapted to protect central nervous fatigue.
                      </div>
                    </GlassCard>
                  </div>

                </div>
              )}

              {/* STATE B: ACTIVE GUIDED SESSION TIMERS */}
              {coachState === "active" && generatedWorkout.length > 0 && (
                <div className="max-w-2xl mx-auto space-y-6">
                  
                  {/* Warning overlay if recovery adapt triggers */}
                  {recoveryWarning && (
                    <div className="p-4 rounded-xl border border-amber-500/20 bg-amber-500/10 text-xs text-amber-500 font-semibold leading-relaxed">
                      {recoveryWarning}
                    </div>
                  )}

                  {/* Header progress bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-bold text-foreground">
                      <span>{activeWorkoutName}</span>
                      <span>Exercise {currentExerciseIdx + 1} of {generatedWorkout.length}</span>
                    </div>
                    <div className="w-full bg-foreground/15 h-2 rounded-full overflow-hidden">
                      <div 
                        className="bg-primary h-full rounded-full transition-all duration-300"
                        style={{ width: `${((currentExerciseIdx + (isResting ? 0.5 : 0)) / generatedWorkout.length) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Active Exercise Card */}
                  <GlassCard glowColor={isResting ? "emerald" : "violet"} className="p-6 space-y-6 text-center">
                    
                    {isResting ? (
                      <div className="space-y-4">
                        <span className="text-xs font-bold text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full uppercase tracking-wider">
                          Rest & Prepare
                        </span>
                        <h2 className="text-3xl font-bold mt-2">Rest Break</h2>
                        <p className="text-xs text-foreground/65 leading-relaxed max-w-sm mx-auto font-medium">
                          Next exercise up: **{generatedWorkout[Math.min(generatedWorkout.length - 1, currentExerciseIdx + 1)].name}**. Breathe deeply and hydrate!
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <span className="text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full uppercase tracking-wider">
                          Active Set
                        </span>
                        <h2 className="text-3xl font-bold mt-2">{generatedWorkout[currentExerciseIdx].name}</h2>
                        <p className="text-xs text-foreground/75 leading-relaxed max-w-md mx-auto font-semibold">
                          {generatedWorkout[currentExerciseIdx].description}
                        </p>
                        
                        <div className="flex justify-center gap-8 text-xs font-bold pt-2">
                          <div className="flex flex-col items-center">
                            <span className="text-foreground/45 uppercase text-[9px]">Target</span>
                            <span className="text-sm font-extrabold text-foreground mt-0.5">{generatedWorkout[currentExerciseIdx].reps}</span>
                          </div>
                          <div className="flex flex-col items-center">
                            <span className="text-foreground/45 uppercase text-[9px]">Sets</span>
                            <span className="text-sm font-extrabold text-foreground mt-0.5">{generatedWorkout[currentExerciseIdx].sets} Sets</span>
                          </div>
                          <div className="flex flex-col items-center">
                            <span className="text-foreground/45 uppercase text-[9px]">Equipment</span>
                            <span className="text-sm font-extrabold text-secondary mt-0.5">{generatedWorkout[currentExerciseIdx].equipment}</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* LIVE TIMER COUNTDOWN GRAPHIC */}
                    <div className="flex flex-col items-center pt-4">
                      <div className="h-36 w-36 rounded-full border-4 border-foreground/5 flex flex-col items-center justify-center bg-foreground/5 relative shadow-inner">
                        <span className="text-4xl font-extrabold tracking-tight text-foreground">{timeLeft}s</span>
                        <span className="text-[10px] uppercase font-bold text-foreground/40 mt-0.5">{isResting ? "resting" : "active"}</span>
                      </div>
                    </div>

                    {/* INTERACTIVE CONTROLS */}
                    <div className="flex justify-center items-center gap-4 pt-4">
                      
                      {/* Skip/Prev */}
                      <Button variant="glass" size="sm" onClick={handleSkipExercise} className="flex items-center gap-1 text-xs font-bold">
                        <ArrowRight className="h-4 w-4" />
                        <span>Skip</span>
                      </Button>

                      {/* Play/Pause toggle */}
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

                      {/* Mark Complete */}
                      <Button variant="primary" size="sm" onClick={handleMarkComplete} className="flex items-center gap-1 text-xs font-bold">
                        <Check className="h-4 w-4" />
                        <span>Complete</span>
                      </Button>

                    </div>

                  </GlassCard>

                  {/* Muscle Balance Details */}
                  {!isResting && (
                    <GlassCard glowColor="rose" className="p-4 flex justify-between text-xs font-semibold">
                      <div>
                        <span className="text-foreground/45 block text-[9px] uppercase">Primary Target Muscle</span>
                        <span className="text-rose-400 font-bold text-sm">{generatedWorkout[currentExerciseIdx].primaryMuscle}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-foreground/45 block text-[9px] uppercase">Supporting Muscles</span>
                        <span className="text-foreground font-bold text-sm">{generatedWorkout[currentExerciseIdx].secondaryMuscle}</span>
                      </div>
                    </GlassCard>
                  )}

                  {/* Cancel button */}
                  <div className="text-center pt-2">
                    <button 
                      onClick={() => {
                        if (confirm("Are you sure you want to stop this workout? Progress is not saved.")) {
                          setCoachState("form");
                        }
                      }}
                      className="text-xs font-bold text-foreground/45 hover:text-red-500 transition-colors"
                    >
                      Quit Current Session
                    </button>
                  </div>

                </div>
              )}

              {/* STATE C: SESSION SUMMARY */}
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

          {/* TAB 2: HISTORY TAB */}
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

          {/* TAB 3: PROGRESS TAB */}
          {activeTab === "progress" && (
            <div className="space-y-6">
              
              {/* Highlight metrics grid */}
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

              {/* Advanced visual balance charts */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                
                {/* Left panel: Muscle Group Balance */}
                <div className="lg:col-span-6 rounded-2xl glass-panel p-6 border-foreground/5 space-y-5">
                  <h3 className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    <TrendingUp className="h-4.5 w-4.5 text-primary" />
                    Muscle Group Training Balance
                  </h3>
                  <p className="text-xs text-foreground/60 leading-relaxed font-semibold">
                    Ensuring a balanced training frequency prevents injuries and develops high joint stability.
                  </p>

                  <div className="space-y-4 pt-2">
                    {/* Upper body */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs font-bold">
                        <span>Upper Body Strength (Chest/Back/Arms)</span>
                        <span className="text-primary">45% Volume</span>
                      </div>
                      <div className="w-full bg-foreground/15 h-2 rounded-full overflow-hidden">
                        <div className="bg-primary h-full rounded-full" style={{ width: "45%" }} />
                      </div>
                    </div>

                    {/* Lower body */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs font-bold">
                        <span>Lower Body Strength (Squat/Posterior)</span>
                        <span className="text-secondary">30% Volume</span>
                      </div>
                      <div className="w-full bg-foreground/15 h-2 rounded-full overflow-hidden">
                        <div className="bg-secondary h-full rounded-full" style={{ width: "30%" }} />
                      </div>
                    </div>

                    {/* Core */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs font-bold">
                        <span>Core & Abs Stability</span>
                        <span className="text-amber-500">15% Volume</span>
                      </div>
                      <div className="w-full bg-foreground/15 h-2 rounded-full overflow-hidden">
                        <div className="bg-amber-500 h-full rounded-full" style={{ width: "15%" }} />
                      </div>
                    </div>

                    {/* Recovery & yoga */}
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

                {/* Right panel: AI Smart Fitness Insights */}
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
                        handleGenerateWorkout();
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
                
                {/* 1. Box Breathing */}
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

                {/* 2. Foam Rolling leg care */}
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
