import { eq } from "drizzle-orm";
import db from "../db/db";
import { usersTable } from "../db/schema";
import { UserInput, User } from "../types";

async function createUser(user: UserInput): Promise<User> {
  const [newUser] = await db.insert(usersTable).values(user).returning();
  return newUser;
}

async function getUsers(): Promise<User[]> {
  return await db.select().from(usersTable);
}

async function getUser(userId: number): Promise<User> {
  return (
    await db.select().from(usersTable).where(eq(usersTable.id, userId))
  )[0];
}

async function getUserByEmail(email: string): Promise<User | null> {
  const user = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, email));
  return user.length > 0 ? user[0] : null;
}

async function deleteUser(userId: number) {
  await db.delete(usersTable).where(eq(usersTable.id, userId));
}

export const usersRepository = {
  createUser,
  getUsers,
  getUser,
  getUserByEmail,
  deleteUser
};
