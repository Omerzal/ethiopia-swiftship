import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const SAFE_PARCEL_COLS =
  "id, tracking_code, qr_token, status, sender_name, receiver_name, weight_kg, category, fragile, price_etb, created_at, delivered_at, origin_branch_id, destination_branch_id";

/** Public — anyone can look up a parcel by tracking_code (no secret/phone leaked) */
export const lookupParcel = createServerFn({ method: "POST" })
  .inputValidator((d: { code: string }) =>
    z.object({ code: z.string().trim().min(3).max(64) }).parse(d),
  )
  .handler(async ({ data }) => {
    const code = data.code.toUpperCase();
    const { data: parcel } = await supabaseAdmin
      .from("parcels")
      .select(SAFE_PARCEL_COLS)
      .or(`tracking_code.eq.${code},qr_token.eq.${code}`)
      .maybeSingle();
    if (!parcel) return { parcel: null, events: [], branches: [] };
    const { data: events } = await supabaseAdmin
      .from("tracking_events")
      .select("id, status, note, branch_id, created_at")
      .eq("parcel_id", parcel.id)
      .order("created_at", { ascending: true });
    const branchIds = Array.from(
      new Set([
        parcel.origin_branch_id,
        parcel.destination_branch_id,
        ...(events ?? []).map((e) => e.branch_id).filter(Boolean),
      ]),
    );
    const { data: branches } = await supabaseAdmin
      .from("branches").select("id, city, code, region").in("id", branchIds as string[]);
    return { parcel, events: events ?? [], branches: branches ?? [] };
  });

/** Staff — verify QR token + receiver secret and release the parcel */
export const verifyAndRelease = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { qr: string; secret: string }) =>
    z.object({
      qr: z.string().trim().min(3).max(128),
      secret: z.string().trim().regex(/^\d{6}$/),
    }).parse(d),
  )
  .handler(async ({ data, context }) => {
    const { userId } = context;
    // staff check
    const { data: staff } = await supabaseAdmin
      .from("user_roles").select("role").eq("user_id", userId);
    const isStaff = (staff ?? []).some((r) =>
      ["super_admin", "branch_manager", "agent", "driver"].includes(r.role),
    );
    if (!isStaff) throw new Error("Only branch staff can release parcels");

    const { data: parcel } = await supabaseAdmin
      .from("parcels").select("id, status, secret_code, qr_token, receiver_name, destination_branch_id")
      .eq("qr_token", data.qr).maybeSingle();

    const qrOk = !!parcel;
    const secretOk = !!parcel && parcel.secret_code === data.secret;
    const released = qrOk && secretOk && parcel.status !== "delivered";

    await supabaseAdmin.from("verifications").insert({
      parcel_id: parcel?.id, agent_id: userId, qr_ok: qrOk, secret_ok: secretOk, released,
    });

    if (released && parcel) {
      await supabaseAdmin.from("parcels").update({
        status: "delivered", delivered_at: new Date().toISOString(),
      }).eq("id", parcel.id);
      await supabaseAdmin.from("tracking_events").insert({
        parcel_id: parcel.id, status: "delivered",
        branch_id: parcel.destination_branch_id, actor_id: userId,
        note: "QR + secret verified — released to receiver",
      });
    }

    return {
      qrOk, secretOk, released,
      parcel: parcel ? {
        id: parcel.id, status: parcel.status, receiver_name: parcel.receiver_name,
      } : null,
    };
  });

/** Staff — advance parcel to next status */
export const advanceStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { parcelId: string; status: string; note?: string; branchId?: string }) =>
    z.object({
      parcelId: z.string().uuid(),
      status: z.enum(["registered", "stored", "in_transit", "arrived_hub", "ready_for_pickup", "out_for_delivery", "delivered", "returned", "lost"]),
      note: z.string().max(500).optional(),
      branchId: z.string().uuid().optional(),
    }).parse(d),
  )
  .handler(async ({ data, context }) => {
    const { userId } = context;
    const { data: staff } = await supabaseAdmin
      .from("user_roles").select("role").eq("user_id", userId);
    const isStaff = (staff ?? []).some((r) =>
      ["super_admin", "branch_manager", "agent", "driver"].includes(r.role),
    );
    if (!isStaff) throw new Error("Forbidden");

    await supabaseAdmin.from("parcels").update({ status: data.status as never })
      .eq("id", data.parcelId);
    await supabaseAdmin.from("tracking_events").insert({
      parcel_id: data.parcelId, status: data.status as never, branch_id: data.branchId,
      note: data.note, actor_id: userId,
    });
    return { ok: true };
  });
