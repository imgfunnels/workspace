import React from "react";
import Stat from "./stat/stat";
import BumpChart from "./components/bump-chart/bumpChart";
import GitGraph from "./components/git-graph/gitGraph";
import CommitGraph from "./components/commit-graph/commitGraph";
import GkButton from "./components/gk-button/gkButton";
import Hover from "./components/hover/hover";
import Avatar from "./components/avatar/avatar";
import Tag from "./components/tag/tag";
import ReactDomServer from "react-dom/server";
import BumpLine from "./components/bump-line/bumpLine";

const page = () => {
  return (
    <div className="container mx-auto py-2">
      <CommitGraph />
      {/* <Hover /> */}
      {/* <GkButton /> */}
      {/* <Stat /> */}
      {/* <BumpChart /> */}
      {/* <GitGraph /> */}
    </div>
  );
};

export default page;
