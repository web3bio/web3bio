import { formatDistanceToNow } from "date-fns";
import Image from "next/image";
import { useState } from "react";

const banklessEmoji = (type) => {
  return {
    airdrop: "🎁",
    reward: "🏆",
    alert: "🚨",
    "governance-vote": "🗳️",
    poap: "🔮",
    mint: "🌲",
  }[type];
};

export default function BanklessItem({ data }) {
  const [imgError, setImgError] = useState(false);
  return (
    <tr key={"td" + data.title}>
      <td>
        <div className="table-item">
          {!imgError ? (
            <Image
              onError={() => setImgError(true)}
              className="dao-icon"
              src={data.imageUrl || ""}
              height={24}
              width={24}
              alt={data.title}
            />
          ) : (
            <div className="dao-icon">{banklessEmoji(data.type)}</div>
          )}

          <div className="text-ellipsis" title={data.type + " - " + data.title}>
            {data.title}{" "}
            {/* {data.description && (
            <small className="label">{data.description}</small>
          )} */}
          </div>
        </div>
      </td>
      <td>{data.worth?.worthUSDString || "-"}</td>

      <td>
        <div className="badge">
          Expires in
          {(data.expires && (
            <strong>{" " + formatDistanceToNow(data.expires)}</strong>
          )) ||
            "-"}
        </div>
      </td>
    </tr>
  );
}
