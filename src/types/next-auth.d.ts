// next-auth.d.ts (create this file to extend the NextAuth types)
import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string; // Add the id property
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}
