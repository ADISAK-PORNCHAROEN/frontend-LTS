"use client";

import { SessionProvider } from "next-auth/react";

type Props = {
  children?: React.ReactNode;
  session?: any;
};

export const NextAuthProvider = ({ children }: Props) => {
  return <SessionProvider basePath="/lts/api/auth" >{children}</SessionProvider>;
};