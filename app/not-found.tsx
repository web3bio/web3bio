"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { fallbackEmoji } from "@/components/utils/utils";

export default function NotFound() {
  const [emoji, setEmoji] = useState("");
  const router = useRouter();
  useEffect(() => {
    setEmoji(fallbackEmoji[Math.floor(Math.random() * fallbackEmoji.length)]);
  }, []);
  return (
    <div className="web3-profile container grid-xl">
      <div className="empty error-404">
        <div className="empty-icon h1" style={{ fontSize: "72px" }}>
          {emoji}
        </div>
        <p className="empty-title h4">Not Found</p>
        <p className="empty-subtitle">This page could not be found.</p>
        <button className="btn btn-primary mt-4" onClick={() => router.back()}>
          Go back
        </button>
      </div>
    </div>
  );
}
