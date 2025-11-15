import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Clock, Users, ArrowRight } from "lucide-react";
import Image from "next/image";

const courses = [
  {
    id: 1,
    title: "Fundamentos do Valorant",
    description:
      "Aprenda mecânicas básicas, mira e posicionamento para começar sua jornada competitiva.",
    level: "Iniciante",
    levelColor: "bg-green-500",
    duration: "4 semanas",
    students: 145,
    thumbnail:
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=300&fit=crop&crop=center",
  },
  {
    id: 2,
    title: "Game Sense Avançado",
    description:
      "Desenvolva leitura de jogo, rotações e comunicação para dominar partidas competitivas.",
    level: "Intermediário",
    levelColor: "bg-yellow-500",
    duration: "6 semanas",
    students: 89,
    thumbnail:
      "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&h=300&fit=crop&crop=center",
  },
  {
    id: 3,
    title: "Duelista Elite",
    description:
      "Especialize-se em agents duelistas, aprenda entry frags e carry strategies.",
    level: "Avançado",
    levelColor: "bg-red-500",
    duration: "8 semanas",
    students: 67,
    thumbnail:
      "https://images.unsplash.com/photo-1560253023-3ec5d502959f?w=400&h=300&fit=crop&crop=center",
  },
  {
    id: 4,
    title: "IGL Master Class",
    description:
      "Torne-se um líder de equipe eficiente, aprenda táticas e estratégias profissionais.",
    level: "Avançado",
    levelColor: "bg-red-500",
    duration: "10 semanas",
    students: 34,
    thumbnail:
      "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=400&h=300&fit=crop&crop=center",
  },
  {
    id: 5,
    title: "Análise de Demo Pro",
    description:
      "Estude partidas profissionais e aprenda a implementar estratégias avançadas.",
    level: "Intermediário",
    levelColor: "bg-yellow-500",
    duration: "5 semanas",
    students: 78,
    thumbnail:
      "https://images.unsplash.com/photo-1556638540-97f9640292cb?w=400&h=300&fit=crop&crop=center",
  },
  {
    id: 6,
    title: "Mental Game & Clutch",
    description:
      "Desenvolva resiliência mental e aprenda a performar sob pressão em situações decisivas.",
    level: "Intermediário",
    levelColor: "bg-yellow-500",
    duration: "3 semanas",
    students: 92,
    thumbnail:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop&crop=center",
  },
];

const Courses = () => {
  return (
    <section id="cursos" className="container mx-auto px-4 py-24">
      <div className="mb-16 text-center">
        <h2 className="mb-6 font-poppins text-4xl font-bold md:text-5xl">
          Catálogo de
          <span className="bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">
            {" "}
            Cursos
          </span>
        </h2>
        <p className="mx-auto max-w-3xl text-xl text-muted-foreground">
          Conteúdo estruturado para todas as funções e níveis de habilidade. Do
          Bronze ao Radiant.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {courses.map((course) => (
          <Card
            key={course.id}
            className="glass-card hover-card group overflow-hidden border-border/50"
          >
            <div className="relative">
              <Image
                src={course.thumbnail}
                alt={course.title}
                width={400}
                height={192}
                className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent"></div>
              <Badge
                className={`absolute left-4 top-4 ${course.levelColor} border-0 text-white`}
              >
                {course.level}
              </Badge>
            </div>

            <CardContent className="p-6">
              <h3 className="mb-3 font-poppins text-xl font-semibold text-foreground transition-colors group-hover:text-primary">
                {course.title}
              </h3>

              <p className="mb-4 leading-relaxed text-muted-foreground">
                {course.description}
              </p>

              <div className="mb-6 flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center">
                  <Clock className="mr-1 h-4 w-4" />
                  {course.duration}
                </div>
                <div className="flex items-center">
                  <Users className="mr-1 h-4 w-4" />
                  {course.students} alunos
                </div>
              </div>

              <Button className="btn-gradient group/btn w-full rounded-full font-medium">
                Ver Curso
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-12 text-center">
        <Button
          variant="outline"
          size="lg"
          className="rounded-full border-primary/30 px-8 hover:border-primary hover:bg-primary/10"
        >
          Ver Todos os Cursos
        </Button>
      </div>
    </section>
  );
};

export default Courses;
