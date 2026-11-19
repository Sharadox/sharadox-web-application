import { act, cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, expect, test, vi } from "vitest";
import { installBrowserEnvironment } from "@sharadox/test-web-library/browser-environment";
import { DemoBooking } from "@sharadox/sharadox-web-application/component/demo-booking";

beforeEach(() => installBrowserEnvironment());
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

test("lets the booking form be tried: it checks, takes its time, and thanks, sending nothing anywhere", async () => {
  const fetching = vi.spyOn(globalThis, "fetch");
  vi.spyOn(window, "scrollTo").mockImplementation(() => {});
  render(<DemoBooking locale="en" />);
  fireEvent.change(screen.getByLabelText(/^Name/), { target: { value: "Ana" } });
  fireEvent.change(screen.getByLabelText(/^Email/), { target: { value: "ana@example.com" } });
  await act(async () => fireEvent.submit(screen.getByRole("button", { name: /Send/i }).closest("form")!));
  await waitFor(() => expect(screen.getByRole("status").textContent).toContain("Thank you"), { timeout: 3000 });
  expect(fetching).not.toHaveBeenCalled();
});
