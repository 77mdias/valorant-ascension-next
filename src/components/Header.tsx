"use client";

//IMPORT DE DEPENDÊNCIAS
import { useState } from "react";
import { Button } from "./ui/button";
import { Menu, X } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

import MenuNavigation from "./MenuNavigation";
import styles from "@/scss/components/CourseCard.module.scss";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

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
            Ne
            <span className="font-poppins text-xl font-extrabold italic text-pink-600">
              XT
            </span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center space-x-8 md:flex">
          <a
            href="/cursos"
            className="group relative text-foreground/80 transition-colors duration-200 hover:text-primary"
          >
            Cursos
            <span
              className={`${styles.bgGradient} absolute -bottom-1 left-0 h-0.5 w-0 transition-all duration-300 group-hover:w-full`}
            ></span>
          </a>
          <a
            href="#instrutores"
            className="group relative text-foreground/80 transition-colors duration-200 hover:text-primary"
          >
            Instrutores
            <span
              className={`${styles.bgGradient} absolute -bottom-1 left-0 h-0.5 w-0 transition-all duration-300 group-hover:w-full`}
            ></span>
          </a>
          <a
            href="/mmr"
            className="group relative text-foreground/80 transition-colors duration-200 hover:text-primary"
          >
            MMR
            <span
              className={`${styles.bgGradient} absolute -bottom-1 left-0 h-0.5 w-0 transition-all duration-300 group-hover:w-full`}
            ></span>
          </a>
          <a
            href="/community"
            className="group relative text-foreground/80 transition-colors duration-200 hover:text-primary"
          >
            Comunidade
            <span
              className={`${styles.bgGradient} absolute -bottom-1 left-0 h-0.5 w-0 transition-all duration-300 group-hover:w-full`}
            ></span>
          </a>
          <a
            href="/prices"
            className="group relative text-foreground/80 transition-colors duration-200 hover:text-primary"
          >
            Preços
            <span
              className={`${styles.bgGradient} absolute -bottom-1 left-0 h-0.5 w-0 transition-all duration-300 group-hover:w-full`}
            ></span>
          </a>
        </nav>

        <div className="flex items-center space-x-4">
          {/* MENU DE LOGIN/PERFIL DESKTOP */}
          <MenuNavigation />

          {/* Botão de Menu Mobile */}
          <button
            className="p-2 md:hidden"
            onClick={handleMenuToggle}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="glass-card border-t border-border/50 md:hidden">
          <nav className="flex flex-col space-y-4 p-4">
            <Link
              href="/cursos"
              className="py-2 text-foreground/80 transition-colors hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              Cursos
            </Link>
            <Link
              href="/instrutores"
              className="py-2 text-foreground/80 transition-colors hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              Instrutores
            </Link>
            <Link
              href="/mmr"
              className="py-2 text-foreground/80 transition-colors hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              MMR
            </Link>
            <Link
              href="/community"
              className="py-2 text-foreground/80 transition-colors hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              Comunidade
            </Link>
            <Link
              href="/prices"
              className="py-2 text-foreground/80 transition-colors hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              Preços
            </Link>
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
