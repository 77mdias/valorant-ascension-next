import { NextRequest, NextResponse } from "next/server";
import { saveSubtitleFile } from "@/lib/fileUpload";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "Envie um arquivo .vtt válido" },
        { status: 400 },
      );
    }

    const url = await saveSubtitleFile(file);
    return NextResponse.json({ success: true, url });
  } catch (error) {
    console.error("Erro ao fazer upload da legenda:", error);
    const message =
      error instanceof Error
        ? error.message
        : "Não foi possível salvar a legenda";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
