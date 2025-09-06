"use client";

import { useEffect, useState } from "react";
import { Users, Trophy, Clock, Award } from "lucide-react";
import styles from "@/scss/components/CourseCard.module.scss";

const StatsSection = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const stats = [
    {
      icon: <Users className="h-6 w-6" />,
      value: "500+",
      label: "Alunos Ativos",
      color: "text-accent-cyan",
    },
    {
      icon: <Trophy className="h-6 w-6" />,
      value: "95%",
      label: "Taxa de Evolução",
      color: "text-secondary",
    },
    {
      icon: <Clock className="h-6 w-6" />,
      value: "1000+",
      label: "Horas de Conteúdo",
      color: "text-accent-orange",
    },
    {
      icon: <Award className="h-6 w-6" />,
      value: "50+",
      label: "Coaches Radiante",
      color: "text-primary",
    },
  ];

  return (
    <section className="relative overflow-hidden py-20">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-secondary/5"></div>

      <div className="container relative mx-auto px-4">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`transform space-y-3 text-center transition-all duration-700 ${
                isVisible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-10 opacity-0"
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              {/* Icon Container */}
              <div
                className={`${styles.hoverShadowNeon} group inline-flex h-16 w-16 items-center justify-center rounded-lg border border-border bg-card transition-all duration-300 hover:border-primary/50`}
              >
                <div className={stat.color}>{stat.icon}</div>
              </div>

              {/* Value */}
              <div className={`text-3xl font-bold md:text-4xl ${stat.color}`}>
                {stat.value}
              </div>

              {/* Label */}
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
