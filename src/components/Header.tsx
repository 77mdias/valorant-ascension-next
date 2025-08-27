"use client";

//IMPORT DE DEPENDÊNCIAS
import { useState } from "react";
import { Button } from "./ui/button";
import { Menu, X } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  return (
    <header className="glass-card fixed left-0 right-0 top-0 z-50 border-b border-border/50">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <Image
            src="/Valorant-Academy.png"
            alt="Valorant Academy BR"
            width={32}
            height={32}
          />
          <span className="font-poppins text-xl font-bold italic">
            Ascension Ne
            <span className="font-extrabold italic text-pink-600">XT</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center space-x-8 md:flex">
          <a
            href="#cursos"
            className="text-foreground/80 transition-colors hover:text-primary"
          >
            Cursos
          </a>
          <a
            href="#instrutores"
            className="text-foreground/80 transition-colors hover:text-primary"
          >
            Instrutores
          </a>
          <a
            href="/mmr"
            className="text-foreground/80 transition-colors hover:text-primary"
          >
            MMR
          </a>
          <a
            href="#comunidade"
            className="text-foreground/80 transition-colors hover:text-primary"
          >
            Comunidade
          </a>
          <a
            href="#precos"
            className="text-foreground/80 transition-colors hover:text-primary"
          >
            Preços
          </a>
        </nav>

        {/* CTA Button */}
        <div className="hidden md:block">
          <Button
            className="btn-gradient rounded-full px-6 py-2 font-medium"
            onClick={() => router.push("/auth/signin")}
          >
            Começar Agora
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="p-2 md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="glass-card border-t border-border/50 md:hidden">
          <nav className="flex flex-col space-y-4 p-4">
            <a
              href="#cursos"
              className="py-2 text-foreground/80 transition-colors hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              Cursos
            </a>
            <a
              href="#instrutores"
              className="py-2 text-foreground/80 transition-colors hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              Instrutores
            </a>
            <a
              href="#ranking"
              className="py-2 text-foreground/80 transition-colors hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              Ranking
            </a>
            <a
              href="#comunidade"
              className="py-2 text-foreground/80 transition-colors hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              Comunidade
            </a>
            <a
              href="#precos"
              className="py-2 text-foreground/80 transition-colors hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              Preços
            </a>
            <Button className="btn-gradient mt-4 rounded-full px-6 py-2 font-medium">
              Começar Agora
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
