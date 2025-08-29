// prisma/seed.js

import { PrismaClient, TutorialType } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  console.log("Iniciando verificação e seed dos dados...");

  // VERIFICANDO E CRIANDO FUNÇÕES DO VALORANT
  const roles = [
    {
      name: "Duelist",
      slug: "duelist",
      description:
        "Iniciadores de confronto com foco em eliminação. Ideal para entry fraggers.",
      iconUrl: "https://cdn.valorant-api.com/icons/duelist.png",
      color: "#FF4655",
    },
    {
      name: "Initiator",
      slug: "initiator",
      description:
        "Preparam o terreno para a equipe entrar, revelando inimigos ou interrompendo defesas.",
      iconUrl: "https://cdn.valorant-api.com/icons/initiator.png",
      color: "#17BEBB",
    },
    {
      name: "Controller",
      slug: "controller",
      description:
        "Manipulam o campo de batalha, bloqueando visão e controlando espaço.",
      iconUrl: "https://cdn.valorant-api.com/icons/controller.png",
      color: "#7159C1",
    },
    {
      name: "Sentinel",
      slug: "sentinel",
      description:
        "Especialistas defensivos que seguram posições e protegem o time.",
      iconUrl: "https://cdn.valorant-api.com/icons/sentinel.png",
      color: "#FDCB6E",
    },
  ];

  for (const role of roles) {
    const existingRole = await prisma.agentRoles.findUnique({
      where: { slug: role.slug },
    });

    if (!existingRole) {
      await prisma.agentRoles.create({ data: role });
      console.log(`Função criada: ${role.name}`);
    } else {
      console.log(`Função já existe: ${role.name}`);
    }
  }

  // VERIFICANDO E CRIANDO CATEGORIAS DE AULAS
  const categories = [
    { name: "Valorant Básico" },
    { name: "Agentes" },
    { name: "Mapas" },
    { name: "Estratégia" },
    { name: "Mecânicas" },
  ];

  const categoryIds: { [key: string]: string } = {};

  for (const category of categories) {
    const slug = category.name.toLowerCase().replace(/ /g, "-");

    const existingCategory = await prisma.lessonCategory.findFirst({
      where: {
        OR: [{ name: category.name }, { slug: slug }],
      },
    });

    if (!existingCategory) {
      const newCategory = await prisma.lessonCategory.create({
        data: {
          ...category,
          slug: slug,
        },
      });
      categoryIds[category.name] = newCategory.id;
      console.log(`Categoria criada: ${category.name}`);
    } else {
      categoryIds[category.name] = existingCategory.id;
      console.log(`Categoria já existe: ${category.name}`);
    }
  }

  // VERIFICANDO E CRIANDO USUÁRIO ADMIN
  let adminUser = await prisma.user.findFirst({
    where: { email: "admin@valorant-ascension.com" },
  });

  if (!adminUser) {
    adminUser = await prisma.user.create({
      data: {
        branchId: "main",
        nickname: "Admin",
        email: "admin@valorant-ascension.com",
        role: "ADMIN",
        isActive: true,
        password: "hashed_password_placeholder", // Em produção, use hash real
      },
    });
    console.log("Usuário admin criado");
  } else {
    console.log("Usuário admin já existe");
  }

  // VERIFICANDO E CRIANDO AULAS
  const lessons = [
    {
      title: "Introdução ao Valorant",
      number: 1,
      duration: 10,
      description: "Visão geral do jogo, objetivos e mecânicas básicas",
      categoryId: categoryIds["Valorant Básico"],
      videoUrl: "https://example.com/placeholder-video.mp4",
      thumbnailUrl: "https://example.com/placeholder-thumb.jpg",
    },
    {
      title: "Agentes: Funções e Habilidades",
      number: 2,
      duration: 17,
      description:
        "Guia completo sobre os 4 tipos de agentes e suas habilidades",
      categoryId: categoryIds["Agentes"],
      videoUrl: null, // Sem vídeo inicialmente
      thumbnailUrl: null,
    },
    {
      title: "Mapas: Callouts e Estratégias",
      number: 3,
      duration: 15,
      categoryId: categoryIds["Mapas"],
      videoUrl: "https://example.com/placeholder-video.mp4",
      thumbnailUrl: "https://example.com/placeholder-thumb.jpg",
    },
    {
      title: "Economia do Jogo",
      number: 4,
      duration: 24,
      description:
        "Como gerenciar créditos, compras de equipamentos e economia por rodada",
      categoryId: categoryIds["Estratégia"],
      videoUrl: null,
      thumbnailUrl: null,
    },
    {
      title: "Aim e Controle de Recuo",
      number: 5,
      duration: 16,
      categoryId: categoryIds["Mecânicas"],
      videoUrl: "https://example.com/placeholder-video.mp4",
      thumbnailUrl: "https://example.com/placeholder-thumb.jpg",
    },
  ];

  for (const lesson of lessons) {
    const existingLesson = await prisma.lessons.findFirst({
      where: { title: lesson.title },
    });

    if (!existingLesson) {
      await prisma.lessons.create({
        data: {
          ...lesson,
          createdById: adminUser!.id,
        },
      });
      console.log(`Aula criada: ${lesson.title}`);
    } else {
      console.log(`Aula já existe: ${lesson.title}`);
    }
  }

  // VERIFICANDO E CRIANDO MAPAS DO VALORANT
  const maps = [
    // Mapa 1: Bind
    {
      name: "Bind",
      description: "Mapa com teleportadores e sem área central.",
      imageKey: "maps/bind.jpg",
      minimapUrl: "maps/bind_minimap.png",
      sites: [
        { name: "A", description: "Site A com entrada por short e showers." },
        { name: "B", description: "Site B com entrada por long e hookah." },
      ],
      callouts: [
        { name: "Hookah", description: "Área elevada próxima ao B site." },
        { name: "Showers", description: "Corredor em direção ao site A." },
      ],
      tips: [
        {
          title: "Use o TP criativamente",
          content: "Troque de site rapidamente após um fake.",
        },
      ],
      tutorials: [
        {
          title: "Como dominar Bind",
          url: "https://youtube.com/example_bind",
          type: "VIDEO",
        },
      ],
    },

    // Mapa 2: Haven
    {
      name: "Haven",
      description: "Mapa com três sites e áreas estreitas.",
      imageKey: "maps/haven.jpg",
      minimapUrl: "maps/haven_minimap.png",
      sites: [
        { name: "A", description: "Site A com entrada por heaven e lobby." },
        { name: "B", description: "Site B com entrada por mid e link." },
        { name: "C", description: "Site C com entrada por window e alley." },
      ],
      callouts: [
        { name: "Heaven", description: "Área elevada sobre o site A." },
        { name: "Link", description: "Passagem conectando mid ao site B." },
        { name: "Alley", description: "Corredor lateral próximo ao site C." },
      ],
      tips: [
        {
          title: "Controle os três sites",
          content:
            "Mantenha pressionado em pelo menos dois sites simultaneamente.",
        },
      ],
      tutorials: [
        {
          title: "Estratégias de posicionamento",
          url: "https://youtube.com/example_haven",
          type: "VIDEO",
        },
      ],
    },

    // Mapa 3: Split
    {
      name: "Split",
      description: "Mapa simétrico com duas grandes plataformas.",
      imageKey: "maps/split.jpg",
      minimapUrl: "maps/split_minimap.png",
      sites: [
        { name: "A", description: "Site A com entrada por elbow e kitchen." },
        { name: "B", description: "Site B com entrada por elbow e lobby." },
      ],
      callouts: [
        {
          name: "Elbow",
          description: "Passagem principal conectando mid aos sites.",
        },
        {
          name: "Kitchen",
          description: "Área próxima ao site A com cobertura.",
        },
        {
          name: "Lobby",
          description: "Área de entrada principal para o site B.",
        },
      ],
      tips: [
        {
          title: "Utilize as plataformas",
          content: "Use as plataformas elevadas para visão superior.",
        },
      ],
      tutorials: [
        {
          title: "Controle de mid",
          url: "https://youtube.com/example_split",
          type: "VIDEO",
        },
      ],
    },

    // Mapa 4: Icebox
    {
      name: "Icebox",
      description: "Mapa industrial com ambientes fechados.",
      imageKey: "maps/icebox.jpg",
      minimapUrl: "maps/icebox_minimap.png",
      sites: [
        { name: "A", description: "Site A com entrada por vents e boiler." },
        { name: "B", description: "Site B com entrada por street e truck." },
      ],
      callouts: [
        {
          name: "Vents",
          description: "Passagens de ar condicionado conectando mid aos sites.",
        },
        { name: "Boiler", description: "Área industrial próxima ao site A." },
        { name: "Street", description: "Rua principal de acesso ao site B." },
      ],
      tips: [
        {
          title: "Explore os vents",
          content: "Use os ductos de ar para surpreender inimigos.",
        },
      ],
      tutorials: [
        {
          title: "Controle de ambiente",
          url: "https://youtube.com/example_icebox",
          type: "VIDEO",
        },
      ],
    },

    // Mapa 5: Breeze
    {
      name: "Breeze",
      description: "Mapa tropical com vegetação densa.",
      imageKey: "maps/breeze.jpg",
      minimapUrl: "maps/breeze_minimap.png",
      sites: [
        { name: "A", description: "Site A com entrada por jungle e palace." },
        { name: "B", description: "Site B com entrada por mid e tower." },
      ],
      callouts: [
        { name: "Jungle", description: "Vegetação densa próxima ao site A." },
        {
          name: "Palace",
          description: "Edifício histórico próximo ao site A.",
        },
        { name: "Tower", description: "Torre de vigia próxima ao site B." },
      ],
      tips: [
        {
          title: "Use a vegetação a seu favor",
          content: "Esconda-se nas plantas para emboscadas.",
        },
      ],
      tutorials: [
        {
          title: "Domínio de jungle",
          url: "https://youtube.com/example_breeze",
          type: "VIDEO",
        },
      ],
    },

    // Mapa 6: Fracture
    {
      name: "Fracture",
      description: "Mapa com fissuras e terreno irregular.",
      imageKey: "maps/fracture.jpg",
      minimapUrl: "maps/fracture_minimap.png",
      sites: [
        { name: "A", description: "Site A com entrada por link e party." },
        { name: "B", description: "Site B com entrada por link e kitchen." },
      ],
      callouts: [
        {
          name: "Link",
          description: "Passagem principal conectando mid aos sites.",
        },
        { name: "Party", description: "Área de festa próxima ao site A." },
        {
          name: "Kitchen",
          description: "Cozinha industrial próxima ao site B.",
        },
      ],
      tips: [
        {
          title: "Aproveite as fissuras",
          content: "Use as falhas no chão para esconder-se.",
        },
      ],
      tutorials: [
        {
          title: "Estratégias de positioning",
          url: "https://youtube.com/example_fracture",
          type: "VIDEO",
        },
      ],
    },

    // Mapa 7: Pearl
    {
      name: "Pearl",
      description: "Mapa inspirado em cidades asiáticas.",
      imageKey: "maps/pearl.jpg",
      minimapUrl: "maps/pearl_minimap.png",
      sites: [
        { name: "A", description: "Site A com entrada por cafe e market." },
        { name: "B", description: "Site B com entrada por tea e restaurant." },
      ],
      callouts: [
        { name: "Cafe", description: "Cafeteria próxima ao site A." },
        { name: "Market", description: "Mercado aberto próximo ao site A." },
        { name: "Tea", description: "Loja de chá próxima ao site B." },
        { name: "Restaurant", description: "Restaurante próximo ao site B." },
      ],
      tips: [
        {
          title: "Explorar os interiores",
          content: "Use edifícios altos para visão superior.",
        },
      ],
      tutorials: [
        {
          title: "Controle de cidade",
          url: "https://youtube.com/example_pearl",
          type: "VIDEO",
        },
      ],
    },

    // Mapa 8: Lotus
    {
      name: "Lotus",
      description: "Mapa com jardins e estruturas naturais.",
      imageKey: "maps/lotus.jpg",
      minimapUrl: "maps/lotus_minimap.png",
      sites: [
        { name: "A", description: "Site A com entrada por garden e temple." },
        { name: "B", description: "Site B com entrada por tree e bridge." },
      ],
      callouts: [
        { name: "Garden", description: "Jardim florido próximo ao site A." },
        { name: "Temple", description: "Templo antigo próximo ao site A." },
        { name: "Tree", description: "Árvore gigante próxima ao site B." },
        {
          name: "Bridge",
          description: "Ponte de madeira conectando mid ao site B.",
        },
      ],
      tips: [
        {
          title: "Use as árvores como cobertura",
          content: "Esconda-se atrás das árvores para emboscadas.",
        },
      ],
      tutorials: [
        {
          title: "Domínio de jardins",
          url: "https://youtube.com/example_lotus",
          type: "VIDEO",
        },
      ],
    },

    // Mapa 9: Ascent
    {
      name: "Ascent",
      description: "Mapa com prédios modernos e áreas abertas.",
      imageKey: "maps/ascent.jpg",
      minimapUrl: "maps/ascent_minimap.png",
      sites: [
        { name: "A", description: "Site A com entrada por office e lobby." },
        { name: "B", description: "Site B com entrada por mid e connector." },
      ],
      callouts: [
        {
          name: "Office",
          description: "Escritório corporativo próximo ao site A.",
        },
        {
          name: "Lobby",
          description: "Hall de entrada principal próximo ao site A.",
        },
        {
          name: "Connector",
          description: "Passagem conectando mid ao site B.",
        },
      ],
      tips: [
        {
          title: "Controle os rooftops",
          content: "Use telhados para visão superior e controle de mapa.",
        },
      ],
      tutorials: [
        {
          title: "Estratégias urbanas",
          url: "https://youtube.com/example_ascent",
          type: "VIDEO",
        },
      ],
    },

    // Mapa 10: Sunset
    {
      name: "Sunset",
      description: "Mapa com praia e resort tropical.",
      imageKey: "maps/sunset.jpg",
      minimapUrl: "maps/sunset_minimap.png",
      sites: [
        { name: "A", description: "Site A com entrada por beach e pool." },
        { name: "B", description: "Site B com entrada por mid e cabana." },
      ],
      callouts: [
        {
          name: "Beach",
          description: "Praia de areia branca próxima ao site A.",
        },
        { name: "Pool", description: "Piscina próxima ao site A." },
        { name: "Cabana", description: "Cabana de praia próxima ao site B." },
      ],
      tips: [
        {
          title: "Aproveite a praia",
          content: "Use a areia para esconder-se e emboscar.",
        },
      ],
      tutorials: [
        {
          title: "Controle costeiro",
          url: "https://youtube.com/example_sunset",
          type: "VIDEO",
        },
      ],
    },

    // Mapa 11: Abyss
    {
      name: "Abyss",
      description: "Mapa subaquático com estruturas futuristas.",
      imageKey: "maps/abyss.jpg",
      minimapUrl: "maps/abyss_minimap.png",
      sites: [
        {
          name: "A",
          description: "Site A com entrada por reactor e corridor.",
        },
        { name: "B", description: "Site B com entrada por mid e hatch." },
      ],
      callouts: [
        { name: "Reactor", description: "Reator nuclear próximo ao site A." },
        {
          name: "Corridor",
          description: "Corredor longo conectando mid ao site A.",
        },
        { name: "Hatch", description: "Abertura circular próxima ao site B." },
      ],
      tips: [
        {
          title: "Use as estruturas",
          content: "Esconda-se atrás de equipamentos industriais.",
        },
      ],
      tutorials: [
        {
          title: "Estratégias submarinas",
          url: "https://youtube.com/example_abyss",
          type: "VIDEO",
        },
      ],
    },
  ];

  for (const mapData of maps) {
    const existingMap = await prisma.maps.findUnique({
      where: { name: mapData.name },
    });

    if (!existingMap) {
      await prisma.maps.create({
        data: {
          name: mapData.name,
          description: mapData.description,
          imageKey: mapData.imageKey,
          minimapUrl: mapData.minimapUrl,
          sites: { create: mapData.sites },
        },
      });
      console.log(`Mapa criado: ${mapData.name}`);
    } else {
      console.log(`Mapa já existe: ${mapData.name}`);
    }
  }

  // VERIFICANDO E CRIANDO AGENTES DO VALORANT
  const agents = [
    {
      name: "Brimstone",
      role: "CONTROLLER",
      biography: "Controla zonas com smokes e suporte aéreo.",
      dica: "Use smokes taticamente para bloquear visão.",
      imageKey: "agents/brimstone.png",
      skills: [
        {
          name: "Incendiary",
          key: "Q",
          description: "Lança um granada incendiária que cria uma zona de fogo",
        },
        {
          name: "Sky Smoke",
          key: "E",
          description: "Chama smokes táticos que bloqueiam a visão",
        },
        {
          name: "Stim Beacon",
          key: "C",
          description:
            "Coloca um beacon que concede aumento de velocidade de disparo",
        },
        {
          name: "Orbital Strike",
          key: "X",
          description: "Chama um ataque aéreo devastador em uma localização",
        },
      ],
      strategies: [
        {
          title: "Controle de mapa",
          content: "Use as smokes para dividir o mapa e isolar inimigos",
        },
        {
          title: "Push agressivo",
          content: "Combine Stim Beacon com push da equipe para advantage",
        },
      ],
      tutorials: [
        {
          title: "Posicionamento de smokes",
          type: TutorialType.VIDEO,
          url: "https://youtube.com/watch?v=brimstone-smokes",
        },
        {
          title: "Ultimate eficiente",
          type: TutorialType.GUIDE,
          url: "https://guides.valorant.com/brimstone-ultimate",
        },
      ],
    },
    {
      name: "Viper",
      role: "CONTROLLER",
      biography: "Mapa-denial com disrupção por veneno.",
      dica: "Use Toxic Screen para cortar linhas de visão.",
      imageKey: "agents/viper.png",
      skills: [
        {
          name: "Snake Bite",
          key: "Q",
          description: "Lança um emissor de veneno que cria uma poça de dano",
        },
        {
          name: "Poison Cloud",
          key: "E",
          description: "Lança uma nuvem de veneno que pode ser reativada",
        },
        {
          name: "Toxic Screen",
          key: "C",
          description:
            "Cria uma parede de veneno que bloqueia visão e causa dano",
        },
        {
          name: "Viper's Pit",
          key: "X",
          description:
            "Cria uma grande nuvem de veneno que reduz visão e vida dos inimigos",
        },
      ],
      strategies: [
        {
          title: "Controle de área",
          content: "Use Poison Cloud para bloquear entradas importantes",
        },
        {
          title: "Defesa de site",
          content: "Combine Toxic Screen com Snake Bite para defesa sólida",
        },
      ],
      tutorials: [
        {
          title: "Gerenciamento de combustível",
          type: TutorialType.GUIDE,
          url: "https://guides.valorant.com/viper-fuel-management",
        },
        {
          title: "Posições de Viper's Pit",
          type: TutorialType.VIDEO,
          url: "https://youtube.com/watch?v=viper-ultimate",
        },
      ],
    },
    {
      name: "Omen",
      role: "CONTROLLER",
      biography: "Especialista em teleportar e cegar inimigos.",
      dica: "Surpreenda com Dark Cover de ângulo diferente.",
      imageKey: "agents/omen.png",
      skills: [
        {
          name: "Shrouded Step",
          key: "Q",
          description: "Teleporta-se para uma localização próxima",
        },
        {
          name: "Paranoia",
          key: "E",
          description: "Envia uma sombra que cega todos que toca",
        },
        {
          name: "Dark Cover",
          key: "C",
          description: "Lança uma esfera de sombra que bloqueia a visão",
        },
        {
          name: "From the Shadows",
          key: "X",
          description: "Teleporta-se para qualquer lugar do mapa",
        },
      ],
      strategies: [
        {
          title: "Flanqueamento",
          content: "Use Shrouded Step para posições inesperadas",
        },
        {
          title: "Fake pushes",
          content: "Use From the Shadows para distrair a equipe inimiga",
        },
      ],
      tutorials: [
        {
          title: "Teleportes criativos",
          type: TutorialType.VIDEO,
          url: "https://youtube.com/watch?v=omen-teleports",
        },
        {
          title: "Paranoia eficaz",
          type: TutorialType.GUIDE,
          url: "https://guides.valorant.com/omen-paranoia",
        },
      ],
    },
    {
      name: "Raze",
      role: "DUELIST",
      biography: "Explosiva e destruidora pura.",
      dica: "Use Paint Shells para limpar áreas fechadas.",
      imageKey: "agents/raze.png",
      skills: [
        {
          name: "Boom Bot",
          key: "Q",
          description: "Lança um robô que persegue inimigos e explode",
        },
        {
          name: "Blast Pack",
          key: "E",
          description: "Coloca uma carga explosiva que pode ser detonada",
        },
        {
          name: "Paint Shells",
          key: "C",
          description:
            "Lança uma granada de cluster que explode múltiplas vezes",
        },
        {
          name: "Showstopper",
          key: "X",
          description: "Dispara um lança-mísseis que causa dano massivo",
        },
      ],
      strategies: [
        {
          title: "Entrada explosiva",
          content: "Use Blast Pack para entrar rapidamente em sites",
        },
        {
          title: "Limpeza de áreas",
          content: "Use Boom Bot para limpar corners e áreas fechadas",
        },
      ],
      tutorials: [
        {
          title: "Movimento com Blast Pack",
          type: TutorialType.VIDEO,
          url: "https://youtube.com/watch?v=raze-movement",
        },
        {
          title: "Posicionamento de Showstopper",
          type: TutorialType.GUIDE,
          url: "https://guides.valorant.com/raze-ultimate",
        },
      ],
    },
    {
      name: "Cypher",
      role: "SENTINEL",
      biography: "Especialista em vigilância e armadilhas.",
      dica: "Monitore pontos críticos com Spycam e Trapwire.",
      imageKey: "agents/cypher.png",
      skills: [
        {
          name: "Cyber Cage",
          key: "Q",
          description: "Lança uma gaiola que bloqueia visão e reduz velocidade",
        },
        {
          name: "Spycam",
          key: "E",
          description: "Coloca uma câmera remota para vigilância",
        },
        {
          name: "Trapwire",
          key: "C",
          description: "Coloca um fio trap que revela e prende inimigos",
        },
        {
          name: "Neural Theft",
          key: "X",
          description:
            "Extrai informações de um inimigo morto, revelando localizações",
        },
      ],
      strategies: [
        {
          title: "Setup defensivo",
          content: "Crie uma rede de Trapwires para proteger um site",
        },
        {
          title: "Informação constante",
          content: "Use Spycam para gather informações sem se expor",
        },
      ],
      tutorials: [
        {
          title: "Melhores posições para Trapwire",
          type: TutorialType.VIDEO,
          url: "https://youtube.com/watch?v=cypher-trapwires",
        },
        {
          title: "Uso eficiente de Neural Theft",
          type: TutorialType.GUIDE,
          url: "https://guides.valorant.com/cypher-ultimate",
        },
      ],
    },
    {
      name: "Sage",
      role: "SENTINEL",
      biography: "Curandeira e suporte defensivo.",
      dica: "Sempre tenha Barrier Orb para bloquear entradas.",
      imageKey: "agents/sage.png",
      skills: [
        {
          name: "Barrier Orb",
          key: "Q",
          description: "Cria uma parede sólida que bloqueia passagem",
        },
        {
          name: "Slow Orb",
          key: "E",
          description: "Lança uma orb que cria um campo que reduz velocidade",
        },
        {
          name: "Healing Orb",
          key: "C",
          description: "Cura um aliado ou a si mesma",
        },
        {
          name: "Resurrection",
          key: "X",
          description: "Revive um aliado morto com vida completa",
        },
      ],
      strategies: [
        {
          title: "Defesa de choke points",
          content: "Use Barrier Orb para bloquear entradas importantes",
        },
        {
          title: "Suporte de retake",
          content: "Combine Resurrection com retake para advantage numérico",
        },
      ],
      tutorials: [
        {
          title: "Wall jumps com Barrier Orb",
          type: TutorialType.VIDEO,
          url: "https://youtube.com/watch?v=sage-walls",
        },
        {
          title: "Posicionamento defensivo",
          type: TutorialType.GUIDE,
          url: "https://guides.valorant.com/sage-positioning",
        },
      ],
    },
    {
      name: "Sova",
      role: "INITIATOR",
      biography: "Recon com drones e flechas rastreadoras.",
      dica: "Use Recon Bolt com curva para mapear corners.",
      imageKey: "agents/sova.png",
      skills: [
        {
          name: "Shock Bolt",
          key: "Q",
          description: "Dispara uma flecha explosiva que causa dano",
        },
        {
          name: "Recon Bolt",
          key: "E",
          description: "Dispara uma flecha que revela inimigos próximos",
        },
        {
          name: "Owl Drone",
          key: "C",
          description: "Controla um drone que pode disparar dardos marcadores",
        },
        {
          name: "Hunter's Fury",
          key: "X",
          description: "Dispara três rajadas de energia que atravessam paredes",
        },
      ],
      strategies: [
        {
          title: "Informação inicial",
          content: "Use Recon Bolt no início do round para gather informações",
        },
        {
          title: "Lineups de Shock Dart",
          content: "Aprenda lineups para causar dano através de paredes",
        },
      ],
      tutorials: [
        {
          title: "Lineups de Recon Bolt",
          type: TutorialType.VIDEO,
          url: "https://youtube.com/watch?v=sova-recon",
        },
        {
          title: "Hunter's Fury através de paredes",
          type: TutorialType.GUIDE,
          url: "https://guides.valorant.com/sova-ultimate",
        },
      ],
    },
    {
      name: "Jett",
      role: "DUELIST",
      biography: "Agente ágil e evasiva com mobilidade excepcional.",
      dica: "Use Tailwind para reposicionamento rápido.",
      imageKey: "agents/jett.png",
      skills: [
        {
          name: "Updraft",
          key: "Q",
          description: "Impulsiona-se para cima com jatos de vento",
        },
        {
          name: "Tailwind",
          key: "E",
          description: "Dash instantâneo na direção do movimento",
        },
        {
          name: "Cloudburst",
          key: "C",
          description: "Lança uma fumaça que obscurece a visão",
        },
        {
          name: "Blade Storm",
          key: "X",
          description: "Equipa múltiplas facas precisas e letais",
        },
      ],
      strategies: [
        {
          title: "Entrada agressiva",
          content: "Use Tailwind para entrar rapidamente em sites",
        },
        {
          title: "Reposicionamento",
          content: "Combine Updraft com Tailwind para escapes criativos",
        },
      ],
      tutorials: [
        {
          title: "Movimento avançado com Jett",
          type: TutorialType.VIDEO,
          url: "https://youtube.com/watch?v=jett-movement",
        },
        {
          title: "Blade Storm precisão",
          type: TutorialType.GUIDE,
          url: "https://guides.valorant.com/jett-ultimate",
        },
      ],
    },
    {
      name: "Phoenix",
      role: "DUELIST",
      biography: "Especialista em auto-sustentação e entrada.",
      dica: "Use Curve Ball para cegar antes de entrar.",
      imageKey: "agents/phoenix.png",
      skills: [
        {
          name: "Curve Ball",
          key: "Q",
          description: "Lança uma bola de luz que cega ao explodir",
        },
        {
          name: "Hot Hands",
          key: "E",
          description: "Lança uma bola de fogo que cura Phoenix",
        },
        {
          name: "Blaze",
          key: "C",
          description: "Cria uma parede de fogo que bloqueia visão e cura",
        },
        {
          name: "Run it Back",
          key: "X",
          description: "Marca uma posição para retornar após a morte",
        },
      ],
      strategies: [
        {
          title: "Entrada com flash",
          content: "Use Curve Ball para cegar antes de entrar em sites",
        },
        {
          title: "Auto-sustentação",
          content: "Use Hot Hands e Blaze para se curar durante o combate",
        },
      ],
      tutorials: [
        {
          title: "Flash eficiente com Curve Ball",
          type: TutorialType.VIDEO,
          url: "https://youtube.com/watch?v=phoenix-flash",
        },
        {
          title: "Run it Back estratégico",
          type: TutorialType.GUIDE,
          url: "https://guides.valorant.com/phoenix-ultimate",
        },
      ],
    },
    {
      name: "Reyna",
      role: "DUELIST",
      biography: "Vampira que se alimenta de eliminações.",
      dica: "Use Devour após eliminações para se curar.",
      imageKey: "agents/reyna.png",
      skills: [
        {
          name: "Devour",
          key: "Q",
          description: "Consome uma alma para se curar rapidamente",
        },
        {
          name: "Dismiss",
          key: "E",
          description: "Consome uma alma para se tornar intangível",
        },
        {
          name: "Leer",
          key: "C",
          description: "Lança um olho que cega todos que olham para ele",
        },
        {
          name: "Empress",
          key: "X",
          description: "Entra em modo frenético com aumento de velocidade",
        },
      ],
      strategies: [
        {
          title: "Agressão sustentada",
          content: "Use Devour para manter pressão após eliminações",
        },
        {
          title: "Escape com Dismiss",
          content: "Use Dismiss para escapar de situações perigosas",
        },
      ],
      tutorials: [
        {
          title: "Combos com Reyna",
          type: TutorialType.VIDEO,
          url: "https://youtube.com/watch?v=reyna-combos",
        },
        {
          title: "Empress timing",
          type: TutorialType.GUIDE,
          url: "https://guides.valorant.com/reyna-ultimate",
        },
      ],
    },
    {
      name: "Killjoy",
      role: "SENTINEL",
      biography: "Engenheira que controla o campo com dispositivos.",
      dica: "Posicione Alarmbot em locais estratégicos.",
      imageKey: "agents/killjoy.png",
      skills: [
        {
          name: "Alarmbot",
          key: "Q",
          description: "Coloca um bot que persegue e explode em inimigos",
        },
        {
          name: "Turret",
          key: "E",
          description: "Coloca uma torre que atira automaticamente",
        },
        {
          name: "Nanoswarm",
          key: "C",
          description: "Coloca uma granada explosiva camuflada",
        },
        {
          name: "Lockdown",
          key: "X",
          description: "Dispositivo que detém todos os inimigos na área",
        },
      ],
      strategies: [
        {
          title: "Setup defensivo",
          content: "Crie uma rede de dispositivos para proteger sites",
        },
        {
          title: "Retake com Lockdown",
          content: "Use Lockdown para facilitar retakes de sites",
        },
      ],
      tutorials: [
        {
          title: "Setup de Killjoy",
          type: TutorialType.VIDEO,
          url: "https://youtube.com/watch?v=killjoy-setup",
        },
        {
          title: "Posicionamento de dispositivos",
          type: TutorialType.GUIDE,
          url: "https://guides.valorant.com/killjoy-devices",
        },
      ],
    },
    {
      name: "Breach",
      role: "INITIATOR",
      biography: "Especialista em stuns e disrupção.",
      dica: "Use Flashpoint para cegar através de paredes.",
      imageKey: "agents/breach.png",
      skills: [
        {
          name: "Flashpoint",
          key: "Q",
          description: "Dispara um flash que cega através de paredes",
        },
        {
          name: "Fault Line",
          key: "E",
          description: "Causa tremor que atordoa inimigos em linha",
        },
        {
          name: "Aftershock",
          key: "C",
          description: "Causa dano em área após um delay",
        },
        {
          name: "Rolling Thunder",
          key: "X",
          description: "Causa tremor massivo que atordoa toda a área",
        },
      ],
      strategies: [
        {
          title: "Disrupção de defesa",
          content: "Use stuns para quebrar setups defensivos",
        },
        {
          title: "Coordenação de equipe",
          content: "Coordene stuns com push da equipe",
        },
      ],
      tutorials: [
        {
          title: "Flash através de paredes",
          type: TutorialType.VIDEO,
          url: "https://youtube.com/watch?v=breach-flash",
        },
        {
          title: "Rolling Thunder eficiente",
          type: TutorialType.GUIDE,
          url: "https://guides.valorant.com/breach-ultimate",
        },
      ],
    },
    {
      name: "Skye",
      role: "INITIATOR",
      biography: "Especialista em reconhecimento e cura.",
      dica: "Use Trailblazer para scouting seguro.",
      imageKey: "agents/skye.png",
      skills: [
        {
          name: "Trailblazer",
          key: "Q",
          description: "Controla um tigre que pode atordoar inimigos",
        },
        {
          name: "Guiding Light",
          key: "E",
          description: "Lança um falcão que pode cegar inimigos",
        },
        {
          name: "Regrowth",
          key: "C",
          description: "Cura aliados na área (não se cura)",
        },
        {
          name: "Seekers",
          key: "X",
          description: "Envia três seekers que atordoam inimigos próximos",
        },
      ],
      strategies: [
        {
          title: "Informação constante",
          content: "Use Trailblazer e Guiding Light para gather informações",
        },
        {
          title: "Suporte de cura",
          content: "Use Regrowth para manter a equipe saudável",
        },
      ],
      tutorials: [
        {
          title: "Scouting com Skye",
          type: TutorialType.VIDEO,
          url: "https://youtube.com/watch?v=skye-scouting",
        },
        {
          title: "Seekers timing",
          type: TutorialType.GUIDE,
          url: "https://guides.valorant.com/skye-ultimate",
        },
      ],
    },
    {
      name: "Yoru",
      role: "DUELIST",
      biography: "Especialista em furtividade e decepção.",
      dica: "Use Gatecrash para flanqueamentos inesperados.",
      imageKey: "agents/yoru.png",
      skills: [
        {
          name: "Blindside",
          key: "Q",
          description: "Lança um flash que rebate em superfícies",
        },
        {
          name: "Gatecrash",
          key: "E",
          description: "Lança um portal que pode ser ativado para teleporte",
        },
        {
          name: "Fakeout",
          key: "C",
          description: "Cria um clone que imita seus passos",
        },
        {
          name: "Dimensional Drift",
          key: "X",
          description: "Torna-se invisível e intangível temporariamente",
        },
      ],
      strategies: [
        {
          title: "Flanqueamento furtivo",
          content: "Use Gatecrash para posições inesperadas",
        },
        {
          title: "Decepção com Fakeout",
          content: "Use Fakeout para confundir a defesa inimiga",
        },
      ],
      tutorials: [
        {
          title: "Teleportes com Yoru",
          type: TutorialType.VIDEO,
          url: "https://youtube.com/watch?v=yoru-teleports",
        },
        {
          title: "Dimensional Drift estratégico",
          type: TutorialType.GUIDE,
          url: "https://guides.valorant.com/yoru-ultimate",
        },
      ],
    },
    {
      name: "Astra",
      role: "CONTROLLER",
      biography: "Controla o campo com constelações astrais.",
      dica: "Use Stars para criar smokes e stuns dinâmicos.",
      imageKey: "agents/astra.png",
      skills: [
        {
          name: "Nova Pulse",
          key: "Q",
          description: "Ativa uma Star para causar concussão",
        },
        {
          name: "Nebula",
          key: "E",
          description: "Ativa uma Star para criar uma smoke",
        },
        {
          name: "Gravity Well",
          key: "C",
          description: "Ativa uma Star para puxar inimigos para o centro",
        },
        {
          name: "Astral Form",
          key: "X",
          description: "Coloca Stars no mapa para uso posterior",
        },
      ],
      strategies: [
        {
          title: "Controle dinâmico",
          content: "Use Stars para adaptar o controle conforme necessário",
        },
        {
          title: "Setup pré-round",
          content: "Coloque Stars estrategicamente antes do round",
        },
      ],
      tutorials: [
        {
          title: "Gerenciamento de Stars",
          type: TutorialType.VIDEO,
          url: "https://youtube.com/watch?v=astra-stars",
        },
        {
          title: "Astral Form eficiente",
          type: TutorialType.GUIDE,
          url: "https://guides.valorant.com/astra-ultimate",
        },
      ],
    },
    {
      name: "KAY/O",
      role: "INITIATOR",
      biography: "Especialista em supressão de habilidades.",
      dica: "Use ZERO/point para revelar posições inimigas.",
      imageKey: "agents/kayo.png",
      skills: [
        {
          name: "FLASH/drive",
          key: "Q",
          description: "Lança um flash que pode ser detonado manualmente",
        },
        {
          name: "ZERO/point",
          key: "E",
          description: "Lança uma lâmina que suprime habilidades inimigas",
        },
        {
          name: "FRAG/ment",
          key: "C",
          description: "Lança uma granada que explode múltiplas vezes",
        },
        {
          name: "NULL/cmd",
          key: "X",
          description: "Suprime todas as habilidades inimigas na área",
        },
      ],
      strategies: [
        {
          title: "Supressão de habilidades",
          content: "Use ZERO/point para negar habilidades inimigas",
        },
        {
          title: "Informação com flash",
          content: "Use FLASH/drive para gather informações seguras",
        },
      ],
      tutorials: [
        {
          title: "Supressão com KAY/O",
          type: TutorialType.VIDEO,
          url: "https://youtube.com/watch?v=kayo-suppression",
        },
        {
          title: "NULL/cmd timing",
          type: TutorialType.GUIDE,
          url: "https://guides.valorant.com/kayo-ultimate",
        },
      ],
    },
    {
      name: "Chamber",
      role: "SENTINEL",
      biography: "Armeiro francês com dispositivos de precisão.",
      dica: "Use Headhunter para economia de créditos.",
      imageKey: "agents/chamber.png",
      skills: [
        {
          name: "Headhunter",
          key: "Q",
          description: "Equipa uma pistola pesada de precisão",
        },
        {
          name: "Rendezvous",
          key: "E",
          description: "Coloca dois teleportes para movimento rápido",
        },
        {
          name: "Trademark",
          key: "C",
          description: "Coloca uma armadilha que reduz velocidade",
        },
        {
          name: "Tour De Force",
          key: "X",
          description: "Equipa um sniper pesado que mata com um tiro",
        },
      ],
      strategies: [
        {
          title: "Economia de créditos",
          content: "Use Headhunter para economizar em rounds de eco",
        },
        {
          title: "Posicionamento com teleportes",
          content: "Use Rendezvous para reposicionamento tático",
        },
      ],
      tutorials: [
        {
          title: "Precisão com Chamber",
          type: TutorialType.VIDEO,
          url: "https://youtube.com/watch?v=chamber-precision",
        },
        {
          title: "Tour De Force posicionamento",
          type: TutorialType.GUIDE,
          url: "https://guides.valorant.com/chamber-ultimate",
        },
      ],
    },
    {
      name: "Neon",
      role: "DUELIST",
      biography: "Agente filipina com velocidade elétrica.",
      dica: "Use Fast Lane para criar corredores seguros.",
      imageKey: "agents/neon.png",
      skills: [
        {
          name: "Relay Bolt",
          key: "Q",
          description: "Lança um projétil que ricocheteia e atordoa",
        },
        {
          name: "Fast Lane",
          key: "E",
          description: "Cria duas paredes de energia para movimento rápido",
        },
        {
          name: "High Gear",
          key: "C",
          description: "Ativa corrida elétrica com slide",
        },
        {
          name: "Overdrive",
          key: "X",
          description: "Dispara um raio elétrico contínuo e preciso",
        },
      ],
      strategies: [
        {
          title: "Entrada com velocidade",
          content: "Use Fast Lane para entrar rapidamente em sites",
        },
        {
          title: "Mobilidade elétrica",
          content: "Combine High Gear com Fast Lane para movimento rápido",
        },
      ],
      tutorials: [
        {
          title: "Movimento com Neon",
          type: TutorialType.VIDEO,
          url: "https://youtube.com/watch?v=neon-movement",
        },
        {
          title: "Overdrive precisão",
          type: TutorialType.GUIDE,
          url: "https://guides.valorant.com/neon-ultimate",
        },
      ],
    },
    {
      name: "Fade",
      role: "INITIATOR",
      biography: "Caçadora turca que revela segredos.",
      dica: "Use Seize para prender inimigos em posições.",
      imageKey: "agents/fade.png",
      skills: [
        {
          name: "Seize",
          key: "Q",
          description: "Lança uma orb que prende inimigos no local",
        },
        {
          name: "Haunt",
          key: "E",
          description: "Lança um orb que revela inimigos próximos",
        },
        {
          name: "Prowler",
          key: "C",
          description: "Lança uma criatura que persegue e revela inimigos",
        },
        {
          name: "Nightfall",
          key: "X",
          description: "Causa surdez e revela rastros de inimigos",
        },
      ],
      strategies: [
        {
          title: "Revelação constante",
          content: "Use Haunt e Prowler para gather informações",
        },
        {
          title: "Controle com Seize",
          content: "Use Seize para prender inimigos em posições vulneráveis",
        },
      ],
      tutorials: [
        {
          title: "Revelação com Fade",
          type: TutorialType.VIDEO,
          url: "https://youtube.com/watch?v=fade-revelation",
        },
        {
          title: "Nightfall estratégico",
          type: TutorialType.GUIDE,
          url: "https://guides.valorant.com/fade-ultimate",
        },
      ],
    },
    {
      name: "Harbor",
      role: "CONTROLLER",
      biography: "Controlador indiano com domínio da água.",
      dica: "Use Cove para criar cobertura móvel.",
      imageKey: "agents/harbor.png",
      skills: [
        {
          name: "Cove",
          key: "Q",
          description: "Lança uma smoke esférica que pode ser movida",
        },
        {
          name: "High Tide",
          key: "E",
          description: "Cria uma parede de água que pode ser curvada",
        },
        {
          name: "Reckoning",
          key: "C",
          description: "Cria geysers que atordoa inimigos na área",
        },
        {
          name: "Reckoning",
          key: "X",
          description: "Cria geysers que atordoa inimigos na área",
        },
      ],
      strategies: [
        {
          title: "Controle móvel",
          content: "Use Cove para criar cobertura que se move com você",
        },
        {
          title: "Paredes dinâmicas",
          content: "Use High Tide para criar paredes que se adaptam",
        },
      ],
      tutorials: [
        {
          title: "Controle com Harbor",
          type: TutorialType.VIDEO,
          url: "https://youtube.com/watch?v=harbor-control",
        },
        {
          title: "Reckoning timing",
          type: TutorialType.GUIDE,
          url: "https://guides.valorant.com/harbor-ultimate",
        },
      ],
    },
    {
      name: "Gekko",
      role: "INITIATOR",
      biography: "Agente americano com criaturas bio-mecânicas.",
      dica: "Use Wingman para informações e dano.",
      imageKey: "agents/gekko.png",
      skills: [
        {
          name: "Wingman",
          key: "Q",
          description: "Lança uma criatura que pode cegar ou causar dano",
        },
        {
          name: "Dizzy",
          key: "E",
          description: "Lança uma criatura que cega inimigos",
        },
        {
          name: "Mosh Pit",
          key: "C",
          description: "Lança uma criatura que explode em área",
        },
        {
          name: "Thrash",
          key: "X",
          description: "Lança uma criatura que atordoa e pode ser detonada",
        },
      ],
      strategies: [
        {
          title: "Informação com criaturas",
          content: "Use Wingman e Dizzy para gather informações",
        },
        {
          title: "Controle de área",
          content: "Use Mosh Pit para controlar áreas específicas",
        },
      ],
      tutorials: [
        {
          title: "Criaturas de Gekko",
          type: TutorialType.VIDEO,
          url: "https://youtube.com/watch?v=gekko-creatures",
        },
        {
          title: "Thrash estratégico",
          type: TutorialType.GUIDE,
          url: "https://guides.valorant.com/gekko-ultimate",
        },
      ],
    },
    {
      name: "Deadlock",
      role: "SENTINEL",
      biography: "Sentinela norueguesa com dispositivos de contenção.",
      dica: "Use Sonic Sensor para detectar movimento.",
      imageKey: "agents/deadlock.png",
      skills: [
        {
          name: "Sonic Sensor",
          key: "Q",
          description: "Coloca um sensor que detecta movimento e atordoa",
        },
        {
          name: "Barrier Mesh",
          key: "E",
          description: "Lança uma rede que cria uma barreira sólida",
        },
        {
          name: "GravNet",
          key: "C",
          description: "Lança uma granada que prende inimigos no local",
        },
        {
          name: "Annihilation",
          key: "X",
          description: "Dispara um cristal que prende e puxa inimigos",
        },
      ],
      strategies: [
        {
          title: "Detecção de movimento",
          content: "Use Sonic Sensor para detectar pushes inimigos",
        },
        {
          title: "Contenção de área",
          content: "Use GravNet e Barrier Mesh para controlar áreas",
        },
      ],
      tutorials: [
        {
          title: "Sensores de Deadlock",
          type: TutorialType.VIDEO,
          url: "https://youtube.com/watch?v=deadlock-sensors",
        },
        {
          title: "Annihilation precisão",
          type: TutorialType.GUIDE,
          url: "https://guides.valorant.com/deadlock-ultimate",
        },
      ],
    },
    {
      name: "Iso",
      role: "DUELIST",
      biography: "Duelista chinês com habilidades de contra-ataque.",
      dica: "Use Undercut para negar habilidades inimigas.",
      imageKey: "agents/iso.png",
      skills: [
        {
          name: "Undercut",
          key: "Q",
          description: "Lança uma granada que nega habilidades inimigas",
        },
        {
          name: "Contingency",
          key: "E",
          description: "Cria um campo que bloqueia dano de uma direção",
        },
        {
          name: "Kill Contract",
          key: "C",
          description: "Marca um inimigo para ganhar vantagem em combate",
        },
        {
          name: "Kill Contract",
          key: "X",
          description: "Marca um inimigo para ganhar vantagem em combate",
        },
      ],
      strategies: [
        {
          title: "Negação de habilidades",
          content: "Use Undercut para negar habilidades inimigas",
        },
        {
          title: "Contra-ataque",
          content: "Use Contingency para bloquear dano e contra-atacar",
        },
      ],
      tutorials: [
        {
          title: "Contra-ataque com Iso",
          type: TutorialType.VIDEO,
          url: "https://youtube.com/watch?v=iso-counter",
        },
        {
          title: "Kill Contract estratégico",
          type: TutorialType.GUIDE,
          url: "https://guides.valorant.com/iso-ultimate",
        },
      ],
    },
    {
      name: "Clove",
      role: "CONTROLLER",
      biography: "Controlador escocês com habilidades de vida e morte.",
      dica: "Use Pick-Me-Up para se curar após eliminações.",
      imageKey: "agents/clove.png",
      skills: [
        {
          name: "Pick-Me-Up",
          key: "Q",
          description: "Consome uma alma para se curar",
        },
        {
          name: "Ruse",
          key: "E",
          description: "Lança uma smoke que pode ser reativada",
        },
        {
          name: "Meddle",
          key: "C",
          description: "Lança uma orb que causa vulnerabilidade",
        },
        {
          name: "Not Dead Yet",
          key: "X",
          description: "Pode se reviver temporariamente após a morte",
        },
      ],
      strategies: [
        {
          title: "Sustentação com cura",
          content: "Use Pick-Me-Up para se manter vivo em combates",
        },
        {
          title: "Controle com vulnerabilidade",
          content: "Use Meddle para facilitar eliminações da equipe",
        },
      ],
      tutorials: [
        {
          title: "Sustentação com Clove",
          type: TutorialType.VIDEO,
          url: "https://youtube.com/watch?v=clove-sustain",
        },
        {
          title: "Not Dead Yet timing",
          type: TutorialType.GUIDE,
          url: "https://guides.valorant.com/clove-ultimate",
        },
      ],
    },
  ];

  // Primeiro, vamos buscar os IDs dos roles
  const duelistRole = await prisma.agentRoles.findUnique({
    where: { slug: "duelist" },
  });
  const initiatorRole = await prisma.agentRoles.findUnique({
    where: { slug: "initiator" },
  });
  const controllerRole = await prisma.agentRoles.findUnique({
    where: { slug: "controller" },
  });
  const sentinelRole = await prisma.agentRoles.findUnique({
    where: { slug: "sentinel" },
  });

  if (!duelistRole || !initiatorRole || !controllerRole || !sentinelRole) {
    throw new Error(
      "Roles não encontrados. Execute o seed dos roles primeiro.",
    );
  }

  for (const agentData of agents) {
    const existingAgent = await prisma.agents.findUnique({
      where: { name: agentData.name },
    });

    if (!existingAgent) {
      // Determinar o roleId baseado no role do agente
      let roleId: string;
      switch (agentData.role) {
        case "DUELIST":
          roleId = duelistRole.id;
          break;
        case "INITIATOR":
          roleId = initiatorRole.id;
          break;
        case "CONTROLLER":
          roleId = controllerRole.id;
          break;
        case "SENTINEL":
          roleId = sentinelRole.id;
          break;
        default:
          throw new Error(`Role inválido: ${agentData.role}`);
      }

      await prisma.agents.create({
        data: {
          name: agentData.name,
          roleId: roleId,
          biography: agentData.biography,
          dica: agentData.dica,
          imageKey: agentData.imageKey,
          skills: { create: agentData.skills },
          strategies: { create: agentData.strategies },
          tutorials: { create: agentData.tutorials },
        },
      });
      console.log(`Agente criado: ${agentData.name}`);
    } else {
      console.log(`Agente já existe: ${agentData.name}`);
    }
  }

  console.log("Verificação e seed finalizada!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => await prisma.$disconnect());
