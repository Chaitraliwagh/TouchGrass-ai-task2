import { describe, it, expect } from "vitest";
import { planToText } from "./plan.js";

const plan = {
  activity_name: "Leaf Hunt", description: "Find leaves.", duration: "30 minutes",
  difficulty: "Easy", company: "Alone", why: "Short and calm.",
  what_to_carry: ["Water"], steps: ["Go outside", "Find 3 leaves"],
  offline_challenge: "Find 3 leaf shapes.", screen_off_goal: "No phone.", safety: "Stay in public areas.",
};

describe("planToText", () => {
  it("includes the key sections", () => {
    const text = planToText(plan);
    expect(text).toContain("Leaf Hunt");
    expect(text).toContain("1. Go outside");
    expect(text).toContain("2. Find 3 leaves");
    expect(text).toContain("Screen-Off Challenge: Find 3 leaf shapes.");
    expect(text).toContain("Safety:");
  });
});
