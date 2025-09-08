import React from "react";
import { Play } from "lucide-react";
import { BsDiscord } from "react-icons/bs";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import styles from "@/scss/components/CourseCard.module.scss";


const Community = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <section className="relative overflow-hidden pb-20 pt-16">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-indigo-900/20"></div>
        <div className="absolute inset-0 bg-[url('https://placehold.co/1920x1080/1a1a1a/333333?text=Valorant+Training')] bg-cover bg-center opacity-30"></div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="py-20 text-center">
            <h1 className="mb-6 text-4xl font-bold leading-tight md:text-6xl">
              <span>Comunidade</span>
              <span className="bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">{" "}Next</span>
            </h1>
            <p className="mx-auto mb-10 max-w-3xl text-xl leading-relaxed text-gray-300 md:text-2xl">Bem vindo à nossa comunidade, entre no grupo do discord abaixo e conheça um pouco mais da nossa equipe.</p>
            <div className="flex flex-col items-center justify-center gap-4 pt-4 sm:flex-row text-lg">
              <Button
                size="lg"
                className={`${styles.bgGradientPrimary} ${styles.buttonPrimary} px-8 text-primary-foreground transition-all duration-300`}
              >
                <BsDiscord className="mr-2 h-5 w-5" />
                Entrar no Discord
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-primary/30 px-8 transition-all duration-300 hover:border-primary hover:bg-primary/10 "
              >
                Seja um Instrutor
              </Button>
            </div>
          </div>
        </div>
      </section>
      
    </div>
  );
};

export default Community;
