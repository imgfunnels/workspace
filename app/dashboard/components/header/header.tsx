import SignIn from "@/app/components/sign-in/signin";
import React from "react";

const Header = () => {
  return (
    <header>
      <div className="container mx-auto flex justify-between py-2">
        <span className="font-semibold">IMG WORKSPACE</span>
        <SignIn />
      </div>
    </header>
  );
};

export default Header;
