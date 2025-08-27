import type { Metadata } from "next";
import "./globals.scss";
import Header from "@/components/Header";

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
      <body className="antialiased">
        <div className="flex min-h-screen flex-col content-center bg-background">
          <Header />
          <main className="page-with-fixed-header">{children}</main>
        </div>
      </body>
    </html>
  );
}
