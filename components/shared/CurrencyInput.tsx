import { useState } from "react";

export default function CurrencyInput(props) {
  const [amount, setAmount] = useState(0);
  return (
    <input
      className="token-input"
      value={amount}
      onChange={(e) => setAmount(Number(e.target.value))}
    />
  );
}
