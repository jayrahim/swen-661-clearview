import { act, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { App, getPrototypeFeedback } from "./renderer";

async function signIn(user) {
  await user.click(
    screen.getByRole("button", { name: "Sign in", exact: true }),
  );
  expect(
    screen.getByRole("heading", { name: "Good morning, Maya" }),
  ).toBeInTheDocument();
}

test("returns shared prototype feedback for known and unknown actions", () => {
  expect(getPrototypeFeedback("Forgot password")).toBe(
    "Password recovery is not available in this prototype.",
  );
  expect(getPrototypeFeedback("Export data")).toBe(
    "Export data is not available in this prototype.",
  );
});

test("supports sign-in, feedback, and the accessible home dashboard", async () => {
  const user = userEvent.setup();
  render(<App />);

  expect(
    screen.getByRole("heading", { name: "Sign in to CareConnect" }),
  ).toBeInTheDocument();
  expect(screen.getByLabelText("Email")).toHaveValue("maya.carter@example.com");
  expect(screen.getByLabelText("Password")).toHaveAttribute("type", "password");

  await user.click(screen.getByRole("button", { name: "Forgot password?" }));
  expect(screen.getByRole("status")).toHaveTextContent(
    "Password recovery is not available in this prototype.",
  );

  await signIn(user);
  expect(
    screen.getByRole("navigation", { name: "Primary navigation" }),
  ).toBeInTheDocument();
  expect(screen.getByText("Text: Standard")).toBeInTheDocument();
  expect(window.clearViewDesktop.updateMenuPreferences).toHaveBeenCalledWith({
    highContrast: false,
    reducedClutter: false,
    textSize: "Standard",
  });
});

test("renders and selects the desktop master-detail workflows", async () => {
  const user = userEvent.setup();
  render(<App />);
  await signIn(user);

  await user.click(screen.getByRole("button", { name: "Visits" }));
  await user.click(
    screen.getByRole("button", { name: /Primary care follow-up/ }),
  );
  expect(
    screen.getByRole("heading", { name: "Primary care follow-up" }),
  ).toBeInTheDocument();
  expect(
    screen.getByText("Review recent lab results and current medications."),
  ).toBeInTheDocument();

  await user.click(screen.getByRole("button", { name: "Messages" }));
  await user.click(screen.getByRole("button", { name: /Care Team/ }));
  expect(
    screen.getByRole("heading", {
      name: "Reminder: upcoming appointment",
    }),
  ).toBeInTheDocument();

  await user.click(screen.getByRole("button", { name: "Records" }));
  await user.click(
    screen.getByRole("button", { name: /Cardiology Consultation/ }),
  );
  expect(
    screen.getByRole("heading", { name: "Cardiology Consultation" }),
  ).toBeInTheDocument();
  expect(
    screen.getByText(
      "No urgent findings were identified during the consultation.",
    ),
  ).toBeInTheDocument();
});

test("applies, resets, and synchronizes accessibility preferences", async () => {
  const user = userEvent.setup();
  render(<App />);
  await signIn(user);

  await user.click(screen.getByRole("button", { name: "Settings" }));
  const preferences = screen.getByRole("region", {
    name: "Accessibility preferences",
  });

  await user.click(
    within(preferences).getByRole("button", { name: /Text size/ }),
  );
  expect(document.body).toHaveClass("text-large");
  await user.click(
    within(preferences).getByRole("button", { name: /Text size/ }),
  );
  expect(document.body).toHaveClass("text-extra-large");
  await user.click(
    within(preferences).getByRole("button", { name: /High contrast/ }),
  );
  expect(document.body).toHaveClass("high-contrast");
  await user.click(
    within(preferences).getByRole("button", { name: /Reduced clutter/ }),
  );
  expect(screen.getByText("Reduced clutter enabled.")).toBeInTheDocument();

  await user.click(
    within(preferences).getByRole("button", { name: "Reset preferences" }),
  );
  expect(document.body).not.toHaveClass("text-large");
  expect(document.body).not.toHaveClass("text-extra-large");
  expect(document.body).not.toHaveClass("high-contrast");
  expect(
    window.clearViewDesktop.updateMenuPreferences,
  ).toHaveBeenLastCalledWith({
    highContrast: false,
    reducedClutter: false,
    textSize: "Standard",
  });
});

test("handles menus, keyboard shortcuts, dialogs, and native bridge events", async () => {
  const user = userEvent.setup();
  render(<App />);
  await signIn(user);

  await user.click(screen.getByRole("button", { name: "View", exact: true }));
  await user.click(
    screen.getByRole("menuitem", { name: "Toggle high contrast" }),
  );
  expect(document.body).toHaveClass("high-contrast");

  fireEvent.keyDown(document, { key: "2", metaKey: true });
  expect(
    screen.getByRole("heading", { name: "Appointments" }),
  ).toBeInTheDocument();

  await user.click(screen.getByRole("button", { name: "Keyboard shortcuts" }));
  expect(screen.getByRole("dialog")).toBeInTheDocument();
  await user.click(screen.getByRole("button", { name: "Done" }));

  const onNavigate = window.clearViewDesktop.onNavigate.mock.calls[0][0];
  await act(async () => onNavigate("messages"));
  expect(screen.getByRole("heading", { name: "Messages" })).toBeInTheDocument();

  const onFocusSearch =
    window.clearViewDesktop.onFocusSearch.mock.calls[0][0];
  await act(async () => onFocusSearch());
  await waitFor(() =>
    expect(
      screen.getByRole("button", { name: "Search, Command or Control K" }),
    ).toHaveFocus(),
  );

  const onSetPreference =
    window.clearViewDesktop.onSetPreference.mock.calls[0][0];
  await act(async () => onSetPreference("textSize", "Large"));
  expect(document.body).toHaveClass("text-large");

  await user.click(screen.getByRole("button", { name: "File", exact: true }));
  await user.click(screen.getByRole("menuitem", { name: "Close window" }));
  expect(window.clearViewDesktop.requestClose).toHaveBeenCalledTimes(1);
});

test("covers desktop feedback actions and remaining menu paths", async () => {
  const user = userEvent.setup();
  render(<App />);

  fireEvent.keyDown(document, { key: "4", metaKey: true });
  expect(screen.getByRole("status")).toHaveTextContent(
    "Sign in to access your CareConnect information.",
  );
  await signIn(user);

  await user.click(screen.getByRole("button", { name: "View appointment" }));
  await user.click(screen.getByRole("button", { name: "Filter" }));
  expect(screen.getByRole("status")).toHaveTextContent(
    "Filtering is not available in this prototype.",
  );
  await user.click(
    screen.getByRole("button", { name: "Schedule appointment" }),
  );
  await user.click(screen.getByRole("button", { name: "Get directions" }));
  await user.click(screen.getByRole("button", { name: "Reschedule" }));
  expect(screen.getByRole("status")).toHaveTextContent(
    "Rescheduling is not available in this prototype.",
  );

  await user.click(screen.getByRole("button", { name: "Home" }));
  await user.click(screen.getByRole("button", { name: /Prescriptions/ }));
  expect(screen.getByRole("status")).toHaveTextContent(
    "Prescriptions are not available in this prototype.",
  );
  await user.click(screen.getByRole("button", { name: /Referrals/ }));
  await user.click(screen.getByRole("button", { name: /Medical notes/ }));
  expect(
    screen.getByRole("heading", { name: "Medical Notes" }),
  ).toBeInTheDocument();
  await user.click(screen.getByRole("button", { name: "Filter" }));
  await user.click(screen.getByRole("button", { name: "Message care team" }));

  await user.click(screen.getByRole("button", { name: "Messages" }));
  await user.click(screen.getByRole("button", { name: "Compose" }));
  await user.click(screen.getByRole("button", { name: "View lab results" }));
  await user.click(screen.getByRole("button", { name: "Reply" }));

  await user.click(screen.getByRole("button", { name: "Settings" }));
  await user.click(screen.getByRole("button", { name: /Color preference/ }));
  expect(screen.getByRole("status")).toHaveTextContent(
    "Color preference is not available in this prototype.",
  );

  await user.click(screen.getByRole("button", { name: "View", exact: true }));
  fireEvent.keyDown(screen.getByRole("menu"), { key: "End" });
  await user.click(screen.getByRole("menuitem", { name: "Extra Large text" }));
  await user.click(screen.getByRole("button", { name: "View", exact: true }));
  await user.click(screen.getByRole("menuitem", { name: "Standard text" }));
  expect(document.body).not.toHaveClass("text-extra-large");

  await user.click(
    screen.getByRole("button", { name: "Navigate", exact: true }),
  );
  await user.click(screen.getByRole("menuitem", { name: /^Home/ }));
  await user.click(screen.getByRole("button", { name: "Help", exact: true }));
  await user.click(
    screen.getByRole("menuitem", { name: /^Keyboard shortcuts/ }),
  );
  expect(screen.getByRole("dialog")).toBeInTheDocument();
  await user.click(
    screen.getByRole("button", { name: "Close keyboard shortcuts" }),
  );
});
