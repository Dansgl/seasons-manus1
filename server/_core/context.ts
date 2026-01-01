import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import type { User } from "../../drizzle/schema";
import { getAuthUser } from "./supabase";
import * as db from "../db";

export type TrpcContext = {
  req: CreateExpressContextOptions["req"];
  res: CreateExpressContextOptions["res"];
  user: User | null;
};

export async function createContext(opts: CreateExpressContextOptions): Promise<TrpcContext> {
  let user: User | null = null;

  try {
    // Get the Supabase auth user from the request
    const authUser = await getAuthUser(opts.req);

    if (authUser) {
      // Try to get user from our database
      let dbUser = await db.getUserByAuthId(authUser.id);

      // If user doesn't exist in our DB, create them
      if (!dbUser) {
        await db.upsertUser({
          authId: authUser.id,
          email: authUser.email ?? null,
          name: authUser.user_metadata?.full_name ?? authUser.user_metadata?.name ?? null,
          avatarUrl: authUser.user_metadata?.avatar_url ?? null,
          lastSignedIn: new Date(),
        });
        dbUser = await db.getUserByAuthId(authUser.id);
      } else {
        // Update last signed in
        await db.upsertUser({
          authId: authUser.id,
          lastSignedIn: new Date(),
        });
      }

      user = dbUser ?? null;
    }
  } catch (error) {
    // Authentication is optional for public procedures.
    console.error("[Auth] Error during authentication:", error);
    user = null;
  }

  return {
    req: opts.req,
    res: opts.res,
    user,
  };
}
