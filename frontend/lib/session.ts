// /home/obed/Documents/Eny_consulting/frontend/lib/session.ts
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

/**
 * Reads the Supabase access token from cookies inside a Server Component.
 * The browser client (lib/supabaseClient.ts) sets these cookies on login --
 * this is the server-side half of that same session, not a separate auth path.
 */
export async function getAccessToken(): Promise<string | null> {
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: () => {}, // Server Components can't set cookies; middleware.ts handles refresh
      },
    }
  );
  const { data } = await supabase.auth.getSession();
  return data.session?.access_token ?? null;
}
