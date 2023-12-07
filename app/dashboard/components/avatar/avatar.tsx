"use client";
import React from "react";
import { Avatar as ChakraAvatar } from "@chakra-ui/react";
import { useSession } from "next-auth/react";

const Avatar = (props: any) => {
  const { data } = useSession();
  return (
    <ChakraAvatar
      {...props}
      name={data?.user?.name as string | undefined}
      src={data?.user?.image as string | undefined}
    />
  );
};

export default Avatar;
