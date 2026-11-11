import { notFound } from "next/navigation";

// Any address under a locale that no page answers: the localized 404 (./not-found.tsx), with a 404 status.
export const dynamicParams = true;

export default function Missing() {
  notFound();
}
