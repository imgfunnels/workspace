"use strict";
"use client";
import useToast from "@/hooks/useToast";
import { Session } from "next-auth";
import { useSession } from "next-auth/react";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { v4 } from "uuid";
import { DateTime } from "luxon";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Spinner, Tag, Text, Tooltip } from "@chakra-ui/react";
import BumpLine from "../bump-line/bumpLine";
import "react-virtualized/styles.css";
import { List, AutoSizer } from "react-virtualized";
import { loremIpsum } from "lorem-ipsum";
import Avatar from "../avatar/avatar";
import { GoGitMerge, GoGitBranch, GoInbox } from "react-icons/go";

import colors from "@/data/rank-colors";

const hexToHsl = require("hex-to-hsl");

const CommitGraph = () => {
  const toast = useToast();

  const [workspace, setWorkspace] = useState({ name: "Workspace 1" });

  const [repository, setRepository] = useState<{
    name?: string;
    branches: { name: string; color: string; rank: number }[];
    branchCommits: { branch: string }[];
    commits: { rank: number; passthroughRanks: number[] }[];
  }>({
    name: "admin-tristarpt-com",
    branches: [],
    branchCommits: [],
    commits: []
  });

  const session = useSession() as any;

  const [fetchingRepo, setFetchingRepo] = useState(false);
  useEffect(() => {
    getRepo();
    return () => {};
  }, []);

  const tableRef = useRef<HTMLTableElement | null>(null);

  async function getRepo() {
    setFetchingRepo(true);
    await fetch("/dashboard/api/github", {
      method: "POST",
      body: JSON.stringify({ accessToken: session?.data?.accessToken }),
      headers: { "Content-Type": "application/json" }
    })
      .then((res) => res.json())
      .then(function functionA({
        success,
        message,
        commits,
        branches,
        branchCommits,
        ...rest
      }) {
        console.log(arguments[0]);

        (async () => {
          if (!success) {
            throw new Error(message);
          }

          branches.forEach((branch: any) => {
            if (branch.name === "main") {
              branch.color = "#eeeeee";
            } else {
              branch.color = "#007bff";
            }
          });

          let rank = 0;

          for await (let commit of commits) {
            let branch = branches?.find(
              (branch: any) => branch.commit.sha === commit.sha
            );

            if (branch && branch.name && !branch.rank) {
              commit.current = true;
              commit.branch = branch.name;
              commit.rank = branch.rank = rank;
              let branchCommit = branchCommits.find((_branch: any) => {
                return _branch.branch === branch.name;
              });
              branchCommit.rank = rank;
              rank++;
            } else {
              commit.current = false;
            }
          }

          console.log("BRANCH COMMITS BEFORE", branchCommits);

          // Sort branches of commits by branch rank
          branchCommits = branchCommits
            .filter((branch: any) => typeof branch.rank === "number")
            .sort((a: any, b: any) => {
              return b.rank < a.rank ? 1 : -1;
            });

          console.log("BRANCH COMMITS AFTER", branchCommits);

          // Delete commits from subsecquent branches
          for await (let commit of commits.filter(
            (commit: any) => !commit.current
          )) {
            let isFirst = true;
            branchCommits.forEach((branch: any) => {
              branch.data.forEach((branchCommit: any, i: number) => {
                if (branchCommit.sha === commit.sha) {
                  if (isFirst) {
                    isFirst = false;
                  } else {
                    branch.data.splice(i, 1);
                  }
                }
              });
            });

            commit.branch = branchCommits?.find((branch: any) => {
              return branch.data.find(
                (_commit: any) => _commit.sha === commit.sha
              );
            })?.branch;

            commit.rank = branches.find(
              (branch: any) => branch.name === commit.branch
            ).rank;

            console.log("COMMIT.RANK", commit.rank);
          }

          let passthroughRanks: Set<number> = new Set<number>();

          // Set a variable on the last commit of each rank
          for await (let commit of commits) {
            // ! Has to be a separate loop because the first one sets the rank...

            if (commit.parents.length === 2) {
              // 1st one is where you ran merge...
              // 2nd one is what was merged in

              const baseFrom = commits.find((_commit: any) => {
                return commit.parents[1].sha === _commit.sha;
              });

              // Let's merge it with the commit's current branch...
              commit.mergeWithRank = commit.rank;
              commit.baseFromRank = baseFrom ? baseFrom.rank : -1;

              if (commit.baseFromRank > 0) {
                passthroughRanks.add(commit.baseFromRank);
              }
            }

            if (!passthroughRanks.has(commit.rank)) {
              commit.endRank = commit.rank;
            }

            passthroughRanks.add(commit.rank);
            commit.passthroughRanks = [...Array.from(passthroughRanks)];
          }

          let ranksNotInUse: Set<number> = new Set<number>();
          let startRanks: Set<number> = new Set<number>();

          // Set a variable on the first commit of each rank
          commits.toReversed().forEach((commit: any) => {
            if (!startRanks.has(commit.rank)) {
              commit.startRank = commit.rank;
              startRanks.add(commit.rank);
            }

            let branchFromRank;
            // Todo: Branch From Rank...
            // Unfortunately, this does us no good because we don't have the full history of the repository here.
            // Unfortunately, this does us no good because we don't have the full history of the repository here.
            // Unfortunately, this does us no good because we don't have the full history of the repository here.
            // if (i > 0) {
            //   branchFrom =
            // }
          });

          console.log("START RANKS", startRanks);

          // Remove skip ranks that occur before the start of the rank, but add the rank back if it's the start rank.
          commits.forEach((commit: any) => {
            if (typeof commit.startRank === "number") {
              ranksNotInUse.add(commit.rank);
            }
            commit.passthroughRanks = commit.passthroughRanks
              .filter((rank: number) => {
                return !ranksNotInUse.has(rank);
              })
              .concat([commit.rank]);
          });

          console.log("COMMITS", commits);

          setRepository({
            ...repository,
            commits,
            branches,
            branchCommits
          });
          setFetchingRepo(false);
        })();
      })
      .catch((error) => {
        if (error.message === "Not Found") {
          toast({
            message:
              "Repository not found. Please make sure you have the proper permissions.",
            status: "error"
          });
        } else {
          console.error(error);
          toast({ message: error.message, status: "error" });
        }
      });
  }

  const initialColumnWidths = {
    0: "144px",
    1: "350px",
    2: "270px",
    3: "144px",
    4: "144px",
    5: "144px",
    6: "144px"
  };

  const resizeColumn = useMemo(
    () => (i: number, e: any) => {
      if (!!window) {
        let x = e.clientX;
        let w = parseInt(
          window.getComputedStyle(e.target.parentElement).width,
          10
        );
        if (!tableRef.current) return;

        tableRef.current.classList.add("not-selectable");
        document.body.classList.add("cursor-col-resize");

        const mouseMoveHandler = (e: any) => {
          const dx = e.clientX - x;
          Array.from(document.getElementsByClassName(`col-${i}`)).forEach(
            (element: any) => {
              element.style.width = w + dx + "px";
              element.style.minWidth = w + dx + "px";
              element.style.maxWidth = w + dx + "px";
            }
          );
        };

        window.addEventListener("mousemove", mouseMoveHandler);
        window.addEventListener("mouseup", function mouseUpHandler() {
          if (!tableRef.current) return;
          window.removeEventListener("mousemove", mouseMoveHandler);
          window.removeEventListener("mouseup", mouseUpHandler);
          tableRef.current.classList.remove("not-selectable");
          document.body.classList.remove("cursor-col-resize");
        });
      }
    },
    []
  );

  function getAgeAsDuration(date: string) {
    const units: Intl.RelativeTimeFormatUnit[] = [
      "year",
      "month",
      "week",
      "day",
      "hour",
      "minute",
      "second"
    ];

    const diff = DateTime.fromISO(date)
      .diffNow()
      .shiftTo(...units);
    const unit = units.find((unit) => diff.get(unit) !== 0) || "second";

    const relativeFormatter = new Intl.RelativeTimeFormat("en", {
      numeric: "auto"
    });
    return relativeFormatter.format(Math.trunc(diff.as(unit)), unit);
  }

  // const rowCount = 5000;
  // const listHeight = 400;
  // const rowHeight = 50;
  // const rowWidth = 700;

  // const list = Array(rowCount)
  //   .fill(null)
  //   .map((val, idx) => {
  //     return {
  //       id: idx,
  //       name: "John Doe",
  //       image: "http://via.placeholder.com/40",
  //       text: loremIpsum({
  //         count: 2,
  //         units: "sentences",
  //         sentenceLowerBound: 2,
  //         sentenceUpperBound: 100
  //       })
  //     };
  //   });

  // function renderRow({ index, key, style }: any) {
  //   return (
  //     <div key={key} style={style} className="row w-full">
  //       <div className="image">
  //         <Avatar size="sm" className="relative z-0" />
  //       </div>
  //       <div className="content">
  //         <div className="truncate">{list[index].name}</div>
  //         <div className="truncate">{list[index].text}</div>
  //       </div>
  //     </div>
  //   );
  // }

  // DOM
  return (
    <div className="relative">
      {fetchingRepo ? (
        <div className="absolute z-10 inset-0 opacity-50 bg-white flex items-center justify-center">
          <Spinner />
        </div>
      ) : (
        <></>
      )}
      <div className="text-lg mt-1">
        <b>Repository:</b> {repository.name}
      </div>
      <small className="italic my-2 inline-block">
        This graph is limited to 100 commits per branch and ordered by most
        recently pushed.
      </small>
      <div className="max-h-screen overflow-auto">
        {(() => {
          return (
            <div
              key={v4()}
              className="w-full will-change-transform"
              ref={tableRef}
            >
              <div className="text-xs uppercase border-separate sticky top-0 bg-white z-10 w-full">
                <div className="sticky top-0 z-20 flex">
                  <div
                    className="relative shrink border-y px-2 py-1 truncate text-left border-l not-selectable col-0"
                    style={{
                      width: initialColumnWidths[0],
                      minWidth: initialColumnWidths[0]
                    }}
                  >
                    <div
                      className="resizer absolute top-0 right-0 w-1 h-full bg-blue-500 z-10 cursor-col-resize"
                      onMouseDown={(e) => {
                        resizeColumn(0, e);
                      }}
                    />
                    <div>Tag / Branch</div>
                  </div>
                  <div
                    className="relative shrink border-y px-2 py-1 truncate text-left not-selectable col-1"
                    style={{
                      width: initialColumnWidths[1],
                      minWidth: initialColumnWidths[1]
                    }}
                  >
                    <div
                      className="resizer absolute top-0 right-0 w-1 h-full bg-blue-500 z-10 cursor-col-resize"
                      onMouseDown={(e) => {
                        resizeColumn(1, e);
                      }}
                    />
                    <div>Graph</div>
                  </div>
                  <div
                    className="relative shrink border-y px-2 py-1 truncate text-left not-selectable col-2"
                    style={{
                      width: initialColumnWidths[2],
                      minWidth: initialColumnWidths[2]
                    }}
                  >
                    <div
                      className="resizer absolute top-0 right-0 w-1 h-4 bg-blue-500 z-10 cursor-col-resize"
                      onMouseDown={(e) => {
                        resizeColumn(2, e);
                      }}
                    />
                    <div>Commit Message</div>
                  </div>
                  <div
                    className="relative shrink border-y px-2 py-1 truncate text-left not-selectable col-3"
                    style={{
                      width: initialColumnWidths[3],
                      minWidth: initialColumnWidths[3]
                    }}
                  >
                    <div
                      className="resizer absolute top-0 right-0 w-1 h-4 bg-blue-500 z-10 cursor-col-resize"
                      onMouseDown={(e) => {
                        resizeColumn(3, e);
                      }}
                    />
                    <div>Author</div>
                  </div>
                  <div
                    className="relative shrink border-y px-2 py-1 truncate text-left not-selectable col-4"
                    style={{
                      width: initialColumnWidths[4],
                      minWidth: initialColumnWidths[4]
                    }}
                  >
                    <div
                      className="resizer absolute top-0 right-0 w-1 h-4 bg-blue-500 z-10 cursor-col-resize"
                      onMouseDown={(e) => {
                        resizeColumn(4, e);
                      }}
                    />
                    <div>Changes</div>
                  </div>
                  <div
                    className="relative shrink border-y px-2 py-1 truncate text-left not-selectable col-5"
                    style={{
                      width: initialColumnWidths[5],
                      minWidth: initialColumnWidths[5]
                    }}
                  >
                    <div
                      className="resizer absolute top-0 right-0 w-1 h-4 bg-blue-500 z-10 cursor-col-resize"
                      onMouseDown={(e) => {
                        resizeColumn(5, e);
                      }}
                    />
                    <div>Commit Date / Time</div>
                  </div>
                  <div
                    className="relative shrink border-y px-2 py-1 truncate text-left border-r not-selectable col-6"
                    style={{
                      width: initialColumnWidths[6],
                      minWidth: initialColumnWidths[6]
                    }}
                  >
                    <div
                      className="resizer absolute top-0 right-0 w-1 h-4 bg-blue-500 z-10 cursor-col-resize"
                      onMouseDown={(e) => {
                        resizeColumn(6, e);
                      }}
                    />
                    <div>SHA</div>
                  </div>
                </div>
              </div>
              <div className="border-collapse">
                {repository.commits.map((commit: any, i: any) => {
                  const ageAsDuration = getAgeAsDuration(
                    commit.commit.committer.date
                  );

                  const color = repository.branches?.find(
                    (branch) => branch.name === commit.branch
                  )?.color as string;

                  return (
                    <div
                      key={v4()}
                      className="flex min-w-0 min-h-0 box-border relative max-w-full h-[30px]"
                    >
                      <div
                        className="py-0 text-sm flex min-w-0 min-h-0 box-border relative max-w-full px-2 h-[30px] items-center justify-start col-0"
                        style={{
                          width: initialColumnWidths[0],
                          minWidth: initialColumnWidths[0]
                        }}
                      >
                        {commit.parents.length === 2 ? (
                          <Tag
                            size="sm"
                            mr={2}
                            className="min-w-[28px] basis-[28px] flex-grow-0 flex-shrink-0"
                          >
                            <div className="min-w-[12px] basis-[12px]">
                              <GoGitMerge size={12} />
                            </div>
                          </Tag>
                        ) : (
                          <></>
                        )}
                        {commit.startRank ? (
                          <Tag
                            size="sm"
                            mr={2}
                            className="min-w-[28px] basis-[28px] flex-grow-0 flex-shrink-0"
                          >
                            <div className="min-w-[12px] basis-[12px]">
                              <GoGitBranch size={12} />
                            </div>
                          </Tag>
                        ) : (
                          <></>
                        )}

                        <Tag
                          size="sm"
                          isTruncated
                          background={color}
                          color={hexToHsl(color)[2] > 50 ? "black" : "white"}
                          className={`!flex !min-w-0 min-h-0 box-border !max-w-full select-none text-sm rounded shrink ${
                            commit.current ? "" : "opacity-20 hover:opacity-50"
                          }`}
                        >
                          <Text isTruncated>
                            {commit.branch ? commit.branch : "No Tag"}
                          </Text>
                        </Tag>
                      </div>
                      <div
                        className="py-0 relative text-sm truncate h-[30px] overflow-x-auto col-1"
                        style={{
                          width: initialColumnWidths[1],
                          minWidth: initialColumnWidths[1]
                        }}
                      >
                        <BumpLine
                          sha={commit.sha}
                          rank={commit.rank}
                          passthroughRanks={commit.passthroughRanks}
                          endRank={commit.endRank}
                          startRank={commit.startRank}
                          mergeWithRank={commit.mergeWithRank}
                          baseFromRank={commit.baseFromRank}
                        />
                      </div>
                      <div
                        className="py-0 relative text-sm truncate px-2 h-[30px] max-w-[400px] col-2"
                        style={{
                          width: initialColumnWidths[2],
                          minWidth: initialColumnWidths[2]
                        }}
                      >
                        {commit.commit.message}
                      </div>
                      <div
                        className="py-0 relative text-sm truncate px-2 h-[30px] col-3"
                        style={{
                          width: initialColumnWidths[3],
                          minWidth: initialColumnWidths[3]
                        }}
                      >
                        {commit.commit.author.name}
                      </div>
                      <div
                        className="py-0 relative text-sm truncate px-2 h-[30px] col-4"
                        style={{
                          width: initialColumnWidths[4],
                          minWidth: initialColumnWidths[4]
                        }}
                      >
                        Changes...
                      </div>
                      <div
                        className="py-0 relative text-sm truncate px-2 h-[30px] col-5"
                        style={{
                          width: initialColumnWidths[5],
                          minWidth: initialColumnWidths[5]
                        }}
                      >
                        {ageAsDuration}
                        {/* {DateTime.fromISO(
                          commit.commit.committer.date
                        ).toFormat("M/dd/yyyy, h:mm a")} */}
                      </div>
                      <div
                        className="py-0 relative text-sm truncate px-2 h-[30px] col-6"
                        style={{
                          width: initialColumnWidths[6],
                          minWidth: initialColumnWidths[6]
                        }}
                      >
                        {commit.sha}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })()}
      </div>
      <div className="my-10 flex flex-col gap-6">
        <Link
          href="https://github.com/apps/img-workspace/installations/new"
          className="text-blue-600 hover:text-blue-500 visited:text-purple-500"
        >
          Install the App on your Organization
        </Link>
      </div>
      {/* <div className="relative w-full h-screen">
        <AutoSizer>
          {({ width, height }) => (
            <List
              width={width}
              height={height}
              rowHeight={rowHeight}
              rowRenderer={renderRow}
              rowCount={list.length}
              overscanRowCount={3}
            />
          )}
        </AutoSizer>
      </div> */}
      {/* {colors.map((color: string) => {
        return <div className="h-7 w-7" style={{ background: color }}></div>;
      })} */}
    </div>
  );
};

export default CommitGraph;
