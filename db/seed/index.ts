import { seedIndexTypes } from "./index-types";
import { seedSchemaTemplates } from "./schema-templates";

async function main() {
  try {
    await seedIndexTypes();
    await seedSchemaTemplates();
    console.log("All seeding completed successfully");
  } catch (error) {
    console.error("Error during seeding:", error);
    process.exit(1);
  }
}

main();
