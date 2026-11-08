import { render, screen } from "@testing-library/react";
import { expect, it } from "vitest";
import { Button } from ".";

it("renders a link with href and a button without", () => {
  render(
    <>
      <Button href="#contact">Go</Button>
      <Button disabled>Send</Button>
    </>,
  );
  expect(screen.getByRole("link", { name: "Go" }).getAttribute("href")).toBe("#contact");
  expect((screen.getByRole("button", { name: "Send" }) as HTMLButtonElement).disabled).toBe(true);
});
