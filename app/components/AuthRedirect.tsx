"use client";
import { SpinnerIcon } from "@chakra-ui/icons";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect } from "react";

const AuthRedirect = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();
  const session = useSession();

  useEffect(() => {
    console.log("Pathname", pathname);
    console.log("Session", session);

    // If they're on the homepage and they're authenticated, move them to the dashboard
    if (pathname === "/" && session?.status === "authenticated") {
      router.push("/dashboard");
    } else if (
      // If they're on the dashboard and they're unauthenticated, move them to the homepage
      session?.status === "unauthenticated" &&
      pathname.match(/^\/dashboard/i)
    ) {
      router.push("/");
    }
    return () => {};
  }, [session, router, pathname]);

  if (
    (pathname === "/" && session?.status === "authenticated") ||
    (session?.status === "unauthenticated" && pathname.match(/^\/dashboard/i))
  )
    return (
      <div className="fixed inset-0 flex items-center justify-center flex-col">
        <div>
          <SpinnerIcon
            boxSize="80"
            className="animate-spin my-6 !text-blue-500"
          />
        </div>
        <div>Loading...</div>
      </div>
    );

  return <>{children}</>;
};

export default AuthRedirect;
