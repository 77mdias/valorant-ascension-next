"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const TestimonialCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const testimonials = [
    {
      name: "Lucas Silva",
      rank: "Diamante 3",
      avatar: "LS",
      content:
        "Subi de Prata para Diamante em apenas 2 meses! Os coaches são incríveis e as estratégias realmente funcionam.",
      rating: 5,
    },
    {
      name: "Ana Costa",
      rank: "Ascendente 2",
      avatar: "AC",
      content:
        "O método de treino focado em aim e posicionamento transformou meu gameplay. Recomendo demais!",
      rating: 5,
    },
    {
      name: "Pedro Santos",
      rank: "Imortal 1",
      avatar: "PS",
      content:
        "Finalmente consegui chegar no Imortal! O coaching personalizado fez toda diferença no meu jogo.",
      rating: 5,
    },
    {
      name: "Maria Oliveira",
      rank: "Ouro 1",
      avatar: "MO",
      content:
        "Aprendi muito sobre táticas de equipe. Minha game sense melhorou drasticamente desde que comecei.",
      rating: 5,
    },
  ];

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length,
    );
  };

  useEffect(() => {
    const interval = setInterval(nextTestimonial, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative overflow-hidden py-20">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">
            O que nossos{" "}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Alunos
            </span>{" "}
            falam
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Histórias reais de evolução e conquistas na academia NeXT
          </p>
        </div>

        <div className="relative mx-auto max-w-4xl">
          {/* Navigation Buttons */}
          <Button
            variant="ghost"
            size="icon"
            onClick={prevTestimonial}
            className="hover:shadow-neon absolute left-0 top-1/2 z-10 h-12 w-12 -translate-y-1/2 rounded-full border border-border bg-card/80 backdrop-blur-sm hover:bg-card"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={nextTestimonial}
            className="hover:shadow-neon absolute right-0 top-1/2 z-10 h-12 w-12 -translate-y-1/2 rounded-full border border-border bg-card/80 backdrop-blur-sm hover:bg-card"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>

          {/* Testimonial Cards */}
          <div className="overflow-hidden rounded-lg">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {testimonials.map((testimonial, index) => (
                <div key={index} className="w-full flex-shrink-0 px-8">
                  <div className="hover:shadow-neon space-y-6 rounded-lg border border-border bg-card p-8 text-center shadow-card transition-all duration-300">
                    {/* Avatar */}
                    <Avatar className="mx-auto h-20 w-20 border-2 border-primary/20">
                      <AvatarImage src="" />
                      <AvatarFallback className="bg-gradient-primary text-lg font-bold text-primary-foreground">
                        {testimonial.avatar}
                      </AvatarFallback>
                    </Avatar>

                    {/* Stars */}
                    <div className="flex justify-center space-x-1">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="fill-accent-orange text-accent-orange h-5 w-5"
                        />
                      ))}
                    </div>

                    {/* Content */}
                    <blockquote className="text-lg leading-relaxed text-foreground">
                      "{testimonial.content}"
                    </blockquote>

                    {/* Attribution */}
                    <div className="space-y-1">
                      <div className="font-semibold text-foreground">
                        {testimonial.name}
                      </div>
                      <div className="text-sm text-primary">
                        {testimonial.rank}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dots Indicator */}
          <div className="mt-8 flex justify-center space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-2 w-2 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? "w-8 bg-primary"
                    : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialCarousel;
