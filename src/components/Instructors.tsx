import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Twitch, Youtube, Instagram } from "lucide-react";
import styles from "@/scss/components/CourseCard.module.scss";

const instructors = [
  {
    id: 1,
    name: "Ricardo 'RicoGG' Silva",
    role: "Duelista Specialist",
    rank: "Radiant",
    bio: "Ex-pro player da LOUD, especialista em Jett e Reyna. +3 anos ensinando entry fragging.",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    students: 2500,
    rating: 4.9,
    socials: {
      twitch: "@ricogg_tv",
      youtube: "@RicoValorant",
      instagram: "@ricogg",
    },
  },
  {
    id: 2,
    name: "Ana 'Phoenix' Costa",
    role: "IGL & Controladora",
    rank: "Immortal 3",
    bio: "Captain da equipe feminina Game Changers. Especialista em Omen, Viper e liderança de equipe.",
    avatar:
      "https://images.unsplash.com/photo-1494790108755-2616b612b547?w=150&h=150&fit=crop&crop=face",
    students: 1800,
    rating: 4.8,
    socials: {
      twitch: "@phoenixgg",
      youtube: "@AnaValorant",
      instagram: "@anaphoenix",
    },
  },
  {
    id: 3,
    name: "Lucas 'Cypher' Mendes",
    role: "Sentinela Master",
    rank: "Radiant",
    bio: "Conhecido pelas setups criativas de Cypher e Killjoy. Revolucionou o meta de sentinelas no BR.",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    students: 2100,
    rating: 4.9,
    socials: {
      twitch: "@cypher_lucas",
      youtube: "@LucasCypher",
      instagram: "@lucas_cypher",
    },
  },
  {
    id: 4,
    name: "Thiago 'Sova' Ferreira",
    role: "Iniciador Pro",
    rank: "Radiant",
    bio: "Especialista em Sova e Skye. Suas lineups são utilizadas por teams profissionais.",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    students: 1900,
    rating: 4.8,
    socials: {
      twitch: "@thiagosova",
      youtube: "@SovaLineups",
      instagram: "@thiago_sova",
    },
  },
  {
    id: 5,
    name: "Camila 'Sage' Oliveira",
    role: "Support & Mental Coach",
    rank: "Immortal 2",
    bio: "Psicóloga especializada em performance gaming. Ensina resilência mental e comunicação.",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    students: 1600,
    rating: 5.0,
    socials: {
      twitch: "@camilasage",
      youtube: "@MentalGameVAL",
      instagram: "@camila_sage",
    },
  },
];

const getRankClass = (rank: string) => {
  if (rank === "Radiant") return "rank-radiant";
  if (rank === "Immortal 3" || rank === "Immortal 2") return "rank-immortal";
  return "rank-diamond";
};

const Instructors = () => {
  return (
    <section id="instrutores" className="container mx-auto px-4 py-24">
      <div className="mb-16 text-center">
        <h2 className="font-poppins mb-6 text-4xl font-bold md:text-5xl">
          Nossos
          <span className={`${styles.bgGradientPrimary} bg-clip-text text-transparent`}>
            {" "}
            Instrutores
          </span>
        </h2>
        <p className="text-muted-foreground mx-auto max-w-3xl text-xl">
          Aprenda com os melhores players e coaches do cenário brasileiro de
          Valorant.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {instructors.map((instructor) => (
          <Card
            key={instructor.id}
            className="glass-card hover-card border-border/50 group overflow-hidden"
          >
            <CardContent className="p-6">
              {/* Avatar & Rank */}
              <div className="relative mb-6 text-center">
                <img
                  src={instructor.avatar}
                  alt={instructor.name}
                  className="ring-primary/20 group-hover:ring-primary/40 mx-auto mb-4 h-20 w-20 rounded-full object-cover ring-4 transition-all"
                />
                <Badge
                  className={`${getRankClass(instructor.rank)} rounded-full px-3 py-1 text-xs font-semibold`}
                >
                  {instructor.rank}
                </Badge>
              </div>

              {/* Name & Role */}
              <div className="mb-4 text-center">
                <h3 className="font-poppins text-foreground mb-1 text-xl font-semibold">
                  {instructor.name}
                </h3>
                <p className="text-primary font-medium">{instructor.role}</p>
              </div>

              {/* Bio */}
              <p className="text-muted-foreground mb-6 text-center text-sm leading-relaxed">
                {instructor.bio}
              </p>

              {/* Stats */}
              <div className="bg-muted/20 mb-6 flex items-center justify-between rounded-lg p-3">
                <div className="text-center">
                  <div className="text-primary text-lg font-bold">
                    {instructor.students}
                  </div>
                  <div className="text-muted-foreground text-xs">Alunos</div>
                </div>
                <div className="text-center">
                  <div className="text-secondary text-lg font-bold">
                    ★ {instructor.rating}
                  </div>
                  <div className="text-muted-foreground text-xs">Avaliação</div>
                </div>
              </div>

              {/* Social Links */}
              <div className="mb-6 flex justify-center space-x-4">
                <Button
                  size="sm"
                  variant="outline"
                  className="border-primary/30 hover:border-primary hover:bg-primary/10 p-2"
                >
                  <Twitch className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-primary/30 hover:border-primary hover:bg-primary/10 p-2"
                >
                  <Youtube className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-primary/30 hover:border-primary hover:bg-primary/10 p-2"
                >
                  <Instagram className="h-4 w-4" />
                </Button>
              </div>

              {/* CTA */}
              <Button className="btn-gradient w-full rounded-full font-medium">
                Ver Perfil
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default Instructors;
