import { act, cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, expect, test, vi } from "vitest";
import { installBrowserEnvironment } from "@sharadox/test-web-library/browser-environment";
import { DemoBooking, sendNothing } from "@sharadox/sharadox-web-application/component/demo-booking";

beforeEach(() => installBrowserEnvironment());
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

test("lets the booking form be tried: it checks, then says it's a demo, sending nothing anywhere", async () => {
  const fetching = vi.spyOn(globalThis, "fetch");
  render(<DemoBooking locale="en" demo="Just a demo." />);
  fireEvent.change(screen.getByLabelText(/^Name/), { target: { value: "Ana" } });
  fireEvent.change(screen.getByLabelText(/^Phone/), { target: { value: "912 345 678" } });
  await act(async () => fireEvent.submit(screen.getByRole("button", { name: /Send/i }).closest("form")!));
  await waitFor(() => expect(screen.getByRole("status").textContent).toBe("Just a demo."));
  expect(fetching).not.toHaveBeenCalled();
  expect(await sendNothing()).toEqual({ status: "idle" });
});
