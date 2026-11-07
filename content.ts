export type Locale = "pt" | "en";
export const LOCALES: Locale[] = ["en", "pt"];
export type T = Record<Locale, string>;
export const tr = (v: T, l: Locale) => v[l];

export const SITE = {
  name: "Sharadox",
  url: "https://sharadox.com",
  email: "email@sharadox.com",
  slogan: { en: "Technologies that simplify the world", pt: "Tecnologias que simplificam o mundo" },
  description: {
    en: "Sharadox designs and builds websites, platforms and apps that make complex things simple. Based in the Algarve, Portugal, working worldwide.",
    pt: "A Sharadox desenha e constrói websites, plataformas e aplicações que tornam simples o que é complexo. No Algarve, Portugal, para o mundo.",
  },
};

export const copy = {
  nav: {
    services: { en: "Services", pt: "Serviços" },
    process: { en: "Process", pt: "Processo" },
    contact: { en: "Contact", pt: "Contacto" },
    cta: { en: "Start a project", pt: "Iniciar projeto" },
  },
  hero: {
    eyebrow: { en: "Algarve, Portugal — working worldwide", pt: "Algarve, Portugal — para o mundo inteiro" },
    // Split so the last words can be styled on their own line.
    lines: {
      en: ["Technologies", "that simplify", "the world."],
      pt: ["Tecnologias", "que simplificam", "o mundo."],
    },
    sub: {
      en: "We design and build websites, platforms and apps — fast to use, effortless to run, made to last.",
      pt: "Desenhamos e construímos websites, plataformas e aplicações — rápidas de usar, fáceis de gerir, feitas para durar.",
    },
    primary: { en: "Start a project", pt: "Iniciar projeto" },
    secondary: { en: "What we build", pt: "O que construímos" },
    drag: { en: "Drag to explore", pt: "Arraste para explorar" },
  },
  statement: {
    en: "Every complex problem has a simple answer. We spend our days finding it — then we build it, beautifully.",
    pt: "Todo o problema complexo tem uma resposta simples. Passamos os dias a encontrá-la — e depois construímo-la, com cuidado.",
  },
  services: {
    eyebrow: { en: "What we build", pt: "O que construímos" },
    title: { en: "One studio. Every screen.", pt: "Um estúdio. Todos os ecrãs." },
    items: [
      {
        key: "web",
        tag: "01 — Web",
        title: { en: "Websites", pt: "Websites" },
        lead: { en: "Fast, beautiful, found.", pt: "Rápidos, bonitos, encontrados." },
        text: {
          en: "Sites that load in an instant, rank on search and turn visitors into customers — in every language your customers speak.",
          pt: "Sites que abrem num instante, aparecem nas pesquisas e transformam visitas em clientes — em todas as línguas dos seus clientes.",
        },
      },
      {
        key: "platform",
        tag: "02 — Platforms",
        title: { en: "Platforms", pt: "Plataformas" },
        lead: { en: "The engine behind the business.", pt: "O motor por trás do negócio." },
        text: {
          en: "Bookings, orders, payments, dashboards and integrations — systems that quietly remove the busywork.",
          pt: "Reservas, encomendas, pagamentos, dashboards e integrações — sistemas que eliminam o trabalho repetitivo, em silêncio.",
        },
      },
      {
        key: "apps",
        tag: "03 — Apps",
        title: { en: "Apps", pt: "Aplicações" },
        lead: { en: "In every pocket.", pt: "Em todos os bolsos." },
        text: {
          en: "iOS, Android and web apps that feel native, stay fast and get out of the way.",
          pt: "Aplicações iOS, Android e web que parecem nativas, são rápidas e não atrapalham.",
        },
      },
    ],
  },
  process: {
    eyebrow: { en: "How we work", pt: "Como trabalhamos" },
    title: { en: "Simple, on purpose.", pt: "Simples, de propósito." },
    steps: [
      { n: "01", title: { en: "Understand", pt: "Compreender" }, text: { en: "We start with your business, not with code.", pt: "Começamos pelo seu negócio, não pelo código." } },
      { n: "02", title: { en: "Design", pt: "Desenhar" }, text: { en: "Every pixel has to earn its place.", pt: "Cada pixel tem de merecer o seu lugar." } },
      { n: "03", title: { en: "Build", pt: "Construir" }, text: { en: "A modern stack, tested and fast.", pt: "Tecnologia moderna, testada e rápida." } },
      { n: "04", title: { en: "Evolve", pt: "Evoluir" }, text: { en: "Launch is the beginning. We keep improving.", pt: "O lançamento é o começo. Continuamos a melhorar." } },
    ],
  },
  stack: ["Next.js", "React", "TypeScript", "Node.js", "Swift", "Kotlin", "PostgreSQL", "AWS", "Vercel", "Three.js", "WebGL", "AI"],
  contact: {
    eyebrow: { en: "Contact", pt: "Contacto" },
    title: { en: "Let's make it simple.", pt: "Vamos simplificar." },
    text: {
      en: "Tell us what you want to build. We'll get back to you shortly.",
      pt: "Conte-nos o que quer construir. Respondemos em breve.",
    },
    name: { en: "Name", pt: "Nome" },
    email: { en: "Email", pt: "Email" },
    company: { en: "Company (optional)", pt: "Empresa (opcional)" },
    message: { en: "What are you building?", pt: "O que quer construir?" },
    send: { en: "Send message", pt: "Enviar mensagem" },
    sending: { en: "Sending…", pt: "A enviar…" },
    ok: { en: "Thank you — your message is on its way. We'll be in touch soon.", pt: "Obrigado — a sua mensagem foi enviada. Entraremos em contacto em breve." },
    errors: {
      invalid: { en: "Please fill in your name, a valid email and a message.", pt: "Preencha o nome, um email válido e a mensagem." },
      rate: { en: "Too many messages from this connection. Please try again later.", pt: "Demasiadas mensagens desta ligação. Tente mais tarde." },
      failed: { en: "Something went wrong sending your message. Email us directly at", pt: "Algo correu mal ao enviar. Escreva-nos diretamente para" },
    },
    direct: { en: "Or write to us directly", pt: "Ou escreva-nos diretamente" },
  },
  footer: {
    rights: { en: "All rights reserved.", pt: "Todos os direitos reservados." },
    top: { en: "Back to top", pt: "Voltar ao topo" },
  },
} as const;
