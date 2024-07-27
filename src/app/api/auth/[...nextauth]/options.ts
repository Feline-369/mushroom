// providers credentials etc segregated from route clean code
import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/dbConnect';
import UserModel from '@/model/user';

export const authOptions: NextAuthOptions = {
  providers: [
    //this method provides objects itself
    CredentialsProvider({
      id: 'credentials',
      name: 'Credentials',
      //all credentials should already provide html format for the credentials 
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      //nextAuthdoesn't know how to authorize therefore custom authorize it accepts credentials and return promise

      async authorize(credentials: any): Promise<any> {
        await dbConnect();
        try {
          const user = await UserModel.findOne({
            //make credendentials using either username or email hence mongoose operator is used
            $or: [
              { email: credentials.identifier },
              { username: credentials.identifier },
            ],
          });
          if (!user) {
            throw new Error('No user found with this email');
          }
          if (!user.isVerified) {
            throw new Error('Please verify your account before logging in');
          }
          const isPasswordCorrect = await bcrypt.compare(
            credentials.password,
            user.password
          );
          if (isPasswordCorrect) {
            return user;
          } else {
            throw new Error('Incorrect password');
          }
        } catch (err: any) {
          throw new Error(err);
        }
      },
    }),
  ],
  //read document return base url always 
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        //error for._id as auth doesn't know about user therefore go to types and inside make file to define new data types/modeify existing 
        token._id = user._id?.toString(); // Convert ObjectId to string
        token.isVerified = user.isVerified;
        token.isAcceptingMessages = user.isAcceptingMessages;
        token.username = user.username;
      }
      return token;
    },
    //since nextAuth is more session based strategy we modify it too 
    async session({ session, token }) {
      if (token) {
        session.user._id = token._id;
        session.user.isVerified = token.isVerified;
        session.user.isAcceptingMessages = token.isAcceptingMessages;
        session.user.username = token.username;
      }
      return session;
    },
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    //signin overwrite designed by nextAuth in only one route 
    signIn: '/sign-in',
  },
};