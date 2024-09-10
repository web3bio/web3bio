import { useEffect, useState } from "react";

const TIPS = [
  { text: "Coffee", emoji: "☕️" },
  { text: "Beer", emoji: "🍺" },
  { text: "Gift", emoji: "🎁" },
  { text: "Flower", emoji: "🌹" },
  { text: "Rocket", emoji: "🚀" },
] as const;

export const useTipEmoji = () => {
  const [tipObject, setTipObject] = useState("");
  const [tipEmoji, setTipEmoji] = useState("");

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * TIPS.length);
    const { text, emoji } = TIPS[randomIndex];
    setTipObject(text);
    setTipEmoji(emoji);
  }, []);

  return {
    tipObject,
    tipEmoji,
  };
};