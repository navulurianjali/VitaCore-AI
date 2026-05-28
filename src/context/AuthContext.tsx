"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase, isSupabaseConfigured, mockDb } from "@/utils/supabase";

interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  username: string;
  avatar_url?: string;
  active_mode: "wellness" | "performance" | "elderly";
  onboarding_completed?: boolean;
  soreness_level: number;
  biological_age: number;
  stability_score: number;
  weight_kg?: number;
  height_cm?: number;
  fitness_goal?: string;
  
  // Onboarding metadata parameters
  bmi?: number;
  body_fat_estimate?: number;
  occupation?: string;
  timezone?: string;
  fitness_level?: string;
  workout_duration_preference?: number;
  preferred_workout_time?: string;
  home_gym_preference?: string;
  previous_injuries?: string;
  chronic_conditions?: string;
  surgeries?: string;
  mobility_limitations?: string;
  sleep_problems?: boolean;
  dietary_preferences?: string;
  disliked_foods?: string[];
  favorite_foods?: string[];
  allergies?: string;
  meal_timing_habits?: string;
  caffeine_intake?: string;
  wearable_synced?: boolean;
  anxiety_rating?: number;
  motivation_level?: number;
  stress_level_onboard?: number;
  screen_time_hours?: number;
  sitting_hours?: number;
}

interface AuthContextProps {
  user: any | null;
  profile: UserProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, fullName: string, username: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ error: Error | null }>;
  isMockMode: boolean;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const isMockMode = !isSupabaseConfigured;

  useEffect(() => {
    if (isSupabaseConfigured && supabase) {
      // Supabase Active mode listener
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session) {
          setUser(session.user);
          fetchSupabaseProfile(session.user.id);
        } else {
          setLoading(false);
        }
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session) {
          setUser(session.user);
          fetchSupabaseProfile(session.user.id);
        } else {
          setUser(null);
          setProfile(null);
          setLoading(false);
        }
      });

      return () => {
        subscription.unsubscribe();
      };
    } else {
      // Mock mode session check
      if (typeof window !== "undefined") {
        const storedUser = localStorage.getItem("vitalcore_session_user");
        const storedProfile = localStorage.getItem("vitalcore_session_profile");
        if (storedUser && storedProfile) {
          setUser(JSON.parse(storedUser));
          setProfile(JSON.parse(storedProfile));
        }
      }
      setLoading(false);
    }
  }, []);

  const fetchSupabaseProfile = async (uid: string) => {
    if (!supabase) return;
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", uid)
        .single();
      if (data && !error) {
        setProfile(data as UserProfile);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string): Promise<{ error: Error | null }> => {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) return { error };
      setUser(data.user);
      return { error: null };
    } else {
      // Mock Sign In logic
      const users = mockDb.getTableData<any>("users");
      const found = users.find((u) => u.email === email && u.password === password);
      
      if (!found) {
        return { error: new Error("Invalid email or password.") };
      }

      const sessionUser = { id: found.id, email: found.email, role: "authenticated" };
      
      // Fetch profile
      const profiles = mockDb.getTableData<UserProfile>("profiles");
      let userProfile = profiles.find((p) => p.id === found.id);

      if (!userProfile) {
        userProfile = {
          id: found.id,
          email: found.email,
          full_name: found.full_name || "Wellness Explorer",
          username: found.username || email.split("@")[0],
          active_mode: "wellness",
          onboarding_completed: false,
          soreness_level: 0,
          biological_age: 30.0,
          stability_score: 100.0,
        };
        mockDb.insertRow("profiles", userProfile);
      }

      if (typeof window !== "undefined") {
        localStorage.setItem("vitalcore_session_user", JSON.stringify(sessionUser));
        localStorage.setItem("vitalcore_session_profile", JSON.stringify(userProfile));
      }

      setUser(sessionUser);
      setProfile(userProfile);
      return { error: null };
    }
  };

  const signUp = async (
    email: string,
    password: string,
    fullName: string,
    username: string
  ): Promise<{ error: Error | null }> => {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            username: username,
          },
        },
      });
      if (error) return { error };
      setUser(data.user);
      return { error: null };
    } else {
      // Mock Sign Up logic
      const users = mockDb.getTableData<any>("users");
      const exists = users.some((u) => u.email === email || u.username === username);

      if (exists) {
        return { error: new Error("User with this email or username already exists.") };
      }

      const uid = crypto.randomUUID();
      const newUser = { id: uid, email, password, full_name: fullName, username };
      mockDb.insertRow("users", newUser);

      const userProfile: UserProfile = {
        id: uid,
        email,
        full_name: fullName,
        username,
        active_mode: "wellness",
        onboarding_completed: false,
        soreness_level: 0,
        biological_age: 28.5,
        stability_score: 95.0,
      };
      mockDb.insertRow("profiles", userProfile);

      const sessionUser = { id: uid, email, role: "authenticated" };
      if (typeof window !== "undefined") {
        localStorage.setItem("vitalcore_session_user", JSON.stringify(sessionUser));
        localStorage.setItem("vitalcore_session_profile", JSON.stringify(userProfile));
      }

      setUser(sessionUser);
      setProfile(userProfile);
      return { error: null };
    }
  };

  const signOut = async (): Promise<void> => {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    } else {
      if (typeof window !== "undefined") {
        localStorage.removeItem("vitalcore_session_user");
        localStorage.removeItem("vitalcore_session_profile");
      }
      setUser(null);
      setProfile(null);
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>): Promise<{ error: Error | null }> => {
    if (!profile) return { error: new Error("No active session profile found.") };

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from("profiles")
        .update(updates)
        .eq("id", profile.id)
        .select()
        .single();
      
      if (error) return { error };
      setProfile(data as UserProfile);
      return { error: null };
    } else {
      // Mock database update logic
      mockDb.updateRows<UserProfile>("profiles", { id: profile.id }, updates);
      
      const newProfile = { ...profile, ...updates };
      if (typeof window !== "undefined") {
        localStorage.setItem("vitalcore_session_profile", JSON.stringify(newProfile));
      }
      setProfile(newProfile);
      return { error: null };
    }
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, signIn, signUp, signOut, updateProfile, isMockMode }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
