"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import React from "react";

const SignIn = () => {
  const session = useSession();
  return session.status === "authenticated" ? (
    <button
      className="bg-white hover:bg-stone-100 active:bg-white transition-colors px-4 py-2 rounded font-semibold"
      onClick={() => {
        signOut({ redirect: false });
      }}
    >
      Sign out
    </button>
  ) : (
    <button
      className="bg-white hover:bg-stone-100 active:bg-white transition-colors px-4 py-2 rounded font-semibold"
      onClick={() => {
        signIn();
      }}
    >
      Sign in
    </button>
  );
};

export default SignIn;
