import { cyclePreference, defaultPreferences } from "../src/preferences.js";

describe("preference helpers", () => {
  it("defines the accessible default preference set", () => {
    expect(defaultPreferences).toEqual({
      text: "Large",
      contrast: "On",
      clutter: "Off",
      color: "Cool",
    });
  });

  it("cycles a preference and recovers from an unknown value", () => {
    expect(cyclePreference("Large", ["Standard", "Large", "Extra large"])).toBe(
      "Extra large",
    );
    expect(cyclePreference("Unknown", ["Off", "On"])).toBe("Off");
  });

  it("keeps the current preference when no options are available", () => {
    expect(cyclePreference("On", [])).toBe("On");
  });
});
