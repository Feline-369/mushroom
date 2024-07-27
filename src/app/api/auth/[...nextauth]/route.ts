import NextAuth from "next-auth/next";
import { AuthOptions } from "next-auth";
import { authOptions } from "./options";

//options file is separated since we will need to change in AuthOptions then we can just go to to the options file and e.g. Github credentials ,etc

const handler = NextAuth(authOptions)

//these files only use these verbs like GET, POST , etc.
export { handler as GET, handler as POST}
