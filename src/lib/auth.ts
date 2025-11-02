// src/lib/auth.ts
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { dbConnection } from "./db";
import { env } from "./env";

let authInstance: ReturnType<typeof betterAuth> | null = null;

export async function getAuth() {
  if (authInstance) return authInstance;

  const mongooseConn = await dbConnection();
  const nativeDb = mongooseConn.db!;

  authInstance = betterAuth({
    database: mongodbAdapter(nativeDb),
    socialProviders: {
      github: {
        clientId: env.GITHUB_CLIENT_ID,
        clientSecret: env.GITHUB_CLIENT_SECRET,
      },
      google: {
        clientId: env.GOOGLE_CLIENT_ID,
        clientSecret: env.GOOGLE_CLIENT_SECRET,
      },
    },
  });

  return authInstance;
}


export const auth = await getAuth();
