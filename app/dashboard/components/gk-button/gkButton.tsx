"use client";
import React, { useEffect, useState } from "react";
import {
  GkButton as GkButton2,
  Button as FlatButton,
  defineGkElement
} from "@gitkraken/shared-web-components";
const GkButton = () => {
  const [GkButton3, setGkButton3] = useState<React.ReactElement | null | any>(
    null
  );
  useEffect(() => {
    const GkButton = defineGkElement(FlatButton);
    console.log("GkButton", GkButton);
    setGkButton3(GkButton);
    return () => {};
  }, []);

  console.log("GkButton", GkButton);
  return (
    <div>
      <GkButton2 />
      <GkButton2>Test</GkButton2>
      {GkButton3 ? <GkButton3>Test 2</GkButton3> : <></>}
    </div>
  );
};

export default GkButton;
