import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Custom404() {
  const [emoji, setEmoji] = useState("🤔");
  const router = useRouter();
  useEffect(() => {
    setEmoji(
      ["🤔", "😱", "😵‍💫", "😵", "🤦‍♀️", "💆‍♂️", "🤷‍♂️", "🙇‍♂️"][
        Math.floor(Math.random() * 8)
      ]
    );
  }, []);
  return (
    <main className="web3-profile container grid-xl">
      <div className="empty error-404">
        <div className="empty-icon h1" style={{ fontSize: "72px" }}>
          {emoji}
        </div>
        <p className="empty-title h4">Not found</p>
        <p className="empty-subtitle">This page could not be found.</p>
        <button className="btn btn-primary mt-4" onClick={() => router.back()}>
          Go back
        </button>
      </div>
    </main>
  );
}
