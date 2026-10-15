<div align="center">

<img src="assets/img/og-image.webp" alt="Graceful Cleaning Services" width="720">

# Graceful Cleaning Services

**Site one-page de uma empresa de limpeza residencial e comercial em Framingham, Massachusetts.**
Feito para quem chega pelo celular, vindo do Google e do Meta Ads, e quer pedir um orçamento em poucos toques.

![HTML5](https://img.shields.io/badge/HTML5-semântico-3F4F3C?style=flat-square&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-sem%20framework-3F4F3C?style=flat-square&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-vanilla-3F4F3C?style=flat-square&logo=javascript&logoColor=white)
![Build](https://img.shields.io/badge/build-nenhum-C83C7D?style=flat-square)
![Hostinger](https://img.shields.io/badge/deploy-Hostinger-C83C7D?style=flat-square&logo=hostinger&logoColor=white)

[Site](https://gracefulcleaningservicesma.com) · [Estrutura](#-estrutura) · [Rodar localmente](#-rodar-localmente) · [Publicar](#-publicar-na-hostinger)

</div>

---

## ✦ Sobre

Página única, em inglês, para o público americano da Graceful Cleaning Services. O objetivo é um só: o visitante entender a oferta em segundos, confiar na empresa e pedir um orçamento pelo formulário, por mensagem de texto ou por ligação.

Não tem framework, dependência nem etapa de build. São três arquivos de código (`index.html`, `styles.css`, `main.js`) e as imagens.

## ✦ Destaques

| | |
|---|---|
| **Hero em tela cheia** | Foto sob véu verde, tipografia mista (script + condensada) e uma faixa inclinada em loop com as promessas da marca. Sempre ocupa 100% da altura, do notebook ao monitor. |
| **Serviços em bento** | Cinco cards com foto, com o serviço principal em destaque e ícones Phosphor em duotone. |
| **Antes e depois** | Quarto e fogão lado a lado, estáticos, na mesma moldura da sala; a sala tem comparador arrastável que funciona com mouse, toque e teclado. |
| **Orçamento em 3 passos** | Validação por etapa, máscara de telefone americano `(508) 395-9441`, foco e anúncios para leitores de tela a cada passo. |
| **Mobile primeiro** | Barra fixa *Text · Call · Book Now*, áreas de toque de 44px e textos a partir de 14px. |
| **Acessível** | Skip link, foco visível, contraste revisado e respeito a `prefers-reduced-motion`. |
| **Pronto para hospedar** | `.htaccess` com 404 própria, cache, compressão e bloqueio de indexação só no ambiente de testes. |

## ✦ Identidade

**Cores**

![Forest](https://img.shields.io/badge/Forest-3F4F3C-3F4F3C?style=for-the-badge)
![Forest Deep](https://img.shields.io/badge/Forest%20Deep-2F3B2C-2F3B2C?style=for-the-badge)
![Sage](https://img.shields.io/badge/Sage-737C70-737C70?style=for-the-badge)
![Pink](https://img.shields.io/badge/Pink-EC6FA7-EC6FA7?style=for-the-badge)
![Pink Action](https://img.shields.io/badge/Pink%20Action-C83C7D-C83C7D?style=for-the-badge)
![Blush](https://img.shields.io/badge/Blush-FBEFF5-FBEFF5?style=for-the-badge&labelColor=F6D9E7)

O rosa `#EC6FA7` é decorativo (brilhos e detalhes). Em botões e links usamos `#C83C7D`, que tem contraste de 4,7:1 sobre branco.

**Tipografia** (Google Fonts)

| Fonte | Uso |
|---|---|
| **Sora** | Títulos |
| **Figtree** | Textos e interface |
| **Anton** | Títulos condensados em destaque |
| **Kaushan Script** | Palavras em script sobrepostas |
| **Space Mono** | Rótulos pequenos |

## ✦ Estrutura

```
.
├── index.html            # o site
├── 404.html              # página de erro no mesmo estilo
├── privacy-policy.html   # política de privacidade
├── terms-of-use.html     # termos de uso
├── clear-cache.html      # força o navegador a buscar a versão nova do site
├── redirect.html         # cartão de visitas em /redirect (QR code, bio das redes)
├── assets/
│   ├── css/styles.css    # todo o visual (tokens em :root)
│   ├── js/main.js        # interações, comparador e formulário
│   ├── js/antispam.js    # proteção do formulário contra spam
│   ├── img/              # fotos em WebP + og-image
│   └── logo/             # logos e ícones (192, 512, maskable, apple-touch)
├── .well-known/
│   └── security.txt      # contato para avisos de segurança (renovar até 15/10/2027)
├── favicon.ico           # ícone da aba (16, 32 e 48 px)
├── site.webmanifest      # nome, cores e ícones para Android e "adicionar à tela"
├── humans.txt            # créditos
├── llms.txt              # resumo da empresa para assistentes de IA
├── robots.txt            # produção
├── robots-staging.txt    # servido como robots.txt só no staging
└── sitemap.xml
```

## ✦ Rodar localmente

Qualquer servidor estático serve. Dentro da pasta do projeto:

```bash
npx serve .
# ou
python -m http.server 8000
```

Abra `http://localhost:3000` (ou `:8000`). O `index.html` também abre direto do disco, com dois cliques.

## ✦ Publicar na Hostinger

Domínio: **https://gracefulcleaningservicesma.com** (o `www` redireciona para o endereço sem `www`).

1. A configuração do servidor (`.htaccess`) e o script que monta o pacote de upload ficam no repositório privado de produção.
2. Envie os arquivos públicos para o `public_html` do domínio. A pasta `.well-known` fica oculta no Windows: confira se subiu.
3. No hPanel, ative **Force HTTPS**.
4. Confira:
   - `/qualquer-coisa` mostra a 404 da Graceful;
   - `www.gracefulcleaningservicesma.com` vai para o endereço sem `www`;
   - `/README.md` devolve 404;
   - um pedido de teste no formulário chega no e-mail e na plataforma de leads.

Se alguém continuar vendo a versão antiga depois de uma atualização, mande o link `/clear-cache.html`.

O cartão de visitas fica em `redirect.html` (texto, ligação, orçamento, site e e-mail), para QR code e bio das redes. Não entra no Google (`noindex`). No servidor, uma regra deixa a página disponível em `/redirect`.

O ambiente de testes (`graceful.escolats.com.br`) continua recebendo `X-Robots-Tag: noindex` e o `robots.txt` bloqueado. No domínio final, nada disso se aplica.

## ✦ Configuração

| O quê | Onde |
|---|---|
| **Envio do formulário** | O formulário `form01` envia para o [Web3Forms](https://web3forms.com): troque `YOUR_WEB3FORMS_ACCESS_KEY` no `index.html`. Para mandar uma cópia de cada lead a um webhook, adicione `data-lead-webhook="https://..."` no `<form>`. A cópia nunca bloqueia o envio. Sem a chave, o formulário pede para o visitante mandar mensagem. |
| **Antispam** | `assets/js/antispam.js`: dois campos-armadilha invisíveis (`botcheck`, `company_website`), no mínimo 4 s na página com um clique, toque ou tecla de verdade, nenhum link nas respostas e até 4 envios por hora por navegador. Robô recebe o "obrigado" e nada é enviado. Ative também o filtro de spam no painel do Web3Forms. |
| **Domínio** | `https://gracefulcleaningservicesma.com` aparece no topo do `index.html` (`canonical`, `og:url`, `og:image`, `twitter:image`, `ld+json`), no `canonical` das páginas legais, no `robots.txt`, no `sitemap.xml`, no `llms.txt`, no `humans.txt` e no `.well-known/security.txt`. |
| **Antes e depois** | Pares de fotos por cômodo em `assets/js/main.js`, no objeto `ROOMS`. |
| **Fotos** | Substitua os arquivos em `assets/img/` mantendo os nomes, e atualize o `alt` no HTML. |
| **Cache** | Ao alterar CSS ou JS, mude o `?v=` nos links de `index.html`, `404.html`, `privacy-policy.html` e `terms-of-use.html`. O servidor guarda esses arquivos em cache por um ano. |

## ✦ Créditos

- **Desenvolvimento:** [Eu Sou TS](https://eusouts.com.br/)
- **Ícones de serviço:** [Phosphor Icons](https://phosphoricons.com) (MIT)
- **Fontes:** Google Fonts (SIL Open Font License)

---

<div align="center">
<sub>© 2026 Graceful Cleaning Services. Todos os direitos reservados. Código e marca não podem ser reutilizados sem autorização.</sub>
</div>
