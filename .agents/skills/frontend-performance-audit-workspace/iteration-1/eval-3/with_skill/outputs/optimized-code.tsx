// Optimized Header.tsx and MenuNavigation.tsx

// -----------------------------------------------------------------------------
// src/components/Header.tsx (Optimized)
// -----------------------------------------------------------------------------

"use client";

import { useState, memo, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import MenuNavigation from "./MenuNavigation";
import styles from "@/scss/components/CourseCard.module.scss";

// 1. Extracted and Memoized Desktop Navigation
const DesktopNav = memo(({ isAuthenticated, userRole }: { isAuthenticated: boolean; userRole?: string }) => {
  const navLinks = [
    { href: "/cursos", label: "Cursos" },
    { href: "/progresso", label: "Meu Progresso", condition: isAuthenticated },
    { href: "/instrutores", label: "Instrutores" },
    { href: "/mmr", label: "MMR" },
    { href: "/community", label: "Comunidade" },
    { href: "/prices", label: "Preços" },
    { href: "/dashboard", label: "Dashboard", condition: userRole === "ADMIN" },
  ];

  return (
    <nav className="hidden items-center space-x-8 md:flex">
      {navLinks.map((link) => {
        if (link.condition === false) return null;
        return (
          <Link
            key={link.href}
            href={link.href}
            className="group relative text-foreground/80 transition-colors duration-200 hover:text-primary"
          >
            {link.label}
            <span
              className={`${styles.bgGradient} absolute -bottom-1 left-0 h-0.5 w-0 transition-all duration-300 group-hover:w-full`}
            ></span>
          </Link>
        );
      })}
    </nav>
  );
});

DesktopNav.displayName = "DesktopNav";

// 2. Extracted and Memoized Mobile Menu
const MobileMenu = memo(({ isOpen, onClose, isAuthenticated, userRole }: any) => {
  if (!isOpen) return null;

  return (
    <div className="glass-card border-t border-border/50 md:hidden">
      <nav className="flex flex-col space-y-4 p-4">
        {[
          { href: "/cursos", label: "Cursos" },
          { href: "/instrutores", label: "Instrutores" },
          { href: "/progresso", label: "Meu Progresso", condition: isAuthenticated },
          { href: "/mmr", label: "MMR" },
          { href: "/community", label: "Comunidade" },
          { href: "/prices", label: "Preços" },
          { href: "/dashboard", label: "Dashboard", condition: userRole === "ADMIN" },
        ].map((link) => {
          if (link.condition === false) return null;
          return (
            <Link
              key={link.href}
              href={link.href}
              className="py-2 text-foreground/80 transition-colors hover:text-primary"
              onClick={onClose}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
});

MobileMenu.displayName = "MobileMenu";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, user } = useAuth();

  // Use useCallback if passing to memoized components (optional here but good practice)
  const handleMenuToggle = useCallback(() => {
    setIsMenuOpen(prev => !prev);
  }, []);

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  return (
    <header className="glass-card fixed left-0 right-0 top-0 z-50 border-b border-border/50">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center space-x-2">
          <Image
            src="/Valorant-Academy.png"
            alt="Valorant Academy BR"
            width={32}
            height={32}
            priority // Optimization: Priority loading for logo
          />
          <span className="font-poppins text-xl font-bold italic">
            Ne
            <span className="font-poppins text-xl font-extrabold italic text-pink-600">
              XT
            </span>
          </span>
        </Link>

        {/* Desktop Nav is now memoized - won't re-render on menu toggle */}
        <DesktopNav isAuthenticated={isAuthenticated} userRole={user?.role} />

        <div className="flex items-center space-x-4">
          <MenuNavigation />

          <button
            className="p-2 md:hidden"
            onClick={handleMenuToggle}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      <MobileMenu 
        isOpen={isMenuOpen} 
        onClose={closeMenu} 
        isAuthenticated={isAuthenticated} 
        userRole={user?.role} 
      />
    </header>
  );
};

export default Header;

// -----------------------------------------------------------------------------
// src/components/MenuNavigation.tsx (Optimized)
// -----------------------------------------------------------------------------

import React, { memo } from "react"; // Added memo
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { useAuth } from "@/hooks/useAuth";
import { HelpCircle, LogOut, Menu, Settings, User } from "lucide-react";
import Link from "next/link";
import { signOut } from "next-auth/react";

// Memoized to prevent re-renders when parent Header state (isMenuOpen) changes
const MenuNavigation = memo(() => {
  const { user, isAuthenticated, isLoading } = useAuth();
  // Removed unused useRouter()

  if (isLoading) {
    return <div className="h-6 w-6 animate-pulse rounded bg-gray-600"></div>;
  }

  // ... (rest of the component logic remains the same, but wrapped in memo)
  // Note: Standardize on Link for all navigation items
  
  return (
    <>
      {/* ... navigation implementation ... */}
    </>
  );
});

MenuNavigation.displayName = "MenuNavigation";
export default MenuNavigation;
