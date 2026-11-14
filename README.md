# Pese Menos 🥗

App mobile (React Native + Expo) para ajudar a emagrecer: registro de refeições, água e exercícios, com cálculo de calorias, peso estimado em tempo real e planos de 3, 6, 9 e 12 meses.

## Funcionalidades

- **Início**: peso atual estimado (recalculado com base no que você come e gasta), botão "Me pesei" para corrigir com a balança, progresso até a meta, resumo do dia e mensagem motivacional.
- **Refeições**: café, lanche, almoço, café da tarde, jantar e ceia. Busca de alimentos com medidas caseiras (colher de chá/sopa/servir, concha, unidade, fatia, copo, gramas…) e cálculo de kcal, proteína, carboidrato e gordura. Alimento manual se não estiver no banco.
- **Água e bebidas**: água, sucos, refrigerante, café etc. (bebidas com calorias entram na conta).
- **Exercícios**: caminhada, corrida, esteira, bicicleta — tempo, velocidade, distância e calorias (estimadas por METs ou informadas pelo aparelho).
- **Plano**: meta calórica diária, minutos de caminhada sugeridos, marcos de 3/6/9/12 meses (esperado × real), cardápio personalizado, alimentos a priorizar e a evitar (respeitando alergias, gostos e desgostos).
- **Ajustes**: alarmes por refeição (o lembrete só dispara se você ainda não registrou), mensagem matinal, meta de água, edição de perfil.

## Como os cálculos funcionam

- Gasto basal: fórmula Mifflin-St Jeor.
- 1 kg de gordura ≈ 7.700 kcal.
- Peso estimado = última pesagem + Σ (consumido − gasto basal − exercícios) / 7.700, apenas em dias com registro.
- Déficit limitado a níveis seguros (mín. 1200 kcal mulheres / 1500 homens); o restante vira meta de exercício.

> Valores são estimativas e não substituem acompanhamento profissional.

## Rodando

```bash
npm install
npx expo install --fix   # alinha versões com o SDK do Expo instalado
npx expo start
```

Abra no celular com o app **Expo Go** (lendo o QR code). Para notificações completas no Android, gere um build de desenvolvimento: `npx expo run:android` ou `eas build`.

## Gerar APK (Android)

```bash
npm install -g eas-cli
eas login
eas build -p android --profile preview
```

Ao final, o EAS mostra um link/QR code para baixar e instalar o APK no celular.

## Estrutura

```
App.tsx                  navegação por abas
src/data/                banco de alimentos, bebidas, mensagens
src/logic/calc.ts        cálculos (TMB, plano, METs, peso estimado, dieta)
src/logic/notifications  agendamento de lembretes
src/store/               estado global + persistência (AsyncStorage)
src/screens/             telas
```
