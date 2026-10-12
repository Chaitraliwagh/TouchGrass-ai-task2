export const PLAN_FOOTER = "Plan made with TouchGrass AI (Gemma). Now close the screen and go outside!";

export function planToText(plan) {
  const lines = [
    `🌱 ${plan.activity_name}`,
    plan.description,
    "",
    `Duration: ${plan.duration}`,
    `Difficulty: ${plan.difficulty}`,
    plan.company ? `Company: ${plan.company}` : null,
    "",
    `Why this suits you: ${plan.why}`,
    "",
    "What to carry:",
    ...plan.what_to_carry.map((i) => `- ${i}`),
    "",
    "Steps:",
    ...plan.steps.map((s, i) => `${i + 1}. ${s}`),
    "",
    `Screen-Off Challenge: ${plan.offline_challenge}`,
    `Screen-off goal: ${plan.screen_off_goal}`,
    "",
    `Safety: ${plan.safety}`,
    "",
    PLAN_FOOTER,
  ];
  return lines.filter((l) => l !== null).join("\n");
}
