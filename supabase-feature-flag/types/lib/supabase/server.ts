import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

export const createClient = async (cookieStore: ReturnType<typeof cookies>) => {
  // If cookieStore is a Promise, await it first
  const resolvedCookieStore = cookieStore instanceof Promise 
    ? await cookieStore 
    : cookieStore;

  return createServerClient(
    supabaseUrl!,
    supabaseKey!,
    {
      cookies: {
        async getAll() {
          const store = cookieStore instanceof Promise 
            ? await cookieStore 
            : cookieStore;
          return store.getAll();
        },
        async setAll(cookiesToSet) {
          try {
            const store = cookieStore instanceof Promise 
              ? await cookieStore 
              : cookieStore;
            
            cookiesToSet.forEach(({ name, value, options }) => {
              store.set(name, value, options);
            });
          } catch {
            
          }
        },
      },
    },
  );
};