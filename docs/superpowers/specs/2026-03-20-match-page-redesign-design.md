# Match Page Redesign — Design Spec
**Data:** 2026-03-20
**Status:** Aprovado pelo usuário

---

## Contexto

A página `match/[matchId]` tem design inconsistente com a página MMR: usa emojis (🔒, 📊, 🏆, 🔗, ⏱), o histórico de rounds usa caixinhas ✓/✗ sem identidade visual, as tabs têm estilo pill com glow rosa, e os cards de jogadores no mobile são difíceis de ler. O objetivo é tornar a página visualmente consistente, limpa e funcional — especialmente no mobile.

---

## Decisões de Design

### Estilo Geral: Tactical Dark
- Background: `#060a0f` / `#0d1117`
- Bordas: `1px solid #1a2030`
- Sem glow pesado, sem gradientes chamativos
- Accent: `#ec176b` (rosa) apenas em elementos ativos/destacados
- Transições: manter `transition: all 0.2s ease` e hover states existentes

### Breadcrumb (`Breadcrumb.tsx` + `Breadcrumb.module.scss`)
- Path com `/` como separador
- `← Busca`: botão sem border/background, cor `#ec176b`, font-weight 600
- Nome do jogador: botão secundário, cor `#888`, hover para `#ccc`
- `Partida`: `<span>` com `.currentPage` sem background, sem border, `color: #ffffff`, `font-weight: 700`, `padding: 0`
- **Breadcrumb.tsx**: adicionar classe `.playerButton` distinta de `.backButton` (aplicar no botão do nome do jogador para cor muted diferenciada)

### Match Header (`MatchHeader.tsx`)
- Container: `bg-[#0d1117] border border-[#1a2030] rounded-xl overflow-hidden`
- Barra top: `<div>` de 3px com `display: flex` antes do conteúdo — metade esquerda `#4ade80` (Team A), metade direita `#f87171` (Team B)
- Score: manter tamanho, remover labels genéricos "Time A"/"Time B" (ou substituir por "ATK"/"DEF")
- Emoji `🔗` (linha 67) → SVG inline de link (16×16)
- Emoji `⏱` (linha 87) → texto "Duração:" antes do valor
- `MatchHeader.module.scss` não é usado (componente usa apenas Tailwind) — sem alteração

### MatchPageHeader (`MatchPageHeader.module.scss`)
- Remover `background: linear-gradient(...)` e `box-shadow` com glow
- Substituir por fundo neutro ou transparente, alinhado ao estilo Tactical Dark

### Tabs (`TabNavigation.tsx` + `TabNavigation.module.scss`)
- TSX linha 51: remover `{tab.disabled && <span aria-hidden="true">🔒 </span>}`
- SCSS `.tabs`: remover border-radius pill e background; adicionar `border-bottom: 1px solid #1a2030`; `display: flex; overflow-x: auto`
- SCSS `.tab.active`: remover background/box-shadow/border; adicionar `border-bottom: 2px solid #ec176b; margin-bottom: -1px`
- SCSS `.tab.disabled`: manter `opacity: 0.35; cursor: not-allowed` — sem emoji
- Manter scroll horizontal no mobile

### View Controls (`ViewControls.tsx`)
- Remover `<span className="text-sm">📊</span>` (linha 34)
- Remover `<span className="text-sm">🏆</span>` (linha 44)
- Remover wrapper container (`bg-zinc-900/60 rounded-lg border border-zinc-800/30 p-1`) — os botões ficam em flex row plano
- Botão ativo: `border-bottom: 2px solid #ec176b`, sem background, sem border-radius no container
- Texto puro: "Geral" / "Times"

### Histórico de Rounds (`RoundHistory.tsx` + `RoundHistory.module.scss`)
**Estrutura nova (substituir dual-row grid por timeline por metade):**

```
[1ª METADE]            TA: 2 · TB: 6
● ● ○ ● ● ● ○ ● ● ● ● ●    (círculos 1–12)

[2ª METADE]            TA: 1 · TB: 5
○ ● ● ● ● ●                 (círculos 13–N)
```

- Cada círculo: `<div>` 20×20px, `border-radius: 50%`, número do round dentro (font-size: 9px)
- Cores **absolutas** (não relativas ao jogador pesquisado, pois o componente não tem essa info):
  - Verde `#4ade80`: `winning_team === "Red"` (Time A venceu o round)
  - Vermelho `#f87171`: `winning_team === "Blue"` (Time B venceu o round)
- Legenda "Vitória/Derrota" removida (substituída por legenda "Time A / Time B")
- Divisão: rounds index 0–11 = 1ª metade, index 12+ = 2ª metade
- Mini card de resumo: `<span>` inline após label da metade, exibindo contagem de rounds ganhos por cada time naquela metade
- Posição dos mini cards: à direita do label da metade (flexbox `justify-content: space-between`)
- Overtime (> 24 rounds): agrupado como "OT" com todos os rounds extras
- Remover "Time A" / "Time B" labels; remover `.roundHistoryGrid` dual-row
- No SCSS: mudar cor de `.loss` de `#ec176b` para `#f87171` (era rosa da marca, agora vermelho semântico)
- Manter `aria-label` por round circle

### Player Card Mobile (`PlayerRow.tsx` — seção mobile)
**O que muda na seção mobile (linhas 63–116):**
- Avatar: manter 44px (não reduzir)
- `isSearchedPlayer`: adicionar `border-left: 3px solid #ec176b` e `bg-[rgba(236,23,107,0.04)]` (atualmente só tem `ring-1 ring-inset ring-zinc-500/30`)
- Colunas de stats à direita: separar K/D/A em colunas fixas (`w-7 text-center`) com cores K=`text-emerald-400`, D=`text-rose-400`, A=`text-zinc-400`; ACS em coluna separada `text-[#ec176b]`
- Reduzir padding: `px-2 py-2` (de `px-3 py-3`)
- Segunda linha de stats: mostrar apenas ACS (remover ADR para liberar espaço)

### Player Row Desktop (`PlayerRow.tsx` — seção desktop)
- `isSearchedPlayer`: substituir `ring-1 ring-inset ring-zinc-500/30 bg-zinc-800/30` por `border-l-[3px] border-l-[#ec176b] bg-[rgba(236,23,107,0.04)]`
- Demais mudanças mínimas (já usa Tactical Dark via zinc classes)

---

## Arquivos a Modificar

1. `src/app/match/[matchId]/components/layout/Breadcrumb.tsx`
2. `src/app/match/[matchId]/components/layout/Breadcrumb.module.scss`
3. `src/app/match/[matchId]/components/layout/MatchPageHeader.module.scss`
4. `src/app/match/[matchId]/components/layout/TabNavigation.tsx`
5. `src/app/match/[matchId]/components/layout/TabNavigation.module.scss`
6. `src/app/match/[matchId]/components/match-info/MatchHeader.tsx`
7. `src/app/match/[matchId]/components/match-info/RoundHistory.tsx`
8. `src/app/match/[matchId]/components/match-info/RoundHistory.module.scss`
9. `src/app/match/[matchId]/components/scoreboard/ViewControls.tsx`
10. `src/app/match/[matchId]/components/scoreboard/PlayerRow.tsx`
