import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Session, User } from "@supabase/supabase-js";

export type Role = "super_admin" | "branch_manager" | "agent" | "driver" | "customer";

type AuthState = {
  user: User | null;
  session: Session | null;
  roles: Role[];
  primaryRole: Role | null;
  loading: boolean;
  signOut: () => Promise<void>;
};

const Ctx = createContext<AuthState>({
  user: null, session: null, roles: [], primaryRole: null, loading: true, signOut: async () => {},
});

const ROLE_PRIORITY: Role[] = ["super_admin", "branch_manager", "agent", "driver", "customer"];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s);
      if (s?.user) {
        setTimeout(() => loadRoles(s.user.id), 0);
      } else {
        setRoles([]);
      }
    });
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      if (data.session?.user) loadRoles(data.session.user.id);
      setLoading(false);
    });
    return () => subscription.unsubscribe();
  }, []);

  async function loadRoles(uid: string) {
    const { data } = await supabase.from("user_roles").select("role").eq("user_id", uid);
    setRoles((data ?? []).map((r) => r.role as Role));
  }

  const primaryRole = ROLE_PRIORITY.find((r) => roles.includes(r)) ?? null;

  return (
    <Ctx.Provider value={{
      user: session?.user ?? null, session, roles, primaryRole, loading,
      signOut: async () => { await supabase.auth.signOut(); },
    }}>{children}</Ctx.Provider>
  );
}

export const useAuth = () => useContext(Ctx);
