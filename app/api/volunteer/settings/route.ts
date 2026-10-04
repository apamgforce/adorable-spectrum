import { NextResponse } from "next/server";
import { ensureSchema, getSetting } from "../../../lib/volunteer-db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await ensureSchema();
    return NextResponse.json({ activeGroup: await getSetting("active_group") });
  } catch {
    return NextResponse.json({ activeGroup: "" });
  }
}
