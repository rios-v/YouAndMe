import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { letters } from "@/lib/db/schema";
import { asc } from "drizzle-orm";

export async function GET() {
  try {
    const items = await db.select().from(letters).orderBy(asc(letters.writtenDate));
    return NextResponse.json(items);
  } catch (error) {
    console.error("Error fetching letters:", error);
    return NextResponse.json({ error: "Failed to fetch letters" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { content, writtenDate, author } = body;

    if (!content || !writtenDate || !author) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const newLetter = await db.insert(letters).values({
      content,
      writtenDate: new Date(writtenDate).toISOString().split('T')[0],
      author,
    }).returning();

    return NextResponse.json(newLetter[0]);
  } catch (error) {
    console.error("Error creating letter:", error);
    return NextResponse.json({ error: "Failed to create letter" }, { status: 500 });
  }
}
