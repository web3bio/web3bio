import { memo } from "react";
import RenderProfileBadge from "../profile/RenderProfileBadge";
import { RenderToken } from "./RenderToken";
import { PlatformType } from "../utils/platform";

const RenderObjects = ({ data, network, openModal }) => {
  return data.text ? (
    <span className={data.isToken ? "feed-token" : ""}> {data.text}</span>
  ) : data.identity ? (
    <RenderProfileBadge
      key={`${data.name || data.symbol}_${data.value}`}
      identity={data.identity}
      platform={data.platform || PlatformType.ens}
      remoteFetch
    />
  ) : (
    <RenderToken
      key={`${data.name || data.symbol}_${data.value}`}
      name={data.name}
      symbol={data.symbol}
      image={data.image}
      network={network}
      openModal={openModal}
      standard={data.standard}
      value={{
        value: data.value,
        decimals: data.decimals,
      }}
      asset={data}
    />
  );
};

export default memo(RenderObjects);
