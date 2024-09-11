"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { FC } from "react";
import { Session } from "next-auth";

const SignInPage: FC = () => {
  const { data: session } = useSession();

  if (session) {
    return (
      <div>
        <p>Welcome, {(session.user as Session["user"])?.name}!</p>
        <button onClick={() => signOut()}>Sign out</button>
      </div>
    );
  }

  return (
    <div>
      <button onClick={() => signIn("google")}>Sign in with Google</button>
      <button onClick={() => signIn("twitter")}>Sign in with Twitter</button>
      <button onClick={() => signIn("facebook")}>Sign in with Facebook</button>
    </div>
  );
};

export default SignInPage;
