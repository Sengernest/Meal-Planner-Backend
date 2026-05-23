import db from "./db"
import { usersTable } from "./schema"

const sampleUsers = [
  {
    name: "David Laid",
    email: "davidlaid@gymshark.com",
  }
]

export async function seedDb() {
  await db.insert(usersTable).values(sampleUsers)
}

seedDb()
