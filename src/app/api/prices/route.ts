// src/app/api/prices/route.ts (server)
import { NextResponse } from "next/server";

export async function GET() {
  const map = {
    BASICO: process.env.PRICE_BASICO || null,
    INTERMEDIARIO: process.env.PRICE_INTERMEDIARIO || null,
    AVANCADO: process.env.PRICE_AVANCADO || null,
  };

  return NextResponse.json({ prices: map });
}
