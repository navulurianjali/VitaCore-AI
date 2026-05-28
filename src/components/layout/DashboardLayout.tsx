"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import {
  LayoutDashboard,
  Brain,
  Utensils,
  Moon,
  HeartPulse,
  Milestone,
  CheckSquare,
  Users,
  Settings,
  User,
  Shield,
  Activity,
  Menu,
  X,
  Scan,
  Dumbbell
} from "lucide-react";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { user, profile, loading } = useAuth();
  const { activeMode } = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Route guard
  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/auth/login");
      } else if (profile && profile.onboarding_completed !== true && pathname !== "/auth/onboarding") {
        router.push("/auth/onboarding");
      }
    }
  }, [user, profile, loading, router, pathname]);

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[var(--background)]">
        <div className="flex flex-col items-center gap-2">
          <div className="h-7 w-7 animate-spin rounded-full border-2 border-primary/20 border-t-primary" />
          <span className="text-sm text-[var(--muted)]">Loading...</span>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const navGroups = [
    {
      label: "Main",
      links: [
        { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
        { name: "AI Coach", href: "/ai-coach", icon: Brain, highlight: true },
        { name: "Fitness", href: "/fitness", icon: Dumbbell, highlight: true },
        { name: "Food Scanner", href: "/scanner", icon: Scan, highlight: true },
      ]
    },
    {
      label: "Health",
      links: [
        { name: "Smart Nutrition Plans", href: "/nutrition", icon: Utensils },
        { name: "Sleep", href: "/sleep", icon: Moon },
        { name: "Energy & Rest", href: "/recovery", icon: HeartPulse },
        { name: "Health Journey", href: "/timeline", icon: Milestone },
        { name: "Challenges", href: "/challenges", icon: CheckSquare },
        { name: "Community", href: "/community", icon: Users },
      ]
    }
  ];

  const footerLinks = [
    { name: "Profile", href: "/profile", icon: User },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  const SidebarContent = () => (
    <>
      {/* Logo / Brand */}
      <div className="flex items-center gap-2.5 px-6 py-5 shrink-0">
        <div className="h-6 w-6 rounded-lg bg-primary flex items-center justify-center shrink-0 shadow-sm shadow-primary/10">
          <Activity className="h-3.5 w-3.5 text-white" />
        </div>
        <span className="font-semibold text-[13.5px] tracking-tight text-[var(--foreground)]">VitalCore</span>
      </div>

      {/* Premium Profile Section */}
      <div className="px-4 pb-4 shrink-0">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-2xl bg-[var(--muted-bg)]/45 border border-[var(--border)] transition-all duration-300">
          <div className="h-7 w-7 rounded-xl bg-primary/8 text-primary flex items-center justify-center font-bold text-xs shrink-0">
            {profile?.full_name?.charAt(0)?.toUpperCase() || "U"}
          </div>
          <div className="overflow-hidden min-w-0 flex-1">
            <p className="text-xs font-bold text-[var(--foreground)] truncate leading-tight">{profile?.full_name || "User"}</p>
            <p className="text-[9.5px] text-[var(--muted)] capitalize leading-none mt-1.5 font-semibold">{activeMode} Mode</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-4 py-2 space-y-4 scrollbar-none">
        {navGroups.map((group) => (
          <div key={group.label} className="space-y-0.5">
            <p className="px-3 text-[10px] font-bold text-[var(--muted)] uppercase tracking-wider opacity-60">
              {group.label}
            </p>
            <div className="space-y-0.5">
              {group.links.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileSidebarOpen(false)}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-[13px] transition-all duration-200 ${
                      isActive
                        ? "bg-primary/5 text-primary font-semibold"
                        : "text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--muted-bg)]/25"
                    }`}
                  >
                    <Icon className={`h-4 w-4 shrink-0 ${isActive ? "text-primary" : "opacity-75"}`} />
                    <span className="truncate">{link.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer links */}
      <div className="px-4 py-3 space-y-0.5 border-t border-[var(--border)]/50 shrink-0">
        {footerLinks.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileSidebarOpen(false)}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-[13px] transition-all duration-200 ${
                isActive
                  ? "bg-primary/5 text-primary font-semibold"
                  : "text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--muted-bg)]/25"
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span>{link.name}</span>
            </Link>
          );
        })}
      </div>
    </>
  );

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[var(--background)]">

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 border-r border-[var(--border)] bg-[var(--card-bg)] shrink-0 select-none">
        <SidebarContent />
      </aside>

      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Mobile top bar */}
        <header className="lg:hidden flex h-12 items-center justify-between px-4 border-b border-[var(--border)] bg-[var(--card-bg)] shrink-0">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-md bg-primary flex items-center justify-center">
              <Activity className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="font-semibold text-sm">VitalCore</span>
          </Link>

          <button
            id="mobile-menu-btn"
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-[var(--muted-bg)] text-[var(--foreground)] transition-colors"
            aria-label="Toggle menu"
          >
            {mobileSidebarOpen ? <X className="h-4.5 w-4.5" /> : <Menu className="h-4.5 w-4.5" />}
          </button>
        </header>

        {/* Mobile drawer */}
        {mobileSidebarOpen && (
          <div className="fixed inset-0 z-40 lg:hidden flex">
            <div
              className="fixed inset-0 bg-black/40"
              onClick={() => setMobileSidebarOpen(false)}
            />
            <aside className="relative flex flex-col w-56 max-w-xs h-full bg-[var(--card-bg)] border-r border-[var(--border)] z-50">
              <SidebarContent />
            </aside>
          </div>
        )}

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>

      </div>
    </div>
  );
};
export default DashboardLayout;
