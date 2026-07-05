import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { letters } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { content, writtenDate, author } = body;

    if (!content || !writtenDate || !author) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const updated = await db
      .update(letters)
      .set({
        content,
        writtenDate: new Date(writtenDate).toISOString().split("T")[0],
        author,
        updatedAt: new Date(),
      })
      .where(eq(letters.id, Number(id)))
      .returning();

    if (updated.length === 0) {
      return NextResponse.json({ error: "Letter not found" }, { status: 404 });
    }

    return NextResponse.json(updated[0]);
  } catch (error) {
    console.error("Error updating letter:", error);
    return NextResponse.json({ error: "Failed to update letter" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const deleted = await db
      .delete(letters)
      .where(eq(letters.id, Number(id)))
      .returning();

    if (deleted.length === 0) {
      return NextResponse.json({ error: "Letter not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting letter:", error);
    return NextResponse.json({ error: "Failed to delete letter" }, { status: 500 });
  }
}