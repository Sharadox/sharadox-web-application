import type { Metadata } from "next";
import { NotFoundPage } from "@sharadox/sharadox-web-application/component/not-found-page";

export const metadata: Metadata = { title: "404" };

export default function NotFound() {
  return <NotFoundPage />;
}
