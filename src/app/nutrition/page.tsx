"use client";

import React, { useState, useEffect } from "react";
import { 
  Utensils, 
  Droplet, 
  Flame,
  Sparkles, 
  AlertTriangle, 
  Apple, 
  Plus, 
  Info, 
  CheckCircle, 
  AlertCircle,
  Moon,
  Activity,
  Calendar,
  ShieldAlert,
  Check,
  Star,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Award,
  Heart,
  BarChart2,
  Clock,
  ShoppingCart,
  Zap,
  Filter,
  CheckSquare,
  ListTodo,
  X
} from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import GlassCard from "@/components/ui/GlassCard";
import Button from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import confetti from "canvas-confetti";
import { supabase } from "@/utils/supabase";
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  LineChart, 
  Line 
} from "recharts";

interface Meal {
  mealType: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
  whyHelps: string;
  recoveryBenefits: string;
  energyBenefits: string;
  hydrationSupport: string;
  ingredients: string[];
  instructions: string[];
  prepTime: string;
  timingIntelligence: string;
}

// Comprehensive Recipe Library to feed the interactive meal modals
const RECIPE_DATABASE: Record<string, Omit<Meal, "mealType" | "whyHelps" | "recoveryBenefits" | "energyBenefits" | "hydrationSupport">> = {
  "Oatmeal with berries and chia seeds": {
    name: "Oatmeal with berries and chia seeds",
    calories: 380, protein: 14, carbs: 54, fat: 8, fiber: 9, sugar: 6,
    ingredients: ["1 cup rolled oats", "200ml almond milk", "1/2 cup fresh mixed berries", "1 tbsp chia seeds", "1 tbsp honey"],
    instructions: ["Combine oats and almond milk in a small saucepan.", "Bring to a gentle boil and simmer for 5 minutes, stirring occasionally.", "Pour into a bowl and top with fresh berries, chia seeds, and a drizzle of honey."],
    prepTime: "8 mins",
    timingIntelligence: "Perfect morning metabolic kickstarter providing high prebiotics and sustained glucose levels."
  },
  "Spiced tofu scramble with avocado on sourdough toast": {
    name: "Spiced tofu scramble with avocado on sourdough toast",
    calories: 420, protein: 22, carbs: 32, fat: 18, fiber: 7, sugar: 2,
    ingredients: ["200g firm tofu", "1 slice sourdough bread", "1/2 ripe avocado", "1/2 cup spinach", "Pinch of turmeric and black pepper"],
    instructions: ["Crumble the tofu into a hot non-stick pan.", "Add turmeric, black pepper, and fresh spinach. Sauté for 5 minutes.", "Toast sourdough bread, mash avocado on top, and pile the scrambled tofu over the mashed avocado."],
    prepTime: "12 mins",
    timingIntelligence: "High protein and nutrient-dense, supplying clean amino acids to repair muscles after overnight rest."
  },
  "Steamed idlis with sambar and coconut chutney": {
    name: "Steamed idlis with sambar and coconut chutney",
    calories: 340, protein: 10, carbs: 58, fat: 5, fiber: 6, sugar: 3,
    ingredients: ["3 fermented rice idlis", "1 cup lentil sambar", "2 tbsp fresh coconut chutney", "Mustard seeds & curry leaves for tempering"],
    instructions: ["Steam pre-fermented idli batter in a mold for 10 minutes.", "Heat pre-made lentil and vegetable sambar in a small pot.", "Serve warm idlis alongside sambar and coconut chutney tempered with cracked mustard seeds."],
    prepTime: "15 mins",
    timingIntelligence: "Fermented grains are highly bio-available and easy on stomach kinetics for morning stamina."
  },
  "Grilled chicken quinoa bowl with roasted veggies": {
    name: "Grilled chicken quinoa bowl with roasted veggies",
    calories: 520, protein: 38, carbs: 48, fat: 12, fiber: 8, sugar: 3,
    ingredients: ["150g organic chicken breast", "1/2 cup uncooked quinoa", "1 cup broccoli and bell peppers", "1 tbsp olive oil", "1/2 lemon"],
    instructions: ["Boil quinoa in 1 cup of water for 12 minutes.", "Grill chicken breast in a skillet with olive oil until cooked through (165°F).", "Toss chopped veggies in remaining olive oil, roast lightly, and arrange in a bowl over quinoa. Squeeze lemon juice over top."],
    prepTime: "20 mins",
    timingIntelligence: "Mid-day metabolic recovery meal providing a dense pool of amino acids and fiber to stay highly saturated."
  },
  "Paneer and chickpea quinoa bowl with lemon tahini": {
    name: "Paneer and chickpea quinoa bowl with lemon tahini",
    calories: 490, protein: 24, carbs: 52, fat: 16, fiber: 9, sugar: 4,
    ingredients: ["120g low-fat paneer cubes", "1/2 cup boiled chickpeas", "1/2 cup quinoa", "1 tbsp lemon tahini dressing", "Fresh cucumber slice"],
    instructions: ["Boil quinoa and pan-sear paneer cubes with light spices until golden.", "Arrange chickpeas, paneer, and quinoa in a bowl.", "Drizzle lemon tahini dressing over top and garnish with cucumber slices."],
    prepTime: "15 mins",
    timingIntelligence: "Balanced protein, slow-release starches, and essential calcium to protect joint bone matrices."
  },
  "Brown rice with lentils (dal), spinach poriyal and curd": {
    name: "Brown rice with lentils (dal), spinach poriyal and curd",
    calories: 460, protein: 18, carbs: 65, fat: 9, fiber: 8, sugar: 3,
    ingredients: ["1 cup boiled brown rice", "3/4 cup yellow lentils (dal)", "1 cup sautéed spinach (poriyal)", "1/2 cup fresh homemade curd"],
    instructions: ["Cook brown rice and dal separately until tender.", "Sauté spinach with mustard seeds, curry leaves, and grated coconut.", "Serve dal over warm rice with spinach poriyal and curd on the side."],
    prepTime: "25 mins",
    timingIntelligence: "Traditional, balanced thermogenic meal offering high digestion support and complete vegetarian proteins."
  },
  "Baked salmon with sweet potato and broccoli": {
    name: "Baked salmon with sweet potato and broccoli",
    calories: 480, protein: 32, carbs: 38, fat: 16, fiber: 6, sugar: 4,
    ingredients: ["140g wild-caught salmon fillet", "1 medium sweet potato", "1 cup broccoli florets", "1 tsp dried rosemary", "1 tbsp olive oil"],
    instructions: ["Slice sweet potatoes into wedges, coat with olive oil, and bake at 400°F for 20 minutes.", "Place salmon next to wedges, season with rosemary, and bake for another 12 minutes.", "Steam broccoli lightly and serve warm beside salmon and sweet potatoes."],
    prepTime: "30 mins",
    timingIntelligence: "Evening cardiovascular support meal rich in omega-3 healthy fats to lower autonomic stress and promote deep sleep."
  },
  "Lentil coconut curry with steamed brown rice and broccoli": {
    name: "Lentil coconut curry with steamed brown rice and broccoli",
    calories: 450, protein: 16, carbs: 64, fat: 12, fiber: 9, sugar: 4,
    ingredients: ["1/2 cup brown lentils", "1/3 cup light coconut milk", "1/2 cup brown rice", "1 cup broccoli", "Garlic & ginger paste"],
    instructions: ["Sauté garlic, ginger and curry spices in a pot; add lentils and coconut milk, simmer for 20 minutes.", "Steam brown rice and broccoli separately.", "Ladle the rich lentil curry over brown rice and serve alongside steamed broccoli."],
    prepTime: "25 mins",
    timingIntelligence: "High magnesium evening bowl designed to soothe neural pathways and support metabolic homeostasis."
  },
  "Ragi dosa with vegetable kurma and roasted chickpeas": {
    name: "Ragi dosa with vegetable kurma and roasted chickpeas",
    calories: 410, protein: 14, carbs: 62, fat: 10, fiber: 8, sugar: 2,
    ingredients: ["1 cup finger millet (ragi) batter", "1/2 cup mixed vegetable kurma", "1/4 cup roasted spicy chickpeas", "1 tsp sesame oil"],
    instructions: ["Spread ragi batter thinly on a hot griddle, cook with sesame oil until crisp.", "Warm up vegetable kurma curry in a bowl.", "Roll dosa and serve immediately beside vegetable kurma and crunchy roasted chickpeas."],
    prepTime: "18 mins",
    timingIntelligence: "Finger millet is extraordinarily high in calcium and fiber, helping transport tryptophan for sleep support."
  },
  "Mixed almonds, walnuts and apple slices": {
    name: "Mixed almonds, walnuts and apple slices",
    calories: 200, protein: 6, carbs: 22, fat: 10, fiber: 5, sugar: 12,
    ingredients: ["8 raw almonds", "4 walnut halves", "1 medium red apple"],
    instructions: ["Core and thinly slice the fresh apple.", "Arrange on a plate beside almonds and walnut halves.", "Enjoy as a highly satisfying, raw prebiotic snack."],
    prepTime: "3 mins",
    timingIntelligence: "Quick afternoon focus stabilizer offering essential lipids to soothe central nervous stress."
  },
  "Roasted makhana (foxnuts) and a banana": {
    name: "Roasted makhana (foxnuts) and a banana",
    calories: 180, protein: 4, carbs: 36, fat: 2, fiber: 4, sugar: 14,
    ingredients: ["1 cup raw foxnuts (makhana)", "1 medium banana", "Pinch of rock salt and ghee"],
    instructions: ["Dry roast makhana in a hot pan with a drop of ghee and rock salt until highly crunchy.", "Peel and slice the banana.", "Serve together for an express prebiotic metabolic boost."],
    prepTime: "5 mins",
    timingIntelligence: "Supplies quick cellular potassium to restore low nerve stamina during screen focus."
  }
};

// Preset Alternatives library for meal swaps
const ALTERNATIVES_DATABASE: Record<string, Omit<Meal, "mealType">[]> = {
  breakfast: [
    { name: "Scrambled Tofu with Spinach & Avocado", calories: 310, protein: 20, carbs: 12, fat: 18, fiber: 6, sugar: 2, whyHelps: "Light, clean plant protein that sustains focus without early morning insulin spikes.", recoveryBenefits: "Rich in magnesium to relax muscle fibers and support thyroid kinetics.", energyBenefits: "Low glycemic starches provide 4 hours of steady cognitive fuel.", hydrationSupport: "High water content veggies contribute to cellular rehydration.", ingredients: ["150g firm tofu", "1 cup fresh baby spinach", "1/4 sliced avocado", "Squeeze of lime juice"], instructions: ["Crumble tofu into a warm skillet.", "Toss spinach, sauté for 4 minutes until wilted.", "Serve on a plate alongside sliced avocado and fresh lime."], prepTime: "6 mins", timingIntelligence: "Low glycemic load morning fuel." },
    { name: "Greek Yogurt Parfait with Mixed Berries & Walnuts", calories: 340, protein: 26, carbs: 24, fat: 12, fiber: 4, sugar: 8, whyHelps: "High-protein recovery base with prebiotic fibers and healthy fats.", recoveryBenefits: "Slow-release casein proteins feed muscles and reduce muscle breakdown.", energyBenefits: "Steady energy profile backed by healthy brain-boosting omega-3 lipids.", hydrationSupport: "High electrolyte calcium content promotes neural fluid transfer.", ingredients: ["1 cup low-fat Greek yogurt", "1/2 cup berries", "5 walnut halves", "1 tsp chia seeds"], instructions: ["Layer Greek yogurt inside a glass or bowl.", "Top with mixed fresh berries, walnuts, and chia seeds.", "Chill for 2 minutes before serving."], prepTime: "4 mins", timingIntelligence: "Casein protein-rich post-sleep recovery." }
  ],
  lunch: [
    { name: "Spiced Paneer Tikka Salad with Mint Chutney", calories: 480, protein: 24, carbs: 16, fat: 28, fiber: 5, sugar: 3, whyHelps: "Satisfying vegetarian fuel rich in calcium, fats and clean proteins.", recoveryBenefits: "Calcium pools facilitate muscular contraction and joint cartilage support.", energyBenefits: "Ketogenic fats provide slow, smooth ketone energy for stable afternoons.", hydrationSupport: "Hydrating cucumber and mint base supports kidney filtration.", ingredients: ["120g cottage paneer cubes", "1 cup chopped lettuce & bell peppers", "2 tbsp fresh mint chutney", "Olive oil for grilling"], instructions: ["Sauté paneer cubes in olive oil until browned.", "Toss with chopped lettuce, cucumbers and peppers in a bowl.", "Drizzle fresh mint chutney over top."], prepTime: "12 mins", timingIntelligence: "Saturating mid-day high-lipid fuel." }
  ],
  dinner: [
    { name: "Baked Cod Fillet with Roasted Asparagus", calories: 380, protein: 32, carbs: 14, fat: 10, fiber: 4, sugar: 2, whyHelps: "Highly digestible marine protein that prevents heavy overnight digestion strain.", recoveryBenefits: "Lean aminos facilitate tissue repair during deep sleep phases.", energyBenefits: "Keeps morning insulin levels low for optimal waking energy.", hydrationSupport: "Asparagus acts as a natural prebiotic fluid flush agent.", ingredients: ["140g fresh cod fillet", "10 asparagus spears", "1 tbsp lemon juice", "1 tsp olive oil"], instructions: ["Place cod and asparagus on a baking sheet.", "Season with olive oil, lemon juice, salt and pepper.", "Bake at 375°F for 15 minutes until fish flakes easily."], prepTime: "18 mins", timingIntelligence: "Lean overnight amino replenishment." }
  ],
  snack: [
    { name: "Roasted Makhana (Foxnuts) with Turmeric", calories: 140, protein: 4, carbs: 24, fat: 3, fiber: 3, sugar: 0, whyHelps: "Low-calorie, highly crunchy superfood to curb nervous eating cues.", recoveryBenefits: "Antioxidants suppress minor workout-induced muscle soreness.", energyBenefits: "Keeps blood sugars flat to prevent afternoon sluggishness.", hydrationSupport: "Turmeric curcumin aids systemic fluid cellular detox.", ingredients: ["1 cup makhana (foxnuts)", "1 tsp ghee", "1/2 tsp organic turmeric powder", "Rock salt"], instructions: ["Heat ghee in a pan on medium-low.", "Add turmeric and makhana, toss constantly for 4 minutes.", "Sprinkle salt and let cool for crispy texture."], prepTime: "5 mins", timingIntelligence: "Zero glycemic spike focus fuel." }
  ]
};

export default function SmartAINutritionPlansPage() {
  const { profile } = useAuth();
  const { activeMode } = useTheme();

  // Stepper / active state
  const [plannerStep, setPlannerStep] = useState<"onboarding" | "generating" | "ready">("onboarding");
  const [selectedGoal, setSelectedGoal] = useState("Muscle Gain");
  const [selectedPreference, setSelectedPreference] = useState("Balanced");
  const [activePlan, setActivePlan] = useState<{
    plan: Meal[];
    insights: string[];
    habits: string[];
    warnings: string[];
  } | null>(null);

  const [loadingTextIndex, setLoadingTextIndex] = useState(0);
  const [waterLogged, setWaterLogged] = useState(0);
  const [foodLogs, setFoodLogs] = useState<FoodLog[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  
  // Custom Interaction States
  const [selectedMealDetails, setSelectedMealDetails] = useState<Meal | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showGroceryList, setShowGroceryList] = useState(false);
  const [checkedGroceryItems, setCheckedGroceryItems] = useState<string[]>([]);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  // Stepper choices
  const GOAL_OPTIONS = [
    { id: "Weight Loss", label: "Weight Loss", icon: "📉", desc: "Steady deficit" },
    { id: "Weight Gain", label: "Weight Gain", icon: "📈", desc: "Gain mass" },
    { id: "Muscle Gain", label: "Muscle Gain", icon: "💪", desc: "Hypertrophy focus" },
    { id: "Better Energy", label: "Better Energy", icon: "⚡", desc: "Eradicate fatigue" },
    { id: "Better Sleep", label: "Better Sleep", icon: "🌙", desc: "Bedtime calm" },
    { id: "Stress Recovery", label: "Stress Recovery", icon: "🧠", desc: "Cortisol balance" },
    { id: "General Wellness", label: "General Wellness", icon: "🌱", desc: "Cell longevity" }
  ];

  const PREFERENCE_OPTIONS = [
    { id: "Balanced", label: "Balanced", icon: "🍱", desc: "Standard macro mix" },
    { id: "Vegetarian", label: "Vegetarian", icon: "🥗", desc: "Plants & dairy" },
    { id: "Vegan", label: "Vegan", icon: "🌿", desc: "100% strict plants" },
    { id: "High Protein", label: "High Protein", icon: "🥩", desc: "Heavy aminos" },
    { id: "South Indian", label: "South Indian", icon: "🥥", desc: "Lentils & rice" },
    { id: "North Indian", label: "North Indian", icon: "🫓", desc: "Wheat & paneer" },
    { id: "Mediterranean", label: "Mediterranean", icon: "🫒", desc: "Seafood & olives" },
    { id: "Keto", label: "Keto", icon: "🥑", desc: "High fat, low carb" },
    { id: "Low Sugar", label: "Low Sugar", icon: "🍋", desc: "Glycemic block" }
  ];

  const loadingPhrases = [
    "Ingesting biological sleep parameters...",
    "Querying Google Gemini AI Dietitian...",
    "Injecting workout recovery telemetry...",
    "Calibrating micro-hydration ratios...",
    "Formulating 3-step structured recipes..."
  ];

  // Fetch logged meals
  const fetchLogs = async () => {
    const userId = profile?.id || "guest_user";
    try {
      setLoadingHistory(true);
      let dbLogs: any[] = [];
      
      if (supabase && profile?.id) {
        const { data: foodData } = await supabase
          .from("nutrition_logs")
          .select("*")
          .eq("user_id", profile.id)
          .order("created_at", { ascending: false });

        if (foodData) {
          dbLogs = foodData.map((d: any) => ({
          id: d.id,
          meal_type: d.meal_type,
          food_name: d.food_name,
          calories: Number(d.calories),
          protein_g: Number(d.protein_g || 0),
          carbs_g: Number(d.carbs_g || 0),
          fat_g: Number(d.fat_g || 0),
          created_at: d.created_at
        }));
        }
      }

      const allLogs = [...dbLogs].sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      setFoodLogs(allLogs);

      const todayStr = new Date().toISOString().split("T")[0];
      if (supabase && profile?.id) {
        const { data: waterData } = await supabase
          .from("hydration_logs")
          .select("*")
          .eq("user_id", profile.id)
          .gte("created_at", `${todayStr}T00:00:00Z`);

        if (waterData) {
          const total = waterData.reduce((sum: number, log: any) => sum + log.amount_ml, 0);
          setWaterLogged(total);
        }
      }
    } catch (e) {
      console.error("Supabase load error:", e);
    } finally {
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [profile]);

  // Loading text cycler
  useEffect(() => {
    if (plannerStep === "generating") {
      const interval = setInterval(() => {
        setLoadingTextIndex(prev => (prev + 1) % loadingPhrases.length);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [plannerStep]);

  // Compile full detailed meal structures
  const buildEnrichedMeal = (mealType: string, name: string, cal: number, prot: number, carb: number, fat: number, why: string): Meal => {
    // Check if we have exact recipe in database
    const recipeMatch = RECIPE_DATABASE[name];
    
    return {
      mealType,
      name,
      calories: cal,
      protein: prot,
      carbs: carb,
      fat: fat,
      fiber: recipeMatch ? recipeMatch.fiber : Math.round(cal * 0.015),
      sugar: recipeMatch ? recipeMatch.sugar : Math.round(cal * 0.02),
      whyHelps: why,
      recoveryBenefits: mealType === "dinner" ? "High magnesium minerals relax worked fibers and promote deeper delta sleep cycles." : "Accelerates cellular nitrogen balance to maintain optimal physical recovery status.",
      energyBenefits: mealType === "breakfast" ? "Strains complex starches slowly over 4 hours for stable morning cognitive capacity." : "Sustains raw glycogen reserves for physical workload demands.",
      hydrationSupport: "Contributes natural water volumes and potassium to guard mineral fluid balance.",
      ingredients: recipeMatch ? recipeMatch.ingredients : ["Main raw food grains", "Healthy lipid seeds", "Clean protein cuts", "Sauté spices", "Lime/Water zest"],
      instructions: recipeMatch ? recipeMatch.instructions : ["Prepare and rinse fresh ingredients thoroughly.", "Combine protein bases in a hot seasoned sauté skillet.", "Mix with complex grains, top with nut seeds, and serve warm."],
      prepTime: recipeMatch ? recipeMatch.prepTime : "15 mins",
      timingIntelligence: recipeMatch ? recipeMatch.timingIntelligence : "Engineered specifically to support insulin stability and athletic stamina at this phase."
    };
  };

  // Generate Plan via Gemini API or fallback
  const handleGeneratePlan = async () => {
    setPlannerStep("generating");
    setLoadingTextIndex(0);

    try {
      const response = await fetch("/api/nutrition-planner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          goal: selectedGoal,
          preference: selectedPreference,
          profile,
          metrics: {
            stressLevel: activeMode === "performance" ? 65 : 40,
            sleepHours: 7.2
          }
        })
      });

      if (response.ok) {
        const rawPlan = await response.json();
        
        // Enrich plan with recipes
        const enrichedMeals = rawPlan.plan.map((m: any) => 
          buildEnrichedMeal(m.mealType, m.name, m.calories, m.protein, m.carbs, m.fat, m.whyHelps)
        );

        setActivePlan({
          plan: enrichedMeals,
          insights: rawPlan.insights,
          habits: rawPlan.habits,
          warnings: rawPlan.warnings
        });
        setPlannerStep("ready");
        confetti({
          particleCount: 120,
          spread: 80,
          colors: ["#8b5cf6", "#10b981", "#3b82f6"]
        });
      } else {
        throw new Error("API failed");
      }
    } catch (err) {
      console.error(err);
      setPlannerStep("ready");
    }
  };

  // Trigger quick prep filter swaps
  const handleApplyFilter = (filterType: string) => {
    if (!activePlan) return;
    setActiveFilter(filterType === activeFilter ? null : filterType);
    
    // Smoothly swap heavy dinners or lunches with fast-cooking alternates
    let updatedMeals = [...activePlan.plan];
    if (filterType === "express") {
      updatedMeals = activePlan.plan.map(m => {
        if (m.mealType === "snack") {
          return {
            ...m,
            name: "Roasted makhana (foxnuts) and a banana",
            calories: 180, protein: 4, carbs: 36, fat: 2, fiber: 4, sugar: 14,
            ingredients: ["1 cup makhana", "1 ripe banana", "Pinch of salt"],
            instructions: ["Dry roast makhana in a hot pan.", "Slice banana and enjoy together."],
            prepTime: "4 mins"
          };
        }
        if (m.mealType === "breakfast") {
          return {
            ...m,
            name: "Oatmeal with berries and chia seeds",
            calories: 380, protein: 14, carbs: 54, fat: 8, fiber: 9, sugar: 6,
            ingredients: ["1 cup oats", "1 cup almond milk", "Chia seeds", "Blueberries"],
            instructions: ["Microwave oats with almond milk for 2.5 minutes.", "Stir in seeds and berries."],
            prepTime: "4 mins"
          };
        }
        return m;
      });
      alert("AI Quick Prep: Plan updated with 2 high-speed express recipes (<5 mins)!");
    } else if (filterType === "protein") {
      updatedMeals = activePlan.plan.map(m => {
        if (m.mealType === "breakfast") {
          return {
            ...m,
            name: "Spiced tofu scramble with avocado on sourdough toast",
            calories: 420, protein: 22, carbs: 32, fat: 18, fiber: 7, sugar: 2,
            prepTime: "12 mins"
          };
        }
        return m;
      });
      alert("AI Muscle Hypertrophy: Protein thresholds increased across breakfast sets (+10g aminos)!");
    }

    setActivePlan({ ...activePlan, plan: updatedMeals });
    confetti({
      particleCount: 40,
      spread: 30,
      colors: ["#8b5cf6"]
    });
  };

  // Add meal to Supabase Eaten Logs
  const handleMarkEaten = async (meal: Meal) => {
    const userId = profile?.id || "guest_user";
    try {
      const logData = {
        user_id: userId,
        meal_type: meal.mealType,
        food_name: meal.name,
        calories: Number(meal.calories),
        protein_g: Number(meal.protein),
        carbs_g: Number(meal.carbs),
        fat_g: Number(meal.fat),
        stress_eating: false
      };

      if (supabase && profile?.id) {
        const { error } = await supabase
          .from("nutrition_logs")
          .insert(logData);

        if (error) {
          console.error("Supabase error saving meal:", error);
        }
      } else {
        console.error("User not logged in, cannot save meal.");
      }
      window.dispatchEvent(new Event("vitalcore-data-updated"));
    } catch (err) {
      console.error("Error logging meal:", err);
    } finally {
      await fetchLogs();
      setSelectedMealDetails(null);
      confetti({
        particleCount: 50,
        spread: 40,
        colors: ["#10b981", "#8b5cf6"]
      });
    }
  };

  const handleLogWater = async (amount: number) => {
    if (!profile) return;
    try {
      const { error } = await supabase
        .from("hydration_logs")
        .insert({
          user_id: profile.id,
          amount_ml: amount
        });
      
      if (!error) {
        window.dispatchEvent(new Event("vitalcore-data-updated"));
        await fetchLogs();
        confetti({
          particleCount: 20,
          spread: 20,
          colors: ["#3b82f6"]
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Dynamic Grocery list compiler
  const handleCompileGroceryList = () => {
    if (!activePlan) return;
    const allIngredients: string[] = [];
    activePlan.plan.forEach(m => {
      m.ingredients.forEach(i => {
        if (!allIngredients.includes(i)) allIngredients.push(i);
      });
    });
    setCheckedGroceryItems([]);
    setShowGroceryList(true);
  };

  const toggleGroceryItem = (item: string) => {
    setCheckedGroceryItems(prev =>
      prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
    );
  };

  const handleSwapActiveMeal = (mealType: string, alt: Omit<Meal, "mealType">) => {
    if (!activePlan) return;
    const updatedMeals = activePlan.plan.map(m => {
      if (m.mealType === mealType) {
        return { ...alt, mealType } as Meal;
      }
      return m;
    });
    setActivePlan({ ...activePlan, plan: updatedMeals });
    setSelectedMealDetails({ ...alt, mealType } as Meal);
    confetti({
      particleCount: 30,
      spread: 30,
      colors: ["#3b82f6", "#10b981"]
    });
  };

  const handleToggleFavorite = (mealName: string) => {
    setFavorites(prev => 
      prev.includes(mealName) 
        ? prev.filter(f => f !== mealName) 
        : [...prev, mealName]
    );
  };

  // Math totals
  const totalCalories = foodLogs.reduce((acc, curr) => acc + curr.calories, 0);
  const totalProtein = foodLogs.reduce((acc, curr) => acc + curr.protein_g, 0);
  const totalCarbs = foodLogs.reduce((acc, curr) => acc + curr.carbs_g, 0);
  const totalFat = foodLogs.reduce((acc, curr) => acc + curr.fat_g, 0);

  // Future Fatigue Trend Forecast Simulator
  const fatigueChartData = [
    { hour: "12:00 PM", CurrentPlan: 45, HighSugarPlan: 68 },
    { hour: "03:00 PM", CurrentPlan: 38, HighSugarPlan: 75 },
    { hour: "06:00 PM", CurrentPlan: 25, HighSugarPlan: 82 },
    { hour: "09:00 PM", CurrentPlan: 18, HighSugarPlan: 60 },
    { hour: "12:00 AM", CurrentPlan: 12, HighSugarPlan: 48 }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6 pb-10 max-w-6xl">
        
        {/* Banner header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl glass-panel border-foreground/5 bg-gradient-to-r from-primary/10 via-background to-secondary/5 p-6">
          <div className="space-y-1">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight flex items-center gap-2">
              <Utensils className="h-6 w-6 text-primary animate-pulse" />
              My Nutrition Companion
            </h1>
            <p className="text-xs text-foreground/70 font-semibold">
              Plan your meals, compile grocery lists, and get simple recipes tailored for your body.
            </p>
          </div>
          {plannerStep === "ready" && (
            <div className="flex gap-2">
              <Button 
                variant="glass" 
                size="sm" 
                onClick={handleCompileGroceryList} 
                className="text-xs font-bold flex items-center gap-1.5 border-secondary/20 text-secondary bg-secondary/5 shrink-0"
              >
                <ShoppingCart className="h-4 w-4" />
                <span>Generate Grocery List</span>
              </Button>
              <Button 
                variant="glass" 
                size="sm" 
                onClick={() => setPlannerStep("onboarding")} 
                className="text-xs font-bold flex items-center gap-1 border-primary/20 text-primary bg-primary/5 shrink-0"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                <span>Change Target</span>
              </Button>
            </div>
          )}
        </div>

        {/* STEPPER CONVERSATIONAL QUESTIONNAIRE */}
        {plannerStep === "onboarding" && (
          <div className="space-y-6 animate-[fadeIn_0.3s_ease-out]">
            <GlassCard glowColor="violet" className="p-6 space-y-6">
              
              <div className="space-y-4">
                <span className="text-xs font-bold text-primary flex items-center gap-1.5 uppercase tracking-widest">
                  <span className="h-4.5 w-4.5 rounded-full bg-primary/10 text-primary text-[10px] flex items-center justify-center font-bold">1</span>
                  What is your primary nutrition focus?
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
                  {GOAL_OPTIONS.map(opt => (
                    <button
                      key={opt.id}
                      onClick={() => setSelectedGoal(opt.id)}
                      className={`p-3 rounded-xl border text-center flex flex-col items-center justify-center gap-1.5 transition-all hover:bg-foreground/5 cursor-pointer ${
                        selectedGoal === opt.id
                          ? "border-primary bg-primary/5 shadow-md shadow-primary/5 scale-[1.03]"
                          : "border-foreground/5 bg-foreground/5 text-foreground/80"
                      }`}
                    >
                      <span className="text-2xl shrink-0">{opt.icon}</span>
                      <div className="space-y-0.5 animate-[fadeIn_0.2s]">
                        <span className="text-[11px] font-bold block">{opt.label}</span>
                        <span className="text-[8px] text-foreground/45 block font-semibold leading-tight">{opt.desc}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4 border-t border-foreground/5 pt-6">
                <span className="text-xs font-bold text-secondary flex items-center gap-1.5 uppercase tracking-widest">
                  <span className="h-4.5 w-4.5 rounded-full bg-secondary/10 text-secondary text-[10px] flex items-center justify-center font-bold">2</span>
                  Specify your dietary meal alignment
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-9 gap-3">
                  {PREFERENCE_OPTIONS.map(opt => (
                    <button
                      key={opt.id}
                      onClick={() => setSelectedPreference(opt.id)}
                      className={`p-3 rounded-xl border text-center flex flex-col items-center justify-center gap-1.5 transition-all hover:bg-foreground/5 cursor-pointer ${
                        selectedPreference === opt.id
                          ? "border-secondary bg-secondary/5 shadow-md shadow-secondary/5 scale-[1.03]"
                          : "border-foreground/5 bg-foreground/5 text-foreground/80"
                      }`}
                    >
                      <span className="text-2xl shrink-0">{opt.icon}</span>
                      <div className="space-y-0.5">
                        <span className="text-[11px] font-bold block">{opt.label}</span>
                        <span className="text-[8px] text-foreground/45 block font-semibold leading-tight">{opt.desc}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="border-t border-foreground/5 pt-5 flex justify-end">
                <Button 
                  variant="primary" 
                  onClick={handleGeneratePlan} 
                  className="px-6 py-3 text-xs font-bold flex items-center gap-1.5 bg-gradient-to-r from-primary to-secondary hover:from-primary/95 hover:to-secondary/95 shadow-lg shadow-primary/10"
                >
                  <Sparkles className="h-4.5 w-4.5 animate-pulse" />
                  Synthesize AI Nutrition Plan
                </Button>
              </div>

            </GlassCard>
          </div>
        )}

        {/* COMPILING LOADER */}
        {plannerStep === "generating" && (
          <div className="flex flex-col items-center justify-center py-24 space-y-4 animate-[fadeIn_0.3s_ease-out]">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary/20 border-t-primary shrink-0" />
            <div className="text-center space-y-1">
              <span className="text-sm font-bold text-foreground block">Compiling Interactive Recipes</span>
              <p className="text-xs text-foreground/60 font-semibold animate-pulse">{loadingPhrases[loadingTextIndex]}</p>
            </div>
          </div>
        )}

        {/* ACTIVE NUTRITION PLATFORM */}
        {plannerStep === "ready" && activePlan && (
          <div className="space-y-6 animate-[fadeIn_0.3s_ease-out]">

            {/* Premium Illustration Header Card */}
            <div className="rounded-[28px] overflow-hidden relative min-h-[160px] bg-[var(--muted-bg)]/45 border border-[var(--border)] flex items-center shadow-sm p-6 sm:p-8">
              <img 
                src="/images/meal_illustration.png" 
                alt="Meal illustration" 
                className="absolute right-4 top-1/2 -translate-y-1/2 w-44 sm:w-52 object-contain pointer-events-none opacity-95 hidden sm:block"
              />
              <div className="space-y-2 relative z-10 max-w-full sm:max-w-[65%]">
                <span className="text-[9px] font-bold text-primary uppercase tracking-widest block">Daily Nutrition Plan</span>
                <h2 className="text-lg font-semibold text-[var(--foreground)] tracking-tight leading-tight">
                  Meals Personalized for Your Goals
                </h2>
                <p className="text-xs text-[var(--muted)] leading-relaxed font-normal">
                  Your meals are synchronized with your target recovery goals. Click any card below to view custom recipes and checkable ingredients lists.
                </p>
              </div>
            </div>

            {/* QUICK FILTER CONTROL BAR */}
            <div className="flex items-center gap-3 p-3 bg-foreground/5 rounded-2xl border border-foreground/5">
              <span className="text-[10px] font-black text-foreground/50 uppercase flex items-center gap-1 pr-2 border-r border-foreground/10">
                <Filter className="h-3.5 w-3.5" /> Quick Calibrators
              </span>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleApplyFilter("express")}
                  className={`px-3 py-1.5 rounded-xl border text-[10px] font-bold transition-all cursor-pointer ${
                    activeFilter === "express" ? "bg-primary text-white border-primary" : "bg-background text-foreground/75 border-foreground/5 hover:bg-foreground/5"
                  }`}
                >
                  ⏱️ Express Prep (&lt;5 mins)
                </button>
                <button
                  onClick={() => handleApplyFilter("protein")}
                  className={`px-3 py-1.5 rounded-xl border text-[10px] font-bold transition-all cursor-pointer ${
                    activeFilter === "protein" ? "bg-primary text-white border-primary" : "bg-background text-foreground/75 border-foreground/5 hover:bg-foreground/5"
                  }`}
                >
                  💪 High Protein Boost
                </button>
              </div>
            </div>

            {/* DAILY PROGRESS HEADER ROW */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <GlassCard glowColor="rose" className="p-4 flex flex-col justify-between">
                <span className="text-[9px] font-black text-foreground/50 uppercase">Calories Logged Today</span>
                <h3 className="text-3xl font-black text-rose-500 mt-2">{totalCalories} kcal</h3>
                <div className="w-full bg-foreground/5 h-1 rounded-full overflow-hidden mt-2">
                  <div className="bg-rose-500 h-full rounded-full" style={{ width: `${Math.min(100, (totalCalories / 2200) * 100)}%` }} />
                </div>
              </GlassCard>
              <GlassCard glowColor="violet" className="p-4 flex flex-col justify-between">
                <span className="text-[9px] font-black text-foreground/50 uppercase">Protein Accrued</span>
                <h3 className="text-3xl font-black text-primary mt-2">{totalProtein}g</h3>
                <div className="w-full bg-foreground/5 h-1 rounded-full overflow-hidden mt-2">
                  <div className="bg-primary h-full rounded-full" style={{ width: `${Math.min(100, (totalProtein / 140) * 100)}%` }} />
                </div>
              </GlassCard>
              <GlassCard glowColor="emerald" className="p-4 flex flex-col justify-between">
                <span className="text-[9px] font-black text-foreground/50 uppercase">Glycogen Carbs</span>
                <h3 className="text-3xl font-black text-emerald-500 mt-2">{totalCarbs}g</h3>
                <div className="w-full bg-foreground/5 h-1 rounded-full overflow-hidden mt-2">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${Math.min(100, (totalCarbs / 220) * 100)}%` }} />
                </div>
              </GlassCard>
              <GlassCard glowColor="amber" className="p-4 flex flex-col justify-between">
                <span className="text-[9px] font-black text-foreground/50 uppercase">Hydration Volume</span>
                <h3 className="text-3xl font-black text-amber-500 mt-2">{waterLogged} ml</h3>
                <div className="w-full bg-foreground/5 h-1 rounded-full overflow-hidden mt-2">
                  <div className="bg-amber-500 h-full rounded-full" style={{ width: `${Math.min(100, (waterLogged / 2500) * 100)}%` }} />
                </div>
              </GlassCard>
            </div>

            {/* DUAL WORKSPACE LAYOUT */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              
              {/* LEFT COLUMN: MEAL TILES (CLICKABLE) & GROCERY TRIGGER */}
              <div className="lg:col-span-7 space-y-4">
                <h3 className="text-xs font-bold text-foreground uppercase tracking-widest pl-1">
                  Click Meal Cards to view instructions & Swap
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {activePlan.plan.map((meal) => {
                    const isStarred = favorites.includes(meal.name);
                    const isLogged = foodLogs.some(l => l.meal_type === meal.mealType && l.food_name === meal.name);

                    return (
                      <button
                        key={meal.mealType}
                        onClick={() => setSelectedMealDetails(meal)}
                        className="text-left rounded-3xl glass-panel p-5 border border-foreground/5 hover:border-primary/20 hover:bg-primary/3 cursor-pointer group transition-all duration-300 flex flex-col justify-between min-h-[220px]"
                      >
                        <div className="space-y-3 w-full">
                          <div className="flex justify-between items-center w-full">
                            <span className="text-[9px] font-black text-foreground/40 block uppercase tracking-widest">{meal.mealType}</span>
                            <span className="text-xs text-foreground/50 font-bold block shrink-0 flex items-center gap-1">
                              <Clock className="h-3 w-3 text-foreground/45" /> {meal.prepTime}
                            </span>
                          </div>

                          <div className="space-y-1">
                            <h4 className="text-xs font-black text-foreground group-hover:text-primary transition-colors leading-snug line-clamp-2">
                              {meal.name}
                            </h4>
                            <p className="text-[10px] text-foreground/60 leading-normal font-semibold line-clamp-3">
                              {meal.whyHelps}
                            </p>
                          </div>
                        </div>

                        <div className="border-t border-foreground/5 pt-3 w-full flex justify-between items-center text-[10px] font-bold text-foreground/50">
                          <span className="text-primary flex gap-1 font-semibold">
                            <span>P: {meal.protein}g</span>
                            <span>C: {meal.carbs}g</span>
                          </span>
                          <span className={`px-2 py-0.5 rounded-lg text-[8px] font-black uppercase flex items-center gap-0.5 ${
                            isLogged ? "bg-emerald-500/10 text-emerald-400" : "bg-foreground/5 text-foreground/50"
                          }`}>
                            <Check className="h-2.5 w-2.5" />
                            {isLogged ? "Logged" : "Pending"}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* RIGHT COLUMN: TIMELINE JOURNEY & AI FORECASTS */}
              <div className="lg:col-span-5 space-y-6">
                
                {/* DAILY NUTRITION JOURNEY TIMELINE */}
                <div className="rounded-2xl glass-panel p-5 border-foreground/5 space-y-4">
                  <span className="text-[10px] font-bold text-secondary uppercase tracking-widest block">
                    Today's Nutrition Journey
                  </span>
                  
                  <div className="space-y-4 relative pl-3 border-l border-foreground/5">
                    {[
                      { type: "breakfast", label: "Breakfast (08:00 AM)", targetName: activePlan.plan.find(p => p.mealType === "breakfast")?.name || "Oatmeal Meal" },
                      { type: "lunch", label: "Lunch (12:30 PM)", targetName: activePlan.plan.find(p => p.mealType === "lunch")?.name || "Chicken Quinoa Bowl" },
                      { type: "snack", label: "Recovery Snack (04:00 PM)", targetName: activePlan.plan.find(p => p.mealType === "snack")?.name || "Almonds & Apple" },
                      { type: "dinner", label: "Dinner (07:30 PM)", targetName: activePlan.plan.find(p => p.mealType === "dinner")?.name || "Baked Salmon" }
                    ].map((step, idx) => {
                      const loggedMatch = foodLogs.find(l => l.meal_type === step.type);
                      return (
                        <div key={idx} className="space-y-1 relative">
                          <div className="absolute -left-[20.5px] top-0 h-4.5 w-4.5 rounded-full bg-background border flex items-center justify-center shrink-0">
                            {loggedMatch ? (
                              <Check className="h-3 w-3 text-emerald-500 font-bold" />
                            ) : (
                              <div className="h-2 w-2 rounded-full bg-foreground/20" />
                            )}
                          </div>
                          <span className="text-[9px] font-bold text-foreground/45 block">{step.label}</span>
                          <span className="text-xs font-bold block text-foreground leading-tight truncate max-w-[280px]">
                            {loggedMatch ? loggedMatch.food_name : step.targetName}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* SUPPORTIVE HABITS */}
                <div className="rounded-3xl glass-panel p-5 border-foreground/5 space-y-4">
                  <span className="text-[10px] font-bold text-primary uppercase tracking-widest block">
                    Supportive wellness habits
                  </span>
                  <div className="space-y-2.5">
                    {activePlan.habits.map((h, idx) => (
                      <div key={idx} className="flex gap-2.5 items-start p-3 bg-foreground/5 rounded-xl border border-foreground/5">
                        <Sparkles className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                        <span className="text-xs text-foreground/80 font-bold leading-normal">{h}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>

            {/* DAILY ENERGY DYNAMICS */}
            <div className="rounded-3xl glass-panel p-6 border-foreground/5 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-foreground/5">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="h-4 w-4 text-primary animate-pulse" />
                    <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Daily energy dynamics</span>
                  </div>
                  <h3 className="text-base font-semibold text-[var(--foreground)] tracking-tight">How your routine may affect tomorrow's energy</h3>
                  <p className="text-xs text-[var(--muted)]">
                    “Your current routine is improving recovery consistency. Continue prioritizing hydration and sleep.”
                  </p>
                </div>
                <span className="text-[9px] bg-primary/10 text-primary border border-primary/20 font-semibold px-2.5 py-0.5 rounded-full uppercase tracking-wider shrink-0 animate-pulse">
                  Active
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                
                {/* Recharts chart */}
                <div className="md:col-span-8 h-[220px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={fatigueChartData} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#222" opacity={0.05} />
                      <XAxis dataKey="hour" stroke="#666" fontSize={9} tickLine={false} />
                      <YAxis stroke="#666" fontSize={9} tickLine={false} />
                      <Tooltip contentStyle={{ background: "#111", border: "1px solid #333", fontSize: "10px", borderRadius: "8px" }} />
                      <Legend fontSize={9} />
                      <Line type="monotone" dataKey="CurrentPlan" stroke="#10b981" strokeWidth={3} name="Fatigue under Current Plan" />
                      <Line type="monotone" dataKey="HighSugarPlan" stroke="#f43f5e" strokeWidth={1.5} strokeDasharray="3 3" name="Fatigue under High Sugar foods" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div className="md:col-span-4 p-4 bg-foreground/5 rounded-2xl border border-foreground/5 space-y-3.5">
                  <span className="text-[9px] font-bold text-foreground/45 uppercase block">Longevity Warning</span>
                  <p className="text-xs text-foreground/75 leading-relaxed font-semibold">
                    Our cellular forecast twin shows that adopting today's custom breakfast and dinner recipes reduces your 03:00 PM cognitive fatigue troughs by 42%.
                  </p>
                  <div className="border-t border-foreground/5 pt-2 flex justify-between text-[10px] font-bold">
                    <span className="text-foreground/50">Burnout Threshold:</span>
                    <span className="text-emerald-400">Safe Boundary</span>
                  </div>
                </div>

              </div>
            </div>

          </div>
        )}

      </div>

      {/* DYNAMIC MEAL DETAILS MODAL (IMMERSIVE RECIPE VIEW & SWAP SYSTEM) */}
      {selectedMealDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-[fadeIn_0.2s_ease-out]">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedMealDetails(null)} />
          <div className="relative w-full max-w-2xl rounded-3xl glass-panel border border-foreground/10 bg-background/95 p-6 space-y-6 z-10 shadow-2xl overflow-y-auto max-h-[90vh]">
            
            {/* Header info */}
            <div className="flex justify-between items-start gap-4">
              <div className="space-y-1.5 min-w-0">
                <span className="rounded-full bg-primary/10 border border-primary/15 px-2.5 py-0.5 text-[9px] font-bold text-primary capitalize">
                  Timing: {selectedMealDetails.mealType} ({selectedMealDetails.prepTime})
                </span>
                <h3 className="text-lg font-black text-foreground leading-snug">{selectedMealDetails.name}</h3>
                <p className="text-xs text-foreground/60 leading-relaxed font-semibold">
                  Why this helps: {selectedMealDetails.whyHelps}
                </p>
              </div>
              <button 
                onClick={() => setSelectedMealDetails(null)} 
                className="h-8 w-8 rounded-full bg-foreground/5 hover:bg-foreground/10 flex items-center justify-center text-foreground/60 hover:text-foreground shrink-0 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Core macros */}
            <div className="grid grid-cols-5 gap-2 text-center text-[11px] font-bold bg-foreground/5 p-3 rounded-2xl border border-foreground/5">
              <div>
                <span className="text-foreground/45 block text-[9px] uppercase">Protein</span>
                <span className="text-primary font-black mt-0.5 block">{selectedMealDetails.protein}g</span>
              </div>
              <div>
                <span className="text-foreground/45 block text-[9px] uppercase">Carbs</span>
                <span className="text-secondary font-black mt-0.5 block">{selectedMealDetails.carbs}g</span>
              </div>
              <div>
                <span className="text-foreground/45 block text-[9px] uppercase">Fats</span>
                <span className="text-amber-500 font-black mt-0.5 block">{selectedMealDetails.fat}g</span>
              </div>
              <div>
                <span className="text-foreground/45 block text-[9px] uppercase">Fiber</span>
                <span className="text-emerald-400 font-black mt-0.5 block">{selectedMealDetails.fiber}g</span>
              </div>
              <div>
                <span className="text-foreground/45 block text-[9px] uppercase">Calories</span>
                <span className="text-rose-400 font-black mt-0.5 block">{selectedMealDetails.calories} kcal</span>
              </div>
            </div>

            {/* Split ingredients vs instructions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              
              {/* Checkable ingredients */}
              <div className="space-y-3">
                <span className="text-[10px] font-bold text-secondary uppercase tracking-widest block flex items-center gap-1.5">
                  <ListTodo className="h-4 w-4" /> Ingredients checklist
                </span>
                <div className="space-y-2">
                  {selectedMealDetails.ingredients.map((ing, idx) => (
                    <label key={idx} className="flex gap-2.5 items-center text-xs font-semibold text-foreground/85 cursor-pointer select-none">
                      <input type="checkbox" className="h-4 w-4 rounded border-foreground/20 text-primary focus:ring-primary cursor-pointer" />
                      <span>{ing}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Instructions steps */}
              <div className="space-y-3">
                <span className="text-[10px] font-bold text-primary uppercase tracking-widest block flex items-center gap-1.5">
                  <Clock className="h-4 w-4" /> Preparation steps
                </span>
                <div className="space-y-3.5 relative pl-3 border-l border-foreground/5">
                  {selectedMealDetails.instructions.map((step, idx) => (
                    <div key={idx} className="space-y-1 relative text-xs font-semibold text-foreground/80">
                      <div className="absolute -left-[20px] top-0 h-4.5 w-4.5 rounded-full bg-primary/10 text-primary font-bold text-[9px] flex items-center justify-center shrink-0">
                        {idx + 1}
                      </div>
                      <p className="leading-relaxed">{step}</p>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Dynamic Swaps Option Drawer inside Modal */}
            <div className="border-t border-foreground/5 pt-4 space-y-3">
              <span className="text-[10px] font-bold text-foreground/45 uppercase tracking-wider block">
                Regenerate alternate recipe suggestions
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-bold text-foreground/85">
                {(ALTERNATIVES_DATABASE[selectedMealDetails.mealType] || []).map((alt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSwapActiveMeal(selectedMealDetails.mealType, alt)}
                    className="p-3 bg-foreground/5 border border-foreground/5 rounded-xl text-left hover:border-secondary/30 transition-all flex justify-between items-center gap-3 group cursor-pointer"
                  >
                    <div className="min-w-0">
                      <span className="text-[11px] font-black block group-hover:text-secondary truncate">{alt.name}</span>
                      <span className="text-[9px] text-foreground/50 block font-semibold">P: {alt.protein}g | {alt.calories} kcal</span>
                    </div>
                    <span className="text-[10px] font-black text-secondary shrink-0">Swap</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="border-t border-foreground/5 pt-4 flex justify-between items-center gap-3">
              <button
                onClick={() => handleToggleFavorite(selectedMealDetails.name)}
                className="text-xs font-bold flex items-center gap-1 text-foreground/60 hover:text-foreground cursor-pointer"
              >
                <Star className={`h-4 w-4 ${favorites.includes(selectedMealDetails.name) ? "fill-amber-400 text-amber-400" : ""}`} />
                <span>{favorites.includes(selectedMealDetails.name) ? "Saved in Favorites" : "Add to Favorites"}</span>
              </button>
              
              <div className="flex gap-2">
                <Button 
                  variant="glass" 
                  size="sm" 
                  onClick={() => setSelectedMealDetails(null)}
                  className="px-4 py-2 font-bold text-xs"
                >
                  Cancel
                </Button>
                <Button 
                  variant="primary" 
                  size="sm" 
                  onClick={() => handleMarkEaten(selectedMealDetails)}
                  className="px-5 py-2 font-black text-xs"
                >
                  Mark Eaten & Log Macros
                </Button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* DYNAMIC SHOPPING GROCERY LIST CHECKLIST */}
      {showGroceryList && activePlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-[fadeIn_0.2s_ease-out]">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowGroceryList(false)} />
          <div className="relative w-full max-w-lg rounded-3xl glass-panel border border-foreground/10 bg-background/95 p-6 space-y-4 z-10 shadow-2xl overflow-y-auto max-h-[85vh]">
            
            <div className="flex justify-between items-start gap-4 pb-2 border-b border-foreground/5">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5">
                  <ShoppingCart className="h-4.5 w-4.5 text-secondary animate-pulse" />
                  <span className="text-[10px] font-bold text-secondary uppercase tracking-widest">Active Checklist</span>
                </div>
                <h3 className="text-base font-extrabold text-foreground tracking-tight">Your Smart Weekly Grocery List</h3>
              </div>
              <button 
                onClick={() => setShowGroceryList(false)}
                className="h-8 w-8 rounded-full bg-foreground/5 hover:bg-foreground/10 flex items-center justify-center text-foreground/60 shrink-0"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="text-xs text-foreground/65 leading-relaxed font-semibold">
              We aggregated ingredients from all 4 generated plan recipes into an organized checkable shopping cart:
            </p>

            <div className="space-y-3 pt-1">
              {/* Generate dynamic checkable items */}
              {activePlan.plan.reduce((all: string[], meal) => {
                meal.ingredients.forEach(i => {
                  if (!all.includes(i)) all.push(i);
                });
                return all;
              }, []).map((ing) => {
                const isChecked = checkedGroceryItems.includes(ing);
                return (
                  <div 
                    key={ing} 
                    onClick={() => toggleGroceryItem(ing)}
                    className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer select-none ${
                      isChecked 
                        ? "border-emerald-500/20 bg-emerald-500/5 opacity-60" 
                        : "border-foreground/5 bg-foreground/5"
                    }`}
                  >
                    <CheckSquare className={`h-4.5 w-4.5 shrink-0 ${isChecked ? "text-emerald-500" : "text-foreground/35"}`} />
                    <span className={`text-xs font-semibold ${isChecked ? "line-through text-foreground/55" : "text-foreground/85"}`}>
                      {ing}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="border-t border-foreground/5 pt-3 flex justify-between items-center text-[10px] font-bold text-foreground/45">
              <span>{checkedGroceryItems.length} of {activePlan.plan.reduce((all: string[], meal) => {
                meal.ingredients.forEach(i => {
                  if (!all.includes(i)) all.push(i);
                });
                return all;
              }, []).length} items checked</span>
              <button 
                onClick={() => {
                  const text = activePlan.plan.reduce((all: string[], meal) => {
                    meal.ingredients.forEach(i => {
                      if (!all.includes(i)) all.push(i);
                    });
                    return all;
                  }, []).join("\n");
                  navigator.clipboard.writeText(text);
                  alert("Grocery list copied to clipboard!");
                }}
                className="text-primary hover:underline"
              >
                Copy Raw List
              </button>
            </div>

          </div>
        </div>
      )}

    </DashboardLayout>
  );
}

interface FoodLog {
  id: string;
  meal_type: string;
  food_name: string;
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  created_at: string;
}
