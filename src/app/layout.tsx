import type { Metadata } from "next";
import "./globals.scss";

export const metadata: Metadata = {
  title: "Valorant Ascension Next",
  description:
    "Valorant Ascension Next - Sua ascensão começa aqui, já no próximo nível!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="antialiased">{children}</body>
    </html>
  );
}
