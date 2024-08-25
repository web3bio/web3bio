"use client";
import { useEffect, memo } from "react";
import Image from "next/image";
import { useDispatch } from "react-redux";
import { useQuery } from "@apollo/client";
import { WidgetType } from "../utils/widgets";
import { updatePhilandWidget } from "../state/widgets/reducer";
import { QUERY_PHILAND_INFO } from "../utils/queries";

const RenderWidgetPhiland = ({ domain, openModal }) => {
  const { data, loading, error } = useQuery(QUERY_PHILAND_INFO, {
    variables: {
      name: domain,
    },
    context: {
      clientName: WidgetType.philand,
    },
  });
  const dispatch = useDispatch();

  useEffect(() => {
    if (!loading) {
      dispatch(
        updatePhilandWidget({
          isEmpty: !data?.philandImage?.imageurl,
          initLoading: false,
        })
      );
    }
  }, [data, loading, dispatch]);
  if (!data || !data?.philandImage?.imageurl) return null;

  // if (process.env.NODE_ENV !== "production") {
  //   console.log("Phi:", data);
  // }

  return (
    <div className="profile-widget-half" id={WidgetType.philand}>
      <div
        className="profile-widget profile-widget-philand"
        onClick={() =>
          openModal({
            imageurl: data?.philandImage?.imageurl,
            links: data?.philandLink?.data?.filter((x) => x.title && x.url),
          })
        }
      >
        <div className="profile-widget-header">
          <h2 className="profile-widget-title">
            <span className="emoji-large mr-2">🏝️ </span>
            Phi Land
          </h2>
          <h3 className="text-assistive">
            Phi is a new Web3 world created from ENS domains & On-Chain
            Activity, enabling the easy visualization of On-Chain Identities,
            currently built on Polygon. Virtually interact with crypto protocols
            from around the Ethereum ecosystem.
          </h3>
        </div>
        <div className="profile-widget-body">
          <Image
            className="img-philand"
            src={data?.philandImage?.imageurl}
            width={0}
            height={0}
            alt={"Phi Land"}
            style={{ height: "auto", width: "100%" }}
          />
        </div>
      </div>
    </div>
  );
};

export default memo(RenderWidgetPhiland);
