import db from "./db"
import { UserInsert, usersTable } from "./schema"

const sampleUsers: UserInsert[] = [
  {
    name: "David Laid",
    email: "davidlaid@gymshark.com",
  }
]

export async function seedDb() {
  await db.insert(usersTable).values(sampleUsers)
}

seedDb()
