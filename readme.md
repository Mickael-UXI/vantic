# Vantic

Landing page de um SaaS fictício de automação de fluxos de trabalho e visibilidade
de processos em tempo real. HTML, CSS e JavaScript puros — sem framework, sem
build, sem dependências de runtime.

![Tema](<img width="959" height="446" alt="image" src="https://github.com/user-attachments/assets/da672313-9c9b-4977-8818-3e367e8a9d39" />
)
![Stack](<img width="959" height="446" alt="image" src="https://github.com/user-attachments/assets/54ffd124-66a9-4266-96ca-5c142ea7734a" />
)
![Dependências](<img width="959" height="445" alt="image" src="https://github.com/user-attachments/assets/3d52b9fe-5f91-4b95-8c62-306f50b5da9b" />
)

## Sobre

A Vantic conecta os fluxos de trabalho entre times — aprovações, faturamento,
atendimento — e mostra em um painel único onde cada processo está agora. Este
repositório contém a landing page do produto: hero com um console do produto
"ao vivo", seção de recursos, como funciona, preços, depoimentos e captura de
lead.

## Identidade visual

| Elemento | Escolha | Por quê |
|---|---|---|
| Fundo | Grafite quase-preto (`#0a0a0c`) | Base neutra, sem virar preto puro |
| Cor de destaque | Âmbar/cobre (`#e3a455`) | "Sinal ao vivo" de um painel de operações, não o azul/verde-água padrão de SaaS |
| Título | [Fraunces](https://fonts.google.com/specimen/Fraunces) (serifada) | Dá calor a um fundo técnico escuro |
| Corpo/UI | [Inter](https://fonts.google.com/specimen/Inter) | Legibilidade em interface |
| Dados/números | [IBM Plex Mono](https://fonts.google.com/specimen/IBM+Plex+Mono) | Métricas e preços como dados reais, não decoração |

O plano de design completo — paleta, tipografia, layout e princípios — está em
[`design-plan.md`](./design-plan.md).

## Recursos

- Console do produto no hero com métricas que contam ao entrar na tela e
  linhas de status que se atualizam sozinhas, simulando tempo real
- Linha de fluxo vertical que acende conforme o scroll, ligando hero → recursos
  → como funciona → preços → depoimentos → CTA
- Diagrama SVG animado na seção "como funciona"
- Seção de preços com três planos (Starter, Business, Enterprise)
- Depoimentos em carrossel contínuo (marquee), pausável via teclado
- Entrada em cascata no carregamento e revelação em cascata ao rolar
- Formulário de captura de lead com validação e feedback inline
- Totalmente responsivo, com foco visível no teclado e suporte a
  `prefers-reduced-motion`

## Estrutura

```
.
├── index.html   # Marcação e conteúdo
├── style.css    # Design tokens, layout, componentes e animações
├── script.js    # Menu mobile, scroll, console "ao vivo", formulário
└── README.md
```

## Como usar

Não há passo de build. Basta abrir o arquivo no navegador:

```bash
git clone https://github.com/seu-usuario/vantic.git
cd vantic
open index.html   # macOS
# ou: xdg-open index.html (Linux) / start index.html (Windows)
```

Para servir com live-reload durante o desenvolvimento, qualquer servidor
estático funciona, por exemplo:

```bash
npx serve .
# ou
python3 -m http.server 8000
```

## Personalizando

- **Cores e espaçamentos**: tudo fica em variáveis CSS no topo de `style.css`,
  na seção `1. TOKENS`.
- **Textos**: editar diretamente em `index.html`.
- **Planos de preço**: seção `#precos` em `index.html` — cada plano é um
  `<article class="price-card">`.
- **Depoimentos**: seção `#clientes` — os quatro últimos `<article>` são
  duplicatas `aria-hidden` usadas só para o loop contínuo do carrossel; ao
  editar um depoimento, replique a mudança na cópia correspondente.

## Acessibilidade

- Link de "pular para o conteúdo" no topo da página
- Estados de foco visíveis (`:focus-visible`) em toda a navegação
- `aria-live` no feedback do formulário de captura
- Animações e o carrossel de depoimentos respeitam
  `prefers-reduced-motion: reduce`

## Licença

Uso livre para fins de estudo e como base de projeto pessoal.
