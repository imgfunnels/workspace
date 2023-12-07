"use client";
import { useSession } from "next-auth/react";
import React, { useContext, useSyncExternalStore } from "react";
import { SessionContext } from "@/app/components/ClientLayout";
import { toastStore } from "@/app/components/toast/toast.store";
const Debugger = () => {
  const session = useSession();
  const context = useContext(SessionContext);
  const store = useSyncExternalStore(
    toastStore.subscribe,
    toastStore.getState,
    toastStore.getState
  );

  return (
    <div>
      {process.env.NODE_ENV === "development" ? (
        <>
          <pre>{JSON.stringify(session, null, 2)}</pre>
          <pre>{JSON.stringify(context, null, 2)}</pre>
          <pre>{JSON.stringify(store, null, 2)}</pre>
        </>
      ) : (
        <></>
      )}
    </div>
  );
};

export default Debugger;
