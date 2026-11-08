/** "What we build" section. `key` picks each card's live visual. */
export const SERVICES = {
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
  notifications: {
    en: [
      ["New booking", "Table for 4 · 8:00 PM"],
      ["Payment received", "€84.50 · Visa"],
      ["Order ready", "#2041 · Pick-up"],
      ["New customer", "Ana M. · Lisbon"],
    ],
    pt: [
      ["Nova reserva", "Mesa para 4 · 20:00"],
      ["Pagamento recebido", "€84,50 · Visa"],
      ["Encomenda pronta", "#2041 · Recolha"],
      ["Novo cliente", "Ana M. · Lisboa"],
    ],
  },
} as const;
