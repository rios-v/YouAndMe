import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { timelineItems } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { description, eventDate, photoUrl } = body;

    if (!description || !eventDate) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const updateData: Record<string, unknown> = {
      description,
      eventDate: new Date(eventDate).toISOString().split("T")[0],
    };

    if (photoUrl) {
      updateData.photoUrl = photoUrl;
    }

    const updated = await db
      .update(timelineItems)
      .set(updateData)
      .where(eq(timelineItems.id, Number(id)))
      .returning();

    if (updated.length === 0) {
      return NextResponse.json({ error: "Timeline item not found" }, { status: 404 });
    }

    return NextResponse.json(updated[0]);
  } catch (error) {
    console.error("Error updating timeline item:", error);
    return NextResponse.json({ error: "Failed to update timeline item" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const deleted = await db
      .delete(timelineItems)
      .where(eq(timelineItems.id, Number(id)))
      .returning();

    if (deleted.length === 0) {
      return NextResponse.json({ error: "Timeline item not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting timeline item:", error);
    return NextResponse.json({ error: "Failed to delete timeline item" }, { status: 500 });
  }
}