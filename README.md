# Backend Template Stripe

Este repositório é um template de back-end em Node.js e NestJS, com integração ao Stripe para processamento de pagamentos via Checkout e Webhooks.

## Visão Geral

Este projeto fornece uma base simples e organizada para:

- Criar sessões de pagamento no Stripe (Checkout Session)
- Receber e tratar eventos de webhook do Stripe
- Gerenciar configurações de ambiente e variáveis secretas

Ideal para quem deseja começar rapidamente um serviço de pagamentos online usando Stripe.

## Tecnologias

- Node.js
- NestJS
- TypeScript
- Stripe SDK

## Pré-requisitos

- Node.js (versão 14 ou superior)
- Yarn ou npm
- Conta no Stripe e Keys (publicável e secreta)

## Instalação

1. Clone este repositório:
   ```bash
   git clone https://github.com/gustavokurtz/backend-template-stripe.git
   cd backend-template-stripe
   ```

2. Instale as dependências:
   ```bash
   yarn install
   # ou
   npm install
   ```

3. Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:
   ```env
   STRIPE_SECRET_KEY=sk_test_xxx
   STRIPE_WEBHOOK_SECRET=whsec_xxx
   PORT=3000
   ```

4. Compile o projeto (se usar TypeScript):
   ```bash
   yarn build
   # ou
   npm run build
   ```

## Rodando o Projeto

- Em modo de desenvolvimento (hot-reload):
  ```bash
  yarn start:dev
  # ou
  npm run start:dev
  ```

- Em produção:
  ```bash
  yarn start
  # ou
  npm run start
  ```

O servidor estará disponível em `http://localhost:3000` por padrão.

## Endpoints Principais

- `POST /pay/checkout`
  - Cria uma sessão de checkout no Stripe.
  - Exemplo de corpo da requisição:
    ```json
    {
      "userId": "<ID_do_usuario>",
    }
    ```

- `POST /webhook`
  - Recebe eventos do Stripe via Webhook.
  - Utilize a ferramenta `stripe-cli` para enviar eventos em desenvolvimento:
    ```bash
    stripe listen --forward-to localhost:3000/webhook
    ```

## Estrutura do Projeto

```
src/
├── app.module.ts          # Módulo principal
├── main.ts                # Ponto de entrada
├── stripe/                # Módulo Stripe
│   ├── stripe.module.ts
│   ├── stripe.service.ts  # Lógica de integração com Stripe
│   └── stripe.controller.ts # Rotas de pagamento e webhook
└── common/                # Pastas para pipes, guards, filters, etc.

.env                      # Variáveis de ambiente
package.json              # Scripts e dependências
tsconfig.json             # Configuração TypeScript
```

## Personalização

- Ajuste os valores de `amount` e `currency` conforme sua necessidade.
- Implemente lógica adicional no `StripeService` para lidar com produtos, assinaturas e outros recursos do Stripe.

## Contribuição

Este template serve como ponto de partida. Sinta-se à vontade para adaptar e expandir conforme seu projeto.

