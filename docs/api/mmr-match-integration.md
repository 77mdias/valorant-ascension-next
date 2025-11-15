# 🔗 Integração MMR ↔ Match

## 📋 **Visão Geral**

Esta documentação explica como funciona a integração entre a página de MMR (busca de jogadores) e a página de Match (detalhes de partidas) no Valorant Ascension.

## 🎯 **Objetivo**

Manter o contexto do jogador ao navegar entre as páginas, permitindo que o usuário retorne facilmente aos dados do mesmo player após visualizar uma partida específica.

## 🏗️ **Arquitetura da Solução**

### **Estrutura de Rotas**

```
/mmr → /match/[matchId]?region=[region]&player=[playerName#tag]
```

### **Fluxo de Navegação**

1. **Busca no MMR**: Usuário busca um jogador
2. **Visualização de Partidas**: Clica em uma partida específica
3. **Navegação para Match**: Abre em nova aba com contexto do player
4. **Retorno ao Player**: Botão de navegação permite voltar aos dados do mesmo jogador

## 🔧 **Implementação Técnica**

### **1. Sistema de Cache**

- **Função**: Armazena dados de players e matches para evitar chamadas desnecessárias à API
- **Implementação**: localStorage com TTL configurável
- **TTL Player**: 1 hora
- **TTL Match**: 30 minutos
- **Limpeza automática**: A cada 5 minutos

### **2. Página MMR (`/mmr`)**

- **Função**: Busca e exibe dados básicos do jogador
- **Navegação para Match**:
  ```typescript
  onClick={() => {
    if (playerData) {
      const playerName = `${playerData.name}#${playerData.tag}`;
      window.open(
        `/match/${match.id}?region=${region}&player=${encodeURIComponent(playerName)}`,
        "_blank"
      );
    }
  }}
  ```

### **2. Página Match (`/match/[matchId]`)**

- **Parâmetros de URL**:
  - `matchId`: ID da partida
  - `region`: Região do servidor
  - `player`: Nome#Tag do jogador (contexto)
- **Navegação de Retorno**:

  ```typescript
  const playerContext = searchParams.get("player");

  // Navegação breadcrumb quando há contexto
  {playerContext ? (
    <>
      <button onClick={() => window.location.href = "/mmr"}>
        ← Busca
      </button>
      <span>/</span>
      <button onClick={() => {
        const [name, tag] = playerContext.split("#");
        window.location.href = `/mmr?name=${encodeURIComponent(name)}&tag=${encodeURIComponent(tag)}&region=${region}`;
      }}>
        {playerContext}
      </button>
      <span>/</span>
      <span>Partida</span>
    </>
  ) : (
    <button onClick={() => window.history.back()}>
      ← Voltar
    </button>
  )}
  ```

## 🎨 **Interface do Usuário**

### **Navegação Breadcrumb**

```
Busca / PlayerName#Tag / Partida
```

### **Estilos**

- **Botões de Navegação**: Estilo consistente com o tema da aplicação
- **Separadores**: Visual claros entre níveis de navegação
- **Responsividade**: Adaptação para dispositivos móveis

## 🔄 **Fluxo de Dados**

### **1. Busca Inicial**

```
Usuário digita: "TenZ#1337"
↓
API HenrikDev retorna dados do jogador
↓
Exibe estatísticas e partidas recentes
```

### **2. Navegação para Match**

```
Clique na partida
↓
URL: /match/abc123?region=na&player=TenZ%231337
↓
Carrega dados da partida via API
↓
Exibe detalhes com navegação de retorno
```

### **3. Retorno ao Player**

```
Clique em "TenZ#1337"
↓
URL: /mmr?name=TenZ&tag=1337&region=na
↓
Carrega dados do jogador automaticamente
↓
Exibe estatísticas atualizadas
```

## 🚀 **Benefícios da Implementação**

### **Para o Usuário**

- ✅ **Contexto Mantido**: Sempre sabe de qual jogador está visualizando dados
- ✅ **Navegação Intuitiva**: Breadcrumb claro e navegação lógica
- ✅ **Experiência Fluida**: Transições suaves entre páginas
- ✅ **Histórico Preservado**: Pode voltar facilmente aos dados do player
- ✅ **Performance Melhorada**: Dados carregam instantaneamente do cache
- ✅ **Menos Espera**: Evita chamadas repetidas à API

### **Para o Desenvolvedor**

- ✅ **Código Limpo**: Estrutura simples e manutenível
- ✅ **Reutilização**: Aproveita rotas existentes
- ✅ **Compatibilidade**: Mantém compatibilidade com API HenrikDev
- ✅ **Escalabilidade**: Fácil de estender para novas funcionalidades
- ✅ **Sistema de Cache**: Reduz carga na API externa
- ✅ **Performance**: Dados carregam instantaneamente para usuários recorrentes

## 🐛 **Tratamento de Erros**

### **Cenários de Falha**

1. **Player não encontrado**: Redireciona para busca com mensagem de erro
2. **Match não encontrado**: Exibe erro e botão de retorno
3. **Parâmetros inválidos**: Validação e fallback para navegação padrão

### **Fallbacks**

- **Sem contexto de player**: Botão "Voltar" padrão do navegador
- **URL malformada**: Redirecionamento para página de busca
- **API indisponível**: Mensagens de erro claras e opções de retry

## 🔮 **Futuras Melhorias**

### **Sistema de Cache (Próximas Versões)**

- [ ] **Banco de Dados**: Migrar de localStorage para PostgreSQL/MongoDB
- [ ] **Cache Distribuído**: Redis para múltiplas instâncias
- [ ] **Sincronização**: Cache compartilhado entre usuários
- [ ] **Analytics**: Métricas de uso do cache e performance

### **Funcionalidades Planejadas**

- [ ] **Histórico de Navegação**: Salvar últimos jogadores visualizados
- [ ] **Favoritos**: Marcar jogadores para acesso rápido
- [ ] **Comparação**: Comparar múltiplos jogadores
- [ ] **Notificações**: Alertas sobre mudanças de rank/ELO

### **Otimizações Técnicas**

- [ ] **Cache**: Armazenar dados de jogadores recentes
- [ ] **Lazy Loading**: Carregar dados sob demanda
- [ ] **PWA**: Funcionalidade offline básica
- [ ] **Analytics**: Rastrear padrões de uso

## 📚 **Referências**

- **HenrikDev API**: [Documentação da API](https://henrik.dev/)
- **Next.js**: [Roteamento dinâmico](https://nextjs.org/docs/routing/dynamic-routes)
- **Valorant API**: [API oficial do Valorant](https://developer.riotgames.com/)

## 🤝 **Contribuição**

Para contribuir com melhorias nesta funcionalidade:

1. **Fork** o repositório
2. **Crie** uma branch para sua feature
3. **Implemente** as mudanças
4. **Teste** a funcionalidade
5. **Abra** um Pull Request

---

**Última atualização**: Dezembro 2024  
**Versão**: 1.0.0  
**Autor**: Equipe Valorant Ascension
