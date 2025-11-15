import { NextRequest, NextResponse } from "next/server";
import { env } from "@/config/env";

const HENRIKDEV_V4_BASE_URL = "https://api.henrikdev.xyz/valorant/v4";
const API_KEY = env.henrikdev.apiKey;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ matchId: string }> },
) {
  try {
    const { matchId } = await params;
    const { searchParams } = new URL(request.url);
    const region = searchParams.get("region") || "na";

    console.log("🎮 Buscando detalhes da partida:", matchId, "região:", region);

    if (!matchId) {
      return NextResponse.json(
        { error: "ID da partida é obrigatório" },
        { status: 400 },
      );
    }

    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (API_KEY) {
      headers["Authorization"] = API_KEY;
      console.log("🔑 Usando API Key para autenticação");
    } else {
      console.log("⚠️ API Key não encontrada, usando acesso público");
    }

    // Buscar detalhes da partida usando API v4
    const matchUrl = `${HENRIKDEV_V4_BASE_URL}/match/${region}/${matchId}`;
    console.log("🎮 Buscando partida em:", matchUrl);

    const matchResponse = await fetch(matchUrl, { headers });

    if (!matchResponse.ok) {
      console.log(
        "❌ Erro ao buscar partida:",
        matchResponse.status,
        matchResponse.statusText,
      );
      const errorText = await matchResponse.text();
      console.log("📝 Erro detalhado:", errorText);

      if (matchResponse.status === 404) {
        return NextResponse.json(
          { error: "Partida não encontrada" },
          { status: 404 },
        );
      }

      return NextResponse.json(
        { error: `Erro na API: ${matchResponse.status}` },
        { status: matchResponse.status },
      );
    }

    const matchData = await matchResponse.json();
    console.log("✅ Dados da partida recebidos com sucesso");

    return NextResponse.json({
      success: true,
      match: matchData.data,
    });
  } catch (error) {
    console.error("💥 Erro ao buscar detalhes da partida:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 },
    );
  }
}
