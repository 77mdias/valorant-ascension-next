import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Clock, Users, ArrowRight } from "lucide-react";

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
        <h2 className="font-poppins mb-6 text-4xl font-bold md:text-5xl">
          Catálogo de
          <span className="from-secondary to-accent bg-gradient-to-r bg-clip-text text-transparent">
            {" "}
            Cursos
          </span>
        </h2>
        <p className="text-muted-foreground mx-auto max-w-3xl text-xl">
          Conteúdo estruturado para todas as funções e níveis de habilidade. Do
          Bronze ao Radiant.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {courses.map((course) => (
          <Card
            key={course.id}
            className="glass-card hover-card border-border/50 group overflow-hidden"
          >
            <div className="relative">
              <img
                src={course.thumbnail}
                alt={course.title}
                className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="from-background/60 absolute inset-0 bg-gradient-to-t to-transparent"></div>
              <Badge
                className={`absolute top-4 left-4 ${course.levelColor} border-0 text-white`}
              >
                {course.level}
              </Badge>
            </div>

            <CardContent className="p-6">
              <h3 className="font-poppins text-foreground group-hover:text-primary mb-3 text-xl font-semibold transition-colors">
                {course.title}
              </h3>

              <p className="text-muted-foreground mb-4 leading-relaxed">
                {course.description}
              </p>

              <div className="text-muted-foreground mb-6 flex items-center justify-between text-sm">
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
          className="border-primary/30 hover:border-primary hover:bg-primary/10 rounded-full px-8"
        >
          Ver Todos os Cursos
        </Button>
      </div>
    </section>
  );
};

export default Courses;
