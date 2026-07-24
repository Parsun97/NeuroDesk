import { defineConfig } from "drizzle-kit";
import path from "path";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL, ensure the database is provisioned");
}

// drizzle-kit resolves this path via glob matching internally, which requires
// forward slashes. path.join() produces backslashes on Windows, silently
// breaking schema discovery there even though the file exists on disk.
const schemaPath = path
  .join(__dirname, "./src/schema/index.ts")
  .split(path.sep)
  .join("/");

export default defineConfig({
  schema: schemaPath,
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
});
