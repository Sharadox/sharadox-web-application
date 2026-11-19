import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { Atelier } from "@sharadox/luis-pires-decor-web-library/component/atelier";
import { FabricStudio } from "@sharadox/luis-pires-decor-web-library/component/fabric-studio";
import { Hero } from "@sharadox/luis-pires-decor-web-library/component/hero";
import { Places } from "@sharadox/luis-pires-decor-web-library/component/places";
import { Process } from "@sharadox/luis-pires-decor-web-library/component/process";
import { Sequence } from "@sharadox/luis-pires-decor-web-library/component/sequence";
import { Showcase } from "@sharadox/luis-pires-decor-web-library/component/showcase";
import { Work } from "@sharadox/luis-pires-decor-web-library/component/work";
import { BOOKING } from "@sharadox/luis-pires-decor-web-library/content/booking";
import { DemoBooking } from "@sharadox/sharadox-web-application/component/demo-booking";
import { Consent } from "@sharadox/sharadox-web-library/component/consent";
import { Footer } from "@sharadox/sharadox-web-library/component/footer";
import { Navigation } from "@sharadox/sharadox-web-library/component/navigation";
import { ProjectPage } from "@sharadox/sharadox-web-library/component/project-page";
import type { Project } from "@sharadox/sharadox-web-library/component/portfolio/type";
import { LOCALES } from "@sharadox/sharadox-web-library/content/locale";
import type { Locale } from "@sharadox/sharadox-web-library/content/locale/type";
import { PORTFOLIO } from "@sharadox/sharadox-web-library/content/portfolio";
import { SITE } from "@sharadox/sharadox-web-library/content/site";
import { separate } from "@sharadox/sharadox-web-library/utility/separate";
import { translate } from "@sharadox/internationalization-web-library/translate";
import { pageMetadata } from "@sharadox/metadata-web-library/page-metadata";
import { Cursor } from "@sharadox/pointer-web-library/cursor";

/** Luis Pires Decor's type, for its components shown here. */
const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});
const body = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-manrope",
  display: "swap",
});

/** Each project's chapters: its website's own components, running live, by chapter key. */
const SHOWCASES: Record<Project["key"], (locale: Locale) => ProjectChapters> = {
  "luis-pires-decor": (locale) => ({
    hero: (
      <>
        <Hero locale={locale} />
        <Places locale={locale} />
        <Atelier locale={locale} />
      </>
    ),
    sequence: <Sequence locale={locale} phone="overlay" />,
    fabric: <FabricStudio locale={locale} />,
    work: <Work locale={locale} more={false} />,
    process: <Process locale={locale} />,
    booking: (
      <div id={BOOKING.id}>
        <DemoBooking locale={locale} />
      </div>
    ),
  }),
};
type ProjectChapters = Partial<Record<Project["chapters"][number]["key"], ReactNode>>;

const projectOf = (key: string) => PORTFOLIO.projects.find((project) => project.key === key);

export const dynamicParams = false;
export const generateStaticParams = () => PORTFOLIO.projects.map((project) => ({ project: project.key }));

export async function generateMetadata({ params }: PageProps<"/[locale]/portfolio/[project]">): Promise<Metadata> {
  const { locale, project: key } = (await params) as { locale: Locale; project: string };
  const project = projectOf(key)!;
  return pageMetadata({
    name: SITE.name,
    url: SITE.url,
    locales: LOCALES,
    locale,
    path: `${PORTFOLIO.path}/${project.key}`,
    title: separate(project.client, SITE.name),
    description: translate(project.text, locale),
    image: { path: `/${locale}/opengraph-image`, alt: SITE.name },
  });
}

export default async function ProjectRoute({ params }: PageProps<"/[locale]/portfolio/[project]">) {
  const { locale, project: key } = (await params) as { locale: Locale; project: string };
  const project = projectOf(key);
  if (!project) notFound();
  const path = `${PORTFOLIO.path}/${project.key}`;
  // Each live part sits in the client's own look, its photos loading from the client's site.
  const live = Object.fromEntries(
    Object.entries(SHOWCASES[project.key](locale)).map(([chapter, content]) => [
      chapter,
      <Showcase key={chapter} origin={project.url} fontClassName={`${display.variable} ${body.variable}`}>
        {content}
      </Showcase>,
    ]),
  );
  return (
    <>
      <Cursor />
      <Navigation locale={locale} path={path} />
      <main>
        <ProjectPage project={project} locale={locale} chapters={live} />
      </main>
      <Footer locale={locale} path={path} />
      <Consent locale={locale} />
    </>
  );
}
