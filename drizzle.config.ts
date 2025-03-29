import { Resource } from "sst";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: ["./db/schema"],
  dbCredentials: {
    host: Resource.ChainhookDatabase.host,
    port: Resource.ChainhookDatabase.port,
    user: Resource.ChainhookDatabase.username,
    password: Resource.ChainhookDatabase.password,
    database: Resource.ChainhookDatabase.database,
    ssl: false,
  },
});
