"use client";

import { createContext, useContext, useState } from "react";
import { SupabaseClient } from "@supabase/supabase-js";
import { createBrowserClient } from "@supabase/ssr";

// Define the SupabaseContext type
interface SupabaseContextType {
  supabase?: SupabaseClient | null; // ✅ Make supabase optional
}

export const SupabaseContext = createContext<SupabaseContextType | undefined>(undefined);

export const useSupabase = (): SupabaseContextType => {
  const context = useContext(SupabaseContext);

  if (context === undefined) {
    throw new Error("useSupabase must be used within SupabaseProvider");
  }

  return context;
};

// Supabase Provider
export const SupabaseProvider = ({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement => {
  // ✅ Check if Supabase should be disabled
  const isSupabaseDisabled = process.env.NEXT_PUBLIC_DISABLE_SUPABASE === "true";

  const [supabase] = useState(() => {
    if (isSupabaseDisabled) {
      console.warn("🚨 Supabase is disabled via environment variable.");
      return null; // ✅ Ensure it returns null instead of erroring out
    }

    // ✅ Only initialize if URL & KEY are available
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      console.warn("🚨 Supabase URL or API Key is missing. Supabase is disabled.");
      return null;
    }

    return createBrowserClient(supabaseUrl, supabaseAnonKey);
  });

  return (
    <SupabaseContext.Provider value={{ supabase }}>
      {children}
    </SupabaseContext.Provider>
  );
};
