"use client";

import {
  Stat as ChakraStat,
  StatArrow,
  StatHelpText,
  StatLabel,
  StatNumber
} from "@chakra-ui/react";
import React from "react";

const Stat = () => {
  return (
    <ChakraStat>
      <StatLabel>Sent</StatLabel>
      <StatNumber>345,670</StatNumber>
      <StatHelpText>
        <StatArrow type="increase" />
        23.36%
      </StatHelpText>
    </ChakraStat>
  );
};

export default Stat;
