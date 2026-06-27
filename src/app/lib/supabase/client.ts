import { createBrowserClient } from "@supabase/ssr";
import { SUPABASE_ANON_KEY, SUPABASE_URL } from "@/app/lib/supabase/config";

/** Browser-side Supabase client (stores the session in cookies via @supabase/ssr). */
export function createClient() {
    return createBrowserClient(SUPABASE_URL!, SUPABASE_ANON_KEY!);
}
