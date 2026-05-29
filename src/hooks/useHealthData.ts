import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/utils/supabase";
import { useAuth } from "@/context/AuthContext";

export interface DailyMetrics {
  caloriesBurned: number;
  caloriesTarget: number;
  caloriesConsumed: number;
  hydrationMl: number;
  hydrationTarget: number;
  steps: number;
  stepsTarget: number;
  sleepHours: number;
  sleepTarget: number;
  sleepQuality: number;
  stressLevel: number;
  mood: string;
  recoveryPercentage: number;
  fatigueScore: number;
  physicalFatigue: number;
  mentalFatigue: number;
  energyLevel: number;
  biologicalAge: number;
  stabilityScore: number;
  metabolicEfficiency: number;
  lifestyleSustainability: number;
  glycemicIndexLoad: "low" | "medium" | "high";
  sedentaryPostureRisk: "low" | "medium" | "critical";
  micronutrientDeficiencies: string[];
}

export function useHealthData() {
  const { profile } = useAuth();
  const [metrics, setMetrics] = useState<DailyMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRealData = useCallback(async () => {
    if (!profile?.id) {
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const today = new Date().toISOString().split('T')[0];

      // 1. Fetch Nutrition
      const { data: nutritionData } = await supabase
        .from("nutrition_logs")
        .select("calories")
        .eq("user_id", profile.id)
        .gte("created_at", `${today}T00:00:00Z`);
      const caloriesConsumed = nutritionData?.reduce((sum, item) => sum + item.calories, 0) || 0;

      // 2. Fetch Workouts
      const { data: workoutData } = await supabase
        .from("workouts")
        .select("calories_burned")
        .eq("user_id", profile.id)
        .gte("created_at", `${today}T00:00:00Z`);
      const caloriesBurned = workoutData?.reduce((sum, item) => sum + item.calories_burned, 0) || 0;

      // 3. Fetch Hydration
      const { data: hydrationData } = await supabase
        .from("hydration_logs")
        .select("amount_ml")
        .eq("user_id", profile.id)
        .gte("created_at", `${today}T00:00:00Z`);
      const hydrationMl = hydrationData?.reduce((sum, item) => sum + item.amount_ml, 0) || 0;

      // 4. Fetch Sleep
      const { data: sleepData } = await supabase
        .from("sleep_logs")
        .select("*")
        .eq("user_id", profile.id)
        .order("created_at", { ascending: false })
        .limit(1);
      const lastSleep = sleepData?.[0] || { sleep_hours: 0, recovery_quality: 50 };

      // 5. Fetch Recovery/Fatigue/Mood
      const { data: recoveryData } = await supabase
        .from("recovery_scores")
        .select("*")
        .eq("user_id", profile.id)
        .order("created_at", { ascending: false })
        .limit(1);
      const lastRecovery = recoveryData?.[0] || { recovery_percentage: 50 };

      const { data: fatigueData } = await supabase
        .from("fatigue_logs")
        .select("*")
        .eq("user_id", profile.id)
        .order("created_at", { ascending: false })
        .limit(1);
      const lastFatigue = fatigueData?.[0] || { physical_fatigue: 50, mental_fatigue: 50, fatigue_score: 50 };

      const { data: moodData } = await supabase
        .from("mood_tracking")
        .select("*")
        .eq("user_id", profile.id)
        .order("created_at", { ascending: false })
        .limit(1);
      const lastMood = moodData?.[0] || { stress_level: 50, mood: 'neutral' };

      const realMetrics: DailyMetrics = {
        caloriesBurned,
        caloriesTarget: 600,
        caloriesConsumed,
        hydrationMl,
        hydrationTarget: 2500,
        steps: 0,
        stepsTarget: 10000,
        sleepHours: Number(lastSleep.sleep_hours),
        sleepTarget: 8.0,
        sleepQuality: Number(lastSleep.recovery_quality),
        stressLevel: Number(lastMood.stress_level || 50),
        mood: lastMood.mood,
        recoveryPercentage: Number(lastRecovery.recovery_percentage),
        fatigueScore: Number(lastFatigue.fatigue_score),
        physicalFatigue: Number(lastFatigue.physical_fatigue),
        mentalFatigue: Number(lastFatigue.mental_fatigue),
        energyLevel: 100 - Number(lastFatigue.fatigue_score),
        biologicalAge: profile.biological_age || 30,
        stabilityScore: profile.stability_score || 80,
        metabolicEfficiency: 80, 
        lifestyleSustainability: 80,
        glycemicIndexLoad: "medium",
        sedentaryPostureRisk: "low",
        micronutrientDeficiencies: []
      };

      setMetrics(realMetrics);
    } catch (err: any) {
      console.error("Error fetching health data:", err);
      setError("Failed to load your health telemetry.");
      
      // Fallback zero-state metrics if database tables are missing
      setMetrics({
        caloriesBurned: 0,
        caloriesTarget: 600,
        caloriesConsumed: 0,
        hydrationMl: 0,
        hydrationTarget: 2500,
        steps: 0,
        stepsTarget: 10000,
        sleepHours: 0,
        sleepTarget: 8.0,
        sleepQuality: 50,
        stressLevel: 50,
        mood: "neutral",
        recoveryPercentage: 50,
        fatigueScore: 50,
        physicalFatigue: 50,
        mentalFatigue: 50,
        energyLevel: 50,
        biologicalAge: profile.biological_age || 30,
        stabilityScore: profile.stability_score || 80,
        metabolicEfficiency: 80, 
        lifestyleSustainability: 80,
        glycemicIndexLoad: "medium",
        sedentaryPostureRisk: "low",
        micronutrientDeficiencies: []
      });
    } finally {
      setLoading(false);
    }
  }, [profile]);

  useEffect(() => {
    fetchRealData();
    
    // Add event listener for global data updates
    const handleDataUpdate = () => {
      fetchRealData();
    };
    
    window.addEventListener("vitalcore-data-updated", handleDataUpdate);
    return () => {
      window.removeEventListener("vitalcore-data-updated", handleDataUpdate);
    };
  }, [fetchRealData]);

  return { metrics, loading, error, refetch: fetchRealData };
}
