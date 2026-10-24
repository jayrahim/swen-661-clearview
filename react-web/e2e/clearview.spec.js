import { expect, test } from "@playwright/test";

test.describe("desktop care workflows", () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test("signs in and uses dashboard navigation", async ({ page }) => {
    await page.goto("/login");

    await expect(page).toHaveTitle("Sign in | ClearView");
    await expect(
      page.getByRole("heading", { name: "Welcome to ClearView" }),
    ).toBeVisible();

    await page.getByRole("button", { name: "Sign in" }).click();
    await expect(
      page.getByRole("heading", { name: "Good morning, Maya" }),
    ).toBeVisible();

    await page.getByRole("button", { name: "Messages · 2 unread" }).click();
    await expect(page).toHaveURL(/\/messages$/);
    await expect(page.getByRole("heading", { name: "Messages" })).toBeVisible();
  });

  test("selects a visit and receives unavailable-action feedback", async ({ page }) => {
    await page.goto("/visits");

    await page
      .getByRole("button", { name: /Nov 3.*Dr\. David Chen/i })
      .click();
    await expect(
      page.getByRole("heading", { name: "Primary care follow-up" }),
    ).toBeVisible();
    await expect(page.getByText("North clinic")).toBeVisible();

    await page.getByRole("button", { name: "Reschedule" }).click();
    await expect(page.getByRole("status")).toHaveText(
      "Rescheduling is not available in this prototype.",
    );
  });

  test("selects message and record details", async ({ page }) => {
    await page.goto("/messages");

    await page
      .getByRole("button", { name: /Vision Center.*Referral received/i })
      .click();
    await expect(
      page.getByRole("heading", { name: "Referral received" }),
    ).toBeVisible();

    await page.getByRole("link", { name: "Records" }).first().click();
    await page
      .getByRole("button", {
        name: /Cardiology Consultation.*Dr\. Elena Martinez/i,
      })
      .click();
    await expect(
      page.getByRole("heading", { name: "Cardiology Consultation" }),
    ).toBeVisible();
  });

  test("updates accessibility preferences and resets them", async ({ page }) => {
    await page.goto("/settings");

    const app = page.locator(".app-shell");
    await page.getByRole("button", { name: /Text size/i }).click();
    await expect(app).toHaveClass(/is-text-extra-large/);

    await page.getByRole("button", { name: /High contrast/i }).click();
    await expect(app).not.toHaveClass(/is-high-contrast/);

    await page.getByRole("button", { name: "Reset preferences" }).click();
    await expect(app).toHaveClass(/is-text-large/);
    await expect(app).toHaveClass(/is-high-contrast/);
  });
});

test.describe("responsive and keyboard navigation", () => {
  test("keeps the tablet visit workflow usable", async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 900 });
    await page.goto("/visits");

    await expect(page.getByRole("heading", { name: "Appointments" })).toBeVisible();
    await page
      .getByRole("button", { name: /Nov 17.*Vision Center/i })
      .click();
    await expect(
      page.getByRole("heading", { name: "Vision Center evaluation" }),
    ).toBeVisible();
  });

  test("closes the mobile navigation with Escape and restores focus", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/records");

    const menuButton = page.getByRole("button", { name: /menu/i });
    await menuButton.click();
    await expect(menuButton).toHaveAttribute("aria-expanded", "true");

    await page.keyboard.press("Escape");
    await expect(menuButton).toHaveAttribute("aria-expanded", "false");
    await expect(menuButton).toBeFocused();
  });
});
