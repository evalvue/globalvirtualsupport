import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const ANON = Deno.env.get("SUPABASE_PUBLISHABLE_KEY") ?? Deno.env.get("SUPABASE_ANON_KEY")!;
    const SERVICE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const authHeader = req.headers.get("Authorization") ?? "";
    if (!authHeader.startsWith("Bearer ")) {
      return json({ error: "Missing auth" }, 401);
    }

    // Validate caller is admin
    const userClient = createClient(SUPABASE_URL, ANON, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: userData } = await userClient.auth.getUser();
    if (!userData?.user) return json({ error: "Unauthorized" }, 401);

    const admin = createClient(SUPABASE_URL, SERVICE);
    const { data: roleRow } = await admin
      .from("user_roles")
      .select("role")
      .eq("user_id", userData.user.id)
      .eq("role", "admin")
      .maybeSingle();
    if (!roleRow) return json({ error: "Forbidden - admin only" }, 403);

    const body = await req.json();
    const { employee_id, email, password } = body ?? {};
    if (!employee_id || !email || !password || password.length < 6) {
      return json({ error: "employee_id, email, and password (min 6 chars) required" }, 400);
    }

    // Create or fetch auth user
    let createdUserId: string | null = null;
    const { data: created, error: createErr } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });
    if (createErr) {
      // If already exists, find them
      if (`${createErr.message}`.toLowerCase().includes("already")) {
        const { data: list } = await admin.auth.admin.listUsers();
        const existing = list.users.find((u) => u.email?.toLowerCase() === email.toLowerCase());
        if (!existing) return json({ error: createErr.message }, 400);
        await admin.auth.admin.updateUserById(existing.id, { password, email_confirm: true });
        createdUserId = existing.id;
      } else {
        return json({ error: createErr.message }, 400);
      }
    } else {
      createdUserId = created.user!.id;
    }

    // Assign employee role
    await admin
      .from("user_roles")
      .upsert({ user_id: createdUserId, role: "employee" }, { onConflict: "user_id,role" });

    // Link to employee row
    const { error: linkErr } = await admin
      .from("employees")
      .update({ user_id: createdUserId, email })
      .eq("id", employee_id);
    if (linkErr) return json({ error: linkErr.message }, 400);

    return json({ ok: true, user_id: createdUserId });
  } catch (e) {
    return json({ error: (e as Error).message }, 500);
  }
});

function json(obj: unknown, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}