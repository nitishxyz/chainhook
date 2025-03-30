import { NextResponse } from "next/server";
import { auth } from "../../../../actions";
import { db } from "../../../../../db";
import { indexSubscriptions } from "../../../../../drizzle/schema";
import { eq, and } from "drizzle-orm";
import { NextRequest } from "next/server";
import { Helius } from "helius-sdk";
import { Resource } from "sst";

const webhookId = Resource.HeliusWebhookId.value;
const helius = new Helius(Resource.HeliusApiKey.value);

type Params = Promise<{ id: string }>;

export async function POST(
  request: NextRequest,
  { params }: { params: Params }
) {
  try {
    const subject = await auth();
    if (!subject) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const { addresses } = await request.json();

    if (!Array.isArray(addresses)) {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      );
    }

    // Validate subscription exists and belongs to user
    const subscription = await db.query.indexSubscriptions.findFirst({
      where: and(
        eq(indexSubscriptions.id, id),
        eq(indexSubscriptions.userId, subject.properties.id)
      ),
    });

    if (!subscription) {
      return NextResponse.json(
        { error: "Subscription not found" },
        { status: 404 }
      );
    }

    // Append new addresses to Helius webhook
    await helius.appendAddressesToWebhook(webhookId, addresses);

    // Update subscription with new addresses
    const updatedSubscription = await db
      .update(indexSubscriptions)
      .set({
        addresses: [...subscription.addresses, ...addresses],
        updatedAt: new Date().toISOString(),
      })
      .where(
        and(
          eq(indexSubscriptions.id, id),
          eq(indexSubscriptions.userId, subject.properties.id)
        )
      )
      .returning();

    return NextResponse.json(updatedSubscription[0]);
  } catch (error) {
    console.error("Error updating subscription addresses:", error);
    return NextResponse.json(
      { error: "Failed to update subscription addresses" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Params }
) {
  try {
    const subject = await auth();
    if (!subject) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const { addresses } = await request.json();

    if (!Array.isArray(addresses)) {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      );
    }

    // Validate subscription exists and belongs to user
    const subscription = await db.query.indexSubscriptions.findFirst({
      where: and(
        eq(indexSubscriptions.id, id),
        eq(indexSubscriptions.userId, subject.properties.id)
      ),
    });

    if (!subscription) {
      return NextResponse.json(
        { error: "Subscription not found" },
        { status: 404 }
      );
    }

    // Remove addresses from Helius webhook
    await helius.removeAddressesFromWebhook(webhookId, addresses);

    // Update subscription by removing addresses
    const updatedAddresses = subscription.addresses.filter(
      (addr: string) => !addresses.includes(addr)
    );

    const updatedSubscription = await db
      .update(indexSubscriptions)
      .set({
        addresses: updatedAddresses,
        updatedAt: new Date().toISOString(),
      })
      .where(
        and(
          eq(indexSubscriptions.id, id),
          eq(indexSubscriptions.userId, subject.properties.id)
        )
      )
      .returning();

    return NextResponse.json(updatedSubscription[0]);
  } catch (error) {
    console.error("Error removing subscription addresses:", error);
    return NextResponse.json(
      { error: "Failed to remove subscription addresses" },
      { status: 500 }
    );
  }
}
