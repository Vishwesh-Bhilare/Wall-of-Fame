"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import type { User } from "@supabase/supabase-js";
import type { UserProfile, UserRole } from "@/types/user";

type AuthState = {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  role: UserRole | null;
  refresh: () => Promise<void>;
  signOut: () => Promise<void>;
};

export function useAuth(): AuthState {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);

    const {
      data: { user: authUser },
      error,
    } = await supabase.auth.getUser();

    if (error || !authUser) {
      setUser(null);
      setProfile(null);
      setLoading(false);
      return;
    }

    setUser(authUser);

    const { data: profileData } = await supabase
      .from("profiles")
      .select("id,name,email,prn,department,year,role,github_url,created_at,updated_at")
      .eq("id", authUser.id)
      .maybeSingle();

    setProfile((profileData as UserProfile | null) || null);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      load();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [load]);

  const handleSignOut = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  }, []);

  return useMemo(
    () => ({
      user,
      profile,
      loading,
      isAuthenticated: !!user,
      isAdmin: profile?.role === "admin" || profile?.role === "head_admin",
      role: profile?.role || null,
      refresh: load,
      signOut: handleSignOut,
    }),
    [handleSignOut, load, loading, profile, user]
  );
}
