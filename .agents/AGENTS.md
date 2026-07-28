# AGENTS.md — React Checkout Builder for Magento 2

## Objetivo

Este módulo transforma o Hyvä React Checkout em um checkout totalmente configurável através de um editor visual.

Administradores devem conseguir construir, modificar e publicar diferentes layouts de checkout sem escrever código.

O projeto utiliza o Craft.js como engine de edição, porém o objetivo não é criar uma demonstração do Craft.js. O objetivo é desenvolver um construtor visual completo para Magento 2.

O editor deve ser tratado como um produto próprio, semelhante aos grandes page builders do mercado.

---

# Base do Projeto

Este módulo utiliza como base:

- friendsofhyva/magento2-react-checkout-example
- Craft.js

Essas tecnologias servem apenas como infraestrutura.

A arquitetura do editor deve evoluir independentemente delas sempre que necessário.

---

# Arquitetura

O projeto possui duas aplicações distintas.

## 1. Checkout Runtime

Responsável pelo checkout utilizado pelos clientes da loja.

Responsabilidades:

- renderizar o layout publicado;
- interpretar o layout salvo;
- integrar com o fluxo normal do Hyvä Checkout;
- executar o checkout da loja.

O Runtime nunca deve conter funcionalidades do editor.

---

## 2. Checkout Editor

Responsável exclusivamente pela criação e edição do checkout.

Atualmente pode ser acessado através de:

```

/checkout?editor

```

No futuro poderá possuir uma rota exclusiva.

Toda lógica de edição pertence ao Editor.

---

# Objetivos Funcionais

O editor deve permitir:

- adicionar componentes;
- remover componentes;
- reorganizar componentes;
- criar containers;
- editar propriedades;
- alterar estilos;
- visualizar alterações em tempo real;
- desfazer alterações;
- refazer alterações;
- salvar rascunhos;
- publicar layouts.

Toda alteração deve refletir imediatamente no canvas.

---

# Organização do Código

Sempre mantenha responsabilidades separadas.

## Runtime

Responsável apenas pelo checkout publicado.

Não deve conhecer regras da interface do editor.

---

## Editor

Responsável pela experiência de edição.

Inclui:

- canvas;
- seleção;
- drag-and-drop;
- toolbar;
- sidebar;
- biblioteca de componentes;
- painel de propriedades;
- histórico;
- preview responsivo.

---

## Shared

Sempre que possível, componentes devem ser compartilhados entre Runtime e Editor.

Evite duplicação.

---

# Persistência

O editor deve produzir uma estrutura serializável.

Essa estrutura representa o layout do checkout.

O Runtime apenas interpreta essa estrutura.

Nunca utilize o estado interno do Craft.js como fonte permanente de dados.

---

# Princípios Arquiteturais

## Separação de responsabilidades

Nunca misture código do Runtime com código do Editor.

Evite:

```

if (isEditor) {
...
}

```

Prefira componentes específicos para cada ambiente.

---

## Componentes reutilizáveis

Sempre que possível:

- reutilize componentes;
- compartilhe lógica;
- compartilhe estilos quando fizer sentido.

---

## Evolução

Antes de implementar uma funcionalidade, avalie:

- melhora a experiência do editor?
- reduz acoplamento?
- facilita manutenção?
- melhora reutilização?

Caso contrário, reavalie a implementação.

---

# Qualidade

Todo código novo deve ser:

- modular;
- reutilizável;
- tipado;
- simples;
- desacoplado;
- consistente.

Evite soluções temporárias e gambiarras.

Priorize arquitetura sustentável.

## Delegação de tarefas complexas

Alterações que envolvam Editor, Runtime e backend Magento devem ser divididas
em tarefas autocontidas. O plano em `plans/` é a fonte de verdade para a
divisão, dependências, ownership e critérios de aceite.

### Coordenador

O agente principal atua como coordenador e integrador. Ele deve:

1. ler este arquivo, os `AGENTS.md` dos diretórios afetados e o plano;
2. verificar o estado atual do repositório antes de delegar;
3. criar primeiro a tarefa de contrato quando o plano assim exigir;
4. informar a cada agente seu ID de tarefa, dependências e arquivos autorizados;
5. impedir que dois agentes editem o mesmo arquivo;
6. integrar as entregas na ordem definida pelo plano;
7. executar a validação integrada e corrigir conflitos de contrato.

O coordenador não deve delegar uma fase inteira de forma genérica. Cada agente
deve receber exatamente uma tarefa do plano.

### Contrato de uma tarefa delegável

Uma tarefa só pode ser atribuída quando declarar:

- objetivo único;
- dependências e condição de início;
- arquivos sob ownership exclusivo;
- arquivos permitidos apenas para leitura;
- arquivos proibidos;
- requisitos funcionais;
- entregáveis;
- comandos de validação;
- critérios de aceite;
- formato do relatório de retorno.

Se algum item estiver ausente, o coordenador deve completar a definição antes
de criar o agente.

### Ownership e concorrência

- Um arquivo possui apenas um agente escritor durante toda a execução.
- Arquivos compartilhados, contratos, defaults, schemas, registries e suas
  migrações pertencem ao agente de contrato; migrações específicas de outra
  camada pertencem ao owner declarado no plano.
- Agentes consumidores podem ler esses arquivos, mas não alterá-los.
- Descobertas que exijam mudança fora do ownership devem ser reportadas ao
  coordenador; o agente não deve ampliar seu próprio escopo.
- Alterações paralelas só são permitidas quando os conjuntos de arquivos
  graváveis são disjuntos e os contratos consumidos já estão definidos.
- Não criar implementações duplicadas para contornar dependências.

### Dependências

Use os estados `bloqueada`, `pronta`, `em andamento`, `em revisão` e
`concluída`.

- Uma tarefa `bloqueada` não pode ser iniciada.
- Uma tarefa fica `pronta` somente quando todas as dependências estiverem
  concluídas.
- Tarefas da mesma onda podem executar em paralelo apenas quando não houver
  sobreposição de ownership.
- Falha de contrato retorna a tarefa ao agente responsável pelo contrato, não
  deve ser corrigida silenciosamente por um consumidor.

### Retorno obrigatório de cada agente

Cada agente deve retornar:

1. resumo do que implementou;
2. lista exata de arquivos alterados;
3. validações executadas e seus resultados;
4. decisões ou suposições relevantes;
5. riscos, pendências ou bloqueios;
6. confirmação de que não editou arquivos fora do ownership.

### Integração

Depois de reunir os resultados, o coordenador deve:

- revisar o diff completo;
- confirmar compatibilidade entre DTO, frontend, Runtime e backend;
- executar testes React e PHP;
- executar os builds de Editor e Runtime;
- executar compilação Magento quando aplicável;
- validar save, reload, publish, fallback e lock otimista;
- registrar qualquer validação manual que ainda dependa do ambiente.

Uma tarefa individual concluída não significa que a evolução está concluída.
Somente a revisão integrada pode encerrar o plano.
