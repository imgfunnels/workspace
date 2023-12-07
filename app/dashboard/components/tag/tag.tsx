"use client";
import React from "react";
import {
  Tag as ChakraTag,
  TagLabel,
  TagLeftIcon,
  TagRightIcon,
  TagCloseButton
} from "@chakra-ui/react";

const Tag = ({ children }: { children: React.ReactElement | string }) => {
  return (
    <ChakraTag>
      <TagLabel>{children}</TagLabel>
    </ChakraTag>
  );
};

export default Tag;
