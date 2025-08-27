import { NextRequest, NextResponse } from "next/server";

const HENRIKDEV_BASE_URL =
  process.env.HENRIKDEV_API_URL || "https://api.henrikdev.xyz/valorant/v1";
const API_KEY = process.env.HENRIKDEV_API_KEY;

export async function GET(request: NextRequest) {
  try {
    console.log("🚀 API Route chamada:", request.url);
    const { searchParams } = new URL(request.url);
    const name = searchParams.get("name");
    const tag = searchParams.get("tag");
    const region = searchParams.get("region") || "na";

    console.log("📝 Parâmetros recebidos:", { name, tag, region });

    if (!name || !tag) {
      return NextResponse.json(
        { error: "Nome e tag são obrigatórios" },
        { status: 400 },
      );
    }

    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (API_KEY) {
      // API HenrikDev usa só a key, sem Bearer
      headers["Authorization"] = API_KEY;
    }

    // Buscar dados do jogador
    const playerUrl = `${HENRIKDEV_BASE_URL}/account/${name}/${tag}`;
    console.log("🌐 Fazendo requisição para:", playerUrl);
    console.log("🔑 API Key presente:", !!API_KEY);
    console.log(
      "🔑 API Key (primeiros 10 chars):",
      API_KEY ? API_KEY.substring(0, 10) + "..." : "NÃO ENCONTRADA",
    );
    console.log("📋 Headers:", headers);
    const playerResponse = await fetch(playerUrl, { headers });

    if (!playerResponse.ok) {
      const errorText = await playerResponse.text();
      return NextResponse.json(
        {
          error: `Erro ao buscar jogador: ${playerResponse.status} - ${errorText}`,
        },
        { status: playerResponse.status },
      );
    }

    const playerData = await playerResponse.json();

    // Buscar MMR do jogador
    const mmrUrl = `${HENRIKDEV_BASE_URL}/mmr/${region}/${name}/${tag}`;
    const mmrResponse = await fetch(mmrUrl, { headers });

    let mmrData = null;
    if (mmrResponse.ok) {
      mmrData = await mmrResponse.json();
    }

    // Buscar partidas recentes
    const matchesUrl = `${HENRIKDEV_BASE_URL}/matches/${region}/${name}/${tag}?mode=competitive&size=5`;
    const matchesResponse = await fetch(matchesUrl, { headers });

    let matchesData = [];
    if (matchesResponse.ok) {
      const matchesResponseData = await matchesResponse.json();
      matchesData = matchesResponseData.data || [];
    }

    console.log("✅ Dados retornados com sucesso");
    return NextResponse.json({
      player: playerData,
      mmr: mmrData,
      matches: matchesData,
    });
  } catch (error) {
    console.error("Erro na API route:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 },
    );
  }
}
