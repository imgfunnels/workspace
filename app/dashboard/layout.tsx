import SignIn from "@/app/components/sign-in/signin";
import React from "react";
import Header from "./components/header/header";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <Header />
      {children}
    </div>
  );
};

export default layout;
