"use client";

import { useUser } from "@auth0/nextjs-auth0/client";
import Image from "next/image";

export default function ProfileClient() {
  const { user, error, isLoading } = useUser();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;

  return (
    user && (
      <div>
        <Image
          src={user.picture || "Picture Was Not Found"}
          alt={user.name || "user"}
        />
        <h2>{user.name}</h2>
        <p>{user.email}</p>
      </div>
    )
  );
}
