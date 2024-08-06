import { useEffect, useState } from "react";
const texts = ["Coffee", "Beer", "Gift", "Flower", "Rocket"];
const emojis = ["☕️", "🍺", "🎁", "🌹", "🚀"];
export const useTipEmoji = () => {
  const [text, setText] = useState("");
  const [emoji, setEmoji] = useState("");
  const randomIndex = Math.floor(Math.random() * texts.length);
  
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * texts.length);
    setText(texts[randomIndex]);
    setEmoji(emojis[randomIndex]);
  }, []);
  return {
    tipObject: text,
    tipEmoji: emoji,
  };
};
