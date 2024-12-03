import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import TwitterProvider from "next-auth/providers/twitter";
import FacebookProvider from "next-auth/providers/facebook";
import { Session } from "next-auth";
import { JWT } from "next-auth/jwt";
import { creator, fetcher } from "@/apis/apiClient";
import { Password } from "@mui/icons-material";

const url = "/v1/patient-service/create-patient";

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
      const patientData = {
        username: user.name,
        email: user.email,
        phone: "",
        gender: "male",
        dob: "",
        password: "Monis@123",
        city: "",
      };

      console.log("patientData", patientData);
      const checkResponse = await fetcher(
        `/v1/patient-service/get-patient-by-email/${user.email}`
      );
      console.log("checkResponse", checkResponse);
      try {
        if (checkResponse.message !== "No patient data found") {
          user.user_id = checkResponse._id;
        } else {
          console.log("this runs at ease");
          const createResponse: any = await creator(url, patientData);
          user.user_id = createResponse._id;
        }
      } catch (error) {
        console.error("Error during sign-in:", error);
        return false;
      }

      return true;
    },

    async redirect({ url, baseUrl }) {
      return baseUrl;
    },

    async jwt({ token, user }) {
      if (user) {
        token.userId = user.user_id;
      }
      return token;
    },

    async session({ session, token }: { session: Session; token: JWT }) {
      // Add user ID or any other custom info to the session
      session.user.id = token.sub;
      session.user.user_id = token.userId;
      return session;
    },
  },
  events: {
    async signOut({ session, token }) {
      // You can add custom logic here that runs when a user signs out
      console.log("User signed out");
    },
  },
  // pages: {
  //   error: '/',
  // },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
