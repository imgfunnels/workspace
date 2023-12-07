"use client";
import React from "react";
import ReactDOMServer from "react-dom/server";
import Avatar from "../avatar/avatar";
import { v4 } from "uuid";
import colors from "@/data/rank-colors";

const BumpLine = ({
  sha,
  rank,
  passthroughRanks,
  endRank,
  startRank,
  mergeWithRank,
  baseFromRank,
  branchFromRank
}: {
  sha: string;
  rank: number;
  passthroughRanks: number[];
  endRank: number;
  startRank: number;
  mergeWithRank?: number | undefined;
  baseFromRank?: number;
  branchFromRank?: number;
}) => {
  const baseline = 40;
  const avatarBoxWidth = 28;
  const radius = 9;
  const boundingBox = 30;

  const bumpLine = (
    <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      <g>
        {Array.from(passthroughRanks)?.map((passthroughRank) => {
          if (
            passthroughRank === baseFromRank &&
            mergeWithRank !== baseFromRank
          ) {
            return;
          }

          return (
            <g key={v4()}>
              {passthroughRank !== endRank ? (
                <line
                  fill="none"
                  shapeRendering="auto"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  stroke={colors[passthroughRank % colors.length]}
                  x1={baseline + passthroughRank * avatarBoxWidth}
                  x2={baseline + passthroughRank * avatarBoxWidth}
                  y1="0"
                  y2={boundingBox / 2}
                />
              ) : (
                <></>
              )}
              {passthroughRank !== startRank ? (
                <line
                  key={v4()}
                  fill="none"
                  shapeRendering="auto"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  stroke={colors[passthroughRank % colors.length]}
                  x1={baseline + passthroughRank * avatarBoxWidth}
                  x2={baseline + passthroughRank * avatarBoxWidth}
                  y1={boundingBox / 2}
                  y2={boundingBox}
                />
              ) : (
                <></>
              )}
            </g>
          );
        })}
        {baseFromRank && rank !== baseFromRank ? (
          <g>
            <line
              fill="none"
              shapeRendering="auto"
              strokeLinejoin="round"
              strokeWidth="2"
              stroke={
                colors[(baseFromRank ? baseFromRank : rank) % colors.length]
              }
              x1={baseline + rank * avatarBoxWidth}
              x2={baseline + baseFromRank * avatarBoxWidth - radius}
              y1="15"
              y2="15"
            />
            <path
              // {M} x y {v} dy {A} (radius1, radius2, largeArc, sweep, {x,y})
              d={`M ${
                baseline + baseFromRank * avatarBoxWidth
              } ${avatarBoxWidth} v -3 A ${radius} ${radius} 0 0 0 ${
                baseline + baseFromRank * avatarBoxWidth - radius
              } ${boundingBox / 2} h -3`}
              fill="none"
              shapeRendering="auto"
              strokeLinejoin="round"
              strokeWidth="2"
              stroke={
                colors[(baseFromRank ? baseFromRank : rank) % colors.length]
              }
            />
            <line
              fill="none"
              shapeRendering="auto"
              strokeLinejoin="round"
              strokeWidth="2"
              stroke={
                colors[(baseFromRank ? baseFromRank : rank) % colors.length]
              }
              x1={baseline + baseFromRank * avatarBoxWidth}
              x2={baseline + baseFromRank * avatarBoxWidth}
              y1={boundingBox - 3}
              y2={boundingBox}
            />
          </g>
        ) : (
          <></>
        )}

        {/* {true ? (
          <path
            d="M 105 25 V 22 A 8 8 0 0 0 97 15 H 94"
            fill="none"
            shapeRendering="auto"
            strokeLinejoin="round"
            strokeWidth="2"
            
             stroke={colors[(baseFromRank ? baseFromRank : rank) % colors.length]}
          />
        ) : (
          <></>
        )} */}

        {branchFromRank ? (
          <g>
            <line
              fill="none"
              shapeRendering="auto"
              strokeLinejoin="round"
              strokeWidth="2"
              stroke={
                colors[(baseFromRank ? baseFromRank : rank) % colors.length]
              }
              x1="40"
              x2="55"
              y1="15"
              y2="15"
            />
            <path
              d="M 55 15 h 5 A 9 9 0 0 0 68 6 V 3"
              fill="none"
              shapeRendering="auto"
              strokeLinejoin="round"
              strokeWidth="2"
              stroke={
                colors[(baseFromRank ? baseFromRank : rank) % colors.length]
              }
            />
            <line
              fill="none"
              shapeRendering="auto"
              strokeLinejoin="round"
              strokeWidth="2"
              stroke={
                colors[(baseFromRank ? baseFromRank : rank) % colors.length]
              }
              x1="68"
              x2="68"
              y1="0"
              y2="3"
            />
          </g>
        ) : (
          <></>
        )}
      </g>
    </svg>
  );

  return (
    <div
      className="h-[30px] flex justify-start items-center"
      style={{
        background: `url("data:image/svg+xml;charset=UTF-8,${encodeURI(
          ReactDOMServer.renderToString(bumpLine)
        )}")`
      }}
    >
      <Padding />

      {typeof mergeWithRank === "number" ? (
        <div
          className="w-3 h-3 rounded-full bg-[#007bff] relative text-sm"
          style={{ left: `${rank * avatarBoxWidth + 6}px` }}
        ></div>
      ) : (
        <Avatar
          size="xs"
          style={{ left: `${rank * avatarBoxWidth}px` }}
          className="relative z-0"
        />
      )}
    </div>
  );
};

export default BumpLine;

const Padding = () => {
  return <div className="w-7 h-7" />;
};

{
  /* 
  <path
  d="M 55 15 h 5 A 9 9 0 0 0 68 6 V 3"
  fill="none"
  shapeRendering="auto"
  strokeLinejoin="round"
  strokeWidth="2"
  stroke={colors[(baseFromRank ? baseFromRank : rank) % colors.length]}
/> 
*/
}
