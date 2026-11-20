import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { Showcase } from "@sharadox/luis-pires-decor-web-library/component/showcase";
import { showcaseChapters } from "@sharadox/luis-pires-decor-web-library/component/showcase-chapters";
import { ProjectPage } from "@sharadox/sharadox-web-library/component/project-page";
import type { Project } from "@sharadox/sharadox-web-library/component/portfolio/type";
import type { Locale } from "@sharadox/sharadox-web-library/content/locale/type";
import { PORTFOLIO } from "@sharadox/sharadox-web-library/content/portfolio";
import { separated } from "@sharadox/web-library/text/separated";
import { translate } from "@sharadox/internationalization-web-library/translate";
import { PageFrame } from "@sharadox/sharadox-web-library/component/page-frame";
import { siteMetadata } from "@sharadox/sharadox-web-library/utility/site-metadata";

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

/** This site's top bar (64 px and its hairline): what the client's components stick under it. */
const BAR_HEIGHT = 65;

/**
 * Each project's chapters: one part of its website we're proud of per chapter key, the component itself, running
 * live (not the whole page). The client's library says which parts.
 */
const SHOWCASES: Record<Project["key"], (locale: Locale) => ProjectChapters> = {
  "luis-pires-decor-website-and-rebranding": (locale) =>
    showcaseChapters({ locale, demo: translate(PORTFOLIO.page.demo, locale) }),
};
type ProjectChapters = Partial<Record<Project["chapters"][number]["key"], ReactNode>>;

const projectOf = (key: string) => PORTFOLIO.projects.find((project) => project.key === key);

export const dynamicParams = false;
export const generateStaticParams = () => PORTFOLIO.projects.map((project) => ({ project: project.key }));

export async function generateMetadata({ params }: PageProps<"/[locale]/portfolio/[project]">): Promise<Metadata> {
  const { locale, project: key } = (await params) as { locale: Locale; project: string };
  const project = projectOf(key)!;
  // "<project> · Sharadox Portfolio" already names the site: no " · Sharadox" after it.
  const title = separated(project.title, translate(PORTFOLIO.pageTitle, locale));
  const metadata = siteMetadata({
    locale,
    path: `${PORTFOLIO.path}/${project.key}`,
    title,
    description: translate(project.text, locale),
  });
  return { ...metadata, title: { absolute: title } };
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
      <Showcase
        key={chapter}
        origin={project.url}
        fontClassName={`${display.variable} ${body.variable}`}
        barHeight={BAR_HEIGHT}
      >
        {content}
      </Showcase>,
    ]),
  );
  return (
    <PageFrame locale={locale} path={path}>
      <ProjectPage project={project} locale={locale} chapters={live} />
    </PageFrame>
  );
}
