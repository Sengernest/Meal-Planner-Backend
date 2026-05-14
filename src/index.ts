import app from "./server";
import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";

// Database
const db = drizzle(process.env.DATABASE_URL!);

// Express server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
