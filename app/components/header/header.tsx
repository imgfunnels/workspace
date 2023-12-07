"use client";
import React from "react";
import SignIn from "../sign-in/signin";
import { useSession } from "next-auth/react";

const Header = () => {
  const session = useSession();
  return (
    <>
      <header>
        <div className="container mx-auto flex justify-between py-16">
          <span className="font-semibold">IMG WORKSPACE</span>
          <SignIn />
        </div>
      </header>
    </>
  );
};

export default Header;
