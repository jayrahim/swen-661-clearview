import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import App from "../src/App.jsx";

function renderApp(initialEntry = "/dashboard") {
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <App />
    </MemoryRouter>,
  );
}

function setOnline(value) {
  Object.defineProperty(window.navigator, "onLine", {
    configurable: true,
    value,
  });
}

beforeEach(() => setOnline(true));

afterEach(() => setOnline(true));

describe("ClearView primary workflows", () => {
  it("redirects legacy entry routes to sign in and enters the dashboard", async () => {
    const user = userEvent.setup();
    renderApp("/login");

    expect(
      await screen.findByRole("heading", { name: "Welcome to ClearView" }),
    ).toBeVisible();
    expect(document.title).toBe("Sign in | ClearView");

    await user.click(screen.getByRole("button", { name: "Sign in" }));

    expect(
      await screen.findByRole("heading", { name: "Good morning, Maya" }),
    ).toBeVisible();
    expect(document.title).toBe("Dashboard | ClearView");
    expect(
      screen.queryByRole("link", { name: "ClearView" }),
    ).not.toBeInTheDocument();
    expect(document.querySelector(".sidebar-brand")).toHaveTextContent(
      "ClearView",
    );
    expect(
      screen
        .getAllByRole("link", { name: "Home" })
        .some((link) => link.getAttribute("aria-current") === "page"),
    ).toBe(true);
  });

  it("navigates from dashboard quick access and announces unavailable actions", async () => {
    const user = userEvent.setup();
    renderApp();

    await user.click(screen.getByRole("button", { name: "Messages · 2 unread" }));
    expect(
      await screen.findByRole("heading", { name: "Messages" }),
    ).toBeVisible();

    await user.click(screen.getAllByRole("link", { name: "Home" })[0]);
    await user.click(screen.getByRole("button", { name: "Prescriptions" }));

    expect(screen.getByRole("status")).toHaveTextContent(
      "Prescriptions are not available in this prototype.",
    );

    await user.click(screen.getByRole("button", { name: "Referrals" }));
    expect(screen.getByRole("status")).toHaveTextContent(
      "Referrals are not available in this prototype.",
    );
  });

  it("shows an appointment's selected detail and unavailable action feedback", async () => {
    const user = userEvent.setup();
    renderApp("/visits");

    await user.click(
      screen.getByRole("button", { name: /Nov 3 · Dr. David Chen/i }),
    );

    expect(
      screen.getByRole("heading", { name: "Primary care follow-up" }),
    ).toBeVisible();
    expect(screen.getByText("North clinic")).toBeVisible();

    await user.click(screen.getByRole("button", { name: "Get directions" }));
    expect(screen.getByRole("status")).toHaveTextContent(
      "Directions are not available in this prototype.",
    );
  });

  it("updates message and medical-note details through their list controls", async () => {
    const user = userEvent.setup();
    renderApp("/messages");

    await user.click(
      screen.getByRole("button", { name: /Vision Center Referral received/i }),
    );
    expect(
      screen.getByRole("heading", { name: "Referral received" }),
    ).toBeVisible();

    await user.click(screen.getByRole("button", { name: "Reply" }));
    expect(screen.getByRole("status")).toHaveTextContent(
      "Replying is not available in this prototype.",
    );

    await user.click(screen.getAllByRole("link", { name: "Records" })[0]);
    await user.click(
      screen.getByRole("button", {
        name: /Cardiology Consultation Dr. Elena Martinez/i,
      }),
    );

    expect(
      screen.getByRole("heading", { name: "Cardiology Consultation" }),
    ).toBeVisible();
    await user.click(screen.getByRole("button", { name: "Message care team" }));
    expect(screen.getByRole("status")).toHaveTextContent(
      "Messaging the care team is not available in this prototype.",
    );
  });

  it("cycles accessibility preferences and restores their defaults", async () => {
    const user = userEvent.setup();
    renderApp("/settings");

    const textSize = screen.getByRole("button", { name: /Text size/i });
    await user.click(textSize);
    expect(textSize).toHaveTextContent("Extra large");

    const contrast = screen.getByRole("button", { name: /High contrast/i });
    await user.click(contrast);
    expect(contrast).toHaveTextContent("Off");

    await user.click(screen.getByRole("button", { name: "Reset preferences" }));
    expect(textSize).toHaveTextContent("Large");
    expect(contrast).toHaveTextContent("On");
  });

  it("explains prototype-only actions across the core pages", async () => {
    const user = userEvent.setup();
    renderApp("/visits");

    await user.click(screen.getByRole("button", { name: "Filter" }));
    expect(screen.getByRole("status")).toHaveTextContent(
      "Filter options are not available in this prototype.",
    );

    const scheduleButtons = screen.getAllByRole("button", {
      name: "Schedule appointment",
    });
    await user.click(scheduleButtons[0]);
    expect(screen.getByRole("status")).toHaveTextContent(
      "Scheduling is not available in this prototype.",
    );

    await user.click(scheduleButtons[1]);
    expect(screen.getByRole("status")).toHaveTextContent(
      "Scheduling is not available in this prototype.",
    );

    await user.click(screen.getByRole("button", { name: "Reschedule" }));
    expect(screen.getByRole("status")).toHaveTextContent(
      "Rescheduling is not available in this prototype.",
    );

    await user.click(screen.getAllByRole("link", { name: "Messages" })[0]);
    await user.click(screen.getByRole("button", { name: "Compose" }));
    expect(screen.getByRole("status")).toHaveTextContent(
      "Composing a message is not available in this prototype.",
    );

    await user.click(screen.getByRole("button", { name: "View lab results" }));
    expect(screen.getByRole("status")).toHaveTextContent(
      "Lab results are not available in this prototype.",
    );

    await user.click(screen.getAllByRole("link", { name: "Records" })[0]);
    await user.click(screen.getByRole("button", { name: "Filter" }));
    expect(screen.getByRole("status")).toHaveTextContent(
      "Filter options are not available in this prototype.",
    );
  });
});

describe("ClearView progressive enhancement and keyboard support", () => {
  it("closes the mobile menu with Escape and returns focus to its trigger", async () => {
    const user = userEvent.setup();
    renderApp();

    const menuButton = screen.getByRole("button", { name: "Open menu" });
    await user.click(menuButton);
    expect(menuButton).toHaveAttribute("aria-expanded", "true");

    fireEvent.keyDown(window, { key: "Escape" });
    await waitFor(() =>
      expect(menuButton).toHaveAttribute("aria-expanded", "false"),
    );
    expect(menuButton).toHaveFocus();
  });

  it("reports an offline state and supports the browser install prompt when offered", async () => {
    const user = userEvent.setup();
    setOnline(false);
    renderApp();

    expect(screen.getByRole("status")).toHaveTextContent(
      "You are offline. ClearView can show content that was previously loaded.",
    );

    const prompt = jest.fn().mockResolvedValue();
    const installEvent = new Event("beforeinstallprompt", { cancelable: true });
    Object.defineProperties(installEvent, {
      prompt: { value: prompt },
      userChoice: { value: Promise.resolve({ outcome: "accepted" }) },
    });
    fireEvent(window, installEvent);

    const installButtons = await screen.findAllByRole("button", {
      name: "Install app",
    });
    await user.click(installButtons[0]);

    expect(prompt).toHaveBeenCalledTimes(1);
    expect(
      await screen.findByText("ClearView installation was accepted."),
    ).toBeVisible();
  });

  it("announces installation completion from the browser", async () => {
    renderApp();

    fireEvent(window, new Event("appinstalled"));

    expect(
      await screen.findByText("ClearView is installed and ready to open as an app."),
    ).toBeVisible();
  });

  it("reports when the browser install prompt is dismissed", async () => {
    const user = userEvent.setup();
    renderApp();

    const installEvent = new Event("beforeinstallprompt", { cancelable: true });
    Object.defineProperties(installEvent, {
      prompt: { value: jest.fn().mockResolvedValue() },
      userChoice: { value: Promise.resolve({ outcome: "dismissed" }) },
    });
    fireEvent(window, installEvent);

    await user.click(
      (await screen.findAllByRole("button", { name: "Install app" }))[0],
    );
    expect(
      await screen.findByText("ClearView installation was dismissed."),
    ).toBeVisible();
  });
});
