import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { timelineItems } from "@/lib/db/schema";
import { asc } from "drizzle-orm";

export async function GET() {
  try {
    const items = await db.select().from(timelineItems).orderBy(asc(timelineItems.eventDate));
    return NextResponse.json(items);
  } catch (error) {
    console.error("Error fetching timeline items:", error);
    return NextResponse.json({ error: "Failed to fetch timeline items" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { photoUrl, description, eventDate, author } = body;

    if (!description || !eventDate || !author) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const newItem = await db.insert(timelineItems).values({
      photoUrl,
      description,
      eventDate: new Date(eventDate).toISOString().split('T')[0],
      author,
    }).returning();

    return NextResponse.json(newItem[0]);
  } catch (error) {
    console.error("Error creating timeline item:", error);
    return NextResponse.json({ error: "Failed to create timeline item" }, { status: 500 });
  }
}
