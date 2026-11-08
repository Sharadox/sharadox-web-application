import { render, screen } from "@testing-library/react";
import { expect, it } from "vitest";
import { Reveal } from ".";

it("renders its children", () => {
  render(<Reveal>Inside</Reveal>);
  expect(screen.getByText("Inside")).toBeTruthy();
});
