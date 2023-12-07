"use client";
import {
  useState,
  createContext,
  useEffect,
  useContext,
  useReducer
} from "react";
import { SessionProvider } from "next-auth/react";
export const SessionContext = createContext({});
import { Session } from "next-auth";
import Debugger from "./Debugger";
import { ChakraProvider } from "@chakra-ui/react";
import useToast from "@/hooks/useToast";
import { ToastProvider } from "./toast/toast.provider";
import { SpinnerIcon } from "@chakra-ui/icons";
import AuthRedirect from "./AuthRedirect";

const ClientLayout = ({
  session,
  children
}: {
  session?: (Session | null) & { status?: string };
  children: React.ReactNode;
}) => {
  const toast = useToast();

  useEffect(() => {
    if (session?.user?.email)
      fetch("/api/session/context", {
        method: "POST",
        body: JSON.stringify({ email: session.user.email }),
        headers: { "Content-Type": "application/json" }
      })
        .then((res) => res.json())
        .then((params) => {
          const { success, user, company, location, message } = params;
          if (!success) throw new Error(message);
          setSessionContext({ ...params });
        })
        .catch((error) => {
          console.error(error);
          toast({ message: error.message, status: "error" });
        });
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  const [sessionContext, setSessionContext] = useState({
    userFound: false
  });

  if (session?.status === "loading") {
    debugger;
  }

  return (
    <SessionProvider session={session}>
      <SessionContext.Provider value={sessionContext}>
        <AuthRedirect>
          <ChakraProvider>{children}</ChakraProvider>
          {/* <Debugger /> */}
          <ToastProvider />
        </AuthRedirect>
      </SessionContext.Provider>
    </SessionProvider>
  );
};

export default ClientLayout;
