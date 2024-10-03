import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import TwitterProvider from "next-auth/providers/twitter";
import FacebookProvider from "next-auth/providers/facebook";
import { Session } from "next-auth";
import { JWT } from "next-auth/jwt";
import { creator } from "@/apis/apiClient";

const url = '/v1/create-patient'
console.log('url',url)

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    TwitterProvider({
      clientId: process.env.TWITTER_CLIENT_ID as string,
      clientSecret: process.env.TWITTER_CLIENT_SECRET as string,
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID as string,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
  console.log("User data on sign-in:", user);
  console.log('user name', user.name)
  const patientData = {
    username: user.name,
    email: user.email,
    phone: '', 
    gender: '', 
    dob: '', 
    city: '' 
  };

  
  try {
    console.log("Sending data to API...", patientData);

    // Call the creator method to send data to the API
    await creator(url, patientData);
    console.log("Patient created successfully");
  } catch (error) {
    console.error("Error creating patient:", error);
  }

  // Return true to allow the sign-in to proceed
  return true;
},




    async redirect({ url, baseUrl }) {
      // Redirect to homepage after sign-in
      return baseUrl;
    },
    

    async session({ session, token }: { session: Session; token: JWT }) {
      console.log("Session data:", session);
      console.log("Token data:", token);

      // Add user ID or any other custom info to the session
      session.user.id = token.sub;
      return session;
      
    },
  },

  
  // pages: {
  //   error: '/', // Redirect to the home page on error
  // },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
