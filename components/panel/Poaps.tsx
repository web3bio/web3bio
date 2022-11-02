import Image from "next/image";
import { memo } from "react";

const RenderPoaps = (props) => {
  const { poapList = [1, 2, 3] } = props;
  return (
    <div className="nft-collection-container">
      <div className="nft-collection-title">POAPS</div>
      <div className="nft-list">
        {poapList.map((x, idx) => {
          return (
            <div key={idx} className="collection-nft-item">
              <Image
                src="https://i.seadn.io/gcs/files/ad509bd6fb10b3f256481d1c0b297cf9.jpg?auto=format&w=384"
                alt=""
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const Poaps = memo(RenderPoaps);
