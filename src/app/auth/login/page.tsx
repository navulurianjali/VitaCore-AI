"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Activity, ShieldCheck, Mail, Lock } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import Button from "@/components/ui/Button";
import GlassCard from "@/components/ui/GlassCard";

export default function LoginPage() {
  const { signIn, isMockMode } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setLoading(true);
    setErrorMsg("");

    try {
      const { error } = await signIn(email, password);
      if (error) {
        setErrorMsg(error.message);
      } else {
        router.push("/dashboard");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "An unexpected error occurred during secure sign-in.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center bg-background px-4 py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.05),transparent_60%)]" />
      
      <div className="w-full max-w-md relative z-10 space-y-6">
        
        {/* Logo */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-white shadow-lg shadow-primary/20">
            <Activity className="h-6 w-6" />
          </Link>
          <h2 className="text-2xl font-extrabold tracking-tight">Access VitalCore Console</h2>
          <p className="text-[11px] text-foreground/50 font-bold tracking-widest uppercase flex items-center gap-1 justify-center">
            <ShieldCheck className="h-3.5 w-3.5 text-secondary" />
            Secure Session Gateway
          </p>
        </div>

        <GlassCard glowColor="violet">
          
          {isMockMode && (
            <div className="mb-5 rounded-xl border border-secondary/15 bg-secondary/5 p-3.5 text-xs text-secondary leading-normal font-semibold">
              💡 **Mock DB Mode active**: Enter any demo email and password to log in, or sign up a new local user instantly!
            </div>
          )}

          {errorMsg && (
            <div className="mb-4 rounded-xl border border-red-500/20 bg-red-500/5 px-3 py-2 text-xs text-red-500 font-bold">
              ⚠ {errorMsg}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground">Registered Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-foreground/40" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-xs pl-10.5 pr-4 py-3 rounded-xl border border-foreground/10 bg-foreground/5 text-foreground placeholder-foreground/45 focus:outline-none focus:border-primary/50"
                  placeholder="name@company.com"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-foreground">Encryption Key</label>
                <Link href="/auth/forgot-password" className="text-[11px] font-bold text-primary hover:underline">
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-foreground/40" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full text-xs pl-10.5 pr-4 py-3 rounded-xl border border-foreground/10 bg-foreground/5 text-foreground placeholder-foreground/45 focus:outline-none focus:border-primary/50"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <Button variant="primary" type="submit" isLoading={loading} className="w-full py-3.5">
              Validate and Enter Console
            </Button>

          </form>

          <div className="mt-5 border-t border-foreground/5 pt-4 text-center text-xs text-foreground/60 font-medium">
            New explorer?{" "}
            <Link href="/auth/signup" className="font-bold text-primary hover:underline">
              Create secure profile
            </Link>
          </div>

        </GlassCard>

      </div>
    </div>
  );
}
