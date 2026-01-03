/**
 * V6 Design System Colors
 * Based on Pitch Figma Template
 */

export const V6_COLORS = {
  red: "#FF3C1F",
  darkBrown: "#5C1A11",
  lavender: "#D4B8F0",
  beige: "#F5F1ED",
  textBrown: "#B85C4A",
  white: "#ffffff",
  black: "#000000",
  // Extended palette for section separation
  green: "#157145",
  blue: "#3685B5",
  navy: "#141B41",
} as const;

export type V6Color = keyof typeof V6_COLORS;
