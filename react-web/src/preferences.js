export const defaultPreferences = Object.freeze({
  text: "Large",
  contrast: "On",
  clutter: "Off",
  color: "Cool",
});

export function cyclePreference(currentValue, values) {
  if (values.length === 0) return currentValue;

  const currentIndex = values.indexOf(currentValue);
  return values[(currentIndex + 1) % values.length];
}
