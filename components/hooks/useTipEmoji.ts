import { useMemo } from "react";

const TIPS = [
  { text: "Coffee", emoji: "☕️" },
  { text: "Beer", emoji: "🍺" },
  { text: "Gift", emoji: "🎁" },
  { text: "Flower", emoji: "🌹" },
  { text: "Rocket", emoji: "🚀" },
] as const;

export const useTipEmoji = () => {
  const { text, emoji } = useMemo(() => {
    const randomIndex = Math.floor(Math.random() * TIPS.length);
    return TIPS[randomIndex];
  }, []);

  return {
    tipObject: text,
    tipEmoji: emoji,
  };
};