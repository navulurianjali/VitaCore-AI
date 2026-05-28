"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Activity, ShieldCheck, Mail } from "lucide-react";
import Button from "@/components/ui/Button";
import GlassCard from "@/components/ui/GlassCard";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
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
          <h2 className="text-2xl font-extrabold tracking-tight">Recover Secure Credentials</h2>
          <p className="text-[11px] text-foreground/50 font-bold tracking-widest uppercase flex items-center gap-1 justify-center">
            <ShieldCheck className="h-3.5 w-3.5 text-secondary" />
            Security Reset Tunnel
          </p>
        </div>

        <GlassCard glowColor="violet">
          
          {submitted ? (
            <div className="space-y-4 text-center">
              <div className="h-10 w-10 rounded-full bg-secondary/15 flex items-center justify-center text-secondary mx-auto">
                ✓
              </div>
              <h3 className="text-sm font-bold">Verification Link Transmitted</h3>
              <p className="text-xs text-foreground/75 leading-relaxed font-medium">
                If the email `{email}` is registered in our biometric databases, you will receive secure cryptographic reset parameters shortly.
              </p>
              <Link href="/auth/login" className="block pt-2">
                <Button variant="glass" size="sm" className="w-full">
                  Return to secure log in
                </Button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <p className="text-xs text-foreground/75 leading-relaxed font-medium">
                Enter your registered biometric security email. We will transmit temporary cryptographic parameters to override your key.
              </p>
              
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

              <Button variant="primary" type="submit" className="w-full py-3.5">
                Request Cryptographic Reset
              </Button>

            </form>
          )}

        </GlassCard>

      </div>
    </div>
  );
}
