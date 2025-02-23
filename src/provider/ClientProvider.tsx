    "use client";

import { SessionProvider } from "next-auth/react";

type Props = {
  children: React.ReactNode;
};

const ClientProvider = ({ children }: Props) => {
  return <SessionProvider>{children}</SessionProvider>;
};

export default ClientProvider;
