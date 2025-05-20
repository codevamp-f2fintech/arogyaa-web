import GoogleProvider from "next-auth/providers/google";
import { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  //   pages: {
  //     signIn: "/signin", // Optional: Custom sign-in page
  //   },

  callbacks: {
    async signIn({ user, account, profile, email, credentials, res }) {
      console.log(user, "user");

      try {
        const userId = user.email; // Use email as userId for authentication

        // 🔍 Check if the patient exists
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_PATIENT_URL}/get-patient-by-email/${userId}`
        );
        const response = await res.json();
        console.log("res", response);

        // If patient is not found, create a new one
        if (
          response.statusCode === 404 ||
          response.message === "Patient Not Found"
        ) {
          console.log("Creating new patient");

          const createPatientRes = await fetch(
            `${process.env.NEXT_PUBLIC_PATIENT_URL}/create-patient`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                username: user.name,
                email: user.email,
                profilePicture: user.image,
                type: "social", // This can be a social login type
              }),
            }
          );
          const createPatientResponse = await createPatientRes.json();
          console.log("Patient created:", createPatientResponse);

          // Simulate custom login after creation
          const loginRes = await fetch(
            `${process.env.NEXT_PUBLIC_PATIENT_URL}/login`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                email: user.email,
                password: process.env.NEXT_PUBLIC_PATIENT_PASS,
              }), // Use a dummy password
            }
          );

          const loginData = await loginRes.json();
          console.log("Login response:", loginData);

          if (loginData.statusCode === 200) {
            // Store the JWT token in a cookie
            const { token } = loginData;

            // Set the token in the response header as a cookie
            document.cookie = `token=${token}; path=/; max-age=${
              1 * 24 * 60 * 60
            }; secure; samesite=strict`;
          } else {
            console.log("Login failed");
          }
        } else {
          console.log("Patient found, skipping creation");
        }
        return true;
      } catch (err) {
        console.error("Sign-in error:", err);
        return false;
      }
    },

    async redirect({ url, baseUrl }) {
      return baseUrl;
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
