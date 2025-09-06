// prisma/seed.ts
import {
  PrismaClient,
  UserRole,
  LessonLevel,
  TutorialType,
} from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  try {
    console.log("🔍 Verificando estado atual do banco de dados...");

    // Verifica todas as tabelas principais
    const existingCounts = await Promise.all([
      prisma.user.count(),
      prisma.lessonCategory.count(),
      prisma.lessons.count(),
      prisma.subscription.count(),
      prisma.agents.count(),
      prisma.agentRoles.count(),
      prisma.maps.count(),
      prisma.achievements.count(),
    ]);

    const [
      userCount,
      categoryCount,
      lessonCount,
      subscriptionCount,
      agentCount,
      agentRoleCount,
      mapCount,
      achievementCount,
    ] = existingCounts;

    console.log("\n📊 Estado atual do banco:");
    console.log(`- Usuários: ${userCount}`);
    console.log(`- Categorias: ${categoryCount}`);
    console.log(`- Aulas: ${lessonCount}`);
    console.log(`- Assinaturas: ${subscriptionCount}`);
    console.log(`- Agentes: ${agentCount}`);
    console.log(`- Roles de Agentes: ${agentRoleCount}`);
    console.log(`- Mapas: ${mapCount}`);
    console.log(`- Conquistas: ${achievementCount}\n`);

    if (userCount > 0 || categoryCount > 0 || lessonCount > 0) {
      console.log("⚠️  ATENÇÃO: Já existem dados no banco!");
      console.log("✨ Continuando com o seed para dados faltantes...\n");
    }

    // ========================================
    // 1. CRIAR USUÁRIOS
    // ========================================
    console.log("🌱 Iniciando seed de usuários...");

    const usersToCreate = [
      {
        nickname: "Zé do Ponto",
        role: UserRole.CUSTOMER,
        email: "ze@academy.com",
        password:
          "$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWGw.xkY6gHfz8yqJlNvBmXpRtUoIaSdFgHjK",
        isActive: true,
        branchId: "branch-1",
      },
      {
        nickname: "Léo Tático",
        role: UserRole.PROFESSIONAL,
        email: "leo@academy.com",
        password:
          "$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWGw.xkY6gHfz8yqJlNvBmXpRtUoIaSdFgHjK",
        isActive: true,
        branchId: "branch-1",
      },
      {
        nickname: "Ana Pro",
        role: UserRole.ADMIN,
        email: "ana@academy.com",
        password:
          "$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWGw.xkY6gHfz8yqJlNvBmXpRtUoIaSdFgHjK",
        isActive: true,
        branchId: "branch-1",
      },
      {
        nickname: "Carlos Coach",
        role: UserRole.PROFESSIONAL,
        email: "carlos@academy.com",
        password:
          "$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWGw.xkY6gHfz8yqJlNvBmXpRtUoIaSdFgHjK",
        isActive: true,
        branchId: "branch-1",
      },
    ];

    const createdUsers: Record<string, string> = {};

    for (const userData of usersToCreate) {
      const existingUser = await prisma.user.findUnique({
        where: { email: userData.email },
      });

      if (existingUser) {
        console.log(`✅ Usuário ${userData.nickname} já existe`);
        createdUsers[userData.email] = existingUser.id;
        continue;
      }

      try {
        const user = await prisma.user.create({ data: userData });
        createdUsers[userData.email] = user.id;
        console.log(`✅ Usuário criado: ${userData.nickname}`);
      } catch (error) {
        console.error(`❌ Erro ao criar usuário ${userData.nickname}:`, error);
      }
    }

    // ========================================
    // 2. CRIAR ROLES DE AGENTES
    // ========================================
    console.log("\n🎭 Criando roles de agentes...");

    const agentRolesData = [
      {
        name: "Duelista",
        slug: "duelista",
        description: "Agentes especializados em eliminar inimigos",
        iconUrl: "⚔️",
        color: "#FF6B6B",
      },
      {
        name: "Iniciador",
        slug: "iniciador",
        description: "Agentes que preparam o terreno para o time",
        iconUrl: "🚀",
        color: "#4ECDC4",
      },
      {
        name: "Controlador",
        slug: "controlador",
        description: "Agentes que controlam áreas do mapa",
        iconUrl: "🎯",
        color: "#45B7D1",
      },
      {
        name: "Sentinela",
        slug: "sentinela",
        description: "Agentes defensivos e de suporte",
        iconUrl: "🛡️",
        color: "#96CEB4",
      },
    ];

    const createdAgentRoles: Record<string, string> = {};

    for (const roleData of agentRolesData) {
      const existingRole = await prisma.agentRoles.findUnique({
        where: { slug: roleData.slug },
      });

      if (existingRole) {
        createdAgentRoles[roleData.slug] = existingRole.id;
        console.log(`✅ Role ${roleData.name} já existe`);
        continue;
      }

      try {
        const role = await prisma.agentRoles.create({ data: roleData });
        createdAgentRoles[roleData.slug] = role.id;
        console.log(`✅ Role criada: ${roleData.name}`);
      } catch (error) {
        console.error(`❌ Erro ao criar role ${roleData.name}:`, error);
      }
    }

    // ========================================
    // 3. CRIAR AGENTES
    // ========================================
    console.log("\n👤 Criando agentes...");

    const agentsData = [
      {
        name: "Jett",
        roleId: createdAgentRoles["duelista"],
        biography: "Agente ágil e letal da Coreia do Sul",
        dica: "Use o Ouvido para reposicionar rapidamente",
        imageKey: "jett.jpg",
      },
      {
        name: "Phoenix",
        roleId: createdAgentRoles["duelista"],
        biography: "Agente britânico com habilidades de fogo",
        dica: "Combine flash com habilidades de fogo",
        imageKey: "phoenix.jpg",
      },
      {
        name: "Sage",
        roleId: createdAgentRoles["sentinela"],
        biography: "Agente de suporte com habilidades de cura",
        dica: "Use a parede para bloquear rotas",
        imageKey: "sage.jpg",
      },
      {
        name: "Sova",
        roleId: createdAgentRoles["iniciador"],
        biography: "Caçador russo com visão aguçada",
        dica: "Use a flecha para revelar posições inimigas",
        imageKey: "sova.jpg",
      },
      {
        name: "Omen",
        roleId: createdAgentRoles["controlador"],
        biography: "Agente sombrio com teleporte",
        dica: "Use smoke para controlar visão",
        imageKey: "omen.jpg",
      },
    ];

    const createdAgents: Record<string, string> = {};

    for (const agentData of agentsData) {
      const existingAgent = await prisma.agents.findUnique({
        where: { name: agentData.name },
      });

      if (existingAgent) {
        createdAgents[agentData.name] = existingAgent.id;
        console.log(`✅ Agente ${agentData.name} já existe`);
        continue;
      }

      try {
        const agent = await prisma.agents.create({ data: agentData });
        createdAgents[agentData.name] = agent.id;
        console.log(`✅ Agente criado: ${agentData.name}`);
      } catch (error) {
        console.error(`❌ Erro ao criar agente ${agentData.name}:`, error);
      }
    }

    // ========================================
    // 4. CRIAR HABILIDADES DOS AGENTES
    // ========================================
    console.log("\n⚡ Criando habilidades dos agentes...");

    const agentSkillsData = [
      // Jett
      {
        agentId: createdAgents["Jett"],
        name: "Ouvido",
        key: "Q",
        description: "Reposicionamento rápido em direção ao movimento",
        iconUrl: "💨",
      },
      {
        agentId: createdAgents["Jett"],
        name: "Corrente Ascendente",
        key: "E",
        description: "Eleva Jett para posições altas",
        iconUrl: "⬆️",
      },
      // Phoenix
      {
        agentId: createdAgents["Phoenix"],
        name: "Curva de Fogo",
        key: "Q",
        description: "Projétil de fogo que curva",
        iconUrl: "🔥",
      },
      {
        agentId: createdAgents["Phoenix"],
        name: "Mãos Quentes",
        key: "E",
        description: "Cria uma parede de fogo",
        iconUrl: "🔥",
      },
      // Sage
      {
        agentId: createdAgents["Sage"],
        name: "Parede de Gelo",
        key: "Q",
        description: "Cria uma barreira de gelo",
        iconUrl: "🧊",
      },
      {
        agentId: createdAgents["Sage"],
        name: "Orbe de Cura",
        key: "E",
        description: "Cura aliados ou a si mesma",
        iconUrl: "💚",
      },
    ];

    for (const skillData of agentSkillsData) {
      try {
        await prisma.agentSkill.create({ data: skillData });
        console.log(
          `✅ Habilidade criada: ${skillData.name} (${skillData.key})`,
        );
      } catch (error) {
        console.error(`❌ Erro ao criar habilidade ${skillData.name}:`, error);
      }
    }

    // ========================================
    // 5. CRIAR MAPAS
    // ========================================
    console.log("\n🗺️ Criando mapas...");

    const mapsData = [
      {
        name: "Bind",
        description: "Mapa com duas sites conectadas por teleportes",
        imageKey: "bind.jpg",
        minimapUrl: "bind-minimap.jpg",
      },
      {
        name: "Haven",
        description: "Mapa com três sites para ataque",
        imageKey: "haven.jpg",
        minimapUrl: "haven-minimap.jpg",
      },
      {
        name: "Split",
        description: "Mapa vertical com duas sites",
        imageKey: "split.jpg",
        minimapUrl: "split-minimap.jpg",
      },
      {
        name: "Ascent",
        description: "Mapa com site A elevada e site B aberta",
        imageKey: "ascent.jpg",
        minimapUrl: "ascent-minimap.jpg",
      },
      {
        name: "Icebox",
        description: "Mapa com múltiplas rotas e posições elevadas",
        imageKey: "icebox.jpg",
        minimapUrl: "icebox-minimap.jpg",
      },
    ];

    const createdMaps: Record<string, string> = {};

    for (const mapData of mapsData) {
      const existingMap = await prisma.maps.findUnique({
        where: { name: mapData.name },
      });

      if (existingMap) {
        createdMaps[mapData.name] = existingMap.id;
        console.log(`✅ Mapa ${mapData.name} já existe`);
        continue;
      }

      try {
        const map = await prisma.maps.create({ data: mapData });
        createdMaps[mapData.name] = map.id;
        console.log(`✅ Mapa criado: ${mapData.name}`);
      } catch (error) {
        console.error(`❌ Erro ao criar mapa ${mapData.name}:`, error);
      }
    }

    // ========================================
    // 6. CRIAR SITES DOS MAPAS
    // ========================================
    console.log("\n📍 Criando sites dos mapas...");

    const mapSitesData = [
      // Bind
      {
        mapId: createdMaps["Bind"],
        name: "Site A",
        description: "Site com múltiplas rotas de entrada",
      },
      {
        mapId: createdMaps["Bind"],
        name: "Site B",
        description: "Site com teleporte para mid",
      },
      // Haven
      {
        mapId: createdMaps["Haven"],
        name: "Site A",
        description: "Site com entrada principal e rotas laterais",
      },
      {
        mapId: createdMaps["Haven"],
        name: "Site B",
        description: "Site com entrada direta e rotas flanqueantes",
      },
      {
        mapId: createdMaps["Haven"],
        name: "Site C",
        description: "Site com entrada única e posições defensivas",
      },
    ];

    for (const siteData of mapSitesData) {
      try {
        await prisma.mapSites.create({ data: siteData });
        console.log(`✅ Site criado: ${siteData.name}`);
      } catch (error) {
        console.error(`❌ Erro ao criar site ${siteData.name}:`, error);
      }
    }

    // ========================================
    // 7. CRIAR CATEGORIAS DE AULAS
    // ========================================
    console.log("\n🎯 Criando categorias de aulas...");

    const categoriesData = [
      {
        name: "Táticas Avançadas",
        description:
          "Aprenda estratégias de equipe, posicionamento e controle de mapa",
        icon: "🎯",
        level: LessonLevel.INTERMEDIARIO,
        slug: "taticas-avancadas",
      },
      {
        name: "Mapas e Rotas",
        description:
          "Domine os mapas de Valorant com rotas seguras e posições estratégicas",
        icon: "🗺️",
        level: LessonLevel.INICIANTE,
        slug: "mapas-e-rotas",
      },
      {
        name: "Agentes e Habilidades",
        description:
          "Conheça os agentes, suas habilidades e como usá-los no combate",
        icon: "👤",
        level: LessonLevel.INICIANTE,
        slug: "agentes-e-habilidades",
      },
      {
        name: "Dribles e Combate",
        description:
          "Melhore sua mira, movimentação e uso de habilidades em combate",
        icon: "⚔️",
        level: LessonLevel.AVANCADO,
        slug: "dribles-e-combate",
      },
      {
        name: "Estratégia de Equipe",
        description: "Como jogar em equipe, comunicar-se e coordenar ataques",
        icon: "👥",
        level: LessonLevel.INTERMEDIARIO,
        slug: "estrategia-de-time",
      },
    ];

    const createdCategories: Record<string, string> = {};

    for (const categoryData of categoriesData) {
      const existingCategory = await prisma.lessonCategory.findUnique({
        where: { slug: categoryData.slug },
      });

      if (existingCategory) {
        createdCategories[categoryData.slug] = existingCategory.id;
        console.log(`✅ Categoria ${categoryData.name} já existe`);
        continue;
      }

      try {
        const category = await prisma.lessonCategory.create({
          data: categoryData,
        });
        createdCategories[categoryData.slug] = category.id;
        console.log(`✅ Categoria criada: ${categoryData.name}`);
      } catch (error) {
        console.error(
          `❌ Erro ao criar categoria ${categoryData.name}:`,
          error,
        );
      }
    }

    // ========================================
    // 8. CRIAR AULAS
    // ========================================
    console.log("\n📚 Criando aulas...");

    // Garantir que temos um usuário admin válido
    let adminUserId =
      createdUsers["ana@academy.com"] || createdUsers["admin@valorant.com"];

    if (!adminUserId) {
      console.log("⚠️  Criando usuário admin para as aulas...");
      try {
        const adminUser = await prisma.user.create({
          data: {
            email: "admin@valorant.com",
            nickname: "Admin",
            role: UserRole.ADMIN,
            password:
              "$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWGw.xkY6gHfz8yqJlNvBmXpRtUoIaSdFgHjK",
            isActive: true,
            branchId: "branch-1",
          },
        });
        adminUserId = adminUser.id;
        createdUsers["admin@valorant.com"] = adminUser.id;
        console.log(`✅ Usuário admin criado com ID: ${adminUserId}`);
      } catch (error) {
        console.error("❌ Erro ao criar usuário admin:", error);
        throw new Error("Não foi possível criar usuário admin para as aulas");
      }
    } else {
      console.log(`✅ Usuário admin encontrado com ID: ${adminUserId}`);
    }

    // Verificar se todas as categorias foram criadas
    console.log("\n🔍 Verificando categorias disponíveis:");
    for (const [slug, id] of Object.entries(createdCategories)) {
      console.log(`- ${slug}: ${id}`);
    }

    // Validar se todas as categorias necessárias existem
    const categoriasNecessarias = [
      "taticas-avancadas",
      "mapas-e-rotas",
      "agentes-e-habilidades",
      "dribles-e-combate",
      "estrategia-de-time",
    ];

    const categoriasFaltando = categoriasNecessarias.filter(
      (slug) => !createdCategories[slug],
    );

    if (categoriasFaltando.length > 0) {
      console.error(`❌ Categorias faltando: ${categoriasFaltando.join(", ")}`);
      throw new Error(
        `Não foi possível criar aulas. Categorias faltando: ${categoriasFaltando.join(", ")}`,
      );
    }

    console.log("✅ Todas as categorias necessárias estão disponíveis");

    // Sistema de aulas com 4 aulas para cada categoria (2 básicas + 2 avançadas)
    const lessonsData = [
      // ========================================
      // TÁTICAS AVANÇADAS (4 aulas)
      // ========================================
      {
        title: "Posicionamento em Spike",
        description:
          "Como posicionar-se corretamente ao defender ou atacar o spike",
        categoryId: createdCategories["taticas-avancadas"],
        videoUrl: "https://youtu.be/valorant-spike-positioning",
        thumbnailUrl: "https://example.com/thumbs/spike-position.jpg",
        isLive: false,
        scheduledAt: null,
        createdById: createdUsers["admin@valorant.com"],
        duration: 180,
        isCompleted: false,
        isLocked: false,
        number: 1,
      },
      {
        title: "Controle de Mapa com Smoke",
        description: "Como usar smoke para controlar áreas do mapa",
        categoryId: createdCategories["taticas-avancadas"],
        videoUrl: "https://youtu.be/valorant-smoke-control",
        thumbnailUrl: "https://example.com/thumbs/smoke-control.jpg",
        isLive: false,
        scheduledAt: null,
        createdById: createdUsers["admin@valorant.com"],
        duration: 240,
        isCompleted: false,
        isLocked: false,
        number: 2,
      },
      {
        title: "Rotação de Equipe",
        description: "Como fazer rotações eficientes entre sites",
        categoryId: createdCategories["taticas-avancadas"],
        videoUrl: "https://youtu.be/valorant-team-rotation",
        thumbnailUrl: "https://example.com/thumbs/team-rotation.jpg",
        isLive: false,
        scheduledAt: null,
        createdById: createdUsers["admin@valorant.com"],
        duration: 200,
        isCompleted: false,
        isLocked: false,
        number: 3,
      },
      {
        title: "Controle de Mid",
        description: "Estratégias para dominar o meio do mapa",
        categoryId: createdCategories["taticas-avancadas"],
        videoUrl: "https://youtu.be/valorant-mid-control",
        thumbnailUrl: "https://example.com/thumbs/mid-control.jpg",
        isLive: false,
        scheduledAt: null,
        createdById: createdUsers["admin@valorant.com"],
        duration: 220,
        isCompleted: false,
        isLocked: false,
        number: 4,
      },

      // ========================================
      // MAPAS E ROTAS (4 aulas)
      // ========================================
      {
        title: "Rotas Seguras em Bind",
        description: "Rotas seguras para chegar à site B sem ser visto",
        categoryId: createdCategories["mapas-e-rotas"],
        videoUrl: "https://youtu.be/valorant-bind-routes",
        thumbnailUrl: "https://example.com/thumbs/bind-routes.jpg",
        isLive: false,
        scheduledAt: null,
        createdById: createdUsers["admin@valorant.com"],
        duration: 150,
        isCompleted: false,
        isLocked: false,
        number: 1,
      },
      {
        title: "Defesa na Site A de Split",
        description: "Como defender a site A em Split com bom posicionamento",
        categoryId: createdCategories["mapas-e-rotas"],
        videoUrl: "https://youtu.be/valorant-split-defense",
        thumbnailUrl: "https://example.com/thumbs/split-defense.jpg",
        isLive: false,
        scheduledAt: null,
        createdById: createdUsers["admin@valorant.com"],
        duration: 190,
        isCompleted: false,
        isLocked: false,
        number: 2,
      },
      {
        title: "Ataque em Haven com 3 Sites",
        description: "Como coordenar ataques em mapas com múltiplas sites",
        categoryId: createdCategories["mapas-e-rotas"],
        videoUrl: "https://youtu.be/valorant-haven-attack",
        thumbnailUrl: "https://example.com/thumbs/haven-attack.jpg",
        isLive: false,
        scheduledAt: null,
        createdById: createdUsers["admin@valorant.com"],
        duration: 170,
        isCompleted: false,
        isLocked: false,
        number: 3,
      },
      {
        title: "Rotas de Flanco em Ascent",
        description: "Como usar rotas laterais para surpreender o inimigo",
        categoryId: createdCategories["mapas-e-rotas"],
        videoUrl: "https://youtu.be/valorant-ascent-flank",
        thumbnailUrl: "https://example.com/thumbs/ascent-flank.jpg",
        isLive: false,
        scheduledAt: null,
        createdById: createdUsers["admin@valorant.com"],
        duration: 160,
        isCompleted: false,
        isLocked: false,
        number: 4,
      },

      // ========================================
      // AGENTES E HABILIDADES (4 aulas)
      // ========================================
      {
        title: "Ouvido do Jett",
        description:
          "Como usar o Ouvido do Jett para ganhar vantagem em combate",
        categoryId: createdCategories["agentes-e-habilidades"],
        videoUrl: "https://youtu.be/valorant-jett-ear",
        thumbnailUrl: "https://example.com/thumbs/jett-ear.jpg",
        isLive: false,
        scheduledAt: null,
        createdById: createdUsers["admin@valorant.com"],
        duration: 160,
        isCompleted: false,
        isLocked: false,
        number: 1,
      },
      {
        title: "Uso do Sombra no Ataque",
        description: "Como usar o Sombra para surpreender o inimigo",
        categoryId: createdCategories["agentes-e-habilidades"],
        videoUrl: "https://youtu.be/valorant-sombra-attack",
        thumbnailUrl: "https://example.com/thumbs/sombra-attack.jpg",
        isLive: false,
        scheduledAt: null,
        createdById: createdUsers["admin@valorant.com"],
        duration: 200,
        isCompleted: false,
        isLocked: false,
        number: 2,
      },
      {
        title: "Habilidades do Phoenix",
        description: "Como combinar flash e fogo para dominar",
        categoryId: createdCategories["agentes-e-habilidades"],
        videoUrl: "https://youtu.be/valorant-phoenix-skills",
        thumbnailUrl: "https://example.com/thumbs/phoenix-skills.jpg",
        isLive: false,
        scheduledAt: null,
        createdById: createdUsers["admin@valorant.com"],
        duration: 180,
        isCompleted: false,
        isLocked: false,
        number: 3,
      },
      {
        title: "Suporte com Sage",
        description: "Como usar Sage para curar e proteger a equipe",
        categoryId: createdCategories["agentes-e-habilidades"],
        videoUrl: "https://youtu.be/valorant-sage-support",
        thumbnailUrl: "https://example.com/thumbs/sage-support.jpg",
        isLive: false,
        scheduledAt: null,
        createdById: createdUsers["admin@valorant.com"],
        duration: 190,
        isCompleted: false,
        isLocked: false,
        number: 4,
      },

      // ========================================
      // DRIBLES E COMBATE (4 aulas)
      // ========================================
      {
        title: "Movimentação com Spray",
        description: "Como se mover com spray para manter a pressão",
        categoryId: createdCategories["dribles-e-combate"],
        videoUrl: "https://youtu.be/valorant-spray-movement",
        thumbnailUrl: "https://example.com/thumbs/spray-movement.jpg",
        isLive: false,
        scheduledAt: null,
        createdById: createdUsers["admin@valorant.com"],
        duration: 170,
        isCompleted: false,
        isLocked: false,
        number: 1,
      },
      {
        title: "Combate com Flash",
        description: "Como usar flash para ganhar vantagem em combate",
        categoryId: createdCategories["dribles-e-combate"],
        videoUrl: "https://youtu.be/valorant-flash-combat",
        thumbnailUrl: "https://example.com/thumbs/flash-combat.jpg",
        isLive: false,
        scheduledAt: null,
        createdById: createdUsers["admin@valorant.com"],
        duration: 180,
        isCompleted: false,
        isLocked: false,
        number: 2,
      },
      {
        title: "Crosshair Placement",
        description: "Como posicionar a mira para eliminações rápidas",
        categoryId: createdCategories["dribles-e-combate"],
        videoUrl: "https://youtu.be/valorant-crosshair-placement",
        thumbnailUrl: "https://example.com/thumbs/crosshair-placement.jpg",
        isLive: false,
        scheduledAt: null,
        createdById: createdUsers["admin@valorant.com"],
        duration: 150,
        isCompleted: false,
        isLocked: false,
        number: 3,
      },
      {
        title: "Recoil Control",
        description: "Como controlar o recuo das armas para maior precisão",
        categoryId: createdCategories["dribles-e-combate"],
        videoUrl: "https://youtu.be/valorant-recoil-control",
        thumbnailUrl: "https://example.com/thumbs/recoil-control.jpg",
        isLive: false,
        scheduledAt: null,
        createdById: createdUsers["admin@valorant.com"],
        duration: 200,
        isCompleted: false,
        isLocked: false,
        number: 4,
      },

      // ========================================
      // ESTRATÉGIA DE EQUIPE (4 aulas)
      // ========================================
      {
        title: "Comunicação Eficiente",
        description: "Como comunicar-se com a equipe para coordenar ataques",
        categoryId: createdCategories["estrategia-de-time"],
        videoUrl: "https://youtu.be/valorant-communication",
        thumbnailUrl: "https://example.com/thumbs/communication.jpg",
        isLive: false,
        scheduledAt: null,
        createdById: createdUsers["admin@valorant.com"],
        duration: 140,
        isCompleted: false,
        isLocked: false,
        number: 1,
      },
      {
        title: "Coordenação de Ataques",
        description:
          "Como coordenar ataques com a equipe para maximizar o sucesso",
        categoryId: createdCategories["estrategia-de-time"],
        videoUrl: "https://youtu.be/valorant-coordinated-attacks",
        thumbnailUrl: "https://example.com/thumbs/coordinated-attacks.jpg",
        isLive: false,
        scheduledAt: null,
        createdById: createdUsers["admin@valorant.com"],
        duration: 210,
        isCompleted: false,
        isLocked: false,
        number: 2,
      },
      {
        title: "Economia de Equipe",
        description:
          "Como gerenciar economia coletiva para compras estratégicas",
        categoryId: createdCategories["estrategia-de-time"],
        videoUrl: "https://youtu.be/valorant-team-economy",
        thumbnailUrl: "https://example.com/thumbs/team-economy.jpg",
        isLive: false,
        scheduledAt: null,
        createdById: createdUsers["admin@valorant.com"],
        duration: 180,
        isCompleted: false,
        isLocked: false,
        number: 3,
      },
      {
        title: "Callouts Padrão",
        description: "Sistema de comunicação padronizado para equipes",
        categoryId: createdCategories["estrategia-de-time"],
        videoUrl: "https://youtu.be/valorant-callouts",
        thumbnailUrl: "https://example.com/thumbs/callouts.jpg",
        isLive: false,
        scheduledAt: null,
        createdById: createdUsers["admin@valorant.com"],
        duration: 160,
        isCompleted: false,
        isLocked: false,
        number: 4,
      },
    ];

    // Criar as aulas uma a uma com validações
    let aulasCriadas = 0;
    let aulasComErro = 0;

    for (const lessonData of lessonsData) {
      try {
        // Validar dados obrigatórios
        if (!lessonData.categoryId) {
          console.error(
            `❌ Categoria não encontrada para: ${lessonData.title}`,
          );
          aulasComErro++;
          continue;
        }

        if (!adminUserId) {
          console.error(
            `❌ Usuário admin não encontrado para: ${lessonData.title}`,
          );
          aulasComErro++;
          continue;
        }

        // Criar aula com dados validados
        const aula = await prisma.lessons.create({
          data: {
            title: lessonData.title,
            description: lessonData.description,
            categoryId: lessonData.categoryId,
            videoUrl: lessonData.videoUrl,
            thumbnailUrl: lessonData.thumbnailUrl,
            isLive: lessonData.isLive,
            scheduledAt: lessonData.scheduledAt,
            createdById: adminUserId, // Usar o ID válido
            duration: lessonData.duration,
            isCompleted: lessonData.isCompleted,
            isLocked: lessonData.isLocked,
            number: lessonData.number,
          },
        });

        console.log(`✅ Aula criada: ${lessonData.title} (ID: ${aula.id})`);
        aulasCriadas++;
      } catch (error) {
        console.error(`❌ Erro ao criar aula ${lessonData.title}:`, error);
        aulasComErro++;
      }
    }

    console.log(`\n📊 Resumo das aulas:`);
    console.log(`✅ Aulas criadas com sucesso: ${aulasCriadas}`);
    console.log(`❌ Aulas com erro: ${aulasComErro}`);
    console.log(
      `📚 Total de aulas processadas: ${aulasCriadas + aulasComErro}`,
    );

    // ========================================
    // 9. CRIAR CONQUISTAS
    // ========================================
    console.log("\n🏆 Criando conquistas...");

    const achievementsData = [
      {
        title: "Primeira Aula",
        description: "Complete sua primeira aula",
        iconUrl: "🎓",
      },
      {
        title: "Estudante Dedicado",
        description: "Complete 10 aulas",
        iconUrl: "📚",
      },
      {
        title: "Mestre Tático",
        description: "Complete todas as aulas de táticas",
        iconUrl: "🎯",
      },
      {
        title: "Explorador de Mapas",
        description: "Complete todas as aulas de mapas",
        iconUrl: "🗺️",
      },
      {
        title: "Especialista em Agentes",
        description: "Complete todas as aulas de agentes",
        iconUrl: "👤",
      },
    ];

    for (const achievementData of achievementsData) {
      try {
        await prisma.achievements.create({ data: achievementData });
        console.log(`✅ Conquista criada: ${achievementData.title}`);
      } catch (error) {
        console.error(
          `❌ Erro ao criar conquista ${achievementData.title}:`,
          error,
        );
      }
    }

    // ========================================
    // 10. CRIAR TUTORIAIS DE AGENTES
    // ========================================
    console.log("\n📖 Criando tutoriais de agentes...");

    const agentTutorialsData = [
      {
        agentId: createdAgents["Jett"],
        title: "Como usar o Ouvido do Jett",
        url: "https://youtu.be/jett-ear-tutorial",
        type: TutorialType.VIDEO,
      },
      {
        agentId: createdAgents["Phoenix"],
        title: "Combinações de habilidades do Phoenix",
        url: "https://youtu.be/phoenix-combos",
        type: TutorialType.VIDEO,
      },
      {
        agentId: createdAgents["Sage"],
        title: "Posicionamento defensivo com Sage",
        url: "https://youtu.be/sage-defense",
        type: TutorialType.VIDEO,
      },
    ];

    for (const tutorialData of agentTutorialsData) {
      try {
        await prisma.agentTutorial.create({ data: tutorialData });
        console.log(`✅ Tutorial criado: ${tutorialData.title}`);
      } catch (error) {
        console.error(
          `❌ Erro ao criar tutorial ${tutorialData.title}:`,
          error,
        );
      }
    }

    // ========================================
    // 11. CRIAR TUTORIAIS DE MAPAS
    // ========================================
    console.log("\n🗺️ Criando tutoriais de mapas...");

    const mapTutorialsData = [
      {
        mapId: createdMaps["Bind"],
        title: "Rotas de ataque em Bind",
        url: "https://youtu.be/bind-attack-routes",
        type: TutorialType.VIDEO,
      },
      {
        mapId: createdMaps["Haven"],
        title: "Defesa em Haven com 3 sites",
        url: "https://youtu.be/haven-defense",
        type: TutorialType.VIDEO,
      },
      {
        mapId: createdMaps["Split"],
        title: "Controle de mid em Split",
        url: "https://youtu.be/split-mid-control",
        type: TutorialType.VIDEO,
      },
    ];

    for (const tutorialData of mapTutorialsData) {
      try {
        await prisma.mapTutorials.create({ data: tutorialData });
        console.log(`✅ Tutorial de mapa criado: ${tutorialData.title}`);
      } catch (error) {
        console.error(
          `❌ Erro ao criar tutorial de mapa ${tutorialData.title}:`,
          error,
        );
      }
    }

    // ========================================
    // RESUMO FINAL
    // ========================================
    const finalCounts = await Promise.all([
      prisma.user.count(),
      prisma.lessonCategory.count(),
      prisma.lessons.count(),
      prisma.subscription.count(),
      prisma.agents.count(),
      prisma.agentRoles.count(),
      prisma.maps.count(),
      prisma.achievements.count(),
    ]);

    const [
      finalUserCount,
      finalCategoryCount,
      finalLessonCount,
      finalSubscriptionCount,
      finalAgentCount,
      finalAgentRoleCount,
      finalMapCount,
      finalAchievementCount,
    ] = finalCounts;

    console.log("\n📊 Estado final do banco:");
    console.log(
      `- Usuários: ${finalUserCount} (${finalUserCount - userCount} novos)`,
    );
    console.log(
      `- Categorias: ${finalCategoryCount} (${finalCategoryCount - categoryCount} novas)`,
    );
    console.log(
      `- Aulas: ${finalLessonCount} (${finalLessonCount - lessonCount} novas)`,
    );
    console.log(
      `- Assinaturas: ${finalSubscriptionCount} (${finalSubscriptionCount - subscriptionCount} novas)`,
    );
    console.log(
      `- Agentes: ${finalAgentCount} (${finalAgentCount - agentCount} novos)`,
    );
    console.log(
      `- Roles de Agentes: ${finalAgentRoleCount} (${finalAgentRoleCount - agentRoleCount} novos)`,
    );
    console.log(
      `- Mapas: ${finalMapCount} (${finalMapCount - mapCount} novos)`,
    );
    console.log(
      `- Conquistas: ${finalAchievementCount} (${finalAchievementCount - achievementCount} novos)\n`,
    );

    console.log("✨ Seed concluído com sucesso!");
    console.log("\n🎯 Dados criados:");
    console.log(
      "✅ Usuários com diferentes roles (ADMIN, PROFESSIONAL, CUSTOMER)",
    );
    console.log(
      "✅ Roles de agentes (Duelista, Iniciador, Controlador, Sentinela)",
    );
    console.log("✅ Agentes populares com habilidades");
    console.log("✅ Mapas principais com sites");
    console.log("✅ Categorias de aulas organizadas por nível");
    console.log("✅ Aulas completas com vídeos e metadados");
    console.log("✅ Sistema de conquistas");
    console.log("✅ Tutoriais de agentes e mapas");
  } catch (error) {
    console.error("❌ Erro durante o seed:", error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error("❌ Erro no seed:", e);
    console.error("Detalhes do erro:", e.message);
    if (e.code) console.error("Código do erro:", e.code);
    process.exit(1);
  })
  .finally(async () => {
    console.log("\n🔌 Desconectando do banco de dados...");
    await prisma.$disconnect();
  });
