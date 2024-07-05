import { useEffect, useState } from "react";
const texts = ["Coffee", "Beer", "Gift", "Flower"];
const emojis = ["☕️", "🍺", "🎁", "🌹"];
export const useTipEmoji = () => {
  const [text, setText] = useState("");
  const [emoji, setEmoji] = useState("");
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * texts.length);
    setText(texts[randomIndex]);
    setEmoji(emojis[randomIndex]);
  }, []);
  return {
    tipText: text,
    tipEmoji: emoji,
  };
};
