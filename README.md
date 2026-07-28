# Hyvä CheckoutExample Module Template
## Magento 2 module template for extending upon the Hyvä React Checkout module

This is a Magento 2 module template that enables you to customize Hyvä React Checkout seamlessly. It adds a custom Webpack configuration, so that you can extend upon the React sources of the original React Checkout module. In effect, this allows for kind of a parent/child theming mechanism, not for the entire Hyvä theme, but only for the specific React sources in your custom checkout.

## Why do you need this?

The React Checkout is a great solution for checkout page in any Magento 2 based site. It contains a ReactApp which constitutes the checkout page. When you want to use Hyvä Checkout in your site, you will eventually come to a point where you want to work on the ReactApp embedded in it. This means you cannot now use Hyvä Checkout directly as a composer dependency in your project.

Currently, there are two ways to approach this issue. You can fork Hyvä Checkout repository and use the forked version in your project. You are now able to apply the customization to this forked version. Another approach would be setup Hyvä Checkout in the `app/code/Hyva/ReactCheckout` directory. In both cases, it will be difficult to get the updates in the original React Checkout repository. You need to manually port the changes.

This module template helps you in this situation. It allows you to use the Hyvä Checkout as a composer dependency. You are exclusively working on this module which actually resides in the `app/code` directory. It allows you to edit only those React Components you really need to customize it. Eventually, you know which all React files you have customized. Hyvä Checkout is now completely separate and you can bring the updates if you need it without any headaches.

We highly recommend going for this approach when it comes to customize Hyvä Checkout.

## Installation
- Install Hyvä Checkout via composer. You can find more details in the [**official documentation**](https://friends-of-hyva.github.io/magento2-react-checkout/installation/)
- Setup this Magento 2 module template in your project. We are naming the module `FriendsOfHyva_CheckoutExample`.
    - Clone it into `app/code/FriendsOfHyva/CheckoutExample`
    - Enable your module with `bin/magento module:enable FriendsOfHyva_CheckoutExample`
    - Run setup upgrade with `bin/magento setup:upgrade`

- Setup ReactApp (See: [How to customize Hyvä Checkout](https://friends-of-hyva.github.io/magento2-react-checkout/customize/))
    - Specify payment methods repositories (if any) in `app/code/FriendsOfHyva/CheckoutExample/reactapp/package.json`.
    - Navigate into `app/code/FriendsOfHyva/CheckoutExample/reactapp`.
    - Run `npm install` (do not use `yarn`)

- Start ReactApp
    - Update `proxy` setting in `app/code/FriendsOfHyva/CheckoutExample/reactapp/package.json` with the base url of your magento instance.
    - Copy the `env.example` file into `.env` and modify its contents
    - Run `npm run start`

Please remember this is a template. So you can name this module as you wish. There is no need to go on with the given name `FriendsOfHyva_CheckoutExample`. If you have a different name for this template then, you need to update the module name at least in below files.

- registration.php
- composer.json
- etc/module.xml
- Change template as per your module name at `view/frontend/layout/hyvareactcheckout_reactcheckout_index.xml`

    ```
    <referenceBlock name="checkout.scripts" template="FriendsOfHyva_CheckoutExample::react-script.phtml" />
    ```
- Change js file reference at `view/frontend/templates/react-script.phtml`

    ```
    newScript.src = '<?= $escaper->escapeUrl($block->getViewFileUrl('FriendsOfHyva_CheckoutExample::js/react-checkout.js')); ?>';
    ```

## Copying React components
As an example you could copy the original `LoginForm.jsx` component and make some modifications to hit, like adding a simple `Hello World`. Copy the original path `vendor/hyva-themes/magento2-react-checkout/src/reactapp/src/components/login/components/LoginForm.jsx` into `app/code/FriendsOfHyva/CheckoutExample/reactapp/src/components/login/components/LoginForm.jsx`.

Open up the React source and locate the lines including `import`:

```react
import Button from '../../common/Button';
import TextInput from '../../common/Form/TextInput';
import useLoginFormContext from '../hooks/useLoginFormContext';
import {__} from '../../../i18n';
```

Change these relative imports into the references to `@hyva/react-checkout`:

```react
import Button from '@hyva/react-checkout/components/common/Button';
import TextInput from '@hyva/react-checkout/components/common/Form/TextInput';
import useLoginFormContext from '@hyva/react-checkout/components/login/hooks/useLoginFormContext';
import {__} from '@hyva/react-checkout/i18n';
```

Note that the NPM package `@hyva/react-checkout` actually does not (yet) exist. It is a Webpack alias pointing to
the path `vendor/hyva-themes/magento2-react-checkout/src/reactapp/src`.

## Payment Integrations
With the React Checkout, you may need to use existing payment repositories. They will work out of box with the React Checkout
repository. But you may face issues when you use them inside the template. This is because it is failing to load the
relative imports. You need to use `@hyva/react-checkout` for all those non-resolving imports.

There will be solution for this problem in those repositories. So always pay attention in the payment repositories documentation.

## Arquitetura do Checkout Builder

Este módulo implementa um construtor visual de checkout composto por duas aplicações React independentes e uma camada compartilhada. O Editor existe somente no painel administrativo do Magento; o Runtime é executado somente no checkout da loja. A comunicação entre essas aplicações acontece por meio de um documento JSON versionado persistido pelo Magento, nunca pelo estado interno do Craft.js.

### Visão geral

```text
Admin Magento
  └── Checkout Editor (React + Craft.js)
        ├── carrega o rascunho da store view
        ├── converte DTO → árvore Craft.js
        ├── edita e serializa árvore Craft.js → DTO
        └── salva/publica por controllers administrativos
                          │
                          ▼
              LayoutRepositoryInterface
                          │
                          ▼
            hyva_checkout_builder_layout
              ├── draft_json
              └── published_json
                          │
                          ▼
Checkout Magento
  └── Checkout Runtime (React, sem Craft.js)
        ├── recebe o layout publicado no HTML
        ├── interpreta recursivamente o DTO
        └── renderiza os componentes reais do checkout
```

### Camada Magento

O módulo é registrado como `FriendsOfHyva_CheckoutExample`. Sua infraestrutura administrativa é formada por:

- rota `adminhtml` exclusiva em `hyva_checkout_builder`;
- item **Content → Checkout Builder**;
- ACLs independentes para acessar, salvar e publicar;
- página administrativa e assets próprios;
- controllers JSON para carregar, salvar e publicar layouts;
- validação de `form_key`, sessão administrativa e ACL realizada pelo fluxo padrão do Magento.

Os principais endpoints internos são:

| Ação | Controller | Método | Responsabilidade |
|---|---|---:|---|
| Abrir editor | `Editor/Index` | GET | Renderiza a aplicação administrativa |
| Carregar | `Layout/Load` | GET | Retorna o rascunho resolvido para a store view |
| Salvar | `Layout/Save` | POST | Valida e persiste somente o rascunho |
| Publicar | `Layout/Publish` | POST | Promove atomicamente o rascunho para publicado |

Todos os acessos à persistência passam por `LayoutRepositoryInterface`. Controllers, ViewModels e aplicações React não acessam a tabela diretamente.

### Persistência e escopo

O schema declarativo cria a tabela `hyva_checkout_builder_layout`, com um registro por `store_id`. Ela mantém:

- `draft_json`: versão em edição, invisível para clientes;
- `published_json`: versão utilizada pelo checkout;
- `version`: número utilizado para concorrência otimista;
- usuários responsáveis pela edição e publicação;
- datas de criação, atualização e publicação.

O escopo é por store view. Quando uma store view não possui layout próprio, o repository procura o layout do escopo padrão (`store_id = 0`). Se também não houver publicação no escopo padrão, o módulo utiliza o layout inicial definido em `Model/DefaultLayout.php`.

Salvar e publicar são operações diferentes. Salvar incrementa a versão e preserva o checkout publicado. Publicar copia o rascunho validado para `published_json` dentro de uma transação. O número de versão enviado pelo Editor precisa coincidir com o banco; caso contrário, a gravação é recusada para impedir que uma sessão administrativa sobrescreva alterações de outra sessão.

### Formato persistido

O documento persistido é um DTO próprio, independente do Craft.js:

```json
{
  "schemaVersion": 1,
  "root": {
    "type": "Container",
    "props": {},
    "children": [
      {
        "type": "Login",
        "props": {},
        "children": []
      }
    ]
  }
}
```

Cada node contém um identificador de componente estável, propriedades permitidas e seus filhos. `schemaVersion` permite introduzir conversores e migrações no futuro. Na versão 1, propriedades arbitrárias são recusadas e somente tipos registrados podem ser persistidos.

`Model/LayoutValidator.php` valida no backend:

- versão do schema;
- presença e tipo do node raiz;
- componentes permitidos;
- estrutura de `props` e `children`;
- componentes que podem receber filhos.

O estado serializado do Craft.js é usado apenas durante a sessão do Editor. `layoutAdapter.jsx` converte o DTO para nodes Craft.js ao carregar e reconstrói o DTO antes de salvar.

### Componentes compartilhados

`reactapp/src/shared/` é a fronteira comum entre Editor e Runtime:

- `componentDefinitions.js`: metadados e regras estruturais;
- `registry.js`: associação entre identificadores persistidos e componentes React;
- `components.jsx`: componentes visuais compartilhados;
- `defaultLayout.js`: layout inicial equivalente ao checkout padrão;
- `layout.js`: parser e validação client-side.

Os componentes compartilhados não importam Craft.js e não conhecem o modo de edição. Isso evita condicionais como `if (isEditor)` e garante que o componente exibido no canvas seja o mesmo utilizado no checkout.

### Checkout Editor

O Editor está em `reactapp/src/editor/` e utiliza Craft.js exclusivamente como engine de interação. Seus adapters adicionam seleção, drag-and-drop e capacidade de container aos componentes compartilhados.

A interface é dividida em:

- toolbar com salvar, publicar, undo, redo, preview e viewport;
- sidebar com Biblioteca, Árvore e Configurações;
- canvas central responsivo;
- inspector exibido somente quando existe seleção;
- camada de drag preview que renderiza o componente real.

A Biblioteca renderiza somente cartões com o nome dos componentes. A versão completa aparece apenas no drag preview e no canvas. O Editor usa dados determinísticos de demonstração e não lê nem modifica carrinhos de clientes.

O fluxo de edição é:

1. `api.js` carrega o DTO do escopo selecionado.
2. `layoutAdapter.jsx` cria a árvore transitória do Craft.js.
3. O administrador edita a árvore no canvas.
4. Ao salvar, a árvore Craft.js é convertida para o DTO versionado.
5. O backend valida o DTO e grava `draft_json`.
6. Ao publicar, o backend promove o rascunho para `published_json`.

### Checkout Runtime

O Runtime está em `reactapp/src/runtime/` e não importa nenhum arquivo de `editor/`. Ele também não monta um `<Editor enabled={false}>`.

Durante a renderização da página, `ViewModel/PublishedLayout.php` resolve o layout publicado da store atual. O template `react-container.phtml` injeta o JSON no atributo `data-checkout_layout`. A aplicação React lê esse documento uma única vez, valida sua estrutura e `LayoutRenderer.jsx` percorre a árvore recursivamente usando o registry compartilhado.

Os providers reais do Hyvä React Checkout continuam responsáveis por carrinho, formulários e dados da aplicação. Portanto, alterar a ordem ou os containers do layout não duplica nem substitui a lógica funcional do checkout.

### Bundles e build

O projeto gera dois entrypoints independentes:

| Bundle | Entry | Destino |
|---|---|---|
| Runtime | `src/index.jsx` | `view/frontend/web/js/react-checkout.js` |
| Editor | `src/editor/index.jsx` | `view/adminhtml/web/js/checkout-editor.js` |

Comandos disponíveis:

```bash
npm run build
npm run build:runtime
npm run build:editor
npm run start
npm run start:editor
```

`npm run build` compila os dois bundles. Em execução normal não é necessário manter `npm start` ativo: Magento serve os arquivos compilados em `view/frontend/web` e `view/adminhtml/web`.

Após alterar PHP, XML ou schema:

```bash
bin/magento setup:upgrade
bin/magento setup:di:compile
bin/magento cache:clean
```

### Extensão segura

Para adicionar um componente:

1. criar ou importar o componente visual compartilhado;
2. registrar seu identificador em `componentDefinitions.js`;
3. associá-lo ao componente React em `registry.js`;
4. criar o adapter correspondente em `editor/nodes.jsx`;
5. adicionar o identificador à whitelist de `LayoutValidator.php`;
6. incluir o cartão no grupo apropriado da Biblioteca;
7. adicionar testes de validação, conversão e renderização.

Identificadores persistidos não devem ser renomeados sem uma migração de `schemaVersion`, pois layouts publicados podem depender deles.

## Credits
The brain behind this idea is [**Jisse Reitsma**](https://github.com/jissereitsma). You can find his original work here: [**Yireo_ExampleHyvaCheckout**](https://github.com/yireo-training/Yireo_ExampleHyvaCheckout).
