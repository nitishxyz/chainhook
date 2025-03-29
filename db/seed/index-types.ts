import { db } from "../index";
import { indexTypes } from "../schema/index-types";

const mainIndexTypes = [
  {
    id: "NFT_MINT",
    name: "NFT Mint",
    description:
      "Track NFT mints from Candy Machine, Magic Eden, Metaplex, and other platforms",
  },
  {
    id: "NFT_BID",
    name: "NFT Bid",
    description:
      "Track NFT bids from Magic Eden, Solanart, Metaplex, and other marketplaces",
  },
  {
    id: "NFT_SALE",
    name: "NFT Sale",
    description:
      "Track NFT sales from Magic Eden, Solanart, Metaplex, and other marketplaces",
  },
  {
    id: "NFT_LISTING",
    name: "NFT Listing",
    description:
      "Track NFT listings from Magic Eden, Solanart, Metaplex, and other marketplaces",
  },
  {
    id: "TOKEN_MINT",
    name: "Token Mint",
    description:
      "Track token mints from Candy Machine, Atadia, and other platforms",
  },
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
