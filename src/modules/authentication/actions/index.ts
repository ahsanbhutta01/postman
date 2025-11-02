"use server";

import { auth } from "@/lib/auth";
import { dbConnection } from "@/lib/db";
import { headers } from "next/headers";
import { ObjectId } from "mongodb";

export async function currentUser() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return null;
    }
    const db = (await dbConnection()).db;
    const User = db?.collection("user");

    const user = await User?.findOne({ _id: new ObjectId(session?.user?.id) });
    
    if (!user) {
      return null;
    }

    // Serialize the user data for Client Components
    return {
      _id: user._id.toString(),
      email: user.email || null,
      name: user.name || null,
      image: user.image || null,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt ,
    };
  } catch (error) {
    console.error("Error fetching current user", error);
    return null;
  }
}