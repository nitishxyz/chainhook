import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { Resource } from "sst";
import * as schema from "../drizzle/schema";

const pool = new Pool({
  host: Resource.ChainhookDatabase.host,
  port: Resource.ChainhookDatabase.port,
  user: Resource.ChainhookDatabase.username,
  password: Resource.ChainhookDatabase.password,
  database: Resource.ChainhookDatabase.database,
  ssl: false,
});

export const db = drizzle(pool, { schema });
