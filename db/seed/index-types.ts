import { db } from "../index";
import { indexTypes } from "../schema/index-types";

const mainIndexTypes = [
  {
    id: "TRANSFER",
    name: "Transfer",
    description:
      "Track transfers from Phantom, System Program, and other sources",
  },
  {
    id: "SWAP",
    name: "Swap",
    description: "Track swaps from Jupiter, Raydium, and other DEXes",
  },
];

export async function seedIndexTypes() {
  console.log("Seeding index types...");

  for (const type of mainIndexTypes) {
    await db.insert(indexTypes).values(type).onConflictDoNothing();
  }

  console.log("Index types seeded successfully");
}
