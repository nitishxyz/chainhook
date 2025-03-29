import { NextResponse } from "next/server";
import { auth } from "../../../actions";
import { db } from "../../../../db";
import { indexSubscriptions } from "../../../../drizzle/schema";
import { eq, and } from "drizzle-orm";
import { NextRequest } from "next/server";

type Params = Promise<{ id: string }>;

export async function GET(
  request: NextRequest,
  { params }: { params: Params }
) {
  try {
    const subject = await auth();
    if (!subject) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const subscription = await db.query.indexSubscriptions.findFirst({
      where: and(
        eq(indexSubscriptions.id, id),
        eq(indexSubscriptions.userId, subject.properties.id)
      ),
      with: {
        connection: true,
        indexType: true,
      },
    });

    if (!subscription) {
      return NextResponse.json(
        { error: "Subscription not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(subscription);
  } catch (error) {
    console.error("Error fetching subscription:", error);
    return NextResponse.json(
      { error: "Failed to fetch subscription" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Params }
) {
  try {
    const subject = await auth();
    if (!subject) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { status, addresses, filterCriteria } = body;

    // Validate subscription exists and belongs to user
    const existingSubscription = await db.query.indexSubscriptions.findFirst({
      where: and(
        eq(indexSubscriptions.id, id),
        eq(indexSubscriptions.userId, subject.properties.id)
      ),
    });

    if (!existingSubscription) {
      return NextResponse.json(
        { error: "Subscription not found" },
        { status: 404 }
      );
    }

    // Update subscription
    const subscription = await db
      .update(indexSubscriptions)
      .set({
        status: status || existingSubscription.status,
        addresses: addresses || existingSubscription.addresses,
        filterCriteria: filterCriteria || existingSubscription.filterCriteria,
        updatedAt: new Date().toISOString(),
      })
      .where(
        and(
          eq(indexSubscriptions.id, id),
          eq(indexSubscriptions.userId, subject.properties.id)
        )
      )
      .returning();

    return NextResponse.json(subscription[0]);
  } catch (error) {
    console.error("Error updating subscription:", error);
    return NextResponse.json(
      { error: "Failed to update subscription" },
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

    // Delete subscription
    await db
      .delete(indexSubscriptions)
      .where(
        and(
          eq(indexSubscriptions.id, id),
          eq(indexSubscriptions.userId, subject.properties.id)
        )
      );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting subscription:", error);
    return NextResponse.json(
      { error: "Failed to delete subscription" },
      { status: 500 }
    );
  }
}
