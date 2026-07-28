# AGENTS.md — Checkout Editor UI

Estas instruções aplicam-se exclusivamente aos arquivos dentro de:

```

reactapp/src/editor/

```

Este diretório é responsável apenas pela experiência do editor visual.

Não implemente aqui regras relacionadas ao checkout da loja.

---

# Objetivo

O editor deve oferecer uma experiência semelhante aos melhores construtores visuais modernos.

A principal referência é o Elementor.

A referência é estrutural e de usabilidade, nunca de identidade visual.

O objetivo é permitir que qualquer usuário consiga editar o checkout intuitivamente.

---

# O que pode ser inspirado no Elementor

A interface pode utilizar conceitos como:

- painel lateral fixo;
- canvas central;
- toolbar superior;
- árvore de componentes;
- painel de propriedades;
- seleção contextual;
- drag-and-drop intuitivo;
- indicadores visuais durante movimentação;
- edição inline quando apropriado;
- histórico de alterações;
- preview responsivo.

---

# O que NÃO deve ser copiado

Nunca copie:

- logotipo;
- identidade visual;
- CSS;
- código;
- componentes;
- textos;
- ícones exclusivos;
- animações proprietárias.

O projeto deve possuir identidade própria.

---

# Filosofia de Design

O editor deve transmitir:

- simplicidade;
- organização;
- clareza;
- rapidez;
- foco.

O usuário deve enxergar apenas o necessário.

---

# Layout

A estrutura principal deve conter:

```

┌──────────────────────────────────────────────┐
│ Toolbar                                      │
├───────────────┬──────────────────────────────┤
│ Sidebar       │
│               │
│               │         Canvas               │
│               │
│               │
├───────────────┴──────────────────────────────┤
│ Status Bar (opcional)                        │
└──────────────────────────────────────────────┘

```

O canvas deve sempre ser o elemento de maior destaque.

---

# Sidebar

A sidebar deve conter:

- biblioteca de componentes;
- árvore do layout;
- configurações globais.

Nunca misture propriedades do componente selecionado com a biblioteca.

---

# Painel de Propriedades

As propriedades devem aparecer somente quando existir um componente selecionado.

Utilize:

- abas;
- accordions;
- grupos;
- categorias.

Evite listas enormes de configurações.

---

# Toolbar

A toolbar deve conter apenas ações principais.

Exemplos:

- salvar;
- publicar;
- desfazer;
- refazer;
- preview;
- dispositivos.

Evite controles secundários na toolbar.

---

# Canvas

O canvas é a área principal.

Sempre priorize:

- espaço livre;
- leitura clara;
- seleção evidente;
- movimentação intuitiva.

O canvas nunca deve parecer poluído.

---

# Seleção

Todo componente selecionado deve possuir feedback visual claro.

Utilize:

- borda;
- destaque;
- handles;
- indicador de seleção.

Nunca deixe dúvidas sobre qual componente está ativo.

---

# Drag and Drop

O usuário deve compreender facilmente:

- onde pode soltar;
- qual será a posição;
- qual elemento será afetado.

Utilize indicadores visuais simples.

---

# Princípios de UI

Toda alteração deve seguir estes princípios.

## Minimalismo

Cada elemento deve possuir uma função clara.

Remova:

- botões redundantes;
- informações duplicadas;
- bordas desnecessárias;
- excesso de sombras;
- excesso de cores;
- excesso de texto.

---

## Hierarquia Visual

A interface deve deixar evidente:

- onde editar;
- onde salvar;
- qual componente está selecionado;
- onde alterar propriedades.

---

## Consistência

Sempre reutilize:

- espaçamentos;
- tipografia;
- componentes;
- ícones;
- cores;
- estados visuais.

Não introduza novos padrões sem necessidade.

---

## Progressive Disclosure

Nunca mostre todas as opções simultaneamente.

Utilize:

- abas;
- menus;
- grupos;
- accordions;
- tooltips.

Mostre apenas o que faz sentido para o contexto atual.

---

# Decisões de UX

Sempre que houver dúvida entre adicionar mais funcionalidades visíveis ou simplificar a interface, escolha a alternativa mais simples.

O editor deve parecer uma ferramenta profissional, limpa e organizada, não um painel administrativo tradicional do Magento.