import { useState } from "react";
import { Empty } from "../shared/Empty";
import SVG from "react-inlinesvg";
import D3IdentityGraph from "./D3IdentityGraph";

const enum GraphView {
  initial = 1,
  platform = 2,
  action = 3,
  identity = 3,
}

export default function D3SocialGraph(props) {
  const { data, onDismiss, title } = props;
  const [graphTitle, setGraphTitle] = useState("");
  const [graphView, setGraphView] = useState(GraphView.initial);

  return (
    <>
      <div className="identity-graph-modal">
        <div
          className="graph-container"
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
          }}
        >
          {(data && <svg className="svg-canvas" />) || (
            <Empty title={"No social graph found"} />
          )}

          <div className="graph-header">
            <div className="graph-title">
              <SVG src={"/icons/icon-view.svg"} width="20" height="20" />
              <span className="ml-2">
                Social Graph for
                <strong className="ml-1">{graphTitle}</strong>
              </span>
            </div>
            <div className="btn-close">
              {graphView === GraphView.identity && (
                <div
                  className="btn"
                  onClick={() => setGraphView(GraphView.action)}
                >
                  <SVG src={"/icons/icon-open.svg"} width="20" height="20" />
                  Back
                </div>
              )}
              <div className="btn" onClick={onDismiss}>
                <SVG src={"/icons/icon-close.svg"} width="20" height="20" />
              </div>
            </div>
          </div>
        </div>
        {/* {currentNode && !hideTooltip && (
    <div
      className="web3bio-tooltip"
      style={{
        left:
          currentNode.x +
          (currentNode.isIdentity ? IdentityNodeSize : NFTNodeSize * 2),
        top:
          currentNode.y +
          (currentNode.isIdentity ? IdentityNodeSize : NFTNodeSize * 2),
        transform: `translate(${transform[0]}px,${transform[1]}px)`,
      }}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      {currentNode.isIdentity ? (
        <ul>
          <li className="text-large text-bold">
            {currentNode.displayName || "-"}
          </li>
          <li className="mb-1">
            {currentNode.identity != currentNode.displayName
              ? currentNode.platform === PlatformType.ethereum
                ? formatText(currentNode.identity)
                : currentNode.identity
              : ""}
          </li>
          {(currentNode.uid && (
            <li>
              <span className="text-gray">
                {currentNode.platform === PlatformType.farcaster
                  ? "FID"
                  : "UID"}
                :{" "}
              </span>
              {currentNode.uid}
            </li>
          )) ||
            ""}
          {((currentNode.address ||
            currentNode.platform === PlatformType.ethereum) && (
            <li>
              <span className="text-gray">Address: </span>
              {currentNode.address || currentNode.identity}
            </li>
          )) ||
            ""}
          <li>
            <span className="text-gray">Platform: </span>
            {SocialPlatformMapping(currentNode.platform as PlatformType)
              ?.label ||
              currentNode.platform ||
              "Unknown"}
          </li>
        </ul>
      ) : (
        <ul>
          <li className="text-large text-bold mb-1">
            {currentNode.identity || ""}
          </li>
          <li>
            <span className="text-gray">Platform: </span>
            {currentNode.platform || ""}
          </li>
          <li>
            <span className="text-gray">Owner: </span>
            {currentNode.holder || ""}
          </li>
        </ul>
      )}
      {graphType === GraphType.socialGraph && (
        <div
          className="btn"
          onClick={() => {
            setHideToolTip(true);
            expandIdentity(currentNode);
            setCurrentNode(null);
          }}
        >
          Expand
        </div>
      )}
    </div>
  )} */}
      </div>
    </>
  );
}
