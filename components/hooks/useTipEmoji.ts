import { useEffect, useState } from "react";

const TIPS = [
  { text: "Coffee", emoji: "☕️" },
  { text: "Tea", emoji: "🍵" },
  { text: "Boba Tea", emoji: "🧋" },
  { text: "Drumstick", emoji: "🍗" },
  { text: "Lollipop", emoji: "🍭" },
  { text: "Cupcake", emoji: "🧁" },
  { text: "Donut", emoji: "🍩" },
  { text: "Pizza", emoji: "🍕" },
  { text: "Cookie", emoji: "🍪" },
  { text: "Beer", emoji: "🍺" },
  { text: "Flower", emoji: "🌹" },
  { text: "Gem", emoji: "💎" },
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