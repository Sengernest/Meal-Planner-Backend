import db from "../db/db";
import { User, UserInsert, usersTable } from "../db/schema";

async function createUser(user: UserInsert) {
  return await db.insert(usersTable).values(user);
}

async function getUsers(): Promise<User[]> {
  return await db.select().from(usersTable);
}
