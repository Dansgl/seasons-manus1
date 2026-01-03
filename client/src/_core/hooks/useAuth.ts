import { supabase } from "@/lib/supabase";
import { getCurrentUser, ensureUser, type User } from "@/lib/supabase-db";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";
import type { User as SupabaseUser } from "@supabase/supabase-js";

type UseAuthOptions = {
  redirectOnUnauthenticated?: boolean;
  redirectPath?: string;
};

export function useAuth(options?: UseAuthOptions) {
  const { redirectOnUnauthenticated = false, redirectPath = "/login" } = options ?? {};
  const queryClient = useQueryClient();

  const [supabaseUser, setSupabaseUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Get the user from our database (synced with Supabase auth)
  const { data: dbUser, isLoading: userLoading, refetch } = useQuery({
    queryKey: ["auth", "me"],
    queryFn: async () => {
      // First try to get existing user
      let user = await getCurrentUser();
      // If not found but we have a Supabase user, create one
      if (!user && supabaseUser) {
        user = await ensureUser();
      }
      return user;
    },
    enabled: !!supabaseUser,
    retry: false,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSupabaseUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSupabaseUser(session?.user ?? null);
      setLoading(false);
      // Invalidate the me query when auth state changes
      queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
    });

    return () => subscription.unsubscribe();
  }, [queryClient]);

  const signInWithEmail = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  }, []);

  const signUpWithEmail = useCallback(async (email: string, password: string, name?: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name },
      },
    });
    if (error) throw error;
  }, []);

  const signInWithGoogle = useCallback(async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/`,
      },
    });
    if (error) throw error;
  }, []);

  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    queryClient.setQueryData(["auth", "me"], null);
    queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
  }, [queryClient]);

  const resetPassword = useCallback(async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) throw error;
  }, []);

  // Redirect if unauthenticated
  useEffect(() => {
    if (!redirectOnUnauthenticated) return;
    if (loading) return;
    if (supabaseUser) return;
    if (typeof window === "undefined") return;
    if (window.location.pathname === redirectPath) return;
    if (window.location.pathname === "/login") return;

    window.location.href = redirectPath;
  }, [redirectOnUnauthenticated, redirectPath, loading, supabaseUser]);

  return {
    // Database user (has role, shipping info, etc)
    user: dbUser ?? null,
    // Supabase auth user
    authUser: supabaseUser,
    loading: loading || userLoading,
    error: null,
    isAuthenticated: !!supabaseUser,
    refresh: () => refetch(),
    signInWithEmail,
    signUpWithEmail,
    signInWithGoogle,
    signOut,
    resetPassword,
  };
}
