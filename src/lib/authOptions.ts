import { Session, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectToDB } from "@/lib/db";
import Candidate from "@/models/candidate.model";
import bcrypt from "bcryptjs";
import Activity from "@/models/activity.model";
import { JWT } from "next-auth/jwt";
import type { NextAuthOptions } from "next-auth";

const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        studentNumber: { label: "Student Number", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.studentNumber || !credentials.password) return null;

        await connectToDB();

        const user = await Candidate.findOne({
          studentNumber: credentials.studentNumber,
        });
        if (!user) return null;

        const isPasswordCorrect = await bcrypt.compare(
          credentials.password,
          user.password
        );
        if (!isPasswordCorrect) return null;

        const activity = await Activity.findOne({ candidateId: user._id });

        if(activity && activity?.isExamCompleted) {
            throw new Error(`Exam has been completed for Student Number: ${credentials.studentNumber}. You cannot sign in again.`);
        }

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          isPreferenceSet: activity?.isPreferenceSet || false,
          isExamCompleted: activity?.isExamCompleted || false,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: User }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.isPreferenceSet = user.isPreferenceSet;
        token.isExamCompleted = user.isExamCompleted;
      } else {
        await connectToDB();
        const activity = await Activity.findOne({ candidateId: token.id });
        token.isPreferenceSet = activity?.isPreferenceSet || false;
        token.isExamCompleted = activity?.isExamCompleted || false;
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        session.user.isPreferenceSet = token.isPreferenceSet as boolean;
        session.user.isExamCompleted = token.isExamCompleted as boolean;
      }
      return session;
    },
  },

  session: {
    strategy: "jwt",
  },

  pages: {
    signIn: "/",
  },
};

export default authOptions;
